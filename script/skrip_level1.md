# Skrip Level 1

| ID | Tipe | Konten | Ekspresi | Interaksi |
|---|---|---|---|---|
| 001 | NARATOR | Bel istirahat berbunyi. Nakula berjalan di taman sekolah. | — | — |
| 002 | KONTROL dan EFEK | Pemain menggerakkan Nakula mendekat hingga jarak tertentu dari Nabula untuk memicu dialog berikutnya. | Ekspresi ECA: normal | Gerakan (kontrol pemain), trigger untuk 003 |
| 003 | ECA | "Eh, tunggu... sepertinya ada yang lagi menahan tangis di sana." | Ekspresi ECA: kaget + Ekspresi Nabula: sedih | Speaker + Kamera otomatis mengarah ke Nabula |
| 004 | PILIHAN PEMAIN | PILIHAN: 1. "Ayo kita bicara dengannya." (+25) 2. "Aku nggak peduli." (-35) 3. "Mungkin cuma perasaanku aja." (-10) | Ekspresi ECA: penasaran + Ekspresi Nabula: sedih | Getaran saat pilihan muncul + getaran saat pilihan dipilih |
| 005a-1 | NAKULA | "Ayo kita bicara dengannya." | Ekspresi Nakula: normal + Ekspresi ECA: penasaran | Kamera kembali ke Nakula |
| 005a-2 | EFEK | Nakula otomatis bergerak mendekati Nabula yang sedang duduk menyendiri. Kamera mengikuti pergerakan Nakula hingga berada cukup dekat dengan Nabula. | Ekspresi ECA: senang + Ekspresi Nabula: sedih | Kamera mengikuti gerakannya |
| 005b-1 | NAKULA | "Aku nggak peduli." | Ekspresi Nakula: cuek + Ekspresi ECA: kaget + Ekspresi Nabula: sedih | Kamera tetap mengarah ke Nabula dari kejauhan |
| 005b-2 | NARATOR | Nabula masih duduk sendirian. Tidak ada yang menghampirinya. | Ekspresi ECA: sedih + Ekspresi Nabula: sedih | — |
| 005b-3 | NABULA | (bergumam pelan) "Nggak ada yang nyadar aku lagi sedih..." | Ekspresi Nabula: sedih + Ekspresi ECA: sedih | — |
| 005b-4 | ECA | "Nakula... coba lihat deh, Nabula masih di sana. Aku jadi kepikiran terus, nih." | Ekspresi ECA: khawatir + Ekspresi Nabula: sedih | Speaker |
| 005b-6 | PILIHAN PEMAIN | PILIHAN: 1. "Hampiri Nabula." (+10) 2. "Biarkan saja, lanjut jalan." (-10) | Ekspresi ECA: khawatir + Ekspresi Nabula: sedih | Getaran saat pilihan muncul + getaran saat pilihan dipilih |
| 005b-7a | EFEK | Nakula otomatis bergerak kembali menghampiri Nabula yang sedang duduk menyendiri. Kamera mengikuti pergerakan Nakula hingga berada cukup dekat dengan Nabula. | Ekspresi ECA: lega + Ekspresi Nabula: sedih | Kamera mengikuti gerakannya, lanjut ke 006 |
| 005b-7b | EFEK | Nakula dan Eca benar-benar melanjutkan langkah, menjauh dari Nabula. | Ekspresi ECA: sedih | Kamera tetap mengarah ke Nabula dari kejauhan |
| 005b-8 | NARATOR | Nabula akhirnya berdiri sendiri dan berjalan masuk ke perpustakaan, tanpa sempat bicara dengan siapa pun. | Ekspresi ECA: sedih | Kamera mengikuti Nabula dari kejauhan |
| 005b-9 | EFEK | Kamera perlahan berhenti mengikuti Nabula, kembali menyorot Nakula yang masih termenung. | Ekspresi ECA: sedih | Kamera mengarah ke Nakula (diam di tempat) |
| 005b-9b | ECA | "Nakula... Nabula masuk ke perpustakaan. Yuk, susul dia sebelum terlambat!" | Ekspresi ECA: khawatir | Speaker |
| 005b-9c | UI | QUEST (BATAS WAKTU): "Susul Nabula ke perpustakaan." | — | Getaran singkat + Timer 20 detik |
| 005b-9d | KONTROL | Pemain menggerakkan Nakula menuju pintu perpustakaan. | Ekspresi ECA: khawatir | Gerakan (kontrol pemain) |
| 005b-9e | EFEK | Nakula sampai di pintu perpustakaan tepat waktu. | Ekspresi ECA: lega | Getaran singkat, lanjut ke 016 (014 dan 015 dilewati karena fungsinya sudah digantikan 005b-9c dan 005b-9d) |
| 005b-10 | NARATOR | Nakula tidak sempat menyusul Nabula hari itu. | Ekspresi Nakula: sedih | — |
| 005b-11 | EFEK | Layar menggelap, menandakan hari itu berakhir tanpa penyelesaian. | — | Efek: layar menggelap |
| 005b-12 | ECA | "Nggak apa-apa, Nakula. Kadang kita telat sadar kalau teman butuh bantuan. Tapi besok, kita masih punya kesempatan buat coba lagi." | Ekspresi ECA: khawatir | Speaker |
| 005b-12b | UI | Hasil Akhir: ⚫ Harmoni: 0/100 — "Harmonia Padam" — "Nabula nggak sempat dapat bantuan kali ini. Tapi ini bukan akhir, yuk coba lagi dan perhatikan tanda-tanda saat teman butuh kamu." | — | Getaran singkat |
| 005b-13 | UI | LEVEL 1 SELESAI (Ending Alternatif): "Nabula masih butuh dukunganmu." | — | Getaran singkat |
| 005b-14 | UI | MENU PILIHAN: 1. "Main Ulang Level 1" (reset Harmoni ke 50) 2. "Kembali ke Beranda" 3. "Lanjut ke Level 2" 🔒 (Capai skor 60 ke atas untuk membuka Level 2) | — | Getaran singkat |
| 005c-1 | NAKULA | "Mungkin cuma perasaanku aja." | Ekspresi Nakula: ragu + Ekspresi ECA: khawatir | Kamera mengarah ke Nakula (diam di tempat) |
| 005c-2 | ECA | "Hmm... yakin? Soalnya dari sini aja kelihatan dia nahan tangis, lho. Nyesel nggak, kalau kita biarin aja?" | Ekspresi ECA: khawatir | Speaker |
| 005c-3 | NAKULA | "Eh... iya juga, ya. Mending kita cek deh." | Ekspresi Nakula: bingung + Ekspresi ECA: normal | — |
| 005c-4 | KONTROL | Pemain menggerakkan Nakula mendekat ke Nabula. | Ekspresi ECA: normal | Gerakan (kontrol pemain) |
| 006 | UI | Tekan "E" / tombol aksi untuk mulai berbicara dengan Nabula. | Ekspresi ECA: normal + Ekspresi Nabula: sedih | — |
| 006a | EFEK | (Khusus jalur "Ayo kita bicara dengannya.", 004) Nakula langsung menyapa tanpa perlu menekan tombol aksi. | Ekspresi ECA: normal | Auto-trigger, lanjut otomatis ke 007 |
| 007 | NAKULA | "Nabula?" | Ekspresi Nakula: normal + Ekspresi Nabula: sedih | Getaran lembut/pendek |
| 007a | SISTEM | Boneka Eca merasuki Nabula untuk menyuarakan dialognya. | Ekspresi Nabula: sedih | Transisi suara/karakter boneka → Nabula |
| 008 | NABULA | "Oh... hai, Nakula." | Ekspresi Nabula: sedih | Speaker |
| 009 | NARATOR | Nabula buru-buru menyeka matanya dan mencoba tersenyum, tapi senyumnya kelihatan nggak biasa. | Ekspresi Nabula: sedih | — |
| 010 | NAKULA | "Kamu nggak apa-apa, Nabula?" | Ekspresi Nakula: khawatir + Ekspresi Nabula: sedih | — |
| 011 | NABULA | "Aku nggak apa-apa, kok. Cuma... pengen sendirian aja tadi." | Ekspresi Nabula: sedih | Speaker |
| 012 | NARATOR dan EFEK | Nabula berdiri dan berjalan menuju perpustakaan. Kamera mengikuti Nabula sampai ia meninggalkan area taman. | Ekspresi Nabula: sedih | Kamera mengarah dan mengikuti Nabula + Getaran lembut/pendek |
| 012a | SISTEM | Boneka kembali merasuki Eca seiring kamera berpindah kembali ke Nakula. | — | Transisi suara/karakter boneka → Eca |
| 013 | EFEK | Kamera kembali mengarah ke Nakula setelah beberapa saat mengikuti Nabula. | Ekspresi ECA: khawatir | Kamera mengarah ke Nakula (diam di tempat) |
| 014 | UI | QUEST: "Ikuti Nabula ke perpustakaan." | Ekspresi ECA: normal | Getaran singkat |
| 015 | KONTROL | Nakula mengikuti dan sampai di depan pintu masuk perpustakaan. | Ekspresi ECA: normal | Gerakan (kontrol pemain) |
| 016 | KONTROL dan EFEK | Nakula berjalan di perpustakaan sekolah. Pemain menggerakkan Nakula hingga jarak tertentu untuk memicu dialog berikutnya. | Ekspresi ECA: normal | Gerakan (kontrol pemain), trigger untuk 017 |
| 017 | NARATOR dan EFEK | Suara Bagas dan Rio terdengar samar dari balik rak. Nabula tidak melihat mereka, tetapi dapat mendengar pembicaraan mereka. | Ekspresi ECA: penasaran + Ekspresi Nabula: sedih | Kamera otomatis mengarah ke Bagas dan Rio + Getaran lembut/pendek |
| 018 | BAGAS | "Hahaha, lihat deh si Nabula. Sok-sokan pura-pura nggak dengar kita ngomongin dia." | Ekspresi Nabula: sedih | — |
| 019 | RIO | "Iya, dari tadi jalannya buru-buru gitu terus. Kayak takut." | Ekspresi Nabula: sedih | — |
| 020 | NARATOR dan EFEK | Nabula yang mendengarkan sontak berlari sampai ia menghilang di tikungan rak. | Ekspresi Nabula: sedih | Kamera mengarah dan mengikuti Nabula |
| 021 | EFEK | Kamera kembali mengarah ke Nakula setelah beberapa saat mengikuti Nabula. | Ekspresi ECA: kaget | Kamera mengarah ke Nakula (diam di tempat) |
| 022 | NAKULA | "Kenapa, sih, mereka suka banget ngomongin orang kayak gitu?! Aku mau samperin mereka sekarang!" | Ekspresi Nakula: kesal + Ekspresi ECA: kaget | — |
| 023 | ECA | "Eh, tunggu dulu! Aku juga kesel, lho, denger mereka ngomong gitu. Tapi kalau kita samperin sekarang, takutnya malah tambah runyam. Gimana kalau kita cari tahu dulu apa yang sebenarnya terjadi sama Nabula?" | Ekspresi Nakula: kesal + Ekspresi ECA: tenang | Speaker |
| 024 | UI | PROGRES: "Temukan petunjuk (0/3)" | Ekspresi ECA: mencari/bingung | Getaran singkat |
| 025 | KONTROL | Pemain menggerakkan Nakula mencari sekeliling perpustakaan. | Ekspresi ECA: mencari/bingung | Gerakan (kontrol pemain) |
| 026 | UI | Tekan "E" / tombol aksi untuk melihat barang. | Ekspresi ECA: mencari/bingung | — |
| 027 | NARATOR dan EFEK | Nakula menemukan sebuah buku tergeletak di sela rak. | Ekspresi ECA: kaget | Barang tampil di layar |
| 028 | NAKULA | "Ini... buku tugas Nabula. Tapi kenapa halamannya robek-robek gini?" | Ekspresi Nakula: serius + Ekspresi ECA: serius | — |
| 029 | ECA | "Hmm, ini kayaknya bukan robek karena kecelakaan, deh. Coba lihat, robekannya rapi banget, cuma di bagian yang ada tulisannya." | Ekspresi ECA: serius | Speaker |
| 030 | UI | "1/3" | Ekspresi ECA: mencari/bingung | Getaran singkat |
| 031 | KONTROL | Pemain menggerakkan Nakula mencari sekeliling perpustakaan. | Ekspresi ECA: mencari/bingung | Gerakan (kontrol pemain) |
| 032 | UI | Tekan "E" / tombol aksi untuk mulai berbicara dengan Wulan. | Ekspresi ECA: mencari/bingung | — |
| 033 | NAKULA | "Wulan, boleh nanya sesuatu, nggak?" | Ekspresi Nakula: penasaran + Ekspresi ECA: penasaran | — |
| 034 | WULAN | "Eh, Nakula? Boleh, emang kenapa?" | Ekspresi Wulan: biasa | — |
| 035 | NAKULA | "Kamu tahu, nggak, kenapa Nabula akhir-akhir ini kelihatan sedih terus?" | Ekspresi Nakula: penasaran + Ekspresi Wulan: biasa | — |
| 036 | WULAN | "Aku sering lihat meja Nabula ditulisin macam-macam. Tapi aku takut ikut kena kalau aku bilang-bilang..." | Ekspresi Wulan: khawatir | — |
| 037 | UI | "2/3" | Ekspresi ECA: mencari/bingung | Getaran singkat |
| 038 | KONTROL dan EFEK | Pemain menggerakkan Nakula mendekat hingga jarak tertentu dari dua siswa untuk memicu dialog berikutnya. | Ekspresi ECA: mencari/bingung | Gerakan (kontrol pemain), trigger untuk 039 |
| 039 | NARATOR | Dua siswa itu tidak menyadari Nakula berada tidak jauh dari mereka. | Ekspresi ECA: penasaran | Kamera otomatis mengarah ke dua siswa |
| 040 | RAYA | "Eh, tadi pas istirahat aku lihat Nabula di kantin. Bagas sama Rio duduk deket-deket dia terus." | — | — |
| 041 | MEI | "Iya, aku juga lihat. Nabula jadi buru-buru banget makannya, kayak pengen cepet-cepet pergi." | — | — |
| 042 | RAYA | "Kasihan, sih. Tapi nggak ada yang berani negur mereka." | — | — |
| 043 | NAKULA | "Jadi bukan cuma di perpustakaan atau di sini aja... di kantin juga." | Ekspresi Nakula: penasaran + Ekspresi ECA: penasaran | — |
| 044 | EFEK | Kamera kembali mengarah ke Nakula. | Ekspresi Nakula: penasaran + Ekspresi ECA: penasaran | Kamera mengarah ke Nakula (diam di tempat) |
| 045 | ECA | "Tiga tempat, tiga kejadian. Ini bukan salah paham, ini pola." | Ekspresi ECA: serius | Speaker |
| 046 | UI | "3/3 — Semua petunjuk terkumpul." | Ekspresi ECA: serius | Getaran singkat |
| 047 | UI | QUEST: "Pergi ke kantin." | Ekspresi ECA: normal/reset | Getaran singkat |
| 048 | KONTROL | Pemain menggerakkan Nakula menuju kantin. | Ekspresi ECA: normal | Gerakan (kontrol pemain) |
| 049 | NARATOR dan EFEK | Nakula tiba di kantin. Di salah satu meja, Nabula sedang makan sendirian sampai Bagas dan Rio menghampiri dan duduk di dekatnya. | Ekspresi Nabula: sedih | Kamera otomatis mengarah ke Nabula + Getaran lembut/pendek |
| 050 | BAGAS | "Eh, Nabula. Sendirian lagi? Nggak punya teman lain, ya?" | Ekspresi Nabula: sedih | — |
| 051 | RIO | "Hahaha, iya. Geser dikit dong, kita mau duduk di sini." | Ekspresi Nabula: sedih | — |
| 052 | NARATOR | Bagas dan Rio duduk di dekat Nabula. Nabula terlihat tidak nyaman dan mulai mempercepat makannya. | Ekspresi Nabula: sedih | — |
| 053 | NARATOR | Nabula mencoba mengabaikan mereka, tetapi Bagas terus mengganggunya. | Ekspresi Nabula: sedih | — |
| 054 | BAGAS | "Kenapa diem aja? Biasanya juga sok sibuk." | Ekspresi Nabula: sedih | — |
| 055 | RIO | "Udah, Gas. Lihat tuh, mukanya langsung murung." | Ekspresi Nabula: sedih | — |
| 056 | EFEK | Kamera kembali mengarah ke Nakula. | Ekspresi ECA: khawatir | Kamera mengarah ke Nakula (diam di tempat) |
| 057 | ECA | "Nah, sekarang kamu lihat sendiri, kan? Nabula beneran lagi diganggu." | Ekspresi ECA: serius | Speaker |
| 057b | ECA | "Sebelum memilih, coba berhenti sebentar. Kalau kita lakukan sesuatu sekarang, apa yang mungkin terjadi pada Nabula? Dan pada kita?" | Ekspresi ECA: serius | Speaker. Timer 30 detik baru mulai setelah 057b selesai. |
| 058 | PILIHAN PEMAIN | PILIHAN: 1. "Berhenti ganggu Nabula!" (+25) 2. "Aku akan lapor ke Bu Wati." (+25) 3. "Nabula, kamu nggak apa-apa?" (+25) | Ekspresi Nabula: sedih | Getaran saat pilihan muncul + getaran saat pilihan dipilih + Timer 30 detik |
| 058x-1 | EFEK | (Timeout ke-1) Nakula berdiri diam, bingung harus ngapain. | Ekspresi Nakula: bingung | — |
| 058x-2 | ECA | (Timeout ke-1, pengurangan poin -15) "Eh, Nakula? Tenang, nggak perlu buru-buru. Coba pikirkan dulu: siapa yang bisa bantu Nabula sekarang?" | Ekspresi ECA: tenang | Speaker |
| 058x-3 | UI | Pilihan ditampilkan ulang. | — | Getaran singkat, trigger ulang ke 058 |
| 058x-5 | NARATOR | (Timeout ke-2, -15) Karena Nakula terus ragu, Bagas dan Rio keburu pergi duluan sebelum sempat ditegur siapa pun. | Ekspresi Nabula: sedih | — |
| 058x-6 | EFEK | Nabula buru-buru meninggalkan kantin, terlihat semakin sedih. | Ekspresi Nabula: sedih | Kamera mengikuti Nabula hingga keluar kantin |
| 058x-7 | ECA | "Nakula, ini kesempatan terakhir. Cepat susul Nabula ke taman, atau cari Bu Wati di perpustakaan, pilih salah satu, sebelum terlambat!" | Ekspresi ECA: khawatir | Speaker |
| 058x-8 | UI | QUEST (BATAS WAKTU): "Temui Nabula di taman ATAU Bu Wati di perpustakaan." | — | Getaran singkat + Timer 30 detik |
| 058x-9 | KONTROL | Pemain menggerakkan Nakula menuju salah satu lokasi tujuan. | — | Gerakan (kontrol pemain) |
| 058x-9a | EFEK | (Berhasil ke Taman, +10) Nakula berhasil menyusul Nabula yang duduk sendirian di taman. | Ekspresi Nabula: sedih | Kamera mengarah ke Nakula & Nabula, lanjut ke 059c-8 |
| 058x-9b | EFEK | (Berhasil ke Perpustakaan, +10) Nakula berhasil menemukan Bu Wati sebelum terlambat. | — | Kamera mengarah ke Nakula & Bu Wati, lanjut ke 059b-4 |
| 058x-10 | NARATOR | (Gagal total, waktu habis) Nakula tidak sempat menemukan Nabula maupun Bu Wati tepat waktu. | Ekspresi Nakula: sedih | — |
| 058x-11 | EFEK | Layar menggelap, menandakan hari itu berakhir tanpa penyelesaian. | — | Efek: layar menggelap |
| 058x-12 | ECA | "Nggak apa-apa, Nakula. Kadang kita emang telat ambil keputusan. Tapi besok, kita masih punya kesempatan buat coba lagi." | Ekspresi ECA: khawatir | Speaker |
| 058x-12b | UI | Hasil Akhir: ⚫ Harmoni: 0/100 — "Harmonia Padam" — "Nabula nggak sempat dapat bantuan kali ini. Tapi ini bukan akhir, yuk coba lagi dan perhatikan tanda-tanda saat teman butuh kamu." | — | Getaran singkat |
| 058x-12c | UI | "Kamu belum sempat memilih cara. Ada 3 cara menolong Nabula: Bicara langsung, Lapor ke orang dewasa, dan Mendengarkan dulu." | — | Getaran singkat |
| 058x-13 | UI | LEVEL 1 SELESAI (Ending Alternatif): "Nabula masih butuh dukunganmu." | — | Getaran singkat |
| 058x-14 | UI | MENU PILIHAN: 1. "Main Ulang Level 1" (reset Harmoni ke 50) 2. "Kembali ke Beranda" 3. "Lanjut ke Level 2" 🔒 (Capai skor 60 ke atas untuk membuka Level 2) | — | Getaran singkat |
| 059a-1 | EFEK | Nakula otomatis bergerak mendekati Nabula yang sedang duduk di meja kantin. Kamera mengikuti pergerakan Nakula. | Ekspresi Nabula: sedih | Kamera mengikuti gerakan Nakula |
| 059a-2 | NAKULA | "Berhenti ganggu Nabula!" | Ekspresi Nakula: serius + Ekspresi Nabula: kaget | — |
| 059a-3 | EFEK | Bagas dan Rio terdiam sejenak lalu menoleh ke arah Nakula. Nabula terlihat terkejut. | Ekspresi Nabula: kaget | Tangan: mulai genggam (aktifkan sensor) |
| 059a-4 | BAGAS | "Hah? Emang kamu siapa ikut campur?" | Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-5 | NAKULA | "Aku nggak perlu ikut campur kalau kalian memang nggak sedang mengganggu dia. Tapi dari tadi jelas kalian bikin Nabula nggak nyaman." | Ekspresi Nakula: serius + Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-6 | RIO | "Cuma bercanda, kali. Santai aja, kenapa, sih." | Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-7 | NAKULA | "Kalau dia nggak merasa itu lucu, berarti bukan bercanda lagi." | Ekspresi Nakula: serius + Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-8 | NARATOR | Bagas terdiam. Rio terlihat tidak nyaman. | Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-9 | BAGAS | "Hmph... iya, iya. Tapi ini belum selesai." | Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-10 | EFEK | Bagas dan Rio meninggalkan meja. | Ekspresi Nabula: khawatir | (auto-play, butuh sensor tangan aktif) |
| 059a-11 | NABULA | "Makasih, Nakula... tapi aku takut mereka balik lagi." | Ekspresi Nabula: lega + khawatir | Speaker + Getaran lembut. Sensor tidak dimatikan di sini. |
| 059a-12 | ECA | "Kamu berani banget tadi. Tapi masalahnya belum tentu selesai. Nanti kita ceritakan juga ke Bu Wati, ya, supaya ada orang dewasa yang ikut menjaga." | Ekspresi ECA: serius | Speaker (auto-play, butuh sensor tangan aktif) |
| 059a-13 | NARATOR | Nabula mengangguk pelan. Nakula tersenyum, menemaninya. (lanjut ke 060) | Ekspresi Nabula: lega | (auto-play) Tangan: sensor dimatikan |
| 059b-1 | NAKULA | "Aku akan lapor ke Bu Wati." | Ekspresi Nakula: serius | — |
| 059b-2 | UI | QUEST: "Cari Bu Wati di perpustakaan." | Ekspresi ECA: normal | Getaran singkat |
| 059b-3 | KONTROL | Pemain menggerakkan Nakula menuju perpustakaan untuk mencari Bu Wati. | Ekspresi ECA: normal | Gerakan (kontrol pemain) |
| 059b-4 | UI | Tekan "E" / tombol aksi untuk mulai berbicara dengan Bu Wati. | Ekspresi ECA: normal | — |
| 059b-5 | NAKULA | "Bu Wati, saya lihat Nabula diganggu Bagas dan Rio di kantin. Ini juga seperti yang saya dengar sebelumnya di sini." | Ekspresi Nakula: serius | — |
| 059b-6 | BU WATI | "Kalau begitu, ibu perlu lihat langsung situasinya. Ayo antar ibu ke kantin." | — | — |
| 059b-7 | EFEK | Layar menggelap sejenak, menandakan perjalanan Bu Wati dan Nakula menuju kantin. | — | Efek: layar menggelap → menerang |
| 059b-8 | EFEK | Layar kembali terang. Bu Wati dan Nakula kini berada di kantin, melihat dari kejauhan Bagas dan Rio masih duduk di dekat Nabula, terus menggodanya. | Ekspresi Nabula: kaget | Efek: layar menerang |
| 059b-9 | BU WATI | "Kamu benar, Nakula. Ibu lihat sendiri sekarang, mereka memang sedang mengganggu Nabula." | Ekspresi Nabula: kaget | — |
| 059b-10 | NAKULA | "Iya, Bu. Dari tadi juga kelihatan Nabula nggak nyaman." | Ekspresi Nakula: serius + Ekspresi Nabula: kaget | — |
| 059b-11 | EFEK | Bu Wati dan Nakula otomatis berjalan menghampiri meja Nabula. Kamera mengikuti pergerakan mereka berdua. | Ekspresi Nabula: khawatir | Kamera mengarah dan mengikuti Bu Wati & Nakula + Getaran lembut/pendek |
| 059b-12 | BU WATI | "Bagas, Rio, tolong ikut Ibu sebentar. Kita bicara di ruang sebelah." | Ekspresi Nabula: kaget | — |
| 059b-13 | BAGAS | "...Iya, Bu." | Ekspresi Nabula: kaget | — |
| 059b-14 | EFEK | Bagas dan Rio berdiri dengan enggan di dekat Bu Wati. Tidak ada yang dimarahi di depan umum. | Ekspresi Nabula: khawatir | — |
| 059b-15 | BU WATI | "Nabula, Ibu bicara dulu dengan mereka, ya. Nanti Ibu temui kamu lagi dengan tenang. Terima kasih sudah berani. Nakula, terima kasih sudah lapor." | Ekspresi Nabula: sedih | — |
| 059b-15b | EFEK | Layar menggelap sejenak. Bu Wati, Bagas, dan Rio meninggalkan meja. | — | Efek: layar menggelap → menerang |
| 059b-15c | EFEK | Layar kembali terang. Hanya Nakula dan Nabula di meja kantin. | Ekspresi Nabula: lega | Efek: layar menerang |
| 059b-16 | NABULA | "Mereka sering melakukan itu... Makasih, Nakula, sudah mau lapor." | Ekspresi Nabula: sedih → lega | Speaker |
| 059b-17 | NARATOR | Nabula merasa sedikit lega. Bu Wati akan menemuinya lagi untuk mendengarkan ceritanya dan meneruskan laporan kepada pihak sekolah. | Ekspresi Nabula: lega | — (lanjut ke 060) |
| 059c-1 | NARATOR dan EFEK | Nabula semakin tidak nyaman dan mempercepat makannya. | Ekspresi Nabula: sedih | Kamera otomatis mengarah ke Nabula |
| 059c-2 | NARATOR dan EFEK | Lalu buru-buru berdiri dan meninggalkan kantin. Kamera mengikuti Nabula. | Ekspresi Nabula: sedih | Kamera otomatis mengikuti ke Nabula |
| 059c-3 | EFEK | Nabula keluar dari kantin. | — | Nabula menghilang di depan pintu |
| 059c-4 | EFEK | Kamera kembali mengarah ke Nakula. | Ekspresi ECA: normal/reset | Kamera mengarah ke Nakula (diam di tempat) |
| 059c-5 | UI | QUEST: "Cari Nabula di taman." | Ekspresi ECA: normal | Getaran singkat |
| 059c-6 | KONTROL | Pemain menggerakkan Nakula mencari Nabula hingga menemukannya duduk sendirian di taman. | Ekspresi ECA: normal | Gerakan (kontrol pemain) |
| 059c-7 | UI | Tekan "E" / tombol aksi untuk mulai berbicara dengan Nabula. | Ekspresi ECA: normal + Ekspresi Nabula: sedih | — |
| 059c-8 | NAKULA | "Nabula, aku nyusul kamu ke sini..." | Ekspresi Nakula: khawatir + Ekspresi Nabula: sedih | — |
| 059c-9 | NABULA | "Kamu ngapain nyusul aku?" | Ekspresi Nabula: kaget | Speaker |
| 059c-10 | NAKULA | "Aku khawatir. Tadi di kantin kelihatan banget kamu nggak nyaman." | Ekspresi Nakula: khawatir + Ekspresi Nabula: sedih | — |
| 059c-11 | NABULA | "Aku udah biasa, kok..." | Ekspresi Nabula: sedih | Speaker |
| 059c-12 | NAKULA | "Kenapa kamu nggak pernah melawan waktu mereka ganggu kamu?" | Ekspresi Nakula: bingung + Ekspresi Nabula: sedih | — |
| 059c-13 | NABULA | "Aku takut, Nakula. Kalau aku ngelawan, mereka malah bisa makin sering ganggu aku." | Ekspresi Nabula: sedih | Speaker |
| 059c-14 | NAKULA | "Kalau kamu takut buat ngomong langsung ke mereka, gimana kalau kita cerita ke guru? Biar ada yang bantu awasin, jadi mereka nggak berani ganggu kamu lagi." | Ekspresi Nakula: serius + Ekspresi Nabula: sedih | — |
| 059c-15 | NABULA | "Cerita ke guru? Tapi... nanti malah tambah rame gimana?" | Ekspresi Nabula: khawatir | Speaker |
| 059c-16 | NAKULA | "Nggak harus langsung heboh, kok. Kita bisa cerita pelan-pelan ke Bu Wati dulu." | Ekspresi Nakula: serius + Ekspresi Nabula: khawatir | — |
| 059c-17 | ECA | "Eh, aku setuju sama Nakula. Melapor itu bukan berarti bikin masalah makin besar, kok, justru itu salah satu cara paling aman buat kamu." | Ekspresi ECA: serius + Ekspresi Nabula: khawatir | Speaker |
| 059c-18 | NABULA | "Aku... masih agak takut. Tapi kalau ada kamu yang nemenin..." | Ekspresi Nabula: sedih | Speaker + Tangan: mulai genggam (aktifkan sensor) |
| 059c-19 | NAKULA | "Aku temenin. Kamu nggak harus sendirian." | Ekspresi Nakula: normal + Ekspresi Nabula: sedih | (auto-play, butuh sensor tangan aktif) |
| 059c-20 | NARATOR | Nabula mengangguk pelan, lalu berdiri bersama Nakula. | Ekspresi Nabula: lega | (auto-play, butuh sensor tangan aktif) |
| 059c-21 | UI | QUEST: "Temui Bu Wati di perpustakaan bersama Nabula." | — | Getaran singkat + Tangan: sensor dimatikan |
| 059c-22 | EFEK | Layar menggelap sejenak, menandakan perjalanan Nakula dan Nabula menuju perpustakaan. | — | Efek: layar menggelap → menerang |
| 059c-23 | EFEK | Layar kembali terang. Nakula dan Nabula kini berada di depan pintu perpustakaan. | Ekspresi Nabula: sedih | Efek: layar menerang |
| 059c-24 | EFEK | Nakula dan Nabula otomatis berjalan masuk menuju meja Bu Wati. Kamera mengikuti pergerakan mereka berdua. | Ekspresi Nabula: sedih | Kamera mengarah dan mengikuti Nakula & Nabula + Getaran lembut/pendek |
| 059c-25 | BU WATI | "Nabula? Ada yang bisa Ibu bantu?" | Ekspresi Nabula: sedih | — |
| 059c-26 | NABULA | "Bu, saya... saya mau cerita soal Bagas dan Rio." | Ekspresi Nabula: sedih | Speaker |
| 059c-27 | BU WATI | "Kamu boleh cerita pelan-pelan, Ibu dengarkan." | Ekspresi Nabula: sedih | — |
| 059c-28 | EFEK | Nabula mulai bercerita, ditemani Nakula di sampingnya. | Ekspresi Nabula: lega | — |
| 060 | NARATOR | Nakula menyadari bahwa masalah Nabula ternyata sudah berlangsung di beberapa tempat dan bukan hanya kejadian sekali. | — | — |
| 060b | NARATOR | Dari kejauhan, Wulan memperhatikan Nakula dan Nabula. Ia tampak ingin mendekat, tapi akhirnya hanya menggenggam tasnya erat-erat dan berbalik pergi pelan-pelan. | Ekspresi Wulan: khawatir | Kamera menyorot Wulan sejenak |
| 060c | ECA | "Kadang teman yang tahu sesuatu juga takut buat bicara. Itu wajar, lho. Kita nggak bisa maksa, tapi kita bisa tunjukin kalau kita siap mendengarkan." | Ekspresi ECA: khawatir | Speaker |
| 061a | ECA | (Jalur A) "Tadi kamu berani banget langsung bicara ke mereka. Cara ini cepat dan tegas, tapi bisa berisiko kalau mereka malah marah. Makanya orang dewasa tetap perlu ikut menjaga Nabula." | Ekspresi ECA: serius | Speaker |
| 061b | ECA | (Jalur B) "Kamu langsung cari bantuan orang dewasa tadi. Itu keren, lho. Cara ini lebih aman, tapi butuh waktu sampai orang dewasa bertindak. Tahu kapan harus minta tolong juga bentuk keberanian." | Ekspresi ECA: serius | Speaker |
| 061c | ECA | (Jalur C) "Kamu dengerin Nabula dulu sebelum bertindak tadi. Dia merasa ditemani, tapi masalahnya belum berhenti sendiri, jadi bantuan orang dewasa tetap penting. Aku suka caramu." | Ekspresi ECA: serius | Speaker |
| 061b-x | ECA | (Jalur B, lewat rute susulan) "Sempat ragu tadi, ya? Nggak apa-apa, yang penting akhirnya kamu tetap nyari bantuan buat Nabula. Lain kali, coba lebih percaya sama diri sendiri." | Ekspresi ECA: serius | Speaker |
| 061c-x | ECA | (Jalur C, lewat rute susulan) "Tadi kamu sempat bingung harus ngapain, tapi akhirnya kamu tetap nyamperin Nabula. Itu juga bentuk usaha, lho, biarpun telat dikit." | Ekspresi ECA: serius | Speaker |
| 062a/b/c | UI | Peluk Eca untuk melanjutkan. | — | Pelukan, trigger untuk 062a2/b2/c2 |
| 062a2/b2/c2 | UI | Hasil Akhir: [Lambang] Harmoni: XX/100 — [Nama Kategori sesuai tabel] — [Pesan sesuai kategori] | — | Getaran singkat |
| 062a3 | UI | (Jalur A) "Cara yang kamu pilih: Bicara langsung. Masih ada 2 cara lain yang juga bisa menolong Nabula: Lapor ke orang dewasa dan Mendengarkan dulu." | — | Getaran singkat |
| 062b3 | UI | (Jalur B) "Cara yang kamu pilih: Lapor ke orang dewasa. Masih ada 2 cara lain: Bicara langsung dan Mendengarkan dulu." | — | Getaran singkat |
| 062c3 | UI | (Jalur C) "Cara yang kamu pilih: Mendengarkan dulu. Masih ada 2 cara lain: Bicara langsung dan Lapor ke orang dewasa." | — | Getaran singkat |
| 063a/b/c | UI | LEVEL 1 SELESAI: "Bantu Nabula mendapatkan dukungan." | — | Getaran singkat |
| 064a-1 | ECA | (Jalur A, skor ≥ 60) "Kamu sudah berani bicara langsung. Mau lanjut atau coba cara lain?" | Ekspresi ECA: senang | Speaker |
| 064b-1 | ECA | (Jalur B, skor ≥ 60) "Kamu sudah melapor ke orang dewasa. Hebat! Mau lanjut atau coba cara lain?" | Ekspresi ECA: senang | Speaker |
| 064c-1 | ECA | (Jalur C, skor ≥ 60) "Kamu sudah mendengarkan Nabula dulu. Keren! Mau lanjut atau coba cara lain?" | Ekspresi ECA: senang | Speaker |
| 064a-2 / 064b-2 / 064c-2 | UI | MENU PILIHAN (skor ≥ 60): 1. "Lanjut ke Level 2" 2. "Coba Cara Lain di Level 1" (reset Harmoni ke 50) 3. "Kembali ke Beranda" | Ekspresi ECA: senang | Getaran saat menu muncul + getaran saat pilihan dipilih |
| 064x-1 | ECA | (Skor < 60) "Kamu sudah berusaha menolong Nabula, dan itu penting. Yuk, coba lagi dan perhatikan tanda-tanda saat teman butuh kamu!" | Ekspresi ECA: menyemangati | Speaker |
| 064x-2 | UI | MENU PILIHAN (skor < 60): 1. "Main Ulang Level 1" (reset Harmoni ke 50) 2. "Kembali ke Beranda" 3. "Lanjut ke Level 2" 🔒 (Capai skor 60 ke atas untuk membuka Level 2) | Ekspresi ECA: menyemangati | Getaran saat menu muncul + getaran saat pilihan dipilih |
