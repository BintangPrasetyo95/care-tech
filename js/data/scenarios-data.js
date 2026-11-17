/**
 * CareTech Robot ESA - Hardcoded Scenarios Registry
 * Menyediakan konfigurasi skenario terstruktur dengan audio ElevenLabs siap pakai.
 * Versi 1.1.0 - Bebas Emoji, Ringkas, Empatik, dan Proporsional.
 */

const CARETECH_SCENARIOS = {
    "sedih_hug": {
        id: "sedih_hug",
        title: "Dukungan Saat Sedih",
        keywords: [
            "sedih", "lagi sedih", "saya lagi sedih", "aku lagi sedih",
            "nangis", "menangis", "terpuruk", "kecewa", "down", "hancur",
            "patah hati", "galau", "berduka", "sakit hati", "bad day",
            "murung", "putus asa", "ngerasa sendiri", "merasa sendiri",
            "pengen nangis", "mau nangis", "tak berdaya", "hampa", "sesak",
            "sedih bgt", "sedih banget"
        ],
        stage1: {
            text: "Pasti berat banget ya rasanya... Sini peluk boneka dulu kawan, biar kamu merasa lebih tenang.",
            audioUrl: "assets/audio/hardcoded/sedih_stage1_offer.mp3",
            robotMood: "empathy"
        },
        action: {
            type: "hug_or_hold",
            requiredDurationMs: 2000,
            timeoutMs: 30000,
            description: "Peluk boneka atau genggam tangannya selama minimal 2 detik"
        },
        stage2_success: {
            text: "Terima kasih pelukannya... Rasanya hangat sekali. Kalau kamu mau cerita, aku siap mendengarkan ya.",
            audioUrl: "assets/audio/hardcoded/sedih_stage2_hugged.mp3",
            robotMood: "comforted"
        },
        stage2_timeout: {
            text: "Nggak apa-apa kok kalau belum mau peluk. Kamu aman di sini, pelan-pelan saja ya.",
            audioUrl: "assets/audio/hardcoded/sedih_stage2_timeout.mp3",
            robotMood: "idle"
        }
    },

    "marah_breathe": {
        id: "marah_breathe",
        title: "Menenangkan Amarah",
        keywords: [
            "marah", "lagi marah", "saya lagi marah", "aku lagi marah",
            "murka", "emosi", "jengkel", "kesal", "kesel", "benci",
            "benci banget", "benci bgt", "kesel banget", "kesel bgt",
            "jengkel bgt", "naik darah", "mau meledak", "muak", "gak adil",
            "dendam", "pengen ngamuk", "pengen teriak"
        ],
        stage1: {
            text: "Aku tahu kamu lagi kesal banget... Yuk tarik napas bareng aku dulu, genggam tanganku 4 detik ya.",
            audioUrl: "assets/audio/hardcoded/marah_stage1_offer.mp3",
            robotMood: "thinking"
        },
        action: {
            type: "breathe_hold",
            requiredDurationMs: 4000,
            timeoutMs: 30000,
            description: "Tahan tangan boneka selama 4 detik sambil menarik napas dalam"
        },
        stage2_success: {
            text: "Hembuskan pelan-pelan... Bagus. Kalau sudah lebih lega, ceritakan apa yang bikin kamu marah ya.",
            audioUrl: "assets/audio/hardcoded/marah_stage2_breathed.mp3",
            robotMood: "comforted"
        },
        stage2_timeout: {
            text: "Nggak apa-apa kawan. Tenangkan dirimu dulu ya, aku tetap temani di sini.",
            audioUrl: "assets/audio/hardcoded/marah_stage2_timeout.mp3",
            robotMood: "idle"
        }
    },

    "takut_hold_hand": {
        id: "takut_hold_hand",
        title: "Menenangkan Rasa Takut",
        keywords: [
            "takut", "lagi takut", "cemas", "gelisah", "khawatir",
            "was-was", "panik", "deg-degan", "degdegan", "gemetaran",
            "gemetar", "overthinking", "grogi", "parno", "takut banget",
            "takut bgt", "ngeri", "gak tenang", "takut gagal"
        ],
        stage1: {
            text: "Tenang kawan, kamu aman di sini... Coba genggam tanganku sebentar ya, biar rasa takutmu berkurang.",
            audioUrl: "assets/audio/hardcoded/takut_stage1_offer.mp3",
            robotMood: "thinking"
        },
        action: {
            type: "hold_hand",
            requiredDurationMs: 3000,
            timeoutMs: 30000,
            description: "Genggam erat tangan boneka selama minimal 3 detik"
        },
        stage2_success: {
            text: "Genggamanmu hangat kawan... Apapun yang bikin kamu cemas, kita hadapi bareng-bareng ya.",
            audioUrl: "assets/audio/hardcoded/takut_stage2_held.mp3",
            robotMood: "comforted"
        },
        stage2_timeout: {
            text: "Tidak apa-apa kawan. Ingat ya, kamu aman dan tidak sendirian di sini.",
            audioUrl: "assets/audio/hardcoded/takut_stage2_timeout.mp3",
            robotMood: "idle"
        }
    },

    "lelah_pat": {
        id: "lelah_pat",
        title: "Istirahat Saat Lelah",
        keywords: [
            "lelah", "capek", "penat", "letih", "lemas", "lemes",
            "pusing", "burnout", "overwhelmed", "terkuras", "drop",
            "capek hati", "capek mental", "capek bgt", "capek banget",
            "lelah bgt", "lelah banget", "gak sanggup lagi", "gak kuat lagi",
            "berat banget", "berat bgt", "pengen rebahan", "pengen istirahat"
        ],
        stage1: {
            text: "Hari ini pasti melelahkan ya... Boleh elus kepalaku sebentar kawan, anggap hadiah buat dirimu sendiri.",
            audioUrl: "assets/audio/hardcoded/lelah_stage1_offer.mp3",
            robotMood: "empathy"
        },
        action: {
            type: "pat_head",
            requiredDurationMs: 2000,
            timeoutMs: 30000,
            description: "Elus lembut kepala atau tangan boneka selama minimal 2 detik"
        },
        stage2_success: {
            text: "Terima kasih kawan... Kamu sudah berjuang hebat hari ini. Istirahat sejenak yuk.",
            audioUrl: "assets/audio/hardcoded/lelah_stage2_patted.mp3",
            robotMood: "idle"
        },
        stage2_timeout: {
            text: "Tarik napas dan rileks ya kawan. Istirahatlah, kamu berhak rehat hari ini.",
            audioUrl: "assets/audio/hardcoded/lelah_stage2_timeout.mp3",
            robotMood: "idle"
        }
    },

    "bahagia_highfive": {
        id: "bahagia_highfive",
        title: "Merayakan Keberhasilan",
        keywords: [
            "senang", "bahagia", "gembira", "berhasil", "sukses",
            "bangga", "lega", "bersyukur", "hore", "yey", "yes",
            "alhamdulillah", "menang", "juara", "seru banget", "seru bgt",
            "seneng bgt", "senang banget", "asyik", "mantap", "keren",
            "dapet nilai bagus"
        ],
        stage1: {
            text: "Wah, senangnya dengar kabar itu! Keren banget kawan, yuk tos bareng aku!",
            audioUrl: "assets/audio/hardcoded/bahagia_stage1_offer.mp3",
            robotMood: "happy"
        },
        action: {
            type: "high_five",
            requiredDurationMs: 1000,
            timeoutMs: 30000,
            description: "Tepuk atau tekan tangan boneka sekali untuk tos"
        },
        stage2_success: {
            text: "Tos mantap! Aku ikut bangga sama kamu kawan. Ceritakan dong momen serunya!",
            audioUrl: "assets/audio/hardcoded/bahagia_stage2_fived.mp3",
            robotMood: "happy"
        },
        stage2_timeout: {
            text: "Selamat ya kawan! Semoga rasa bahagia ini menemani harimu terus!",
            audioUrl: "assets/audio/hardcoded/bahagia_stage2_timeout.mp3",
            robotMood: "idle"
        }
    },

    "sapaan_checkin": {
        id: "sapaan_checkin",
        title: "Sapaan Hangat",
        keywords: [
            "halo", "hai", "hello", "hei", "assalamualaikum", "salam",
            "selamat pagi", "selamat siang", "selamat sore", "selamat malam",
            "halo esa", "hai esa", "robot esa", "caretech", "care-tech",
            "apa kabar", "kamu siapa"
        ],
        stage1: {
            text: "Halo kawan! Senang bisa ketemu kamu lagi. Jabat tanganku sebentar yuk buat salam.",
            audioUrl: "assets/audio/hardcoded/sapaan_stage1_offer.mp3",
            robotMood: "happy"
        },
        action: {
            type: "handshake",
            requiredDurationMs: 1000,
            timeoutMs: 30000,
            description: "Sentuh tangan boneka selama 1 detik untuk salam"
        },
        stage2_success: {
            text: "Salam hangat kawan! Bagaimana kabarmu hari ini? Ada yang mau kamu ceritakan?",
            audioUrl: "assets/audio/hardcoded/sapaan_stage2_greeted.mp3",
            robotMood: "idle"
        },
        stage2_timeout: {
            text: "Aku selalu ada di sini ya kawan. Panggil aku kapan pun kamu butuh teman.",
            audioUrl: "assets/audio/hardcoded/sapaan_stage2_timeout.mp3",
            robotMood: "idle"
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
