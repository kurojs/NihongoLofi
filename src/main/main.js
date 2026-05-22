const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const projectRoot = path.join(__dirname, '..', '..');

// Resolve yt-dlp binary path: bundled first, then system PATH
function getYtDlpPath() {
    const isWindows = process.platform === 'win32';
    const binaryName = isWindows ? 'yt-dlp.exe' : 'yt-dlp';

    const resourcesBin = path.join(
        app.isPackaged ? process.resourcesPath : projectRoot,
        'bin',
        binaryName
    );

    if (fs.existsSync(resourcesBin)) {
        return `"${resourcesBin}"`;
    }

    // Fallback: system PATH
    return binaryName;
}

let mainWindow;

function createWindow() {
    const isMac = process.platform === 'darwin';
    mainWindow = new BrowserWindow({
        width: 400,
        height: 650,
        icon: path.join(projectRoot, 'build', 'icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            webviewTag: true,
            allowRunningInsecureContent: true,
            autoplayPolicy: 'no-user-gesture-required'
        },
        ...(isMac
            ? { titleBarStyle: 'hidden', transparent: true }
            : { frame: false, transparent: true }
        ),
        resizable: true,
        autoHideMenuBar: true,
        title: 'NihongoLofi',
        backgroundColor: '#00000000',
        hasShadow: true
    });

    mainWindow.loadFile(path.join(projectRoot, 'src', 'renderer', 'index.html'));
    
    // Setup session for YouTube with proper headers
    const ses = mainWindow.webContents.session;

    const userAgent = process.platform === 'win32'
        ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        : process.platform === 'darwin'
        ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = userAgent;
        details.requestHeaders['Referer'] = 'https://www.youtube.com/';
        details.requestHeaders['Origin'] = 'https://www.youtube.com';
        callback({ requestHeaders: details.requestHeaders });
    });
    
    // Override CSP - Allow blob for HLS.js
    ses.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': ['default-src * blob: \'unsafe-inline\' \'unsafe-eval\'; script-src * blob: \'unsafe-inline\' \'unsafe-eval\'; connect-src * blob: \'unsafe-inline\'; img-src * data: blob: \'unsafe-inline\'; frame-src *; style-src * \'unsafe-inline\'; media-src * blob: data:;']
            }
        });
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
});

ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
        } else {
            mainWindow.maximize();
        }
    }
});

// Get direct stream URL from YouTube using yt-dlp
ipcMain.handle('get-youtube-stream', async (event, youtubeUrl) => {
    return new Promise((resolve, reject) => {
        const ytDlpBin = getYtDlpPath();
        const command = `${ytDlpBin} -f "best[height<=720]" --get-url --no-playlist "${youtubeUrl}"`;

        exec(command, { timeout: 30000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            const lines = stdout.trim().split('\n').filter(l => l.startsWith('http'));
            const streamUrl = lines[0] || stdout.trim();

            if (!streamUrl || !streamUrl.startsWith('http')) {
                reject(new Error('No valid stream URL returned by yt-dlp'));
                return;
            }

            resolve(streamUrl);
        });
    });
});

// Chromium flags to try fixing YouTube Error 153
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
app.commandLine.appendSwitch('disable-site-isolation-trials');
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');
app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('disable-web-security');
app.commandLine.appendSwitch('allow-running-insecure-content');

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
