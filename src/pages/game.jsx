import { useEffect, useState, useRef } from 'react';
import '../css/style.css';
import '../css/game.css';

// hourglass
import hourglassBody from '../../public/game/hourglass/hourglass-body.png';
import bgUpper from '../../public/game/hourglass/bg-upper.png';
import bgLower from '../../public/game/hourglass/bg-lower.png';
import sandStream from '../../public/game/hourglass/sand-stream.png';
import sandUpper from '../../public/game/hourglass/sand-upper.png';
import sandLower from '../../public/game/hourglass/sand-lower.png';
import maskUpper from '../../public/game/hourglass/mask-upper.png';
import maskLower from '../../public/game/hourglass/mask-lower.png';

// wound increment arrow
import arrowImg from '../../public/game/arrow.png';

function Game() {
  const [sessionBloodLost, setPendingBloodLost] = useState(0);
  const [sessionWoundsAdded, setPendingWoundsAdded] = useState(0);
  const [sessionWoundsHealed, setPendingWoundsHealed] = useState(0);
  const [sessionDeaths, setSessionDeaths] = useState(0);
  
  const bloodLostRef = useRef(0);
  const woundsAddedRef = useRef(0);
  const woundsHealedRef = useRef(0);
  const deathsRef = useRef(0);
  
  const [woundCount, setWoundCount] = useState(() => {
    return parseInt(localStorage.getItem('woundCount')) || 0;
  });

  useEffect(() => {
    woundsAddedRef.current = sessionWoundsAdded;
  }, [sessionWoundsAdded]);
  
  useEffect(() => {
    woundsHealedRef.current = sessionWoundsHealed;
  }, [sessionWoundsHealed]);

  useEffect(() => {
    deathsRef.current = sessionDeaths;
  }, [sessionDeaths]);

  useEffect(() => {
    localStorage.setItem('woundCount', woundCount);
    window.currentWoundCount = woundCount;

    const event = new CustomEvent('woundCountChanged', { detail: { woundCount } });
    window.dispatchEvent(event);
  }, [woundCount]);

  const incrementWounds = (e) => {
    if (parseFloat(localStorage.getItem('bloodPressure')) > 0) {
      e.stopPropagation();
      setWoundCount((w) => {
        const newCount = Math.min(w + 1, 99);
        if (newCount > w) {
          setPendingWoundsAdded(prev => prev + 1);
          woundsAddedRef.current += 1;
        }
        return newCount;
      });
    }
  };
  
  const decrementWounds = (e) => {
    if (parseFloat(localStorage.getItem('bloodPressure')) > 0) {
      e.stopPropagation();
      setWoundCount((w) => {
        if (w > 0) {
          setPendingWoundsHealed(prev => prev + 1);
          woundsHealedRef.current += 1;
        }
        return Math.max(w - 1, 0);
      });
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
    
      const pressureBefore = bloodPressure;
      bloodPressure -= delta * speedFactor;
      const actualLoss = Math.max(0, pressureBefore - bloodPressure);
      
      bloodLostRef.current += actualLoss;
      setPendingBloodLost(prev => prev + actualLoss);
      
      bloodPressure = Math.max(0, bloodPressure);
      localStorage.setItem('bloodPressure', bloodPressure.toFixed(2));
    
      updateSand();
    
      if (bloodPressure > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setSessionDeaths(prev => prev + 1);
        deathsRef.current += 1;
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
    
      //convert to liters lol
      const bloodLiters = (bloodLostRef.current / 60000 * 2).toFixed(2);

      const statsData = {
        bloodLost: parseFloat(bloodLiters),
        deaths: deathsRef.current,
        woundsTaken: woundsAddedRef.current,
        woundsHealed: woundsHealedRef.current,
      };
      
      console.log("Sending stats:", statsData);
      
      fetch("/api/stats/me", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statsData)
      })
      .then(response => response.json())
      .then(data => console.log("Stats updated:", data))
      .catch(err => console.error("Failed to update stats:", err))
      .finally(() => {
        bloodLostRef.current = 0;
        deathsRef.current = 0;
        woundsAddedRef.current = 0;
        woundsHealedRef.current = 0;
        
        setPendingBloodLost(0);
        setPendingWoundsAdded(0);
        setPendingWoundsHealed(0);
        setSessionDeaths(0);
      });

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
              eulogy.textContent = "✨~(" + verseOrigin1 + " " + verseOrigin2 + ":" + verseOrigin3 + ") : " + verseText.replaceAll("Yahweh", "God").replaceAll("says", "saith") + "~✨";
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
  
    document.addEventListener('pointerdown', onClick);
    updateSand();
  
    return () => {
      document.removeEventListener('pointerdown', onClick);
      stopDrain();
    };
  }, []);

  return (
    <>
      <div className="hourglass-container">
        <img src={hourglassBody} className="hourglass-body" alt="" />
        <img src={bgUpper} className="bg-upper" alt="" />
        <img src={bgLower} className="bg-lower" alt="" />
        <img src={sandStream} className="sand-stream" alt="" />
        <img src={sandStream} className="sand-stream-2" alt="" />

        <div className="sand-upper-container">
          <img src={sandUpper} className="sand-upper" alt="" />
        </div>

        <div className="sand-lower-container">
          <img src={sandLower} className="sand-lower" alt="" />
        </div>

        <img src={maskUpper} className="mask-upper" alt="" />
        <img src={maskLower} className="mask-lower" alt="" />
        </div>
      <div className="death-verse"></div>
      <div className="wound-tracker">
        <div className="wound-button-wrapper">
          <button className="wound-increment sub-wounds" onClick={decrementWounds}>
            <img src={arrowImg} alt="Decrease Wound" style={{pointerEvents: 'none'}} />
          </button>
        </div>

        <div className="wound-count-wrapper">
          <span className="wound-count">{woundCount}</span>
        </div>

        <button type="button" className="wound-increment" onClick={incrementWounds}>
          <img src={arrowImg} alt="Decrease Wound" style={{pointerEvents: 'none'}} />
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