import gsap from 'gsap';

export const fadeUp = (element: gsap.TweenTarget, options = {}) => {
  return gsap.fromTo(
    element,
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
      ...options
    }
  );
};
