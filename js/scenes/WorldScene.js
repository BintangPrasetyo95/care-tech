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
  }

  update() {
    this.player.update();
    this.npcs.forEach(n => n.update());

    /* ── Check proximity for interaction prompt ── */
    this._updateProximity();
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

  /* ────── Map builder (procedural) ────── */
  _buildMap(mapKey) {
    const mapData = this._getMapData(mapKey);
    const H = mapData.length;
    const W = mapData[0].length;

    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const tileKey = mapData[r][c];
        const x = c * TILE + TILE / 2;
        const y = r * TILE + TILE / 2;

        if (tileKey === 'wall' || tileKey === 'wall_top') {
          // Walls are solid
          const wall = this.walls.create(x, y, tileKey);
          wall.setDepth(1);
        } else if (tileKey === 'door') {
          // Doors are walkable (transitions handled by interaction)
          this.add.image(x, y, 'door').setDepth(1);
        } else if (tileKey === 'bench' || tileKey === 'desk' || tileKey === 'board' ||
                   tileKey === 'table' || tileKey === 'chair' || tileKey === 'bookshelf') {
          // Solid interactable objects
          const obj = this.walls.create(x, y, tileKey);
          obj.setDepth(2);
        } else if (tileKey === 'tree') {
          // Trees are solid
          const tree = this.walls.create(x, y, tileKey);
          tree.setDepth(2);
        } else if (tileKey === 'water') {
          // Water is solid (can't walk on it)
          const water = this.walls.create(x, y, tileKey);
          water.setDepth(0);
        } else {
          // Floor tiles are non-solid
          this.add.image(x, y, tileKey).setDepth(0);
        }
      }
    }
  }

  /* ────── Map data for each area ────── */
  _getMapData(key) {
    const W = 20, H = 15;

    if (key === 'garden') {
      // School Garden — grass, paths, trees, flowers, benches
      const m = Array.from({ length: H }, (_, r) =>
        Array.from({ length: W }, (_, c) => {
          // Random grass variety
          return (r + c) % 7 === 0 ? 'grass2' : 'grass';
        })
      );
      // Border walls (school building edge)
      for (let c = 0; c < W; c++) { m[0][c] = 'wall'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      // Main path (horizontal)
      for (let c = 2; c < 18; c++) m[7][c] = 'path';
      // Side path (vertical) to door
      for (let r = 1; r < 7; r++) m[r][10] = 'path';
      // Flower patches
      m[3][3] = 'flower'; m[3][4] = 'flower'; m[4][3] = 'flower';
      m[11][15] = 'flower'; m[11][16] = 'flower'; m[12][16] = 'flower';
      // Trees
      m[2][2] = 'tree'; m[2][17] = 'tree'; m[12][2] = 'tree';
      m[4][15] = 'tree'; m[10][5] = 'tree';
      // Water feature (small pond)
      m[10][13] = 'water'; m[10][14] = 'water';
      m[11][13] = 'water'; m[11][14] = 'water';
      // Benches along the path
      m[6][5] = 'bench'; m[6][14] = 'bench';
      m[8][8] = 'bench';
      // Key bench — where Nabula sits
      m[5][10] = 'bench';
      // Door to corridor (top center)
      m[0][10] = 'door';
      return m;
    }

    if (key === 'corridor') {
      // School Corridor — floor, lockers (walls), doors to other areas
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      // Outer walls
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      // Corridor walls (creating a hallway shape)
      for (let c = 1; c < W - 1; c++) {
        m[1][c] = 'wall_top';  // top inner wall
        m[5][c] = 'wall';      // partition wall
      }
      // Opening in partition for passage
      m[5][5] = 'floor'; m[5][6] = 'floor';
      m[5][14] = 'floor'; m[5][15] = 'floor';
      // Floor variety
      for (let r = 2; r < 5; r++) {
        for (let c = 1; c < W - 1; c++) {
          m[r][c] = (c % 3 === 0) ? 'floor2' : 'floor';
        }
      }
      // Bookshelves in library area (bottom section)
      m[8][2] = 'bookshelf'; m[8][3] = 'bookshelf'; m[8][4] = 'bookshelf';
      m[10][2] = 'bookshelf'; m[10][3] = 'bookshelf';
      m[12][2] = 'bookshelf'; m[12][3] = 'bookshelf';
      // Board on wall
      m[1][10] = 'board';
      // Doors
      m[H - 1][10] = 'door'; // back to garden
      m[0][5]  = 'door';     // to classroom
      m[0][15] = 'door';     // to auditorium
      m[H - 1][3] = 'door';  // to cafeteria
      return m;
    }

    if (key === 'classroom') {
      // Classroom — desks in rows, teacher desk, board
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      // Walls
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      // Board at front
      m[1][9] = 'board'; m[1][10] = 'board'; m[1][11] = 'board';
      // Teacher desk
      m[3][10] = 'desk';
      // Student desks in grid (3 rows x 4 columns)
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 4; col++) {
          m[6 + row * 2][4 + col * 3] = 'desk';
          // Chair in front of each desk
          m[7 + row * 2][4 + col * 3] = 'chair';
        }
      }
      // Floor variety
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) {
          if (m[r][c] === 'floor' && (r + c) % 5 === 0) m[r][c] = 'floor2';
        }
      }
      // Door back to corridor
      m[H - 1][10] = 'door';
      return m;
    }

    if (key === 'auditorium') {
      // School Auditorium — stage, seating, display boards
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      // Walls
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      // Stage area (top section)
      for (let c = 3; c < 17; c++) {
        m[2][c] = 'stage'; m[3][c] = 'stage';
      }
      // Display boards on walls
      m[1][5] = 'board'; m[1][10] = 'board'; m[1][15] = 'board';
      // Seating rows
      for (let row = 0; row < 4; row++) {
        for (let col = 2; col < 18; col += 2) {
          m[6 + row * 2][col] = 'chair';
        }
      }
      // Floor variety
      for (let r = 4; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) {
          if (m[r][c] === 'floor' && (r * c) % 6 === 0) m[r][c] = 'floor2';
        }
      }
      // Door
      m[H - 1][10] = 'door';
      return m;
    }

    if (key === 'cafeteria') {
      // Cafeteria — tables, chairs, obstacles
      const m = Array.from({ length: H }, () => Array(W).fill('floor'));
      // Walls
      for (let c = 0; c < W; c++) { m[0][c] = 'wall_top'; m[H - 1][c] = 'wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'wall'; m[r][W - 1] = 'wall'; }
      // Tables with chairs (4 clusters)
      const tablePositions = [
        { r: 3, c: 4 }, { r: 3, c: 11 },
        { r: 8, c: 4 }, { r: 8, c: 11 },
        { r: 6, c: 16 }, { r: 11, c: 8 }
      ];
      tablePositions.forEach(({ r, c }) => {
        m[r][c] = 'table';
        // Chairs around table
        if (r - 1 >= 1) m[r - 1][c] = 'chair';
        if (r + 1 < H - 1) m[r + 1][c] = 'chair';
        if (c - 1 >= 1 && m[r][c - 1] === 'floor') m[r][c - 1] = 'chair';
        if (c + 1 < W - 1 && m[r][c + 1] === 'floor') m[r][c + 1] = 'chair';
      });
      // Serving counter (wall-like)
      for (let c = 2; c < 8; c++) m[1][c] = 'desk';
      // Floor variety
      for (let r = 2; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) {
          if (m[r][c] === 'floor' && (r + c) % 4 === 0) m[r][c] = 'floor2';
        }
      }
      // Door
      m[H - 1][10] = 'door';
      return m;
    }

    // Default fallback — empty grass field
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
        { fromX: 10, fromY: 0,  toMap: 'corridor',   spawnX: 10, spawnY: 13 }
      ],
      corridor: [
        { fromX: 10, fromY: 14, toMap: 'garden',      spawnX: 10, spawnY: 2  },
        { fromX: 5,  fromY: 0,  toMap: 'classroom',   spawnX: 10, spawnY: 13 },
        { fromX: 15, fromY: 0,  toMap: 'auditorium',  spawnX: 10, spawnY: 13 },
        { fromX: 3,  fromY: 14, toMap: 'cafeteria',   spawnX: 10, spawnY: 13 }
      ],
      classroom: [
        { fromX: 10, fromY: 14, toMap: 'corridor',    spawnX: 5,  spawnY: 2  }
      ],
      auditorium: [
        { fromX: 10, fromY: 14, toMap: 'corridor',    spawnX: 15, spawnY: 2  }
      ],
      cafeteria: [
        { fromX: 10, fromY: 14, toMap: 'corridor',    spawnX: 3,  spawnY: 12 }
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
