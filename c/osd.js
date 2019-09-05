export default function({lives, wordCount, points, level}) {
  return `
    <div class="osd">
      <span class="lives" id="lives">♡  ${lives}</span>
      <span class="words" id="words">${wordCount}</span>
      <span class="points" id="points">${points}</span>
      <span class="level" id="level">Level ${level}</span>
    </div>
  `;
}
