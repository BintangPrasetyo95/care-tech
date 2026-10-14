/* ───────────── data / dialogues.js ─────────────
   CARE-TECH: Harmonia School
   Global Dialogues Registry & Ambient Interactions.
   
   Level-specific story dialogues are loaded modularly from:
   js/data/levels/level<X>/dialogues.js
   
   Legacy dialogues archive: js/data/dialogues_legacy.js
   ─────────────────────────────────────────────────────────────── */

window.DIALOGUES = window.DIALOGUES || {};
var DIALOGUES = window.DIALOGUES;

// Auto-merge modular level dialogues if loaded
if (window.LEVEL_1_DIALOGUES) {
  Object.assign(DIALOGUES, window.LEVEL_1_DIALOGUES);
}

// Global Ambient & Campus Environmental Interactions
Object.assign(DIALOGUES, {

  /* ══════════ Generic Student & Faculty Interactions ══════════ */

  student_chat_1: {
    speaker : { en: 'Student', id: 'Siswa' },
    portrait: 'student_neutral',
    text    : { 
      en: 'Hey! Have you checked the bulletin board in the corridor? There\'s something interesting posted.', 
      id: 'Hei! Sudahkah kamu memeriksa papan pengumuman di lorong? Ada sesuatu yang menarik.' 
    },
    next    : null
  },

  student_chat_2: {
    speaker : { en: 'Student', id: 'Siswa' },
    portrait: 'student_neutral',
    text    : { 
      en: 'Harmonia School feels different lately… I hope things get better.', 
      id: 'Sekolah Harmonia terasa berbeda akhir-akhir ini… Kuharap semuanya membaik.' 
    },
    next    : null
  },

  peer_supporter_chat: {
    speaker : { en: 'Peer Supporter', id: 'Konselor Sebaya' },
    portrait: 'student_neutral',
    text    : { 
      en: 'Hi there! We are here to listen if you or anyone else needs to talk about bullying, stress, or anything at all. You are not alone!', 
      id: 'Hai! Kami di sini untuk mendengarkan jika kamu atau siapa pun butuh teman bicara soal perundungan, stres, atau apa pun. Kamu tidak sendirian!' 
    },
    next    : null
  },

  rani_intro: {
    speaker : { en: 'Teacher Rani', id: 'Bu Rani' },
    portrait: 'rani_neutral',
    text    : { 
      en: 'Hello there. Remember — if you see anything concerning, don\'t hesitate to tell a teacher.', 
      id: 'Halo. Ingat — jika kalian melihat sesuatu yang mengkhawatirkan, jangan ragu untuk melapor.' 
    },
    next    : 'rani_intro_2'
  },

  rani_intro_2: {
    speaker : { en: 'Teacher Rani', id: 'Bu Rani' },
    portrait: 'rani_neutral',
    text    : { 
      en: 'We all have a role to play in making this school a safe place.', 
      id: 'Kita semua punya peran untuk menjadikan sekolah ini tempat yang aman.' 
    },
    next    : null
  },

  riko_corridor: {
    speaker : { en: 'Riko', id: 'Riko' },
    portrait: 'riko_neutral',
    text    : { 
      en: '… what are you looking at? Mind your own business.', 
      id: '… apa lihat-lihat? Urus saja urusanmu sendiri.' 
    },
    next    : null
  },

  /* ══════════ Campus Interactive Objects ══════════ */

  board_interact: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { 
      en: '[ A bulletin board. It reads: "Harmonia School Values — Respect, Empathy, Kindness." ]', 
      id: '[ Papan pengumuman. Bertuliskan: "Nilai Sekolah Harmonia — Rasa Hormat, Empati, Kebaikan." ]' 
    },
    next    : null
  },

  desk_interact: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { 
      en: '[ A neat classroom desk. Textbooks and pencils are arranged carefully. ]', 
      id: '[ Meja kelas yang rapi. Buku pelajaran dan pensil tersusun rapi. ]' 
    },
    next    : null
  },

  bully_taunt: {
    speaker : { en: 'Bully', id: 'Perundung' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Ha ha, look at Nabula — pretending she doesn\'t hear us! What a joke.', 
      id: 'Ha ha, lihat Nabula — pura-pura tidak dengar kita! Lelucon macam apa ini.' 
    },
    next    : 'bully_taunt_2'
  },

  bully_taunt_2: {
    speaker : { en: 'Bully', id: 'Perundung' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Hey Nabula! Why so quiet? Cat got your tongue? Hahaha!', 
      id: 'Hei Nabula! Kenapa diam saja? Kucing makan lidahmu? Hahaha!' 
    },
    next    : null
  },

  librarian_chat: {
    speaker : { en: 'Mrs. Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text    : { 
      en: 'Welcome to Harmonia Library! Please keep your voice down so everyone can read in peace.', 
      id: 'Selamat datang di Perpustakaan Harmonia! Harap tenang agar semua orang dapat membaca dengan nyaman.' 
    },
    next    : null
  }
});
