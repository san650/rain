import Unstarted from './s/unstarted.js';
import Playing from './s/playing.js';
import NextLevel from './s/nextLevel.js';
import GameOver from './s/gameOver.js';

const STATES = {
  unstarted: Unstarted,
  playing: Playing,
  nextLevel: NextLevel,
  gameOver: GameOver,
};

export function transitionTo(game, nextStateName) {
  if (game.currentState) {
    game.currentState.exit();
  }

  game.currentState = game.states[nextStateName](game, transitionTo);
  game.currentState.enter();
}

export function createGame() {
  return {
    states: STATES,
    currentState: null,
    points: 0,
    level: 1,
    lives: 3,
  };
}
