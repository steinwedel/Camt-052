#!/usr/bin/env node

/**
 * Build Script für CAMT.052 Viewer
 * Erstellt ausführbare Dateien für Windows, macOS und Linux
 * 
 * Verwendung:
 *   node build.js              - Erstellt alle Plattformen
 *   node build.js windows      - Nur Windows
 *   node build.js macos        - Nur macOS
 *   node build.js linux        - Nur Linux
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Farben für die Konsole
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

function logHeader(message) {
    console.log('\n' + '='.repeat(60));
    log(message, colors.bright + colors.blue);
    console.log('='.repeat(60) + '\n');
}

function logSuccess(message) {
    log(`✓ ${message}`, colors.green);
}

function logError(message) {
    log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
    log(`ℹ ${message}`, colors.yellow);
}

// Prüfe ob pkg installiert ist
function checkPkgInstalled() {
    try {
        execSync('npm list pkg', { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Installiere pkg falls nicht vorhanden
function installPkg() {
    logInfo('pkg ist nicht installiert. Installiere pkg...');
    try {
        execSync('npm install --save-dev pkg@5.8.1', { stdio: 'inherit' });
        logSuccess('pkg wurde erfolgreich installiert');
        return true;
    } catch (error) {
        logError('Fehler beim Installieren von pkg');
        console.error(error.message);
        return false;
    }
}

// Erstelle dist Verzeichnis
function createDistDirectory() {
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
        logSuccess('dist Verzeichnis erstellt');
    }
}

// Build-Konfiguration
const builds = {
    windows: {
        name: 'Windows',
        target: 'node18-win-x64',
        output: 'dist/camt52-viewer-windows.exe',
        icon: '🪟'
    },
    macos: {
        name: 'macOS',
        target: 'node18-macos-x64',
        output: 'dist/camt52-viewer-macos',
        icon: '🍎'
    },
    linux: {
        name: 'Linux',
        target: 'node18-linux-x64',
        output: 'dist/camt52-viewer-linux',
        icon: '🐧'
    }
};

// Führe Build aus
function buildPlatform(platform) {
    const config = builds[platform];
    if (!config) {
        logError(`Unbekannte Plattform: ${platform}`);
        return false;
    }

    logInfo(`${config.icon} Erstelle ${config.name} Build...`);
    
    try {
        const command = `npx pkg . --targets ${config.target} --output ${config.output} --compress GZip`;
        execSync(command, { stdio: 'inherit' });
        
        // Prüfe ob Datei erstellt wurde
        if (fs.existsSync(config.output)) {
            const stats = fs.statSync(config.output);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            logSuccess(`${config.name} Build erfolgreich erstellt (${sizeMB} MB)`);
            return true;
        } else {
            logError(`${config.name} Build fehlgeschlagen - Datei nicht gefunden`);
            return false;
        }
    } catch (error) {
        logError(`${config.name} Build fehlgeschlagen`);
        console.error(error.message);
        return false;
    }
}

// Hauptfunktion
function main() {
    logHeader('CAMT.052 Viewer - Build Script');
    
    // Prüfe Kommandozeilenargumente
    const args = process.argv.slice(2);
    let platformsToBuild = ['windows', 'macos', 'linux'];
    
    if (args.length > 0) {
        const requestedPlatform = args[0].toLowerCase();
        if (builds[requestedPlatform]) {
            platformsToBuild = [requestedPlatform];
            logInfo(`Erstelle nur ${builds[requestedPlatform].name} Build`);
        } else {
            logError(`Unbekannte Plattform: ${requestedPlatform}`);
            logInfo('Verfügbare Plattformen: windows, macos, linux');
            process.exit(1);
        }
    } else {
        logInfo('Erstelle Builds für alle Plattformen');
    }
    
    // Prüfe und installiere pkg
    if (!checkPkgInstalled()) {
        if (!installPkg()) {
            process.exit(1);
        }
    } else {
        logSuccess('pkg ist bereits installiert');
    }
    
    // Erstelle dist Verzeichnis
    createDistDirectory();
    
    // Führe Builds aus
    console.log('');
    const results = {};
    for (const platform of platformsToBuild) {
        results[platform] = buildPlatform(platform);
        console.log('');
    }
    
    // Zusammenfassung
    logHeader('Build Zusammenfassung');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const [platform, success] of Object.entries(results)) {
        const config = builds[platform];
        if (success) {
            logSuccess(`${config.icon} ${config.name}: ${config.output}`);
            successCount++;
        } else {
            logError(`${config.icon} ${config.name}: Fehlgeschlagen`);
            failCount++;
        }
    }
    
    console.log('');
    if (failCount === 0) {
        logSuccess(`Alle ${successCount} Builds erfolgreich erstellt!`);
        console.log('');
        logInfo('Die ausführbaren Dateien befinden sich im "dist" Verzeichnis.');
        logInfo('Sie können direkt ausgeführt werden und benötigen keine Installation.');
        console.log('');
        logInfo('Verwendung:');
        logInfo('  Windows: Doppelklick auf camt52-viewer-windows.exe');
        logInfo('  macOS:   ./camt52-viewer-macos im Terminal');
        logInfo('  Linux:   ./camt52-viewer-linux im Terminal');
        console.log('');
        logInfo('Die Anwendung startet einen Webserver auf http://localhost:3001');
    } else {
        logError(`${failCount} Build(s) fehlgeschlagen, ${successCount} erfolgreich`);
        process.exit(1);
    }
}

// Führe Hauptfunktion aus
main();