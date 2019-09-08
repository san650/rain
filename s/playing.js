import video, { randomVideo } from '../c/video.js';
import osd from '../c/osd.js';
import {random, randomFrom} from '../l/random.js';
import WORDS from '../l/words.js';

function createState(game) {
  return {
    currentWord: "",
    missed: 0,
    counter: 0,
    hits: 0,
    target: 10
  };
}

function setState(oldState, newState, onStateChanged) {
  var state = {
    ...oldState,
    newState
  };

  onStateChanged(state);

  return state;
}

export default function(game, transitionTo) {
  var currentInterval;
  var container;
  var keyPressEventHandler;
  var animationEndEventHandler;
  var state = createState(game);
  var wordGenerator = levelWordGenerator(game.level, WORDS);

  return {
    enter: () => {
      function onStateChanged(state) {
        // end conditions
        if (game.lives - state.missed <= 0) {
          transitionTo(game, 'gameOver');
        }

        // render lives
        livesElement.innerText = '♡ ' + Math.max(game.lives - state.missed, 0);
      }

      function missedLetter() {
        container.classList.add('shake');
      }

      function hit(value) {
        game.points += value;
        pointsElement.innerText = game.points;
      }

      function hitElement(element) {
        element.classList.add('hit');
        hit(Number(element.dataset.value));
      }

      document.body.innerHTML = `
        ${video(randomVideo())}
        <div id="canvas" class="container" tabindex=0></div>
        ${osd(game, state)}
      `;
      container = document.getElementById('canvas');
      var livesElement = document.getElementById('lives');
      var pointsElement = document.getElementById('points');
      var wordsElement = document.getElementById('words');

      var POWERS = {
        clean: () => {
          // hit all!
          byCSS(document, '.word').forEach(hitElement);
        },
        '1up': (element) => {
          game.lives++;
          state = setState(state, {}, onStateChanged);
          hitElement(element);
        },
        reverse: (element) => {
          hitElement(element);
          container.classList.toggle('reverse');
        },
        roll: (element) => {
          hitElement(element);
          container.classList.toggle('roll');
        }
      };

      function randomPower() {
        var powers = Object.keys(POWERS);
        return powers[random(powers.length)];
      }

      function updateLevelWordCount() {
        wordsElement.innerText = state.target - state.hits;
      }

      currentInterval = window.setInterval(function generator() {
        if (!document.hasFocus()) {
          return;
        }

        state.counter++;

        var candidate = wordGenerator();

        if (game.level > 3 && state.counter % 10 === 0) {
          candidate = randomPower();
        }

        createWord(container, toWord(candidate));
      }, 1000);

      // cleanup
      //
      animationEndEventHandler = function(event) {
        switch(event.animationName) {
          case "rain":
            state = setState(state, {
              missed: state.missed++
            }, onStateChanged);
            deleteElement(event.target);
            container.classList.add('shake');
            break;
          case "hit":
            deleteElement(event.target);
            break;
          case "shake":
          case "roll":
            container.classList.remove(event.animationName);
            break;
        }
      }

      container.addEventListener("animationend", animationEndEventHandler, false);

      keyPressEventHandler = function(event) {
        if (container.matches('.shake')) {
          return;
        }

        var key = event.key.toUpperCase();

        state.currentWord += key;

        var words = byCSS(document, '[data-word^="' + state.currentWord + '"]:not(.hit)');
        var letter;
        var wordHits = 0;
        var letterHits = 0;

        clean(state.currentWord);

        if (!words.length) {
          missedLetter();
        } else {
          words.forEach((word) => {
            letter = word.querySelector('.letter[data-symbol="' + key + '"]:not(.hit)');

            if (letter) {
              letter.classList.add('hit');
              letterHits++;
            }

            if (word.matches('[data-word="' + state.currentWord + '"]:not(.hit)')) {
              var power;
              if (power = POWERS[state.currentWord.toLowerCase()]) {
                power(word);
              } else {
                hitElement(word);
              }
              wordHits++;
              state.hits++;
              updateLevelWordCount();

              if (state.hits >= state.target) {
                transitionTo(game, 'nextLevel');
              }
            }
          });
        }

        if (letterHits === 0) {
          state.currentWord = "";
          missedLetter();
        }

        if (wordHits === words.length) {
          state.currentWord = "";
        }
      }

      // keyboard
      container.addEventListener("keypress", keyPressEventHandler, false);

      container.focus();
    },

    exit: () => {
      window.clearInterval(currentInterval);
      container.removeEventListener("keypress", keyPressEventHandler, false);
      container.removeEventListener("animationend", animationEndEventHandler, false);
    }
  };
}

function createWord(container, word) {
  var span = document.createElement('span');
  span.setAttribute('data-word', word.value);
  span.setAttribute('data-value', word.letters.reduce((sum, letter) => sum + letter.value, 0));
  span.style.left = word.x;
  span.classList.add('word');
  span.classList.add('rain');
  span.classList.add(word.color);
  span.classList.add('d' + word.duration);

  word.letters.forEach((letter) => createLetter(span, letter));

  container.appendChild(span);
}

function createLetter(parent, letter) {
  var span = document.createElement('span');
  span.setAttribute('data-symbol', letter.symbol);
  span.setAttribute('data-symbol-value', letter.value);
  span.classList.add('letter');

  parent.appendChild(span);
}

function randomPercentage() {
  // Use less than 100 so it doesn't overflow on the right
  return String(Math.min(random(100), 60)) + '%';
}

function randomDuration() {
  return random(10);
}

var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ\'!1';
var VALUES =  [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10,10,10,1];
var COLORS = [
  "blue",
  "green",
  "red",
  "white",
  "yellow",
];

function randomColor() {
  return randomFrom(COLORS);
}

function valueForSymbol(symbol) {
  var index = LETTERS.indexOf(symbol);
  return VALUES[index];
}

function toWord(word) {
  word = word.toUpperCase();

  var letters = word.split("").map(letter => ({
    symbol: letter,
    value: valueForSymbol(letter),
  }));

  return {
    duration: randomDuration(),
    letters: letters,
    value: word,
    color: randomColor(),
    x: randomPercentage(),
  };
}

function byCSS(element, selector) {
  return Array.from(element.querySelectorAll(selector));
};

function clean(currentWord) {
  byCSS(document, `.word:not([data-word^="${currentWord}"]):not(.hit) .letter.hit`).forEach((element) => {
    element.classList.remove('hit');
  });
}

function deleteElement(element) {
  var container = element.parentElement;
  container.removeChild(element);
}

function randomWordGenerator(words) {
  return () => randomFrom(words);
}

function levelWordGenerator(level, words) {
  let generator;

  switch(level) {
    case 1:
    case 2:
    case 3:
      generator = randomWordGenerator(words.filter((w) => w.length <= 4));
      break;
    case 4:
    case 5:
    case 6:
      generator = randomWordGenerator(words.filter((w) => w.length <= 5));
      break;
    case 7:
      generator = randomWordGenerator(words.filter((w) => w.length > 4 && w.length <= 5));
      break;
    default:
      generator = randomWordGenerator(words);
      break;
  }

  return generator;
}
