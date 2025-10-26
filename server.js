const express = require('express');
const multer = require('multer');
const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const app = express();
const PORT = 3001;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// XML Parser configuration
const parserOptions = {
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: true,
    trimValues: true
};

const parser = new XMLParser(parserOptions);

// Helper function to convert object to XML string
function objectToXML(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let xml = '';
    
    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('@_')) continue; // Skip attributes for now
        
        if (value === null || value === undefined) continue;
        
        if (typeof value === 'object' && !Array.isArray(value)) {
            xml += `${spaces}<${key}>\n`;
            xml += objectToXML(value, indent + 1);
            xml += `${spaces}</${key}>\n`;
        } else if (Array.isArray(value)) {
            value.forEach(item => {
                xml += `${spaces}<${key}>\n`;
                if (typeof item === 'object') {
                    xml += objectToXML(item, indent + 1);
                } else {
                    xml += `${spaces}  ${item}\n`;
                }
                xml += `${spaces}</${key}>\n`;
            });
        } else {
            xml += `${spaces}<${key}>${value}</${key}>\n`;
        }
    }
    
    return xml;
}

// Helper function to safely get nested values
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to format amount
function formatAmount(amount, currency = 'EUR') {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: currency
    }).format(num);
}

// Helper function to format date
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Parse CAMT.052 XML file
function parseCamt052(xmlData, fileName = '') {
    const result = parser.parse(xmlData);
    
    // Navigate through the CAMT.052 structure
    const document = result.Document || result;
    const report = getNestedValue(document, 'BkToCstmrAcctRpt.Rpt') || 
                   getNestedValue(document, 'BkToCstmrAcctRpt.GrpHdr');
    
    if (!report) {
        throw new Error('Invalid CAMT.052 format: Could not find report structure');
    }

    // Handle both single report and array of reports
    const reports = Array.isArray(report) ? report : [report];
    const allTransactions = [];
    let accountInfo = {};
    let balances = [];

    reports.forEach(rpt => {
        // Extract statement information
        const statementId = rpt.Id || 'N/A';
        const creationDate = rpt.CreDtTm || '';
        
        // Get statement date from closing balance or creation date
        let statementDate = 'N/A';
        const balanceData = rpt.Bal;
        if (balanceData) {
            const balArray = Array.isArray(balanceData) ? balanceData : [balanceData];
            const closingBalance = balArray.find(bal => getNestedValue(bal, 'Tp.CdOrPrtry.Cd') === 'CLBD');
            if (closingBalance) {
                statementDate = closingBalance.Dt?.Dt || closingBalance.Dt || creationDate.split('T')[0] || 'N/A';
            } else if (creationDate) {
                statementDate = creationDate.split('T')[0];
            }
        }
        // Extract account information
        const account = rpt.Acct || {};
        accountInfo = {
            iban: getNestedValue(account, 'Id.IBAN') || 'N/A',
            currency: getNestedValue(account, 'Ccy') || 'EUR',
            owner: getNestedValue(account, 'Ownr.Nm') || 'N/A'
        };

        // Extract balances
        const balanceData = rpt.Bal;
        if (balanceData) {
            const balArray = Array.isArray(balanceData) ? balanceData : [balanceData];
            balances = balArray.map(bal => ({
                type: getNestedValue(bal, 'Tp.CdOrPrtry.Cd') || 'N/A',
                amount: getNestedValue(bal, 'Amt.#text') || getNestedValue(bal, 'Amt') || '0',
                currency: getNestedValue(bal, 'Amt.@_Ccy') || accountInfo.currency,
                creditDebit: bal.CdtDbtInd || 'N/A',
                date: bal.Dt?.Dt || bal.Dt || 'N/A'
            }));
        }

        // Extract entries (transactions)
        const entries = rpt.Ntry;
        if (!entries) return;

        const entryArray = Array.isArray(entries) ? entries : [entries];

        entryArray.forEach(entry => {
            const amount = getNestedValue(entry, 'Amt.#text') || getNestedValue(entry, 'Amt') || '0';
            const currency = getNestedValue(entry, 'Amt.@_Ccy') || accountInfo.currency;
            const creditDebit = entry.CdtDbtInd || 'N/A';
            
            // Get transaction details
            const txDetails = entry.NtryDtls?.TxDtls;
            const txArray = txDetails ? (Array.isArray(txDetails) ? txDetails : [txDetails]) : [{}];

            txArray.forEach(tx => {
                // Extract party information - handle multiple formats
                const relatedParties = tx.RltdPties || {};
                
                // Try different party structures
                // Standard: Dbtr.Pty.Nm or Dbtr.Nm
                // Alternative: Just Pty.Nm (when Dbtr/Cdtr not present)
                let debtor = relatedParties.Dbtr?.Pty?.Nm || 
                            relatedParties.Dbtr?.Nm || 
                            relatedParties.Pty?.Nm || 
                            'N/A';
                let debtorAccount = getNestedValue(relatedParties, 'DbtrAcct.Id.IBAN') || 
                                   getNestedValue(relatedParties, 'Pty.Id.IBAN') || 
                                   'N/A';
                
                let creditor = relatedParties.Cdtr?.Pty?.Nm || 
                              relatedParties.Cdtr?.Nm || 
                              relatedParties.Pty?.Nm || 
                              'N/A';
                let creditorAccount = getNestedValue(relatedParties, 'CdtrAcct.Id.IBAN') || 
                                     getNestedValue(relatedParties, 'Pty.Id.IBAN') || 
                                     'N/A';
                
                // If only Pty is used (no Dbtr/Cdtr), determine based on transaction type
                if (relatedParties.Pty && !relatedParties.Dbtr && !relatedParties.Cdtr) {
                    if (creditDebit === 'DBIT') {
                        // Debit: Pty is the creditor (receiver)
                        creditor = relatedParties.Pty.Nm || 'N/A';
                        creditorAccount = getNestedValue(relatedParties, 'Pty.Id.IBAN') || 'N/A';
                        debtor = accountInfo.owner;
                        debtorAccount = accountInfo.iban;
                    } else {
                        // Credit: Pty is the debtor (sender)
                        debtor = relatedParties.Pty.Nm || 'N/A';
                        debtorAccount = getNestedValue(relatedParties, 'Pty.Id.IBAN') || 'N/A';
                        creditor = accountInfo.owner;
                        creditorAccount = accountInfo.iban;
                    }
                }

                // Extract remittance information (purpose)
                const remittanceInfo = tx.RmtInf?.Ustrd || 
                                     getNestedValue(tx, 'RmtInf.Strd.CdtrRefInf.Ref') || 
                                     'N/A';

                // Extract reference
                const reference = tx.Refs?.EndToEndId || 
                                tx.Refs?.TxId || 
                                tx.Refs?.MsgId || 
                                'N/A';

                // Generate raw XML for this entry
                const rawXML = `<Ntry>\n${objectToXML(entry, 1)}</Ntry>`;
                
                const transaction = {
                    statementDate: formatDate(statementDate),
                    statementNumber: statementId,
                    bookingDate: formatDate(entry.BookgDt?.Dt || entry.BookgDt),
                    valueDate: formatDate(entry.ValDt?.Dt || entry.ValDt),
                    amount: formatAmount(amount, currency),
                    rawAmount: parseFloat(amount),
                    currency: currency,
                    creditDebit: creditDebit,
                    type: creditDebit === 'CRDT' ? 'Eingang' : 'Ausgang',
                    debtor: debtor,
                    debtorAccount: debtorAccount,
                    creditor: creditor,
                    creditorAccount: creditorAccount,
                    sender: debtor,
                    senderAccount: debtorAccount,
                    receiver: creditor,
                    receiverAccount: creditorAccount,
                    purpose: Array.isArray(remittanceInfo) ? remittanceInfo.join(' ') : remittanceInfo,
                    reference: reference,
                    status: entry.Sts || 'BOOK',
                    rawXML: rawXML,
                    fileName: fileName
                };

                allTransactions.push(transaction);
            });
        });
    });

    return {
        account: accountInfo,
        balances: balances,
        transactions: allTransactions
    };
}

// Route to upload and parse XML or ZIP file
app.post('/upload', upload.single('xmlFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Keine Datei hochgeladen' });
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        let allTransactions = [];
        let accountInfo = {};
        let balances = [];

        if (fileExtension === '.zip') {
            // Handle ZIP file
            const zip = new AdmZip(req.file.path);
            const zipEntries = zip.getEntries();
            
            // Filter for XML files
            const xmlEntries = zipEntries.filter(entry => 
                !entry.isDirectory && entry.entryName.toLowerCase().endsWith('.xml')
            );

            if (xmlEntries.length === 0) {
                fs.unlinkSync(req.file.path);
                return res.status(400).json({ error: 'Keine XML-Dateien in der ZIP-Datei gefunden' });
            }

            // Parse each XML file
            xmlEntries.forEach(entry => {
                const xmlData = entry.getData().toString('utf8');
                const parsedData = parseCamt052(xmlData, entry.entryName);
                
                // Use account info from first file
                if (Object.keys(accountInfo).length === 0) {
                    accountInfo = parsedData.account;
                }
                
                // Combine balances (avoid duplicates)
                parsedData.balances.forEach(bal => {
                    if (!balances.find(b => b.type === bal.type && b.date === bal.date)) {
                        balances.push(bal);
                    }
                });
                
                // Combine all transactions
                allTransactions = allTransactions.concat(parsedData.transactions);
            });

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            res.json({
                account: accountInfo,
                balances: balances,
                transactions: allTransactions
            });

        } else if (fileExtension === '.xml') {
            // Handle single XML file
            const xmlData = fs.readFileSync(req.file.path, 'utf8');
            const parsedData = parseCamt052(xmlData, req.file.originalname);

            // Clean up uploaded file
            fs.unlinkSync(req.file.path);

            res.json(parsedData);
        } else {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Ungültiges Dateiformat. Bitte laden Sie eine XML- oder ZIP-Datei hoch.' });
        }

    } catch (error) {
        console.error('Error parsing file:', error);
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            error: 'Fehler beim Parsen der Datei', 
            details: error.message 
        });
    }
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`CAMT.052 Viewer läuft auf http://localhost:${PORT}`);
});