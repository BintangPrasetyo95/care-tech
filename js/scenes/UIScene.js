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
    this.add.text(18, 11, '♥ HARMONY', {
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

    /* ══════════ Map Name (top-center) ══════════ */
    this.mapNameTxt = this.add.text(width / 2, 20, '', {
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      fontSize: '11px',
      fontStyle: 'bold',
      color: '#7f5af0',
      letterSpacing: 2
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    /* ══════════ Interaction Prompt ══════════ */
    this.interactPrompt = this.add.text(width / 2, height - 130, '[ Press E to interact ]', {
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
      .setStrokeStyle(2, 0x7c4dff)
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    // Speaker name
    this.speakerTxt = this.add.text(this._boxX + 10, this._boxY + 6, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#b388ff',
      fontStyle: 'bold',
    }).setScrollFactor(0).setDepth(201).setVisible(false);

    // Accent border at top of dialog
    this.dialogBorder = this.add.rectangle(
      this._boxX + 10, this._boxY + 22, this._boxW - 20, 1, 0x7c4dff, 0.4
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
    const optStartY = this._boxY + 76;
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
    const node = DIALOGUES[nodeId];
    if (!node) { this._closeDialogue(); return; }

    // Show panel elements
    this.dialogBg.setVisible(true);
    this.dialogBorder.setVisible(true);
    this.speakerTxt.setVisible(true).setText((node.speaker || '').toUpperCase());
    this.dialogText.setVisible(true).setText(node.text);

    // ── Render option buttons INSIDE the box ────────
    const choices = node.choices || [];
    const optStartY = this._boxY + 76;
    const optSpacing = 18;

    for (let i = 0; i < this.optionButtons.length; i++) {
      const btn = this.optionButtons[i];
      btn.removeAllListeners('pointerdown');

      if (i < choices.length) {
        const ch = choices[i];
        btn
          .setText(`[${i + 1}] ${ch.label}`)
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

  _refreshMapName() {
    const mapKey = this.registry.get('currentMap');
    const names = {
      garden:     '🌿 SCHOOL GARDEN',
      corridor:   '🏫 CORRIDOR',
      classroom:  '📚 CLASSROOM',
      auditorium: '🎭 AUDITORIUM',
      cafeteria:  '🍽️ CAFETERIA'
    };
    this.mapNameTxt.setText(names[mapKey] || mapKey.toUpperCase());
  }
}
