// Sets up the footer
document.addEventListener("DOMContentLoaded", async () => {
  const footerContainer = document.getElementById("footer-container");
  if (!footerContainer) return;

  try {
    const path = location.pathname
      .replace(/index\.html$/i, '')
      .replace(/\/+$/, '/');
    const segments = path.split('/').filter(Boolean).length;
    const basePath = segments === 0 ? './' : '../'.repeat(segments);
    const footerURL = basePath + 'partials/footer.html';

    const res = await fetch(footerURL);
    if (!res.ok) throw new Error(`Failed to load footer (${res.status})`);
    footerContainer.innerHTML = await res.text();

    // Fire after footer is actually injected
    document.dispatchEvent(new Event("includesLoaded"));

    if (typeof window.wireFooterEmail === "function") {
      window.wireFooterEmail();
    }
  } catch (err) {
    console.error("Footer load error:", err);
  }
});
