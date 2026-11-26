(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const storySections = [...document.querySelectorAll("main > section:not(.ab-hero)")];
  if (!reduced && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.1 });
    storySections.forEach((section) => {
      section.classList.add("ab-reveal");
      revealObserver.observe(section);
    });
  } else storySections.forEach((section) => section.classList.add("in"));
  const particles = document.querySelector(".ab-particles");
  if (particles && !reduced) {
    for (let i = 0; i < 25; i++) {
      const dot = document.createElement("i");
      dot.style.setProperty("--x", `${(i * 41 + 9) % 100}%`);
      dot.style.setProperty("--y", `${(i * 67 + 13) % 100}%`);
      dot.style.setProperty("--delay", `${-((i * 7) % 11)}s`);
      dot.style.setProperty("--size", `${2 + (i % 3)}px`);
      particles.appendChild(dot);
    }
  }
})();
