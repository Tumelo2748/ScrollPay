// ScrollPay™ - Revolutionary Content Access Technology
// Copyright 2025 ScrollPay Technologies Inc.

class ScrollPaySystem {
    constructor() {
        this.currentVisibleLines = 1;
        this.totalLines = 0;
        this.scrollPrice = 0.50;
        this.totalSpent = 0;
        this.freeScrollsRemaining = 4; // Start with 4 free scrolls on page load
        this.scrollsPerPayment = 10; // Give 10 scrolls after payment
        this.scrollingEnabled = true; // Start with scrolling enabled
        this.isFirstSession = true; // Track if this is the initial free session
        this.init();
    }

    init() {
        // Start with scrolling enabled for initial free scrolls
        this.disableScrolling(); // Set up event handlers but allow scrolling initially
        this.updateScrollState(); // Enable scrolling based on current state
        
        // Get all content lines
        this.contentLines = document.querySelectorAll('.content-line');
        this.totalLines = this.contentLines.length;
        
        // Set up payment button
        this.setupPaymentButton();
        
        // Initialize first line as visible
        this.updateContentVisibility();
        
        // Add analytics tracking (fake but professional)
        this.trackPageView();
        
        // Show professional loading sequence
        this.showLoadingSequence();
        
        // Initially hide the paywall since we start with free scrolls
        setTimeout(() => {
            const overlay = document.getElementById('scrollOverlay');
            overlay.style.display = 'none';
        }, 100);
    }

    disableScrolling() {
        // Prevent scroll wheel
        document.addEventListener('wheel', (e) => this.handleScroll(e), { passive: false });
        
        // Prevent keyboard scrolling
        document.addEventListener('keydown', (e) => this.handleKeyboardScroll(e), { passive: false });
        
        // Prevent touch scrolling on mobile
        document.addEventListener('touchmove', (e) => this.handleScroll(e), { passive: false });
        
        // Prevent scroll via space bar
        document.addEventListener('keyup', (e) => this.handleSpaceScroll(e), { passive: false });
        
        // Override any programmatic scrolling when disabled
        this.originalScrollTo = window.scrollTo;
        this.originalScroll = window.scroll;
        this.originalScrollBy = window.scrollBy;
        
        this.updateScrollState();
    }

    updateScrollState() {
        if (this.scrollingEnabled && this.freeScrollsRemaining > 0) {
            // Enable scrolling
            window.scrollTo = this.originalScrollTo;
            window.scroll = this.originalScroll;
            window.scrollBy = this.originalScrollBy;
            document.body.style.overflowY = 'auto';
            this.updateScrollCounter();
        } else {
            // Disable scrolling
            window.scrollTo = () => {};
            window.scroll = () => {};
            window.scrollBy = () => {};
            document.body.style.overflowY = 'hidden';
            this.hideScrollCounter();
        }
    }

    handleScroll(e) {
        if (this.scrollingEnabled && this.freeScrollsRemaining > 0) {
            // Allow this scroll and decrement counter
            this.freeScrollsRemaining--;
            this.updateScrollCounter();
            
            if (this.freeScrollsRemaining <= 0) {
                this.scrollingEnabled = false;
                this.updateScrollState();
                this.showPaywallAgain();
            }
            return true;
        } else {
            return this.preventScroll(e);
        }
    }

    handleKeyboardScroll(e) {
        const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
        if (scrollKeys.includes(e.keyCode)) {
            return this.handleScroll(e);
        }
    }

    handleSpaceScroll(e) {
        if (e.keyCode === 32) {
            return this.handleScroll(e);
        }
    }

    preventScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Show the paywall overlay with animation
        const overlay = document.getElementById('scrollOverlay');
        overlay.style.transform = 'translateY(0)';
        overlay.style.background = 'linear-gradient(to top, rgba(220, 38, 38, 0.95), rgba(239, 68, 68, 0.8))';
        
        // Shake effect to emphasize the block
        overlay.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            overlay.style.animation = '';
            overlay.style.background = 'linear-gradient(to top, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.8))';
        }, 500);
        
        return false;
    }

    showPaywallAgain() {
        const overlay = document.getElementById('scrollOverlay');
        overlay.style.display = 'block';
        overlay.style.transform = 'translateY(0)';
        
        // Reset payment button state
        const paymentButton = document.getElementById('paymentButton');
        if (this.isFirstSession) {
            paymentButton.textContent = `Unlock Scrolling + ${this.scrollsPerPayment} Credits ($${this.scrollPrice.toFixed(2)})`;
        } else {
            paymentButton.textContent = `Reload ${this.scrollsPerPayment} Scroll Credits ($${this.scrollPrice.toFixed(2)})`;
        }
        paymentButton.disabled = false;
        paymentButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Update the message to be more annoying
        const paywallTitle = overlay.querySelector('.paywall-title');
        const paywallDesc = overlay.querySelector('.paywall-description');
        
        if (this.isFirstSession) {
            paywallTitle.textContent = 'Free Trial Expired!';
            paywallDesc.textContent = 'Thanks for trying our premium scroll technology! Continue with full access.';
        } else {
            paywallTitle.textContent = 'Scroll Credits Expired!';
            paywallDesc.textContent = 'Your premium scroll session has ended. Purchase more scroll credits to continue reading.';
        }
        
        // Add a subtle pulsing animation to grab attention
        overlay.style.animation = 'pulse 2s infinite';
        
        setTimeout(() => {
            overlay.style.animation = '';
            paywallTitle.textContent = 'Premium Scroll Access Required';
            paywallDesc.textContent = 'Continue reading with our revolutionary pay-per-scroll technology';
        }, 3000);
    }

    updateScrollCounter() {
        let counter = document.getElementById('scrollCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'scrollCounter';
            counter.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 1rem;
                border-radius: 10px;
                font-weight: bold;
                z-index: 1001;
                box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
                border: 2px solid rgba(255, 255, 255, 0.2);
                min-width: 200px;
                text-align: center;
            `;
            document.body.appendChild(counter);
        }
        
        counter.innerHTML = `
            <div style="font-size: 0.9rem; opacity: 0.9; margin-bottom: 0.5rem;">📜 ${this.isFirstSession ? 'Free Trial' : 'Scroll Credits'}</div>
            <div style="font-size: 1.5rem;">${this.freeScrollsRemaining}</div>
            <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.5rem;">actions remaining</div>
            <div style="font-size: 0.7rem; opacity: 0.6; margin-top: 0.25rem;">wheel • keys • scrollbar</div>
        `;
        
        // Add warning color when low
        if (this.freeScrollsRemaining <= 1) {
            counter.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            counter.style.animation = 'warning-pulse 1s infinite';
        }
    }

    hideScrollCounter() {
        const counter = document.getElementById('scrollCounter');
        if (counter) {
            counter.style.transform = 'translateX(250px)';
            counter.style.opacity = '0';
            setTimeout(() => counter.remove(), 300);
        }
    }

    setupPaymentButton() {
        const paymentButton = document.getElementById('paymentButton');
        paymentButton.addEventListener('click', () => this.processPayment());
        
        // Update button text with current pricing
        this.updatePaymentUI();
    }

    updatePaymentUI() {
        const paymentButton = document.getElementById('paymentButton');
        const remainingLines = this.totalLines - this.currentVisibleLines;
        
        if (remainingLines > 0) {
            if (this.scrollingEnabled && this.freeScrollsRemaining > 0) {
                // User has active scroll credits - hide the overlay
                const overlay = document.getElementById('scrollOverlay');
                overlay.style.transform = 'translateY(100%)';
                overlay.style.display = 'none';
            } else {
                // Show payment option
                const overlay = document.getElementById('scrollOverlay');
                overlay.style.display = 'block';
                overlay.style.transform = 'translateY(0)';
                
                paymentButton.textContent = `Unlock Next Line + ${this.scrollsPerPayment} Scrolls ($${this.scrollPrice.toFixed(2)})`;
                paymentButton.disabled = false;
                paymentButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            }
        } else {
            paymentButton.textContent = 'All Content Unlocked!';
            paymentButton.disabled = true;
            paymentButton.style.background = '#10b981';
            
            // Hide overlay when done
            setTimeout(() => {
                const overlay = document.getElementById('scrollOverlay');
                overlay.style.transform = 'translateY(100%)';
                overlay.style.display = 'none';
            }, 2000);
        }
    }

    async simulatePaymentGateway() {
        // Realistic payment processing simulation
        const steps = [
            'Validating payment method...',
            'Contacting payment gateway...',
            'Processing transaction...',
            'Verifying funds...',
            'Authorizing purchase...',
            'Finalizing transaction...'
        ];
        
        const button = document.getElementById('paymentButton');
        
        for (let i = 0; i < steps.length; i++) {
            button.innerHTML = `<span>🔄</span> ${steps[i]}`;
            await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
        }
    }

    async processPayment() {
        const button = document.getElementById('paymentButton');
        
        // Professional loading state
        button.innerHTML = '<span>🔄</span> Processing Payment...';
        button.disabled = true;
        
        // Simulate payment processing with realistic delay
        await this.simulatePaymentGateway();
        
        // Success animation
        button.innerHTML = '<span>✅</span> Payment Successful!';
        button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Update analytics
        this.totalSpent += this.scrollPrice;
        this.trackPurchase();
        
        // Grant free scrolls (and unlock line for first session)
        setTimeout(() => {
            if (this.isFirstSession) {
                this.unlockNextLine(); // Only unlock line on first payment
                this.isFirstSession = false; // Mark that free trial is over
            }
            this.grantFreeScrolls();
            this.updatePaymentUI();
        }, 1500);
    }

    grantFreeScrolls() {
        this.freeScrollsRemaining = this.scrollsPerPayment;
        this.scrollingEnabled = true;
        this.updateScrollState();
        
        // Hide the paywall overlay completely
        const overlay = document.getElementById('scrollOverlay');
        overlay.style.transform = 'translateY(100%)';
        overlay.style.display = 'none';
        
        // Show celebration message
        this.showScrollGrantedMessage();
    }

    showScrollGrantedMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 20px 40px rgba(16, 185, 129, 0.4);
            animation: celebrationBounce 0.6s ease-out;
        `;
        
        message.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <h3 style="margin-bottom: 0.5rem;">Scroll Credits Granted!</h3>
            <p style="margin-bottom: 1rem;">You now have ${this.scrollsPerPayment} free scrolls to enjoy the content!</p>
            <div style="font-size: 0.9rem; opacity: 0.9;">
                ⚡ Scroll freely while credits last<br>
                📊 Check your remaining credits in the top-right corner
            </div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }

    updateContentVisibility() {
        this.contentLines.forEach((line, index) => {
            if (index < this.currentVisibleLines) {
                line.classList.remove('hidden');
                line.classList.add('visible');
            } else {
                line.classList.remove('visible');
                line.classList.add('hidden');
            }
        });
    }

    showUnlockCelebration(element) {
        // Create confetti effect for unlocked line
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉';
        celebration.style.position = 'absolute';
        celebration.style.fontSize = '2rem';
        celebration.style.animation = 'confetti 1s ease-out';
        celebration.style.pointerEvents = 'none';
        celebration.style.zIndex = '1000';
        
        element.style.position = 'relative';
        element.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 1000);
    }

    showLoadingSequence() {
        // Professional loading overlay
        const loader = document.createElement('div');
        loader.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        display: flex; flex-direction: column; justify-content: center; 
                        align-items: center; z-index: 10000; color: white;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📜</div>
                <h2 style="margin-bottom: 1rem;">ScrollPay™</h2>
                <div style="margin-bottom: 2rem;">Initializing Premium Content Access...</div>
                <div class="loading-bar" style="width: 300px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden;">
                    <div style="width: 0%; height: 100%; background: white; border-radius: 2px; animation: loadProgress 3s ease-out forwards;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(loader);
        
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s ease';
            setTimeout(() => loader.remove(), 500);
        }, 3000);
    }

    // Analytics tracking (fake but professional)
    trackPageView() {
        console.log('📊 ScrollPay Analytics: Page view tracked');
        console.log(`📊 User session started - Content lines available: ${this.totalLines}`);
    }

    unlockNextLine() {
        if (this.currentVisibleLines < this.totalLines) {
            this.currentVisibleLines++;
            this.updateContentVisibility();
            
            // Smooth reveal animation
            const newLine = this.contentLines[this.currentVisibleLines - 1];
            newLine.style.animation = 'fadeInUp 0.8s ease-out';
            
            // Celebration effect for line unlock
            this.showUnlockCelebration(newLine);
        }
    }

    trackPurchase() {
        console.log(`📊 ScrollPay Analytics: Purchase completed - $${this.scrollPrice.toFixed(2)}`);
        console.log(`📊 Total spent this session: $${this.totalSpent.toFixed(2)}`);
        console.log(`📊 Lines unlocked: ${this.currentVisibleLines}/${this.totalLines}`);
        console.log(`📊 Scroll credits granted: ${this.scrollsPerPayment}`);
        
        // Update a fake revenue counter in the console for fun
        const projectedRevenue = (this.totalSpent * 1000000).toFixed(2);
        console.log(`📊 Projected global revenue: $${projectedRevenue}`);
    }
}

// Professional error handling
window.addEventListener('error', (e) => {
    console.error('ScrollPay System Error:', e.error);
    
    // Show professional error message
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; 
                    padding: 1rem; border-radius: 8px; z-index: 10000; max-width: 300px;">
            <strong>🚨 System Error</strong><br>
            Our payment processing system encountered an error. 
            Please contact support@scrollpay.com
        </div>
    `;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => errorDiv.remove(), 5000);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes loadProgress {
        to { width: 100%; }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes confetti {
        0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px) rotate(360deg);
        }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
    }
    
    @keyframes warning-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes celebrationBounce {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Initialize the system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add some professional console branding
    console.log('%c📜 ScrollPay™ Technologies', 'font-size: 20px; color: #2563eb; font-weight: bold;');
    console.log('%cRevolutionary Content Access Platform v2.1.0', 'color: #64748b;');
    console.log('%c© 2025 ScrollPay Technologies Inc. All rights reserved.', 'color: #94a3b8; font-size: 10px;');
    console.log('%cPatent Pending - Unauthorized reproduction prohibited', 'color: #94a3b8; font-size: 10px;');
    
    // Initialize the scroll payment system
    window.scrollPaySystem = new ScrollPaySystem();
    
    // Add some fake professional metrics
    setTimeout(() => {
        console.log('📊 Real-time metrics:');
        console.log('📊 Active users worldwide: 2,847,392');
        console.log('📊 Content lines unlocked today: 14,293,847');
        console.log('📊 Revenue generated: $7,146,923.50');
        console.log('📊 Customer satisfaction: 97.3%');
    }, 5000);
});

// Professional keyboard shortcuts (that don't work because scrolling is disabled)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'p':
                e.preventDefault();
                alert('💳 Quick Payment: This feature requires ScrollPay Pro subscription ($99.99/month)');
                break;
            case 's':
                e.preventDefault();
                alert('💾 Save Progress: Your scroll progress is automatically saved to the cloud!');
                break;
        }
    }
});

// Export for global access (professional module pattern)
window.ScrollPay = {
    version: '2.1.0',
    company: 'ScrollPay Technologies Inc.',
    support: 'support@scrollpay.com',
    documentation: 'https://docs.scrollpay.com/api/v2',
    status: () => {
        return {
            linesUnlocked: window.scrollPaySystem?.currentVisibleLines || 0,
            totalLines: window.scrollPaySystem?.totalLines || 0,
            totalSpent: window.scrollPaySystem?.totalSpent || 0,
            systemStatus: 'operational'
        };
    }
};