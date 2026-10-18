/*
  =============================================================================
  CARETECH - ESA INTERACTIVE PHYSICAL ROBOT COMPANION
  =============================================================================
  Board: ESP32 Dev Module (NodeMCU-32S / ESP32-WROOM-32)
  Komunikasi: USB Serial (Web Serial API - 115200 baud) ke chat.html

  PETA HARDWARE & PINOUT:
  -----------------------------------------------------------------------------
  1. SPEAKER AMPLIFIER (MAX98357A I2S Mono DAC - Papan Ungu):
     - VIN  -> ESP32 VIN (5V) atau 3V3 (Disarankan 5V agar suara lantang)
     - GND  -> ESP32 GND
     - BCLK -> ESP32 GPIO 26 (Bit Clock)
     - LRC  -> ESP32 GPIO 25 (Word Select / Left-Right Clock)
     - DIN  -> ESP32 GPIO 22 (Serial Data Out dari ESP32)
     - Speaker 3W dipasang ke terminal sekrup hijau (+ dan -)

  2. MICROPHONE (INMP441 I2S MEMS - Papan Bundar Kuning):
     - VDD  -> ESP32 3V3 (3.3V) [JANGAN ke 5V!]
     - GND  -> ESP32 GND
     - SD   -> ESP32 GPIO 32 (Serial Data Masuk ke ESP32)
     - WS   -> ESP32 GPIO 33 (Word Select Clock)
     - SCK  -> ESP32 GPIO 14 (Serial Clock)
     - L/R  -> ESP32 GND (Pilih channel kiri)

  3. SENSOR SENTUH (TTP223 - Papan Merah Bertuliskan "TOUCH"):
     - VCC  -> ESP32 3V3
     - GND  -> ESP32 GND
     - I/O  -> ESP32 GPIO 4 (Digital Input, HIGH saat disentuh)

  4. STATUS & KONTROL BAWAAN:
     - GPIO 2 : Onboard LED (Ekspresi Standby, Berpikir, Bicara, Sentuh)
     - GPIO 0 : Onboard BOOT Button (Pemicu Curhat Cepat)
     - GPIO 34: ADC Sensor Cahaya (LDR)

  5. PENGATURAN WIFI FLEKSIBEL:
     - Disetel langsung dari browser (chat.html) & disimpan permanen di NVS.
  =============================================================================
*/

#include <ArduinoJson.h>
#include <WiFi.h>
#include <Preferences.h>
#include <driver/i2s.h>
#include <math.h>

// ---------- PIN ASSIGNMENT ----------
const int LED_PIN    = 2;    // Built-in LED
const int BUTTON_PIN = 0;    // BOOT Button
const int TOUCH_PIN  = 4;    // TTP223 Touch Module Input (GPIO 4)
const int LIGHT_PIN  = 34;   // LDR Sensor (ADC)

// MAX98357A I2S Speaker (Port I2S_NUM_1)
#define I2S_SPK_PORT I2S_NUM_1
#define I2S_SPK_BCLK 26
#define I2S_SPK_LRC  25
#define I2S_SPK_DIN  22

// INMP441 I2S Microphone (Port I2S_NUM_0)
#define I2S_MIC_PORT I2S_NUM_0
#define I2S_MIC_SCK  14
#define I2S_MIC_WS   33
#define I2S_MIC_SD   32

#define SIMULATE_SENSORS true

// Storage Flash NVS
Preferences preferences;

// Status Robot
enum RobotState {
  STATE_IDLE,
  STATE_THINKING,
  STATE_SPEAKING,
  STATE_TOUCHED
};

RobotState currentState = STATE_IDLE;
unsigned long lastStateAnimMs = 0;
bool ledState = false;
unsigned long touchResetMs = 0;

// Sensor & Telemetri
float temperatureC = 27.6;
float humidityPct  = 58.0;
int   lightLevel   = 650;
int   soundLevel   = 0;
bool  manualOverride = false;

// Serial Timing
String inputBuffer;
unsigned long lastSensorMs = 0;
const unsigned long SENSOR_INTERVAL_MS = 2000;

// Debounce Tombol BOOT
int lastButtonReading = HIGH;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 60;
bool buttonPressedSent = false;

// Sensor Sentuh TTP223
bool isTouchActive = false;
unsigned long lastTouchCheckMs = 0;
unsigned long lastTouchTriggerMs = 0;
const unsigned long touchCooldownMs = 1500;

// Microphone VAD (Voice Activity Detection)
unsigned long lastMicCheckMs = 0;
int micNoiseFloor = 250;
bool isUserSpeakingNearMic = false;
unsigned long lastVoiceNoticeMs = 0;

// WiFi State Machine
bool wifiConnecting = false;
unsigned long wifiConnectStartMs = 0;
const unsigned long wifiTimeoutMs = 18000;

// ---------- FUNGSI PROTOKOL SERIAL ----------
void sendDoc(JsonDocument& doc) {
  serializeJson(doc, Serial);
  Serial.println();
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
    .dma_buf_count        = 6,
    .dma_buf_len          = 128,
    .use_apll             = false,
    .tx_desc_auto_clear   = true
  };

  i2s_pin_config_t pin_config = {
    .bck_io_num   = I2S_SPK_BCLK,
    .ws_io_num    = I2S_SPK_LRC,
    .data_out_num = I2S_SPK_DIN,
    .data_in_num  = I2S_PIN_NO_CHANGE
  };

  i2s_driver_install(I2S_SPK_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_SPK_PORT, &pin_config);
  i2s_zero_dma_buffer(I2S_SPK_PORT);
}

// Memainkan nada murni sinusoidal lewat MAX98357A
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
  int amp = (int)(32767.0f * volume);

  int samplesRemaining = numSamples;
  while (samplesRemaining > 0) {
    int chunk = (samplesRemaining > 64) ? 64 : samplesRemaining;
    for (int i = 0; i < chunk; i++) {
      int16_t sample = (int16_t)(sin(phase) * amp);
      phase += phaseIncrement;
      if (phase >= 2.0f * PI) phase -= 2.0f * PI;
      buffer[i * 2]     = sample; // L
      buffer[i * 2 + 1] = sample; // R
    }
    i2s_write(I2S_SPK_PORT, buffer, chunk * 4, &bytesWritten, portMAX_DELAY);
    samplesRemaining -= chunk;
  }
}

// Efek suara robot ESA
void playRobotChime(int type) {
  if (type == 1) {
    // Sapaan Ceria / Robot Ready (Do - Mi - Sol)
    playToneI2S(523.25, 70, 0.30); // C5
    playToneI2S(659.25, 80, 0.35); // E5
    playToneI2S(783.99, 130, 0.40); // G5
  } else if (type == 2) {
    // Tombol BOOT ditekan (Nada ramah naik)
    playToneI2S(440.00, 60, 0.30); // A4
    playToneI2S(880.00, 100, 0.35); // A5
  } else if (type == 3) {
    // Sentuhan Sayang / Pet Chime (Melodi lembut hangat)
    playToneI2S(392.00, 80, 0.25); // G4
    playToneI2S(523.25, 90, 0.30); // C5
    playToneI2S(659.25, 120, 0.35); // E5
    playToneI2S(1046.50, 180, 0.30); // C6
  } else if (type == 4) {
    // Thinking Hum
    playToneI2S(330.00, 70, 0.20);
    playToneI2S(392.00, 90, 0.25);
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
    .dma_buf_count        = 4,
    .dma_buf_len          = 128,
    .use_apll             = false
  };

  i2s_pin_config_t pin_config = {
    .bck_io_num   = I2S_MIC_SCK,
    .ws_io_num    = I2S_MIC_WS,
    .data_out_num = I2S_PIN_NO_CHANGE,
    .data_in_num  = I2S_MIC_SD
  };

  i2s_driver_install(I2S_MIC_PORT, &i2s_config, 0, NULL);
  i2s_set_pin(I2S_MIC_PORT, &pin_config);
}

// Membaca level kebisingan suara di sekitar mic (RMS)
int readMicLevel() {
  int32_t samples[64];
  size_t bytesRead = 0;
  i2s_read(I2S_MIC_PORT, samples, sizeof(samples), &bytesRead, 10);

  if (bytesRead == 0) return 0;

  int count = bytesRead / sizeof(int32_t);
  long long sumSquare = 0;
  for (int i = 0; i < count; i++) {
    int16_t sample16 = samples[i] >> 14; // Normalisasi ke 16-bit
    sumSquare += (long long)sample16 * sample16;
  }
  return (int)sqrt(sumSquare / count);
}

// Cek aktivitas suara siswa dekat microphone
void checkMicActivity() {
  if (millis() - lastMicCheckMs < 100) return;
  lastMicCheckMs = millis();

  int currentRms = readMicLevel();
  soundLevel = currentRms;

  // Jika suara melompat tinggi di atas rata-rata ruangan (suara bicara dekat)
  if (currentRms > 1200 && (millis() - lastVoiceNoticeMs > 3500) && currentState == STATE_IDLE) {
    lastVoiceNoticeMs = millis();

    // Beri tahu browser bahwa ada suara terdeteksi
    JsonDocument doc;
    doc["type"]  = "voice_detected";
    doc["level"] = currentRms;
    sendDoc(doc);
  }
}

// ==========================================
// PENGUJIAN MIC INMP441 & STREAM AUDIO KE LAPTOP (LOOPBACK)
// ==========================================
static const char B64_CHARS[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

void writeBase64Stream(const uint8_t* data, size_t len) {
  size_t i = 0;
  while (i + 3 <= len) {
    uint32_t a = data[i++];
    uint32_t b = data[i++];
    uint32_t c = data[i++];
    uint32_t triple = (a << 16) | (b << 8) | c;
    Serial.write(B64_CHARS[(triple >> 18) & 0x3F]);
    Serial.write(B64_CHARS[(triple >> 12) & 0x3F]);
    Serial.write(B64_CHARS[(triple >> 6) & 0x3F]);
    Serial.write(B64_CHARS[triple & 0x3F]);
  }
  if (i < len) {
    uint32_t a = data[i++];
    uint32_t b = (i < len) ? data[i++] : 0;
    uint32_t triple = (a << 16) | (b << 8);
    Serial.write(B64_CHARS[(triple >> 18) & 0x3F]);
    Serial.write(B64_CHARS[(triple >> 12) & 0x3F]);
    if (i == len && b != 0) {
      Serial.write(B64_CHARS[(triple >> 6) & 0x3F]);
      Serial.write('=');
    } else {
      Serial.write('=');
      Serial.write('=');
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

void executeMicTestLoopback(int durationSeconds = 2) {
  if (durationSeconds < 1) durationSeconds = 1;
  if (durationSeconds > 3) durationSeconds = 3;

  int totalSamples8k = 8000 * durationSeconds;

  // Alokasi memori buffer WAV 8-bit (Header 44 byte + totalSamples8k)
  uint8_t* wavBuffer = (uint8_t*)malloc(44 + totalSamples8k);
  if (!wavBuffer) {
    durationSeconds = 1;
    totalSamples8k  = 8000 * durationSeconds;
    wavBuffer = (uint8_t*)malloc(44 + totalSamples8k);
  }

  if (!wavBuffer) {
    sendStatus("error", "Gagal mengalokasikan memori RAM untuk perekaman suara.");
    JsonDocument failDoc;
    failDoc["type"]   = "mic_test";
    failDoc["status"] = "error";
    failDoc["msg"]    = "RAM penuh";
    sendDoc(failDoc);
    return;
  }

  createWavHeader8Bit(wavBuffer, totalSamples8k, 8000);
  uint8_t* pcmData = wavBuffer + 44;

  // Tahap 1: Mulai Rekam
  JsonDocument recDoc;
  recDoc["type"]     = "mic_test";
  recDoc["status"]   = "recording";
  recDoc["duration"] = durationSeconds;
  sendDoc(recDoc);

  digitalWrite(LED_PIN, HIGH);
  playToneI2S(880, 100, 0.35); // Bip hardware jika ada speaker
  delay(120);

  int samplesRead16k = 0;
  int samplesStored8k = 0;
  int32_t rawSamples[64];
  long long maxPeak = 0;

  unsigned long startTime = millis();
  unsigned long timeout = (durationSeconds * 1000) + 1500;

  while (samplesStored8k < totalSamples8k && (millis() - startTime < timeout)) {
    size_t bytesRead = 0;
    i2s_read(I2S_MIC_PORT, rawSamples, sizeof(rawSamples), &bytesRead, 50);

    int count = bytesRead / sizeof(int32_t);
    for (int i = 0; i < count && samplesStored8k < totalSamples8k; i++) {
      int16_t val = (int16_t)(rawSamples[i] >> 14);
      if (abs(val) > maxPeak) maxPeak = abs(val);

      // Downsample 16kHz ke 8kHz (ambil tiap kelipatan 2) dan beri gain 4x
      if ((samplesRead16k % 2) == 0) {
        int32_t scaled = ((int32_t)val * 4) / 256 + 128;
        if (scaled < 0) scaled = 0;
        if (scaled > 255) scaled = 255;
        pcmData[samplesStored8k++] = (uint8_t)scaled;
      }
      samplesRead16k++;
    }
  }

  digitalWrite(LED_PIN, LOW);
  delay(100);

  // Tahap 2: Kirim Audio ke Browser Laptop
  JsonDocument playDoc;
  playDoc["type"]   = "mic_test";
  playDoc["status"] = "playing";
  playDoc["peak"]   = maxPeak;
  sendDoc(playDoc);

  // Stream WAV Base64 langsung ke Laptop via Serial! (Laptop speaker akan memainkan suaramu)
  Serial.print("{\"type\":\"mic_audio\",\"peak\":");
  Serial.print(maxPeak);
  Serial.print(",\"wav\":\"");
  writeBase64Stream(wavBuffer, 44 + samplesStored8k);
  Serial.println("\"}");

  // Jika suatu saat speaker MAX98357A aktif kembali, putar juga ke hardware
  playToneI2S(1046, 100, 0.30);
  int16_t spkBuffer[64 * 2];
  for (int i = 0; i < samplesStored8k; i += 64) {
    int chunk = (samplesStored8k - i > 64) ? 64 : (samplesStored8k - i);
    for (int j = 0; j < chunk; j++) {
      int16_t s = (int16_t)((pcmData[i + j] - 128) * 128);
      spkBuffer[j * 2]     = s;
      spkBuffer[j * 2 + 1] = s;
    }
    size_t bw = 0;
    i2s_write(I2S_SPK_PORT, spkBuffer, chunk * 4, &bw, 50);
  }

  free(wavBuffer);

  // Tahap 3: Selesai
  delay(150);
  JsonDocument doneDoc;
  doneDoc["type"]   = "mic_test";
  doneDoc["status"] = "done";
  doneDoc["peak"]   = maxPeak;
  sendDoc(doneDoc);

  playRobotChime(1);
}

// ==========================================
// PENGATURAN WIFI (NVS FLASH)
// ==========================================
void reportWifiStatus() {
  JsonDocument doc;
  doc["type"] = "wifi";

  if (WiFi.status() == WL_CONNECTED) {
    doc["status"] = "connected";
    doc["ip"]     = WiFi.localIP().toString();
    doc["ssid"]   = WiFi.SSID();
    doc["rssi"]   = WiFi.RSSI();
  } else if (wifiConnecting) {
    doc["status"] = "connecting";
    doc["ssid"]   = preferences.getString("ssid", "");
  } else {
    doc["status"] = "disconnected";
  }
  sendDoc(doc);
}

void startWifiConnect(const String& ssid, const String& pass) {
  if (ssid.length() == 0) return;

  WiFi.disconnect(true);
  delay(100);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), pass.c_str());

  wifiConnecting = true;
  wifiConnectStartMs = millis();

  JsonDocument doc;
  doc["type"]   = "wifi";
  doc["status"] = "connecting";
  doc["ssid"]   = ssid;
  sendDoc(doc);
}

void checkWifiLoop() {
  if (wifiConnecting) {
    if (WiFi.status() == WL_CONNECTED) {
      wifiConnecting = false;
      playRobotChime(1); // Sapaan ceria saat WiFi tersambung
      reportWifiStatus();
    } else if (millis() - wifiConnectStartMs >= wifiTimeoutMs) {
      wifiConnecting = false;
      JsonDocument doc;
      doc["type"]   = "wifi";
      doc["status"] = "failed";
      doc["msg"]    = "Gagal tersambung (Waktu habis / Password keliru)";
      sendDoc(doc);
    }
  }
}

// ==========================================
// SENSOR SENTUH TTP223 (MODUL MERAH)
// ==========================================
void checkTouchSensor() {
  if (millis() - lastTouchCheckMs < 50) return;
  lastTouchCheckMs = millis();

  // Modul TTP223 mengeluarkan logika HIGH saat disentuh
  bool isTouched = (digitalRead(TOUCH_PIN) == HIGH);

  if (isTouched && !isTouchActive && (millis() - lastTouchTriggerMs >= touchCooldownMs)) {
    isTouchActive = true;
    lastTouchTriggerMs = millis();

    // Reaksi fisik robot
    currentState = STATE_TOUCHED;
    touchResetMs = millis() + 1500;
    digitalWrite(LED_PIN, HIGH);
    
    // Putar melodi kasih sayang lewat speaker fisik MAX98357A
    playRobotChime(3);

    // Kirim notifikasi sentuh ke chat.html
    JsonDocument doc;
    doc["type"]   = "touch";
    doc["action"] = "pet";
    doc["text"]   = "(Siswa menyentuh modul sensor ESA dengan lembut)";
    sendDoc(doc);
  } else if (!isTouched) {
    isTouchActive = false;
  }

  if (currentState == STATE_TOUCHED && millis() > touchResetMs) {
    currentState = STATE_IDLE;
    digitalWrite(LED_PIN, LOW);
  }
}

// ==========================================
// SENSOR LINGKUNGAN
// ==========================================
void updateSensors() {
#if SIMULATE_SENSORS
  if (!manualOverride) {
    temperatureC += (random(-5, 6)) / 20.0f;
    humidityPct  += (random(-5, 6)) / 10.0f;
    lightLevel   += random(-25, 26);
    temperatureC = constrain(temperatureC, 21.0f, 35.0f);
    humidityPct  = constrain(humidityPct, 42.0f, 85.0f);
    lightLevel   = constrain(lightLevel, 120, 3600);
  }
#else
  lightLevel = analogRead(LIGHT_PIN);
#endif
}

void sendSensorData() {
  JsonDocument doc;
  doc["type"]      = "sensor";
  doc["temp"]      = round(temperatureC * 10) / 10.0;
  doc["hum"]       = round(humidityPct * 10) / 10.0;
  doc["light"]     = lightLevel;
  doc["sound"]     = soundLevel;
  doc["simulated"] = SIMULATE_SENSORS ? true : false;
  sendDoc(doc);
}

// ==========================================
// PARSING PERINTAH DARI CHAT.HTML
// ==========================================
void handleAction(const String& state) {
  if (state == "thinking") {
    currentState = STATE_THINKING;
    playRobotChime(4); // Soft thinking sound
  } else if (state == "speaking") {
    currentState = STATE_SPEAKING;
    playRobotChime(1); // Suara menyapa saat mulai berbicara
  } else if (state == "happy") {
    playRobotChime(1);
  } else {
    currentState = STATE_IDLE;
    digitalWrite(LED_PIN, LOW);
  }
}

void handleLine(String line) {
  line.trim();
  if (line.length() == 0) return;

  JsonDocument doc;
  DeserializationError err = deserializeJson(doc, line);
  if (err) return;

  String type = doc["type"].as<String>();

  if (type == "action") {
    handleAction(doc["state"].as<String>());
  } else if (type == "test_mic") {
    // Perintah uji coba mic dari web (rekam 3 detik & putar balik ke speaker)
    int dur = doc["duration"] | 3;
    executeMicTestLoopback(dur);
  } else if (type == "play_tone") {
    // Browser bisa meminta ESP32 membunyikan frekuensi tertentu!
    float freq = doc["freq"] | 440.0f;
    int dur    = doc["dur"]  | 100;
    playToneI2S(freq, dur, 0.35f);
  } else if (type == "set_wifi") {
    String ssid = doc["ssid"].as<String>();
    String pass = doc["pass"].as<String>();

    preferences.putString("ssid", ssid);
    preferences.putString("pass", pass);

    startWifiConnect(ssid, pass);
  } else if (type == "get_wifi") {
    reportWifiStatus();
  } else if (type == "clear_wifi") {
    preferences.remove("ssid");
    preferences.remove("pass");
    WiFi.disconnect(true);
    reportWifiStatus();
  } else if (type == "set_sensor") {
    if (doc["temp"].is<float>())  temperatureC = doc["temp"];
    if (doc["hum"].is<float>())   humidityPct  = doc["hum"];
    if (doc["light"].is<int>())   lightLevel   = doc["light"];
    manualOverride = true;
    sendSensorData();
  } else if (type == "auto_sensor") {
    manualOverride = false;
    sendStatus("status", "Sensor kembali otomatis");
  } else if (type == "ping") {
    sendStatus("status", "pong");
  }
}

// ==========================================
// ANIMASI EKSPRESI LED
// ==========================================
void updateLedAnimation() {
  unsigned long now = millis();

  if (currentState == STATE_THINKING) {
    if (now - lastStateAnimMs >= 100) {
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
  } else if (currentState == STATE_TOUCHED) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    // Mode Standby: Denyut lembut tiap 3 detik
    unsigned long cycle = now % 3000;
    if (cycle < 60) {
      digitalWrite(LED_PIN, HIGH);
    } else {
      digitalWrite(LED_PIN, LOW);
    }
  }
}

// ==========================================
// TOMBOL BOOT FISIK (GPIO 0)
// ==========================================
void checkCurhatButton() {
  int reading = digitalRead(BUTTON_PIN);

  if (reading != lastButtonReading) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading == LOW && !buttonPressedSent) {
      buttonPressedSent = true;
      playRobotChime(2);

      JsonDocument doc;
      doc["type"]   = "button";
      doc["action"] = "curhat";
      doc["text"]   = "Hai ESA! Aku menekan tombol di robotmu karena ingin curhat...";
      sendDoc(doc);
    } else if (reading == HIGH) {
      buttonPressedSent = false;
    }
  }

  lastButtonReading = reading;
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  Serial.setRxBufferSize(1024);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(TOUCH_PIN, INPUT); // TTP223 Red Module

  randomSeed(esp_random());
  delay(300);

  // Inisialisasi Audio I2S
  initI2SSpeaker(); // MAX98357A pada I2S_NUM_1
  initI2SMic();     // INMP441 pada I2S_NUM_0

  // Inisialisasi Memori WiFi
  preferences.begin("caretech", false);
  String savedSSID = preferences.getString("ssid", "");
  String savedPass = preferences.getString("pass", "");

  sendStatus("status", "CareTech ESA Robot Siap! (I2S Speaker + Mic + TTP223 Touch + Web WiFi)");
  
  // Bunyi nada sapaan awal lewat speaker fisik MAX98357A!
  playRobotChime(1);
  sendSensorData();

  if (savedSSID.length() > 0) {
    startWifiConnect(savedSSID, savedPass);
  } else {
    reportWifiStatus();
  }
}

// ==========================================
// LOOP
// ==========================================
void loop() {
  // 1. Baca Perintah Masuk dari Web chat.html
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      handleLine(inputBuffer);
      inputBuffer = "";
    } else if (c != '\r' && inputBuffer.length() < 1000) {
      inputBuffer += c;
    }
  }

  // 2. Cek Sensor Sentuh TTP223 (GPIO 4)
  checkTouchSensor();

  // 3. Cek Mikrofon INMP441 (Aktivitas Suara)
  checkMicActivity();

  // 4. Cek Tombol BOOT (GPIO 0)
  checkCurhatButton();

  // 5. Cek Status Koneksi WiFi
  checkWifiLoop();

  // 6. Animasi LED
  updateLedAnimation();

  // 7. Pengiriman Sensor Lingkungan Berkala
  if (millis() - lastSensorMs >= SENSOR_INTERVAL_MS) {
    lastSensorMs = millis();
    updateSensors();
    sendSensorData();
  }
}
