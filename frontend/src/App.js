import { useEffect, useState } from "react";
import Login from "./Login";
import Menu from "./Menu";
import { useParams, useNavigate } from "react-router-dom";
export default function App() {
  const { tableNumber } = useParams();
  const [token, setToken] = useState(localStorage.getItem("session_token"));
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    async function checkActiveSession(tableNumber) {
      const res = await fetch(
        `http://127.0.0.1:8000/api/session/active/${tableNumber}`,
      );
      const data = await res.json();
      setActive(data.active);
      data.active && setToken(data.session.token);
      setLoading(false);
    }

    checkActiveSession(tableNumber);
  }, [tableNumber]);
  if (loading)
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  return !active || !token ? (
    <Login
      setActive={setActive}
      setToken={setToken}
      tableNumber={tableNumber}
    />
  ) : (
    <Menu token={token} tableNumber={tableNumber} />
  );
}
