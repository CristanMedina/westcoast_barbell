import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const WEEK_DAYS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function Payment() {
  const { token, user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [payments, setPayments] = useState([]);

  const [form, setForm] = useState({
    userId: user.id || "",
    trainerId: "",
    amount: "",
    transactionType: "Efectivo",
    weekNumber: "",
    weekDay: "",
  });

  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        if (user.role === "admin") {
          const [usersRes, trainersRes] = await Promise.all([
            fetch("http://localhost:5000/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:5000/trainers", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);
          const usersData = await usersRes.json();
          const trainersData = await trainersRes.json();
          setUsers(usersData);
          setTrainers(trainersData);
        } else {
          setUsers([{ id: user.id, first_name: user.first_name, last_name: user.last_name }]);
          const trainersRes = await fetch("http://localhost:5000/trainers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const trainersData = await trainersRes.json();
          setTrainers(trainersData);
        }

        const paymentsRes = await fetch("http://localhost:5000/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const paymentsData = await paymentsRes.json();
        setPayments(paymentsData);
      } catch (err) {
        toast.error("Failed to load data");
      }
    }
    fetchData();
  }, [token, user]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.trainerId || !form.amount || !form.weekNumber || !form.weekDay) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const weekDayFull = `Semana ${form.weekNumber} / ${form.weekDay}`;

      const res = await fetch("http://localhost:5000/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: form.userId,
          trainerId: form.trainerId,
          amount: parseFloat(form.amount),
          transactionType: form.transactionType,
          weekDay: weekDayFull,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to record payment");

      toast.success("Payment recorded successfully");
      setPayments((prev) => [...prev, data.payment]);

      setForm((f) => ({ ...f, amount: "", weekNumber: "", weekDay: "" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async (paymentId) => {
    setPrinting(true);

    try {
      const res = await fetch(`http://localhost:5000/payments/${paymentId}/print`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to print ticket");

      toast.success("Ticket printed successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Record a Payment</h1>

        <form onSubmit={handleSubmit} className="space-y-5 bg-[#222222] p-6 rounded-2xl shadow-md mb-12">
          <div>
            <label className="block mb-1 font-semibold">User</label>
            <select
              name="userId"
              value={form.userId}
              onChange={handleChange}
              disabled={user.role !== "admin"}
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              required
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Trainer</label>
            <select
              name="trainerId"
              value={form.trainerId}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              required
            >
              <option value="">Select Trainer</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.first_name} {t.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              required
              min={0}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Transaction Type</label>
            <select
              name="transactionType"
              value={form.transactionType}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              required
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia bancaria">Transferencia bancaria</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Week Number</label>
            <input
              type="number"
              min="1"
              max="52"
              name="weekNumber"
              placeholder="Ej: 3"
              value={form.weekNumber}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Day of the Week</label>
            <select
              name="weekDay"
              value={form.weekDay}
              onChange={handleChange}
              className="w-full p-3 rounded bg-[#2f2f2f] text-white"
              required
            >
              <option value="">Select Day</option>
              {WEEK_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-[#56d722] hover:bg-green-600 text-black font-semibold transition"
          >
            {loading ? "Recording..." : "Record Payment"}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

        {payments.length === 0 ? (
          <p className="text-gray-400">No payments found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-700">
            <table className="min-w-full divide-y divide-gray-700 text-white">
              <thead className="bg-[#2f2f2f]">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Trainer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Transaction Type</th>
                  <th className="px-4 py-3 text-left">Week/Day</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  {user.role === "admin" && <th className="px-4 py-3 text-left">Print</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#333333]">
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3">
                      {p.user?.first_name} {p.user?.last_name}
                    </td>
                    <td className="px-4 py-3">
                      {p.trainer?.first_name} {p.trainer?.last_name}
                    </td>
                    <td className="px-4 py-3">${p.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">{p.transaction_type}</td>
                    <td className="px-4 py-3">{p.week_day}</td>
                    <td className="px-4 py-3">{new Date(p.createdAt).toLocaleString()}</td>
                    {user.role === "admin" && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handlePrint(p.id)}
                          disabled={printing}
                          className="bg-[#56d722] hover:bg-green-600 text-black py-1 px-3 rounded"
                        >
                          Print
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
