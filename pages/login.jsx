import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style.css';

function Login() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [registering, setRegistering] = useState(false);

    async function handleLogin(event) {
        event.preventDefault();

        const mageName = event.target.username.value;
        const passphrase = event.target.password.value;

        const endpoint = registering ? '/api/auth/register' : '/api/auth/login';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mageName, passphrase }),
        });

        if (response.ok) {
            const data = await response.json();
            setError('');
            setError(data.msg || 'Something went wrong.');
        } else {
            const err = await response.json();
            setError(err.msg || 'Something went wrong.');
        }
    }

    return (
        <>
            <h1 id="login-titleplate">Speak Friend And Enter</h1>
            <form onSubmit={handleLogin}>
                <fieldset>
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
                    <div id="input-wrapper">
                        <label>
                            <input
                                type="checkbox"
                                checked={registering}
                                onChange={(e) => setRegistering(e.target.checked)}
                            />
                            I am a new mage
                        </label>
                    </div>
                </fieldset>
                <button id="login-button">{registering ? 'Create Mage' : 'Enter'}</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </>
    );
}

export default Login;
