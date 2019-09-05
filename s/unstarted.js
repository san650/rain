import video, { randomVideo } from '../c/video.js';

export default function(game, transitionTo) {
  return {
    enter: () => {
      document.body.innerHTML = `
        ${video(randomVideo())}
        <button class="start" id="start">Start</button>
      `;
      var button = document.getElementById('start');
      button.focus();
      button.addEventListener('click', function() {
        transitionTo(game, 'playing');
      });
    },
    exit: () => {}
  };
}
