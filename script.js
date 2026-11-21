/* Esha Javed · Portfolio interactions */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Preloader */
  document.body.classList.add("is-loading");
  const hideLoader = () => { $("#loader").classList.add("done"); document.body.classList.remove("is-loading"); };
  window.addEventListener("load", () => setTimeout(hideLoader, reduceMotion ? 0 : 800));
  setTimeout(hideLoader, 3500);

  $("#year").textContent = new Date().getFullYear();

  /* Header, progress bar, active link, timeline fill */
  const header = $("#header"), progress = $("#scrollProgress");
  const links = $$(".nav__links a[href^='#']:not(.btn)");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const timelines = $$("[data-timeline]");
  const onScroll = () => {
    const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("scrolled", y > 30);
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s;
    links.forEach((a) => a.classList.toggle("active", !!current && a.getAttribute("href") === "#" + current.id));
    timelines.forEach((t) => {
      const r = t.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height));
      $(".timeline__line i", t).style.height = pct * 100 + "%";
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = $("#burger"), menu = $("#navLinks");
  const setMenu = (open) => {
    burger.classList.toggle("open", open); menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open); burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* Typed roles */
  const roles = ["Computer Science Graduate", "Front-End Web Developer", "WordPress Developer", "SEO & Content Writer", "Social Media Marketer", "Computer Teacher"];
  const typed = $("#typed");
  if (reduceMotion) typed.textContent = roles[0];
  else {
    let r = 0, i = 0, del = false;
    const tick = () => {
      const w = roles[r];
      typed.textContent = w.slice(0, i);
      if (!del && i === w.length) { del = true; return setTimeout(tick, 1700); }
      if (del && i === 0) { del = false; r = (r + 1) % roles.length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    };
    setTimeout(tick, 1100);
  }

  /* Counters + reveal on scroll */
  const countUp = (el) => {
    const to = +el.dataset.to;
    if (reduceMotion) { el.textContent = to; return; }
    const start = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".counter", e.target).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* Card tilt, magnetic buttons, cursor glow, stage parallax */
  if (finePointer && !reduceMotion) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", x * 100 + "%");
        card.style.setProperty("--my", y * 100 + "%");
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 7}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      btn.addEventListener("pointerleave", () => { btn.style.transform = ""; });
    });
    const glow = $("#cursorGlow"), stage = $("#portrait");
    window.addEventListener("pointermove", (e) => {
      glow.style.opacity = 1;
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      const dx = (e.clientX / innerWidth - 0.5) * 2, dy = (e.clientY / innerHeight - 0.5) * 2;
      stage.style.transform = `translate(${dx * -10}px, ${dy * -10}px)`;
    }, { passive: true });
  }

  /* Soft particle network */
  const canvas = $("#particles"), ctx = canvas.getContext("2d");
  let pts = [];
  const colors = ["rgba(212,165,55,.55)", "rgba(224,122,143,.5)", "rgba(36,64,122,.4)"];
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(60, (innerWidth * innerHeight) / 26000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.8 + 0.6, c: colors[Math.floor(Math.random() * 3)],
    }));
  };
  const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > innerHeight) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = p.c; ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const a = pts[i], b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 120) {
        ctx.strokeStyle = `rgba(20,33,61,${0.07 * (1 - d / 120)})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  };
  resize();
  window.addEventListener("resize", resize);
  if (!reduceMotion) requestAnimationFrame(draw);

  /* Contact form opens the visitor's email app */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const subject = f.get("subject") || `Portfolio enquiry from ${f.get("name")}`;
    const body = `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
    window.location.href = `mailto:eshajaved718@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
