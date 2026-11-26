(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector("#hd");
  const menu = document.querySelector("#mb");
  const bar = document.querySelector("#bar");
  const all = (s, root = document) => [...root.querySelectorAll(s)];

  menu?.addEventListener("click", () => header.classList.toggle("op"));
  all("#lk a").forEach((a) => a.addEventListener("click", () => header.classList.remove("op")));
  const onScroll = () => {
    header?.classList.toggle("sc", scrollY > 20);
    if (bar) bar.style.transform = `scaleX(${Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      io.unobserve(entry.target);
    }), { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    all(".reveal").forEach((el, i) => {
      el.style.setProperty("--d", `${(i % 5) * 75}ms`);
      io.observe(el);
    });
  } else all(".reveal").forEach((el) => el.classList.add("in"));

  if (!reduced && matchMedia("(hover:hover) and (pointer:fine)").matches) {
    all(".card").forEach((card) => card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true }));

    let lastSpark = 0;
    document.addEventListener("pointermove", (e) => {
      if (!e.target.closest(".hero") || performance.now() - lastSpark < 65) return;
      lastSpark = performance.now();
      const spark = document.createElement("i");
      spark.className = "spark";
      spark.setAttribute("aria-hidden", "true");
      spark.style.left = `${e.clientX}px`;
      spark.style.top = `${e.clientY}px`;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 720);
    }, { passive: true });
  }

  all("[data-select-group]").forEach((group) => {
    const cards = all("[data-select]", group);
    const panel = document.querySelector(group.dataset.selectGroup);
    const choose = (card) => {
      cards.forEach((item) => {
        const active = item === card;
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(active));
      });
      if (!panel) return;
      panel.classList.remove("switch");
      panel.innerHTML = card.dataset.content;
      void panel.offsetWidth;
      panel.classList.add("switch");
    };
    cards.forEach((card) => card.addEventListener("click", () => choose(card)));
    if (cards[0]) choose(cards[0]);
  });

  all("[data-choice]").forEach((button) => button.addEventListener("click", () => {
    all("[data-choice]").forEach((b) => b.classList.toggle("selected", b === button));
    const output = document.querySelector(button.dataset.choiceTarget || "#choice-output");
    if (output) output.textContent = button.dataset.choice;
  }));
})();
