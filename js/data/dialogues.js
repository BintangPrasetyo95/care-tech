/* ───────────── data / dialogues.js ─────────────
   All dialogue trees stored as plain objects.
   Each node has `speaker`, `text`, optional `choices`,
   and optional `next` (auto-advance).

   Choices carry `harmonyDelta` so the dialogue system can
   update the global Harmony Index on selection.
   ────────────────────────────────────────────── */

const DIALOGUES = {

  /* ══════════ Level 1 — Detective Emotion (School Garden) ══════════ */

  nakula_intro: {
    speaker : 'Nakula',
    portrait: 'nakula_happy',
    text    : 'Hey, look — Nabula is sitting alone over there on that bench. She seems… off. What do you think?',
    choices : [
      { label: 'A) It seems like Nabula is sad…',       next: 'nabula_sad_ack',   harmonyDelta:  10 },
      { label: 'B) Maybe she just wants to be alone.',   next: 'nabula_alone_ack', harmonyDelta:   0 },
      { label: 'C) I don\'t really care.',               next: 'nabula_ignore',    harmonyDelta:  -5 },
      { label: 'D) Let\'s go talk to her right now!',    next: 'nabula_eager',     harmonyDelta:   5 }
    ]
  },

  nabula_sad_ack: {
    speaker : 'Nabula',
    portrait: 'nabula_smile',
    text    : '… you noticed? That… actually means a lot. Thank you.',
    next    : 'nakula_impressed'
  },

  nakula_impressed: {
    speaker : 'Nakula',
    portrait: 'nakula_happy',
    text    : 'See? Sometimes just noticing someone\'s feelings is the first step. Nice one.',
    next    : null
  },

  nabula_alone_ack: {
    speaker : 'Nabula',
    portrait: 'nabula_neutral',
    text    : '… yeah, I guess. Everyone needs space sometimes.',
    next    : 'nakula_hmm'
  },

  nakula_hmm: {
    speaker : 'Nakula',
    portrait: 'nakula_neutral',
    text    : 'Hmm… I wonder if that\'s really what\'s going on though.',
    next    : null
  },

  nabula_ignore: {
    speaker : 'Nakula',
    portrait: 'nakula_sad',
    text    : 'Come on… we should at least check on her. What if something\'s wrong?',
    next    : null
  },

  nabula_eager: {
    speaker : 'Nabula',
    portrait: 'nabula_surprised',
    text    : 'Oh! Hi… I wasn\'t expecting anyone to come over. That\'s… nice of you.',
    next    : 'nakula_smiles'
  },

  nakula_smiles: {
    speaker : 'Nakula',
    portrait: 'nakula_happy',
    text    : 'That\'s the spirit! Being proactive about reaching out matters.',
    next    : null
  },

  /* ══════════ Level 2 — Empathy Rescue (Corridor & Library) ══════════ */

  bully_taunt: {
    speaker : 'Bully NPC',
    portrait: 'bully_smirk',
    text    : 'Ha ha, look at Nabula — pretending she doesn\'t hear us! What a joke.',
    next    : 'bully_taunt_2'
  },

  bully_taunt_2: {
    speaker : 'Bully NPC',
    portrait: 'bully_smirk',
    text    : 'Hey Nabula! Why so quiet? Cat got your tongue? Hahaha!',
    next    : 'nabula_runs'
  },

  nabula_runs: {
    speaker : '',
    portrait: null,
    text    : '[ Nabula lowers her head and runs toward the back of the library… ]',
    next    : 'narrator_find_her'
  },

  narrator_find_her: {
    speaker : '',
    portrait: null,
    text    : '[ You should find Nabula. She went behind the library — head through the corridor. ]',
    next    : null
  },

  nabula_found: {
    speaker : 'Player',
    portrait: 'player_neutral',
    text    : 'Nabula? I found you. Are you okay?',
    choices : [
      { label: 'A) Do you want to talk about it?',       next: 'nabula_open',   harmonyDelta:  15 },
      { label: 'B) You should stand up for yourself.',    next: 'nabula_shrug',  harmonyDelta:   0 },
      { label: 'C) Just ignore them, it\'ll pass.',       next: 'nabula_sad2',   harmonyDelta:  -5 }
    ]
  },

  nabula_open: {
    speaker : 'Nabula',
    portrait: 'nabula_smile',
    text    : '… I\'d like that. Thank you for coming to find me. It means more than you know.',
    next    : 'nabula_open_2'
  },

  nabula_open_2: {
    speaker : 'Nabula',
    portrait: 'nabula_neutral',
    text    : 'Sometimes I feel like nobody sees what\'s happening… but you did.',
    next    : null
  },

  nabula_shrug: {
    speaker : 'Nabula',
    portrait: 'nabula_neutral',
    text    : 'It\'s… not that easy. You don\'t know what it\'s like when everyone just watches.',
    next    : 'nabula_shrug_2'
  },

  nabula_shrug_2: {
    speaker : 'Nabula',
    portrait: 'nabula_sad',
    text    : 'But… thanks for at least coming to check on me.',
    next    : null
  },

  nabula_sad2: {
    speaker : 'Nabula',
    portrait: 'nabula_sad',
    text    : '… yeah… I\'ll try. It just… doesn\'t feel like it ever stops.',
    next    : null
  },

  /* ══════════ Generic NPC Interactions ══════════ */

  student_chat_1: {
    speaker : 'Student',
    portrait: 'student_neutral',
    text    : 'Hey! Have you checked the bulletin board in the corridor? There\'s something interesting posted.',
    next    : null
  },

  student_chat_2: {
    speaker : 'Student',
    portrait: 'student_neutral',
    text    : 'Harmonia School feels different lately… I hope things get better.',
    next    : null
  },

  rani_intro: {
    speaker : 'Teacher Rani',
    portrait: 'rani_neutral',
    text    : 'Hello there. Remember — if you see anything concerning, don\'t hesitate to tell a teacher.',
    next    : 'rani_intro_2'
  },

  rani_intro_2: {
    speaker : 'Teacher Rani',
    portrait: 'rani_neutral',
    text    : 'We all have a role to play in making this school a safe place.',
    next    : null
  },

  riko_corridor: {
    speaker : 'Riko',
    portrait: 'riko_neutral',
    text    : '… what are you looking at? Mind your own business.',
    next    : null
  },

  /* ══════════ Object Interactions ══════════ */

  board_interact: {
    speaker : '',
    portrait: null,
    text    : '[ A bulletin board. It reads: "Harmonia School Values — Respect, Empathy, Kindness." ]',
    next    : null
  },

  desk_interact: {
    speaker : '',
    portrait: null,
    text    : '[ A neat classroom desk. Textbooks and pencils are arranged carefully. ]',
    next    : null
  }
};
