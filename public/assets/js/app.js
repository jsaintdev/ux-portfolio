// app.js — globals first, then page-specific loader

// 1) Copy buttons: attach before includesLoaded can fire
import "./components/copy-button.js";

// 2) Partials that may dispatch includesLoaded
import "./components/nav.js";
import "./components/footer.js";

// 3) Visuals shared across pages
import "./backgrounds/main.js";

// 4) Auto-load page module based on <body data-page="...">
const page = document.body?.dataset?.page;
if (page) {
  import(`./pages/${page}.js`).catch((err) =>
    console.error(`Failed to load page module: ${page}`, err)
  );
}

