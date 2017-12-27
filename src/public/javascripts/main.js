//main.js
let deck;
let startString;
let pCards = [];
let cCards = [];
let cScore = 0;
let pScore = 0;

function generateCards() {
    const suits = ['♠', '♥', '♦', '♣'],
        faces = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
        values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
    const deck = [];
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < faces.length; j++) {
            deck.push({
                'suit': suits[i],
                'face': faces[j],
                'value': values[j]
            });
        }
    }
    return deck;
}

function shuffle(deck) {
    let curr = deck.length;
    let temp;
    let rand;

    while (0 !== curr) {

        rand = Math.floor(Math.random() * curr);
        curr -= 1;

        temp = deck[curr];
        deck[curr] = deck[rand];
        deck[rand] = temp;
    }

    return deck;
}

function submitPlay(evt) {
    evt.preventDefault();

    const divs = document.getElementsByTagName("div");
    divs[0].classList.toggle("hidden");
    divs[1].classList.toggle("visible");
    divs[1].style.display = "block";

    deck = generateCards();
    deck = shuffle(deck);

    startString = document.getElementById("startValues").value;
    const startArr = startString.split(",");

    if (startString.length > 0) {
        for (let i = (startArr.length - 1); i >= 0; i--) {
            if (startArr[i] === "A") {
                deck.unshift({
                    'suit': '♥',
                    'face': startArr[i],
                    'value': 11
                });
            } else if (startArr[i] === "K" || startArr[i] === "J" || startArr[i] === "Q") {
                deck.unshift({
                    'suit': '♥',
                    'face': startArr[i],
                    'value': 10
                });
            } else {
                deck.unshift({
                    'suit': '♥',
                    'face': startArr[i],
                    'value': parseInt(startArr[i])
                });
            }
        }
    }
    game();
}

function deal(side) {
    side.push(deck.shift());
}

function hiddenCard() {
    const card = document.createElement("div");
    card.classList.add("card");

    const computer = document.getElementsByClassName("computer");
    computer[0].appendChild(card);
}

function renderP(toRender) {
    const card = document.createElement("div");
    card.classList.add("card");
    const content = document.createTextNode(toRender.face + " " + toRender.suit);
    card.appendChild(content);

    const player = document.getElementsByClassName("player");
    player[0].appendChild(card);
}

function renderC(toRender) {
    const card = document.createElement("div");
    card.classList.add("card");
    const content = document.createTextNode(toRender.face + " " + toRender.suit);
    card.appendChild(content);

    const computer = document.getElementsByClassName("computer");
    computer[0].appendChild(card);
}

function showScores() {
    const scores = document.getElementsByClassName("text");

    pScore = 0;
    cScore = 0;

    for (let i = 0; i < cCards.length; i++) {
        cScore += cCards[i].value;
    }
    for (let i = 0; i < pCards.length; i++) {
        pScore += pCards[i].value;
    }
    const cText = document.createTextNode("Computer - Total:  ?");
    const pText = document.createTextNode("Player - Total: " + pScore);

    scores[0].replaceChild(cText, scores[0].firstChild);
    scores[1].replaceChild(pText, scores[1].firstChild);
}

function endScores() {
    const scores = document.getElementsByClassName("text");

    pScore = 0;
    cScore = 0;

    for (let i = 0; i < cCards.length; i++) {
        cScore += cCards[i].value;
    }
    for (let i = 0; i < pCards.length; i++) {
        pScore += pCards[i].value;
    }
    const cText = document.createTextNode("Computer - Total:  " + cScore);
    const pText = document.createTextNode("Player - Total: " + pScore);

    scores[0].replaceChild(cText, scores[0].firstChild);
    scores[1].replaceChild(pText, scores[1].firstChild);
}

function resetGo() {
    const divs = document.getElementsByTagName("div");
    divs[0].classList.toggle("hidden");
    divs[1].style.display = "none";


    const gameDiv = document.getElementsByClassName("game");
    while (gameDiv[0].firstChild) {
        gameDiv[0].removeChild(gameDiv[0].firstChild);
    }

    cCards = [];
    pCards = [];
}

function hitGo() {
    deal(pCards);
    renderP(pCards[pCards.length - 1]);
    showScores();
    if (pScore > 21) {
        end();
    }
}

function standGo() {
    while (cScore < 17) {
        deal(cCards);
        renderC(cCards[cCards.length - 1]);
        showScores();
    }
    end();
}

function end() {
    const gameDiv = document.getElementsByClassName("game");
    const card = document.getElementsByClassName("card");
    const content = document.createTextNode(cCards[0].face + " " + cCards[0].suit);
    card[0].appendChild(content);

    const btn = document.getElementsByTagName('button');

    btn[0].removeEventListener('click', hitGo);
    btn[1].removeEventListener('click', standGo);

    endScores();

    const bust = document.createElement('p');
    const bustText = document.createTextNode('Player Busted: Player Loses');
    bust.appendChild(bustText);

    const lose = document.createElement('p');
    const loseText = document.createTextNode('Computer Score is Higher: Player Loses');
    lose.appendChild(loseText);

    const win = document.createElement('p');
    const winText = document.createTextNode('Player Wins');
    win.appendChild(winText);

    const tie = document.createElement('p');
    const tieText = document.createTextNode('Tie');
    tie.appendChild(tieText);

    if (cScore > 21 && pScore > 21) {
        //Player loses
        gameDiv[0].appendChild(bust);
    } else if (cScore > 21 && pScore < 22) {
        //Player wins
        gameDiv[0].appendChild(win);
    } else if (cScore < 22 && pScore > 21) {
        //Player loses
        gameDiv[0].appendChild(bust);
    } else if (cScore < 22 && pScore < 22 && cScore > pScore) {
        //Player loses
        gameDiv[0].appendChild(lose);
    } else if (cScore < 22 && pScore < 22 && cScore < pScore) {
        //Player wins
        gameDiv[0].appendChild(win);
    } else {
        //Tie
        gameDiv[0].appendChild(tie);
    }

    const reset = document.createElement('button');
    reset.classList.add("button");
    const resetText = document.createTextNode("Reset");
    reset.appendChild(resetText);

    gameDiv[0].appendChild(reset);

    const q = document.getElementsByTagName('button');

    q[2].addEventListener('click', resetGo);

}

function main() {
    const play = document.getElementsByClassName('playBtn');

    play[0].addEventListener('click', submitPlay);
}

function game() {
    const gameDiv = document.getElementsByClassName("game");
    const comp = document.createElement("div");
    const player = document.createElement("div");
    comp.classList.add("computer");
    player.classList.add("player");

    const cContent = document.createElement('p');
    const pContent = document.createElement('p');
    cContent.classList.add('text');
    pContent.classList.add('text');

    const cText = document.createTextNode("Computer");
    const pText = document.createTextNode("Player");

    cContent.appendChild(cText);
    pContent.appendChild(pText);
    comp.appendChild(cContent);
    player.appendChild(pContent);

    gameDiv[0].appendChild(comp);
    gameDiv[0].appendChild(player);

    const hit = document.createElement('button');
    hit.classList.add("button");
    const stand = document.createElement('button');
    stand.classList.add("button");
    const hitText = document.createTextNode("Hit");
    const standText = document.createTextNode("Stand");
    hit.appendChild(hitText);
    stand.appendChild(standText);

    gameDiv[0].appendChild(hit);
    gameDiv[0].appendChild(stand);

    deal(cCards);
    deal(pCards);
    deal(cCards);
    deal(pCards);

    renderP(pCards[0]);
    renderP(pCards[1]);
    hiddenCard();
    renderC(cCards[1]);
    showScores();

    const btn = document.getElementsByTagName('button');

    btn[0].addEventListener('click', hitGo);
    btn[1].addEventListener('click', standGo);
}

document.addEventListener('DOMContentLoaded', main);
