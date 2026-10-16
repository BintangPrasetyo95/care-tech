/* ───────────── systems / ActionExecutor.js ─────────────
   CARE-TECH: Harmonia School
   Universal Data-Driven Action & Cutscene Interpreter.
   
   Executes atomic actions (camera pan, actor movement,
   animation, flag changes, quest triggers, vibrations)
   in sequence or individually, decoupling narrative data
   from scene implementation.
   ──────────────────────────────────────────────────────── */

class ActionExecutor {
  /**
   * @param {Phaser.Scene} scene - Reference to WorldScene
   */
  constructor(scene) {
    this.scene = scene;
    this.customHandlers = new Map();
  }

  /**
   * Register a custom action handler for special gameplay events
   * @param {string} type
   * @param {Function} handler
   */
  registerHandler(type, handler) {
    this.customHandlers.set(type, handler);
  }

  /**
   * Execute a sequence of atomic action objects sequentially
   * @param {Array<Object|string>} steps
   * @returns {Promise<void>}
   */
  async executeSequence(steps) {
    if (!Array.isArray(steps)) return;
    for (const step of steps) {
      await this.executeAction(step);
    }
  }

  /**
   * Execute a single action (object or backward-compatible string)
   * @param {Object|string} action
   * @returns {Promise<void>}
   */
  async executeAction(action) {
    if (!action) return;

    // Backward-compatible string action
    if (typeof action === 'string') {
      return this._executeLegacyStringAction(action);
    }

    const { type } = action;

    // Check custom handlers first
    if (this.customHandlers.has(type)) {
      return this.customHandlers.get(type)(action, this.scene);
    }

    switch (type) {
      case 'player_lock':
        return this._actionPlayerLock(action);

      case 'camera_pan':
        return this._actionCameraPan(action);

      case 'camera_follow':
        return this._actionCameraFollow(action);

      case 'camera_fade':
        return this._actionCameraFade(action);

      case 'actor_walk':
        return this._actionActorWalk(action);

      case 'actor_anim':
        return this._actionActorAnim(action);

      case 'mod_harmony':
        return this._actionModHarmony(action);

      case 'set_flag':
        return this._actionSetFlag(action);

      case 'start_dialogue':
        return this._actionStartDialogue(action);

      case 'start_quest':
        return this._actionStartQuest(action);

      case 'vibrate':
        return this._actionVibrate(action);

      case 'delay':
        return this._actionDelay(action);

      default:
        console.warn(`[ActionExecutor] Unknown action type: '${type}'`, action);
    }
  }

  /* ───────────── Atomic Action Implementations ───────────── */

  _resolveActor(actorKey) {
    if (!actorKey || actorKey === 'player' || actorKey === 'nakula') {
      return this.scene.player;
    }
    return this.scene.npcs.find(n => n.key === actorKey) || null;
  }

  _actionPlayerLock(action) {
    const lock = !!action.value;
    const level = window.GameState?.currentLevel || 1;
    this.scene.registry.set(`level${level}_player_locked`, lock);
    if (this.scene.player) {
      this.scene.player.isLocked = lock;
      if (lock && this.scene.player.sprite && this.scene.player.sprite.body) {
        this.scene.player.sprite.setVelocity(0, 0);
      }
    }
  }

  _actionCameraPan(action) {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      cam.stopFollow();
      this.scene.tweens.killTweensOf(cam);

      let targetX = cam.midPoint ? cam.midPoint.x : cam.scrollX;
      let targetY = cam.midPoint ? cam.midPoint.y : cam.scrollY;

      if (action.target) {
        const actor = this._resolveActor(action.target);
        if (actor && actor.sprite) {
          targetX = actor.sprite.x;
          targetY = actor.sprite.y;
        } else if (typeof action.target.x === 'number') {
          const TILE = window.TILE || 64;
          targetX = action.target.isTile ? (action.target.x * TILE + TILE / 2) : action.target.x;
          targetY = action.target.isTile ? (action.target.y * TILE + TILE / 2) : action.target.y;
        }
      }

      const duration = action.duration || 800;
      const ease = action.ease || 'Sine.easeInOut';

      let completed = false;
      const finish = () => {
        if (completed) return;
        completed = true;
        if (action.followAfter) {
          const actor = this._resolveActor(action.followAfter);
          if (actor && actor.sprite) {
            cam.startFollow(actor.sprite, true, 1, 1);
          }
        }
        resolve();
      };

      if (duration <= 0) {
        cam.centerOn(targetX, targetY);
        finish();
        return;
      }

      cam.pan(targetX, targetY, duration, ease, true, (camera, progress) => {
        if (progress >= 1) {
          finish();
        }
      });
    });
  }

  _actionCameraFollow(action) {
    const cam = this.scene.cameras.main;
    this.scene.tweens.killTweensOf(cam);
    const actor = this._resolveActor(action.target);
    if (actor && actor.sprite) {
      const lx = action.lerpX || 0.08;
      const ly = action.lerpY || 0.08;
      cam.startFollow(actor.sprite, true, lx, ly);
    }
  }

  _actionCameraFade(action) {
    return new Promise((resolve) => {
      const cam = this.scene.cameras.main;
      const duration = action.duration || 800;
      const r = action.r || 0;
      const g = action.g || 0;
      const b = action.b || 0;

      if (action.direction === 'in') {
        cam.fadeIn(duration, r, g, b);
      } else {
        cam.fadeOut(duration, r, g, b);
      }
      this.scene.time.delayedCall(duration, resolve);
    });
  }

  _actionActorWalk(action) {
    return new Promise((resolve) => {
      const actor = this._resolveActor(action.actor);
      if (!actor || !actor.sprite) {
        return resolve();
      }

      const sprite = actor.sprite;
      const TILE = window.TILE || 64;
      let targetX = sprite.x;
      let targetY = sprite.y;

      if (action.targetNpc) {
        const destNpc = this._resolveActor(action.targetNpc);
        if (destNpc && destNpc.sprite) {
          targetX = destNpc.sprite.x + (action.offsetX || 0);
          targetY = destNpc.sprite.y + (action.offsetY || 0);
        }
      } else if (action.targetPos) {
        targetX = action.targetPos.isTile ? action.targetPos.x * TILE : action.targetPos.x;
        targetY = action.targetPos.isTile ? action.targetPos.y * TILE : action.targetPos.y;
      }

      // Cutscene movement setup
      if (actor === this.scene.player) {
        actor.isCutsceneActive = true;
        if (sprite.body) sprite.body.enable = false;
      }

      // Direction and walk animation
      const dx = targetX - sprite.x;
      const keyPrefix = (actor === this.scene.player) ? 'player' : actor.key;
      if (Math.abs(dx) > 10) {
        actor.facing = dx < 0 ? 'left' : 'right';
        sprite.setFlipX(dx < 0);
        sprite.anims.play(`${keyPrefix}_walk_${actor.facing}`, true);
      }

      const duration = action.duration || 2000;
      const ease = action.ease || 'Linear';

      this.scene.tweens.add({
        targets: sprite,
        x: targetX,
        y: targetY,
        duration: duration,
        ease: ease,
        onComplete: () => {
          if (actor === this.scene.player) {
            actor.isCutsceneActive = false;
            if (sprite.body) {
              sprite.body.enable = true;
              sprite.body.reset(targetX, targetY);
            }
          }
          if (action.endFacing) {
            actor.facing = action.endFacing;
            sprite.setFlipX(action.endFacing === 'left');
          }
          sprite.anims.play(`${keyPrefix}_idle_${actor.facing}`, true);
          resolve();
        }
      });
    });
  }

  _actionActorAnim(action) {
    const actor = this._resolveActor(action.actor);
    if (!actor || !actor.sprite) return;
    if (typeof action.flipX === 'boolean') {
      actor.sprite.setFlipX(action.flipX);
    }
    if (action.anim) {
      actor.sprite.anims.play(action.anim, true);
    }
  }

  _actionModHarmony(action) {
    const delta = action.value || 0;
    if (window.GameState) {
      window.GameState.modHarmony(delta);
    } else {
      const curr = this.scene.registry.get('harmony') || 50;
      this.scene.registry.set('harmony', Math.max(0, Math.min(100, curr + delta)));
    }
  }

  _actionSetFlag(action) {
    if (window.GameState) {
      window.GameState.setFlag(action.key, action.value ?? true);
    } else {
      this.scene.registry.set(action.key, action.value ?? true);
    }
  }

  _actionStartDialogue(action) {
    const ui = this.scene.scene.get('UI');
    if (ui && ui.startDialogue) {
      ui.startDialogue(action.dialogueId);
    }
  }

  _actionStartQuest(action) {
    const ui = this.scene.scene.get('UI');
    if (ui && ui.showQuest) {
      ui.showQuest(action.text, {
        hasTimer: !!action.hasTimer,
        durationSec: action.durationSec || 30,
        onTimeout: action.onTimeout
      });
    }
    if (window.GameState) {
      window.GameState.setActiveQuest(action.questId || action.text);
    }
  }

  _actionVibrate(action) {
    if (navigator.vibrate) {
      navigator.vibrate(action.pattern || 60);
    }
  }

  _actionDelay(action) {
    return new Promise((resolve) => {
      this.scene.time.delayedCall(action.ms || 500, resolve);
    });
  }

  /* ───────────── Backward Compatibility Fallback ───────────── */
  _executeLegacyStringAction(actionName) {
    // If the scene has a legacy handler, forward it
    if (this.scene && this.scene._handleLegacyAction) {
      return this.scene._handleLegacyAction(actionName);
    }
    // Or emit to registry event so old WorldScene listener can catch it
    this.scene.registry.events.emit('legacy_dialogue_action', actionName);
  }
}

window.ActionExecutor = ActionExecutor;
