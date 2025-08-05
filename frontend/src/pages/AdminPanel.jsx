import { useState, useEffect, useContext } from "react";
import { User, Dumbbell, Plus, Check } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function AdminPanel() {
  const { token } = useContext(AuthContext);
  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTrainer, setNewTrainer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const trainerRes = await fetch("http://localhost:5000/trainers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trainersData = await trainerRes.json();
        setTrainers(trainersData);

        const userRes = await fetch("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = await userRes.json();
        setUsers(usersData);
      } catch {
        setError("Failed to load data");
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleCreateTrainer = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/trainers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTrainer),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create trainer");
      }
      const createdTrainer = await res.json();
      setTrainers((prev) => [...prev, createdTrainer]);
      setNewTrainer({ first_name: "", last_name: "", email: "", phone: "" });
      setMessage("Trainer created successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignTrainer = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const res = await fetch("http://localhost:5000/users/assign-trainer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: selectedUser,
          trainerId: selectedTrainer,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to assign trainer");
      }
      setMessage("Trainer assigned successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <h1 className="text-4xl font-bold text-[#56d722] flex items-center gap-3">
          <User className="w-8 h-8" />
          Admin Panel
        </h1>

        {error && (
          <div className="bg-red-700 text-white p-4 rounded-md font-semibold">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-700 text-white p-4 rounded-md font-semibold">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-[#222222] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2 text-[#56d722] flex items-center gap-2">
              <Dumbbell className="w-6 h-6" />
              Create Trainer
              <Plus className="w-5 h-5 ml-auto text-[#56d722]" />
            </h2>
            <form onSubmit={handleCreateTrainer} className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={newTrainer.first_name}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, first_name: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newTrainer.last_name}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, last_name: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newTrainer.email}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, email: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newTrainer.phone}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, phone: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
              />
              <button
                type="submit"
                className="w-full bg-[#56d722] hover:bg-green-600 py-3 rounded-md text-black font-semibold transition flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Trainer
              </button>
            </form>
          </section>

          <section className="bg-[#222222] p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-6 border-b border-gray-700 pb-2 text-[#56d722] flex items-center gap-2">
              <User className="w-6 h-6" />
              Assign Trainer
              <Check className="w-5 h-5 ml-auto text-[#56d722]" />
            </h2>
            <form onSubmit={handleAssignTrainer} className="space-y-4">
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-3 rounded bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>

              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                className="w-full p-3 rounded bg-[#2f2f2f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#56d722]"
                required
              >
                <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.first_name} {trainer.last_name}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full bg-[#56d722] hover:bg-green-600 py-3 rounded-md text-black font-semibold transition flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Assign Trainer
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
