import '../css/style.css';
import '../css/stats.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Stats() {
    const [userStats, setUserStats] = useState(null);
    const [globalStats, setGlobalStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const resUser = await fetch('/api/stats/me');
                if (resUser.status === 401) {
                    setAuthError(true);
                    return;
                }
                const userData = await resUser.json();
                setUserStats(userData);

                const resGlobal = await fetch('/api/stats/global');
                const globalData = await resGlobal.json();
                setGlobalStats(globalData);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        if (authError) {
            navigate('/error');
        }
    }, [authError, navigate]);

    if (loading) return <p>Loading stats...</p>;
    if (authError) return <p>Redirecting to login...</p>;

    return (
        <div id="stat-container">
            <div id="stat-list">
                <div className="stat">
                    <h2 className="stat-name">Play time:</h2>
                    <p className="stat-info">Soon™</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Global blood departure:</h2>
                    <p className="stat-info">{(globalStats?.totalBloodLost || 0).toLocaleString()}kL</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Wounds taken:</h2>
                    <p className="stat-info">{userStats?.woundsTaken || 0}w</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Wounds staunched:</h2>
                    <p className="stat-info">{userStats?.woundsHealed || 0}w</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Liters of blood departed:</h2>
                    <p className="stat-info">{(userStats?.bloodLost || 0).toLocaleString()}kL</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Liters of blood stolen:</h2>
                    <p className="stat-info">Forthcoming!</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Casters Outlasted:</h2>
                    <p className="stat-info">Forthcoming!</p>
                </div>
                <div className="stat">
                    <h2 className="stat-name">Battles Won:</h2>
                    <p className="stat-info">Forthcoming!</p>
                </div>
            </div>
        </div>
    );
}

export default Stats;
