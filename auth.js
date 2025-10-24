// Authentication page functionality
class AuthPage {
    constructor() {
        this.currentView = 'welcome';
        this.userType = 'buyer';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showView('welcome');
    }

    setupEventListeners() {
        // User type selection
        document.querySelectorAll('.user-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.userType = btn.getAttribute('data-type');
                this.showView('signup');
            });
        });

        // Navigation between auth views
        document.querySelectorAll('.auth-nav').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                this.showView(view);
            });
        });

        // Form submissions
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
    }

    showView(view) {
        this.currentView = view;
        
        // Hide all views
        document.querySelectorAll('.auth-view').forEach(view => {
            view.classList.remove('active-page');
        });

        // Show selected view
        const targetView = document.getElementById(`${view}View`);
        if (targetView) {
            targetView.classList.add('active-page');
        }

        // Update form titles based on user type
        if (view === 'signup') {
            this.updateSignupTitle();
        }
    }

    updateSignupTitle() {
        const title = document.getElementById('signupTitle');
        if (title) {
            title.textContent = `Sign up as ${this.userType === 'seller' ? 'Seller' : 'Buyer'}`;
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // In a real app, this would make an API call
        console.log('Login attempt:', data);
        window.scrapSmartApp.showNotification('Login successful!', 'success');
        
        // Redirect based on user type (simulated)
        setTimeout(() => {
            if (data.email.includes('seller')) {
                window.scrapSmartApp.showPage('seller');
            } else {
                window.scrapSmartApp.showPage('listings');
            }
        }, 1000);
    }

    handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        data.userType = this.userType;

        // In a real app, this would make an API call
        console.log('Signup attempt:', data);
        this.showView('confirmation');
    }

    handleConfirmation() {
        // In a real app, this would verify the confirmation code
        window.scrapSmartApp.showNotification('Account verified successfully!', 'success');
        
        setTimeout(() => {
            if (this.userType === 'seller') {
                window.scrapSmartApp.showPage('seller');
            } else {
                window.scrapSmartApp.showPage('listings');
            }
        }, 1500);
    }
}

// Initialize auth page when it becomes active
window.addEventListener('pageChanged', (event) => {
    if (event.detail.page === 'auth') {
        new AuthPage();
    }
});