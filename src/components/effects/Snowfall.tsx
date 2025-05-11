import React, { useEffect, useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';

const snowfall = keyframes`
  0% {
    transform: translate3d(0, -100vh, 0);
  }
  100% {
    transform: translate3d(20px, 100vh, 0);
  }
`;

const Snowflake = styled.div<{ size: number; delay: number; duration: number }>`
  position: fixed;
  top: -10px;
  left: ${props => Math.random() * 100}vw;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: white;
  border-radius: 50%;
  opacity: 0.4;
  will-change: transform;
  animation: ${snowfall} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  z-index: 0;
  pointer-events: none;
  transform: translateZ(-1);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateZ(-1);
`;

const SnowfallContainer = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  will-change: transform;
  transform: translateZ(-1);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateZ(-1);
`;

interface SnowflakeData {
  id: number;
  size: number;
  delay: number;
  duration: number;
}

const Snowfall: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<SnowflakeData[]>([]);
  const [firstSnowflakes, setFirstSnowflakes] = useState(true);
  useEffect(() => {
    // Create a new Web Worker
    const worker = new Worker(new URL('./snowfall.worker.ts', import.meta.url));

    // Handle messages from the worker
    worker.onmessage = (event) => {
      setSnowflakes(event.data);
    };

    // Start the worker
    worker.postMessage('start');  

    // Cleanup
    return () => {
      worker.terminate();
    };
  }, []);

  // Memoize the snowflake elements to prevent unnecessary re-renders
  const snowflakeElements = useMemo(() => {
    return snowflakes.map(snowflake => (
      <Snowflake
        key={snowflake.id}
        size={snowflake.size}
        delay ={snowflake.delay}
        duration={snowflake.duration}
      />
    ));
  }, [snowflakes]);

  return (
    <SnowfallContainer>
      {snowflakeElements}
    </SnowfallContainer>
  );
};

export default Snowfall; 