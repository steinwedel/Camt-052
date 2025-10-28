/**
 * i18n Helper Functions
 * Provides translation helpers for dynamically generated content
 */

// Translation helper for status codes
function translateStatus(statusCode) {
    const key = `status.${statusCode}`;
    const translated = i18n.t(key);
    // If translation not found, return the code itself
    return translated === key ? statusCode : translated;
}

// Translation helper for balance types
function translateBalanceType(typeCode) {
    const key = `balance.types.${typeCode}`;
    const translated = i18n.t(key);
    return translated === key ? typeCode : translated;
}

// Translation helper for bank transaction code domain
function translateBkTxCdDomain(code) {
    const key = `bankTransactionCode.domain.${code}`;
    const translated = i18n.t(key);
    return translated === key ? code : translated;
}

// Translation helper for bank transaction code family
function translateBkTxCdFamily(code) {
    const key = `bankTransactionCode.family.${code}`;
    const translated = i18n.t(key);
    return translated === key ? code : translated;
}

// Translation helper for bank transaction code sub-family
function translateBkTxCdSubFamily(code) {
    const key = `bankTransactionCode.subFamily.${code}`;
    const translated = i18n.t(key);
    return translated === key ? code : translated;
}

// Translation helper for transaction type
function translateTransactionType(creditDebit) {
    if (creditDebit === 'CRDT') {
        return i18n.t('transactions.type.credit');
    } else if (creditDebit === 'DBIT') {
        return i18n.t('transactions.type.debit');
    }
    return creditDebit;
}

// Get localized number formatter
function getNumberFormatter(currency = 'EUR') {
    const locale = i18n.getLanguage() === 'en' ? 'en-US' : 
                   i18n.getLanguage() === 'de' ? 'de-DE' :
                   i18n.getLanguage() === 'fr' ? 'fr-FR' :
                   i18n.getLanguage() === 'es' ? 'es-ES' :
                   i18n.getLanguage() === 'it' ? 'it-IT' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    });
}

// Format amount with current locale
function formatAmountLocalized(amount, currency = 'EUR') {
    const num = parseFloat(amount);
    return getNumberFormatter(currency).format(num);
}

// Get localized date formatter
function getDateFormatter() {
    const locale = i18n.getLanguage() === 'en' ? 'en-US' : 
                   i18n.getLanguage() === 'de' ? 'de-DE' :
                   i18n.getLanguage() === 'fr' ? 'fr-FR' :
                   i18n.getLanguage() === 'es' ? 'es-ES' :
                   i18n.getLanguage() === 'it' ? 'it-IT' : 'en-US';
    
    return {
        format: (dateStr) => {
            if (!dateStr || dateStr === 'N/A') return 'N/A';
            const date = new Date(dateStr);
            return date.toLocaleDateString(locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        }
    };
}