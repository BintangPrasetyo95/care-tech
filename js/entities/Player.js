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
    this.baseSpeed = 240;        // base px / sec
    this.speedMultiplier = (typeof window !== 'undefined' && window.__playerSpeedMultiplier) || 1.0;
    this.speed  = this.baseSpeed * this.speedMultiplier;
    this.facing = 'down';        // last direction faced

    /* --- sprite -------------------------------------------------- */
    this.sprite = scene.physics.add.sprite(x, y, 'player', 0)
      .setSize(28, 28)           // collision box for feet
      .setOffset(18, 32)         // shift box down to the character's feet in the 64x64 frame
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
    // Freeze during cutscenes where tween handles movement
    if (this.isCutsceneActive) {
      return;
    }
    const body = this.sprite.body;
    if (body) body.setVelocity(0);

    if (this.scene.registry.get('dialogueActive') || this.scene.registry.get('menuOpen') || this.scene.registry.get('level1_player_locked') || this.scene.registry.get('level2_player_locked') || this.isLocked) {
      this.sprite.anims.play('player_idle_' + this.facing, true);
      return;
    }

    let vx = 0;
    let vy = 0;

    const hasAnalog = window.virtualInput && (window.virtualInput.axisX !== undefined || window.virtualInput.axisY !== undefined) && (window.virtualInput.axisX !== 0 || window.virtualInput.axisY !== 0);

    if (hasAnalog) {
      vx = window.virtualInput.axisX;
      vy = window.virtualInput.axisY;
    } else {
      if (this.cursors.left.isDown  || this.keyA.isDown || (window.virtualInput && window.virtualInput.left)) vx = -1;
      if (this.cursors.right.isDown || this.keyD.isDown || (window.virtualInput && window.virtualInput.right)) vx =  1;
      if (this.cursors.up.isDown    || this.keyW.isDown || (window.virtualInput && window.virtualInput.up)) vy = -1;
      if (this.cursors.down.isDown  || this.keyS.isDown || (window.virtualInput && window.virtualInput.down)) vy =  1;
    }

    // Calculate dynamic speed with multiplier
    const mult = (typeof window !== 'undefined' && window.__playerSpeedMultiplier !== undefined)
      ? window.__playerSpeedMultiplier
      : (this.speedMultiplier || 1.0);
    const effSpeed = (this.baseSpeed || 240) * mult;
    this.speed = effSpeed;

    // Normalize speed
    const len = Math.sqrt(vx * vx + vy * vy) || 1;
    body.setVelocity((vx / len) * effSpeed, (vy / len) * effSpeed);

    // Update facing direction (prioritise dominant axis)
    if (Math.abs(vy) > Math.abs(vx)) {
      if (vy < 0)      this.facing = 'up';
      else if (vy > 0) this.facing = 'down';
    } else if (Math.abs(vx) > 0) {
      if (vx < 0)      this.facing = 'left';
      else if (vx > 0) this.facing = 'right';
    }

    /* -- play walk / idle animation with synced timeScale -- */
    if (this.facing === 'left') {
      this.sprite.setFlipX(true);
    } else if (this.facing === 'right') {
      this.sprite.setFlipX(false);
    }

    if (body.velocity.x !== 0 || body.velocity.y !== 0) {
      if (this.sprite.anims) {
        this.sprite.anims.timeScale = Math.min(3.0, Math.max(0.5, mult));
      }
      this.sprite.anims.play('player_walk_' + this.facing, true);
    } else {
      if (this.sprite.anims) {
        this.sprite.anims.timeScale = 1.0;
      }
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
    if (this.isLocked || this.isCutsceneActive) return false;
    let vAction = false;
    if (window.virtualInput && window.virtualInput.actionJustDown) {
      vAction = true;
      window.virtualInput.actionJustDown = false;
    }
    return Phaser.Input.Keyboard.JustDown(this.actionKey) ||
           Phaser.Input.Keyboard.JustDown(this.spaceKey) || vAction;
  }

  setSpeedMultiplier(multiplier = 1.0) {
    this.speedMultiplier = Math.max(0.1, multiplier);
    this.speed = (this.baseSpeed || 240) * this.speedMultiplier;
    if (typeof window !== 'undefined') {
      window.__playerSpeedMultiplier = this.speedMultiplier;
    }
    return this.speedMultiplier;
  }
}
