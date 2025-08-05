import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Redirect if user already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/profile");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      // After login, user state updates in context and triggers useEffect redirect
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#222222] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Log In
        </h1>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute top-3 left-3 w-5 h-5 text-[#56d722]" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-md bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 w-5 h-5 text-[#56d722]" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-md bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-[#56d722] hover:bg-green-600 text-black font-semibold transition"
          >
            Log In
          </button>

          <p className="text-center text-gray-400">
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
    </div>
  );
}
