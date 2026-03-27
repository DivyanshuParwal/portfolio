const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const yearNode = document.getElementById("year");
const revealNodes = document.querySelectorAll(".reveal");

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

for (const link of navLinks) {
  link.addEventListener("click", () => {
    if (nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    }
  });
}

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
