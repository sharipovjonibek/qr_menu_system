import "./Login.css";
function Login() {
  return (
    <div className="login-container">
      <h1>Buxoro Kafe</h1>
      <Header />
      <Form />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h3>Table X</h3>
      <p>Welcome Guest</p>
    </div>
  );
}

function Form() {
  return (
    <div className="form-container">
      <h2>Ready to feast?</h2>
      <p>Enter your name</p>
      <form>
        <input type="text" placeholder="E.g John"></input>
        <button>Start ordering</button>
      </form>
    </div>
  );
}

export default Login;
