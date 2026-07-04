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
    // this.load.spritesheet('player', 'assets/sprites/player.png',
    //                       { frameWidth: 16, frameHeight: 16 });
    // this.load.tilemapTiledJSON('garden', 'assets/tilemaps/garden.json');

    // If no files are on disk yet, we generate textures in create().
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

    const makeTile = (key, color) => {
      g.clear();
      g.fillStyle(color, 1);
      g.fillRect(0, 0, T, T);
      // Subtle grid lines for tiles
      g.lineStyle(1, 0x000000, 0.08);
      g.strokeRect(0, 0, T, T);
      g.generateTexture(key, T, T);
    };

    /* ── Characters ── */
    makeSprite('player',  0x3b82f6);   // blue
    makeSprite('nakula',  0xf59e0b);   // amber
    makeSprite('nabula',  0xec4899);   // pink
    makeSprite('riko',    0xef4444);   // red
    makeSprite('rani',    0x8b5cf6);   // violet
    makeSprite('bully',   0x6b7280);   // gray
    makeSprite('student', 0x22d3ee);   // cyan

    /* ── Environment tiles ── */
    makeTile('grass',    0x22c55e);
    makeTile('grass2',   0x16a34a);   // darker grass for variety
    makeTile('path',     0xd4a373);
    makeTile('path2',    0xc4956a);   // alternate path
    makeTile('wall',     0x475569);
    makeTile('wall_top', 0x334155);
    makeTile('floor',    0xfef3c7);
    makeTile('floor2',   0xfde68a);   // alternate floor
    makeTile('door',     0x92400e);
    makeTile('bench',    0x78350f);
    makeTile('desk',     0xa16207);
    makeTile('board',    0x1e3a5f);
    makeTile('chair',    0x7c3aed);
    makeTile('table',    0x854d0e);
    makeTile('stage',    0x7c2d12);
    makeTile('flower',   0xfb7185);
    makeTile('tree',     0x166534);
    makeTile('water',    0x0ea5e9);
    makeTile('bookshelf',0x44403c);

    g.destroy();
  }

  /* ──────── Animations ──────── */
  _defineAnimations() {
    const dirs = ['down', 'left', 'right', 'up'];

    // With single-frame placeholders we create one-frame anims
    // so the Player/NPC code doesn't crash. Replace with real
    // spritesheets when pixel art is ready.
    const characters = ['player', 'nakula', 'nabula', 'riko', 'rani', 'bully', 'student'];
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
  }
}
