import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { loginUser } from "../../actions/auth";
import "./LoginPage.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await dispatch(loginUser(form));
      history.push("/country");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <label>Username</label>
        <input
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          required
        />
        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
