const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');

// XML Parser configuration
const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: true,
    trimValues: true
};

const parser = new XMLParser(parserOptions);

// Helper function to safely get nested values
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Read and parse the test XML file
const xmlData = fs.readFileSync('testdaten/01_EBICS_camt.052_Bareinzahlung_auf_Dot.xml', 'utf8');
const result = parser.parse(xmlData);

// Navigate to the transaction details
const document = result.Document || result;
const report = getNestedValue(document, 'BkToCstmrAcctRpt.Rpt');
const entry = report.Ntry;
const tx = entry.NtryDtls.TxDtls;

console.log('=== Testing Purp and AddtlTxInf Extraction ===\n');

// Extract the fields as per the new implementation
const purposeParts = [];

// Add Purp.Prtry if exists
const purpPrtry = tx.Purp?.Prtry;
console.log('Purp.Prtry:', purpPrtry);
if (purpPrtry) {
    purposeParts.push(purpPrtry);
}

// Add AddtlTxInf if exists
const addtlTxInf = tx.AddtlTxInf;
console.log('AddtlTxInf:', addtlTxInf);
if (addtlTxInf) {
    purposeParts.push(addtlTxInf);
}

// Add RmtInf.Ustrd if exists
const rmtInfUstrd = tx.RmtInf?.Ustrd || getNestedValue(tx, 'RmtInf.Strd.CdtrRefInf.Ref');
console.log('RmtInf.Ustrd:', rmtInfUstrd);
if (rmtInfUstrd) {
    purposeParts.push(rmtInfUstrd);
}

// Combine all parts with spaces
const combinedPurpose = purposeParts.length > 0 ? purposeParts.join(' ') : 'N/A';

console.log('\n=== Result ===');
console.log('Combined Purpose Field:', combinedPurpose);
console.log('\nExpected: "Einzahlung Einzahlungen"');
console.log('Match:', combinedPurpose === 'Einzahlung Einzahlungen' ? '✓ SUCCESS' : '✗ FAILED');