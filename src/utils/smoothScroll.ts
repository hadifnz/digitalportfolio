export const smoothScrollBy = (element: HTMLElement, distance: number, duration: number) => {
  const start = element.scrollLeft;
  const startTime = performance.now();
  const originalSnap = element.style.scrollSnapType;
  element.style.scrollSnapType = 'none';

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
      element.scrollLeft = start + distance;
      element.style.scrollSnapType = originalSnap;
    }
  };
  requestAnimationFrame(animateScroll);
};

export const nudgeScrollSequence = (element: HTMLElement, distance: number, scrollDuration: number, pauseDuration: number) => {
  const start = element.scrollLeft;
  const startTime = performance.now();
  
  // Temporarily disable scroll snapping so the browser doesn't fight the animation
  const originalSnap = element.style.scrollSnapType;
  element.style.scrollSnapType = 'none';

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };

  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    
    // Phase 1: Nudge Right
    if (elapsed <= scrollDuration) {
      element.scrollLeft = easeInOutQuad(elapsed, start, distance, scrollDuration);
      requestAnimationFrame(animateScroll);
    } 
    // Phase 2: Pause
    else if (elapsed <= scrollDuration + pauseDuration) {
      element.scrollLeft = start + distance;
      requestAnimationFrame(animateScroll);
    } 
    // Phase 3: Nudge Left
    else if (elapsed <= scrollDuration * 2 + pauseDuration) {
      const timeInPhase3 = elapsed - (scrollDuration + pauseDuration);
      element.scrollLeft = easeInOutQuad(timeInPhase3, start + distance, -distance, scrollDuration);
      requestAnimationFrame(animateScroll);
    } 
    // Done
    else {
      element.scrollLeft = start;
      // Re-enable scroll snapping
      element.style.scrollSnapType = originalSnap;
    }
  };

  requestAnimationFrame(animateScroll);
};
