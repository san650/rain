var container = document.createElement('span');

export default function toElement(template) {
  container.innerHTML = template;
  return container.removeChild(container.firstElementChild);
}
