/*
  =============================================================================
  CARETECH - ESA INTERACTIVE PHYSICAL ROBOT COMPANION (DUAL MODE)
  =============================================================================
  DAFTAR KOMPONEN TERVERIFIKASI (OFFICIAL BILL OF MATERIALS):
    1. Microcontroller : ESP32 Dev Module (NodeMCU-32S / ESP32-WROOM-32)
    2. Audio Output    : MAX98357A I2S Mono DAC Amplifier + Speaker (4Ω/8Ω 3W)
    3. Audio Input     : INMP441 I2S MEMS Omnidirectional Microphone
    4. Sensor Tekanan  : 2x FSR402 Force-Sensing Resistors (Elusan & Pelukan)
    5. Tombol PTT      : Push Button Tactile 12mm PBS (Push-To-Talk di Tangan Boneka)
    6. Sumber Daya     : Baterai Gurfa Rechargeable Cell 18650 6800 mAh 7.4V (2S)
    7. Regulasi Daya   : Step Down Buck Converter LM2596 (Menurunkan 7.4V -> 5.0V DC)
    8. Sensor Sentuh   : 2x Modul Sentuh Digital TTP223 (Output ke Serial Monitor)

  Komunikasi: 
    1. NIRKABEL (Opsi A): WiFi + WebSocket Server (Port 81) & mDNS (esa-robot.local)
    2. KABEL USB (Fallback): USB Web Serial (115200 baud)
  Pemrosesan Audio: Murni I2S Hardware Audio (INMP441 Mic + MAX98357A Speaker DAC)

  =============================================================================
  SKEMA MANAJEMEN DAYA (POWER DISTRIBUTION & WIRING LM2596):
  =============================================================================
  ⚠️ PERINGATAN KRUSIAL:
     Sebelum menyambungkan kabel LM2596 OUT ke ESP32 & MAX98357A, WAJIB putar
     baut trimpot biru pada modul LM2596 dengan obeng sambil diukur multimeter
     hingga voltase output terkalibrasi stabil di 5.0 Volt!
     JANGAN memasukkan tegangan 7.4V langsung ke ESP32/Modul!

  1. Jalur Baterai -> Step Down LM2596:
     - Baterai Gurfa 7.4V (+)  ───► LM2596 [IN+] (Melalui saklar On/Off jika ada)
     - Baterai Gurfa (-)       ───► LM2596 [IN-]

  2. Jalur Distribusi Output LM2596 (5.0V Terkalibrasi):
     - LM2596 [OUT+] (5.0V)    ───► ESP32 Pin [VIN / 5V]
     - LM2596 [OUT+] (5.0V)    ───► MAX98357A Pin [VIN] (Wajib 5V untuk daya 3W maksimal)
     - LM2596 [OUT-] (GND)     ───► ESP32 Pin [GND] (Ground Bersama / Common GND)

  =============================================================================
  PETA PINOUT RESMI ESP32 (HARDWARE PINOUT MAP):
  =============================================================================

  1. SPEAKER AMPLIFIER (MAX98357A I2S Mono DAC - Papan Ungu):
     -------------------------------------------------------------------------
     Pin MAX98357A | Pin ESP32         | Keterangan
     ------------- | ----------------- | -------------------------------------
     VIN           | LM2596 OUT+ (5V)  | Suplai 5V teregulasi agar suara lantang & jernih.
     GND           | GND Bersama       | Ground sistem.
     BCLK          | GPIO 26           | Bit Clock I2S (Port I2S_NUM_1 Audio Out).
     LRC           | GPIO 25           | Word Select / Left-Right Clock (I2S_NUM_1).
     DIN           | GPIO 22           | Serial Data In ke Amplifier (I2S_NUM_1).
     GAIN          | LEPAS / GND       | Gain default 9dB (lepas) atau 12dB (ke GND).
     SD_MODE       | LEPAS (Floating)  | Otomatis mencampur channel stereo (L+R)/2.
     Terminal +/-  | Speaker 4Ω/8Ω 3W  | Terminal kabel speaker.

  2. MIKROFON (INMP441 I2S MEMS Omnidirectional - Papan Bundar):
     -------------------------------------------------------------------------
     Pin INMP441   | Pin ESP32         | Keterangan
     ------------- | ----------------- | -------------------------------------
     VDD           | 3V3 ESP32         | ⚠️ WAJIB 3.3V! DILARANG ke 5V (rusak!).
     GND           | GND               | Ground bersama ESP32.
     SD            | GPIO 32           | Serial Data Out dari mic ke ESP32 (I2S_NUM_0).
     WS            | GPIO 33           | Word Select Clock (I2S_NUM_0 Audio In).
     SCK           | GPIO 14           | Serial Clock / Bit Clock (I2S_NUM_0).
     L/R           | GND               | Hubungkan ke GND untuk channel kiri mono.

  3. SENSOR TEKANAN FISIK (2x FSR402):
     Rangkaian pembagi tegangan (Voltage Divider) dengan resistor 10kΩ ke GND:
     -------------------------------------------------------------------------
     Sensor FSR    | Pin 1 FSR  | Pin 2 FSR (Signal)       | R Resistor 10kΩ
     ------------- | ---------- | ------------------------ | -----------------
     FSR 1 Kepala  | 3V3 ESP32  | GPIO 34 (ADC1_CHANNEL_6) | Kaki 2 FSR -> GND
     FSR 2 Pipi    | 3V3 ESP32  | GPIO 35 (ADC1_CHANNEL_7) | Kaki 2 FSR -> GND
     *Catatan: Menggunakan ADC1 agar 100% aman digunakan bersamaan dengan WiFi.

  4. TOMBOL PUSH-TO-TALK 12mm PBS & KONTROL:
     -------------------------------------------------------------------------
     Pin Komponen  | Pin ESP32  | Mode & Keterangan
     ------------- | ---------- | --------------------------------------------
     Tombol PBS 12m| GPIO 4     | INPUT_PULLUP (Kaki 1 ke GPIO 4, Kaki 2 ke GND).
                   |            | PTT di tangan boneka untuk merekam curhat.
     Tombol BOOT   | GPIO 0     | INPUT_PULLUP (Tombol onboard pemicu cadangan).
     LED Onboard   | GPIO 2     | Respon sentuh, rekaman, berpikir, dan bicara.

  5. MODUL SENSOR SENTUH DIGITAL TAMBAHAN (2x TTP223 - Skenario B):
     -------------------------------------------------------------------------
     Pin TTP223    | Pin ESP32  | Keterangan
     ------------- | ---------- | --------------------------------------------
     VCC           | 3V3 ESP32  | Tegangan kerja modul (3.3V).
     GND           | GND        | Ground bersama ESP32.
     I/O Sensor 1  | GPIO 27    | Sinyal digital sensor 1 (Active-HIGH saat disentuh).
     I/O Sensor 2  | GPIO 13    | Sinyal digital sensor 2 (Active-HIGH saat disentuh).
     *Keluaran akan langsung dicetak ke Serial Monitor saat sensor disentuh.

  =============================================================================
  LIBRARY ARDUINO YANG DIBUTUHKAN:
  =============================================================================
  1. ArduinoJson (oleh Benoit Blanchon - versi 6 atau 7)
  2. WebSockets (oleh Markus Sattler - install via Library Manager)
  =============================================================================
*/

#include <ArduinoJson.h>
#include <driver/i2s.h>
#include <driver/adc.h>
#include <math.h>
#include <WiFi.h>
#include <ESPmDNS.h>
#include <WebSocketsServer.h>

// ---------- KONFIGURASI WIFI & WEBSOCKET ----------
// Ganti dengan SSID dan Password WiFi / Hotspot Anda:
const char* WIFI_SSID     = "Carelix";     
const char* WIFI_PASS     = "emotionalcompanionagent"; 

// Hotspot Cadangan Mandiri (AP Mode) jika WiFi di atas tidak ditemukan:
const char* AP_SSID       = "CareTech-ESA-Robot";
const char* AP_PASS       = "caretech123";
const int   WS_PORT       = 81;

// Subclass untuk mengaktifkan broadcast fragmented frame WebSocket (RFC 6455)
class CareTechWebSocketServer : public WebSocketsServer {
public:
  using WebSocketsServer::WebSocketsServer;

  void broadcastWsFrame(WSopcode_t opcode, const uint8_t* payload, size_t length, bool fin) {
    for (uint8_t i = 0; i < WEBSOCKETS_SERVER_CLIENT_MAX; i++) {
      WSclient_t* client = &_clients[i];
      if (clientIsConnected(client)) {
        sendFrame(client, opcode, (uint8_t*)payload, length, fin);
      }
    }
  }
};

CareTechWebSocketServer webSocket(WS_PORT);
int  wsConnectedClients   = 0;
bool wifiConnected        = false;

// ---------- PIN ASSIGNMENT ----------
const int LED_PIN        = 2;    // Built-in LED onboard
const int LED1_PIN       = 18;   // LED Indikator Tangan Kiri (GPIO 18 - Respon FSR 1)
const int LED2_PIN       = 19;   // LED Indikator Tangan Kanan (GPIO 19 - Respon FSR 2)
const int BUTTON_PIN     = 0;    // BOOT Button onboard (Pemicu cadangan di board)
const int EXT_BUTTON_PIN = 4;    // Tombol Fisik 12mm PBS di Tangan Boneka (Push-To-Talk)

// Deteksi jika tombol fisik 12mm eksternal (GPIO 4) ATAU tombol BOOT onboard (GPIO 0) ditekan
inline bool isAnyButtonPressed() {
  return (digitalRead(BUTTON_PIN) == LOW || digitalRead(EXT_BUTTON_PIN) == LOW);
}

// MAX98357A I2S Speaker (Port I2S_NUM_1 - TX)
#define I2S_SPK_PORT I2S_NUM_1
#define I2S_SPK_BCLK 26
#define I2S_SPK_LRC  25
#define I2S_SPK_DIN  22

// INMP441 I2S Microphone (Port I2S_NUM_0 - RX)
#define I2S_MIC_PORT I2S_NUM_0
#define I2S_MIC_SCK  14
#define I2S_MIC_WS   33
#define I2S_MIC_SD   32

// FSR402 Force-Sensing Resistors (Sensor Memegang Tangan Boneka - Port ADC1)
const int FSR1_PIN   = 34;   // FSR 1: Sensor Tekanan Tangan Kiri Boneka (GPIO 34)
const int FSR2_PIN   = 35;   // FSR 2: Sensor Tekanan Tangan Kanan Boneka (GPIO 35)
const adc1_channel_t FSR1_ADC_CHAN = ADC1_CHANNEL_6; // Kanal ADC1 GPIO 34
const adc1_channel_t FSR2_ADC_CHAN = ADC1_CHANNEL_7; // Kanal ADC1 GPIO 35

// Modul Sensor Sentuh Digital (2x TTP223 - Sensor Memeluk Boneka)
const int TOUCH1_PIN = 27;   // Modul Sentuh Pelukan 1 (GPIO 27)
const int TOUCH2_PIN = 13;   // Modul Sentuh Pelukan 2 (GPIO 13)


// Status Robot ESA
enum RobotState {
  STATE_IDLE,
  STATE_THINKING,
  STATE_SPEAKING,
  STATE_RECORDING
};

RobotState currentState = STATE_IDLE;
unsigned long lastStateAnimMs = 0;
bool ledState = false;

// Serial Buffer & Timing
String inputBuffer;
unsigned long lastSoundReportMs = 0;
const unsigned long SOUND_REPORT_INTERVAL_MS = 250; // Update level mic ke web tiap 250ms

// Debounce Tombol BOOT
int lastButtonReading = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 60;
bool buttonPressedSent = false;

// Microphone VAD (Voice Activity Detection)
unsigned long lastMicCheckMs = 0;
int soundLevel = 0;
unsigned long lastVoiceNoticeMs = 0;

// Sensor Tekanan FSR402 State, Filtering & Timing
// Sensor Aktif saat Menunggu Input (Standby / Idle) & Saat Diminta Chat
bool sensorsEnabled        = true;  // Default: AKTIF saat menunggu input (Idle/Standby)
const int FSR_NOISE_FLOOR  = 2800;  // Ambang batas lepas/idle: di bawah 2800 dianggap lepas / tidak tertekan
const int FSR_TOUCH_THRESH = 3500;  // Ambang batas tertekan: di atas 3500 dianggap tertekan nyata
unsigned long lastFsrCheckMs = 0;
unsigned long lastFsrReportMs = 0;
unsigned long lastFsrDebugMs  = 0;  // Debounce print pantauan real-time ke Serial Monitor
bool fsr1Pressed = false;
bool fsr2Pressed = false;
int fsr1Level = 0;
int fsr2Level = 0;
int fsr1Smoothed = 0;
int fsr2Smoothed = 0;

// Sensor Sentuh Digital Tambahan State (TTP223 - Skenario B)
bool digitalTouch1Active = false;
bool digitalTouch2Active = false;
unsigned long lastDigitalTouchReportMs = 0;

// Pelacakan Pelukan / Sentuhan Tahan 2 Detik (Comfort Hug)
unsigned long hugTouchStartMs = 0;
bool hugHold2sFired = false;

// Pembacaan ADC1 Legacy (12-bit) dengan oversampling 8x
// Menggunakan driver ADC legacy agar serasi 100% dengan driver I2S audio tanpa crash driver_ng
int readAdc1Smoothed(adc1_channel_t chan) {
  int sum = 0;
  for (int i = 0; i < 8; i++) {
    sum += adc1_get_raw(chan);
  }
  return sum / 8;
}

// ---------- FUNGSI BROADCAST DUAL MODE (SERIAL + WEBSOCKET) ----------
void broadcastWsFrame(WSopcode_t opcode, const uint8_t* payload, size_t length, bool fin) {
  webSocket.broadcastWsFrame(opcode, payload, length, fin);
}

void sendDoc(JsonDocument& doc) {
  String output;
  serializeJson(doc, output);
  Serial.println(output); // Kirim via USB Serial
  
  if (wsConnectedClients > 0) {
    webSocket.broadcastTXT(output); // Kirim via Nirkabel WebSocket
  }
}

void sendStatus(const char* type, const String& msg) {
  JsonDocument doc;
  doc["type"] = type;
  doc["msg"]  = msg;
  sendDoc(doc);
}

// ==========================================
// DRIVER AUDIO I2S - SPEAKER (MAX98357A)
// ==========================================
void initI2SSpeaker() {
  i2s_config_t i2s_config = {
    .mode                 = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate          = 16000,
    .bits_per_sample      = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format       = I2S_CHANNEL_FMT_RIGHT_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags     = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count        = 8,
    .dma_buf_len          = 256,
    .use_apll             = false,
    .tx_desc_auto_clear   = true,
    .fixed_mclk           = 0
  };

  i2s_pin_config_t pin_config = {
    .mck_io_num   = I2S_PIN_NO_CHANGE,
    .bck_io_num   = I2S_SPK_BCLK,
    .ws_io_num    = I2S_SPK_LRC,
    .data_out_num = I2S_SPK_DIN,
    .data_in_num  = I2S_PIN_NO_CHANGE
  };

  i2s_driver_install(I2S_SPK_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_SPK_PORT, &pin_config);
  i2s_zero_dma_buffer(I2S_SPK_PORT);
}

// Memainkan nada sinusoidal halus tanpa hentakan DC/klik pada MAX98357A
void playToneI2S(float frequency, int durationMs, float volume = 0.35f) {
  if (frequency <= 0) {
    delay(durationMs);
    return;
  }

  const int sampleRate = 16000;
  int numSamples = (sampleRate * durationMs) / 1000;
  int16_t buffer[128]; // Stereo L+R
  size_t bytesWritten;

  float phase = 0;
  float phaseIncrement = (2.0f * PI * frequency) / sampleRate;
  int maxAmp = (int)(32767.0f * volume);

  int samplesRemaining = numSamples;
  int sampleIndex = 0;

  while (samplesRemaining > 0) {
    int chunk = (samplesRemaining > 64) ? 64 : samplesRemaining;
    for (int i = 0; i < chunk; i++) {
      // Soft attack & decay envelope untuk mencegah hentakan arus DC
      float env = 1.0f;
      if (sampleIndex < 70) {
        env = (float)sampleIndex / 70.0f;
      } else if (samplesRemaining - i < 70) {
        env = (float)(samplesRemaining - i) / 70.0f;
      }

      int16_t sample = (int16_t)(sin(phase) * (maxAmp * env));
      phase += phaseIncrement;
      if (phase >= 2.0f * PI) phase -= 2.0f * PI;

      buffer[i * 2]     = sample; // Left
      buffer[i * 2 + 1] = sample; // Right
      sampleIndex++;
    }
    i2s_write(I2S_SPK_PORT, buffer, chunk * 4, &bytesWritten, portMAX_DELAY);
    samplesRemaining -= chunk;
  }
}

// Melodi & Efek Suara Robot ESA
void playRobotChime(int type) {
  if (type == 1) {
    // Sapaan Ceria / Robot Ready (Do - Mi - Sol - Do Tinggi)
    playToneI2S(523.25, 60, 0.30); // C5
    playToneI2S(659.25, 70, 0.32); // E5
    playToneI2S(783.99, 90, 0.35); // G5
    playToneI2S(1046.50, 150, 0.38); // C6
  } else if (type == 2) {
    // Tombol BOOT ditekan (Nada ramah naik)
    playToneI2S(440.00, 50, 0.28); // A4
    playToneI2S(880.00, 90, 0.32); // A5
  } else if (type == 4) {
    // Thinking Hum
    playToneI2S(330.00, 60, 0.18);
    playToneI2S(392.00, 80, 0.22);
  } else if (type == 5) {
    // Mulai Merekam Suara (Bip Awas 880Hz)
    playToneI2S(880.00, 90, 0.35);
  } else if (type == 6) {
    // Selesai Merekam (Bip Turun Ganda)
    playToneI2S(880.00, 60, 0.28);
    playToneI2S(659.25, 90, 0.25);
  } else if (type == 7) {
    // UJI COBA SPEAKER RESMI CARETECH (Melodi Bahagia 6 Nada)
    playToneI2S(523.25, 80, 0.30); // C5
    playToneI2S(587.33, 80, 0.32); // D5
    playToneI2S(659.25, 80, 0.35); // E5
    playToneI2S(783.99, 100, 0.38); // G5
    playToneI2S(880.00, 110, 0.38); // A5
    playToneI2S(1046.50, 220, 0.40); // C6
  } else if (type == 8) {
    // Melodi Pelukan Hangat / Comfort Warmth Chime (F4 - A4 - C5 - E5)
    playToneI2S(349.23, 100, 0.22); // F4
    playToneI2S(440.00, 100, 0.25); // A4
    playToneI2S(523.25, 120, 0.28); // C5
    playToneI2S(659.25, 200, 0.30); // E5
  }
}

// Suara Robotik Ekspresif ESA (Procedural Robotic Speech)
// Menghasilkan nada bicara robotik yang hidup dan hangat melalui speaker MAX98357A
void playRobotSpeech(int syllables, const String& mood = "happy") {
  if (syllables <= 0) syllables = 6;
  if (syllables > 24) syllables = 24;

  float basePitches[] = { 440.0f, 493.88f, 523.25f, 587.33f, 659.25f, 698.46f, 783.99f };
  int numPitches = sizeof(basePitches) / sizeof(basePitches[0]);

  digitalWrite(LED_PIN, HIGH);
  for (int i = 0; i < syllables; i++) {
    int pIdx = random(0, numPitches);
    float pitch1 = basePitches[pIdx];
    float pitch2 = pitch1 * (random(0, 2) == 0 ? 1.15f : 0.88f);
    int dur = random(45, 95);

    playToneI2S(pitch1, dur / 2, 0.30f);
    playToneI2S(pitch2, dur / 2, 0.28f);

    digitalWrite(LED_PIN, (i % 2 == 0) ? HIGH : LOW);
    delay(random(15, 35));
  }
  digitalWrite(LED_PIN, LOW);
}

// ==========================================
// PEMUTARAN AUDIO NYATA AI KE SPEAKER MAX98357A
// ==========================================
static const int8_t B64_INDEX[256] = {
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,
  52,53,54,55,56,57,58,59,60,61,-1,-1,-1, 0,-1,-1,
  -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,
  15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,
  -1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,
  41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,
  -1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1
};

int decodeBase64Pcm(const char* input, uint8_t* output, int maxLen) {
  int len = 0;
  uint32_t val = 0;
  int valb = -8;
  for (const char* p = input; *p && *p != '='; p++) {
    int8_t d = B64_INDEX[(uint8_t)*p];
    if (d == -1) continue;
    val = (val << 6) | d;
    valb += 6;
    if (valb >= 0) {
      if (len < maxLen) output[len++] = (uint8_t)((val >> valb) & 0xFF);
      valb -= 8;
    }
  }
  return len;
}

// Menghentikan pemutaran audio di speaker secara seketika (Mute/Cut-off)
void stopSpeakerAudio() {
  i2s_zero_dma_buffer(I2S_SPK_PORT);
  currentState = STATE_IDLE;
  digitalWrite(LED_PIN, LOW);
}

// Memainkan chunk audio PCM 8-bit mono 8kHz langsung ke DAC MAX98357A
void playAudioChunk8k(const char* b64Data) {
  uint8_t rawPcm[384];
  int numSamples = decodeBase64Pcm(b64Data, rawPcm, sizeof(rawPcm));
  if (numSamples <= 0) return;

  currentState = STATE_SPEAKING;

  // Ubah PCM 8-bit unsigned mono (8kHz) menjadi 16-bit signed stereo (16kHz)
  // Tiap sampel diduplikasi 2x agar sesuai dengan clock 16kHz MAX98357A
  int16_t spkBuffer[128 * 2];
  int bufIdx = 0;

  for (int i = 0; i < numSamples; i++) {
    // Normalisasi dan penguatan gain yang aman
    int16_t s16 = (int16_t)((rawPcm[i] - 128) * 180);

    // Frame 1
    spkBuffer[bufIdx++] = s16; // Left
    spkBuffer[bufIdx++] = s16; // Right
    // Frame 2
    spkBuffer[bufIdx++] = s16; // Left
    spkBuffer[bufIdx++] = s16; // Right

    if (bufIdx >= 256) {
      size_t bytesWritten = 0;
      i2s_write(I2S_SPK_PORT, spkBuffer, 256 * sizeof(int16_t), &bytesWritten, 40);
      bufIdx = 0;
    }
  }

  if (bufIdx > 0) {
    size_t bytesWritten = 0;
    i2s_write(I2S_SPK_PORT, spkBuffer, bufIdx * sizeof(int16_t), &bytesWritten, 40);
  }
}

// ==========================================
// DRIVER AUDIO I2S - MICROPHONE (INMP441)
// ==========================================
void initI2SMic() {
  i2s_config_t i2s_config = {
    .mode                 = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_RX),
    .sample_rate          = 16000,
    .bits_per_sample      = I2S_BITS_PER_SAMPLE_32BIT, // INMP441 kirim 24-bit dalam slot 32-bit
    .channel_format       = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_STAND_I2S,
    .intr_alloc_flags     = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count        = 8,
    .dma_buf_len          = 256,
    .use_apll             = false,
    .tx_desc_auto_clear   = false,
    .fixed_mclk           = 0
  };

  i2s_pin_config_t pin_config = {
    .mck_io_num   = I2S_PIN_NO_CHANGE,
    .bck_io_num   = I2S_MIC_SCK,
    .ws_io_num    = I2S_MIC_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num  = I2S_MIC_SD
  };

  i2s_driver_install(I2S_MIC_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_MIC_PORT, &pin_config);
}

// Filter DC-blocker (high-pass) agar offset mic tidak merusak pembacaan audio
static float micDcPrevIn = 0, micDcPrevOut = 0;

// Membaca level RMS mikrofon INMP441 secara real-time
int readMicLevel() {
  int32_t samples[128];
  size_t bytesRead = 0;
  i2s_read(I2S_MIC_PORT, samples, sizeof(samples), &bytesRead, 10);

  if (bytesRead == 0) return 0;

  int count = bytesRead / sizeof(int32_t);
  long long sumSquare = 0;
  for (int i = 0; i < count; i++) {
    // INMP441: data 24-bit rata kiri di dalam frame 32-bit -> ambil 16-bit teratas
    float x = (float)(samples[i] >> 16);

    // DC blocker
    float y = x - micDcPrevIn + 0.995f * micDcPrevOut;
    micDcPrevIn = x;
    micDcPrevOut = y;

    int32_t s = (int32_t)(y * 2);
    if (abs(s) < 60) s = 0;
    if (s > 32767)  s = 32767;
    if (s < -32768) s = -32768;

    sumSquare += (long long)s * s;
  }
  return count > 0 ? (int)sqrt(sumSquare / count) : 0;
}

// Deteksi Aktivitas Suara (VAD), Barge-in, & Pelaporan ke Web
void checkMicActivity() {
  if (millis() - lastMicCheckMs < 60) return;
  lastMicCheckMs = millis();

  // Saat speaker sedang aktif bersuara (STATE_SPEAKING), jangan memproses audio mic
  // agar speaker tidak memotong suaranya sendiri akibat acoustic feedback!
  if (currentState == STATE_SPEAKING) {
    return;
  }

  int currentRms = readMicLevel();
  soundLevel = currentRms;

  // Kirim data level mic secara berkala untuk meter visual di web chat
  if (millis() - lastSoundReportMs >= SOUND_REPORT_INTERVAL_MS && currentState == STATE_IDLE) {
    lastSoundReportMs = millis();
    JsonDocument doc;
    doc["type"]  = "sound_meter";
    doc["sound"] = soundLevel;
    sendDoc(doc);
  }

  // Jika suara melompat tinggi (siswa sedang bicara dekat robot)
  if (currentRms > 1200 && (millis() - lastVoiceNoticeMs > 3500) && currentState == STATE_IDLE) {
    lastVoiceNoticeMs = millis();

    JsonDocument doc;
    doc["type"]  = "voice_detected";
    doc["level"] = currentRms;
    sendDoc(doc);
  }
}

// ==========================================
// STREAMING AUDIO INMP441 KE CHAT (BASE64 WAV)
// ==========================================
static const char B64_CHARS[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void streamBase64Data(const uint8_t* data, size_t len, bool streamWs) {
  size_t i = 0;
  char outBuf[128];
  size_t outPos = 0;

  while (i + 3 <= len) {
    uint32_t a = data[i++];
    uint32_t b = data[i++];
    uint32_t c = data[i++];
    uint32_t triple = (a << 16) | (b << 8) | c;
    outBuf[outPos++] = B64_CHARS[(triple >> 18) & 0x3F];
    outBuf[outPos++] = B64_CHARS[(triple >> 12) & 0x3F];
    outBuf[outPos++] = B64_CHARS[(triple >> 6) & 0x3F];
    outBuf[outPos++] = B64_CHARS[triple & 0x3F];

    if (outPos >= 120) {
      Serial.write((const uint8_t*)outBuf, outPos);
      if (streamWs) {
        broadcastWsFrame(WSop_continuation, (const uint8_t*)outBuf, outPos, false);
      }
      outPos = 0;
    }
  }
  if (i < len) {
    uint32_t a = data[i++];
    uint32_t b = (i < len) ? data[i++] : 0;
    uint32_t triple = (a << 16) | (b << 8);
    outBuf[outPos++] = B64_CHARS[(triple >> 18) & 0x3F];
    outBuf[outPos++] = B64_CHARS[(triple >> 12) & 0x3F];
    if (i == len && b != 0) {
      outBuf[outPos++] = B64_CHARS[(triple >> 6) & 0x3F];
      outBuf[outPos++] = '=';
    } else {
      outBuf[outPos++] = '=';
      outBuf[outPos++] = '=';
    }
  }
  if (outPos > 0) {
    Serial.write((const uint8_t*)outBuf, outPos);
    if (streamWs) {
      broadcastWsFrame(WSop_continuation, (const uint8_t*)outBuf, outPos, false);
    }
  }
}

void createWavHeader8Bit(uint8_t* header, uint32_t numSamples, uint32_t sampleRate = 8000) {
  header[0] = 'R'; header[1] = 'I'; header[2] = 'F'; header[3] = 'F';
  uint32_t chunkSize = 36 + numSamples;
  header[4] = (uint8_t)(chunkSize & 0xFF);
  header[5] = (uint8_t)((chunkSize >> 8) & 0xFF);
  header[6] = (uint8_t)((chunkSize >> 16) & 0xFF);
  header[7] = (uint8_t)((chunkSize >> 24) & 0xFF);
  header[8] = 'W'; header[9] = 'A'; header[10] = 'V'; header[11] = 'E';
  header[12] = 'f'; header[13] = 'm'; header[14] = 't'; header[15] = ' ';
  header[16] = 16; header[17] = 0; header[18] = 0; header[19] = 0;
  header[20] = 1; header[21] = 0; // PCM format
  header[22] = 1; header[23] = 0; // Mono channel
  header[24] = (uint8_t)(sampleRate & 0xFF);
  header[25] = (uint8_t)((sampleRate >> 8) & 0xFF);
  header[26] = (uint8_t)((sampleRate >> 16) & 0xFF);
  header[27] = (uint8_t)((sampleRate >> 24) & 0xFF);
  uint32_t byteRate = sampleRate; // 8000 * 1 * 1
  header[28] = (uint8_t)(byteRate & 0xFF);
  header[29] = (uint8_t)((byteRate >> 8) & 0xFF);
  header[30] = (uint8_t)((byteRate >> 16) & 0xFF);
  header[31] = (uint8_t)((byteRate >> 24) & 0xFF);
  header[32] = 1; header[33] = 0; // BlockAlign
  header[34] = 8; header[35] = 0; // 8 bits per sample
  header[36] = 'd'; header[37] = 'a'; header[38] = 't'; header[39] = 'a';
  header[40] = (uint8_t)(numSamples & 0xFF);
  header[41] = (uint8_t)((numSamples >> 8) & 0xFF);
  header[42] = (uint8_t)((numSamples >> 16) & 0xFF);
  header[43] = (uint8_t)((numSamples >> 24) & 0xFF);
}

// Rekam suara dari INMP441 dengan sistem TOGGLE murni (Hidupkan & Matikan manual)
void recordAndStreamAudio(int durationSeconds = 15, const char* context = "chat", bool loopbackToSpeaker = false) {
  // Hitung target kapasitas buffer (8kHz mono 8-bit = 8000 bytes/detik)
  if (durationSeconds <= 0) durationSeconds = 15;
  if (durationSeconds > 15) durationSeconds = 15;

  int targetSamples = durationSeconds * 8000;

  // Periksa sisa heap kontigu ESP32 dengan batas aman sistem
  size_t maxAlloc = ESP.getMaxAllocHeap();
  size_t safeTarget = (maxAlloc > 8192) ? (maxAlloc - 8192) : 16000;
  if (targetSamples > (int)safeTarget) {
    targetSamples = (int)safeTarget;
  }

  // Alokasi buffer audio dengan fallback bertingkat (15s -> 12s -> 10s -> 8s -> 6s -> 4s -> 2s)
  int totalSamples8k = targetSamples;
  uint8_t* wavBuffer = nullptr;

  const int sampleTiers[] = { targetSamples, 96000, 80000, 64000, 48000, 32000, 16000 };
  int numTiers = sizeof(sampleTiers) / sizeof(sampleTiers[0]);

  for (int t = 0; t < numTiers; t++) {
    int trySamples = sampleTiers[t];
    if (trySamples <= 0) continue;
    if (t > 0 && trySamples >= targetSamples) continue;
    wavBuffer = (uint8_t*)malloc(44 + trySamples);
    if (wavBuffer) {
      totalSamples8k = trySamples;
      break;
    }
  }

  if (!wavBuffer) {
    sendStatus("error", "Memori RAM ESP32 tidak mencukupi untuk buffer audio.");
    JsonDocument failDoc;
    failDoc["type"]   = "rec_status";
    failDoc["status"] = "error";
    failDoc["msg"]    = "RAM penuh";
    sendDoc(failDoc);
    return;
  }

  createWavHeader8Bit(wavBuffer, totalSamples8k, 8000);
  uint8_t* pcmData = wavBuffer + 44;

  currentState = STATE_RECORDING;
  digitalWrite(LED_PIN, HIGH);

  JsonDocument recDoc;
  recDoc["type"]    = "rec_status";
  recDoc["status"]  = "recording";
  recDoc["context"] = context;
  sendDoc(recDoc);

  playRobotChime(5); // Bip penanda mic mulai aktif
  delay(80);

  // Bersihkan buffer serial dan buang sisa data I2S
  inputBuffer = "";
  size_t dummyBytes = 0;
  int32_t dummyBuf[64];
  i2s_read(I2S_MIC_PORT, dummyBuf, sizeof(dummyBuf), &dummyBytes, 20);

  int samplesRead16k = 0;
  int samplesStored8k = 0;
  int32_t rawSamples[256]; // 256 sampel per pembacaan DMA I2S
  long long maxPeak = 0;
  float recDcIn = 0, recDcOut = 0;

  unsigned long startTime = millis();
  bool earlyStop = false;

  // Konfigurasi deteksi tombol fisik:
  // HANYA aktif jika rekam dipicu dari tombol fisik robot ("button_curhat").
  // JIKA DIPICU DARI WEB CHAT ("chat"), JANGAN PERNAH MENGECEK BUTTON_PIN!
  // Ini mencegah sirkuit USB-UART DTR / noise GPIO 0 mematikan rekam secara prematur.
  bool isHardwareButtonContext = (strcmp(context, "button_curhat") == 0);
  bool btnArmedForStop = false;
  unsigned long btnHighStartTime = 0;
  int btnLowDebounceCount = 0;

  // Merekam terus (Toggle ON) sampai pengguna mematikan (Toggle OFF) atau buffer maksimal tercapai
  while (samplesStored8k < totalSamples8k && !earlyStop) {
    // 1. Cek perintah stop dari Web Serial ("stop_rec")
    while (Serial.available()) {
      char c = Serial.read();
      if (c == '\n') {
        if (inputBuffer.indexOf("stop_rec") >= 0) {
          earlyStop = true;
        }
        inputBuffer = "";
      } else if (c != '\r' && inputBuffer.length() < 128) {
        inputBuffer += c;
        if (inputBuffer.indexOf("stop_rec") >= 0) {
          earlyStop = true;
          inputBuffer = "";
          break;
        }
      }
    }
    if (earlyStop) break;

    // 2. Cek tombol fisik (12mm PBS GPIO 4 & BOOT GPIO 0) HANYA jika dipicu secara fisik
    if (isHardwareButtonContext) {
      bool pressed = isAnyButtonPressed();

      if (!pressed) {
        // Tombol sedang dalam posisi DILEPAS (HIGH)
        if (btnHighStartTime == 0) {
          btnHighStartTime = millis();
        }

        unsigned long heldDuration = (btnHighStartTime > startTime) ? (btnHighStartTime - startTime) : 0;
        unsigned long releasedDuration = millis() - btnHighStartTime;

        // MODE A: PUSH-TO-TALK (HOLD-TO-TALK)
        // Jika pengguna menahan tombol saat bicara (>= 600ms), lalu melepas tombol selama >= 150ms:
        // Langsung selesaikan perekaman seketika! (Lepas tombol = selesai bicara & langsung kirim suara)
        if (heldDuration >= 600 && releasedDuration >= 150) {
          earlyStop = true;
          break;
        }

        // MODE B: TOGGLE (KLIK UNTUK BICARA, KLIK LAGI UNTUK SELESAI)
        // Jika tombol dilepas cepat (< 600ms), persiapkan sistem agar tombol tekan berikutnya mematikan mic
        if (!btnArmedForStop && releasedDuration >= 200 && (millis() - startTime >= 400)) {
          btnArmedForStop = true;
        }
        btnLowDebounceCount = 0;
      } else {
        // Tombol sedang dalam posisi DITEKAN (LOW)
        btnHighStartTime = 0;
        if (btnArmedForStop) {
          btnLowDebounceCount++;
          // Minimal 3 kali bacaan berturut-turut (~50-70ms) untuk mencegah noise/bouncing
          if (btnLowDebounceCount >= 3) {
            earlyStop = true;
            break;
          }
        }
      }
    }

    // 3. Baca sampel audio dari INMP441 (Sesuai sketsa passthrough yang berhasil)
    size_t bytesRead = 0;
    i2s_read(I2S_MIC_PORT, rawSamples, sizeof(rawSamples), &bytesRead, 50);
    if (bytesRead == 0) continue;

    int count = bytesRead / sizeof(int32_t);
    for (int i = 0; i < count && samplesStored8k < totalSamples8k; i++) {
      // INMP441: data 24-bit rata kiri di dalam frame 32-bit -> ambil 16-bit teratas
      float x = (float)(rawSamples[i] >> 16);

      // DC blocker filter (high-pass) untuk membuang offset DC mikrofon
      float y = x - recDcIn + 0.995f * recDcOut;
      recDcIn = x;
      recDcOut = y;

      int32_t s = (int32_t)(y * 2); // Penguatan digital (GAIN = 2)
      if (abs(s) < 60) s = 0;       // Noise gate sederhana
      if (s > 32767)  s = 32767;
      if (s < -32768) s = -32768;

      int absVal = abs(s);
      if (absVal > maxPeak) maxPeak = absVal;

      // Downsample 16kHz ke 8kHz & normalisasi PCM 8-bit unsigned
      if ((samplesRead16k % 2) == 0) {
        int32_t scaled = (s / 256) + 128;
        if (scaled < 0)   scaled = 0;
        if (scaled > 255) scaled = 255;
        pcmData[samplesStored8k++] = (uint8_t)scaled;
      }
      samplesRead16k++;
    }
  }

  digitalWrite(LED_PIN, LOW);
  playRobotChime(6); // Bip penanda mic telah dimatikan
  delay(60);

  // Kunci flag tombol jika tombol fisik masih ditekan agar tidak re-trigger
  if (isAnyButtonPressed()) {
    buttonPressedSent = true;
  }

  // Buat header WAV berdasarkan jumlah sampel NYATA yang terekam
  createWavHeader8Bit(wavBuffer, samplesStored8k, 8000);

  float actualDuration = (float)samplesStored8k / 8000.0f;

  // Beritahu web chat seketika bahwa mikrofon sudah mati dan audio mulai ditransfer
  JsonDocument transDoc;
  transDoc["type"]     = "rec_status";
  transDoc["status"]   = "transferring";
  transDoc["context"]  = context;
  transDoc["duration"] = actualDuration;
  sendDoc(transDoc);

  // Kirim payload WAV Base64 ke chat.html (via USB Serial & WebSocket Nirkabel)
  bool streamWs = (wsConnectedClients > 0);

  String prefix = "{\"type\":\"mic_audio\",\"context\":\"" + String(context) +
                  "\",\"duration\":" + String(actualDuration, 2) +
                  ",\"peak\":" + String(maxPeak) +
                  ",\"wav\":\"";
  Serial.print(prefix);
  if (streamWs) {
    broadcastWsFrame(WSop_text, (const uint8_t*)prefix.c_str(), prefix.length(), false);
  }

  streamBase64Data(wavBuffer, 44 + samplesStored8k, streamWs);

  Serial.println("\"}");
  if (streamWs) {
    const char* suffix = "\"}";
    broadcastWsFrame(WSop_continuation, (const uint8_t*)suffix, strlen(suffix), true);
  }

  // Jika mode tes loopback, putar juga ke speaker MAX98357A
  if (loopbackToSpeaker && samplesStored8k > 0) {
    playToneI2S(1046, 70, 0.25);
    int16_t spkBuffer[128 * 2];
    for (int i = 0; i < samplesStored8k; i += 128) {
      int chunk = (samplesStored8k - i > 128) ? 128 : (samplesStored8k - i);
      for (int j = 0; j < chunk; j++) {
        int16_t s = (int16_t)((pcmData[i + j] - 128) * 256);
        spkBuffer[j * 2]     = s;
        spkBuffer[j * 2 + 1] = s;
      }
      size_t bw = 0;
      i2s_write(I2S_SPK_PORT, spkBuffer, chunk * 2 * sizeof(int16_t), &bw, portMAX_DELAY);
    }
  }

  free(wavBuffer);
  currentState = STATE_IDLE;

  JsonDocument doneDoc;
  doneDoc["type"]     = "rec_status";
  doneDoc["status"]   = "done";
  doneDoc["context"]  = context;
  doneDoc["duration"] = actualDuration;
  doneDoc["peak"]     = maxPeak;
  sendDoc(doneDoc);
}

// ==========================================
// PARSING PERINTAH DARI BROWSER (CHAT.HTML)
// ==========================================
void handleAction(const String& state) {
  if (state == "thinking") {
    currentState = STATE_THINKING;
    playRobotChime(4);
  } else if (state == "speaking") {
    currentState = STATE_SPEAKING;
  } else if (state == "happy") {
    playRobotChime(1);
  } else if (state == "comforted" || state == "hug_received") {
    // Mode Hangat: Sambut pelukan dengan nada lembut & nyalakan LED indikator tangan
    currentState = STATE_IDLE;
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(LED1_PIN, HIGH);
    digitalWrite(LED2_PIN, HIGH);
    playRobotChime(8); // Melodi pelukan hangat menenangkan
    delay(250);
    digitalWrite(LED1_PIN, LOW);
    digitalWrite(LED2_PIN, LOW);
  } else if (state == "empathy") {
    currentState = STATE_IDLE;
    playRobotChime(4); // Nada lembut empati
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
  } else {
    currentState = STATE_IDLE;
    digitalWrite(LED_PIN, LOW);
  }
}

void handleLine(String line) {
  line.trim();
  if (line.length() == 0) return;

  // Fitur Diagnostik Cepat Langsung dari Serial Monitor (Ketik 'fsr', 'test', 'on', 'off')
  if (line.equalsIgnoreCase("fsr") || line.equalsIgnoreCase("test") || line.equalsIgnoreCase("status")) {
    int r1 = readAdc1Smoothed(FSR1_ADC_CHAN);
    int r2 = readAdc1Smoothed(FSR2_ADC_CHAN);
    bool t1 = (digitalRead(TOUCH1_PIN) == HIGH);
    bool t2 = (digitalRead(TOUCH2_PIN) == HIGH);
    Serial.println("\n=======================================================");
    Serial.println(">>> [DIAGNOSTIK SENSOR REAL-TIME CARETECH ESA]");
    Serial.printf(">>> FSR 1 Tangan Kiri  (GPIO %d) : ADC = %d %s\n", FSR1_PIN, r1, r1 > FSR_TOUCH_THRESH ? "[DIGENGGAM!]" : (r1 > FSR_NOISE_FLOOR ? "[RINGAN]" : "[KOSONG]"));
    Serial.printf(">>> FSR 2 Tangan Kanan (GPIO %d) : ADC = %d %s\n", FSR2_PIN, r2, r2 > FSR_TOUCH_THRESH ? "[DIGENGGAM!]" : (r2 > FSR_NOISE_FLOOR ? "[RINGAN]" : "[KOSONG]"));
    Serial.printf(">>> Touch 1 Pelukan    (GPIO %d) : %s\n", TOUCH1_PIN, t1 ? "HIGH (SEDANG DIPELUK)" : "LOW");
    Serial.printf(">>> Touch 2 Pelukan    (GPIO %d) : %s\n", TOUCH2_PIN, t2 ? "HIGH (SEDANG DIPELUK)" : "LOW");
    Serial.printf(">>> Status Sensor Sistem         : %s (Ambang Tekanan Tangan: %d)\n", sensorsEnabled ? "AKTIF" : "NONAKTIF (Ketik 'on')", FSR_TOUCH_THRESH);
    Serial.println("=======================================================\n");
    return;
  }
  if (line.equalsIgnoreCase("on")) {
    sensorsEnabled = true;
    Serial.println(">>> [SENSOR CTL] Sensor Fisik Diaktifkan!");
    return;
  }
  if (line.equalsIgnoreCase("off")) {
    sensorsEnabled = false;
    Serial.println(">>> [SENSOR CTL] Sensor Fisik Dinonaktifkan!");
    return;
  }

  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, line);
  if (err) return;

  String type = doc["type"].as<String>();

  if (type == "action") {
    handleAction(doc["state"].as<String>());
  } else if (type == "play_chunk") {
    // Aliran suara nyata AI dari browser ke speaker MAX98357A
    const char* b64 = doc["data"];
    if (b64) {
      playAudioChunk8k(b64);
    }
  } else if (type == "play_end") {
    // Selesai streaming chunk: biarkan DMA buffer menghabiskan sisa audio secara alami tanpa zeroing
    currentState = STATE_IDLE;
    digitalWrite(LED_PIN, LOW);
  } else if (type == "stop_audio") {
    // Hentikan suara speaker seketika (interupsi paksa / mute)
    stopSpeakerAudio();
  } else if (type == "test_speaker") {
    // Perintah uji coba speaker MAX98357A langsung
    playRobotChime(7);
    sendStatus("status", "Melodi uji coba MAX98357A selesai dimainkan");
  } else if (type == "speak") {
    // Robot bersuara ekspresif lewat speaker MAX98357A disinkronkan dengan chat
    int syllables = doc["syllables"] | 8;
    String mood   = doc["mood"] | "happy";
    currentState  = STATE_SPEAKING;
    playRobotSpeech(syllables, mood);
    currentState  = STATE_IDLE;
  } else if (type == "test_mic") {
    // Uji coba mic INMP441 & loopback ke speaker (dinamis hingga 4 detik)
    int dur = doc["duration"] | 4;
    recordAndStreamAudio(dur, "test", true);
  } else if (type == "stop_rec") {
    // Selesai rekam manual via web chat
    currentState = STATE_IDLE;
  } else if (type == "start_rec") {
    // Merekam curhat suara siswa dari mikrofon INMP441 (Sistem Toggle ON/OFF)
    stopSpeakerAudio(); // Pastikan speaker mati saat rekam dimulai
    int dur = doc["duration"] | 15;
    recordAndStreamAudio(dur, "chat", false);
  } else if (type == "play_tone") {
    float freq = doc["freq"] | 440.0f;
    int dur    = doc["dur"]  | 100;
    playToneI2S(freq, dur, 0.35f);
  } else if (type == "test_fsr") {
    JsonDocument fsrDoc;
    fsrDoc["type"] = "fsr_status";
    fsrDoc["fsr1"] = fsr1Level;
    fsrDoc["fsr2"] = fsr2Level;
    sendDoc(fsrDoc);
  } else if (type == "ping") {
    sendStatus("status", "pong");
  } else if (type == "set_sensors") {
    sensorsEnabled = doc["enabled"] | false;
    Serial.printf("[SENSOR CTL] Status Sensor Fisik: %s\n", sensorsEnabled ? "AKTIF (MENUNGGU INPUT)" : "NONAKTIF (DORMAN)");
    if (!sensorsEnabled) {
      fsr1Pressed = false;
      fsr2Pressed = false;
      digitalTouch1Active = false;
      digitalTouch2Active = false;
      hugTouchStartMs = 0;
      hugHold2sFired = false;
      digitalWrite(LED_PIN, LOW);
    } else {
      playRobotChime(2); // Nada sambutan siap menerima sentuhan
    }
  }
}

// ==========================================
// SENSOR TEKANAN FSR402 & INDIKATOR LED (DIMMER)
// ==========================================
void checkPressureSensors() {
  if (!sensorsEnabled) return; // Hanya aktif saat standby / diaktifkan sistem
  if (millis() - lastFsrCheckMs < 30) return; // Update berkala ~33 Hz
  lastFsrCheckMs = millis();

  // 1. Baca nilai ADC dengan peredam jitter oversampling 8x (Driver ADC Legacy)
  int raw1 = readAdc1Smoothed(FSR1_ADC_CHAN);
  int raw2 = readAdc1Smoothed(FSR2_ADC_CHAN);

  // 2. Low-Pass Filter (Exponential Moving Average) untuk kestabilan sinyal bebas kedip
  fsr1Smoothed = (fsr1Smoothed * 3 + raw1) / 4;
  fsr2Smoothed = (fsr2Smoothed * 3 + raw2) / 4;
  fsr1Level = fsr1Smoothed;
  fsr2Level = fsr2Smoothed;

  // 2b. Pantauan Real-Time di Serial Monitor: Cetak saat ada tekanan/sentuhan fisik
  if ((raw1 > FSR_NOISE_FLOOR || raw2 > FSR_NOISE_FLOOR) && (millis() - lastFsrDebugMs > 350)) {
    lastFsrDebugMs = millis();
    Serial.printf("[FSR LIVE] FSR1 (GPIO %d): %d | FSR2 (GPIO %d): %d | Ambang: %d\n", FSR1_PIN, fsr1Smoothed, FSR2_PIN, fsr2Smoothed, FSR_TOUCH_THRESH);
  }

  // 3. Deteksi Event Sentuhan Stabil (Ambang sentuhan responsif)
  bool touched1 = (fsr1Smoothed > FSR_TOUCH_THRESH);
  bool touched2 = (fsr2Smoothed > FSR_TOUCH_THRESH);

  // Sentuhan FSR 1: Genggam Tangan Kiri Boneka
  if (touched1 && !fsr1Pressed && (millis() - lastFsrReportMs > 800)) {
    lastFsrReportMs = millis();
    fsr1Pressed = true;

    // Cetak log jelas langsung ke Serial Monitor
    Serial.printf(">>> [FSR 1 TEKANAN] Genggaman Tangan Kiri Boneka Terdeteksi! Level ADC: %d (GPIO %d)\n", fsr1Smoothed, FSR1_PIN);

    JsonDocument doc;
    doc["type"]   = "touch";
    doc["sensor"] = "fsr1";
    doc["target"] = "hand";
    doc["part"]   = "left_hand";
    doc["level"]  = fsr1Smoothed;
    doc["action"] = "hold_hand";
    sendDoc(doc);

    if (currentState == STATE_IDLE) {
      playRobotChime(1); // Sapaan / nada ceria
    }
  } else if (!touched1 && fsr1Pressed && (fsr1Smoothed < FSR_NOISE_FLOOR)) {
    fsr1Pressed = false;
    Serial.println(">>> [FSR 1 LEPAS] Genggaman Tangan Kiri Boneka Dilepas.");
  }

  // Sentuhan FSR 2: Genggam Tangan Kanan Boneka
  if (touched2 && !fsr2Pressed && (millis() - lastFsrReportMs > 800)) {
    lastFsrReportMs = millis();
    fsr2Pressed = true;

    // Cetak log jelas langsung ke Serial Monitor
    Serial.printf(">>> [FSR 2 TEKANAN] Genggaman Tangan Kanan Boneka Terdeteksi! Level ADC: %d (GPIO %d)\n", fsr2Smoothed, FSR2_PIN);

    JsonDocument doc;
    doc["type"]   = "touch";
    doc["sensor"] = "fsr2";
    doc["target"] = "hand";
    doc["part"]   = "right_hand";
    doc["level"]  = fsr2Smoothed;
    doc["action"] = "hold_hand";
    sendDoc(doc);

    if (currentState == STATE_IDLE) {
      playRobotChime(2); // Nada ramah hangat
    }
  } else if (!touched2 && fsr2Pressed && (fsr2Smoothed < FSR_NOISE_FLOOR)) {
    fsr2Pressed = false;
    Serial.println(">>> [FSR 2 LEPAS] Genggaman Tangan Kanan Boneka Dilepas.");
  }
}

// ==========================================
// SENSOR SENTUH DIGITAL TAMBAHAN (2x TTP223 - SENSOR MEMELUK BONEKA)
// ==========================================
void checkDigitalTouchSensors() {
  if (!sensorsEnabled) return; // Hanya aktif saat diminta oleh chat (On-Demand)
  bool t1 = (digitalRead(TOUCH1_PIN) == HIGH);
  bool t2 = (digitalRead(TOUCH2_PIN) == HIGH);
  bool anyTouched = (t1 || t2);

  if (anyTouched) {
    if ((!digitalTouch1Active && t1) || (!digitalTouch2Active && t2)) {
      if (millis() - lastDigitalTouchReportMs > 400) {
        lastDigitalTouchReportMs = millis();

        // Output khusus langsung ke Serial Monitor
        Serial.print(">>> [PELUKAN TOUCH] ");
        if (t1 && t2) {
          Serial.println("Pelukan Penuh Kedua Sisi Terdeteksi! (GPIO 27 & GPIO 13)");
        } else if (t1) {
          Serial.println("Pelukan Sisi Kiri Boneka Terdeteksi! (GPIO 27)");
        } else {
          Serial.println("Pelukan Sisi Kanan Boneka Terdeteksi! (GPIO 13)");
        }

        // Kirim event JSON ke chat.html (via WebSocket & USB Serial)
        JsonDocument doc;
        doc["type"]   = "touch";
        doc["sensor"] = (t1 && t2) ? "touch12" : (t1 ? "touch1" : "touch2");
        doc["target"] = "hug";
        doc["action"] = "hug";
        sendDoc(doc);

        // Respon melodi & LED robot
        if (currentState == STATE_IDLE) {
          playRobotChime(1); // Melodi ceria
        }
        digitalWrite(LED_PIN, HIGH);
      }
    }
  } else {
    if (digitalTouch1Active || digitalTouch2Active) {
      if (millis() - lastDigitalTouchReportMs > 300) {
        Serial.println(">>> [PELUKAN SELESAI] Pelukan Boneka Dilepas.");
        if (currentState == STATE_IDLE) {
          digitalWrite(LED_PIN, LOW);
        }
      }
    }
  }

  digitalTouch1Active = t1;
  digitalTouch2Active = t2;
}

// ==========================================
// PELACAKAN PELUKAN / SENTUHAN 2 DETIK (COMFORT HUG)
// ==========================================
void updateHugHoldTracker(bool isTouched) {
  if (isTouched) {
    if (hugTouchStartMs == 0) {
      hugTouchStartMs = millis();
      hugHold2sFired = false;
    } else if (!hugHold2sFired && (millis() - hugTouchStartMs >= 2000)) {
      hugHold2sFired = true;

      // Kirim event pelukan 2 detik resmi ke chat.html
      JsonDocument doc;
      doc["type"]     = "touch";
      doc["action"]   = "hug_hold_2s";
      doc["target"]   = "hug";
      doc["duration"] = (float)(millis() - hugTouchStartMs) / 1000.0f;
      sendDoc(doc);

      Serial.println("\n*******************************************************");
      Serial.println(">>> [HUG 2 DETIK SUKSES!] Pelukan 2 Detik Diterima!");
      Serial.println(">>> Mengirim konfirmasi ke browser chat.html...");
      Serial.println("*******************************************************\n");

      // Mainkan melodi pelukan hangat di speaker MAX98357A & nyalakan indikator LED
      digitalWrite(LED_PIN, HIGH);
      digitalWrite(LED1_PIN, HIGH);
      digitalWrite(LED2_PIN, HIGH);
      playRobotChime(8); // Melodi pelukan hangat menenangkan
      delay(200);
      digitalWrite(LED1_PIN, LOW);
      digitalWrite(LED2_PIN, LOW);
    }
  } else {
    hugTouchStartMs = 0;
    hugHold2sFired = false;
  }
}

// ==========================================
// ANIMASI EKSPRESI LED ONBOARD
// ==========================================
void updateLedAnimation() {
  unsigned long now = millis();

  // Jika salah satu sensor FSR atau Sensor Sentuh Digital sedang disentuh nyata, nyalakan LED onboard (GPIO 2)
  if (fsr1Pressed || fsr2Pressed || fsr1Smoothed > FSR_TOUCH_THRESH || fsr2Smoothed > FSR_TOUCH_THRESH || digitalTouch1Active || digitalTouch2Active) {
    digitalWrite(LED_PIN, HIGH);
    return;
  }

  if (currentState == STATE_RECORDING) {
    digitalWrite(LED_PIN, HIGH);
  } else if (currentState == STATE_THINKING) {
    if (now - lastStateAnimMs >= 90) {
      lastStateAnimMs = now;
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);
    }
  } else if (currentState == STATE_SPEAKING) {
    if (now - lastStateAnimMs >= 65) {
      lastStateAnimMs = now;
      ledState = !ledState;
      digitalWrite(LED_PIN, ledState ? HIGH : LOW);
    }
  } else {
    // Mode Standby: LED Onboard mati total (tidak berkedip sendiri saat idle)
    digitalWrite(LED_PIN, LOW);
  }
}

// ==========================================
// TOMBOL PUSH-TO-TALK FISIK (12mm PBS GPIO 4 & BOOT GPIO 0)
// ==========================================
void checkCurhatButton() {
  int reading = isAnyButtonPressed() ? LOW : HIGH;

  if (reading != lastButtonReading) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading == LOW && !buttonPressedSent) {
      buttonPressedSent = true;

      // Jika robot sedang bicara, langsung potong suara speaker seketika!
      if (currentState == STATE_SPEAKING) {
        stopSpeakerAudio();
        JsonDocument intDoc;
        intDoc["type"]   = "interrupted";
        intDoc["reason"] = "button_press";
        sendDoc(intDoc);
      }

      playRobotChime(2);

      // Otomatis picu rekam suara curhat langsung dari robot! (Sistem Toggle ON/OFF)
      recordAndStreamAudio(15, "button_curhat", false);
    } else if (reading == HIGH) {
      buttonPressedSent = false;
    }
  }

  lastButtonReading = reading;
}

// ==========================================
// DRIVER NIRKABEL: WIFI & WEBSOCKET SERVER
// ==========================================
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      if (wsConnectedClients > 0) wsConnectedClients--;
      Serial.printf("[WS] Client #%u Terputus. Sisa Client: %d\n", num, wsConnectedClients);
      break;

    case WStype_CONNECTED: {
      wsConnectedClients++;
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[WS] Client #%u Terhubung dari: %s\n", num, ip.toString().c_str());

      // Kirim salam sambutan & status siap ke client web yang baru tersambung
      JsonDocument welcomeDoc;
      welcomeDoc["type"]   = "status";
      welcomeDoc["msg"]    = "CareTech ESA Wireless Siap!";
      welcomeDoc["mode"]   = wifiConnected ? "STA" : "AP";
      welcomeDoc["ip"]     = wifiConnected ? WiFi.localIP().toString() : WiFi.softAPIP().toString();
      welcomeDoc["mdns"]   = "esa-robot.local";
      String out;
      serializeJson(welcomeDoc, out);
      webSocket.sendTXT(num, out);

      // Mainkan nada sapaan gembira lewat speaker MAX98357A
      playRobotChime(1);
      break;
    }

    case WStype_TEXT: {
      // Perintah teks JSON yang diterima dari chat.html via WebSocket
      handleLine(String((char*)payload));
      break;
    }

    case WStype_BIN:
      break;

    default:
      break;
  }
}

void initWiFiAndWebSocket() {
  Serial.println("\n[WiFi] Memulai inisialisasi jaringan nirkabel...");

  // Nonaktifkan WiFi power save / modem sleep agar streaming audio I2S tidak putus-putus
  WiFi.setSleep(false);

  // Periksa apakah SSID sudah diisi oleh pengguna (bukan default placeholder)
  bool hasCustomSsid = (strlen(WIFI_SSID) > 0 && strcmp(WIFI_SSID, "NAMA_WIFI_ANDA") != 0);

  if (hasCustomSsid) {
    Serial.printf("[WiFi] Menghubungkan ke: %s ...\n", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASS);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 16) { // Tunggu hingga ~8 detik
      delay(500);
      Serial.print(".");
      digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // Animasi kedip saat mencari sinyal
      attempts++;
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      wifiConnected = true;
      Serial.println("[WiFi] Berhasil Terhubung ke Jaringan!");
      Serial.print("[WiFi] Alamat IP ESP32: ");
      Serial.println(WiFi.localIP());
    } else {
      Serial.println("[WiFi] Tidak dapat tersambung ke WiFi. Beralih ke Hotspot Mandiri (AP Mode)...");
    }
  }

  // Jika belum terkoneksi, aktifkan Access Point Mandiri bawaan Robot
  if (!wifiConnected) {
    WiFi.mode(WIFI_AP);
    WiFi.softAP(AP_SSID, AP_PASS);
    Serial.printf("[WiFi] AP Mode Aktif! Hubungkan laptop ke WiFi: '%s' (Sandi: '%s')\n", AP_SSID, AP_PASS);
    Serial.print("[WiFi] Alamat IP Robot: ");
    Serial.println(WiFi.softAPIP()); // Default: 192.168.4.1
  }

  // Aktifkan mDNS agar browser bisa membuka ws://esa-robot.local:81
  if (MDNS.begin("esa-robot")) {
    MDNS.addService("ws", "tcp", WS_PORT);
    Serial.println("[mDNS] Layanan aktif di: ws://esa-robot.local:81");
  }

  // Jalankan WebSocket Server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.printf("[WS] WebSocket Server berjalan pada port: %d\n", WS_PORT);
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  Serial.setRxBufferSize(1024);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  digitalWrite(LED1_PIN, LOW);
  digitalWrite(LED2_PIN, LOW);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(EXT_BUTTON_PIN, INPUT_PULLUP);

  // Inisialisasi 2x Modul Sensor Sentuh Digital (TTP223 di GPIO 27 & GPIO 13)
  pinMode(TOUCH1_PIN, INPUT);
  pinMode(TOUCH2_PIN, INPUT);

  // Inisialisasi ADC1 Legacy (12-bit, rentang 0 - 4095) untuk sensor tekanan FSR402
  // Menggunakan driver ADC legacy agar serasi 100% dengan driver I2S audio tanpa crash driver_ng
  adc1_config_width(ADC_WIDTH_BIT_12);
  adc1_config_channel_atten(FSR1_ADC_CHAN, ADC_ATTEN_DB_12);
  adc1_config_channel_atten(FSR2_ADC_CHAN, ADC_ATTEN_DB_12);

  randomSeed(esp_random());
  delay(200);

  // Inisialisasi Audio Hardware I2S
  initI2SSpeaker(); // MAX98357A pada I2S_NUM_1 (GPIO 26, 25, 22)
  initI2SMic();     // INMP441 pada I2S_NUM_0 (GPIO 14, 33, 32)

  // Inisialisasi Nirkabel: WiFi & WebSocket
  initWiFiAndWebSocket();

  sendStatus("status", "CareTech ESA Siap! (Dual Mode Audio + 2x Sensor FSR402)");

  Serial.println("\n-------------------------------------------------------");
  Serial.println("CareTech ESA Siap! (Dual Mode Audio + 2x FSR Tangan + 2x Touch Pelukan)");
  Serial.printf("FSR Tangan : GPIO %d & %d | Touch Pelukan: GPIO %d & %d\n", FSR1_PIN, FSR2_PIN, TOUCH1_PIN, TOUCH2_PIN);
  Serial.printf("Status Sensor Fisik: %s (Ambang Tekanan Tangan: %d)\n", sensorsEnabled ? "AKTIF" : "NONAKTIF", FSR_TOUCH_THRESH);
  Serial.println("Tips: Ketik 'fsr' atau 'test' di Serial Monitor untuk cek diagnostik sensor!");
  Serial.println("-------------------------------------------------------\n");

  // Mainkan sapaan ceria awal lewat speaker MAX98357A
  playRobotChime(1);
}

// ==========================================
// MAIN LOOP
// ==========================================
void loop() {
  // 1. Proses Event WebSocket Nirkabel
  webSocket.loop();

  // 2. Baca Perintah Masuk dari Browser chat.html via USB Serial
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      handleLine(inputBuffer);
      inputBuffer = "";
    } else if (c != '\r' && inputBuffer.length() < 1000) {
      inputBuffer += c;
    }
  }

  // 3. Cek Mikrofon INMP441 (Aktivitas Suara / VAD)
  checkMicActivity();

  // 4. Cek Sensor Tekanan FSR402 & Update LED Indikator
  checkPressureSensors();

  // 4b. Cek Sensor Sentuh Digital Tambahan (TTP223 - Output ke Serial Monitor)
  checkDigitalTouchSensors();

  // 4c. Pelacakan Pelukan / Sentuhan Tahan 2 Detik (FSR1, FSR2, atau Touch Digital)
  if (sensorsEnabled) {
    bool anyPhysTouched = (fsr1Smoothed > FSR_TOUCH_THRESH || fsr2Smoothed > FSR_TOUCH_THRESH || digitalRead(TOUCH1_PIN) == HIGH || digitalRead(TOUCH2_PIN) == HIGH);
    updateHugHoldTracker(anyPhysTouched);
  }

  // 5. Cek Tombol BOOT (GPIO 0)
  checkCurhatButton();

  // 6. Animasi LED Onboard
  updateLedAnimation();
}
