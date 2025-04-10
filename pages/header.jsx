import { NavLink } from 'react-router-dom';
import '../css/style.css';

function Header() {
    return (
        <header>
            <NavLink to="/" activeClassName="active">
                <button id="header-button">Login</button>
            </NavLink>
            <div id="header-blood-cell"></div>

            <NavLink to="/lobbies" activeClassName="active">
                <button id="header-button">Lobbies</button>
            </NavLink>
            <div id="header-blood-cell"></div>

            <NavLink to="/play" activeClassName="active">
                <button id="header-button">Play</button>
            </NavLink>
            <div id="header-blood-cell"></div>

            <NavLink to="/stats" activeClassName="active">
                <button id="header-button">Logistics</button>
            </NavLink>
            <div id="bar-drip"></div>
        </header>
    );
}

export default Header;
