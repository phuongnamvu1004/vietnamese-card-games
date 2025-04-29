import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<null | { fullName: string; profilePicture: string }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/check-auth", { withCredentials: true });
        setUser({
          fullName: res.data.fullName,
          profilePicture: res.data.profilePic || "/assets/default-avatar.png",
        });
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-gray-900/80 backdrop-blur-md shadow-md">
      {/* Logo */}
      <Link to="/" className="text-2xl font-bold font-mono text-cyan-400 hover:text-cyan-300 transition">
        VIETNAMESE CARD GAME
      </Link>

      {/* Menu */}
      <ul className="flex items-center gap-6 font-mono text-sm">
        <li>
          <Link to="/" className="text-cyan-400 hover:text-cyan-300 transition">
            Home
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition">
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="text-pink-400 hover:text-pink-300 transition">
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/game" className="text-cyan-400 hover:text-cyan-300 transition">
                Game
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </li>
            <li>
              <img
                src={user.profilePicture}
                alt="Avatar"
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full border-2 border-cyan-400 hover:border-pink-400 cursor-pointer transition object-cover"
              />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
