import {NavLink, Route, Routes} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import AddFood from "./pages/AddFood.jsx";
import Stats from "./pages/Stats.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Calorie Counter</h1>
          <p className="muted">React SPA (localStorage)</p>
        </div>

        <nav className="nav">
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/add">Add</NavLink>
          <NavLink to="/stats">Stats</NavLink>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddFood />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  );
}