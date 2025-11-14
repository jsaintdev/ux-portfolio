export function initTileRotation(selector, maxOffset = 100) {
  const layers = document.querySelectorAll(selector);

  layers.forEach(layer => {
    const rotation = Math.random() < 0.5 ? 0 : 180;
    const ox = Math.floor(Math.random() * (maxOffset + 1));
    const oy = Math.floor(Math.random() * (maxOffset + 1));

    layer.style.transform = `rotate(${rotation}deg)`;
    layer.style.backgroundPosition = `${ox}px ${oy}px`;
  });
}
