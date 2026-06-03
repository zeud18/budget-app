import { useState } from "react";

const CATEGORIES = ["🍔 Food", "🚗 Transport", "🏠 Housing", "💊 Health", "🎮 Fun", "🛍️ Shopping", "📦 Other"];
const INCOME_CATS = ["💼 Salary", "💰 Freelance", "📈 Investment", "🎁 Gift", "📦 Other"];

const formatCurrency = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

const generateId = () => Math.random().toString(36).slice(2);

const INITIAL_TRANSACTIONS = [
  { id: generateId(), type: "income", amount: 3200, category: "💼 Salary", note: "Monthly salary", date: "2026-06-01" },
  { id: generateId(), type: "expense", amount: 850, category: "🏠 Housing", note: "Rent", date: "2026-06-01" },
  { id: generateId(), type: "expense", amount: 120, category: "🍔 Food", note: "Groceries", date: "2026-06-02" },
  { id: generateId(), type: "expense", amount: 45, category: "🚗 Transport", note: "Gas", date: "2026-06-02" },
  { id: generateId(), type: "expense", amount: 30, category: "🎮 Fun", note: "Netflix", date: "2026-06-03" },
];

export default function BudgetApp() {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [view, setView] = useState("dashboard");
  const [form, setForm] = useState({ type: "expense", amount: "", category: CATEGORIES[0], note: "", date: new Date().toISOString().split("T")[0] });
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState(null);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const categoryTotals = CATEGORIES.map(cat => ({
    cat,
    total: transactions.filter(t => t.type === "expense" && t.category === cat).reduce((s, t) => s + t.amount, 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const showToast = (msg, color = "#10b981") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2200);
  };

  const handleAdd = () => {
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      showToast("Enter a valid amount", "#ef4444");
      return;
    }
    const tx = { ...form, amount: Number(form.amount), id: generateId() };
    setTransactions(prev => [tx, ...prev]);
    setForm({ type: "expense", amount: "", category: CATEGORIES[0], note: "", date: new Date().toISOString().split("T")[0] });
    showToast(tx.type === "expense" ? "Expense added!" : "Income added!");
    setView("dashboard");
  };

  const handleDelete = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast("Deleted", "#6b7280");
  };

  const filtered = filter === "all" ? transactions : transactions.filter(t => t.type === filter);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#f0f0f5",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        input, select { outline: none; }
        button { cursor: pointer; border: none; background: none; }
        .slide-up { animation: slideUp 0.32s cubic-bezier(.22,.68,0,1.2) both; }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }
        .pop { animation: pop 0.22s cubic-bezier(.22,.68,0,1.4) both; }
        @keyframes pop { from { transform:scale(0.88); opacity:0;} to { transform:scale(1); opacity:1;} }
        .bar-fill { animation: barGrow 0.7s cubic-bezier(.22,.68,0,1) both; transform-origin: left; }
        @keyframes barGrow { from { transform:scaleX(0); } to { transform:scaleX(1); } }
        .card:active { transform: scale(0.98); transition: transform 0.12s; }
      `}</style>

      {toast && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: toast.color, color: "#fff", borderRadius: 40, padding: "10px 22px",
          fontSize: 14, fontWeight: 600, zIndex: 999, whiteSpace: "nowrap",
          boxShadow: `0 4px 24px ${toast.color}66`,
          animation: "pop 0.2s ease both"
        }}>{toast.msg}</div>
      )}

      <div style={{ padding: "52px 24px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: 12, color: "#6b6b80", fontWeight: 500, letterSpacing: 2, textTransform: "uppercase" }}>June 2026</p>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>My Finance Planner</h1>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 14, background: "#1a1a28",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
          }}>💎</div>
        </div>

        <div className="slide-up" style={{
          marginTop: 20,
          background: "linear-gradient(135deg, #6c63ff 0%, #3b82f6 50%, #06b6d4 100%)",
          borderRadius: 24, padding: "24px 24px 20px",
          boxShadow: "0 8px 40px #6c63ff44",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -20, left: 60, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>Total Balance</p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, marginTop: 4, letterSpacing: -1 }}>
            {formatCurrency(balance)}
          </p>
          <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
            {[["↑ Income", totalIncome, "#a7f3d0"], ["↓ Spent", totalExpense, "#fca5a5"]].map(([label, val, col]) => (
              <div key={label}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: col, marginTop: 2 }}>{formatCurrency(val)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {view === "dashboard" && (
        <div className="slide-up" style={{ padding: "24px 24px 100px" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[["➕", "Add", () => setView("add")], ["📋", "History", () => setView("history")]].map(([icon, label, fn]) => (
              <button key={label} onClick={fn} style={{
                flex: 1, background: "#16162a", borderRadius: 16, padding: "14px 0",
                fontSize: 13, fontWeight: 600, color: "#c4c4d8", display: "flex",
                flexDirection: "column", alignItems: "center", gap: 4,
                border: "1px solid #2a2a3e", transition: "all 0.15s"
              }}>
                <span style={{ fontSize: 22 }}>{icon}</span>{label}
              </button>
            ))}
          </div>

          {categoryTotals.length > 0 && (
            <div>
              <p style={{ fontSize: 13, color: "#6b6b80", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14 }}>Spending Breakdown</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {categoryTotals.map(({ cat, total }) => {
                  const pct = totalExpense > 0 ? total / totalExpense : 0;
                  return (
                    <div key={cat} style={{ background: "#13132200", padding: "12px 16px", borderRadius: 16, border: "1px solid #1e1e32" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{cat}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#f87171" }}>{formatCurrency(total)}</span>
                      </div>
                      <div style={{ height: 5, background: "#1e1e32", borderRadius: 99, overflow: "hidden" }}>
                        <div className="bar-fill" style={{ height: "100%", width: `${pct * 100}%`, background: "linear-gradient(90deg, #6c63ff, #06b6d4)", borderRadius: 99 }} />
                      </div>
                      <p style={{ fontSize: 11, color: "#4a4a60", marginTop: 5 }}>{Math.round(pct * 100)}% of expenses</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <p style={{ fontSize: 13, color: "#6b6b80", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "24px 0 14px" }}>Recent</p>
          {transactions.slice(0, 4).map(tx => (
            <div key={tx.id} className="card" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 0", borderBottom: "1px solid #14142200"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 13, background: "#16162a",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                }}>{tx.category.split(" ")[0]}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{tx.note || tx.category}</p>
                  <p style={{ fontSize: 12, color: "#4a4a60", marginTop: 1 }}>{tx.date}</p>
                </div>
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: tx.type === "income" ? "#34d399" : "#f87171" }}>
                {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
              </p>
            </div>
          ))}
          {transactions.length > 4 && (
            <button onClick={() => setView("history")} style={{ width: "100%", textAlign: "center", color: "#6c63ff", fontSize: 13, fontWeight: 600, marginTop: 14 }}>
              See all {transactions.length} transactions →
            </button>
          )}
        </div>
      )}

      {view === "add" && (
        <div className="slide-up" style={{ padding: "28px 24px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <button onClick={() => setView("dashboard")} style={{
              width: 38, height: 38, borderRadius: 12, background: "#16162a",
              color: "#c4c4d8", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
            }}>←</button>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>Add Transaction</h2>
          </div>

          <div style={{ display: "flex", background: "#16162a", borderRadius: 14, padding: 4, marginBottom: 20, border: "1px solid #2a2a3e" }}>
            {["expense", "income"].map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, type: t, category: t === "expense" ? CATEGORIES[0] : INCOME_CATS[0] }))} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: form.type === t ? (t === "expense" ? "#ef4444" : "#10b981") : "transparent",
                color: form.type === t ? "#fff" : "#6b6b80",
                transition: "all 0.2s", textTransform: "capitalize"
              }}>{t === "expense" ? "💸 Expense" : "💵 Income"}</button>
            ))}
          </div>

          {[
            { label: "Amount", el: <input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} style={inputStyle} /> },
            { label: "Category", el: <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} style={inputStyle}>
              {(form.type === "expense" ? CATEGORIES : INCOME_CATS).map(c => <option key={c}>{c}</option>)}</select> },
            { label: "Note", el: <input placeholder="Optional note..." value={form.note} onChange={e => setForm(f => ({...f, note: e.target.value}))} style={inputStyle} /> },
            { label: "Date", el: <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} style={inputStyle} /> },
          ].map(({ label, el }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#6b6b80", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</p>
              {el}
            </div>
          ))}

          <button onClick={handleAdd} style={{
            width: "100%", marginTop: 8,
            background: "linear-gradient(135deg, #6c63ff, #3b82f6)",
            color: "#fff", borderRadius: 16, padding: "16px 0",
            fontSize: 15, fontWeight: 700, letterSpacing: 0.3,
            boxShadow: "0 4px 20px #6c63ff44"
          }}>Save Transaction</button>
        </div>
      )}

      {view === "history" && (
        <div className="slide-up" style={{ padding: "28px 24px 100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <button onClick={() => setView("dashboard")} style={{
              width: 38, height: 38, borderRadius: 12, background: "#16162a",
              color: "#c4c4d8", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center"
            }}>←</button>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>History</h2>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {["all", "expense", "income"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: filter === f ? "#6c63ff" : "#16162a",
                color: filter === f ? "#fff" : "#6b6b80",
                border: filter === f ? "none" : "1px solid #2a2a3e",
                textTransform: "capitalize", transition: "all 0.15s"
              }}>{f === "all" ? "All" : f === "expense" ? "💸 Expenses" : "💵 Income"}</button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map(tx => (
              <div key={tx.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px", borderRadius: 14,
                background: "#16162a", marginBottom: 6,
                border: "1px solid #1e1e32"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 13, background: "#0e0e1a",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18
                  }}>{tx.category.split(" ")[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{tx.note || tx.category}</p>
                    <p style={{ fontSize: 11, color: "#4a4a60", marginTop: 1 }}>{tx.category} · {tx.date}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: tx.type === "income" ? "#34d399" : "#f87171" }}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </p>
                  <button onClick={() => handleDelete(tx.id)} style={{
                    width: 28, height: 28, borderRadius: 8, background: "#2a1a1a",
                    color: "#ef4444", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center"
                  }}>×</button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#4a4a60", marginTop: 40, fontSize: 14 }}>No transactions yet</div>
          )}
        </div>
      )}

      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#0d0d1a", borderTop: "1px solid #1e1e32",
        display: "flex", justifyContent: "space-around", padding: "12px 0 20px"
      }}>
        {[["🏠", "Home", "dashboard"], ["➕", "Add", "add"], ["📋", "History", "history"]].map(([icon, label, v]) => (
          <button key={v} onClick={() => setView(v)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            color: view === v ? "#6c63ff" : "#4a4a60", fontSize: 12, fontWeight: 600, transition: "color 0.15s"
          }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", background: "#16162a", border: "1px solid #2a2a3e",
  borderRadius: 14, padding: "13px 16px", color: "#f0f0f5",
  fontSize: 15, fontFamily: "inherit", appearance: "none",
  WebkitAppearance: "none"
};
