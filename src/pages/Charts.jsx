import { useMemo } from "react";
import { useDB } from "../store/DBContext.jsx";
import { brl, groupExpensesByCategory, monthTotalsSeries, ymNow } from "../store/db";

/* ===== Mini SVG Charts (sem biblioteca) ===== */

function polarToCartesian(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", r, r, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

function Pie({ data, size = 220 }) {
  const total = data.reduce((a,b) => a + b.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 10;

  let angle = 0;

  // cores fixas “classiconas” (sem depender de lib)
  const palette = ["#ff7a1a", "#4aa3ff", "#7cff6b", "#ff5aa5", "#ffe66b", "#9b5cff", "#66fff0", "#ffb86b"];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.10)" />
      {data.map((s, i) => {
        const pct = total > 0 ? s.value / total : 0;
        const sweep = pct * 360;
        const start = angle;
        const end = angle + sweep;
        angle = end;

        if (sweep <= 0) return null;

        // fatia como arco + linha pro centro (efeito de “slice”)
        const arc = describeArc(cx, cy, r, start, end);
        const p1 = polarToCartesian(cx, cy, r, start);
        const p2 = polarToCartesian(cx, cy, r, end);

        return (
          <path
            key={s.label}
            d={`${arc} L ${cx} ${cy} L ${p1.x} ${p1.y} Z`}
            fill={palette[i % palette.length]}
            opacity="0.92"
          />
        );
      })}
    </svg>
  );
}

function Line({ points, width = 520, height = 220 }) {
  const pad = 24;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const max = Math.max(...points.map(p => p.value), 1);
  const min = Math.min(...points.map(p => p.value), 0);

  const range = Math.max(1, max - min);

  const xs = points.map((p, i) => pad + (i * (w / Math.max(1, points.length - 1))));
  const ys = points.map((p) => pad + (h - ((p.value - min) / range) * h));

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xs[i]} ${ys[i]}`).join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x="0" y="0" width={width} height={height} rx="16" fill="rgba(0,0,0,0.18)" stroke="rgba(255,255,255,0.10)" />
      <path d={d} fill="none" stroke="#4aa3ff" strokeWidth="3" />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={xs[i]} cy={ys[i]} r="4" fill="#ff7a1a" />
          <text x={xs[i]} y={height - 8} fontSize="11" textAnchor="middle" fill="rgba(255,255,255,0.75)">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Charts() {
  const { db } = useDB();
  const ym = ymNow();

  const pie = useMemo(() => {
    const { rows, total } = groupExpensesByCategory(db, ym);
    const top = rows.slice(0, 6);
    const rest = rows.slice(6).reduce((a,b)=>a + b.total, 0);

    const data = top.map(r => ({ label: r.category, value: r.total }));
    if (rest > 0) data.push({ label: "Outros (resto)", value: rest });

    return { data, total };
  }, [db, ym]);

  const series = useMemo(() => monthTotalsSeries(db, 6), [db]);

  const linePoints = series.map(s => ({
    label: s.ym.slice(5), // "MM"
    value: s.net
  }));

  const card = {
    padding: 18,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    maxWidth: 1100,
  };

  const block = {
    padding: 14,
    borderRadius: 14,
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  return (
    <div style={card}>
      <div style={{ fontSize: 40, fontWeight: 900 }}>Gráficos</div>
      <div style={{ opacity: 0.75 }}>Sem biblioteca. Raiz. Do jeito antigo (que funciona).</div>

      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "340px 1fr", gap: 12 }}>
        <div style={block}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Pizza de gastos • {ym}</div>
          {pie.total <= 0 ? (
            <div style={{ opacity: 0.75 }}>Sem gastos no mês (ainda).</div>
          ) : (
            <>
              <Pie data={pie.data.map(d => ({ label: d.label, value: d.value }))} />
              <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
                {pie.data.map(d => (
                  <div key={d.label} style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                    <span>{d.label}</span>
                    <b>{brl(d.value)}</b>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div style={block}>
          <div style={{ fontWeight: 900, marginBottom: 10 }}>Linha de saldo (últimos 6 meses)</div>
          <Line points={linePoints} />
          <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
            {series.map(s => (
              <div key={s.ym} style={{ display: "flex", justifyContent: "space-between", opacity: 0.9 }}>
                <span>{s.ym}</span>
                <b>{brl(s.net)}</b>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
