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
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
      window.removeEventListener('touchstart', unlockHandler);
    };
    window.addEventListener('pointerdown', unlockHandler, { once: true, passive: true });
    window.addEventListener('keydown', unlockHandler, { once: true, passive: true });
    window.addEventListener('touchstart', unlockHandler, { once: true, passive: true });
  }

  unlock() {
    if (!this.ctx) this._initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
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
   * Play an in-memory decoded audio buffer
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
   * Play school bell chime:
   * First tries decoded 'schoolBell' buffer; if not available, plays procedural chime!
   */
  playSchoolBell(volume = 0.7) {
    this.unlock();
    const played = this.playSound('schoolBell', volume);
    if (!played) {
      console.log('%c[AudioManager] schoolBell belum siap / terhalang, memutar school chime prosedural...', 'color: #38bdf8;');
      this.playProceduralChime(volume);
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

// Automatically preload schoolBell into in-memory ArrayBuffer
window.audioManager.loadSound('schoolBell', 'assets/audio/sfx/schoolBell.mp3');
