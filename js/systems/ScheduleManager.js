/* ───────────── systems / ScheduleManager.js ─────────────
   Drives NPC daily-schedule movement (Stardew-style).
   Each NPC can have a list of waypoints keyed by in-game time.
   
   Schedule format per NPC:
   [
     { time: 540, x: 5, y: 7 },   // 09:00 — move to tile (5,7)
     { time: 600, x: 10, y: 3 }   // 10:00 — move to tile (10,3)
   ]
   ──────────────────────────────────────────────────────── */

class ScheduleManager {
  /**
   * @param {Phaser.Scene}  scene
   * @param {NPC[]}         npcs
   */
  constructor(scene, npcs) {
    this.scene = scene;
    this.npcs  = npcs;
  }

  /** Call once per clock tick. Moves NPCs to their scheduled position. */
  tick(currentTime) {
    for (const npc of this.npcs) {
      if (!npc.schedule) continue;
      const wp = npc.schedule.find(s => s.time === currentTime);
      if (wp) {
        // Instant teleport for now — smooth tweened movement in Phase 4
        npc.sprite.setPosition(wp.x * TILE + TILE / 2, wp.y * TILE + TILE / 2);
      }
    }
  }

  /** Add or replace an NPC's schedule */
  setSchedule(npc, schedule) {
    npc.schedule = schedule;
  }
}
