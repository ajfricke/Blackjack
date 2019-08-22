////////////////////////////////////////////////////////////////////////////////////
// TO-DO:                                                                         //
// [ ] - win case for if both player and dealer have 21                           //
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
let dealerChildCount;
let playerChildCount;

// *DOM Variables*

// Variables for Dark Mode
const documentBody = document.body;
const pTags = document.getElementsByTagName('p');
const titleText = document.getElementById('title');
const createdByText = document.getElementById('created-by');
const colorModeButton = document.getElementById('change-color');

const dealerCardDiv = document.getElementById("dealersHand");
const playerCardDiv = document.getElementById("playersHand");
const winnerArea = document.getElementById('winner-area');
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const dealerScoreText = document.getElementById('dealerScore');
const playerScoreText = document.getElementById('playerScore');
const footer = document.getElementsByTagName('footer');

// Variables for Bust
const bustText = document.getElementsByClassName('bustText');
const bustPlayer = document.getElementById('bustPlayer');
const bustDealer = document.getElementById('bustDealer');

resetUI();

// *New Game Functions*
// reset variables, populate hands, hide buttons at start of new game
function resetUI() {
  while (dealerChildCount > 0) {
    dealerCardDiv.removeChild(dealerCardDiv.lastChild);
    dealerChildCount--;
  }
  while (playerChildCount > 0) {
    playerCardDiv.removeChild(playerCardDiv.lastChild);
    playerChildCount--;
  }

  winnerArea.style.display = 'none';
  bustPlayer.style.display = 'none';
  bustDealer.style.display = 'none';
  dealerScoreText.style.display = 'none';
  playerScoreText.style.display = 'none';
  hitButton.style.display = 'none';
  standButton.style.display = 'none';
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
  playerChildCount++;
  return document.getElementById("playersHand").appendChild(span);
}

function createDealerSpanElement(cardCount = dealerCards.length) {
  let span = document.createElement("span");
  let className = 'sprite card dealerCard' + cardCount;
  span.setAttribute('class', className);
  dealerChildCount++;
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
    bustDealer.style.display = 'inline-block';
    winnerArea.innerText = 
      'PLAYER WINS!';
  }
  if (playerScore == 21) {
    gameWon = true;
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
      winnerArea.innerText =
        'PLAYER WINS!';
    }
    else if (dealerScore <= 21 && dealerScore == playerScore){
      gameWon = true;
      winnerArea.innerText =
        'TIE GAME!';
    }
  }

  if (gameWon) {
    if (!hasDealerRevealed) {
      revealDealerSecondCard();
    }
    
    hitButton.style.display = 'none';
    standButton.style.display = 'none';
    newGameButton.style.display = 'block';
    winnerArea.style.display = 'block';
    gameWon = false;
  }
}

// *Buttons Clicked*
// new game button clicked
newGameButton.addEventListener('click', function() {
  resetUI();
  
  newGameButton.style.display = 'none';
  hitButton.style.display = 'block';
  standButton.style.display = 'block';
  
  deck = createDeck();
  playerCards = [];
  dealerCards = [];

  playerScore = 0;
  dealerScore = 0;
  dealerChildCount = 0;
  playerChildCount = 0;
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
});

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
  }
  else {
    darkMode = false;
    color1 = 'white';
    color2 = 'black';
    colorModeButton.innerHTML = 'Dark Mode';
  }

  documentBody.style.backgroundColor=color1;
  titleText.style.color = color2;
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

