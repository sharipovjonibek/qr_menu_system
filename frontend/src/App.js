import { useEffect, useState } from "react";
import Login from "./Login";
import Menu from "./Menu";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
  useEffect(() => localStorage.removeItem("session_token"), []);

  const [token, setToken] = useState(localStorage.getItem("session_token"));
  console.log(token);
  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          <Route
            path="/table/:tableNumber"
            element={<Login setToken={setToken} />}
          />
        ) : (
          <Route
            path="/table/:tableNumber/menu"
            element={<Menu token={token} />}
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}
