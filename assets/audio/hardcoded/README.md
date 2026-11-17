# CareTech Robot ESA - Hardcoded Audio Scenarios (ElevenLabs)

Direktori ini berisi seluruh aset audio suara robot ESA yang di-hardcode untuk skenario interaksi emosional dan respon cepat tanpa jeda (zero latency), bersih tanpa emoji.

---

## Daftar 18 Berkas Audio Resmi

| No | Berkas Audio | Skenario | Tahapan Dialog |
| :---: | :--- | :--- | :--- |
| 1 | `sedih_stage1_offer.mp3` | `sedih_hug` | Tahap 1 (Tawaran Pelukan) |
| 2 | `sedih_stage2_hugged.mp3` | `sedih_hug` | Tahap 2 (Setelah Dipeluk) |
| 3 | `sedih_stage2_timeout.mp3` | `sedih_hug` | Tahap 2 (Timeout) |
| 4 | `marah_stage1_offer.mp3` | `marah_breathe` | Tahap 1 (Ajakan Tarik Napas 4 Detik) |
| 5 | `marah_stage2_breathed.mp3` | `marah_breathe` | Tahap 2 (Setelah Bernapas) |
| 6 | `marah_stage2_timeout.mp3` | `marah_breathe` | Tahap 2 (Timeout) |
| 7 | `takut_stage1_offer.mp3` | `takut_hold_hand` | Tahap 1 (Ajakan Genggam Tangan 3 Detik) |
| 8 | `takut_stage2_held.mp3` | `takut_hold_hand` | Tahap 2 (Setelah Digenggam) |
| 9 | `takut_stage2_timeout.mp3` | `takut_hold_hand` | Tahap 2 (Timeout) |
| 10 | `lelah_stage1_offer.mp3` | `lelah_pat` | Tahap 1 (Ajakan Elus Kepala 2 Detik) |
| 11 | `lelah_stage2_patted.mp3` | `lelah_pat` | Tahap 2 (Setelah Dielus) |
| 12 | `lelah_stage2_timeout.mp3` | `lelah_pat` | Tahap 2 (Timeout) |
| 13 | `bahagia_stage1_offer.mp3` | `bahagia_highfive` | Tahap 1 (Ajakan Tos) |
| 14 | `bahagia_stage2_fived.mp3` | `bahagia_highfive` | Tahap 2 (Setelah Tos) |
| 15 | `bahagia_stage2_timeout.mp3` | `bahagia_highfive` | Tahap 2 (Timeout) |
| 16 | `sapaan_stage1_offer.mp3` | `sapaan_checkin` | Tahap 1 (Ajakan Jabat Tangan) |
| 17 | `sapaan_stage2_greeted.mp3`| `sapaan_checkin` | Tahap 2 (Setelah Bersalaman) |
| 18 | `sapaan_stage2_timeout.mp3`| `sapaan_checkin` | Tahap 2 (Timeout) |

---

## Cara Generate / Perbarui Suara dari ElevenLabs

Anda dapat mengunduh atau memperbarui file suara di folder ini kapan saja langsung dari ElevenLabs API menggunakan skrip otomatis:

```bash
# Menggunakan API Key ElevenLabs Anda:
python script/generate_hardcoded_audio.py --api-key sk_YOUR_ELEVENLABS_API_KEY
```

Opsi Tambahan:
- `--voice-id <ID>`: Mengganti Voice ID ElevenLabs (Default: `EXAVITQu4vr4xnSDxMaL` / Sarah).
- `--model-id <MODEL>`: Mengganti model (Default: `eleven_flash_v2_5`).
