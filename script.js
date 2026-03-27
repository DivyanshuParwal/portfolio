const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");
const progressBar = document.getElementById("scroll-progress");
const cursorGlow = document.getElementById("cursor-glow");
const copyEmailBtn = document.getElementById("copy-email");

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

function updateScrollProgress() {
  if (!progressBar) return;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight <= 0 ? 0 : (window.scrollY / docHeight) * 100;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

updateScrollProgress();
window.addEventListener("scroll", updateScrollProgress, { passive: true });

if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  cursorGlow.style.opacity = "1";
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
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
