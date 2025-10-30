#!/usr/bin/env node

/**
 * Build Script für CAMT.052 Viewer
 * Erstellt ausführbare Dateien für Windows, macOS und Linux
 * 
 * Verwendung:
 *   node build.js server              - Server-Executables für alle Plattformen
 *   node build.js server:windows      - Server-Executable nur für Windows
 *   node build.js server:macos        - Server-Executable nur für macOS
 *   node build.js server:linux        - Server-Executable nur für Linux
 *   node build.js desktop             - Desktop-App für aktuelle Plattform
 *   node build.js desktop:all         - Desktop-Apps für alle Plattformen
 *   node build.js desktop:windows     - Desktop-App nur für Windows
 *   node build.js desktop:macos       - Desktop-App nur für macOS
 *   node build.js desktop:linux       - Desktop-App nur für Linux
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
    log('Server-Executables (pkg):', colors.bright);
    logInfo('  server              - Alle Plattformen');
    logInfo('  server:windows      - Nur Windows');
    logInfo('  server:macos        - Nur macOS');
    logInfo('  server:linux        - Nur Linux');
    console.log('');
    log('Desktop-Apps (Electron):', colors.bright);
    logInfo('  desktop             - Aktuelle Plattform');
    logInfo('  desktop:all         - Alle Plattformen');
    logInfo('  desktop:windows     - Nur Windows');
    logInfo('  desktop:macos       - Nur macOS');
    logInfo('  desktop:linux       - Nur Linux');
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
    const [buildType, platform] = buildCommand.split(':');
    
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
        let platformsToBuild = ['windows', 'macos', 'linux-x64', 'linux-arm64'];
        if (platform === 'linux') {
            platformsToBuild = ['linux-x64', 'linux-arm64'];
            logInfo('Erstelle Linux Server-Builds (x64 und ARM64)');
        } else if (platform && serverBuilds[platform]) {
            platformsToBuild = [platform];
            logInfo(`Erstelle nur ${serverBuilds[platform].name} Server-Build`);
        } else if (platform) {
            logError(`Unbekannte Plattform: ${platform}`);
            showHelp();
            process.exit(1);
        } else {
            logInfo('Erstelle Server-Builds für alle Plattformen');
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
        const desktopPlatform = platform || 'current';
        buildDesktop(desktopPlatform);
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