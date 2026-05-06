(function () {
  function clean() {
    document.querySelectorAll("[bis_skin_checked]").forEach(function (node) {
      node.removeAttribute("bis_skin_checked");
    });
  }

  clean();

  var observer = new MutationObserver(clean);
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  window.addEventListener("load", function () {
    window.setTimeout(function () {
      observer.disconnect();
      clean();
    }, 5000);
  });
})();
