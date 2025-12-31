import { useState } from "react";
import { useNavigate } from "react-router-dom";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const QUICK_PRESETS = [
  { name: "Coffee (latte)", calories: 180 },
  { name: "Croissant", calories: 320 },
  { name: "Egg + cheese toast", calories: 380 },
  { name: "Subway meal", calories: 650 },
  { name: "Protein bar", calories: 220 },
];

export default function AddFood() {
  const navigate = useNavigate();

  const [date, setDate] = useState(todayISO());
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");

  function addPreset(p) {
    setName(p.name);
    setCalories(String(p.calories));
  }

  function onSubmit(e) {
    e.preventDefault();

    const trimmed = name.trim();
    const kcal = Number(calories);

    if (!trimmed) return alert("Enter food name");
    if (!Number.isFinite(kcal) || kcal <= 0)
      return alert("Enter calories greater than 0");

    const raw = localStorage.getItem("logs");
    const logs = raw ? JSON.parse(raw) : {};

    const entry = {
      id: crypto.randomUUID(),
      name: trimmed,
      calories: Math.round(kcal),
      createdAt: Date.now(),
    };

    logs[date] = [entry, ...(logs[date] ?? [])];
    localStorage.setItem("logs", JSON.stringify(logs));

    navigate("/");
  }

  return (
    <div className="page">
      <h2>Add Food</h2>

      <section className="card">
        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Date
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="label">
            Food Name
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., chicken wrap"
            />
          </label>

          <label className="label">
            Calories
            <input
              className="input"
              type="number"
              min="1"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="e.g., 250"
            />
          </label>

          <div className="subcard">
            <div className="muted" style={{ marginBottom: 8 }}>Quick add</div>
            <div className="row">
              {QUICK_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className="btn"
                  onClick={() => addPreset(p)}
                >
                  {p.name} • {p.calories}
                </button>
              ))}
            </div>
          </div>

          <div className="row">
            <button className="btn primary" type="submit">Add Food</button>
            <button className="btn" type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
