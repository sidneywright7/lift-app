import { useState, useReducer, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────
const DEFAULT_EXERCISES = [
  { id: 1, name: "Bench Press", muscleGroup: "chest", emoji: "🏋️", completed: false },
  { id: 2, name: "Squat", muscleGroup: "legs", emoji: "🦵", completed: false },
  { id: 3, name: "Deadlift", muscleGroup: "back", emoji: "⚡", completed: false },
  { id: 4, name: "Pull-Ups", muscleGroup: "back", emoji: "⬆️", completed: false },
  { id: 5, name: "Overhead Press", muscleGroup: "shoulders", emoji: "💪", completed: false },
  { id: 6, name: "Barbell Curl", muscleGroup: "arms", emoji: "💪", completed: false },
  { id: 7, name: "Plank", muscleGroup: "core", emoji: "🧱", completed: false },
  { id: 8, name: "Lateral Raises", muscleGroup: "shoulders", emoji: "🦅", completed: false },
];

// ─────────────────────────────────────────────
//  REDUCER
// ─────────────────────────────────────────────
const initialState = {
  todos: DEFAULT_EXERCISES,
  filter: "all",
  nextId: 9,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            name: action.name,
            muscleGroup: action.muscleGroup || "general",
            emoji: "🏃",
            completed: false,
          },
        ],
        nextId: state.nextId + 1,
      };
    case "REMOVE_TODO":
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.id ? { ...t, completed: !t.completed } : t
        ),
      };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────
//  CSS
// ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0D0D0F;
    --surface: #141416;
    --surface2: #1C1C1F;
    --surface3: #252528;
    --border: #2A2A2E;
    --text: #F0F0F0;
    --text-muted: #6B6B75;
    --accent: #E8FF47;
    --accent-dim: rgba(232,255,71,0.12);
    --danger: #FF4444;
    --success: #4ECF8E;
    --radius: 14px;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    min-height: 100vh;
  }

  /* NAV */
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(13,13,15,0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .navbar-logo {
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: 2px;
    color: var(--accent);
  }
  .navbar-logo span { color: var(--text); }
  .navbar-links {
    display: flex;
    gap: 8px;
  }
  .navbar-links a {
    padding: 8px 20px;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 500;
    font-family: var(--font-body);
    transition: all 0.2s;
    border: 1.5px solid transparent;
  }
  .navbar-links a:hover { color: var(--text); border-color: var(--border); }
  .navbar-links a.active {
    background: var(--accent);
    color: #0D0D0F;
    font-weight: 600;
    border-color: var(--accent);
  }

  /* LAYOUT */
  .page { max-width: 900px; margin: 0 auto; padding: 40px 24px; }

  /* PAGE TITLE */
  .page-title {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 8px;
    line-height: 1;
  }
  .page-subtitle {
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 36px;
  }

  /* SIDE BY SIDE LAYOUT */
  .todos-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }

  /* ADD FORM */
  .add-form {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    position: sticky;
    top: 88px;
  }
  .add-form-title {
    font-family: var(--font-display);
    font-size: 22px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .add-form label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 6px;
    margin-top: 14px;
  }
  .add-form label:first-of-type { margin-top: 0; }
  .add-input {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.18s;
  }
  .add-input:focus { border-color: var(--accent); }
  .add-input::placeholder { color: var(--text-muted); }
  .add-select {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s;
  }
  .add-select:focus { border-color: var(--accent); }
  .add-btn {
    width: 100%;
    margin-top: 18px;
    padding: 12px;
    background: var(--accent);
    color: #0D0D0F;
    border: none;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .add-btn:hover { background: #f5ff7a; }

  /* FILTER BAR */
  .filter-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .filter-btn {
    padding: 7px 16px;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
  }
  .filter-btn:hover { border-color: var(--text-muted); color: var(--text); }
  .filter-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-dim);
  }

  /* STATS ROW */
  .stats-row {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .stat-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 14px 20px;
    flex: 1;
    min-width: 100px;
  }
  .stat-val {
    font-family: var(--font-display);
    font-size: 36px;
    color: var(--accent);
    line-height: 1;
  }
  .stat-label {
    font-size: 11px;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 4px;
  }

  /* PROGRESS BAR */
  .progress-bar {
    height: 4px;
    background: var(--surface3);
    border-radius: 999px;
    margin-bottom: 24px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), #7fff6d);
    border-radius: 999px;
    transition: width 0.4s ease;
  }

  /* TODO LIST */
  .todo-list { display: flex; flex-direction: column; gap: 10px; }

  .todo-item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.2s;
    animation: slideIn 0.2s ease-out;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .todo-item.completed {
    opacity: 0.4;
    border-color: transparent;
    background: var(--surface2);
  }
  .todo-check {
    width: 22px; height: 22px;
    border-radius: 6px;
    border: 2px solid var(--border);
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: white;
    transition: all 0.18s;
  }
  .todo-check:hover { border-color: var(--success); }
  .todo-item.completed .todo-check {
    background: var(--success);
    border-color: var(--success);
  }
  .todo-emoji { font-size: 22px; flex-shrink: 0; }
  .todo-info { flex: 1; min-width: 0; }
  .todo-name {
    font-size: 15px;
    font-weight: 600;
  }
  .todo-item.completed .todo-name {
    text-decoration: line-through;
    color: var(--text-muted);
  }
  .todo-group {
    font-size: 12px;
    color: var(--text-muted);
    text-transform: capitalize;
    margin-top: 2px;
  }
  .todo-delete {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    transition: all 0.18s;
  }
  .todo-delete:hover {
    border-color: var(--danger);
    background: rgba(255,68,68,0.1);
    color: var(--danger);
  }

  /* EMPTY STATE */
  .empty {
    text-align: center;
    padding: 60px 24px;
    color: var(--text-muted);
  }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title {
    font-family: var(--font-display);
    font-size: 24px;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 6px;
  }

  /* CONTACT PAGE */
  .contact-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
  }
  .contact-info h2 {
    font-family: var(--font-display);
    font-size: 32px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .contact-info p {
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.7;
    margin-bottom: 12px;
  }
  .contact-form {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
  }
  .contact-form-title {
    font-family: var(--font-display);
    font-size: 24px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 20px;
    color: var(--accent);
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .form-field { margin-bottom: 16px; }
  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    margin-bottom: 6px;
  }
  .form-input {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.18s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--text-muted); }
  .form-textarea {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.18s;
  }
  .form-textarea:focus { border-color: var(--accent); }
  .form-textarea::placeholder { color: var(--text-muted); }
  .form-submit {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    color: #0D0D0F;
    border: none;
    border-radius: 10px;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.18s;
    margin-top: 4px;
  }
  .form-submit:hover { background: #f5ff7a; }
  .form-success {
    background: rgba(78,207,142,0.1);
    border: 1.5px solid var(--success);
    border-radius: 10px;
    padding: 14px;
    color: var(--success);
    font-size: 14px;
    text-align: center;
    margin-top: 12px;
    font-weight: 500;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 3px; }

  @media (max-width: 700px) {
    .todos-layout { grid-template-columns: 1fr; }
    .contact-layout { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .add-form { position: static; }
  }
`;

// ─────────────────────────────────────────────
//  TODOS PAGE
// ─────────────────────────────────────────────
function TodosPage({ state, dispatch }) {
  const [inputVal, setInputVal] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("general");

  function handleAdd() {
    if (!inputVal.trim()) return;
    dispatch({ type: "ADD_TODO", name: inputVal.trim(), muscleGroup });
    setInputVal("");
    setMuscleGroup("general");
  }

  const filtered = state.todos.filter((t) => {
    if (state.filter === "completed") return t.completed;
    if (state.filter === "incomplete") return !t.completed;
    return true;
  });

  const total = state.todos.length;
  const done = state.todos.filter((t) => t.completed).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="page">
      <div className="page-title">My Workout</div>
      <div className="page-subtitle">Track your exercises for today's session</div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-val">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{done}</div>
          <div className="stat-label">Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{total - done}</div>
          <div className="stat-label">Left</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{progress}%</div>
          <div className="stat-label">Progress</div>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="todos-layout">
        {/* LEFT — todo list */}
        <div>
          <div className="filter-bar">
            {["all", "incomplete", "completed"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${state.filter === f ? "active" : ""}`}
                onClick={() => dispatch({ type: "SET_FILTER", filter: f })}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🏋️</div>
              <div className="empty-title">No exercises here</div>
              <p>Add one using the form!</p>
            </div>
          ) : (
            <div className="todo-list">
              {filtered.map((todo) => (
                <div
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "completed" : ""}`}
                >
                  <button
                    className="todo-check"
                    onClick={() => dispatch({ type: "TOGGLE_TODO", id: todo.id })}
                  >
                    {todo.completed && "✓"}
                  </button>
                  <span className="todo-emoji">{todo.emoji}</span>
                  <div className="todo-info">
                    <div className="todo-name">{todo.name}</div>
                    <div className="todo-group">{todo.muscleGroup}</div>
                  </div>
                  <button
                    className="todo-delete"
                    onClick={() => dispatch({ type: "REMOVE_TODO", id: todo.id })}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — add form */}
        <div className="add-form">
          <div className="add-form-title">Add Exercise</div>
          <label>Exercise Name</label>
          <input
            className="add-input"
            type="text"
            placeholder="e.g. Bench Press"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <label>Muscle Group</label>
          <select
            className="add-select"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
          >
            <option value="general">General</option>
            <option value="chest">Chest</option>
            <option value="back">Back</option>
            <option value="legs">Legs</option>
            <option value="shoulders">Shoulders</option>
            <option value="arms">Arms</option>
            <option value="core">Core</option>
          </select>
          <button className="add-btn" onClick={handleAdd}>
            + Add to Workout
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  CONTACT PAGE
// ─────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    if (!form.firstName || !form.email) return;
    setSubmitted(true);
    setForm({ firstName: "", lastName: "", email: "", comments: "" });
    setTimeout(() => setSubmitted(false), 4000);
  }

  return (
    <div className="page">
      <div className="page-title">Contact</div>
      <div className="page-subtitle">Get in touch with the LiftList team</div>

      <div className="contact-layout">
        {/* LEFT — info */}
        <div className="contact-info">
          <h2>We'd love to hear from you</h2>
          <p>Have a question about LiftList? Want to suggest a new feature or exercise? We're always looking to improve the app and make your workout experience better.</p>
          <p>Fill out the form and we'll get back to you as soon as possible.</p>
          <p>You can also reach us directly at:<br />
            <strong style={{ color: "var(--accent)" }}>support@liftlist.app</strong>
          </p>
        </div>

        {/* RIGHT — form */}
        <div className="contact-form">
          <div className="contact-form-title">Send a Message</div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">First Name</label>
              <input
                className="form-input"
                type="text"
                name="firstName"
                placeholder="Sidney"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="form-field">
              <label className="form-label">Last Name</label>
              <input
                className="form-input"
                type="text"
                name="lastName"
                placeholder="Wright"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Comments</label>
            <textarea
              className="form-textarea"
              name="comments"
              placeholder="Tell us what's on your mind..."
              value={form.comments}
              onChange={handleChange}
            />
          </div>

          <button className="form-submit" onClick={handleSubmit}>
            Send Message
          </button>

          {submitted && (
            <div className="form-success">
              ✓ Message sent! We'll get back to you soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP
// ─────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = CSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  return (
    <BrowserRouter basename="/lift-app">
      <nav className="navbar">
        <div className="navbar-logo">Lift<span>List</span></div>
        <div className="navbar-links">
          <NavLink to="/todos" className={({ isActive }) => isActive ? "active" : ""}>
            💪 Todos
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>
            ✉️ Contact
          </NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/todos" element={<TodosPage state={state} dispatch={dispatch} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<TodosPage state={state} dispatch={dispatch} />} />
      </Routes>
    </BrowserRouter>
  );
}