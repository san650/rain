import video, { randomVideo } from '../cc/video.js';

export default function(game, transitionTo) {
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
      button.addEventListener('click', function() {
        transitionTo(game, 'playing');
      });
    },
    exit: () => {}
  };
}
