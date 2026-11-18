/**
 * CareTech - User Profile Dropdown & Logout Handler
 * Cardboard Cosmos Theme
 * Supports Student and Guardian (Wali Murid) Roles
 */

function toggleProfileDropdown(event) {
    if (event) {
        event.stopPropagation();
    }
    const dropdown = document.querySelector('.profile-dropdown');
    const btn = document.querySelector('.avatar-btn');
    if (dropdown) {
        const isShown = dropdown.classList.toggle('show');
        if (btn) btn.setAttribute('aria-expanded', isShown);
    }
}

/**
 * Switch actively between demo roles seamlessly
 * @param {'student'|'guardian'} targetRole
 */
function switchDemoRole(targetRole) {
    if (targetRole === 'guardian') {
        localStorage.setItem('caretech_user_role', 'guardian');
        localStorage.setItem('caretech_user_name', 'Bpk. Hendra Wijaya');
        localStorage.setItem('caretech_student_name', 'Zuruki');
        localStorage.setItem('caretech_student_class', 'Kelas V-A // Harmonia');
        localStorage.setItem('caretech_guardian_relation', 'Ayah Kandung / Wali Murid');
        localStorage.setItem('caretech_guardian_phone', '0812-3456-7890');
        window.location.href = 'guardian.html';
    } else {
        localStorage.setItem('caretech_user_role', 'student');
        localStorage.setItem('caretech_user_name', 'Zuruki');
        localStorage.setItem('caretech_student_name', 'Zuruki');
        localStorage.setItem('caretech_student_class', 'Kelas V-A // Harmonia');
        window.location.href = 'dashboard.html';
    }
}

/**
 * Handle user logout across roles
 */
function handleLogout(event) {
    if (event) {
        event.preventDefault();
    }
    // Clear all session & role keys
    localStorage.removeItem('caretech_user_role');
    localStorage.removeItem('caretech_user_name');
    localStorage.removeItem('caretech_student_name');
    localStorage.removeItem('caretech_student_class');
    localStorage.removeItem('caretech_guardian_relation');
    localStorage.removeItem('caretech_guardian_phone');
    // Navigate to landing page
    window.location.href = 'index.html';
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const profile = document.querySelector('.user-profile');
    const dropdown = document.querySelector('.profile-dropdown');
    const btn = document.querySelector('.avatar-btn');
    if (dropdown && profile && !profile.contains(event.target)) {
        dropdown.classList.remove('show');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    }
});

// Close dropdown on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        const dropdown = document.querySelector('.profile-dropdown');
        const btn = document.querySelector('.avatar-btn');
        if (dropdown) {
            dropdown.classList.remove('show');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    }
});

/**
 * Global sidebar toggle handler for mobile
 */
if (typeof window.toggleSidebar !== 'function') {
    window.toggleSidebar = function () {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
    };
}

/**
 * Render dedicated Guardian sidebar without student game menus
 */
function renderGuardianSidebar() {
    const sidebar = document.querySelector('nav.sidebar');
    if (!sidebar) return;

    const currentPath = window.location.pathname.split('/').pop() || '';
    const isGuardianHome = currentPath === 'guardian.html' || currentPath === '';
    const isPenilaian = currentPath === 'penilaian.html';
    const isJurnal = currentPath === 'jurnal.html';
    const isChat = currentPath === 'chat.html';
    const isModul = currentPath === 'modul.html';
    const isVideo = currentPath === 'video.html';

    sidebar.innerHTML = `
        <div class="sidebar-header">
            <img src="assets/logo-care-tech.png" alt="CareTech Logo" class="sidebar-logo">
            <h2>CareTech</h2>
            <button class="sidebar-close-btn" onclick="toggleSidebar()" aria-label="Tutup Menu">✕</button>
        </div>
        
        <div class="sidebar-section">
            <span class="section-title">Menu Wali Murid</span>
            <ul class="sidebar-menu">
                <li class="menu-item ${isGuardianHome ? 'active' : ''}">
                    <a href="guardian.html">
                        <span class="icon">🏠</span>
                        <span class="text">Beranda Wali</span>
                    </a>
                </li>
                <li class="menu-item ${isPenilaian ? 'active' : ''}">
                    <a href="penilaian.html">
                        <span class="icon">📊</span>
                        <span class="text">Rapor Penilaian</span>
                    </a>
                </li>
                <li class="menu-item ${isJurnal ? 'active' : ''}">
                    <a href="jurnal.html">
                        <span class="icon">📓</span>
                        <span class="text">Jurnal Perasaan Anak</span>
                    </a>
                </li>
                <li class="menu-item ${isChat ? 'active' : ''}">
                    <a href="chat.html?role=guardian">
                        <span class="icon">🤖</span>
                        <span class="text">Konsultasi ESA AI</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="sidebar-section">
            <span class="section-title">Informasi &amp; Edukasi</span>
            <ul class="sidebar-menu">
                <li class="menu-item ${isModul ? 'active' : ''}">
                    <a href="modul.html">
                        <span class="icon">📚</span>
                        <span class="text">Modul Anti-Bullying</span>
                    </a>
                </li>
                <li class="menu-item ${isVideo ? 'active' : ''}">
                    <a href="video.html">
                        <span class="icon">🎬</span>
                        <span class="text">Video Edukasi</span>
                    </a>
                </li>
            </ul>
        </div>

        <div class="sidebar-section" style="margin-top: 0.8rem;">
            <span class="section-title">Peran</span>
            <ul class="sidebar-menu">
                <li class="menu-item">
                    <a href="javascript:void(0)" onclick="switchDemoRole('student')" title="Beralih ke tampilan akun siswa">
                        <span class="icon">🎒</span>
                        <span class="text">Tinjau Mode Siswa</span>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Sidebar Footer Sticker -->
        <div style="margin-top: auto; padding-top: 1.5rem; text-align: center;">
            <p class="tape tape-white" style="font-size: 0.85rem; margin-bottom: 0;">By Carelix, 2026</p>
        </div>
    `;
}

// Synchronize profile information & role in the dropdown
document.addEventListener('DOMContentLoaded', function () {
    const role = localStorage.getItem('caretech_user_role') || 'student';
    const userName = localStorage.getItem('caretech_user_name') || (role === 'guardian' ? 'Bpk. Hendra Wijaya' : 'Zuruki');
    const studentName = localStorage.getItem('caretech_student_name') || 'Zuruki';

    // Update Dropdown Tape (Role Badge)
    const tapeElements = document.querySelectorAll('.dropdown-tape');
    tapeElements.forEach(tape => {
        if (role === 'guardian') {
            tape.textContent = 'AKUN WALI MURID';
            tape.classList.remove('tape-lime');
            tape.classList.add('tape-pink');
        } else {
            tape.textContent = 'AKUN SISWA';
            tape.classList.remove('tape-pink');
            tape.classList.add('tape-lime');
        }
    });

    // Update Display Name
    const nameElements = document.querySelectorAll('.dropdown-student-name');
    nameElements.forEach(el => {
        el.textContent = (role === 'guardian') ? userName : studentName;
    });

    // Update Meta Information
    const metaElements = document.querySelectorAll('.dropdown-student-meta');
    metaElements.forEach(el => {
        if (role === 'guardian') {
            el.textContent = `Wali dari ${studentName} (Kelas V-A)`;
        } else {
            el.textContent = 'Kelas V-A // Harmonia';
        }
    });

    // Inject or update Role Switcher Link inside .profile-dropdown
    const dropdown = document.querySelector('.profile-dropdown');
    if (dropdown) {
        let switchItem = dropdown.querySelector('.role-switch-item');
        if (!switchItem) {
            switchItem = document.createElement('a');
            switchItem.className = 'profile-dropdown-item role-switch-item';
            switchItem.href = 'javascript:void(0)';
            
            const divider = dropdown.querySelector('.profile-dropdown-divider');
            if (divider) {
                dropdown.insertBefore(switchItem, divider);
            } else {
                dropdown.appendChild(switchItem);
            }
        }

        if (role === 'guardian') {
            switchItem.innerHTML = `<span>🎒</span><span>Ganti ke Akun Siswa</span>`;
            switchItem.onclick = function() { switchDemoRole('student'); };
            switchItem.title = 'Beralih melihat CareTech sebagai Zuruki';
        } else {
            switchItem.innerHTML = `<span>👨‍👩‍👧</span><span>Ganti ke Akun Wali</span>`;
            switchItem.onclick = function() { switchDemoRole('guardian'); };
            switchItem.title = 'Beralih melihat CareTech sebagai Wali Murid';
        }
    }

    // If logged in as guardian, render guardian sidebar and helper elements
    if (role === 'guardian') {
        renderGuardianSidebar();

        // Show a helpful preview & return banner on non-guardian pages
        const isGuardianPage = window.location.pathname.endsWith('guardian.html');
        const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('index.html');
        if (!isGuardianPage && !isLoginPage) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent && !document.getElementById('guardian-preview-banner')) {
                const banner = document.createElement('div');
                banner.id = 'guardian-preview-banner';
                banner.style.cssText = 'background: #fffde6; border: 3px solid var(--ink, #18181b); border-radius: 12px; box-shadow: 4px 4px 0 var(--ink, #18181b); padding: 0.7rem 1.2rem; margin: 1rem 1.2rem 0.6rem 1.2rem; font-family: var(--mono, monospace); font-size: 0.9rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.6rem; z-index: 10;';
                banner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.2rem;">👨‍👩‍👧</span>
                        <span><strong>Mode Wali Murid:</strong> Anda sedang meninjau materi/halaman siswa sebagai <strong>${userName}</strong> (Wali dari Zuruki).</span>
                    </div>
                    <a href="guardian.html" class="btn btn-small" style="background: var(--pink, #ff2e93); color: #ffffff; text-decoration: none; padding: 0.35rem 0.85rem; font-size: 0.82rem; border-radius: 8px; white-space: nowrap;">
                        ← Kembali ke Portal Wali
                    </a>
                `;

                const topHeader = mainContent.querySelector('.top-header');
                if (topHeader && topHeader.nextSibling) {
                    mainContent.insertBefore(banner, topHeader.nextSibling);
                } else {
                    mainContent.insertBefore(banner, mainContent.firstChild);
                }
            }
        }
    }
});
