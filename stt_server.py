"""
CareTech - Whisper Turbo Local STT Server
Menyediakan REST API transkripsi suara akurasi tinggi menggunakan model Whisper Large-V3-Turbo.
100% Offline & Lokal di Laptop Anda.
"""

import os
import sys
import tempfile
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import whisper
import torch
import uvicorn

app = FastAPI(title="CareTech Whisper Turbo Local Server", version="1.0.0")

# Izinkan CORS dari semua origin (chat.html / localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
MODEL_NAME = "turbo"
model = None

def get_whisper():
    global model
    if model is None:
        print(f"[STT Server] Memuat model Whisper '{MODEL_NAME}' pada perangkat '{DEVICE}'...", flush=True)
        model = whisper.load_model(MODEL_NAME, device=DEVICE)
        print(f"[STT Server] Model Whisper '{MODEL_NAME}' berhasil dimuat dan siap melayani!", flush=True)
    return model

@app.get("/")
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "model": "large-v3-turbo",
        "device": DEVICE,
        "cuda": torch.cuda.is_available(),
        "loaded": model is not None
    }

@app.post("/transcribe")
def transcribe_audio(
    file: UploadFile = File(...),
    language: str = Form("id")
):
    try:
        active_model = get_whisper()
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".wav"
        if not suffix:
            suffix = ".wav"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp_path = tmp.name
            shutil.copyfileobj(file.file, tmp)

        try:
            result = active_model.transcribe(
                tmp_path,
                language=language if language else "id",
                task="transcribe"
            )
            raw_text = result.get("text", "").strip()
            return {
                "success": True,
                "text": raw_text,
                "language": result.get("language", language)
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    except Exception as e:
        print(f"[STT Server Error]: {e}", flush=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("=" * 60, flush=True)
    print("CareTech Local STT Server - Whisper Large-V3-Turbo", flush=True)
    print(f"Perangkat: {DEVICE.upper()} | Port: 8001", flush=True)
    print("Akses URL: http://127.0.0.1:8001/health", flush=True)
    print("=" * 60, flush=True)
    
    # Preload model di awal agar siap seketika saat ada audio
    get_whisper()

    uvicorn.run(app, host="127.0.0.1", port=8001, log_level="info")
