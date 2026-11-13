# 🤖 PANDUAN HARDWARE & PINOUT RESMI CARETECH ESA (ESP32)

Dokumen ini berisi peta kabel (*pinout*), skema sensor tekanan **2x FSR402**, **2x LED indikator dimmer**, mikrofon **INMP441**, dan speaker **MAX98357A**.

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
FSR 1 (Kepala/Elus)  ─── GPIO 34 │ [ ]     [ ] │ GPIO 2  ─── (LED Onboard Biru Status & Sentuh)
FSR 2 (Pipi/Pelukan) ─── GPIO 35 │ [ ]     [ ] │ GPIO 0  ─── (Tombol BOOT Onboard Pemicu Curhat)
                                 └─────────────┘
```

---

## 2. Rangkaian Sensor Tekanan FSR402 (Voltage Divider)

Kedua sensor FSR402 dirangkai dengan metode pembagi tegangan menggunakan resistor **10k $\Omega$** ke GND:

### A. FSR 1 — Sensor Kepala / Elusan (GPIO 34)
```
ESP32 3V3 ──────────[ Kaki 1 FSR 1 ]
                             │
ESP32 GPIO 34 ◄─────[ Kaki 2 FSR 1 ] ──┬── [ Resistor 10kΩ ] ──► ESP32 GND
```

### B. FSR 2 — Sensor Pipi / Pelukan (GPIO 35)
```
ESP32 3V3 ──────────[ Kaki 1 FSR 2 ]
                             │
ESP32 GPIO 35 ◄─────[ Kaki 2 FSR 2 ] ──┬── [ Resistor 10kΩ ] ──► ESP32 GND
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
