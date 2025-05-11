/// <reference lib="webworker" />

// Create groups of snowflakes with similar properties
const createSnowflakeGroup = (count: number, sizeRange: [number, number], delayRange: [number, number], durationRange: [number, number]) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * (sizeRange[1] - sizeRange[0]) + sizeRange[0],
    delay: Math.random() * (delayRange[1] - delayRange[0]) + delayRange[0],
    duration: Math.random() * (durationRange[1] - durationRange[0]) + durationRange[0],
  }));
};

// Handle messages from the main thread
const worker = globalThis as unknown as DedicatedWorkerGlobalScope;
worker.onmessage = (event) => {
  if (event.data === 'start') {
    // Create multiple groups of snowflakes with different properties
    const snowflakes = [
      ...createSnowflakeGroup(25, [4, 6], [0, 1], [6, 8]),    // Small, fast snowflakes
      ...createSnowflakeGroup(25, [6, 8], [1, 2], [8, 10]),    // Medium snowflakes
      ...createSnowflakeGroup(50, [8, 14], [0, 2], [6, 12]),   // Large, slow snowflakes
    ];
 
    // Send the snowflakes data back to the main thread
    worker.postMessage(snowflakes);
  }
};

// Make this file a module
export {}; 