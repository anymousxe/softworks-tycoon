// --- UTILITY FUNCTIONS ---

const Utils = {
    // XSS Protection
    sanitizeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')
            .replace(/\//g, '&#x2F;')
            .replace(/\\/g, '&#x5C;')
            .replace(/`/g, '&#x60;');
    },

    // Validate and sanitize input fields
    validateInput(input, maxLength = 50) {
        if (!input || typeof input !== 'string') return '';
        let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        clean = clean.replace(/on\w+\s*=/gi, '');
        clean = clean.replace(/javascript:/gi, '');
        clean = clean.replace(/data:/gi, '');
        return this.sanitizeHTML(clean.substring(0, maxLength));
    },

    // Toast Notification System
    showToast(msg, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const el = document.createElement('div');
        const colors = type === 'success'
            ? 'border-green-500 bg-green-900/90 text-green-100'
            : (type === 'error' ? 'border-red-500 bg-red-900/90 text-red-100' : 'border-cyan-500 bg-slate-900/90 text-cyan-400');

        el.className = `toast-enter p-4 rounded-xl border-l-4 shadow-2xl backdrop-blur-md font-bold text-sm max-w-sm flex items-center gap-3 ${colors}`;
        el.innerHTML = type === 'success'
            ? `<i data-lucide="check-circle" class="w-5 h-5"></i> ${msg}`
            : `<i data-lucide="info" class="w-5 h-5"></i> ${msg}`;

        container.appendChild(el);
        if (window.lucide) lucide.createIcons();

        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 500);
        }, 4000);

        const ticker = document.getElementById('hud-ticker');
        if (ticker) {
            ticker.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span> ${msg}`;
        }
    },

    // Tutorial Spotlight Positioning
    positionHighlight(element) {
        const highlight = document.getElementById('tutorial-highlight');
        if (!highlight) return;

        if (!element) {
            highlight.style.opacity = '0';
            return;
        }

        const rect = element.getBoundingClientRect();
        highlight.style.opacity = '1';
        highlight.style.top = `${rect.top}px`;
        highlight.style.left = `${rect.left}px`;
        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
    }
};

// Aliases for easier access if needed (keeping compatibility with old code)
const sanitizeHTML = Utils.sanitizeHTML.bind(Utils);
const validateInput = Utils.validateInput.bind(Utils);
const showToast = Utils.showToast.bind(Utils);
const positionHighlight = Utils.positionHighlight.bind(Utils);
