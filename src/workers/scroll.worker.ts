/// <reference lib="webworker" />

let lastScrollY = 0;
const THROTTLE_MS = 300;

// Use the global Worker context
declare const self: DedicatedWorkerGlobalScope;

self.onmessage = (event) => {
  if (event.data.type === 'scroll') {
    const currentScrollY = event.data.scrollY;
    
    // Only send update if enough time has passed
    if (Math.abs(currentScrollY - lastScrollY) > 0) {
      lastScrollY = currentScrollY;
      self.postMessage({ type: 'scrollUpdate', scrollY: currentScrollY });
    }
  }
};

export {};