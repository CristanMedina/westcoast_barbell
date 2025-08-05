import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { User, Calendar, Mail, Lock } from "lucide-react";

export default function Signup() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "M",
    training_type: "strength",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/profile");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#222222] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Start your journey with Westcoast Barbell.
        </p>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded-md mb-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute top-3 left-2 w-5 h-5 text-[#56d722]" />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={form.first_name}
                onChange={handleChange}
                className="bg-[#2f2f2f] p-3 pl-8 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              />
            </div>
            <div className="relative">
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={form.last_name}
                onChange={handleChange}
                className="bg-[#2f2f2f] p-3 pl-10 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              />
            </div>
          </div>

          <div className="relative">
            <Calendar className="absolute top-3 left-3 w-5 h-5 text-[#56d722]" />
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className="bg-[#2f2f2f] p-3 pl-10 rounded-md text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-[#56d722]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="bg-[#2f2f2f] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>

            <select
              name="training_type"
              value={form.training_type}
              onChange={handleChange}
              className="bg-[#2f2f2f] p-3 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
            >
              <option value="strength">Strength</option>
              <option value="hypertrophy">Hypertrophy</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="functional">Functional</option>
              <option value="athlete">Athlete</option>
              <option value="rehabilitation">Rehabilitation</option>
            </select>
          </div>

          <div className="relative">
            <Mail className="absolute top-3 left-3 w-5 h-5 text-[#56d722]" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="bg-[#2f2f2f] p-3 pl-10 rounded-md text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-[#56d722]"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 w-5 h-5 text-[#56d722]" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="bg-[#2f2f2f] p-3 pl-10 rounded-md text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-[#56d722]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#56d722] text-black font-semibold w-full py-3 rounded-md hover:bg-green-600 transition"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#56d722] cursor-pointer hover:underline"
            >
              Log In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
