"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const FOUND_MATCH_WAIT_MSECS = 800;

const PEOPLE = [
  "nate",
  "nate",
  "cassie",
  "cassie",
  "rue",
  "rue",
  "jules",
  "jules",
  "maddy",
  "maddy",
  "kat",
  "kat",
  "fez",
  "fez",
  "ashtray",
  "ashtray",
  "suze",
  "suze",
  "lexi",
  "lexi",
  "gia",
  "gia",
  "fike",
  "fike",
  "cal",
  "cal",
  "ethan",
  "ethan",
  "faye",
  "faye",
  "leslie",
  "leslie",
  "custer",
  "custer",
  "mouse",
  "mouse",
  "ali",
  "ali",
  "bobbi",
  "bobbi",
];

/**
 * nate
 * cassie
 * rue
 * jules
 * maddy
 * --^ beginner (10 cards)
 * kat
 * fez
 * ashtray
 * suze (cassie mom)
 * lexi (cassie sister)
 * gia (rue sister)
 * fike
 * --^ amateur (24 cards)
 * cal
 * ethan
 * faye
 * leslie (rue's mom)
 * custer (ashtray's killer)
 * mouse
 * ali (rue's sponsor)
 * bobbi
 * --^ expert (40 cards)
 */

const button = document.querySelector("button");
const form = document.querySelector("form");
const radios = document.querySelectorAll("input[name=level]");
const gameBoard = document.getElementById("game");
const score = document.getElementById("guesses");
const noobLabel = document.getElementById("nooblabel");
const amateurLabel = document.getElementById("amateurlabel");
const expertLabel = document.getElementById("expertlabel");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  startGame();
});

let guesses;
let currentScore;

// if (localStorage.lowestScore === undefined) {
//   localStorage.setItem("lowestScore", "");
// } else {
//   best.innerText = localStorage.lowestScore;
// }

if (localStorage.noobBest === undefined) {
  localStorage.setItem("noobBest", "");
} else {
  noobLabel.innerText = "Noob (Best: " + localStorage.noobBest + ")";
}
if (localStorage.amateurBest === undefined) {
  localStorage.setItem("amateurBest", "");
} else {
  amateurLabel.innerText = "Amateur (Best: " + localStorage.amateurBest + ")";
}
if (localStorage.expertBest === undefined) {
  localStorage.setItem("expertBest", "");
} else {
  expertLabel.innerText = "Expert (Best: " + localStorage.expertBest + ")";
}

let selectedLevel;
function startGame() {
  for (const radio of radios) {
    if (radio.checked) {
      selectedLevel = radio.value;
      break;
    }
  }
  button.innerText = "New Game";
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }
  let people;
  if (selectedLevel === "noob") {
    people = PEOPLE.slice(0, 10);
    console.log(people);
    people = shuffle(people);
  } else if (selectedLevel === "amateur") {
    people = PEOPLE.slice(0, 24);
    console.log(people);
    people = shuffle(people);
  } else if (selectedLevel === "expert") {
    people = PEOPLE.slice();
    console.log(people);
    people = shuffle(people);
  } else {
    console.log("ERROR IN LEVEL SELECTION");
  }
  createCards(people);
  guesses = 0;
  score.innerText = guesses;
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - an click listener for each card to handleCardClick
 */

function createCards(people) {
  // const gameBoard = document.getElementById("game");

  for (let person of people) {
    // missing code here ...
    let card = document.createElement("div");
    card.setAttribute("class", person);
    card.setAttribute("data-status", "unflipped");
    card.addEventListener("click", handleCardClick);
    gameBoard.append(card);
  }

  // gameBoard.addEventListener("click", function (e) {
  //   if (COLORS.indexOf(e.target.getAttribute("class")) >= 0) {
  //     handleCardClick(e);
  //   }
  // });
}

/** Flip a card face-up. */

function flipCard(card) {
  // ... you need to write this ...
  // card.innerHTML = `<img src="images/${card.getAttribute("class")}.jpeg">`;
  card.style.backgroundImage = `url("images/${card.getAttribute("class")}.jpeg")`;
  card.style.backgroundSize = "contain";
  card.setAttribute("data-status", "guess");
  card.removeEventListener("click", handleCardClick);

  // console.log(card.style.backgroundColor);
}

/** Flip a card face-down. */

function unFlipCard(card) {
  // ... you need to write this ...
  card.style.backgroundImage = "";
  card.style.backgroundSize = "";
  card.setAttribute("data-status", "unflipped");
  card.addEventListener("click", handleCardClick);
}

/** Handle clicking on a card: this could be first-card or second-card. */

let numberFlipped = 0;

function handleCardClick(evt) {
  // ... you need to write this ...
  // console.log(evt.target);
  guesses++;
  score.innerText = guesses;
  let card = evt.target;
  // flip card and reveal color underneath to match div class
  flipCard(card);

  numberFlipped++;
  console.log(numberFlipped);

  // if its the first card...do nothing
  // if its the second card... compare second flip to first flip
  if (numberFlipped === 2) {
    let unflippedCards = document.querySelectorAll(`[data-status*="unflipped"]`);
    let guessCards = document.querySelectorAll(`[data-status*="guess"]`);

    for (let unflippedCard of unflippedCards) {
      unflippedCard.removeEventListener("click", handleCardClick);
    }

    if (guessCards[0].getAttribute("class") !== guessCards[1].getAttribute("class")) {
      for (let guessCard of guessCards) {
        setTimeout(unFlipCard, FOUND_MATCH_WAIT_MSECS, guessCard);
        setTimeout(reactivateClick, FOUND_MATCH_WAIT_MSECS);
      }
    } else {
      for (let guessCard of guessCards) {
        guessCard.setAttribute("data-status", "flipped");
        reactivateClick();
      }
    }
    numberFlipped = 0;

    function reactivateClick() {
      for (let unflippedCard of unflippedCards) {
        unflippedCard.addEventListener("click", handleCardClick);
      }
    }
  }

  let unflippedCards = document.querySelectorAll(`[data-status*="unflipped"]`);
  if (unflippedCards.length === 0) {
    updateLowestScore();
  }

  // while (numberFlipped === 2) {
  //   for (let unflippedCard of unflippedCards) {
  //     unflippedCard.removeEventListener("click", handleCardClick);
  //   }
  // }

  // if first card class or color is same as second. keep cards face up and make them unclickable
  // if not equal unflip cards.
}

function updateLowestScore() {
  if (selectedLevel === "noob") {
    if (localStorage.noobBest === "") {
      localStorage.noobBest = guesses;
      noobLabel.innerText = "Noob (Best: " + localStorage.noobBest + ")";
    } else if (guesses < parseInt(localStorage.noobBest)) {
      localStorage.noobBest = guesses;
      noobLabel.innerText = "Noob (Best: " + localStorage.noobBest + ")";
    }
  } else if (selectedLevel === "amateur") {
    if (localStorage.amateurBest === "") {
      localStorage.amateurBest = guesses;
      amateurLabel.innerText = "Amateur (Best: " + localStorage.amateurBest + ")";
    } else if (guesses < parseInt(localStorage.amateurBest)) {
      localStorage.amateurBest = guesses;
      amateurLabel.innerText = "Amateur (Best: " + localStorage.amateurBest + ")";
    }
  } else if (selectedLevel === "expert") {
    if (localStorage.expertBest === "") {
      localStorage.expertBest = guesses;
      expertLabel.innerText = "Expert (Best: " + localStorage.expertBest + ")";
    } else if (guesses < parseInt(localStorage.expertBest)) {
      localStorage.expertBest = guesses;
      expertLabel.innerText = "Expert (Best: " + localStorage.expertBest + ")";
    }
  }
}
