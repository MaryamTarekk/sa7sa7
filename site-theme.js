(() => {
  const sections = [...document.querySelectorAll("main > section")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("site-motion-ready");
  sections.forEach((section, index) => {
    if (index === 0) return;
    const content = section.querySelector(":scope > .wrap");
    if (content) content.classList.add("site-section-reveal");
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("site-section-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
  );

  sections.slice(1).forEach((section) => observer.observe(section));
})();
