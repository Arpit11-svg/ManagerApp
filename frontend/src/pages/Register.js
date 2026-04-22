import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate(); // ✅ inside component

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);

      alert("Registered successfully");

      // ✅ CLEAR FORM
      setForm({
        name: "",
        email: "",
        password: ""
      });

      navigate("/login");

    } catch (err) {
      alert("Registration failed");

      // ✅ CLEAR FORM ON ERROR ALSO
      setForm({
        name: "",
        email: "",
        password: ""
      });
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          placeholder="Name"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
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
        />        <button>Register</button>
      </form>

      <p onClick={() => navigate("/login")}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;