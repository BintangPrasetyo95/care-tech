/* ───────────── main.js ─────────────
   CARE-TECH: Harmonia School
   Phaser 3 entry point — configures the engine and launches the game.
   
   A Stardew Valley-style 2D top-down anti-bullying narrative RPG.
   ─────────────────────────────────── */

const TILE  = 32;          // logical tile size used everywhere
const SCALE = 4;           // pixel-art up-scale factor (increased for full screen)

const config = {
  type   : Phaser.AUTO,
  width  : window.innerWidth,      // Use full screen width
  height : window.innerHeight,     // Use full screen height
  pixelArt : true,         // keep sprites crisp
  roundPixels : true,      // prevent sub-pixel rendering (ghosting/jitter)

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

/* ── Global shared state ──
   Accessible from any scene via `this.registry`. */
game.registry.set('harmony',        50);      // Harmony Index 0-100
game.registry.set('clock',          480);     // in-game minutes since midnight (08:00 = 480)
game.registry.set('currentMap',     'garden');
game.registry.set('dialogueActive', false);
