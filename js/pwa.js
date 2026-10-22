/* Registro do service worker: disponível em localhost ou HTTPS. */
(function registerMathLabPWA() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(error => {
      console.info("Modo offline indisponível neste ambiente:", error.message);
    });
  });
})();
