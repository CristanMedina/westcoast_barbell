import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
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
    <div className="min-h-screen bg-[#252430] text-white flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-[#42007b] rounded-3xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-[#56d722]">Create Account</h1>
        <p className="text-gray-300 text-sm mt-1">
          Sign up to get started with your personalized training experience.
        </p>
      </div>

      {error && (
        <div className="w-full max-w-md bg-red-600 rounded-xl p-3 text-center mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <div className="bg-[#5d03a5] rounded-3xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-[#56d722]">Personal Info</h2>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={handleChange}
              className="bg-[#42007b] p-3 rounded-xl"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={handleChange}
              className="bg-[#42007b] p-3 rounded-xl"
              required
            />
          </div>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            className="bg-[#42007b] p-3 rounded-xl w-full"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="bg-[#42007b] p-3 rounded-xl"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <select
              name="training_type"
              value={form.training_type}
              onChange={handleChange}
              className="bg-[#42007b] p-3 rounded-xl"
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
        </div>

        <div className="bg-[#5d03a5] rounded-3xl p-5 space-y-4">
          <h2 className="text-lg font-semibold text-[#56d722]">Account Info</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="bg-[#42007b] p-3 rounded-xl w-full"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="bg-[#42007b] p-3 rounded-xl w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#56d722] text-black text-lg font-semibold py-3 rounded-3xl hover:bg-green-600 transition"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-300">
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
  );
}
