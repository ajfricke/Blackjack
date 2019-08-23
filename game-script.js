////////////////////////////////////////////////////////////////////////////////////
// TO-DO:                                                                         //
// [x] - win case for if both player and dealer have 21                           //
// [ ] - fix responsiveness of score and bust                                     //
// [x] - fix button change (from hit to new game) to be more smooth               //
// [ ] - go through DOM variables                                                 //
// [ ] - go through display nones                                                 //
// [ ] - style score better                                                       //
// [ ] - if dealer gets natural blackjack                                         //
//                                                                                //
// NEW FEATURES TO ADD                                                            //
// [ ] - money & betting                                                          //
// [ ] - doubling                                                                 //
// [ ] - music                                                                    //
// [ ] - hand splitting                                                           //
// [ ] - new players                                                              //
////////////////////////////////////////////////////////////////////////////////////

// *Card Variables*
const suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
const values = ['Ace', 'King', 'Queen', 'Jack',
  'Ten', 'Nine', 'Eight', 'Seven', 'Six',
  'Five', 'Four', 'Three', 'Two'
];

// *Game Variables*
let deck;
let playerCards;
let dealerCards;
let playerScore;
let dealerScore;
let darkMode = false;
let playerStands = false;
let hasDealerRevealed = false;
let dealerCard1;
let dealerCard2;
let playerCard1;
let playerCard2;
let playerWon = false;
let tieGame = false;

// *DOM Variables*

// Variables for Dark Mode
const documentBody = document.body;
const pTags = document.getElementsByTagName('p');
const titleText = document.getElementById('title');
const createdByText = document.getElementById('created-by');
const colorModeButton = document.getElementById('change-color');
const blackjackImage = document.getElementById('blackjack-title');

const dealerCardDiv = document.getElementById("dealersHand");
const playerCardDiv = document.getElementById("playersHand");
const winnerArea = document.getElementById('winner-area');
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealerScoreText = document.getElementById('dealerScore');
const playerScoreText = document.getElementById('playerScore');
const footer = document.getElementsByTagName('footer');

const gameUI = document.getElementById("table");
const betUI = document.getElementById("betting");

// Variables for Bust
const bustText = document.getElementsByClassName('bustText');
const bustPlayer = document.getElementById('bustPlayer');
const bustDealer = document.getElementById('bustDealer');

gameUI.style.display = 'none';

newGame();

// *New Game Functions*
// reset variables, populate hands, hide buttons at start of new game
function resetUI() {
  while (dealerCardDiv.firstChild) {
    dealerCardDiv.removeChild(dealerCardDiv.lastChild);
  }
  while (playerCardDiv.firstChild) {
    playerCardDiv.removeChild(playerCardDiv.lastChild);
  }

  winnerArea.style.display = 'none';
  bustPlayer.style.display = 'none';
  bustDealer.style.display = 'none';
  // dealerScoreText.style.display = 'none';
  // playerScoreText.style.display = 'none';
  // hitButton.style.display = 'none';
  // standButton.style.display = 'none';
}

// create new deck of 52 unique cards
function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
      let card = {
        suit: suits[suitIdx],
        value: values[valueIdx]
      };
      deck.push(card);
    }
  }
  return deck;
}

// give two new cards at start of game to player/dealer
function populateHand(emptyArray) {
  emptyArray[0] = getNextCard(randomIndex());
  emptyArray[1] = getNextCard(randomIndex());
}

// get and remove new card from deck
function getNextCard(index) {
  let card = deck[index];
  deck.splice(index, 1);
  return card;
}

// generate random index to 'shuffle' deck
function randomIndex() {
  let deckRemaining = deck.length;
  let randNum = Math.trunc(Math.random() * deckRemaining);
  deckRemaining--;
  return randNum;
}

// generate string of value and suit for card
function getCardString(card) {
  return card.value + ' of ' + card.suit;
}

// *In-Game Functions*
// calculate scores of hands
function getScore(card, score) {
  score += getCardNumericValue(card);
  if (card.value === 'Ace' && score + 10 <= 21) {
    return score + 10;
  }
  return score;
}

// calculate cards' numeric values for score
function getCardNumericValue(card) {
  switch (card.value) {
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}

function getSpriteCardSuitPosition(card) {
  switch(card.suit) {
    case 'Clubs':
      return 0;
    case 'Diamonds':
      return -123;
    case 'Hearts':
      return -246;
    case 'Spades':
      return -369;
  }
}

function getSpriteCardValuePosition(card) {
  switch(card.value) {
    case 'Ace':
      return 0;
    case 'Two':
      return -79;
    case 'Three':
      return -158;
    case 'Four':
      return -237;
    case 'Five':
      return -316;
    case 'Six':
      return -395;
    case 'Seven':
      return -474;
    case 'Eight':
      return -553;
    case 'Nine':
      return -632;
    case 'Ten':
      return -711;
    case 'Jack':
      return -790;
    case 'Queen':
      return -869;
    case 'King':
      return -948;
  }
}

// reveal the dealer's second card in hand
function revealDealerSecondCard() {
  dealerScore = getScore(dealerCards[0], dealerScore);
  dealerScoreText.innerText = 'Dealer: ' + dealerScore;
  displayCard(dealerCard1, dealerCards[0]);
  hasDealerRevealed = true;
}

function displayCard(element, card) {
  element.style.backgroundPosition = getSpriteCardValuePosition(card) + "px " + getSpriteCardSuitPosition(card) + "px";
}

function createPlayerSpanElement(cardCount = playerCards.length) {
  let span = document.createElement("span");
  let className = 'sprite card playerCard' + cardCount;
  span.setAttribute('class', className);
  return document.getElementById("playersHand").appendChild(span);
}

function createDealerSpanElement(cardCount = dealerCards.length) {
  let span = document.createElement("span");
  let className = 'sprite card dealerCard' + cardCount;
  span.setAttribute('class', className);
  return document.getElementById("dealersHand").appendChild(span);
}

// draw a new card for dealer and display it
function dealerDraws() {
  while (dealerScore < 17) {
    let newCard = getNextCard(randomIndex());
    dealerCards.push(newCard);
    dealerScore = getScore(newCard, dealerScore);

    let newSpanElement = createDealerSpanElement();
    displayCard(newSpanElement, newCard);
  }
  dealerScoreText.innerText = 'Dealer: ' + dealerScore;
  checkForWinner();
}

// check possible win scenarios
function checkForWinner() {
  let gameWon = false;

  if (playerScore > 21) {
    gameWon = true;
    bustPlayer.style.display = 'inline-block';
    winnerArea.innerText = 
      'DEALER WINS!';
  }
  else if (dealerScore > 21) {
    gameWon = true;
    playerWon = true;
    bustDealer.style.display = 'inline-block';
    winnerArea.innerText = 
      'PLAYER WINS!';
  }
  else if (playerScore == 21 && dealerScore == 21) {
    gameWon = true;
    tieGame = true;
    winnerArea.innerText =
      'TIE GAME!';
  }
  else if (playerScore == 21) {
    gameWon = true;
    playerWon = true;
    winnerArea.innerText =
      'PLAYER WINS!';
  }
  else if (dealerScore == 21) {
    gameWon = true;
    winnerArea.innerText =
      'DEALER WINS!';
  }

  if (playerStands) {
    if (dealerScore <= 21 && dealerScore > playerScore){
      gameWon = true;
      winnerArea.innerText =
        'DEALER WINS!';
    }
    else if (dealerScore <= 21 && dealerScore < playerScore){
      gameWon = true;
      playerWon = true;
      winnerArea.innerText =
        'PLAYER WINS!';
    }
    else if (dealerScore <= 21 && dealerScore == playerScore){
      gameWon = true;
      tieGame = true;
      winnerArea.innerText =
        'TIE GAME!';
    }
  }

  if (gameWon) {
    if (!hasDealerRevealed) {
      revealDealerSecondCard();
    }
    if (playerWon) {
      betMoney = betMoney*2;
    }
    else {
      betMoney = 0;
    }
    hitButton.style.display = 'none';
    standButton.style.display = 'none';
    winnerArea.style.display = 'block';
    gameWon = false;
  }
}

// *Buttons Clicked*
// new game button clicked
function newGame() {
  resetUI();

  hitButton.style.display = 'block';
  standButton.style.display = 'block';

  colorModeButton.style.display = 'block';
  
  deck = createDeck();
  playerCards = [];
  dealerCards = [];

  playerScore = 0;
  dealerScore = 0;
  hasDealerRevealed = false;

  populateHand(playerCards);
  populateHand(dealerCards);

  dealerScore = getScore(dealerCards[1], dealerScore);
  playerScore = getScore(playerCards[0], playerScore);
  playerScore = getScore(playerCards[1], playerScore);

  dealerScoreText.innerText = 'Dealer: ' + dealerScore;
  playerScoreText.innerText = 'Player: ' + playerScore;
  dealerScoreText.style.display = 'inline-block';
  playerScoreText.style.display = 'inline-block';

  dealerCard1 = createDealerSpanElement(dealerCards.length - 1);
  dealerCard2 = createDealerSpanElement();
  playerCard1 = createPlayerSpanElement(playerCards.length - 1);
  playerCard2 = createPlayerSpanElement();

  displayCard(dealerCard2, dealerCards[1]);
  displayCard(playerCard1, playerCards[0]);
  displayCard(playerCard2, playerCards[1]);

  checkForWinner();
};

// hit button clicked
hitButton.addEventListener('click', function() {
  let newCard = getNextCard(randomIndex());
  playerCards.push(newCard);

  playerScore = getScore(newCard, playerScore);
  playerScoreText.innerText = 'Player: ' + playerScore;

  let newCardDisplay = createPlayerSpanElement();
  displayCard(newCardDisplay, newCard);
  checkForWinner();
});

// stand button clicked
standButton.addEventListener('click', function() {
  playerStands = true;
  revealDealerSecondCard();
  dealerDraws();
  playerStands = false;
});

colorModeButton.addEventListener('click', function() {
  let color1;
  let color2;

  if(!darkMode) {
    darkMode = true;
    color1 = 'black';
    color2 = 'white';
    colorModeButton.innerHTML = 'Light Mode';
    blackjackImage.src = "blackjackimageBLACK.jpg";
  }
  else {
    darkMode = false;
    color1 = 'white';
    color2 = 'black';
    colorModeButton.innerHTML = 'Dark Mode';
    blackjackImage.src = "blackjackimageWHITE.jpg";
  }

  documentBody.style.backgroundColor = color1;
  createdByText.style.color = color1;
  colorModeButton.style.color = color1;
  colorModeButton.style.backgroundColor = color2;
  footer[0].style.backgroundColor = color2;
  
  for (i = 0; i < pTags.length; i++) {
    pTags[i].style.color=color2;
  }

  bustText[0].style.color = "red";
  bustText[1].style.color = "red";
});

const bet1Button = document.getElementById("bet1");
const bet5Button = document.getElementById("bet5");
const bet25Button = document.getElementById("bet25");
const bet50Button = document.getElementById("bet50");
const bet100Button = document.getElementById("bet100");
const bet500Button = document.getElementById("bet500");
const allInButton = document.getElementById("all-in");
const bankText = document.getElementById("bank");
const betMoneyText = document.getElementById("bet-money");
const dealButton = document.getElementById("deal");

var bank;
var betMoney;

resetVariables();
updateBetVariables();

function resetVariables() {
  bank = 1000;
  betMoney = 0;
}

function updateBetVariables() {
  bankText.innerText = 'Bank: $' + bank;
  betMoneyText.innerText = 'Bet: $' + betMoney;

  if (bank < 500) bet500Button.style.display = 'none';
  if (bank < 100) bet100Button.style.display = 'none';
  if (bank < 50) bet50Button.style.display = 'none';
  if (bank < 25) bet25Button.style.display = 'none';
  if (bank < 5) bet5Button.style.display = 'none';
  if (bank < 1) {
    bet1Button.style.display = 'none';
    allInButton.style.display = 'none';
  }
  if (bank <= 0 && betMoney == 0) dealButton.style.display = 'none';
  if (bank > 500) bet500Button.style.display = 'block';
  if (bank > 100) bet100Button.style.display = 'block';
  if (bank > 50) bet50Button.style.display = 'block';
  if (bank > 25) bet25Button.style.display = 'block';
  if (bank > 5) bet5Button.style.display = 'block';
  if (bank > 1) {
    bet1Button.style.display = 'block';
    allInButton.style.display = 'block';
  }
}

bet1Button.addEventListener('click', function() {
  bank--;
  betMoney++;
  updateBetVariables();
});

bet5Button.addEventListener('click', function() {
  bank-=5;
  betMoney+=5;
  updateBetVariables();
});

bet25Button.addEventListener('click', function() {
  bank-=25;
  betMoney+=25;
  updateBetVariables();
});

bet50Button.addEventListener('click', function() {
  bank-=50;
  betMoney+=50;
  updateBetVariables();
});

bet100Button.addEventListener('click', function() {
  bank-=100;
  betMoney+=100;
  updateBetVariables();
});

bet500Button.addEventListener('click', function() {
  bank-=500;
  betMoney+=500;
  updateBetVariables();
});

allInButton.addEventListener('click', function() {
  betMoney+=bank;
  bank = 0;
  updateBetVariables();
});

dealButton.addEventListener('click', function() {
  gameUI.style.display = 'block';
  betUI.style.display = 'none';
  newGame();
});

newGameButton.addEventListener('click', function() {
  gameUI.style.display = 'none';
  betUI.style.display = 'block';
  bank += betMoney;
  console.log(betMoney);
  console.log(bank);
  betMoney = 0;
  updateBetVariables();
  playerWon = false;
});

