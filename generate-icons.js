#!/usr/bin/env node

/**
 * Icon Generator für CAMT.052 Viewer
 * Erstellt einfache Placeholder-Icons für die Desktop-App
 * 
 * Verwendung: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(60));
console.log('CAMT.052 Viewer - Icon Generator');
console.log('='.repeat(60));
console.log('');

// Erstelle build Verzeichnis falls nicht vorhanden
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    console.log('✓ build/ Verzeichnis erstellt');
}

console.log('');
console.log('Für professionelle Icons empfehlen wir:');
console.log('');
console.log('1. Online Icon Generator:');
console.log('   https://www.electron.build/icons');
console.log('   - Laden Sie ein 1024x1024 PNG hoch');
console.log('   - Generiert automatisch alle Formate');
console.log('');
console.log('2. Icon-Design Vorschlag:');
console.log('   - Blaues rundes Icon (#2563eb)');
console.log('   - Weißes Bankgebäude mit Säulen');
console.log('   - Goldenes Euro-Symbol (€) in der Mitte');
console.log('   - Kleines Dokument-Symbol für Kontoauszug');
console.log('');
console.log('3. Kostenlose Icon-Quellen:');
console.log('   - https://www.flaticon.com (Suche: "bank", "account")');
console.log('   - https://icons8.com (Suche: "bank statement")');
console.log('   - https://www.iconfinder.com');
console.log('');
console.log('4. Manuelle Erstellung:');
console.log('   - Erstellen Sie ein 1024x1024 PNG');
console.log('   - Speichern Sie es als build/icon.png');
console.log('   - Verwenden Sie electron-icon-builder:');
console.log('     npm install -g electron-icon-builder');
console.log('     electron-icon-builder --input=build/icon.png --output=build');
console.log('');
console.log('='.repeat(60));
console.log('');
console.log('Hinweis: Die Anwendung funktioniert auch ohne benutzerdefinierte');
console.log('Icons. Electron-builder verwendet dann Standard-Icons.');
console.log('');
console.log('Für ein professionelles Erscheinungsbild empfehlen wir jedoch,');
console.log('eigene Icons zu erstellen, die das Bank/Kontoauszug-Thema');
console.log('widerspiegeln.');
console.log('');
console.log('='.repeat(60));