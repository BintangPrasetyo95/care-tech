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

    /* --- floating emotion bubble --- */
    if (opts.emotion) {
      this.emotionBubble = scene.add.graphics();
      this.emotionBubble.fillStyle(0xffffff, 0.95);
      this.emotionBubble.fillRoundedRect(-11, -11, 22, 22, 6);
      // tail
      this.emotionBubble.fillTriangle(-3, 11, 3, 11, 0, 16);

      this.emotionText = scene.add.text(0, 0, opts.emotion, {
        fontSize: '12px'
      }).setOrigin(0.5, 0.45);

      this.emotionContainer = scene.add.container(x, y - 35, [this.emotionBubble, this.emotionText])
        .setDepth(11);
      
      this.emotionOffset = 0;
      this.emotionTween = scene.tweens.add({
        targets: this,
        emotionOffset: -4,
        yoyo: true,
        repeat: -1,
        duration: 1200,
        ease: 'Sine.easeInOut'
      });
    }
  }

  /* Permanently remove the emotion bubble */
  clearEmotion() {
    if (this.emotionContainer) {
      this.emotionContainer.destroy();
      this.emotionContainer = null;
    }
    if (this.emotionTween) {
      this.emotionTween.stop();
      this.emotionTween = null;
    }
  }

  /* Called every frame by WorldScene.update() */
  update() {
    // Update indicator position to follow NPC
    if (this.indicator) {
      this.indicator.setPosition(this.sprite.x, this.sprite.y - 20);
    }
    // Update emotion bubble position and visibility based on movement
    if (this.emotionContainer) {
      this.emotionContainer.setPosition(this.sprite.x, this.sprite.y - 35 + this.emotionOffset);
      
      // Hide if moving (idle check)
      const isMoving = Math.abs(this.sprite.body.velocity.x) > 0.1 || Math.abs(this.sprite.body.velocity.y) > 0.1;
      this.emotionContainer.setVisible(!isMoving);
    }
  }

  /** Show or hide the interaction indicator based on player proximity */
  setIndicatorVisible(visible) {
    if (this.indicator) {
      this.indicator.setVisible(visible);
    }
  }
}
