#!/usr/bin/env node

/**
 * Build Script für CAMT.052 Viewer
 * Erstellt ausführbare Dateien für Windows, macOS und Linux
 * 
 * Verwendung:
 *   node build.js all                 - Server + Desktop für alle Plattformen
 *   node build.js server              - Server-Executable für aktuelle Plattform
 *   node build.js server:all          - Server-Executables für alle Plattformen
 *   node build.js server:windows      - Server-Executable nur für Windows
 *   node build.js server:macos        - Server-Executable nur für macOS
 *   node build.js server:linux        - Server-Executable für Linux (x64 + ARM64)
 *   node build.js server:linux:x64    - Server-Executable nur für Linux x64
 *   node build.js server:linux:arm64  - Server-Executable nur für Linux ARM64
 *   node build.js desktop             - Desktop-App für aktuelle Plattform
 *   node build.js desktop:all         - Desktop-Apps für alle Plattformen
 *   node build.js desktop:windows     - Desktop-App nur für Windows
 *   node build.js desktop:macos       - Desktop-App nur für macOS
 *   node build.js desktop:linux       - Desktop-App für Linux (x64 + ARM64)
 *   node build.js desktop:linux:x64   - Desktop-App nur für Linux x64
 *   node build.js desktop:linux:arm64 - Desktop-App nur für Linux ARM64
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

// Erstelle Verzeichnis
function createDirectory(dirPath, dirName) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        logSuccess(`${dirName} Verzeichnis erstellt`);
    }
}

// Build-Konfiguration für Server (pkg)
const serverBuilds = {
    windows: {
        name: 'Windows',
        target: 'node18-win-x64',
        output: 'dist-server/camt.052-web-viewer-windows.exe',
        icon: '🪟'
    },
    macos: {
        name: 'macOS-universal',
        target: 'node18-macos-x64',
        output: 'dist-server/camt.052-web-viewer-macOS-universal',
        icon: '🍎'
    },
    'linux-x64': {
        name: 'Linux x64',
        target: 'node18-linux-x64',
        output: 'dist-server/camt.052-web-viewer-linux-x64',
        icon: '🐧'
    },
    'linux-arm64': {
        name: 'Linux ARM64',
        target: 'node18-linux-arm64',
        output: 'dist-server/camt.052-web-viewer-linux-arm64',
        icon: '🐧'
    }
};

// Führe Server Build aus (pkg)
function buildServerPlatform(platform) {
    const config = serverBuilds[platform];
    if (!config) {
        logError(`Unbekannte Plattform: ${platform}`);
        return false;
    }

    logInfo(`${config.icon} Erstelle ${config.name} Server-Build...`);
    
    try {
        const command = `npx pkg . --targets ${config.target} --output ${config.output} --compress GZip`;
        execSync(command, { stdio: 'inherit' });
        
        // Prüfe ob Datei erstellt wurde
        if (fs.existsSync(config.output)) {
            const stats = fs.statSync(config.output);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            logSuccess(`${config.name} Server-Build erfolgreich erstellt (${sizeMB} MB)`);
            return true;
        } else {
            logError(`${config.name} Server-Build fehlgeschlagen - Datei nicht gefunden`);
            return false;
        }
    } catch (error) {
        logError(`${config.name} Server-Build fehlgeschlagen`);
        console.error(error.message);
        return false;
    }
}

// Lösche unnötige Build-Dateien (.blockmap, .yml, .zip)
function cleanupBuildFiles(directory) {
    try {
        const files = fs.readdirSync(directory);
        let deletedCount = 0;
        const extensionsToDelete = ['.blockmap', '.yml', '.yaml', '.zip'];
        
        files.forEach(file => {
            const shouldDelete = extensionsToDelete.some(ext => file.endsWith(ext));
            if (shouldDelete) {
                const filePath = path.join(directory, file);
                fs.unlinkSync(filePath);
                deletedCount++;
                logInfo(`  Gelöscht: ${file}`);
            }
        });
        
        if (deletedCount > 0) {
            logSuccess(`${deletedCount} unnötige Datei(en) gelöscht (.blockmap, .yml, .zip)`);
        } else {
            logInfo('Keine unnötigen Dateien gefunden');
        }
    } catch (error) {
        logError(`Fehler beim Bereinigen: ${error.message}`);
    }
}

// Führe Desktop Build aus (Electron)
function buildDesktop(platforms) {
    logHeader('Desktop-App Build (Electron)');
    
    const distDesktopPath = path.join(__dirname, 'dist-desktop');
    createDirectory(distDesktopPath, 'dist-desktop');
    
    try {
        let command;
        let platformName;
        
        if (platforms === 'all') {
            command = 'npx electron-builder -mwl --config.directories.output=dist-desktop';
            platformName = 'Alle Plattformen (Windows, macOS, Linux)';
            log(`🖥️  Erstelle ${platformName}...`, colors.cyan);
            logInfo('  • macOS: DMG Installer (Universal Binary)');
            logInfo('  • Windows: Portable .exe (keine Installation nötig)');
            logInfo('  • Linux: AppImage (direkt ausführbar)');
        } else if (platforms === 'windows') {
            command = 'npx electron-builder --win --config.directories.output=dist-desktop';
            platformName = 'Windows';
            log(`🪟 Erstelle ${platformName} Desktop-App...`, colors.cyan);
        } else if (platforms === 'macos') {
            command = 'npx electron-builder --mac --config.directories.output=dist-desktop';
            platformName = 'macOS';
            log(`🍎 Erstelle ${platformName} Desktop-App...`, colors.cyan);
            logInfo('  • DMG Installer (Universal Binary für Intel + Apple Silicon)');
        } else if (platforms === 'linux') {
            command = 'npx electron-builder --linux --config.directories.output=dist-desktop';
            platformName = 'Linux';
            log(`🐧 Erstelle ${platformName} Desktop-App...`, colors.cyan);
        } else if (platforms === 'linux:x64') {
            command = 'npx electron-builder --linux --x64 --config.directories.output=dist-desktop';
            platformName = 'Linux x64';
            log(`🐧 Erstelle ${platformName} Desktop-App...`, colors.cyan);
        } else if (platforms === 'linux:arm64') {
            command = 'npx electron-builder --linux --arm64 --config.directories.output=dist-desktop';
            platformName = 'Linux ARM64';
            log(`🐧 Erstelle ${platformName} Desktop-App...`, colors.cyan);
        } else {
            command = 'npx electron-builder --config.directories.output=dist-desktop';
            platformName = 'Aktuelle Plattform';
            log(`🖥️  Erstelle ${platformName}...`, colors.cyan);
        }
        
        execSync(command, { stdio: 'inherit' });
        
        logSuccess(`Desktop-Build erfolgreich erstellt`);
        
        // Lösche unnötige Dateien (.blockmap, .yml, .zip)
        console.log('');
        logInfo('Bereinige unnötige Dateien (.blockmap, .yml, .zip)...');
        cleanupBuildFiles(distDesktopPath);
        
        console.log('');
        logInfo('Die Desktop-Apps befinden sich im "dist-desktop" Verzeichnis.');
        console.log('');
        logInfo('Verwendung der Dateien:');
        logInfo('  • macOS: DMG öffnen und App in Applications ziehen');
        logInfo('  • Windows: Portable .exe direkt starten (keine Installation)');
        logInfo('  • Linux: AppImage ausführbar machen (chmod +x) und starten');
        return true;
    } catch (error) {
        logError('Desktop-Build fehlgeschlagen');
        console.error(error.message);
        return false;
    }
}

// Zeige Hilfe an
function showHelp() {
    logHeader('CAMT.052 Viewer - Build Script');
    logInfo('Verfügbare Optionen:');
    console.log('');
    log('Alle Builds:', colors.bright);
    logInfo('  all                 - Server + Desktop für alle Plattformen');
    console.log('');
    log('Server-Executables (pkg):', colors.bright);
    logInfo('  server              - Aktuelle Plattform');
    logInfo('  server:all          - Alle Plattformen');
    logInfo('  server:windows      - Nur Windows');
    logInfo('  server:macos        - Nur macOS');
    logInfo('  server:linux        - Linux (x64 + ARM64)');
    logInfo('  server:linux:x64    - Nur Linux x64');
    logInfo('  server:linux:arm64  - Nur Linux ARM64');
    console.log('');
    log('Desktop-Apps (Electron):', colors.bright);
    logInfo('  desktop             - Aktuelle Plattform');
    logInfo('  desktop:all         - Alle Plattformen');
    logInfo('  desktop:windows     - Nur Windows');
    logInfo('  desktop:macos       - Nur macOS');
    logInfo('  desktop:linux       - Linux (x64 + ARM64)');
    logInfo('  desktop:linux:x64   - Nur Linux x64');
    logInfo('  desktop:linux:arm64 - Nur Linux ARM64');
    console.log('');
    log('Ausgabeverzeichnisse:', colors.bright);
    logInfo('  Server-Builds:  dist-server/');
    logInfo('  Desktop-Builds: dist-desktop/');
}

// Hauptfunktion
function main() {
    // Prüfe Kommandozeilenargumente
    const args = process.argv.slice(2);
    const buildCommand = args[0]?.toLowerCase() || '';
    
    // Keine Argumente oder Hilfe
    if (!buildCommand || buildCommand === 'help' || buildCommand === '--help' || buildCommand === '-h') {
        showHelp();
        return;
    }
    
    // Parse Kommando (z.B. "server:windows" -> type="server", platform="windows")
    // oder "server:linux:x64" -> type="server", platform="linux", arch="x64"
    const parts = buildCommand.split(':');
    const buildType = parts[0];
    const platform = parts[1];
    const arch = parts[2]; // Optional: für linux:x64 oder linux:arm64
    
    // Server Builds
    if (buildType === 'server') {
        logHeader('Server-Executables Build (pkg)');
        
        // Prüfe und installiere pkg
        if (!checkPkgInstalled()) {
            if (!installPkg()) {
                process.exit(1);
            }
        } else {
            logSuccess('pkg ist bereits installiert');
        }
        
        // Erstelle dist-server Verzeichnis
        createDirectory(path.join(__dirname, 'dist-server'), 'dist-server');
        
        // Bestimme Plattformen
        let platformsToBuild = [];
        if (!platform) {
            // Keine Plattform angegeben - baue für aktuelle Plattform
            const currentPlatform = process.platform;
            if (currentPlatform === 'win32') {
                platformsToBuild = ['windows'];
                logInfo('Erstelle Server-Build für aktuelle Plattform (Windows)');
            } else if (currentPlatform === 'darwin') {
                platformsToBuild = ['macos'];
                logInfo('Erstelle Server-Build für aktuelle Plattform (macOS)');
            } else if (currentPlatform === 'linux') {
                // Für Linux baue für die aktuelle Architektur
                const arch = process.arch;
                if (arch === 'arm64') {
                    platformsToBuild = ['linux-arm64'];
                    logInfo('Erstelle Server-Build für aktuelle Plattform (Linux ARM64)');
                } else {
                    platformsToBuild = ['linux-x64'];
                    logInfo('Erstelle Server-Build für aktuelle Plattform (Linux x64)');
                }
            } else {
                logError(`Unbekannte Plattform: ${currentPlatform}`);
                process.exit(1);
            }
        } else if (platform === 'all') {
            platformsToBuild = ['windows', 'macos', 'linux-x64', 'linux-arm64'];
            logInfo('Erstelle Server-Builds für alle Plattformen');
        } else if (platform === 'linux') {
            if (arch === 'x64') {
                platformsToBuild = ['linux-x64'];
                logInfo('Erstelle Linux Server-Build (nur x64)');
            } else if (arch === 'arm64') {
                platformsToBuild = ['linux-arm64'];
                logInfo('Erstelle Linux Server-Build (nur ARM64)');
            } else if (!arch) {
                platformsToBuild = ['linux-x64', 'linux-arm64'];
                logInfo('Erstelle Linux Server-Builds (x64 und ARM64)');
            } else {
                logError(`Unbekannte Linux-Architektur: ${arch}`);
                logInfo('Verwenden Sie "server:linux:x64" oder "server:linux:arm64"');
                process.exit(1);
            }
        } else if (serverBuilds[platform]) {
            platformsToBuild = [platform];
            logInfo(`Erstelle nur ${serverBuilds[platform].name} Server-Build`);
        } else {
            logError(`Unbekannte Plattform: ${platform}`);
            logInfo('Verwenden Sie "server" für aktuelle Plattform, "server:all" für alle Plattformen');
            logInfo('oder "server:windows", "server:macos", "server:linux"');
            console.log('');
            showHelp();
            process.exit(1);
        }
        
        // Führe Builds aus
        console.log('');
        const results = {};
        for (const plt of platformsToBuild) {
            results[plt] = buildServerPlatform(plt);
            console.log('');
        }
        
        // Zusammenfassung
        logHeader('Build Zusammenfassung');
        
        let successCount = 0;
        let failCount = 0;
        
        for (const [plt, success] of Object.entries(results)) {
            const config = serverBuilds[plt];
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
            logSuccess(`Alle ${successCount} Server-Builds erfolgreich erstellt!`);
            console.log('');
            logInfo('Die ausführbaren Dateien befinden sich im "dist-server" Verzeichnis.');
            logInfo('Sie können direkt ausgeführt werden und benötigen keine Installation.');
        } else {
            logError(`${failCount} Build(s) fehlgeschlagen, ${successCount} erfolgreich`);
            process.exit(1);
        }
    }
    // Desktop Builds
    else if (buildType === 'desktop') {
        let desktopPlatform = platform || 'current';
        
        // Handle linux:x64 or linux:arm64
        if (platform === 'linux' && arch) {
            desktopPlatform = `linux:${arch}`;
        }
        
        buildDesktop(desktopPlatform);
    }
    // Alle Builds (Server + Desktop)
    else if (buildType === 'all') {
        logHeader('Vollständiger Build (Server + Desktop)');
        logInfo('Erstelle alle Server-Executables und Desktop-Apps für alle Plattformen');
        console.log('');
        
        // 1. Server Builds
        logHeader('Phase 1: Server-Executables Build (pkg)');
        
        // Prüfe und installiere pkg
        if (!checkPkgInstalled()) {
            if (!installPkg()) {
                process.exit(1);
            }
        } else {
            logSuccess('pkg ist bereits installiert');
        }
        
        // Erstelle dist-server Verzeichnis
        createDirectory(path.join(__dirname, 'dist-server'), 'dist-server');
        
        // Alle Server-Plattformen
        const platformsToBuild = ['windows', 'macos', 'linux-x64', 'linux-arm64'];
        logInfo('Erstelle Server-Builds für alle Plattformen');
        
        console.log('');
        const serverResults = {};
        for (const plt of platformsToBuild) {
            serverResults[plt] = buildServerPlatform(plt);
            console.log('');
        }
        
        // Server Build Zusammenfassung
        logHeader('Server Build Zusammenfassung');
        
        let serverSuccessCount = 0;
        let serverFailCount = 0;
        
        for (const [plt, success] of Object.entries(serverResults)) {
            const config = serverBuilds[plt];
            if (success) {
                logSuccess(`${config.icon} ${config.name}: ${config.output}`);
                serverSuccessCount++;
            } else {
                logError(`${config.icon} ${config.name}: Fehlgeschlagen`);
                serverFailCount++;
            }
        }
        
        console.log('');
        if (serverFailCount === 0) {
            logSuccess(`Alle ${serverSuccessCount} Server-Builds erfolgreich erstellt!`);
        } else {
            logError(`${serverFailCount} Server-Build(s) fehlgeschlagen, ${serverSuccessCount} erfolgreich`);
        }
        
        // 2. Desktop Builds
        console.log('');
        logHeader('Phase 2: Desktop-App Build (Electron)');
        const desktopSuccess = buildDesktop('all');
        
        // Gesamtzusammenfassung
        console.log('');
        logHeader('Gesamtzusammenfassung');
        
        if (serverFailCount === 0 && desktopSuccess) {
            logSuccess(`✓ Server-Builds: ${serverSuccessCount}/4 erfolgreich`);
            logSuccess(`✓ Desktop-Builds: Erfolgreich`);
            console.log('');
            logSuccess('Alle Builds erfolgreich abgeschlossen!');
            console.log('');
            logInfo('Ausgabeverzeichnisse:');
            logInfo('  • Server-Executables: dist-server/');
            logInfo('  • Desktop-Apps: dist-desktop/');
        } else {
            if (serverFailCount > 0) {
                logError(`✗ Server-Builds: ${serverFailCount} fehlgeschlagen`);
            }
            if (!desktopSuccess) {
                logError(`✗ Desktop-Builds: Fehlgeschlagen`);
            }
            console.log('');
            logError('Einige Builds sind fehlgeschlagen. Bitte Fehler überprüfen.');
            process.exit(1);
        }
    }
    // Unbekanntes Kommando
    else {
        logError(`Unbekanntes Kommando: ${buildCommand}`);
        console.log('');
        showHelp();
        process.exit(1);
    }
}

// Führe Hauptfunktion aus
main();