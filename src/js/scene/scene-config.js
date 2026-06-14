// All browser-only globals guarded for SSR compatibility
const _isBrowser = typeof window !== "undefined";

export let isMobile = false;
export let isLowEnd = false;

export const scrollState = { current: 0, target: 0, smooth: 0.05 };
export let scrollMax = 0;

export function setScrollMax(val) { scrollMax = val; }

export const parallaxConfig = Object.freeze({
  cameraRotationZ: 0.03,
  starsNearRotationY: 0.02,
  starsMidRotationY: 0.01,
  starsFarRotationY: 0.005,
  moonVerticalOffset: 0.5,
  mobileIntensityMultiplier: 0.6,
});

export let _parallaxEnabled = true;
export let _parallaxObserver;

if (_isBrowser) {
  isMobile = window.innerWidth < 768;
  isLowEnd = isMobile || navigator.hardwareConcurrency <= 4;
  scrollMax = document.body.scrollHeight - window.innerHeight;

  if (typeof IntersectionObserver !== "undefined") {
    _parallaxObserver = new IntersectionObserver(
      function (entries) {
        _parallaxEnabled = entries[0].isIntersecting;
      },
      { threshold: 0 },
    );
  }

  window.addEventListener(
    "scroll",
    function () {
      scrollState.target = Math.min(1, Math.max(0, window.scrollY / scrollMax));
    },
    { passive: true },
  );
}
