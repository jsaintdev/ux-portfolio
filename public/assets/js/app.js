// Load partials
import "./components/copy-button.js";
import "./components/nav.js";
import "./components/footer.js";

// Load background
const page = document.body?.dataset?.page || "main";
import(`./backgrounds/pages/${page}.js`)
  .catch((err) => {
    console.error(`Failed to load background module: ${page}`, err);
    return import("./backgrounds/pages/main.js");
  });

// Load page animations
import(`./pages/${page}.js`)
  .catch((err) => {
    console.error(`Failed to load page module: ${page}`, err);
    return import("./pages/main.js");
  });
