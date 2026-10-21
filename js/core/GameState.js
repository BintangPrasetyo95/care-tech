/* ───────────── core / GameState.js ─────────────
   CARE-TECH: Harmonia School
   Central Reactive Game State Manager (Single Source of Truth).
   
   Manages story flags, Harmony Index, quest progression,
   and synchronizes seamlessly with Phaser's game.registry.
   ──────────────────────────────────────────────────────── */

class GameStateManager {
  constructor() {
    this.flags = {};
    this.harmony = 50;
    this.currentLevel = 1;
    this.activeQuest = null;
    this.inventory = [];
    this._listeners = {};
    this._registry = null;
  }

  /**
   * Bind to Phaser's game.registry for automatic two-way synchronization
   * @param {Phaser.Data.DataManager} registry
   */
  bindRegistry(registry) {
    this._registry = registry;
    if (!registry) return;

    // Initial sync from registry defaults if already present
    const regHarmony = registry.get('harmony');
    if (typeof regHarmony === 'number') this.harmony = regHarmony;

    // Listen to changes originating from Phaser registry
    registry.events.on('changedata', (parent, key, value) => {
      if (key === 'harmony') {
        this.harmony = value;
        this.emit('harmony:changed', value);
      } else if (key === 'debugMode' || key.startsWith('flag_') || key.startsWith('level')) {
        this.flags[key] = value;
        this.emit('flag:changed', { key, value });
      }
    });
  }

  /**
   * Set a story/gameplay flag
   * @param {string} key
   * @param {any} value
   */
  setFlag(key, value = true) {
    this.flags[key] = value;
    if (this._registry) {
      this._registry.set(key, value);
    }
    this.emit('flag:changed', { key, value });
    this.emit(`flag:${key}`, value);
  }

  /**
   * Get a flag value
   * @param {string} key
   * @param {any} defaultVal
   * @returns {any}
   */
  getFlag(key, defaultVal = false) {
    if (key in this.flags) return this.flags[key];
    if (this._registry && this._registry.has(key)) {
      const val = this._registry.get(key);
      this.flags[key] = val;
      return val;
    }
    return defaultVal;
  }

  /**
   * Check if a flag is truthy
   * @param {string} key
   * @returns {boolean}
   */
  hasFlag(key) {
    return !!this.getFlag(key, false);
  }

  /**
   * Get current Harmony Index (0 - 100)
   * @returns {number}
   */
  getHarmony() {
    return this.harmony;
  }

  /**
   * Set Harmony Index directly
   * @param {number} value
   */
  setHarmony(value) {
    const clamped = Math.max(0, Math.min(100, Math.round(value)));
    this.harmony = clamped;
    if (this._registry) {
      this._registry.set('harmony', clamped);
    }
    this.emit('harmony:changed', clamped);
    return clamped;
  }

  /**
   * Modify Harmony Index by delta (+25, -10, etc.)
   * @param {number} delta
   * @returns {number} new harmony score
   */
  modHarmony(delta) {
    return this.setHarmony(this.harmony + delta);
  }

  /**
   * Set active quest data
   * @param {object|string|null} quest
   */
  setActiveQuest(quest) {
    this.activeQuest = quest;
    if (this._registry) {
      this._registry.set('activeQuest', quest);
      this._registry.set('level1_quest_active', typeof quest === 'string' ? quest : (quest?.id || null));
    }
    this.emit('quest:changed', quest);
  }

  /**
   * Simple event listener subscription
   */
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this._listeners[event]) return;
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
  }

  emit(event, ...args) {
    if (!this._listeners[event]) return;
    this._listeners[event].forEach(cb => {
      try { cb(...args); } catch (e) { console.error(`[GameState] Error in event '${event}':`, e); }
    });
  }

  /**
   * Save state to localStorage
   */
  save() {
    try {
      const data = {
        flags: this.flags,
        harmony: this.harmony,
        currentLevel: this.currentLevel,
        inventory: this.inventory
      };
      localStorage.setItem('caretech_game_state', JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn('[GameState] Could not save state:', e);
      return false;
    }
  }

  /**
   * Load state from localStorage
   */
  load() {
    try {
      const saved = localStorage.getItem('caretech_game_state');
      if (!saved) return false;
      const data = JSON.parse(saved);
      if (data.flags) this.flags = { ...this.flags, ...data.flags };
      if (typeof data.harmony === 'number') this.setHarmony(data.harmony);
      if (typeof data.currentLevel === 'number') this.currentLevel = data.currentLevel;
      if (Array.isArray(data.inventory)) this.inventory = data.inventory;
      return true;
    } catch (e) {
      console.warn('[GameState] Could not load state:', e);
      return false;
    }
  }

  /**
   * Reset state for level replay
   */
  resetLevel(levelNum = 1) {
    this.harmony = 50;
    this.activeQuest = null;
    // Clear level-specific flags
    const prefix = `level${levelNum}_`;
    Object.keys(this.flags).forEach(k => {
      if (k.startsWith(prefix) || k.startsWith(`L${levelNum}_`)) {
        delete this.flags[k];
      }
    });
    if (this._registry) {
      this._registry.set('harmony', 50);
      this._registry.set('dialogueActive', false);
      this._registry.set(`${prefix}player_locked`, false);
    }
    this.emit('state:reset', levelNum);
  }

  /**
   * Set or toggle debug mode via console controller
   * @param {boolean} [enable]
   */
  setDebug(enable) {
    if (typeof window.setDebugMode === 'function') {
      return window.setDebugMode(enable);
    }
    return false;
  }

  /** Debug dump to console */
  dump() {
    console.table({
      Harmony: this.harmony,
      Level: this.currentLevel,
      ActiveQuest: JSON.stringify(this.activeQuest),
      DebugMode: !!this.getFlag('debugMode', false)
    });
    console.log('[GameState Flags]:', this.flags);
  }
}

// Global singleton instance
window.GameState = new GameStateManager();
