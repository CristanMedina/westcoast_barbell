import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { token, logout } = useContext(AuthContext);
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

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-gray-300">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </header>

        {success && <div className="text-green-500">{success}</div>}
        {error && <div className="text-red-400">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name || ""}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-[#1a1a1a] border border-gray-700"
                />
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name || ""}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-[#1a1a1a] border border-gray-700"
                />
                <input
                  type="date"
                  name="date_of_birth"
                  value={form.date_of_birth || ""}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-[#1a1a1a] border border-gray-700"
                />
                <select
                  name="gender"
                  value={form.gender || "M"}
                  onChange={handleChange}
                  className="w-full p-2 mb-3 rounded bg-[#1a1a1a] border border-gray-700"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                <p><strong>Gender:</strong> {profile.gender}</p>
                <p><strong>Date of Birth:</strong> {profile.date_of_birth}</p>
              </>
            )}
            <p className="mt-3"><strong>Email:</strong> {profile.email}</p>
          </div>

          <div className="bg-[#2a2a2a] p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Training</h2>
            {isEditing ? (
              <select
                name="training_type"
                value={form.training_type || "strength"}
                onChange={handleChange}
                className="w-full p-2 mb-3 rounded bg-[#1a1a1a] border border-gray-700"
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
              <p><strong>Type:</strong> {profile.training_type}</p>
            )}
            <p><strong>Joined:</strong> {profile.join_date}</p>
            <p>
              <strong>Trainer:</strong>{" "}
              {profile.assigned_trainer
                ? `${profile.assigned_trainer.first_name} ${profile.assigned_trainer.last_name}`
                : "Not assigned"}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-md"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-[#56d722] hover:bg-green-600 px-4 py-2 rounded-md text-black"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#56d722] hover:bg-green-600 px-4 py-2 rounded-md text-black"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
