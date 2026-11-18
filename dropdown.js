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
});
