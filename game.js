let intervalId;
let timeoutId;
let globalTyping;
let isBlurred = false;

const s30 = document.querySelector('.s30');
const s60 = document.querySelector('.s60');
const s90 = document.querySelector('.s90');
const s120 = document.querySelector('.s120');

App();

document.querySelector('.reset-btn').addEventListener('click', () => {
    reload('reset')
})

s30.addEventListener('click', () => {
    reload(s30)
})

s60.addEventListener('click', () => {
    reload(s60)
})

s90.addEventListener('click', () => {
    reload(s90)
})

s120.addEventListener('click', () => {
    reload(s120)
})

function reload(elm){
    document.querySelector('.selected').classList.remove('selected');
    if(elm === 'reset'){
        s30.classList.add('selected');
    }else{
        elm.classList.add('selected');
    }
    focus();
    App();
}

function App(){
    let html = '';

    function letters(word){
        let wordHTML = ''
        word.split('').forEach((letter, i) => {
            if(i == 0){
                wordHTML += `<span class="letter #">${letter}</span>`
            }else if(i == word.length-1){
                wordHTML += `<span class="letter *">${letter}</span>`
            }else{
                wordHTML += `<span class="letter">${letter}</span>`
            }
        })
        return wordHTML;
    }

    const timeCount = document.querySelector('.selected').innerText;
    let wordCount = 43;

    if(timeCount == 60){
        wordCount = 100;
    }else if(timeCount == 90){
        wordCount = 160;
    }else if(timeCount == 120){
        wordCount = 200;
    }

    for(let i = 0; i < wordCount; i++){
        let word = '';
        word = para[Math.floor(Math.random()*para.length)]
        html += `<div class="word">${letters(word)}</div>`
    }

    document.querySelector('.js-main-para').innerHTML = html;
    document.querySelector('.letter').classList.add('current')
    document.querySelector('.word').classList.add('current')

    const firstLetter = document.querySelector('.letter.current')
    const initial = firstLetter.innerHTML;
    firstLetter.innerHTML = `<span class="cursor active"></span>${initial}`

    let correctWords = 0;
    let correctLetters = 0;
    let totalLetters = 0;
    let isRunning = false;

    function typing(event) {

        if(isBlurred) return;

        if(!isRunning && event.key.length === 1){
            timer();
            isRunning = true;
        }

        const curLetter = document.querySelector('.letter.current');
        const curWord = document.querySelector('.word.current');
        const cursor = document.querySelector('.cursor');
        const key = event.key;
        const isLetter = key.length === 1 && key !== ' ';

        if(key === 'Backspace'){

            if(curLetter.classList.contains('#')){
                return;
            }

            cursor.remove();

            if(curLetter.classList.contains('*') && isLast()){

                if(isLast() === 1){
                    curLetter.classList.remove('correct');
                }else{
                    curLetter.classList.remove('wrong');
                }

                const letter = document.querySelector('.letter.current')
                const text = letter.innerText;
                letter.innerHTML = `<span class="cursor"></span>${text}`

            } else if(curLetter.classList.contains('extra')){

                curLetter.previousSibling.classList.add('current');
                curLetter.remove();
                const letter = document.querySelector('.letter.current');
                const text = letter.innerText;
                letter.innerHTML = `${text}<span class="cursor"></span>`

            } else {

                curLetter.previousSibling.classList.add('current');
                curLetter.classList.remove('current');
                const activeLetter = document.querySelector('.letter.current')

                if(activeLetter.classList.contains('correct')){
                    activeLetter.classList.remove('correct')
                }else{
                    activeLetter.classList.remove('wrong')
                }

                const text = activeLetter.innerText;
                activeLetter.innerHTML = `<span class="cursor"></span>${text}`
            }

        }

        if(key === ' '){

            if(document.querySelector('.word.current .wrong') || 
            document.querySelector('.word.current .extra') || isSkipped()){
                curWord.classList.add('wrong-word');
                correctWords--;
            }

            curLetter.classList.remove('current');
            curWord.nextElementSibling.classList.add('current');
            curWord.classList.remove('current');
            document.querySelector('.word.current .letter').classList.add('current');
            cursor.remove();
            const activeLetter = document.querySelector('.letter.current');
            const text = activeLetter.innerText;
            activeLetter.innerHTML = `<span class="cursor"></span>${text}`
            correctWords++;

        }

        if(isLetter){

            if(curLetter.classList.contains('*') || curLetter.classList.contains('extra')){

                if(curLetter.classList.contains('correct') || 
                curLetter.classList.contains('wrong') || curLetter.classList.contains('extra')){
                    cursor.remove();
                    curWord.innerHTML += 
                    `<span class="letter extra">${key}<span class="cursor"></span></span>`
                    activeLetter = document.querySelector('.letter.current');
                    activeLetter.nextElementSibling.classList.add('current');
                    activeLetter.classList.remove('current');
                }

                if(key === curLetter.innerText){
                    curLetter.classList.add('correct');
                    correctLetters += 1;
                } else{
                    curLetter.classList.add('wrong');
                }
                totalLetters += 1;
                cursor.remove();
                curLetter.innerHTML += `<span class="cursor"></span>`
                return;
            }

            if(key === curLetter.innerText){
                correctLetters += 1;
                curLetter.classList.add('correct')
                curLetter.nextElementSibling.classList.add('current')
                curLetter.classList.remove('current')
            } else {
                curLetter.classList.add('wrong')
                curLetter.nextElementSibling.classList.add('current')
                curLetter.classList.remove('current')
            }
            cursor.remove();
            const newLetter = document.querySelector('.letter.current');
            const text = newLetter.innerText;
            newLetter.innerHTML = `<span class="cursor"></span>${text}`
            totalLetters += 1;
        }
        
        function isSkipped() {
            const word = curWord.querySelector('.\\*')
            return !(word.classList.contains('correct') || word.classList.contains('wrong'));
        }

        function isLast() {
            if(curLetter.classList.contains('correct')){
                return 1;
            }else if(curLetter.classList.contains('wrong')){
                return 2;
            }
            return 0;
        }
    }

    if (globalTyping) {
    document.removeEventListener('keyup', globalTyping);
    }
    globalTyping = typing;
    document.addEventListener('keyup', globalTyping);

    function timer(){

        if(intervalId) clearInterval(intervalId);
        if(timeoutId) clearTimeout(timeoutId);

        const selectedTime = document.querySelector('.selected').innerHTML;
        let time = selectedTime;
        document.querySelector('.time').innerHTML = time;
        document.querySelector('.time').classList.add('timer');

        intervalId = setInterval(() => {
            time -= 1;
            document.querySelector('.timer').innerHTML = time;
        }, 1000)

        timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            isRunning = false;
            document.removeEventListener('keyup', globalTyping)
            document.querySelector('.result').innerHTML = `
                <div class="wpm-result">
                    <div class="wpm">wpm</div>
                    ${Math.ceil(correctWords*(60/selectedTime))}
                </div>
                <div class="acc-result">
                    <div class="acc">acc</div>
                    ${accuracy(correctLetters, totalLetters)}%
                </div>
                <div class="time-result">
                    <div class="user-time">time</div>
                    ${selectedTime}s
                </div>
            `;
        }, selectedTime*1000)
    }

    function accuracy(correctLetters, totalLetters){
        if(correctLetters === totalLetters){
            return 100;
        }else{
            return ((correctLetters/totalLetters)*100).toFixed(2);
        }
    }
}

function focus(){

    isBlurred = true;

    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);

    const timer = document.querySelector('.time');
    if(timer.classList.contains('timer')){
        timer.classList.remove('timer');
    }

    if (globalTyping) {
        document.removeEventListener('keyup', globalTyping);
    }

    document.querySelector('.result').innerHTML = '';

    const para = document.querySelector('.js-main-para');
    const focus_js = document.querySelector('.focus-js');
    focus_js.classList.add('warn');
    focus_js.innerHTML = `Click here to focus`;
    para.classList.add('blur');

    para.onclick = () => {
            para.classList.remove('blur');
            focus_js.classList.remove('warn');
            focus_js.innerHTML = '';
            isBlurred = false;
    }
}