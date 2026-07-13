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
    const px = this.spawnX || 10 * TILE + TILE / 2;
    const py = this.spawnY || 7 * TILE + TILE / 2;
    this.player = new Player(this, px, py);
    this.player.sprite.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 20 * TILE, 15 * TILE);

    /* ── NPCs ── */
    this.npcs = [];
    this._spawnNPCs(mapKey);

    /* ── Systems ── */
    this.scheduleMgr = new ScheduleManager(this, this.npcs);
    this.relationMgr = new RelationshipManager(this.registry);

    /* ── Collisions ── */
    this.physics.add.collider(this.player.sprite, this.walls);
    if (this.midWalls) this.physics.add.collider(this.player.sprite, this.midWalls);
    this.npcs.forEach(n => {
      this.physics.add.collider(this.player.sprite, n.sprite);
    });

    this.cameras.main.startFollow(this.player.sprite, true, 1, 1);
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
    this.currentTransitions = this._getTransitions(mapKey);

    /* ── Debug Grid (Row, Col) ── */
    // this._drawDebugGrid();
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].update(time, delta);
    }
    this._updatePlayerMask();

    /* ── Check proximity for interaction prompt ── */
    this._updateProximity();
  }

  _updatePlayerMask() {
    if (!this.player || !this.playerMaskImage) return;
    this.playerMaskImage.x = this.player.sprite.x;
    this.playerMaskImage.y = this.player.sprite.y - 16;
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
    let nearestDistSq = (TILE * 1.8) * (TILE * 1.8);
    const px = this.player.sprite.x;
    const py = this.player.sprite.y;

    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      if (!npc.dialogueId) continue;
      const dx = px - npc.sprite.x;
      const dy = py - npc.sprite.y;
      const distSq = dx * dx + dy * dy;

      if (distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearest = npc;
      }
    }

    // Show/hide NPC indicators
    for (let i = 0; i < this.npcs.length; i++) {
      const n = this.npcs[i];
      n.setIndicatorVisible(n === nearest);
    }

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
    const midLayer = map.createBlankLayer('Mid', tileset);
    const midLayer2 = map.createBlankLayer('Mid2', tileset);
    
    groundLayer.setDepth(0);
    midLayer.setDepth(1);
    midLayer2.setDepth(2);
    
    // We create multiple object layers to support trees overlapping trees
    const objectLayersTransparent = [];
    const objectLayers = [];
    for (let i = 0; i < 3; i++) {
      const tLayer = map.createBlankLayer(`ObjectsTransparent_${i}`, tileset).setDepth(9 + i * 0.1).setAlpha(0.3);
      const oLayer = map.createBlankLayer(`Objects_${i}`, tileset).setDepth(10 + i * 0.1);
      objectLayersTransparent.push(tLayer);
      objectLayers.push(oLayer);
    }

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
      'tree_2_0': 39, 'tree_2_1': 40, 'tree_2_2': 41,
      'grass_var1': 43, 'grass_var2': 44,
      'bench_0_0': 45, 'bench_0_1': 46, 'bench_0_2': 47,
      'bench_1_0': 50, 'bench_1_1': 51, 'bench_1_2': 52,
      'door_big_l': 53, 'door_big_r': 54,
      'school_wall_tl': 55, 'school_wall_t': 56, 'school_wall_tr': 57,
      'school_wall_l': 58, 'school_wall_c': 59, 'school_wall_r': 60,
      'school_wall_bl': 61, 'school_wall_b': 62, 'school_wall_br': 63,
      'school_wall_itl': 64, 'school_wall_itr': 65,
      'school_wall_ibl': 66, 'school_wall_ibr': 67,
      'school_floor': 68, 'school_floor2': 69
    };
    
    const solidTiles = ['wall', 'wall_top', 'school_wall_tl', 'school_wall_t', 'school_wall_tr', 'school_wall_l', 'school_wall_c', 'school_wall_r', 'school_wall_bl', 'school_wall_b', 'school_wall_br', 'school_wall_itl', 'school_wall_itr', 'school_wall_ibl', 'school_wall_ibr', 'bench_1_0', 'bench_1_1', 'bench_1_2', 'desk', 'board', 'table', 'chair', 'tree', 'tree_2_1', 'water', 'water_tl', 'water_tr', 'water_bl', 'water_br', 'bookshelf'];

    const mapData = this._getMapData(mapKey);

    // Populate the layers using the 2D array
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const cell = Array.isArray(mapData[r][c]) ? mapData[r][c] : [mapData[r][c]];
        const groundName = cell[0];
        const objects = cell.slice(1);

        const groundId = TILE_IDS[groundName] || 0;
        
        // ALWAYS put the base floor to prevent black spots
        // Deterministic hash with an 80% / 10% / 10% split
        let baseFloorId = TILE_IDS['school_floor'];
        if (mapKey === 'garden') {
          const hashValue = (r * 37 + c * 17) % 100;
          if (hashValue < 80) {
            baseFloorId = TILE_IDS['grass'];
          } else if (hashValue < 90) {
            baseFloorId = TILE_IDS['grass_var1'];
          } else {
            baseFloorId = TILE_IDS['grass_var2'];
          }
        }
        groundLayer.putTileAt(baseFloorId, c, r);

        if (objects.length > 0) {
          // We have a ground item and one or more objects
          if (groundId !== baseFloorId && groundName !== 'grass' && groundName !== 'grass2') {
            midLayer.putTileAt(groundId, c, r);
          }
          
          objects.forEach((objName, i) => {
            if (i >= objectLayers.length) return;
            const objId = TILE_IDS[objName];
            if (!objId) return;
            if (objName.startsWith('water')) {
              midLayer.putTileAt(objId, c, r);
            } else if (objName.startsWith('bench_1')) {
              midLayer.putTileAt(objId, c, r);
            } else {
              objectLayersTransparent[i].putTileAt(objId, c, r);
              objectLayers[i].putTileAt(objId, c, r);
            }
          });
        } else if (solidTiles.includes(groundName) || groundName.startsWith('door') || groundName.startsWith('bench')) {
          // If it's a solid object OR a bench piece that was placed without putObj somehow
          if (groundName.startsWith('water')) {
            midLayer.putTileAt(groundId, c, r);
          } else if (groundName === 'wall' || groundName === 'wall_top' || groundName.startsWith('school_wall_')) {
            midLayer.putTileAt(groundId, c, r);
          } else if (groundName.startsWith('bench_1')) {
            midLayer.putTileAt(groundId, c, r);
          } else {
            objectLayersTransparent[0].putTileAt(groundId, c, r);
            objectLayers[0].putTileAt(groundId, c, r);
          }
        } else {
          // It's a non-solid ground decoration
          if (groundId !== baseFloorId && groundName !== 'grass' && groundName !== 'grass2') {
            midLayer.putTileAt(groundId, c, r);
          }
        }
      }
    }

    // Set collision
    const collidableIds = solidTiles.map(name => TILE_IDS[name]).filter(id => id !== undefined);
    midLayer.setCollision(collidableIds);
    objectLayers.forEach(layer => layer.setCollision(collidableIds));

    this.walls = objectLayers;
    this.midWalls = midLayer;

    // Apply inverted BitmapMask to objectLayer to create a soft see-through hole for the player
    const radius = 40; // Smaller circle as requested
    const size = radius * 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    if (!this.textures.exists('softCircle')) {
      this.textures.addCanvas('softCircle', canvas);
    }
    
    this.playerMaskImage = this.make.image({ x: 0, y: 0, key: 'softCircle' }, false);
    const mask = new Phaser.Display.Masks.BitmapMask(this, this.playerMaskImage);
    mask.invertAlpha = true;
    objectLayers.forEach(layer => layer.setMask(mask));

    // Draw off-screen doors and walls at r = -1 for garden transition
    if (mapKey === 'garden') {
      const yPos = -1 * TILE + TILE / 2;
      const x10 = 10 * TILE + TILE / 2;
      const x11 = 11 * TILE + TILE / 2;
      
      this.add.sprite(x10, yPos, 'tileset_sheet', TILE_IDS['door_big_l']).setDepth(1);
      this.add.sprite(x11, yPos, 'tileset_sheet', TILE_IDS['door_big_r']).setDepth(1);
    }
  }

  /* ────── Map data for each area (Human Readable 2D Arrays) ────── */
  
  _autotileSchoolWalls(m) {
    const H = m.length;
    const W = m[0].length;
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        if (m[r][c].startsWith('school_wall')) {
          const topW = (r === 0 || m[r-1][c].startsWith('school_wall'));
          const botW = (r === H-1 || m[r+1][c].startsWith('school_wall'));
          const leftW = (c === 0 || m[r][c-1].startsWith('school_wall'));
          const rightW = (c === W-1 || m[r][c+1].startsWith('school_wall'));

          if (!topW && botW && !leftW && rightW) m[r][c] = 'school_wall_tl';
          else if (!topW && botW && leftW && rightW) m[r][c] = 'school_wall_t';
          else if (!topW && botW && leftW && !rightW) m[r][c] = 'school_wall_tr';
          else if (topW && botW && !leftW && rightW) m[r][c] = 'school_wall_l';
          else if (topW && botW && leftW && rightW) {
            const tlW = (r === 0 || c === 0 || m[r-1][c-1].startsWith('school_wall'));
            const trW = (r === 0 || c === W-1 || m[r-1][c+1].startsWith('school_wall'));
            const blW = (r === H-1 || c === 0 || m[r+1][c-1].startsWith('school_wall'));
            const brW = (r === H-1 || c === W-1 || m[r+1][c+1].startsWith('school_wall'));
            if (!tlW) m[r][c] = 'school_wall_itl';
            else if (!trW) m[r][c] = 'school_wall_itr';
            else if (!blW) m[r][c] = 'school_wall_ibl';
            else if (!brW) m[r][c] = 'school_wall_ibr';
            else m[r][c] = 'school_wall_c';
          }
          else if (topW && botW && leftW && !rightW) m[r][c] = 'school_wall_r';
          else if (topW && !botW && !leftW && rightW) m[r][c] = 'school_wall_bl';
          else if (topW && !botW && leftW && rightW) m[r][c] = 'school_wall_b';
          else if (topW && !botW && leftW && !rightW) m[r][c] = 'school_wall_br';
          else {
            if (!topW && !botW) m[r][c] = 'school_wall_b';
            else if (!leftW && !rightW) m[r][c] = 'school_wall_r';
            else m[r][c] = 'school_wall_c';
          }
        }
      }
    }
  }

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
      for (let r = 0; r <= 6; r++) { m[r][10] = 'path_3_1'; }
      for (let r = 0; r <= 6; r++) { m[r][11] = 'path_1_1'; }
      m[7][10] = 'path_3_2';
      m[7][11] = 'path_1_2';
      m[3][3] = 'grass_var1'; m[3][4] = 'grass_var2'; m[4][3] = 'grass_var1';
      m[11][15] = 'grass_var2'; m[11][16] = 'grass_var1'; m[12][16] = 'grass_var2';
      
      const putObj = (r, c, obj) => {
        if (Array.isArray(m[r][c])) {
          m[r][c].push(obj);
        } else {
          m[r][c] = [m[r][c], obj];
        }
      };
      
      const putBigTree = (r, c) => {
        putObj(r, c, 'tree_0_0'); putObj(r, c+1, 'tree_0_1'); putObj(r, c+2, 'tree_0_2');
        putObj(r+1, c, 'tree_1_0'); putObj(r+1, c+1, 'tree_1_1'); putObj(r+1, c+2, 'tree_1_2');
        putObj(r+2, c, 'tree_2_0'); putObj(r+2, c+1, 'tree_2_1'); putObj(r+2, c+2, 'tree_2_2');
      };
      putBigTree(2,2); putBigTree(2,17); putBigTree(10,1); putBigTree(4,15); putBigTree(10,5);
      putBigTree(6,5); putBigTree(6,14); putBigTree(9,8); putBigTree(4,8);
      putBigTree(9,15);

      putObj(10, 13, 'water_tl'); putObj(10, 14, 'water_tr');
      putObj(11, 13, 'water_bl'); putObj(11, 14, 'water_br');

      const putBigBench = (r, c) => {
        putObj(r-1, c, 'bench_0_0'); putObj(r-1, c+1, 'bench_0_1'); putObj(r-1, c+2, 'bench_0_2');
        putObj(r, c, 'bench_1_0'); putObj(r, c+1, 'bench_1_1'); putObj(r, c+2, 'bench_1_2');
      };

      putBigBench(6, 3);
      putBigBench(6, 12);
      putBigBench(1, 6);
      
      return m;
    }

    if (key === 'corridor') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      for (let c = 1; c < W - 1; c++) { m[1][c] = 'school_wall_top'; m[5][c] = 'school_wall'; m[6][c] = 'school_wall'; }
      m[5][5] = 'school_floor'; m[5][6] = 'school_floor'; m[5][14] = 'school_floor'; m[5][15] = 'school_floor';
      m[6][5] = 'school_floor'; m[6][6] = 'school_floor'; m[6][14] = 'school_floor'; m[6][15] = 'school_floor';
      for (let r = 2; r < 5; r++) {
        for (let c = 1; c < W - 1; c++) if (c % 3 === 0) m[r][c] = 'school_floor2';
      }
      m[8][2] = 'bookshelf'; m[8][3] = 'bookshelf'; m[8][4] = 'bookshelf';
      m[10][2] = 'bookshelf'; m[10][3] = 'bookshelf';
      m[12][2] = 'bookshelf'; m[12][3] = 'bookshelf';
      m[1][10] = 'board';
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r'; 
      m[0][5]  = 'door_big_l'; m[0][6]  = 'door_big_r'; 
      m[0][15] = 'door_big_l'; m[0][16] = 'door_big_r'; 
      m[H - 1][3] = 'door_big_l'; m[H - 1][4] = 'door_big_r';
      this._autotileSchoolWalls(m);
      return m;
    }

    if (key === 'classroom') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      m[1][9] = 'board'; m[1][10] = 'board'; m[1][11] = 'board';
      m[3][10] = 'desk';
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          m[6 + row * 2][4 + col * 3] = 'desk';
          m[7 + row * 2][4 + col * 3] = 'chair';
        }
      }
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'school_floor' && (r + c) % 5 === 0) m[r][c] = 'school_floor2';
      }
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      this._autotileSchoolWalls(m);
      return m;
    }

    if (key === 'auditorium') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      for (let c = 3; c < 17; c++) { m[2][c] = 'stage'; m[3][c] = 'stage'; }
      m[1][5] = 'board'; m[1][10] = 'board'; m[1][15] = 'board';
      for (let row = 0; row < 4; row++) {
        for (let col = 2; col < 18; col += 2) m[6 + row * 2][col] = 'chair';
      }
      for (let r = 4; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'school_floor' && (r * c) % 6 === 0) m[r][c] = 'school_floor2';
      }
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      this._autotileSchoolWalls(m);
      return m;
    }

    if (key === 'cafeteria') {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      const tablePositions = [
        { r: 3, c: 4 }, { r: 3, c: 11 }, { r: 8, c: 4 }, 
        { r: 8, c: 11 }, { r: 6, c: 16 }, { r: 11, c: 8 }
      ];
      tablePositions.forEach(({ r, c }) => {
        m[r][c] = 'table';
        if (r - 1 >= 1) m[r - 1][c] = 'chair';
        if (r + 1 < H - 1) m[r + 1][c] = 'chair';
        if (c - 1 >= 1 && m[r][c - 1] === 'school_floor') m[r][c - 1] = 'chair';
        if (c + 1 < W - 1 && m[r][c + 1] === 'school_floor') m[r][c + 1] = 'chair';
      });
      for (let c = 2; c < 8; c++) m[1][c] = 'desk';
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) if (m[r][c] === 'school_floor' && (r + c) % 4 === 0) m[r][c] = 'school_floor2';
      }
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      this._autotileSchoolWalls(m);
      return m;
    }

    return Array.from({ length: H }, () => Array(W).fill('grass'));
  }

  /* ────── NPC spawning per map ────── */
  _spawnNPCs(mapKey) {
    if (mapKey === 'garden') {
      // Nabula on the bench
      this.npcs.push(new NPC(this, 4 * TILE + TILE / 2, 6 * TILE + TILE / 2,
        'nabula', 'player_intro', { name: 'Nabula' }));
      
      // Generic NPC near the door
      this.npcs.push(new NPC(this, 7 * TILE + TILE / 2, 1 * TILE + TILE / 2,
        'student', null, { name: 'Student' }));
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
        'player', 'student_chat_1', { name: 'Nakula' }));
    }
  }

  /* ────── Interaction via E/Space key ────── */
  _tryInteract() {
    if (this.registry.get('dialogueActive')) return;

    const px = this.player.sprite.x;
    const py = this.player.sprite.y;
    const thresholdSq = (TILE * 1.8) * (TILE * 1.8);

    // Check NPC proximity
    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      if (!npc.dialogueId) continue;
      
      const dx = px - npc.sprite.x;
      const dy = py - npc.sprite.y;
      if (dx * dx + dy * dy < thresholdSq) {
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

    for (let i = 0; i < this.currentTransitions.length; i++) {
      const t = this.currentTransitions[i];
      if (px === t.fromX && Math.abs(py - t.fromY) <= 1) return true;
    }
    return false;
  }

  _checkDoor() {
    const px = Math.round((this.player.sprite.x - TILE / 2) / TILE);
    const py = Math.round((this.player.sprite.y - TILE / 2) / TILE);

    for (let i = 0; i < this.currentTransitions.length; i++) {
      const t = this.currentTransitions[i];
      if (px === t.fromX && Math.abs(py - t.fromY) <= 1) {
        this._changeMap(t.toMap, t.spawnX * TILE + TILE / 2, t.spawnY * TILE + TILE / 2);
        return;
      }
    }
  }

  /** Define all map transitions */
  _getTransitions(mapKey) {
    if (!this._transitionsCache) {
      this._transitionsCache = {
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
    }
    return this._transitionsCache[mapKey] || [];
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
