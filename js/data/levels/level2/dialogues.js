/* ───────────── data / levels / level2 / dialogues.js ─────────────
   CARE-TECH: Harmonia School — Level 2: Managing Emotions (Mengelola Emosi)
   Source: script/skrip_level2.md (Nodes 001 - 033)
   ─────────────────────────────────────────────────────────────── */

window.LEVEL_2_DIALOGUES = {

  /* ── 001: Bel Masuk Kelas Berbunyi & Nakula Mengerjakan Tugas ── */
  lvl2_001_narrator: {
    id: '001',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The recess bell rings. Nakula returns to his desk, working on his class assignment.',
      id: 'Bel tanda istirahat selesai berbunyi. Nakula kembali duduk di bangkunya, mengerjakan tugas kelas.'
    },
    action: 'lvl2_001_intro',
    next: 'lvl2_002_effect'
  },

  /* ── 002: Efek Kamera Mengikuti Bagas & Rio Masuk Kelas ── */
  lvl2_002_effect: {
    id: '002',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula watches as Bagas and Rio enter the classroom and walk over to their desks.',
      id: 'Nakula melihat Bagas dan Rio masuk kelas. Kamera mengikuti keduanya berjalan menuju bangku masing-masing, lalu kembali mengarah ke Nakula.'
    },
    action: 'lvl2_002_bullies_enter',
    noManualAdvance: true,
    next: 'lvl2_003_narrator'
  },

  /* ── 003: Reaksi Fisik Nakula ── */
  lvl2_003_narrator: {
    id: '003',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: "Nakula's chest feels a bit tight. His hands subconsciously clench into fists on top of the desk.",
      id: 'Dada Nakula terasa sedikit sesak. Tangannya tanpa sadar mengepal di atas meja.'
    },
    next: 'lvl2_004_eca'
  },

  /* ── 004: Eca Memperhatikan ── */
  lvl2_004_eca: {
    id: '004',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_thinking',
    text: {
      en: '"Nakula, I noticed you suddenly went quiet. Is something wrong?"',
      id: '"Nakula, aku lihat kamu tiba-tiba diam. Ada apa?"'
    },
    next: 'lvl2_005_nakula'
  },

  /* ── 005: Ungkapan Perasaan Nakula ── */
  lvl2_005_nakula: {
    id: '005',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"I... I don\'t know. Just looking at Bagas and Rio still makes me really upset."',
      id: '"Aku... nggak tahu. Lihat Bagas sama Rio aja rasanya masih kesel."'
    },
    next: 'lvl2_006_eca'
  },

  /* ── 006: Validasi dari Eca ── */
  lvl2_006_eca: {
    id: '006',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"That\'s completely natural. I\'ve felt that way too — frustration takes time to cool down."',
      id: '"Wajar, kok. Aku juga pernah ngerasa gitu, perasaan kesal emang butuh waktu buat reda."'
    },
    next: 'lvl2_007_choice'
  },

  /* ── 007: Pilihan Respon Awal ── */
  lvl2_007_choice: {
    id: '007',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: 'What will you do with this feeling?',
      id: 'Apa yang ingin kamu lakukan dengan perasaan ini?'
    },
    choices: [
      {
        label: {
          en: '"I want to go confront them right now."',
          id: '"Aku mau samperin mereka sekarang."'
        },
        harmonyDelta: 0,
        action: 'lvl2_choice_008a',
        next: 'lvl2_008a_1_nakula'
      },
      {
        label: {
          en: '"I\'ll just stay quiet, it\'ll fade on its own."',
          id: '"Aku diem aja, nanti juga reda sendiri."'
        },
        harmonyDelta: 5,
        action: 'lvl2_choice_008b',
        next: 'lvl2_008b_1_nakula'
      },
      {
        label: {
          en: '"I\'ll tell Eca first about how I\'m feeling."',
          id: '"Aku cerita dulu ke Eca gimana perasaanku."'
        },
        harmonyDelta: 25,
        action: 'lvl2_choice_008c',
        next: 'lvl2_008c_1_nakula'
      }
    ]
  },

  /* ══════════ JALUR 1: 008a (Ingin Menghampiri Langsung) ══════════ */
  lvl2_008a_1_nakula: {
    id: '008a-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"I want to go confront them right now."',
      id: '"Aku mau samperin mereka sekarang."'
    },
    action: 'lvl2_008a_nakula_steps_up',
    next: 'lvl2_008a_2_effect'
  },
  lvl2_008a_2_effect: {
    id: '008a-2',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula stands up and instinctively takes several brisk steps towards Bagas and Rio.',
      id: 'Nakula berdiri dan otomatis melangkah beberapa langkah ke arah Bagas dan Rio.'
    },
    action: 'lvl2_008a_walk_forward',
    noManualAdvance: true,
    next: 'lvl2_008a_3_eca'
  },
  lvl2_008a_3_eca: {
    id: '008a-3',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text: {
      en: '"Whoa, wait! You\'re walking really fast, you look super upset! Think about it — if you confront them right now, what will happen?"',
      id: '"Eh, tunggu! Kamu jalannya cepet banget, kelihatan kesel banget ya? Coba deh, kalau kamu samperin sekarang, kira-kira bakal jadi gimana?"'
    },
    next: 'lvl2_008a_4_choice'
  },
  lvl2_008a_4_choice: {
    id: '008a-4',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text: {
      en: 'What is your decision?',
      id: 'Bagaimana keputusanmu?'
    },
    choices: [
      {
        label: {
          en: '"Okay, let me calm down first."',
          id: '"Oke, coba tenangin dulu, deh."'
        },
        harmonyDelta: 20,
        action: 'lvl2_choice_008a_calm',
        next: 'lvl2_008a_4a_nakula'
      },
      {
        label: {
          en: '"No, I still want to confront them right now!"',
          id: '"Nggak, aku tetap mau samperin sekarang."'
        },
        harmonyDelta: -25,
        action: 'lvl2_choice_008w_confront',
        next: 'lvl2_008w_0_nakula'
      }
    ]
  },
  lvl2_008a_4a_nakula: {
    id: '008a-4a',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Okay, let me calm down first."',
      id: '"Oke, coba tenangin dulu, deh."'
    },
    next: 'lvl2_008a_5_nakula'
  },
  lvl2_008a_5_nakula: {
    id: '008a-5',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"I... I would probably end up saying something harsh, wouldn\'t I?"',
      id: '"Aku... mungkin bakal ngomong kasar, ya."'
    },
    next: 'lvl2_008a_6_eca'
  },
  lvl2_008a_6_eca: {
    id: '008a-6',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"How about we calm down first, and then decide what to do? I\'m here to help you."',
      id: '"Gimana kalau kita tenangin dulu, baru kita mikirin mau ngapain? Aku mau bantu, kok."'
    },
    next: 'lvl2_008a_7_effect'
  },
  lvl2_008a_7_effect: {
    id: '008a-7',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula stops in his tracks, taking a deep, long breath.',
      id: 'Nakula berhenti melangkah, menarik napas panjang.'
    },
    next: 'lvl2_008a_8_effect'
  },
  lvl2_008a_8_effect: {
    id: '008a-8',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula turns around and walks back to his desk.',
      id: 'Nakula otomatis kembali berjalan ke bangkunya.'
    },
    action: 'lvl2_008a_return_to_desk',
    noManualAdvance: true,
    next: 'lvl2_008d_eca'
  },

  /* ══════════ JALUR W: 008w (Emosi Meledak di Depan Bullies) ══════════ */
  lvl2_008w_0_nakula: {
    id: '008w-0',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"No, I still want to confront them right now!"',
      id: '"Nggak, aku tetap mau samperin sekarang."'
    },
    next: 'lvl2_008w_1_effect'
  },
  lvl2_008w_1_effect: {
    id: '008w-1',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: "Nakula keeps advancing and marches straight up to Bagas and Rio's desks. His voice rises loudly.",
      id: 'Nakula tetap melangkah, menghampiri meja Bagas dan Rio. Suaranya meninggi.'
    },
    action: 'lvl2_008w_approach_bullies',
    noManualAdvance: true,
    next: 'lvl2_008w_2_nakula'
  },
  lvl2_008w_2_nakula: {
    id: '008w-2',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"You two are so incredibly annoying, you know that?!"',
      id: '"Kalian itu nyebelin banget, tau nggak?!"'
    },
    next: 'lvl2_008w_3_bagas'
  },
  lvl2_008w_3_bagas: {
    id: '008w-3',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Huh? What\'s your problem, why are you yelling out of nowhere?"',
      id: '"Hah? Kamu kenapa, sih, tiba-tiba marah-marah?"'
    },
    next: 'lvl2_008w_4_rio'
  },
  lvl2_008w_4_rio: {
    id: '008w-4',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_neutral',
    text: {
      en: '"Yeah, what a weirdo!"',
      id: '"Iya, aneh banget kamu!"'
    },
    next: 'lvl2_008w_5_narrator'
  },
  lvl2_008w_5_narrator: {
    id: '008w-5',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The classroom atmosphere turns tense. Several classmates turn around to look at them.',
      id: 'Suasana kelas jadi tegang. Beberapa teman lain mulai melihat ke arah mereka.'
    },
    next: 'lvl2_008w_6_eca'
  },
  lvl2_008w_6_eca: {
    id: '008w-6',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text: {
      en: '"Nakula... this is what I was worried about. When anger isn\'t managed first, it often creates brand new problems."',
      id: '"Nakula... ini yang aku khawatirin. Kalau emosinya nggak dikelola dulu, kadang malah bikin masalah baru."'
    },
    next: 'lvl2_008w_7_choice'
  },
  lvl2_008w_7_choice: {
    id: '008w-7',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text: {
      en: 'How will you respond?',
      id: 'Bagaimana tindakanmu sekarang?'
    },
    choices: [
      {
        label: {
          en: '"I... apologize for how I spoke just now."',
          id: '"Aku... minta maaf soal caraku ngomong tadi."'
        },
        harmonyDelta: 10,
        action: 'lvl2_choice_008w_apologize',
        next: 'lvl2_008w_8a_nakula'
      },
      {
        label: {
          en: '"Forget it, I\'m not apologizing."',
          id: '"Biar aja, aku nggak minta maaf."'
        },
        harmonyDelta: 0,
        action: 'lvl2_choice_008w_no_apology',
        next: 'lvl2_008w_8b0_nakula'
      }
    ]
  },
  lvl2_008w_8a_nakula: {
    id: '008w-8a',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"I\'m sorry... I spoke harshly just now. I was really frustrated, but I shouldn\'t have taken it out on you like that."',
      id: '"Maaf... tadi aku ngomongnya kasar. Aku lagi kesel, tapi harusnya nggak kayak gitu ke kalian."'
    },
    next: 'lvl2_008w_9a_bagas'
  },
  lvl2_008w_9a_bagas: {
    id: '008w-9a',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Hmm... you definitely caught us off guard."',
      id: '"Hmm... tadi kamu lumayan ngagetin, sih."'
    },
    next: 'lvl2_008w_9b_rio'
  },
  lvl2_008w_9b_rio: {
    id: '008w-9b',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_neutral',
    text: {
      en: '"Yeah. But... thanks for saying sorry."',
      id: '"Iya. Tapi... makasih udah mau bilang maaf."'
    },
    next: 'lvl2_008w_10a_effect'
  },
  lvl2_008w_10a_effect: {
    id: '008w-10a',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio nod slowly. The mood remains a bit awkward, but the tension begins to dissipate. Nakula returns to his desk.',
      id: 'Bagas dan Rio mengangguk pelan. Suasana masih canggung, tapi ketegangannya mulai mereda. Nakula kembali ke bangkunya.'
    },
    action: 'lvl2_008w_return_to_desk',
    noManualAdvance: true,
    next: 'lvl2_008d_eca'
  },
  lvl2_008w_8b0_nakula: {
    id: '008w-8b0',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"Forget it, I\'m not apologizing."',
      id: '"Biar aja, aku nggak minta maaf."'
    },
    next: 'lvl2_008w_8b_narrator'
  },
  lvl2_008w_8b_narrator: {
    id: '008w-8b',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula walks back to his desk with mixed feelings. Bagas and Rio still look visibly annoyed.',
      id: 'Nakula kembali ke bangkunya dengan perasaan campur aduk. Bagas dan Rio masih terlihat kesal.'
    },
    action: 'lvl2_008w_return_to_desk',
    noManualAdvance: true,
    next: 'lvl2_008d_eca'
  },

  /* ── 008d: Refleksi Fisik Emosi (Jalur 008a & 008w) ── */
  lvl2_008d_eca: {
    id: '008d',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"Earlier when you were upset, how did your body feel? Usually our chest tightens or our fists clench. Those are signals from your body when frustration builds up, triggered by remembering Nabula being picked on."',
      id: '"Tadi pas kesel, badanmu kerasa gimana? Biasanya dada jadi sesak atau tangan ngepal. Itu tanda tubuh kalau kita lagi kesal, dan kesalnya muncul karena kamu ingat Nabula diganggu."'
    },
    next: 'lvl2_009_eca'
  },

  /* ══════════ JALUR 2: 008b (Memendam Rasa Sendiri) ══════════ */
  lvl2_008b_1_nakula: {
    id: '008b-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"I\'ll just stay quiet, it\'ll fade on its own."',
      id: '"Aku diem aja, nanti juga reda sendiri."'
    },
    next: 'lvl2_008b_2_narrator'
  },
  lvl2_008b_2_narrator: {
    id: '008b-2',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula tries to focus back on his assignment, but his hand remains tense and his thoughts keep drifting back to them.',
      id: 'Nakula kembali fokus ke tugasnya, tapi tangannya masih terasa tegang dan pikirannya tetap teralih ke mereka.'
    },
    next: 'lvl2_008b_3_eca'
  },
  lvl2_008b_3_eca: {
    id: '008b-3',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_thinking',
    text: {
      en: '"Hey, I noticed you\'re gripping that pencil really hard. Are you sure it\'s okay to just leave it unaddressed?"',
      id: '"Eh, aku perhatiin kamu masih megang pensil erat banget, deh. Yakin nih nggak apa-apa didiemin aja?"'
    },
    next: 'lvl2_008b_4_nakula'
  },
  lvl2_008b_4_nakula: {
    id: '008b-4',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"I... I guess I\'m not really sure either."',
      id: '"Aku... nggak yakin juga, sih."'
    },
    next: 'lvl2_008b_5_narrator'
  },
  lvl2_008b_5_narrator: {
    id: '008b-5',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula sighs, trying to sit quietly at his desk.',
      id: 'Nakula menghela napas, mencoba kembali fokus duduk tenang di bangkunya.'
    },
    next: 'lvl2_008b_6_narrator'
  },
  lvl2_008b_6_narrator: {
    id: '008b-6',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: '(+10 Self-Awareness) Nakula decides to try another way: opening up to Eca about how he feels.',
      id: 'Nakula memutuskan mencoba cara lain: bercerita ke Eca tentang perasaannya.'
    },
    action: 'lvl2_008b_self_awareness',
    next: 'lvl2_008c_1_nakula'
  },

  /* ══════════ JALUR 3: 008c (Bercerita ke Eca) ══════════ */
  lvl2_008c_1_nakula: {
    id: '008c-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"I\'ll tell Eca first about how I\'m feeling."',
      id: '"Aku cerita dulu ke Eca gimana perasaanku."'
    },
    next: 'lvl2_008c_2_eca'
  },
  lvl2_008c_2_eca: {
    id: '008c-2',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"I\'d love to listen! How does your body feel right now?"',
      id: '"Wah, boleh banget! Aku juga penasaran, nih. Badan kamu lagi kerasa gimana sekarang?"'
    },
    next: 'lvl2_008c_3_nakula'
  },
  lvl2_008c_3_nakula: {
    id: '008c-3',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"My chest feels tight, and my hands clenched into fists on their own."',
      id: '"Dadaku sesak, terus tanganku ngepal sendiri."'
    },
    next: 'lvl2_008c_4_eca'
  },
  lvl2_008c_4_eca: {
    id: '008c-4',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"That\'s your body telling you you\'re upset. It\'s okay, that is a completely normal reaction."',
      id: '"Itu tandanya kamu lagi kesal. Nggak apa-apa, itu perasaan yang wajar."'
    },
    next: 'lvl2_009_eca'
  },

  /* ══════════ 009 - 013: MINI-GAME PERNAPASAN BERSAMA ECA ══════════ */
  lvl2_009_eca: {
    id: '009',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_excited',
    text: {
      en: '"How about we try calming down together first? Come on, follow me!"',
      id: '"Gimana kalau kita coba sama-sama menenangkan diri dulu? Yuk, ikuti aku."'
    },
    next: 'lvl2_010_ui'
  },
  lvl2_010_ui: {
    id: '010',
    speaker: { en: 'MINI-GAME', id: 'MINI-GAME' },
    portrait: null,
    text: {
      en: 'Hold ECA\'s hand and breathe along with the animation (Inhale, Hold, Exhale — 3 rounds).',
      id: 'Genggam tangan Eca, lalu tarik napas mengikuti animasi (tarik, tahan, buang, 3x putaran).'
    },
    action: 'lvl2_start_breathing_minigame',
    noManualAdvance: true,
    next: 'lvl2_011_narrator'
  },
  lvl2_011_narrator: {
    id: '011',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula breathes out slowly, his grip easing with every exhale. His body begins to feel much more relaxed.',
      id: 'Nakula menarik napas perlahan, genggamannya melonggar seiring napas dilepaskan. Tubuhnya mulai terasa lebih rileks.'
    },
    next: 'lvl2_012_eca'
  },
  lvl2_012_eca: {
    id: '012',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_happy',
    text: {
      en: '"How are you feeling right now?"',
      id: '"Gimana rasanya sekarang?"'
    },
    next: 'lvl2_013_nakula'
  },
  lvl2_013_nakula: {
    id: '013',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_relieved',
    text: {
      en: '"A bit better... not tight like earlier."',
      id: '"Agak mendingan... nggak sesak kayak tadi."'
    },
    action: 'lvl2_route_feedback',
    next: null
  },
  lvl2_014a_eca: {
    id: '014a',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_happy',
    text: {
      en: '"Awesome! I thought you were going to march straight up to them, but you held back and gave yourself a moment. I\'m so relieved!"',
      id: '"Keren! Aku tadi sempet mikir kamu bakal langsung samperin mereka, eh ternyata kamu bisa nahan diri. Aku ikut lega, deh."'
    },
    next: 'lvl2_015_narrator'
  },
  lvl2_014w_eca: {
    id: '014w',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"You had an outburst earlier, but you managed to calm down again. I\'m relieved. Next time, let\'s pause for a second before the anger bursts out, okay?"',
      id: '"Tadi kamu sempat meledak, tapi sekarang kamu bisa tenang lagi. Aku ikut lega, deh. Lain kali, kita coba berhenti sejenak sebelum emosinya keluar, ya."'
    },
    next: 'lvl2_015_narrator'
  },

  /* ══════════ BABAK 2: KANTIN (015 - 020) ══════════ */
  lvl2_015_narrator: {
    id: '015',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'The recess bell chimes in the distance.',
      id: 'Bel tanda istirahat berbunyi dari kejauhan.'
    },
    action: 'lvl2_school_bell',
    next: 'lvl2_016_quest'
  },
  lvl2_016_quest: {
    id: '016',
    speaker: { en: 'QUEST', id: 'QUEST' },
    portrait: null,
    text: {
      en: 'QUEST: "Go to the cafeteria during recess."',
      id: 'QUEST: "Pergi ke kantin saat istirahat."'
    },
    next: null,
    onCloseAction: 'lvl2_start_cafeteria_quest'
  },
  lvl2_018_effect: {
    id: '018',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio are already seen queueing at the cafeteria counter.',
      id: 'Bagas dan Rio sudah terlihat mengantre di konter kantin.'
    },
    action: 'lvl2_018_focus_queue',
    noManualAdvance: true,
    next: 'lvl2_019_effect'
  },
  lvl2_019_effect: {
    id: '019',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula walks up and joins the queue right behind them.',
      id: 'Nakula mendekat dan ikut mengantre tepat di belakang mereka.'
    },
    action: 'lvl2_019_nakula_joins_queue',
    noManualAdvance: true,
    next: 'lvl2_019a_narrator'
  },
  lvl2_019a_narrator: {
    id: '019a',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Faintly, Nakula hears Bagas and Rio chatting in front of him. That familiar irritation bubbles up again, just like in the classroom.',
      id: 'Samar-samar, Nakula mendengar Bagas dan Rio mengobrol di depannya. Perasaan kesal muncul lagi, persis seperti tadi di kelas.'
    },
    next: 'lvl2_020_choice'
  },
  lvl2_020_choice: {
    id: '020',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text: {
      en: 'Quick, what will you do?',
      id: 'Cepat, apa yang akan kamu lakukan?'
    },
    timedChoice: true,
    timeoutDuration: 30000,
    timeoutNode: 'lvl2_020_timeout_eca',
    choices: [
      {
        label: {
          en: '"Take a deep breath like before, then greet them."',
          id: '"Tarik napas seperti tadi, lalu sapa mereka."'
        },
        harmonyDelta: 10,
        action: 'lvl2_choice_020_calm',
        next: 'lvl2_020a_0_nakula'
      },
      {
        label: {
          en: '"Go confront and scold them again!"',
          id: '"Samperin dan tegur lagi!"'
        },
        harmonyDelta: -35,
        action: 'lvl2_choice_020_confront',
        next: 'lvl2_020w_0_nakula'
      }
    ]
  },
  lvl2_020_timeout_eca: {
    id: '020-x',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"Stay calm, no need to rush. Remember, you can take a deep breath first."',
      id: '"Tenang, nggak perlu buru-buru. Ingat tadi kamu bisa tarik napas dulu, lho."'
    },
    next: 'lvl2_020_choice'
  },

  /* ══════════ ENDING ALTERNATIF: 020w (Meledak Lagi di Kantin) ══════════ */
  lvl2_020w_0_nakula: {
    id: '020w-0',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"Go confront and scold them again!"',
      id: '"Samperin dan tegur lagi!"'
    },
    next: 'lvl2_020w_1_effect'
  },
  lvl2_020w_1_effect: {
    id: '020w-1',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula steps forward and confronts them angrily once more, his voice booming.',
      id: 'Nakula maju dan langsung menegur mereka lagi, suaranya meninggi.'
    },
    action: 'lvl2_020w_confront_bullies',
    next: 'lvl2_020w_2_nakula'
  },
  lvl2_020w_2_nakula: {
    id: '020w-2',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_angry',
    text: {
      en: '"You two are still just as obnoxious as ever!"',
      id: '"Kalian masih aja nyebelin, deh!"'
    },
    next: 'lvl2_020w_3_bagas'
  },
  lvl2_020w_3_bagas: {
    id: '020w-3',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Huh? What now?!"',
      id: '"Lho? Kenapa lagi, sih?"'
    },
    next: 'lvl2_020w_4_rio'
  },
  lvl2_020w_4_rio: {
    id: '020w-4',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_neutral',
    text: {
      en: '"Yeah, we haven\'t even done anything yet..."',
      id: '"Iya, kita kan belum ngapa-ngapain..."'
    },
    next: 'lvl2_020w_5_eca'
  },
  lvl2_020w_5_eca: {
    id: '020w-5',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_panic',
    text: {
      en: '"Nakula... this is exactly what I was worried about. Unmanaged anger only creates more problems."',
      id: '"Nakula... ini persis yang aku khawatirkan. Kesel yang nggak dikelola bisa bikin masalah baru lagi."'
    },
    action: 'lvl2_020w_bad_ending_complete',
    next: null
  },

  /* ══════════ JALUR REKONSILIASI: 020a -> 028d ══════════ */
  lvl2_020a_0_nakula: {
    id: '020a-0',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Take a deep breath like before, then greet them."',
      id: '"Tarik napas seperti tadi, lalu sapa mereka."'
    },
    next: 'lvl2_020a_narrator'
  },
  lvl2_020a_narrator: {
    id: '020a',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Nakula takes a slow breath and composes himself, exactly as practiced in class.',
      id: 'Nakula menarik napas, menahan diri, persis seperti yang dilatih tadi di kelas.'
    },
    next: 'lvl2_021_nakula'
  },
  lvl2_021_nakula: {
    id: '021',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Hi, Bagas. Hi, Rio."',
      id: '"Hai, Bagas. Hai, Rio."'
    },
    next: 'lvl2_022_effect'
  },
  lvl2_022_effect: {
    id: '022',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio turn around and look at each other hesitantly. Bagas scratches the back of his head.',
      id: 'Bagas dan Rio menoleh dan saling berpandangan sejenak. Mereka tampak ragu, lalu Bagas menggaruk kepalanya.'
    },
    action: 'lvl2_022_bullies_turn_around',
    next: 'lvl2_023_bagas'
  },
  lvl2_023_bagas: {
    id: '023',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Actually... about earlier, we wanted to apologize to you, Nakula. We know you must have been furious seeing us bother Nabula."',
      id: '"Sebenarnya... soal tadi, kita mau minta maaf ke kamu, Nakula. Kita tahu kamu pasti kesel lihat kita ganggu Nabula terus."'
    },
    next: 'lvl2_024_rio'
  },
  lvl2_024_rio: {
    id: '024',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_neutral',
    text: {
      en: '"Yeah. Afterwards, it really weighed on our minds... we saw how sad it made her."',
      id: '"Iya. Habis itu kepikiran juga, sih, ternyata bikin dia sedih banget."'
    },
    next: 'lvl2_025_choice'
  },
  lvl2_025_choice: {
    id: '025',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: 'How will you respond to their apology?',
      id: 'Bagaimana tanggapanmu terhadap permintaan maaf mereka?'
    },
    choices: [
      {
        label: {
          en: '"Okay, I accept your apology. But please don\'t repeat it."',
          id: '"Oke, aku terima permintaan maaf kalian. Tapi jangan diulang lagi, ya."'
        },
        harmonyDelta: 15,
        action: 'lvl2_choice_025_accept',
        next: 'lvl2_026_nakula'
      },
      {
        label: {
          en: '"I\'m not ready to accept it just yet."',
          id: '"Aku belum bisa terima sekarang."'
        },
        harmonyDelta: 5,
        action: 'lvl2_choice_025_need_time',
        next: 'lvl2_025w_1_nakula'
      }
    ]
  },
  lvl2_026_nakula: {
    id: '026',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_happy',
    text: {
      en: '"Okay, I accept your apology. But please don\'t repeat it, okay?"',
      id: '"Oke, aku terima permintaan maaf kalian. Tapi jangan diulang lagi, ya."'
    },
    next: 'lvl2_027_bagas'
  },
  lvl2_027_bagas: {
    id: '027',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Thank you, Nakula. We promise we won\'t do it again."',
      id: '"Makasih, Nakula. Kita janji nggak akan ngulang lagi."'
    },
    next: 'lvl2_028_narrator'
  },
  lvl2_025w_1_nakula: {
    id: '025w-1',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_sad',
    text: {
      en: '"I\'m not ready to accept it just yet."',
      id: '"Aku belum bisa terima sekarang."'
    },
    next: 'lvl2_025w_2_bagas'
  },
  lvl2_025w_2_bagas: {
    id: '025w-2',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"Yeah, that\'s totally understandable. We get it."',
      id: '"Iya, nggak apa-apa. Kita ngerti kok."'
    },
    next: 'lvl2_025w_3_eca'
  },
  lvl2_025w_3_eca: {
    id: '025w-3',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"It\'s completely okay if you still need time. Your feelings are valid, and you communicated them calmly. That in itself is wonderful."',
      id: '"Nggak apa-apa kalau kamu masih butuh waktu. Perasaanmu itu wajar, dan kamu tetap bicara dengan tenang. Itu sudah bagus."'
    },
    next: 'lvl2_028_narrator'
  },
  lvl2_028_narrator: {
    id: '028',
    speaker: { en: 'Narator', id: 'Narator' },
    portrait: null,
    text: {
      en: 'Bagas and Rio pause for a moment, then exchange glances.',
      id: 'Bagas dan Rio terdiam sejenak, lalu saling pandang.'
    },
    next: 'lvl2_028b_bagas'
  },
  lvl2_028b_bagas: {
    id: '028b',
    speaker: { en: 'Bagas', id: 'Bagas' },
    portrait: 'bagas_neutral',
    text: {
      en: '"One more thing... the one we hurt the most was Nabula. We really want to apologize to her directly too, but we\'re still unsure how to approach her."',
      id: '"Satu lagi... yang paling salah itu ke Nabula. Kita pengen minta maaf ke dia juga, tapi masih bingung caranya."'
    },
    next: 'lvl2_028c_rio'
  },
  lvl2_028c_rio: {
    id: '028c',
    speaker: { en: 'Rio', id: 'Rio' },
    portrait: 'rio_neutral',
    text: {
      en: '"Yeah. We\'ll look for the right opportunity to talk with Nabula."',
      id: '"Iya. Nanti kita cari kesempatan yang pas buat ngomong sama Nabula."'
    },
    next: 'lvl2_028d_nakula'
  },
  lvl2_028d_nakula: {
    id: '028d',
    speaker: { en: 'Nakula', id: 'Nakula' },
    portrait: 'player_neutral',
    text: {
      en: '"Yes, that is what matters most. Apologize to Nabula, not just to me."',
      id: '"Iya, itu yang paling penting. Mintanya ke Nabula, ya, bukan ke aku."'
    },
    action: 'lvl2_branch_reflection_router',
    next: null
  },

  /* ══════════ 029: REFLEKSI JALUR ECA ══════════ */
  lvl2_029a_eca: {
    id: '029a',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"You almost marched right up to them, but you caught yourself and stopped to think. This method works fast, but it requires catching your anger early before it boils over."',
      id: '"Kamu sempat mau samperin, tapi berhenti dan mikir dulu. Cara ini cepat, tapi kamu harus sadar lebih awal sebelum emosinya meledak."'
    },
    next: 'lvl2_029x_eca'
  },
  lvl2_029b_eca: {
    id: '029b',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"You held back your feelings at first. Restraining can help temporarily, but bottled-up frustration can pile up if not expressed in healthy ways."',
      id: '"Kamu sempat memendam perasaanmu. Menahan memang bisa membantu sebentar, tapi kesalnya bisa menumpuk kalau nggak disalurkan dengan cara yang sehat."'
    },
    next: 'lvl2_029x_eca'
  },
  lvl2_029c_eca: {
    id: '029c',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_happy',
    text: {
      en: '"You started by sharing what you were feeling. That helped you connect with what was happening in your body and heart. Keep practicing this self-soothing!"',
      id: '"Kamu mulai dengan menceritakan perasaanmu. Cara ini bikin kamu paham apa yang terjadi di badan dan hati. Tinggal terus dilatih menenangkan diri."'
    },
    next: 'lvl2_029x_eca'
  },
  lvl2_029w_eca: {
    id: '029w',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"You had an outburst earlier, but you had the courage to make it right and calm down. Learning to regulate our emotions is truly a journey."',
      id: '"Kamu sempat meledak, tapi kamu berani memperbaikinya dan akhirnya bisa tenang. Belajar mengelola emosi memang butuh proses."'
    },
    next: 'lvl2_029x_eca'
  },
  lvl2_029w2_eca: {
    id: '029w2',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_neutral',
    text: {
      en: '"You had an outburst earlier, and that can be a valuable lesson. Next time, offering an apology can really help soothe tense situations."',
      id: '"Kamu sempat meledak, dan itu bisa jadi pelajaran. Lain kali, minta maaf bisa membantu meredakan suasana."'
    },
    next: 'lvl2_029x_eca'
  },
  lvl2_029x_eca: {
    id: '029x',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_happy',
    text: {
      en: '"Bagas and Rio said they want to apologize to Nabula as well. I truly hope they find the right time and courage to do so."',
      id: '"Bagas dan Rio bilang mau minta maaf ke Nabula juga. Semoga mereka benar-benar mencari kesempatannya, ya."'
    },
    next: 'lvl2_030_hug_eca'
  },

  /* ══════════ 030 - 033: PELUK ECA & HASIL AKHIR LEVEL 2 ══════════ */
  lvl2_030_hug_eca: {
    id: '030',
    speaker: { en: 'ECA', id: 'ECA' },
    portrait: 'eca_excited',
    text: {
      en: 'Give ECA a hug to continue!',
      id: 'Peluk Eca untuk melanjutkan.'
    },
    action: 'lvl2_030_prompt_hug',
    noManualAdvance: true,
    next: null
  }
};
