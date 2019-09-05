import {randomFrom} from '../random.js';

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
  {
    src: './bg/Bull-Creek.mp4',
    poster: './bg/Bull-Creek.jpg'
  },
  {
    src: './bg/Twisted-Fire.mp4',
    poster: './bg/Twisted-Fire.jpg'
  },
  {
    src: './bg/Escalate.mp4',
    poster: './bg/Escalate.jpg'
  },
  {
    src: './bg/Drips.mp4',
    poster: './bg/Drips.jpg'
  },
  {
    src: './bg/Busy.mp4',
    poster: './bg/Busy.jpg'
  },
  {
    src: './bg/Beetle-Nut-Trees.mp4',
    poster: './bg/Beetle-Nut-Trees.jpg'
  },
  {
    src: './bg/Beetle-Nut-Trees.mp4',
    poster: './bg/Beetle-Nut-Trees.jpg'
  },
  {
    src: './bg/Night-Traffic.mp4',
    poster: './bg/Night-Traffic.jpg'
  },
  {
    src: './bg/Pigeon-Impossible.mp4',
    poster: './bg/Pigeon-Impossible.jpg'
  },
  {
    src: './bg/Textures.mp4',
    poster: './bg/Textures.jpg'
  },
];
