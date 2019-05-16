/*
//https://github.com/pabrahamjr/effective-bassoon.git

/*Steps to design: Initialize the game; control behavior of the game board (cards); then address the bells and whistles
//thanks Mike Wales and Ryan Waite
 * Create a list that holds all of the cards
 */
var cards = ['fa-diamond', 'fa-diamond',//let vs var
            'fa-paper-plane-o', 'fa-paper-plane-o',
            'fa-anchor', 'fa-anchor',
            'fa-bolt', 'fa-bolt',
            'fa-cube', 'fa-cube',
            'fa-leaf', 'fa-leaf',
            'fa-bicycle', 'fa-bicycle',
            'fa-bomb', 'fa-bomb',
          ];

//mike's function generating the cards
function generateCard(card) {
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 //function to initiate the game
function initGame() {
  //mike's variable which stores the ul w/ class .deck from HTML file for storing cards
    var deck = document.querySelector('.deck');
    var cardHTML = shuffle(cards).map(function(card) {
//calls the generateCard function for each card
      return generateCard(card);
    });
    moves = 0;
    //select moveCounter in index0.HTML
    var moveCounter = document.querySelector('.moves');
    moveCounter.innerText = moves;
    deck.innerHTML = cardHTML.join('');
  }
//initialize and start the timer
initGame();
gameTimer();

//global variables; thanks mike; holds all the cards
var allCards = document.querySelectorAll('.card');
//open cards array, starts empty
var openCards = [];
//moveCounter, starts at 0
var moves = 0;
//select moveCounter in index0.HTML
var moveCounter = document.querySelector('.moves');
//select restartGame in index0.HTML
var restartGame = document.querySelector('.fa-repeat');
//select minutes section of HTML stopwatch
var displayMinutes = document.querySelector('.minutes');
//select seconds section of HTML stopwatch
var displaySeconds = document.querySelector('.seconds');
//varible to track milliseconds
var milliseconds = 0;
//var to track matched cards
var matched = 0;
//8 pairs required to win
const winningPairs = 8;
//select modal
const modal = document.querySelector('.modal');
//select yes button
const yesButton = document.querySelector('.play-again');
//select no button
const noButton = document.querySelector('.no-play-again');
var interval;

var starCount = 3;
const three = document.querySelector('.three');
const two = document.querySelector('.two');
const one = document.querySelector('.one');

//event listener for game restart button
restartGame.addEventListener('click', function(e) {
  //remove open, show or match classes from cards
  allCards.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
  });
  //initGame();
  resetGame();
  console.log('restart game');
});

function resetGame(){
  initGame();
  allCards = document.querySelectorAll('.card');
  openCards = [];
  matched = 0;
  addCardEvents();
  resetTimer();
  resetStars();
}

function resetTimer() {
  displayMinutes.innerHTML = "0";
  displaySeconds.innerHTML = "00";
  milliseconds = 0;
}

function startTimer() {
  gameTimer();
}

function pauseTimer() {
  clearInterval(interval);
}
function resetStars() {
  starCount = 3;
  one.style.display = 'inline.block';
  two.style.display = 'inline.block';
  three.style.display = 'inline.block';
}
//timer function
function gameTimer() {
  interval = setInterval(function() {
    milliseconds++;
    convertSeconds(Math.floor(milliseconds));
  }, 1000);
}

//convert milliseconds to minutes, seconds for display
function convertSeconds(milliseconds) {
  var minutes = Math.floor(((milliseconds % 864000) % 3600) / 60);
  var seconds = ((milliseconds % 86400) % 3600) % 60;
  displayMinutes.innerHTML = minutes;
  if(seconds < 10) {
      displaySeconds.innerHTML = "0" + seconds;
  } else {
      displaySeconds.innerHTML = seconds;
    }
  }

//function managing moves and related star rating
function starRating () {
  
  if (moves === 10) {
    three.style.display = 'none';
    starCount = 2;
    console.log('moves = 10');
  } else if (moves === 20) {
    two.style.display = 'none';
    starCount = 1;
    console.log('moves = 20');
  }
  // }else if (moves === 20) {
  //   one.style.display = 'none';
  //   console.log('moves = 20')
  //   }
  }

//mike's event listener for card clicks
function addCardEvents() {
  allCards.forEach(function(card) {
    card.addEventListener('click', function(e) {
//prevents double selecting matches
      if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
//add clicked card to openCards array
        openCards.push(card);
  //adds the open and show classes when cards are clicked
        card.classList.add('open', 'show');

//see if two cards opened match
        if (openCards.length == 2) {
          //if they do match, then add the match, open and show classes
          if (openCards[0].dataset.card == openCards[1].dataset.card) {
              openCards[0].classList.add('match');
              openCards[0].classList.add('open');
              openCards[0].classList.add('show');

              openCards[1].classList.add('match');
              openCards[1].classList.add('open');
              openCards[1].classList.add('show');

              openCards = [];
              //adds 1 to matched variable for each pair of matched cards
              matched++;
             
          } else {
            //If cards don't match, they go away or hide; but how to limit having 3 cards open simultaneously?
              setTimeout(function() {
                openCards.forEach(function(card) {
                  card.classList.remove('open', 'show');
                });
                openCards = []; //Yahya Elharony suggestion
              }, 400);//vs 1000, just shortens the time it shows
              //openCards = [];
            }

            moves += 1;
            moveCounter.innerText = moves;
          }
          starRating();
          if (matched === winningPairs) {
            console.log("Game over!");
            //writes finalStats to modal
            finalStats();
          }
         };
       });
     });
}
addCardEvents();

    function finalStats() {
      const officialTime = document.querySelector('.official-time');
      const officialMoves = document.querySelector('.official-moves');
      const officialStars = document.querySelector('.official-stars');
      const officialMinutes = document.querySelector('.minutes').innerHTML;
      const officialSeconds = document.querySelector('.seconds').innerHTML;
      //const stars = starCount();

      officialTime.innerHTML = 'Time: ' + officialMinutes + ':' + officialSeconds;
      officialMoves.innerHTML = 'Moves: ' + moves;
      officialStars.innerHTML = 'Stars: ' + starCount;

      // function starCount() {
      //   findStars = document.querySelectorAll('.stars li');
      //   finalStars = 0;
      //   for (findStar of findStars) {
      //     if (findStar.style.display !== 'none') {
      //       finalStars++;
      //       officialStars.innerHTML = 'Stars: '  +finalStars;
      //       console.log(finalStars);
      //     }
      //   }
     // }
//displays modal
      modal.style.display = "block";
    }

    //replay button event listener
    yesButton.addEventListener('click', function(e) {
      modal.style.display = 'none';
      resetGame();
      console.log('Restart game');
    });

    //no replay button event listener
    noButton.addEventListener('click', function(e) {
      modal.style.display = 'none';
    });
