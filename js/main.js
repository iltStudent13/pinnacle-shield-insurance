// smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// highlight active nav link
document.querySelectorAll(".navbar-nav .nav-link").forEach(function (link) {
  if (
    link.href === window.location.href ||
    link.href === window.location.origin + window.location.pathname
  ) {
    link.classList.add("active");
  }
});
