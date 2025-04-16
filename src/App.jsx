import { Routes, Route } from 'react-router-dom';
import '../css/style.css';

import Header from '../pages/header';
import Login from '../pages/login';
import Lobbies from '../pages/lobbies';
import Game from '../pages/game';
import Stats from '../pages/stats';
import Unauthorized from '../pages/unauthorized';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/lobbies" element={<Lobbies />} />
          <Route path="/play" element={<Game />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </main>
      <svg width="0" height="0">
        <filter id="distort">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.005" 
            numOctaves="2" 
            seed="3" 
            result="turbulence">
            <animate 
              attributeName="baseFrequency" 
              values="0.005; 0.007; 0.005" 
              dur="5s" 
              repeatCount="indefinite"/>
          </feTurbulence>
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="turbulence" 
            scale="8" 
            xChannelSelector="R" 
            yChannelSelector="B"/>
        </filter>
      </svg>    
    </div>
  );
}
