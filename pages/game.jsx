import { useEffect, useState } from 'react';
import '../css/style.css';
import '../css/game.css';

function Game() {
  const [woundCount, setWoundCount] = useState(() => {
    return parseInt(localStorage.getItem('woundCount')) || 0;
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './public/hourglass.js';
    script.defer = true;
    document.body.appendChild(script);

    window.currentWoundCount = woundCount;

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('woundCount', woundCount);

    window.currentWoundCount = woundCount;

    const event = new CustomEvent('woundCountChanged', { detail: { woundCount } });
    window.dispatchEvent(event);
  }, [woundCount]);

  const incrementWounds = () => setWoundCount(w => Math.min(w + 1, 99));
  const decrementWounds = () => setWoundCount(w => Math.max(w - 1, 0));

  useEffect(() => {
    let animationFrameId;
    let startTime = null;
    let started = false;
  
    const sandUpper = document.querySelector('.sand-upper');
    const sandLower = document.querySelector('.sand-lower');
  
    if (!sandUpper || !sandLower) return;
  
    const animateSand = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
  
      const woundCount = window.currentWoundCount || 0;
      const speedFactor = 1 + woundCount * 0.1;
      const duration = 60000 / speedFactor;
  
      const percent = (elapsed % duration) / duration;
  
      const upperTranslate = percent < 0.5
        ? 13 * (percent * 2)
        : 13 * (1 - ((percent - 0.5) * 2));
      sandUpper.style.transform = `translateY(${upperTranslate.toFixed(2)}vh)`;
  
      const lowerTranslate = percent < 0.5
        ? 11 - (13 * (percent * 2))
        : -2 + (13 * ((percent - 0.5) * 2));
      sandLower.style.transform = `translateY(${lowerTranslate.toFixed(2)}vh)`;
      sandLower.style.opacity = '1';
  
      animationFrameId = requestAnimationFrame(animateSand);
    };
  
    const stopAnimation = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      startTime = null;
    };
  
    const onClick = (e) => {
      if (
        e.target.closest('button') ||
        e.target.closest('.wound-tracker')
      ) return;
  
      if (!started) {
        started = true;
        requestAnimationFrame(animateSand);
      } else {
        started = false;
        stopAnimation();
      }
    };
  
    document.addEventListener('click', onClick);
  
    return () => {
      document.removeEventListener('click', onClick);
      stopAnimation();
    };
  }, []);  

  return (
    <>
      <div className="hourglass-container">
        <img src="/images/game/hourglass/hourglass-body.png" className="hourglass-body" alt="" />
        <img src="/images/game/hourglass/bg-upper.png" className="bg-upper" alt="" />
        <img src="/images/game/hourglass/bg-lower.png" className="bg-lower" alt="" />
        <img src="/images/game/hourglass/sand-stream.png" className="sand-stream" alt="" />
        <img src="/images/game/hourglass/sand-stream.png" className="sand-stream-2" alt="" />

        <div className="sand-upper-container">
          <img src="/images/game/hourglass/sand-upper.png" className="sand-upper" alt="" />
        </div>

        <div className="sand-lower-container">
          <img src="/images/game/hourglass/sand-lower.png" className="sand-lower" alt="" />
        </div>

        <img src="/images/game/hourglass/mask-upper.png" className="mask-upper" alt="" />
        <img src="/images/game/hourglass/mask-lower.png" className="mask-lower" alt="" />
      </div>

      <div className="wound-tracker">
        <button className="wound-increment sub-wounds" onClick={decrementWounds}>
          <img src="../images/game/arrow.png" alt="Decrease Wound" />
        </button>
        <span className="wound-count">{woundCount}</span>
        <button className="wound-increment add-wounds" onClick={incrementWounds}>
          <img src="../images/game/arrow.png" alt="Increase Wound" />
        </button>
      </div>

      <svg width="0" height="0">
        <filter id="distort">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005"
            numOctaves="2"
            seed="3"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              values="0.005; 0.007; 0.005"
              dur="5s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </svg>
    </>
  );
}

export default Game;
