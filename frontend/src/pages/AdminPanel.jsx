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
  const [editingTrainer, setEditingTrainer] = useState(null);
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

  const handleDeleteTrainer = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/trainers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete trainer");

      setTrainers((prev) => prev.filter((trainer) => trainer.id !== id));
      setMessage("Trainer deleted successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTrainer = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/trainers/${editingTrainer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingTrainer),
      });

      if (!res.ok) throw new Error("Failed to update trainer");

      const data = await res.json();

      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer.id === editingTrainer.id ? data.trainer : trainer
        )
      );

      setEditingTrainer(null);
      setMessage("Trainer updated successfully");
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

        {/* FORMULARIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CREATE TRAINER */}
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
                className="w-full p-3 rounded bg-[#2f2f2f] text-white"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={newTrainer.last_name}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, last_name: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={newTrainer.email}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, email: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={newTrainer.phone}
                onChange={(e) =>
                  setNewTrainer({ ...newTrainer, phone: e.target.value })
                }
                className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              />
              <button
                type="submit"
                className="w-full bg-[#56d722] hover:bg-green-600 py-3 rounded-md text-black font-semibold"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Create Trainer
              </button>
            </form>
          </section>

          {/* ASSIGN TRAINER */}
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
                className="w-full p-3 rounded bg-[#2f2f2f] text-white"
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
                className="w-full p-3 rounded bg-[#2f2f2f] text-white"
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
                className="w-full bg-[#56d722] hover:bg-green-600 py-3 rounded-md text-black font-semibold"
              >
                <Check className="w-5 h-5 inline mr-2" />
                Assign Trainer
              </button>
            </form>
          </section>
        </div>

        {/* EDIT TRAINER FORM */}
        {editingTrainer && (
          <form
            onSubmit={handleUpdateTrainer}
            className="bg-[#222222] p-6 rounded-2xl shadow-md space-y-4"
          >
            <h2 className="text-2xl font-semibold text-[#56d722]">Edit Trainer</h2>
            <input
              type="text"
              value={editingTrainer.first_name}
              onChange={(e) =>
                setEditingTrainer({ ...editingTrainer, first_name: e.target.value })
              }
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
            />
            <input
              type="text"
              value={editingTrainer.last_name}
              onChange={(e) =>
                setEditingTrainer({ ...editingTrainer, last_name: e.target.value })
              }
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
            />
            <input
              type="email"
              value={editingTrainer.email}
              onChange={(e) =>
                setEditingTrainer({ ...editingTrainer, email: e.target.value })
              }
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
            />
            <input
              type="text"
              value={editingTrainer.phone}
              onChange={(e) =>
                setEditingTrainer({ ...editingTrainer, phone: e.target.value })
              }
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-[#56d722] text-black font-semibold py-2 px-4 rounded"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingTrainer(null)}
                className="text-white border border-gray-500 py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* TRAINER LIST */}
        <section className="bg-[#222222] p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-[#56d722]">All Trainers</h2>
          <ul className="space-y-4">
            {trainers.map((trainer) => (
              <li
                key={trainer.id}
                className="p-4 bg-[#2f2f2f] rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-bold">
                    {trainer.first_name} {trainer.last_name}
                  </p>
                  <p className="text-sm text-gray-400">{trainer.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTrainer(trainer)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTrainer(trainer.id)}
                    className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
