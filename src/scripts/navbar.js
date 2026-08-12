export function initNavbar() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const closeBtn = document.getElementById("mobile-menu-close");
  const menu = document.getElementById("mobile-menu");

  if (!toggle || !menu) return;
  if (toggle.dataset.navbarInitialized === "true") return;

  toggle.dataset.navbarInitialized = "true";

  const openMenu = () => {
    menu.classList.add("is-active");
    menu.setAttribute("aria-hidden", "false");
    toggle.classList.add("is-active");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("overflow-hidden");
  };

  const closeMenu = () => {
    menu.classList.remove("is-active");
    menu.setAttribute("aria-hidden", "true");
    toggle.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
  };

  closeMenu();

  toggle.addEventListener("click", () => {
    const isActive = menu.classList.contains("is-active");
    if (isActive) closeMenu();
    else openMenu();
  });

  closeBtn?.addEventListener("click", closeMenu);

  // Close menu on link click
  const links = menu.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", closeMenu);
  });
}
