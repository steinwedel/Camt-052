#!/usr/bin/env node

/**
 * Build Script für CAMT.052 Viewer
 * Erstellt ausführbare Dateien für Windows, macOS und Linux
 * 
 * Verwendung:
 *   node build.js                    - Erstellt alle Plattformen (pkg)
 *   node build.js windows            - Nur Windows (pkg)
 *   node build.js macos              - Nur macOS (pkg)
 *   node build.js linux              - Nur Linux (pkg)
 *   node build.js electron           - Electron App für aktuelle Plattform
 *   node build.js electron:all       - Electron Apps für alle Plattformen
 *   node build.js all                - Erstellt pkg UND Electron für alle Plattformen
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
    red: '\x1b[31m',
    cyan: '\x1b[36m'
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

// Erstelle dist-electron Verzeichnis
function createElectronDistDirectory() {
    const distPath = path.join(__dirname, 'dist-electron');
    if (!fs.existsSync(distPath)) {
        fs.mkdirSync(distPath);
        logSuccess('dist-electron Verzeichnis erstellt');
    }
}

// Build-Konfiguration für pkg
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

// Führe pkg Build aus
function buildPlatform(platform) {
    const config = builds[platform];
    if (!config) {
        logError(`Unbekannte Plattform: ${platform}`);
        return false;
    }

    logInfo(`${config.icon} Erstelle ${config.name} Build (pkg)...`);
    
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

// Führe Electron Build aus
function buildElectron(platform = 'current') {
    logHeader('Electron Desktop-App Build (Direkt ausführbare Dateien)');
    
    createElectronDistDirectory();
    
    try {
        let command;
        let platformName;
        
        if (platform === 'all') {
            command = 'npx electron-builder -mwl';
            platformName = 'Alle Plattformen (Windows, macOS, Linux)';
            log(`🖥️  Erstelle ${platformName}...`, colors.cyan);
            logInfo('  • macOS: ZIP-Archiv mit .app Bundle (x64 + arm64)');
            logInfo('  • Windows: Portable .exe (keine Installation nötig)');
            logInfo('  • Linux: AppImage (direkt ausführbar)');
        } else {
            command = 'npx electron-builder';
            platformName = 'Aktuelle Plattform';
            log(`🖥️  Erstelle ${platformName}...`, colors.cyan);
        }
        
        execSync(command, { stdio: 'inherit' });
        
        logSuccess(`Electron Build erfolgreich erstellt`);
        logInfo('Die Electron Apps befinden sich im "dist-electron" Verzeichnis.');
        console.log('');
        logInfo('Verwendung der direkt ausführbaren Dateien:');
        logInfo('  • macOS: ZIP entpacken und .app Datei ausführen');
        logInfo('  • Windows: Portable .exe direkt starten (keine Installation)');
        logInfo('  • Linux: AppImage ausführbar machen (chmod +x) und starten');
        return true;
    } catch (error) {
        logError('Electron Build fehlgeschlagen');
        console.error(error.message);
        return false;
    }
}

// Hauptfunktion
function main() {
    logHeader('CAMT.052 Viewer - Build Script');
    
    // Prüfe Kommandozeilenargumente
    const args = process.argv.slice(2);
    const buildType = args[0]?.toLowerCase() || 'pkg';
    
    // Electron Builds
    if (buildType === 'electron') {
        buildElectron('current');
        return;
    }
    
    if (buildType === 'electron:all') {
        buildElectron('all');
        return;
    }
    
    if (buildType === 'all') {
        // Erstelle sowohl pkg als auch Electron Builds
        logInfo('Erstelle pkg Builds UND Electron Apps für alle Plattformen');
        
        // pkg Builds
        if (!checkPkgInstalled()) {
            if (!installPkg()) {
                process.exit(1);
            }
        } else {
            logSuccess('pkg ist bereits installiert');
        }
        
        createDistDirectory();
        
        console.log('');
        logHeader('PKG Standalone Executables');
        const pkgResults = {};
        for (const platform of ['windows', 'macos', 'linux']) {
            pkgResults[platform] = buildPlatform(platform);
            console.log('');
        }
        
        // Electron Builds
        console.log('');
        const electronSuccess = buildElectron('all');
        
        // Zusammenfassung
        logHeader('Build Zusammenfassung');
        
        log('PKG Executables:', colors.bright);
        let pkgSuccessCount = 0;
        for (const [platform, success] of Object.entries(pkgResults)) {
            const config = builds[platform];
            if (success) {
                logSuccess(`${config.icon} ${config.name}: ${config.output}`);
                pkgSuccessCount++;
            } else {
                logError(`${config.icon} ${config.name}: Fehlgeschlagen`);
            }
        }
        
        console.log('');
        log('Electron Desktop Apps:', colors.bright);
        if (electronSuccess) {
            logSuccess('🖥️  Electron Apps: dist-electron/');
        } else {
            logError('🖥️  Electron Apps: Fehlgeschlagen');
        }
        
        return;
    }
    
    // Standard pkg Builds
    let platformsToBuild = ['windows', 'macos', 'linux'];
    
    if (args.length > 0 && builds[buildType]) {
        platformsToBuild = [buildType];
        logInfo(`Erstelle nur ${builds[buildType].name} Build (pkg)`);
    } else if (args.length > 0 && !builds[buildType]) {
        logError(`Unbekannte Option: ${buildType}`);
        console.log('');
        logInfo('Verfügbare Optionen:');
        logInfo('  windows          - Nur Windows (pkg)');
        logInfo('  macos            - Nur macOS (pkg)');
        logInfo('  linux            - Nur Linux (pkg)');
        logInfo('  electron         - Electron App (aktuelle Plattform)');
        logInfo('  electron:all     - Electron Apps (alle Plattformen)');
        logInfo('  all              - pkg UND Electron für alle Plattformen');
        logInfo('  (keine Angabe)   - Alle Plattformen (pkg)');
        process.exit(1);
    } else {
        logInfo('Erstelle Builds für alle Plattformen (pkg)');
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