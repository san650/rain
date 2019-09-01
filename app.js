var states = {
  unstarted: createUnstartedState,
  playing: createPlayingState,
  nextLevel: createNextLevel,
  gameOver: createGameOverState,
};

var VIDEOS = [
  {
    src: './bg/Words.mp4',
    poster: './bg/Words.jpg'
  },
  {
    src: './bg/Stormy_Night.mp4',
    poster: './bg/Stormy_Night.jpg'
  },
  {
    src: './bg/Cloud_Surf.mp4',
    poster: './bg/Cloud_Surf.jpg'
  },
];

var wordCount = 10;
var gamePoints = 0;
var levelCount = 1;

function random(n) {
  return Math.floor(Math.random() * n);
}

function video() {
  var index = random(VIDEOS.length);
  var video = VIDEOS[index];

  return `
  <video autoplay loop muted playsinline poster="${video.poster}" class="bg">
    <source src="${video.src}" type="video/mp4">
  </video>
  `;
}

function deleteElement(element) {
  var container = element.parentElement;
  container.removeChild(element);
}

function transitionTo(game, nextStateName) {
  if (game.currentState) {
    game.currentState.exit();
  }

  game.currentState = game.states[nextStateName]((name) => transitionTo(game, name));
  game.currentState.enter();
}

function createGame() {
  return {
    states,
    currentState: null
  };
}

function createNextLevel(transitionTo) {
  return {
    enter: () => {
      var container = document.createElement('div');
      container.innerHTML = `
        ${video()}
        <button class="start" id="start">NEXT LEVEL</button>
      `;
      document.body.appendChild(container);

      var button = document.getElementById('start');
      button.focus();
      button.addEventListener('click', function() {
        transitionTo('playing');
      });
      wordCount += 10;
      levelCount += 1;
    },
    exit: () => {}
  };
}

function createGameOverState(transitionTo) {
  return {
    enter: () => {
      var message = document.createElement('div');
      message.classList.add('game-over');
      message.innerText = 'GAME OVER';

      document.body.appendChild(message);

      var container = document.getElementById('canvas');

      if (container) {
        container.addEventListener("animationend", function(event) {
          if (event.animationName === "rain") {
            deleteElement(event.target);
          }
        }, false);
      }
    },
    exit: () => {}
  };
}

function createUnstartedState(transitionTo) {
  return {
    enter: () => {
      document.body.innerHTML = `
        ${video()}
        <button class="start" id="start">Start</button>
      `;
      var button = document.getElementById('start');
      button.focus();
      button.addEventListener('click', function() {
        transitionTo('playing');
      });
    },
    exit: () => {}
  };
}

function createPlayingState(transitionTo) {
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
    var index = random(COLORS.length);
    return COLORS[index];
  }

  function randomWord() {
    var index = random(WORDS.length);
    return WORDS[index];
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

  function clean(currentWord) {
    Array.from(document.querySelectorAll('.word:not([data-word^="' + currentWord + '"]):not(.hit)')).forEach((word) => {
      Array.from(word.querySelectorAll('.letter.hit')).forEach((letter) => {
        letter.classList.remove('hit');
      });
    });
  }

  var currentInterval;
  var container;
  var keyPressEventHandler;
  var animationEndEventHandler;

  return {
    enter: () => {
      function missedWord() {
        missedCount++;
        renderLives();
        container.classList.add('shake');

        if (lives - missedCount <= 0) {
          transitionTo('gameOver');
        }
      }

      function missedLetter() {
        container.classList.add('shake');
      }

      function hit(value) {
        gamePoints += value;
        pointsElement.innerText = gamePoints;
      }

      function hitElement(element) {
        element.classList.add('hit');
        hit(Number(element.dataset.value));
      }

      function renderLives() {
        livesElement.innerText = '♡ ' + Math.max(lives - missedCount, 0);
      }

      var currentWord = "";
      var missedCount= 0;
      var lives = 3;
      var counter = 0;
      var levelHits = 0;

      document.body.innerHTML = `
        ${video()}
        <div id="canvas" class="container" tabindex=0></div>
        <div class="osd">
          <span class="lives" id="lives">♡ 3</span>
          <span class="words" id="words">${wordCount}</span>
          <span class="points" id="points">${gamePoints}</span>
          <span class="level" id="level">Level ${levelCount}</span>
        </div>
      `;
      container = document.getElementById('canvas');
      var livesElement = document.getElementById('lives');
      var pointsElement = document.getElementById('points');
      var wordsElement = document.getElementById('words');

      var POWERS = {
        clean: () => {
          // hit all!
          Array.from(document.querySelectorAll('.word')).forEach(hitElement);
        },
        '1up': (element) => {
          lives++;
          renderLives();
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
        wordsElement.innerText = wordCount - levelHits;
      }

      currentInterval = window.setInterval(function generator() {
        if (!document.hasFocus()) {
          return;
        }

        counter++;

        var candidate = randomWord();

        if (counter % 10 === 0) {
          candidate = randomPower();
        }

        createWord(container, toWord(candidate));
      }, 1500);

      // cleanup
      //
      animationEndEventHandler = function(event) {
        switch(event.animationName) {
          case "rain":
            missedWord();
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

        currentWord += key;

        var words = Array.from(document.querySelectorAll('[data-word^="' + currentWord + '"]:not(.hit)'));
        var letter;
        var wordHits = 0;
        var letterHits = 0;

        clean(currentWord);

        if (!words.length) {
          missedLetter();
        } else {
          words.forEach((word) => {
            letter = word.querySelector('.letter[data-symbol="' + key + '"]:not(.hit)');

            if (letter) {
              letter.classList.add('hit');
              letterHits++;
            }

            if (word.matches('[data-word="' + currentWord + '"]:not(.hit)')) {
              var power;
              if (power = POWERS[currentWord.toLowerCase()]) {
                power(word);
              } else {
                hitElement(word);
              }
              wordHits++;
              levelHits++;
              updateLevelWordCount();

              if (levelHits >= wordCount) {
                transitionTo('nextLevel');
              }
            }
          });
        }

        if (letterHits === 0) {
          currentWord = "";
          missedLetter();
        }

        if (wordHits === words.length) {
          currentWord = "";
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
