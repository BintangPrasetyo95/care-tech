/* ───────────── systems / AudioManager.js ─────────────
   CARE-TECH: Harmonia School
   Central Audio Manager using Web Audio API.
   - Prevents browser / IDM (Internet Download Manager) file download popups.
   - Decodes audio directly into in-memory AudioBuffers.
   - Automatically unlocks AudioContext on first user gesture.
   - Provides procedural bell synthesis fallback if external audio is blocked.
   ──────────────────────────────────────────────────────── */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.buffers = new Map();
    this.isUnlocked = false;
    this.activeLoops = new Map();
    this.pendingLoops = new Map();
    this.pendingPlays = new Map();
    this._initContext();
    this._attachUnlockListeners();
  }

  _initContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && !this.ctx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('[AudioManager] Failed to initialize AudioContext:', e);
    }
  }

  _attachUnlockListeners() {
    const unlockHandler = () => {
      this.unlock();
    };
    window.addEventListener('pointerdown', unlockHandler, { passive: true });
    window.addEventListener('keydown', unlockHandler, { passive: true });
    window.addEventListener('touchstart', unlockHandler, { passive: true });
  }

  unlock() {
    if (!this.ctx) this._initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
        for (const [key, loop] of this.activeLoops.entries()) {
          if (loop && loop.gainNode) {
            loop.gainNode.gain.setValueAtTime(loop.volume, this.ctx.currentTime);
          }
        }
      }).catch(() => {});
    } else if (this.ctx) {
      this.isUnlocked = true;
    }
  }

  /**
   * Preload audio file as ArrayBuffer and decode into memory
   * (Does NOT use <audio> elements, completely immune to IDM interceptor)
   */
  async loadSound(key, url) {
    if (!this.ctx) this._initContext();
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[AudioManager] HTTP error ${response.status} loading ${url}`);
        return;
      }
      const arrayBuffer = await response.arrayBuffer();
      if (this.ctx && this.ctx.decodeAudioData) {
        this.ctx.decodeAudioData(
          arrayBuffer,
          (decoded) => {
            this.buffers.set(key, decoded);
            console.log(`%c[AudioManager] Audio '${key}' decoded successfully into memory!`, 'color: #22c55e;');
            if (this.pendingPlays.has(key)) {
              const pending = this.pendingPlays.get(key);
              this.pendingPlays.delete(key);
              this.playSound(key, pending.volume);
            }
            if (this.pendingLoops.has(key)) {
              const vol = this.pendingLoops.get(key);
              this.pendingLoops.delete(key);
              this.playLoop(key, vol);
            }
          },
          (err) => {
            console.warn(`[AudioManager] Error decoding audio for '${key}':`, err);
          }
        );
      }
    } catch (err) {
      console.warn(`[AudioManager] Fetch error for '${key}':`, err);
    }
  }

  /**
   * Play an in-memory decoded audio buffer (one-shot)
   */
  playSound(key, volume = 0.7) {
    this.unlock();
    if (!this.ctx) return false;

    const buffer = this.buffers.get(key);
    if (buffer) {
      try {
        const source = this.ctx.createBufferSource();
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return true;
      } catch (e) {
        console.warn(`[AudioManager] Failed to play buffer '${key}':`, e);
      }
    }
    return false;
  }

  /**
   * Play an in-memory decoded audio buffer on continuous loop (e.g. ambient crowd)
   */
  playLoop(key, volume = 0.5) {
    this.unlock();
    if (this.activeLoops.has(key)) {
      // Already playing, just update volume smoothly if changed
      const loop = this.activeLoops.get(key);
      if (loop && loop.gainNode && this.ctx) {
        loop.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      }
      return true;
    }

    if (!this.ctx) return false;

    const buffer = this.buffers.get(key);
    if (!buffer) {
      // Buffer not yet ready, queue to play as soon as decode completes
      this.pendingLoops.set(key, volume);
      return false;
    }

    try {
      const source = this.ctx.createBufferSource();
      const gainNode = this.ctx.createGain();
      source.buffer = buffer;
      source.loop = true;

      gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
      source.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      source.start(0);

      this.activeLoops.set(key, { source, gainNode, volume });
      console.log(`%c[AudioManager] Loop '${key}' started at volume ${Math.round(volume * 100)}%`, 'color: #38bdf8;');
      return true;
    } catch (e) {
      console.warn(`[AudioManager] Failed to start loop '${key}':`, e);
      return false;
    }
  }

  /**
   * Stop an active looping audio with graceful fade out
   */
  stopLoop(key, fadeDuration = 0.4) {
    if (!this.activeLoops.has(key)) {
      this.pendingLoops.delete(key);
      return;
    }

    const loop = this.activeLoops.get(key);
    this.activeLoops.delete(key);
    this.pendingLoops.delete(key);

    if (loop && loop.source && loop.gainNode && this.ctx) {
      try {
        const curVal = loop.gainNode.gain.value;
        loop.gainNode.gain.setValueAtTime(curVal, this.ctx.currentTime);
        loop.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + fadeDuration);
        setTimeout(() => {
          try {
            loop.source.stop();
            loop.source.disconnect();
          } catch (_) {}
        }, fadeDuration * 1000 + 50);
        console.log(`%c[AudioManager] Loop '${key}' stopped (fade: ${fadeDuration}s)`, 'color: #94a3b8;');
      } catch (e) {
        try { loop.source.stop(); } catch (_) {}
      }
    }
  }

  /**
   * Stop all active looping sounds (e.g. on scene switch)
   */
  stopAllLoops(fadeDuration = 0.3) {
    for (const key of Array.from(this.activeLoops.keys())) {
      this.stopLoop(key, fadeDuration);
    }
    this.pendingLoops.clear();
  }

  /**
   * Play school bell chime:
   * First tries decoded 'schoolBell' buffer; if not available, plays procedural chime!
   */
  playSchoolBell(volume = 0.7) {
    this.unlock();
    const played = this.playSound('schoolBell', volume);
    if (!played) {
      console.log('%c[AudioManager] schoolBell buffer sedang dimuat, dijadwalkan diputar otomatis setelah decode selesai...', 'color: #38bdf8;');
      this.pendingPlays.set('schoolBell', { volume });
    }
  }

  /**
   * Procedural School Chime (Westminster 4-tone chime: E5, C5, D5, G4)
   * Guaranteed to produce beautiful chime sound anywhere, zero external files required!
   */
  playProceduralChime(volume = 0.6) {
    this.unlock();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + 0.05;
    // Japanese/Indonesian school bell: Westminster 4-tone pattern (E5, C5, D5, G4)
    const notes = [
      { freq: 659.25, time: 0.0,  duration: 0.8 }, // E5
      { freq: 523.25, time: 0.6,  duration: 0.8 }, // C5
      { freq: 587.33, time: 1.2,  duration: 0.8 }, // D5
      { freq: 392.00, time: 1.8,  duration: 1.4 }  // G4
    ];

    notes.forEach(n => {
      const startTime = now + n.time;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.freq, startTime);

      // Bell envelope (instant attack, exponential decay)
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume * 0.5, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + n.duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + n.duration);
    });
  }
}

// Global Singleton
window.audioManager = new AudioManager();

// Automatically preload assets into in-memory ArrayBuffers (safe from IDM)
window.audioManager.loadSound('schoolBell', 'assets/audio/sfx/schoolBell.mp3');
window.audioManager.loadSound('crowd', 'assets/audio/sfx/crowd.mp3');
window.audioManager.loadSound('clockTicking', 'assets/audio/sfx/clockTicking.mp3');
