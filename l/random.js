export function random(n) {
  return Math.floor(Math.random() * n);
}

export function randomFrom(collection) {
  var index = random(collection.length);
  return collection[index];
}
