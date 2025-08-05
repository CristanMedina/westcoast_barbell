import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#252430] flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-[#42007b] p-8 rounded-2xl shadow-xl space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-[#56d722]">
          Welcome Back
        </h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-[#5d03a5] border border-gray-700 placeholder-gray-300"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-lg bg-[#5d03a5] border border-gray-700 placeholder-gray-300"
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[#56d722] hover:bg-green-600 text-black font-semibold transition"
        >
          Log In
        </button>

        <p className="text-center text-gray-300">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#56d722] cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
