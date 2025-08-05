import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Trainers() {
  const { token, user } = useContext(AuthContext);
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [assignedTrainer, setAssignedTrainer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const res = await fetch("http://localhost:5000/trainers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch trainers");
        const data = await res.json();
        setTrainers(data);
      } catch (err) {
        setMessage(err.message);
      }
    }
    fetchTrainers();
  }, [token]);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5000/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setAssignedTrainer(data.assigned_trainer || null);
      } catch (err) {
        setMessage(err.message);
      }
    }
    fetchProfile();
  }, [token]);

  const handleAssignTrainer = async () => {
    if (!selectedTrainer) return setMessage("Please select a trainer");
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/users/assign-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          trainerId: selectedTrainer,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to assign trainer");
      }

      const data = await res.json();
      setAssignedTrainer(data.user.assigned_trainer);
      setMessage(
        `Trainer assigned: ${data.user.assigned_trainer.first_name} ${data.user.assigned_trainer.last_name}`
      );
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <h1 className="text-3xl font-bold text-[#56d722] mb-6">Choose Your Trainer</h1>

      <div className="bg-[#1e1e1e] p-4 rounded-md mb-6">
        {assignedTrainer ? (
          <p className="text-lg">
            <span className="font-semibold text-[#56d722]">Current Trainer:</span>{" "}
            {assignedTrainer.first_name} {assignedTrainer.last_name}
          </p>
        ) : (
          <p className="text-gray-400">No trainer assigned</p>
        )}
      </div>

      <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md">
        {trainers.length === 0 ? (
          <p>No trainers available</p>
        ) : (
          <select
            value={selectedTrainer || ""}
            onChange={(e) => setSelectedTrainer(e.target.value)}
            className="w-full p-3 rounded-md bg-[#2b2b2b] text-white mb-4 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
          >
            <option value="">-- Select a Trainer --</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.first_name} {trainer.last_name} - {trainer.email}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleAssignTrainer}
          disabled={loading}
          className="bg-[#56d722] hover:bg-green-600 transition px-6 py-2 rounded-md font-semibold text-black"
        >
          {loading ? "Assigning..." : "Assign Trainer"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-center ${
            message.includes("Trainer assigned")
              ? "bg-green-700 text-green-100"
              : "bg-red-700 text-red-100"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
