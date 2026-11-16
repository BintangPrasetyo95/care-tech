/**
 * CareTech Robot ESA - Hardcoded Scenarios Registry
 * Menyediakan konfigurasi skenario terstruktur dengan audio ElevenLabs siap pakai.
 */

const CARETECH_SCENARIOS = {
    "sedih_hug": {
        id: "sedih_hug",
        title: "Comfort Hug (Pelukan Penenang Saat Sedih)",
        keywords: [
            "sedih", "lagi sedih", "saya lagi sedih", "aku lagi sedih",
            "nangis", "menangis", "terpuruk", "kecewa", "down", "hancur",
            "patah hati", "galau", "berduka", "sakit hati", "bad day",
            "capek bgt", "lelah bgt", "capek banget", "lelah banget",
            "murung", "putus asa", "ngerasa sendiri", "merasa sendiri",
            "pengen nangis", "mau nangis", "tak berdaya", "hampa", "sesak"
        ],
        stage1: {
            text: "Aku di sini ya kawan... Makasih sudah mau bilang ke aku, pasti berat banget rasanya. Kalau kamu mau, boleh tolong peluk boneka atau genggam tanganku 2 detik ya? Aku ingin temani kamu.",
            audioUrl: "assets/audio/hardcoded/sedih_stage1_offer.mp3",
            robotMood: "happy",
            robotIcon: "🥺"
        },
        action: {
            type: "hug_or_hold",
            requiredDurationMs: 2000,
            timeoutMs: 30000,
            description: "Peluk boneka atau genggam tangannya selama minimal 2 detik"
        },
        stage2_success: {
            text: "Terima kasih atas pelukan hangatnya kawan... Rasanya nyaman sekali. Sekarang, aku siap mendengarkan ceritamu jika kamu ingin cerita. Pelan-pelan saja ya.",
            audioUrl: "assets/audio/hardcoded/sedih_stage2_hugged.mp3",
            robotMood: "comforted",
            robotIcon: "🤗"
        },
        stage2_timeout: {
            text: "Nggak apa-apa kalau kamu belum siap memeluk kawan, aku tetap temani di sini ya. Pelan-pelan aja kalau mau cerita, aku siap mendengarkan.",
            audioUrl: "assets/audio/hardcoded/sedih_stage2_timeout.mp3",
            robotMood: "idle",
            robotIcon: "🤖"
        }
    }
};

/**
 * Mencari skenario hardcode berdasarkan teks input pengguna.
 * @param {string} text 
 * @returns {object|null} Skenario yang cocok atau null jika tidak ada yang cocok.
 */
function findMatchingScenario(text) {
    if (!text || typeof text !== 'string') return null;
    const lower = text.toLowerCase();
    
    for (const key in CARETECH_SCENARIOS) {
        const scenario = CARETECH_SCENARIOS[key];
        if (scenario.keywords && scenario.keywords.some(k => lower.includes(k.toLowerCase()))) {
            return scenario;
        }
    }
    return null;
}

// Ekspor untuk browser global & Node/ESM module jika didukung
if (typeof window !== 'undefined') {
    window.CARETECH_SCENARIOS = CARETECH_SCENARIOS;
    window.findMatchingScenario = findMatchingScenario;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CARETECH_SCENARIOS, findMatchingScenario };
}
