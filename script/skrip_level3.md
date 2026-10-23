# Skrip Level 3

| ID | Tipe | Konten | Ekspresi | Interaksi |
|---|---|---|---|---|
| 000 | SISTEM | Syarat akses: Level ini terbuka setelah Level 2 selesai dengan skor Harmoni ≥ 75. Muncul ikon quest di atas kepala Nabula yang duduk di taman. Pemain harus mendekat dan menekan tombol aksi untuk memulai. | — | Ikon quest tampil di atas Nabula, trigger untuk 001 saat ditekan |
| 001 | KONTROL | Pemain menggerakkan Nakula mendekat hingga jarak tertentu dari Nabula untuk memicu dialog berikutnya. | — | Gerakan (kontrol pemain), trigger untuk 002 |
| 002 | NARATOR | Nabula duduk sendirian di taman, tempat yang sama di mana Nakula pertama kali menemukannya menangis. | Ekspresi Nabula: bingung | Kamera otomatis mengarah ke Nabula |
| 003 | NAKULA | "Nabula? Kamu nggak apa-apa?" | Ekspresi Nabula: bingung | — |
| 004 | NABULA | "Aku nggak apa-apa, kok. Cuma... masih suka waswas aja kalau ada yang deketin aku tiba-tiba." | Ekspresi Nabula: khawatir | Speaker |
| 005 | ECA | "Wajar banget, Nabula. Butuh waktu buat ngerasa aman lagi, apalagi setelah apa yang kamu alami." | Ekspresi ECA: serius | Speaker |
| 006 | NABULA | "Aku juga ngerasa... aku nggak pernah bilang apa-apa pas mereka ganggu aku. Aku cuma diem aja terus." | Ekspresi Nabula: sedih | Speaker |
| 007 | NAKULA | "Kenapa kamu nggak pernah bilang apa yang kamu rasain?" | Ekspresi Nakula: bingung | — |
| 008 | NABULA | "Aku takut kalau aku ngomong, malah tambah diketawain." | Ekspresi Nabula: sedih | Speaker |
| 009 | ECA | "Eh, aku punya ide. Gimana kalau kita latihan dulu? Nggak harus langsung sempurna, kok, latihan pelan-pelan aja." | Ekspresi ECA: senang | Speaker |
| 009b | NAKULA | "Nabula, gimana kalau kita latihan dulu? Aku pura-pura jadi orang yang ganggu, kamu latihan bilang batasanmu. Ini cuma latihan, kok." | Ekspresi Nakula: normal + Ekspresi Nabula: bingung | — |
| 010 | UI | MINI-GAME "Latihan Batasan": Genggam tangan Eca untuk memulai latihan. | Ekspresi ECA: normal | Tangan: mulai genggam (aktifkan sensor) + getaran singkat |
| 010a | NAKULA | (pura-pura, hanya latihan) "Hehe, kamu kan emang lucu kalau lagi diem." | Ekspresi Nakula: usil (pura-pura) + Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 010b | UI | Muncul 3 kartu: Perbuatan "Aku nggak suka kamu ngatain aku", Perasaan "karena aku jadi malu", Permintaan "tolong berhenti, ya". Pemain mengetuk kartu yang ingin dipakai (minimal 1), lalu menekan "Selesai". Kartu diucapkan dengan urutan tetap: perbuatan, perasaan, permintaan. Poin: 3 kartu (+15), 2 kartu (+10), 1 kartu (+5). Tidak ada penalti. | Ekspresi ECA: tenang | Getaran saat kartu dipilih + getaran saat "Selesai" ditekan |
| 010c | SISTEM | (Jika genggaman terlepas) Mini-game berhenti sejenak sampai tangan Eca digenggam lagi. ECA: "Genggam tanganku lagi, ya, biar kita lanjut bareng." | Ekspresi ECA: tenang | Mini-game pause, lanjut otomatis saat sensor aktif lagi |
| 010d | SISTEM | Boneka Eca merasuki Nabula untuk menyuarakan kalimat yang disusun pemain. | Ekspresi Nabula: khawatir | Transisi suara/karakter boneka → Nabula |
| 011 | NABULA | (Sesuai kartu terpilih) 3 kartu: "Aku nggak suka kamu ngatain aku, karena aku jadi malu. Tolong berhenti, ya." 2 atau 1 kartu: hanya kartu yang dipilih, dirangkai dengan urutan tetap. | Ekspresi Nabula: serius | Speaker (auto-play, butuh sensor tangan aktif) |
| 011b | SISTEM | Boneka kembali merasuki Eca. | — | Transisi suara/karakter boneka → Eca + Tangan: sensor dimatikan |
| 011c | NAKULA | (3 atau 2 kartu) (pura-pura) "Oh... maaf, aku nggak tahu kamu nggak nyaman." | Ekspresi Nakula: menyesal (pura-pura) | — |
| 011d | NAKULA | (1 kartu) (pura-pura) "Hmm... aku masih kurang ngerti maksudmu. Maksudnya gimana, ya?" | Ekspresi Nakula: bingung | — |
| 012a | ECA | (3 kartu, +15) "Nakula, lihat tadi? Nabula nyebutin perbuatannya, perasaannya, dan permintaannya. Jelas, tenang, nggak perlu marah-marah. Itu namanya nyampein batasan." | Ekspresi ECA: senang | Speaker |
| 012b | ECA | (2 kartu, +10) "Nakula, tadi sudah jelas banget. Biar makin lengkap, lain kali tambah satu lagi: perasaannya atau permintaannya." | Ekspresi ECA: senang | Speaker |
| 012c | ECA | (1 kartu, +5) "Nakula, awal yang bagus, Nabula sudah berani mulai. Kalau ditambah perasaan dan permintaan, orangnya jadi lebih paham." | Ekspresi ECA: tenang | Speaker |
| 012d | NAKULA | (Semua kartu) "Nabula, tadi itu keren. Kamu nggak marah-marah, tapi jelas banget." | Ekspresi Nakula: normal | — |
| 013 | NABULA | "Aku... jadi pengen coba, deh. Tapi masih deg-degan kalau beneran ketemu mereka." | Ekspresi Nabula: khawatir | Speaker |
| 013b | PILIHAN PEMAIN | PILIHAN: 1. "Aku temenin kamu kalau kamu mau." (+10) 2. "Terserah kamu, nggak harus buru-buru." (+10) 3. "Udah, besok langsung bilang aja ke mereka!" (-10) | Ekspresi ECA: normal + Ekspresi Nabula: khawatir | Getaran saat pilihan muncul + getaran saat pilihan dipilih |
| 013c-1 | NAKULA | (Pilihan 1) "Aku temenin kamu kalau kamu mau." | Ekspresi Nakula: normal | — |
| 013c-2 | NAKULA | (Pilihan 2) "Terserah kamu, nggak harus buru-buru." | Ekspresi Nakula: normal | — |
| 013c-3 | NAKULA | (Pilihan 3) "Udah, besok langsung bilang aja ke mereka!" | Ekspresi Nakula: semangat | — |
| 013d-1 | NABULA | (Pilihan 1) "Makasih, Nakula. Kalau ada kamu, aku jadi lebih berani." | Ekspresi Nabula: lega | Speaker |
| 013d-2 | NABULA | (Pilihan 2) "Iya... makasih udah nggak maksa aku." | Ekspresi Nabula: lega | Speaker |
| 013d-3 | NABULA | (Pilihan 3) "Eh... iya sih, tapi aku jadi makin deg-degan..." | Ekspresi Nabula: khawatir | Speaker |
| 013e | ECA | (Pilihan 3) "Semangatmu bagus, Nakula, tapi keberanian nggak bisa dipaksa. Lebih enak kalau kita bilang, 'aku ada di sini kalau kamu butuh.'" | Ekspresi ECA: serius | Speaker, lanjut ke 013f |
| 013e-1 | ECA | (Pilihan 1 dan 2) "Hadir tanpa menekan itu bentuk dukungan yang bagus. Nabula jadi merasa aman." | Ekspresi ECA: senang | Speaker, lanjut ke 013f |
| 013f | EFEK | (Semua pilihan di 013b) Layar menggelap sejenak, menandakan waktu berlalu hingga esok hari. | — | Efek: layar menggelap |
| 014 | NARATOR | Esok harinya, sesuatu yang tidak terduga terjadi di kelas. | — | Dibacakan saat layar masih gelap |
| 014b | EFEK | Layar kembali terang. Nakula dan Nabula kini berada di dalam kelas. | Ekspresi Nabula: khawatir | Efek: layar menerang, lanjut ke 017 |
| 017 | EFEK | Bagas dan Rio mendekati meja Nabula, terlihat canggung. | Ekspresi Nabula: kaget | Kamera otomatis mengarah ke Bagas & Rio |
| 018 | BAGAS | "Nabula... boleh ngomong sebentar, nggak? Dari kemarin kita mikirin ini." | Ekspresi Nabula: khawatir | Tangan: mulai genggam (aktifkan sensor) |
| 019 | NABULA | "Mau ngomong apa?" | Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 020 | RIO | "Kita minta maaf. Kita udah ngomongin kamu di belakang dan ngatain kamu terus. Itu salah, dan bikin kamu nggak nyaman." | — | (auto-play, butuh sensor tangan aktif) |
| 021 | BAGAS | "Iya. Maaf banget, Nabula. Kita nggak minta kamu langsung maafin, kok." | — | (auto-play, butuh sensor tangan aktif) |
| 022 ✏️ | PILIHAN PEMAIN | PILIHAN: 1. "Makasih udah minta maaf. Aku maafin, kok." (+15) 2. "Aku maafin, tapi aku nggak suka kalau kalian ngomongin aku di belakang lagi." (+25) 3. (diam, belum siap menjawab) (+15) 4. "Aku nggak mau maafin kalian! Pergi sana!" (marah, Harmoni langsung padam) | — | Getaran saat pilihan muncul + getaran saat pilihan dipilih + Timer 30 detik (mulai setelah pilihan muncul) |
| 022t 🆕 | SISTEM | (Timeout) Jika waktu habis, pilihan 3 terpilih otomatis, +15, tanpa penalti. Lanjut ke 023c. | — | Pilihan 3 dipilih otomatis, getaran singkat |
| 023a | NABULA | (Pilihan 1) "Makasih udah minta maaf. Aku maafin, kok." | Ekspresi Nabula: lega | Tangan: sensor dimatikan |
| 024a | BAGAS | (Pilihan 1) "Makasih udah mau maafin kita." | — | — |
| 025a | ECA | (Pilihan 1) "Memaafkan itu pilihanmu, Nabula. Kalau lain kali ada yang bikin nggak nyaman, kamu juga boleh bilang, ya." | Ekspresi ECA: tenang | Speaker |
| 023b | NABULA | (Pilihan 2) "Aku maafin, tapi aku nggak suka kalau kalian ngomongin aku di belakang lagi." | Ekspresi Nabula: serius | Tangan: sensor dimatikan |
| 024b | RIO | (Pilihan 2) "Oke, Nabula. Janji, deh, nggak bakal diulang lagi." | — | — |
| 025b | ECA | (Pilihan 2) "Keren, Nabula! Kamu nyampein apa yang kamu rasain tanpa marah-marah. Itu bukan hal gampang, lho." | Ekspresi ECA: senang | Speaker |
| 023c | NABULA | (Pilihan 3 atau timeout) (Nabula diam sejenak, belum menjawab apa-apa.) | Ekspresi Nabula: bingung | Tangan: sensor dimatikan |
| 024c | NAKULA | (Pilihan 3 atau timeout) "Nggak apa-apa kalau kamu belum siap jawab sekarang, Nabula." | Ekspresi Nakula: normal | — |
| 025c | ECA | (Pilihan 3 atau timeout) "Iya, kamu boleh ambil waktu. Nggak harus langsung maafin kalau belum siap." | Ekspresi ECA: serius | Speaker |
| 025d | BAGAS | (Pilihan 3 atau timeout) "Iya, nggak apa-apa. Kita tunggu sampai kamu siap." | Ekspresi Bagas: menyesal | — |
| 023d 🆕 | NABULA | (Pilihan 4) "Aku nggak mau maafin kalian! Pergi sana, aku nggak mau dengar apa-apa!" | Ekspresi Nabula: marah | Speaker + Tangan: sensor dimatikan |
| 024d 🆕 | BAGAS | (Pilihan 4) "I-iya... maaf. Kita pergi dulu." | Ekspresi Bagas: menyesal | — |
| 025e 🆕 | NARATOR | (Pilihan 4) Bagas dan Rio pergi dengan kepala tertunduk. Nabula masih gemetar, napasnya cepat. Beberapa teman di kelas menoleh ke arah mereka. | Ekspresi Nabula: marah | — |
| 025f 🆕 | ECA | (Pilihan 4) "Nabula boleh marah, dan belum mau maafin itu hak dia. Tapi kalau emosinya meledak, pesannya jadi susah didengar. Latihan tadi bisa membantu: sebut perbuatannya, sampaikan perasaan dengan tenang." | Ekspresi ECA: khawatir | Speaker |
| 025g 🆕 | SISTEM | (Pilihan 4) Harmoni reset ke 0. | — | — |
| 025h 🆕 | UI | Hasil Akhir: ⚫ Harmoni: 0/100 — "Harmonia Padam" — "Marah itu wajar, dan belum siap memaafkan itu hakmu. Tapi emosi yang meledak bisa membuat pesanmu sulit didengar. Coba lagi dengan cara yang tenang." | — | Getaran singkat |
| 025i 🆕 | UI | "Kamu belum menemukan cara yang tenang. Ada 3 cara menanggapi permintaan maaf: memaafkan, memaafkan sambil menyampaikan batasan, dan meminta waktu kalau belum siap." | — | Getaran singkat |
| 025j 🆕 | UI | LEVEL 3 SELESAI (Ending Alternatif): "Suara Nabula masih perlu ditemukan dengan tenang." | — | Getaran singkat |
| 025k 🆕 | UI | MENU PILIHAN: 1. "Main Ulang Level 3" (reset Harmoni ke 50) 2. "Kembali ke Beranda" 3. "Lanjut ke Level 4" 🔒 (Capai skor 75 ke atas untuk membuka Level 4) | — | Getaran singkat |
| 026 | NARATOR | Bagas dan Rio mengangguk pelan, lalu kembali ke bangku mereka. | — | — |
| 026b | NARATOR | Dari sudut kelas, Wulan memperhatikan Nabula yang tadi berani bicara. Ia menunduk, lalu menggenggam pensilnya erat-erat. | Ekspresi Wulan: khawatir | Kamera menyorot Wulan sejenak |
| 027 | NABULA | "Tadi deg-degan banget, tapi... aku berhasil ngomong." | Ekspresi Nabula: lega | Speaker |
| 028 | NAKULA | "Aku bangga, lho, sama kamu." | Ekspresi Nakula: normal | — |
| 029a | ECA | (Pilihan 1) "Kamu memilih memaafkan, dan itu keputusanmu sendiri. Cara ini melegakan, tapi kamu tetap boleh menyampaikan batasan kalau ada yang nggak nyaman." | Ekspresi ECA: tenang | Speaker |
| 029b | ECA | (Pilihan 2) "Latihan kemarin kepake, kan? Kamu memaafkan sambil nyampein batasan. Cara ini jelas, tapi butuh keberanian, dan kamu udah mulai berani coba." | Ekspresi ECA: senang | Speaker |
| 029c | ECA | (Pilihan 3 atau timeout) "Kamu memilih mengambil waktu dulu. Itu juga cara yang valid, nggak ada kewajiban maafin sekarang. Kalau udah siap, kamu bisa bilang kapan aja." | Ekspresi ECA: serius | Speaker |
| 030 | NABULA | "Makasih udah nemenin aku belajar ini, Eca, Nakula." | Ekspresi Nabula: lega | Speaker |
| 031 | UI | Peluk Eca untuk melanjutkan. | — | Pelukan, trigger untuk 031b |
| 031b | UI | Hasil Akhir: [Lambang] Harmoni: XX/100 — [Nama Kategori sesuai tabel] — [Pesan sesuai kategori] | — | Getaran singkat |
| 031c | UI | "Tiga cara menyampaikan batasan: sebut perbuatannya, sampaikan perasaanmu dengan tenang, dan boleh minta waktu kalau belum siap." | — | Getaran singkat |
| 032 | UI | MISI SELESAI: "Bantu Nabula menemukan suaranya." | — | Getaran singkat |
| 033 | UI | WORLD STATE TERBUKA: Area sekolah dapat kembali dijelajahi. Beberapa karakter memiliki percakapan dan situasi baru. | — | Getaran singkat |
| 034a-1 | ECA | (Skor ≥ 75) "Kamu sudah membantu Nabula menemukan suaranya. Hebat! Mau lanjut atau coba cara lain?" | Ekspresi ECA: senang | Speaker |
| 034a-2 | UI | MENU PILIHAN (skor ≥ 75): 1. "Lanjut ke Level 4" 2. "Coba Cara Lain di Level 3" (reset Harmoni ke 50) 3. "Kembali ke Beranda" | Ekspresi ECA: senang | Getaran saat menu muncul + getaran saat pilihan dipilih |
| 034x-1 | ECA | (Skor < 75) "Kamu sudah berusaha mendampingi Nabula, dan itu penting. Yuk, coba lagi dan ingat: dukungan terbaik itu hadir tanpa memaksa." | Ekspresi ECA: menyemangati | Speaker |
| 034x-2 | UI | MENU PILIHAN (skor < 75): 1. "Main Ulang Level 3" (reset Harmoni ke 50) 2. "Kembali ke Beranda" 3. "Lanjut ke Level 4" 🔒 (Capai skor 75 ke atas untuk membuka Level 4) | Ekspresi ECA: menyemangati | Getaran saat menu muncul + getaran saat pilihan dipilih |
