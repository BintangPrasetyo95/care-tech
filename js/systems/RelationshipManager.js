/* ───────────── systems / RelationshipManager.js ─────────────
   Tracks NPC relationships / flags that affect dialogue
   availability and endings.
   ──────────────────────────────────────────────────────── */

class RelationshipManager {
  constructor(registry) {
    this.registry = registry;
    this.flags = {};      // e.g. { 'nabula_comforted': true }
  }

  setFlag(key, value = true) { this.flags[key] = value; }
  getFlag(key)               { return !!this.flags[key]; }
  clearFlag(key)             { delete this.flags[key]; }

  /** Get all set flags as an array of keys */
  getAllFlags() { return Object.keys(this.flags).filter(k => this.flags[k]); }

  /** Convenience: bump harmony via registry */
  addHarmony(delta) {
    const cur = this.registry.get('harmony');
    this.registry.set('harmony', Phaser.Math.Clamp(cur + delta, 0, 100));
  }

  /** Get current harmony */
  getHarmony() {
    return this.registry.get('harmony');
  }
}
