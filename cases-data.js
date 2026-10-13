/**
 * CareTech - Database 50 Studi Kasus CASEL (Cardboard Cosmos)
 * 5 Pilar Pembelajaran Sosial Emosional (SEL):
 * 1. Self-Awareness (Kesadaran Diri) - ID 1-10
 * 2. Self-Management (Manajemen Diri) - ID 11-20
 * 3. Social Awareness (Kesadaran Sosial) - ID 21-30
 * 4. Relationship Skills (Keterampilan Berelasi) - ID 31-40
 * 5. Responsible Decision-Making (Pengambilan Keputusan Bertanggung Jawab) - ID 41-50
 */

const CASE_STUDIES_DATA = [
  // =========================================================================
  // PILAR 1: SELF-AWARENESS (KESADARAN DIRI)
  // =========================================================================
  {
    id: 1,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-01",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "kenali-emosi",
    title: "Kenali Emosi",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Emosi itu seperti cuaca di dalam dada kita. Kadang cerah, kadang mendung. Kuncinya adalah mengenali awannya lebih dulu!",
    scenario: "Saat Bu Guru mengumumkan giliran maju ke depan kelas untuk mempresentasikan kliping tugas, Arkan tiba-tiba merasakan dadanya berdegup kencang, kedua telapak tangannya mendadak dingin dan basah oleh keringat, serta perutnya terasa melilit. Arkan merasa ingin segera bersembunyi di balik tasnya atau meminta izin ke toilet agar tidak perlu maju.",
    questions: [
      "Berdasarkan reaksi tubuh dan pikiran Arkan, emosi apa saja yang sedang dialami oleh Arkan saat itu?",
      "Mengapa tubuh kita memberikan sinyal fisik (seperti jantung berdebar dan tangan dingin) ketika kita merasa cemas atau takut?",
      "Jika kamu menjadi Arkan, langkah pertama apa yang bisa kamu lakukan untuk mengenali dan menerima emosi tersebut secara jujur tanpa merasa malu?"
    ],
    challenge: "Ambil cermin kecil atau heningkan diri sejenak. Tanyakan pada dirimu sekarang: 'Rasa apa yang paling dominan di dalam hatiku hari ini?' Beri nama rasa itu!"
  },
  {
    id: 2,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-02",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "nama-emosiku",
    title: "Nama Emosiku",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Jangan cuma bilang 'lagi bad mood'. Perasaan kita itu kaya warna, ada kecewa, gelisah, cemburu, atau malu. Yuk beri nama yang pas!",
    scenario: "Rani menghempaskan tas ranselnya ke meja dan melipat tangannya cemberut setelah melihat sahabat dekatnya, Dita, bermain ayunan bersama murid baru saat istirahat. Ketika temannya yang lain bertanya ada apa, Rani hanya mendengus singkat: 'Aku nggak apa-apa! Cuma sebal aja sama semua orang!'. Padahal ada rasa sedih dan takut kehilangan sahabat di balik kata 'sebal' tersebut.",
    questions: [
      "Apakah kata 'sebal' benar-benar mewakili perasaan Rani yang sebenarnya? Emosi apa yang lebih tepat dan mendalam yang dialami Rani?",
      "Mengapa menamai emosi secara spesifik (seperti 'cemburu', 'takut ditinggalkan', atau 'kesepian') jauh lebih membantu daripada hanya mengatakan 'sebal' atau 'marah'?",
      "Bagaimana Rani bisa mengungkapkan perasaannya secara jujur kepada sahabatnya tanpa terdengar menuduh atau menyerang?"
    ],
    challenge: "Tuliskan 3 kata emosi selain 'senang' dan 'sedih' yang pernah kamu rasakan dalam minggu ini, lalu ingat-ingat momen kemunculannya!"
  },
  {
    id: 3,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-03",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "kepercayaan-diriku",
    title: "Kepercayaan Diriku",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Percaya diri bukan berarti kita tidak pernah salah, tapi berani mencoba walau ada kemungkinan salah!",
    scenario: "Dimas terpilih mewakili kelas dalam lomba cerdas cermat IPA karena nilainya selalu bagus. Namun, begitu melihat daftar peserta dari kelas lain yang terkenal pintar dan pandai bicara, Dimas langsung gemetar dan berkata pada wali kelasnya ingin mengundurkan diri saja. Dimas merasa dirinya pasti akan membuat timnya malu dan kalah telak.",
    questions: [
      "Pikiran negatif otomatis apa yang membuat rasa percaya diri Dimas langsung runtuh seketika?",
      "Apa dampak jangka panjang bagi perkembangan diri Dimas jika ia selalu menghindari kesempatan baru karena takut gagal?",
      "Bantulah Dimas merumuskan 2 kalimat afirmasi positif (penguat diri) yang bisa ia ucapkan di depan cermin sebelum bertanding!"
    ],
    challenge: "Catat satu hal yang pernah berhasil kamu lakukan dengan baik meskipun awalnya kamu merasa takut atau ragu untuk memulainya."
  },
  {
    id: 4,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-04",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "tantangan-diriku",
    title: "Tantangan Diriku",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Mengetahui titik lemah kita bukanlah kelemahan, melainkan peta harta karun untuk belajar lebih hebat!",
    scenario: "Nayla adalah murid yang sangat kreatif dan pandai bercerita. Namun saat menghadapi pelajaran matematika pecahan atau harus duduk diam membaca instruksi yang panjang, Nayla sering cepat kehilangan fokus, merasa gelisah, dan langsung menganggap dirinya 'bodoh dalam berhitung'. Nayla sering menunda mengerjakan tugas matematika hingga malam larut.",
    questions: [
      "Apa tantangan utama yang dihadapi Nayla dalam pola belajarnya, dan bagaimana tantangan tersebut memengaruhi perasaannya?",
      "Mengapa mengakui bahwa matematika adalah hal yang menantang bagi diri kita jauh lebih sehat daripada melabeli diri sendiri 'bodoh'?",
      "Strategi atau bantuan apa yang bisa Nayla cari untuk mengatasi tantangan berhitungnya tanpa harus merasa putus asa?"
    ],
    challenge: "Tuliskan satu mata pelajaran atau aktivitas harian yang paling menantang bagimu, serta satu langkah kecil yang bisa membantumu memperbaikinya."
  },
  {
    id: 5,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-05",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "pikiran-dan-perasaan",
    title: "Pikiran dan Perasaan",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Pikiran kita itu seperti sutradara film. Jika pikiran membayangkan skenario buruk, hati kita langsung ikut merasa cemas!",
    scenario: "Saat berjalan di koridor sekolah, Budi tersenyum ramah dan melambaikan tangan ke arah Fajar. Namun Fajar melengos lewat tanpa membalas senyuman Budi. Seketika di kepala Budi muncul pikiran: 'Fajar pasti membenciku karena kemarin aku tidak meminjamkan penghapus. Aku memang teman yang buruk'. Pikiran itu membuat Budi merasa sedih dan murung sepanjang pelajaran berlangsung.",
    questions: [
      "Pikiran apa yang otomatis muncul di kepala Budi, dan bagaimana pikiran tersebut langsung mengubah suasana hatinya?",
      "Apakah pikiran Budi sudah pasti 100% benar? Kemungkinan fakta apa saja yang bisa saja dialami Fajar saat berpapasan tadi (misalnya sedang melamun, tidak memakai kacamata, buru-buru)?",
      "Bagaimana Budi bisa mengoreksi pikirannya agar tidak terjebak dalam kesimpulan sepihak yang menyakitkan hatinya sendiri?"
    ],
    challenge: "Saat merasa sedih atau kesal hari ini, tangkap pikiranmu: 'Apa yang baru saja kubisikkan pada diriku sendiri?' Cek apakah itu fakta atau cuma dugaan!"
  },
  {
    id: 6,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-06",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "kekuatan-diriku",
    title: "Kekuatan Diriku",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Kekuatan sejati tidak cuma soal lari cepat atau jago matematika. Kebaikan hati dan kesetiaan kawan adalah kekuatan super!",
    scenario: "Galih merasa rendah diri karena tubuhnya tidak atletis seperti teman-teman yang jago sepak bola, dan nilainya biasa-biasa saja di rapor. Padahal di kelas, Galih adalah sosok yang selalu pertama kali membantu teman yang kesulitan mengangkat bangku, pendengar yang paling setia saat teman curhat, dan sangat telaten merawat tanaman di pojok kelas.",
    questions: [
      "Apa saja kekuatan dan kelebihan diri yang dimiliki Galih yang sering kali ia abaikan sendiri?",
      "Mengapa kelebihan seseorang tidak selalu harus berupa piala lomba atau angka nilai yang tinggi?",
      "Bagaimana kesadaran akan kekuatan diri dapat membantu Galih merasa lebih berharga dan bersemangat menjalani hari-harinya di sekolah?"
    ],
    challenge: "Tuliskan 3 kekuatan atau hal baik dari dirimu sendiri yang patut kamu syukuri hari ini!"
  },
  {
    id: 7,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-07",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "penyebab-emosi",
    title: "Penyebab Emosi",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Kadang kita marah karena hal sepele, padahal penyebab aslinya adalah karena kita lelah, lapar, atau sedang memendam masalah lain!",
    scenario: "Sepulang sekolah, Tiara berteriak sangat keras dan membentak adik kecilnya yang berusia 5 tahun hanya gara-gara adiknya meminjam pensil warna di meja belajar. Padahal biasanya Tiara meminjamkannya dengan senang hati. Ternyata sebelum pulang, Tiara baru saja ditegur Bu Guru karena lupa membawa buku tugas dan sepanjang malam sebelumnya ia kurang tidur karena cemas.",
    questions: [
      "Apakah tindakan adik meminjam pensil warna merupakan penyebab utama amarah Tiara, atau sekadar pemantik terakhir?",
      "Faktor apa saja yang sebenarnya menjadi akar penyebab emosi Tiara menjadi begitu sensitif dan mudah meledak?",
      "Bagaimana Tiara bisa belajar menyadari penyebab emosi aslinya agar tidak melampiaskan amarah pada orang yang tidak bersalah?"
    ],
    challenge: "Ketika kamu merasa ingin marah, tanyakan rumus HALT: Apakah aku Sedang Hungry (Lapar), Angry (Marah masalah lain), Lonely (Kesepian), atau Tired (Lelah)?"
  },
  {
    id: 8,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-08",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "seberapa-kuat-emosiku",
    title: "Seberapa Kuat Emosiku",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Ibarat termometer suhu, emosi punya level dari 1 sampai 10. Mengetahui level emosi membantu kita tahu kapan harus menarik rem darurat!",
    scenario: "Edo sedang mengantre membeli roti di kantin sekolah. Tiba-tiba seorang murid berlari kencang dan menyenggol siku Edo hingga susunya sedikit tumpah ke seragamnya. Dalam sekejap, Edo merasa amarahnya langsung melonjak ke level 10 (mendidih penuh). Edo mengepalkan tinju dan bersiap memukul anak tersebut sekuat tenaga di depan kerumunan.",
    questions: [
      "Jika dilihat secara objektif dan adil, apakah insiden senggolan tidak sengaja itu layak direspons dengan reaksi level 10 (kekerasan fisik)?",
      "Apa bahayanya jika kita selalu bereaksi pada intensitas maksimal setiap kali ada gangguan kecil dalam hidup?",
      "Langkah apa yang bisa Edo lakukan untuk menurunkan 'suhu emosinya' dari level 10 kembali ke level 3 atau 4 sebelum berbicara?"
    ],
    challenge: "Gambarkan garis termometer emosi 1-10 di bukumu. Beri tanda di mana posisi emosimu saat ini dan apa yang membuatnya berada di angka itu."
  },
  {
    id: 9,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-09",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "kebutuhan-diriku",
    title: "Kebutuhan Diriku",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Setiap emosi yang muncul adalah pesan bahwa ada kebutuhan kita yang sedang mengetuk pintu untuk dipenuhi!",
    scenario: "Kenan pulang dari sekolah setelah menjalani jadwal latihan pramuka dan ujian tengah semester. Sesampainya di rumah, Kenan langsung mengunci pintu kamarnya, menolak makan malam, dan membalas pertanyaan ibunya dengan nada ketus. Kenan sendiri merasa bingung: ia merasa gelisah, ingin menangis, tetapi tidak tahu apakah ia lapar, mengantuk, butuh ketenangan, atau butuh seseorang yang memeluknya.",
    questions: [
      "Mengapa seseorang bisa menjadi sangat sensitif dan rewel ketika kebutuhan dasarnya (fisik atau emosional) tidak disadari?",
      "Kebutuhan apa saja yang kemungkinan besar sedang didambakan oleh Kenan pada situasi sore itu?",
      "Bagaimana Kenan bisa mengidentifikasi kebutuhannya sendiri dan menyampaikannya secara santun kepada orang tuanya?"
    ],
    challenge: "Tuliskan apa yang paling kamu butuhkan saat harimu terasa sangat berat: Apakah waktu hening sendiri, istirahat tidur, atau curhat kepada seseorang?"
  },
  {
    id: 10,
    categoryKey: "self-awareness",
    categoryName: "Self-Awareness",
    categoryIndo: "Kesadaran Diri",
    categoryCode: "SA-10",
    categoryColor: "#ffe500",
    categoryAccent: "#ff2e93",
    slug: "sinyal-tubuhku",
    title: "Sinyal Tubuhku",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Tubuh kita itu pintar sekali! Sebelum pikiran kita sadar kita cemas, leher atau perut kita sudah membunyikan bel alarm lebih dulu.",
    scenario: "Setiap kali jam pelajaran matematika hendak dimulai dan guru bersiap membagikan lembar kuis dadakan, Kevin selalu merasakan perutnya mendadak melilit perih dan leher bagian belakangnya kaku tegang. Awalnya Kevin mengira ia sakit perut karena salah makan pagi, namun anehnya rasa sakit itu selalu hilang begitu bel istirahat berbunyi.",
    questions: [
      "Apakah keluhan perut melilit dan leher kaku yang dialami Kevin murni masalah fisik, atau merupakan sinyal alarm tubuh terhadap rasa cemas? Jelaskan keterkaitannya!",
      "Sinyal tubuh apa lagi yang biasanya muncul saat seseorang mengalami ketegangan emosi (misalnya bahu naik, rahang terkatup, napas pendek)?",
      "Latihan relaksasi tubuh apa (seperti menarik napas dalam atau melemaskan otot) yang bisa segera Kevin lakukan begitu alarm tubuhnya mulai berbunyi?"
    ],
    challenge: "Pejamkan mata selama 30 detik. Scan tubuhmu dari ujung kepala hingga ujung kaki: bagian tubuh mana yang saat ini terasa paling tegang? Hembuskan napas dan lemaskan!"
  },

  // =========================================================================
  // PILAR 2: SELF-MANAGEMENT (MANAJEMEN DIRI)
  // =========================================================================
  {
    id: 11,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-01",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "mengendalikan-emosi",
    title: "Mengendalikan Emosi",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Merasakan emosi itu alami, tapi cara kita bereaksi adalah pilihan kita 100%! Jangan biarkan emosi jadi sopirmu.",
    scenario: "Saat pertandingan basket antarkelas yang sengit, Farhan tanpa sengaja melakukan pelanggaran yang membuat tim lawan mendapat tembakan bebas di detik-detik terakhir hingga timnya kalah. Beberapa penonton bersorak mengejek. Farhan merasa campur aduk antara malu, marah, dan kecewa. Dorongan dalam dirinya ingin segera membanting bola basket ke dinding dan menendang kursi wasit.",
    questions: [
      "Apa akibat buruk jika Farhan menuruti dorongan sesaat untuk membanting bola dan menendang kursi?",
      "Kata-kata kendali diri apa yang bisa Farhan ucapkan dalam hati (self-talk) untuk menahan dorongan destruktif tersebut?",
      "Tindakan sportif dan bijak apa yang bisa Farhan tunjukkan di hadapan tim dan lawannya untuk memperlihatkan kedewasaan emosi?"
    ],
    challenge: "Latih jeda 'Stop & Count': Saat dorongan marah muncul, jangan bicara atau bertindak sebelum menghitung mundur dari 5 sampai 1 perlahan!"
  },
  {
    id: 12,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-02",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "menenangkan-diri",
    title: "Menenangkan Diri",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Tarik napas seperti mencium harum bunga, hembuskan perlahan seperti meniup lilin ulang tahun. Hati tenang, pikiran terang!",
    scenario: "Salma mendapati kotak pensil warna kesayangannya hilang dari tas tepat 15 menit sebelum lomba menggambar dimulai. Salma langsung panik, napasnya memburu cepat, tangannya gemetar hebat, dan air mata mulai menetes membasahi kertas gambarnya yang masih kosong.",
    questions: [
      "Bagaimana kepanikan yang tidak ditenangkan akan merusak konsentrasi dan kemampuan Salma saat lomba dimulai?",
      "Bagaimana teknik pernapasan dalam (Deep Breathing) dapat membantu menurunkan detak jantung dan meredakan kepanikan Salma?",
      "Setelah Salma berhasil menenangkan dirinya, langkah praktis apa yang bisa ia ambil untuk mengatasi masalah pensil warnanya yang hilang?"
    ],
    challenge: "Coba praktikkan teknik 'Box Breathing': Tarik napas 4 detik, tahan 4 detik, hembuskan 4 detik, tahan 4 detik. Lakukan 3 siklus!"
  },
  {
    id: 13,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-03",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "mengatur-pikiran",
    title: "Mengatur Pikiran",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Pikiran kita bisa jadi sahabat terbaik atau musuh terburuk. Pilihlah pikiran yang memberimu semangat untuk melangkah maju!",
    scenario: "Zaki tidak berhasil menjawab pertanyaan kuis saat cerdas cermat kelompok, sehingga poin kelompoknya berkurang. Di benak Zaki terus berdengung suara: 'Aku ini orang yang payah. Aku selalu membuat kelompokku rugi. Mereka semua pasti menganggapku bodoh dan menyesal sekelompok denganku'.",
    questions: [
      "Kesalahan berpikir (distorsi kognitif) apa yang sedang dialami Zaki dalam mengartikan kegagalan satu pertanyaan tersebut?",
      "Bagaimana Zaki bisa menguji kebenaran asumsinya: apakah teman-temannya benar-benar membencinya atau itu hanya rasa bersalah berlebihan di kepalanya?",
      "Gantikan kalimat negatif Zaki menjadi dua kalimat positif dan realistis yang memberi semangat untuk bangkit!"
    ],
    challenge: "Tuliskan satu pikiran cemas yang paling sering mengganggumu, lalu tuliskan sanggahan realistisnya di sebelahnya."
  },
  {
    id: 14,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-04",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "mengatur-perilaku",
    title: "Mengatur Perilaku",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Menjadi keren itu bukan yang berbuat gaduh sesukanya, tapi yang tahu kapan saatnya fokus dan kapan saatnya santai!",
    scenario: "Saat guru sedang menjelaskan materi penting di depan kelas, teman sebangku Rio menyodorkan mainan kartu baru di bawah meja dan mengajak Rio mengobrol sambil tertawa cekikikan. Rio sangat ingin ikut bermain dan tertawa lepas bersama temannya tersebut.",
    questions: [
      "Apa dampak bagi diri Rio dan suasana kelas jika Rio tidak mampu menahan dorongan untuk ikut bermain saat pelajaran berlangsung?",
      "Bagaimana cara Rio memberi batasan yang sopan namun tegas kepada teman sebangkunya tanpa membuat temannya tersinggung?",
      "Latihan pengendalian diri apa yang bisa membantu Rio tetap fokus pada instruksi guru hingga jam istirahat tiba?"
    ],
    challenge: "Pilih satu kebiasaan impulsifmu di kelas (misal menyela omongan orang atau melamun), dan pasang komitmen untuk menahannya sepanjang hari ini."
  },
  {
    id: 15,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-05",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "menghadapi-stres",
    title: "Menghadapi Stres",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Saat gunung tugas terlihat terlalu tinggi, jangan dilihat puncaknya terus-menerus. Mulailah melangkah satu batu demi satu batu!",
    scenario: "Clarissa menghadapi minggu yang padat: ia harus menyelesaikan laporan proyek sains, menghafal naskah drama pementasan, dan belajar untuk ulangan bahasa Inggris yang jadwalnya berurutan. Clarissa merasa pusing, nafsu makannya hilang, dan ia merasa ingin menangis setiap kali melihat buku-bukunya di meja belajar.",
    questions: [
      "Mengapa memikirkan semua beban tugas secara bersamaan justru membuat Clarissa lumpuh dan semakin stres?",
      "Bagaimana Clarissa bisa membuat skala prioritas (membedakan mana yang mendesak dan penting) untuk mengurai tugasnya?",
      "Aktivitas penyegar pikiran (self-care) sederhana apa yang wajib Clarissa selipkan agar energinya tetap seimbang?"
    ],
    challenge: "Buat daftar '3 Tugas Utama Hari Ini' (Top 3 Priorities). Selesaikan satu per satu dan coret tugas yang sudah rampung!"
  },
  {
    id: 16,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-06",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "mengatasi-rasa-takut",
    title: "Mengatasi Rasa Takut",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Orang pemberani bukan orang yang tidak punya rasa takut, tapi orang yang melangkah maju bersama rasa takutnya!",
    scenario: "Hanif sangat takut berbicara di depan umum. Setiap kali diminta berdiri membacakan puisi karyanya di depan kelas, suaranya tercekat dan lututnya lemas. Hanif sangat takut teman-temannya akan menertawakan jika ia salah membaca bait puisi tersebut.",
    questions: [
      "Apa akar ketakutan terdalam yang dirasakan Hanif, dan apakah ketakutan tersebut wajar dirasakan oleh banyak orang?",
      "Bagaimana Hanif bisa melatih keberaniannya secara bertahap (misalnya membacakan puisi di depan satu teman dekat atau di depan cermin lebih dulu)?",
      "Pikiran penenang apa yang bisa Hanif tanamkan di kepalanya sebelum ia melangkahkan kaki maju ke depan kelas?"
    ],
    challenge: "Lakukan satu hal kecil yang membuatmu sedikit gugup hari ini (misalnya bertanya ke guru atau menyapa teman lebih dulu)."
  },
  {
    id: 17,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-07",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "mengendalikan-amarah",
    title: "Mengendalikan Amarah",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Amarah itu seperti api. Kalau dikendalikan bisa memasak air, tapi kalau dilepas sembarangan bisa membakar seisi rumah!",
    scenario: "Maket rumah adat yang dibuat Ilham dengan susah payah selama tiga hari tidak sengaja tersenggol oleh temannya yang sedang berkejaran di dalam kelas hingga atapnya patah. Ilham langsung naik pitam, mukanya merah padam, dan ia mengambil penggaris besi berniat memukulkannya ke teman tersebut.",
    questions: [
      "Apakah kemarahan Ilham adalah emosi yang wajar dirasakan? Namun, mengapa tindakannya mengambil penggaris besi berbahaya dan salah?",
      "Teknik jeda darurat apa (seperti menjauhkan diri dari lokasi selama 2 menit) yang harus segera diambil Ilham sebelum terjadi luka fisik?",
      "Bagaimana cara Ilham menuntut pertanggungjawaban dari temannya dengan cara yang bermartabat dan tegas tanpa kekerasan?"
    ],
    challenge: "Tuliskan 3 saluran aman untuk melampiaskan marah tanpa melukai orang lain (contoh: meremas bantal, meremas kertas bekas, menulis uneg-uneg)."
  },
  {
    id: 18,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-08",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "menentukan-tujuan",
    title: "Menentukan Tujuan",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Tujuan tanpa rencana yang jelas hanyalah angan-angan. Buat targetmu jelas dan terukur agar langkahmu mantap!",
    scenario: "Nadia bertekad ingin memperbaiki prestasinya di semester baru ini, tetapi targetnya hanya berbunyi: 'Aku mau jadi anak pintar dan rajin'. Setelah dua minggu berjalan, Nadia bingung apa yang harus ia lakukan setiap sore dan akhirnya waktunya habis untuk menggulir media sosial dan bermain game.",
    questions: [
      "Mengapa target 'mau jadi anak pintar' terlalu kabur dan menyulitkan Nadia untuk bertindak setiap hari?",
      "Ubah target Nadia menggunakan prinsip SMART (Spesifik, Terukur, Dapat dicapai, Relevan, Berbatas waktu)!",
      "Kebiasaan kecil apa yang bisa Nadia jadikan rutinitas harian untuk mewujudkan tujuan belajarnya tersebut?"
    ],
    challenge: "Tuliskan 1 tujuan spesifikmu untuk 1 bulan ke depan beserta 1 kebiasaan harian yang akan kamu lakukan demi mencapainya!"
  },
  {
    id: 19,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-09",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "mengatur-diri",
    title: "Mengatur Diri",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Disiplin itu bukan hukuman, tapi hadiah terbaik untuk masa depanmu agar kamu tidak selalu hidup dalam kepanikan!",
    scenario: "Setiap pagi di rumah Fajar selalu diwarnai kepanikan: kaos kaki hilang, buku PR tertinggal di bawah kasur, dan sarapan terburu-buru hingga Fajar sering terlambat tiba di gerbang sekolah. Akibatnya, Fajar selalu memulai pelajarannya dengan perasaan dongkol, lelah, dan dimarahi guru piket.",
    questions: [
      "Bagaimana ketidakteraturan di pagi hari dapat merusak suasana hati dan kualitas belajar Fajar sepanjang hari?",
      "Rutinitas persiapan malam apa yang bisa dibangun Fajar sebelum tidur untuk mempermudah paginya?",
      "Alat bantu apa (misalnya daftar periksa/checklist di pintu kamar) yang bisa Fajar buat agar tidak ada barang yang tertinggal lagi?"
    ],
    challenge: "Malam ini sebelum tidur, siapkan seragam, tas sekolah, dan buku pelajaranmu di satu tempat rapi. Rasakan betapa ringannya pagimu besok!"
  },
  {
    id: 20,
    categoryKey: "self-management",
    categoryName: "Self-Management",
    categoryIndo: "Manajemen Diri",
    categoryCode: "SM-10",
    categoryColor: "#39ff14",
    categoryAccent: "#00e5ff",
    slug: "pantang-menyerah",
    title: "Pantang Menyerah",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Kegagalan bukanlah akhir perjalanan, melainkan tanda bahwa kita sedang belajar sesuatu yang baru dengan sungguh-sungguh!",
    scenario: "Tara mencoba merakit rangkaian bel listrik sederhana untuk proyek sains. Pada percobaan pertama, belnya tidak berdering. Pada percobaan kedua, kawatnya putus. Tara merasa sangat putus asa, melemparkan obengnya ke meja, dan berkata: 'Aku menyerah! Aku memang tidak punya bakat di bidang sains, buat apa mencoba lagi!'.",
    questions: [
      "Apa perbedaan cara pandang 'Fixed Mindset' (bakat tetap) dan 'Growth Mindset' (kemampuan berkembang) dalam kasus Tara?",
      "Mengapa kesalahan pada percobaan pertama dan kedua sebenarnya merupakan data berharga untuk menuju keberhasilan?",
      "Kalimat penguat apa yang bisa kamu bisikkan kepada Tara agar ia mau mencoba percobaan ketiga dengan semangat baru?"
    ],
    challenge: "Ingat kembali hal yang paling sulit yang berhasil kamu kuasai saat ini (misal naik sepeda, membaca, atau berenang). Berapa kali kamu gagal sebelum berhasil?"
  },

  // =========================================================================
  // PILAR 3: SOCIAL AWARENESS (KESADARAN SOSIAL)
  // =========================================================================
  {
    id: 21,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-01",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "kenali-perasaan-orang-lain",
    title: "Kenali Perasaan Orang Lain",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Orang lain tidak selalu memakai pengeras suara untuk bilang mereka sedih. Mata dan bahu mereka sering kali sudah berbicara!",
    scenario: "Saat jam istirahat, Laras melihat Citra duduk sendirian di sudut bangku koridor. Wajah Citra menunduk dalam, kedua kakinya ditarik rapat, dan sesekali Citra mengusap ujung matanya dengan lengan baju seragamnya sambil menolak ajakan teman lain yang lewat untuk bermain petak umpet.",
    questions: [
      "Berdasarkan petunjuk bahasa tubuh dan ekspresi Citra, apa yang kemungkinan besar sedang berkecamuk di dalam hatinya?",
      "Mengapa kita tidak boleh langsung mencap seseorang yang menyendiri sebagai orang yang 'sombong' atau 'menjauh'?",
      "Pendekatan lembut dan penuh rasa hormat seperti apa yang bisa Laras lakukan untuk menyapa Citra tanpa membuatnya merasa tertekan?"
    ],
    challenge: "Perhatikan ekspresi wajah 3 orang teman atau keluargamu hari ini. Bisakah kamu menebak bagaimana suasana hati mereka sebelum mereka bicara?"
  },
  {
    id: 22,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-02",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "pahami-perasaan-teman",
    title: "Pahami Perasaan Teman",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Bagi kita mungkin masalah itu kecil, tapi bagi teman kita itu bisa jadi masalah sebesar gunung. Hargai perasaan mereka!",
    scenario: "Doni tampak lesu dan murung di kelas karena kucing peliharaan kesayangannya yang sudah ia rawat sejak kecil hilang kemarin sore. Saat Doni menceritakannya, beberapa murid malah menertawakannya sambil berkata: 'Halah, cuma kucing kampung aja kok sampai mau menangis! Lebay banget sih kamu!'.",
    questions: [
      "Mengapa komentar meremehkan dari teman-temannya terasa sangat menusuk dan melukai hati Doni?",
      "Mengapa sebuah peristiwa memiliki arti emosional yang sangat berbeda bagi setiap orang?",
      "Jika kamu duduk di sebelah Doni, apa respon penuh kehangatan yang akan kamu sampaikan untuk menunjukkan pemahamanmu?"
    ],
    challenge: "Ketika seorang teman curhat tentang hal yang menurutmu sepele, tahan keinginan untuk berkomentar 'ah cuma gitu doang'. Dengarkan dengan tulus!"
  },
  {
    id: 23,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-03",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "belajar-berempati",
    title: "Belajar Berempati",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Empati itu jembatan kasih sayang. Kita membuka hati untuk merasakan apa yang dirasakan orang lain tanpa menghakimi.",
    scenario: "Aris adalah siswa pindahan dari pelosok daerah. Logat bicaranya sangat kental dan sepatu sekolahnya sudah tampak usang dengan sol yang sedikit terbuka. Saat memperkenalkan diri di depan kelas, beberapa murid di barisan belakang cekikikan menirukan logat Aris, membuat Aris menunduk malu dan suaranya gemetar.",
    questions: [
      "Bayangkan jika kamu adalah Aris yang baru pertama kali masuk ke sekolah baru yang asing: apa yang kamu rasakan ketika diejek oleh teman sekelas?",
      "Mengapa empati memerlukan keberanian moral untuk tidak ikut-ikutan menertawakan orang yang berbeda?",
      "Tindakan kepedulian apa yang bisa kamu ambil saat jam istirahat untuk membuat Aris merasa diterima dan aman di kelas barunya?"
    ],
    challenge: "Latih pertanyaan empati: Setiap kali melihat seseorang diperlakukan buruk, tanyakan dalam hati: 'Bagaimana rasanya jika aku yang ada di posisinya?'"
  },
  {
    id: 24,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-04",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "melihat-dari-sudut-pandang-orang-lain",
    title: "Melihat dari Sudut Pandang Orang Lain",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Angka 6 dari tempatmu berdiri bisa kelihatan seperti angka 9 dari tempat orang lain. Keduanya benar, tergantung sudut pandangnya!",
    scenario: "Pak Guru melarang murid-murid bermain bola di lapangan rumput sekolah selama musim hujan karena tanahnya becek dan rumputnya baru ditanam. Vian sangat kesal dan menggerutu: 'Pak Guru pelit dan jahat! Kita kan cuma mau senang-senang main bola!'. Vian merasa guru hanya ingin membatasi kebebasan murid.",
    questions: [
      "Dari sudut pandang Vian, mengapa peraturan larangan bermain bola terasa sangat menyebalkan?",
      "Sekarang coba ganti kacamata: dari sudut pandang Pak Guru dan pihak sekolah, tanggung jawab dan risiko apa yang ingin mereka cegah (misal murid tergelincir cedera, seragam kotor, rumput mati)?",
      "Bagaimana kemampuan melihat dua sudut pandang ini membantu Vian menerima keputusan tersebut dengan lebih lapang dada?"
    ],
    challenge: "Saat kamu berselisih paham dengan orang tuamu hari ini, coba renungkan: 'Kira-kira apa kekhawatiran orang tuaku sampai melarang hal ini?'"
  },
  {
    id: 25,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-05",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "peduli-pada-orang-lain",
    title: "Peduli pada Orang Lain",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Kepedulian itu menular. Satu tindakan kecil penuh perhatian bisa menerangi hari seseorang yang sedang gelap gulita!",
    scenario: "Pak Joko, penjaga sekolah yang sudah lanjut usia, tampak kesulitan mengangkat tumpukan kardus berisi buku paket pelajaran dari mobil ekspedisi menuju perpustakaan di bawah terik matahari siang. Keringatnya membasahi bajunya. Banyak murid berlarian lewat di sampingnya sambil bercanda tanpa ada yang memperhatikan beban Pak Joko.",
    questions: [
      "Apa yang hilang dari budaya sekolah jika murid-murid hanya sibuk dengan dunianya sendiri tanpa memedulikan orang-orang yang melayani mereka?",
      "Tindakan peduli apa yang bisa segera diambil oleh dua atau tiga orang murid yang menyaksikan situasi Pak Joko?",
      "Apa dampak psikologis bagi Pak Joko ketika ada murid yang berinisiatif menawarkan bantuan dengan sopan?"
    ],
    challenge: "Lakukan satu kebaikan kecil tanpa diminta hari ini: misalnya membantu membawakan barang guru atau membersihkan papan tulis!"
  },
  {
    id: 26,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-06",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "menghargai-perbedaan",
    title: "Menghargai Perbedaan",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Bayangkan kalau di dunia cuma ada satu warna: membosankan sekali! Perbedaan itu yang membuat kelas kita seru dan kaya.",
    scenario: "Saat perayaan hari bekal bersama di kelas, Samuel membawa makanan tradisional khas daerah asalnya yang kaya rempah dan memiliki aroma khas yang kuat. Beberapa anak di dekatnya menutup hidung dengan dramatis sambil berteriak: 'Ih, baunya aneh banget! Makanan apa sih itu, jorok banget!'. Samuel langsung menunduk dan buru-buru menutup kembali kotak bekalnya.",
    questions: [
      "Mengapa reaksi menutup hidung dan mengejek makanan teman merupakan bentuk ketidaksopanan terhadap keberagaman budaya?",
      "Bagaimana seharusnya sikap kita saat menjumpai makanan, tradisi, atau kebiasaan teman yang baru dan belum pernah kita kenal sebelumnya?",
      "Pertanyaan ramah apa yang bisa diajukan untuk menunjukkan rasa ingin tahu yang positif terhadap bekal Samuel?"
    ],
    challenge: "Ajak mengobrol seorang teman yang memiliki suku, hobi, atau latar belakang berbeda darimu, dan cari tahu satu hal menarik tentang kebiasaannya!"
  },
  {
    id: 27,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-07",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "mengenali-kebutuhan-teman",
    title: "Mengenali Kebutuhan Teman",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Menjadi teman yang peka berarti tahu kapan sahabat kita butuh bantuan, bahkan saat mereka terlalu sungkan untuk memintanya.",
    scenario: "Bayu sedang memakai tongkat kruk karena pergelangan kakinya cedera saat olahraga kemarin. Saat bel istirahat berbunyi, seluruh murid berhamburan lari ke luar kelas menuju kantin untuk berebut makanan. Bayu tertinggal sendirian di dalam kelas, menatap pintu dengan cemas karena ia tahu ia akan kesulitan menuruni tangga dan membawa mangkok makanan sendiri dengan tongkatnya.",
    questions: [
      "Kebutuhan apa saja yang sangat mendesak bagi Bayu saat jam istirahat tersebut (baik bantuan fisik maupun rasa ditemani)?",
      "Mengapa sering kali orang yang membutuhkan bantuan merasa sungkan atau malu untuk berteriak meminta tolong?",
      "Bagaimana kamu dan teman-teman sekelas bisa membagi tugas secara alami untuk membantu Bayu tanpa membuatnya merasa seperti beban?"
    ],
    challenge: "Perhatikan teman-teman di sekitarmu hari ini: adakah yang tampak membutuhkan bantuan meminjam alat tulis, membawa buku, atau butuh teman mengobrol?"
  },
  {
    id: 28,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-08",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "memahami-situasi-sosial",
    title: "Memahami Situasi Sosial",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Setiap tempat punya suasananya masing-masing. Bersenang-senang di lapangan bola itu seru, tapi di perpustakaan kita butuh hening!",
    scenario: "Ruang kelas sedang sangat hening karena anak-anak sedang fokus mengerjakan ujian harian yang membutuhkan ketelitian tinggi. Rendy yang sudah selesai mengerjakan lebih dulu tiba-tiba memutar musik pendek di ponselnya, tertawa keras mengajak teman sebelahnya bercanda, dan mengetuk-ngetuk meja dengan pulpennya.",
    questions: [
      "Mengapa perilaku Rendy dinilai tidak peka terhadap situasi sosial dan mengganggu hak teman-temannya di kelas?",
      "Apa perbedaan antara suasana santai (seperti jam istirahat) dan suasana formal yang menuntut ketenangan bersama?",
      "Bagaimana cara menyampaikan teguran kepada Rendy secara sopan agar ia menghentikan kegaduhannya tanpa memicu pertengkaran di tengah ujian?"
    ],
    challenge: "Sebelum berbicara atau membuat suara keras, amati situasi sekelilingmu: apakah ini waktu dan tempat yang tepat untuk melakukannya?"
  },
  {
    id: 29,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-09",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "menghargai-perasaan-orang-lain",
    title: "Menghargai Perasaan Orang Lain",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Bercanda itu kalau kedua belah pihak sama-sama tertawa. Kalau cuma satu yang tertawa dan yang satu terluka, itu bukan bercanda!",
    scenario: "Kiki membuat lelucon di depan banyak orang tentang potongan rambut baru Alif yang terlalu pendek dan menyerupai helm mangkok. Beberapa anak tertawa. Alif tersenyum kaku, namun setelah itu ia segera memakai tudung jaketnya erat-erat, menolak melepasnya seharian, dan tidak mau berbicara dengan siapa pun hingga pulang sekolah.",
    questions: [
      "Mengapa alasan 'kan aku cuma bercanda' tidak bisa membenarkan tindakan yang sudah terbukti menyakiti perasaan orang lain?",
      "Apa tanda-tanda yang menunjukkan bahwa sebuah lelucon sudah melewati batas wajar dan berubah menjadi tindakan perundungan verbal?",
      "Jika Kiki memiliki kesadaran sosial yang baik, tindakan perbaikan apa yang wajib ia lakukan kepada Alif setelah melihat reaksinya?"
    ],
    challenge: "Pikirkan kembali leluconmu: apakah pernah ada temanmu yang tersenyum terpaksa karena leluconmu? Jika ada, jangan ulangi lagi!"
  },
  {
    id: 30,
    categoryKey: "social-awareness",
    categoryName: "Social Awareness",
    categoryIndo: "Kesadaran Sosial",
    categoryCode: "SOC-10",
    categoryColor: "#00e5ff",
    categoryAccent: "#ff8a00",
    slug: "menunjukkan-kepedulian",
    title: "Menunjukkan Kepedulian",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Kata-kata dukungan yang tulus adalah obat penenang terbaik bagi sahabat yang sedang menghadapi masa-masa sulit.",
    scenario: "Zahra mengetahui bahwa ibunda dari salah satu teman sekelasnya, Nisa, sedang dirawat di rumah sakit karena sakit berat. Selama beberapa hari, Nisa tampak sangat pendiam, cemas, dan sering termenung memikirkan ibunya. Banyak teman sekelas yang merasa kasihan tetapi bingung dan takut salah bicara jika mendekati Nisa.",
    questions: [
      "Apa keraguan yang biasanya membuat anak-anak enggan menunjukkan kepedulian kepada teman yang sedang berduka atau cemas?",
      "Bentuk kepedulian sederhana apa yang tidak memerlukan biaya besar namun sangat berharga yang bisa diberikan kelas untuk menguatkan Nisa?",
      "Susunlah kalimat pesan singkat berisi doa dan dukungan yang tulus yang bisa ditulis di secarik kartu untuk Nisa!"
    ],
    challenge: "Kirimkan pesan dukungan atau sapaan hangat kepada seorang teman atau kerabat yang sedang sakit atau tertimpa musibah."
  },

  // =========================================================================
  // PILAR 4: RELATIONSHIP SKILLS (KETERAMPILAN BERELASI)
  // =========================================================================
  {
    id: 31,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-01",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "komunikasi",
    title: "Komunikasi",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Bukan cuma apa yang kita katakan, tapi bagaimana cara kita mengatakannya yang menentukan apakah orang lain mau mendengar!",
    scenario: "Fatih merasa jengkel karena anggota kelompok tugas klipingnya belum mengirimkan bagian tugas mereka padahal batas waktu tinggal dua hari. Melalui obrolan grup WhatsApp, Fatih mengetik dengan huruf kapital semua: 'KALIAN SEMUA MALAS DAN NGGAK TANGGUNG JAWAB! KERJAKAN SEKARANG ATAU NAMA KALIAN AKU CORET DARI LAPORAN!'. Akibatnya, anggota lain tersinggung dan malah mogok mengerjakan.",
    questions: [
      "Mengapa gaya komunikasi yang agresif dan penuh tuduhan justru membuat kerja sama tim hancur berantakan?",
      "Bagaimana Fatih bisa menggunakan metode komunikasi 'I-Statement' (Saya merasa cemas karena tugas kita belum selesai, bisakah kita...) untuk menyampaikan keluhannya?",
      "Tuliskan ulang pesan Fatih tersebut dengan nada yang tegas namun tetap santun dan mengajak kerja sama!"
    ],
    challenge: "Latih menyampaikan keluhan dengan rumus 'I-Statement': 'Aku merasa [perasaan] ketika [situasi], bisakah kita [solusi]?'"
  },
  {
    id: 32,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-02",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "mendengarkan",
    title: "Mendengarkan",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Mendengarkan itu hadiah terindah. Saat orang lain bicara, simpan ponselmu, tatap matanya, dan dengarkan dengan sepenuh hati!",
    scenario: "Dania sedang menceritakan masalah pertengkarannya dengan adik kandungnya kepada Mita di waktu istirahat. Mita mendengarkan sambil terus asyik menggulir layar ponselnya menonton video pendek, sesekali hanya bergumam: 'Oh gitu ya... iya iya... terus gimana?'. Merasa tidak dihargai, Dania akhirnya terdiam dan pergi meninggalkan Mita.",
    questions: [
      "Bagaimana perasaan Dania ketika curhatannya diperlakukan sambil lalu oleh Mita?",
      "Apa saja ciri-ciri mendengarkan secara aktif (Active Listening) yang menunjukkan perhatian penuh kepada kawan bicara?",
      "Mengapa kemampuan mendengarkan dengan tulus merupakan fondasi utama dalam merawat persahabatan sejati?"
    ],
    challenge: "Saat diajak bicara oleh teman atau orang tua hari ini, hentikan aktivitasmu, tatap matanya, dan dengarkan tanpa menyela sampai ia selesai!"
  },
  {
    id: 33,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-03",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "bekerja-sama",
    title: "Bekerja Sama",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Kalau mau berjalan cepat jalanlah sendirian, tapi kalau mau berjalan jauh jalanlah bersama-sama!",
    scenario: "Dalam tugas proyek membuat poster edukasi pencegahan banjir, Arya ingin memakai konsep gambar kartun warna-warni, sementara Kevin bersikeras ingin memakai konsep kliping foto berita koran. Keduanya saling berebut kertas karton dan menolak mengalah satu sama lain, hingga waktu kerja kelompok habis tanpa ada satu goresan pun di poster.",
    questions: [
      "Mengapa sikap memaksakan kehendak dan enggan berkompromi menjadi musuh nomor satu dalam kerja kelompok?",
      "Solusi kreatif apa yang bisa menggabungkan ide Arya dan ide Kevin sehingga kedua konsep tersebut bisa berdampingan harmonis?",
      "Aturan apa yang sebaiknya disepakati kelompok sejak awal saat mendiskusikan perbedaan pendapat?"
    ],
    challenge: "Dalam kerja tim berikutnya, biasakan bertanya kepada rekanmu: 'Apa pendapatmu tentang ide ini? Bagaimana kalau kita gabungkan?'"
  },
  {
    id: 34,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-04",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "mengungkapkan-perasaan",
    title: "Mengungkapkan Perasaan",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Memendam uneg-uneg itu seperti menyimpan botol soda yang dikocok. Lebih baik ungkapkan dengan tenang sebelum meledak!",
    scenario: "Tasya merasa tidak nyaman setiap kali teman sebangkunya meminjam perlengkapan mewarnainya tanpa izin dan mengembalikannya dalam keadaan kotor atau patah. Namun Tasya selalu memendam perasaannya dan hanya tersenyum terpaksa karena takut dijauhi jika menegur temannya tersebut. Akibatnya, Tasya menangis sendirian di rumah menahan kejengkelan.",
    questions: [
      "Apa bahayanya bagi kesehatan mental jika kita terus-menerus memendam rasa tidak nyaman dan tidak berani menetapkan batasan (boundaries)?",
      "Apa perbedaan antara komunikasi pasif (memendam), agresif (marah meledak), dan asertif (jujur dan tenang)?",
      "Kalimat asertif apa yang bisa dipraktikkan Tasya untuk memberitahu temannya secara ramah namun berprinsip tegas?"
    ],
    challenge: "Jika ada perlakuan teman yang membuatmu tidak nyaman hari ini, katakan dengan sopan: 'Maaf ya, aku kurang nyaman kalau barangku dipakai tanpa izin lebih dulu'."
  },
  {
    id: 35,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-05",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "meminta-bantuan",
    title: "Meminta Bantuan",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Meminta tolong bukan berarti kamu tidak mampu. Itu tandanya kamu tahu kapan harus menggandeng tangan orang lain untuk melangkah!",
    scenario: "Riko sangat kesulitan memahami rumus pembagian pecahan campuran. Ulangan harian tinggal dua hari lagi, namun Riko merasa sangat malu untuk mengangkat tangan bertanya kepada guru atau meminta diajari oleh teman sebangkunya karena takut ditertawakan dan dianggap bodoh. Akibatnya, Riko pulang dengan rasa cemas yang menyiksa.",
    questions: [
      "Pikiran keliru apa yang membuat seseorang merasa gengsi atau takut untuk meminta pertolongan saat kesulitan?",
      "Siapa saja orang-orang di sekolah yang aman dan dapat dipercaya yang bisa dimintai bantuan oleh Riko?",
      "Susunlah kalimat sopan dan percaya diri yang bisa digunakan Riko untuk meminta bantuan bimbingan belajar kepada guru atau temannya!"
    ],
    challenge: "Jangan pendam kebingunganmu. Tanyakan satu hal yang belum kamu pahami kepada guru atau temanmu hari ini dengan santun!"
  },
  {
    id: 36,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-06",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "memberikan-bantuan",
    title: "Memberikan Bantuan",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Bantuan kecil yang kamu berikan dengan tulus bisa jadi penyelamat besar bagi orang lain yang sedang buntu jalan!",
    scenario: "Maya melihat teman sekelasnya, Rere, yang baru kembali masuk sekolah setelah seminggu dirawat di rumah sakit. Rere tampak kebingungan menatap tumpukan buku catatan kosong dan tugas-tugas yang tertinggal. Maya memiliki catatan pelajaran yang sangat rapi dan lengkap di bukunya.",
    questions: [
      "Bagaimana cara Maya menawarkan bantuannya kepada Rere dengan cara yang ramah tanpa membuatnya merasa rendah diri?",
      "Apa manfaat timbal balik bagi diri Maya sendiri ketika ia meluangkan waktu untuk mengajari atau meminjamkan catatan kepada temannya?",
      "Bentuk dukungan apa lagi selain meminjamkan catatan yang bisa diberikan Maya untuk membantu Rere merasa nyaman kembali di kelas?"
    ],
    challenge: "Tawarkan bantuanmu kepada seseorang yang sedang kerepotan hari ini tanpa menunggu orang tersebut meminta!"
  },
  {
    id: 37,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-07",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "menghargai-teman",
    title: "Menghargai Teman",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Teman sejati menghargai sahabatnya apa adanya, bukan menuntut sahabatnya menjadi seperti yang ia mau!",
    scenario: "Dika memiliki tubuh yang agak gemuk dan gerakannya tidak secepat anggota regu pramuka lainnya saat kegiatan penjelajahan di alam terbuka. Beberapa anggota regu mulai mengeluh di sepanjang jalan dan menyuruh Dika berjalan paling belakang sambil melontarkan ejekan sindiran bahwa Dika memperlambat regu mereka.",
    questions: [
      "Mengapa tindakan menyindir dan mengucilkan teman yang memiliki keterbatasan fisik bertentangan dengan prinsip saling menghargai?",
      "Peran penting apa yang bisa diberikan kepada Dika dalam regu (misalnya menjaga perbekalan atau membaca peta) agar ia merasa dihargai?",
      "Bagaimana sikap anggota regu yang suportif saat ada salah satu temannya yang mulai kelelahan di tengah perjalanan?"
    ],
    challenge: "Puji satu kebaikan atau usaha temanmu secara tulus hari ini di hadapannya langsung!"
  },
  {
    id: 38,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-08",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "menyelesaikan-konflik",
    title: "Menyelesaikan Konflik",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Tujuan menyelesaikan pertengkaran bukan untuk mencari siapa yang menang dan kalah, tapi bagaimana agar persahabatan kita tetap utuh!",
    scenario: "Gina dan Seli sama-sama ingin meminjam satu-satunya buku ensiklopedia sains bergambar yang baru datang di perpustakaan sekolah untuk tugas besok. Keduanya saling tarik-menarik buku tersebut di rak hingga sampulnya robek sedikit dan petugas perpustakaan menegur mereka berdua.",
    questions: [
      "Mengapa adu otot dan saling ngotot tidak akan pernah menyelesaikan konflik secara adil?",
      "Sebutkan 3 alternatif solusi damai yang bisa diambil Gina dan Seli (misalnya membaca bersama, membagi waktu pinjam, atau mencatat bersama)?",
      "Bagaimana sikap tanggung jawab yang wajib mereka tunjukkan kepada petugas perpustakaan atas robeknya sampul buku tersebut?"
    ],
    challenge: "Jika ada perselisihan kecil hari ini, tanyakan kepada lawan bicaramu: 'Bagaimana cara agar kita berdua sama-sama senang dengan solusinya?'"
  },
  {
    id: 39,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-09",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "meminta-maaf",
    title: "Meminta Maaf",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Meminta maaf itu tanda jiwa ksatria. Mengakui kesalahan butuh keberanian yang jauh lebih besar daripada mencari-cari alasan!",
    scenario: "Saat berjalan membawa botol air minum di kelas, Bagas tersandung dan air minumnya tumpah membasahi gambar lukisan pemandangan milik temannya yang hendak dikumpulkan hari itu. Karena terkejut dan takut dimarahi, reaksi pertama Bagas adalah berteriak: 'Kamu sih naruh gambarmu sembarangan di pinggir meja!'. Temannya pun menangis melihat gambarnya luntur.",
    questions: [
      "Mengapa menyalahkan orang lain atas kecerobohan diri sendiri justru membuat luka di hati teman semakin dalam?",
      "Sebutkan 3 elemen penting dari permintaan maaf yang tulus (mengakui kesalahan tanpa 'tapi', menyampaikan rasa penyesalan, dan menawarkan ganti rugi/bantuan)?",
      "Tuliskan kalimat permintaan maaf yang seharusnya diucapkan Bagas beserta tindakan nyata untuk membantu temannya memperbaiki gambar tersebut!"
    ],
    challenge: "Jika kamu menyadari telah berbuat salah hari ini, sampaikan maaf secara langsung tanpa kata pembelaan diri!"
  },
  {
    id: 40,
    categoryKey: "relationship-skills",
    categoryName: "Relationship Skills",
    categoryIndo: "Keterampilan Berelasi",
    categoryCode: "REL-10",
    categoryColor: "#ff8a00",
    categoryAccent: "#9b5cff",
    slug: "memberikan-apresiasi",
    title: "Memberikan Apresiasi",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Satu ucapan terima kasih yang tulus bisa menghapus rasa lelah berjam-jam kerja keras. Jangan pelit mengapresiasi kawanmu!",
    scenario: "Setelah acara pentas seni kelas selesai, ketua kelas dan seksi dekorasi tampak sangat letih mengumpulkan sampah dan membereskan panggung hingga sore. Sebagian besar murid lainnya langsung pulang bergembira tanpa menyapa atau sekadar mengucapkan terima kasih kepada panitia kelas yang telah bekerja keras sejak pagi.",
    questions: [
      "Bagaimana perasaan panitia kelas ketika pengorbanan waktu dan tenaga mereka dianggap hal biasa yang tidak dipedulikan?",
      "Mengapa memberikan apresiasi dan ucapan terima kasih sangat penting dalam memupuk semangat kerja sama di masa depan?",
      "Tuliskan sebuah kalimat apresiasi sederhana yang menyentuh hati yang bisa kamu berikan kepada teman yang telah bekerja keras untuk kelasmu!"
    ],
    challenge: "Ucapkan terima kasih dan puji kerja keras setidaknya 2 orang hari ini (misal petugas kebersihan, guru, atau teman sebangku)!"
  },

  // =========================================================================
  // PILAR 5: RESPONSIBLE DECISION-MAKING (PENGAMBILAN KEPUTUSAN BERTANGGUNG JAWAB)
  // =========================================================================
  {
    id: 41,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-01",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "kenali-masalah",
    title: "Kenali Masalah",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Kalau salah mendiagnosis penyakit, obatnya pasti keliru. Kenali dulu apa masalah aslinya sebelum mencoba mencari jalan keluar!",
    scenario: "Nilai ujian harian kelompok belajar Aldo dan teman-temannya merosot tajam. Mereka langsung menyalahkan Bu Guru dan menganggap soal ujiannya sengaja dibuat terlalu sulit dan tidak masuk akal. Namun jika diamati dengan jujur, selama seminggu sebelum ujian, waktu belajar kelompok mereka lebih banyak dihabiskan untuk bermain game online dan mengobrol santai hingga larut malam.",
    questions: [
      "Apa masalah nyata yang menjadi akar penurunan nilai kelompok Aldo, dan apa bedanya dengan alasan yang mereka keluhkan?",
      "Mengapa orang sering kali lebih suka mencari kambing hitam daripada berani mengenali masalah yang ada pada diri sendiri?",
      "Bagaimana kelompok Aldo bisa merumuskan masalah mereka secara objektif dan jujur agar dapat diperbaiki bersama?"
    ],
    challenge: "Saat menghadapi suatu masalah hari ini, tanyakan pertanyaan '5 Why' (Kenapa hal ini bisa terjadi?) sampai kamu menemukan akar masalahnya!"
  },
  {
    id: 42,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-02",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "pikirkan-pilihan",
    title: "Pikirkan Pilihan",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Jangan terjebak hanya pada satu jalan! Selalu ada lebih dari satu pilihan saat kita menghadapi simpang jalan.",
    scenario: "Saat berjalan di koridor sekolah yang sepi setelah bel pulang, Hanum menemukan sebuah dompet berisi uang Rp100.000 dan kartu identitas siswa tergeletak di lantai. Tidak ada siapa pun di sekitarnya. Pikiran pertama Hanum adalah mengambil uangnya untuk membeli jajanan dan mainan impiannya.",
    questions: [
      "Selain langsung mengambil uangnya, sebutkan setidaknya 3 pilihan tindakan lain yang bisa diambil oleh Hanum saat itu!",
      "Mengapa penting untuk berhenti sejenak dan memikirkan berbagai alternatif sebelum kita terburu-buru bertindak?",
      "Dari semua alternatif pilihan yang ada, pilihan mana yang paling menjunjung tinggi kejujuran dan rasa aman?"
    ],
    challenge: "Ketika kamu dihadapkan pada dilema hari ini, tuliskan minimal 3 opsi pilihan tindakan sebelum mengambil keputusan final!"
  },
  {
    id: 43,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-03",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "pertimbangkan-akibat",
    title: "Pertimbangkan Akibat",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Setiap pilihan ada harganya. Sebelum memilih, lihat dulu label harganya: apakah akibatnya menguntungkan atau merugikan?",
    scenario: "Fahri diajak oleh dua teman sebayanya untuk memanjat tembok belakang sekolah saat jam istirahat demi membeli es teh manis di warung luar sekolah. Teman-temannya membujuk: 'Ayo buruan, cuma lima menit! Nggak bakal ada guru yang tahu kok!'. Fahri tergoda karena cuaca sedang sangat terik dan ia ingin terlihat berani di mata temannya.",
    questions: [
      "Apa saja kemungkinan risiko dan akibat buruk (bagi keselamatan fisik, sanksi disiplin sekolah, dan nama baik keluarga) jika Fahri ikut memanjat?",
      "Siapa saja pihak yang akan dirugikan jika terjadi kecelakaan jatuh dari tembok pagar sekolah tersebut?",
      "Metode penimbangan apa yang bisa Fahri gunakan dalam hati untuk menyadari bahwa kesenangan sesaat itu tidak sebanding dengan risiko bahayanya?"
    ],
    challenge: "Lakukan analisis 'Sebab-Akibat': Sebelum melakukan hal yang berisiko, tanyakan: 'Jika aku melakukan ini sekarang, apa yang terjadi besok?'"
  },
  {
    id: 44,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-04",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "pilih-yang-tepat",
    title: "Pilih yang Tepat",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Pilihan yang benar terkadang bukan pilihan yang paling mudah atau paling populer. Tapi pilihan yang benar selalu membawa ketenangan di hati!",
    scenario: "Hari Minggu sore, Rian menghadapi dua pilihan sulit: ia sudah berjanji membantu adiknya belajar membaca untuk persiapan tes masuk sekolah dasar, tetapi di saat yang sama teman-teman kelompok bermainnya mengajak berkumpul untuk turnamen game online yang seru dan langka. Teman-temannya mengancam akan mengeluarkan Rian dari klan game jika ia tidak hadir.",
    questions: [
      "Nilai moral dan tanggung jawab keluarga mana yang memiliki bobot lebih mulia dalam situasi yang dihadapi Rian?",
      "Bagaimana cara Rian menjelaskan keputusannya kepada teman-temannya tanpa harus merasa bersalah atau takut kehilangan pertemanan?",
      "Mengapa keteguhan untuk memilih hal yang benar merupakan bukti kedewasaan karakter seseorang?"
    ],
    challenge: "Pilihlah untuk menyelesaikan kewajiban utamamu terlebih dahulu hari ini sebelum menikmati waktu bersenang-senang!"
  },
  {
    id: 45,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-05",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "aman-atau-tidak",
    title: "Aman atau Tidak?",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Keselamatanmu tidak ternilai harganya! Jangan gadaikan nyawa dan kesehatanmu hanya demi tepuk tangan sesaat dari teman.",
    scenario: "Beberapa anak di lingkungan rumah menantang Yoga untuk meluncur menuruni jalan turunan curam yang berbatu menggunakan sepeda tanpa memakai helm pelindung dan dengan rem sepeda yang sudah aus. Mereka bersorak: 'Kalau kamu penakut, mending pulang aja ke rumah mamamu!'. Yoga merasa harga dirinya ditantang.",
    questions: [
      "Apakah tantangan tersebut merupakan bukti keberanian sejati atau tindakan ceroboh yang membahayakan nyawa?",
      "Apa perbedaan antara 'pemberani yang cerdas' dengan 'nekat yang membabi buta'?",
      "Kalimat tegas apa yang bisa diucapkan Yoga dengan kepala tegak untuk menolak tantangan berbahaya tersebut tanpa merasa malu?"
    ],
    challenge: "Terapkan aturan 'Filter Keselamatan': Jika suatu aktivitas berpotensi mencederai dirimu atau orang lain, katakan TIDAK tanpa ragu!"
  },
  {
    id: 46,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-06",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "baik-atau-buruk",
    title: "Baik atau Buruk?",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Hati nurani kita itu kompas ajaib. Saat kita mau berbuat salah, kompas itu pasti bergetar memberi peringatan!",
    scenario: "Saat guru sedang keluar kelas sebentar untuk mengambil berkas, selembar kertas contekan kunci jawaban ujian beredar dari meja ke meja. Kertas itu mendarat di meja Nadya. Teman sebelahnya berbisik: 'Salin cepat Nad, mumpung gurunya belum balik! Nilai kita dijamin 100!'. Nadya tahu ia belum belajar maksimal semalam.",
    questions: [
      "Apa pesan yang dibisikkan oleh hati nurani Nadya saat melihat godaan kunci jawaban tersebut?",
      "Mengapa nilai 100 yang diperoleh dari kecurangan adalah sebuah kebohongan yang merusak kepercayaan diri dan integritas jangka panjang?",
      "Keputusan bermoral apa yang seharusnya diambil Nadya terhadap kertas contekan tersebut agar ia tetap menjadi pribadi yang jujur?"
    ],
    challenge: "Uji integritas: Lakukan hal yang benar hari ini meskipun tidak ada orang lain atau guru yang melihat perbuatanmu!"
  },
  {
    id: 47,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-07",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "berani-berkata-tidak",
    title: "Berani Berkata Tidak",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Teman yang baik akan menghargai kata 'Tidak' darimu jika itu untuk kebaikan. Jangan takut menolak hal yang salah!",
    scenario: "Geng murid populer di kelas mengajak Rian untuk menyembunyikan sepatu olahraga milik seorang anak pendiam saat pergantian jam pelajaran agar anak tersebut kebingungan dan dimarahi guru olahraga. Mereka mengancam: 'Kalau kamu nggak mau ikut andil, besok giliran tasmu yang kita lempar ke atas genteng!'.",
    questions: [
      "Mengapa tekanan teman sebaya (peer pressure) sering kali membuat seseorang takut berkata 'Tidak' dan rela melakukan hal jahat?",
      "Apakah sekelompok orang yang mengajak berbuat jahat dan mengancam layak disebut sebagai 'teman sejati'?",
      "Langkah perlindungan apa yang bisa diambil Rian untuk menolak ajakan tersebut dan melaporkan ancaman itu kepada pihak sekolah yang aman?"
    ],
    challenge: "Latih tatapan mata dan ucapan tegas: 'Maaf, aku tidak mau ikut melakukan hal itu karena itu merugikan orang lain'."
  },
  {
    id: 48,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-08",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "pikir-sebelum-bertindak",
    title: "Pikir Sebelum Bertindak",
    character: "nakula",
    characterName: "Nakula",
    characterQuote: "Kata-kata dan postingan yang sudah terlanjur dilepas seperti anak panah yang melesat: tidak bisa ditarik kembali!",
    scenario: "Merasa kesal karena timnya kalah dalam perlombaan debat kelas, Wildan membuka media sosialnya di kamar dan mengetik kalimat sindiran yang kasar dan menyebut nama salah satu juri dengan sebutan binatang. Jari Wildan sudah berada di atas tombol 'Kirim / Posting' dengan napas memburu karena dendam.",
    questions: [
      "Apa bahaya jejak digital (digital footprint) jika Wildan menekan tombol 'Posting' dalam kondisi amarah memuncak?",
      "Bagaimana aturan jeda 'Tunggu 24 Jam atau Baca 3 Kali' dapat menyelamatkan masa depan Wildan dari masalah hukum dan penyesalan moral?",
      "Saluran positif apa yang seharusnya digunakan Wildan untuk mengevaluasi kekalahan debatnya secara sehat?"
    ],
    challenge: "Sebelum mengirim pesan, mengunggah postingan, atau melontarkan ucapan keras hari ini, baca ulang dan pikirkan: 'Apakah ini benar, bermanfaat, dan baik?'"
  },
  {
    id: 49,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-09",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "belajar-dari-kesalahan",
    title: "Belajar dari Kesalahan",
    character: "bagas",
    characterName: "Bagas",
    characterQuote: "Orang pintar belajar dari kesalahannya, orang bijak belajar dari kesalahan orang lain. Jangan malu salah, yang penting jangan diulang!",
    scenario: "Bulan lalu Ardi mendapatkan nilai merah dalam ujian sains karena ia belajar dengan Sistem Kebut Semalam (SKS) sambil begadang bermain media sosial hingga jam 2 pagi. Besok lusa adalah ujian tengah semester berikutnya, namun Ardi mulai tergoda untuk mengulangi pola yang sama: menunda belajar dan asyik menonton maraton film kartun.",
    questions: [
      "Mengapa mengulangi pola perilaku yang sama dan mengharapkan hasil yang berbeda adalah bentuk keengganan untuk belajar dari masa lalu?",
      "Pelajaran berharga apa yang seharusnya sudah dipetik Ardi dari nilai merahnya bulan lalu?",
      "Rencana belajar konkret apa yang harus Ardi jalankan mulai sore ini agar ia membuktikan bahwa dirinya telah belajar dari kesalahannya?"
    ],
    challenge: "Tuliskan satu kesalahan yang pernah kamu buat bulan ini, dan tuliskan komitmen perbaikan apa yang sudah kamu terapkan sekarang!"
  },
  {
    id: 50,
    categoryKey: "responsible-decision-making",
    categoryName: "Responsible Decision-Making",
    categoryIndo: "Pengambilan Keputusan yang Bertanggung Jawab",
    categoryCode: "RDM-10",
    categoryColor: "#9b5cff",
    categoryAccent: "#ffe500",
    slug: "bertanggung-jawab",
    title: "Bertanggung Jawab",
    character: "mei",
    characterName: "Mei",
    characterQuote: "Tanggung jawab adalah mahkota kehormatan seseorang. Berani berbuat, berani bertanggung jawab!",
    scenario: "Saat bermain bola sepak di dalam ruang kelas—padahal sudah ada tata tertib larangan bermain bola di dalam ruangan—tendangan Nando meleset dan mengenai vas bunga keramik kesayangan wali kelas hingga hancur berkeping-keping. Teman-teman bermainnya langsung panik dan berbisik menyuruh Nando: 'Cepat buang serpihannya ke tong sampah luar, pura-pura aja kita nggak tahu siapa yang mecahin!'.",
    questions: [
      "Jika Nando memilih menyembunyikan kesalahannya dan berbohong, apa beban moral dan dampak ketidakjujuran yang akan ia pikul di dalam dadanya?",
      "Bagaimana sikap seorang ksatria yang bertanggung jawab ketika menghadapi situasi kesalahan yang tidak disengaja namun melanggar aturan?",
      "Langkah-langkah terhormat apa yang harus diambil Nando saat wali kelas masuk ke ruangan untuk mengakui perbuatannya dan menawarkan solusi ganti rugi?"
    ],
    challenge: "Latih sikap tanggung jawab hari ini: Jika ada tugas atau janjimu yang belum selesai, akui dengan jujur dan selesaikan tanpa mencari-cari alasan!"
  }
];

// Helper functions for parameter lookup
function getCaseStudyById(id) {
  const numericId = parseInt(id, 10);
  return CASE_STUDIES_DATA.find(c => c.id === numericId) || null;
}

function getCaseStudyBySlug(slug) {
  if (!slug) return null;
  const clean = String(slug).toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');
  return CASE_STUDIES_DATA.find(c => c.slug === clean) || null;
}

function getCaseStudyByCategoryAndSubId(categoryKey, subId) {
  const num = parseInt(subId, 10);
  if (!num || num < 1 || num > 10) return null;
  
  const catNormalized = String(categoryKey).toLowerCase().trim();
  const categoryMap = {
    'self-awareness': 'self-awareness',
    'kesadaran-diri': 'self-awareness',
    'sa': 'self-awareness',
    '1': 'self-awareness',
    
    'self-management': 'self-management',
    'manajemen-diri': 'self-management',
    'sm': 'self-management',
    '2': 'self-management',
    
    'social-awareness': 'social-awareness',
    'kesadaran-sosial': 'social-awareness',
    'soc': 'social-awareness',
    '3': 'social-awareness',
    
    'relationship-skills': 'relationship-skills',
    'keterampilan-berelasi': 'relationship-skills',
    'rel': 'relationship-skills',
    '4': 'relationship-skills',
    
    'responsible-decision-making': 'responsible-decision-making',
    'pengambilan-keputusan': 'responsible-decision-making',
    'rdm': 'responsible-decision-making',
    '5': 'responsible-decision-making'
  };

  const resolvedCat = categoryMap[catNormalized] || catNormalized;
  const inCat = CASE_STUDIES_DATA.filter(c => c.categoryKey === resolvedCat);
  return inCat[num - 1] || null;
}

function getCaseStudyByCode(code) {
  if (!code) return null;
  const clean = String(code).toUpperCase().trim();
  return CASE_STUDIES_DATA.find(c => c.categoryCode === clean) || null;
}

// Global accessor
window.CASE_STUDIES_DATA = CASE_STUDIES_DATA;
window.getCaseStudyById = getCaseStudyById;
window.getCaseStudyBySlug = getCaseStudyBySlug;
window.getCaseStudyByCategoryAndSubId = getCaseStudyByCategoryAndSubId;
window.getCaseStudyByCode = getCaseStudyByCode;
