/* ───────────── systems / DialogueManager.js ─────────────
   Handles dialogue logic — condition evaluation, flag-gated
   branches, and dialogue availability checks.
   
   Currently the UIScene handles display directly. As dialogue
   logic grows (conditions, variable checks, complex branching),
   this manager centralises those checks.
   ──────────────────────────────────────────────────────── */

class DialogueManager {
  /**
   * @param {Phaser.Scene} scene
   * @param {RelationshipManager} [relationshipMgr]
   */
  constructor(scene, relationshipMgr) {
    this.scene = scene;
    this.relationships = relationshipMgr || null;
  }

  /** Check whether a dialogue node exists and its preconditions are met. */
  canShow(nodeId) {
    const node = DIALOGUES[nodeId];
    if (!node) return false;

    // Future: check node.requires flags via this.relationships
    // e.g. if (node.requires && !this.relationships.getFlag(node.requires)) return false;

    return true;
  }

  /** Get the dialogue node data */
  getNode(nodeId) {
    return DIALOGUES[nodeId] || null;
  }
}
