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
    this.mapW = mapW;
    this.mapH = mapH;
    this._buildMap(mapKey, mapData);

    /* ── Player ── */
    let defaultSpawnX = 10;
    let defaultSpawnY = 7;
    if (mapKey === 'garden') { defaultSpawnX = 14; defaultSpawnY = 1.5; }
    if (mapKey === 'schoolyard') defaultSpawnX = 21;
    if (mapKey === 'library') { defaultSpawnX = 1; defaultSpawnY = 9; }
    if (mapKey === 'cafeteria') { defaultSpawnX = 15; defaultSpawnY = 9; }

    const px = this.spawnX || (defaultSpawnX * TILE + TILE / 2);
    const py = this.spawnY || (defaultSpawnY * TILE);
    this.player = new Player(this, px, py);
    this.player.sprite.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, mapW * TILE, mapH * TILE);
    this.cameras.main.setBounds(0, 0, mapW * TILE, mapH * TILE);

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

    const isBranchBCafeteriaArrival = (mapKey === 'cafeteria' && this.registry.get('level1_branch_b_bu_wati_at_cafeteria') && !this.registry.get('level1_branch_b_reached_table'));
    const isGardenIntro = (mapKey === 'garden' && !this.registry.get('level1_001_done'));

    if (isGardenIntro) {
      // Kamera tetap diam terpusat di (3.5, 14): X = 14 * TILE + TILE / 2 = 928, Y = 3.5 * TILE = 224
      const camX = 14 * TILE + TILE / 2;
      const camY = 3.5 * TILE;
      this.cameras.main.centerOn(camX, camY);
    } else if (!isBranchBCafeteriaArrival) {
      this.cameras.main.startFollow(this.player.sprite, true, 1, 1);
      /* ── Camera Fade In (Gelap ke Terang) ── */
      this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    // Ambient Audio per Map (Kantin/Cafeteria: crowd.mp3 loop volume 30%)
    if (window.audioManager) {
      if (mapKey === 'cafeteria') {
        window.audioManager.playLoop('crowd', 0.3);
      } else {
        window.audioManager.stopLoop('crowd', 0.4);
      }
    }
    const savedZoom = (typeof localStorage !== 'undefined' && parseFloat(localStorage.getItem('caretech_zoom'))) || this.registry.get('cameraZoom') || SCALE;
    this.registry.set('cameraZoom', savedZoom);
    this.cameras.main.setZoom(savedZoom);
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

    /* ── Check Level 1 Arrival at Library (Quest Complete & Cutscene 016/017) ── */
    if (mapKey === 'library') {
      this._libraryCutsceneRunning = false;
      const activeQuest = this.registry.get('level1_quest_active');
      const is017Done = this.registry.get('level1_017_done');
      const isGardenPhaseDone = this.registry.get('level1_nabula_left_garden') === true ||
        activeQuest === 'ikuti_nabula' ||
        activeQuest === 'susul_nabula_timed';

      console.log(`%c[Perpus] Masuk map library. activeQuest: "${activeQuest}", 017_done: ${is017Done}, isGardenDone: ${isGardenPhaseDone}`, 'color: #38bdf8; font-weight: bold;');

      // JALUR B (Babak 4): Lapor Bu Wati di perpustakaan
      if (activeQuest === 'lapor_bu_wati_branch_b') {
        console.log('%c[Perpus 059b] Nakula tiba di perpustakaan untuk mencari Bu Wati (Jalur B)!', 'color: #10b981; font-weight: bold;');
        this._libraryCutsceneRunning = false;
        this.registry.set('level1_017_done', true);
        this.registry.set('level1_020_done', true);
        this.registry.set('level1_player_locked', false);
        if (this.player) this.player.isLocked = false;
        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('QUEST: Cari Bu Wati di perpustakaan.');
        }
      } else if (isGardenPhaseDone && !is017Done && !this.registry.get('level1_049_done')) {
        this.registry.set('level1_library_arrived', true);

        if (activeQuest === 'ikuti_nabula' || activeQuest === 'susul_nabula_timed') {
          this.registry.set('level1_quest_active', null);
          const questName = (activeQuest === 'ikuti_nabula') 
            ? 'Ikuti Nabula ke perpustakaan' 
            : 'Susul Nabula ke perpustakaan';
          this.time.delayedCall(200, () => {
            const ui = this.scene.get('UI');
            if (ui && ui.completeQuest) {
              ui.completeQuest(questName);
            }
          });
        }

        // Jalankan cutscene setelah fade-in layar perpustakaan selesai
        this.time.delayedCall(300, () => {
          if (!this._libraryCutsceneRunning && !this.registry.get('level1_017_done') && this.registry.get('level1_quest_active') !== 'lapor_bu_wati_branch_b' && !this.registry.get('level1_049_done')) {
            console.log('[Perpus 017] Pemicu timer create() memanggil _startLibraryCutscene()...');
            this._startLibraryCutscene();
          }
        });
      }
    }

    /* ── Check Level 2 Arrival at Cafeteria (Cutscene 018) ── */
    if (mapKey === 'cafeteria' && this.registry.get('level2_started') && !this.registry.get('level2_cafeteria_arrived')) {
      this.registry.set('level2_cafeteria_arrived', true);
      const ui = this.scene.get('UI');
      if (ui && ui.completeQuest) {
        ui.completeQuest('Pergi ke Kantin untuk Makan Siang');
      }
      this.time.delayedCall(400, () => {
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl2_018_effect');
        }
      });
    }

    /* ── Check Level 1 Arrival at Cafeteria (Quest Complete & Cutscene 049) ── */
    if (mapKey === 'cafeteria' && !this.registry.get('level2_started')) {
      this._cafeteriaCutsceneRunning = false;
      const activeQuest = this.registry.get('level1_quest_active');
      const is049Done = this.registry.get('level1_049_done');
      const isCluePhaseDone = activeQuest === 'pergi_ke_kantin' || (this.registry.get('level1_clues_found') >= 3);

      console.log(`%c[Kantin 049] Masuk map cafeteria. activeQuest: "${activeQuest}", 049_done: ${is049Done}, isClueDone: ${isCluePhaseDone}`, 'color: #38bdf8; font-weight: bold;');

      // Pastikan Nakula selalu menghadap kiri saat tiba di kantin
      if (this.player) {
        this.player.facing = 'left';
        if (this.player.sprite) {
          this.player.sprite.setFlipX(true);
          this.player.sprite.anims.play('player_idle_left', true);
        }
      }

      if (isCluePhaseDone && !is049Done) {
        this.registry.set('level1_cafeteria_arrived', true);

        if (activeQuest === 'pergi_ke_kantin') {
          this.registry.set('level1_quest_active', null);
          this.time.delayedCall(200, () => {
            const ui = this.scene.get('UI');
            if (ui && ui.completeQuest) {
              ui.completeQuest('Pergi ke kantin.');
            }
          });
        }

        // Jalankan cutscene setelah fade-in layar kantin selesai
        this.time.delayedCall(300, () => {
          if (!this._cafeteriaCutsceneRunning && !this.registry.get('level1_049_done')) {
            console.log('[Kantin 049] Pemicu timer create() memanggil _startCafeteriaCutscene()...');
            this._startCafeteriaCutscene();
          }
        });
      }
    }

    /* ── Check Level 1 Branch C: Arrival at Garden to find Nabula (059c) ── */
    if (mapKey === 'garden' && (this.registry.get('level1_quest_active') === 'cari_nabula_taman_branch_c' || this.registry.get('level1_nabula_at_garden_branch_c'))) {
      console.log('%c[Taman 059c] Nakula tiba di taman mencari Nabula (Jalur C)!', 'color: #10b981; font-weight: bold;');
      this.registry.set('level1_003_triggered', true);
      this.registry.set('level1_005_done', true);
      this.registry.set('level1_007_done', true);
      this.registry.set('level1_nabula_left_garden', true);
      this.registry.set('level1_player_locked', false);
      if (this.player) this.player.isLocked = false;
      const ui = this.scene.get('UI');
      if (ui && ui.showQuest) {
        ui.showQuest('QUEST: Cari Nabula di taman.');
      }
    }



    /* ── Check Level 1 Branch B: Arrival at Cafeteria with Bu Wati ── */
    if (mapKey === 'cafeteria' && this.registry.get('level1_branch_b_bu_wati_at_cafeteria') && !this.registry.get('level1_branch_b_reached_table')) {
      console.log('%c[Kantin 059b] Bu Wati & Nakula tiba di kantin! Kamera langsung di Nabula & layar kembali terang...', 'color: #38bdf8; font-weight: bold;');
      this.registry.set('level1_player_locked', true);
      if (this.player) {
        this.player.isLocked = true;
        this.player.facing = 'left';
        if (this.player.sprite) {
          this.player.sprite.setFlipX(true);
          this.player.sprite.anims.play('player_idle_left', true);
        }
      }

      // Kamera langsung di meja Nabula (11.9, 6)
      const nabulaX = 11.9 * TILE + TILE / 2;
      const nabulaY = 6 * TILE + TILE / 2;
      this.cameras.main.stopFollow();
      this.tweens.killTweensOf(this.cameras.main);
      this.cameras.main.centerOn(nabulaX, nabulaY);

      // Layar kembali terang (fadeIn dari hitam)
      this.cameras.main.fadeIn(600, 0, 0, 0);

      this.time.delayedCall(500, () => {
        const ui = this.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl1_059b_8_effect');
        }
      });
    }

    /* ── Check Level 1 Branch C: Arrival at Library with Nabula ── */
    if (mapKey === 'library' && this.registry.get('level1_branch_c_nabula_at_library') && !this.registry.get('level1_branch_c_reached_wati')) {
      console.log('%c[Perpustakaan 059c] Nakula & Nabula tiba di perpustakaan...', 'color: #38bdf8; font-weight: bold;');
      this.registry.set('level1_player_locked', true);
      if (this.player) {
        this.player.isLocked = true;
        this.player.facing = 'right';
        if (this.player.sprite) {
          this.player.sprite.setFlipX(false);
          this.player.sprite.anims.play('player_idle_right', true);
        }
      }

      const onScreenFullyBright = () => {
        console.log('%c[Perpustakaan 059c] Layar sudah 100% terang! Menampilkan dialog lvl1_059c_24_effect...', 'color: #22c55e; font-weight: bold;');
        const ui = this.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl1_059c_24_effect');
        }
      };

      // Pastikan layar sudah 100% terang baru dialog 059c-24 muncul dan action walk_to_wati berjalan
      if (this.cameras.main.fadeEffect && this.cameras.main.fadeEffect.isRunning) {
        this.cameras.main.once('camerafadeincomplete', () => {
          this.time.delayedCall(100, onScreenFullyBright);
        });
      } else {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.cameras.main.once('camerafadeincomplete', () => {
          this.time.delayedCall(100, onScreenFullyBright);
        });
      }
    }

    // Pasang helper debug console untuk pengujian cepat
    window.testCutscene017 = () => {
      console.log('%c[DEBUG] Memulai paksa Cutscene 017...', 'color: #f43f5e; font-weight: bold;');
      this.registry.set('level1_nabula_left_garden', true);
      this.registry.set('level1_017_done', false);
      this._libraryCutsceneRunning = false;
      if (this.registry.get('currentMap') !== 'library') {
        this._changeMap('library', 1 * TILE + TILE / 2, 9 * TILE + TILE / 2);
      } else {
        this._startLibraryCutscene();
      }
    };
    window.testCutscene049 = () => {
      console.log('%c[DEBUG] Memulai paksa Cutscene 049 di Kantin...', 'color: #f43f5e; font-weight: bold;');
      if (window.audioManager) {
        window.audioManager.unlock();
        window.audioManager.playLoop('crowd', 0.3);
      }
      this.registry.set('level1_quest_active', 'pergi_ke_kantin');
      this.registry.set('level1_clues_found', 3);
      this.registry.set('level1_049_done', false);
      this.registry.set('level1_049_triggered', false);
      this._cafeteriaCutsceneRunning = false;
      if (this.registry.get('currentMap') !== 'cafeteria') {
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
      } else {
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          nabula.sprite.setPosition(11.9 * TILE + TILE / 2, 6 * TILE + TILE / 2);
          nabula.sprite.anims.play('nabula_idle_down', true);
        }
        const bagas = this.npcs.find(n => n.key === 'bagas');
        if (bagas) {
          bagas.sprite.setPosition(13.3 * TILE + TILE / 2, 4 * TILE + TILE / 2);
          bagas.sprite.setFlipX(false);
          bagas.sprite.anims.play('bagas_idle_down', true);
        }
        const rio = this.npcs.find(n => n.key === 'rio');
        if (rio) {
          rio.sprite.setPosition(14.3 * TILE + TILE / 2, 4 * TILE + TILE / 2);
          rio.sprite.setFlipX(false);
          rio.sprite.anims.play('rio_idle_down', true);
        }
        if (this.player && this.player.sprite) {
          this.player.sprite.setPosition(29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
          this.player.facing = 'left';
          this.player.sprite.setFlipX(true);
          this.player.sprite.anims.play('player_idle_left', true);
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.centerOn(29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
        }
        this._startCafeteriaCutscene();
      }
    };
    window.testChoice058 = () => {
      console.log('%c[DEBUG] Membuka langsung UI 3 Pilihan Strategis 058...', 'color: #f43f5e; font-weight: bold;');
      if (window.audioManager) {
        window.audioManager.unlock();
        window.audioManager.playLoop('crowd', 0.3);
        window.audioManager.playLoop('clockTicking', 0.4);
      }
      this._cafeteriaChoiceTimeoutCount = 0;
      this.registry.set('level1_quest_active', 'pergi_ke_kantin');
      this.registry.set('level1_clues_found', 3);
      this.registry.set('level1_049_done', true);
      this._cafeteriaCutsceneRunning = false;
      const ui = this.scene.get('UI');

      const launch = () => {
        if (ui && ui.showQuest) {
          ui.showQuest('PILIH TINDAKAN (BATAS WAKTU: 15 DETIK)', {
            hasTimer: true,
            durationSec: 15,
            onTimeout: () => {
              this.handleCafeteriaChoiceTimeout();
            }
          });
        }
        this.panCameraTo(11.9 * TILE + TILE / 2, 6 * TILE + TILE / 2, 0);
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl1_058_choice');
        }
      };

      if (this.registry.get('currentMap') !== 'cafeteria') {
        this.registry.set('currentMap', 'cafeteria');
        this.scene.restart({ spawnX: 29 * TILE + TILE / 2, spawnY: 13 * TILE + TILE / 2 });
        setTimeout(launch, 350);
      } else {
        launch();
      }
    };
    window.testTimeout1 = () => {
      console.log('%c[DEBUG] Mensimulasikan Timeout ke-1 (Ragu-ragu)...', 'color: #f43f5e; font-weight: bold;');
      this._cafeteriaChoiceTimeoutCount = 0;
      this.handleCafeteriaChoiceTimeout();
    };
    window.testTimeout2 = () => {
      console.log('%c[DEBUG] Mensimulasikan Timeout ke-2 (Terlambat & Bubar)...', 'color: #f43f5e; font-weight: bold;');
      this._cafeteriaChoiceTimeoutCount = 1;
      this.handleCafeteriaChoiceTimeout();
    };
    window.testBranchA = () => {
      console.log('%c[DEBUG] Menguji Jalur A (Konfrontasi Langsung)...', 'color: #3b82f6; font-weight: bold;');
      this.registry.set('level1_049_done', true);
      this.registry.set('level1_route_chosen', 'A');
      const ui = this.scene.get('UI');
      if (this.registry.get('currentMap') !== 'cafeteria') {
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
        this.time.delayedCall(400, () => {
          if (ui && ui.startDialogue) ui.startDialogue('lvl1_059a_1_narrator');
        });
      } else {
        if (this.player && this.player.sprite) {
          this.player.sprite.setPosition(29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
        }
        if (ui && ui.startDialogue) ui.startDialogue('lvl1_059a_1_narrator');
      }
    };
    window.test003 = () => {
      console.log('%c[DEBUG] Menguji Node 003 di Taman (Kamera ke Nabula)...', 'color: #3b82f6; font-weight: bold;');
      const ui = this.scene.get('UI');
      if (ui && ui.startDialogue) ui.startDialogue('lvl1_003_eca');
    };
    window.test005a = () => {
      console.log('%c[DEBUG] Menguji Jalur 005a (Ayo Bicara Dengannya - Kamera ke Nakula)...', 'color: #3b82f6; font-weight: bold;');
      const ui = this.scene.get('UI');
      if (ui && ui.startDialogue) ui.startDialogue('lvl1_005a_1');
    };
    window.test005b = () => {
      console.log('%c[DEBUG] Menguji Jalur 005b (Aku Nggak Peduli)...', 'color: #3b82f6; font-weight: bold;');
      const ui = this.scene.get('UI');
      if (ui && ui.startDialogue) ui.startDialogue('lvl1_005b_1');
    };
    window.testBranchB = () => {
      console.log('%c[DEBUG] Menguji Jalur B (Lapor Bu Wati)...', 'color: #3b82f6; font-weight: bold;');
      this.registry.set('level1_049_done', true);
      this.registry.set('level1_route_chosen', 'B');
      const ui = this.scene.get('UI');
      if (ui && ui.startDialogue) ui.startDialogue('lvl1_059b_1_nakula');
    };
    window.testBranchC = () => {
      console.log('%c[DEBUG] Menguji Jalur C (Dukungan Emosional)...', 'color: #3b82f6; font-weight: bold;');
      this.registry.set('level1_049_done', true);
      this.registry.set('level1_route_chosen', 'C');
      const ui = this.scene.get('UI');
      if (this.registry.get('currentMap') !== 'cafeteria') {
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
        this.time.delayedCall(400, () => {
          if (ui && ui.startDialogue) ui.startDialogue('lvl1_059c_1_narrator');
        });
      } else {
        if (ui && ui.startDialogue) ui.startDialogue('lvl1_059c_1_narrator');
      }
    };
    window.testConvergence060 = () => {
      console.log('%c[DEBUG] Menguji Node 060 (Titik Temu)...', 'color: #3b82f6; font-weight: bold;');
      const ui = this.scene.get('UI');
      if (ui && ui.startDialogue) ui.startDialogue('lvl1_060_narrator');
    };
    window.testEmergencyQuest = () => {
      console.log('%c[DEBUG] Mensimulasikan Quest Darurat 058x (30s)...', 'color: #ef4444; font-weight: bold;');
      this.registry.set('level1_049_done', true);
      this.registry.set('level1_058x_bullies_left', true);
      this.registry.set('level1_058x_nabula_left', true);
      this.registry.set('level1_nabula_at_garden_emergency', true);
      const ui = this.scene.get('UI');
      if (this.registry.get('currentMap') !== 'cafeteria') {
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
        this.time.delayedCall(400, () => {
          if (ui && ui.startDialogue) ui.startDialogue('lvl1_058x_7_eca');
        });
      } else {
        if (ui && ui.startDialogue) ui.startDialogue('lvl1_058x_7_eca');
      }
    };
    window.testNabulaRunsAwayEmergency = () => {
      console.log('%c[DEBUG] Menguji Adegan Nabula Lari Keluar (058x-6 & Kamera)...', 'color: #f59e0b; font-weight: bold;');
      this.registry.set('level1_049_done', true);
      const ui = this.scene.get('UI');
      if (this.registry.get('currentMap') !== 'cafeteria') {
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
        this.time.delayedCall(400, () => {
          if (ui && ui.startDialogue) ui.startDialogue('lvl1_058x_6_narrator');
        });
      } else {
        if (ui && ui.startDialogue) ui.startDialogue('lvl1_058x_6_narrator');
      }
    };
    window.debugLevel1State = () => {
      console.table({
        currentMap: this.registry.get('currentMap'),
        level1_quest_active: this.registry.get('level1_quest_active'),
        level1_012_completed: this.registry.get('level1_012_completed'),
        level1_nabula_left_garden: this.registry.get('level1_nabula_left_garden'),
        level1_library_arrived: this.registry.get('level1_library_arrived'),
        level1_017_done: this.registry.get('level1_017_done'),
        level1_cafeteria_arrived: this.registry.get('level1_cafeteria_arrived'),
        level1_049_triggered: this.registry.get('level1_049_triggered'),
        level1_049_done: this.registry.get('level1_049_done'),
        level1_player_locked: this.registry.get('level1_player_locked'),
        _libraryCutsceneRunning: this._libraryCutsceneRunning,
        _cafeteriaCutsceneRunning: this._cafeteriaCutsceneRunning
      });
    };

    /* ── Action Executor & Level-based Cutscene Action Modules ── */
    this.actionExecutor = new ActionExecutor(this);
    if (window.LEVEL_1_ACTIONS) {
      this.actionExecutor.registerHandlers(window.LEVEL_1_ACTIONS);
    }
    if (window.LEVEL_2_ACTIONS) {
      this.actionExecutor.registerHandlers(window.LEVEL_2_ACTIONS);
    }

    this.registry.events.on('dialogue_action', (action) => {
      this.actionExecutor.executeAction(action);
    }, this);

    /* ── Listen for Level 1 start from Level Select Modal ── */
    this.game.events.on('start_level_1', () => {
      const ui = this.scene.get('UI');
      if (ui && ui.startLevel1IntroTransition) {
        ui.startLevel1IntroTransition();
      }
    });

    /* ── Listen for Level 2 start from Level Select Modal ── */
    this.game.events.on('start_level_2', () => {
      this.startLevel2();
    });

    this.events.on('shutdown', () => {
      this._clearDebugGrid();
      this.registry.events.off('dialogue_action');
      if (this.game && this.game.events) {
        this.game.events.off('start_level_1');
        this.game.events.off('start_level_2');
      }
    });

    /* ── Debug Grid (Row, Col) ── */
    const isDebugActive = Boolean(this.registry.get('debugMode') || (typeof window !== 'undefined' && window.debugMode && window.debugMode.valueOf && window.debugMode.valueOf() === true));
    if (isDebugActive) {
      this.setDebugMode(true);
    }
  }

  /* ══════════ Level 2 Startup & Classroom Setup ══════════ */
  startLevel2() {
    console.log('%c[WorldScene] Starting Level 2: Managing Emotions...', 'color: #38bdf8; font-weight: bold;');
    this.registry.set('level2_started', true);
    this.registry.set('level2_branch_choice', null);
    this.registry.set('level2_breathing_done', false);
    this.registry.set('level2_002_done', false);
    this.registry.set('level2_cafeteria_arrived', false);
    this.registry.set('level2_queue_joined', false);
    this.registry.set('level2_020_done', false);
    this.registry.set('level2_complete', false);
    this.registry.set('level2_player_locked', true);
    this.registry.set('harmony', 50);

    if (window.audioManager) {
      window.audioManager.stopAllLoops(0.2);
    }

    const targetX = 7 * TILE + TILE / 2;
    const targetY = 9 * TILE + TILE / 2;

    const initiateClassroomIntro = () => {
      if (this.player && this.player.sprite) {
        this.player.isLocked = true;
        this.player.isCutsceneActive = true;
        this.player.facing = 'up';
        this.player.sprite.setFlipX(false);
        this.player.sprite.setPosition(targetX, targetY);
        if (this.player.sprite.body) this.player.sprite.body.reset(targetX, targetY);
        if (this.player.sprite.anims) {
          this.player.sprite.anims.play('player_idle_up', true);
        }
      }
      this.cameras.main.stopFollow();
      this.tweens.killTweensOf(this.cameras.main);
      this.cameras.main.centerOn(targetX, targetY);

      const ui = this.scene.get('UI');
      if (ui && ui.startLevel2IntroTransition) {
        ui.startLevel2IntroTransition();
      }
    };

    if (this.currentMapKey === 'classroom') {
      this._setupLevel2Classroom();
      initiateClassroomIntro();
    } else {
      this._changeMap('classroom', targetX, targetY);
      this.time.delayedCall(300, () => {
        this._setupLevel2Classroom();
        initiateClassroomIntro();
      });
    }
  }

  _setupLevel2Classroom() {
    // Clear bullies from classroom if not yet entered
    this.npcs = this.npcs.filter(n => {
      if (n.key === 'bagas' || n.key === 'rio') {
        if (n.sprite) n.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  /* ── Helper: Level 1 Clue Tracker (026 - 047) ── */
  _onClueFound(clueKey) {
    if (clueKey === 'book') {
      this.registry.set('level1_clue_book_found', true);
      const book = this.npcs.find(n => n.key === 'clue_book');
      if (book) {
        if (book.indicator) book.indicator.destroy();
        book.sprite.destroy();
        this.npcs = this.npcs.filter(n => n !== book);
      }
    } else if (clueKey === 'wulan') {
      this.registry.set('level1_clue_wulan_found', true);
      const wulan = this.npcs.find(n => n.key === 'wulan');
      if (wulan) {
        wulan.dialogueId = 'lvl1_wulan_after_clue';
      }
    } else if (clueKey === 'students') {
      this.registry.set('level1_clue_students_found', true);
    }

    let count = 0;
    if (this.registry.get('level1_clue_book_found')) count++;
    if (this.registry.get('level1_clue_wulan_found')) count++;
    if (this.registry.get('level1_clue_students_found')) count++;
    this.registry.set('level1_clues_found', count);

    const ui = this.scene.get('UI');
    if (count < 3) {
      this.registry.set('level1_player_locked', false);
      if (this.player) this.player.isLocked = false;
      this.cameras.main.stopFollow();
      this.tweens.killTweensOf(this.cameras.main);
      this.cameras.main.startFollow(this.player.sprite, true, 1, 1);
      if (ui && ui.showQuest) {
        ui.showQuest(`PROGRES: Temukan petunjuk di perpustakaan (${count}/3)`);
      }
      if (navigator.vibrate) navigator.vibrate(60);
    } else {
      // 045: Petunjuk 3/3 terkumpul! Kunci pergerakan dan picu dialog lvl1_045_eca
      this.registry.set('level1_player_locked', true);
      if (this.player) {
        this.player.isLocked = true;
        this.player.sprite.setVelocity(0, 0);
        this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
      }
      this.cameras.main.stopFollow();
      this.tweens.killTweensOf(this.cameras.main);
      this.cameras.main.startFollow(this.player.sprite, true, 1, 1);
      if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

      this.time.delayedCall(400, () => {
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl1_045_eca');
        }
      });
    }
  }

  handleLevel1TimeoutFail() {
    this.registry.set('level1_player_locked', true);
    if (this.player && this.player.sprite) {
      this.player.sprite.setVelocity(0, 0);
      this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
    }
    const ui = this.scene.get('UI');
    if (ui) {
      ui.startDialogue('lvl1_005b_10_narrator');
    }
  }

  handleCafeteriaChoiceTimeout() {
    this._cafeteriaChoiceTimeoutCount = (this._cafeteriaChoiceTimeoutCount || 0) + 1;
    const curHarmony = this.registry.get('harmony') !== undefined ? this.registry.get('harmony') : 100;
    const newHarmony = Math.max(0, curHarmony - 15);
    this.registry.set('harmony', newHarmony);
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

    const ui = this.scene.get('UI');
    if (this._cafeteriaChoiceTimeoutCount === 1) {
      console.log(`%c[Kantin 058x] Timeout ke-1! Harmoni dikurangi -15 (Sisa: ${newHarmony}). Membuka dialog refleksi 058x-1...`, 'color: #f59e0b; font-weight: bold;');
      if (ui && ui.startDialogue) {
        ui.startDialogue('lvl1_058x_1_narrator');
      }
    } else {
      console.log(`%c[Kantin 058x] Timeout ke-2! Harmoni dikurangi -15 (Sisa: ${newHarmony}). Membuka urutan Bagas/Rio bubar (058x-5)...`, 'color: #ef4444; font-weight: bold;');
      if (ui && ui.startDialogue) {
        ui.startDialogue('lvl1_058x_5_narrator');
      }
    }
  }

  handleCafeteriaEmergencyTimeout() {
    console.log('%c[Kantin 058x] Waktu habis untuk Quest Darurat! Menjalankan Fail Ending...', 'color: #ef4444; font-weight: bold;');
    this.registry.set('level1_player_locked', true);
    if (this.player && this.player.sprite) {
      this.player.isLocked = true;
      if (this.player.sprite.body) this.player.sprite.setVelocity(0, 0);
      this.player.sprite.anims.play('player_idle_' + (this.player.facing || 'down'), true);
    }
    const ui = this.scene.get('UI');
    if (ui && ui.startDialogue) {
      ui.startDialogue('lvl1_058x_10_narrator');
    }
  }

  /**
   * Pan camera smoothly to target world coordinates (x, y)
   * Centers the viewport precisely on (x, y) in all zoom levels and screen resolutions.
   */
  panCameraTo(x, y, duration = 800, ease = 'Sine.easeInOut', onComplete = null) {
    const cam = this.cameras.main;
    this._cameraPanning = true;
    cam.stopFollow();
    this.tweens.killTweensOf(cam);

    let completed = false;
    const finish = () => {
      if (completed) return;
      completed = true;
      this._cameraPanning = false;
      if (typeof onComplete === 'function') onComplete();
    };

    if (duration <= 0) {
      cam.centerOn(x, y);
      finish();
      return;
    }

    cam.pan(x, y, duration, ease, true, (camera, progress) => {
      if (progress >= 1) {
        finish();
      }
    });
  }

  /**
   * Pan camera smoothly to an actor (player or NPC)
   */
  panCameraToActor(actor, duration = 800, followAfter = false, lerp = 1, onComplete = null) {
    if (!actor || !actor.sprite) return;
    this.panCameraTo(actor.sprite.x, actor.sprite.y, duration, 'Sine.easeInOut', () => {
      if (followAfter && actor && actor.sprite) {
        this.cameras.main.startFollow(actor.sprite, true, lerp, lerp);
      }
      if (typeof onComplete === 'function') onComplete();
    });
  }

  _getHalfView() {
    return {
      w: this.cameras.main.width / 2,
      h: this.cameras.main.height / 2
    };
  }

  _focusCameraOnBullies(onComplete) {
    const targetX = 4.5 * TILE + TILE / 2;
    const targetY = 13 * TILE + TILE / 2;
    this.panCameraTo(targetX, targetY, 1000, 'Sine.easeInOut', () => {
      if (navigator.vibrate) navigator.vibrate(60);
      if (typeof onComplete === 'function') onComplete();
    });
  }

  _blockLibraryExit() {
    if (this._libraryBlockDebounce && this.time.now < this._libraryBlockDebounce) return;
    this._libraryBlockDebounce = this.time.now + 1200;

    if (this.player && this.player.sprite) {
      this.player.sprite.setVelocity(0, 0);
      this.player.sprite.x = 2.2 * TILE; // Dorong mundur ke kanan menjauhi pintu
    }
    if (navigator.vibrate) navigator.vibrate([80, 50, 80]);
    const ui = this.scene.get('UI');
    if (ui && ui.showToast) {
      ui.showToast('Temukan semua petunjuk di perpustakaan dulu!', 2200);
    }
  }

  _startLibraryCutscene() {
    const isGardenPhaseDone = this.registry.get('level1_nabula_left_garden') === true ||
      this.registry.get('level1_quest_active') === 'ikuti_nabula' ||
      this.registry.get('level1_quest_active') === 'susul_nabula_timed';

    if (!isGardenPhaseDone) {
      console.log('[Perpus 017] Cutscene ditolak: Babak 1 di taman belum selesai.');
      return;
    }

    if (this._libraryCutsceneRunning || this.registry.get('level1_017_done') || this.registry.get('level1_quest_active') === 'lapor_bu_wati_branch_b' || this.registry.get('level1_049_done')) {
      console.log(`[Perpus 017] _startLibraryCutscene dilewati: running=${this._libraryCutsceneRunning}, done=${this.registry.get('level1_017_done')}`);
      return;
    }
    this._libraryCutsceneRunning = true;
    this.registry.set('level1_017_triggered', true);
    this.registry.set('level1_player_locked', true);

    console.log('%c[Perpus 017] Cutscene Dimulai! Mengunci input pemain (1 detik jeda awal)...', 'color: #eab308; font-weight: bold;');

    // Kunci gerakan pemain saat baru tiba di perpustakaan
    if (this.player) {
      this.player.isLocked = true;
      if (this.player.sprite && this.player.sprite.body) {
        this.player.sprite.setVelocity(0, 0);
        this.player.sprite.anims.play('player_idle_' + (this.player.facing || 'right'), true);
      }
    }

    // Jeda 1 detik saat Nakula baru masuk (kamera tetap di Nakula)
    this.time.delayedCall(1000, () => {
      console.log('%c[Perpus 017] Jeda 1 detik selesai. Kamera mulai pan halus ke Rio & Bagas (4.5, 13)...', 'color: #3b82f6; font-weight: bold;');
      // Setelah 1 detik, kamera melakukan pan mulus ke Bagas dan Rio di (4.5, 13)
      const targetX = 4.5 * TILE + TILE / 2;
      const targetY = 13 * TILE + TILE / 2;
      this.panCameraTo(targetX, targetY, 1000, 'Sine.easeInOut', () => {
        if (navigator.vibrate) navigator.vibrate(60);
        console.log('%c[Perpus 017] Kamera sampai di Rio & Bagas! Membuka dialog lvl1_017_narrator...', 'color: #22c55e; font-weight: bold;');
        // Setelah kamera selesai bergerak dan sampai di Bagas & Rio, dialog 017 baru muncul!
        const ui = this.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl1_017_narrator');
        } else {
          console.error('[Perpus 017] UI scene tidak ditemukan atau startDialogue hilang!');
        }
      });
    });
  }

  _startCafeteriaCutscene() {
    const isCluePhaseDone = this.registry.get('level1_quest_active') === 'pergi_ke_kantin' ||
      (this.registry.get('level1_clues_found') >= 3);

    if (!isCluePhaseDone) {
      console.log('[Kantin 049] Cutscene ditolak: Investigasi 3 petunjuk di perpustakaan belum selesai.');
      return;
    }

    if (this._cafeteriaCutsceneRunning || this.registry.get('level1_049_done')) {
      console.log(`[Kantin 049] _startCafeteriaCutscene dilewati: running=${this._cafeteriaCutsceneRunning}, done=${this.registry.get('level1_049_done')}`);
      return;
    }
    this._cafeteriaCutsceneRunning = true;
    this.registry.set('level1_049_triggered', true);
    this.registry.set('level1_player_locked', true);

    if (window.audioManager) {
      window.audioManager.playLoop('crowd', 0.3);
    }

    console.log('%c[Kantin 049] Cutscene Dimulai! Mengunci input pemain (1 detik jeda awal)...', 'color: #eab308; font-weight: bold;');

    // Kunci gerakan pemain saat baru tiba di kantin dan pastikan menghadap kiri
    if (this.player) {
      this.player.isLocked = true;
      this.player.facing = 'left';
      if (this.player.sprite) {
        if (this.player.sprite.body) this.player.sprite.setVelocity(0, 0);
        this.player.sprite.setFlipX(true);
        this.player.sprite.anims.play('player_idle_left', true);
      }
    }

    // Jeda 1 detik saat Nakula baru masuk (kamera tetap di Nakula)
    this.time.delayedCall(1000, () => {
      console.log('%c[Kantin 049] Jeda 1 detik selesai. Kamera mulai pan halus ke meja Nabula (11.9, 6)...', 'color: #3b82f6; font-weight: bold;');
      const targetX = 11.9 * TILE + TILE / 2;
      const targetY = 6 * TILE + TILE / 2;
      this.panCameraTo(targetX, targetY, 1100, 'Sine.easeInOut', () => {
        if (navigator.vibrate) navigator.vibrate(60);
        console.log('%c[Kantin 049] Kamera sampai di meja Nabula! Membuka dialog lvl1_049_narrator...', 'color: #22c55e; font-weight: bold;');
        const ui = this.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl1_049_narrator');
        } else {
          console.error('[Kantin 049] UI scene tidak ditemukan atau startDialogue hilang!');
        }
      });
    });
  }

  _bulliesLeaveCafeteria(onComplete) {
    const bagas = this.npcs.find(n => n.key === 'bagas');
    const rio = this.npcs.find(n => n.key === 'rio');
    this.registry.set('level1_058x_bullies_left', true);

    const stepSpeed = 160; // ms per tile kecepatan jalan santai yang konsisten

    // 1. Bagas: turun ke lorong baris 9 -> jalan ke kanan baris 9 kolom 29 -> turun ke pintu baris 13 -> fade out
    if (bagas && bagas.sprite) {
      const bSprite = bagas.sprite;
      bSprite.setFlipX(false);
      bSprite.anims.play('bagas_walk_down', true);

      const targetY1 = 9 * TILE + TILE / 2;
      const distTiles1 = Math.max(0.5, Math.abs(targetY1 - bSprite.y) / TILE);
      const dur1 = Math.round(distTiles1 * stepSpeed);

      this.tweens.chain({
        targets: bSprite,
        tweens: [
          {
            y: targetY1,
            duration: dur1,
            ease: 'Linear',
            onComplete: () => {
              bSprite.setFlipX(false);
              bSprite.anims.play('bagas_walk_right', true);
            }
          },
          {
            x: 29 * TILE + TILE / 2,
            duration: Math.round(Math.abs(29 * TILE + TILE / 2 - bSprite.x) / TILE * stepSpeed),
            ease: 'Linear',
            onComplete: () => {
              bSprite.setFlipX(false);
              bSprite.anims.play('bagas_walk_down', true);
            }
          },
          {
            y: 13 * TILE + TILE / 2,
            duration: 4 * stepSpeed,
            ease: 'Linear'
          },
          {
            alpha: 0,
            duration: 350,
            ease: 'Linear',
            onComplete: () => {
              bSprite.setVisible(false);
            }
          }
        ]
      });
    }

    // 2. Rio: berurutan di belakang Bagas (jeda 380ms)
    if (rio && rio.sprite) {
      const rSprite = rio.sprite;
      this.time.delayedCall(380, () => {
        rSprite.setFlipX(false);
        rSprite.anims.play('rio_walk_down', true);

        const targetY1 = 9 * TILE + TILE / 2;
        const distTiles1 = Math.max(0.5, Math.abs(targetY1 - rSprite.y) / TILE);
        const dur1 = Math.round(distTiles1 * stepSpeed);

        this.tweens.chain({
          targets: rSprite,
          tweens: [
            {
              y: targetY1,
              duration: dur1,
              ease: 'Linear',
              onComplete: () => {
                rSprite.setFlipX(false);
                rSprite.anims.play('rio_walk_right', true);
              }
            },
            {
              x: 29 * TILE + TILE / 2,
              duration: Math.round(Math.abs(29 * TILE + TILE / 2 - rSprite.x) / TILE * stepSpeed),
              ease: 'Linear',
              onComplete: () => {
                rSprite.setFlipX(false);
                rSprite.anims.play('rio_walk_down', true);
              }
            },
            {
              y: 13 * TILE + TILE / 2,
              duration: 4 * stepSpeed,
              ease: 'Linear'
            },
            {
              alpha: 0,
              duration: 350,
              ease: 'Linear',
              onComplete: () => {
                rSprite.setVisible(false);
                if (typeof onComplete === 'function') {
                  onComplete();
                }
              }
            }
          ]
        });
      });
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }

  update(time, delta) {
    if (this.player) this.player.update(time, delta);
    for (let i = 0; i < this.npcs.length; i++) {
      this.npcs[i].update(time, delta);
    }
    this._updatePlayerMask();

    // Ensure camera follow stays locked onto player during normal gameplay
    if (this.player && this.player.sprite && !this.player.isLocked && !this._cameraPanning) {
      if (!this.cameras.main._follow) {
        this.cameras.main.startFollow(this.player.sprite, true, 1, 1);
      }
    }

    /* ── Level 1 Library Scene Trigger (Fallback if not started in create) ── */
    const isGardenPhaseDoneForUpdate = this.registry.get('level1_nabula_left_garden') === true ||
      this.registry.get('level1_quest_active') === 'ikuti_nabula' ||
      this.registry.get('level1_quest_active') === 'susul_nabula_timed';

    if (this.registry.get('currentMap') === 'library' &&
      isGardenPhaseDoneForUpdate &&
      !this.registry.get('level1_017_done') &&
      !this._libraryCutsceneRunning &&
      this.registry.get('level1_quest_active') !== 'lapor_bu_wati_branch_b' &&
      !this.registry.get('level1_049_done') &&
      this.cameras.main && !this.cameras.main._fadeOp) {
      console.log('[Perpus 017] Pemicu update() fallback memanggil _startLibraryCutscene()...');
      this._startLibraryCutscene();
    }

    /* ── Level 1 Cafeteria Scene Trigger (Fallback if not started in create) ── */
    const isCluePhaseDoneForUpdate = this.registry.get('level1_quest_active') === 'pergi_ke_kantin' ||
      (this.registry.get('level1_clues_found') >= 3);

    if (this.registry.get('currentMap') === 'cafeteria') {
      if (window.audioManager && !window.audioManager.activeLoops.has('crowd')) {
        window.audioManager.playLoop('crowd', 0.3);
      }
    }

    if (this.registry.get('currentMap') === 'cafeteria' &&
      isCluePhaseDoneForUpdate &&
      !this.registry.get('level1_049_done') &&
      !this._cafeteriaCutsceneRunning &&
      this.cameras.main && !this.cameras.main._fadeOp) {
      console.log('[Kantin 049] Pemicu update() fallback memanggil _startCafeteriaCutscene()...');
      this._startCafeteriaCutscene();
    }

    /* ── Level 1 Clue 3: Proximity Trigger for Raya & Mei (038 / 039) ── */
    if (this.registry.get('currentMap') === 'library' &&
      this.registry.get('level1_clue_quest_active') &&
      !this.registry.get('level1_clue_students_found') &&
      !this.registry.get('level1_039_triggered') &&
      !this.registry.get('dialogueActive')) {
      if (this.player && this.player.sprite) {
        const dx = this.player.sprite.x - (4.5 * TILE + TILE / 2);
        const dy = this.player.sprite.y - (4 * TILE + TILE / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 2.8 * TILE) {
          this.registry.set('level1_039_triggered', true);
          this.registry.set('dialogueActive', true);
          this.registry.set('level1_player_locked', true);
          if (this.player) {
            this.player.isLocked = true;
            this.player.sprite.setVelocity(0, 0);
            this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
          }
          // Kamera otomatis mengarah ke dua siswa (039)
          this.panCameraTo(4.5 * TILE + TILE / 2, 4 * TILE + TILE / 2, 800, 'Sine.easeInOut', () => {
            const ui = this.scene.get('UI');
            if (ui && ui.startDialogue) {
              ui.startDialogue('lvl1_039_narrator');
            }
          });
        }
      }
    }


    /* ── Level 1 Proximity Trigger (003: 3 Blocks from Nabula) ── */
    if (this.registry.get('currentMap') === 'garden' &&
      !this.registry.get('level1_003_triggered') &&
      !this.registry.get('level1_nabula_at_garden_branch_c') &&
      this.registry.get('level1_quest_active') !== 'cari_nabula_taman_branch_c' &&
      !this.registry.get('dialogueActive')) {
      const nabula = this.npcs.find(n => n.key === 'nabula');
      if (nabula && this.player && this.player.sprite) {
        const dx = this.player.sprite.x - nabula.sprite.x;
        const dy = this.player.sprite.y - nabula.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 3 blocks / tiles trigger (<= 3 * TILE = 192px)
        if (dist <= 3 * TILE) {
          this.registry.set('level1_003_triggered', true);
          this.registry.set('dialogueActive', true);

          // Stop player movement
          this.player.sprite.setVelocity(0, 0);
          this.player.sprite.anims.play('player_idle_' + this.player.facing, true);

          const uiPre = this.scene.get('UI');
          if (uiPre && uiPre.hideQuestBanner) {
            uiPre.hideQuestBanner();
          }

          // Kamera otomatis mengarah ke Nabula (003)
          this.panCameraToActor(nabula, 800, false, 1, () => {
            if (navigator.vibrate) navigator.vibrate(60);
            const ui = this.scene.get('UI');
            if (ui) ui._lvl1_003_camera_done = true;
            this.scene.get('UI').startDialogue('lvl1_003_eca');
          });
        }
      }
    }

    /* ── Level 1 Branch C / Emergency: Proximity & Auto-Walk to Nabula in Garden (059c-8) ── */
    const isBranchCGarden = this.registry.get('level1_quest_active') === 'cari_nabula_taman_branch_c' || this.registry.get('level1_nabula_at_garden_branch_c');
    const isEmergencyGarden = this.registry.get('level1_quest_active') === 'emergency_susul_nabula_taman' ||
      this.registry.get('level1_quest_active') === 'emergency_susul_atau_lapor' ||
      this.registry.get('level1_nabula_at_garden_emergency');

    if (this.registry.get('currentMap') === 'garden' &&
      (isBranchCGarden || isEmergencyGarden) &&
      !this.registry.get('level1_059c_approached_nabula') &&
      !this.registry.get('dialogueActive')) {
      const nabula = this.npcs.find(n => n.key === 'nabula');
      if (nabula && this.player && this.player.sprite) {
        const dx = this.player.sprite.x - nabula.sprite.x;
        const dy = this.player.sprite.y - nabula.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Radius 3 tile (192px)
        if (dist <= 3 * TILE) {
          this.registry.set('level1_059c_approached_nabula', true);
          this.registry.set('level1_player_locked', true);
          this.player.isLocked = true;
          this.player.isCutsceneActive = true;
          if (this.player.sprite.body) this.player.sprite.body.enable = false;

          if (isEmergencyGarden) {
            this.registry.set('level1_route_chosen', 'C');
            this.registry.set('level1_058x_emergency_taken', true);
            this.registry.set('level1_nabula_at_garden_branch_c', true);
            this.registry.set('level1_quest_active', null);
          }

          // Kamera mengikuti Nakula
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

          const targetX = nabula.sprite.x - 48; // Berdiri di sebelah kiri Nabula
          const targetY = nabula.sprite.y;

          // Tentukan arah hadap Nakula
          const p = this.player.sprite;
          const diffX = targetX - p.x;
          if (diffX < 0) {
            this.player.facing = 'left';
            p.setFlipX(true);
          } else {
            this.player.facing = 'right';
            p.setFlipX(false);
          }
          p.anims.play('player_walk_' + this.player.facing, true);

          this.tweens.add({
            targets: p,
            x: targetX,
            y: targetY,
            duration: 1600,
            ease: 'Linear',
            onComplete: () => {
              this.player.facing = 'right';
              p.setFlipX(false);
              p.anims.play('player_idle_right', true);
              this.player.isCutsceneActive = false;
              if (p.body) {
                p.body.enable = true;
                p.body.reset(targetX, targetY);
              }

              // Selesaikan quest banner
              const ui = this.scene.get('UI');
              if (ui && ui.completeQuest) {
                ui.completeQuest(isEmergencyGarden ? 'Menyusul Nabula ke taman!' : 'Cari Nabula di taman.');
              }
              if (isEmergencyGarden && ui && ui.hideQuestBanner) {
                ui.hideQuestBanner();
              }

              // Kamera berhenti, lalu dialog lvl1_059c_8_nakula muncul
              this.time.delayedCall(400, () => {
                if (ui && ui.startDialogue) {
                  ui.startDialogue('lvl1_059c_8_nakula');
                }
              });
            }
          });
        }
      }
    }

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
        tier.layer.setDepth(behindThisTier ? 6 : 4.5);
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

  /* ────── Debug Grid & Mode ────── */
  setDebugMode(enabled) {
    if (enabled) {
      this._drawDebugGrid(this.mapW, this.mapH);
      if (this.physics && this.physics.world) {
        this.physics.world.drawDebug = true;
        if (!this.physics.world.debugGraphic && typeof this.physics.world.createDebugGraphic === 'function') {
          this.physics.world.createDebugGraphic();
        }
        if (this.physics.world.debugGraphic) {
          this.physics.world.debugGraphic.setVisible(true);
        }
      }
    } else {
      this._clearDebugGrid();
      if (this.physics && this.physics.world) {
        this.physics.world.drawDebug = false;
        if (this.physics.world.debugGraphic) {
          this.physics.world.debugGraphic.clear();
          this.physics.world.debugGraphic.setVisible(false);
        }
      }
    }
  }

  _drawDebugGrid(mapW, mapH) {
    this._clearDebugGrid();
    const W = mapW || this.mapW || 20, H = mapH || this.mapH || 15;
    this.debugGridContainer = this.add.container(0, 0);
    this.debugGridContainer.setDepth(1000);

    for (let r = 0; r < H; r++) {
      for (let c = 0; c < W; c++) {
        const text = this.add.text(c * TILE + TILE / 2, r * TILE + TILE / 2, `${r},${c}`, {
          fontFamily: 'monospace',
          fontSize: '9px',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0.6);
        this.debugGridContainer.add(text);
      }
    }
  }

  _clearDebugGrid() {
    if (this.debugGridContainer) {
      this.debugGridContainer.destroy(true);
      this.debugGridContainer = null;
    }
  }

  /* ────── Proximity indicator updates ────── */
  _updateProximity() {
    const isPlayerLocked = this.registry.get('dialogueActive') || 
      (this.player && (this.player.isLocked || this.player.isCutsceneActive)) ||
      this.registry.get('level1_player_locked');

    if (isPlayerLocked) {
      for (let i = 0; i < this.npcs.length; i++) {
        this.npcs[i].setIndicatorVisible(false);
      }
      const uiScene = this.scene.get('UI');
      if (uiScene && uiScene.setInteractPrompt) {
        uiScene.setInteractPrompt(false);
      }
      return;
    }

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

    /* ── Auto-transition when walking directly into doorway boundary ── */
    if (this.player && this.player.sprite && !this._isTransitioning && !this.registry.get('dialogueActive') && !this.registry.get('level1_player_locked')) {
      const tileRow = Math.round((this.player.sprite.y - TILE / 2) / TILE);
      const currentMap = this.registry.get('currentMap');

      if (currentMap === 'library' && (tileRow === 9 || tileRow === 10) && this.player.sprite.x <= 1.2 * TILE) {
        if (this.registry.get('level1_clue_quest_active') && (this.registry.get('level1_clues_found') || 0) < 3) {
          this._blockLibraryExit();
        } else {
          this._changeMap('schoolyard', 41 * TILE + TILE / 2, (tileRow === 9 ? 13 : 14) * TILE + TILE / 2);
        }
      } else if (currentMap === 'schoolyard' && (tileRow === 13 || tileRow === 14) && this.player.sprite.x <= 1.2 * TILE) {
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, tileRow * TILE + TILE / 2);
      }
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
      const layer = map.createBlankLayer(`Bookshelves_${r}`, tileset).setDepth(4.5);
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
      "path_1_0": 120,
      "planter_h_0_0": 121,
      "planter_h_0_1": 122,
      "planter_h_0_2": 123,
      "planter_h_1_0": 124,
      "planter_h_1_1": 125,
      "planter_h_1_2": 126,
      "planter_v_0": 127,
      "planter_v_1": 128,
      "planter_v_2": 129,
      "lib_tc_0_0": 130,
      "lib_tc_0_1": 131,
      "lib_tc_0_2": 132,
      "lib_tc_1_0": 133,
      "lib_tc_1_1": 134,
      "lib_tc_1_2": 135,
      "lib_tc_2_0": 136,
      "lib_tc_2_1": 137,
      "lib_tc_2_2": 138,
      "lib_desk_0_0": 139,
      "lib_desk_0_1": 140,
      "lib_desk_0_2": 141,
      "lib_desk_1_0": 142,
      "lib_desk_1_1": 143,
      "lib_desk_1_2": 144,
      "canteen_tc_0_0": 145,
      "canteen_tc_0_1": 146,
      "canteen_tc_1_0": 147,
      "canteen_tc_1_1": 148,
      "canteen_tc_2_0": 149,
      "canteen_tc_2_1": 150,
      "sink": 151,
      "trash_can": 152,
      "caf_plat_0_0": 153,
      "caf_plat_0_1": 154,
      "caf_plat_0_2": 155,
      "caf_plat_0_3": 156,
      "caf_plat_1_0": 157,
      "caf_plat_1_1": 158,
      "caf_plat_1_2": 159,
      "caf_plat_1_3": 160,
      "caf_plat_2_0": 161,
      "caf_plat_2_1": 162,
      "caf_plat_2_2": 163,
      "caf_plat_2_3": 164,
      "caf_plat_3_0": 165,
      "caf_plat_3_1": 166,
      "caf_plat_3_2": 167,
      "caf_plat_3_3": 168,
      "caf_plat_4_0": 169,
      "caf_plat_4_1": 170,
      "caf_plat_4_2": 171,
      "caf_plat_4_3": 172
    };

    const solidTiles = ['gw_t', 'gw_b', 'gw_l', 'gw_r', 'gw_lt', 'gw_lb', 'gw_rt', 'gw_rb', 'school_wall_tl', 'school_wall_t', 'school_wall_tr', 'school_wall_l', 'school_wall_c', 'school_wall_r', 'school_wall_bl', 'school_wall_b', 'school_wall_br', 'school_wall_itl', 'school_wall_itr', 'school_wall_ibl', 'school_wall_ibr', 'bench_1_0', 'bench_1_1', 'bench_1_2', 'desk', 'board', 'table', 'chair', 'bookshelf', 'bookshelf_b', 'tc_1_1', 'lib_tc_0_1', 'lib_tc_1_1', 'lib_tc_2_1', 'lib_desk_1_0', 'lib_desk_1_1', 'lib_desk_1_2', 'lib_desk_0_0', 'lib_desk_0_2', 'caf_srv_0_0', 'caf_srv_0_1', 'caf_srv_0_2', 'caf_srv_0_3', 'caf_srv_0_4', 'caf_srv_0_5', 'caf_srv_1_0', 'caf_srv_1_1', 'caf_srv_1_2', 'caf_srv_1_3', 'caf_srv_1_4', 'caf_srv_1_5', 'fountain_0_0', 'fountain_1_0', 'fountain_0_1', 'fountain_1_1', 'water_0_0', 'water_1_0', 'water_2_0', 'water_3_0', 'water_0_1', 'water_1_1', 'water_2_1', 'water_3_1', 'water_0_2', 'water_1_2', 'water_2_2', 'water_3_2', 'water_0_3', 'water_1_3', 'water_2_3', 'water_3_3', 'water_0_4', 'water_1_4', 'water_2_4', 'water_3_4', 'planter_h_1_0', 'planter_h_1_1', 'planter_h_1_2', 'planter_v_0', 'planter_v_1', 'planter_v_2', 'canteen_tc_0_0', 'canteen_tc_0_1', 'canteen_tc_1_0', 'canteen_tc_1_1', 'canteen_tc_2_0', 'canteen_tc_2_1', 'sink', 'trash_can'];

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
        if (mapKey === 'garden' || mapKey === 'schoolyard') {
          const hashValue = (r * 37 + c * 17) % 100;
          if (hashValue < 80) {
            baseFloorId = TILE_IDS['grass'];
          } else if (hashValue < 90) {
            baseFloorId = TILE_IDS['grass_var1'];
          } else {
            baseFloorId = TILE_IDS['grass_var2'];
          }
        } else if (mapKey === 'cafeteria') {
          if (groundName === 'grass' || groundName === 'grass2' || (c === 1 && r >= 1 && r <= 16)) {
            const hashValue = (r * 37 + c * 17) % 100;
            if (hashValue < 80) {
              baseFloorId = TILE_IDS['grass'];
            } else if (hashValue < 90) {
              baseFloorId = TILE_IDS['grass_var1'];
            } else {
              baseFloorId = TILE_IDS['grass_var2'];
            }
          } else {
            baseFloorId = TILE_IDS[`caf_plat_${r % 3}_0`];
          }
        }
        groundLayer.putTileAt(baseFloorId, c, r);

        if (objects.length > 0) {
          // We have a ground item and one or more objects
          if (groundId !== baseFloorId && groundName !== 'grass' && groundName !== 'grass2' && !groundName.startsWith('caf_plat_')) {
            midLayer.putTileAt(groundId, c, r);
          }

          objects.forEach((objName, i) => {
            if (i >= objectLayers.length) return;
            const objId = TILE_IDS[objName];
            if (!objId) return;
            if (objName.startsWith('water') || objName.startsWith('fountain')) {
              midLayer2.putTileAt(objId, c, r);
            } else if (objName.startsWith('bench_1') || objName.startsWith('planter')) {
              midLayer2.putTileAt(objId, c, r);
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
          } else if (groundName.startsWith('bench_1') || groundName.startsWith('planter') || groundName.startsWith('lib_tc') || groundName.startsWith('lib_desk_0') || groundName.startsWith('canteen_tc') || groundName === 'sink' || groundName === 'trash_can') {
            midLayer2.putTileAt(groundId, c, r);
          } else if (groundName.startsWith('lib_desk_1')) {
            bottomWallLayer.putTileAt(groundId, c, r);
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
          if (groundId !== baseFloorId && groundName !== 'grass' && groundName !== 'grass2' && !groundName.startsWith('caf_plat_')) {
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
    if (mapKey === 'garden' || mapKey === 'schoolyard') {
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
          const topW = (r === 0 || m[r - 1][c].startsWith('school_wall'));
          const botW = (r === H - 1 || m[r + 1][c].startsWith('school_wall'));
          const leftW = (c === 0 || m[r][c - 1].startsWith('school_wall'));
          const rightW = (c === W - 1 || m[r][c + 1].startsWith('school_wall'));

          if (!topW && botW && !leftW && rightW) m[r][c] = 'school_wall_tl';
          else if (!topW && botW && leftW && rightW) m[r][c] = 'school_wall_t';
          else if (!topW && botW && leftW && !rightW) m[r][c] = 'school_wall_tr';
          else if (topW && botW && !leftW && rightW) m[r][c] = 'school_wall_l';
          else if (topW && botW && leftW && rightW) {
            const tlW = (r === 0 || c === 0 || m[r - 1][c - 1].startsWith('school_wall'));
            const trW = (r === 0 || c === W - 1 || m[r - 1][c + 1].startsWith('school_wall'));
            const blW = (r === H - 1 || c === 0 || m[r + 1][c - 1].startsWith('school_wall'));
            const brW = (r === H - 1 || c === W - 1 || m[r + 1][c + 1].startsWith('school_wall'));
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
        if (m[r][c] === 'door_big_l' && c + 1 < W && m[r][c + 1] === 'door_big_r') {
          if (r === 0) {
            if (c > 0) m[r][c - 1] = 'school_wall_ibr';
            if (c + 2 < W) m[r][c + 2] = 'school_wall_ibl';
          } else {
            if (c > 0) m[r][c - 1] = 'school_wall_itl';
            if (c + 2 < W) m[r][c + 2] = 'school_wall_itr';
          }
        }
      }
    }
  }

  _getMapData(key) {
    const W = 20, H = 15;

    if (key === 'schoolyard') {
      const m = [
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
        ['path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_3', 'grass'],
        ['path_2_4', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_1_4', 'path_3_0', 'path_1_0', 'path_2_4', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_2_0', 'grass', 'grass', 'grass', 'path_1_4', 'path_3_0', 'path_1_1', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_4', 'path_1_1', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_lt', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_1_3', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_3', 'path_2_3', 'grass', 'path_3_1', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_3_0', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_4', 'path_2_4', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'path_1_3', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_3', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'path_3_1', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path_1_1', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_lb', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'path_3_1', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path_1_1', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_3', 'path_1_1', 'grass'],
        ['path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_1', 'grass', 'path_3_1', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path_1_2', 'path_2_2', 'path_3_2', 'path_1_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_2', 'path_2_2'],
        ['path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_3_0', 'path_1_1', 'grass', 'path_3_1', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path_1_0', 'path_2_0', 'path_3_0', 'path_1_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_3_0', 'path_1_0', 'path_2_0'],
        ['gw_lt', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'path_3_1', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path_1_1', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_4', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'path_3_1', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path', 'path_1_1', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'path_1_4', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_4', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'path_1_4', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_3_0', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_1', 'grass'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_1', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_2_4', 'grass'],
        ['gw_lb', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_rt', 'grass', 'path_3_1', 'path_1_1', 'grass', 'gw_lt', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_rt']
      ];

      const putObj = (r, c, name) => {
        if (r >= 0 && r < m.length && c >= 0 && c < m[0].length) {
          if (Array.isArray(m[r][c])) {
            m[r][c].push(name);
          } else {
            m[r][c] = [m[r][c], name];
          }
        }
      };

      const putBigTree = (r, c) => {
        if (r + 2 >= m.length || c + 2 >= m[0].length) return;
        putObj(r, c, 'tree_0_0'); putObj(r, c + 1, 'tree_0_1'); putObj(r, c + 2, 'tree_0_2');
        putObj(r + 1, c, 'tree_1_0'); putObj(r + 1, c + 1, 'tree_1_1'); putObj(r + 1, c + 2, 'tree_1_2');
        putObj(r + 2, c, 'tree_2_0'); putObj(r + 2, c + 1, 'tree_2_1'); putObj(r + 2, c + 2, 'tree_2_2');
      };

      // Top tree row
      for (const c of [2, 6, 10, 14, 18]) putBigTree(0, c);
      // Bottom-right tree row
      for (const c of [24, 28, 32, 36]) putBigTree(18, c);

      // Horizontal planters (right side, 3-wide)
      for (const c of [24, 28, 32, 36]) {
        putObj(1, c, 'planter_h_0_0'); putObj(1, c + 1, 'planter_h_0_1'); putObj(1, c + 2, 'planter_h_0_2');
        putObj(2, c, 'planter_h_1_0'); putObj(2, c + 1, 'planter_h_1_1'); putObj(2, c + 2, 'planter_h_1_2');
      }

      // Horizontal planters (left side, 2-wide modular caps)
      for (const c of [1, 5, 9, 13, 17]) {
        putObj(1, c, 'planter_h_0_0'); putObj(1, c + 1, 'planter_h_0_2');
        putObj(2, c, 'planter_h_1_0'); putObj(2, c + 1, 'planter_h_1_2');
      }

      // Vertical planters (column 40, 3-tall)
      for (const r of [4, 8, 16, 19]) {
        putObj(r, 40, 'planter_v_0');
        putObj(r + 1, 40, 'planter_v_1');
        putObj(r + 2, 40, 'planter_v_2');
      }

      // Water fountain (right courtyard)
      putObj(7, 37, 'fountain_0_0');
      putObj(7, 38, 'fountain_1_0');
      putObj(8, 37, 'fountain_0_1');
      putObj(8, 38, 'fountain_1_1');

      return m;
    }

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
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_1_3', 'path_2_2', 'path_2_2', 'path_2_2', 'path_3_2', 'path_1_2', ['path_2_2', 'bench_0_0'], ['path_2_2', 'bench_0_1'], ['path_3_2', 'bench_0_2'], 'path_1_1', 'grass', 'grass', 'water_1_3', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2', 'water_2_2'],
        ['gw_l', 'grass', 'grass', 'grass', 'grass', 'grass', 'path_3_1', 'path_1_0', 'path_2_0', 'path_2_0', 'path_2_0', 'path_2_0', ['path_2_0', 'bench_1_0'], ['path_2_0', 'bench_1_1'], ['path_2_0', 'bench_1_2'], 'path_2_4', 'grass', 'grass', 'water_3_1', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0', 'water_0_0'],
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
        if (r + 2 >= m.length || c + 2 >= m[0].length) return;
        putObj(r, c, 'tree_0_0'); putObj(r, c + 1, 'tree_0_1'); putObj(r, c + 2, 'tree_0_2');
        putObj(r + 1, c, 'tree_1_0'); putObj(r + 1, c + 1, 'tree_1_1'); putObj(r + 1, c + 2, 'tree_1_2');
        putObj(r + 2, c, 'tree_2_0'); putObj(r + 2, c + 1, 'tree_2_1'); putObj(r + 2, c + 2, 'tree_2_2');
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
      for (const r of [8, 10, 12]) {
        m[r - 1][2] = 'bookshelf_t'; m[r][2] = 'bookshelf_b';
        m[r - 1][3] = 'bookshelf_t'; m[r][3] = 'bookshelf_b';
      }
      m[7][4] = 'bookshelf_t'; m[8][4] = 'bookshelf_b';
      m[1][10] = 'board';
      m[H - 1][10] = 'door_big_l'; m[H - 1][11] = 'door_big_r';
      m[0][5] = 'door_big_l'; m[0][6] = 'door_big_r';
      m[1][5] = 'school_floor'; m[1][6] = 'school_floor';
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
      const W = 31, H = 18;
      const m = [
        ['gw_lt', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_rt'],
        ['gw_l', 'sink', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_srv_0_0', 'caf_srv_0_1', 'caf_srv_0_2', 'caf_plat_1_0', 'caf_srv_0_3', 'caf_srv_0_4', 'caf_srv_0_5', 'caf_plat_1_0', 'caf_srv_0_0', 'caf_srv_0_1', 'caf_srv_0_2', 'caf_plat_1_0', 'caf_srv_0_3', 'caf_srv_0_4', 'caf_srv_0_5', 'caf_plat_1_0', 'caf_srv_0_0', 'caf_srv_0_1', 'caf_srv_0_2', 'caf_plat_1_0', 'caf_srv_0_3', 'caf_srv_0_4', 'caf_srv_0_5', 'caf_plat_1_0', 'caf_srv_0_0', 'caf_srv_0_1', 'caf_srv_0_2'],
        ['gw_l', 'grass', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_srv_1_0', 'caf_srv_1_1', 'caf_srv_1_2', 'caf_plat_2_0', 'caf_srv_1_3', 'caf_srv_1_4', 'caf_srv_1_5', 'caf_plat_2_0', 'caf_srv_1_0', 'caf_srv_1_1', 'caf_srv_1_2', 'caf_plat_2_0', 'caf_srv_1_3', 'caf_srv_1_4', 'caf_srv_1_5', 'caf_plat_2_0', 'caf_srv_1_0', 'caf_srv_1_1', 'caf_srv_1_2', 'caf_plat_2_0', 'caf_srv_1_3', 'caf_srv_1_4', 'caf_srv_1_5', 'caf_plat_2_0', 'caf_srv_1_0', 'caf_srv_1_1', 'caf_srv_1_2'],
        ['gw_l', 'grass', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0'],
        ['gw_l', 'grass', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0'],
        ['gw_l', 'grass', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'sink', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0'],
        ['gw_l', 'grass', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0'],
        ['gw_l', 'grass', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0'],
        ['gw_l', 'grass', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0'],
        ['gw_l', 'grass', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0'],
        ['gw_l', 'grass', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0'],
        ['gw_l', 'grass', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'canteen_tc_0_0', 'canteen_tc_0_1', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0'],
        ['gw_l', 'grass', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'canteen_tc_1_0', 'canteen_tc_1_1', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0'],
        ['gw_l', 'grass', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'trash_can', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'canteen_tc_2_0', 'canteen_tc_2_1', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0'],
        ['gw_l', 'grass', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0', 'caf_plat_2_0'],
        ['gw_l', 'grass', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0', 'caf_plat_0_0'],
        ['gw_l', 'trash_can', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0', 'caf_plat_1_0'],
        ['gw_lb', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_t', 'gw_rb']
      ];
      return m;
    }

    if (key === 'library') {
      const W = 19, H = 21;
      const m = Array.from({ length: H }, () => Array(W).fill('school_floor'));

      // Perimeter walls
      for (let c = 0; c < W; c++) {
        m[0][c] = 'school_wall';
        m[H - 1][c] = 'school_wall';
      }
      for (let r = 0; r < H; r++) {
        m[r][0] = 'school_wall';
        m[r][W - 1] = 'school_wall';
      }

      // Doorway on West wall at rows 9 and 10 (connecting from schoolyard)
      m[9][0] = 'school_floor';
      m[10][0] = 'school_floor';

      // Checkerboard/subtle floor texture variation
      for (let r = 1; r < H - 1; r++) {
        for (let c = 1; c < W - 1; c++) {
          if ((r + c) % 5 === 0 && m[r][c] === 'school_floor') {
            m[r][c] = 'school_floor2';
          }
        }
      }

      // Autotile outer walls
      this._autotileSchoolWalls(m);

      // 1. Study Tables (3x3) at rows 5..7, 12..14, 16..18, cols 8..10
      const tables = [5, 12, 16];
      tables.forEach(tr => {
        for (let rOff = 0; rOff < 3; rOff++) {
          for (let cOff = 0; cOff < 3; cOff++) {
            m[tr + rOff][8 + cOff] = `lib_tc_${rOff}_${cOff}`;
          }
        }
      });

      // 2. Reception Desk (3x2) at rows 1..2, cols 8..10
      for (let rOff = 0; rOff < 2; rOff++) {
        for (let cOff = 0; cOff < 3; cOff++) {
          m[1 + rOff][8 + cOff] = `lib_desk_${rOff}_${cOff}`;
        }
      }

      // 3. Bookshelves
      // West wing cols: [1, 2] and [4, 5]
      // East wing cols: [13, 14] and [16, 17]
      const shelfCols = [1, 2, 4, 5, 13, 14, 16, 17];

      // Top row bookshelves along north wall (r=0 is wall + bookshelf_t overlay, r=1 is bookshelf_b)
      shelfCols.forEach(c => {
        m[0][c] = [m[0][c], 'bookshelf_t'];
        m[1][c] = 'bookshelf_b';
      });

      // North wing freestanding shelves (all shelf columns)
      shelfCols.forEach(c => {
        m[2][c] = 'bookshelf_t'; m[3][c] = 'bookshelf_b';
        m[4][c] = 'bookshelf_t'; m[5][c] = 'bookshelf_b';
        m[6][c] = 'bookshelf_t'; m[7][c] = 'bookshelf_b';
      });

      // South wing freestanding shelves (all shelf columns)
      shelfCols.forEach(c => {
        m[11][c] = 'bookshelf_t'; m[12][c] = 'bookshelf_b';
        m[13][c] = 'bookshelf_t'; m[14][c] = 'bookshelf_b';
        m[15][c] = 'bookshelf_t'; m[16][c] = 'bookshelf_b';
        m[17][c] = 'bookshelf_t'; m[18][c] = 'bookshelf_b';
      });

      return m;
    }

    return Array.from({ length: H }, () => Array(W).fill('grass'));
  }

  /* ────── NPC spawning per map ────── */
  _spawnNPCs(mapKey) {
    if (mapKey === 'garden') {
      if (this.registry.get('level1_nabula_at_garden_branch_c') && !this.registry.get('level1_complete')) {
        // Nabula di taman untuk Jalur C (Node 059c)
        const nabula = new NPC(this, 12 * TILE + TILE / 2, 9 * TILE + TILE / 2,
          'nabula', 'lvl1_059c_8_nakula', { name: 'Nabula', emotion: '😔' });
        nabula.sprite.anims.play('nabula_idle_left', true);
        nabula.sprite.setFlipX(true);
        this.npcs.push(nabula);
      } else if (this.registry.get('level1_nabula_at_garden_emergency') && !this.registry.get('level1_complete')) {
        const nabula = new NPC(this, 12 * TILE + TILE / 2, 9 * TILE + TILE / 2,
          'nabula', 'lvl1_059c_8_nakula', { name: 'Nabula', emotion: '😔' });
        nabula.sprite.anims.play('nabula_idle_left', true);
        nabula.sprite.setFlipX(true);
        this.npcs.push(nabula);
      } else if (!this.registry.get('level1_complete') && !this.registry.get('level1_nabula_left_garden')) {
        // Nabula on (12, 9) tile with sad emotion, facing left
        const nabula = new NPC(this, 12 * TILE + TILE / 2, 9 * TILE + TILE / 2,
          'nabula', 'lvl1_007_nakula', { name: 'Nabula', emotion: '😔' });
        nabula.sprite.anims.play('nabula_idle_left', true);
        nabula.sprite.setFlipX(true);
        this.npcs.push(nabula);
      }
    } else if (mapKey === 'schoolyard') {
      const offset = 10;
      // Generic NPC near the door
      this.npcs.push(new NPC(this, (7 + offset) * TILE + TILE / 2, 1 * TILE + TILE / 2,
        'student', null, { name: 'Student' }));
      // Background students
      this.npcs.push(new NPC(this, (15 + offset) * TILE + TILE / 2, 9 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));
    }

    if (mapKey === 'corridor') {
      // Riko lurking
      this.npcs.push(new NPC(this, 16 * TILE + TILE / 2, 8 * TILE + TILE / 2,
        'riko', 'riko_corridor', { name: 'Riko' }));

      // Ambient students in hallway
      this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 3 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));
    }

    if (mapKey === 'classroom') {
      // Teacher Rani
      this.npcs.push(new NPC(this, 10 * TILE + TILE / 2, 2 * TILE + TILE / 2,
        'rani', 'rani_intro', { name: 'Teacher Rani' }));

      // Ambient student
      this.npcs.push(new NPC(this, 6 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_2', { name: 'Student' }));
    }

    if (mapKey === 'auditorium') {
      this.npcs.push(new NPC(this, 8 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));

      // The Bulletin Board
      const board = new NPC(this, 10 * TILE + TILE / 2, 1 * TILE + TILE / 2,
        'student', 'board_interact', { name: 'Papan Nilai', immovable: true });
      board.key = 'initiative_board';
      board.sprite.setAlpha(0); // Invisible, attached to tilemap graphic
      this.npcs.push(board);
    }

    if (mapKey === 'cafeteria') {
      this.npcs.push(new NPC(this, 16 * TILE + TILE / 2, 7 * TILE + TILE / 2,
        'student', 'student_chat_2', { name: 'Student' }));
      this.npcs.push(new NPC(this, 6 * TILE + TILE / 2, 10 * TILE + TILE / 2,
        'student', 'student_chat_1', { name: 'Student' }));

      // Level 2: Spawn Bagas & Rio di antrean kantin
      if (this.registry.get('level2_started')) {
        const bagas = new NPC(this, 17 * TILE + TILE / 2, 4 * TILE + TILE / 2,
          'bagas', null, { name: 'Bagas' });
        bagas.sprite.setFlipX(true);
        bagas.facing = 'left';
        if (bagas.sprite.anims) bagas.sprite.anims.play('bagas_idle_left', true);
        this.npcs.push(bagas);

        const rio = new NPC(this, 18.5 * TILE + TILE / 2, 4 * TILE + TILE / 2,
          'rio', null, { name: 'Rio' });
        rio.sprite.setFlipX(true);
        rio.facing = 'left';
        if (rio.sprite.anims) rio.sprite.anims.play('rio_idle_left', true);
        this.npcs.push(rio);
      }

      // Babak 4C & Babak 5: Spawn Nabula, Bagas, Rio di kantin
      const isClueDoneForCafeteriaSpawn = !this.registry.get('level2_started') && (this.registry.get('level1_quest_active') === 'pergi_ke_kantin' ||
        (this.registry.get('level1_clues_found') >= 3) ||
        this.registry.get('level1_049_done'));

      const canSpawnCafeteriaGroup = isClueDoneForCafeteriaSpawn && !this.registry.get('level1_complete');

      if (canSpawnCafeteriaGroup) {
        const is049Done = this.registry.get('level1_049_done');

        const isBranchBAtCafeteria = this.registry.get('level1_branch_b_bu_wati_at_cafeteria');

        // Nabula di meja makan (11.9, 6) jika belum kabur (atau saat kembali bersama Bu Wati)
        if (!this.registry.get('level1_058x_nabula_left') || isBranchBAtCafeteria) {
          const nabula = new NPC(this, 11.9 * TILE + TILE / 2, 6 * TILE + TILE / 2,
            'nabula', null, { name: 'Nabula', emotion: '😔' });
          nabula.sprite.anims.play('nabula_idle_down', true);
          this.npcs.push(nabula);
        }

        // Bagas & Rio jika belum bubar (atau saat kembali bersama Bu Wati)
        if (!this.registry.get('level1_058x_bullies_left') || isBranchBAtCafeteria) {
          const bagasX = is049Done ? 13.3 : 13.3;
          const bagasY = is049Done ? 5.5 : 4;
          const bagas = new NPC(this, bagasX * TILE + TILE / 2, bagasY * TILE + TILE / 2,
            'bagas', null, { name: 'Bagas' });
          bagas.sprite.setFlipX(false);
          bagas.sprite.anims.play(is049Done ? 'bagas_idle_left' : 'bagas_idle_down', true);
          this.npcs.push(bagas);

          const rioX = is049Done ? 13.3 : 14.3;
          const rioY = is049Done ? 6.5 : 4;
          const rio = new NPC(this, rioX * TILE + TILE / 2, rioY * TILE + TILE / 2,
            'rio', null, { name: 'Rio' });
          rio.sprite.setFlipX(false);
          rio.sprite.anims.play(is049Done ? 'rio_idle_left' : 'rio_idle_down', true);
          this.npcs.push(rio);
        }
      }

      // Bu Wati di kantin saat Jalur B berjalan
      if (this.registry.get('level1_branch_b_bu_wati_at_cafeteria')) {
        const wati = new NPC(this, 28 * TILE + TILE / 2, 13 * TILE + TILE / 2,
          'wati', null, { name: 'Bu Wati' });
        wati.sprite.anims.play('wati_idle_left', true);
        wati.sprite.setFlipX(true);
        this.npcs.push(wati);
      }

      // Wulan di kantin memantau dari kejauhan (Node 060b)
      if (this.registry.get('level1_branch_a_done') || this.registry.get('level1_branch_b_done')) {
        const wulan = new NPC(this, 20 * TILE + TILE / 2, 10 * TILE + TILE / 2,
          'wulan', null, { name: 'Wulan', emotion: '😟' });
        wulan.sprite.anims.play('wulan_idle_left', true);
        this.npcs.push(wulan);
      }
    }

    if (mapKey === 'library') {
      // Bu Wati (Pustakawan / Guru) at reception desk (col 9, row 1)
      let watiDialogue = 'librarian_chat';
      let watiEmotion = null;
      if (this.registry.get('level1_quest_active') === 'lapor_bu_wati_branch_b') {
        watiDialogue = 'lvl1_059b_5_nakula';
        watiEmotion = '❗';
      }
      this.npcs.push(new NPC(this, 9 * TILE + TILE / 2, 1 * TILE + TILE / 2,
        'wati', watiDialogue, { name: 'Bu Wati', emotion: watiEmotion }));

      // Nabula di perpustakaan bersama Nakula (Jalur C)
      if (this.registry.get('level1_branch_c_nabula_at_library')) {
        const nabula = new NPC(this, 2 * TILE + TILE / 2, 9 * TILE + TILE / 2,
          'nabula', null, { name: 'Nabula', emotion: '😔' });
        nabula.sprite.anims.play('nabula_idle_right', true);
        this.npcs.push(nabula);
      }

      // Wulan at (16, 6) menghadap kanan
      let wulanDialogue = 'lvl1_wulan_ambient';
      if (this.registry.get('level1_clue_quest_active') && !this.registry.get('level1_clue_wulan_found')) {
        wulanDialogue = 'lvl1_033_nakula';
      } else if (this.registry.get('level1_clue_wulan_found')) {
        wulanDialogue = 'lvl1_wulan_after_clue';
      }
      // Wulan (16, 6) menghadap kiri
      const wulan = new NPC(this, 16 * TILE + TILE / 2, 6 * TILE + TILE / 2,
        'wulan', wulanDialogue, { name: 'Wulan' });
      wulan.sprite.setFlipX(false);
      wulan.sprite.anims.play('wulan_idle_left', true);
      this.npcs.push(wulan);

      // Rio (4, 13) & Bagas (5, 13)
      // HANYA spawn jika alur taman sudah selesai, belum masuk Babak 4 / Kantin, dan bukan alur Jalur B / Emergency
      const isGardenDoneForLibraryNPCs = this.registry.get('level1_nabula_left_garden') === true;
      const isPastCafeteria = this.registry.get('level1_049_done') || this.registry.get('level1_049_triggered');
      const isBranchBQuest = this.registry.get('level1_quest_active') === 'lapor_bu_wati_branch_b';
      const isEmergencyQuest = this.registry.get('level1_quest_active') === 'emergency_susul_nabula_taman' || this.registry.get('level1_quest_active') === 'emergency_susul_atau_lapor';

      if (isGardenDoneForLibraryNPCs && !isPastCafeteria && !isBranchBQuest && !isEmergencyQuest) {
        // Rio (4, 13) menghadap kanan & Bagas (5, 13) menghadap kiri
        const rio = new NPC(this, 4 * TILE + TILE / 2, 13 * TILE + TILE / 2,
          'rio', 'lvl1_rio_ambient', { name: 'Rio' });
        rio.sprite.setFlipX(true);
        rio.sprite.anims.play('rio_idle_right', true);
        this.npcs.push(rio);

        const bagas = new NPC(this, 5 * TILE + TILE / 2, 13 * TILE + TILE / 2,
          'bagas', 'lvl1_bagas_ambient', { name: 'Bagas' });
        bagas.sprite.setFlipX(false);
        bagas.sprite.anims.play('bagas_idle_left', true);
        this.npcs.push(bagas);
      }

      // Raya (4, 4) menghadap kanan & Mei (5, 4) menghadap kiri
      const raya = new NPC(this, 4 * TILE + TILE / 2, 4 * TILE + TILE / 2,
        'raya', 'lvl1_raya_ambient', { name: 'Raya' });
      raya.sprite.setFlipX(false);
      raya.sprite.anims.play('raya_idle_right', true);
      this.npcs.push(raya);

      const mei = new NPC(this, 5 * TILE + TILE / 2, 4 * TILE + TILE / 2,
        'mei', 'lvl1_mei_ambient', { name: 'Mei' });
      mei.sprite.setFlipX(false);
      mei.sprite.anims.play('mei_idle_left', true);
      this.npcs.push(mei);

      // Nabula: (8.5, 16) menghadap kanan.
      // HANYA muncul di perpustakaan jika Nabula sudah meninggalkan taman (012) dan belum kabur di 020
      // Dan BUKAN saat Jalur B (karena di Jalur B, Nabula berada di kantin!)
      const canSpawnNabula = this.registry.get('level1_nabula_left_garden') &&
        !this.registry.get('level1_020_done') && !isPastCafeteria && !isBranchBQuest;
      if (canSpawnNabula) {
        const nabula = new NPC(this, 8.5 * TILE + TILE / 2, 16 * TILE + TILE / 2,
          'nabula', null, { name: 'Nabula', emotion: '😔' });
        nabula.sprite.setFlipX(false);
        nabula.sprite.anims.play('nabula_idle_right', true);
        this.npcs.push(nabula);
      }

      // Buku Robek: (17, 17). HANYA muncul saat quest mencari petunjuk aktif dan belum ditemukan
      if (this.registry.get('level1_clue_quest_active') && !this.registry.get('level1_clue_book_found')) {
        const book = new NPC(this, 17 * TILE + TILE / 2, 17 * TILE + TILE / 2,
          'clue_book', 'lvl1_027_narrator', { name: 'Buku Tugas Robek' });
        this.npcs.push(book);
      }
    }
  }

  /* ────── Interaction via E/Space key ────── */
  _tryInteract() {
    if (this.registry.get('dialogueActive')) return;
    if (this.player && (this.player.isLocked || this.player.isCutsceneActive)) return;
    if (this.registry.get('level1_player_locked')) return;

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
      // Jika pemain berinteraksi dengan Raya atau Mei saat quest petunjuk aktif, picu dialog menguping (039)
      if ((nearest.key === 'raya' || nearest.key === 'mei') &&
          this.registry.get('level1_clue_quest_active') &&
          !this.registry.get('level1_clue_students_found')) {
        this.registry.set('level1_039_triggered', true);
        this.registry.set('dialogueActive', true);
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          this.player.sprite.setVelocity(0, 0);
          this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
        }
        this.cameras.main.stopFollow();
        this.tweens.killTweensOf(this.cameras.main);
        this.panCameraTo(4.5 * TILE + TILE / 2, 4 * TILE + TILE / 2, 800, 'Sine.easeInOut', () => {
          this.scene.get('UI').startDialogue('lvl1_039_narrator');
        });
        return;
      }
      this.scene.get('UI').startDialogue(nearest.dialogueId);
      return;
    }

    // Check door / scene transitions
    this._checkDoor();
  }

  /* ────── Door transition detection ────── */
  _isNearDoor() {
    if (!this.player || !this.player.sprite) return false;
    const px = Math.round((this.player.sprite.x - TILE / 2) / TILE);
    const py = Math.round((this.player.sprite.y - TILE / 2) / TILE);

    for (let i = 0; i < this.currentTransitions.length; i++) {
      const t = this.currentTransitions[i];
      if (Math.abs(px - t.fromX) <= 1 && Math.abs(py - t.fromY) <= 1) return true;
    }
    return false;
  }

  _showDoorBarrierNotice(message, pushBackDir = 'down') {
    if (this._barrierToastCooldown) return;
    this._barrierToastCooldown = true;
    this.time.delayedCall(1500, () => {
      this._barrierToastCooldown = false;
    });

    const ui = this.scene.get('UI');
    if (ui && ui.showQuest) {
      ui.showQuest(message, { duration: 2500 });
    }
    if (navigator.vibrate) navigator.vibrate([40, 30, 40]);

    if (this.player && this.player.sprite) {
      if (pushBackDir === 'down') {
        this.player.sprite.y += TILE * 0.75;
      } else if (pushBackDir === 'right') {
        this.player.sprite.x += TILE * 0.75;
      } else if (pushBackDir === 'left') {
        this.player.sprite.x -= TILE * 0.75;
      } else if (pushBackDir === 'up') {
        this.player.sprite.y -= TILE * 0.75;
      }
      if (this.player.sprite.body) {
        this.player.sprite.body.setVelocity(0, 0);
      }
    }
  }

  _checkDoor() {
    if (!this.player || !this.player.sprite) return;
    const px = Math.round((this.player.sprite.x - TILE / 2) / TILE);
    const py = Math.round((this.player.sprite.y - TILE / 2) / TILE);

    for (let i = 0; i < this.currentTransitions.length; i++) {
      const t = this.currentTransitions[i];
      if (Math.abs(px - t.fromX) <= 1 && Math.abs(py - t.fromY) <= 1) {
        if (this.registry.get('currentMap') === 'library' && this.registry.get('level1_clue_quest_active') && (this.registry.get('level1_clues_found') || 0) < 3) {
          this._blockLibraryExit();
          return;
        }
        // Level 2: Keluar kelas saat quest kantin aktif langsung menuju kantin
        if (this.registry.get('currentMap') === 'classroom' && this.registry.get('level2_started') && !this.registry.get('level2_cafeteria_arrived')) {
          this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
          return;
        }
        // Free roam: Pemain bebas menjelajahi seluruh area sekolah kapan saja!
        this._changeMap(t.toMap, t.spawnX * TILE + TILE / 2, t.spawnY * TILE + TILE / 2);
        return;
      }
    }
  }

  /** Define all map transitions */
  _getTransitions(mapKey) {
    if (!this._transitionsCache) {
      this._transitionsCache = {
        schoolyard: [
          // North to Classroom
          { fromX: 21, fromY: 0, toMap: 'classroom', spawnX: 10, spawnY: 13 },
          { fromX: 22, fromY: 0, toMap: 'classroom', spawnX: 10, spawnY: 13 },
          // South to Garden
          { fromX: 20, fromY: 22, toMap: 'garden', spawnX: 14, spawnY: 1 },
          { fromX: 21, fromY: 22, toMap: 'garden', spawnX: 14, spawnY: 1 },
          { fromX: 22, fromY: 22, toMap: 'garden', spawnX: 15, spawnY: 1 },
          { fromX: 23, fromY: 22, toMap: 'garden', spawnX: 15, spawnY: 1 },
          // West to Cafeteria
          { fromX: 0, fromY: 13, toMap: 'cafeteria', spawnX: 29, spawnY: 13 },
          { fromX: 0, fromY: 14, toMap: 'cafeteria', spawnX: 29, spawnY: 14 },
          { fromX: 1, fromY: 13, toMap: 'cafeteria', spawnX: 29, spawnY: 13 },
          { fromX: 1, fromY: 14, toMap: 'cafeteria', spawnX: 29, spawnY: 14 },
          // East to Library
          { fromX: 42, fromY: 13, toMap: 'library', spawnX: 1, spawnY: 9 },
          { fromX: 42, fromY: 14, toMap: 'library', spawnX: 1, spawnY: 10 },
          { fromX: 41, fromY: 13, toMap: 'library', spawnX: 1, spawnY: 9 },
          { fromX: 41, fromY: 14, toMap: 'library', spawnX: 1, spawnY: 10 }
        ],
        library: [
          // West to Schoolyard
          { fromX: 0, fromY: 9, toMap: 'schoolyard', spawnX: 41, spawnY: 13 },
          { fromX: 0, fromY: 10, toMap: 'schoolyard', spawnX: 41, spawnY: 14 },
          { fromX: 1, fromY: 9, toMap: 'schoolyard', spawnX: 41, spawnY: 13 },
          { fromX: 1, fromY: 10, toMap: 'schoolyard', spawnX: 41, spawnY: 14 }
        ],
        garden: [
          { fromX: 14, fromY: 0, toMap: 'schoolyard', spawnX: 21, spawnY: 21 },
          { fromX: 15, fromY: 0, toMap: 'schoolyard', spawnX: 22, spawnY: 21 }
        ],
        corridor: [
          { fromX: 10, fromY: 14, toMap: 'garden', spawnX: 14, spawnY: 2 },
          { fromX: 11, fromY: 14, toMap: 'garden', spawnX: 14, spawnY: 2 },
          { fromX: 5, fromY: 0, toMap: 'classroom', spawnX: 10, spawnY: 13 },
          { fromX: 6, fromY: 0, toMap: 'classroom', spawnX: 10, spawnY: 13 },
          { fromX: 15, fromY: 0, toMap: 'auditorium', spawnX: 10, spawnY: 13 },
          { fromX: 16, fromY: 0, toMap: 'auditorium', spawnX: 10, spawnY: 13 },
          { fromX: 3, fromY: 14, toMap: 'cafeteria', spawnX: 29, spawnY: 13 },
          { fromX: 4, fromY: 14, toMap: 'cafeteria', spawnX: 29, spawnY: 14 }
        ],
        classroom: [
          { fromX: 10, fromY: 14, toMap: 'schoolyard', spawnX: 21, spawnY: 1 },
          { fromX: 11, fromY: 14, toMap: 'schoolyard', spawnX: 22, spawnY: 1 }
        ],
        auditorium: [
          { fromX: 10, fromY: 14, toMap: 'corridor', spawnX: 15, spawnY: 2 },
          { fromX: 11, fromY: 14, toMap: 'corridor', spawnX: 15, spawnY: 2 }
        ],
        cafeteria: [
          // East to Schoolyard
          { fromX: 30, fromY: 8, toMap: 'schoolyard', spawnX: 1, spawnY: 13 },
          { fromX: 30, fromY: 9, toMap: 'schoolyard', spawnX: 1, spawnY: 13 },
          { fromX: 30, fromY: 10, toMap: 'schoolyard', spawnX: 1, spawnY: 13 },
          { fromX: 30, fromY: 11, toMap: 'schoolyard', spawnX: 1, spawnY: 13 },
          { fromX: 30, fromY: 12, toMap: 'schoolyard', spawnX: 1, spawnY: 13 },
          { fromX: 30, fromY: 13, toMap: 'schoolyard', spawnX: 1, spawnY: 13 },
          { fromX: 30, fromY: 14, toMap: 'schoolyard', spawnX: 1, spawnY: 14 },
          { fromX: 30, fromY: 15, toMap: 'schoolyard', spawnX: 1, spawnY: 14 },
          { fromX: 30, fromY: 16, toMap: 'schoolyard', spawnX: 1, spawnY: 14 }
        ]
      };
    }
    return this._transitionsCache[mapKey] || [];
  }

  _changeMap(newMap, spawnX, spawnY) {
    if (this._isTransitioning) return;
    this._isTransitioning = true;
    if (window.audioManager && newMap !== 'cafeteria') {
      window.audioManager.stopLoop('crowd', 0.4);
    }
    this.registry.set('currentMap', newMap);
    // Fade transition
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this._isTransitioning = false;
      this.scene.restart({ spawnX, spawnY });
    });
  }
}