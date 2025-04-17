import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [registering, setRegistering] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        async function checkAuth() {
          try {
            const response = await fetch('/api/auth/verify', {
              credentials: 'include'
            });
            if (response.ok) {
              const data = await response.json();
              setIsLoggedIn(true);
              setError(`OPEN UNTO YOU, ${data.mageName.toUpperCase()}!`);
            }
          } catch (e) {
            //Not logged in
          }
        }
        checkAuth();
      }, []);

    async function handleLogin(event) {
        event.preventDefault();
        const mageName = event.target.username.value;
        const passphrase = event.target.password.value;
        const endpoint = registering ? '/api/auth/register' : '/api/auth/login';
    
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mageName, passphrase }),
                credentials: 'include'
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setIsLoggedIn(true);
                setError(data.msg);
            } else {
                setError(data.msg || 'WOE! PLAGUE BE UPON YE!');
            }
        } catch (error) {
            setError('Arcane forces disrupt our communications.');
        }
    }

    async function handleLogout() {
        await fetch('/api/auth/logout', {
          method: 'DELETE',
          credentials: 'include'
        });
        setIsLoggedIn(false);
        setError('');
        navigate('/');
    }

    return (
        <>
            <h1 id="login-titleplate">Speak Friend And Enter</h1>
            <form onSubmit={handleLogin}>
                <fieldset>
                    {isLoggedIn ? (
                        <div style={{ textAlign: 'center', fontSize: 'xx-large', color: '#780606' }}>
                            Logged in!
                            <br />
                            <button
                                id="login-button"
                                type="button"
                                style={{ marginLeft: '1em' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <div id="input-wrapper">
                                <label htmlFor="username">Mage Name:</label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    placeholder="MAGE TITLE"
                                    required
                                    pattern="^[a-zA-Z0-9_]+$"
                                />
                            </div>
                            <div id="input-wrapper">
                                <label htmlFor="password">Pass Phrase:</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="ARCANE KEY"
                                    pattern="^(?!\\s*$).+"
                                    required
                                />
                            </div>
                            <div className="checkbox-wrapper">
                                <label className="new-user-check">
                                    <input
                                        type="checkbox"
                                        checked={registering}
                                        onChange={e => setRegistering(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    I am a new mage
                                </label>
                            </div>
                        </>
                    )}
                </fieldset>
                {!isLoggedIn && (
                    <button id="login-button" type="submit">
                        {registering ? 'Create Mage' : 'Enter'}
                    </button>
                )}
                {error && (
                    <p style={{
                        color: 'red',
                        textAlign: 'center',
                        width: '100%',
                        margin: '1em 0'
                    }}>
                        {error}
                    </p>
                )}
            </form>
        </>
    );
}

export default Login;
