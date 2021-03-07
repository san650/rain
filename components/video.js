import {randomFrom} from '../library/random.js';

export default function({poster, src}) {
  return `
  <video autoplay loop muted playsinline poster="${poster}" class="bg">
    <source src="${src}" type="video/mp4">
  </video>
  `;
}

export function randomVideo() {
  return randomFrom(VIDEOS);
}

const VIDEOS = [
  {
    src: './assets/Words.mp4',
    poster: './assets/Words.jpg'
  },
  {
    src: './assets/Stormy_Night.mp4',
    poster: './assets/Stormy_Night.jpg'
  },
  {
    src: './assets/Cloud_Surf.mp4',
    poster: './assets/Cloud_Surf.jpg'
  },
  {
    src: './assets/Bull-Creek.mp4',
    poster: './assets/Bull-Creek.jpg'
  },
  {
    src: './assets/Twisted-Fire.mp4',
    poster: './assets/Twisted-Fire.jpg'
  },
  {
    src: './assets/Escalate.mp4',
    poster: './assets/Escalate.jpg'
  },
  {
    src: './assets/Drips.mp4',
    poster: './assets/Drips.jpg'
  },
  {
    src: './assets/Busy.mp4',
    poster: './assets/Busy.jpg'
  },
  {
    src: './assets/Beetle-Nut-Trees.mp4',
    poster: './assets/Beetle-Nut-Trees.jpg'
  },
  {
    src: './assets/Beetle-Nut-Trees.mp4',
    poster: './assets/Beetle-Nut-Trees.jpg'
  },
  {
    src: './assets/Night-Traffic.mp4',
    poster: './assets/Night-Traffic.jpg'
  },
  {
    src: './assets/Pigeon-Impossible.mp4',
    poster: './assets/Pigeon-Impossible.jpg'
  },
  {
    src: './assets/Textures.mp4',
    poster: './assets/Textures.jpg'
  },
];
