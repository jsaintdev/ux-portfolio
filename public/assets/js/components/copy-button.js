document.addEventListener("includesLoaded", initCopyButtons);
document.addEventListener("DOMContentLoaded", initCopyButtons);

function initCopyButtons() {
  const copyButtons = document.querySelectorAll(".button--topbar, .button--footer");
  if (!copyButtons.length) return;

  copyButtons.forEach((btn) => {
    if (btn.dataset.bound === "copy") return;
    btn.dataset.bound = "copy";

    const email = "justinsaintdev@gmail.com";
    const icon = btn.querySelector(".image__icon");
    const originalIconSrc = icon?.getAttribute("src");
    const checkIconSrc = originalIconSrc?.replace("copy.svg", "check.svg");

    let label = btn.querySelector(".contact-copy__label");
    if (!label) {
      label = document.createElement("span");
      label.className = "contact-copy__label";
      label.textContent = btn.textContent.trim() || "Copy Email";
      btn.textContent = "";
      if (icon) btn.appendChild(icon);
      btn.appendChild(document.createTextNode(" "));
      btn.appendChild(label);
    }

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(email);

        const w = Math.ceil(btn.getBoundingClientRect().width);
        btn.style.width = w + "px";

        if (icon && checkIconSrc) icon.setAttribute("src", checkIconSrc);
        const originalText = label.textContent;
        label.textContent = "Copied!";
        btn.classList.add("copied");

        setTimeout(() => {
          if (icon && originalIconSrc) icon.setAttribute("src", originalIconSrc);
          label.textContent = originalText;
          btn.classList.remove("copied");
          btn.style.removeProperty("width");
        }, 1500);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    });
  });
}
