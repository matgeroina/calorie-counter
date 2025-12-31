import { useEffect, useMemo, useState } from "react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const [date, setDate] = useState(todayISO());

  const [goal, setGoal] = useState(() => {
    const raw = localStorage.getItem("goal");
    return raw ? Number(raw) : 1800;
  });

  const [logs, setLogs] = useState(() => {
    const raw = localStorage.getItem("logs");
    return raw ? JSON.parse(raw) : {};
  });

  const entries = logs[date] ?? [];

  const total = useMemo(
    () => entries.reduce((sum, e) => sum + (Number(e.calories) || 0), 0),
    [entries]
  );

  const remaining = Math.max(goal - total, 0);
  const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;

  useEffect(() => localStorage.setItem("goal", String(goal)), [goal]);
  useEffect(() => localStorage.setItem("logs", JSON.stringify(logs)), [logs]);

  function deleteEntry(id) {
    setLogs({
      ...logs,
      [date]: entries.filter((e) => e.id !== id),
    });
  }

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <section className="card">
        <div className="row">
          <label className="label">
            Date
            <input
              type="date"
              value={date}
              className="input"
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="label">
            Daily Goal (kcal)
            <input
              type="number"
              className="input"
              min="0"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
            />
          </label>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="stat-title">Eaten</div>
            <div className="stat-value">{total} kcal</div>
          </div>
          <div className="stat">
            <div className="stat-title">Remaining</div>
            <div className="stat-value">{remaining} kcal</div>
          </div>
        </div>

        <div className="progress">
          <div className="progress-bar" style={{ width: `${percent}%` }} />
        </div>

        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => setLogs({ ...logs, [date]: [] })}>
            Clear Day
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Food Log</h2>

        {entries.length === 0 ? (
          <p className="muted">No entries yet. Go to "Add".</p>
        ) : (
          <ul className="list">
            {entries.map((e) => (
              <li className="list-item" key={e.id}>
                <div>
                  <div className="item-name">{e.name}</div>
                  <div className="muted">{e.calories} kcal</div>
                </div>
                <button className="btn danger" onClick={() => deleteEntry(e.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
