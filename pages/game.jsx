import { useEffect, useState } from 'react';
import '../css/style.css';
import '../css/game.css';

function Game() {
  const [woundCount, setWoundCount] = useState(() => {
    return parseInt(localStorage.getItem('woundCount')) || 0;
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/hourglass.js';
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
