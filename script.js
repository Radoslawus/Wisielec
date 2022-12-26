import { prawdyZyciowe, informatyka, filmyISeriale, chemia } from "./categories.js"

const list = document.querySelectorAll('.list li')
const output = document.querySelector('.output')
const startBtn = document.querySelector('.startBtn')
const introScreen = document.querySelector('#intro')
const gameScreen = document.querySelector('#game')
const board = document.querySelector('.board')
const password = document.querySelector('.password')
const categoryInfo = document.querySelector('.categoryInfo')
const letters = ["A", "Ą", "B", "C", "Ć", "D", "E", "Ę", "F", "G", "H", "I", "J", "K", "L", "Ł", "M", "N", "Ń", "O", "Ó", "P", "Q", "R", "S", "Ś", "T", "U", "V", "W", "X", "Y", "Z", "Ź", "Ż"] // could be done easier - create string with all letters, and split it
let properPass, hashedPass, category
let gallowCounter = 0
let screenBolck = true

list.forEach(listItem => {
    listItem.addEventListener('click', () => {
        output.style.color = 'inherit'
        output.textContent = listItem.textContent
        category = listItem.textContent
    })
})

startBtn.addEventListener('click', () => {
    if (!category) {
        output.style.color = 'red'
        output.textContent = 'Najpierw wybierz kategorię!'
    } else {
        output.style.color = 'inherit'
        output.textContent = `Zaczynamy grę w kategorii ${category}`
        setTimeout(() => {
            introScreen.classList.add('hidden')
            gameScreen.classList.remove('hidden')
            createGame(category)
        }, 1000)
    }
})

// gallows part
letters.forEach(letter => {
    let letterBox = document.createElement('div')
    letterBox.classList.add('letterBox')
    letterBox.innerText = letter
    board.append(letterBox)

    letterBox.addEventListener('click', () => {
        checkLetter(letterBox.innerText)
    })
})

// add key listeners
document.addEventListener('keydown', e => {
    // to block working on other screens
    if (screenBolck) return

    // reaction for key push
    letters.forEach(letter => {
        if (e.key.toLocaleUpperCase() == letter.toLocaleUpperCase()) {
            checkLetter(letter.toLocaleUpperCase())
        }
    })
})

function createGame(category) {
    screenBolck = false
        // select category
    let fixedCategory
    if (category == 'Informatyka') {
        fixedCategory = informatyka
    } else if (category == 'Prawdy życiowe') {
        fixedCategory = prawdyZyciowe
    } else if (category == 'Filmy i Seriale') {
        fixedCategory = filmyISeriale
    } else if (category == 'Chemia') {
        fixedCategory = chemia
    } else {
        return
    }

    // select password
    let arrLength = fixedCategory.length
    let randomIndex = Math.floor(Math.random() * arrLength)
    properPass = fixedCategory[randomIndex]

    // hash password
    const passLetters = properPass.split('')
    const hashedLetters = passLetters.map(letter => {
        if (letter != ' ') {
            return '-'
        } else {
            return ' '
        }
    })
    hashedPass = hashedLetters.join('')

    // print hashed password
    password.innerText = hashedPass
    categoryInfo.innerText = `Kategoria: ${category}`
}

function checkLetter(letter) {
    // check if letter is in the password. If yes, mark it green and send letter to reveal password. If no, dissallow letter.
    let hitCounter = 0
    let passArr = Array.from(properPass)
    passArr.forEach(elem => {
        if (elem.toUpperCase() == letter) {
            hitCounter++
        }
    })
    if (hitCounter > 0) {
        proceedSuccess(letter)
        revealLetter(letter)
    } else {
        proceedFail(letter)
    }
}

function revealLetter(revealLetter) {
    // check if any letter in properPassword Array is equal to revealedLetter. Then change the hashedPass
    properPass.split('').forEach((letter, i) => {
        if (letter.toUpperCase() == revealLetter.toUpperCase()) {
            let newPass = hashedPass.split("")
            newPass[i] = revealLetter
            let joinedPass = newPass.join("")
            hashedPass = joinedPass
        }
    })

    // show new hashedPass
    password.innerText = hashedPass

    // check if there is any "-" left in hashedPass
    if (!hashedPass.includes("-")) {
        endgame("success")
    }
}

function proceedSuccess(letter) {
    // play sound
    let successSound = new Audio('./sounds/yes.wav')
    successSound.play()

    // disallow letter
    let letterBoxes = document.querySelectorAll('.letterBox')
    letterBoxes.forEach(letterBox => {
        if (letterBox.textContent == letter) {
            letterBox.classList.add('scored')
        }
    })
}

function proceedFail(letter) {
    // play sound
    let failSound = new Audio('./sounds/no.wav')
    failSound.play()

    // disallow letter
    let letterBoxes = document.querySelectorAll('.letterBox')
    letterBoxes.forEach(letterBox => {
        if (letterBox.textContent == letter) {
            letterBox.classList.add('failed')
        }
    })

    // upgrade picture
    let imgElem = document.querySelector('#gallow')
    gallowCounter++
    if (gallowCounter < 10) {
        imgElem.src = `./img/s${gallowCounter}.jpg`
    } else {
        endgame("fail")
    }
}

function endgame(message) {
    let msg, msgColor
    if (message == "fail") {
        msg = "You Loose!"
        msgColor = "red"
    } else {
        msg = "You Won!"
        msgColor = "green"
    }
    screenBolck = true

    // create modal window with restart game
    const modalBox = document.createElement('div')
    const createModalBox = () => {
        modalBox.className = 'modalFrame'
        modalBox.innerHTML = `
            <div class="modalBox">
                <div style="color: ${msgColor};" class="modalText">${msg}</div>
                <div class="modalText">Start New Game?</div>
                <div class="modalBtn">Start</div>
            </div>
        `
        document.querySelector('body').append(modalBox)
        document.querySelector('.modalBtn').addEventListener('click', () => {
            screenBolck = false // needed?
            location.reload()
        })
    }
    createModalBox()
}

// to do:
// 1. implement mechanizm to score points and buy vowels for hard level
// 2. implement difficulty levels
// 3. Create info screen and nawigation between screens
// 4. meke it as extension (? or add backend) so score can be keep in browser, and save high score - with input userName.