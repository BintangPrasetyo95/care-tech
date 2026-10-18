/* ───────────── scenes / UIScene.js ─────────────
   Overlay scene — renders the Harmony bar, in-game
   clock, map name, dialogue box with choice buttons,
   and interaction prompts.
   Runs in parallel with WorldScene.
   ─────────────────────────────────────────────── */

class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  _getUiResolution() {
    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const zoom = this.uiZoom || 1;
    return Math.max(2, Math.ceil(zoom * dpr));
  }

  _createSharpText(x, y, text, style = {}) {
    if (!this._allUiTexts) this._allUiTexts = [];
    const res = this._getUiResolution();
    const txt = this.add.text(Math.round(x), Math.round(y), text, {
      ...style,
      resolution: res
    });
    if (txt.texture) {
      txt.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }
    this._allUiTexts.push(txt);
    return txt;
  }

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
    this.harmonyLabelTxt = this._createSharpText(18, 12, '♥ INDEKS HARMONI', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: '10.5px',
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
    this.harmonyTxt = this._createSharpText(113, 29, '', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#000000'
    }).setOrigin(0.5).setScrollFactor(1).setDepth(103);

    /* ══════════ Harmony Change Flash ══════════ */
    this.harmonyFlash = this._createSharpText(224, 22, '', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: '16px',
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
    this.clockTxt = this._createSharpText(width - 56, 21, '', {
      fontFamily: '"Courier New", Courier, monospace',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#000000'
    }).setOrigin(0.5).setScrollFactor(1).setDepth(101);

    /* ══════════ Quest Banner (top-center) ══════════ */
    this.questContainer = this.add.container(width / 2, -80).setScrollFactor(1).setDepth(300);
    this.questBg = this.add.graphics();
    this.questText = this._createSharpText(0, -8, '', {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: '11.5px',
      fontStyle: 'bold',
      color: '#000000'
    }).setOrigin(0.5);
    this.questTimerText = this._createSharpText(0, 10, '', {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: '10.5px',
      fontStyle: 'bold',
      color: '#facc15'
    }).setOrigin(0.5).setVisible(false);
    this.questContainer.add([this.questBg, this.questText, this.questTimerText]);

    /* ══════════ QTE Timer ══════════ */
    this.qteTimerTxt = this._createSharpText(width / 2, height / 4, '', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif',
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
    
    this.menuToggleTxt = this._createSharpText(12 + 39, 46 + 13, '☰ MENU', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif', fontSize: '11.5px', fontStyle: 'bold', color: '#000000'
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
    sidebarBg.fillStyle(0xff2e93, 1).fillRect(20, 12, 240, 48);
    sidebarBg.lineStyle(3, 0x000000, 1).strokeRect(20, 12, 240, 48);
    this.sidebarContainer.add(sidebarBg);
    
    this.sidebarContainer.add(
      this._createSharpText(130, 26, 'CARE-TECH', {
        fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif', fontSize: '22px', fontStyle: 'bold', color: '#ffffff', letterSpacing: 2
      }).setOrigin(0.5).setShadow(2, 2, '#000000', 0, false, true)
    );
    
    this.sidebarContainer.add(
      this._createSharpText(130, 45, 'Harmonia School RPG', {
        fontFamily: '"Courier New", Courier, monospace', fontSize: '10px', fontStyle: 'bold', color: '#ffffff', letterSpacing: 1
      }).setOrigin(0.5).setShadow(1, 1, '#000000', 0, false, true)
    );

    // Close button (✕) on header banner
    const closeHeaderBtn = this.add.container(232, 18);
    const closeHeaderBg = this.add.graphics()
      .fillStyle(0xffffff, 1).fillRoundedRect(0, 0, 22, 22, 4)
      .lineStyle(2, 0x000000, 1).strokeRoundedRect(0, 0, 22, 22, 4);
    const closeHeaderTxt = this._createSharpText(11, 11, '✕', {
      fontFamily: '"GROBOLD", "Inter", sans-serif', fontSize: '12px', fontStyle: 'bold', color: '#000000'
    }).setOrigin(0.5);
    const closeHeaderZone = this.add.zone(11, 11, 22, 22).setInteractive({ useHandCursor: true });
    closeHeaderZone.on('pointerdown', () => this._toggleSidebar());
    closeHeaderBtn.add([closeHeaderBg, closeHeaderTxt, closeHeaderZone]);
    this.sidebarContainer.add(closeHeaderBtn);

    const divider = this.add.graphics().lineStyle(3, 0x000000, 1).lineBetween(24, 66, 256, 66);
    this.sidebarContainer.add(divider);

    // Scrollable container for sidebar body
    this.sidebarScrollContainer = this.add.container(0, 72);
    this.sidebarContainer.add(this.sidebarScrollContainer);

    this.sidebarMaskGfx = this.make.graphics();
    this.sidebarMaskGfx.fillStyle(0xffffff);
    this.sidebarMaskGfx.fillRect(0, 72, 280, height - 72);
    this.sidebarScrollContainer.setMask(this.sidebarMaskGfx.createGeometryMask());

    this.sidebarLevelText = this._createSharpText(140, 10, '', {
      fontFamily: '"Inter", "Segoe UI", sans-serif', fontSize: '12px', color: '#000000', align: 'center', wordWrap: { width: 240 }, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.sidebarScrollContainer.add(this.sidebarLevelText);

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
      
      const txt = this._createSharpText(w / 2, h / 2, text, {
        fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif', fontSize: '12px', fontStyle: 'bold', color: txtColor
      }).setOrigin(0.5);
      
      btnGroup.add([shadow, bg, txt]);
      const zone = this.add.zone(w / 2, h / 2, w, h).setInteractive({ useHandCursor: true });
      btnGroup.add(zone);
      
      let pDownPos = null;
      zone.on('pointerover', () => { drawBg(hoverHex); btnGroup.y -= 1; });
      zone.on('pointerout', () => {
        if (pDownPos) { btnGroup.y -= 2; btnGroup.x -= 2; pDownPos = null; }
        drawBg(defaultHex);
        btnGroup.y += 1;
      });
      zone.on('pointerdown', (pointer) => {
        pDownPos = { x: pointer.x, y: pointer.y };
        btnGroup.y += 2; btnGroup.x += 2;
      });
      zone.on('pointerup', (pointer) => {
        if (!pDownPos) return;
        btnGroup.y -= 2; btnGroup.x -= 2;
        const dist = Math.hypot(pointer.x - pDownPos.x, pointer.y - pDownPos.y);
        pDownPos = null;
        if (dist < 10) {
          onClick();
        }
      });
      this.sidebarScrollContainer.add(btnGroup);
      return { txt, zone, btnGroup, drawBg };
    };

    this.switchLangBtnObj = createBtn(40, 26, 200, 34, 'Ganti Bahasa (ID)', 0xffe500, 0xf5cc00, () => {
      const curLang = this.registry.get('lang') || 'id';
      this.registry.set('lang', curLang === 'en' ? 'id' : 'en');
    }, '#000000');

    const getAnalogLabel = () => {
      const lang = this.registry.get('lang') || 'id';
      const on = typeof window.isAnalogActive === 'function' ? window.isAnalogActive() : false;
      if (lang === 'en') return on ? '🕹️ Analog: ON' : '🕹️ Analog: OFF';
      return on ? '🕹️ Analog: AKTIF' : '🕹️ Analog: NONAKTIF';
    };

    this.analogToggleBtnObj = createBtn(40, 66, 200, 34, getAnalogLabel(), 0xffffff, 0xffe500, () => {
      if (typeof window.toggleAnalogControls === 'function') {
        const nextState = window.toggleAnalogControls();
        this.analogToggleBtnObj.txt.setText(getAnalogLabel());
        this.analogToggleBtnObj.drawBg(nextState ? 0x39ff14 : 0xffffff);
      }
    }, '#000000');

    const initAnalogOn = typeof window.isAnalogActive === 'function' ? window.isAnalogActive() : false;
    this.analogToggleBtnObj.drawBg(initAnalogOn ? 0x39ff14 : 0xffffff);

    window.addEventListener('analog-toggled', () => {
      if (this.analogToggleBtnObj && this.analogToggleBtnObj.txt) {
        this.analogToggleBtnObj.txt.setText(getAnalogLabel());
        const on = typeof window.isAnalogActive === 'function' ? window.isAnalogActive() : false;
        this.analogToggleBtnObj.drawBg(on ? 0x39ff14 : 0xffffff);
      }
    });

    /* ── Zoom Slider Group ── */
    this.currentZoom = (typeof localStorage !== 'undefined' && parseFloat(localStorage.getItem('caretech_zoom'))) || this.registry.get('cameraZoom') || (typeof SCALE !== 'undefined' ? SCALE : 2.0);
    this.currentZoom = Math.round(Phaser.Math.Clamp(this.currentZoom, 0.5, 3.0) * 10) / 10;

    this.zoomGroup = this.add.container(0, 106);
    this.sidebarScrollContainer.add(this.zoomGroup);

    const zoomShadow = this.add.graphics().fillStyle(0x000000, 1).fillRoundedRect(42, 2, 200, 56, 8);
    const zoomPanelBg = this.add.graphics()
      .fillStyle(0xffffff, 1).fillRoundedRect(40, 0, 200, 56, 8)
      .lineStyle(2.5, 0x000000, 1).strokeRoundedRect(40, 0, 200, 56, 8);

    this.zoomLabelTxt = this._createSharpText(140, 14, '', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#000000'
    }).setOrigin(0.5);

    const zoomMinusBtn = this.add.container(45, 26);
    const zoomMinusBg = this.add.graphics();
    const drawMinusBg = (col) => {
      zoomMinusBg.clear()
        .fillStyle(col, 1).fillRoundedRect(0, 0, 28, 26, 6)
        .lineStyle(2, 0x000000, 1).strokeRoundedRect(0, 0, 28, 26, 6);
    };
    drawMinusBg(0xffe500);
    const zoomMinusTxt = this._createSharpText(14, 12, '−', {
      fontFamily: '"GROBOLD", "Inter", sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#000000'
    }).setOrigin(0.5);
    const zoomMinusZone = this.add.zone(14, 13, 30, 28).setInteractive({ useHandCursor: true });
    zoomMinusZone.on('pointerdown', () => { drawMinusBg(0xf5cc00); this._setZoom(this.currentZoom - 0.1); });
    zoomMinusZone.on('pointerup', () => drawMinusBg(0xffe500));
    zoomMinusZone.on('pointerout', () => drawMinusBg(0xffe500));
    zoomMinusBtn.add([zoomMinusBg, zoomMinusTxt, zoomMinusZone]);

    const zoomPlusBtn = this.add.container(207, 26);
    const zoomPlusBg = this.add.graphics();
    const drawPlusBg = (col) => {
      zoomPlusBg.clear()
        .fillStyle(col, 1).fillRoundedRect(0, 0, 28, 26, 6)
        .lineStyle(2, 0x000000, 1).strokeRoundedRect(0, 0, 28, 26, 6);
    };
    drawPlusBg(0xffe500);
    const zoomPlusTxt = this._createSharpText(14, 12, '+', {
      fontFamily: '"GROBOLD", "Inter", sans-serif', fontSize: '16px', fontStyle: 'bold', color: '#000000'
    }).setOrigin(0.5);
    const zoomPlusZone = this.add.zone(14, 13, 30, 28).setInteractive({ useHandCursor: true });
    zoomPlusZone.on('pointerdown', () => { drawPlusBg(0xf5cc00); this._setZoom(this.currentZoom + 0.1); });
    zoomPlusZone.on('pointerup', () => drawPlusBg(0xffe500));
    zoomPlusZone.on('pointerout', () => drawPlusBg(0xffe500));
    zoomPlusBtn.add([zoomPlusBg, zoomPlusTxt, zoomPlusZone]);

    // Track and thumb
    this.zoomTrackGfx = this.add.graphics();
    const trackX = 79, trackY = 35, trackW = 122, trackH = 8;
    this._trackX = trackX; this._trackY = trackY; this._trackW = trackW; this._trackH = trackH;

    const zoomSliderZone = this.add.zone(trackX + trackW / 2, trackY + trackH / 2, trackW + 16, 26).setInteractive({ useHandCursor: true });
    const updateZoomFromPointer = (pointer) => {
      const bounds = this.sidebarContainer;
      const localX = pointer.x - bounds.x - trackX;
      const ratio = Phaser.Math.Clamp(localX / trackW, 0, 1);
      const newZoom = 0.5 + ratio * (3.0 - 0.5);
      this._setZoom(newZoom);
    };
    let isDraggingZoom = false;
    zoomSliderZone.on('pointerdown', (pointer) => {
      isDraggingZoom = true;
      updateZoomFromPointer(pointer);
    });
    this.input.on('pointermove', (pointer) => {
      if (isDraggingZoom) updateZoomFromPointer(pointer);
    });
    const stopZoomDrag = () => { isDraggingZoom = false; };
    this.input.on('pointerup', stopZoomDrag);
    this.input.on('pointerupoutside', stopZoomDrag);

    this.zoomGroup.add([zoomShadow, zoomPanelBg, this.zoomLabelTxt, zoomMinusBtn, zoomPlusBtn, this.zoomTrackGfx, zoomSliderZone]);
    this._updateZoomDisplay();

    this.switchLevelBtnObj = createBtn(40, 168, 200, 34, 'Ganti Level', 0x39ff14, 0x2fe00e, () => {
      this.levelListContainer.setVisible(!this.levelListContainer.visible);
      this._updateSidebarLayout();
    }, '#000000');

    this.levelListContainer = this.add.container(0, 208).setVisible(false);
    this.sidebarScrollContainer.add(this.levelListContainer);

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
          .fillStyle(color, 1).fillRoundedRect(40, i * 30, 200, 25, 6)
          .lineStyle(2, 0x000000, 1).strokeRoundedRect(40, i * 30, 200, 25, 6);
      };
      drawBg(0xffffff);

      const btnTxt = this._createSharpText(140, i * 30 + 12, lvl.name['id'], {
        fontFamily: '"Inter", "Segoe UI", sans-serif', fontSize: '11px', color: '#000000', fontStyle: 'bold'
      }).setOrigin(0.5);
      
      const zone = this.add.zone(140, i * 30 + 12, 200, 25).setInteractive({ useHandCursor: true });
      
      let lvlDownPos = null;
      zone.on('pointerover', () => { drawBg(0xffe500); btnTxt.setColor('#000000'); });
      zone.on('pointerout', () => { drawBg(0xffffff); btnTxt.setColor('#000000'); lvlDownPos = null; });
      zone.on('pointerdown', (pointer) => { lvlDownPos = { x: pointer.x, y: pointer.y }; });
      zone.on('pointerup', (pointer) => {
        if (!lvlDownPos) return;
        const dist = Math.hypot(pointer.x - lvlDownPos.x, pointer.y - lvlDownPos.y);
        lvlDownPos = null;
        if (dist > 10) return;
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

    this.closeSidebarBtnObj = createBtn(40, 208, 200, 34, 'Lanjut Main', 0x00e5ff, 0x00c4dc, () => {
      this._toggleSidebar();
    }, '#000000');
    
    this.exitGameBtnObj = createBtn(40, 248, 200, 34, 'Keluar Game', 0xff2e93, 0xe01b7a, () => {
      window.location.href = 'game.html';
    }, '#ffffff');

    // Scrollbar Graphics
    this.sidebarScrollbarGfx = this.add.graphics();
    this.sidebarContainer.add(this.sidebarScrollbarGfx);

    // Scrolling interaction listeners
    this._sidebarScrollY = 0;
    this._minSidebarScroll = 0;
    this._maxSidebarScroll = 0;

    let isDraggingSidebar = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    this.input.on('pointerdown', (pointer) => {
      if (!this.sidebarOpen) return;
      if (pointer.x >= 0 && pointer.x <= 280 && pointer.y >= 72) {
        isDraggingSidebar = true;
        dragStartY = pointer.y;
        dragStartScroll = this._sidebarScrollY;
      } else if (pointer.x > 280 && this.sidebarOpen) {
        this._toggleSidebar();
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (!isDraggingSidebar || !this.sidebarOpen) return;
      const dy = pointer.y - dragStartY;
      this._setSidebarScroll(dragStartScroll + dy);
    });

    const stopSidebarDrag = () => { isDraggingSidebar = false; };
    this.input.on('pointerup', stopSidebarDrag);
    this.input.on('pointerupoutside', stopSidebarDrag);

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (!this.sidebarOpen) return;
      if (pointer.x <= 280) {
        this._setSidebarScroll(this._sidebarScrollY - deltaY * 0.5);
      }
    });

    this._updateSidebarLayout();

    // ESC to toggle sidebar
    this.sidebarOpen = false;
    this.input.keyboard.on('keydown-ESC', () => {
      this._toggleSidebar();
    });

    /* ══════════ Interaction Prompt (Yellow Tape Badge) ══════════ */
    this.interactPrompt = this._createSharpText(width / 2, height - 130, '★ TEKAN E / SPASI UNTUK BICARA ★', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: '11.5px',
      color: '#000000',
      backgroundColor: '#ffe500',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setScrollFactor(1).setDepth(150).setAlpha(0);

    /* ══════════ Dialogue Panel (Cardboard Comic Speech Box) ══════════ */
    this._boxH = 154;
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
    this.speakerTxt = this._createSharpText(this._boxX + 18, this._boxY - 12, '', {
      fontFamily: '"GROBOLD", "Inter", "Segoe UI", sans-serif',
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setScrollFactor(1).setDepth(203).setVisible(false);

    // Accent line in dialog
    this.dialogBorder = this.add.rectangle(
      this._boxX + 10, this._boxY + 16, this._boxW - 20, 2, 0x000000, 0.2
    ).setOrigin(0).setScrollFactor(1).setDepth(201).setVisible(false);

    // Dialog text (Comic ink style)
    this.dialogText = this._createSharpText(this._boxX + 14, this._boxY + 22, '', {
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
      fontSize: '12.5px',
      fontStyle: 'bold',
      color: '#000000',
      wordWrap: { width: this._boxW - 28 },
      lineSpacing: 4,
    }).setScrollFactor(1).setDepth(201).setVisible(false);

    // Continue indicator (Pink retro pointer)
    this.continueText = this._createSharpText(this._boxX + this._boxW - 16, this._boxY + this._boxH - 14, '▶', {
      fontFamily: '"GROBOLD", monospace',
      fontSize: '14px',
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

    // ── Clickable option buttons (Cards if wide, full-width rows if short) ────────
    this.optionButtons = [];
    const badgeColors = [0xffe500, 0x00e5ff, 0x39ff14, 0xff2e93];

    for (let i = 0; i < 4; i++) {
      const btnContainer = this.add.container(0, 0)
        .setScrollFactor(1).setDepth(205).setVisible(false);
      
      const shadow = this.add.graphics();
      const bg = this.add.graphics();
      const numBadge = this.add.graphics();

      const numTxt = this._createSharpText(14, 13, `${i + 1}`, {
        fontFamily: '"GROBOLD", monospace',
        fontSize: '12px',
        color: '#000000',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const labelTxt = this._createSharpText(32, 13, '', {
        fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
        fontSize: '11.5px',
        fontStyle: 'bold',
        color: '#000000'
      }).setOrigin(0, 0.5);

      const arrowTxt = this._createSharpText(0, 13, '▶', {
        fontFamily: '"GROBOLD", monospace',
        fontSize: '11px',
        color: '#ff2e93',
        fontStyle: 'bold'
      }).setOrigin(0.5);

      const zone = this.add.zone(0, 0, 100, 26).setInteractive({ useHandCursor: true });

      btnContainer.add([shadow, bg, numBadge, numTxt, labelTxt, arrowTxt, zone]);

      const drawCardBg = (fillColor, borderColor = 0x000000) => {
        bg.clear()
          .fillStyle(fillColor, 1).fillRoundedRect(0, 0, optObj.cardW, optObj.cardH, 6)
          .lineStyle(2, borderColor, 1).strokeRoundedRect(0, 0, optObj.cardW, optObj.cardH, 6);
      };

      const optObj = {
        container: btnContainer,
        shadow,
        bg,
        drawCardBg,
        numBadge,
        numTxt,
        labelTxt,
        arrowTxt,
        zone,
        cardW: 200,
        cardH: 26,
        updateDimensions: (newW, newH = 26) => {
          optObj.cardW = newW;
          optObj.cardH = newH;
          shadow.clear().fillStyle(0x000000, 1).fillRoundedRect(3, 3, newW, newH, 6);
          drawCardBg(0xffffff);

          numBadge.clear()
            .fillStyle(badgeColors[i], 1).fillRoundedRect(4, Math.floor((newH - 18) / 2), 20, 18, 4)
            .lineStyle(1.5, 0x000000, 1).strokeRoundedRect(4, Math.floor((newH - 18) / 2), 20, 18, 4);

          numTxt.setPosition(14, Math.floor(newH / 2));
          labelTxt.setPosition(32, Math.floor(newH / 2)).setStyle({ wordWrap: { width: newW - 52 } });
          arrowTxt.setPosition(newW - 14, Math.floor(newH / 2));
          zone.setSize(newW, newH).setPosition(newW / 2, newH / 2);
        }
      };

      zone.on('pointerover', () => {
        drawCardBg(0xfffde6);
        btnContainer.y -= 1;
        arrowTxt.setColor('#ff8a00').setScale(1.2);
      });
      zone.on('pointerout', () => {
        drawCardBg(0xffffff);
        btnContainer.y += 1;
        arrowTxt.setColor('#ff2e93').setScale(1);
      });

      this.optionButtons.push(optObj);
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

    // Refresh resolution of all UI text objects for razor-sharp rendering at current zoom
    const newRes = this._getUiResolution();
    if (this._allUiTexts) {
      this._allUiTexts.forEach(t => {
        if (t && t.active && typeof t.setResolution === 'function') {
          t.setResolution(newRes);
          if (t.texture) t.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        }
      });
    }

    // Clock
    this.clockPanelShadow.setPosition(width - 9, 11);
    this.clockPanel.setPosition(width - 12, 8);
    this.clockTxt.setPosition(width - 56, 21);

    // Sidebar
    const sidebarBg = this.sidebarContainer.getAt(0);
    sidebarBg.clear();
    sidebarBg.fillStyle(0xe5d9c5, 1).fillRect(0, 0, 280, height);
    sidebarBg.lineStyle(4, 0x000000, 1).lineBetween(280, 0, 280, height);
    sidebarBg.fillStyle(0xff2e93, 1).fillRect(20, 12, 240, 48);
    sidebarBg.lineStyle(3, 0x000000, 1).strokeRect(20, 12, 240, 48);

    if (this.sidebarMaskGfx) {
      this.sidebarMaskGfx.clear().fillStyle(0xffffff).fillRect(0, 72, 280, height - 72);
    }
    this._updateSidebarLayout();

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
    this.dialogText.setPosition(this._boxX + 14, this._boxY + 22);
    this.dialogText.setStyle({ wordWrap: { width: this._boxW - 28 } });
    this.continueText.setPosition(this._boxX + this._boxW - 16, this._boxY + this._boxH - 14);

    const isWide = this._boxW >= 560;
    const textBottom = this.dialogText.y + this.dialogText.height;
    const optStartY = Math.max(this._boxY + 50, textBottom + 10);

    const cardGap = 10;
    const singleCardW = this._boxW - 28;
    const gridCardW = Math.floor((singleCardW - cardGap) / 2);
    const cardW = isWide ? gridCardW : singleCardW;
    const cardH = isWide ? 28 : 24;
    const rowSpacing = isWide ? 34 : 28;

    this.optionButtons.forEach((opt, i) => {
      opt.updateDimensions(cardW, cardH);
      const col = isWide ? (i % 2) : 0;
      const row = isWide ? Math.floor(i / 2) : i;
      const posX = isWide ? (this._boxX + 14 + col * (cardW + cardGap)) : (this._boxX + 14);
      const posY = optStartY + row * rowSpacing;
      opt.container.setPosition(posX, posY);
    });
  }

  /* ══════════ Public API ══════════ */

  /** Start Level 1 transition: screen starts dark then smoothly fades in to bright, accompanied by narrator 001 & schoolBell */
  startLevel1IntroTransition() {
    const worldScene = this.scene.get('World');
    if (worldScene && worldScene.cameras && worldScene.cameras.main) {
      worldScene.cameras.main.fadeIn(1500, 0, 0, 0);
    }
    this.cameras.main.fadeIn(1500, 0, 0, 0);
    this.startDialogue('lvl1_001_narrator');
  }

  /** Show top quest banner with optional timer */
  showQuest(text, options = {}) {
    if (this._questDismissTimer) {
      this._questDismissTimer.destroy();
      this._questDismissTimer = null;
    }
    if (this._questTimerEvent) {
      this._questTimerEvent.destroy();
      this._questTimerEvent = null;
    }

    const hasTimer = !!options.hasTimer;
    const durationSec = options.durationSec || 30;
    this._questOnTimeout = options.onTimeout || null;

    if (this.questBg) {
      this.questBg.clear();
      if (hasTimer) {
        this.questBg.fillStyle(0x0f172a, 0.95);
        this.questBg.fillRoundedRect(-170, -25, 340, 50, 10);
        this.questBg.lineStyle(1.5, 0xfacc15, 0.9);
        this.questBg.strokeRoundedRect(-170, -25, 340, 50, 10);
      } else {
        this.questBg.fillStyle(0x0f172a, 0.92);
        this.questBg.fillRoundedRect(-155, -18, 310, 36, 10);
        this.questBg.lineStyle(1.5, 0x38bdf8, 0.85);
        this.questBg.strokeRoundedRect(-155, -18, 310, 36, 10);
      }
    }

    if (hasTimer) {
      if (this.questText) this.questText.setY(-8).setText(text).setColor('#facc15');
      if (this.questTimerText) {
        this.questTimerText.setVisible(true).setY(10).setText(`⏱ Sisa Waktu: 00:${durationSec.toString().padStart(2, '0')}`).setColor('#facc15');
      }

      let remaining = durationSec;
      this._questTimerEvent = this.time.addEvent({
        delay: 1000,
        repeat: durationSec - 1,
        callback: () => {
          remaining--;
          const secStr = remaining.toString().padStart(2, '0');
          if (this.questTimerText) {
            this.questTimerText.setText(`⏱ Sisa Waktu: 00:${secStr}`);
            if (remaining <= 5) {
              this.questTimerText.setColor('#ef4444');
            }
          }
          if (remaining <= 0) {
            if (this._questTimerEvent) {
              this._questTimerEvent.destroy();
              this._questTimerEvent = null;
            }
            this.hideQuestBanner();
            if (this._questOnTimeout) {
              this._questOnTimeout();
            }
          }
        }
      });
    } else {
      if (this.questText) this.questText.setY(0).setText(text).setColor('#38bdf8');
      if (this.questTimerText) this.questTimerText.setVisible(false);

      if (options.duration && options.duration > 0) {
        this._questDismissTimer = this.time.delayedCall(options.duration, () => {
          this.hideQuestBanner();
        });
      }
    }

    if (this.questContainer) {
      this.tweens.killTweensOf(this.questContainer);
      this.questContainer.setY(-80);
      this.tweens.add({
        targets: this.questContainer,
        y: 45,
        duration: 500,
        ease: 'Back.easeOut'
      });
    }
  }

  showQuestBanner(text, duration = 4000) {
    this.showQuest(text, { duration });
  }

  completeQuest(questName) {
    if (this._questDismissTimer) {
      this._questDismissTimer.destroy();
      this._questDismissTimer = null;
    }
    if (this._questTimerEvent) {
      this._questTimerEvent.destroy();
      this._questTimerEvent = null;
    }
    if (this.questTimerText) this.questTimerText.setVisible(false);

    if (this.questBg) {
      this.questBg.clear();
      this.questBg.fillStyle(0x064e3b, 0.96);
      this.questBg.fillRoundedRect(-170, -18, 340, 36, 10);
      this.questBg.lineStyle(2, 0x22c55e, 1);
      this.questBg.strokeRoundedRect(-170, -18, 340, 36, 10);
    }

    if (this.questText) {
      this.questText.setY(0).setColor('#4ade80').setText(`✓ QUEST SELESAI: ${questName}`);
    }

    if (navigator.vibrate) navigator.vibrate([80, 40, 80]);

    if (this.questContainer) {
      this.tweens.killTweensOf(this.questContainer);
      this.tweens.add({
        targets: this.questContainer,
        y: 45,
        duration: 400,
        ease: 'Back.easeOut'
      });
    }

    this._questDismissTimer = this.time.delayedCall(4500, () => {
      this.hideQuestBanner();
    });
  }

  hideQuestBanner() {
    if (this._questDismissTimer) {
      this._questDismissTimer.destroy();
      this._questDismissTimer = null;
    }
    if (this._questTimerEvent) {
      this._questTimerEvent.destroy();
      this._questTimerEvent = null;
    }
    if (!this.questContainer) return;
    this.tweens.killTweensOf(this.questContainer);
    this.tweens.add({
      targets: this.questContainer,
      y: -80,
      duration: 400,
      ease: 'Power2'
    });
  }

  /** Start displaying a dialogue tree from the given node */
  startDialogue(nodeId) {
    this.registry.set('dialogueActive', true);
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('dialogue-active');
    }
    if (typeof window !== 'undefined') {
      if (typeof window.setDialogueActive === 'function') {
        window.setDialogueActive(true);
      }
      if (typeof window.resetJoystick === 'function') {
        window.resetJoystick();
      }
    }
    if (this.interactPrompt) {
      this.interactPrompt.setAlpha(0);
    }
    this._showNode(nodeId);
  }

  /** Show/hide the 'Press E' interaction prompt */
  setInteractPrompt(visible) {
    if (this.registry.get('dialogueActive')) {
      if (this.interactPrompt) this.interactPrompt.setAlpha(0);
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
    const allDialogues = (window.DIALOGUES || (typeof DIALOGUES !== 'undefined' ? DIALOGUES : {}));
    const node = allDialogues[nodeId];
    if (!node) {
      console.warn('[Dialogue] Node not found in DIALOGUES:', nodeId);
      this._closeDialogue();
      return;
    }

    if (node.action) {
      this.registry.events.emit('dialogue_action', node.action);
    }

    // Handle auto-advance timer if specified on dialogue node
    if (this._autoAdvanceTimerEvent) {
      this._autoAdvanceTimerEvent.destroy();
      this._autoAdvanceTimerEvent = null;
    }
    if (node.autoAdvanceTimer && node.autoAdvanceTimer > 0) {
      this._autoAdvanceTimerEvent = this.time.delayedCall(node.autoAdvanceTimer, () => {
        this._autoAdvanceTimerEvent = null;
        if (node.next) {
          this._showNode(node.next);
        } else {
          this._closeDialogue();
        }
      });
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

    // ── Render option buttons: CARDS if dialogue width is long, full-width rows if short ──
    const choices = node.choices || [];
    const isWide = this._boxW >= 560;
    const textBottom = this.dialogText.y + this.dialogText.height;
    const optStartY = Math.max(this._boxY + 50, textBottom + 10);

    const cardGap = 10;
    const singleCardW = this._boxW - 28;
    const gridCardW = Math.floor((singleCardW - cardGap) / 2);
    const cardW = isWide ? gridCardW : singleCardW;
    const cardH = isWide ? 28 : 24;
    const rowSpacing = isWide ? 34 : 28;

    for (let i = 0; i < this.optionButtons.length; i++) {
      const opt = this.optionButtons[i];
      opt.zone.removeAllListeners('pointerdown');

      if (i < choices.length) {
        const ch = choices[i];
        let labelText = typeof ch.label === 'object' ? ch.label[lang] : ch.label;
        // Strip score helpers (+25, -35, etc) and redundant leading index numbers (1. , 2. )
        labelText = (labelText || '')
          .replace(/\s*\([+-]\d+\)/g, '')
          .replace(/^\d+\.\s*/, '')
          .trim();

        opt.labelTxt.setText(labelText);
        opt.numTxt.setText(`${i + 1}`);
        opt.updateDimensions(cardW, cardH);
        opt.drawCardBg(0xffffff);

        const col = isWide ? (i % 2) : 0;
        const row = isWide ? Math.floor(i / 2) : i;
        const posX = isWide ? (this._boxX + 14 + col * (cardW + cardGap)) : (this._boxX + 14);
        const posY = optStartY + row * rowSpacing;

        opt.container
          .setPosition(posX, posY)
          .setVisible(true);

        opt.zone.on('pointerdown', () => {
          if (this._autoAdvanceTimerEvent) {
            this._autoAdvanceTimerEvent.destroy();
            this._autoAdvanceTimerEvent = null;
          }
          this._selectOption(ch);
        });
      } else {
        opt.container.setVisible(false);
      }
    }

    // Keyboard 1-4 to select options
    this.input.keyboard.removeAllListeners('keydown');
    if (choices.length > 0) {
      this._cleanupDialogueAdvance();
      this.continueText.setVisible(false);
      this.dialogBg.disableInteractive();
      this.input.keyboard.on('keydown', (event) => {
        const num = parseInt(event.key, 10);
        if (num >= 1 && num <= choices.length) {
          if (this._autoAdvanceTimerEvent) {
            this._autoAdvanceTimerEvent.destroy();
            this._autoAdvanceTimerEvent = null;
          }
          this._selectOption(choices[num - 1]);
        }
      });
    } else if (node.next) {
      // Auto-advance to next node on click anywhere or key press
      if (node.noManualAdvance) {
        this._cleanupDialogueAdvance();
        this.continueText.setVisible(false);
      } else {
        this._setupDialogueAdvance(() => {
          this._showNode(node.next);
        });
      }
    } else {
      // End of dialogue — click anywhere or key press to close (unless noManualAdvance is set for cutscenes)
      if (node.noManualAdvance) {
        this._cleanupDialogueAdvance();
        this.continueText.setVisible(false);
      } else {
        this._setupDialogueAdvance(() => {
          this._closeDialogue();
        });
      }
    }
  }

  _cleanupDialogueAdvance() {
    if (this._dialogueTimer) {
      this._dialogueTimer.destroy();
      this._dialogueTimer = null;
    }
    if (this._dialogueAdvanceFn) {
      this.dialogBg.off('pointerdown', this._dialogueAdvanceFn);
      this.input.off('pointerdown', this._dialogueAdvanceFn);
      this.input.keyboard.off('keydown-E', this._dialogueAdvanceFn);
      this.input.keyboard.off('keydown-SPACE', this._dialogueAdvanceFn);
      this.input.keyboard.off('keydown-ENTER', this._dialogueAdvanceFn);
      this._dialogueAdvanceFn = null;
    }
    if (this._windowAdvanceHandler) {
      window.removeEventListener('dialogue_advance_request', this._windowAdvanceHandler);
      this._windowAdvanceHandler = null;
    }
    this.dialogBg.disableInteractive();
  }

  /**
   * Allow manual dialogue advance for nodes initially marked with noManualAdvance
   * (e.g. after a cutscene or camera pan completes)
   */
  enableDialogueAdvance(onTrigger) {
    if (this.currentDialogueNode) {
      this._setupDialogueAdvance(() => {
        if (typeof onTrigger === 'function') {
          onTrigger();
        } else if (this.currentDialogueNode.next) {
          this._showNode(this.currentDialogueNode.next);
        } else {
          this._closeDialogue();
        }
      });
    }
  }

  _setupDialogueAdvance(onTrigger) {
    this._cleanupDialogueAdvance();
    this.continueText.setVisible(true);

    let canTrigger = false;
    this._dialogueTimer = this.time.delayedCall(100, () => {
      canTrigger = true;
      this.dialogBg.setInteractive({ useHandCursor: true });
    });

    const trigger = () => {
      if (!canTrigger) return;
      if (this._autoAdvanceTimerEvent) {
        this._autoAdvanceTimerEvent.destroy();
        this._autoAdvanceTimerEvent = null;
      }
      this._cleanupDialogueAdvance();
      onTrigger();
    };

    this._dialogueAdvanceFn = trigger;

    // 1. Klik pada area kotak dialog
    this.dialogBg.on('pointerdown', trigger);

    // 2. Klik/tap di MANA SAJA pada layar permainan
    this.input.on('pointerdown', trigger);

    // 3. Tombol keyboard: E, Space, Enter
    this.input.keyboard.on('keydown-E', trigger);
    this.input.keyboard.on('keydown-SPACE', trigger);
    this.input.keyboard.on('keydown-ENTER', trigger);

    // 4. Tombol aksi virtual (mobile E / Touch button)
    this._windowAdvanceHandler = trigger;
    window.addEventListener('dialogue_advance_request', trigger);
  }

  enableDialogueAdvance(targetNode = null) {
    const nextNode = targetNode || (this._currentNode ? this._currentNode.next : null);
    if (nextNode) {
      this._setupDialogueAdvance(() => {
        this._showNode(nextNode);
      });
    } else {
      this._setupDialogueAdvance(() => {
        this._closeDialogue();
      });
    }
  }

  _selectOption(ch) {
    this._cleanupDialogueAdvance();
    this.hideQuestBanner();
    if (this._autoAdvanceTimerEvent) {
      this._autoAdvanceTimerEvent.destroy();
      this._autoAdvanceTimerEvent = null;
    }
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
    this._cleanupDialogueAdvance();
    if (this._autoAdvanceTimerEvent) {
      this._autoAdvanceTimerEvent.destroy();
      this._autoAdvanceTimerEvent = null;
    }

    const lastNodeId = this._currentDialogueNode;
    const lastNode = lastNodeId ? DIALOGUES[lastNodeId] : null;
    this._currentDialogueNode = null;

    if (this.dialogShadow) this.dialogShadow.setVisible(false);
    this.dialogBg.setVisible(false).disableInteractive();
    this.dialogBorder.setVisible(false);
    this.speakerTagShadow.setVisible(false);
    this.speakerTagBg.setVisible(false);
    this.speakerTxt.setVisible(false);
    this.dialogText.setVisible(false);
    this.portraitImage.setVisible(false);
    this.continueText.setVisible(false);
    this.optionButtons.forEach(opt => {
      opt.container.setVisible(false);
      opt.zone.removeAllListeners('pointerdown');
    });
    
    this.input.keyboard.removeAllListeners('keydown');
    this.input.keyboard.removeAllListeners('keydown-E');
    this.input.keyboard.removeAllListeners('keydown-SPACE');
    this.input.keyboard.removeAllListeners('keydown-ENTER');
    
    if (this._dialogueTimer) {
      this._dialogueTimer.destroy();
      this._dialogueTimer = null;
    }

    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.remove('dialogue-active');
    }
    if (typeof window !== 'undefined') {
      if (typeof window.setDialogueActive === 'function') {
        window.setDialogueActive(false);
      }
      if (typeof window.focus === 'function') {
        window.focus();
      }
      const canvas = document.querySelector('canvas');
      if (canvas && typeof canvas.focus === 'function') {
        canvas.focus();
      }
    }

    this.registry.set('dialogueActive', false);

    if (lastNode && lastNode.onCloseAction) {
      this.registry.events.emit('dialogue_action', lastNode.onCloseAction);
    }
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
      this._sidebarScrollY = 0;
      this._updateSidebarLayout();
    }
    this.registry.set('menuOpen', this.sidebarOpen);

    // Notify DOM and reset controls when menu opens
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.toggle('menu-open', this.sidebarOpen);
    }
    if (this.sidebarOpen) {
      if (window.virtualInput) {
        window.virtualInput.axisX = 0;
        window.virtualInput.axisY = 0;
        window.virtualInput.left = false;
        window.virtualInput.right = false;
        window.virtualInput.up = false;
        window.virtualInput.down = false;
        window.virtualInput.actionJustDown = false;
      }
      if (typeof window.resetJoystick === 'function') {
        window.resetJoystick();
      }
    }
    window.dispatchEvent(new CustomEvent('menu-toggled', { detail: { open: this.sidebarOpen } }));

    this.tweens.add({
      targets: this.sidebarContainer,
      x: this.sidebarOpen ? 0 : -300,
      duration: 350,
      ease: 'Cubic.easeOut'
    });
  }

  _setZoom(zoom) {
    const clamped = Math.round(Phaser.Math.Clamp(zoom, 0.5, 3.0) * 10) / 10;
    this.currentZoom = clamped;
    this.registry.set('cameraZoom', clamped);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('caretech_zoom', clamped);
    }
    const world = this.scene.get('World');
    if (world && world.cameras && world.cameras.main) {
      world.cameras.main.setZoom(clamped);
    }
    this._updateZoomDisplay();
  }

  _updateZoomDisplay() {
    if (!this.zoomLabelTxt) return;
    const lang = this.registry.get('lang') || 'id';
    const pct = Math.round((this.currentZoom / 2.0) * 100);
    const label = lang === 'en'
      ? `🔍 Zoom: ${this.currentZoom.toFixed(1)}x (${pct}%)`
      : `🔍 Zoom: ${this.currentZoom.toFixed(1)}x (${pct}%)`;
    this.zoomLabelTxt.setText(label);
    this._drawZoomSlider();
  }

  _drawZoomSlider() {
    if (!this.zoomTrackGfx) return;
    const trackX = this._trackX || 78;
    const trackY = this._trackY || 35;
    const trackW = this._trackW || 124;
    const trackH = this._trackH || 8;

    const ratio = Phaser.Math.Clamp((this.currentZoom - 0.5) / (3.0 - 0.5), 0, 1);
    const fillW = Math.max(0, ratio * trackW);
    const thumbX = trackX + ratio * trackW;

    this.zoomTrackGfx.clear();
    // Track background
    this.zoomTrackGfx.fillStyle(0xded4c2, 1).fillRoundedRect(trackX, trackY, trackW, trackH, 4)
      .lineStyle(1.5, 0x000000, 1).strokeRoundedRect(trackX, trackY, trackW, trackH, 4);
    // Active fill
    if (fillW > 0) {
      this.zoomTrackGfx.fillStyle(0x00e5ff, 1).fillRoundedRect(trackX, trackY, fillW, trackH, 4)
        .lineStyle(1.5, 0x000000, 1).strokeRoundedRect(trackX, trackY, fillW, trackH, 4);
    }
    // Thumb shadow
    this.zoomTrackGfx.fillStyle(0x000000, 1).fillCircle(thumbX + 1.5, trackY + trackH / 2 + 1.5, 8);
    // Thumb
    this.zoomTrackGfx.fillStyle(0xffe500, 1).fillCircle(thumbX, trackY + trackH / 2, 8)
      .lineStyle(2, 0x000000, 1).strokeCircle(thumbX, trackY + trackH / 2, 8);
  }

  _setSidebarScroll(y) {
    this._sidebarScrollY = Phaser.Math.Clamp(y, this._minSidebarScroll, this._maxSidebarScroll);
    if (this.sidebarScrollContainer) {
      this.sidebarScrollContainer.setY(72 + this._sidebarScrollY);
    }
    const viewportH = (this._effHeight || this.cameras.main.height) - 72;
    const totalContentH = this.exitGameBtnObj ? (this.exitGameBtnObj.btnGroup.y + 44) : 400;
    this._updateScrollbar(viewportH, totalContentH);
  }

  _updateSidebarLayout() {
    if (!this.levelListContainer || !this.closeSidebarBtnObj || !this.exitGameBtnObj) return;
    const isLevelOpen = this.levelListContainer.visible;
    const levelListH = isLevelOpen ? (7 * 30 + 8) : 0;
    const baseAfterLevel = 208 + levelListH;

    this.closeSidebarBtnObj.btnGroup.setY(baseAfterLevel + 8);
    this.exitGameBtnObj.btnGroup.setY(baseAfterLevel + 46);

    const totalContentH = baseAfterLevel + 46 + 34 + 16;
    const viewportH = (this._effHeight || this.cameras.main.height) - 72;

    this._maxSidebarScroll = 0;
    this._minSidebarScroll = Math.min(0, viewportH - totalContentH);

    this._setSidebarScroll(this._sidebarScrollY || 0);
  }

  _updateScrollbar(viewportH, totalContentH) {
    if (!this.sidebarScrollbarGfx) return;
    this.sidebarScrollbarGfx.clear();
    if (this._minSidebarScroll >= 0) return;

    const trackY = 76;
    const trackH = Math.max(10, viewportH - 12);
    const trackX = 274;

    // Track
    this.sidebarScrollbarGfx.fillStyle(0x000000, 0.15).fillRoundedRect(trackX, trackY, 3, trackH, 1.5);

    // Thumb
    const ratio = Phaser.Math.Clamp(viewportH / totalContentH, 0.15, 0.85);
    const thumbH = Math.max(22, trackH * ratio);
    const scrollRatio = (-this._sidebarScrollY) / (-this._minSidebarScroll);
    const thumbY = trackY + scrollRatio * (trackH - thumbH);

    this.sidebarScrollbarGfx.fillStyle(0x000000, 0.65).fillRoundedRect(trackX, thumbY, 3, thumbH, 1.5);
  }

  _refreshLanguage() {
    const lang = this.registry.get('lang') || 'id';
    
    if (this.harmonyLabelTxt) this.harmonyLabelTxt.setText(lang === 'en' ? '♥ HARMONY' : '♥ HARMONI');
    if (this.switchLangBtnObj)  this.switchLangBtnObj.txt.setText(lang === 'en' ? 'Switch Language (EN)' : 'Ganti Bahasa (ID)');
    if (this.analogToggleBtnObj) {
      const isAnalog = typeof window.isAnalogActive === 'function' ? window.isAnalogActive() : false;
      this.analogToggleBtnObj.txt.setText(lang === 'en' ? (isAnalog ? '🕹️ Analog: ON' : '🕹️ Analog: OFF') : (isAnalog ? '🕹️ Analog: AKTIF' : '🕹️ Analog: NONAKTIF'));
    }
    this._updateZoomDisplay();
    if (this.switchLevelBtnObj) this.switchLevelBtnObj.txt.setText(lang === 'en' ? 'Switch Level' : 'Ganti Level');
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
