/* ───────────── entities / NPC.js ─────────────
   Generic NPC class. Place one per character on the map.
   Supports dialogue, scheduled movement, and visual indicators.
   ─────────────────────────────────────────────── */

class NPC {
  /**
   * @param {Phaser.Scene}  scene
   * @param {number}  x           – spawn X (px)
   * @param {number}  y           – spawn Y (px)
   * @param {string}  key         – texture key (e.g. 'nakula')
   * @param {string}  dialogueId  – starting dialogue node key (or null)
   * @param {object}  [opts]      – { immovable, schedule, name }
   */
  constructor(scene, x, y, key, dialogueId, opts = {}) {
    this.scene      = scene;
    this.key        = key;
    this.dialogueId = dialogueId;
    this.name       = opts.name || key;

    /* --- sprite --- */
    this.sprite = scene.physics.add.sprite(x, y, key, 0)
      .setImmovable(opts.immovable !== false)
      .setDepth(4);

    /* --- schedule support --- */
    this.schedule = opts.schedule || null;

    /* --- interaction indicator (small dot above NPC) --- */
    if (dialogueId) {
      this.indicator = scene.add.circle(x, y - 20, 4, 0xfacc15)
        .setDepth(10)
        .setAlpha(0);

      // Gentle pulse animation
      scene.tweens.add({
        targets: this.indicator,
        alpha: { from: 0.3, to: 1 },
        yoyo: true,
        repeat: -1,
        duration: 800,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /* Called every frame by WorldScene.update() */
  update() {
    // Update indicator position to follow NPC
    if (this.indicator) {
      this.indicator.setPosition(this.sprite.x, this.sprite.y - 20);
    }
  }

  /** Show or hide the interaction indicator based on player proximity */
  setIndicatorVisible(visible) {
    if (this.indicator) {
      this.indicator.setVisible(visible);
    }
  }
}
