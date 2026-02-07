import { useParams } from "react-router-dom";
import "./Login.css";
import { useState } from "react";
import React from "react";
function Login({ setToken }) {
  console.log("working");
  const { tableNumber } = useParams();
  async function onHandleForm(e, customerName) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/session/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        table_number: tableNumber,
        customer_name: customerName,
      }),
    });
    const token = await res.json();
    localStorage.setItem("session_token", token.token);
    setToken(token.token);
  }
  return (
    <div className="login-body">
      <div className="login-container">
        <h1>Buxoro Kafe </h1>
        <Header tableNumber={tableNumber} />
        <Form handleForm={onHandleForm} />
      </div>
    </div>
  );
}

function Header({ tableNumber }) {
  return (
    <div className="header">
      <h3>Table {tableNumber}</h3>
      <p>Welcome Guest</p>
    </div>
  );
}

function Form({ handleForm }) {
  const [customerName, setCustomerName] = useState("");
  return (
    <div className="form-container">
      <h2>Ready to feast?</h2>
      <p>Enter your name</p>
      <form onSubmit={(e) => handleForm(e, customerName)}>
        <input
          type="text"
          placeholder="Your Name (e.g John)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        ></input>
        <button>Start ordering</button>
      </form>
    </div>
  );
}

export default Login;
