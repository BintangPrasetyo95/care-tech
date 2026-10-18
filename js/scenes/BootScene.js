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

    // Soft light background
    this.cameras.main.setBackgroundColor('#f0fdfa');

    // Loading text
    const loadText = this.add.text(width / 2, height / 2 - 40, 'Loading CARE-TECH…', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '15px',
      color: '#64748b',
      letterSpacing: 1
    }).setOrigin(0.5);

    // Progress bar track (soft border)
    const barX = width * 0.25;
    const barY = height / 2 + 10;
    const barW = width * 0.5;
    const barH = 6;
    
    const track = this.add.graphics();
    track.fillStyle(0xe2e8f0, 1);
    track.fillRoundedRect(barX, barY - barH / 2, barW, barH, 3);

    // Progress bar fill (light blue)
    const bar = this.add.graphics();
    this.load.on('progress', v => {
      bar.clear()
         .fillStyle(0x0ea5e9, 1)
         .fillRoundedRect(barX, barY - barH / 2, barW * v, barH, 3);
    });

    this.load.on('complete', () => {
      loadText.setText('Ready!');
    });

    /* ── Try loading real sprite sheets (uncomment when assets exist) ── */
    this.load.spritesheet('player', 'assets/sprites/characters/player.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('player_walk', 'assets/sprites/characters/player_walk.png',
                          { frameWidth: 64, frameHeight: 64 });
                          
    this.load.spritesheet('nabula', 'assets/sprites/characters/nabula.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('nabula_walk', 'assets/sprites/characters/nabula_w_pack_walk.png',
                          { frameWidth: 64, frameHeight: 64 });
                          
    this.load.spritesheet('nakula', 'assets/sprites/characters/nakula.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('nakula_walk', 'assets/sprites/characters/nakula_walk.png',
                          { frameWidth: 64, frameHeight: 64 });
    
    // Level 1 library characters
    this.load.spritesheet('bagas', 'assets/sprites/characters/bagas.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('rio', 'assets/sprites/characters/rio.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('wulan', 'assets/sprites/characters/wulan.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('raya', 'assets/sprites/characters/raya.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('mei', 'assets/sprites/characters/mei.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('wati', 'assets/sprites/characters/npc2.png',
                          { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('clue_book', 'assets/sprites/new assets/book_lying.png',
                          { frameWidth: 64, frameHeight: 64 });

    // Load tileset image
    this.load.image('tileset', 'assets/sprites/tileset.png?v=' + Date.now());
    this.load.spritesheet('tileset_sheet', 'assets/sprites/tileset.png?v=' + Date.now(), { frameWidth: 64, frameHeight: 64 });

    // Overall school map
    this.load.image('overall_map', 'assets/sprites/overall_maps_new.png');

    // Pet ECA
    this.load.image('eca_pet', 'assets/sprites/characters/eca.png');

    /* ── Detailed Character Portraits for Dialogue ── */
    const detailedPortraits = {
      // ECA (Detailed interactive companion & guide)
      'eca': 'assets/sprites/characters/detailed/eca/eca.png',
      'eca_neutral': 'assets/sprites/characters/detailed/eca/eca.png',
      'eca_thinking': 'assets/sprites/characters/detailed/eca/eca_thinking.png',
      'eca_confused': 'assets/sprites/characters/detailed/eca/eca_confused.png',
      'eca_panic': 'assets/sprites/characters/detailed/eca/eca_panic.png',
      'eca_excited': 'assets/sprites/characters/detailed/eca/eca_excited.png',
      // ECA aliases
      'eca_happy': 'assets/sprites/characters/detailed/eca/eca_excited.png',
      'eca_sad': 'assets/sprites/characters/detailed/eca/eca_panic.png',
      'eca_worried': 'assets/sprites/characters/detailed/eca/eca_panic.png',

      // Bagas
      'bagas_neutral': 'assets/sprites/characters/detailed/bagas/bagas.png',
      'bagas_angry': 'assets/sprites/characters/detailed/bagas/bagas_angry.png',
      'bagas_dissapointed': 'assets/sprites/characters/detailed/bagas/bagas_dissapointed.png',
      'bagas_disappointed': 'assets/sprites/characters/detailed/bagas/bagas_dissapointed.png',
      'bagas_furious': 'assets/sprites/characters/detailed/bagas/bagas_furious.png',
      'bagas_happy': 'assets/sprites/characters/detailed/bagas/bagas_happy.png',
      'bagas_regret': 'assets/sprites/characters/detailed/bagas/bagas_regret.png',
      'bagas_sarcasm': 'assets/sprites/characters/detailed/bagas/bagas_sarcasm.png',
      'bagas_smirk': 'assets/sprites/characters/detailed/bagas/bagas_smirk.png',
      'bagas_surprised': 'assets/sprites/characters/detailed/bagas/bagas_surprised.png',
      // Bully aliases to Bagas
      'bully_neutral': 'assets/sprites/characters/detailed/bagas/bagas.png',
      'bully_smirk': 'assets/sprites/characters/detailed/bagas/bagas_smirk.png',
      'bully_angry': 'assets/sprites/characters/detailed/bagas/bagas_angry.png',

      // Nabula
      'nabula_neutral': 'assets/sprites/characters/detailed/nabula/nabula.png',
      'nabula_angry': 'assets/sprites/characters/detailed/nabula/nabula_angry.png',
      'nabula_dissapointed': 'assets/sprites/characters/detailed/nabula/nabula_dissapointed.png',
      'nabula_disappointed': 'assets/sprites/characters/detailed/nabula/nabula_dissapointed.png',
      'nabula_excited': 'assets/sprites/characters/detailed/nabula/nabula_excited.png',
      'nabula_happy': 'assets/sprites/characters/detailed/nabula/nabula_happy.png',
      'nabula_panic': 'assets/sprites/characters/detailed/nabula/nabula_panic.png',
      'nabula_sad': 'assets/sprites/characters/detailed/nabula/nabula_sad.png',
      'nabula_smile': 'assets/sprites/characters/detailed/nabula/nabula_happy.png',
      'nabula_surprised': 'assets/sprites/characters/detailed/nabula/nabula_panic.png',
      'nabula_worried': 'assets/sprites/characters/detailed/nabula/nabula_sad.png',

      // Nakula
      'nakula_neutral': 'assets/sprites/characters/detailed/nakula/nakula_neutral.png',
      'nakula_angry': 'assets/sprites/characters/detailed/nakula/nakula_angry.png',
      'nakula_dissapointed': 'assets/sprites/characters/detailed/nakula/nakula_dissapointed.png',
      'nakula_disappointed': 'assets/sprites/characters/detailed/nakula/nakula_dissapointed.png',
      'nakula_excited': 'assets/sprites/characters/detailed/nakula/nakula_excited.png',
      'nakula_happy': 'assets/sprites/characters/detailed/nakula/nakula_happy.png',
      'nakula_relieved': 'assets/sprites/characters/detailed/nakula/nakula_relieved.png',
      'nakula_sad': 'assets/sprites/characters/detailed/nakula/nakula_sad.png',
      'nakula_weirded': 'assets/sprites/characters/detailed/nakula/nakula_weirded.png',

      // Player aliases to Nakula
      'player_neutral': 'assets/sprites/characters/detailed/nakula/nakula_neutral.png',
      'player_happy': 'assets/sprites/characters/detailed/nakula/nakula_happy.png',
      'player_sad': 'assets/sprites/characters/detailed/nakula/nakula_sad.png',
      'player_angry': 'assets/sprites/characters/detailed/nakula/nakula_angry.png',
      'player_serious': 'assets/sprites/characters/detailed/nakula/nakula_neutral.png',
      'player_surprised': 'assets/sprites/characters/detailed/nakula/nakula_excited.png',
      'player_worried': 'assets/sprites/characters/detailed/nakula/nakula_sad.png',
      'player_relief': 'assets/sprites/characters/detailed/nakula/nakula_relieved.png',
      'player_relieved': 'assets/sprites/characters/detailed/nakula/nakula_relieved.png',
      'player_disappointed': 'assets/sprites/characters/detailed/nakula/nakula_dissapointed.png',
      'player_dissapointed': 'assets/sprites/characters/detailed/nakula/nakula_dissapointed.png',
      'player_weirded': 'assets/sprites/characters/detailed/nakula/nakula_weirded.png',
    };

    Object.entries(detailedPortraits).forEach(([key, path]) => {
      this.load.image(key, path);
    });
  }

  create() {
    this._generatePlaceholders();
    this._defineAnimations();
    this.registry.set('lang', 'id');

    // Ensure all pixel-art game textures retain NEAREST filter for crisp sprites
    this.textures.each(t => {
      if (t.key !== '__DEFAULT' && t.key !== '__MISSING') {
        t.setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
    });

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

    /* ── Portraits ── */
    const makePortrait = (key, color) => {
      g.clear();
      g.fillStyle(color, 1);
      g.fillRoundedRect(0, 0, 64, 64, 8);
      g.fillStyle(0xffffff, 0.8);
      g.fillCircle(32, 24, 12); // head
      g.fillRoundedRect(16, 40, 32, 24, 6); // body
      g.generateTexture(key, 64, 64);
    };

    const portraitColors = {
      player: 0x3b82f6,
      nabula: 0xec4899,
      bagas: 0xef4444,
      rio: 0xf97316,
      wulan: 0x10b981,
      raya: 0x06b6d4,
      mei: 0xa855f7,
      wati: 0x8b5cf6,
      riko: 0xef4444,
      rani: 0x8b5cf6,
      bully: 0x6b7280,
      student: 0x22d3ee
    };

    ['player', 'nabula', 'bagas', 'rio', 'wulan', 'raya', 'mei', 'wati', 'riko', 'rani', 'bully', 'student'].forEach(char => {
      ['neutral', 'happy', 'sad', 'smile', 'surprised', 'smirk', 'angry', 'serious', 'worried', 'relief'].forEach(emotion => {
        const key = `${char}_${emotion}`;
        if (!this.textures.exists(key)) {
          makePortrait(key, portraitColors[char]);
        }
      });
    });

    g.destroy();
  }

  /* ──────── Animations ──────── */
  _defineAnimations() {
    const dirs = ['down', 'left', 'right', 'up'];

    // With single-frame placeholders we create one-frame anims
    // so the Player/NPC code doesn't crash. Replace with real
    // spritesheets when pixel art is ready.
    const characters = ['riko', 'rani', 'bully', 'student', 'bagas', 'rio', 'wulan', 'raya', 'mei', 'wati'];
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
      ['player', 'nabula', 'nakula'].forEach(key => {
        if (!this.anims.exists(`${key}_walk_${dir}`)) {
          this.anims.create({
            key: `${key}_walk_${dir}`,
            frames: this.anims.generateFrameNumbers(`${key}_walk`, { start: 0, end: 7 }),
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
