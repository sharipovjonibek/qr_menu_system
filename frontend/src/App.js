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
        <Route
          path="/table/:tableNumber"
          element={
            !token ? <Login setToken={setToken} /> : <Menu token={token} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
