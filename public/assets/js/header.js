(function () {
  fetch('./partials/header.html')
    .then(r => r.text())
    .then(html => {
      const temp = document.createElement('template');
      temp.innerHTML = html;
      // append each element from partial into <head>
      Array.from(temp.content.children).forEach(el => document.head.appendChild(el));
    })
    .catch(err => console.error('Head include failed:', err));
})();
