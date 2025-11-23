const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let youtubeBrowserView;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 650,
        icon: path.join(__dirname, 'img', 'celeste.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            webviewTag: true,
            allowRunningInsecureContent: true,
            autoplayPolicy: 'no-user-gesture-required'
        },
        frame: false,
        transparent: true,
        resizable: true,
        autoHideMenuBar: true,
        title: '日本語',
        backgroundColor: '#00000000',
        hasShadow: true
    });

    mainWindow.loadFile('pages/index.html');
    
    // Open DevTools in development (comment out for production)
    // mainWindow.webContents.openDevTools();
    
    // Setup session for YouTube with proper headers
    const ses = mainWindow.webContents.session;
    
    ses.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
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
        // Increase timeout to 30 seconds for slow connections
        const command = `yt-dlp -f "best[height<=720]" --get-url "${youtubeUrl}"`;
        
        console.log('Running yt-dlp for:', youtubeUrl);
        
        exec(command, { timeout: 30000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
            if (error) {
                console.error('yt-dlp error:', error);
                console.error('stderr:', stderr);
                reject(error);
                return;
            }
            
            const streamUrl = stdout.trim();
            console.log('Stream URL obtained:', streamUrl.substring(0, 100) + '...');
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

// Disable hardware acceleration if causing issues
// app.disableHardwareAcceleration();

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
