// Timer Placeholder
let minutesPlaceholder = document.querySelector('#minute');
let secondsPlaceholder = document.querySelector('#second');

// Timer Type Buttons
let btnPomodoro = document.querySelector('#btnPomodoro');
let btnShortBreak = document.querySelector('#btnShortBreak');
let btnLongBreak = document.querySelector('#btnLongBreak');

// Control Buttons
let btnStart = document.querySelector('#start');
let btnStop = document.querySelector('#stop');
let btnReset = document.querySelector('#reset');

// If setInterval is running
isTimerRunning = false;

// Timer presets in seconds
let pomodoro = 25 * 60; // 25 mins
let shortBreak = 5 * 60; // 5 mins
let longBreak = 20 * 60; // 20 mins

let timerModes = {
    "pomodoro": pomodoro,
    "shortBreak": shortBreak,
    "longBreak": longBreak
};

// Currently set timer
let timerSet = pomodoro;
let resetReference = timerSet;

// Interval for timer
let intervalId;

let time = parseTime(resetReference);
updateView([time.inMinutes, time.inSeconds], [minutesPlaceholder, secondsPlaceholder]);

/**
 * Buttons Event Listeners
 */

// CONTROLS BUTTONS
// Start button
btnStart.addEventListener('click', function() {
    if (!isTimerRunning) {
        // Start the timer
        intervalId = setInterval(timer, 1000);
        isTimerRunning = true;
        this.disabled = true
        btnStop.disabled = false;
    }
});

// Stop/Pause button
btnStop.addEventListener('click', function() {
    if (isTimerRunning) {
        // Pause the timer
        clearInterval(intervalId);
        isTimerRunning = false;
        this.disabled = true
        btnStart.disabled = false;
    }
});

// Reset button
btnReset.addEventListener('click', function() {
    if (timerSet !== resetReference) {
        timerSet = resetReference;
        isTimerRunning = false;
        this.disabled = true;
        btnStop.disabled = true;
        btnStart.disabled = false;
        clearInterval(intervalId);
        let parsedTime = parseTime(resetReference);
        updateView([parsedTime.inMinutes, parsedTime.inSeconds], [minutesPlaceholder, secondsPlaceholder]);
    }
});

// TIMER MODE RADIO BUTTONS
// To change timer modes
let radios = document.querySelectorAll('input[type=radio]');

radios.forEach(function(radio) {
    radio.addEventListener('click', function() {
        setMode(radio.value);
    });
});

/**
 * Functions
 */

// Updates HTML element with a text value
// timeArr's length must match placeholderElements length or number of element/s
function updateView(timeArr = [], placeholderElements = []) {
    if (timeArr.length === placeholderElements.length) {
        for (let i = 0; i < timeArr.length; i++) {
            placeholderElements[i].textContent = timeArr[i];
        }
    }
    // placeholderElements[0].textContent = timeArr[0];
    // placeholderElements[1].textContent = timeArr[1];
}

function setMode(mode = 'pomodoro') {
    timerSet = timerModes[mode];
    resetReference = timerSet;

    isTimerRunning = false;

    btnReset.disabled = true;
    btnStop.disabled = true;
    btnStart.disabled = false;
    clearInterval(intervalId);
    let parsedTime = parseTime(resetReference);
    updateView([parsedTime.inMinutes, parsedTime.inSeconds], [minutesPlaceholder, secondsPlaceholder]);
}

// Extracts minutes and seconds values from a given time in seconds
function parseTime(setTime = 0) {
    let mins = Math.floor(setTime / 60);
    let secs = setTime % 60;

    // Add '0' to the beginning of string if the variables length == 1
    // e.g.: 1:4 -> 01:04
    let minsStr = mins.toString().length == 1 ? '0'+mins.toString() : mins.toString();
    let secsStr = secs.toString().length == 1 ? '0'+secs.toString() : secs.toString();

    return {
        inMinutes: minsStr,
        inSeconds: secsStr
    };
}

// Timer task for realtime updates
function timer() {
    timerSet--;

    if (timerSet === resetReference)
        btnReset.disabled = true;
    else
        btnReset.disabled = false;

    let parsedTime = parseTime(timerSet);
    
    // Update view with parsed time data
    updateView([parsedTime.inMinutes, parsedTime.inSeconds], [minutesPlaceholder, secondsPlaceholder]);

    // Stop the timer when it reaches 00:00 mark
    if (timerSet == 0) {
        clearInterval(intervalId);
        btnStart.disabled = true;
        btnStop.disabled = true;
        btnReset.disabled = false;
    }
};