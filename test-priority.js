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

console.log('=== Testing Priority-Based Purpose Field Selection ===\n');

// Extract the fields
const purpPrtry = tx.Purp?.Prtry;
const addtlTxInf = tx.AddtlTxInf;
const rmtInfUstrd = tx.RmtInf?.Ustrd || getNestedValue(tx, 'RmtInf.Strd.CdtrRefInf.Ref');

console.log('Available fields:');
console.log('  Purp.Prtry:', purpPrtry || 'NOT PRESENT');
console.log('  AddtlTxInf:', addtlTxInf || 'NOT PRESENT');
console.log('  RmtInf.Ustrd:', rmtInfUstrd || 'NOT PRESENT');

// Apply priority-based selection
let remittanceInfo = 'N/A';

if (purpPrtry) {
    remittanceInfo = purpPrtry;
    console.log('\n✓ Selected: Purp.Prtry (First Priority)');
} else {
    if (addtlTxInf) {
        remittanceInfo = addtlTxInf;
        console.log('\n✓ Selected: AddtlTxInf (Second Priority)');
    } else {
        if (rmtInfUstrd) {
            remittanceInfo = rmtInfUstrd;
            console.log('\n✓ Selected: RmtInf.Ustrd (Third Priority)');
        } else {
            console.log('\n✓ Selected: N/A (No fields available)');
        }
    }
}

console.log('\n=== Result ===');
console.log('Purpose Field:', remittanceInfo);
console.log('\nExpected: "Einzahlung" (because Purp exists)');
console.log('Match:', remittanceInfo === 'Einzahlung' ? '✓ SUCCESS' : '✗ FAILED');