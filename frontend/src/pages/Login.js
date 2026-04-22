import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/api/auth/login`, form);

      localStorage.setItem("token", res.data.token);

      // ✅ CLEAR FORM
      setForm({
        email: "",
        password: ""
      });

      navigate("/dashboard");

    } catch (err) {
      alert("Login failed");

      // ✅ CLEAR FORM ON ERROR
      setForm({
        email: "",
        password: ""
      });
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={form.email}
          placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          value={form.password}
          type="password"
          placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />        <button>Login</button>
        <p onClick={() => navigate("/")}>
          New user? Register
        </p>
      </form>
    </div>
  );
}

export default Login;