/* ───────────── entities / Player.js ─────────────
   Wraps the player sprite with helpers for 4-dir movement
   and interaction raycasting.
   ─────────────────────────────────────────────── */

class Player {
  /**
   * @param {Phaser.Scene} scene  – the WorldScene instance
   * @param {number} x            – spawn X (px)
   * @param {number} y            – spawn Y (px)
   */
  constructor(scene, x, y) {
    this.scene  = scene;
    this.speed  = 120;           // px / sec
    this.facing = 'down';        // last direction faced

    /* --- sprite -------------------------------------------------- */
    this.sprite = scene.physics.add.sprite(x, y, 'player', 0)
      .setSize(14, 14)           // collision box for feet
      .setOffset(9, 16)          // shift box down to the character's feet in the 32x32 frame
      .setDepth(5);              // render above ground tiles

    /* --- input --------------------------------------------------- */
    this.cursors = scene.input.keyboard.createCursorKeys();
    // WASD keys
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.actionKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );
    // Also allow Space for interaction
    this.spaceKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    /* --- interaction zone (invisible sensor) --------------------- */
    this.sensor = scene.add.zone(x, y, 20, 20);
    scene.physics.world.enable(this.sensor, Phaser.Physics.Arcade.STATIC_BODY);
  }

  /* ── Called every frame by WorldScene.update() ── */
  update() {
    const body = this.sprite.body;
    body.setVelocity(0);

    // Freeze during dialogue
    if (this.scene.registry.get('dialogueActive')) {
      this.sprite.anims.play('player_idle_' + this.facing, true);
      return;
    }

    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown  || this.keyA.isDown || (window.virtualInput && window.virtualInput.left)) vx = -1;
    if (this.cursors.right.isDown || this.keyD.isDown || (window.virtualInput && window.virtualInput.right)) vx =  1;
    if (this.cursors.up.isDown    || this.keyW.isDown || (window.virtualInput && window.virtualInput.up)) vy = -1;
    if (this.cursors.down.isDown  || this.keyS.isDown || (window.virtualInput && window.virtualInput.down)) vy =  1;

    // Normalize diagonal speed
    const len = Math.sqrt(vx * vx + vy * vy) || 1;
    body.setVelocity((vx / len) * this.speed, (vy / len) * this.speed);

    // Update facing direction (prioritise last pressed axis)
    if (vy < 0)      this.facing = 'up';
    else if (vy > 0) this.facing = 'down';
    else if (vx < 0) this.facing = 'left';
    else if (vx > 0) this.facing = 'right';

    /* -- play walk / idle animation -- */
    if (this.facing === 'left') {
      this.sprite.setFlipX(true);
    } else if (this.facing === 'right') {
      this.sprite.setFlipX(false);
    }

    if (body.velocity.x !== 0 || body.velocity.y !== 0) {
      this.sprite.anims.play('player_walk_' + this.facing, true);
    } else {
      this.sprite.anims.play('player_idle_' + this.facing, true);
    }

    /* -- move interaction sensor in front of player -- */
    const offset = 20;
    let sx = this.sprite.x, sy = this.sprite.y;
    if (this.facing === 'up')    sy -= offset;
    if (this.facing === 'down')  sy += offset;
    if (this.facing === 'left')  sx -= offset;
    if (this.facing === 'right') sx += offset;
    this.sensor.setPosition(sx, sy);
  }

  isInteracting() {
    let vAction = false;
    if (window.virtualInput && window.virtualInput.actionJustDown) {
      vAction = true;
      window.virtualInput.actionJustDown = false;
    }
    return Phaser.Input.Keyboard.JustDown(this.actionKey) ||
           Phaser.Input.Keyboard.JustDown(this.spaceKey) || vAction;
  }
}
