/**
 * CareTech - User Profile Dropdown & Logout Handler
 * Cardboard Cosmos Theme
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

function handleLogout(event) {
    // Clear student session
    localStorage.removeItem('caretech_student_name');
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

// Synchronize student name from localStorage
document.addEventListener('DOMContentLoaded', function () {
    const storedName = localStorage.getItem('caretech_student_name');
    if (storedName) {
        const nameElements = document.querySelectorAll('.dropdown-student-name');
        nameElements.forEach(el => {
            el.textContent = storedName;
        });
    }
});
