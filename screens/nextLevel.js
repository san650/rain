export default function(game, transitionTo) {
  function handleClick() {
    transitionTo(game, 'playing');
  }

  return {
    enter: () => {
      var container = document.createElement('div');
      container.innerHTML = `
        <button class="start" id="start">
          <span>
          NEXT LEVEL
          <br>
          <small>(hit space to continue)<small>
        </button>
      `;
      document.body.appendChild(container);

      var button = document.getElementById('start');
      button.focus();
      button.addEventListener('click', handleClick);
      game.wordCount += 10;
      game.level += 1;
    },
    exit: () => {
      var button = document.getElementById('start');
      button.removeEventListener('click', handleClick);
    }
  };
}
