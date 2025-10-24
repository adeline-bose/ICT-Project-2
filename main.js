// Main shared functionality
class ScrapSmartApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.setActiveNavLink();
    }

    setupNavigation() {
        // Set active navigation based on current page
        this.setActiveNavLink();
    }

    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            // Set active nav link on page load
            this.setActiveNavLink();
            
            // Add loading states to buttons
            this.setupButtonLoadingStates();
        });

        // Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });
    }

    setActiveNavLink() {
        const currentPage = this.getCurrentPage();
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPage = link.getAttribute('href').replace('.html', '');
            if (linkPage === currentPage || (currentPage === 'index' && linkPage === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page === '' ? 'index' : page;
    }

    setupButtonLoadingStates() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('button[type="submit"]') || e.target.closest('button[type="submit"]')) {
                const button = e.target.matches('button') ? e.target : e.target.closest('button');
                this.showButtonLoading(button);
            }
        });
    }

    showButtonLoading(button) {
        const originalText = button.innerHTML;
        button.innerHTML = `
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Loading...
        `;
        button.disabled = true;

        // Reset after 2 seconds (simulate API call)
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }

    handleEscapeKey() {
        // Close modals or go back in history
        if (window.location.pathname.includes('details.html')) {
            window.history.back();
        }
    }

    // Utility methods
    formatPrice(amount, currency = '$') {
        return `${currency}${amount.toLocaleString()}`;
    }

    formatWeight(weight, unit = 'kg') {
        return `${weight}${unit}`;
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification fixed top-4 right-4 p-4 rounded-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        } text-white shadow-lg`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getNotificationIcon(type)} mr-2"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Local storage helpers
    setStorage(key, value) {
        try {
            localStorage.setItem(`scrapsmart_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('Local storage not available');
        }
    }

    getStorage(key) {
        try {
            const item = localStorage.getItem(`scrapsmart_${key}`);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Local storage not available');
            return null;
        }
    }

    removeStorage(key) {
        try {
            localStorage.removeItem(`scrapsmart_${key}`);
        } catch (e) {
            console.warn('Local storage not available');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrapSmartApp = new ScrapSmartApp();
});