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
    const mapData = this._getMapData(mapKey);
    const mapW = mapData[0].length;
    const mapH = mapData.length;
    this._buildMap(mapKey, mapData);

    /* ── Player ── */
    let defaultSpawnX = 10;
    if (mapKey === 'garden') defaultSpawnX = 14;
    
    const px = this.spawnX || defaultSpawnX * TILE + TILE / 2;
    const py = this.spawnY || 7 * TILE + TILE / 2;
    this.player = new Player(this, px, py);
    this.player.sprite.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, mapW * TILE, mapH * TILE);

    /* ── NPCs ── */
    this.npcs = [];
    this._spawnNPCs(mapKey);

    /* ── Systems ── */
    this.scheduleMgr = new ScheduleManager(this, this.npcs);
    this.relationMgr = new RelationshipManager(this.registry);

    /* ── Collisions ── */
    this.physics.add.collider(this.player.sprite, this.walls);
    if (this.midWalls) this.physics.add.collider(this.player.sprite, this.midWalls);
    if (this.treeColliders) this.physics.add.collider(this.player.sprite, this.treeColliders);
    this.npcs.forEach(n => {
      this.physics.add.collider(this.player.sprite, n.sprite);
      if (this.treeColliders) this.physics.add.collider(n.sprite, this.treeColliders);
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

    /* ── Dialogue Action Listener ── */
    this.registry.events.on('dialogue_action', (action) => {
      if (action === 'nabula_smile_anim') {
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          nabula.clearEmotion();
          
          nabula.emotionBubble = this.add.graphics();
          nabula.emotionBubble.fillStyle(0xffffff, 0.95);
          nabula.emotionBubble.fillRoundedRect(-11, -11, 22, 22, 6);
          nabula.emotionBubble.fillTriangle(-3, 11, 3, 11, 0, 16);

          nabula.emotionText = this.add.text(0, 0, '😊', { fontSize: '12px' }).setOrigin(0.5, 0.45);
          nabula.emotionContainer = this.add.container(nabula.sprite.x, nabula.sprite.y - 35, [nabula.emotionBubble, nabula.emotionText]).setDepth(11);
          
          nabula.emotionOffset = 0;
          nabula.emotionTween = this.tweens.add({
            targets: nabula,
            emotionOffset: -4,
            yoyo: true,
            repeat: -1,
            duration: 1200,
            ease: 'Sine.easeInOut'
          });

          this.tweens.add({
            targets: nabula.sprite,
            y: nabula.sprite.y - 10,
            yoyo: true,
            duration: 150,
            ease: 'Power1'
          });
        }
      } else if (action === 'nabula_run_away') {
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          nabula.clearEmotion();
          nabula.dialogueId = 'nabula_found';
          
          this.tweens.add({
            targets: nabula.sprite,
            x: 5 * TILE + TILE / 2,
            y: 12 * TILE + TILE / 2,
            duration: 2000,
            onStart: () => {
              nabula.sprite.anims.play('nabula_walk_left', true);
            },
            onComplete: () => {
              nabula.sprite.anims.play('nabula_idle_down', true);
              // Give back her sad emotion
              nabula.emotionBubble = this.add.graphics();
              nabula.emotionBubble.fillStyle(0xffffff, 0.95);
              nabula.emotionBubble.fillRoundedRect(-11, -11, 22, 22, 6);
              nabula.emotionBubble.fillTriangle(-3, 11, 3, 11, 0, 16);
              nabula.emotionText = this.add.text(0, 0, '😔', { fontSize: '12px' }).setOrigin(0.5, 0.45);
              nabula.emotionContainer = this.add.container(nabula.sprite.x, nabula.sprite.y - 35, [nabula.emotionBubble, nabula.emotionText]).setDepth(11);
              nabula.emotionOffset = 0;
              nabula.emotionTween = this.tweens.add({
                targets: nabula,
                emotionOffset: -4,
                yoyo: true,
                repeat: -1,
                duration: 1200,
                ease: 'Sine.easeInOut'
              });
            }
          });
        }
      } else if (action === 'complete_level1') {
        this.registry.set('level1_complete', true);
        try { localStorage.setItem('caretech_scenario_1', 'true'); } catch(e){}
      } else if (action === 'complete_level2') {
        this.registry.set('level2_complete', true);
        try { localStorage.setItem('caretech_scenario_2', 'true'); } catch(e){}
      } else if (action === 'found_evidence_phone') {
        this.registry.set('evidence_phone', true);
        this._checkLevel3Ready();
      } else if (action === 'found_evidence_witness') {
        this.registry.set('evidence_witness', true);
        this._checkLevel3Ready();
      } else if (action === 'complete_level3') {
        this.registry.set('level3_complete', true);
        try { localStorage.setItem('caretech_scenario_3', 'true'); } catch(e){}
      } else if (['build_vent_corner', 'build_appreciation_box', 'build_peer_support'].includes(action)) {
        this.registry.set('built_project', action);
        this.registry.set('level4_complete', true);
        try { localStorage.setItem('caretech_scenario_4', 'true'); } catch(e){}
        
        // Find the initiative board and update its state so it doesn't prompt again
        const board = this.npcs.find(n => n.key === 'initiative_board');
        if (board) board.dialogueId = 'board_already_done';
      } else if (action === 'start_qte') {
        this.registry.set('qte_active', true);
        const victim = this.npcs.find(n => n.key === 'qte_victim');
        if (victim) victim.dialogueId = 'qte_success';
        
        if (this.qteArrow) this.qteArrow.setVisible(true);
        
        this.scene.get('UI').startQTETimer(20, () => {
          if (this.registry.get('qte_active')) {
            this.registry.set('qte_active', false);
            this.registry.set('dialogueActive', true);
            
            const v = this.npcs.find(n => n.key === 'qte_victim');
            if (v) v.dialogueId = null;
            
            this.scene.get('UI')._showNode('qte_fail');
          }
        });
      } else if (action === 'complete_level5') {
        this.registry.set('level5_complete', true);
        try { localStorage.setItem('caretech_scenario_5', 'true'); } catch(e){}
        this.registry.set('qte_active', false);
        this.scene.get('UI').stopQTETimer();
        if (this.qteArrow) this.qteArrow.destroy();
        
        // Update victim dialogue to thank you
        const victim = this.npcs.find(n => n.key === 'qte_victim');
        if (victim) {
            victim.dialogueId = 'victim_thanks';
        }

        // Make the bullies walk out the door
        const bullies = this.npcs.filter(n => n.key === 'bully');
        bullies.forEach((bully, idx) => {
          this.tweens.chain({
            targets: bully.sprite,
            tweens: [
              { y: 5 * TILE, duration: 800 }, // Move down clear of top tables
              { x: 10 * TILE + (idx * 15), duration: 1200 }, // Move left towards the center aisle
              { y: 15 * TILE, duration: 2500 } // Move down to exit
            ],
            onComplete: () => {
              bully.sprite.destroy();
              if (bully.indicator) bully.indicator.destroy();
            }
          });
        });
      }
    }, this);
    this.events.on('shutdown', () => {
      this.registry.events.off('dialogue_action');
    });

    /* ── Debug Grid (Row, Col) ── */
    this._drawDebugGrid(mapW, mapH);
  }

  _checkLevel3Ready() {
    if (this.registry.get('evidence_phone') && this.registry.get('evidence_witness')) {
      const rani = this.npcs.find(n => n.key === 'rani');
      if (rani) {
        rani.dialogueId = 'rani_report_ready';
      }
    }
  }

  update(time, delta) {

    // Trigger Level 5 (Cafeteria QTE)
    if (this.registry.get('currentMap') === 'cafeteria' &&
        this.registry.get('level4_complete') &&
        !this.registry.get('level5_triggered') &&
        !this.registry.get('dialogueActive')) {
      if (this.player.sprite.y < 12 * TILE) {
        this.registry.set('level5_triggered', true);
        this.registry.set('dialogueActive', true);
        this.scene.get('UI')._showNode('qte_intro');
      }
    }

    if (this.player) this.player.update(time, delta);
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].update(time, delta);
    }
    this._updatePlayerMask();

    /* ── Level 2 Auto-Trigger ── */
    if (this.registry.get('currentMap') === 'corridor' && this.registry.get('level1_complete') && !this.registry.get('level2_triggered')) {
      if (this.player.sprite.y < 9 * TILE && !this.registry.get('dialogueActive')) {
        this.registry.set('level2_triggered', true);
        
        // Stop player movement
        this.player.sprite.setVelocity(0, 0);
        this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
        
        // Start bully taunt dialogue
        this.scene.get('UI').startDialogue('bully_taunt');
      }
    }

    /* ── Check proximity for interaction prompt ── */
    this._updateProximity();
  }

  _updatePlayerMask() {
    if (!this.player || !this.playerMaskImage) return;

    const behindTree = this._isPlayerBehindTree();

    if (behindTree) {
      this.playerMaskImage.x = this.player.sprite.x;
      this.playerMaskImage.y = this.player.sprite.y - 16;
      this.playerMaskImage.setVisible(true);
      if (this.trunkLayer) this.trunkLayer.setDepth(6);
    } else {
      this.playerMaskImage.x = -1000;
      this.playerMaskImage.y = -1000;
      this.playerMaskImage.setVisible(false);
      if (this.trunkLayer) this.trunkLayer.setDepth(3);
    }

    if (this.bookshelfTiers && this.player) {
      const px = this.player.sprite.x;
      const py = this.player.sprite.y;
      for (const tier of this.bookshelfTiers) {
        const behindThisTier = tier.zones.some(z =>
          px >= z.minX && px <= z.maxX && py >= z.minY && py < z.maxY
        );
        tier.layer.setDepth(behindThisTier ? 6 : 3);
      }
    }
  }

  _isPlayerBehindTree() {
    if (!this.player || !this.treeCanopies || this.treeCanopies.length === 0) return false;
    const px = this.player.sprite.x;
    const py = this.player.sprite.y;
    return this.treeCanopies.some(tree =>
      px >= tree.minX && px <= tree.maxX && py >= tree.minY && py < tree.maxY
    );
  }

  /* ────── Debug Grid ────── */
  _drawDebugGrid(mapW, mapH) {
    const W = mapW || 20, H = mapH || 15;
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
  _buildMap(mapKey, mapData) {
    const H = mapData.length;
    const W = mapData[0].length;
    
    // Create an empty tilemap
    const map = this.make.tilemap({ tileWidth: TILE, tileHeight: TILE, width: W, height: H });
    const tileset = map.addTilesetImage('tileset', 'tileset');

    // Create blank layers
    const groundLayer = map.createBlankLayer('Ground', tileset);
    const midLayer = map.createBlankLayer('Mid', tileset);
    const midLayer2 = map.createBlankLayer('Mid2', tileset);
    this.trunkLayer = map.createBlankLayer('Trunks', tileset);
    const trunkLayer = this.trunkLayer;
    this.bottomWallLayer = map.createBlankLayer('BottomWalls', tileset);
    const bottomWallLayer = this.bottomWallLayer;
    
    groundLayer.setDepth(0);
    midLayer.setDepth(1);
    midLayer2.setDepth(2);
    trunkLayer.setDepth(3);
    bottomWallLayer.setDepth(6);

    // Find all base rows for bookshelves to give each tier its own layer
    const bookshelfBaseRows = new Set();
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const cell = Array.isArray(mapData[r][c]) ? mapData[r][c] : [mapData[r][c]];
        if (cell.includes('bookshelf_b') || cell.includes('bookshelf')) {
          bookshelfBaseRows.add(r);
        }
      }
    }

    this.bookshelfTiers = [];
    const bookshelfLayersByRow = {};
    bookshelfBaseRows.forEach(r => {
      const layer = map.createBlankLayer(`Bookshelves_${r}`, tileset).setDepth(3);
      bookshelfLayersByRow[r] = layer;
      this.bookshelfTiers.push({
        baseRow: r,
        layer: layer,
        zones: []
      });
    });
    
    // We create multiple object layers to support trees overlapping trees
    const objectLayersTransparent = [];
    const objectLayers = [];
    for (let i = 0; i < 3; i++) {
      const tLayer = map.createBlankLayer(`ObjectsTransparent_${i}`, tileset).setDepth(9 + i * 0.1).setAlpha(0.3);
      const oLayer = map.createBlankLayer(`Objects_${i}`, tileset).setDepth(10 + i * 0.1);
      objectLayersTransparent.push(tLayer);
      objectLayers.push(oLayer);
    }
    this.treeColliders = this.physics.add.staticGroup();
    this.treeCanopies = [];

    const TILE_IDS = {
  "empty": 0,
  "grass": 1,
  "grass2": 2,
  "path": 3,
  "path2": 4,
  "floor": 5,
  "floor2": 6,
  "door": 7,
  "bench": 8,
  "desk": 9,
  "board": 10,
  "chair": 11,
  "table": 12,
  "stage": 13,
  "flower": 14,
  "tree": 15,
  "water_0_0": 16,
  "water_1_0": 17,
  "water_2_0": 18,
  "water_3_0": 19,
  "water_0_1": 20,
  "water_1_1": 21,
  "water_2_1": 22,
  "water_3_1": 23,
  "water_0_2": 24,
  "water_1_2": 25,
  "water_2_2": 26,
  "water_3_2": 27,
  "water_0_3": 28,
  "water_1_3": 29,
  "water_2_3": 30,
  "water_3_3": 31,
  "water_0_4": 32,
  "water_1_4": 33,
  "water_2_4": 34,
  "water_3_4": 35,
  "bookshelf": 36,
  "bookshelf_t": 37,
  "bookshelf_b": 38,
  "path_1_3": 39,
  "path_1_4": 40,
  "path_2_2": 41,
  "path_2_0": 42,
  "path_2_4": 43,
  "path_2_3": 44,
  "path_3_1": 45,
  "path_1_1": 46,
  "path_3_2": 47,
  "path_1_2": 48,
  "tree_0_0": 49,
  "tree_0_1": 50,
  "tree_0_2": 51,
  "tree_1_0": 52,
  "tree_1_1": 53,
  "tree_1_2": 54,
  "tree_2_0": 55,
  "tree_2_1": 56,
  "tree_2_2": 57,
  "fountain_0_0": 58,
  "fountain_1_0": 59,
  "fountain_0_1": 60,
  "fountain_1_1": 61,
  "dummy_42": 62,
  "grass_var1": 63,
  "grass_var2": 64,
  "bench_0_0": 65,
  "bench_0_1": 66,
  "bench_0_2": 67,
  "dummy_48": 68,
  "dummy_49": 69,
  "bench_1_0": 70,
  "bench_1_1": 71,
  "bench_1_2": 72,
  "door_big_l": 73,
  "door_big_r": 74,
  "school_wall_tl": 75,
  "school_wall_t": 76,
  "school_wall_tr": 77,
  "school_wall_l": 78,
  "school_wall_c": 79,
  "school_wall_r": 80,
  "school_wall_bl": 81,
  "school_wall_b": 82,
  "school_wall_br": 83,
  "school_wall_itl": 84,
  "school_wall_itr": 85,
  "school_wall_ibl": 86,
  "school_wall_ibr": 87,
  "school_floor": 88,
  "school_floor2": 89,
  "tc_0_0": 90,
  "tc_0_1": 91,
  "tc_0_2": 92,
  "tc_1_0": 93,
  "tc_1_1": 94,
  "tc_1_2": 95,
  "tc_2_0": 96,
  "tc_2_1": 97,
  "tc_2_2": 98,
  "gw_t": 99,
  "gw_b": 100,
  "gw_l": 101,
  "gw_r": 102,
  "gw_lt": 103,
  "gw_lb": 104,
  "gw_rt": 105,
  "gw_rb": 106,
  "caf_srv_0_0": 107,
  "caf_srv_0_1": 108,
  "caf_srv_0_2": 109,
  "caf_srv_0_3": 110,
  "caf_srv_0_4": 111,
  "caf_srv_0_5": 112,
  "caf_srv_1_0": 113,
  "caf_srv_1_1": 114,
  "caf_srv_1_2": 115,
  "caf_srv_1_3": 116,
  "caf_srv_1_4": 117,
  "caf_srv_1_5": 118,
  "path_3_0": 119,
  "path_1_0": 120
};
    
    const solidTiles = ['gw_t', 'gw_b', 'gw_l', 'gw_r', 'gw_lt', 'gw_lb', 'gw_rt', 'gw_rb', 'school_wall_tl', 'school_wall_t', 'school_wall_tr', 'school_wall_l', 'school_wall_c', 'school_wall_r', 'school_wall_bl', 'school_wall_b', 'school_wall_br', 'school_wall_itl', 'school_wall_itr', 'school_wall_ibl', 'school_wall_ibr', 'bench_1_0', 'bench_1_1', 'bench_1_2', 'desk', 'board', 'table', 'chair', 'bookshelf', 'bookshelf_b', 'tc_1_1', 'caf_srv_0_0', 'caf_srv_0_1', 'caf_srv_0_2', 'caf_srv_0_3', 'caf_srv_0_4', 'caf_srv_0_5', 'caf_srv_1_0', 'caf_srv_1_1', 'caf_srv_1_2', 'caf_srv_1_3', 'caf_srv_1_4', 'caf_srv_1_5', 'fountain_0_0', 'fountain_1_0', 'fountain_0_1', 'fountain_1_1', 'water_0_0', 'water_1_0', 'water_2_0', 'water_3_0', 'water_0_1', 'water_1_1', 'water_2_1', 'water_3_1', 'water_0_2', 'water_1_2', 'water_2_2', 'water_3_2', 'water_0_3', 'water_1_3', 'water_2_3', 'water_3_3', 'water_0_4', 'water_1_4', 'water_2_4', 'water_3_4'];

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
            if (objName.startsWith('water') || objName.startsWith('fountain')) {
              midLayer2.putTileAt(objId, c, r);
            } else if (objName.startsWith('bench_1')) {
              midLayer.putTileAt(objId, c, r);
            } else if (objName.startsWith('bookshelf')) {
              const targetRow = (objName === 'bookshelf_t') ? (r + 1) : r;
              const targetLayer = bookshelfLayersByRow[targetRow] || bookshelfLayersByRow[r] || midLayer;
              targetLayer.putTileAt(objId, c, r);
            } else if (objName.startsWith('tree_2_') || objName === 'tree') {
              trunkLayer.putTileAt(objId, c, r);
            } else {
              objectLayersTransparent[i].putTileAt(objId, c, r);
              objectLayers[i].putTileAt(objId, c, r);
            }
          });
        } else if (solidTiles.includes(groundName) || groundName.startsWith('door') || groundName.startsWith('bench') || groundName.startsWith('tree') || groundName === 'bookshelf_t') {
          // If it's a solid object OR a tall object that needs to be in front
          if (groundName.startsWith('water') || groundName.startsWith('fountain')) {
            midLayer2.putTileAt(groundId, c, r);
          } else if (groundName.startsWith('bench_1')) {
            midLayer.putTileAt(groundId, c, r);
          } else if (groundName.startsWith('bookshelf')) {
            const targetRow = (groundName === 'bookshelf_t') ? (r + 1) : r;
            const targetLayer = bookshelfLayersByRow[targetRow] || bookshelfLayersByRow[r] || midLayer;
            targetLayer.putTileAt(groundId, c, r);
          } else if (groundName.startsWith('tree_2_') || groundName === 'tree') {
            trunkLayer.putTileAt(groundId, c, r);
          } else if (groundName === 'gw_t' || groundName === 'gw_lt' || groundName === 'gw_rt' || groundName === 'gw_l' || groundName === 'gw_r') {
            midLayer.putTileAt(groundId, c, r);
          } else if (groundName === 'gw_b' || groundName === 'gw_lb' || groundName === 'gw_rb') {
            bottomWallLayer.putTileAt(groundId, c, r);
          } else if (groundName === 'wall' || groundName === 'wall_top' || groundName.startsWith('school_wall_') || groundName === 'school_wall') {
            if (r === H - 1) {
              bottomWallLayer.putTileAt(groundId, c, r);
            } else {
              midLayer.putTileAt(groundId, c, r);
            }
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

        // Tree trunks get a special 50% centered hitbox instead of a full tile collision
        if (cell.includes('tree_2_1') || cell.includes('tree')) {
          const hitbox = this.add.rectangle(c * TILE + TILE / 2, r * TILE + TILE / 2, TILE * 0.5, TILE * 0.5);
          hitbox.setVisible(false);
          this.physics.add.existing(hitbox, true);
          this.treeColliders.add(hitbox);
        }

        // Record tree canopy bounds for behind-tree detection
        if (cell.includes('tree_0_0')) {
          this.treeCanopies.push({
            minX: c * TILE - 10,
            maxX: (c + 3) * TILE + 10,
            minY: r * TILE - 20,
            maxY: (r + 2) * TILE + 36
          });
        }
        if (cell.includes('tree')) {
          this.treeCanopies.push({
            minX: c * TILE - 10,
            maxX: (c + 1) * TILE + 10,
            minY: (r - 1) * TILE - 20,
            maxY: r * TILE + 36
          });
        }

        // Record bookshelf bounds for behind-bookshelf detection per tier
        if (cell.includes('bookshelf_b') || cell.includes('bookshelf')) {
          const tier = this.bookshelfTiers.find(t => t.baseRow === r);
          if (tier) {
            tier.zones.push({
              minX: (c - 0.2) * TILE,
              maxX: (c + 1.2) * TILE,
              minY: (r - 1.2) * TILE,
              maxY: r * TILE + 20
            });
            if (mapKey === 'corridor' && (c === 2 || c === 3)) {
              tier.zones.push({
                minX: 0,
                maxX: 2 * TILE + 8,
                minY: (r - 1.2) * TILE,
                maxY: r * TILE + 20
              });
            }
          }
        }
      }
    }

    // Set collision
    const collidableIds = solidTiles.map(name => TILE_IDS[name]).filter(id => id !== undefined);
    midLayer.setCollision(collidableIds);
    midLayer2.setCollision(collidableIds);
    trunkLayer.setCollision(collidableIds);
    this.bookshelfTiers.forEach(t => t.layer.setCollision(collidableIds));
    this.bottomWallLayer.setCollision(collidableIds);
    objectLayers.forEach(layer => layer.setCollision(collidableIds));

    this.walls = [...objectLayers, trunkLayer, ...this.bookshelfTiers.map(t => t.layer), this.bottomWallLayer];
    this.midWalls = [midLayer, midLayer2];

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
    
    this.playerMaskImage = this.make.image({ x: -1000, y: -1000, key: 'softCircle' }, false);
    this.playerMaskImage.setVisible(false);
    const mask = new Phaser.Display.Masks.BitmapMask(this, this.playerMaskImage);
    mask.invertAlpha = true;
    objectLayers.forEach(layer => layer.setMask(mask));

    // Draw off-screen doors and walls at r = -1 for garden transition
    if (mapKey === 'garden') {
      const yPos = -1 * TILE + TILE / 2;
      const x10 = 14 * TILE + TILE / 2;
      const x11 = 15 * TILE + TILE / 2;
      
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

    // Custom override: make walls beside doors look recessed
    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        if (m[r][c] === 'door_big_l' && c + 1 < W && m[r][c+1] === 'door_big_r') {
          if (r === 0) {
            if (c > 0) m[r][c-1] = 'school_wall_ibr';
            if (c + 2 < W) m[r][c+2] = 'school_wall_ibl';
          } else {
            if (c > 0) m[r][c-1] = 'school_wall_itl';
            if (c + 2 < W) m[r][c+2] = 'school_wall_itr';
          }
        }
      }
    }
  }

  _getMapData(key) {
    const W = 20, H = 15;

    if (key === 'garden') {
        const m = [
  ['gw_lt', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_rb', 'grass', 'path_3_1', 'path_1_1', 'grass', 'gw_lb', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_rt'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_r'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_r'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_r'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_r'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_3', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_r'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_0', ['path_2_0', 'fountain_0_0'], ['path_2_0', 'fountain_1_0'], 'path_3_0', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_r'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'fountain_0_1', 'fountain_1_1', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'gw_lb'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_3', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_1', 'grass', 'grass', 'water_1_3', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_4', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'water_1_3', 'water_3_2', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'water_1_3', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_3_2', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
  ['gw_lb', 'gw_lb', 'gw_lb', 'gw_lb', 'gw_rt', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0']
];
        
        // Tree placement
        const offset = 0; // Removing old offset logic
        
        const putBigTree = (r, c) => {
          if (r+2 >= m.length || c+2 >= m[0].length) return;
          putObj(r, c, 'tree_0_0'); putObj(r, c+1, 'tree_0_1'); putObj(r, c+2, 'tree_0_2');
          putObj(r+1, c, 'tree_1_0'); putObj(r+1, c+1, 'tree_1_1'); putObj(r+1, c+2, 'tree_1_2');
          putObj(r+2, c, 'tree_2_0'); putObj(r+2, c+1, 'tree_2_1'); putObj(r+2, c+2, 'tree_2_2');
        };
        
        const putObj = (r, c, name) => {
          if (r >= 0 && r < m.length && c >= 0 && c < m[0].length) {
            if (m[r][c] === 'grass' || m[r][c] === 'grass2' || m[r][c] === 'school_floor') {
              m[r][c] = [m[r][c], name];
            } else if (Array.isArray(m[r][c])) {
              m[r][c].push(name);
            } else {
              m[r][c] = [m[r][c], name];
            }
          }
        };

        putBigTree(13, 2);
        
        return m;
      }
       {
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));
      for (let c = 0; c < W; c++) { m[0][c] = 'school_wall_top'; m[H - 1][c] = 'school_wall'; }
      for (let r = 0; r < H; r++) { m[r][0] = 'school_wall'; m[r][W - 1] = 'school_wall'; }
      for (let c = 1; c < W - 1; c++) { m[1][c] = 'school_wall_top'; m[5][c] = 'school_wall'; m[6][c] = 'school_wall'; }
      m[5][5] = 'school_floor'; m[5][6] = 'school_floor'; m[5][14] = 'school_floor'; m[5][15] = 'school_floor';
      m[6][5] = 'school_floor'; m[6][6] = 'school_floor'; m[6][14] = 'school_floor'; m[6][15] = 'school_floor';
      for (let r = 2; r < 5; r++) {
        for (let c = 1; c < W - 1; c++) if (c % 3 === 0) m[r][c] = 'school_floor2';
      }
      for (const r of [8, 10, 12]) {
        m[r - 1][2] = 'bookshelf_t'; m[r][2] = 'bookshelf_b';
        m[r - 1][3] = 'bookshelf_t'; m[r][3] = 'bookshelf_b';
      }
      m[7][4] = 'bookshelf_t'; m[8][4] = 'bookshelf_b';
      m[1][10] = 'board';
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r'; 
      m[0][5]  = 'door_big_l'; m[0][6]  = 'door_big_r'; 
      m[1][5]  = 'school_floor'; m[1][6]  = 'school_floor';
      m[0][15] = 'door_big_l'; m[0][16] = 'door_big_r'; 
      m[1][15] = 'school_floor'; m[1][16] = 'school_floor';
      m[H - 1][3] = 'door_big_l'; m[H - 1][4] = 'door_big_r';
      this._autotileSchoolWalls(m);
      
      // Manual texture overrides for corridor
      m[0][4] = m[2][0];
      m[1][0] = m[2][0];
      m[0][0] = 'school_wall_c'; // Full wall tile
      m[6][0] = m[7][0];
      m[14][5] = m[5][7];
      m[14][2] = m[5][4];
      m[14][9] = m[5][4];
      m[14][12] = m[14][5];
      m[6][19] = m[7][19];
      m[1][19] = m[2][19];
      m[0][17] = m[2][19];
      m[0][11] = m[2][19];
      m[0][7] = m[2][19];
      m[0][9] = m[2][0];
      m[0][14] = m[2][0];
      m[0][19] = 'school_wall_c'; // Full wall tile
      
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
      for (const r of [3, 5, 7, 9]) {
        m[r - 1][1] = 'bookshelf_t'; m[r][1] = 'bookshelf_b';
        m[r - 1][18] = 'bookshelf_t'; m[r][18] = 'bookshelf_b';
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
        // Left side (organic layout)
        { r: 4, c: 3 }, { r: 7, c: 3 }, // Pushed together vertically
        { r: 5, c: 8 }, 
        { r: 9, c: 7 }, 
        { r: 12, c: 4 }, { r: 12, c: 8 }, 
        // Right side (organic layout)
        { r: 3, c: 17 },
        { r: 5, c: 14 }, { r: 5, c: 17 }, // Pushed together horizontally
        { r: 8, c: 13 }, { r: 9, c: 17 },
        { r: 12, c: 14 }, { r: 12, c: 17 }
      ];
      tablePositions.forEach(({ r, c }) => {
        m[r - 1][c - 1] = 'tc_0_0'; m[r - 1][c] = 'tc_0_1'; m[r - 1][c + 1] = 'tc_0_2';
        m[r][c - 1] = 'tc_1_0';     m[r][c] = 'tc_1_1';     m[r][c + 1] = 'tc_1_2';
        m[r + 1][c - 1] = 'tc_2_0'; m[r + 1][c] = 'tc_2_1'; m[r + 1][c + 1] = 'tc_2_2';
      });
      for (let c = 2; c < 8; c++) {
        m[0][c] = `caf_srv_0_${c - 2}`;
        m[1][c] = `caf_srv_1_${c - 2}`;
      }
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
      const offset = 10;
      if (!this.registry.get('level1_complete')) {
        // Nabula on the bench
        this.npcs.push(new NPC(this, (4 + offset) * TILE + TILE / 2, 6 * TILE + TILE / 2,
          'nabula', 'player_intro', { name: 'Nabula', emotion: '😔' }));
      }
      
      // Generic NPC near the door
      this.npcs.push(new NPC(this, (7 + offset) * TILE + TILE / 2, 1 * TILE + TILE / 2,
        'student', null, { name: 'Student' }));
      // Background students
      this.npcs.push(new NPC(this, (15 + offset) * TILE + TILE / 2, 9 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));
    }

    if (mapKey === 'corridor') {
      if (this.registry.get('level1_complete')) {
        this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 3 * TILE + TILE / 2,
          'bully', 'bully_taunt', { name: 'Bully' }));
        this.npcs.push(new NPC(this, 12 * TILE + TILE / 2, 3 * TILE + TILE / 2,
          'bully', null, { name: 'Bully 2' }));
        
        if (!this.registry.get('level2_triggered')) {
          // Nabula being mocked
          this.npcs.push(new NPC(this, 11 * TILE + TILE / 2, 4 * TILE + TILE / 2,
            'nabula', null, { name: 'Nabula', emotion: '😔' }));
        } else if (!this.registry.get('level2_complete')) {
          // Nabula hiding behind library
          this.npcs.push(new NPC(this, 5 * TILE + TILE / 2, 12 * TILE + TILE / 2,
            'nabula', 'nabula_found', { name: 'Nabula', emotion: '😔' }));
        }
      }
      
      // Riko lurking (always there or maybe also needs level 1?)
      // Let's keep him there for ambient.
      this.npcs.push(new NPC(this, 16 * TILE + TILE / 2, 8 * TILE + TILE / 2,
        'riko', 'riko_corridor', { name: 'Riko' }));

      // Level 4 Initiative Additions
      const project = this.registry.get('built_project');
      if (project === 'build_vent_corner') {
        this.npcs.push(new NPC(this, 2 * TILE + TILE / 2, 12 * TILE + TILE / 2,
          'student', 'board_interact', { name: 'Vent Corner', immovable: true }));
      } else if (project === 'build_appreciation_box') {
        const box = new NPC(this, 14 * TILE + TILE / 2, 3 * TILE + TILE / 2,
          'student', 'board_interact', { name: 'Appreciation Box', immovable: true });
        box.sprite.setAlpha(0); // Invisible box but glowing
        this.npcs.push(box);
      } else if (project === 'build_peer_support') {
        this.npcs.push(new NPC(this, 8 * TILE + TILE / 2, 6 * TILE + TILE / 2,
          'student', 'peer_supporter_chat', { name: 'Peer Supporter' }));
      }
    }

    if (mapKey === 'classroom') {
      this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 2 * TILE + TILE / 2,
        'rani', 'rani_intro', { name: 'Teacher Rani' }));
        
      if (this.registry.get('level2_complete')) {
        this.npcs.push(new NPC(this, 12 * TILE + TILE / 2, 2 * TILE + TILE / 2,
          'nabula', 'nabula_safe', { name: 'Nabula' }));
      }
        
      // The Witness
      this.npcs.push(new NPC(this, 6 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'witness_intro', { name: 'Witness' }));
        
      // The abandoned smartphone (evidence)
      const phone = new NPC(this, 4 * TILE + TILE / 2, 6 * TILE + TILE / 2,
        'student', 'evidence_phone', { name: 'Smartphone', immovable: true });
      phone.sprite.setAlpha(0); // Invisible, but has interaction radius and pulse indicator
      this.npcs.push(phone);
      
      // Also ensure if we enter the room and we already have both evidence, Rani's dialogue is ready
      this._checkLevel3Ready();
    }

    if (mapKey === 'auditorium') {
      this.npcs.push(new NPC(this, 8 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));
        
      // The Initiative Board (Middle board at row 1, col 10)
      const isBuilt = this.registry.get('level4_complete');
      const board = new NPC(this, 10 * TILE + TILE / 2, 1 * TILE + TILE / 2,
        'student', isBuilt ? 'board_already_done' : 'board_initiative_intro', { name: 'Initiative Board', immovable: true });
      board.key = 'initiative_board';
      board.sprite.setAlpha(0); // Invisible, attached to the tilemap board graphic
      this.npcs.push(board);
    }

    if (mapKey === 'cafeteria') {
      this.npcs.push(new NPC(this, 16 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_2', { name: 'Student' }));
      this.npcs.push(new NPC(this, 6 * TILE + TILE / 2, 10 * TILE + TILE / 2,
        'player', 'student_chat_1', { name: 'Nakula' }));
        
      if (!this.registry.get('level5_complete')) {
        const vx = 11 * TILE + TILE / 2;
        const vy = 3 * TILE + TILE / 2;
        
        const victim = new NPC(this, vx, vy,
          'student', null, { name: 'Victim', immovable: true });
        victim.key = 'qte_victim';
        this.npcs.push(victim);
        
        // Surrounding bullies
        this.npcs.push(new NPC(this, vx - TILE, vy, 'bully', null, { name: 'Bully 1', immovable: true })); // Left
        this.npcs.push(new NPC(this, vx + TILE, vy, 'bully', null, { name: 'Bully 2', immovable: true })); // Right
        this.npcs.push(new NPC(this, vx, vy - TILE, 'bully', null, { name: 'Bully 3', immovable: true })); // Top
          
        this.qteArrow = this.add.text(victim.sprite.x, victim.sprite.y - 40, '⬇', {
          fontFamily: 'sans-serif',
          fontSize: '32px',
          color: '#ef4444',
          stroke: '#ffffff',
          strokeThickness: 4
        }).setOrigin(0.5).setDepth(200).setVisible(false);
        
        this.tweens.add({
          targets: this.qteArrow,
          y: victim.sprite.y - 30,
          yoyo: true,
          repeat: -1,
          duration: 400
        });
      }
    }
  }

  /* ────── Interaction via E/Space key ────── */
  _tryInteract() {
    if (this.registry.get('dialogueActive')) return;

    const px = this.player.sprite.x;
    const py = this.player.sprite.y;
    let nearest = null;
    let nearestDistSq = (TILE * 1.8) * (TILE * 1.8);

    // Check NPC proximity
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

    if (nearest) {
      if (nearest.clearEmotion) nearest.clearEmotion();
      this.scene.get('UI').startDialogue(nearest.dialogueId);
      return;
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
          { fromX: 14, fromY: 0,  toMap: 'corridor',   spawnX: 10, spawnY: 13 },
          { fromX: 15, fromY: 0,  toMap: 'corridor',   spawnX: 10, spawnY: 13 }
        ],
        corridor: [
          { fromX: 10, fromY: 14, toMap: 'garden',      spawnX: 14, spawnY: 2  },
          { fromX: 11, fromY: 14, toMap: 'garden',      spawnX: 14, spawnY: 2  },
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