# 🎙️ CareTech Robot ESA - Hardcoded Audio Scenarios (ElevenLabs)

Direktori ini berisi seluruh aset audio suara robot ESA yang di-*hardcode* untuk skenario interaksi emosional dan respon cepat tanpa jeda (*zero latency*).

---

## 📁 Daftar Berkas

| Berkas | Durasi Estimasi | Deskripsi & Konteks Skenario |
| :--- | :--- | :--- |
| `scenarios.json` | - | Registry metadata seluruh skenario terstruktur (kata kunci, naskah, nama berkas audio, konfigurasi aksi ESP32). |
| `sedih_stage1_offer.mp3` | ~8s | **Tahap 1**: Jawaban penenang awal dan penawaran pelukan 2 detik saat kata kunci sedih terdeteksi. |
| `sedih_stage2_hugged.mp3` | ~6s | **Tahap 2 (Sukses)**: Jawaban seketika setelah sensor pelukan (FSR / TTP223 / Tombol Layar) berhasil ditahan selama $\ge$ 2 detik. |
| `sedih_stage2_timeout.mp3`| ~5s | **Tahap 2 (Timeout)**: Jawaban ramah dan tidak memaksa jika siswa tidak memeluk boneka dalam 30 detik. |

---

## 🚀 Cara Generate / Perbarui Suara dari ElevenLabs

Anda dapat mengunduh atau memperbarui file suara di folder ini kapan saja langsung dari **ElevenLabs API** menggunakan skrip otomatis:

### 1. Menggunakan Argumen CLI:
```bash
python script/generate_hardcoded_audio.py --api-key sk_YOUR_ELEVENLABS_API_KEY
```

### 2. Menggunakan Environment Variable:
```bash
# Windows PowerShell
$env:ELEVENLABS_API_KEY="sk_YOUR_ELEVENLABS_API_KEY"
python script/generate_hardcoded_audio.py

# Windows CMD
set ELEVENLABS_API_KEY=sk_YOUR_ELEVENLABS_API_KEY
python script/generate_hardcoded_audio.py
```

### Opsi Tambahan:
- `--voice-id <ID>`: Mengganti Voice ID ElevenLabs (Default: `EXAVITQu4vr4xnSDxMaL` / Sarah).
- `--model-id <MODEL>`: Mengganti model (Default: `eleven_flash_v2_5` atau `eleven_multilingual_v2`).

---

## 🛠️ Fallback Offline
Jika skrip dijalankan tanpa API Key ElevenLabs atau saat kuota habis, skrip otomatis membuat file audio fallback menggunakan mesin suara lokal Windows SAPI sehingga aplikasi web CareTech tidak akan mengalami galat *404 Not Found*.
