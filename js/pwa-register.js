/**
 * CareTech PWA Registration & Install Handler
 * Cardboard Cosmos PWA Integration
 */
(function () {
    'use strict';

    // 1. Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('./sw.js', { scope: './' })
                .then((registration) => {
                    console.log('[CareTech PWA] Service Worker registered with scope:', registration.scope);

                    // Check for updates
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing;
                        if (!installingWorker) return;

                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('[CareTech PWA] Konten baru tersedia! Siap diperbarui saat restart.');
                                    window.dispatchEvent(new CustomEvent('caretech:pwa-updated'));
                                } else {
                                    console.log('[CareTech PWA] Konten berhasil di-cache untuk penggunaan offline.');
                                }
                            }
                        };
                    };
                })
                .catch((error) => {
                    console.warn('[CareTech PWA] Service Worker registration failed:', error);
                });
        });
    }

    // 2. Install Prompt Handler (A2HS - Add To Home Screen)
    let deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default mini-infobar in mobile Chrome
        e.preventDefault();
        deferredPrompt = e;
        console.log('[CareTech PWA] beforeinstallprompt event captured.');

        // Dispatch custom event for UI components that want to show an "Install App" button
        window.dispatchEvent(new CustomEvent('caretech:pwa-installable'));

        // Automatically wire up any button with attribute [data-pwa-install] or class .pwa-install-btn
        const installBtns = document.querySelectorAll('[data-pwa-install], .pwa-install-btn');
        installBtns.forEach((btn) => {
            btn.style.display = 'inline-flex';
            btn.addEventListener('click', promptInstall);
        });
    });

    // Global helper function to trigger installation from anywhere
    window.installCareTechPWA = function () {
        if (!deferredPrompt) {
            console.log('[CareTech PWA] Install prompt not available or already installed.');
            return false;
        }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('[CareTech PWA] User accepted the install prompt.');
            } else {
                console.log('[CareTech PWA] User dismissed the install prompt.');
            }
            deferredPrompt = null;
        });
        return true;
    };

    function promptInstall(e) {
        if (e && e.preventDefault) e.preventDefault();
        window.installCareTechPWA();
    }

    // 3. Post-install event
    window.addEventListener('appinstalled', () => {
        console.log('[CareTech PWA] CareTech berhasil diinstal di perangkat.');
        deferredPrompt = null;
        window.dispatchEvent(new CustomEvent('caretech:pwa-installed'));
    });
})();
