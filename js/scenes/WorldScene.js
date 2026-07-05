/* ───────────── scenes / WorldScene.js ─────────────
   Main gameplay scene — spawns the current map,
   places the player + NPCs, and handles collisions
   and scene transitions.
   ─────────────────────────────────────────────── */

class WorldScene extends Phaser.Scene {
  constructor() { super('World'); }

  init(data) {
    // Accept optional spawn coordinates from scene transitions
    this.spawnX = data.spawnX || null;
    this.spawnY = data.spawnY || null;
  }

  create() {
    const mapKey = this.registry.get('currentMap');

    /* ── Build the map ── */
    this.walls = this.physics.add.staticGroup();
    this.interactables = [];   // objects the player can interact with
    this._buildMap(mapKey);

    /* ── Player ── */
    const px = this.spawnX || 5 * TILE + TILE / 2;
    const py = this.spawnY || 7 * TILE + TILE / 2;
    this.player = new Player(this, px, py);

    /* ── NPCs ── */
    this.npcs = [];
    this._spawnNPCs(mapKey);

    /* ── Systems ── */
    this.scheduleMgr = new ScheduleManager(this, this.npcs);
    this.relationMgr = new RelationshipManager(this.registry);

    /* ── Collisions ── */
    this.physics.add.collider(this.player.sprite, this.walls);
    this.npcs.forEach(n => {
      this.physics.add.collider(this.player.sprite, n.sprite);
    });

    /* ── Camera ── */
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
    this.cameras.main.setZoom(SCALE);
    this.cameras.main.setBackgroundColor('#0f0e17');

    /* ── Launch HUD overlay (only if not already running) ── */
    if (!this.scene.isActive('UI')) {
      this.scene.launch('UI');
    }

    /* ── Keyboard interaction (E or Space) ── */
    this.input.keyboard.on('keydown-E', () => this._tryInteract());
    this.input.keyboard.on('keydown-SPACE', () => this._tryInteract());

    /* ── Proximity prompt tracking ── */
    this.nearestInteractable = null;

    /* ── Debug Grid (Row, Col) ── */
    this._drawDebugGrid();
  }

  update() {
    this.player.update();
    this.npcs.forEach(n => n.update());

    /* ── Check proximity for interaction prompt ── */
    this._updateProximity();
  }

  /* ────── Debug Grid ────── */
  _drawDebugGrid() {
    const W = 20, H = 15;
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        this.add.text(c * TILE + TILE / 2, r * TILE + TILE / 2, `${r},${c}`, {
          fontFamily: 'monospace',
          fontSize: '9px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5).setDepth(1000).setAlpha(0.6);
      }
    }
  }

  /* ────── Proximity indicator updates ────── */
  _updateProximity() {
    if (this.registry.get('dialogueActive')) return;

    let nearest = null;
    let nearestDist = TILE * 1.8;

    for (const npc of this.npcs) {
      if (!npc.dialogueId) continue;
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x, this.player.sprite.y,
        npc.sprite.x, npc.sprite.y
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = npc;
      }
    }

    // Show/hide NPC indicators
    this.npcs.forEach(n => n.setIndicatorVisible(n === nearest));

    // Tell UIScene about nearby interactable
    const uiScene = this.scene.get('UI');
    if (uiScene && uiScene.setInteractPrompt) {
      // Check door proximity too
      const onDoor = this._isNearDoor();
      uiScene.setInteractPrompt(nearest !== null || onDoor);
    }
  }

  /* ────── Map builder (Dynamic 2D Arrays) ────── */
  _buildMap(mapKey) {
    const W = 20, H = 15;
    
    // Create an empty tilemap
    const map = this.make.tilemap({ tileWidth: TILE, tileHeight: TILE, width: W, height: H });
    const tileset = map.addTilesetImage('tileset', 'tileset');

    // Create blank layers
    const groundLayer = map.createBlankLayer('Ground', tileset);
    const objectLayer = map.createBlankLayer('Objects', tileset);
    
    groundLayer.setDepth(0);
    objectLayer.setDepth(10); // Renders above the player (depth 5)

    const TILE_IDS = {
      'grass': 1, 'grass2': 2, 'path': 3, 'path2': 4,
      'wall': 5, 'wall_top': 6, 'floor': 7, 'floor2': 8,
      'door': 9, 'bench': 10, 'desk': 11, 'board': 12,
      'chair': 13, 'table': 14, 'stage': 15, 'flower': 16,
      'tree': 17, 'water_tl': 18, 'bookshelf': 19,
      'path_1_3': 20, 'path_1_4': 21, 'path_2_2': 22, 'path_2_0': 23,
      'path_2_4': 24, 'path_2_3': 25, 'path_3_1': 26, 'path_1_1': 27,
      'path_3_2': 28, 'path_1_2': 29,
      'water_tr': 30, 'water_bl': 31, 'water_br': 32,
      'tree_0_0': 33, 'tree_0_1': 34, 'tree_0_2': 35,
      'tree_1_0': 36, 'tree_1_1': 37, 'tree_1_2': 38,
      'tree_2_0': 39, 'tree_2_1': 40, 'tree_2_2': 41
    };
    
    const solidTiles = ['wall', 'wall_top', 'bench', 'desk', 'board', 'table', 'chair', 'tree', 'tree_2_1', 'water', 'water_tl', 'water_tr', 'water_bl', 'water_br', 'bookshelf'];

    const mapData = this._getMapData(mapKey);

    // Populate the layers using the 2D array
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const tileName = mapData[r][c];
        const tileId = TILE_IDS[tileName] || 0;
        
        if (solidTiles.includes(tileName) || tileName === 'door' || (tileName && tileName.startsWith('tree_'))) {
          // Put interactive/solid objects on Object layer, put default floor beneath it
          const floorId = (mapKey === 'garden') ? TILE_IDS['grass'] : TILE_IDS['floor'];
          groundLayer.putTileAt(floorId, c, r);
          objectLayer.putTileAt(tileId, c, r);
        } else {
          // Just normal ground
          groundLayer.putTileAt(tileId, c, r);
        }
      }
    }

    // Set collision on the Objects layer. (Exclude door and non-root tree parts so player can walk through them)
    const excludeIds = [-1, TILE_IDS['door'], TILE_IDS['tree_0_0'], TILE_IDS['tree_0_1'], TILE_IDS['tree_0_2'], TILE_IDS['tree_1_0'], TILE_IDS['tree_1_1'], TILE_IDS['tree_1_2'], TILE_IDS['tree_2_0'], TILE_IDS['tree_2_2']];
    objectLayer.setCollisionByExclusion(excludeIds);

    // Set this.walls to the objectLayer so physics colliders work
    this.walls = objectLayer;
  }

  /* ────── Map data for each area (Human Readable 2D Arrays) ────── */
  _getMapData(key) {
    const W = 20, H = 15;

    if (key === 'garden') {
      const m = Array.from({ length: H }, (_, r) =>
        Array.from({ length: W }, (_, c) => ((r + c) % 7 === 0 ? 'grass2' : 'grass'))
      );
      for (let c = 0; c < W; c++) { m[0][c] = 'wall'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      for (let c = 2; c < 18; c++) { m[7][c] = 'path'; m[8][c] = 'path'; }
      for (let r = 1; r < 7; r++) { m[r][10] = 'path'; m[r][11] = 'path'; }
      m[7][2] = 'path_1_3';
      m[8][2] = 'path_1_4';
      for (let c = 3; c <= 9; c++) { m[7][c] = 'path_2_2'; }
      for (let c = 3; c <= 16; c++) { m[8][c] = 'path_2_0'; }
      
      m[8][17] = 'path_2_4';
      m[7][17] = 'path_2_3';
      for (let c = 12; c <= 16; c++) { m[7][c] = 'path_2_2'; }
      for (let r = 1; r <= 6; r++) { m[r][10] = 'path_3_1'; }
      for (let r = 1; r <= 6; r++) { m[r][11] = 'path_1_1'; }
      m[7][10] = 'path_3_2';
      m[7][11] = 'path_1_2';
      m[3][3] = 'flower'; m[3][4] = 'flower'; m[4][3] = 'flower';
      m[11][15] = 'flower'; m[11][16] = 'flower'; m[12][16] = 'flower';
      
      const putBigTree = (r, c) => {
        m[r][c] = 'tree_0_0'; m[r][c+1] = 'tree_0_1'; m[r][c+2] = 'tree_0_2';
        m[r+1][c] = 'tree_1_0'; m[r+1][c+1] = 'tree_1_1'; m[r+1][c+2] = 'tree_1_2';
        m[r+2][c] = 'tree_2_0'; m[r+2][c+1] = 'tree_2_1'; m[r+2][c+2] = 'tree_2_2';
      };
      putBigTree(2,2); putBigTree(2,17); putBigTree(12,2); putBigTree(4,15); putBigTree(10,5);

      m[10][13] = 'water_tl'; m[10][14] = 'water_tr';
      m[11][13] = 'water_bl'; m[11][14] = 'water_br';
      m[6][5] = 'bench'; m[6][14] = 'bench'; m[9][8] = 'bench'; // moved bench to not overlap 2-tile path
      m[5][9] = 'bench'; // moved bench to left of the 2-tile path
      m[0][10] = 'door'; m[0][11] = 'door';
      return m;
    }

    if (key === 'corridor') {
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      for (let c = 1; c < W - 1; c++) { m[1][c] = 'wall_top'; m[5][c] = 'wall'; }
      m[5][5] = 'floor'; m[5][6] = 'floor'; m[5][14] = 'floor'; m[5][15] = 'floor';
      for (let r = 2; r < 5; r++) {
        for (let c = 1; c < W - 1; c++) if (c % 3 === 0) m[r][c] = 'floor2';
      }
      m[8][2] = 'bookshelf'; m[8][3] = 'bookshelf'; m[8][4] = 'bookshelf';
      m[10][2] = 'bookshelf'; m[10][3] = 'bookshelf';
      m[12][2] = 'bookshelf'; m[12][3] = 'bookshelf';
      m[1][10] = 'board';
      m[H - 1][10] = 'door'; m[H - 1][11] = 'door'; 
      m[0][5]  = 'door'; m[0][6]  = 'door'; 
      m[0][15] = 'door'; m[0][16] = 'door'; 
      m[H - 1][3] = 'door'; m[H - 1][4] = 'door';
      return m;
    }

    if (key === 'classroom') {
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      m[1][9] = 'board'; m[1][10] = 'board'; m[1][11] = 'board';
      m[3][10] = 'desk';
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          m[6 + row * 2][4 + col * 3] = 'desk';
          m[7 + row * 2][4 + col * 3] = 'chair';
        }
      }
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'floor' && (r + c) % 5 === 0) m[r][c] = 'floor2';
      }
      m[H - 1][10] = 'door'; m[H - 1][11] = 'door';
      return m;
    }

    if (key === 'auditorium') {
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      for (let c = 3; c < 17; c++) { m[2][c] = 'stage'; m[3][c] = 'stage'; }
      m[1][5] = 'board'; m[1][10] = 'board'; m[1][15] = 'board';
      for (let row = 0; row < 4; row++) {
        for (let col = 2; col < 18; col += 2) m[6 + row * 2][col] = 'chair';
      }
      for (let r = 4; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'floor' && (r * c) % 6 === 0) m[r][c] = 'floor2';
      }
      m[H - 1][10] = 'door'; m[H - 1][11] = 'door';
      return m;
    }

    if (key === 'cafeteria') {
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      const tablePositions = [
        { r: 3, c: 4 }, { r: 3, c: 11 }, { r: 8, c: 4 }, 
        { r: 8, c: 11 }, { r: 6, c: 16 }, { r: 11, c: 8 }
      ];
      tablePositions.forEach(({ r, c }) => {
        m[r][c] = 'table';
        if (r - 1 >= 1) m[r - 1][c] = 'chair';
        if (r + 1 < H - 1) m[r + 1][c] = 'chair';
        if (c - 1 >= 1 && m[r][c - 1] === 'floor') m[r][c - 1] = 'chair';
        if (c + 1 < W - 1 && m[r][c + 1] === 'floor') m[r][c + 1] = 'chair';
      });
      for (let c = 2; c < 8; c++) m[1][c] = 'desk';
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'floor' && (r + c) % 4 === 0) m[r][c] = 'floor2';
      }
      m[H - 1][10] = 'door'; m[H - 1][11] = 'door';
      return m;
    }

    return Array.from({ length: H }, () => Array(W).fill('grass'));
  }

  /* ────── NPC spawning per map ────── */
  _spawnNPCs(mapKey) {
    if (mapKey === 'garden') {
      this.npcs.push(new NPC(this, 4 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'nakula', 'nakula_intro', { name: 'Nakula' }));
      this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 4 * TILE + TILE / 2,
        'nabula', null, { name: 'Nabula' }));   // silent until approached via Nakula's dialogue
      // Background students
      this.npcs.push(new NPC(this, 15 * TILE + TILE / 2, 9 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));
    }

    if (mapKey === 'corridor') {
      this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 3 * TILE + TILE / 2,
        'bully', 'bully_taunt', { name: 'Bully' }));
      this.npcs.push(new NPC(this, 12 * TILE + TILE / 2, 3 * TILE + TILE / 2,
        'bully', null, { name: 'Bully 2' }));
      // Nabula hiding behind library (bottom-left area)
      this.npcs.push(new NPC(this, 5 * TILE + TILE / 2, 12 * TILE + TILE / 2,
        'nabula', 'nabula_found', { name: 'Nabula' }));
      // Riko lurking
      this.npcs.push(new NPC(this, 16 * TILE + TILE / 2, 8 * TILE + TILE / 2,
        'riko', 'riko_corridor', { name: 'Riko' }));
    }

    if (mapKey === 'classroom') {
      this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 2 * TILE + TILE / 2,
        'rani', 'rani_intro', { name: 'Teacher Rani' }));
      this.npcs.push(new NPC(this, 6 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_2', { name: 'Student' }));
    }

    if (mapKey === 'auditorium') {
      this.npcs.push(new NPC(this, 8 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));
    }

    if (mapKey === 'cafeteria') {
      this.npcs.push(new NPC(this, 14 * TILE + TILE / 2, 6 * TILE + TILE / 2,
        'student', 'student_chat_2', { name: 'Student' }));
      this.npcs.push(new NPC(this, 6 * TILE + TILE / 2, 10 * TILE + TILE / 2,
        'nakula', 'student_chat_1', { name: 'Nakula' }));
    }
  }

  /* ────── Interaction via E/Space key ────── */
  _tryInteract() {
    if (this.registry.get('dialogueActive')) return;

    // Check NPC proximity
    for (const npc of this.npcs) {
      const dist = Phaser.Math.Distance.Between(
        this.player.sprite.x, this.player.sprite.y,
        npc.sprite.x, npc.sprite.y
      );
      if (dist < TILE * 1.8 && npc.dialogueId) {
        this.scene.get('UI').startDialogue(npc.dialogueId);
        return;
      }
    }

    // Check door / scene transitions
    this._checkDoor();
  }

  /* ────── Door transition detection ────── */
  _isNearDoor() {
    const px = Math.round((this.player.sprite.x - TILE / 2) / TILE);
    const py = Math.round((this.player.sprite.y - TILE / 2) / TILE);
    const mapKey = this.registry.get('currentMap');
    const transitions = this._getTransitions(mapKey);

    for (const t of transitions) {
      if (px === t.fromX && Math.abs(py - t.fromY) <= 1) return true;
    }
    return false;
  }

  _checkDoor() {
    const px = Math.round((this.player.sprite.x - TILE / 2) / TILE);
    const py = Math.round((this.player.sprite.y - TILE / 2) / TILE);
    const mapKey = this.registry.get('currentMap');
    const transitions = this._getTransitions(mapKey);

    for (const t of transitions) {
      if (px === t.fromX && Math.abs(py - t.fromY) <= 1) {
        this._changeMap(t.toMap, t.spawnX * TILE + TILE / 2, t.spawnY * TILE + TILE / 2);
        return;
      }
    }
  }

  /** Define all map transitions */
  _getTransitions(mapKey) {
    const transitions = {
      garden: [
        { fromX: 10, fromY: 0,  toMap: 'corridor',   spawnX: 10, spawnY: 13 },
        { fromX: 11, fromY: 0,  toMap: 'corridor',   spawnX: 10, spawnY: 13 }
      ],
      corridor: [
        { fromX: 10, fromY: 14, toMap: 'garden',      spawnX: 10, spawnY: 2  },
        { fromX: 11, fromY: 14, toMap: 'garden',      spawnX: 10, spawnY: 2  },
        { fromX: 5,  fromY: 0,  toMap: 'classroom',   spawnX: 10, spawnY: 13 },
        { fromX: 6,  fromY: 0,  toMap: 'classroom',   spawnX: 10, spawnY: 13 },
        { fromX: 15, fromY: 0,  toMap: 'auditorium',  spawnX: 10, spawnY: 13 },
        { fromX: 16, fromY: 0,  toMap: 'auditorium',  spawnX: 10, spawnY: 13 },
        { fromX: 3,  fromY: 14, toMap: 'cafeteria',   spawnX: 10, spawnY: 13 },
        { fromX: 4,  fromY: 14, toMap: 'cafeteria',   spawnX: 10, spawnY: 13 }
      ],
      classroom: [
        { fromX: 10, fromY: 14, toMap: 'corridor',    spawnX: 5,  spawnY: 2  },
        { fromX: 11, fromY: 14, toMap: 'corridor',    spawnX: 5,  spawnY: 2  }
      ],
      auditorium: [
        { fromX: 10, fromY: 14, toMap: 'corridor',    spawnX: 15, spawnY: 2  },
        { fromX: 11, fromY: 14, toMap: 'corridor',    spawnX: 15, spawnY: 2  }
      ],
      cafeteria: [
        { fromX: 10, fromY: 14, toMap: 'corridor',    spawnX: 3,  spawnY: 12 },
        { fromX: 11, fromY: 14, toMap: 'corridor',    spawnX: 3,  spawnY: 12 }
      ]
    };
    return transitions[mapKey] || [];
  }

  _changeMap(newMap, spawnX, spawnY) {
    this.registry.set('currentMap', newMap);
    // Fade transition
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.restart({ spawnX, spawnY });
    });
  }
}
