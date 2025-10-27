const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
const PORT = 3001;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        },
        icon: path.join(__dirname, 'public', 'icon.png'),
        title: 'CAMT.052 Kontoauszug Viewer'
    });

    // Load the app
    mainWindow.loadURL(`http://localhost:${PORT}`);

    // Open DevTools in development mode
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function startServer() {
    return new Promise((resolve, reject) => {
        // Start the Express server as a child process
        serverProcess = spawn('node', ['server.js'], {
            cwd: __dirname,
            env: { ...process.env, ELECTRON_MODE: 'true' }
        });

        serverProcess.stdout.on('data', (data) => {
            console.log(`Server: ${data}`);
            // Check if server started successfully
            if (data.toString().includes('läuft auf')) {
                resolve();
            }
        });

        serverProcess.stderr.on('data', (data) => {
            console.error(`Server Error: ${data}`);
        });

        serverProcess.on('error', (error) => {
            console.error('Failed to start server:', error);
            reject(error);
        });

        serverProcess.on('close', (code) => {
            console.log(`Server process exited with code ${code}`);
        });

        // Timeout fallback
        setTimeout(() => {
            resolve();
        }, 2000);
    });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
    try {
        await startServer();
        createWindow();
    } catch (error) {
        console.error('Error starting application:', error);
        app.quit();
    }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
    // Kill the server process
    if (serverProcess) {
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
});