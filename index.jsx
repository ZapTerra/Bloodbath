import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '/src/App.jsx';
import './src/css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <link href="css/style.css" rel="stylesheet"></link> 
    <App />
    </BrowserRouter>
    <footer>
        <h4>Christian Hall 2025</h4>
        <a href="https://github.com/ZapTerra/Bloodbath/">GitHub</a>
        <br></br>
        <a href="https://zapdonterra.itch.io/ffxxi">Ribbit!</a>
      </footer>
  </React.StrictMode>
);
