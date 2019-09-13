export default function(word) {
  var value = word.letters.reduce((sum, letter) => sum + letter.value, 0);

  return `
    <span style="left:${word.x}" data-word="${word.value}" data-value="${value}" class="word rain ${word.color} d${word.duration}">
      ${word.letters.map(letter).join('')}
    </span>
  `;
}

function letter(l) {
  return `<span data-symbol="${l.symbol}" data-value="${l.value}" class="letter"></span>`;
}
