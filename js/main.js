/* ───────────── main.js ─────────────
   CARE-TECH: Harmonia School
   Phaser 3 entry point — configures the engine and launches the game.
   
   A Stardew Valley-style 2D top-down anti-bullying narrative RPG.
   ─────────────────────────────────── */

const TILE  = 64;          // logical tile size used everywhere
const SCALE = 2;           // pixel-art up-scale factor (decreased since sprites are larger)

const dpr = Math.max(window.devicePixelRatio || 1, 1);

const config = {
  type   : Phaser.AUTO,
  width  : window.innerWidth,      // Use full screen width
  height : window.innerHeight,     // Use full screen height
  resolution: dpr,                 // Native high-DPR resolution for razor-sharp rendering
  pixelArt : true,                 // keep sprites crisp
  roundPixels : true,              // prevent sub-pixel rendering (ghosting/jitter)

  render: {
    antialias: true,               // Smooth MSAA for UI vectors & fonts
    antialiasGL: true,
    roundPixels: true,
    pixelArt: true
  },

  physics: {
    default: 'arcade',
    arcade : {
      gravity: { y: 0 },   // top-down: no gravity
      debug  : false
    }
  },

  scale: {
    mode      : Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },

  scene: [
    BootScene,              // preload + procedural asset generation
    WorldScene,             // main gameplay
    UIScene                 // HUD overlay (Harmony bar, clock, dialogue box)
  ],

  // Transparent background so the HTML page dark bg shows through
  backgroundColor: '#0f0e17'
};

/* ── Create the Phaser game instance ── */
const game = new Phaser.Game(config);
window.game = game;

/* ── Global shared state ──
   Accessible from any scene via `this.registry`. */
game.registry.set('harmony',        50);      // Harmony Index 0-100
game.registry.set('clock',          480);     // in-game minutes since midnight (08:00 = 480)
game.registry.set('currentMap',     'garden');
game.registry.set('dialogueActive', false);
game.registry.set('level1_player_locked', true);
game.registry.set('level1_quest_active', null);
