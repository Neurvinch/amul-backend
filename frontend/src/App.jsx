import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = Object.assign(
    { "Content-Type": "application/json" },
    options.headers || {}
  );
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${API_BASE}${path}`, Object.assign({}, options, { headers }));
}

function App() {
  const [view, setView] = useState("todos");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [auth, setAuth] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (view === "todos") fetchTodos();
  }, [view]);

  async function fetchTodos() {
    setLoading(true);
    try {
      const res = await apiFetch("/todos");
      if (res.ok) {
        const data = await res.json();
        setTodos(data);
      } else if (res.status === 401) {
        setMessage("Not authenticated — please login.");
        setTodos([]);
      } else {
        const text = await res.text();
        setMessage(`Fetch failed: ${res.status} ${text}`);
      }
    } catch (err) {
      setMessage("Network error fetching todos");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await apiFetch("/todos", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const t = await res.json();
        setTodos((s) => [t, ...s]);
        setForm({ title: "", description: "" });
      } else {
        const err = await res.json();
        setMessage(err.message || "Create failed");
      }
    } catch (err) {
      setMessage("Network error creating todo");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this todo?")) return;
    try {
      const res = await apiFetch(`/todos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTodos((s) => s.filter((t) => t._id !== id));
      } else {
        setMessage("Delete failed");
      }
    } catch (err) {
      setMessage("Network error deleting todo");
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auth),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Registered. Please login.");
        setView("login");
      } else {
        setMessage(data.message || "Register failed");
      }
    } catch (err) {
      setMessage("Network error registering");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auth),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("Logged in");
        setView("todos");
        fetchTodos();
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (err) {
      setMessage("Network error logging in");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setMessage("Logged out");
    setTodos([]);
  }

  return (
    <div className="app">
      <header>
        <h1>Todos</h1>
        <nav>
          <button onClick={() => setView("todos")}>
            Todos
          </button>
          <button onClick={() => setView("login")}>Login</button>
          <button onClick={() => setView("register")}>Register</button>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      {message && <div className="message">{message}</div>}

      {view === "register" && (
        <form onSubmit={handleRegister} className="auth">
          <h2>Register</h2>
          <input
            placeholder="email"
            value={auth.email}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          />
          <input
            placeholder="password"
            type="password"
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />
          <button type="submit">Register</button>
        </form>
      )}

      {view === "login" && (
        <form onSubmit={handleLogin} className="auth">
          <h2>Login</h2>
          <input
            placeholder="email"
            value={auth.email}
            onChange={(e) => setAuth({ ...auth, email: e.target.value })}
          />
          <input
            placeholder="password"
            type="password"
            value={auth.password}
            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
          />
          <button type="submit">Login</button>
        </form>
      )}

      {view === "todos" && (
        <section className="todos">
          <h2>Your todos</h2>
          <form onSubmit={handleCreate} className="create">
            <input
              placeholder="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              placeholder="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <button type="submit">Add</button>
          </form>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="list">
              {todos.map((t) => (
                <li key={t._id}>
                  <strong>{t.title}</strong>
                  <p>{t.description}</p>
                  <small>{new Date(t.createdAt).toLocaleString()}</small>
                  <div>
                    <button onClick={() => handleDelete(t._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

export default App;
