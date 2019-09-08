export default function(game, level) {
  return `
    <div class="osd">
      <span class="title">Level ${game.level}</span>
      <span class="lives" id="lives">♡  ${game.lives}</span>
      <span class="words" id="words">${level.target - level.hits}</span>
      <span class="points" id="points">${game.points}</span>
    </div>
  `;
}
