#!/usr/bin/env python3
"""
CareTech - Generator Audio Skenario Hardcode (ElevenLabs TTS)
Script ini membaca `assets/audio/hardcoded/scenarios.json` dan mengunduh audio
MP3 resmi dari ElevenLabs API untuk setiap tahapan dialog skenario.

Penggunaan:
    python script/generate_hardcoded_audio.py --api-key sk_xxxx
Atau:
    set ELEVENLABS_API_KEY=sk_xxxx
    python script/generate_hardcoded_audio.py
"""

import os
import sys
import json
import argparse
import subprocess
import requests

DEFAULT_CONFIG_PATH = os.path.join("assets", "audio", "hardcoded", "scenarios.json")
DEFAULT_OUTPUT_DIR = os.path.join("assets", "audio", "hardcoded")
DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"  # Sarah (Lembut, hangat, ramah)
DEFAULT_MODEL_ID = "eleven_multilingual_v2" # Model terbaik & alami untuk Bahasa Indonesia


def clean_tts_text(text: str) -> str:
    """Membersihkan format teks agar pengucapan TTS natural."""
    clean = text.replace("...", ", ")
    clean = " ".join(clean.split())
    return clean


def generate_elevenlabs_audio(text: str, output_path: str, api_key: str, voice_id: str, model_id: str, language_code: str = "id") -> bool:
    """Mengunduh file audio dari ElevenLabs REST API dengan pemaksaan bahasa Indonesia."""
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": clean_tts_text(text),
        "model_id": model_id,
        "language_code": language_code,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.8,
            "style": 0.0,
            "use_speaker_boost": True
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
            size_kb = len(response.content) / 1024
            print(f"  ✓ Sukses di-generate dari ElevenLabs ({size_kb:.1f} KB, lang={language_code}) -> {output_path}")
            return True
        else:
            print(f"  ✗ Gagal ElevenLabs HTTP {response.status_code}: {response.text[:200]}")
            return False
    except Exception as e:
        print(f"  ✗ Exception saat request ElevenLabs: {e}")
        return False


def generate_fallback_google_id_audio(text: str, output_path: str) -> bool:
    """Mengunduh audio Bahasa Indonesia asli dan natural dari Google TTS endpoint (bebas aksen bule)."""
    import urllib.parse
    import urllib.request
    try:
        clean = clean_tts_text(text)
        encoded_text = urllib.parse.quote(clean)
        url = f"https://translate.google.com/translate_tts?ie=UTF-8&q={encoded_text}&tl=id&client=tw-ob"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            with open(output_path, "wb") as f:
                f.write(content)
            size_kb = len(content) / 1024
            print(f"  ✓ Sukses di-generate dari Fallback Bahasa Indonesia ({size_kb:.1f} KB) -> {output_path}")
            return True
    except Exception as e:
        print(f"  ✗ Google TTS fallback gagal: {e}")
        return False


def generate_fallback_sapi_audio(text: str, output_path: str) -> bool:
    """Fallback lokal menggunakan Windows SAPI SpeechSynthesizer jika offline / tanpa API key."""
    try:
        safe_text = clean_tts_text(text).replace("'", "''").replace('"', '`"')
        # Tentukan format output (WAV) lalu simpan
        temp_wav = output_path.replace(".mp3", ".wav")
        ps_cmd = (
            f"Add-Type -AssemblyName System.Speech; "
            f"$s = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
            f"$s.SetOutputToWaveFile('{temp_wav}'); "
            f"$s.Speak('{safe_text}'); "
            f"$s.Dispose();"
        )
        proc = subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], capture_output=True, text=True)
        if proc.returncode == 0 and os.path.exists(temp_wav):
            if output_path.endswith(".mp3"):
                with open(temp_wav, "rb") as rf:
                    content = rf.read()
                with open(output_path, "wb") as wf:
                    wf.write(content)
                try:
                    os.remove(temp_wav)
                except Exception:
                    pass
            size_kb = os.path.getsize(output_path) / 1024
            print(f"  ✓ [Fallback SAPI] Berhasil dibuat ({size_kb:.1f} KB) -> {output_path}")
            return True
        else:
            print(f"  ✗ Fallback SAPI gagal: {proc.stderr}")
            return False
    except Exception as e:
        print(f"  ✗ Exception SAPI fallback: {e}")
        return False


def process_scenarios(config_path: str, output_dir: str, api_key: str, voice_id: str, model_id: str, language_code: str = "id"):
    if not os.path.exists(config_path):
        print(f"Error: File konfigurasi '{config_path}' tidak ditemukan!")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)

    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    scenarios = config.get("scenarios", [])
    print("=" * 60)
    print(f"CareTech ElevenLabs Audio Generator (Enforce Indonesian: {language_code})")
    print(f"Total Skenario: {len(scenarios)}")
    print(f"Model: {model_id} | Voice ID: {voice_id} | Bahasa: {language_code}")
    print(f"API Key: {'Tersedia (sk_...)' if api_key else 'TIDAK TERSEDIA (Menggunakan Fallback)'}")
    print("=" * 60)

    for sc in scenarios:
        sc_id = sc.get("id")
        title = sc.get("title")
        print(f"\n[Skenario: {sc_id} - '{title}']")

        tasks = []
        if "stage1" in sc:
            tasks.append(("Tahap 1 (Penawaran Pelukan)", sc["stage1"].get("text"), sc["stage1"].get("audio_file")))
        if "stage2_success" in sc:
            tasks.append(("Tahap 2 (Setelah Dipeluk)", sc["stage2_success"].get("text"), sc["stage2_success"].get("audio_file")))
        if "stage2_timeout" in sc:
            tasks.append(("Tahap 2 Timeout (Tidak Dipeluk)", sc["stage2_timeout"].get("text"), sc["stage2_timeout"].get("audio_file")))

        for stage_name, text, audio_file in tasks:
            if not text or not audio_file:
                continue

            target_path = os.path.join(output_dir, audio_file)
            print(f"\n* Menghasilkan audio untuk {stage_name}:")
            print(f"  Teks: \"{text[:70]}...\"")
            print(f"  Target: {target_path}")

            success = False
            if api_key and api_key.startswith("sk_"):
                success = generate_elevenlabs_audio(text, target_path, api_key, voice_id, model_id, language_code)

            if not success:
                print("  -> Mencoba fallback suara Bahasa Indonesia alami (Google Indonesian TTS)...")
                success = generate_fallback_google_id_audio(text, target_path)

            if not success:
                print("  -> Menjalankan fallback offline Windows SAPI...")
                generate_fallback_sapi_audio(text, target_path)

    print("\n" + "=" * 60)
    print("Pemrosesan audio skenario selesai!")
    print(f"Aset audio tersimpan di: {os.path.abspath(output_dir)}")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Generate audio skenario CareTech dengan ElevenLabs")
    parser.add_argument("--api-key", default=os.getenv("ELEVENLABS_API_KEY", ""), help="ElevenLabs API Key (sk_...)")
    parser.add_argument("--voice-id", default=DEFAULT_VOICE_ID, help=f"ElevenLabs Voice ID (default: {DEFAULT_VOICE_ID})")
    parser.add_argument("--model-id", default=DEFAULT_MODEL_ID, help=f"ElevenLabs Model ID (default: {DEFAULT_MODEL_ID})")
    parser.add_argument("--language-code", default="id", help="Kode bahasa ISO (default: id / Bahasa Indonesia)")
    parser.add_argument("--config", default=DEFAULT_CONFIG_PATH, help="Path ke scenarios.json")
    parser.add_argument("--output-dir", default=DEFAULT_OUTPUT_DIR, help="Direktori output audio")

    args = parser.parse_args()
    process_scenarios(args.config, args.output_dir, args.api_key, args.voice_id, args.model_id, args.language_code)


if __name__ == "__main__":
    main()
