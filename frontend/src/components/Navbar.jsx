import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-[#222222] text-white p-4 flex justify-between items-center">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate(user?.role === "admin" ? "/admin" : "/profile")}
      >
        <img src="/logo.png" alt="Westcoast Barbell Logo" className="h-12" />
        <span className="text-xl font-bold">Westcoast Barbell</span>
      </div>

      <div className="flex gap-4 items-center">
        {!user && (
          <>
            <Link to="/login" className="hover:text-[#56d722]">Login</Link>
            <Link to="/signup" className="hover:text-[#56d722]">Signup</Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/profile" className="hover:text-[#56d722]">Profile</Link>
            <Link to="/trainers" className="hover:text-[#56d722]">Trainers</Link>
            <Link to="/payment" className="hover:text-[#56d722]">Payment</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin" className="hover:text-[#56d722]">Admin Panel</Link>
            <Link to="/trainers" className="hover:text-[#56d722]">Trainers</Link>
            <Link to="/payment" className="hover:text-[#56d722]">Payments</Link>
          </>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="bg-[#56d722] text-black px-3 py-1 rounded-md hover:bg-green-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
