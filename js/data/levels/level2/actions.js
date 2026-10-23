/* ───────────── data / levels / level2 / actions.js ─────────────
   CARE-TECH: Harmonia School — Level 2 Cutscenes & Action Handlers
   Source: script/skrip_level2.md (Nodes 001 - 033)
   ─────────────────────────────────────────────────────────────── */

window.LEVEL_2_ACTIONS = {

  /* ── 001: Intro Kelas ── */
  'lvl2_001_intro': function(scene) {
    scene.registry.set('level2_player_locked', true);
    if (scene.player) {
      scene.player.isLocked = true;
      scene.player.isCutsceneActive = true;
      scene.player.facing = 'up';
      if (scene.player.sprite && scene.player.sprite.anims) {
        scene.player.sprite.anims.play('player_idle_up', true);
      }
    }
  },

  /* ── 002: Bagas & Rio Masuk Kelas Menuju Meja ── */
  'lvl2_002_bullies_enter': function(scene) {
    console.log('%c[Level 2 Cutscene] Bagas & Rio masuk kelas menuju bangku...', 'color: #38bdf8;');
    scene.registry.set('level2_player_locked', true);
    if (scene.player) {
      scene.player.isLocked = true;
      scene.player.isCutsceneActive = true;
    }

    // 1. Spawning Bagas & Rio di ambang pintu kelas (col 10 & 11, row 14)
    const doorY = 14 * TILE + TILE / 2;
    const bagasStartX = 10 * TILE + TILE / 2;
    const rioStartX = 11 * TILE + TILE / 2;

    // Bersihkan instance lama jika ada
    scene.npcs = scene.npcs.filter(n => {
      if (n.key === 'bagas' || n.key === 'rio') {
        if (n.sprite) n.sprite.destroy();
        return false;
      }
      return true;
    });

    const bagas = new NPC(scene, bagasStartX, doorY, 'bagas', null, { name: 'Bagas' });
    bagas.sprite.anims.play('bagas_walk_up', true);
    scene.npcs.push(bagas);

    const rio = new NPC(scene, rioStartX, doorY, 'rio', null, { name: 'Rio' });
    rio.sprite.anims.play('rio_walk_up', true);
    scene.npcs.push(rio);

    // 2. Kamera mengikuti langkah Bagas & Rio
    scene.cameras.main.stopFollow();
    const midX = (bagasStartX + rioStartX) / 2;
    scene.cameras.main.pan(midX, doorY - 100, 600, 'Linear');

    // Target meja: Bagas di (13, 7), Rio di (13, 9)
    const bagasTargetY = 7 * TILE + TILE / 2;
    const bagasTargetX = 13 * TILE + TILE / 2;
    const rioTargetY = 9 * TILE + TILE / 2;
    const rioTargetX = 13 * TILE + TILE / 2;

    // Animasi jalan Bagas ke atas lalu ke kanan
    scene.tweens.add({
      targets: bagas.sprite,
      y: bagasTargetY,
      duration: 1800,
      onComplete: () => {
        bagas.sprite.anims.play('bagas_walk_right', true);
        scene.tweens.add({
          targets: bagas.sprite,
          x: bagasTargetX,
          duration: 800,
          onComplete: () => {
            bagas.sprite.anims.play('bagas_idle_up', true);
            bagas.facing = 'up';
          }
        });
      }
    });

    // Animasi jalan Rio ke atas lalu ke kanan
    scene.tweens.add({
      targets: rio.sprite,
      y: rioTargetY,
      duration: 1500,
      onComplete: () => {
        rio.sprite.anims.play('rio_walk_right', true);
        scene.tweens.add({
          targets: rio.sprite,
          x: rioTargetX,
          duration: 700,
          onComplete: () => {
            rio.sprite.anims.play('rio_idle_up', true);
            rio.facing = 'up';
          }
        });
      }
    });

    // Kamera mengikuti ke atas, lalu kembali ke Nakula
    scene.time.delayedCall(1600, () => {
      scene.cameras.main.pan(12 * TILE, 8 * TILE, 1000, 'Sine.easeInOut');
    });

    scene.time.delayedCall(3000, () => {
      const nakulaX = 7 * TILE + TILE / 2;
      const nakulaY = 9 * TILE + TILE / 2;
      scene.cameras.main.pan(nakulaX, nakulaY, 800, 'Sine.easeInOut', false, (cam, progress) => {
        if (progress >= 1) {
          scene.cameras.main.startFollow(scene.player.sprite, true, 0.1, 0.1);
          scene.registry.set('level2_002_done', true);
          const ui = scene.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui.startDialogue('lvl2_003_narrator');
          }
        }
      });
    });
  },

  /* ── 008a: Nakula Melangkah Tenang Menghampiri Meja Bagas & Rio ── */
  'lvl2_008a_walk_forward': function(scene) {
    const targetX = 12 * TILE + TILE / 2;
    const targetY = 7 * TILE + TILE / 2;
    scene.player.isLocked = true;
    scene.player.isCutsceneActive = true;
    if (scene.player.sprite && scene.player.sprite.anims) {
      scene.player.sprite.anims.play('player_walk_right', true);
    }
    scene.tweens.add({
      targets: scene.player.sprite,
      x: targetX,
      y: targetY,
      duration: 1400,
      onComplete: () => {
        scene.player.facing = 'right';
        if (scene.player.sprite && scene.player.sprite.anims) {
          scene.player.sprite.anims.play('player_idle_right', true);
        }
        const ui = scene.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl2_008a_2_bagas');
        }
      }
    });
  },

  /* ── 008a: Nakula Kembali Duduk di Bangkunya ── */
  'lvl2_008a_return_to_desk': function(scene) {
    const targetX = 7 * TILE + TILE / 2;
    const targetY = 9 * TILE + TILE / 2;
    if (scene.player.sprite && scene.player.sprite.anims) {
      scene.player.sprite.anims.play('player_walk_left', true);
    }
    scene.tweens.add({
      targets: scene.player.sprite,
      x: targetX,
      y: targetY,
      duration: 1400,
      onComplete: () => {
        scene.player.facing = 'up';
        if (scene.player.sprite && scene.player.sprite.anims) {
          scene.player.sprite.anims.play('player_idle_up', true);
        }
        const ui = scene.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl2_008a_7_narrator');
        }
      }
    });
  },

  /* ── 008w: Nakula Mendekati Meja dengan Emosi & Cepat ── */
  'lvl2_008w_approach_bullies': function(scene) {
    const targetX = 12 * TILE + TILE / 2;
    const targetY = 7 * TILE + TILE / 2;
    scene.player.isLocked = true;
    scene.player.isCutsceneActive = true;
    if (scene.player.sprite && scene.player.sprite.anims) {
      scene.player.sprite.anims.play('player_walk_right', true);
    }
    scene.tweens.add({
      targets: scene.player.sprite,
      x: targetX,
      y: targetY,
      duration: 900,
      onComplete: () => {
        scene.player.facing = 'right';
        if (scene.player.sprite && scene.player.sprite.anims) {
          scene.player.sprite.anims.play('player_idle_right', true);
        }
        const ui = scene.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl2_008w_2_nakula');
        }
      }
    });
  },

  /* ── 008w: Nakula Kembali ke Bangku Setelah Konflik ── */
  'lvl2_008w_return_to_desk': function(scene) {
    const targetX = 7 * TILE + TILE / 2;
    const targetY = 9 * TILE + TILE / 2;
    if (scene.player.sprite && scene.player.sprite.anims) {
      scene.player.sprite.anims.play('player_walk_left', true);
    }
    scene.tweens.add({
      targets: scene.player.sprite,
      x: targetX,
      y: targetY,
      duration: 1200,
      onComplete: () => {
        scene.player.facing = 'up';
        if (scene.player.sprite && scene.player.sprite.anims) {
          scene.player.sprite.anims.play('player_idle_up', true);
        }
        const nextNode = scene.registry.get('level2_branch_choice') === '008w2'
          ? 'lvl2_008w_9_narrator'
          : 'lvl2_008w_5_narrator';
        const ui = scene.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue(nextNode);
        }
      }
    });
  },

  /* ── 015: Bel Istirahat Berbunyi ── */
  'lvl2_school_bell': function(scene) {
    if (window.audioManager) {
      window.audioManager.playSchoolBell(0.7);
    }
  },

  /* ── 016: Mulai Quest Menuju Kantin ── */
  'lvl2_start_cafeteria_quest': function(scene) {
    scene.registry.set('level2_player_locked', false);
    if (scene.player) {
      scene.player.isLocked = false;
      scene.player.isCutsceneActive = false;
    }
    const ui = scene.scene.get('UI');
    if (ui && ui.showQuest) {
      ui.showQuest('QUEST: Pergi ke Kantin untuk Makan Siang');
    }
  },

  /* ── 018: Kamera Menyorot Antrean Bagas & Rio di Kantin ── */
  'lvl2_018_focus_queue': function(scene) {
    console.log('%c[Level 2 Kantin] Fokus antrean Bagas & Rio...', 'color: #38bdf8;');
    if (scene.player) {
      scene.player.isLocked = true;
      scene.player.isCutsceneActive = true;
    }
    if (window.audioManager) {
      window.audioManager.playLoop('crowd', 0.4);
    }

    const queueCamX = 18 * TILE + TILE / 2;
    const queueCamY = 4 * TILE + TILE / 2;
    const entranceX = 29 * TILE + TILE / 2;
    const entranceY = 13 * TILE + TILE / 2;

    scene.cameras.main.stopFollow();
    scene.cameras.main.pan(queueCamX, queueCamY, 1200, 'Sine.easeInOut');

    scene.time.delayedCall(2400, () => {
      scene.cameras.main.pan(entranceX, entranceY, 1000, 'Sine.easeInOut', false, (cam, progress) => {
        if (progress >= 1) {
          scene.cameras.main.startFollow(scene.player.sprite, true, 0.1, 0.1);
          const ui = scene.scene.get('UI');
          if (ui && ui.startDialogue) {
            ui.startDialogue('lvl2_019_narrator');
          }
        }
      });
    });
  },

  /* ── 019: Nakula Melangkah Masuk Antrean di Belakang Rio ── */
  'lvl2_019_nakula_joins_queue': function(scene) {
    const targetX = 20 * TILE + TILE / 2;
    const targetY = 4 * TILE + TILE / 2;
    if (scene.player) {
      scene.player.isLocked = true;
      scene.player.isCutsceneActive = true;
      if (scene.player.sprite && scene.player.sprite.anims) {
        scene.player.sprite.anims.play('player_walk_left', true);
      }
    }
    scene.tweens.add({
      targets: scene.player.sprite,
      x: targetX,
      y: targetY,
      duration: 2200,
      onComplete: () => {
        scene.player.facing = 'left';
        if (scene.player.sprite) {
          scene.player.sprite.setFlipX(true);
          if (scene.player.sprite.anims) {
            scene.player.sprite.anims.play('player_idle_left', true);
          }
        }
        scene.registry.set('level2_queue_joined', true);
        const ui = scene.scene.get('UI');
        if (ui && ui.startDialogue) {
          ui.startDialogue('lvl2_020_timed_choice');
        }
      }
    });
  },

  /* ── 022: Bagas & Rio Membalikkan Badan Menghadap Nakula ── */
  'lvl2_022_bullies_turn_around': function(scene) {
    scene.npcs.forEach(n => {
      if (n.key === 'bagas' || n.key === 'rio') {
        n.sprite.setFlipX(false);
        n.facing = 'right';
        if (n.sprite.anims) {
          n.sprite.anims.play(`${n.key}_idle_right`, true);
        }
      }
    });
    const ui = scene.scene.get('UI');
    if (ui && ui.startDialogue) {
      ui.startDialogue('lvl2_023_bagas');
    }
  },

  /* ── 028d: Router Refleksi Dinamis Eca Sesuai Pilihan Pemain ── */
  'lvl2_branch_reflection_router': function(scene) {
    const choice = scene.registry.get('level2_branch_choice');
    let targetNode = 'lvl2_029x_eca';
    if (choice === '008a') targetNode = 'lvl2_029a_eca';
    else if (choice === '008b') targetNode = 'lvl2_029b_eca';
    else if (choice === '008c') targetNode = 'lvl2_029c_eca';
    else if (choice === '008w') targetNode = 'lvl2_029w_eca';
    else if (choice === '008w2') targetNode = 'lvl2_029w2_eca';

    const ui = scene.scene.get('UI');
    if (ui && ui.startDialogue) {
      ui.startDialogue(targetNode);
    }
  },

  /* ── 020w: Ending Alternatif Kantin (Timeout / Diam Saja) ── */
  'lvl2_020w_bad_ending': function(scene) {
    if (window.audioManager) {
      window.audioManager.stopLoop('crowd', 0.5);
      window.audioManager.stopLoop('clockTicking', 0.2);
    }
    window.dispatchEvent(new CustomEvent('show_level2_fail_modal', {
      detail: {
        score: 15,
        status: 'Harmonia Padam',
        message: 'Nakula memilih diam saat melihat ketidakadilan di antrean kantin. Sikap tegas dan sopan diperlukan untuk menjaga ketertiban bersama.'
      }
    }));
  },

  /* ── 033: Ending Sukses Level 2 & Evaluasi Skor ── */
  'lvl2_complete_good_ending': function(scene) {
    if (window.audioManager) {
      window.audioManager.stopLoop('crowd', 0.5);
    }
    const finalScore = scene.registry.get('harmony') || 80;
    const isSuccess = finalScore >= 75;
    scene.registry.set('level2_complete', true);
    window.dispatchEvent(new CustomEvent('show_level2_complete_modal', {
      detail: {
        score: finalScore,
        isSuccess: isSuccess,
        status: isSuccess ? 'Harmonia Bersinar' : 'Harmonia Meredup',
        message: isSuccess
          ? 'Selamat! Kamu berhasil mengelola emosi dengan kepala dingin dan bersikap asertif demi kebaikan lingkungan sekolah!'
          : 'Kamu menyelesaikan Level 2, tetapi emosi dan ketegasanmu masih perlu dilatih untuk mencapai skor kelulusan (≥ 75).'
      }
    }));
  }
};
