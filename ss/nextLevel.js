export default function(game, transitionTo) {
  return {
    enter: () => {
      var container = document.createElement('div');
      container.innerHTML = `
        <button class="start" id="start">NEXT LEVEL</button>
      `;
      document.body.appendChild(container);

      var button = document.getElementById('start');
      button.focus();
      button.addEventListener('click', function() {
        transitionTo(game, 'playing');
      });
      game.wordCount += 10;
      game.level += 1;
    },
    exit: () => {}
  };
}
