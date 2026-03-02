// LiftList - Workout Exercise Manager
// Author: Sidney Wright
// Description: React todo app for managing workout exercises
import { useState, useReducer, useEffect } from "react";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────
// Exercise library — 30 movements across 6 muscle groups
const EXERCISE_LIBRARY = [
  // Chest
  { id: 1, name: "Bench Press", category: "Strength", muscleGroup: "chest", emoji: "🏋️" },
  { id: 2, name: "Incline Dumbbell Press", category: "Strength", muscleGroup: "chest", emoji: "💪" },
  { id: 3, name: "Cable Fly", category: "Isolation", muscleGroup: "chest", emoji: "🔗" },
  { id: 4, name: "Push-Ups", category: "Bodyweight", muscleGroup: "chest", emoji: "⬇️" },
  { id: 5, name: "Dips", category: "Bodyweight", muscleGroup: "chest", emoji: "🔽" },
  // Back
  { id: 6, name: "Deadlift", category: "Strength", muscleGroup: "back", emoji: "⚡" },
  { id: 7, name: "Pull-Ups", category: "Bodyweight", muscleGroup: "back", emoji: "⬆️" },
  { id: 8, name: "Barbell Row", category: "Strength", muscleGroup: "back", emoji: "🏋️" },
  { id: 9, name: "Lat Pulldown", category: "Machine", muscleGroup: "back", emoji: "🔧" },
  { id: 10, name: "Seated Cable Row", category: "Machine", muscleGroup: "back", emoji: "🔗" },
  // Legs
  { id: 11, name: "Squat", category: "Strength", muscleGroup: "legs", emoji: "🦵" },
  { id: 12, name: "Romanian Deadlift", category: "Strength", muscleGroup: "legs", emoji: "⚡" },
  { id: 13, name: "Leg Press", category: "Machine", muscleGroup: "legs", emoji: "🔧" },
  { id: 14, name: "Walking Lunges", category: "Bodyweight", muscleGroup: "legs", emoji: "🚶" },
  { id: 15, name: "Leg Curl", category: "Machine", muscleGroup: "legs", emoji: "🦿" },
  { id: 16, name: "Calf Raises", category: "Isolation", muscleGroup: "legs", emoji: "🦶" },
  // Shoulders
  { id: 17, name: "Overhead Press", category: "Strength", muscleGroup: "shoulders", emoji: "🏋️" },
  { id: 18, name: "Lateral Raises", category: "Isolation", muscleGroup: "shoulders", emoji: "🦅" },
  { id: 19, name: "Face Pulls", category: "Isolation", muscleGroup: "shoulders", emoji: "🎯" },
  { id: 20, name: "Arnold Press", category: "Strength", muscleGroup: "shoulders", emoji: "💪" },
  // Arms
  { id: 21, name: "Barbell Curl", category: "Isolation", muscleGroup: "arms", emoji: "💪" },
  { id: 22, name: "Tricep Pushdown", category: "Isolation", muscleGroup: "arms", emoji: "⬇️" },
  { id: 23, name: "Hammer Curl", category: "Isolation", muscleGroup: "arms", emoji: "🔨" },
  { id: 24, name: "Skull Crushers", category: "Isolation", muscleGroup: "arms", emoji: "💀" },
  { id: 25, name: "Preacher Curl", category: "Machine", muscleGroup: "arms", emoji: "🙏" },
  // Core
  { id: 26, name: "Plank", category: "Bodyweight", muscleGroup: "core", emoji: "🧱" },
  { id: 27, name: "Cable Crunch", category: "Machine", muscleGroup: "core", emoji: "🔗" },
  { id: 28, name: "Hanging Leg Raise", category: "Bodyweight", muscleGroup: "core", emoji: "🦵" },
  { id: 29, name: "Ab Wheel Rollout", category: "Bodyweight", muscleGroup: "core", emoji: "⚙️" },
  { id: 30, name: "Russian Twists", category: "Bodyweight", muscleGroup: "core", emoji: "🌀" },
];

const MUSCLE_GROUPS = ["all", "chest", "back", "legs", "shoulders", "arms", "core"];

const MUSCLE_COLORS = {
  chest: "#FF6B6B",
  back: "#4ECDC4",
  legs: "#45B7D1",
  shoulders: "#FFA07A",
  arms: "#98D8C8",
  core: "#F7DC6F",
  all: "#A8A8B3",
};

// ─────────────────────────────────────────────
//  REDUX-STYLE REDUCER
// ─────────────────────────────────────────────
const initialState = {
  workoutList: [],
  filter: "all",
  activeView: "library",
  editingId: null,
  nextWorkoutItemId: 1,
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_EXERCISE": {
      const already = state.workoutList.find(
        (w) => w.exerciseId === action.exercise.id
      );
      if (already) return state;
      return {
        ...state,
        workoutList: [
          ...state.workoutList,
          {
            id: state.nextWorkoutItemId,
            exerciseId: action.exercise.id,
            name: action.exercise.name,
            muscleGroup: action.exercise.muscleGroup,
            emoji: action.exercise.emoji,
            sets: 3,
            reps: 10,
            completed: false,
          },
        ],
        nextWorkoutItemId: state.nextWorkoutItemId + 1,
      };
    }
    case "REMOVE_EXERCISE":
      return {
        ...state,
        workoutList: state.workoutList.filter((w) => w.id !== action.id),
        editingId: state.editingId === action.id ? null : state.editingId,
      };
    case "TOGGLE_COMPLETE":
      return {
        ...state,
        workoutList: state.workoutList.map((w) =>
          w.id === action.id ? { ...w, completed: !w.completed } : w
        ),
      };
    case "UPDATE_EXERCISE":
      return {
        ...state,
        workoutList: state.workoutList.map((w) =>
          w.id === action.id
            ? { ...w, sets: action.sets, reps: action.reps }
            : w
        ),
        editingId: null,
      };
    case "SET_FILTER":
      return { ...state, filter: action.filter };
    case "SET_VIEW":
      return { ...state, activeView: action.view };
    case "SET_EDITING":
      return { ...state, editingId: action.id };
    case "CLEAR_WORKOUT":
      return { ...state, workoutList: [] };
    default:
      return state;
  }
}

// ─────────────────────────────────────────────
//  STYLES (injected into <head>)
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
    --accent-dim: rgba(232, 255, 71, 0.12);
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
    overflow-x: hidden;
  }

  /* NAV */
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(13,13,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: 2px;
    color: var(--accent);
    text-transform: uppercase;
  }
  .nav-logo span { color: var(--text); }
  .nav-tabs {
    display: flex;
    gap: 4px;
    background: var(--surface2);
    border-radius: 10px;
    padding: 4px;
  }
  .nav-tab {
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .nav-tab:hover { color: var(--text); }
  .nav-tab.active {
    background: var(--accent);
    color: #0D0D0F;
    font-weight: 600;
  }
  .nav-badge {
    background: var(--danger);
    color: white;
    font-size: 11px;
    font-weight: 700;
    border-radius: 999px;
    padding: 1px 6px;
    min-width: 20px;
    text-align: center;
    line-height: 16px;
  }
  .nav-tab.active .nav-badge {
    background: rgba(0,0,0,0.25);
    color: #0D0D0F;
  }

  /* LAYOUT */
  .app-container { max-width: 1100px; margin: 0 auto; padding: 32px 24px; }

  /* FILTER BAR */
  .filter-bar {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 28px;
  }
  .filter-chip {
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
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .filter-chip:hover { border-color: var(--text-muted); color: var(--text); }
  .filter-chip.active {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--accent-dim);
  }
  .filter-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
  }

  /* SECTION HEADER */
  .section-header {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 20px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: 36px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    line-height: 1;
  }
  .section-count {
    font-size: 13px;
    color: var(--text-muted);
    font-weight: 400;
  }

  /* EXERCISE GRID */
  .exercise-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }

  /* EXERCISE CARD */
  .exercise-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 18px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .exercise-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--card-accent, var(--accent));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s;
  }
  .exercise-card:hover {
    border-color: var(--card-accent, var(--accent));
    background: var(--surface2);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .exercise-card:hover::before { transform: scaleX(1); }
  .exercise-card.added {
    border-color: var(--success);
    background: rgba(78,207,142,0.05);
  }
  .exercise-card.added::before {
    background: var(--success);
    transform: scaleX(1);
  }
  .card-emoji { font-size: 28px; margin-bottom: 10px; display: block; }
  .card-name {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .card-meta {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  }
  .card-tag {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 999px;
    border: 1px solid;
    text-transform: capitalize;
  }
  .card-add-btn {
    position: absolute;
    top: 14px; right: 14px;
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--surface2);
    color: var(--text-muted);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.18s;
    line-height: 1;
  }
  .exercise-card:hover .card-add-btn {
    border-color: var(--accent);
    background: var(--accent);
    color: #0D0D0F;
  }
  .exercise-card.added .card-add-btn {
    border-color: var(--success);
    background: var(--success);
    color: #0D0D0F;
  }

  /* WORKOUT LIST */
  .workout-list { display: flex; flex-direction: column; gap: 10px; }

  .workout-item {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.2s;
    animation: slideIn 0.25s ease-out;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .workout-item.completed {
    opacity: 0.45;
    border-color: transparent;
    background: var(--surface2);
  }
  .workout-item-check {
    width: 22px; height: 22px;
    border-radius: 6px;
    border: 2px solid var(--border);
    background: transparent;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 13px;
  }
  .workout-item-check:hover { border-color: var(--success); }
  .workout-item.completed .workout-item-check {
    background: var(--success);
    border-color: var(--success);
  }
  .workout-item-emoji { font-size: 22px; flex-shrink: 0; }
  .workout-item-info { flex: 1; min-width: 0; }
  .workout-item-name {
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .workout-item.completed .workout-item-name {
    text-decoration: line-through;
    color: var(--text-muted);
  }
  .workout-item-sub {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
    text-transform: capitalize;
  }
  .workout-item-stats {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
  }
  .stat-box {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 4px 10px;
    text-align: center;
    min-width: 50px;
    cursor: pointer;
    transition: border-color 0.18s;
  }
  .stat-box:hover { border-color: var(--accent); }
  .stat-box-val {
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: 1px;
    color: var(--accent);
    line-height: 1;
  }
  .stat-box-label {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .item-delete-btn {
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
    transition: all 0.18s;
    flex-shrink: 0;
  }
  .item-delete-btn:hover {
    border-color: var(--danger);
    background: rgba(255,68,68,0.1);
    color: var(--danger);
  }

  /* EDIT MODAL */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    animation: fadeIn 0.15s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .modal {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 32px;
    width: 340px;
    max-width: 90vw;
    animation: modalUp 0.2s ease-out;
  }
  @keyframes modalUp {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-title {
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 24px;
    color: var(--accent);
  }
  .modal-field { margin-bottom: 18px; }
  .modal-label {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-muted);
    display: block;
    margin-bottom: 8px;
  }
  .modal-input {
    width: 100%;
    padding: 12px 14px;
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: 1px;
    text-align: center;
    outline: none;
    transition: border-color 0.18s;
  }
  .modal-input:focus { border-color: var(--accent); }
  .modal-input::-webkit-outer-spin-button,
  .modal-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .modal-actions { display: flex; gap: 10px; margin-top: 8px; }
  .btn {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    border: none;
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
  }
  .btn-primary { background: var(--accent); color: #0D0D0F; }
  .btn-primary:hover { background: #f5ff7a; }
  .btn-ghost {
    background: var(--surface2);
    border: 1.5px solid var(--border);
    color: var(--text-muted);
  }
  .btn-ghost:hover { border-color: var(--text-muted); color: var(--text); }

  /* EMPTY STATE */
  .empty-state {
    text-align: center;
    padding: 80px 24px;
    color: var(--text-muted);
  }
  .empty-icon { font-size: 56px; margin-bottom: 16px; opacity: 0.6; }
  .empty-title {
    font-family: var(--font-display);
    font-size: 28px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--text);
    margin-bottom: 8px;
  }
  .empty-sub { font-size: 14px; line-height: 1.6; }

  /* WORKOUT HEADER STATS */
  .workout-stats-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  .stat-card {
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 14px 20px;
    flex: 1;
    min-width: 120px;
  }
  .stat-card-val {
    font-family: var(--font-display);
    font-size: 36px;
    letter-spacing: 2px;
    color: var(--accent);
    line-height: 1;
  }
  .stat-card-label {
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

  /* CLEAR BTN */
  .clear-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1.5px solid var(--danger);
    background: transparent;
    color: var(--danger);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    margin-left: auto;
  }
  .clear-btn:hover { background: rgba(255,68,68,0.1); }

  /* SEARCH */
  .search-wrap { position: relative; margin-bottom: 20px; }
  .search-input {
    width: 100%;
    padding: 12px 16px 12px 44px;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    outline: none;
    transition: border-color 0.18s;
  }
  .search-input:focus { border-color: var(--accent); }
  .search-input::placeholder { color: var(--text-muted); }
  .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 16px;
    pointer-events: none;
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--border); }

  @media (max-width: 600px) {
    .nav-logo { font-size: 22px; }
    .section-title { font-size: 28px; }
    .exercise-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .workout-item { flex-wrap: wrap; }
    .workout-item-stats { width: 100%; justify-content: flex-end; }
  }
`;

// ─────────────────────────────────────────────
//  COMPONENTS
// ─────────────────────────────────────────────

function FilterBar({ filter, dispatch }) {
  return (
    <div className="filter-bar">
      {MUSCLE_GROUPS.map((g) => (
        <button
          key={g}
          className={`filter-chip ${filter === g ? "active" : ""}`}
          onClick={() => dispatch({ type: "SET_FILTER", filter: g })}
        >
          {g !== "all" && (
            <span
              className="filter-dot"
              style={{ background: MUSCLE_COLORS[g] }}
            />
          )}
          {g === "all" ? "All Muscles" : g}
        </button>
      ))}
    </div>
  );
}

function ExerciseCard({ exercise, isAdded, dispatch }) {
  return (
    <div
      className={`exercise-card ${isAdded ? "added" : ""}`}
      style={{ "--card-accent": MUSCLE_COLORS[exercise.muscleGroup] }}
      onClick={() =>
        !isAdded && dispatch({ type: "ADD_EXERCISE", exercise })
      }
      title={isAdded ? "Already in your workout!" : "Click to add"}
    >
      <button className="card-add-btn" tabIndex={-1}>
        {isAdded ? "✓" : "+"}
      </button>
      <span className="card-emoji">{exercise.emoji}</span>
      <div className="card-name">{exercise.name}</div>
      <div className="card-meta">
        <span
          className="card-tag"
          style={{
            color: MUSCLE_COLORS[exercise.muscleGroup],
            borderColor: MUSCLE_COLORS[exercise.muscleGroup] + "55",
            background: MUSCLE_COLORS[exercise.muscleGroup] + "15",
          }}
        >
          {exercise.muscleGroup}
        </span>
        <span
          className="card-tag"
          style={{
            color: "var(--text-muted)",
            borderColor: "var(--border)",
          }}
        >
          {exercise.category}
        </span>
      </div>
    </div>
  );
}

function WorkoutItem({ item, dispatch, isEditing, onEdit }) {
  const [localSets, setLocalSets] = useState(item.sets);
  const [localReps, setLocalReps] = useState(item.reps);

  useEffect(() => {
    setLocalSets(item.sets);
    setLocalReps(item.reps);
  }, [item.sets, item.reps]);

  function handleSave() {
    dispatch({
      type: "UPDATE_EXERCISE",
      id: item.id,
      sets: Number(localSets) || 1,
      reps: Number(localReps) || 1,
    });
  }

  return (
    <>
      <div className={`workout-item ${item.completed ? "completed" : ""}`}>
        <button
          className="workout-item-check"
          onClick={() => dispatch({ type: "TOGGLE_COMPLETE", id: item.id })}
          title="Mark complete"
        >
          {item.completed && "✓"}
        </button>
        <span className="workout-item-emoji">{item.emoji}</span>
        <div className="workout-item-info">
          <div className="workout-item-name">{item.name}</div>
          <div className="workout-item-sub">{item.muscleGroup}</div>
        </div>
        <div className="workout-item-stats">
          <div
            className="stat-box"
            onClick={() => onEdit(item.id)}
            title="Click to edit"
          >
            <div className="stat-box-val">{item.sets}</div>
            <div className="stat-box-label">sets</div>
          </div>
          <div
            className="stat-box"
            onClick={() => onEdit(item.id)}
            title="Click to edit"
          >
            <div className="stat-box-val">{item.reps}</div>
            <div className="stat-box-label">reps</div>
          </div>
        </div>
        <button
          className="item-delete-btn"
          onClick={() => dispatch({ type: "REMOVE_EXERCISE", id: item.id })}
          title="Remove exercise"
        >
          ✕
        </button>
      </div>

      {isEditing && (
        <div className="modal-overlay" onClick={() => dispatch({ type: "SET_EDITING", id: null })}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Edit {item.name}</div>
            <div className="modal-field">
              <label className="modal-label">Sets</label>
              <input
                type="number"
                className="modal-input"
                value={localSets}
                min={1}
                max={20}
                onChange={(e) => setLocalSets(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-field">
              <label className="modal-label">Reps</label>
              <input
                type="number"
                className="modal-input"
                value={localReps}
                min={1}
                max={100}
                onChange={(e) => setLocalReps(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={() => dispatch({ type: "SET_EDITING", id: null })}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LibraryView({ state, dispatch }) {
  const [search, setSearch] = useState("");
  const addedIds = new Set(state.workoutList.map((w) => w.exerciseId));

  const visible = EXERCISE_LIBRARY.filter((ex) => {
    const matchGroup =
      state.filter === "all" || ex.muscleGroup === state.filter;
    const matchSearch = ex.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  return (
    <div>
      <div className="section-header">
        <div className="section-title">Exercise Library</div>
        <span className="section-count">{visible.length} movements</span>
      </div>

      <div className="search-wrap">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <FilterBar filter={state.filter} dispatch={dispatch} />

      {visible.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <div className="empty-title">No results</div>
          <div className="empty-sub">Try a different filter or search term.</div>
        </div>
      ) : (
        <div className="exercise-grid">
          {visible.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              isAdded={addedIds.has(ex.id)}
              dispatch={dispatch}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkoutView({ state, dispatch }) {
  const total = state.workoutList.length;
  const done = state.workoutList.filter((w) => w.completed).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div>
      <div className="section-header">
        <div className="section-title">My Workout</div>
        {total > 0 && (
          <button
            className="clear-btn"
            onClick={() => dispatch({ type: "CLEAR_WORKOUT" })}
          >
            Clear All
          </button>
        )}
      </div>

      {total > 0 && (
        <>
          <div className="workout-stats-bar">
            <div className="stat-card">
              <div className="stat-card-val">{total}</div>
              <div className="stat-card-label">Exercises</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-val">{done}</div>
              <div className="stat-card-label">Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-val">{progress}%</div>
              <div className="stat-card-label">Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-val">
                {state.workoutList.reduce((a, w) => a + w.sets, 0)}
              </div>
              <div className="stat-card-label">Total Sets</div>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      )}

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏋️</div>
          <div className="empty-title">Workout is empty</div>
          <div className="empty-sub">
            Head to the Library tab and add some exercises to get started.
          </div>
        </div>
      ) : (
        <div className="workout-list">
          {state.workoutList.map((item) => (
            <WorkoutItem
              key={item.id}
              item={item}
              dispatch={dispatch}
              isEditing={state.editingId === item.id}
              onEdit={(id) => dispatch({ type: "SET_EDITING", id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  APP (CONTAINER)
// ─────────────────────────────────────────────
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Inject CSS once
  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = CSS;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  const workoutCount = state.workoutList.length;

  return (
    <div>
      <nav className="nav">
        <div className="nav-logo">
          Lift<span>List</span>
        </div>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${state.activeView === "library" ? "active" : ""}`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "library" })}
          >
            📚 Library
          </button>
          <button
            className={`nav-tab ${state.activeView === "workout" ? "active" : ""}`}
            onClick={() => dispatch({ type: "SET_VIEW", view: "workout" })}
          >
            ⚡ Workout
            {workoutCount > 0 && (
              <span className="nav-badge">{workoutCount}</span>
            )}
          </button>
        </div>
      </nav>

      <div className="app-container">
        {state.activeView === "library" ? (
          <LibraryView state={state} dispatch={dispatch} />
        ) : (
          <WorkoutView state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}