/* ───────────── data / levels / level1 / dialogues.js ─────────────
   CARE-TECH: Harmonia School — Level 1: Detective Emotion
   Source: script/skrip_level1.md (Nodes 001 - 016)
   ─────────────────────────────────────────────────────────────── */

window.LEVEL_1_DIALOGUES = {

  /* ── 001: Narator Pembuka Taman Sekolah ── */
  lvl1_001_narrator: {
    id: '001',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The recess bell rings. Nakula is walking in the school garden.',
      id: 'Bel istirahat berbunyi. Nakula berjalan di taman sekolah.'
    },
    next: null,
    action: null,
    onCloseAction: [
      { type: 'player_lock', value: false }
    ]
  },

  /* ── 003: ECA Trigger Proximity (Saat Nakula <= 3 block dari Nabula) ── */
  lvl1_003_eca: {
    id: '003',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_surprised',
    text: {
      en: 'Wait... someone looks like they are holding back tears over there.',
      id: 'Eh, tunggu... sepertinya ada yang lagi menahan tangis di sana.'
    },
    next: 'lvl1_004_choice'
  },

  /* ── 004: Pilihan Pemain ── */
  lvl1_004_choice: {
    id: '004',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: 'What should we do?',
      id: 'Apa yang harus kita lakukan?'
    },
    choices: [
      {
        label: { en: '1. "Let\'s go talk to her."', id: '1. "Ayo kita bicara dengannya."' },
        next: 'lvl1_005a_1',
        harmonyDelta: 25,
        action: { type: 'vibrate', pattern: [60, 40, 60] }
      },
      {
        label: { en: '2. "I don\'t care."', id: '2. "Aku nggak peduli."' },
        next: 'lvl1_005b_1',
        harmonyDelta: -35,
        action: { type: 'vibrate', pattern: [60, 40, 60] }
      },
      {
        label: { en: '3. "Maybe it\'s just my imagination."', id: '3. "Mungkin cuma perasaanku aja."' },
        next: 'lvl1_005c_1',
        harmonyDelta: -10,
        action: { type: 'vibrate', pattern: [60, 40, 60] }
      }
    ]
  },

  /* ── 005a Branch: Ayo Bicara Dengannya ── */
  'lvl1_005a_1': {
    id: '005a-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: { en: 'Let\'s go talk to her.', id: 'Ayo kita bicara dengannya.' },
    next: null,
    autoAdvanceTimer: 3000,
    action: 'lvl1_005a_ready',
    onCloseAction: 'lvl1_005a_walk'
  },

  /* ── 005b Branch: Aku Nggak Peduli ── */
  'lvl1_005b_1': {
    id: '005b-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: { en: 'I don\'t care.', id: 'Aku nggak peduli.' },
    next: 'lvl1_005b_2'
  },
  'lvl1_005b_2': {
    id: '005b-2',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula is still sitting alone. Nobody approaches her.',
      id: 'Nabula masih duduk sendirian. Tidak ada yang menghampirinya.'
    },
    next: 'lvl1_005b_3'
  },
  'lvl1_005b_3': {
    id: '005b-3',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '(mumbles softly) "Nobody notices I\'m sad..."',
      id: '(bergumam pelan) "Nggak ada yang nyadar aku lagi sedih..."'
    },
    next: 'lvl1_005b_4'
  },
  'lvl1_005b_4': {
    id: '005b-4',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_sad',
    text: {
      en: 'Nakula... look, Nabula is still there. I can\'t stop thinking about her.',
      id: 'Nakula... coba lihat deh, Nabula masih di sana. Aku jadi kepikiran terus, nih.'
    },
    next: 'lvl1_005b_6'
  },
  'lvl1_005b_6': {
    id: '005b-6',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: 'Should we go back and help her?',
      id: 'Apakah kita mau kembali membantunya?'
    },
    choices: [
      {
        label: { en: '1. "Approach Nabula."', id: '1. "Hampiri Nabula."' },
        next: null,
        harmonyDelta: 10,
        action: 'lvl1_005b_approach'
      },
      {
        label: { en: '2. "Leave it, keep walking." (-10)', id: '2. "Biarkan saja, lanjut jalan." (-10)' },
        next: 'lvl1_005b_8_narrator',
        harmonyDelta: -10,
        action: { type: 'vibrate', pattern: [60, 40, 60] }
      }
    ]
  },
  'lvl1_005b_8_narrator': {
    id: '005b-8',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula finally stands up by herself and walks into the library, without getting a chance to talk to anyone.',
      id: 'Nabula akhirnya berdiri sendiri dan berjalan masuk ke perpustakaan, tanpa sempat bicara dengan siapa pun.'
    },
    next: null,
    autoAdvanceTimer: 5000,
    action: 'lvl1_005b_focus_nabula',
    onCloseAction: 'lvl1_005b_nabula_leaves'
  },
  'lvl1_005b_9b_eca': {
    id: '005b-9b',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_surprised',
    text: {
      en: 'Nakula... Nabula entered the library. Let\'s go after her before it\'s too late!',
      id: 'Nakula... Nabula masuk ke perpustakaan. Yuk, susul dia sebelum terlambat!'
    },
    next: null,
    action: null,
    onCloseAction: 'lvl1_005b_start_timer_quest'
  },
  'lvl1_005b_10_narrator': {
    id: '005b-10',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula didn\'t make it in time to catch Nabula that day.',
      id: 'Nakula tidak sempat menyusul Nabula hari itu.'
    },
    next: 'lvl1_005b_12_eca',
    action: 'lvl1_005b_fail_fade'
  },
  'lvl1_005b_12_eca': {
    id: '005b-12',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_sad',
    text: {
      en: 'It\'s okay, Nakula. Sometimes we realize too late that a friend needs help. But tomorrow, we still have another chance to try again.',
      id: 'Nggak apa-apa, Nakula. Kadang kita telat sadar kalau teman butuh bantuan. Tapi besok, kita masih punya kesempatan buat coba lagi.'
    },
    next: null,
    action: null,
    onCloseAction: 'lvl1_005b_show_fail_result'
  },

  /* ── 005c Branch: Mungkin Cuma Perasaanku Aja ── */
  'lvl1_005c_1': {
    id: '005c-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: { en: 'Maybe it\'s just my imagination.', id: 'Mungkin cuma perasaanku aja.' },
    next: 'lvl1_005c_2',
    action: 'lvl1_camera_to_nakula'
  },
  'lvl1_005c_2': {
    id: '005c-2',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_sad',
    text: {
      en: 'Hmm... are you sure? Even from here, she clearly looks like she\'s holding back tears. Won\'t you regret leaving her alone?',
      id: 'Hmm... yakin? Soalnya dari sini aja kelihatan dia nahan tangis, lho. Nyesel nggak, kalau kita biarin aja?'
    },
    next: 'lvl1_005c_3'
  },
  'lvl1_005c_3': {
    id: '005c-3',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: 'Well... you\'re right. We better go check on her.',
      id: 'Eh... iya juga, ya. Mending kita cek deh.'
    },
    next: null,
    action: 'lvl1_005c_enable_move'
  },

  /* ── 007 - 011: Dialog Nakula & Nabula ── */
  lvl1_007_nakula: {
    id: '007',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: { en: 'Nabula?', id: 'Nabula?' },
    next: 'lvl1_008_nabula',
    action: { type: 'vibrate', pattern: 60 }
  },
  lvl1_008_nabula: {
    id: '008',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: { en: 'Oh... hai, Nakula.', id: 'Oh... hai, Nakula.' },
    next: 'lvl1_009_narrator'
  },
  lvl1_009_narrator: {
    id: '009',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula quickly wipes her eyes and tries to smile, but her smile looks unusual.',
      id: 'Nabula buru-buru menyeka matanya dan mencoba tersenyum, tapi senyumnya kelihatan nggak biasa.'
    },
    next: 'lvl1_010_nakula'
  },
  lvl1_010_nakula: {
    id: '010',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: { en: 'Are you okay, Nabula?', id: 'Kamu nggak apa-apa, Nabula?' },
    next: 'lvl1_011_nabula'
  },
  lvl1_011_nabula: {
    id: '011',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: 'I\'m okay... I just wanted to be alone for a bit.',
      id: 'Aku nggak apa-apa, kok. Cuma... pengen sendirian aja tadi.'
    },
    next: 'lvl1_012_narrator'
  },

  /* ── 012: Narator dan Nabula Menuju Perpustakaan ── */
  lvl1_012_narrator: {
    id: '012',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula stands and walks toward the library.',
      id: 'Nabula berdiri dan berjalan menuju perpustakaan.'
    },
    next: null,
    noManualAdvance: true,
    action: 'lvl1_012_nabula_leaves'
  },

  /* ── 017: Narator & Kamera Menyorot Bagas dan Rio ── */
  lvl1_017_narrator: {
    id: '017',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio\'s voices can be heard faintly from behind the bookshelf. Nabula can\'t see them, but she can hear what they are saying.',
      id: 'Suara Bagas dan Rio terdengar samar dari balik rak. Nabula tidak melihat mereka, tetapi dapat mendengar pembicaraan mereka.'
    },
    next: 'lvl1_018_bagas',
    action: null
  },
  rlvl1_017_narrator: {
    id: '017',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio\'s voices can be heard faintly from behind the bookshelf. Nabula can\'t see them, but she can hear what they are saying.',
      id: 'Suara Bagas dan Rio terdengar samar dari balik rak. Nabula tidak melihat mereka, tetapi dapat mendengar pembicaraan mereka.'
    },
    next: 'lvl1_018_bagas',
    action: null
  },

  /* ── 018: Bagas Mengejek Nabula ── */
  lvl1_018_bagas: {
    id: '018',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_smirk',
    text: {
      en: '"Hahaha, look at Nabula. Pretending she can\'t hear us talking about her."',
      id: '"Hahaha, lihat deh si Nabula. Sok-sokan pura-pura nggak dengar kita ngomongin dia."'
    },
    next: 'lvl1_019_rio'
  },

  /* ── 019: Rio Menimpali ── */
  lvl1_019_rio: {
    id: '019',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_smirk',
    text: {
      en: '"Yeah, she\'s been walking in a hurry like that all the time. Looks scared."',
      id: '"Iya, dari tadi jalannya buru-buru gitu terus. Kayak takut."'
    },
    next: null,
    onCloseAction: 'lvl1_019_focus_nabula'
  },

  /* ── 020: Nabula Berlari Kabur ── */
  lvl1_020_narrator: {
    id: '020',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Hearing that, Nabula suddenly runs away until she disappears around the corner of the shelf.',
      id: 'Nabula yang mendengarkan sontak berlari sampai ia menghilang di tikungan rak.'
    },
    next: null,
    noManualAdvance: true,
    action: 'lvl1_020_nabula_runs'
  },

  /* ── 022: Nakula Kesal ── */
  lvl1_022_nakula: {
    id: '022',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"Why do they enjoy talking about people like that?! I\'m going to confront them right now!"',
      id: '"Kenapa, sih, mereka suka banget ngomongin orang kayak gitu?! Aku mau samperin mereka sekarang!"'
    },
    next: 'lvl1_023_eca'
  },

  /* ── 023: Eca Menenangkan Nakula ── */
  lvl1_023_eca: {
    id: '023',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Wait, hold on! I\'m upset hearing them talk like that too. But if we confront them right now, it might make things worse. How about we find out what\'s really going on with Nabula first?"',
      id: '"Eh, tunggu dulu! Aku juga kesel, lho, denger mereka ngomong gitu. Tapi kalau kita samperin sekarang, takutnya malah tambah runyam. Gimana kalau kita cari tahu dulu apa yang sebenarnya terjadi sama Nabula?"'
    },
    next: null,
    onCloseAction: 'lvl1_024_start_clue_quest'
  },

  /* ── Dialog Ambient Wulan di Perpustakaan (sebelum 031) ── */
  lvl1_wulan_ambient: {
    id: 'wulan_ambient',
    speaker: { en: 'Wulan', id: 'Wulan' },
    portrait: 'wulan_neutral',
    text: {
      en: 'Hi Nakula. The library is very peaceful today, isn\'t it?',
      id: 'Hai Nakula. Perpustakaan hari ini tenang banget, ya.'
    },
    next: null
  },

  /* ── Petunjuk 1: Buku Robek (Node 026 - 030) ── */
  lvl1_027_narrator: {
    id: '027',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula finds an assignment book lying between the shelves.',
      id: 'Nakula menemukan sebuah buku tergeletak di sela rak.'
    },
    next: 'lvl1_028_nakula'
  },
  lvl1_028_nakula: {
    id: '028',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"This is... Nabula\'s assignment book. But why are the pages torn like this?"',
      id: '"Ini... buku tugas Nabula. Tapi kenapa halamannya robek-robek gini?"'
    },
    next: 'lvl1_029_eca'
  },
  lvl1_029_eca: {
    id: '029',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Hmm, this doesn\'t look like an accident. Look, the tears are so neat, only on the parts with handwriting."',
      id: '"Hmm, ini kayaknya bukan robek karena kecelakaan, deh. Coba lihat, robekannya rapi banget, cuma di bagian yang ada tulisannya."'
    },
    next: null,
    onCloseAction: 'lvl1_030_clue_found_book'
  },

  /* ── Petunjuk 2: Bertanya ke Wulan (Node 031 - 037) ── */
  lvl1_033_nakula: {
    id: '033',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Wulan, can I ask you something?"',
      id: '"Wulan, boleh nanya sesuatu, nggak?"'
    },
    next: 'lvl1_034_wulan'
  },
  lvl1_034_wulan: {
    id: '034',
    speaker: { en: 'Wulan', id: 'Wulan' },
    portrait: 'wulan_neutral',
    text: {
      en: '"Oh, Nakula? Sure, what\'s up?"',
      id: '"Eh, Nakula? Boleh, emang kenapa?"'
    },
    next: 'lvl1_035_nakula'
  },
  lvl1_035_nakula: {
    id: '035',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Do you know why Nabula has been looking so sad lately?"',
      id: '"Kamu tahu, nggak, kenapa Nabula akhir-akhir ini kelihatan sedih terus?"'
    },
    next: 'lvl1_036_wulan'
  },
  lvl1_036_wulan: {
    id: '036',
    speaker: { en: 'Wulan', id: 'Wulan' },
    portrait: 'wulan_sad',
    text: {
      en: '"I often see things written all over Nabula\'s desk. But I was afraid I\'d get targeted too if I spoke up..."',
      id: '"Aku sering lihat meja Nabula ditulisin macam-macam. Tapi aku takut ikut kena kalau aku bilang-bilang..."'
    },
    next: null,
    onCloseAction: 'lvl1_037_clue_found_wulan'
  },
  lvl1_wulan_after_clue: {
    id: 'wulan_after',
    speaker: { en: 'Wulan', id: 'Wulan' },
    portrait: 'wulan_neutral',
    text: {
      en: '"I hope Nabula is okay... Please help her if you can, Nakula."',
      id: '"Semoga Nabula baik-baik saja ya... Tolong bantu dia kalau bisa, Nakula."'
    },
    next: null
  },

  /* ── Petunjuk 3: Menguping Raya dan Mei (Node 038 - 046) ── */
  lvl1_039_narrator: {
    id: '039',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The two students don\'t realize Nakula is standing not far from them.',
      id: 'Dua siswa itu tidak menyadari Nakula berada tidak jauh dari mereka.'
    },
    next: 'lvl1_040_raya'
  },
  lvl1_040_raya: {
    id: '040',
    speaker: { en: 'Raya', id: 'Raya' },
    portrait: 'raya_neutral',
    text: {
      en: '"Hey, during break earlier I saw Nabula at the cafeteria. Bagas and Rio kept sitting close to her."',
      id: '"Eh, tadi pas istirahat aku lihat Nabula di kantin. Bagas sama Rio duduk deket-deket dia terus."'
    },
    next: 'lvl1_041_mei'
  },
  lvl1_041_mei: {
    id: '041',
    speaker: { en: 'Mei', id: 'Mei' },
    portrait: 'mei_neutral',
    text: {
      en: '"Yeah, I saw that too. Nabula was eating so hurriedly, like she wanted to leave quickly."',
      id: '"Iya, aku juga lihat. Nabula jadi buru-buru banget makannya, kayak pengen cepet-cepet pergi."'
    },
    next: 'lvl1_042_raya'
  },
  lvl1_042_raya: {
    id: '042',
    speaker: { en: 'Raya', id: 'Raya' },
    portrait: 'raya_sad',
    text: {
      en: '"I feel bad for her, honestly. But no one dares to tell them off."',
      id: '"Kasihan, sih. Tapi nggak ada yang berani negur mereka."'
    },
    next: 'lvl1_043_nakula'
  },
  lvl1_043_nakula: {
    id: '043',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"So it\'s not just in the library or here... it\'s at the cafeteria too."',
      id: '"Jadi bukan cuma di perpustakaan atau di sini aja... di kantin juga."'
    },
    next: null,
    action: 'lvl1_044_camera_to_nakula',
    onCloseAction: 'lvl1_046_clue_found_students'
  },

  /* ── 045: Eca Menyimpulkan Saat 3/3 Petunjuk Terkumpul ── */
  lvl1_045_eca: {
    id: '045',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Three places, three incidents. This isn\'t a misunderstanding, it\'s a pattern."',
      id: '"Tiga tempat, tiga kejadian. Ini bukan salah paham, ini pola."'
    },
    next: null,
    onCloseAction: 'lvl1_046_all_clues_collected'
  },

  /* ── Dialog Ambient NPC Perpustakaan ── */
  lvl1_raya_ambient: {
    id: 'raya_ambient',
    speaker: { en: 'Raya', id: 'Raya' },
    portrait: 'raya_neutral',
    text: {
      en: '"Shh... please keep your voice down in the library."',
      id: '"Ssst... jangan berisik ya di perpustakaan."'
    },
    next: null
  },
  lvl1_mei_ambient: {
    id: 'mei_ambient',
    speaker: { en: 'Mei', id: 'Mei' },
    portrait: 'mei_neutral',
    text: {
      en: '"I\'m reading study books with Raya here."',
      id: '"Aku lagi baca buku tugas bareng Raya di sini."'
    },
    next: null
  },
  lvl1_bagas_ambient: {
    id: 'bagas_ambient',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_smirk',
    text: {
      en: '"What are you staring at? Looking for trouble?"',
      id: '"Apa lihat-lihat? Mau nyari masalah?"'
    },
    next: null
  },
  lvl1_rio_ambient: {
    id: 'rio_ambient',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_smirk',
    text: {
      en: '"Ugh, why are you wandering around here?"',
      id: '"Hadeh, ngapain sih kamu mondar-mandir di sini?"'
    },
    next: null
  },

  /* ── Babak 4C: Tiba di Kantin (Node 049 - 057b) ── */
  lvl1_049_narrator: {
    id: '049',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula arrives at the cafeteria. At one of the tables, Nabula is eating alone until Bagas and Rio approach and sit near her.',
      id: 'Nakula tiba di kantin. Di salah satu meja, Nabula sedang makan sendirian sampai Bagas dan Rio menghampiri dan duduk di dekatnya.'
    },
    next: 'lvl1_050_bagas',
    action: 'lvl1_049_focus_cafeteria'
  },
  lvl1_050_bagas: {
    id: '050',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_smirk',
    text: {
      en: '"Hey, Nabula. Alone again? Don\'t you have any other friends?"',
      id: '"Eh, Nabula. Sendirian lagi? Nggak punya teman lain, ya?"'
    },
    next: 'lvl1_051_rio'
  },
  lvl1_051_rio: {
    id: '051',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_smirk',
    text: {
      en: '"Hahaha, yeah. Scoot over a bit, we\'re sitting here."',
      id: '"Hahaha, iya. Geser dikit dong, kita mau duduk di sini."'
    },
    next: 'lvl1_052_narrator'
  },
  lvl1_052_narrator: {
    id: '052',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio sit near Nabula. Nabula looks uncomfortable and starts eating faster.',
      id: 'Bagas dan Rio duduk di dekat Nabula. Nabula terlihat tidak nyaman dan mulai mempercepat makannya.'
    },
    next: 'lvl1_053_narrator'
  },
  lvl1_053_narrator: {
    id: '053',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula tries to ignore them, but Bagas continues to bother her.',
      id: 'Nabula mencoba mengabaikan mereka, tetapi Bagas terus mengganggunya.'
    },
    next: 'lvl1_054_bagas'
  },
  lvl1_054_bagas: {
    id: '054',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_smirk',
    text: {
      en: '"Why so quiet? Usually you act so busy."',
      id: '"Kenapa diem aja? Biasanya juga sok sibuk."'
    },
    next: 'lvl1_055_rio'
  },
  lvl1_055_rio: {
    id: '055',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_smirk',
    text: {
      en: '"Enough, Gas. Look at her, her face looks gloomy already."',
      id: '"Udah, Gas. Lihat tuh, mukanya langsung murung."'
    },
    next: 'lvl1_057_eca',
    action: 'lvl1_056_camera_to_nakula'
  },
  lvl1_057_eca: {
    id: '057',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Now you see for yourself, right? Nabula really is being bullied."',
      id: '"Nah, sekarang kamu lihat sendiri, kan? Nabula beneran lagi diganggu."'
    },
    next: 'lvl1_057b_eca'
  },
  lvl1_057b_eca: {
    id: '057b',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Before making a choice, pause for a moment. If we do something right now, what might happen to Nabula? And to us?"',
      id: '"Sebelum memilih, coba berhenti sebentar. Kalau kita lakukan sesuatu sekarang, apa yang mungkin terjadi pada Nabula? Dan pada kita?"'
    },
    next: null,
    onCloseAction: 'lvl1_058_show_cafeteria_choice'
  }
};

// Auto-register into global DIALOGUES
if (typeof window !== 'undefined') {
  window.DIALOGUES = window.DIALOGUES || {};
  Object.assign(window.DIALOGUES, window.LEVEL_1_DIALOGUES);
}
