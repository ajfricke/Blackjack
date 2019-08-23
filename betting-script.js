const bet1Button = document.getElementById("bet1");
const bet5Button = document.getElementById("bet5");
const bet25Button = document.getElementById("bet25");
const bet50Button = document.getElementById("bet50");
const bet100Button = document.getElementById("bet100");
const bet500Button = document.getElementById("bet500");
const allInButton = document.getElementById("all-in");
const bankText = document.getElementById("bank");
const betMoneyText = document.getElementById("bet-money");

var bank;
var betMoney;
var newGameVar = true;

if (newGameVar) {
  resetVariables();
  newGameVar = false;
}

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