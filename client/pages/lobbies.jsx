import '../css/style.css';
import '../css/lobby.css';

function Lobbies() {
  return (
    <main>
        <div id="lobby-container">
            <div id="lobby-list">
                <div class="lobby">
                    <h2 class="lobby-name">Shadow Wizard Money Gang</h2>
                    <p class="lobby-info">4/6</p>
                    <button class="join-lobby">Join!</button>
                </div>
                <div class="lobby">
                    <h2 class="lobby-name">We Love Casting Spells</h2>
                    <p class="lobby-info">5/6</p>
                    <button class="join-lobby">Join!</button>
                </div>
                <div class="lobby">
                    <h2 class="lobby-name">Wizard Table Spell Gang</h2>
                    <p class="lobby-info">6/6</p>
                    <button class="join-lobby" disabled>Full!</button>
                </div>
                <div class="lobby">
                    <h2 class="lobby-name">Money Casting Wizards</h2>
                    <p class="lobby-info">3/6</p>
                    <button class="join-lobby">Join!</button>
                </div>
            </div>
        </div>
    </main>
  );
}

export default Lobbies;