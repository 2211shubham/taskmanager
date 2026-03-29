import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    fetch(`${API}/api/tasks`)
      .then((r) => r.json())
      .then(setTasks);
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setInput("");
  };

  const toggleTask = async (id, completed) => {
    const res = await fetch(`${API}/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/api/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Task Manager</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
        />
        <button style={styles.addBtn} onClick={addTask}>
          Add Task
        </button>
      </div>

      <ul style={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} style={styles.item}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id, task.completed)}
              style={styles.checkbox}
            />
            <span
              style={{
                ...styles.taskTitle,
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.5 : 1,
              }}
            >
              {task.title}
            </span>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteTask(task.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <p style={styles.count}>
        {tasks.filter((t) => !t.completed).length} of {tasks.length} remaining
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "0 20px",
    fontFamily: "system-ui, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "24px",
    fontSize: "2rem",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#1e1e1e",
    color: "#fff",
    outline: "none",
  },
  addBtn: {
    padding: "10px 20px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "none",
    background: "#4f8ef7",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "500",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "#1e1e1e",
    borderRadius: "10px",
    border: "1px solid #333",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#4f8ef7",
  },
  taskTitle: {
    flex: 1,
    fontSize: "15px",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#888",
    fontSize: "16px",
    cursor: "pointer",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  count: {
    textAlign: "center",
    marginTop: "20px",
    color: "#666",
    fontSize: "13px",
  },
};