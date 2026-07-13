const DIALOGUES = {

  /* ══════════ Level 1 — Detective Emotion (School Garden) ══════════ */

  player_intro: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_happy',
    text    : { 
      en: 'Hey, look — Nabula is sitting alone over there on that bench. She seems… off. What do you think?',
      id: 'Hei, lihat — Nabula duduk sendirian di bangku sana. Dia tampak… murung. Bagaimana menurutmu?' 
    },
    choices : [
      { label: { en: 'It seems like Nabula is sad…', id: 'Sepertinya Nabula sedang sedih…' },       next: 'nabula_sad_ack',   harmonyDelta:  10, action: 'nabula_smile_anim' },
      { label: { en: 'Maybe she just wants to be alone.', id: 'Mungkin dia hanya ingin sendirian.' },   next: 'nabula_alone_ack', harmonyDelta:   0 },
      { label: { en: 'I don\'t really care.', id: 'Aku tidak peduli.' },               next: 'nabula_ignore',    harmonyDelta:  -5 },
      { label: { en: 'Let\'s go talk to her right now!', id: 'Ayo kita bicara dengannya sekarang!' },    next: 'nabula_eager',     harmonyDelta:   5 }
    ]
  },

  nabula_sad_ack: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_smile',
    text    : { en: '… you noticed? That… actually means a lot. Thank you.', id: '… kamu sadar? Itu… sangat berarti bagiku. Terima kasih.' },
    next    : 'player_impressed'
  },

  player_impressed: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_happy',
    text    : { en: 'See? Sometimes just noticing someone\'s feelings is the first step. Nice one.', id: 'Lihat kan? Terkadang sekadar menyadari perasaan seseorang adalah langkah pertama. Bagus sekali.' },
    next    : null,
    action  : 'complete_level1'
  },

  nabula_alone_ack: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_neutral',
    text    : { en: '… yeah, I guess. Everyone needs space sometimes.', id: '… ya, kurasa. Setiap orang butuh ruang kadang-kadang.' },
    next    : 'player_hmm'
  },

  player_hmm: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text    : { en: 'Hmm… I wonder if that\'s really what\'s going on though.', id: 'Hmm… Aku jadi bertanya-tanya apakah itu benar-benar yang terjadi.' },
    next    : null,
    action  : 'complete_level1'
  },

  nabula_ignore: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text    : { en: 'Come on… we should at least check on her. What if something\'s wrong?', id: 'Ayolah… kita setidaknya harus memeriksanya. Bagaimana kalau ada apa-apa?' },
    next    : null,
    action  : 'complete_level1'
  },

  nabula_eager: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_surprised',
    text    : { en: 'Oh! Hi… I wasn\'t expecting anyone to come over. That\'s… nice of you.', id: 'Oh! Hai… Aku tidak menyangka akan ada yang datang. Kalian… baik sekali.' },
    next    : 'player_smiles'
  },

  player_smiles: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_happy',
    text    : { en: 'That\'s the spirit! Being proactive about reaching out matters.', id: 'Itu baru semangat! Bersikap proaktif untuk menjangkau orang lain itu penting.' },
    next    : null,
    action  : 'complete_level1'
  },

  /* ══════════ Level 2 — Empathy Rescue (Corridor & Library) ══════════ */

  bully_taunt: {
    speaker : { en: 'Bully NPC', id: 'Perundung' },
    portrait: 'bully_smirk',
    text    : { en: 'Ha ha, look at Nabula — pretending she doesn\'t hear us! What a joke.', id: 'Ha ha, lihat Nabula — pura-pura tidak dengar kita! Lelucon macam apa ini.' },
    next    : 'bully_taunt_2'
  },

  bully_taunt_2: {
    speaker : { en: 'Bully NPC', id: 'Perundung' },
    portrait: 'bully_smirk',
    text    : { en: 'Hey Nabula! Why so quiet? Cat got your tongue? Hahaha!', id: 'Hei Nabula! Kenapa diam saja? Kucing makan lidahmu? Hahaha!' },
    next    : 'nabula_runs'
  },

  nabula_runs: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ Nabula lowers her head and runs toward the back of the library… ]', id: '[ Nabula menundukkan kepala dan lari ke belakang perpustakaan… ]' },
    next    : 'narrator_find_her',
    action  : 'nabula_run_away'
  },

  narrator_find_her: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ You should find Nabula. She went behind the library — head through the corridor. ]', id: '[ Kamu harus mencari Nabula. Dia pergi ke belakang perpustakaan — telusuri lorong. ]' },
    next    : null
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
    next    : null
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
    next    : null
  },

  nabula_sad2: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { en: '… yeah… I\'ll try. It just… doesn\'t feel like it ever stops.', id: '… ya… Aku akan coba. Hanya saja… rasanya ini tidak pernah berhenti.' },
    next    : null
  },

  /* ══════════ Generic NPC Interactions ══════════ */

  student_chat_1: {
    speaker : { en: 'Student', id: 'Siswa' },
    portrait: 'student_neutral',
    text    : { en: 'Hey! Have you checked the bulletin board in the corridor? There\'s something interesting posted.', id: 'Hei! Sudahkah kamu memeriksa papan pengumuman di lorong? Ada sesuatu yang menarik.' },
    next    : null
  },

  student_chat_2: {
    speaker : { en: 'Student', id: 'Siswa' },
    portrait: 'student_neutral',
    text    : { en: 'Harmonia School feels different lately… I hope things get better.', id: 'Sekolah Harmonia terasa berbeda akhir-akhir ini… Kuharap semuanya membaik.' },
    next    : null
  },

  rani_intro: {
    speaker : { en: 'Teacher Rani', id: 'Bu Rani' },
    portrait: 'rani_neutral',
    text    : { en: 'Hello there. Remember — if you see anything concerning, don\'t hesitate to tell a teacher.', id: 'Halo. Ingat — jika kalian melihat sesuatu yang mengkhawatirkan, jangan ragu untuk melapor.' },
    next    : 'rani_intro_2'
  },

  rani_intro_2: {
    speaker : { en: 'Teacher Rani', id: 'Bu Rani' },
    portrait: 'rani_neutral',
    text    : { en: 'We all have a role to play in making this school a safe place.', id: 'Kita semua punya peran untuk menjadikan sekolah ini tempat yang aman.' },
    next    : null
  },

  riko_corridor: {
    speaker : { en: 'Riko', id: 'Riko' },
    portrait: 'riko_neutral',
    text    : { en: '… what are you looking at? Mind your own business.', id: '… apa lihat-lihat? Urus saja urusanmu sendiri.' },
    next    : null
  },

  /* ══════════ Object Interactions ══════════ */

  board_interact: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ A bulletin board. It reads: "Harmonia School Values — Respect, Empathy, Kindness." ]', id: '[ Papan pengumuman. Bertuliskan: "Nilai Sekolah Harmonia — Rasa Hormat, Empati, Kebaikan." ]' },
    next    : null
  },

  desk_interact: {
    speaker : { en: '', id: '' },
    portrait: null,
    text    : { en: '[ A neat classroom desk. Textbooks and pencils are arranged carefully. ]', id: '[ Meja kelas yang rapi. Buku pelajaran dan pensil tersusun rapi. ]' },
    next    : null
  }
};
