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
let gameWon;
let playerWon;
let newGame;
let playerHit = false;
let hitCount = 0;
let dealerDrawCount = 0;

// *DOM Variables*
const dealerCardDiv = document.getElementById("dealersHand");
const playerCardDiv = document.getElementById("playersHand");
const winnerArea = document.getElementById('winner-area');
const newGameButton = document.getElementById('new-game-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const endButton = document.getElementById('end-game-button');

let dealerCard1;
let dealerCard2;
let playerCard1;
let playerCard2;

hitButton.style.display = 'none';
standButton.style.display = 'none';
endButton.style.display = 'none';

// *New Game Functions*
// reset variables, populate hands, hide buttons at start of new game
function startGame() {
  deck = createDeck();
  playerCards = [];
  dealerCards = [];

  populateHand(playerCards);
  populateHand(dealerCards);

  while (dealerCardDiv.firstChild) {
    dealerCardDiv.removeChild(dealerCardDiv.firstChild);
  }
  while (playerCardDiv.firstChild) {
    playerCardDiv.removeChild(playerCardDiv.firstChild);
  }

  dealerCard1 = createDealerSpanElement(dealerCards.length - 1);
  dealerCard2 = createDealerSpanElement();
  playerCard1 = createPlayerSpanElement(playerCards.length - 1);
  playerCard2 = createPlayerSpanElement();

  playerScore = 0;
  dealerScore = 0;
  hitCount = 0;
  gameWon = false;
  playerHit = false;
  newGame = true;
  
  winnerArea.style.display = 'none';
  endButton.style.display = 'none';
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

// show player and dealer cards
// FIX
function showCards() {
  dealerCardsText = 'Dealer has:\n';
  playerCardsText = 'Player has:\n';
  
  for (let i = 0; i < dealerCards.length; i++){
    dealerCardsText += getCardString(dealerCards[i]) + '\n';
  }
  dealerCardsText += '(Score: ' + dealerScore + ')\n' + '\n';

  for (let i = 0; i < playerCards.length; i++){
    playerCardsText += getCardString(playerCards[i]) + '\n';
  }
  playerCardsText += '(Score: ' + playerScore + ')\n';
}

// reveal the dealer's second card in hand
function revealDealerSecondCard() {
  dealerScore = getScore(dealerCards[0], dealerScore);
  displayCard(dealerCard1, dealerCards[0]);
  hasDealerRevealed = true;
}

// give player a new card and display it
function hit() {
  hitCount++;
  let newCard = getNextCard(randomIndex());
  playerCards.push(newCard);
  playerScore = getScore(newCard, playerScore);

  let newCardDisplay = createPlayerSpanElement();
  displayCard(newCardDisplay, newCard);
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
    dealerDrawCount++;
    let newCard = getNextCard(randomIndex());
    dealerCards.push(newCard);
    dealerScore = getScore(newCard, dealerScore);

    let newSpanElement = createDealerSpanElement();
    displayCard(newSpanElement, newCard);

    checkForWinner();
  }
  showCards();
}

// check possible win scenarios
function checkForWinner() {
  if (playerScore > 21) {
    gameWon = true;
    winnerArea.innerText =
      // 'Player busts. 
      'DEALER WINS!';
  }
  else if (dealerScore > 21) {
    gameWon = true;
    winnerArea.innerText =
      //'Dealer busts. 
      'PLAYER WINS!';
  }
  if (playerHit || newGame){
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
  }
  else {
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
}

// *Buttons Clicked*
// new game button clicked
newGameButton.addEventListener('click', function() {
  newGameButton.style.display = 'none';
  hitButton.style.display = 'block';
  standButton.style.display = 'block';
  
  startGame();

  dealerScore = getScore(dealerCards[1], dealerScore);
  playerScore = getScore(playerCards[0], playerScore);
  playerScore = getScore(playerCards[1], playerScore);

  dealerCard2.style.backgroundPosition = getSpriteCardValuePosition(dealerCards[1]) + "px " + getSpriteCardSuitPosition(dealerCards[1]) + "px";
  playerCard1.style.backgroundPosition = getSpriteCardValuePosition(playerCards[0]) + "px " + getSpriteCardSuitPosition(playerCards[0]) + "px";
  playerCard2.style.backgroundPosition = getSpriteCardValuePosition(playerCards[1]) + "px " + getSpriteCardSuitPosition(playerCards[1]) + "px";

  checkForWinner();
  if (gameWon){
    hitButton.style.display = 'none';
    standButton.style.display = 'none';
    newGameButton.style.display = 'block';
    endButton.style.display = 'block';
    winnerArea.style.display = 'block';
    showCards();
  }
  newGame = false;
});

// hit button clicked
hitButton.addEventListener('click', function() {
  playerHit = true;
  
  hit();
  showCards();
  checkForWinner();

  playerHit = false;
  
  if (gameWon){
    revealDealerSecondCard();
    hitButton.style.display = 'none';
    standButton.style.display = 'none';
    newGameButton.style.display = 'block';
    endButton.style.display = 'block';
    winnerArea.style.display = 'block';
  }
});

// stand button clicked
standButton.addEventListener('click', function() {
  hitButton.style.display = 'none';
  standButton.style.display = 'none';
  newGameButton.style.display = 'block';
  endButton.style.display = 'block';
  winnerArea.style.display = 'block';

  revealDealerSecondCard();
  checkForWinner();
  dealerDraws();
});

// end game button clicked
endButton.addEventListener('click', function() {
  endButton.style.display = 'none';
  winnerArea.style.display = 'none';

  while (dealerCardDiv.firstChild) {
    dealerCardDiv.removeChild(dealerCardDiv.firstChild);
  }
  while (playerCardDiv.firstChild) {
    playerCardDiv.removeChild(playerCardDiv.firstChild);
  }
});