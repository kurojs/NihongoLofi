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

const defaultStreamUrl = 'https://www.youtube.com/watch?v=d6f46ZUzJig';
let streamUrl = localStorage.getItem('streamUrl') || defaultStreamUrl;

const pauseButton = document.querySelector('.pause-btn');
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

// Initialize stream URL input
const streamUrlInput = document.getElementById('stream-url');
if (streamUrlInput) {
    if (streamUrl === defaultStreamUrl) {
        streamUrlInput.placeholder = defaultStreamUrl;
        streamUrlInput.value = '';
    } else {
        streamUrlInput.value = streamUrl;
    }
}

function updateProgressBar() {
    const totalTime = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    if (pomodorosCompleted) {
        pomodorosCompleted.textContent = `Pomodoros completed: ${pomodorosFinished}`;
    }
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    updateProgressBar();
}

function playAlarm() {
    if (enableAlarms) {
        const audio = new Audio('../sounds/alarm.wav');
        audio.play();
    }
}

function showNotification(title, message) {
    if (!enableNotifs || typeof Notification === 'undefined') return;

    if (Notification.permission === 'granted') {
        new Notification(title, { body: message, icon: '../img/celeste.png' });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, { body: message, icon: '../img/celeste.png' });
            }
        });
    }
}

function switchTimer() {
    isWorkTimer = !isWorkTimer;
    timeLeft = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;

    if (isWorkTimer) {
        pomodorosFinished++;
        showNotification('Break over', 'Time to focus');
    } else {
        showNotification('Work session done', 'Time to rest');
    }

    playAlarm();
    updateTimeDisplay();
}

function tick() {
    if (!isPaused && isVideoPlaying) {
        timeLeft--;
        if (timeLeft <= 0) {
            switchTimer();
            return;
        }
        updateTimeDisplay();
    }
}

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

    if (newWorkMinutes > 0 && newBreakMinutes > 0) {
        workMinutes = newWorkMinutes;
        breakMinutes = newBreakMinutes;
        if (isPaused) {
            timeLeft = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
        }
        updateTimeDisplay();
    } else {
        showToast('Values must be greater than 0');
        return;
    }

    if (newUrl === '') {
        streamUrl = defaultStreamUrl;
        localStorage.removeItem('streamUrl');
        document.getElementById('stream-url').value = '';
        document.getElementById('stream-url').placeholder = defaultStreamUrl;
    } else if (newUrl.includes('youtube.com') || newUrl.includes('youtu.be')) {
        streamUrl = newUrl;
        localStorage.setItem('streamUrl', streamUrl);
    } else {
        showToast('Invalid YouTube URL');
        return;
    }

    saveSettings();
    showToast('Settings saved');
});

enableNotifsToggle.addEventListener('change', (e) => {
    enableNotifs = e.target.checked;
});

enableAlarmsToggle.addEventListener('change', (e) => {
    enableAlarms = e.target.checked;
});

function showToast(msg) {
    const el = document.getElementById('toast') || (() => {
        const t = document.createElement('div');
        t.id = 'toast';
        document.body.appendChild(t);
        return t;
    })();
    el.textContent = msg;
    el.classList.remove('hidden');
    el.classList.add('show');
    clearTimeout(el._timer);
    el._timer = setTimeout(() => el.classList.remove('show'), 2000);
}

updateTimeDisplay();

// Stream player
const musicPlayer = document.getElementById('music-player');
const playMusicBtn = document.getElementById('play-music');
const videoPlaceholder = document.getElementById('video-placeholder');
const backBtn = document.getElementById('back-btn');
const loadingMessage = document.getElementById('loading-message');

if (playMusicBtn && musicPlayer && backBtn && loadingMessage) {
    playMusicBtn.addEventListener('click', async () => {
        videoPlaceholder.style.display = 'none';
        loadingMessage.classList.remove('hidden');
        backBtn.classList.remove('hidden');

        try {
            const { ipcRenderer } = require('electron');
            const directStreamUrl = await ipcRenderer.invoke('get-youtube-stream', streamUrl);

            loadingMessage.classList.add('hidden');
            musicPlayer.classList.remove('hidden');

            if (directStreamUrl.includes('.m3u8')) {
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
                        musicPlayer.play();
                        isVideoPlaying = true;
                        isPaused = false;
                        const buttonImg = pauseButton.querySelector('img');
                        buttonImg.src = '../img/pauseButton.png';
                        buttonImg.alt = 'Pause';
                    });

                    hls.on(Hls.Events.ERROR, (event, data) => {
                        if (data.fatal) {
                            loadingMessage.innerHTML = '<p>Stream playback error</p>';
                            loadingMessage.classList.remove('hidden');
                            isVideoPlaying = false;
                        }
                    });

                    musicPlayer.hlsInstance = hls;
                } else if (musicPlayer.canPlayType('application/vnd.apple.mpegurl')) {
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
                musicPlayer.src = directStreamUrl;
                await musicPlayer.play();
                isVideoPlaying = true;
                isPaused = false;
                const buttonImg = pauseButton.querySelector('img');
                buttonImg.src = '../img/pauseButton.png';
                buttonImg.alt = 'Pause';
            }
        } catch (error) {
            loadingMessage.innerHTML = '<p>Error loading stream</p><p>Try again</p>';
            isVideoPlaying = false;

            setTimeout(() => {
                loadingMessage.classList.add('hidden');
                videoPlaceholder.style.display = 'flex';
                backBtn.classList.add('hidden');
            }, 3000);
        }
    });

    backBtn.addEventListener('click', () => {
        musicPlayer.pause();
        isVideoPlaying = false;

        if (musicPlayer.hlsInstance) {
            musicPlayer.hlsInstance.destroy();
            musicPlayer.hlsInstance = null;
        }

        musicPlayer.src = '';
        musicPlayer.classList.add('hidden');
        backBtn.classList.add('hidden');
        loadingMessage.classList.add('hidden');
        videoPlaceholder.style.display = 'flex';
    });
}
