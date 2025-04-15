import '../css/style.css';

function Login() {
  return (
        <>
            <h1 id="login-titleplate">Speak Friend And Enter</h1>
            <form action="index.html" method = "post">
                <fieldset>
                    <div id="input-wrapper">
                        <label for="username">Mage Name:</label>
                        <input type="text" name="username" id="username" placeholder="MAGE TITLE" required pattern="^[a-zA-Z0-9_]+$"/>
                    </div>
                    <div id="input-wrapper">
                        <label for="password">Pass Phrase:</label>
                        <input type="password" name="password" id="password" placeholder="ARCANE KEY" pattern="^(?!\s*$).+"></input>
                    </div>
                </fieldset>
                <button id="login-button">ENTER</button>
            </form>
        </>
    );
}

export default Login;