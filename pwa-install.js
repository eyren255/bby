// PWA Installation Handler
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = document.getElementById('installPwaBtn');
        this.init();
    }

    init() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt fired');
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show the install button
            this.showInstallButton();
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', (evt) => {
            console.log('App was installed');
            this.hideInstallButton();
            this.showInstallSuccess();
        });

        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('App is already installed');
            this.hideInstallButton();
        }

        // Add click event to install button
        if (this.installButton) {
            this.installButton.addEventListener('click', () => {
                this.installPWA();
            });
        }

        // iOS specific installation guidance
        this.checkIOSInstallation();
    }

    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'inline-flex';
            this.installButton.classList.add('pulse');
        }
    }

    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.display = 'none';
            this.installButton.classList.remove('pulse');
        }
    }

    async installPWA() {
        if (this.deferredPrompt) {
            // Show the install prompt
            this.deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            // Clear the deferredPrompt
            this.deferredPrompt = null;
            // Hide the install button
            this.hideInstallButton();
        } else {
            // Fallback for iOS or when prompt is not available
            this.showIOSInstructions();
        }
    }

    checkIOSInstallation() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        
        if (isIOS && !isStandalone) {
            // Show iOS specific installation instructions
            this.showIOSInstructions();
        }
    }

    showIOSInstructions() {
        const instructions = `
            <div class="ios-install-modal">
                <div class="ios-install-content">
                    <h3>📱 Install App on iOS</h3>
                    <p>To install this app on your iPhone or iPad:</p>
                    <ol>
                        <li>Tap the <strong>Share</strong> button <span style="font-size: 1.2em;">📤</span></li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                        <li>Tap <strong>"Add"</strong> to confirm</li>
                    </ol>
                    <button class="ios-install-close">Got it! 💕</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', instructions);
        
        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .ios-install-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease-in;
            }
            
            .ios-install-content {
                background: linear-gradient(135deg, #ff69b4, #ff1493);
                color: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 400px;
                margin: 20px;
                text-align: center;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .ios-install-content h3 {
                margin: 0 0 20px 0;
                font-size: 1.5em;
            }
            
            .ios-install-content ol {
                text-align: left;
                margin: 20px 0;
                padding-left: 20px;
            }
            
            .ios-install-content li {
                margin: 10px 0;
                line-height: 1.5;
            }
            
            .ios-install-close {
                background: white;
                color: #ff69b4;
                border: none;
                padding: 12px 24px;
                border-radius: 25px;
                font-size: 1.1em;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
                transition: transform 0.2s;
            }
            
            .ios-install-close:hover {
                transform: scale(1.05);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Add close functionality
        document.querySelector('.ios-install-close').addEventListener('click', () => {
            document.querySelector('.ios-install-modal').remove();
        });
    }

    showInstallSuccess() {
        const successMessage = `
            <div class="install-success">
                <div class="success-content">
                    <h3>🎉 App Installed Successfully!</h3>
                    <p>Your love app is now ready to use! 💕</p>
                    <div class="success-heart">💖</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successMessage);
        
        // Add styles for success message
        const style = document.createElement('style');
        style.textContent = `
            .install-success {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                animation: slideIn 0.5s ease-out;
            }
            
            .success-content {
                text-align: center;
            }
            
            .success-heart {
                font-size: 2em;
                margin-top: 10px;
                animation: pulse 1s infinite;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            const successElement = document.querySelector('.install-success');
            if (successElement) {
                successElement.remove();
            }
        }, 3000);
    }

    // Check if PWA is installable
    isInstallable() {
        return this.deferredPrompt !== null;
    }

    // Get installation status
    getInstallationStatus() {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        return {
            isInstalled: isStandalone,
            isIOS: isIOS,
            canInstall: this.isInstallable()
        };
    }
}

// Initialize PWA installer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaInstaller = new PWAInstaller();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAInstaller;
} 