(() => {
  const search = document.querySelector("#docsSearch");
  const sections = [...document.querySelectorAll(".docs-section")];
  const links = [...document.querySelectorAll("[data-doc-link]")];
  const empty = document.querySelector(".docs-empty");
  const normalize = (value) => value.toLocaleLowerCase("ar").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه");

  search?.addEventListener("input", () => {
    const query = normalize(search.value.trim());
    let visible = 0;
    sections.forEach((section) => {
      const match = !query || normalize(section.innerText).includes(query);
      section.hidden = !match;
      if (match) visible++;
    });
    links.forEach((link) => {
      const section = document.querySelector(link.getAttribute("href"));
      link.hidden = !!query && (!section || section.hidden);
    });
    if (empty) empty.style.display = visible ? "none" : "block";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-20% 0px -65% 0px" });
  sections.forEach((section) => observer.observe(section));

  document.querySelector("#mb")?.addEventListener("click", () => document.querySelector("#hd")?.classList.toggle("op"));
  document.querySelectorAll("#lk a").forEach((link) => link.addEventListener("click", () => document.querySelector("#hd")?.classList.remove("op")));
})();
