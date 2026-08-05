import gsap from 'gsap';

export const parallax = (element: Element | string, speed = 1, options = {}) => {
  return gsap.to(element, {
    y: () => -100 * speed,
    ease: "none",
    scrollTrigger: {
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    ...options
  });
};
