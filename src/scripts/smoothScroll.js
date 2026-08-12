import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenis;

export function initSmoothScroll() {
  if (!lenis) {
    lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      smoothWheel: true,
      syncTouch: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });
  }

  lenis.resize();
  lenis.start();

  return lenis;
}

initSmoothScroll();

document.addEventListener("astro:before-preparation", () => {
  lenis?.stop();
});

document.addEventListener("astro:page-load", initSmoothScroll);
