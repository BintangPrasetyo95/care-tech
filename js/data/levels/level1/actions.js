/* ───────────── data / levels / level1 / actions.js ─────────────
   CARE-TECH: Harmonia School — Level 1 Cutscenes & Action Handlers
   Source: script/skrip_level1.md
   ─────────────────────────────────────────────────────────────── */

window.LEVEL_1_ACTIONS = {};

/* ── Action: complete_level1 ── */
const _handler_0 = function(scene, action) {
        this.registry.set('level1_complete', true);
        try { localStorage.setItem('caretech_scenario_1', 'true'); } catch (e) { }
};
window.LEVEL_1_ACTIONS['complete_level1'] = _handler_0;

/* ── Action: lvl1_001_intro_walk ── */
const _handler_1 = function(scene, action) {
        console.log('%c[Level 1 Intro] Memulai intro taman: schoolBell diputar via AudioManager, kamera diam di (3.5, 14), Nakula jalan dari (1.5, 14) ke (3.5, 14)...', 'color: #38bdf8; font-weight: bold;');

        // 1. Kunci kontrol Nakula selama cutscene berjalan
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          this.player.isCutsceneActive = true;
          if (this.player.sprite && this.player.sprite.body) {
            this.player.sprite.body.enable = false;
          }
        }

        // 2. Mainkan suara schoolBell via AudioManager (in-memory Web Audio, kebal dari download prompt IDM)
        if (window.audioManager) {
          window.audioManager.playSchoolBell(0.7);
        }

        // 3. Pastikan kamera tetap diam di titik (3.5, 14): X = 14 * TILE + TILE / 2 = 928, Y = 3.5 * TILE = 224
        const targetX = 14 * TILE + TILE / 2;
        const targetY = 3.5 * TILE;
        const startX = 14 * TILE + TILE / 2;
        const startY = 1.5 * TILE;

        this.cameras.main.stopFollow();
        this.tweens.killTweensOf(this.cameras.main);
        this.cameras.main.centerOn(targetX, targetY);

        // 4. Set posisi awal Nakula di ambang pintu (1.5, 14) dan mulai animasi jalan ke bawah
        if (this.player && this.player.sprite) {
          this.player.sprite.setPosition(startX, startY);
          this.player.facing = 'down';
          this.player.sprite.setFlipX(false);
          this.player.sprite.anims.play('player_walk_down', true);
        }

        // 5. Pantau 2 syarat: Layar selesai terang (fade in selesai) DAN Nakula selesai bergerak ke (3.5, 14)
        let isFadeInDone = false;
        let isWalkDone = false;

        const checkCanAdvance = () => {
          if (isFadeInDone && isWalkDone) {
            console.log('%c[Level 1 Intro] Layar terang & Nakula sampai di (3.5, 14)! Mengizinkan dialog 001 dilanjutkan...', 'color: #22c55e; font-weight: bold;');
            if (this.player && this.player.sprite) {
              this.player.sprite.anims.play('player_idle_down', true);
              this.player.facing = 'down';
              if (this.player.sprite.body) {
                this.player.sprite.body.enable = true;
                this.player.sprite.body.reset(targetX, targetY);
              }
              this.player.isCutsceneActive = false;
              // Kamera sekarang dihubungkan kembali mengikuti Nakula
              this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
            }
            const ui = this.scene.get('UI');
            if (ui && ui.enableDialogueAdvance) {
              ui.enableDialogueAdvance();
            }
          }
        };

        // Kondisi A: Fade in kamera
        const cam = this.cameras.main;
        const uiScene = this.scene.get('UI');
        const isFading = (cam && cam._fadeAlpha && cam._fadeAlpha > 0) ||
                        (uiScene && uiScene.cameras && uiScene.cameras.main && uiScene.cameras.main._fadeAlpha > 0);

        if (isFading) {
          if (cam) {
            cam.once('camerafadeincomplete', () => {
              isFadeInDone = true;
              checkCanAdvance();
            });
          }
          if (uiScene && uiScene.cameras && uiScene.cameras.main) {
            uiScene.cameras.main.once('camerafadeincomplete', () => {
              isFadeInDone = true;
              checkCanAdvance();
            });
          }
        } else {
          // Jika kamera sudah terang / tidak sedang fade, berikan timer transisi 1500ms
          this.time.delayedCall(1500, () => {
            isFadeInDone = true;
            checkCanAdvance();
          });
        }

        // Kondisi B: Pergerakan Nakula ke bawah menuju targetY (3, 14.5)
        if (this.player && this.player.sprite) {
          this.tweens.add({
            targets: this.player.sprite,
            y: targetY,
            duration: 1600,
            ease: 'Linear',
            onComplete: () => {
              isWalkDone = true;
              checkCanAdvance();
            }
          });
        } else {
          isWalkDone = true;
          checkCanAdvance();
        }
};
window.LEVEL_1_ACTIONS['lvl1_001_intro_walk'] = _handler_1;

/* ── Action: lvl1_start_walk ── */
const _handler_2 = function(scene, action) {
        // Player is now free to walk in the garden (001 continued)
        this.registry.set('level1_player_locked', false);
        if (this.player) {
          this.player.isLocked = false;
          if (this.player.sprite) this.player.sprite.setVelocity(0, 0);
        }
};
window.LEVEL_1_ACTIONS['lvl1_start_walk'] = _handler_2;

/* ── Action: lvl1_003_focus_nabula ── */
const _handler_3 = function(scene, action) {
        // lvl1_003_eca: Kamera mengarah ke Nabula di bangku taman terlebih dahulu
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          if (this.player.sprite) this.player.sprite.setVelocity(0, 0);
        }
        const uiPre = this.scene.get('UI');
        if (uiPre && uiPre.hideQuestBanner) {
          uiPre.hideQuestBanner();
        }
        const nabula = this.npcs.find(n => n.key === 'nabula');
        const onCameraSettled = () => {
          if (navigator.vibrate) navigator.vibrate(60);
          const ui = this.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui._lvl1_003_camera_done = true;
            ui.startDialogue('lvl1_003_eca');
          }
        };

        if (nabula) {
          this.panCameraToActor(nabula, 800, false, 1, onCameraSettled);
        } else {
          const targetX = 12 * TILE + TILE / 2;
          const targetY = 9 * TILE + TILE / 2;
          this.panCameraTo(targetX, targetY, 800, 'Sine.easeInOut', onCameraSettled);
        }
};
window.LEVEL_1_ACTIONS['lvl1_003_focus_nabula'] = _handler_3;

/* ── Action: lvl1_005a_focus_nakula ── */
const _handler_4 = function(scene, action) {
        // lvl1_005a_1: Kamera mengarah ke Nakula terlebih dahulu. Setelah selesai, dialog lvl1_005a_1 baru muncul!
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          this.player.isCutsceneActive = false;
          if (this.player.sprite) {
            this.player.sprite.setVelocity(0, 0);
            this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
          }
        }
        this.panCameraToActor(this.player, 800, false, 1, () => {
          if (navigator.vibrate) navigator.vibrate(60);
          const ui = this.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui._lvl1_005a_1_camera_done = true;
            ui.startDialogue('lvl1_005a_1');
          }
        });
};
window.LEVEL_1_ACTIONS['lvl1_005a_focus_nakula'] = _handler_4;

/* ── Action: lvl1_camera_to_nakula ── */
const _handler_5 = function(scene, action) {
        this.panCameraToActor(this.player, 800, true, 1);
};
window.LEVEL_1_ACTIONS['lvl1_camera_to_nakula'] = _handler_5;

/* ── Action: lvl1_005b_1_focus_nabula ── */
const _handler_6 = function(scene, action) {
        // Sebelum dialog lvl1_005b_2 muncul, kamera bergeser fokus ke Nabula di bangku taman.
        // Setelah pergerakan kamera selesai (onComplete), dialog baru dimunculkan!
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          if (this.player.sprite) this.player.sprite.setVelocity(0, 0);
        }
        const nabula = this.npcs.find(n => n.key === 'nabula');
        const onCameraSettled = () => {
          if (navigator.vibrate) navigator.vibrate(60);
          const ui = this.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui._lvl1_005b_2_camera_done = true;
            ui.startDialogue('lvl1_005b_2');
          }
        };

        if (nabula) {
          this.panCameraToActor(nabula, 900, false, 1, onCameraSettled);
        } else {
          const targetX = 12 * TILE + TILE / 2;
          const targetY = 9 * TILE + TILE / 2;
          this.panCameraTo(targetX, targetY, 900, 'Sine.easeInOut', onCameraSettled);
        }
};
window.LEVEL_1_ACTIONS['lvl1_005b_1_focus_nabula'] = _handler_6;

/* ── Action: lvl1_005a_ready ── */
const _handler_7 = function(scene, action) {
        // 005a-1: Nakula stays still, kamera tetap pada Nakula lalu follow saat jalan (005a-2)
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          this.player.isCutsceneActive = false;
          if (this.player.sprite) {
            this.player.sprite.setVelocity(0, 0);
            this.player.sprite.anims.play('player_idle_' + this.player.facing, true);
            this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
          }
        }
};
window.LEVEL_1_ACTIONS['lvl1_005a_ready'] = _handler_7;

/* ── Action: lvl1_005a_walk ── */
const _handler_8 = function(scene, action) {
        // 005a-2: Nakula walks to Nabula automatically, camera follows
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula && this.player) {
          this.player.isCutsceneActive = true;
          if (this.player.sprite && this.player.sprite.body) {
            this.player.sprite.body.enable = false; // Disable body collision to allow smooth cutscene movement
          }
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

          const targetX = nabula.sprite.x - 48; // Berdiri di sebelah kiri Nabula
          const targetY = nabula.sprite.y;

          // Tentukan arah hadap dan animasi jalan
          const dx = targetX - this.player.sprite.x;
          if (dx < 0) {
            this.player.facing = 'left';
            this.player.sprite.setFlipX(true);
          } else {
            this.player.facing = 'right';
            this.player.sprite.setFlipX(false);
          }
          this.player.sprite.anims.play('player_walk_' + this.player.facing, true);

          this.tweens.add({
            targets: this.player.sprite,
            x: targetX,
            y: targetY,
            duration: 2200,
            ease: 'Linear',
            onComplete: () => {
              this.player.facing = 'right';
              this.player.sprite.setFlipX(false);
              this.player.sprite.anims.play('player_idle_right', true);
              this.player.isCutsceneActive = false;
              if (this.player.sprite && this.player.sprite.body) {
                this.player.sprite.body.enable = true;
                this.player.sprite.body.reset(targetX, targetY);
              }
              // Auto-trigger 007 (006a: Nakula langsung menyapa tanpa tombol aksi)
              this.time.delayedCall(300, () => {
                this.scene.get('UI').startDialogue('lvl1_007_nakula');
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_005a_walk'] = _handler_8;

/* ── Action: lvl1_005b_approach ── */
const _handler_9 = function(scene, action) {
        // 005b-7a: Nakula kembali mendekati Nabula
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula && this.player) {
          this.player.isCutsceneActive = true;
          if (this.player.sprite && this.player.sprite.body) {
            this.player.sprite.body.enable = false;
          }
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);
          const targetX = nabula.sprite.x - 48;
          const targetY = nabula.sprite.y;

          const dx = targetX - this.player.sprite.x;
          if (dx < 0) {
            this.player.facing = 'left';
            this.player.sprite.setFlipX(true);
          } else {
            this.player.facing = 'right';
            this.player.sprite.setFlipX(false);
          }
          this.player.sprite.anims.play('player_walk_' + this.player.facing, true);

          this.tweens.add({
            targets: this.player.sprite,
            x: targetX,
            y: targetY,
            duration: 2200,
            ease: 'Linear',
            onComplete: () => {
              this.player.facing = 'right';
              this.player.sprite.setFlipX(false);
              this.player.sprite.anims.play('player_idle_right', true);
              this.player.isCutsceneActive = false;
              if (this.player.sprite && this.player.sprite.body) {
                this.player.sprite.body.enable = true;
                this.player.sprite.body.reset(targetX, targetY);
              }
              this.time.delayedCall(300, () => {
                this.scene.get('UI').startDialogue('lvl1_007_nakula');
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_005b_approach'] = _handler_9;

/* ── Action: lvl1_012_focus_nabula, lvl1_005b_focus_nabula ── */
const _handler_10 = function(scene, action) {
        // 012: Kunci kontrol Nakula saat kamera mengarah ke Nabula
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          if (this.player.sprite) this.player.sprite.setVelocity(0, 0);
        }
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          this.panCameraToActor(nabula, 800);
        }
};
window.LEVEL_1_ACTIONS['lvl1_012_focus_nabula'] = _handler_10;
window.LEVEL_1_ACTIONS['lvl1_005b_focus_nabula'] = _handler_10;

/* ── Action: lvl1_012_nabula_leaves, lvl1_005b_nabula_leaves ── */
const _handler_11 = function(scene, action) {
        // Gerakan dan kamera Nabula disamakan antara 012 dan 005b
        // 012 & 013: Nakula TETAP tidak bisa digerakkan sampai kamera kembali tepat ke Nakula di 013!
        this.registry.set('level1_012_completed', true);
        this.registry.set('level1_player_locked', true);
        if (this.player) {
          this.player.isLocked = true;
          if (this.player.sprite) this.player.sprite.setVelocity(0, 0);
        }
        const isFrom005b = (action === 'lvl1_005b_nabula_leaves');
        if (isFrom005b) {
          if (this._lvl1_005b_nabula_leaves_done) return;
          this._lvl1_005b_nabula_leaves_done = true;
        }
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          nabula.clearEmotion();
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(nabula.sprite, true, 0.25, 0.25);

          // Langkah 1: Berjalan ke kanan menuju (15, 9.5)
          nabula.sprite.setFlipX(false);
          nabula.sprite.anims.play('nabula_walk_right', true);

          const step1X = 15 * TILE;
          const step1Y = 9 * TILE + TILE / 2;
          const step2X = 15 * TILE;
          const step2Y = 0; // Pintu utara taman menuju lapangan sekolah

          this.tweens.chain({
            targets: nabula.sprite,
            tweens: [
              {
                x: step1X,
                y: step1Y,
                duration: 800,
                ease: 'Linear'
              },
              {
                x: step2X,
                y: step2Y,
                duration: 3000,
                ease: 'Linear',
                onStart: () => {
                  nabula.sprite.setFlipX(false);
                  nabula.sprite.anims.play('nabula_walk_up', true);
                }
              }
            ],
            onComplete: () => {
              // Nabula hilang dari map taman
              this.registry.set('level1_nabula_left_garden', true);
              nabula.dialogueId = null;
              nabula.sprite.setActive(false).setVisible(false);
              if (nabula.sprite.body) nabula.sprite.body.enable = false;
              if (nabula.clearEmotion) nabula.clearEmotion();
              if (nabula.indicator && nabula.indicator.destroy) nabula.indicator.destroy();
              // Dialog 012 tertutup otomatis saat Nabula menghilang (005b sudah tertutup saat onCloseAction)
              if (!isFrom005b) {
                const ui = this.scene.get('UI');
                if (ui && ui._closeDialogue) {
                  ui._closeDialogue();
                }
              }

              // 013: Kamera kembali menyorot Nakula
              this.panCameraToActor(this.player, 1000, true, 1, () => {
                this.currentTransitions = this._getTransitions('garden');

                if (isFrom005b) {
                  // 005b-9b: Tampilkan dialog ECA (Nakula masih tetap diam sampai quest timer dimulai)
                  this.scene.get('UI').startDialogue('lvl1_005b_9b_eca');
                } else {
                  // 013 selesai: Kamera sudah kembali tepat ke Nakula!
                  // NAKULA SEKARANG BISA DIGERAKKAN!
                  this.registry.set('level1_player_locked', false);
                  if (this.player) {
                    this.player.isLocked = false;
                  }
                  // 014: UI QUEST "Ikuti Nabula ke perpustakaan."
                  this.registry.set('level1_quest_active', 'ikuti_nabula');
                  const ui = this.scene.get('UI');
                  if (ui && ui.showQuest) {
                    ui.showQuest('QUEST: Ikuti Nabula ke perpustakaan.');
                  }
                  if (navigator.vibrate) navigator.vibrate(100);
                }
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_012_nabula_leaves'] = _handler_11;
window.LEVEL_1_ACTIONS['lvl1_005b_nabula_leaves'] = _handler_11;

/* ── Action: lvl1_005b_start_timer_quest ── */
const _handler_12 = function(scene, action) {
        // 005b-9c: QUEST (BATAS WAKTU) 30 detik
        this.registry.set('level1_player_locked', false);
        if (this.player) this.player.isLocked = false;
        this.registry.set('level1_quest_active', 'susul_nabula_timed');
        this.currentTransitions = this._getTransitions('garden');

        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('QUEST (BATAS WAKTU): Susul Nabula ke perpustakaan.', {
            hasTimer: true,
            durationSec: 30,
            onTimeout: () => {
              this.handleLevel1TimeoutFail();
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_005b_start_timer_quest'] = _handler_12;

/* ── Action: lvl1_005b_fail_fade ── */
const _handler_13 = function(scene, action) {
        if (window.audioManager) {
          window.audioManager.playSchoolBell(0.7);
        }
        this.cameras.main.fadeOut(800, 0, 0, 0);
};
window.LEVEL_1_ACTIONS['lvl1_005b_fail_fade'] = _handler_13;

/* ── Action: lvl1_005b_show_fail_result ── */
const _handler_14 = function(scene, action) {
        this.registry.set('harmony', 0);
        window.dispatchEvent(new CustomEvent('show_level_fail_modal', {
          detail: {
            score: 0,
            status: 'Harmonia Padam',
            message: 'Nabula nggak sempat dapat bantuan kali ini. Tapi ini bukan akhir, yuk coba lagi dan perhatikan tanda-tanda saat teman butuh kamu.'
          }
        }));
};
window.LEVEL_1_ACTIONS['lvl1_005b_show_fail_result'] = _handler_14;

/* ── Action: lvl1_005c_enable_move ── */
const _handler_15 = function(scene, action) {
        this.cameras.main.stopFollow();
        this.tweens.killTweensOf(this.cameras.main);
        this.cameras.main.startFollow(this.player.sprite, true, 1, 1);
        this.registry.set('level1_player_locked', false);
        if (this.player) this.player.isLocked = false;
};
window.LEVEL_1_ACTIONS['lvl1_005c_enable_move'] = _handler_15;

/* ── Action: vibrate_choice ── */
const _handler_16 = function(scene, action) {
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
};
window.LEVEL_1_ACTIONS['vibrate_choice'] = _handler_16;

/* ── Action: vibrate_soft ── */
const _handler_17 = function(scene, action) {
        if (navigator.vibrate) navigator.vibrate(60);
};
window.LEVEL_1_ACTIONS['vibrate_soft'] = _handler_17;

/* ── Action: lvl1_017_focus_bullies ── */
const _handler_18 = function(scene, action) {
        // 017: Sorot Bagas dan Rio di koordinat (4.5, 13)
        this._focusCameraOnBullies();
};
window.LEVEL_1_ACTIONS['lvl1_017_focus_bullies'] = _handler_18;

/* ── Action: lvl1_019_focus_nabula ── */
const _handler_19 = function(scene, action) {
        // Pemain selesai membaca dialog Rio (019).
        // Gerakkan kamera ke Nabula di (8.5, 16) TERLEBIH DAHULU.
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          this.panCameraToActor(nabula, 800, false, 1, () => {
            // Setelah kamera sampai di Nabula, baru tampilkan dialog lvl1_020_narrator!
            const ui = this.scene.get('UI');
            if (ui && ui.startDialogue) {
              ui.startDialogue('lvl1_020_narrator');
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_019_focus_nabula'] = _handler_19;

/* ── Action: lvl1_020_nabula_runs ── */
const _handler_20 = function(scene, action) {
        // 020: Nabula lari terburu-buru keluar dari perpustakaan (3 langkah kecepatan konstan: ~300 px/s)
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula) {
          if (nabula.clearEmotion) nabula.clearEmotion();
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(nabula.sprite, true, 0.1, 0.1);

          // Langkah 1: Mulai lari ke kiri menuju (7, 16)
          nabula.sprite.setFlipX(true);
          nabula.sprite.anims.play('nabula_walk_left', true);

          this.tweens.chain({
            targets: nabula.sprite,
            tweens: [
              {
                // Langkah 1: Lari ke kiri dari (8.5, 16) ke (7, 16) (1.5 tile = 96 px) - 320 ms (~300 px/s)
                x: 7 * TILE + TILE / 2,
                duration: 320,
                ease: 'Linear',
                onComplete: () => {
                  nabula.sprite.setFlipX(false);
                  nabula.sprite.anims.play('nabula_walk_up', true);
                }
              },
              {
                // Langkah 2: Lari ke atas di lorong kolom 7 dari baris 16 ke baris 9 (7 tile = 448 px) - 1500 ms (~300 px/s)
                y: 9 * TILE + TILE / 2,
                duration: 1500,
                ease: 'Linear',
                onComplete: () => {
                  nabula.sprite.setFlipX(true);
                  nabula.sprite.anims.play('nabula_walk_left', true);
                }
              },
              {
                // Langkah 3: Lari ke kiri di baris 9 dari kolom 7 ke kolom 0 (7 tile = 448 px) - 1500 ms (~300 px/s)
                x: 0 * TILE + TILE / 2,
                duration: 1500,
                ease: 'Linear'
              }
            ],
            onComplete: () => {
              nabula.sprite.setActive(false).setVisible(false);
              if (nabula.sprite.body) nabula.sprite.body.enable = false;
              if (nabula.indicator) nabula.indicator.destroy();
              this.registry.set('level1_020_done', true);

              // Tutup dialog narator 020 saat Nabula menghilang
              const ui = this.scene.get('UI');
              if (ui && ui._closeDialogue) {
                ui._closeDialogue();
              }

              // 021: Kamera kembali mengarah ke Nakula
              this.panCameraToActor(this.player, 900, true, 1, () => {
                // 022: Auto-trigger dialog Nakula
                if (ui && ui.startDialogue) {
                  ui.startDialogue('lvl1_022_nakula');
                }
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_020_nabula_runs'] = _handler_20;

/* ── Action: lvl1_024_start_clue_quest ── */
const _handler_21 = function(scene, action) {
        // 024: PROGRES: Temukan petunjuk (0/3)
        this.registry.set('level1_017_done', true);
        this.registry.set('level1_player_locked', false);
        if (this.player) this.player.isLocked = false;
        this.registry.set('level1_clue_quest_active', true);
        this.registry.set('level1_clues_found', 0);
        this.registry.set('level1_clue_book_found', false);
        this.registry.set('level1_clue_wulan_found', false);
        this.registry.set('level1_clue_students_found', false);

        // Update Wulan ke dialog petunjuk
        const wulan = this.npcs.find(n => n.key === 'wulan');
        if (wulan) {
          wulan.dialogueId = 'lvl1_033_nakula';
          if (!wulan.indicator) {
            wulan.indicator = this.add.circle(wulan.sprite.x, wulan.sprite.y - 20, 4, 0xfacc15).setDepth(10);
            this.tweens.add({ targets: wulan.indicator, alpha: { from: 0.3, to: 1 }, yoyo: true, repeat: -1, duration: 800 });
          }
        }

        // Spawn Buku Robek di (17, 17) jika berada di perpustakaan
        let book = this.npcs.find(n => n.key === 'clue_book');
        if (!book && this.registry.get('currentMap') === 'library') {
          book = new NPC(this, 17 * TILE + TILE / 2, 17 * TILE + TILE / 2,
            'clue_book', 'lvl1_027_narrator', { name: 'Buku Tugas Robek' });
          this.npcs.push(book);
        }

        // Pastikan kamera follow Nakula
        this.cameras.main.stopFollow();
        this.tweens.killTweensOf(this.cameras.main);
        this.cameras.main.startFollow(this.player.sprite, true, 1, 1);

        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('PROGRES: Temukan petunjuk di perpustakaan (0/3)');
        }
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
};
window.LEVEL_1_ACTIONS['lvl1_024_start_clue_quest'] = _handler_21;

/* ── Action: lvl1_030_clue_found_book ── */
const _handler_22 = function(scene, action) {
        this._onClueFound('book');
};
window.LEVEL_1_ACTIONS['lvl1_030_clue_found_book'] = _handler_22;

/* ── Action: lvl1_037_clue_found_wulan ── */
const _handler_23 = function(scene, action) {
        this._onClueFound('wulan');
};
window.LEVEL_1_ACTIONS['lvl1_037_clue_found_wulan'] = _handler_23;

/* ── Action: lvl1_044_camera_to_nakula ── */
const _handler_24 = function(scene, action) {
        this.panCameraToActor(this.player, 800, true, 1);
};
window.LEVEL_1_ACTIONS['lvl1_044_camera_to_nakula'] = _handler_24;

/* ── Action: lvl1_056_camera_to_nakula ── */
const _handler_25 = function(scene, action) {
        console.log('%c[Kantin 056] Rio selesai bicara. Kamera bergeser kembali ke Nakula di pintu masuk (29, 13)...', 'color: #3b82f6; font-weight: bold;');
        const targetX = 29 * TILE + TILE / 2;
        const targetY = 13 * TILE + TILE / 2;
        this.panCameraTo(targetX, targetY, 850, 'Sine.easeInOut', () => {
          console.log('%c[Kantin 057] Kamera sampai di Nakula! Membuka dialog lvl1_057_eca...', 'color: #22c55e; font-weight: bold;');
          const ui = this.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui.startDialogue('lvl1_057_eca');
          }
        });
};
window.LEVEL_1_ACTIONS['lvl1_056_camera_to_nakula'] = _handler_25;

/* ── Action: lvl1_057_focus_nabula ── */
const _handler_26 = function(scene, action) {
        const targetX = 11.9 * TILE + TILE / 2;
        const targetY = 6 * TILE + TILE / 2;
        console.log('%c[Kantin 057] Dialog 057 selesai. Kamera bergeser kembali mengarah ke meja Nabula (11.9, 6)...', 'color: #3b82f6; font-weight: bold;');
        this.panCameraTo(targetX, targetY, 900, 'Sine.easeInOut', () => {
          console.log('%c[Kantin 057b] Kamera selesai bergerak ke meja Nabula! Membuka dialog lvl1_057b_eca...', 'color: #22c55e; font-weight: bold;');
          const ui = this.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui.startDialogue('lvl1_057b_eca');
          }
        });
};
window.LEVEL_1_ACTIONS['lvl1_057_focus_nabula'] = _handler_26;

/* ── Action: lvl1_046_clue_found_students ── */
const _handler_27 = function(scene, action) {
        this._onClueFound('students');
};
window.LEVEL_1_ACTIONS['lvl1_046_clue_found_students'] = _handler_27;

/* ── Action: lvl1_046_all_clues_collected ── */
const _handler_28 = function(scene, action) {
        this.registry.set('level1_player_locked', false);
        if (this.player) this.player.isLocked = false;
        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('3/3 — Semua petunjuk di perpustakaan terkumpul.');
        }
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);

        this.time.delayedCall(2200, () => {
          // 047: UI QUEST "Pergi ke kantin."
          this.registry.set('level1_quest_active', 'pergi_ke_kantin');
          if (ui && ui.showQuest) {
            ui.showQuest('QUEST: Pergi ke kantin.');
          }
          if (navigator.vibrate) navigator.vibrate(100);
        });
};
window.LEVEL_1_ACTIONS['lvl1_046_all_clues_collected'] = _handler_28;

/* ── Action: lvl1_049_focus_cafeteria, lvl1_049_bullies_approach ── */
const _handler_29 = function(scene, action) {
        const bagas = this.npcs.find(n => n.key === 'bagas');
        const rio = this.npcs.find(n => n.key === 'rio');

        console.log('%c[Kantin 049] Bagas & Rio mulai berjalan santai menghampiri meja Nabula...', 'color: #f59e0b; font-weight: bold;');

        // Bagas: dari (13.3, 4) -> (13.3, 5.5) (1.5 tile = 96 px, durasi 1050 ms, ~91.4 px/s)
        if (bagas) {
          bagas.sprite.setFlipX(false);
          bagas.sprite.anims.play('bagas_walk_down', true);
          this.tweens.add({
            targets: bagas.sprite,
            y: 5.5 * TILE + TILE / 2,
            duration: 1050,
            ease: 'Linear',
            onComplete: () => {
              bagas.sprite.setFlipX(false);
              bagas.sprite.anims.play('bagas_idle_left', true);
            }
          });
        }

        // Rio: 2 Langkah:
        // Langkah 1: dari (14.3, 4) -> (14.3, 6.5) (2.5 tile = 160 px, durasi 1750 ms, ~91.4 px/s)
        // Langkah 2: dari (14.3, 6.5) -> (13.3, 6.5) (1.0 tile = 64 px, durasi 700 ms, ~91.4 px/s)
        if (rio) {
          rio.sprite.setFlipX(false);
          rio.sprite.anims.play('rio_walk_down', true);

          this.tweens.chain({
            targets: rio.sprite,
            tweens: [
              {
                y: 6.5 * TILE + TILE / 2,
                duration: 1750,
                ease: 'Linear',
                onComplete: () => {
                  rio.sprite.setFlipX(false);
                  rio.sprite.anims.play('rio_walk_left', true);
                }
              },
              {
                x: 13.3 * TILE + TILE / 2,
                duration: 700,
                ease: 'Linear'
              }
            ],
            onComplete: () => {
              rio.sprite.setFlipX(false);
              rio.sprite.anims.play('rio_idle_left', true);

              console.log('%c[Kantin 049] Bagas & Rio selesai bergerak ke meja Nabula. Mengizinkan pemain melanjutkan dialog ke 050...', 'color: #10b981; font-weight: bold;');
              const ui = this.scene.get('UI');
              if (ui && ui.enableDialogueAdvance) {
                ui.enableDialogueAdvance('lvl1_050_bagas');
              } else if (ui && ui._setupDialogueAdvance) {
                ui._setupDialogueAdvance(() => {
                  ui._showNode('lvl1_050_bagas');
                });
              }
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_049_focus_cafeteria'] = _handler_29;
window.LEVEL_1_ACTIONS['lvl1_049_bullies_approach'] = _handler_29;

/* ── Action: lvl1_058_start_timer, lvl1_058_show_cafeteria_choice ── */
const _handler_30 = function(scene, action) {
        this.registry.set('level1_049_done', true);
        this._cafeteriaCutsceneRunning = false;
        console.log('%c[Kantin 058] Node pilihan intervensi muncul! Memulai countdown timer 15 detik...', 'color: #38bdf8; font-weight: bold;');
        if (window.audioManager) {
          window.audioManager.playLoop('clockTicking', 0.4);
        }
        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('PILIH TINDAKAN (BATAS WAKTU: 15 DETIK)', {
            hasTimer: true,
            durationSec: 15,
            onTimeout: () => {
              this.handleCafeteriaChoiceTimeout();
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_058_start_timer'] = _handler_30;
window.LEVEL_1_ACTIONS['lvl1_058_show_cafeteria_choice'] = _handler_30;

/* ── Action: lvl1_059a_chosen, lvl1_059b_chosen, lvl1_059c_chosen ── */
const _handler_31 = function(scene, action) {
        this._cafeteriaChoiceTimeoutCount = 0;
        console.log(`%c[Kantin 058] Pemain memilih: ${action}! Timer dibatalkan dan harmoni ditambahkan +25.`, 'color: #10b981; font-weight: bold;');
        const ui = this.scene.get('UI');
        if (ui && ui.hideQuestBanner) {
          ui.hideQuestBanner();
        }
        if (action === 'lvl1_059a_chosen') {
          this.registry.set('level1_route_chosen', 'A');
        } else if (action === 'lvl1_059b_chosen') {
          this.registry.set('level1_route_chosen', 'B');
        } else if (action === 'lvl1_059c_chosen') {
          this.registry.set('level1_route_chosen', 'C');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059a_chosen'] = _handler_31;
window.LEVEL_1_ACTIONS['lvl1_059b_chosen'] = _handler_31;
window.LEVEL_1_ACTIONS['lvl1_059c_chosen'] = _handler_31;

/* ── Action: lvl1_059a_walk_to_table ── */
const _handler_32 = function(scene, action) {
        console.log('%c[Kantin 059a] Nakula berjalan ke meja Nabula...', 'color: #3b82f6; font-weight: bold;');
        this.registry.set('level1_player_locked', true);
        if (this.player && this.player.sprite) {
          this.player.isLocked = true;
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

          const p = this.player.sprite;
          p.setFlipX(false);
          p.anims.play('player_walk_up', true);
          this.tweens.add({
            targets: p,
            y: 9 * TILE + TILE / 2,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
              p.setFlipX(true);
              p.anims.play('player_walk_left', true);
              this.tweens.add({
                targets: p,
                x: 11.9 * TILE + TILE / 2,
                duration: 2200,
                ease: 'Linear',
                onComplete: () => {
                  p.setFlipX(false);
                  p.anims.play('player_walk_up', true);
                  this.tweens.add({
                    targets: p,
                    y: 7.5 * TILE + TILE / 2,
                    duration: 600,
                    ease: 'Linear',
                    onComplete: () => {
                      p.anims.play('player_idle_up', true);
                      this.player.facing = 'up';
                      console.log('%c[Kantin 059a] Nakula sampai di meja Nabula! Membuka dialog 059a-2...', 'color: #22c55e; font-weight: bold;');
                      const ui = this.scene.get('UI');
                      if (ui && ui.startDialogue) {
                        ui.startDialogue('lvl1_059a_2_nakula');
                      }
                    }
                  });
                }
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_059a_walk_to_table'] = _handler_32;

/* ── Action: lvl1_059a_bullies_turn ── */
const _handler_33 = function(scene, action) {
        console.log('%c[Kantin 059a] Bagas dan Rio menoleh terkejut ke arah Nakula...', 'color: #f59e0b; font-weight: bold;');
        const bagas = this.npcs.find(n => n.key === 'bagas');
        const rio = this.npcs.find(n => n.key === 'rio');
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (bagas && bagas.sprite) {
          bagas.sprite.anims.play('bagas_idle_down', true);
        }
        if (rio && rio.sprite) {
          rio.sprite.anims.play('rio_idle_down', true);
        }
        if (nabula && nabula.showEmotion) {
          nabula.showEmotion('😮');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059a_bullies_turn'] = _handler_33;

/* ── Action: lvl1_059a_bullies_leave ── */
const _handler_34 = function(scene, action) {
        console.log('%c[Kantin 059a] Bagas dan Rio meninggalkan meja kantin berurutan, Nakula duduk di depan Nabula...', 'color: #f59e0b; font-weight: bold;');
        let bulliesDone = false;
        let nakulaDone = false;

        const checkBothDone = () => {
          if (bulliesDone && nakulaDone) {
            console.log('%c[Kantin 059a] Bagas/Rio telah bubar dan Nakula sudah duduk di depan Nabula. Mengizinkan lanjut dialog...', 'color: #10b981; font-weight: bold;');
            const ui = this.scene.get('UI');
            if (ui && ui.enableDialogueAdvance) {
              ui.enableDialogueAdvance('lvl1_059a_11_nabula');
            } else if (ui && ui._setupDialogueAdvance) {
              ui._setupDialogueAdvance(() => {
                ui._showNode('lvl1_059a_11_nabula');
              });
            }
          }
        };

        this._bulliesLeaveCafeteria(() => {
          bulliesDone = true;
          checkBothDone();
        });

        // Setelah Bagas & Rio mulai bergerak turun menjauhi meja (jeda 700ms), Nakula berjalan ke kursi di depan Nabula (13.3, 6)
        this.time.delayedCall(700, () => {
          if (this.player && this.player.sprite) {
            const p = this.player.sprite;
            p.setFlipX(false);
            p.anims.play('player_walk_right', true);

            this.tweens.chain({
              targets: p,
              tweens: [
                {
                  x: 13.3 * TILE + TILE / 2,
                  duration: 250,
                  ease: 'Linear',
                  onComplete: () => {
                    p.anims.play('player_walk_up', true);
                  }
                },
                {
                  y: 6 * TILE + TILE / 2,
                  duration: 250,
                  ease: 'Linear',
                  onComplete: () => {
                    p.setFlipX(true);
                    p.anims.play('player_idle_left', true);
                    this.player.facing = 'left';
                    const nabula = this.npcs.find(n => n.key === 'nabula');
                    if (nabula && nabula.sprite) {
                      nabula.sprite.anims.play('nabula_idle_right', true);
                    }
                    nakulaDone = true;
                    checkBothDone();
                  }
                }
              ]
            });
          } else {
            nakulaDone = true;
            checkBothDone();
          }
        });
};
window.LEVEL_1_ACTIONS['lvl1_059a_bullies_leave'] = _handler_34;

/* ── Action: lvl1_059a_complete ── */
const _handler_35 = function(scene, action) {
        console.log('%c[Kantin 059a] Jalur A selesai! Transisi ke Node 060...', 'color: #10b981; font-weight: bold;');
        this.registry.set('level1_branch_a_done', true);
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula && nabula.showEmotion) {
          nabula.showEmotion('😊');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059a_complete'] = _handler_35;

/* ── Action: lvl1_059b_start_quest ── */
const _handler_36 = function(scene, action) {
        console.log('%c[Kantin 059b] Mulai Quest: Cari Bu Wati di perpustakaan...', 'color: #3b82f6; font-weight: bold;');
        this.registry.set('level1_quest_active', 'lapor_bu_wati_branch_b');
        this.registry.set('level1_player_locked', false);
        if (this.player) {
          this.player.isLocked = false;
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        }
        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('QUEST: Cari Bu Wati di perpustakaan.');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059b_start_quest'] = _handler_36;

/* ── Action: lvl1_059b_met_bu_wati ── */
const _handler_37 = function(scene, action) {
        console.log('%c[Perpustakaan 059b] Nakula berbicara dengan Bu Wati...', 'color: #10b981; font-weight: bold;');
        const ui = this.scene.get('UI');
        if (ui && ui.completeQuest) {
          ui.completeQuest('Cari Bu Wati di perpustakaan.');
        }
        const wati = this.npcs.find(n => n.key === 'wati');
        if (wati && wati.clearEmotion) {
          wati.clearEmotion();
        }
};
window.LEVEL_1_ACTIONS['lvl1_059b_met_bu_wati'] = _handler_37;

/* ── Action: lvl1_059b_walk_out_library ── */
const _handler_38 = function(scene, action) {
        console.log('%c[Perpustakaan 059b] Bu Wati & Nakula berjalan keluar perpustakaan menuju kantin, layar menggelap...', 'color: #3b82f6; font-weight: bold;');
        this.registry.set('level1_player_locked', true);
        const wati = this.npcs.find(n => n.key === 'wati');

        // Layar langsung menggelap begitu dialog muncul
        this.cameras.main.fadeOut(800, 0, 0, 0);

        // Bu Wati berjalan memimpin ke arah pintu keluar (1, 9.5)
        if (wati && wati.sprite) {
          const ws = wati.sprite;
          ws.setFlipX(false);
          ws.anims.play('wati_walk_down', true);

          this.tweens.chain({
            targets: ws,
            tweens: [
              {
                y: 3.5 * TILE + TILE / 2,
                duration: 400,
                ease: 'Linear',
                onComplete: () => {
                  ws.setFlipX(true);
                  ws.anims.play('wati_walk_left', true);
                }
              },
              {
                x: 6.5 * TILE + TILE / 2,
                duration: 400,
                ease: 'Linear',
                onComplete: () => {
                  ws.setFlipX(false);
                  ws.anims.play('wati_walk_down', true);
                }
              },
              {
                y: 9.5 * TILE + TILE / 2,
                duration: 600,
                ease: 'Linear',
                onComplete: () => {
                  ws.setFlipX(true);
                  ws.anims.play('wati_walk_left', true);
                }
              },
              {
                x: 1 * TILE + TILE / 2,
                duration: 600,
                ease: 'Linear'
              }
            ]
          });
        }

        // Nakula mengikuti di belakang Bu Wati
        if (this.player && this.player.sprite) {
          const p = this.player.sprite;
          p.setFlipX(true);
          p.anims.play('player_walk_left', true);

          this.tweens.chain({
            targets: p,
            tweens: [
              {
                x: 6.5 * TILE + TILE / 2,
                duration: 400,
                ease: 'Linear',
                onComplete: () => {
                  p.setFlipX(false);
                  p.anims.play('player_walk_down', true);
                }
              },
              {
                y: 9.5 * TILE + TILE / 2,
                duration: 600,
                ease: 'Linear',
                onComplete: () => {
                  p.setFlipX(true);
                  p.anims.play('player_walk_left', true);
                }
              },
              {
                x: 1.8 * TILE + TILE / 2,
                duration: 600,
                ease: 'Linear'
              }
            ]
          });
        }

        // Tunggu 5 detik baru pemain bisa melanjutkan / next dialog (bukan menunggu gerakan selesai)
        this.time.delayedCall(5000, () => {
          console.log('%c[Perpustakaan 059b] 5 detik berlalu. Mengizinkan pemain melanjutkan / next dialog...', 'color: #10b981; font-weight: bold;');
          const ui = this.scene.get('UI');
          if (ui && ui.enableDialogueAdvance) {
            ui.enableDialogueAdvance();
          }
        });
};
window.LEVEL_1_ACTIONS['lvl1_059b_walk_out_library'] = _handler_38;

/* ── Action: lvl1_059b_transition_to_cafeteria ── */
const _handler_39 = function(scene, action) {
        console.log('%c[Perpustakaan 059b] Transisi ke kantin bersama Bu Wati...', 'color: #38bdf8; font-weight: bold;');
        this.registry.set('level1_quest_active', null);
        this.registry.set('level1_branch_b_bu_wati_at_cafeteria', true);
        this.registry.set('level1_058x_nabula_left', false);
        this.registry.set('level1_058x_bullies_left', false);
        const ui = this.scene.get('UI');
        if (ui && ui.completeQuest) {
          ui.completeQuest('Cari Bu Wati di perpustakaan.');
        }
        this._changeMap('cafeteria', 29 * TILE + TILE / 2, 13 * TILE + TILE / 2);
};
window.LEVEL_1_ACTIONS['lvl1_059b_transition_to_cafeteria'] = _handler_39;

/* ── Action: lvl1_059b_focus_bu_wati ── */
const _handler_40 = function(scene, action) {
        console.log('%c[Kantin 059b] Mengarahkan kamera dari Nabula ke Bu Wati & Nakula...', 'color: #3b82f6; font-weight: bold;');
        const wati = this.npcs.find(n => n.key === 'wati');
        const targetX = (wati && wati.sprite) ? wati.sprite.x : (28 * TILE + TILE / 2);
        const targetY = (wati && wati.sprite) ? wati.sprite.y : (13 * TILE + TILE / 2);

        this.panCameraTo(targetX, targetY, 850, 'Sine.easeInOut', () => {
          console.log('%c[Kantin 059b] Kamera selesai pan ke Bu Wati. Membuka dialog 059b-9...', 'color: #10b981; font-weight: bold;');
          this.time.delayedCall(200, () => {
            const ui = this.scene.get('UI');
            if (ui && ui.startDialogue) {
              ui.startDialogue('lvl1_059b_9_bu_wati');
            }
          });
        });
};
window.LEVEL_1_ACTIONS['lvl1_059b_focus_bu_wati'] = _handler_40;

/* ── Action: lvl1_059b_walk_to_table ── */
const _handler_41 = function(scene, action) {
        console.log('%c[Kantin 059b] Bu Wati dan Nakula berjalan menghampiri meja Nabula...', 'color: #3b82f6; font-weight: bold;');
        this.registry.set('level1_player_locked', true);
        const wati = this.npcs.find(n => n.key === 'wati');
        const stepSpeed = 160; // ms per tile konsisten jalan santai

        // Kamera mengikuti Bu Wati yang memimpin di depan
        if (wati && wati.sprite) {
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(wati.sprite, true, 0.08, 0.08);
        }

        // 1. Bu Wati berjalan terlebih dahulu memimpin di depan dari (28, 13)
        if (wati && wati.sprite) {
          const ws = wati.sprite;
          ws.setFlipX(false);
          ws.anims.play('wati_walk_up', true);

          this.tweens.chain({
            targets: ws,
            tweens: [
              {
                y: 9 * TILE + TILE / 2,
                duration: 4 * stepSpeed,
                ease: 'Linear',
                onComplete: () => {
                  ws.setFlipX(true);
                  ws.anims.play('wati_walk_left', true);
                }
              },
              {
                x: 13.3 * TILE + TILE / 2,
                duration: Math.round((28 - 13.3) * stepSpeed),
                ease: 'Linear',
                onComplete: () => {
                  ws.setFlipX(false);
                  ws.anims.play('wati_walk_up', true);
                }
              },
              {
                y: 7.5 * TILE + TILE / 2,
                duration: Math.round(1.5 * stepSpeed),
                ease: 'Linear',
                onComplete: () => {
                  ws.anims.play('wati_idle_up', true);
                }
              }
            ]
          });
        }

        // 2. Nakula mengikuti berurutan di belakang Bu Wati dengan jeda 380ms dari (29, 13)
        if (this.player && this.player.sprite) {
          this.player.isLocked = true;
          const p = this.player.sprite;

          this.time.delayedCall(380, () => {
            p.setFlipX(false);
            p.anims.play('player_walk_up', true);

            this.tweens.chain({
              targets: p,
              tweens: [
                {
                  y: 9 * TILE + TILE / 2,
                  duration: 4 * stepSpeed,
                  ease: 'Linear',
                  onComplete: () => {
                    p.setFlipX(true);
                    p.anims.play('player_walk_left', true);
                  }
                },
                {
                  x: 11.9 * TILE + TILE / 2,
                  duration: Math.round((29 - 11.9) * stepSpeed),
                  ease: 'Linear',
                  onComplete: () => {
                    p.setFlipX(false);
                    p.anims.play('player_walk_up', true);
                  }
                },
                {
                  y: 7.5 * TILE + TILE / 2,
                  duration: Math.round(1.5 * stepSpeed),
                  ease: 'Linear',
                  onComplete: () => {
                    p.anims.play('player_idle_up', true);
                    this.player.facing = 'up';
                    this.registry.set('level1_branch_b_reached_table', true);

                    console.log('%c[Kantin 059b] Bu Wati & Nakula tiba di meja! Membuka dialog 059b-12...', 'color: #22c55e; font-weight: bold;');
                    this.time.delayedCall(400, () => {
                      const ui = this.scene.get('UI');
                      if (ui && ui.startDialogue) {
                        ui.startDialogue('lvl1_059b_12_bu_wati');
                      }
                    });
                  }
                }
              ]
            });
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_059b_walk_to_table'] = _handler_41;

/* ── Action: lvl1_059b_fade_out_cafeteria ── */
const _handler_42 = function(scene, action) {
        console.log('%c[Kantin 059b] Layar menggelap seketika saat dialog 059b-15b muncul...', 'color: #64748b; font-weight: bold;');
        const bagas = this.npcs.find(n => n.key === 'bagas');
        const rio = this.npcs.find(n => n.key === 'rio');
        const wati = this.npcs.find(n => n.key === 'wati');
        this.registry.set('level1_058x_bullies_left', true);
        this.registry.set('level1_branch_b_bu_wati_at_cafeteria', false);

        // Langsung fadeOut
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          if (bagas && bagas.sprite) bagas.sprite.setVisible(false);
          if (rio && rio.sprite) rio.sprite.setVisible(false);
          if (wati && wati.sprite) wati.sprite.setVisible(false);
        });
};
window.LEVEL_1_ACTIONS['lvl1_059b_fade_out_cafeteria'] = _handler_42;

/* ── Action: lvl1_059b_fade_in_cafeteria ── */
const _handler_43 = function(scene, action) {
        console.log('%c[Kantin 059b] Dialog 059b-16 muncul! Nakula duduk di depan Nabula dan layar kembali terang...', 'color: #10b981; font-weight: bold;');
        const bagas = this.npcs.find(n => n.key === 'bagas');
        const rio = this.npcs.find(n => n.key === 'rio');
        const wati = this.npcs.find(n => n.key === 'wati');
        if (bagas && bagas.sprite) bagas.sprite.setVisible(false);
        if (rio && rio.sprite) rio.sprite.setVisible(false);
        if (wati && wati.sprite) wati.sprite.setVisible(false);

        // Reposisi Nakula di depan Nabula (13.3, 6) menghadap kiri
        if (this.player && this.player.sprite) {
          this.player.sprite.x = 13.3 * TILE + TILE / 2;
          this.player.sprite.y = 6 * TILE + TILE / 2;
          this.player.sprite.setFlipX(true);
          this.player.sprite.anims.play('player_idle_left', true);
          this.player.facing = 'left';
        }
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula && nabula.sprite) {
          nabula.sprite.anims.play('nabula_idle_right', true);
        }

        this.cameras.main.stopFollow();
        this.tweens.killTweensOf(this.cameras.main);
        this.cameras.main.centerOn(12.6 * TILE + TILE / 2, 6 * TILE + TILE / 2);

        // Layar kembali terang
        this.cameras.main.fadeIn(600, 0, 0, 0);
};
window.LEVEL_1_ACTIONS['lvl1_059b_fade_in_cafeteria'] = _handler_43;

/* ── Action: lvl1_059b_complete ── */
const _handler_44 = function(scene, action) {
        console.log('%c[Kantin 059b] Jalur B selesai! Transisi ke Node 060...', 'color: #10b981; font-weight: bold;');
        this.registry.set('level1_branch_b_done', true);
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula && nabula.showEmotion) {
          nabula.showEmotion('😊');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059b_complete'] = _handler_44;

/* ── Action: lvl1_059c_focus_nabula ── */
const _handler_45 = function(scene, action) {
        console.log('%c[Kantin 059c] Kamera mengarah ke Nabula...', 'color: #3b82f6; font-weight: bold;');
        this.panCameraTo(11.9 * TILE + TILE / 2, 6 * TILE + TILE / 2, 600);
};
window.LEVEL_1_ACTIONS['lvl1_059c_focus_nabula'] = _handler_45;

/* ── Action: lvl1_059c_nabula_runs_away ── */
const _handler_46 = function(scene, action) {
        console.log('%c[Kantin 059c] Nabula buru-buru berdiri dan berlari keluar...', 'color: #f59e0b; font-weight: bold;');
        const nabula = this.npcs.find(n => n.key === 'nabula');
        this.registry.set('level1_058x_nabula_left', true);
        if (nabula && nabula.sprite) {
          if (nabula.clearEmotion) nabula.clearEmotion();
          const ns = nabula.sprite;
          this.cameras.main.startFollow(ns, true, 0.08, 0.08);

          ns.anims.play('nabula_walk_down', true);
          this.tweens.add({
            targets: ns,
            y: 9 * TILE + TILE / 2,
            duration: 600,
            ease: 'Linear',
            onComplete: () => {
              ns.setFlipX(false);
              ns.anims.play('nabula_walk_right', true);
              this.tweens.add({
                targets: ns,
                x: 29 * TILE + TILE / 2,
                duration: 2000,
                ease: 'Linear',
                onComplete: () => {
                  ns.anims.play('nabula_walk_down', true);
                  this.tweens.add({
                    targets: ns,
                    y: 13 * TILE + TILE / 2,
                    duration: 600,
                    ease: 'Linear',
                    onComplete: () => {
                      this.tweens.add({
                        targets: ns,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                          ns.setVisible(false);
                          console.log('%c[Kantin 059c] Nabula keluar dari pintu kantin. Kamera kembali ke Nakula...', 'color: #22c55e; font-weight: bold;');
                          const finishNabulaRunsAway = () => {
                            const ui = this.scene.get('UI');
                            if (ui && ui.closeDialogue) {
                              ui.closeDialogue();
                            }
                          };

                          if (this.player && this.player.sprite) {
                            this.panCameraTo(this.player.sprite.x, this.player.sprite.y, 700, 'Sine.easeInOut', finishNabulaRunsAway);
                          } else {
                            finishNabulaRunsAway();
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_059c_nabula_runs_away'] = _handler_46;

/* ── Action: lvl1_059c_camera_to_nakula ── */
const _handler_47 = function(scene, action) {
        console.log('%c[Kantin 059c] Kamera kembali menyorot Nakula di pintu...', 'color: #3b82f6; font-weight: bold;');
        if (this.player && this.player.sprite) {
          this.panCameraTo(this.player.sprite.x, this.player.sprite.y, 700);
        }
};
window.LEVEL_1_ACTIONS['lvl1_059c_camera_to_nakula'] = _handler_47;

/* ── Action: lvl1_059c_start_garden_quest ── */
const _handler_48 = function(scene, action) {
        console.log('%c[Kantin 059c] Mulai Quest: Cari Nabula di taman...', 'color: #3b82f6; font-weight: bold;');
        this.registry.set('level1_quest_active', 'cari_nabula_taman_branch_c');
        this.registry.set('level1_nabula_at_garden_branch_c', true);
        this.registry.set('level1_player_locked', false);
        if (this.player) {
          this.player.isLocked = false;
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        }
        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('QUEST: Cari Nabula di taman.');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059c_start_garden_quest'] = _handler_48;

/* ── Action: lvl1_059c_transition_to_library ── */
const _handler_49 = function(scene, action) {
        console.log('%c[Taman 059c] Dialog 059c-20 dilanjutkan! Layar menggelap sebelum transisi ke perpustakaan...', 'color: #38bdf8; font-weight: bold;');
        this.registry.set('level1_player_locked', true);
        this.cameras.main.fadeOut(600, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          console.log('%c[Taman 059c] Layar sudah gelap 100%, menjalankan transisi ke perpustakaan...', 'color: #38bdf8; font-weight: bold;');
          this.registry.set('level1_quest_active', null);
          this.registry.set('level1_branch_c_nabula_at_library', true);
          this.registry.set('level1_nabula_at_garden_branch_c', false);
          const ui = this.scene.get('UI');
          if (ui && ui.completeQuest) {
            ui.completeQuest('Temui Bu Wati di perpustakaan bersama Nabula.');
          }
          this._changeMap('library', 1 * TILE + TILE / 2, 9 * TILE + TILE / 2);
        });
};
window.LEVEL_1_ACTIONS['lvl1_059c_transition_to_library'] = _handler_49;

/* ── Action: lvl1_059c_walk_to_wati ── */
const _handler_50 = function(scene, action) {
        console.log('%c[Perpustakaan 059c] Nakula dan Nabula berjalan menuju meja Bu Wati lewat lorong bebas hambatan...', 'color: #3b82f6; font-weight: bold;');
        this.registry.set('level1_player_locked', true);
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (this.player && this.player.sprite) {
          this.player.isLocked = true;
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

          const p = this.player.sprite;
          // Segmen 1: Bergerak ke kanan menuju lorong vertikal kolom 6.5 (5 tiles @ 160ms = 800ms)
          p.setFlipX(false);
          p.anims.play('player_walk_right', true);
          this.tweens.add({
            targets: p,
            x: 6.5 * TILE + TILE / 2,
            duration: 800,
            ease: 'Linear',
            onComplete: () => {
              // Segmen 2: Bergerak ke atas melalui lorong terbuka kolom 6.5 ke baris 3.5 (6 tiles @ 160ms = 960ms)
              p.anims.play('player_walk_up', true);
              this.tweens.add({
                targets: p,
                y: 3.5 * TILE + TILE / 2,
                duration: 960,
                ease: 'Linear',
                onComplete: () => {
                  // Segmen 3: Bergerak ke kanan di depan meja Bu Wati ke kolom 8.5 (2 tiles @ 160ms = 320ms)
                  p.anims.play('player_walk_right', true);
                  this.tweens.add({
                    targets: p,
                    x: 8.5 * TILE + TILE / 2,
                    duration: 320,
                    ease: 'Linear',
                    onComplete: () => {
                      p.anims.play('player_idle_up', true);
                      this.player.facing = 'up';
                    }
                  });
                }
              });
            }
          });
        }

        if (nabula && nabula.sprite) {
          const ns = nabula.sprite;
          // Segmen 1: Bergerak ke kanan menuju lorong vertikal kolom 7.5 (5 tiles @ 160ms = 800ms)
          ns.setFlipX(false);
          ns.anims.play('nabula_walk_right', true);
          this.tweens.add({
            targets: ns,
            x: 7.5 * TILE + TILE / 2,
            duration: 800,
            ease: 'Linear',
            onComplete: () => {
              // Segmen 2: Bergerak ke atas melalui lorong terbuka kolom 7.5 ke baris 3.5 (6 tiles @ 160ms = 960ms)
              ns.anims.play('nabula_walk_up', true);
              this.tweens.add({
                targets: ns,
                y: 3.5 * TILE + TILE / 2,
                duration: 960,
                ease: 'Linear',
                onComplete: () => {
                  // Segmen 3: Bergerak ke kanan di depan meja Bu Wati ke kolom 9.5 (2 tiles @ 160ms = 320ms)
                  ns.anims.play('nabula_walk_right', true);
                  this.tweens.add({
                    targets: ns,
                    x: 9.5 * TILE + TILE / 2,
                    duration: 320,
                    ease: 'Linear',
                    onComplete: () => {
                      ns.anims.play('nabula_idle_up', true);
                      this.registry.set('level1_branch_c_reached_wati', true);
                      console.log('%c[Perpustakaan 059c] Sampai di meja Bu Wati! Membuka dialog 059c-25...', 'color: #22c55e; font-weight: bold;');
                      const ui = this.scene.get('UI');
                      if (ui && ui.startDialogue) {
                        ui.startDialogue('lvl1_059c_25_bu_wati');
                      }
                    }
                  });
                }
              });
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_059c_walk_to_wati'] = _handler_50;

/* ── Action: lvl1_059c_complete ── */
const _handler_51 = function(scene, action) {
        console.log('%c[Perpustakaan 059c] Jalur C selesai! Transisi ke Node 060...', 'color: #10b981; font-weight: bold;');
        this.registry.set('level1_branch_c_done', true);
        const nabula = this.npcs.find(n => n.key === 'nabula');
        if (nabula && nabula.showEmotion) {
          nabula.showEmotion('😊');
        }
};
window.LEVEL_1_ACTIONS['lvl1_059c_complete'] = _handler_51;

/* ── Action: lvl1_060b_focus_wulan ── */
const _handler_52 = function(scene, action) {
        console.log('%c[Node 060b] Menyorot Wulan yang memandang cemas dari kejauhan...', 'color: #38bdf8; font-weight: bold;');
        let wulan = this.npcs.find(n => n.key === 'wulan');
        const currentMap = this.registry.get('currentMap');

        if (currentMap === 'cafeteria') {
          if (!wulan) {
            wulan = new NPC(this, 20 * TILE + TILE / 2, 10 * TILE + TILE / 2,
              'wulan', null, { name: 'Wulan', emotion: '😟' });
            wulan.sprite.anims.play('wulan_idle_left', true);
            this.npcs.push(wulan);
          }
          this.panCameraTo(20 * TILE + TILE / 2, 10 * TILE + TILE / 2, 700, 'Sine.easeInOut', () => {
            if (wulan && wulan.showEmotion) wulan.showEmotion('😟');
            this.time.delayedCall(1200, () => {
              if (wulan && wulan.sprite) {
                wulan.sprite.setFlipX(false);
                wulan.sprite.anims.play('wulan_walk_right', true);
                this.tweens.add({
                  targets: wulan.sprite,
                  x: 24 * TILE + TILE / 2,
                  duration: 1500,
                  ease: 'Linear',
                  onComplete: () => {
                    this.tweens.add({
                      targets: wulan.sprite,
                      alpha: 0,
                      duration: 400,
                      onComplete: () => wulan.sprite.setVisible(false)
                    });
                  }
                });
              }
              this.time.delayedCall(800, () => {
                if (this.player && this.player.sprite) {
                  this.panCameraTo(this.player.sprite.x, this.player.sprite.y, 700);
                }
              });
            });
          });
        } else if (currentMap === 'library') {
          if (wulan) {
            this.panCameraTo(wulan.sprite.x, wulan.sprite.y, 700, 'Sine.easeInOut', () => {
              if (wulan.showEmotion) wulan.showEmotion('😟');
              this.time.delayedCall(1200, () => {
                wulan.sprite.setFlipX(false);
                wulan.sprite.anims.play('wulan_walk_down', true);
                this.tweens.add({
                  targets: wulan.sprite,
                  y: 9 * TILE + TILE / 2,
                  duration: 1500,
                  ease: 'Linear',
                  onComplete: () => {
                    this.tweens.add({
                      targets: wulan.sprite,
                      alpha: 0,
                      duration: 400,
                      onComplete: () => wulan.sprite.setVisible(false)
                    });
                  }
                });
                this.time.delayedCall(800, () => {
                  if (this.player && this.player.sprite) {
                    this.panCameraTo(this.player.sprite.x, this.player.sprite.y, 700);
                  }
                });
              });
            });
          }
        }
};
window.LEVEL_1_ACTIONS['lvl1_060b_focus_wulan'] = _handler_52;

/* ── Action: lvl1_060c_finish_stage3 ── */
const _handler_53 = function(scene, action) {
        console.log('%c[Tahap 3 Selesai] Membuka Tahap 4: Refleksi ECA (Node 061)...', 'color: #10b981; font-weight: bold;');
        this.registry.set('level1_stage3_complete', true);
        const route = this.registry.get('level1_route_chosen') || 'A';
        const isEmergency = this.registry.get('level1_058x_emergency_taken');
        let nextNode = 'lvl1_061a_eca';
        if (route === 'B') {
          nextNode = isEmergency ? 'lvl1_061b_x_eca' : 'lvl1_061b_eca';
        } else if (route === 'C') {
          nextNode = isEmergency ? 'lvl1_061c_x_eca' : 'lvl1_061c_eca';
        }
        const ui = this.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue(nextNode);
        }
};
window.LEVEL_1_ACTIONS['lvl1_060c_finish_stage3'] = _handler_53;

/* ── Action: lvl1_063_transition_to_064 ── */
const _handler_54 = function(scene, action) {
        const curHarmony = this.registry.get('harmony') !== undefined ? this.registry.get('harmony') : 50;
        const route = this.registry.get('level1_route_chosen') || 'A';
        const ui = this.scene.get('UI');
        if (curHarmony >= 60) {
          let node = 'lvl1_064a_eca';
          if (route === 'B') node = 'lvl1_064b_eca';
          else if (route === 'C') node = 'lvl1_064c_eca';
          if (ui && ui.startDialogue) ui.startDialogue(node);
        } else {
          if (ui && ui.startDialogue) ui.startDialogue('lvl1_064x_eca');
        }
};
window.LEVEL_1_ACTIONS['lvl1_063_transition_to_064'] = _handler_54;

/* ── Action: lvl1_064_show_completion_modal ── */
const _handler_55 = function(scene, action) {
        const score = this.registry.get('harmony') !== undefined ? this.registry.get('harmony') : 50;
        const route = this.registry.get('level1_route_chosen') || 'A';
        const isSuccess = score >= 60;

        let status = 'Harmonia Padam';
        let orb = '⚫';
        let message = 'Nabula nggak sempat dapat bantuan kali ini. Tapi ini bukan akhir, yuk coba lagi dan perhatikan tanda-tanda saat teman butuh kamu.';

        if (score >= 80) {
          status = 'Harmonia Bersinar';
          orb = '🟢';
          message = 'Kamu menunjukkan empati dan keberanian yang luar biasa untuk melindungi Nabula!';
        } else if (score >= 60) {
          status = 'Harmonia Terjaga';
          orb = '🟡';
          message = 'Kamu berhasil membantu Nabula mendapatkan dukungan. Terus tingkatkan kepekaanmu!';
        } else if (score > 0) {
          status = 'Harmonia Redup';
          orb = '🟠';
          message = 'Kamu sudah berusaha menolong Nabula, tapi masih ada hal yang bisa diperbaiki untuk menjaga kerukunan.';
        }

        window.dispatchEvent(new CustomEvent('show_level_complete_modal', {
          detail: {
            score: score,
            status: status,
            orb: orb,
            message: message,
            isSuccess: isSuccess,
            route: route
          }
        }));
};
window.LEVEL_1_ACTIONS['lvl1_064_show_completion_modal'] = _handler_55;

/* ── Action: lvl1_058x_bullies_leave ── */
const _handler_56 = function(scene, action) {
        console.log('%c[Kantin 058x] Bagas & Rio bubar meninggalkan kantin lewat lorong aman...', 'color: #f59e0b; font-weight: bold;');
        this._bulliesLeaveCafeteria();
};
window.LEVEL_1_ACTIONS['lvl1_058x_bullies_leave'] = _handler_56;

/* ── Action: lvl1_058x_nabula_leaves ── */
const _handler_57 = function(scene, action) {
        const nabula = this.npcs.find(n => n.key === 'nabula');
        this.registry.set('level1_058x_nabula_left', true);
        this.registry.set('level1_nabula_at_garden_emergency', true);
        console.log('%c[Kantin 058x] Nabula buru-buru meninggalkan kantin (kamera mengikuti)...', 'color: #f59e0b; font-weight: bold;');
        if (nabula && nabula.sprite) {
          if (nabula.clearEmotion) nabula.clearEmotion();
          const ns = nabula.sprite;

          // 1. Kamera langsung mengikuti pergerakan Nabula berlari keluar kantin
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(ns, true, 0.08, 0.08);

          // 2. Nabula bergerak keluar lewat lorong aman baris 9
          ns.anims.play('nabula_walk_down', true);
          this.tweens.add({
            targets: ns,
            y: 9 * TILE + TILE / 2,
            duration: 600,
            ease: 'Linear',
            onComplete: () => {
              ns.setFlipX(false);
              ns.anims.play('nabula_walk_right', true);
              this.tweens.add({
                targets: ns,
                x: 29 * TILE + TILE / 2,
                duration: 2000,
                ease: 'Linear',
                onComplete: () => {
                  ns.anims.play('nabula_walk_down', true);
                  this.tweens.add({
                    targets: ns,
                    y: 13 * TILE + TILE / 2,
                    duration: 600,
                    ease: 'Linear',
                    onComplete: () => {
                      this.tweens.add({
                        targets: ns,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                          ns.setVisible(false);
                          console.log('%c[Kantin 058x] Nabula telah keluar dari kantin. Mengarahkan kamera kembali ke Nakula...', 'color: #22c55e; font-weight: bold;');

                          // 3. Kamera bergerak halus kembali menyorot Nakula
                          if (this.player && this.player.sprite) {
                            this.cameras.main.stopFollow();
                            this.tweens.killTweensOf(this.cameras.main);
                            this.panCameraTo(this.player.sprite.x, this.player.sprite.y, 800, 'Sine.easeInOut', () => {
                              console.log('%c[Kantin 058x] Kamera selesai menyorot Nakula. Membuka dialog lvl1_058x_7_eca...', 'color: #10b981; font-weight: bold;');
                              const ui = this.scene.get('UI');
                              if (ui && ui.startDialogue) {
                                ui.startDialogue('lvl1_058x_7_eca');
                              }
                            });
                          } else {
                            const ui = this.scene.get('UI');
                            if (ui && ui.startDialogue) {
                              ui.startDialogue('lvl1_058x_7_eca');
                            }
                          }
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        } else {
          const ui = this.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui.startDialogue('lvl1_058x_7_eca');
          }
        }
};
window.LEVEL_1_ACTIONS['lvl1_058x_nabula_leaves'] = _handler_57;

/* ── Action: lvl1_058x_start_emergency_quest ── */
const _handler_58 = function(scene, action) {
        console.log('%c[Kantin 058x] Memulai Quest Darurat (30s): Susul Nabula ke taman!', 'color: #ef4444; font-weight: bold;');
        this.registry.set('level1_player_locked', false);
        if (this.player) {
          this.player.isLocked = false;
          this.cameras.main.stopFollow();
          this.tweens.killTweensOf(this.cameras.main);
          this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
        }
        this.registry.set('level1_quest_active', 'emergency_susul_nabula_taman');
        const ui = this.scene.get('UI');
        if (ui && ui.showQuest) {
          ui.showQuest('QUEST (DARURAT): Susul Nabula ke taman!', {
            hasTimer: true,
            durationSec: 30,
            onTimeout: () => {
              this.handleCafeteriaEmergencyTimeout();
            }
          });
        }
};
window.LEVEL_1_ACTIONS['lvl1_058x_start_emergency_quest'] = _handler_58;

/* ── Action: lvl1_058x_emergency_success ── */
const _handler_59 = function(scene, action) {
        this.registry.set('level1_quest_active', null);
        const ui = this.scene.get('UI');
        if (ui && ui.completeQuest) {
          ui.completeQuest('Berhasil menemukan bantuan!');
        }
};
window.LEVEL_1_ACTIONS['lvl1_058x_emergency_success'] = _handler_59;

/* ── Action: lvl1_058x_fade_out ── */
const _handler_60 = function(scene, action) {
        this.cameras.main.fadeOut(800, 0, 0, 0);
};
window.LEVEL_1_ACTIONS['lvl1_058x_fade_out'] = _handler_60;

/* ── Action: lvl1_058x_show_fail_modal ── */
const _handler_61 = function(scene, action) {
        this.registry.set('harmony', 0);
        window.dispatchEvent(new CustomEvent('show_level_fail_modal', {
          detail: {
            score: 0,
            status: 'Harmonia Padam',
            message: 'Nakula tidak sempat bertindak tepat waktu saat Nabula membutuhkan bantuan di kantin.'
          }
        }));

};
window.LEVEL_1_ACTIONS['lvl1_058x_show_fail_modal'] = _handler_61;

