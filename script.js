const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");
const progressBar = document.getElementById("scroll-progress");
const cursorGlow = document.getElementById("cursor-glow");
const copyEmailBtn = document.getElementById("copy-email");
const metricValues = document.querySelectorAll(".metric-value");
const tiltCards = document.querySelectorAll(".tilt-card");
const backToTopButton = document.getElementById("back-to-top");
const statCards = document.querySelectorAll(".stat-card");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

function closeMenu() {
  if (nav && nav.classList.contains("open")) {
    nav.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  }
}

for (const link of navLinks) {
  link.addEventListener("click", () => {
    closeMenu();
  });
}

document.addEventListener("click", (event) => {
  if (!nav || !menuButton) return;
  const target = event.target;
  if (!(target instanceof Node)) return;
  const clickedInsideMenu = nav.contains(target) || menuButton.contains(target);
  if (!clickedInsideMenu) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const linkTarget = link.getAttribute("href")?.slice(1);
        link.classList.toggle("active", linkTarget === id);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => observer.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -6% 0px"
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

const metricObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      if (!(node instanceof HTMLElement)) return;
      animateMetric(node);
      obs.unobserve(node);
    });
  },
  {
    threshold: 0.5
  }
);

metricValues.forEach((node) => metricObserver.observe(node));

function updateScrollProgress() {
  if (!progressBar) return;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight <= 0 ? 0 : (window.scrollY / docHeight) * 100;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

function updateBackToTopVisibility() {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle("visible", window.scrollY > 540);
}

function updateOnScroll() {
  updateScrollProgress();
  updateBackToTopVisibility();
}

updateOnScroll();
window.addEventListener("scroll", updateOnScroll, { passive: true });

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  cursorGlow.style.opacity = "1";
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

function animateMetric(node) {
  const target = Number(node.getAttribute("data-target"));
  const suffix = node.getAttribute("data-suffix") || "";
  if (!Number.isFinite(target) || target <= 0) return;

  const duration = 1100;
  const start = performance.now();

  function frame(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const eased = 1 - (1 - progress) * (1 - progress);
    const value = Math.max(1, Math.round(target * eased));
    node.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      node.textContent = `${target}${suffix}`;
    }
  }

  requestAnimationFrame(frame);
}

if (window.matchMedia("(pointer: fine)").matches) {
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      const rotateY = (relX - 0.5) * 6;
      const rotateX = (0.5 - relY) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

if (window.matchMedia("(pointer: fine)").matches) {
  statCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--mx", `${Math.round(relX * 100)}%`);
      card.style.setProperty("--my", `${Math.round(relY * 100)}%`);
    });
  });
}

if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", async () => {
    const email = "divyanshuparwal2001@gmail.com";
    const defaultLabel = copyEmailBtn.getAttribute("data-default-label") || "Copy email";

    try {
      await navigator.clipboard.writeText(email);
      copyEmailBtn.textContent = "Email copied";
      setTimeout(() => {
        copyEmailBtn.textContent = defaultLabel;
      }, 1500);
    } catch {
      copyEmailBtn.textContent = "Copy failed";
      setTimeout(() => {
        copyEmailBtn.textContent = defaultLabel;
      }, 1500);
    }
  });
}

if (backToTopButton) {
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
