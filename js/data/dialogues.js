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

  /* ══════════ Level 2 — Empathy Rescue (Corridor & Library) ══════════ */

  bully_taunt: {
    speaker : { en: 'Bully 1', id: 'Perundung 1' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Ha ha ha! Look at Nabula — staring at the floor like she\'s completely lost!', 
      id: 'Ha ha ha! Lihat nih si Nabula — jalan nunduk terus kayak orang hilang arah!' 
    },
    next    : 'bully_taunt_2'
  },

  bully_taunt_2: {
    speaker : { en: 'Bully 2', id: 'Perundung 2' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Why so quiet? Can\'t even look people in the eye! Did you mess up another group project? Hahaha!', 
      id: 'Kenapa diam aja? Dari kemarin nggak berani natap orang! Apa tugas kelompok kemarin juga berantakan gara-gara kamu? Hahaha!' 
    },
    next    : 'nabula_corridor_plea'
  },

  nabula_corridor_plea: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { 
      en: 'P-please stop... get out of my way... just let me through...', 
      id: 'H-hentikan... jangan halangi jalan... tolong biarkan aku lewat...' 
    },
    next    : 'bully_taunt_3'
  },

  bully_taunt_3: {
    speaker : { en: 'Bully 1', id: 'Perundung 1' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Through? Who are you to tell us to move?! You don\'t own this hallway!', 
      id: 'Lewat? Siapa kamu berani nyuruh-nyuruh kita minggir?! Lorong ini bukan punya nenek moyangmu!' 
    },
    next    : 'corridor_breakthrough'
  },

  corridor_breakthrough: {
    speaker : { en: 'Narrator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: '[ Nabula clenches her fists, pushes past the gap between them, and bolts out through the doors into the schoolyard toward the library! ]', 
      id: '[ Nabula menggertakkan gigi, memberanikan diri menerobos celah di antara mereka, dan lari keluar menuju lapangan sekolah ke arah perpustakaan! ]' 
    },
    next    : 'bully_taunt_after',
    action  : 'corridor_nabula_escape'
  },

  bully_taunt_after: {
    speaker : { en: 'Bully 1', id: 'Perundung 1' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Hey! Running away to the yard already?! Guess she\'s hiding in the library corner again like always!', 
      id: 'Woi! Baru digituin aja udah kabur ke lapangan! Palingan sembunyi lagi di pojokan perpustakaan kayak biasa!' 
    },
    action  : 'corridor_camera_return_nakula',
    next    : 'corridor_eca_react',
    onCloseAction: 'lvl2_quest_find_nabula'
  },

  corridor_eca_react: {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text    : { 
      en: 'Nakula! Did you see that?! Nabula was so overwhelmed she ran out into the schoolyard toward the library. Let\'s go after her through the library\'s main entrance across the yard!', 
      id: 'Nakula! Kamu lihat itu kan?! Nabula sampai lari keluar ke lapangan menuju perpustakaan. Ayo cepat kita susul dia lewat pintu utama perpustakaan di seberang lapangan!' 
    },
    next    : null,
    onCloseAction: 'lvl2_quest_find_nabula'
  },

  bully_idle_1: {
    speaker : { en: 'Bully 1', id: 'Perundung 1' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'What are you staring at? You want to interfere too? Mind your own business!', 
      id: 'Ngapain kamu lihat-lihat? Mau ikut campur urusan orang lain juga? Urus saja dirimu sendiri!' 
    },
    next    : null
  },

  bully_idle_2: {
    speaker : { en: 'Bully 2', id: 'Perundung 2' },
    portrait: 'bully_smirk',
    text    : { 
      en: 'Better walk away before you get in trouble too, kid.', 
      id: 'Mending kamu pergi sebelum ikutan kena masalah.' 
    },
    next    : null
  },

  nabula_runs: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ Nabula lowers her head and runs through the corridor into the library… ]', id: '[ Nabula menundukkan kepala dan lari menyusuri lorong menuju perpustakaan… ]' },
    next    : 'narrator_find_her',
    action  : 'corridor_nabula_escape'
  },

  narrator_find_her: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ Follow Nabula! She ran into the back of the library. ]', id: '[ Ikuti Nabula! Dia lari ke bagian belakang perpustakaan. ]' },
    next    : null,
    onCloseAction: 'lvl2_quest_find_nabula'
  },

  nabula_found: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text    : { en: 'Nabula? I found you. Are you okay?', id: 'Nabula? Aku menemukanmu. Kamu baik-baik saja?' },
    choices : [
      { label: { en: 'Do you want to talk about it?', id: 'Apakah kamu ingin membicarakannya?' },       next: 'nabula_open',   harmonyDelta:  15, action: 'nabula_smile_anim' },
      { label: { en: 'You should stand up for yourself.', id: 'Kamu harus membela dirimu sendiri.' },    next: 'nabula_shrug',  harmonyDelta:   0 },
      { label: { en: 'Just ignore them, it\'ll pass.', id: 'Abaikan saja mereka, nanti juga lewat.' },       next: 'nabula_sad2',   harmonyDelta:  -5 }
    ]
  },

  nabula_open: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_smile',
    text    : { en: '… I\'d like that. Thank you for coming to find me. It means more than you know.', id: '… Aku mau. Terima kasih sudah mencariku. Ini sangat berarti.' },
    next    : 'nabula_open_2'
  },

  nabula_open_2: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_neutral',
    text    : { en: 'Sometimes I feel like nobody sees what\'s happening… but you did.', id: 'Terkadang aku merasa tidak ada yang melihat apa yang terjadi… tapi kamu melihatnya.' },
    next    : null,
    action  : 'complete_level2'
  },

  nabula_shrug: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_neutral',
    text    : { en: 'It\'s… not that easy. You don\'t know what it\'s like when everyone just watches.', id: 'Itu… tidak semudah itu. Kamu tidak tahu rasanya saat semua orang hanya menonton.' },
    next    : 'nabula_shrug_2'
  },

  nabula_shrug_2: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { en: 'But… thanks for at least coming to check on me.', id: 'Tapi… terima kasih karena setidaknya sudah mengecek keadaanku.' },
    next    : null,
    action  : 'complete_level2'
  },

  nabula_sad2: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { en: '… yeah… I\'ll try. It just… doesn\'t feel like it ever stops.', id: '… ya… Aku akan coba. Hanya saja… rasanya ini tidak pernah berhenti.' },
    next    : null,
    action  : 'complete_level2'
  },

  nabula_safe: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_smile',
    text    : { en: 'I feel a bit safer in here near the teacher... thanks for earlier.', id: 'Aku merasa sedikit lebih aman di sini dekat guru... terima kasih untuk sebelumnya.' },
    next    : null
  },

  /* ══════════ Level 3 — Mystery Case (Classroom) ══════════ */

  evidence_phone: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ An abandoned smartphone. The screen shows a group chat laughing about Nabula... ]', id: '[ Sebuah ponsel yang tertinggal. Layarnya menampilkan obrolan grup yang menertawakan Nabula... ]' },
    next    : 'evidence_phone_2'
  },
  evidence_phone_2: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text    : { en: 'This is horrible... I need to remember this.', id: 'Ini mengerikan... Aku harus mengingat ini.' },
    next    : null,
    action  : 'found_evidence_phone'
  },

  witness_intro: {
    speaker : { en: 'Classmate', id: 'Teman Sekelas' },
    portrait: 'student_neutral',
    text    : { en: 'Hey, did you see what happened in the corridor?', id: 'Hei, kamu lihat apa yang terjadi di lorong?' },
    choices : [
      { label: { en: 'Who started it?', id: 'Siapa yang memulainya?' }, next: 'witness_ask_who', harmonyDelta: 0 }
    ]
  },
  witness_ask_who: {
    speaker : { en: 'Classmate', id: 'Teman Sekelas' },
    portrait: 'student_neutral',
    text    : { en: 'It was Riko. He brought his friends to corner Nabula.', id: 'Itu Riko. Dia membawa teman-temannya untuk memojokkan Nabula.' },
    next    : 'witness_end'
  },
  witness_end: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text    : { en: 'Okay, I should report this properly.', id: 'Oke, aku harus melaporkan ini dengan benar.' },
    next    : null,
    action  : 'found_evidence_witness'
  },

  rani_report_ready: {
    speaker : { en: 'Teacher Rani', id: 'Bu Rani' },
    portrait: 'rani_neutral',
    text    : { en: 'Nakula, you look concerned. What happened?', id: 'Nakula, kamu terlihat khawatir. Apa yang terjadi?' },
    choices : [
      { label: { en: 'Riko and his friends are bullying Nabula.', id: 'Riko dan teman-temannya merundung Nabula.' }, next: 'rani_report_good', harmonyDelta: 20 },
      { label: { en: 'Nothing, just wanted to say hi.', id: 'Tidak ada apa-apa, hanya ingin menyapa.' }, next: 'rani_intro', harmonyDelta: 0 }
    ]
  },
  rani_report_good: {
    speaker : { en: 'Teacher Rani', id: 'Bu Rani' },
    portrait: 'rani_neutral',
    text    : { en: 'Thank you for telling me. I will handle this immediately and talk to Riko.', id: 'Terima kasih sudah memberitahuku. Ibu akan segera menanganinya dan bicara dengan Riko.' },
    next    : null,
    action  : 'complete_level3'
  },

  /* ══════════ Level 4 — Harmony Builder (Auditorium) ══════════ */

  board_initiative_intro: {
    speaker : { en: 'Student Council', id: 'OSIS' },
    portrait: null,
    text    : { en: '[ Choose an initiative to build in the school to improve student harmony! ]', id: '[ Pilih inisiatif untuk dibangun di sekolah untuk meningkatkan kerukunan siswa! ]' },
    choices : [
      { label: { en: 'Build a "Vent Corner"', id: 'Bangun "Pojok Curhat"' }, next: 'board_initiative_done', harmonyDelta: 10, action: 'build_vent_corner' },
      { label: { en: 'Build an "Appreciation Box"', id: 'Bangun "Kotak Apresiasi"' }, next: 'board_initiative_done', harmonyDelta: 15, action: 'build_appreciation_box' },
      { label: { en: 'Start a "Peer Support Program"', id: 'Mulai "Program Dukungan Sebaya"' }, next: 'board_initiative_done', harmonyDelta: 20, action: 'build_peer_support' }
    ]
  },
  board_initiative_done: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ Initiative selected! The school environment will change. ]', id: '[ Inisiatif dipilih! Lingkungan sekolah akan berubah. ]' },
    next    : null
  },
  board_already_done: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ You have already selected an initiative. Check the corridor! ]', id: '[ Kamu sudah memilih inisiatif. Coba cek lorong! ]' },
    next    : null
  },

  /* ══════════ Level 5 — Time Challenge (Cafeteria) ══════════ */

  qte_intro: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ You hear loud mocking from across the cafeteria! You need to stop it before it gets worse! ]', id: '[ Kamu mendengar ejekan keras dari seberang kantin! Kamu harus menghentikannya sebelum makin parah! ]' },
    next    : null,
    action  : 'start_qte'
  },
  
  qte_success: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text    : { en: 'Hey! Stop it right now! Leave them alone!', id: 'Hei! Hentikan sekarang juga! Tinggalkan mereka!' },
    next    : 'qte_success_2',
    harmonyDelta: 20
  },

  qte_success_2: {
    speaker : { en: 'Bully', id: 'Perundung' },
    portrait: 'bully_neutral',
    text    : { en: 'Tch... whatever, let\'s go guys.', id: 'Cih... terserah, ayo pergi teman-teman.' },
    next    : null,
    action  : 'complete_level5'
  },

  qte_fail: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text    : { en: 'I was too late... they already left, and the damage is done.', id: 'Aku terlambat... mereka sudah pergi, dan semuanya sudah terjadi.' },
    next    : null,
    action  : 'complete_level5',
    harmonyDelta: -10
  },

  victim_thanks: {
    speaker : { en: 'Victim', id: 'Korban' },
    portrait: 'student_neutral',
    text    : { en: 'Thank you for standing up for me. I really appreciate it.', id: 'Terima kasih sudah membelaku. Aku sangat menghargainya.' },
    next    : null
  },

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
