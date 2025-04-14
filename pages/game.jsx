import { useEffect, useState } from 'react';
import '../css/style.css';
import '../css/game.css';

function Game() {
  const [woundCount, setWoundCount] = useState(() => {
    return parseInt(localStorage.getItem('woundCount')) || 0;
  });

  useEffect(() => {
    localStorage.setItem('woundCount', woundCount);

    window.currentWoundCount = woundCount;

    const event = new CustomEvent('woundCountChanged', { detail: { woundCount } });
    window.dispatchEvent(event);
  }, [woundCount]);

  const incrementWounds = (e) => {
    if(parseFloat(localStorage.getItem('bloodPressure')) > 0) {
      e.stopPropagation();
      setWoundCount(w => Math.min(w + 1, 99));
    }
  };
  
  const decrementWounds = (e) => {
    if(parseFloat(localStorage.getItem('bloodPressure')) > 0) {
      e.stopPropagation();
      setWoundCount(w => Math.max(w - 1, 0));
    }
  };  

  useEffect(() => {
    const fullTank = 60000;
    let animationFrameId;
    let lastTimestamp = null;
  
    let bloodPressure = parseFloat(localStorage.getItem('bloodPressure')) || fullTank;
    let isDraining = false;
  
    const sandUpper = document.querySelector('.sand-upper');
    const sandLower = document.querySelector('.sand-lower');
    const sandStream = document.querySelector('.sand-stream');
    const sandStream2 = document.querySelector('.sand-stream-2');
    if (!sandUpper || !sandLower) return;
  
    const updateSand = () => {
      const percent = Math.max(0, Math.min(bloodPressure / fullTank, 1));
    
      const upperTranslate = 13 * (1 - percent);
      sandUpper.style.transform = `translateY(${upperTranslate.toFixed(2)}vh)`;
    
      const lowerTranslate = 11 - (13 * (1 - percent));
      sandLower.style.transform = `translateY(${lowerTranslate.toFixed(2)}vh)`;
    
      sandLower.style.opacity = '1';
    };
  
    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
    
      const woundCount = window.currentWoundCount || 0;
      const speedFactor = woundCount * 0.1;
    
      bloodPressure -= delta * speedFactor;
      bloodPressure = Math.max(0, bloodPressure);
      localStorage.setItem('bloodPressure', bloodPressure.toFixed(2));
    
      updateSand();
    
      if (bloodPressure > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        stopDrain();
      }
    };
  
    const startDrain = () => {
      if (!isDraining && bloodPressure > 0) {
        isDraining = true;
        lastTimestamp = null;
        animationFrameId = requestAnimationFrame(animate);
        sandStream.style.opacity = '1';
        sandStream2.style.opacity = '1';
      }
    };
  
    const stopDrain = () => {
      isDraining = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
      lastTimestamp = null;
      sandStream.style.opacity = '0';
      sandStream2.style.opacity = '0';
      if (bloodPressure <= 0){
        const url = "https://bible-api.com/data/web/random";
        fetch(url)
          .then((x) => x.json())
          .then((response) => {
            const verseOrigin1 = response?.random_verse?.book || "No verse found.";
            const verseOrigin2 = response?.random_verse?.chapter || "No verse found.";
            const verseOrigin3 = response?.random_verse?.verse || "No verse found.";
            const verseText = response?.random_verse?.text || "No verse found.";
            const eulogy = document.querySelector(".death-verse");
            if (eulogy) {
              eulogy.textContent = "~(" + verseOrigin1 + " " + verseOrigin2 + ":" + verseOrigin3 + ") : " + verseText.replaceAll("Yahweh", "God") + "~";
            }
            const woundCount = document.querySelector(".wound-count");
            if (woundCount) {
              woundCount.style.fontSize = "4em";
              woundCount.textContent = "~UwU~";
            }
          });
      }
    };
  
    const onClick = (e) => {
      if (e.target.closest('button') || e.target.closest('.wound-tracker')) return;
  
      if (!isDraining) {
        startDrain();
      } else {
        stopDrain();
      }
    };
  
    document.addEventListener('click', onClick);
    updateSand();
  
    return () => {
      document.removeEventListener('click', onClick);
      stopDrain();
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
      <div className="death-verse"></div>
      <div className="wound-tracker">
        <div className="wound-button-wrapper">
          <button className="wound-increment sub-wounds" onClick={decrementWounds}>
            <img src="../images/game/arrow.png" alt="Decrease Wound" />
          </button>
        </div>

        <div className="wound-count-wrapper">
          <span className="wound-count">{woundCount}</span>
        </div>

        <div className="wound-button-wrapper">
          <button className="wound-increment add-wounds" onClick={incrementWounds}>
            <img src="../images/game/arrow.png" alt="Increase Wound" />
          </button>
        </div>
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
