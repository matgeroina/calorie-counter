import { useMemo } from "react";

function iso(d) {
  return d.toISOString().slice(0, 10);
}

function addDays(isoDate, days) {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return iso(d);
}

function sumCalories(entries) {
  return (entries ?? []).reduce((sum, e) => sum + (Number(e.calories) || 0), 0);
}

export default function Stats() {
  const goalRaw = localStorage.getItem("goal");
  const goal = goalRaw ? Number(goalRaw) : 1800;

  const logsRaw = localStorage.getItem("logs");
  const logs = logsRaw ? JSON.parse(logsRaw) : {};

  const today = iso(new Date());

  const rows = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDays(today, -i);
      const total = sumCalories(logs[d]);
      const percent = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;
      out.push({ date: d, total, percent });
    }
    return out;
  }, [today, logs, goal]);

  return (
    <section className="card">
      <h2>Stats (7 days)</h2>
      <p className="muted">Goal: {goal} kcal/day</p>

      <div className="table">
        {rows.map((r) => (
          <div className="table-row" key={r.date}>
            <div className="mono">{r.date}</div>
            <div className="bold">{r.total} kcal</div>
            <div className="progress small">
              <div className="progress-bar" style={{ width: `${r.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
