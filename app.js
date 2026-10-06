// Sõnamäng: Euleri tee (Hierholzeri algoritm, sügavuti otsing pinuga)
// Käivitus: node app.js < words.txt
const fs = require("fs");

const lines = fs.readFileSync(0, "utf8").split("\n").map((s) => s.trim());
const n = parseInt(lines[0], 10);
const words = lines.slice(1, n + 1);

// Iga märgi jaoks: sõnad, mis sellest algavad + sisse/välja astmed
const adj = new Map(); // märk -> sõnade indeksid
const inDeg = new Map();
const outDeg = new Map();
const inc = (m, k) => m.set(k, (m.get(k) || 0) + 1);

words.forEach((w, i) => {
  const a = w[0];
  const b = w[w.length - 1];
  if (!adj.has(a)) adj.set(a, []);
  adj.get(a).push(i);
  inc(outDeg, a);
  inc(inDeg, b);
});

function solve() {
  // 1) astmete kontroll
  const chars = new Set([...inDeg.keys(), ...outDeg.keys()]);
  let start = null;
  let plus = 0;
  let minus = 0;
  for (const c of chars) {
    const d = (outDeg.get(c) || 0) - (inDeg.get(c) || 0);
    if (d === 1) {
      plus++;
      start = c;
    } else if (d === -1) {
      minus++;
    } else if (d !== 0) {
      return null;
    }
  }
  if (plus > 1 || minus > 1 || plus !== minus) return null;
  if (start === null) start = words[0][0]; // tsükkel: suvaline tipp, millest väljub serv

  // 2) iteratiivne Hierholzer
  const ptr = new Map(); // märk -> mitu sõna on juba kasutatud
  const stack = [{ v: start, e: -1 }];
  const res = [];
  while (stack.length > 0) {
    const { v } = stack[stack.length - 1];
    const list = adj.get(v) || [];
    const p = ptr.get(v) || 0;
    if (p < list.length) {
      ptr.set(v, p + 1);
      const e = list[p];
      stack.push({ v: words[e][words[e].length - 1], e });
    } else {
      const { e } = stack.pop();
      if (e !== -1) res.push(e);
    }
  }
  res.reverse();

  // 3) seotuse kontroll
  if (res.length !== n) return null;
  return res.map((i) => words[i]);
}

const ans = solve();
console.log(ans === null ? "EI" : "JAH\n" + ans.join("\n"));

//EI Vastuse testimiseks:
// 3
// Abbb
// Baaa
// aaaB