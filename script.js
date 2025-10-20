// Show / Hide Password
const togglePassword = document.querySelector('#togglePassword');
const passwordField = document.querySelector('#password');

if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });
}

// Form Submission
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state
        const loginBtn = document.querySelector('.login-btn .btn-text');
        const originalText = loginBtn.innerHTML;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        // Simulate login process
        setTimeout(() => {
            alert('Welcome to TourSet! Login successful.');
            loginBtn.innerHTML = originalText;
            // You can redirect to dashboard here
            // window.location.href = 'dashboard.html';
        }, 2000);
    });
}

// Google Login
const googleBtn = document.querySelector('.google-btn');
if (googleBtn) {
    googleBtn.addEventListener('click', function() {
        alert('Google Login integration would go here!');
    });
}

console.log('TourSet Login Page Initialized ✨');
