# 🤖 PANDUAN HARDWARE & PINOUT RESMI CARETECH ESA (ESP32)

Dokumen ini berisi peta kabel (*pinout*), skema daya **Baterai Gurfa 7.4V + Step Down LM2596**, sensor tekanan **2x FSR402**, tombol push-to-talk **PBS 12mm**, mikrofon **INMP441**, dan speaker **MAX98357A**.

---

## ⚡ 0. Skema Manajemen Daya (Baterai Gurfa 7.4V & LM2596)

> [!CAUTION]
> **WAJIB KALIBRASI LM2596 SEBELUM DIHUBUNGKAN KE ESP32!**
> Baterai Gurfa 7.4V memiliki tegangan penuh hingga ~8.4V. **Jangan hubungkan langsung ke pin VIN ESP32 atau modul lainnya**.
> 1. Sambungkan Baterai Gurfa (+) ke `IN+` LM2596 dan (-) ke `IN-` LM2596.
> 2. Putar baut trimpot potensiometer biru pada modul LM2596 menggunakan obeng kecil sambil mengukur tegangan pada `OUT+` dan `OUT-` dengan multimeter.
> 3. Pastikan display multimeter menunjukkan **tepat 5.0 Volt DC**, baru kemudian sambungkan kabel `OUT+` ke ESP32 dan MAX98357A.

```
 [ Baterai Gurfa 7.4V ]
   (+) ───► [ Saklar On/Off ] ───► LM2596 IN+
   (-) ─────────────────────────► LM2596 IN-
                                       │
                    [ Kalibrasi Trimpot ke 5.0V ]
                                       │
   ┌───────────────────────────────────┴───────────────────────────────────┐
   │ LM2596 OUT+ (5.0V) ───► ESP32 Pin VIN                                 │
   │ LM2596 OUT+ (5.0V) ───► MAX98357A Pin VIN (Wajib 5V untuk 3W maks)    │
   │ LM2596 OUT- (GND)  ───► ESP32 Pin GND (Ground Bersama / Common Ground)│
   └───────────────────────────────────────────────────────────────────────┘
```

---

## 1. Peta Pinout Lengkap ESP32

```
                                ESP32 Dev Module
                                 ┌─────────────┐
                             3V3 │ [ ]     [ ] │ VIN <─── 5V Daya USB Laptop / Adaptor
                             GND │ [ ]     [ ] │ GND <─── Ground Bersama
         INMP441 SCK <── GPIO 14 │ [ ]     [ ] │ GPIO 22 ───> MAX98357A DIN (Audio Out)
                                 │ [ ]     [ ] │ GPIO 25 ───> MAX98357A LRC (Audio Out)
                                 │ [ ]     [ ] │ GPIO 26 ───> MAX98357A BCLK (Audio Out)
         INMP441 SD  <── GPIO 32 │ [ ]     [ ] │ GPIO 18 ───> [220Ω] ──► LED 1 (+) (Respon FSR 1)
         INMP441 WS  <── GPIO 33 │ [ ]     [ ] │ GPIO 19 ───> [220Ω] ──► LED 2 (+) (Respon FSR 2)
FSR 1 (Tangan Kiri)  ─── GPIO 34 │ [ ]     [ ] │ GPIO 2  ─── (LED Onboard Biru Status & Sentuh)
FSR 2 (Tangan Kanan) ─── GPIO 35 │ [ ]     [ ] │ GPIO 0  ─── (Tombol BOOT Onboard Pemicu Curhat)
                                 └─────────────┘
```

---

## 2. Rangkaian Sensor Tekanan FSR402 (Sensor Memegang Tangan Boneka)

Kedua sensor tekanan FSR402 dipasang pada tangan boneka dan dirangkai dengan metode pembagi tegangan menggunakan resistor **10k $\Omega$** ke GND:

### A. FSR 1 — Sensor Tangan Kiri Boneka (GPIO 34)
```
ESP32 3V3 ──────────[ Kaki 1 FSR 1 ]
                             │
ESP32 GPIO 34 ◄─────[ Kaki 2 FSR 1 ] ──┬── [ Resistor 10kΩ ] ──► ESP32 GND
```

### B. FSR 2 — Sensor Tangan Kanan Boneka (GPIO 35)
```
ESP32 3V3 ──────────[ Kaki 1 FSR 2 ]
                             │
ESP32 GPIO 35 ◄─────[ Kaki 2 FSR 2 ] ──┬── [ Resistor 10kΩ ] ──► ESP32 GND
```

* **Output Real-time di Serial Monitor (115200 baud):**
  ```text
  >>> [FSR 1 TEKANAN] Genggaman Tangan Kiri Boneka Terdeteksi! Level ADC: 3950 (GPIO 34)
  >>> [FSR 1 LEPAS] Genggaman Tangan Kiri Boneka Dilepas.

  >>> [FSR 2 TEKANAN] Genggaman Tangan Kanan Boneka Terdeteksi! Level ADC: 4020 (GPIO 35)
  >>> [FSR 2 LEPAS] Genggaman Tangan Kanan Boneka Dilepas.
  ```

---

## 3. Rangkaian LED Indikator Uji Coba (PWM Dimmer)

LED akan menyala redup saat dielus lembut, dan semakin terang saat ditekan kuat:

```
ESP32 GPIO 18 ───► [ Resistor 220Ω ] ───► [ Kaki Panjang (+) LED 1 ]
                                          [ Kaki Pendek  (-) LED 1 ] ───► ESP32 GND

ESP32 GPIO 19 ───► [ Resistor 220Ω ] ───► [ Kaki Panjang (+) LED 2 ]
                                          [ Kaki Pendek  (-) LED 2 ] ───► ESP32 GND
```

---

## 4. Rangkaian Audio I2S (Speaker MAX98357A & Mic INMP441)

### A. Speaker DAC MAX98357A (Port `I2S_NUM_1`)
* **VIN** $\rightarrow$ ESP32 **VIN (5V)** *(Wajib 5V agar suara 3W lantang).*
* **GND** $\rightarrow$ ESP32 **GND**.
* **BCLK** $\rightarrow$ ESP32 **GPIO 26**.
* **LRC** $\rightarrow$ ESP32 **GPIO 25**.
* **DIN** $\rightarrow$ ESP32 **GPIO 22**.
* **GAIN & SD** $\rightarrow$ Dibiarkan terbuka (*Floating*).
* **Terminal +/-** $\rightarrow$ Speaker 4Ω/8Ω 3W.

### B. Mikrofon INMP441 (Port `I2S_NUM_0`)
* **VDD** $\rightarrow$ ESP32 **3V3 (3.3V)** ⚠️ *(Jangan hubungkan ke 5V!)*.
* **GND** $\rightarrow$ ESP32 **GND**.
* **SD** $\rightarrow$ ESP32 **GPIO 32**.
* **WS** $\rightarrow$ ESP32 **GPIO 33**.
* **SCK** $\rightarrow$ ESP32 **GPIO 14**.
* **L/R** $\rightarrow$ ESP32 **GND** *(Memilih channel kiri)*.

---

## 5. Fitur Interaktif Sensor Sentuh di Web CareTech
Saat robot terhubung ke [chat.html](chat.html) via kabel USB atau nirkabel:
* **Elus FSR 1 (Kepala)**: Robot memainkan nada senang, LED 1 menyala proporsional, dan ikon avatar di web berubah menjadi `🥰`.
* **Tekan / Peluk FSR 2 (Pipi/Badan)**: Robot memainkan nada ramah, LED 2 menyala proporsional, dan ikon avatar di web berubah menjadi `🤗`.

---

## 6. Rangkaian 2x Modul Sentuh Digital (TTP223 - Sensor Memeluk Boneka)

Kedua sensor sentuh TTP223 dipasang pada badan/punggung boneka untuk mendeteksi saat pengguna memeluk boneka ESA:

```
[ Modul TTP223 #1 - Sisi Pelukan Kiri ]
  • VCC ──────────────► ESP32 3V3
  • GND ──────────────► ESP32 GND
  • I/O (Sinyal Out) ─► ESP32 GPIO 27

[ Modul TTP223 #2 - Sisi Pelukan Kanan ]
  • VCC ──────────────► ESP32 3V3
  • GND ──────────────► ESP32 GND
  • I/O (Sinyal Out) ─► ESP32 GPIO 13
```

* Saat dipeluk, status langsung ditampilkan secara real-time di **Serial Monitor (115200 baud)**:
  ```text
  >>> [PELUKAN TOUCH] Pelukan Penuh Kedua Sisi Terdeteksi! (GPIO 27 & GPIO 13)
  >>> [PELUKAN SELESAI] Pelukan Boneka Dilepas.
  ```

---

## 7. Fitur Spesial: Comfort Hug (Pelukan 2 Detik Saat Sedih)

Saat siswa mengetik atau mengucapkan kata-kata sedih di [chat.html](chat.html):
1. **Tawaran Pelukan**: Robot ESA tidak langsung menjawab, melainkan menawarkan pelukan hangat:
   > *"Aku melihat kamu sedang merasa sedih kawan... 🥺 Boleh tolong peluk boneka aku atau genggam tanganku setidaknya selama 2 detik? Aku ingin hadir dan menemanimu."*
2. **Kondisi A — Siswa Memeluk Robot Selama $\ge$ 2 Detik**:
   * ESP32 mendeteksi salah satu sensor (FSR atau TTP223) ditahan selama minimal **2000 ms**.
   * ESP32 membunyikan melodi hangat dan mengirim `{"type":"touch", "action":"hug_hold_2s"}` ke browser.
   * Browser langsung memproses jawaban AI Gemini dengan konteks terima kasih atas pelukan hangat tersebut.
3. **Kondisi B — Siswa Tidak Memeluk Robot Dalam 30 Detik**:
   * Setelah 30 detik tanpa sentuhan, ESA bertanya kembali dengan lembut:
   > *"Kamu tidak memelukku... Tidak apa-apa kok kalau kamu belum siap kawan. Boleh ceritakan ke aku, kenapa kamu merasa sedih hari ini? Aku siap mendengarkanmu."*

---

## 8. Mode Sensor Aktif Standby & Fitur Diagnostik Serial Monitor

Sensor fisik (FSR402 dan TTP223) aktif dalam mode **Siaga (Standby)** saat robot menunggu input curhat/interaksi santai dari pengguna:
* **Aktif Standby**: Saat sistem siap (Idle), Anda dapat mengelus kepala robot (FSR1) atau memeluk pipi (FSR2) dan menyentuh modul TTP223.
* **Perintah Diagnostik Cepat di Serial Monitor**:
  Buka Serial Monitor (115200 baud) dan ketik:
  * `fsr` atau `test` $\rightarrow$ Menampilkan pembacaan voltase/ADC real-time dari FSR1 (GPIO 34), FSR2 (GPIO 35), Touch 1 (GPIO 27), dan Touch 2 (GPIO 13).
  * `on` $\rightarrow$ Memaksa pengaktifan sensor secara manual.
  * `off` $\rightarrow$ Mematikan sensor sementara.
* **Live Monitoring**: Ketika FSR ditekan di atas ambang noise (`> 250`), Serial Monitor otomatis mencetak log:
  `[FSR LIVE] FSR1 (GPIO 34): 720 | FSR2 (GPIO 35): 0 | Ambang: 550`

---

## 9. Panduan Troubleshooting Jika Sensor Tekanan Tidak Terbaca

1. **Pastikan Resistor 10k $\Omega$ Terpasang Benar (Divider Pull-Down)**:
   * **PENTING**: Pin GPIO 34 dan GPIO 35 adalah pin input murni (*input-only*) pada ESP32 yang **TIDAK memiliki resistor pull-down internal**.
   * Jika tidak ada resistor 10k $\Omega$ ke GND, kaki ADC akan melayang (*floating*) dan tidak akan mendeteksi tekanan dengan stabil.
   * **Skema**: Kaki 1 FSR $\rightarrow$ `3V3`, Kaki 2 FSR $\rightarrow$ `GPIO 34/35`, dan pasang resistor 10k $\Omega$ dari kaki 2 FSR tersebut ke `GND`.
2. **Ketik `fsr` di Serial Monitor**:
   * Tekan sensor dengan jari sambil mengetik `fsr` lalu Enter di Serial Monitor Arduino IDE.
   * Jika ADC = 0: Periksa kabel 3V3 atau kaki FSR (pastikan tidak kendor di breadboard).
* `FSR_TOUCH_THRESH` = **3500** (nilai ADC > 3500 dianggap tertekan nyata).
* `FSR_NOISE_FLOOR` = **2800** (nilai ADC < 2800 dianggap dilepas / posisi istirahat normal).
3. **Firmware Menggunakan `analogRead` Native**:
   * Sketch firmware telah diperbarui menggunakan `analogRead(FSR1_PIN)` dan resolusi 12-bit native Arduino ESP32 Core 3.x, sehingga bebas dari konflik driver ADC legacy.
