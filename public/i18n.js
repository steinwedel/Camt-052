/**
 * Simple i18n (internationalization) library for the CAMT.052 Viewer
 * Supports language detection from browser or Electron OS settings
 */

class I18n {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en';
        this.supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];
        this.defaultLanguage = 'en';
    }

    /**
     * Initialize i18n with language detection
     * @param {string} forcedLanguage - Optional: force a specific language
     */
    async init(forcedLanguage = null) {
        // Detect language
        let detectedLanguage = forcedLanguage || this.detectLanguage();
        
        // Validate and fallback to default if not supported
        if (!this.supportedLanguages.includes(detectedLanguage)) {
            console.log(`Language '${detectedLanguage}' not supported, falling back to '${this.defaultLanguage}'`);
            detectedLanguage = this.defaultLanguage;
        }

        this.currentLanguage = detectedLanguage;
        
        // Load translations
        await this.loadTranslations(this.currentLanguage);
        
        console.log(`i18n initialized with language: ${this.currentLanguage}`);
    }

    /**
     * Detect user's preferred language
     * Priority: URL parameter > Electron OS language > Browser language > Default
     */
    detectLanguage() {
        // 1. Check URL parameter (for testing/override)
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang) {
            return this.normalizeLanguageCode(urlLang);
        }

        // 2. Check if running in Electron (will be set by electron.js)
        const electronLang = window.electronLanguage;
        if (electronLang) {
            return this.normalizeLanguageCode(electronLang);
        }

        // 3. Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            return this.normalizeLanguageCode(browserLang);
        }

        // 4. Fallback to default
        return this.defaultLanguage;
    }

    /**
     * Normalize language code (e.g., 'en-US' -> 'en', 'de-DE' -> 'de')
     */
    normalizeLanguageCode(langCode) {
        if (!langCode) return this.defaultLanguage;
        
        // Extract base language code (before hyphen or underscore)
        const baseLang = langCode.split(/[-_]/)[0].toLowerCase();
        
        // Return if supported, otherwise return default
        return this.supportedLanguages.includes(baseLang) ? baseLang : this.defaultLanguage;
    }

    /**
     * Load translation file for specified language
     */
    async loadTranslations(language) {
        try {
            const response = await fetch(`/i18n/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for '${language}'`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`Error loading translations for '${language}':`, error);
            
            // Fallback to default language if not already trying it
            if (language !== this.defaultLanguage) {
                console.log(`Falling back to default language: ${this.defaultLanguage}`);
                this.currentLanguage = this.defaultLanguage;
                await this.loadTranslations(this.defaultLanguage);
            } else {
                console.error('Failed to load default language translations!');
                this.translations = {};
            }
        }
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key (e.g., 'app.title' or 'upload.selectFile')
     * @param {object} params - Optional parameters for string interpolation
     * @returns {string} Translated string
     */
    t(key, params = {}) {
        // Navigate through nested object using dot notation
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key; // Return key itself if translation not found
            }
        }

        // If value is not a string, return the key
        if (typeof value !== 'string') {
            console.warn(`Translation value is not a string for key: ${key}`);
            return key;
        }

        // Replace parameters in the string (e.g., {name} -> actual value)
        return this.interpolate(value, params);
    }

    /**
     * Interpolate parameters into a string
     * @param {string} str - String with placeholders like {key}
     * @param {object} params - Object with key-value pairs
     */
    interpolate(str, params) {
        return str.replace(/\{(\w+)\}/g, (match, key) => {
            return params.hasOwnProperty(key) ? params[key] : match;
        });
    }

    /**
     * Get current language code
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Change language dynamically
     */
    async changeLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            console.error(`Language '${language}' is not supported`);
            return;
        }

        this.currentLanguage = language;
        await this.loadTranslations(language);
        
        // Trigger a custom event that the app can listen to for re-rendering
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLanguage } 
        }));
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Create global instance
const i18n = new I18n();

// Export for use in modules or global scope
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
}