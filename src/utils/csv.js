export async function parseCSV(file) {
  const text = await file.text();
  const lines = text
    .replace(/\r/g, "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const header = splitCSVLine(lines[0]).map(h => h.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCSVLine(lines[i]);
    const obj = {};
    header.forEach((h, idx) => { obj[h] = (cols[idx] ?? "").trim(); });
    rows.push(obj);
  }
  return rows;
}

// split CSV respeitando aspas
function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      q = !q;
      continue;
    }
    if (ch === "," && !q) {
      out.push(cur);
      cur = "";
      continue;
    }
    out.push;
    cur += ch;
  }
  out.push(cur);
  return out;
}
