const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let osLanguage = 'en'; // Default language
let serverProcess;
const PORT = 3001;
const isDev = process.argv.includes('--dev');
const isPackaged = app.isPackaged;

// Detect OS language
function detectOSLanguage() {
    const locale = app.getLocale(); // Returns language code like 'en-US', 'de-DE', etc.
    console.log('OS Locale detected:', locale);
    
    // Extract base language code (e.g., 'en' from 'en-US')
    const baseLang = locale.split(/[-_]/)[0].toLowerCase();
    
    // Supported languages
    const supportedLanguages = ['en', 'de', 'fr', 'es', 'it'];
    
    // Return supported language or default to English
    return supportedLanguages.includes(baseLang) ? baseLang : 'en';
}

function createWindow() {
    // Detect OS language before creating window
    osLanguage = detectOSLanguage();
    console.log('Using language:', osLanguage);
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'public', 'icon.png'),
        title: 'CAMT.052 Account Statement Viewer'
    });

    // Load the app with language parameter
    mainWindow.loadURL(`http://localhost:${PORT}?electronLang=${osLanguage}`);
    
    // Inject language into window after page loads
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            window.electronLanguage = '${osLanguage}';
            console.log('Electron language set to:', '${osLanguage}');
        `);
    });

    // Open DevTools in development mode
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startServer() {
    return new Promise((resolve, reject) => {
        // Determine the correct path to server.js
        let serverPath;
        if (isPackaged) {
            // In packaged app, check unpacked location first (due to asarUnpack config)
            const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'server.js');
            const asarPath = path.join(process.resourcesPath, 'app.asar', 'server.js');
            
            // Prefer unpacked version if it exists (due to asarUnpack configuration)
            if (require('fs').existsSync(unpackedPath)) {
                serverPath = unpackedPath;
            } else if (require('fs').existsSync(asarPath)) {
                serverPath = asarPath;
            } else {
                // Fallback to default path
                serverPath = path.join(process.resourcesPath, 'app', 'server.js');
            }
        } else {
            serverPath = path.join(__dirname, 'server.js');
        }

        console.log('='.repeat(60));
        console.log('Electron App Starting');
        console.log('='.repeat(60));
        console.log('Is packaged:', isPackaged);
        console.log('Platform:', process.platform);
        console.log('__dirname:', __dirname);
        console.log('process.resourcesPath:', process.resourcesPath);
        console.log('Server path:', serverPath);
        console.log('Server exists:', require('fs').existsSync(serverPath));
        console.log('='.repeat(60));

        // Determine the correct working directory
        let workingDir;
        if (isPackaged) {
            // In packaged app, use the directory containing the unpacked files
            workingDir = path.dirname(serverPath);
        } else {
            workingDir = __dirname;
        }

        console.log('Working directory:', workingDir);

        try {
            // Use fork to run server.js with Electron's Node.js
            serverProcess = fork(serverPath, [], {
                cwd: workingDir,
                env: { ...process.env, ELECTRON_MODE: 'true' },
                silent: false,
                stdio: ['pipe', 'pipe', 'pipe', 'ipc']
            });

            let serverStarted = false;

            serverProcess.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(`[Server] ${output}`);
                // Check if server started successfully
                if (output.includes('läuft auf') || output.includes('listening')) {
                    if (!serverStarted) {
                        serverStarted = true;
                        console.log('✓ Server started successfully');
                        resolve();
                    }
                }
            });

            serverProcess.stderr.on('data', (data) => {
                console.error(`[Server Error] ${data}`);
            });

            serverProcess.on('error', (error) => {
                console.error('Failed to start server:', error);
                if (!serverStarted) {
                    reject(error);
                }
            });

            serverProcess.on('exit', (code, signal) => {
                console.log(`Server process exited with code ${code}, signal ${signal}`);
                if (!serverStarted && code !== 0) {
                    reject(new Error(`Server exited with code ${code}`));
                }
            });

            serverProcess.on('message', (msg) => {
                console.log('[Server Message]', msg);
            });

            // Timeout fallback - assume success if no errors after 3 seconds
            setTimeout(() => {
                if (!serverStarted) {
                    console.log('⚠ Server startup timeout - assuming success');
                    serverStarted = true;
                    resolve();
                }
            }, 3000);
        } catch (error) {
            console.error('Error forking server:', error);
            reject(error);
        }
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
    try {
        console.log('App is ready, starting server...');
        await startServer();
        console.log('Server started, creating window...');
        createWindow();
        console.log('Window created successfully');
    } catch (error) {
        console.error('Error starting application:', error);
        console.error('Stack:', error.stack);
        // Show error dialog
        const { dialog } = require('electron');
        dialog.showErrorBox(
            'Fehler beim Starten',
            `Die Anwendung konnte nicht gestartet werden:\n\n${error.message}\n\nBitte überprüfen Sie die Konsole für weitere Details.`
        );
        app.quit();
    }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    console.log('All windows closed, cleaning up...');
    // Kill the server process
    if (serverProcess) {
        console.log('Killing server process...');
        serverProcess.kill('SIGTERM');
        serverProcess = null;
    }
    
    // Always quit the app when window is closed (including macOS)
    app.quit();
});

app.on('activate', () => {
    // On macOS, re-create a window when the dock icon is clicked and no other windows are open
    if (mainWindow === null) {
        createWindow();
    }
});

// Cleanup on app quit
app.on('before-quit', (event) => {
    console.log('App quitting, cleaning up...');
    if (serverProcess) {
        serverProcess.kill('SIGTERM');
        serverProcess = null;
    }
});

// Additional cleanup on window close
app.on('will-quit', () => {
    if (serverProcess) {
        serverProcess.kill('SIGKILL');
        serverProcess = null;
    }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    console.error('Stack:', error.stack);
});