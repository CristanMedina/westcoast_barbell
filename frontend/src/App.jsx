import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Trainers from "./pages/Trainers";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
