export default function(game, transitionTo) {
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

function deleteElement(element) {
  var container = element.parentElement;
  container.removeChild(element);
}
