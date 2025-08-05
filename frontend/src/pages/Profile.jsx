import { useContext, useEffect, useState } from "react";
import { User, Calendar, Mail, UserCheck, Dumbbell } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

function Avatar({ name }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";
  return (
    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-md select-none mx-auto">
      {initials}
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-[#56d722]" />
      <p>
        <span className="font-semibold text-gray-300">{label}:</span>{" "}
        <span className="text-gray-200">{children}</span>
      </p>
    </div>
  );
}

export default function Profile() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setForm(data);
      } catch (err) {
        setError(err.message);
      }
    }
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`http://localhost:5000/users/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update profile");
      }
      const updated = await res.json();
      setProfile(updated);
      setForm(updated);
      setIsEditing(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-gray-400 font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans">
      <main className="max-w-3xl mx-auto p-8">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-[#56d722]">Profile</h1>
        </header>

        <section className="bg-[#1e1e1e] rounded-2xl shadow-md p-8">
          <Avatar name={`${profile.first_name} ${profile.last_name}`} />
          <h2 className="text-3xl font-semibold text-center mt-4 mb-8">
            {profile.first_name} {profile.last_name}
          </h2>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold mb-5 border-b border-gray-700 pb-2 text-[#56d722]">
                Personal Info
              </h3>
              {isEditing ? (
                <>
                  <input
                    name="first_name"
                    value={form.first_name || ""}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="mb-4 w-full rounded-md p-3 bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                  />
                  <input
                    name="last_name"
                    value={form.last_name || ""}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="mb-4 w-full rounded-md p-3 bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                  />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth || ""}
                    onChange={handleChange}
                    className="mb-4 w-full rounded-md p-3 bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                  />
                  <select
                    name="gender"
                    value={form.gender || "M"}
                    onChange={handleChange}
                    className="mb-4 w-full rounded-md p-3 bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </>
              ) : (
                <div className="space-y-4 text-gray-300">
                  <InfoRow icon={User} label="Name">
                    {profile.first_name} {profile.last_name}
                  </InfoRow>
                  <p>
                    <span className="font-semibold text-gray-300">Gender:</span>{" "}
                    <span className="text-gray-200">
                      {profile.gender === "M" ? "Male" : "Female"}
                    </span>
                  </p>
                  <InfoRow icon={Calendar} label="Date of Birth">
                    {new Date(profile.date_of_birth).toLocaleDateString()}
                  </InfoRow>
                </div>
              )}
              <div className="mt-6 text-gray-300">
                <InfoRow icon={Mail} label="Email">
                  {profile.email}
                </InfoRow>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-5 border-b border-gray-700 pb-2 text-[#56d722]">
                Training Info
              </h3>
              {isEditing ? (
                <select
                  name="training_type"
                  value={form.training_type || "strength"}
                  onChange={handleChange}
                  className="mb-4 w-full rounded-md p-3 bg-[#2b2b2b] text-white focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                >
                  <option value="strength">Strength</option>
                  <option value="hypertrophy">Hypertrophy</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="functional">Functional</option>
                  <option value="athlete">Athlete</option>
                  <option value="rehabilitation">Rehabilitation</option>
                </select>
              ) : (
                <div className="space-y-4 text-gray-300">
                  <InfoRow icon={Dumbbell} label="Type">
                    {profile.training_type}
                  </InfoRow>
                  <InfoRow icon={Calendar} label="Joined">
                    {new Date(profile.join_date).toLocaleDateString()}
                  </InfoRow>
                  <InfoRow icon={UserCheck} label="Trainer">
                    {profile.assigned_trainer
                      ? `${profile.assigned_trainer.first_name} ${profile.assigned_trainer.last_name}`
                      : "Not assigned"}
                  </InfoRow>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-10">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm(profile);
                    setError(null);
                    setSuccess(null);
                  }}
                  disabled={loading}
                  className="bg-gray-700 hover:bg-gray-800 transition rounded-md px-6 py-2 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-[#56d722] hover:bg-green-600 transition rounded-md px-6 py-2 font-semibold text-black"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setError(null);
                  setSuccess(null);
                }}
                className="bg-[#56d722] hover:bg-green-600 transition rounded-md px-6 py-2 font-semibold text-black"
              >
                Edit Profile
              </button>
            )}
          </div>

          {(success || error) && (
            <div
              className={`mt-8 rounded-md p-4 text-center font-semibold ${
                success ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"
              }`}
            >
              {success || error}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
