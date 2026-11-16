/**
 * CareTech Robot ESA - Scenario Engine
 * Mengelola state machine interaksi terstruktur, pencocokan kata kunci,
 * pre-caching audio ElevenLabs lokal, dan koordinasi aksi fisik (FSR/Touch/Screen).
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ScenarioEngine = factory();
        root.scenarioEngine = new root.ScenarioEngine();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    const ScenarioStates = {
        IDLE: 'IDLE',
        STAGE1_ACTIVE: 'STAGE1_ACTIVE',
        WAITING_ACTION: 'WAITING_ACTION',
        STAGE2_ACTIVE: 'STAGE2_ACTIVE',
        COMPLETED: 'COMPLETED',
        TIMEOUT: 'TIMEOUT',
        CANCELLED: 'CANCELLED'
    };

    class ScenarioEngine {
        constructor() {
            this.states = ScenarioStates;
            this.currentState = ScenarioStates.IDLE;
            this.activeScenario = null;
            this.currentAudioEl = null;

            // Timer & countdown handlers
            this.actionTimer = null;
            this.countdownInterval = null;
            this.remainingSeconds = 0;

            // Cache audio di memori agar zero latency
            // Key: audioUrl -> { audioBuffer, pcm8, objectUrl, blob }
            this.audioCache = new Map();
            this.audioContext = null;

            // Event listener map
            this.listeners = {
                stateChange: [],
                countdownTick: [],
                stage1Start: [],
                stage2Start: [],
                timeout: [],
                complete: [],
                cancel: []
            };

            // Pre-warm audio engine saat idle di browser
            if (typeof window !== 'undefined') {
                window.addEventListener('DOMContentLoaded', () => {
                    this.initAudioContext();
                    this.preloadAllScenarios();
                });
            }
        }

        /**
         * Inisialisasi AudioContext Web Audio API untuk decode PCM.
         */
        initAudioContext() {
            if (this.audioContext) return this.audioContext;
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
            return this.audioContext;
        }

        /**
         * Event listener registration
         */
        on(event, callback) {
            if (this.listeners[event]) {
                this.listeners[event].push(callback);
            }
            return this;
        }

        emit(event, data) {
            if (this.listeners[event]) {
                this.listeners[event].forEach(cb => {
                    try { cb(data); } catch (e) { console.warn(`[ScenarioEngine] Event ${event} error:`, e); }
                });
            }
        }

        setState(newState) {
            const oldState = this.currentState;
            this.currentState = newState;
            this.emit('stateChange', { oldState, newState, scenario: this.activeScenario });
        }

        /**
         * Mencari skenario yang cocok dari teks input pengguna.
         * @param {string} text 
         * @returns {object|null}
         */
        matchScenario(text) {
            if (typeof window !== 'undefined' && window.findMatchingScenario) {
                return window.findMatchingScenario(text);
            }
            if (typeof window !== 'undefined' && window.CARETECH_SCENARIOS) {
                const lower = (text || '').toLowerCase();
                for (const key in window.CARETECH_SCENARIOS) {
                    const sc = window.CARETECH_SCENARIOS[key];
                    if (sc.keywords && sc.keywords.some(k => lower.includes(k.toLowerCase()))) {
                        return sc;
                    }
                }
            }
            return null;
        }

        /**
         * Mengubah AudioBuffer menjadi PCM 8-bit 8000Hz mono untuk speaker ESP32 MAX98357A.
         */
        convertAudioBufferToPcm8(audioBuffer) {
            const targetRate = 8000;
            const channelData = audioBuffer.getChannelData(0);
            const ratio = audioBuffer.sampleRate / targetRate;
            const targetLength = Math.floor(channelData.length / ratio);
            const pcm8 = new Uint8Array(targetLength);

            for (let i = 0; i < targetLength; i++) {
                const srcIdx = Math.floor(i * ratio);
                let sample = channelData[srcIdx];
                if (sample > 1.0) sample = 1.0;
                if (sample < -1.0) sample = -1.0;
                pcm8[i] = Math.floor((sample + 1.0) * 127.5);
            }
            return pcm8;
        }

        /**
         * Mengunduh dan men-decode file audio ke memori (AudioBuffer + PCM 8kHz).
         * @param {string} audioUrl 
         */
        async preloadAudio(audioUrl) {
            if (!audioUrl) return null;
            if (this.audioCache.has(audioUrl)) {
                return this.audioCache.get(audioUrl);
            }

            try {
                const resp = await fetch(audioUrl);
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const arrayBuf = await resp.arrayBuffer();

                const audioCtx = this.initAudioContext();
                let audioBuffer = null;
                let pcm8 = null;

                if (audioCtx) {
                    try {
                        audioBuffer = await audioCtx.decodeAudioData(arrayBuf.slice(0));
                        pcm8 = this.convertAudioBufferToPcm8(audioBuffer);
                    } catch (decErr) {
                        console.warn(`[ScenarioEngine] Decode WebAudio gagal untuk ${audioUrl}:`, decErr);
                    }
                }

                const blob = new Blob([arrayBuf], { type: 'audio/mpeg' });
                const objectUrl = URL.createObjectURL(blob);

                const cacheEntry = {
                    audioUrl,
                    blob,
                    objectUrl,
                    audioBuffer,
                    pcm8
                };
                this.audioCache.set(audioUrl, cacheEntry);
                return cacheEntry;
            } catch (err) {
                console.warn(`[ScenarioEngine] Gagal memuat aset audio "${audioUrl}":`, err.message);
                return null;
            }
        }

        /**
         * Preload seluruh audio dari skenario yang terdaftar agar tidak ada jeda saat diputar.
         */
        async preloadAllScenarios() {
            const registry = (typeof window !== 'undefined' && window.CARETECH_SCENARIOS) ? window.CARETECH_SCENARIOS : {};
            const urls = new Set();
            for (const key in registry) {
                const sc = registry[key];
                if (sc.stage1?.audioUrl) urls.add(sc.stage1.audioUrl);
                if (sc.stage2_success?.audioUrl) urls.add(sc.stage2_success.audioUrl);
                if (sc.stage2_timeout?.audioUrl) urls.add(sc.stage2_timeout.audioUrl);
            }

            const promises = Array.from(urls).map(url => this.preloadAudio(url));
            await Promise.allSettled(promises);
            console.log(`[ScenarioEngine] Pre-loaded ${this.audioCache.size} berkas audio skenario ke memori.`);
        }

        /**
         * Memutar audio skenario instan (baik di laptop maupun speaker robot).
         * @param {string} audioUrl 
         * @param {Function} onComplete 
         */
        async playAudio(audioUrl, onComplete) {
            if (!audioUrl) {
                if (onComplete) onComplete();
                return;
            }

            // Hentikan pemutaran sebelumnya jika ada
            this.stopAudio();

            let cacheEntry = this.audioCache.get(audioUrl);
            if (!cacheEntry) {
                cacheEntry = await this.preloadAudio(audioUrl);
            }

            // Dekode on-demand jika PCM 8kHz belum terkomputasi (misal WebAudio baru diaktifkan oleh gesture)
            if (cacheEntry && !cacheEntry.pcm8 && cacheEntry.blob) {
                try {
                    const audioCtx = this.initAudioContext();
                    if (audioCtx && audioCtx.state === 'suspended') {
                        await audioCtx.resume();
                    }
                    if (audioCtx) {
                        const arrayBuf = await cacheEntry.blob.arrayBuffer();
                        cacheEntry.audioBuffer = await audioCtx.decodeAudioData(arrayBuf);
                        cacheEntry.pcm8 = this.convertAudioBufferToPcm8(cacheEntry.audioBuffer);
                    }
                } catch (decErr) {
                    console.warn("[ScenarioEngine] On-demand WebAudio decode:", decErr);
                }
            }

            const speakerMode = (typeof window !== 'undefined' && window.speakerOutputMode) ? window.speakerOutputMode : 'laptop';
            const espConnected = (typeof window !== 'undefined' && typeof window.isEspConnected === 'function') ? window.isEspConnected() : false;

            if (typeof window !== 'undefined') {
                window.isAiSpeaking = true;
            }

            let laptopDone = !(speakerMode === 'laptop' || speakerMode === 'both');
            let espDone = !(espConnected && cacheEntry?.pcm8 && (speakerMode === 'robot' || speakerMode === 'both'));

            const checkFinished = () => {
                if (laptopDone && espDone) {
                    if (typeof window !== 'undefined') {
                        window.isAiSpeaking = false;
                    }
                    if (onComplete) onComplete();
                }
            };

            // 1. Putar di Laptop via HTML5 Audio
            if (speakerMode === 'laptop' || speakerMode === 'both') {
                const src = cacheEntry?.objectUrl || audioUrl;
                this.currentAudioEl = new Audio(src);
                this.currentAudioEl.onended = () => {
                    this.currentAudioEl = null;
                    laptopDone = true;
                    checkFinished();
                };
                this.currentAudioEl.onerror = (e) => {
                    console.warn("[ScenarioEngine] HTML5 Audio error:", e);
                    this.currentAudioEl = null;
                    laptopDone = true;
                    checkFinished();
                };

                try {
                    await this.currentAudioEl.play();
                } catch (playErr) {
                    console.warn("[ScenarioEngine] Play error:", playErr);
                    laptopDone = true;
                    checkFinished();
                }
            }

            // 2. Stream ke Speaker MAX98357A ESP32 jika terhubung
            if (espConnected && cacheEntry?.pcm8 && (speakerMode === 'robot' || speakerMode === 'both')) {
                if (typeof window.streamPcmToEsp === 'function') {
                    window.streamPcmToEsp(cacheEntry.pcm8).then(() => {
                        espDone = true;
                        checkFinished();
                    }).catch(() => {
                        espDone = true;
                        checkFinished();
                    });
                } else {
                    espDone = true;
                    checkFinished();
                }
            } else {
                espDone = true;
                checkFinished();
            }
        }

        /**
         * Menghentikan audio yang sedang diputar.
         */
        stopAudio() {
            if (this.currentAudioEl) {
                try {
                    this.currentAudioEl.pause();
                    this.currentAudioEl.currentTime = 0;
                } catch (e) {}
                this.currentAudioEl = null;
            }
            if (typeof window !== 'undefined') {
                window.isAiSpeaking = false;
            }
        }

        /**
         * Membersihkan timer countdown dan timeout aksi.
         */
        clearTimers() {
            if (this.actionTimer) {
                clearTimeout(this.actionTimer);
                this.actionTimer = null;
            }
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
        }

        /**
         * Memulai eksekusi skenario (Tahap 1: Respon awal + tawarkan aksi).
         * @param {object} scenario Objek skenario dari registry.
         * @param {object} options Opsi callbacks/parameter.
         */
        async triggerScenario(scenario, options = {}) {
            if (!scenario) return;

            // Reset state sebelumnya jika sedang aktif
            this.cancelScenario();

            this.activeScenario = scenario;
            this.setState(ScenarioStates.STAGE1_ACTIVE);

            // Beritahu listener bahwa Tahap 1 dimulai
            this.emit('stage1Start', {
                scenario,
                stage1: scenario.stage1,
                action: scenario.action
            });

            // Aktifkan sensor fisik pada ESP32 jika fungsi tersedia
            if (typeof window !== 'undefined' && typeof window.setEspSensorsActive === 'function') {
                window.setEspSensorsActive(true);
            }
            if (typeof window !== 'undefined' && typeof window.sendEspAction === 'function') {
                window.sendEspAction(scenario.stage1?.robotMood || "happy");
            }

            // Putar audio Tahap 1 ElevenLabs secara instan
            const stage1Audio = scenario.stage1?.audioUrl;
            this.playAudio(stage1Audio, () => {
                // Audio tahap 1 selesai diputar
            });

            // Masuk ke status menunggu aksi dari siswa
            this.setState(ScenarioStates.WAITING_ACTION);

            // Setup timer & countdown interval
            const timeoutMs = scenario.action?.timeoutMs || 30000;
            this.remainingSeconds = Math.round(timeoutMs / 1000);

            this.countdownInterval = setInterval(() => {
                this.remainingSeconds--;
                this.emit('countdownTick', {
                    remaining: this.remainingSeconds,
                    total: Math.round(timeoutMs / 1000),
                    scenario: this.activeScenario
                });

                if (this.remainingSeconds <= 0) {
                    clearInterval(this.countdownInterval);
                    this.countdownInterval = null;
                }
            }, 1000);

            this.actionTimer = setTimeout(() => {
                this.handleTimeout();
            }, timeoutMs);
        }

        /**
         * Dipanggil ketika aksi fisik atau interaktif selesai (misal: pelukan ditahan >= 2 detik).
         * @param {string} actionType Tipe aksi yang dilakukan (misal: 'hug_or_hold')
         * @param {object} data Data aksi tambahan (misal: duration)
         * @returns {boolean} Apakah aksi berhasil diproses oleh engine
         */
        handleActionCompleted(actionType = 'hug_or_hold', data = {}) {
            if (this.currentState !== ScenarioStates.WAITING_ACTION || !this.activeScenario) {
                return false;
            }

            const requiredDuration = (this.activeScenario.action?.requiredDurationMs || 2000) / 1000;
            const duration = data.duration || 2.0;

            if (duration < requiredDuration) {
                console.log(`[ScenarioEngine] Aksi terdeteksi tapi belum mencapai durasi: ${duration}s < ${requiredDuration}s`);
                return false;
            }

            // Aksi sukses! Bersihkan timer
            this.clearTimers();
            this.setState(ScenarioStates.STAGE2_ACTIVE);

            const stage2Success = this.activeScenario.stage2_success;

            // Beritahu listener bahwa Tahap 2 Sukses dimulai
            this.emit('stage2Start', {
                scenario: this.activeScenario,
                stage2: stage2Success,
                actionData: data
            });

            if (typeof window !== 'undefined' && typeof window.sendEspAction === 'function') {
                window.sendEspAction(stage2Success?.robotMood || "comforted");
            }

            // Putar audio Tahap 2 ElevenLabs seketika tanpa jeda
            this.playAudio(stage2Success?.audioUrl, () => {
                this.setState(ScenarioStates.COMPLETED);
                this.emit('complete', { scenario: this.activeScenario, result: 'success' });
                this.activeScenario = null;
                this.setState(ScenarioStates.IDLE);
            });

            return true;
        }

        /**
         * Dipanggil jika batas waktu aksi habis tanpa respons siswa.
         */
        handleTimeout() {
            if (this.currentState !== ScenarioStates.WAITING_ACTION || !this.activeScenario) {
                return;
            }

            this.clearTimers();
            this.setState(ScenarioStates.TIMEOUT);

            const stage2Timeout = this.activeScenario.stage2_timeout;

            this.emit('timeout', {
                scenario: this.activeScenario,
                stage2: stage2Timeout
            });

            if (typeof window !== 'undefined' && typeof window.sendEspAction === 'function') {
                window.sendEspAction(stage2Timeout?.robotMood || "idle");
            }

            // Putar audio respon timeout dengan lembut
            this.playAudio(stage2Timeout?.audioUrl, () => {
                this.emit('complete', { scenario: this.activeScenario, result: 'timeout' });
                this.activeScenario = null;
                this.setState(ScenarioStates.IDLE);
            });
        }

        /**
         * Membatalkan skenario yang sedang berjalan.
         */
        cancelScenario() {
            if (this.currentState === ScenarioStates.IDLE) return;

            this.clearTimers();
            this.stopAudio();
            const prevScenario = this.activeScenario;
            this.activeScenario = null;
            this.setState(ScenarioStates.CANCELLED);
            this.emit('cancel', { scenario: prevScenario });
            this.setState(ScenarioStates.IDLE);
        }

        /**
         * Cek apakah engine sedang dalam proses interaksi skenario.
         */
        isActive() {
            return this.currentState !== ScenarioStates.IDLE;
        }

        isWaitingForAction() {
            return this.currentState === ScenarioStates.WAITING_ACTION;
        }
    }

    return ScenarioEngine;
}));
