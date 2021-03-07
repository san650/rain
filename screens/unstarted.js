import video, { randomVideo } from '../components/video.js';

export default function(game, transitionTo) {
  function handleClick() {
    transitionTo(game, 'playing');
  }

  return {
    enter: () => {
      document.body.innerHTML = `
        ${video(randomVideo())}
        <button class="start" id="start">
          <span>
            START
            <br>
            <small>(hit space to start)</small>
          </span>
        </button>
      `;
      var button = document.getElementById('start');
      button.focus();
      button.addEventListener('click', handleClick);
    },
    exit: () => {
      var button = document.getElementById('start');
      button.removeEventListener('click', handleClick);
    }
  };
}
