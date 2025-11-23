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

if (browser && browser.storage) {
    browser.storage.local.get(['workMinutes', 'breakMinutes', 'enableAlarms', 'enableNotifs']).then((result) => {
        if (result.workMinutes) {
            workMinutes = result.workMinutes;
            document.querySelector('#work-length').value = workMinutes;
        }
        if (result.breakMinutes) {
            breakMinutes = result.breakMinutes;
            document.querySelector('#break-length').value = breakMinutes;
        }
        if (result.enableAlarms !== undefined) {
            enableAlarms = result.enableAlarms;
            enableAlarmsToggle.checked = enableAlarms;
        }
        if (result.enableNotifs !== undefined) {
            enableNotifs = result.enableNotifs;
            enableNotifsToggle.checked = enableNotifs;
        }
        timeLeft = workMinutes * 60;
        updateTimeDisplay();
    });
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
    if (enableNotifs && browser && browser.notifications) {
        browser.notifications.create({
            type: 'basic',
            iconUrl: browser.runtime.getURL('img/heart.png'),
            title: title,
            message: message
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
        
        if (browser && browser.storage) {
            browser.storage.local.set({
                workMinutes: workMinutes,
                breakMinutes: breakMinutes
            });
        }
    }
});

enableNotifsToggle.addEventListener('change', (e) => {
    enableNotifs = e.target.checked;
    if (browser && browser.storage) {
        browser.storage.local.set({ enableNotifs: enableNotifs });
    }
});

enableAlarmsToggle.addEventListener('change', (e) => {
    enableAlarms = e.target.checked;
    if (browser && browser.storage) {
        browser.storage.local.set({ enableAlarms: enableAlarms });
    }
});

updateTimeDisplay();
