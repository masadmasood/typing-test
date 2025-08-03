const timer = document.querySelector('.timer');
const mistakes = document.querySelector('.mistakes');
const content = document.querySelector('.content');
const input = document.querySelector('#input');
const start_btn = document.getElementById('start');
const row = document.querySelector('.speed-accuracy');
row.style.display = 'none';


// Generate Random Text & Display 
const API_URL = 'https://api.quotable.io/random?minLength=200&maxLength=300'
const getContent = () => {
    return fetch(API_URL).then(response => response.json()).then(data => data.content)
}

getContent().then(fetchText => {
    const API_CONTENT = document.createTextNode(fetchText);
    content.appendChild(API_CONTENT);
});


// Mistakes Logic
let mistake = 0;
let totalWords = 0;
let correctWords = 0;
const checkMistakes = () => {
    const INPUT_TEXT = input.value.trimEnd();
    const inputArray = INPUT_TEXT.split(' ');

    const CONTENT_TEXT = content.innerText;
    const contentArray = CONTENT_TEXT.split(' ');

    mistake = 0;
    correctWords = 0;
    totalWords = inputArray.length;

    inputArray.forEach((word, index) => {
        if (word !== contentArray[index]) {
            mistake++;
        } else {
            correctWords++;
        }
    });
    mistakes.innerText = mistake;
}

// Typing Logic
let countDown;
let isTimerStarted = false;
const timerCount = () => {
    if (isTimerStarted) return;
    isTimerStarted = true;

    const now = Date.now();
    const then = now + 30000;

    countDown = setInterval(() => {
        const time_left = Math.round((then - Date.now()) / 1000);
        if (time_left < 0) {
            clearInterval(countDown);
            timer.textContent = "0s";
            input.disabled = true;
            checkMistakes();
            const speed = totalWords / 0.5;
            const accuracy = (correctWords / totalWords) * 100;
            document.querySelector('.wpm').innerText = speed;
            document.querySelector('.accuracy').innerText = accuracy.toFixed(2);
            row.style.display = 'flex';
            return;
        }
        timer.textContent = `${time_left}s`;
    }, 1000);
}

// Reset Logic
const reset = () => {
    input.value = '';
    mistake = 0;
    mistakes.innerText = mistake;
    input.disabled = false;

    isTimerStarted = false;
    clearInterval(countDown);
    timer.textContent = '30s';
}

input.addEventListener('input', () => {
    timerCount();
    checkMistakes();
});

start_btn.addEventListener('click', reset);