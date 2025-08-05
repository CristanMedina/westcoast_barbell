import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AdminPanel() {
  const { token } = useContext(AuthContext);

  const [trainers, setTrainers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTrainer, setNewTrainer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: ""
  });
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const trainerRes = await fetch("http://localhost:5000/trainers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const trainersData = await trainerRes.json();
        setTrainers(trainersData);

        const userRes = await fetch("http://localhost:5000/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usersData = await userRes.json();
        setUsers(usersData);
      } catch (err) {
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newTrainer)
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
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser,
          trainerId: selectedTrainer
        })
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
    <div className="min-h-screen bg-[#252430] text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-[#56d722]">
        Admin Panel
      </h1>

      {error && <div className="bg-red-600 p-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-600 p-3 rounded mb-4">{message}</div>}

      {/* Create Trainer */}
      <div className="bg-[#42007b] p-6 rounded-2xl shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#56d722]">Create Trainer</h2>
        <form
          onSubmit={handleCreateTrainer}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            value={newTrainer.first_name}
            onChange={(e) =>
              setNewTrainer({ ...newTrainer, first_name: e.target.value })
            }
            className="p-3 rounded-lg bg-[#5d03a5] border border-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newTrainer.last_name}
            onChange={(e) =>
              setNewTrainer({ ...newTrainer, last_name: e.target.value })
            }
            className="p-3 rounded-lg bg-[#5d03a5] border border-gray-700"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newTrainer.email}
            onChange={(e) =>
              setNewTrainer({ ...newTrainer, email: e.target.value })
            }
            className="p-3 rounded-lg bg-[#5d03a5] border border-gray-700"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newTrainer.phone}
            onChange={(e) =>
              setNewTrainer({ ...newTrainer, phone: e.target.value })
            }
            className="p-3 rounded-lg bg-[#5d03a5] border border-gray-700"
          />
          <button
            type="submit"
            className="sm:col-span-2 bg-[#56d722] hover:bg-green-600 py-3 rounded-lg text-black font-semibold"
          >
            Create Trainer
          </button>
        </form>
      </div>

      {/* Assign Trainer */}
      <div className="bg-[#42007b] p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-[#56d722]">
          Assign Trainer to User
        </h2>
        <form
          onSubmit={handleAssignTrainer}
          className="flex flex-col sm:flex-row gap-4"
        >
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-3 rounded-lg bg-[#5d03a5] border border-gray-700 flex-1"
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
            className="p-3 rounded-lg bg-[#5d03a5] border border-gray-700 flex-1"
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
            className="bg-[#56d722] hover:bg-green-600 py-3 px-6 rounded-lg text-black font-semibold"
          >
            Assign Trainer
          </button>
        </form>
      </div>
    </div>
  );
}
