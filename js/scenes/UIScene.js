/* ───────────── scenes / UIScene.js ─────────────
   Overlay scene — renders the Harmony bar, in-game
   clock, map name, dialogue box with choice buttons,
   and interaction prompts.
   Runs in parallel with WorldScene.
   ─────────────────────────────────────────────── */

class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  create() {
    const rawWidth = this.scale.width;
    const rawHeight = this.scale.height;
    
    // Determine a responsive zoom scale for the UI (e.g., 2x for most screens, 3x for 1080p+)
    this.uiZoom = Math.max(1.5, rawHeight / 480);
    this.cameras.main.setZoom(this.uiZoom);
    
    const width = rawWidth / this.uiZoom;
    const height = rawHeight / this.uiZoom;
    
    // Shift camera so (0,0) is at the top-left of the screen
    this.cameras.main.scrollX = -(rawWidth - width) / 2;
    this.cameras.main.scrollY = -(rawHeight - height) / 2;
    
    this._effWidth = width;
    this._effHeight = height;

    /* ══════════ Harmony Bar (top-left Cardboard Badge) ══════════ */
    // Shadow panel
    this.harmonyPanelShadow = this.add.rectangle(15, 11, 204, 34, 0x000000)
      .setOrigin(0, 0).setScrollFactor(1).setDepth(99);
    // Background panel (warm paper)
    this.harmonyPanel = this.add.rectangle(12, 8, 204, 34, 0xfffdf5)
      .setOrigin(0, 0).setStrokeStyle(3, 0x000000).setScrollFactor(1).setDepth(100);
    // Label
    this.harmonyLabelTxt = this.add.text(18, 12, '♥ INDEKS HARMONI', {
      fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif',
      fontSize: '9.5px',
      fontStyle: 'bold',
      color: '#ff2e93',
      letterSpacing: 1
    }).setScrollFactor(1).setDepth(101);
    // Bar track
    this.harmonyTrack = this.add.rectangle(18, 29, 190, 8, 0xffffff)
      .setOrigin(0, 0.5).setStrokeStyle(1.5, 0x000000).setScrollFactor(1).setDepth(101);
    // Bar fill
    this.harmonyBar = this.add.rectangle(18, 29, 0, 8, 0x39ff14)
      .setOrigin(0, 0.5).setScrollFactor(1).setDepth(102);
    // Value text
    this.harmonyTxt = this.add.text(113, 29, '', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '10px',
      fontStyle: 'bold',
      color: '#000000'
    }).setOrigin(0.5).setScrollFactor(1).setDepth(103);

    /* ══════════ Harmony Change Flash ══════════ */
    this.harmonyFlash = this.add.text(224, 22, '', {
      fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#39ff14',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0, 0.5).setScrollFactor(1).setDepth(103).setAlpha(0);

    /* ══════════ Clock (top-right Yellow Paper Pill) ══════════ */
    this.clockPanelShadow = this.add.rectangle(width - 9, 11, 88, 26, 0x000000)
      .setOrigin(1, 0).setScrollFactor(1).setDepth(99);
    this.clockPanel = this.add.rectangle(width - 12, 8, 88, 26, 0xfffde6)
      .setOrigin(1, 0).setStrokeStyle(2.5, 0x000000).setScrollFactor(1).setDepth(100);
    this.clockTxt = this.add.text(width - 56, 21, '', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#000000'
    }).setOrigin(0.5).setScrollFactor(1).setDepth(101);

    /* ══════════ Quest Banner (top-center Yellow Notepad) ══════════ */
    this.questContainer = this.add.container(width / 2, -60).setScrollFactor(1).setDepth(300);
    const questShadow = this.add.graphics();
    questShadow.fillStyle(0x000000, 1).fillRoundedRect(-147, -15, 298, 36, 8);
    const questBg = this.add.graphics();
    questBg.fillStyle(0xfffde6, 1).fillRoundedRect(-150, -18, 298, 36, 8);
    questBg.lineStyle(3, 0x000000, 1).strokeRoundedRect(-150, -18, 298, 36, 8);
    this.questText = this.add.text(0, 0, '★ MISI: Ikuti Nabula ke perpustakaan.', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Segoe UI", sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#000000'
    }).setOrigin(0.5);
    this.questContainer.add([questShadow, questBg, this.questText]);

    /* ══════════ QTE Timer ══════════ */
    this.qteTimerTxt = this.add.text(width / 2, height / 4, '', {
      fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ff2e93',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setScrollFactor(1).setDepth(200).setVisible(false);

    /* ══════════ Mobile/Clickable Menu Toggle (Washi Tape Button) ══════════ */
    const menuToggleShadow = this.add.graphics().setScrollFactor(1).setDepth(100);
    menuToggleShadow.fillStyle(0x000000, 1).fillRoundedRect(15, 49, 78, 26, 6);
    const menuToggleBg = this.add.graphics().setScrollFactor(1).setDepth(101);
    const drawMenuBtn = (bgColor) => {
      menuToggleBg.clear()
        .fillStyle(bgColor, 1).fillRoundedRect(12, 46, 78, 26, 6)
        .lineStyle(2.5, 0x000000, 1).strokeRoundedRect(12, 46, 78, 26, 6);
    };
    drawMenuBtn(0xffe500);
    
    this.menuToggleTxt = this.add.text(12 + 39, 46 + 13, '☰ MENU', {
      fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#000000'
    }).setOrigin(0.5).setScrollFactor(1).setDepth(102);

    this.menuToggleZone = this.add.zone(12 + 39, 46 + 13, 78, 26)
      .setOrigin(0.5).setScrollFactor(1).setDepth(103).setInteractive({ useHandCursor: true });
    
    this.menuToggleZone.on('pointerover', () => drawMenuBtn(0x39ff14));
    this.menuToggleZone.on('pointerout', () => drawMenuBtn(0xffe500));
    this.menuToggleZone.on('pointerdown', () => {
      drawMenuBtn(0xff8a00);
      this.time.delayedCall(100, () => {
        drawMenuBtn(0xffe500);
        this._toggleSidebar();
      });
    });

    /* ══════════ Sidebar Menu (Cardboard Binder) ══════════ */
    this.sidebarContainer = this.add.container(-300, 0).setScrollFactor(1).setDepth(400);
    
    const sidebarBg = this.add.graphics();
    sidebarBg.fillStyle(0xe5d9c5, 1).fillRect(0, 0, 280, height);
    sidebarBg.lineStyle(4, 0x000000, 1).lineBetween(280, 0, 280, height);
    // Header tape banner
    sidebarBg.fillStyle(0xff2e93, 1).fillRect(20, 18, 240, 52);
    sidebarBg.lineStyle(3, 0x000000, 1).strokeRect(20, 18, 240, 52);
    this.sidebarContainer.add(sidebarBg);
    
    this.sidebarContainer.add(
      this.add.text(140, 36, 'CARE-TECH', {
        fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif', fontSize: '24px', fontStyle: 'bold', color: '#ffffff', letterSpacing: 2
      }).setOrigin(0.5).setShadow(2, 2, '#000000', 0, false, true)
    );
    
    this.sidebarContainer.add(
      this.add.text(140, 56, 'Harmonia School RPG', {
        fontFamily: '"Courier New", Courier, monospace', fontSize: '11px', fontStyle: 'bold', color: '#ffffff', letterSpacing: 1
      }).setOrigin(0.5).setShadow(1, 1, '#000000', 0, false, true)
    );

    const divider = this.add.graphics().lineStyle(3, 0x000000, 1).lineBetween(30, 85, 250, 85);
    this.sidebarContainer.add(divider);

    this.sidebarLevelText = this.add.text(140, 110, '', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '11.5px', color: '#000000', align: 'center', wordWrap: { width: 240 }, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.sidebarContainer.add(this.sidebarLevelText);

    // Button Generator (Cardboard Cosmos 3D Tactile Buttons)
    const createBtn = (x, y, w, h, text, defaultHex, hoverHex, onClick, txtColor = '#000000') => {
      const btnGroup = this.add.container(x, y);
      const shadow = this.add.graphics().fillStyle(0x000000, 1).fillRoundedRect(3, 3, w, h, 8);
      const bg = this.add.graphics();
      const drawBg = (color) => {
        bg.clear()
          .fillStyle(color, 1).fillRoundedRect(0, 0, w, h, 8)
          .lineStyle(3, 0x000000, 1).strokeRoundedRect(0, 0, w, h, 8);
      };
      drawBg(defaultHex);
      
      const txt = this.add.text(w / 2, h / 2, text, {
        fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif', fontSize: '12px', fontStyle: 'bold', color: txtColor
      }).setOrigin(0.5);
      
      btnGroup.add([shadow, bg, txt]);
      const zone = this.add.zone(w / 2, h / 2, w, h).setInteractive({ useHandCursor: true });
      btnGroup.add(zone);
      
      zone.on('pointerover', () => { drawBg(hoverHex); btnGroup.y -= 1; });
      zone.on('pointerout', () => { drawBg(defaultHex); btnGroup.y += 1; });
      zone.on('pointerdown', () => {
        btnGroup.y += 2; btnGroup.x += 2;
        this.time.delayedCall(100, () => { btnGroup.y -= 2; btnGroup.x -= 2; onClick(); });
      });
      this.sidebarContainer.add(btnGroup);
      return { txt, zone, btnGroup };
    };

    this.switchLevelBtnObj = createBtn(40, 145, 200, 36, 'Ganti Level', 0x39ff14, 0x2fe00e, () => {
      this.levelListContainer.setVisible(!this.levelListContainer.visible);
    }, '#000000');

    this.switchLangBtnObj = createBtn(40, 192, 200, 36, 'Ganti Bahasa (ID)', 0xffe500, 0xf5cc00, () => {
      const curLang = this.registry.get('lang') || 'id';
      this.registry.set('lang', curLang === 'en' ? 'id' : 'en');
    }, '#000000');
    
    this.closeSidebarBtnObj = createBtn(40, height - 90, 200, 36, 'Lanjut Main', 0x00e5ff, 0x00c4dc, () => {
      this._toggleSidebar();
    }, '#000000');
    
    this.exitGameBtnObj = createBtn(40, height - 45, 200, 36, 'Keluar Game', 0xff2e93, 0xe01b7a, () => {
      window.location.href = 'game.html';
    }, '#ffffff');

    this.levelListContainer = this.add.container(0, 238).setVisible(false);
    this.sidebarContainer.add(this.levelListContainer);

    const levelInfos = [
      { key: 'schoolyard', name: {en: 'Hub: Schoolyard', id: 'Pusat: Halaman Sekolah'} },
      { key: 'library', name: {en: 'School Library', id: 'Perpustakaan Sekolah'} },
      { key: 'garden', name: {en: 'Level 1: Detective Emotion', id: 'Level 1: Detektif Emosi'} },
      { key: 'corridor', name: {en: 'Level 2: Empathy Rescue', id: 'Level 2: Penyelamatan Empati'} },
      { key: 'classroom', name: {en: 'Level 3: Mystery Case', id: 'Level 3: Kasus Misteri'} },
      { key: 'auditorium', name: {en: 'Level 4: Harmony Builder', id: 'Level 4: Pembangun Harmoni'} },
      { key: 'cafeteria', name: {en: 'Level 5: Time Challenge X', id: 'Level 5: Tantangan Waktu X'} }
    ];
    this.levelButtons = [];

    levelInfos.forEach((lvl, i) => {
      const bg = this.add.graphics();
      const drawBg = (color) => {
        bg.clear()
          .fillStyle(color, 1).fillRoundedRect(35, i * 32, 210, 26, 6)
          .lineStyle(2, 0x000000, 1).strokeRoundedRect(35, i * 32, 210, 26, 6);
      };
      drawBg(0xffffff);

      const btnTxt = this.add.text(140, i * 32 + 13, lvl.name['id'], {
        fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', fontSize: '10.5px', color: '#000000', fontStyle: 'bold'
      }).setOrigin(0.5);
      
      const zone = this.add.zone(140, i * 32 + 13, 210, 26).setInteractive({ useHandCursor: true });
      
      zone.on('pointerover', () => { drawBg(0xffe500); btnTxt.setColor('#000000'); });
      zone.on('pointerout', () => { drawBg(0xffffff); btnTxt.setColor('#000000'); });
      zone.on('pointerdown', () => {
        this._toggleSidebar();
        const world = this.scene.get('World');
        if (world && world._changeMap) {
           let spawnX = 10 * 64 + 32;
           let spawnY = 7 * 64 + 32;
           if (lvl.key === 'garden') { spawnX = 20 * 64 + 32; }
           else if (lvl.key === 'schoolyard') { spawnX = 21 * 64 + 32; spawnY = 13 * 64 + 32; }
           else if (lvl.key === 'library') { spawnX = 9 * 64 + 32; spawnY = 9 * 64 + 32; }
           else if (lvl.key === 'cafeteria') { spawnX = 15 * 64 + 32; spawnY = 9 * 64 + 32; }
           world._changeMap(lvl.key, spawnX, spawnY); 
        }
      });
      
      this.levelListContainer.add([bg, btnTxt, zone]);
      this.levelButtons.push({txt: btnTxt, name: lvl.name});
    });

    // ESC to toggle sidebar
    this.sidebarOpen = false;
    this.input.keyboard.on('keydown-ESC', () => {
      this._toggleSidebar();
    });

    /* ══════════ Interaction Prompt (Yellow Tape Badge) ══════════ */
    this.interactPrompt = this.add.text(width / 2, height - 130, '★ TEKAN E / SPASI UNTUK BICARA ★', {
      fontFamily: '"GROBOLD", "Comic Sans MS", system-ui, sans-serif',
      fontSize: '11px',
      color: '#000000',
      backgroundColor: '#ffe500',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(1).setDepth(150).setAlpha(0);

    /* ══════════ Dialogue Panel (Cardboard Comic Speech Box) ══════════ */
    this._boxH = 148;
    this._boxW = width - 16;
    this._boxX = 8;
    this._boxY = height - this._boxH - 4;

    // Hard drop shadow
    this.dialogShadow = this.add.rectangle(
      this._boxX + 5, this._boxY + 5, this._boxW, this._boxH, 0x000000
    )
      .setOrigin(0)
      .setScrollFactor(1)
      .setDepth(199)
      .setVisible(false);

    // Warm paper comic speech box
    this.dialogBg = this.add.rectangle(
      this._boxX, this._boxY, this._boxW, this._boxH, 0xfffdf5
    )
      .setOrigin(0)
      .setStrokeStyle(3.5, 0x000000)
      .setScrollFactor(1)
      .setDepth(200)
      .setVisible(false);

    // Portrait image
    this.portraitImage = this.add.image(this._boxX + 42, this._boxY - 32, 'player_neutral')
      .setScrollFactor(1)
      .setDepth(203)
      .setVisible(false);

    // Speaker Name Tag (Pink Washi Tape Style)
    this.speakerTagShadow = this.add.rectangle(
      this._boxX + 14, this._boxY - 14, 120, 22, 0x000000
    ).setOrigin(0, 0).setScrollFactor(1).setDepth(201).setVisible(false);

    this.speakerTagBg = this.add.rectangle(
      this._boxX + 12, this._boxY - 16, 120, 22, 0xff2e93
    ).setOrigin(0, 0).setStrokeStyle(2.5, 0x000000).setScrollFactor(1).setDepth(202).setVisible(false);

    // Speaker name
    this.speakerTxt = this.add.text(this._boxX + 18, this._boxY - 12, '', {
      fontFamily: '"GROBOLD", "Comic Sans MS", sans-serif',
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setScrollFactor(1).setDepth(203).setVisible(false);

    // Accent line in dialog
    this.dialogBorder = this.add.rectangle(
      this._boxX + 10, this._boxY + 16, this._boxW - 20, 2, 0x000000, 0.25
    ).setOrigin(0).setScrollFactor(1).setDepth(201).setVisible(false);

    // Dialog text (Comic ink style)
    this.dialogText = this.add.text(this._boxX + 12, this._boxY + 24, '', {
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Segoe UI", sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#000000',
      wordWrap: { width: this._boxW - 24 },
      lineSpacing: 4,
    }).setScrollFactor(1).setDepth(201).setVisible(false);

    // Continue indicator (Pink retro pointer)
    this.continueText = this.add.text(this._boxX + this._boxW - 16, this._boxY + this._boxH - 14, '▶', {
      fontFamily: '"GROBOLD", monospace',
      fontSize: '13px',
      color: '#ff2e93',
      fontStyle: 'bold'
    }).setOrigin(0.5).setScrollFactor(1).setDepth(202).setVisible(false);

    // Pulse the continue indicator
    this.tweens.add({
      targets: this.continueText,
      alpha: { from: 0.3, to: 1 },
      scale: { from: 0.9, to: 1.2 },
      yoyo: true, repeat: -1, duration: 500
    });

    // ── Clickable option buttons (pool of 4) ────────
    this.optionButtons = [];
    const optStartY = this._boxY + 64;
    const optSpacing = 18;

    for (let i = 0; i < 4; i++) {
      const btn = this.add.text(
        this._boxX + 14,
        optStartY + i * optSpacing,
        '',
        {
          fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif',
          fontSize: '10px',
          fontStyle: 'bold',
          color: '#000000',
          backgroundColor: '#ffffff',
          padding: { x: 8, y: 3 },
        }
      )
        .setScrollFactor(1)
        .setDepth(202)
        .setVisible(false)
        .setInteractive({ useHandCursor: true });

      // Hover effects
      btn.on('pointerover', () => {
        btn.setColor('#000000');
        btn.setBackgroundColor('#ffe500');
      });
      btn.on('pointerout', () => {
        btn.setColor('#000000');
        btn.setBackgroundColor('#ffffff');
      });

      this.optionButtons.push(btn);
    }

    /* ══════════ Event Listeners ══════════ */
    this.registry.events.on('changedata-lang', () => this._refreshLanguage());
    this.registry.events.on('changedata-harmony', (_, val, prevVal) => {
      this._refreshHarmony();
      this._flashHarmonyChange(val - prevVal);
    });
    this.registry.events.on('changedata-currentMap', () => this._refreshMapName());

    /* ══════════ Initial State ══════════ */
    this._refreshHarmony();
    this._refreshClock(this.registry.get('clock'));
    this._refreshMapName();

    /* ══════════ In-game Clock Tick ══════════ */
    this.time.addEvent({
      delay: 2000,    // 1 in-game minute = 2 real seconds
      loop: true,
      callback: () => {
        const t = this.registry.get('clock') + 1;
        this.registry.set('clock', t);
        this._refreshClock(t);
      }
    });

    /* ══════════ Window Resize Handler ══════════ */
    this.scale.on('resize', this._handleResize, this);
  }

  _handleResize(gameSize) {
    const rawWidth = gameSize.width;
    const rawHeight = gameSize.height;
    
    this.uiZoom = Math.max(1.5, rawHeight / 480);
    this.cameras.main.setZoom(this.uiZoom);
    
    const width = rawWidth / this.uiZoom;
    const height = rawHeight / this.uiZoom;
    
    this.cameras.main.scrollX = -(rawWidth - width) / 2;
    this.cameras.main.scrollY = -(rawHeight - height) / 2;

    this._effWidth = width;
    this._effHeight = height;

    // Clock
    this.clockPanelShadow.setPosition(width - 9, 11);
    this.clockPanel.setPosition(width - 12, 8);
    this.clockTxt.setPosition(width - 56, 21);

    // Sidebar
    const sidebarBg = this.sidebarContainer.getAt(0);
    sidebarBg.clear();
    sidebarBg.fillStyle(0xe5d9c5, 1).fillRect(0, 0, 280, height);
    sidebarBg.lineStyle(4, 0x000000, 1).lineBetween(280, 0, 280, height);
    sidebarBg.fillStyle(0xff2e93, 1).fillRect(20, 18, 240, 52);
    sidebarBg.lineStyle(3, 0x000000, 1).strokeRect(20, 18, 240, 52);

    this.closeSidebarBtnObj.btnGroup.setY(height - 90);
    this.exitGameBtnObj.btnGroup.setY(height - 45);

    // Interact Prompt
    this.interactPrompt.setPosition(width / 2, height - 130);

    // Dialogue Box
    this._boxW = width - 16;
    this._boxY = height - this._boxH - 4;

    this.dialogShadow.setSize(this._boxW, this._boxH).setPosition(this._boxX + 5, this._boxY + 5);
    this.dialogBg.setSize(this._boxW, this._boxH).setPosition(this._boxX, this._boxY);
    this.portraitImage.setPosition(this._boxX + 42, this._boxY - 32);
    this.speakerTagShadow.setPosition(this._boxX + 14, this._boxY - 14);
    this.speakerTagBg.setPosition(this._boxX + 12, this._boxY - 16);
    this.speakerTxt.setPosition(this._boxX + 18, this._boxY - 12);
    this.dialogBorder.setSize(this._boxW - 20, 2).setPosition(this._boxX + 10, this._boxY + 16);
    this.dialogText.setPosition(this._boxX + 12, this._boxY + 24);
    this.dialogText.setStyle({ wordWrap: { width: this._boxW - 24 } });
    this.continueText.setPosition(this._boxX + this._boxW - 16, this._boxY + this._boxH - 14);

    const optStartY = this._boxY + 64;
    const optSpacing = 18;
    this.optionButtons.forEach((btn, i) => {
      btn.setPosition(this._boxX + 14, optStartY + i * optSpacing);
    });
  }

  /* ══════════ Public API ══════════ */

  /** Start Level 1 transition: screen goes dark, then bright, then narrator dialog 001 appears */
  startLevel1IntroTransition() {
    this.cameras.main.fadeOut(800, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.time.delayedCall(400, () => {
        this.cameras.main.fadeIn(800, 0, 0, 0);
        this.cameras.main.once('camerafadeincomplete', () => {
          this.startDialogue('lvl1_001_narrator');
        });
      });
    });
  }

  /** Show top quest banner */
  showQuestBanner(text, duration = 4000) {
    if (this.questText) this.questText.setText(text);
    if (!this.questContainer) return;
    this.tweens.add({
      targets: this.questContainer,
      y: 45,
      duration: 500,
      ease: 'Back.easeOut'
    });
    if (duration > 0) {
      this.time.delayedCall(duration, () => {
        this.hideQuestBanner();
      });
    }
  }

  hideQuestBanner() {
    if (!this.questContainer) return;
    this.tweens.add({
      targets: this.questContainer,
      y: -60,
      duration: 400,
      ease: 'Power2'
    });
  }

  /** Start displaying a dialogue tree from the given node */
  startDialogue(nodeId) {
    this.registry.set('dialogueActive', true);
    this._showNode(nodeId);
  }

  /** Show/hide the 'Press E' interaction prompt */
  setInteractPrompt(visible) {
    if (this.registry.get('dialogueActive')) {
      this.interactPrompt.setAlpha(0);
      return;
    }
    const target = visible ? 0.9 : 0;
    if (Math.abs(this.interactPrompt.alpha - target) > 0.1) {
      this.tweens.add({
        targets: this.interactPrompt,
        alpha: target,
        duration: 150,
        ease: 'Power2'
      });
    }
  }

  /* ══════════ Dialogue Rendering ══════════ */

  _showNode(nodeId) {
    this._currentDialogueNode = nodeId;
    const node = DIALOGUES[nodeId];
    if (!node) {
      this._closeDialogue();
      return;
    }

    if (node.action) {
      this.registry.events.emit('dialogue_action', node.action);
    }

    // Show panel elements
    this.dialogShadow.setVisible(true);
    this.dialogBg.setVisible(true);
    this.dialogBorder.setVisible(true);
    const lang = this.registry.get('lang') || 'id';
    const speakerName = (typeof node.speaker === 'object' ? node.speaker[lang] : node.speaker) || '';
    const textStr = (typeof node.text === 'object' ? node.text[lang] : node.text) || '';
    
    this.speakerTxt.setVisible(true).setText(speakerName.toUpperCase());
    const tagW = Math.max(90, this.speakerTxt.width + 16);
    this.speakerTagShadow.setSize(tagW, 22).setVisible(true);
    this.speakerTagBg.setSize(tagW, 22).setVisible(true);

    this.dialogText.setVisible(true).setText(textStr);

    if (node.portrait) {
      this.portraitImage.setTexture(node.portrait).setVisible(true);
    } else {
      this.portraitImage.setVisible(false);
    }

    // ── Render option buttons INSIDE the box ────────
    const choices = node.choices || [];
    const optStartY = this._boxY + 64;
    const optSpacing = 18;

    for (let i = 0; i < this.optionButtons.length; i++) {
      const btn = this.optionButtons[i];
      btn.removeAllListeners('pointerdown');

      if (i < choices.length) {
        const ch = choices[i];
        btn
          .setText(`[${i + 1}] ${typeof ch.label === 'object' ? ch.label[lang] : ch.label}`)
          .setPosition(this._boxX + 14, optStartY + i * optSpacing)
          .setVisible(true)
          .setColor('#000000')
          .setBackgroundColor('#ffffff');

        btn.on('pointerdown', () => {
          this._selectOption(ch);
        });
      } else {
        btn.setVisible(false);
      }
    }

    // Keyboard 1-4 to select options
    this.input.keyboard.removeAllListeners('keydown');
    if (choices.length > 0) {
      this.continueText.setVisible(false);
      this.dialogBg.disableInteractive();
      this.input.keyboard.on('keydown', (event) => {
        const num = parseInt(event.key, 10);
        if (num >= 1 && num <= choices.length) {
          this._selectOption(choices[num - 1]);
        }
      });
    } else if (node.next) {
      // Auto-advance on click
      this.continueText.setVisible(true);
      this.dialogBg.setInteractive();
      this.dialogBg.once('pointerdown', () => {
        this.dialogBg.disableInteractive();
        this._showNode(node.next);
      });
      
      // Clean up previous listeners and timers
      this.input.keyboard.removeAllListeners('keydown-E');
      this.input.keyboard.removeAllListeners('keydown-SPACE');
      if (this._dialogueTimer) this._dialogueTimer.destroy();

      // Also advance on E or Space (add slight delay to prevent same-frame trigger)
      this._dialogueTimer = this.time.delayedCall(100, () => {
        this.input.keyboard.once('keydown-E', () => {
          this.dialogBg.disableInteractive();
          this._showNode(node.next);
        });
        this.input.keyboard.once('keydown-SPACE', () => {
          this.dialogBg.disableInteractive();
          this._showNode(node.next);
        });
      });
    } else {
      // End of dialogue — click or press key to close
      this.continueText.setVisible(true);
      this.dialogBg.setInteractive();
      this.dialogBg.once('pointerdown', () => this._closeDialogue());
      
      this.input.keyboard.removeAllListeners('keydown-E');
      this.input.keyboard.removeAllListeners('keydown-SPACE');
      if (this._dialogueTimer) this._dialogueTimer.destroy();

      this._dialogueTimer = this.time.delayedCall(100, () => {
        this.input.keyboard.once('keydown-E', () => this._closeDialogue());
        this.input.keyboard.once('keydown-SPACE', () => this._closeDialogue());
      });
    }
  }

  _selectOption(ch) {
    const cur = this.registry.get('harmony');
    this.registry.set('harmony', Phaser.Math.Clamp(cur + (ch.harmonyDelta || 0), 0, 100));
    
    if (ch.action) {
      this.registry.events.emit('dialogue_action', ch.action);
    }

    if (ch.next) {
      this._showNode(ch.next);
    } else {
      this._closeDialogue();
    }
  }

  _closeDialogue() {
    this.dialogShadow.setVisible(false);
    this.dialogBg.setVisible(false).disableInteractive();
    this.dialogBorder.setVisible(false);
    this.speakerTagShadow.setVisible(false);
    this.speakerTagBg.setVisible(false);
    this.speakerTxt.setVisible(false);
    this.dialogText.setVisible(false);
    this.portraitImage.setVisible(false);
    this.continueText.setVisible(false);
    this.optionButtons.forEach(btn => btn.setVisible(false).removeAllListeners('pointerdown'));
    
    this.input.keyboard.removeAllListeners('keydown');
    this.input.keyboard.removeAllListeners('keydown-E');
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    
    if (this._dialogueTimer) {
      this._dialogueTimer.destroy();
      this._dialogueTimer = null;
    }

    this.registry.set('dialogueActive', false);
  }

  /* ══════════ QTE Methods ══════════ */
  startQTETimer(durationSec, onFailCallback) {
    this.qteTimerTxt.setVisible(true);
    let timeLeft = durationSec;
    this.qteTimerTxt.setText(`00:${timeLeft.toString().padStart(2, '0')}`);
    
    if (this._qteTimerEvent) this._qteTimerEvent.destroy();
    
    this._qteTimerEvent = this.time.addEvent({
      delay: 1000,
      repeat: durationSec - 1,
      callback: () => {
        timeLeft--;
        this.qteTimerTxt.setText(`00:${timeLeft.toString().padStart(2, '0')}`);
        if (timeLeft <= 0) {
          this.stopQTETimer();
          if (onFailCallback) onFailCallback();
        }
      }
    });
  }

  stopQTETimer() {
    this.qteTimerTxt.setVisible(false);
    if (this._qteTimerEvent) {
      this._qteTimerEvent.destroy();
      this._qteTimerEvent = null;
    }
  }

  /* ══════════ Helper Methods ══════════ */

  _refreshHarmony() {
    const val = this.registry.get('harmony');
    const pct = val / 100;
    // Animate bar width
    this.tweens.add({
      targets: this.harmonyBar,
      width: 190 * pct,
      duration: 400,
      ease: 'Power2'
    });
    // Color based on value in Cardboard Cosmos palette
    if (pct > 0.6) {
      this.harmonyBar.fillColor = 0x39ff14;   // lime
    } else if (pct > 0.3) {
      this.harmonyBar.fillColor = 0xffe500;   // sun yellow
    } else {
      this.harmonyBar.fillColor = 0xff2e93;   // pink
    }
    this.harmonyTxt.setText(`${val} / 100`);
  }

  _flashHarmonyChange(delta) {
    if (delta === 0) return;
    const isPositive = delta > 0;
    this.harmonyFlash.setText(isPositive ? `+${delta}` : `${delta}`);
    this.harmonyFlash.setColor(isPositive ? '#39ff14' : '#ff2e93');
    this.harmonyFlash.setAlpha(1);
    this.tweens.add({
      targets: this.harmonyFlash,
      alpha: 0,
      y: this.harmonyFlash.y - 15,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => {
        this.harmonyFlash.setY(22);
      }
    });
  }

  _refreshClock(t) {
    const h = Math.floor(t / 60);
    const m = t % 60;
    this.clockTxt.setText(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }

  _toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    if (this.sidebarOpen) {
      this.levelListContainer.setVisible(false);
    }
    this.tweens.add({
      targets: this.sidebarContainer,
      x: this.sidebarOpen ? 0 : -300,
      duration: 350,
      ease: 'Cubic.easeOut'
    });
  }


  _refreshLanguage() {
    const lang = this.registry.get('lang') || 'id';
    
    if (this.harmonyLabelTxt) this.harmonyLabelTxt.setText(lang === 'en' ? '♥ HARMONY' : '♥ HARMONI');
    if (this.switchLevelBtnObj) this.switchLevelBtnObj.txt.setText(lang === 'en' ? 'Switch Level' : 'Ganti Level');
    if (this.switchLangBtnObj)  this.switchLangBtnObj.txt.setText(lang === 'en' ? 'Switch Language (EN)' : 'Ganti Bahasa (ID)');
    if (this.closeSidebarBtnObj) this.closeSidebarBtnObj.txt.setText(lang === 'en' ? 'Resume' : 'Lanjut Main');
    if (this.exitGameBtnObj) this.exitGameBtnObj.txt.setText(lang === 'en' ? 'Exit Game' : 'Keluar Game');
    if (this.interactPrompt) this.interactPrompt.setText(lang === 'en' ? '[ Press E to interact ]' : '[ Tekan E untuk interaksi ]');
    
    if (this.levelButtons) {
      this.levelButtons.forEach(b => b.txt.setText(b.name[lang]));
    }
    
    this._refreshMapName();
    
    if (this.registry.get('dialogueActive')) {
      const activeNode = this._currentDialogueNode;
      if (activeNode) this._showNode(activeNode);
    }
  }

  _refreshMapName() {
    const lang = this.registry.get('lang') || 'id';
    const mapKey = this.registry.get('currentMap');
    const names = {
      garden:     lang === 'en' ? 'Level 1: Detective Emotion\n(School Garden)' : 'Level 1: Detektif Emosi\n(Taman Sekolah)',
      schoolyard: lang === 'en' ? 'Schoolyard\n(Central Courtyard)' : 'Halaman Sekolah\n(Halaman Utama)',
      library:    lang === 'en' ? 'School Library\n(Knowledge Hub)' : 'Perpustakaan\n(Pusat Pengetahuan)',
      corridor:   lang === 'en' ? 'Level 2: Empathy Rescue\n(Corridor & Library)' : 'Level 2: Penyelamatan Empati\n(Lorong & Perpustakaan)',
      classroom:  lang === 'en' ? 'Level 3: Mystery Case\n(Class Investigation)' : 'Level 3: Kasus Misteri\n(Investigasi Kelas)',
      auditorium: lang === 'en' ? 'Level 4: Harmony Builder\n(School Auditorium)' : 'Level 4: Pembangun Harmoni\n(Auditorium)',
      cafeteria:  lang === 'en' ? 'Level 5: Time Challenge X\n(Cafeteria)' : 'Level 5: Tantangan Waktu X\n(Kantin)'
    };
    const prefix = lang === 'en' ? 'Current Level:\n' : 'Level Saat Ini:\n';
    if (this.sidebarLevelText) {
      this.sidebarLevelText.setText(prefix + (names[mapKey] || mapKey.toUpperCase()));
    }
  }
}
