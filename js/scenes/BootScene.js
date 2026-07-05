/* ───────────── scenes / BootScene.js ─────────────
   Preloads real assets AND generates coloured-rect
   placeholder sprites so the game is playable even
   before any pixel art is finished.
   ─────────────────────────────────────────────── */

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    /* ── Progress bar (drawn procedurally) ── */
    const { width, height } = this.scale;

    // Dark background
    this.cameras.main.setBackgroundColor('#0f0e17');

    // Loading text
    const loadText = this.add.text(width / 2, height / 2 - 30, 'Loading CARE-TECH…', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '14px',
      color: '#94a1b2'
    }).setOrigin(0.5);

    // Progress bar track
    const barX = width * 0.25;
    const barY = height / 2;
    const barW = width * 0.5;
    const barH = 8;
    this.add.rectangle(barX + barW / 2, barY, barW, barH, 0x242629).setOrigin(0.5);

    // Progress bar fill
    const bar = this.add.graphics();
    this.load.on('progress', v => {
      bar.clear()
         .fillStyle(0x7f5af0, 1)
         .fillRoundedRect(barX, barY - barH / 2, barW * v, barH, 4);
    });

    this.load.on('complete', () => {
      loadText.setText('Ready!');
    });

    /* ── Try loading real sprite sheets (uncomment when assets exist) ── */
    this.load.spritesheet('player', 'assets/sprites/player.png',
                          { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('nabula', 'assets/sprites/nabula.png',
                          { frameWidth: 32, frameHeight: 32 });
    
    
    // Load tileset image
    this.load.image('tileset', 'assets/sprites/tileset.png?v=' + Date.now());
    this.load.spritesheet('tileset_sheet', 'assets/sprites/tileset.png?v=' + Date.now(), { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this._generatePlaceholders();
    this._defineAnimations();

    // Hide the HTML preloader
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');

    this.scene.start('World');
  }

  /* ──────── Procedural placeholder textures ──────── */
  _generatePlaceholders() {
    const T = TILE;
    const g = this.make.graphics({ add: false });

    const makeSprite = (key, color, label) => {
      g.clear();
      // Body
      g.fillStyle(color, 1);
      g.fillRoundedRect(2, 2, T - 4, T - 4, 4);
      // Slightly darker border
      g.lineStyle(1, Phaser.Display.Color.ValueToColor(color).darken(30).color, 0.8);
      g.strokeRoundedRect(2, 2, T - 4, T - 4, 4);
      g.generateTexture(key, T, T);
    };

    /* ── Characters ── */
    // makeSprite('player',  0x3b82f6);   // blue
    // makeSprite('nakula',  0xf59e0b);   // amber
    // makeSprite('nabula',  0xec4899);   // pink
    makeSprite('riko',    0xef4444);   // red
    makeSprite('rani',    0x8b5cf6);   // violet
    makeSprite('bully',   0x6b7280);   // gray
    makeSprite('student', 0x22d3ee);   // cyan

    g.destroy();
  }

  /* ──────── Animations ──────── */
  _defineAnimations() {
    const dirs = ['down', 'left', 'right', 'up'];

    // With single-frame placeholders we create one-frame anims
    // so the Player/NPC code doesn't crash. Replace with real
    // spritesheets when pixel art is ready.
    const characters = ['riko', 'rani', 'bully', 'student'];
    characters.forEach(key => {
      dirs.forEach(dir => {
        if (!this.anims.exists(`${key}_walk_${dir}`)) {
          this.anims.create({
            key: `${key}_walk_${dir}`,
            frames: [{ key, frame: 0 }],
            frameRate: 6,
            repeat: -1
          });
        }
        if (!this.anims.exists(`${key}_idle_${dir}`)) {
          this.anims.create({
            key: `${key}_idle_${dir}`,
            frames: [{ key, frame: 0 }],
            frameRate: 1,
            repeat: -1
          });
        }
      });
    });

    // Real animations for Player, Nabula, Nakula
    dirs.forEach(dir => {
      ['player', 'nabula'].forEach(key => {
        if (!this.anims.exists(`${key}_walk_${dir}`)) {
          this.anims.create({
            key: `${key}_walk_${dir}`,
            frames: this.anims.generateFrameNumbers(key, { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
          });
        }
        if (!this.anims.exists(`${key}_idle_${dir}`)) {
          this.anims.create({
            key: `${key}_idle_${dir}`,
            frames: [{ key: key, frame: 0 }],
            frameRate: 1,
            repeat: -1
          });
        }
      });
    });
  }
}
