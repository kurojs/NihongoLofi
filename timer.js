const defaultWorkMinutes = 25;
const defaultBreakMinutes = 5;

let workMinutes = defaultWorkMinutes;
let breakMinutes = defaultBreakMinutes;
let isPaused = true;
let isWorkTimer = true;
let timeLeft = workMinutes * 60;
let pomodorosFinished = 0;
let isVideoPlaying = false;

let enableAlarms = true;
let enableNotifs = true;

const pauseButton = document.querySelector('.pause-button');
const settingsToggle = document.querySelector('.settings-toggle');
const timeDisplay = document.querySelector('.time-display');
const progressBar = document.querySelector('.progress-bar');
const pomodorosCompleted = document.querySelector('.pomodoros-completed');
const enableNotifsToggle = document.querySelector('#enable-notifs');
const enableAlarmsToggle = document.querySelector('#enable-alarms');

if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('nihongolofi-settings');
    if (saved) {
        const settings = JSON.parse(saved);
        if (settings.workMinutes) {
            workMinutes = settings.workMinutes;
            document.querySelector('#work-length').value = workMinutes;
        }
        if (settings.breakMinutes) {
            breakMinutes = settings.breakMinutes;
            document.querySelector('#break-length').value = breakMinutes;
        }
        if (settings.enableAlarms !== undefined) {
            enableAlarms = settings.enableAlarms;
            enableAlarmsToggle.checked = enableAlarms;
        }
        if (settings.enableNotifs !== undefined) {
            enableNotifs = settings.enableNotifs;
            enableNotifsToggle.checked = enableNotifs;
        }
        timeLeft = workMinutes * 60;
    }
}

function updateProgressBar() {
    const totalTime = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (pomodorosCompleted) {
        pomodorosCompleted.textContent = pomodorosFinished;
    }
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateProgressBar();
    
    const totalTime = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
    const percentage = ((totalTime - timeLeft) / totalTime) * 100;
    progressBar.style.width = `${percentage}%`;
    
    pomodorosCompleted.textContent = `Pomodoros completados: ${pomodorosFinished}`;
}

function playAlarm() {
    if (enableAlarms) {
        const audio = new Audio('../sounds/alarm.wav');
        audio.play();
    }
}

function showNotification(title, message) {
    if (enableNotifs && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: '../img/heart.png'
        });
    } else if (enableNotifs && typeof Notification !== 'undefined' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: message,
                    icon: '../img/heart.png'
                });
            }
        });
    }
}

function switchTimer() {
    isWorkTimer = !isWorkTimer;
    timeLeft = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
    
    if (isWorkTimer) {
        pomodorosFinished++;
        showNotification('¡Descanso terminado!', '¡Es hora de trabajar!');
    } else {
        showNotification('¡Trabajo terminado!', '¡Es hora de descansar!');
    }
    
    playAlarm();
    updateTimeDisplay();
}

function tick() {
    // Timer solo avanza si el video está reproduciéndose
    if (!isPaused && isVideoPlaying) {
        timeLeft--;
        
        if (timeLeft <= 0) {
            switchTimer();
            return;
        }
        
        updateTimeDisplay();
        updateProgressBar();
    }
}

// Start timer
let timerInterval = setInterval(tick, 1000);

pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    
    const buttonImg = pauseButton.querySelector('img');
    if (isPaused) {
        buttonImg.src = '../img/playbutton.png';
        buttonImg.alt = 'Play';
    } else {
        buttonImg.src = '../img/pauseButton.png';
        buttonImg.alt = 'Pause';
    }
});

settingsToggle.addEventListener('click', () => {
    document.querySelector('header').classList.toggle('settings-open');
    document.querySelector('.gear').classList.toggle('down');
});

function saveSettings() {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nihongolofi-settings', JSON.stringify({
            workMinutes: workMinutes,
            breakMinutes: breakMinutes,
            enableAlarms: enableAlarms,
            enableNotifs: enableNotifs,
            streamUrl: streamUrl
        }));
    }
}

document.querySelector('#save-button').addEventListener('click', () => {
    const newWorkMinutes = parseInt(document.querySelector('#work-length').value);
    const newBreakMinutes = parseInt(document.querySelector('#break-length').value);
    const newUrl = document.getElementById('stream-url').value.trim();
    
    // Validate timer values
    if (newWorkMinutes > 0 && newBreakMinutes > 0) {
        workMinutes = newWorkMinutes;
        breakMinutes = newBreakMinutes;
        
        // Reset timer if currently paused
        if (isPaused) {
            timeLeft = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
        }
        
        updateTimeDisplay();
    } else {
        alert('⚠️ Los valores de tiempo deben ser mayores a 0');
        return;
    }
    
    // Save stream URL
    if (newUrl === '') {
        streamUrl = defaultStreamUrl;
        localStorage.removeItem('streamUrl');
        document.getElementById('stream-url').value = '';
        document.getElementById('stream-url').placeholder = defaultStreamUrl;
    } else if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
        streamUrl = newUrl;
        localStorage.setItem('streamUrl', streamUrl);
    } else if (newUrl !== '') {
        alert('⚠️ Por favor ingresa una URL válida de YouTube');
        return;
    }
    
    saveSettings();
    alert('✅ Configuración guardada correctamente');
});

enableNotifsToggle.addEventListener('change', (e) => {
    enableNotifs = e.target.checked;
});

enableAlarmsToggle.addEventListener('change', (e) => {
    enableAlarms = e.target.checked;
});

updateTimeDisplay();

// Handle play music button and back button
const musicPlayer = document.getElementById('music-player');
const playMusicBtn = document.getElementById('play-music');
const videoPlaceholder = document.getElementById('video-placeholder');
const backBtn = document.getElementById('back-btn');

// Default YouTube stream - can be changed in settings
const defaultStreamUrl = 'https://www.youtube.com/watch?v=d6f46ZUzJig';
let streamUrl = localStorage.getItem('streamUrl') || defaultStreamUrl;

// Initialize stream URL input
const streamUrlInput = document.getElementById('stream-url');
if (streamUrlInput) {
    // Show current URL or default placeholder
    if (streamUrl === defaultStreamUrl) {
        streamUrlInput.placeholder = defaultStreamUrl;
        streamUrlInput.value = '';
    } else {
        streamUrlInput.value = streamUrl;
    }
}
// Use ipcRenderer from window-controls.js (already loaded)
const loadingMessage = document.getElementById('loading-message');

if (playMusicBtn && musicPlayer && backBtn && loadingMessage) {
    playMusicBtn.addEventListener('click', async () => {
        // Hide placeholder
        videoPlaceholder.style.display = 'none';
        
        // Show loading
        loadingMessage.classList.remove('hidden');
        backBtn.classList.remove('hidden');
        
        try {
            console.log('Getting stream URL for:', streamUrl);
            
            // Get direct stream URL using yt-dlp
            const { ipcRenderer } = require('electron');
            const directStreamUrl = await ipcRenderer.invoke('get-youtube-stream', streamUrl);
            
            console.log('Got stream URL, loading player...');
            
            // Hide loading, show player
            loadingMessage.classList.add('hidden');
            musicPlayer.classList.remove('hidden');
            
            // Check if HLS stream (m3u8)
            if (directStreamUrl.includes('.m3u8')) {
                console.log('HLS stream detected, using hls.js');
                
                if (Hls.isSupported()) {
                    const hls = new Hls({
                        debug: false,
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 90
                    });
                    
                    hls.loadSource(directStreamUrl);
                    hls.attachMedia(musicPlayer);
                    
                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('HLS manifest parsed, playing...');
                        musicPlayer.play();
                        isVideoPlaying = true;
                        isPaused = false;
                        const buttonImg = pauseButton.querySelector('img');
                        buttonImg.src = '../img/pauseButton.png';
                        buttonImg.alt = 'Pause';
                    });
                    
                    hls.on(Hls.Events.ERROR, (event, data) => {
                        console.error('HLS error:', data);
                        if (data.fatal) {
                            loadingMessage.innerHTML = '<p>Error reproduciendo stream</p>';
                            loadingMessage.classList.remove('hidden');
                            isVideoPlaying = false;
                        }
                    });
                    
                    // Store hls instance for cleanup
                    musicPlayer.hlsInstance = hls;
                } else if (musicPlayer.canPlayType('application/vnd.apple.mpegurl')) {
                    // Native HLS support (Safari, some browsers)
                    musicPlayer.src = directStreamUrl;
                    await musicPlayer.play();
                    isVideoPlaying = true;
                    isPaused = false;
                    const buttonImg = pauseButton.querySelector('img');
                    buttonImg.src = '../img/pauseButton.png';
                    buttonImg.alt = 'Pause';
                } else {
                    throw new Error('HLS not supported');
                }
            } else {
                // Regular video source
                musicPlayer.src = directStreamUrl;
                await musicPlayer.play();
                isVideoPlaying = true;
                isPaused = false;
                const buttonImg = pauseButton.querySelector('img');
                buttonImg.src = '../img/pauseButton.png';
                buttonImg.alt = 'Pause';
            }
            
        } catch (error) {
            console.error('Error loading stream:', error);
            loadingMessage.innerHTML = '<p>Error cargando stream :(</p><p>Intenta de nuevo</p>';
            isVideoPlaying = false;
            
            setTimeout(() => {
                loadingMessage.classList.add('hidden');
                videoPlaceholder.style.display = 'flex';
                backBtn.classList.add('hidden');
            }, 3000);
        }
    });
    
    // Back button handler
    backBtn.addEventListener('click', () => {
        // Stop player and timer
        musicPlayer.pause();
        isVideoPlaying = false;
        
        // Destroy HLS instance if exists
        if (musicPlayer.hlsInstance) {
            musicPlayer.hlsInstance.destroy();
            musicPlayer.hlsInstance = null;
        }
        
        musicPlayer.src = '';
        
        // Hide player and back button
        musicPlayer.classList.add('hidden');
        backBtn.classList.add('hidden');
        loadingMessage.classList.add('hidden');
        
        // Show placeholder again
        videoPlaceholder.style.display = 'flex';
    });
}
