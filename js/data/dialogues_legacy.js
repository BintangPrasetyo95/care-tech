const DIALOGUES = {

  /* ══════════ Level 1 — Detective Emotion (School Garden) ══════════ */

  // 001: Narator
  lvl1_001_narrator: {
    speaker : { en: 'Narator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: 'The recess bell rings. Nakula is walking in the school garden.',
      id: 'Bel istirahat berbunyi. Nakula berjalan di taman sekolah.' 
    },
    next    : null,
    action  : null,
    onCloseAction: 'lvl1_start_walk'
  },

  // 003: ECA trigger saat Nakula mendekat ke Nabula (<= 3 block)
  lvl1_003_eca: {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_surprised',
    text    : { 
      en: 'Wait... someone looks like they are holding back tears over there.',
      id: 'Eh, tunggu... sepertinya ada yang lagi menahan tangis di sana.' 
    },
    next    : 'lvl1_004_choice'
  },

  // 004: Pilihan Pemain
  lvl1_004_choice: {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text    : { 
      en: 'What should we do?',
      id: 'Apa yang harus kita lakukan?' 
    },
    choices : [
      { 
        label: { en: '1. "Let\'s go talk to her."', id: '1. "Ayo kita bicara dengannya."' },
        next : 'lvl1_005a_1',
        harmonyDelta: 25,
        action: 'vibrate_choice'
      },
      { 
        label: { en: '2. "I don\'t care."', id: '2. "Aku nggak peduli."' },
        next : 'lvl1_005b_1',
        harmonyDelta: -35,
        action: 'vibrate_choice'
      },
      { 
        label: { en: '3. "Maybe it\'s just my imagination."', id: '3. "Mungkin cuma perasaanku aja."' },
        next : 'lvl1_005c_1',
        harmonyDelta: -10,
        action: 'vibrate_choice'
      }
    ]
  },

  /* ── 005a Branch ── */
  'lvl1_005a_1': {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text    : { en: 'Let\'s go talk to her.', id: 'Ayo kita bicara dengannya.' },
    next    : null,
    autoAdvanceTimer: 3000,
    action  : 'lvl1_005a_ready',
    onCloseAction: 'lvl1_005a_walk'
  },

  /* ── 005b Branch ── */
  'lvl1_005b_1': {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text    : { en: 'I don\'t care.', id: 'Aku nggak peduli.' },
    next    : 'lvl1_005b_2'
  },
  'lvl1_005b_2': {
    speaker : { en: 'Narator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: 'Nabula is still sitting alone. Nobody approaches her.',
      id: 'Nabula masih duduk sendirian. Tidak ada yang menghampirinya.' 
    },
    next    : 'lvl1_005b_3'
  },
  'lvl1_005b_3': {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { 
      en: '(mumbles softly) "Nobody notices I\'m sad..."',
      id: '(bergumam pelan) "Nggak ada yang nyadar aku lagi sedih..."' 
    },
    next    : 'lvl1_005b_4'
  },
  'lvl1_005b_4': {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_sad',
    text    : { 
      en: 'Nakula... look, Nabula is still there. I can\'t stop thinking about her.',
      id: 'Nakula... coba lihat deh, Nabula masih di sana. Aku jadi kepikiran terus, nih.' 
    },
    next    : 'lvl1_005b_6'
  },
  'lvl1_005b_6': {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text    : { 
      en: 'Should we go back and help her?',
      id: 'Apakah kita mau kembali membantunya?' 
    },
    choices : [
      {
        label: { en: '1. "Approach Nabula."', id: '1. "Hampiri Nabula."' },
        next : null,
        harmonyDelta: 10,
        action: 'lvl1_005b_approach'
      },
      {
        label: { en: '2. "Leave it, keep walking." (-10)', id: '2. "Biarkan saja, lanjut jalan." (-10)' },
        next : 'lvl1_005b_8_narrator',
        harmonyDelta: -10,
        action: 'vibrate_choice'
      }
    ]
  },
  'lvl1_005b_8_narrator': {
    speaker : { en: 'Narator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: 'Nabula finally stands up by herself and walks into the library, without getting a chance to talk to anyone.',
      id: 'Nabula akhirnya berdiri sendiri dan berjalan masuk ke perpustakaan, tanpa sempat bicara dengan siapa pun.' 
    },
    next    : null,
    autoAdvanceTimer: 5000,
    action  : 'lvl1_005b_focus_nabula',
    onCloseAction: 'lvl1_005b_nabula_leaves'
  },
  'lvl1_005b_9b_eca': {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_surprised',
    text    : { 
      en: 'Nakula... Nabula entered the library. Let\'s go after her before it\'s too late!',
      id: 'Nakula... Nabula masuk ke perpustakaan. Yuk, susul dia sebelum terlambat!' 
    },
    next    : null,
    action  : null,
    onCloseAction: 'lvl1_005b_start_timer_quest'
  },
  'lvl1_005b_10_narrator': {
    speaker : { en: 'Narator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: 'Nakula didn\'t make it in time to catch Nabula that day.',
      id: 'Nakula tidak sempat menyusul Nabula hari itu.' 
    },
    next    : 'lvl1_005b_12_eca',
    action  : 'lvl1_005b_fail_fade'
  },
  'lvl1_005b_12_eca': {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_sad',
    text    : { 
      en: 'It\'s okay, Nakula. Sometimes we realize too late that a friend needs help. But tomorrow, we still have another chance to try again.',
      id: 'Nggak apa-apa, Nakula. Kadang kita telat sadar kalau teman butuh bantuan. Tapi besok, kita masih punya kesempatan buat coba lagi.' 
    },
    next    : null,
    action  : null,
    onCloseAction: 'lvl1_005b_show_fail_result'
  },

  /* ── 005c Branch ── */
  'lvl1_005c_1': {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text    : { en: 'Maybe it\'s just my imagination.', id: 'Mungkin cuma perasaanku aja.' },
    next    : 'lvl1_005c_2',
    action  : 'lvl1_camera_to_nakula'
  },
  'lvl1_005c_2': {
    speaker : { en: 'ECA', id: 'ECA' },
    portrait: 'player_sad',
    text    : { 
      en: 'Hmm... are you sure? Even from here, she clearly looks like she\'s holding back tears. Won\'t you regret leaving her alone?',
      id: 'Hmm... yakin? Soalnya dari sini aja kelihatan dia nahan tangis, lho. Nyesel nggak, kalau kita biarin aja?' 
    },
    next    : 'lvl1_005c_3'
  },
  'lvl1_005c_3': {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text    : { 
      en: 'Well... you\'re right. We better go check on her.',
      id: 'Eh... iya juga, ya. Mending kita cek deh.' 
    },
    next    : null,
    action  : 'lvl1_005c_enable_move'
  },

  /* ── 007 - 011: Dialog Nakula & Nabula ── */
  lvl1_007_nakula: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text    : { en: 'Nabula?', id: 'Nabula?' },
    next    : 'lvl1_008_nabula',
    action  : 'vibrate_soft'
  },
  lvl1_008_nabula: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { en: 'Oh... hai, Nakula.', id: 'Oh... hai, Nakula.' },
    next    : 'lvl1_009_narrator'
  },
  lvl1_009_narrator: {
    speaker : { en: 'Narator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: 'Nabula quickly wipes her eyes and tries to smile. But her smile looks different from usual.',
      id: 'Nabula buru-buru menyeka matanya dan mencoba tersenyum. Tapi senyumnya terlihat berbeda dari biasanya.' 
    },
    next    : 'lvl1_010_nakula'
  },
  lvl1_010_nakula: {
    speaker : { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text    : { en: 'Are you okay, Nabula?', id: 'Kamu nggak apa-apa, Nabula?' },
    next    : 'lvl1_011_nabula'
  },
  lvl1_011_nabula: {
    speaker : { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text    : { 
      en: 'I\'m okay... I just wanted to be alone for a bit.',
      id: 'Aku nggak apa-apa, kok. Cuma... pengen sendirian aja tadi.' 
    },
    next    : 'lvl1_012_narrator'
  },
  lvl1_012_narrator: {
    speaker : { en: 'Narator', id: 'Narator' },
    portrait: null,
    text    : { 
      en: 'Soon after, Nabula stands up and walks toward the library. She leaves alone, carrying something she hadn\'t had the chance to share.',
      id: 'Tak lama kemudian, Nabula berdiri dan berjalan menuju perpustakaan. Ia pergi sendirian, membawa sesuatu yang belum sempat ia ceritakan.' 
    },
    next    : null,
    autoAdvanceTimer: 5000,
    action  : 'lvl1_012_focus_nabula',
    onCloseAction: 'lvl1_012_nabula_leaves'
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

  /* ══════════ Generic NPC Interactions ══════════ */

  student_chat_1: {
    speaker : { en: 'Student', id: 'Siswa' },
    portrait: 'student_neutral',
    text    : { en: 'Hey! Have you checked the bulletin board in the corridor? There\'s something interesting posted.', id: 'Hei! Sudahkah kamu memeriksa papan pengumuman di lorong? Ada sesuatu yang menarik.' },
    next    : null
  },

  peer_supporter_chat: {
    speaker : { en: 'Peer Supporter', id: 'Konselor Sebaya' },
    portrait: 'student_neutral',
    text    : { en: 'Hi there! We are here to listen if you or anyone else needs to talk about bullying, stress, or anything at all. You are not alone!', id: 'Hai! Kami di sini untuk mendengarkan jika kamu atau siapa pun butuh teman bicara soal perundungan, stres, atau apa pun. Kamu tidak sendirian!' },
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
  },

  librarian_chat: {
    speaker : { en: 'Librarian', id: 'Pustakawan' },
    portrait: 'rani_neutral',
    text    : { 
      en: 'Welcome to Harmonia Library! Please keep your voice down so everyone can read in peace.', 
      id: 'Selamat datang di Perpustakaan Harmonia! Harap tenang agar semua orang dapat membaca dengan nyaman.' 
    },
    next    : null
  }
};
