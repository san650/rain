var states = {
  unstarted: createUnstartedState,
  playing: createPlayingState,
  gameOver: createGameOverState,
};

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

function createGameOverState(transitionTo) {
  return {
    enter: () => {
      var message = document.createElement('div');
      message.classList.add('game-over');
      message.innerText = 'GAME OVER';

      document.body.appendChild(message);
    },
    exit: () => {}
  };
}

function createUnstartedState(transitionTo) {
  return {
    enter: () => {
      document.body.innerHTML = `
        <button class="start" id="start">Start</button>
      `;
      var button = document.getElementById('start');
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

  function random(n) {
    return Math.floor(Math.random() * n);
  }

  function randomPercentage() {
    // Use less than 100 so it doesn't overflow on the right
    return String(Math.min(random(100), 60)) + '%';
  }

  function randomDuration() {
    return random(10);
  }

  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var VALUES =  [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10];
  var COLORS = [
    "blue",
    "green",
    "red",
    "white",
    "yellow",
  ];
  var WORDS = [
    "black",
    "blue",
    "green",
    "grey",
    "magenta",
    "maroon",
    "olive",
    "orange",
    "pink",
    "red",
    "violet",
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

  function deleteElement(element) {
    var container = element.parentElement;
    container.removeChild(element);
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
        livesElement.innerText = Math.max(lives - missedCount, 0);
        container.classList.add('shake');

        if (lives - missedCount <= 0) {
          transitionTo('gameOver');
        }
      }

      function missedLetter() {
        container.classList.add('shake');
      }

      function hit(value) {
        points += value;
        pointsElement.innerText = points;
      }

      document.body.innerHTML = `
        <div id="canvas" class="container" tabindex=0></div>
        <div class="osd">
          <span class="lives" id="lives">3</span>
          <span id="lives">/</span>
          <span class="points" id="points">0</span></span>
        </div>
      `;
      container = document.getElementById('canvas');
      var livesElement = document.getElementById('lives');
      var pointsElement = document.getElementById('points');

      var currentWord = "";
      var missedCount= 0;
      var lives = 3;
      var points = 0;

      currentInterval = window.setInterval(function generator() {
        if (!document.hasFocus()) {
          return;
        }

        createWord(container, toWord(randomWord()));
      }, 2000);

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
            container.classList.remove('shake');
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
              hit(Number(word.getAttribute('data-value')));
              word.classList.add('hit');
              wordHits++;
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
