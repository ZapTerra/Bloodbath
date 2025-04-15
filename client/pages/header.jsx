import { NavLink } from 'react-router-dom';
import '../css/style.css';

function Header() {
    return (
        <header>
            <NavLink to="/" className="active">
                <button id="header-button">Login</button>
            </NavLink>
            <div id="header-blood-cell"></div>

            <NavLink to="/lobbies" className="active">
                <button id="header-button">Lobbies</button>
            </NavLink>
            <div id="header-blood-cell"></div>

            <NavLink to="/play" className="active">
                <button id="header-button">Play</button>
            </NavLink>
            <div id="header-blood-cell"></div>

            <NavLink to="/stats" className="active">
                <button id="header-button">Logistics</button>
            </NavLink>
            <div id="bar-drip"></div>
        </header>
    );
}

export default Header;
