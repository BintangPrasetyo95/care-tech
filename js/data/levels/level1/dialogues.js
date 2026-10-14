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
    noManualAdvance: true,
    action: 'lvl1_049_bullies_approach'
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
    next: null,
    onCloseAction: 'lvl1_056_camera_to_nakula'
  },
  lvl1_057_eca: {
    id: '057',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Now you see for yourself, right? Nabula really is being bullied."',
      id: '"Nah, sekarang kamu lihat sendiri, kan? Nabula beneran lagi diganggu."'
    },
    next: null,
    onCloseAction: 'lvl1_057_focus_nabula'
  },
  lvl1_057b_eca: {
    id: '057b',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Before making a choice, pause for a moment. If we do something right now, what might happen to Nabula? And to us?"',
      id: '"Sebelum memilih, coba berhenti sebentar. Kalau kita lakukan sesuatu sekarang, apa yang mungkin terjadi pada Nabula? Dan pada kita?"'
    },
    next: 'lvl1_058_choice'
  },

  /* ── 058: Pilihan Strategis di Kantin (Timer 30 Detik) ── */
  lvl1_058_choice: {
    id: '058',
    speaker: { en: 'PILIHAN TINDAKAN', id: 'PILIHAN TINDAKAN' },
    portrait: null,
    text: {
      en: 'What will you do to help Nabula? (Time limit: 15 seconds)',
      id: 'Apa yang akan kamu lakukan untuk membantu Nabula? (Batas waktu: 15 detik)'
    },
    choices: [
      {
        label: {
          id: '1. "Berhenti ganggu Nabula!" (+25)',
          en: '1. "Stop bothering Nabula!" (+25)'
        },
        harmonyDelta: 25,
        action: 'lvl1_059a_chosen',
        next: 'lvl1_059a_1_narrator'
      },
      {
        label: {
          id: '2. "Aku akan lapor ke Bu Wati." (+25)',
          en: '2. "I will report to Bu Wati." (+25)'
        },
        harmonyDelta: 25,
        action: 'lvl1_059b_chosen',
        next: 'lvl1_059b_1_nakula'
      },
      {
        label: {
          id: '3. "Nabula, kamu nggak apa-apa?" (+25)',
          en: '3. "Nabula, are you okay?" (+25)'
        },
        harmonyDelta: 25,
        action: 'lvl1_059c_chosen',
        next: 'lvl1_059c_1_narrator'
      }
    ],
    action: 'lvl1_058_start_timer'
  },

  /* ── 058x: Timeout 1 (Ragu-ragu, Pengurangan -15 Poin) ── */
  lvl1_058x_1_narrator: {
    id: '058x-1',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula stands frozen, confused about what to do.',
      id: 'Nakula berdiri diam, bingung harus ngapain.'
    },
    next: 'lvl1_058x_2_eca'
  },
  lvl1_058x_2_eca: {
    id: '058x-2',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Nakula? Calm down, no need to rush. Think: who can help Nabula right now?" (-15 Harmony)',
      id: '"Eh, Nakula? Tenang, nggak perlu buru-buru. Coba pikirkan dulu: siapa yang bisa bantu Nabula sekarang?" (-15 Harmoni)'
    },
    next: 'lvl1_058_choice'
  },

  /* ── 058x: Timeout 2 (Terlambat, Pengurangan -15 Poin) ── */
  lvl1_058x_5_narrator: {
    id: '058x-5',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Because Nakula kept hesitating, Bagas and Rio left before anyone confronted them. (-15 Harmony)',
      id: 'Karena Nakula terus ragu, Bagas dan Rio keburu pergi duluan sebelum sempat ditegur siapa pun. (-15 Harmoni)'
    },
    next: 'lvl1_058x_6_narrator',
    action: 'lvl1_058x_bullies_leave'
  },
  lvl1_058x_6_narrator: {
    id: '058x-6',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula hastily leaves the cafeteria, looking even more saddened.',
      id: 'Nabula buru-buru meninggalkan kantin, terlihat semakin sedih.'
    },
    action: 'lvl1_058x_nabula_leaves',
    noManualAdvance: true,
    next: 'lvl1_058x_7_eca'
  },
  lvl1_058x_7_eca: {
    id: '058x-7',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Nakula, this is our last chance. Hurry, follow Nabula to the garden, OR find Bu Wati in the library, choose one, before it\'s too late!"',
      id: '"Nakula, ini kesempatan terakhir. Cepat susul Nabula ke taman, atau cari Bu Wati di perpustakaan, pilih salah satu, sebelum terlambat!"'
    },
    next: null,
    onCloseAction: 'lvl1_058x_start_emergency_quest'
  },

  /* ── 058x: Timeout Darurat Gagal Total (Ending Alternatif) ── */
  lvl1_058x_10_narrator: {
    id: '058x-10',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula did not manage to find Nabula or Bu Wati in time.',
      id: 'Nakula tidak sempat menemukan Nabula maupun Bu Wati tepat waktu.'
    },
    next: 'lvl1_058x_12_eca',
    action: 'lvl1_058x_fade_out'
  },
  lvl1_058x_12_eca: {
    id: '058x-12',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"It\'s okay, Nakula. Sometimes we are late to make a decision. But tomorrow, we still have another chance to try again."',
      id: '"Nggak apa-apa, Nakula. Kadang kita emang telat ambil keputusan. Tapi besok, kita masih punya kesempatan buat coba lagi."'
    },
    next: null,
    onCloseAction: 'lvl1_058x_show_fail_modal'
  },

  /* ── 058x: Resolusi Darurat (Jika Pemain Berhasil Menemukan Nabula/Bu Wati) ── */
  lvl1_058x_nabula_garden_found: {
    id: '058x-garden',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"Nakula...? Thank you for coming after me. I just felt so overwhelmed earlier."',
      id: '"Nakula...? Makasih ya udah nyusul aku. Tadi aku ngerasa bener-bener sendirian."'
    },
    next: null,
    onCloseAction: 'lvl1_058x_emergency_success'
  },
  lvl1_058x_bu_wati_found: {
    id: '058x-wati',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"Nakula? There is something happening in the cafeteria? Thank you for reporting this immediately, let\'s go check together."',
      id: '"Nakula? Ada kejadian apa di kantin? Terima kasih sudah langsung melapor, ayo kita cek bersama-sama."'
    },
    next: null,
    onCloseAction: 'lvl1_058x_emergency_success'
  },

  /* ── 059a: Jalur A (Konfrontasi Langsung: 059a-1 s/d 059a-13) ── */
  lvl1_059a_1_narrator: {
    id: '059a-1',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula automatically steps forward towards Nabula\'s table in the cafeteria.',
      id: 'Nakula otomatis melangkah maju mendekati meja Nabula di kantin.'
    },
    next: null,
    action: 'lvl1_059a_walk_to_table'
  },
  lvl1_059a_2_nakula: {
    id: '059a-2',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"Stop bothering Nabula!"',
      id: '"Berhenti ganggu Nabula!"'
    },
    next: 'lvl1_059a_3_narrator'
  },
  lvl1_059a_3_narrator: {
    id: '059a-3',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio fall silent for a moment and turn towards Nakula. Nabula looks surprised.',
      id: 'Bagas dan Rio terdiam sejenak lalu menoleh ke arah Nakula. Nabula terlihat terkejut.'
    },
    action: 'lvl1_059a_bullies_turn',
    next: 'lvl1_059a_4_bagas'
  },
  lvl1_059a_4_bagas: {
    id: '059a-4',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_smirk',
    text: {
      en: '"Huh? Who do you think you are to interfere?"',
      id: '"Hah? Emang kamu siapa ikut campur?"'
    },
    next: 'lvl1_059a_5_nakula'
  },
  lvl1_059a_5_nakula: {
    id: '059a-5',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"I wouldn\'t need to get involved if you weren\'t bothering her. But it\'s obvious you\'ve been making Nabula uncomfortable."',
      id: '"Aku nggak perlu ikut campur kalau kalian memang nggak sedang mengganggu dia. Tapi dari tadi jelas kalian bikin Nabula nggak nyaman."'
    },
    next: 'lvl1_059a_6_rio'
  },
  lvl1_059a_6_rio: {
    id: '059a-6',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_smirk',
    text: {
      en: '"Just joking around. Relax, why so serious?"',
      id: '"Cuma bercanda, kali. Santai aja, kenapa, sih."'
    },
    next: 'lvl1_059a_7_nakula'
  },
  lvl1_059a_7_nakula: {
    id: '059a-7',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"If she doesn\'t find it funny, then it isn\'t a joke anymore."',
      id: '"Kalau dia nggak merasa itu lucu, berarti bukan bercanda lagi."'
    },
    next: 'lvl1_059a_8_narrator'
  },
  lvl1_059a_8_narrator: {
    id: '059a-8',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas falls silent. Rio looks uncomfortable.',
      id: 'Bagas terdiam. Rio terlihat tidak nyaman.'
    },
    next: 'lvl1_059a_9_bagas'
  },
  lvl1_059a_9_bagas: {
    id: '059a-9',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Hmph... fine, whatever. But this isn\'t over."',
      id: '"Hmph... iya, iya. Tapi ini belum selesai."'
    },
    next: 'lvl1_059a_10_narrator'
  },
  lvl1_059a_10_narrator: {
    id: '059a-10',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio leave the cafeteria table.',
      id: 'Bagas dan Rio meninggalkan meja kantin.'
    },
    action: 'lvl1_059a_bullies_leave',
    noManualAdvance: true,
    next: 'lvl1_059a_11_nabula'
  },
  lvl1_059a_11_nabula: {
    id: '059a-11',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"Thank you, Nakula... but I\'m afraid they might come back."',
      id: '"Makasih, Nakula... tapi aku takut mereka balik lagi."'
    },
    next: 'lvl1_059a_12_eca'
  },
  lvl1_059a_12_eca: {
    id: '059a-12',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"You were really brave just now. But the problem might not be over yet. Let\'s make sure to tell Bu Wati later, so an adult can help keep watch."',
      id: '"Kamu berani banget tadi. Tapi masalahnya belum tentu selesai. Nanti kita ceritakan juga ke Bu Wati, ya, supaya ada orang dewasa yang ikut menjaga."'
    },
    next: 'lvl1_059a_13_narrator'
  },
  lvl1_059a_13_narrator: {
    id: '059a-13',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula nods gently. Nakula smiles, accompanying her.',
      id: 'Nabula mengangguk pelan. Nakula tersenyum, menemaninya.'
    },
    action: 'lvl1_059a_complete',
    next: 'lvl1_060_narrator'
  },

  /* ── 059b: Jalur B (Lapor Orang Dewasa: 059b-1 s/d 059b-17) ── */
  lvl1_059b_1_nakula: {
    id: '059b-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"I will report to Bu Wati."',
      id: '"Aku akan lapor ke Bu Wati."'
    },
    next: 'lvl1_059b_2_ui'
  },
  lvl1_059b_2_ui: {
    id: '059b-2',
    speaker: { en: 'QUEST', id: 'QUEST' },
    portrait: null,
    text: {
      en: 'QUEST: "Find Bu Wati in the library."',
      id: 'QUEST: "Cari Bu Wati di perpustakaan."'
    },
    next: null,
    onCloseAction: 'lvl1_059b_start_quest'
  },
  lvl1_059b_5_nakula: {
    id: '059b-5',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"Bu Wati, I saw Nabula being bothered by Bagas and Rio in the cafeteria. This matches what I heard earlier here too."',
      id: '"Bu Wati, saya lihat Nabula diganggu Bagas dan Rio di kantin. Ini juga seperti yang saya dengar sebelumnya di sini."'
    },
    action: 'lvl1_059b_met_bu_wati',
    next: 'lvl1_059b_6_bu_wati'
  },
  lvl1_059b_6_bu_wati: {
    id: '059b-6',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"In that case, I need to see the situation for myself. Come lead me to the cafeteria."',
      id: '"Kalau begitu, ibu perlu lihat langsung situasinya. Ayo antar ibu ke kantin."'
    },
    next: 'lvl1_059b_7_effect'
  },
  lvl1_059b_7_effect: {
    id: '059b-7',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The screen dims momentarily as Bu Wati and Nakula head towards the cafeteria.',
      id: 'Layar menggelap sejenak, menandakan perjalanan Bu Wati dan Nakula menuju kantin.'
    },
    next: null,
    onCloseAction: 'lvl1_059b_transition_to_cafeteria'
  },
  lvl1_059b_8_effect: {
    id: '059b-8',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bu Wati and Nakula are now in the cafeteria, observing from a distance Bagas and Rio still sitting near Nabula, continuing to tease her.',
      id: 'Bu Wati dan Nakula kini berada di kantin, melihat dari kejauhan Bagas dan Rio masih duduk di dekat Nabula, terus menggodanya.'
    },
    next: null,
    onCloseAction: 'lvl1_059b_focus_bu_wati'
  },
  lvl1_059b_9_bu_wati: {
    id: '059b-9',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"You were right, Nakula. I see it myself now, they really are bothering Nabula."',
      id: '"Kamu benar, Nakula. Ibu lihat sendiri sekarang, mereka memang sedang mengganggu Nabula."'
    },
    next: 'lvl1_059b_10_nakula'
  },
  lvl1_059b_10_nakula: {
    id: '059b-10',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"Yes, Ma\'am. Nabula clearly looked uncomfortable the whole time."',
      id: '"Iya, Bu. Dari tadi juga kelihatan Nabula nggak nyaman."'
    },
    next: 'lvl1_059b_11_effect'
  },
  lvl1_059b_11_effect: {
    id: '059b-11',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bu Wati and Nakula automatically walk over to Nabula\'s table.',
      id: 'Bu Wati dan Nakula otomatis berjalan menghampiri meja Nabula.'
    },
    action: 'lvl1_059b_walk_to_table',
    noManualAdvance: true,
    next: 'lvl1_059b_12_bu_wati'
  },
  lvl1_059b_12_bu_wati: {
    id: '059b-12',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"Bagas, Rio, please come with me for a moment. Let\'s talk in the next room."',
      id: '"Bagas, Rio, tolong ikut Ibu sebentar. Kita bicara di ruang sebelah."'
    },
    next: 'lvl1_059b_13_bagas'
  },
  lvl1_059b_13_bagas: {
    id: '059b-13',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"...Yes, Ma\'am."',
      id: '"...Iya, Bu."'
    },
    next: 'lvl1_059b_14_narrator'
  },
  lvl1_059b_14_narrator: {
    id: '059b-14',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio stand up reluctantly near Bu Wati. No one is scolded publicly.',
      id: 'Bagas dan Rio berdiri dengan enggan di dekat Bu Wati. Tidak ada yang dimarahi di depan umum.'
    },
    next: 'lvl1_059b_15_bu_wati'
  },
  lvl1_059b_15_bu_wati: {
    id: '059b-15',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"Nabula, I will speak with them first. I\'ll meet with you again later calmly. Thank you for being brave. Nakula, thank you for reporting."',
      id: '"Nabula, Ibu bicara dulu dengan mereka, ya. Nanti Ibu temui kamu lagi dengan tenang. Terima kasih sudah berani. Nakula, terima kasih sudah lapor."'
    },
    next: 'lvl1_059b_15b_effect'
  },
  lvl1_059b_15b_effect: {
    id: '059b-15b',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The screen dims for a moment. Bu Wati, Bagas, and Rio leave the cafeteria table towards the next room.',
      id: 'Layar menggelap sejenak. Bu Wati, Bagas, dan Rio meninggalkan meja kantin menuju ruang sebelah.'
    },
    next: null,
    onCloseAction: 'lvl1_059b_bullies_leave_with_teacher'
  },
  lvl1_059b_15c_effect: {
    id: '059b-15c',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The screen brightens again. Only Nakula and Nabula remain at the cafeteria table.',
      id: 'Layar kembali terang. Hanya Nakula dan Nabula di meja kantin.'
    },
    next: 'lvl1_059b_16_nabula'
  },
  lvl1_059b_16_nabula: {
    id: '059b-16',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"They do that often... Thank you, Nakula, for reporting."',
      id: '"Mereka sering melakukan itu... Makasih, Nakula, sudah mau lapor."'
    },
    next: 'lvl1_059b_17_narrator'
  },
  lvl1_059b_17_narrator: {
    id: '059b-17',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula feels a bit relieved. Bu Wati will meet her again to hear her story and forward the report to the school administration.',
      id: 'Nabula merasa sedikit lega. Bu Wati akan menemuinya lagi untuk mendengarkan ceritanya dan meneruskan laporan kepada pihak sekolah.'
    },
    action: 'lvl1_059b_complete',
    next: 'lvl1_060_narrator'
  },

  /* ── 059c: Jalur C (Dukungan Emosional: 059c-1 s/d 059c-28) ── */
  lvl1_059c_1_narrator: {
    id: '059c-1',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula becomes increasingly uncomfortable and eats faster.',
      id: 'Nabula semakin tidak nyaman dan mempercepat makannya.'
    },
    action: 'lvl1_059c_focus_nabula',
    next: 'lvl1_059c_2_narrator'
  },
  lvl1_059c_2_narrator: {
    id: '059c-2',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Then she hastily stands up and leaves the cafeteria.',
      id: 'Lalu buru-buru berdiri dan meninggalkan kantin.'
    },
    action: 'lvl1_059c_nabula_runs_away',
    noManualAdvance: true,
    next: 'lvl1_059c_5_ui'
  },
  lvl1_059c_5_ui: {
    id: '059c-5',
    speaker: { en: 'QUEST', id: 'QUEST' },
    portrait: null,
    text: {
      en: 'QUEST: "Find Nabula in the garden."',
      id: 'QUEST: "Cari Nabula di taman."'
    },
    next: null,
    onCloseAction: 'lvl1_059c_start_garden_quest'
  },
  lvl1_059c_8_nakula: {
    id: '059c-8',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_worried',
    text: {
      en: '"Nabula, I came after you here..."',
      id: '"Nabula, aku nyusul kamu ke sini..."'
    },
    next: 'lvl1_059c_9_nabula'
  },
  lvl1_059c_9_nabula: {
    id: '059c-9',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_surprised',
    text: {
      en: '"Why did you come after me?"',
      id: '"Kamu ngapain nyusul aku?"'
    },
    next: 'lvl1_059c_10_nakula'
  },
  lvl1_059c_10_nakula: {
    id: '059c-10',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_worried',
    text: {
      en: '"I was worried. Back in the cafeteria you clearly looked uncomfortable."',
      id: '"Aku khawatir. Tadi di kantin kelihatan banget kamu nggak nyaman."'
    },
    next: 'lvl1_059c_11_nabula'
  },
  lvl1_059c_11_nabula: {
    id: '059c-11',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"I\'m used to it..."',
      id: '"Aku udah biasa, kok..."'
    },
    next: 'lvl1_059c_12_nakula'
  },
  lvl1_059c_12_nakula: {
    id: '059c-12',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Why do you never stand up to them when they bother you?"',
      id: '"Kenapa kamu nggak pernah melawan waktu mereka ganggu kamu?"'
    },
    next: 'lvl1_059c_13_nabula'
  },
  lvl1_059c_13_nabula: {
    id: '059c-13',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"I\'m scared, Nakula. If I fight back, they might bother me even more."',
      id: '"Aku takut, Nakula. Kalau aku ngelawan, mereka malah bisa makin sering ganggu aku."'
    },
    next: 'lvl1_059c_14_nakula'
  },
  lvl1_059c_14_nakula: {
    id: '059c-14',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"If you\'re scared of speaking directly to them, how about we tell a teacher? So someone can help watch over, and they won\'t dare bother you again."',
      id: '"Kalau kamu takut buat ngomong langsung ke mereka, gimana kalau kita cerita ke guru? Biar ada yang bantu awasin, jadi mereka nggak berani ganggu kamu lagi."'
    },
    next: 'lvl1_059c_15_nabula'
  },
  lvl1_059c_15_nabula: {
    id: '059c-15',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_worried',
    text: {
      en: '"Tell a teacher? But... what if it causes even more commotion?"',
      id: '"Cerita ke guru? Tapi... nanti malah tambah rame gimana?"'
    },
    next: 'lvl1_059c_16_nakula'
  },
  lvl1_059c_16_nakula: {
    id: '059c-16',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_serious',
    text: {
      en: '"It doesn\'t have to be a big fuss. We can just speak calmly with Bu Wati first."',
      id: '"Nggak harus langsung heboh, kok. Kita bisa cerita pelan-pelan ke Bu Wati dulu."'
    },
    next: 'lvl1_059c_17_eca'
  },
  lvl1_059c_17_eca: {
    id: '059c-17',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Hey, I agree with Nakula. Reporting doesn\'t mean making the problem bigger, in fact it\'s one of the safest ways for you."',
      id: '"Eh, aku setuju sama Nakula. Melapor itu bukan berarti bikin masalah makin besar, kok, justru itu salah satu cara paling aman buat kamu."'
    },
    next: 'lvl1_059c_18_nabula'
  },
  lvl1_059c_18_nabula: {
    id: '059c-18',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"I\'m... still a bit scared. But if you accompany me..."',
      id: '"Aku... masih agak takut. Tapi kalau ada kamu yang nemenin..."'
    },
    next: 'lvl1_059c_19_nakula'
  },
  lvl1_059c_19_nakula: {
    id: '059c-19',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"I will accompany you. You don\'t have to be alone."',
      id: '"Aku temenin. Kamu nggak harus sendirian."'
    },
    next: 'lvl1_059c_20_narrator'
  },
  lvl1_059c_20_narrator: {
    id: '059c-20',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula nods gently, then stands up together with Nakula.',
      id: 'Nabula mengangguk pelan, lalu berdiri bersama Nakula.'
    },
    next: 'lvl1_059c_21_ui'
  },
  lvl1_059c_21_ui: {
    id: '059c-21',
    speaker: { en: 'QUEST', id: 'QUEST' },
    portrait: null,
    text: {
      en: 'QUEST: "Meet Bu Wati in the library together with Nabula."',
      id: 'QUEST: "Temui Bu Wati di perpustakaan bersama Nabula."'
    },
    next: null,
    onCloseAction: 'lvl1_059c_transition_to_library'
  },
  lvl1_059c_23_effect: {
    id: '059c-23',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The screen brightens again. Nakula and Nabula are now inside the library.',
      id: 'Layar kembali terang. Nakula dan Nabula kini berada di dalam perpustakaan.'
    },
    next: 'lvl1_059c_24_effect'
  },
  lvl1_059c_24_effect: {
    id: '059c-24',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula and Nabula automatically walk in towards Bu Wati\'s desk.',
      id: 'Nakula dan Nabula otomatis berjalan masuk menuju meja Bu Wati.'
    },
    action: 'lvl1_059c_walk_to_wati',
    noManualAdvance: true,
    next: 'lvl1_059c_25_bu_wati'
  },
  lvl1_059c_25_bu_wati: {
    id: '059c-25',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"Nabula? Is there anything I can help you with?"',
      id: '"Nabula? Ada yang bisa Ibu bantu?"'
    },
    next: 'lvl1_059c_26_nabula'
  },
  lvl1_059c_26_nabula: {
    id: '059c-26',
    speaker: { en: 'Nabula', id: 'Nabula' },
    portrait: 'nabula_sad',
    text: {
      en: '"Ma\'am, I... I want to tell you about Bagas and Rio."',
      id: '"Bu, saya... saya mau cerita soal Bagas dan Rio."'
    },
    next: 'lvl1_059c_27_bu_wati'
  },
  lvl1_059c_27_bu_wati: {
    id: '059c-27',
    speaker: { en: 'Bu Wati', id: 'Bu Wati' },
    portrait: 'wati_neutral',
    text: {
      en: '"You can take your time to tell me, I\'m listening."',
      id: '"Kamu boleh cerita pelan-pelan, Ibu dengarkan."'
    },
    next: 'lvl1_059c_28_effect'
  },
  lvl1_059c_28_effect: {
    id: '059c-28',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nabula begins sharing her story, with Nakula standing supportively by her side.',
      id: 'Nabula mulai bercerita, ditemani Nakula di sampingnya.'
    },
    action: 'lvl1_059c_complete',
    next: 'lvl1_060_narrator'
  },

  /* ── 060: Titik Temu Ketiga Jalur (060 s/d 060c) ── */
  lvl1_060_narrator: {
    id: '060',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula realizes that Nabula\'s problem has actually been going on in multiple places, not just an isolated incident.',
      id: 'Nakula menyadari bahwa masalah Nabula ternyata sudah berlangsung di beberapa tempat dan bukan hanya kejadian sekali.'
    },
    next: 'lvl1_060b_narrator'
  },
  lvl1_060b_narrator: {
    id: '060b',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'From a distance, Wulan observes Nakula and Nabula. She seems like she wants to approach, but ends up gripping her bag tightly and turning away slowly.',
      id: 'Dari kejauhan, Wulan memperhatikan Nakula dan Nabula. Ia tampak ingin mendekat, tapi akhirnya hanya menggenggam tasnya erat-erat dan berbalik pergi pelan-pelan.'
    },
    action: 'lvl1_060b_focus_wulan',
    next: 'lvl1_060c_eca'
  },
  lvl1_060c_eca: {
    id: '060c',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_neutral',
    text: {
      en: '"Sometimes a friend who knows something is also scared to speak up. That\'s natural. We can\'t force them, but we can show that we\'re ready to listen."',
      id: '"Kadang teman yang tahu sesuatu juga takut buat bicara. Itu wajar, lho. Kita nggak bisa maksa, tapi kita bisa tunjukin kalau kita siap mendengarkan."'
    },
    next: null,
    onCloseAction: 'lvl1_060c_finish_stage3'
  },

  /* ── Babak 4D: Refleksi & Evaluasi (Node 061 s/d 064) ── */
  lvl1_061a_eca: {
    id: '061a',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_serious',
    text: {
      en: '"You were really brave to speak up directly to them earlier. This method is quick and assertive, but can carry risks if they get angry. That\'s why adults still need to help look out for Nabula."',
      id: '"Tadi kamu berani banget langsung bicara ke mereka. Cara ini cepat dan tegas, tapi bisa berisiko kalau mereka malah marah. Makanya orang dewasa tetap perlu ikut menjaga Nabula."'
    },
    next: 'lvl1_062_eca'
  },
  lvl1_061b_eca: {
    id: '061b',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_serious',
    text: {
      en: '"You went straight to get an adult\'s help earlier. That\'s awesome. This method is safer, though it takes time for adults to step in. Knowing when to ask for help is also a form of courage."',
      id: '"Kamu langsung cari bantuan orang dewasa tadi. Itu keren, lho. Cara ini lebih aman, tapi butuh waktu sampai orang dewasa bertindak. Tahu kapan harus minta tolong juga bentuk keberanian."'
    },
    next: 'lvl1_062_eca'
  },
  lvl1_061b_x_eca: {
    id: '061b-x',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_serious',
    text: {
      en: '"Hesitated for a moment earlier, huh? It\'s okay, what matters is you ultimately still sought help for Nabula. Next time, try to believe in yourself more."',
      id: '"Sempat ragu tadi, ya? Nggak apa-apa, yang penting akhirnya kamu tetap nyari bantuan buat Nabula. Lain kali, coba lebih percaya sama diri sendiri."'
    },
    next: 'lvl1_062_eca'
  },
  lvl1_061c_eca: {
    id: '061c',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_serious',
    text: {
      en: '"You listened to Nabula first before taking action earlier. She felt accompanied, but the problem hasn\'t stopped on its own, so adult support remains vital. I like your way."',
      id: '"Kamu dengerin Nabula dulu sebelum bertindak tadi. Dia merasa ditemani, tapi masalahnya belum berhenti sendiri, jadi bantuan orang dewasa tetap penting. Aku suka caramu."'
    },
    next: 'lvl1_062_eca'
  },
  lvl1_061c_x_eca: {
    id: '061c-x',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_serious',
    text: {
      en: '"You were a bit confused about what to do earlier, but in the end you still approached Nabula. That\'s also an effort, even if a little late."',
      id: '"Tadi kamu sempat bingung harus ngapain, tapi akhirnya kamu tetap nyamperin Nabula. Itu juga bentuk usaha, lho, biarpun telat dikit."'
    },
    next: 'lvl1_062_eca'
  },
  lvl1_062_eca: {
    id: '062',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_happy',
    text: {
      en: '"Peluk atau berikan dukungan hangat untuk teman yang sedang sedih. Terima kasih sudah belajar menjadi teman yang peduli hari ini!"',
      id: '"Peluk atau berikan dukungan hangat untuk teman yang sedang sedih. Terima kasih sudah belajar menjadi teman yang peduli hari ini!"'
    },
    action: { type: 'vibrate', pattern: [60, 40, 60] },
    next: 'lvl1_062_routes_info'
  },
  lvl1_062_routes_info: {
    id: '062-info',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Every approach has its strengths: speaking up directly, reporting to an adult, or listening with empathy first.',
      id: 'Setiap cara memiliki kelebihan: bicara langsung dengan tegas, melapor ke orang dewasa dengan aman, atau mendengarkan teman terlebih dahulu.'
    },
    action: { type: 'vibrate', pattern: 60 },
    next: 'lvl1_063_narrator'
  },
  lvl1_063_narrator: {
    id: '063',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'LEVEL 1 COMPLETE: "Help Nabula get the support she needs."',
      id: 'LEVEL 1 SELESAI: "Bantu Nabula mendapatkan dukungan."'
    },
    action: 'lvl1_063_transition_to_064',
    next: null
  },
  lvl1_064a_eca: {
    id: '064a-1',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_happy',
    text: {
      en: '"You were brave enough to speak up directly. Want to continue or try another way?"',
      id: '"Kamu sudah berani bicara langsung. Mau lanjut atau coba cara lain?"'
    },
    next: null,
    onCloseAction: 'lvl1_064_show_completion_modal'
  },
  lvl1_064b_eca: {
    id: '064b-1',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_happy',
    text: {
      en: '"You reported to an adult. Awesome! Want to continue or try another way?"',
      id: '"Kamu sudah melapor ke orang dewasa. Hebat! Mau lanjut atau coba cara lain?"'
    },
    next: null,
    onCloseAction: 'lvl1_064_show_completion_modal'
  },
  lvl1_064c_eca: {
    id: '064c-1',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_happy',
    text: {
      en: '"You listened to Nabula first. Very cool! Want to continue or try another way?"',
      id: '"Kamu sudah mendengarkan Nabula dulu. Keren! Mau lanjut atau coba cara lain?"'
    },
    next: null,
    onCloseAction: 'lvl1_064_show_completion_modal'
  },
  lvl1_064x_eca: {
    id: '064x-1',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'player_worried',
    text: {
      en: '"You\'ve tried to help Nabula, and that matters. Let\'s try again and pay close attention to signs when a friend needs you!"',
      id: '"Kamu sudah berusaha menolong Nabula, dan itu penting. Yuk, coba lagi dan perhatikan tanda-tanda saat teman butuh kamu!"'
    },
    next: null,
    onCloseAction: 'lvl1_064_show_completion_modal'
  }
};

// Auto-register into global DIALOGUES
if (typeof window !== 'undefined') {
  window.DIALOGUES = window.DIALOGUES || {};
  Object.assign(window.DIALOGUES, window.LEVEL_1_DIALOGUES);
}
