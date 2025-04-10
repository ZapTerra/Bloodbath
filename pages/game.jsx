import '../css/style.css';
import '../css/game.css';

function Game() {
  return (
    <>
      {/* 
      <div id="special-actions">
        <button>Blood Drive</button>
        <button>Hemokeratosis</button>
        <button>Plasma Barrier</button>
      </div> 
      */}

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
        <img src="../images/game/arrow.png" className="wound-increment sub-wounds" alt="" />
        <span className="wound-count">5</span>
        <img src="../images/game/arrow.png" className="wound-increment add-wounds" alt="" />
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