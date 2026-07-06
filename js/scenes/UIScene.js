/* ───────────── scenes / UIScene.js ─────────────
   Overlay scene — renders the Harmony bar, in-game
   clock, map name, dialogue box with choice buttons,
   and interaction prompts.
   Runs in parallel with WorldScene.
   ─────────────────────────────────────────────── */

class UIScene extends Phaser.Scene {
  constructor() { super('UI'); }

  create() {
    const { width, height } = this.scale;

    /* ══════════ Harmony Bar (top-left) ══════════ */
    // Background panel
    this.harmonyPanel = this.add.rectangle(12, 8, 200, 32, 0x16161a, 0.85)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(100);
    // Label
    this.harmonyLabelTxt = this.add.text(18, 11, '♥ HARMONI', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#94a1b2',
      letterSpacing: 1
    }).setScrollFactor(0).setDepth(101);
    // Bar track
    this.harmonyTrack = this.add.rectangle(18, 28, 186, 8, 0x242629)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
    // Bar fill
    this.harmonyBar = this.add.rectangle(18, 28, 0, 8, 0x2cb67d)
      .setOrigin(0, 0.5).setScrollFactor(0).setDepth(102);
    // Value text
    this.harmonyTxt = this.add.text(110, 28, '', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '9px',
      fontStyle: 'bold',
      color: '#fffffe'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(103);

    /* ══════════ Harmony Change Flash ══════════ */
    this.harmonyFlash = this.add.text(220, 20, '', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#2cb67d'
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(103).setAlpha(0);

    /* ══════════ Clock (top-right) ══════════ */
    this.clockPanel = this.add.rectangle(width - 12, 8, 80, 24, 0x16161a, 0.85)
      .setOrigin(1, 0).setScrollFactor(0).setDepth(100);
    this.clockTxt = this.add.text(width - 52, 20, '', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '12px',
      fontStyle: 'bold',
      color: '#facc15'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);


    /* ══════════ Mobile/Clickable Menu Toggle ══════════ */
    const menuToggleBg = this.add.graphics().setScrollFactor(0).setDepth(101);
    menuToggleBg.fillStyle(0x0ea5e9, 1).fillRoundedRect(12, 45, 76, 26, 6);
    
    this.menuToggleTxt = this.add.text(12 + 38, 45 + 13, '☰ MENU', {
      fontFamily: '"Segoe UI", system-ui, sans-serif', fontSize: '11px', fontStyle: 'bold', color: '#ffffff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(102);

    this.menuToggleZone = this.add.zone(12 + 38, 45 + 13, 76, 26)
      .setOrigin(0.5).setScrollFactor(0).setDepth(103).setInteractive({ useHandCursor: true });
    
    this.menuToggleZone.on('pointerover', () => menuToggleBg.clear().fillStyle(0x0284c7, 1).fillRoundedRect(12, 45, 76, 26, 6));
    this.menuToggleZone.on('pointerout', () => menuToggleBg.clear().fillStyle(0x0ea5e9, 1).fillRoundedRect(12, 45, 76, 26, 6));
    this.menuToggleZone.on('pointerdown', () => {
      menuToggleBg.clear().fillStyle(0x0369a1, 1).fillRoundedRect(12, 45, 76, 26, 6);
      this.time.delayedCall(100, () => {
        menuToggleBg.clear().fillStyle(0x0ea5e9, 1).fillRoundedRect(12, 45, 76, 26, 6);
        this._toggleSidebar();
      });
    });

    /* ══════════ Sidebar Menu (ESC to toggle) ══════════ */
    this.sidebarContainer = this.add.container(-300, 0).setScrollFactor(0).setDepth(400);
    
    const sidebarBg = this.add.graphics();
    sidebarBg.fillStyle(0x0f172a, 0.96).fillRect(0, 0, 280, height); // Dark slate
    sidebarBg.fillStyle(0x38bdf8, 1).fillRect(278, 0, 2, height); // Bright blue edge
    sidebarBg.fillStyle(0x38bdf8, 0.15).fillRect(274, 0, 4, height); // Glow effect
    this.sidebarContainer.add(sidebarBg);
    
    this.sidebarContainer.add(
      this.add.text(140, 36, 'CARE-TECH', {
        fontFamily: '"Segoe UI", system-ui, sans-serif', fontSize: '26px', fontStyle: '900', color: '#38bdf8', letterSpacing: 2
      }).setOrigin(0.5).setShadow(0, 2, '#000000', 4, false, true)
    );
    
    this.sidebarContainer.add(
      this.add.text(140, 62, 'Harmonia School', {
        fontFamily: '"Segoe UI", system-ui, sans-serif', fontSize: '13px', fontStyle: '600', color: '#94a3b8', letterSpacing: 1
      }).setOrigin(0.5)
    );

    const divider = this.add.graphics().lineStyle(1, 0x334155, 1).lineBetween(30, 85, 250, 85);
    this.sidebarContainer.add(divider);

    this.sidebarLevelText = this.add.text(140, 110, '', {
      fontFamily: '"Segoe UI", system-ui, sans-serif', fontSize: '12px', color: '#e2e8f0', align: 'center', wordWrap: { width: 240 }, fontStyle: 'bold'
    }).setOrigin(0.5);
    this.sidebarContainer.add(this.sidebarLevelText);

    // Button Generator
    const createBtn = (x, y, w, h, text, defaultHex, hoverHex, onClick) => {
      const btnGroup = this.add.container(x, y);
      const shadow = this.add.graphics().fillStyle(0x000000, 0.3).fillRoundedRect(0, 3, w, h, 6);
      const bg = this.add.graphics().fillStyle(defaultHex, 1).fillRoundedRect(0, 0, w, h, 6);
      const txt = this.add.text(w / 2, h / 2, text, {
        fontFamily: '"Segoe UI", system-ui, sans-serif', fontSize: '12px', fontStyle: 'bold', color: '#ffffff'
      }).setOrigin(0.5);
      
      btnGroup.add([shadow, bg, txt]);
      const zone = this.add.zone(w / 2, h / 2, w, h).setInteractive({ useHandCursor: true });
      btnGroup.add(zone);
      
      zone.on('pointerover', () => { bg.clear().fillStyle(hoverHex, 1).fillRoundedRect(0, 0, w, h, 6); btnGroup.y -= 1; shadow.y += 1; });
      zone.on('pointerout', () => { bg.clear().fillStyle(defaultHex, 1).fillRoundedRect(0, 0, w, h, 6); btnGroup.y += 1; shadow.y -= 1; });
      zone.on('pointerdown', () => {
        btnGroup.y += 2; shadow.y -= 2;
        this.time.delayedCall(100, () => { btnGroup.y -= 2; shadow.y += 2; onClick(); });
      });
      this.sidebarContainer.add(btnGroup);
      return { txt, zone, btnGroup };
    };

    this.switchLevelBtnObj = createBtn(40, 145, 200, 34, 'Ganti Level', 0x10b981, 0x059669, () => {
      this.levelListContainer.setVisible(!this.levelListContainer.visible);
    });

    this.switchLangBtnObj = createBtn(40, 190, 200, 34, 'Ganti Bahasa (ID)', 0xf59e0b, 0xd97706, () => {
      const curLang = this.registry.get('lang') || 'id';
      this.registry.set('lang', curLang === 'en' ? 'id' : 'en');
    });
    
    this.closeSidebarBtnObj = createBtn(40, height - 50, 200, 34, 'Kembali', 0xef4444, 0xdc2626, () => {
      this._toggleSidebar();
    });

    this.levelListContainer = this.add.container(0, 235).setVisible(false);
    this.sidebarContainer.add(this.levelListContainer);

    const levelInfos = [
      { key: 'garden', name: {en: 'Level 1: Detective Emotion', id: 'Level 1: Detektif Emosi'} },
      { key: 'corridor', name: {en: 'Level 2: Empathy Rescue', id: 'Level 2: Penyelamatan Empati'} },
      { key: 'classroom', name: {en: 'Level 3: Mystery Case', id: 'Level 3: Kasus Misteri'} },
      { key: 'auditorium', name: {en: 'Level 4: Harmony Builder', id: 'Level 4: Pembangun Harmoni'} },
      { key: 'cafeteria', name: {en: 'Level 5: Time Challenge X', id: 'Level 5: Tantangan Waktu X'} }
    ];
    this.levelButtons = [];

    levelInfos.forEach((lvl, i) => {
      const bg = this.add.graphics();
      const drawBg = (color, alpha) => bg.clear().fillStyle(color, alpha).fillRoundedRect(35, i * 32, 210, 26, 4);
      drawBg(0x1e293b, 0.7);

      const btnTxt = this.add.text(140, i * 32 + 13, lvl.name['id'], {
        fontFamily: '"Segoe UI", system-ui, sans-serif', fontSize: '11px', color: '#94a3b8', fontStyle: '600'
      }).setOrigin(0.5);
      
      const zone = this.add.zone(140, i * 32 + 13, 210, 26).setInteractive({ useHandCursor: true });
      
      zone.on('pointerover', () => { drawBg(0x38bdf8, 0.2); btnTxt.setColor('#38bdf8'); });
      zone.on('pointerout', () => { drawBg(0x1e293b, 0.7); btnTxt.setColor('#94a3b8'); });
      zone.on('pointerdown', () => {
        this._toggleSidebar();
        const world = this.scene.get('World');
        if (world && world._changeMap) {
           world._changeMap(lvl.key, 10 * 32 + 16, 7 * 32 + 16); 
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

    /* ══════════ Interaction Prompt ══════════ */
    this.interactPrompt = this.add.text(width / 2, height - 130, '[ Tekan E untuk interaksi ]', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '10px',
      color: '#e2e8f0',
      backgroundColor: '#16161a',
      padding: { x: 8, y: 4 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(150).setAlpha(0);

    /* ══════════ Dialogue Panel (bottom) ══════════ */
    this._boxH = 148;
    this._boxW = width - 16;
    this._boxX = 8;
    this._boxY = height - this._boxH - 4;

    // Semi-transparent background
    this.dialogBg = this.add.rectangle(
      this._boxX, this._boxY, this._boxW, this._boxH, 0x1a1a2e, 0.92
    )
      .setOrigin(0)
      .setStrokeStyle(2, 0x0ea5e9)
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    // Speaker name
    this.speakerTxt = this.add.text(this._boxX + 10, this._boxY + 6, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#38bdf8',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(201).setVisible(false);

    // Accent border at top of dialog
    this.dialogBorder = this.add.rectangle(
      this._boxX + 10, this._boxY + 22, this._boxW - 20, 1, 0x0ea5e9, 0.4
    ).setOrigin(0).setScrollFactor(0).setDepth(201).setVisible(false);

    // Dialog text
    this.dialogText = this.add.text(this._boxX + 10, this._boxY + 28, '', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      wordWrap: { width: this._boxW - 24 },
      lineSpacing: 4,
    }).setScrollFactor(0).setDepth(201).setVisible(false);

    // Continue indicator
    this.continueText = this.add.text(this._boxX + this._boxW - 14, this._boxY + this._boxH - 14, '▼', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#94a1b2'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(202).setVisible(false);
    // Pulse the continue indicator
    this.tweens.add({
      targets: this.continueText,
      alpha: { from: 0.3, to: 1 },
      yoyo: true, repeat: -1, duration: 600
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
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#b0bec5',
          backgroundColor: '#263238',
          padding: { x: 6, y: 3 },
        }
      )
        .setScrollFactor(0)
        .setDepth(202)
        .setVisible(false)
        .setInteractive({ useHandCursor: true });

      // Hover effects
      btn.on('pointerover', () => {
        btn.setColor('#ffeb3b');
        btn.setBackgroundColor('#37474f');
      });
      btn.on('pointerout', () => {
        btn.setColor('#b0bec5');
        btn.setBackgroundColor('#263238');
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
  }

  /* ══════════ Public API ══════════ */

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
    if (!node) { this._closeDialogue(); return; }

    // Show panel elements
    this.dialogBg.setVisible(true);
    this.dialogBorder.setVisible(true);
    const lang = this.registry.get('lang') || 'id';
    const speakerName = (typeof node.speaker === 'object' ? node.speaker[lang] : node.speaker) || '';
    const textStr = (typeof node.text === 'object' ? node.text[lang] : node.text) || '';
    
    this.speakerTxt.setVisible(true).setText(speakerName.toUpperCase());
    this.dialogText.setVisible(true).setText(textStr);

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
          .setColor('#b0bec5')
          .setBackgroundColor('#263238');

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
      // Also advance on E or Space
      this.input.keyboard.once('keydown-E', () => {
        this.dialogBg.disableInteractive();
        this._showNode(node.next);
      });
      this.input.keyboard.once('keydown-SPACE', () => {
        this.dialogBg.disableInteractive();
        this._showNode(node.next);
      });
    } else {
      // End of dialogue — click or press key to close
      this.continueText.setVisible(true);
      this.dialogBg.setInteractive();
      this.dialogBg.once('pointerdown', () => this._closeDialogue());
      this.input.keyboard.once('keydown-E', () => this._closeDialogue());
      this.input.keyboard.once('keydown-SPACE', () => this._closeDialogue());
    }
  }

  _selectOption(ch) {
    const cur = this.registry.get('harmony');
    this.registry.set('harmony', Phaser.Math.Clamp(cur + (ch.harmonyDelta || 0), 0, 100));
    if (ch.next) {
      this._showNode(ch.next);
    } else {
      this._closeDialogue();
    }
  }

  _closeDialogue() {
    this.dialogBg.setVisible(false).disableInteractive();
    this.dialogBorder.setVisible(false);
    this.speakerTxt.setVisible(false);
    this.dialogText.setVisible(false);
    this.continueText.setVisible(false);
    this.optionButtons.forEach(btn => btn.setVisible(false).removeAllListeners('pointerdown'));
    this.input.keyboard.removeAllListeners('keydown');
    this.registry.set('dialogueActive', false);
  }

  /* ══════════ HUD Refresh Methods ══════════ */

  _refreshHarmony() {
    const val = this.registry.get('harmony');
    const pct = val / 100;
    // Animate bar width
    this.tweens.add({
      targets: this.harmonyBar,
      width: 186 * pct,
      duration: 400,
      ease: 'Power2'
    });
    // Color based on value
    if (pct > 0.6) {
      this.harmonyBar.fillColor = 0x2cb67d;   // green
    } else if (pct > 0.3) {
      this.harmonyBar.fillColor = 0xfacc15;   // yellow
    } else {
      this.harmonyBar.fillColor = 0xef4444;   // red
    }
    this.harmonyTxt.setText(`${val} / 100`);
  }

  _flashHarmonyChange(delta) {
    if (delta === 0) return;
    const isPositive = delta > 0;
    this.harmonyFlash.setText(isPositive ? `+${delta}` : `${delta}`);
    this.harmonyFlash.setColor(isPositive ? '#2cb67d' : '#ef4444');
    this.harmonyFlash.setAlpha(1);
    this.tweens.add({
      targets: this.harmonyFlash,
      alpha: 0,
      y: this.harmonyFlash.y - 15,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => {
        this.harmonyFlash.setY(20);
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
    if (this.closeSidebarBtnObj) this.closeSidebarBtnObj.txt.setText(lang === 'en' ? 'Back' : 'Kembali');
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
