import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/table/:tableNumber" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
