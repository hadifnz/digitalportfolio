export const smoothScrollBy = (element: HTMLElement, distance: number, duration: number) => {
  const start = element.scrollLeft;
  const startTime = performance.now();

  // Easing function for smooth acceleration and deceleration
  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    
    if (elapsed < duration) {
      element.scrollLeft = easeInOutQuad(elapsed, start, distance, duration);
      requestAnimationFrame(animateScroll);
    } else {
      element.scrollLeft = start + distance; // ensure it ends perfectly on target
    }
  };

  requestAnimationFrame(animateScroll);
};
