// Buttery smooth scroll utility

const easeInOutQuint = (t) => {
    return t < 0.5 
      ? 16 * t * t * t * t * t 
      : 1 - Math.pow(-2 * t + 2, 5) / 2;
  };
  
  export const butterScrollTo = (targetY, duration = 1100) => {
    const startY = window.scrollY;
    const distance = targetY - startY;
    
    // Skip if already at target
    if (Math.abs(distance) < 1) return;
    
    let startTime = null;
  
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutQuint(progress);
  
      window.scrollTo(0, startY + distance * easedProgress);
  
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
  
    requestAnimationFrame(animate);
  };
  
  export const scrollToSection = (id, offset = 0) => {
    const element = document.getElementById(id);
    if (!element) return;
  
    const targetY = element.getBoundingClientRect().top + window.scrollY - offset;
    butterScrollTo(targetY, 1100);
  };