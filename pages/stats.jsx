
import '../css/style.css';
import '../css/stats.css';

function Stats() {
  return (
    <>
        <div id="stat-container">
            <div id="stat-list">
                <div class="stat">
                    <h2 class="stat-name">Play time:</h2>
                    <p class="stat-info">12hrs</p>
                </div>
                <div class="stat">
                    <h2 class="stat-name">Wounds taken:</h2>
                    <p class="stat-info">129w</p>
                </div>
                <div class="stat">
                    <h2 class="stat-name">Wounds staunched:</h2>
                    <p class="stat-info">72w</p>
                </div>
                <div class="stat">
                    <h2 class="stat-name">Liters of blood departed:</h2>
                    <p class="stat-info">14kL</p>
                </div>
                <div class="stat">
                    <h2 class="stat-name">Liters of blood stolen:</h2>
                    <p class="stat-info">47L</p>
                </div>
                <div class="stat">
                    <h2 class="stat-name">Casters Outlasted:</h2>
                    <p class="stat-info">29</p>
                </div>
                <div class="stat">
                    <h2 class="stat-name">Battles Won:</h2>
                    <p class="stat-info">5</p>
                </div>
            </div>
        </div>
    </>
  );
}

export default Stats;