const defaultWorkMinutes = 25;
const defaultBreakMinutes = 5;

let workMinutes = defaultWorkMinutes;
let breakMinutes = defaultBreakMinutes;
let isPaused = true;
let isWorkTimer = true;
let timeLeft = workMinutes * 60;
let pomodorosFinished = 0;

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

function updateTimeDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
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
    if (!isPaused) {
        timeLeft--;
        
        if (timeLeft < 0) {
            switchTimer();
        }
        
        updateTimeDisplay();
    }
}

setInterval(tick, 1000);

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

document.querySelector('#save-button').addEventListener('click', () => {
    const newWorkMinutes = parseInt(document.querySelector('#work-length').value);
    const newBreakMinutes = parseInt(document.querySelector('#break-length').value);
    
    if (newWorkMinutes > 0 && newBreakMinutes > 0) {
        workMinutes = newWorkMinutes;
        breakMinutes = newBreakMinutes;
        
        timeLeft = isWorkTimer ? workMinutes * 60 : breakMinutes * 60;
        updateTimeDisplay();
        
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('nihongolofi-settings', JSON.stringify({
                workMinutes: workMinutes,
                breakMinutes: breakMinutes,
                enableAlarms: enableAlarms,
                enableNotifs: enableNotifs
            }));
        }
    }
});

enableNotifsToggle.addEventListener('change', (e) => {
    enableNotifs = e.target.checked;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nihongolofi-settings', JSON.stringify({
            workMinutes: workMinutes,
            breakMinutes: breakMinutes,
            enableAlarms: enableAlarms,
            enableNotifs: enableNotifs
        }));
    }
});

enableAlarmsToggle.addEventListener('change', (e) => {
    enableAlarms = e.target.checked;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('nihongolofi-settings', JSON.stringify({
            workMinutes: workMinutes,
            breakMinutes: breakMinutes,
            enableAlarms: enableAlarms,
            enableNotifs: enableNotifs
        }));
    }
});

updateTimeDisplay();

// Handle play music button
const musicPlayer = document.getElementById('music-player');
const playMusicBtn = document.getElementById('play-music');
const videoPlaceholder = document.getElementById('video-placeholder');

// Try different embed sources (in order of compatibility)
const musicSources = [
    // Twitch is usually more permissive with embeds
    'https://player.twitch.tv/?channel=chillsynth&parent=localhost&muted=false&autoplay=true',
    // SoundCloud embed
    'https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/chilledcow/sets/lofi-hip-hop-radio&color=%23ff5500&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
    // Radio Garden
    'https://radio.garden/visit/tokyo/OKbJBjgP',
    // Poolside FM
    'https://poolside.fm/',
    // YouTube as fallback
    'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0&controls=1'
];

if (playMusicBtn && musicPlayer) {
    playMusicBtn.addEventListener('click', () => {
        // Hide placeholder
        videoPlaceholder.style.display = 'none';
        
        // Show and load player with first source (Twitch)
        musicPlayer.classList.remove('hidden');
        musicPlayer.src = musicSources[0];
    });
}
