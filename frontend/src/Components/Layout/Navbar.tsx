import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import defaultAvatar from "../../assets/default-avatar.png"; // ✅ Add this

const Navbar: React.FC = () => {
  const [user, setUser] = useState<null | { fullName: string; profilePicture: string }>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user/user-profile"); // ✅ use correct backend route
        setUser({
          fullName: res.data.fullName,
          profilePicture: res.data.profilePic || defaultAvatar, // ✅ fallback here
        });
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-gray-900/80 backdrop-blur-md shadow-md">
      <Link to="/" className="text-2xl font-bold font-mono text-cyan-400 hover:text-cyan-300 transition">
        VIETNAMESE CARD GAME
      </Link>

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
              <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition">
                Logout
              </button>
            </li>
            <li>
              <img
                src={user.profilePicture}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultAvatar;
                }}
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
