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
game.registry.set('debugMode', false);

/* ── Connect GameState Single Source of Truth ── */
if (window.GameState) {
  window.GameState.bindRegistry(game.registry);
}

/* ── Debug Mode Control ──
   Default: OFF
   Can be switched manually via the browser DevTools console:
     debugMode(true)  / debugMode = true  -> Turn ON
     debugMode(false) / debugMode = false -> Turn OFF
     debugMode()                          -> Toggle ON/OFF
     setDebugMode(true/false)
     toggleDebug()
*/
let _debugMode = false;

window.setDebugMode = function(enabled) {
  _debugMode = (enabled === undefined) ? !_debugMode : Boolean(enabled);
  if (window.game && window.game.registry) {
    window.game.registry.set('debugMode', _debugMode);
  }
  if (window.GameState) {
    window.GameState.setFlag('debugMode', _debugMode);
  }

  // Apply immediately to WorldScene if currently active
  const worldScene = window.game && window.game.scene ? window.game.scene.getScene('World') : null;
  if (worldScene && typeof worldScene.setDebugMode === 'function') {
    worldScene.setDebugMode(_debugMode);
  }

  if (_debugMode) {
    console.log(
      '%c[CARE-TECH DEBUG MODE: ACTIVATED] %c\n' +
      '• Tile Coordinate Grid   : ENABLED\n' +
      '• Arcade Physics Hitboxes: ENABLED\n\n' +
      '🛠️ Available Console Test Commands:\n' +
      '  - debugMode(false) or debugMode = false : Turn off debug mode\n' +
      '  - debugLevel1State()                    : Inspect Level 1 state flags\n' +
      '  - GameState.dump()                      : Dump global game state\n' +
      '  - testCutscene017()                     : Trigger Cutscene 017 (Library)\n' +
      '  - testCutscene049()                     : Trigger Cutscene 049 (Cafeteria)\n' +
      '  - testChoice058()                       : Open 3 strategic choices dialog\n' +
      '  - testBranchA(), testBranchB(), testBranchC() : Jump to dialogue branches\n' +
      '  - testTimeout1(), testTimeout2()        : Test branch timeouts\n' +
      '  - testEmergencyQuest()                  : Test 30s emergency quest',
      'background: #059669; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'color: #38bdf8; font-size: 11px;'
    );
  } else {
    console.log(
      '%c[CARE-TECH DEBUG MODE: DEACTIVATED] %c\n' +
      '• Tile Coordinate Grid   : DISABLED\n' +
      '• Arcade Physics Hitboxes: DISABLED\n' +
      'Type debugMode(true) or debugMode = true to re-enable.',
      'background: #475569; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'color: #94a3b8; font-size: 11px;'
    );
  }
  return _debugMode;
};

window.toggleDebug = function() {
  return window.setDebugMode(!_debugMode);
};
window.toggleDebugMode = window.toggleDebug;

Object.defineProperty(window, 'debugMode', {
  get() {
    const fn = function(val) {
      return window.setDebugMode(val);
    };
    fn.enabled = _debugMode;
    fn.toString = () => _debugMode ? 'debugMode: ON (true)' : 'debugMode: OFF (false)';
    fn.valueOf = () => _debugMode;
    return fn;
  },
  set(val) {
    window.setDebugMode(val);
  },
  configurable: true
});

// Startup notification in console
console.log(
  '%c[CareTech] 🎮 Debug mode is OFF by default. Type %cdebugMode(true)%c or %cdebugMode = true%c in console to activate.',
  'color: #94a3b8; font-size: 11px;',
  'color: #38bdf8; font-weight: bold;',
  'color: #94a3b8;',
  'color: #38bdf8; font-weight: bold;',
  'color: #94a3b8;'
);
