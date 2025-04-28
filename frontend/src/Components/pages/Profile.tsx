import React, { useEffect, useState } from "react";
import CyberpunkLayout from "../../Constant/CyberpunkLayout";
import Logo from "../../Constant/ui/Logo";
import defaultAvatar from "../../assets/default-avatar.png";
import { Link } from "react-router-dom";
import axios from "axios";

interface UserStatistics {
  gamesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  specialWins: number;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    profilePic: defaultAvatar,
  });

  const [statistics, setStatistics] = useState<UserStatistics>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    specialWins: 0,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await axios.get("/api/auth/user-profile", { withCredentials: true });
        const statsRes = await axios.get("/api/user/statistics", { withCredentials: true });

        setUser({
          fullName: userRes.data.fullName,
          email: userRes.data.email,
          profilePic: userRes.data.profilePic || "/assets/default-avatar.png",
        });

        const samData = statsRes.data.samData || {};
        const phomData = statsRes.data.phomData || {};

        const samGames = samData.gamesPlayed || 0;
        const phomGames = phomData.gamesPlayed || 0;
        const samWins = samData.wins || 0;
        const phomWins = phomData.wins || 0;

        const winRate = samData.winRate || 0; // from database
        const specialWins = (samData.instantWins?.dragonStraight || 0)
                          + (samData.instantWins?.fourTwos || 0)
                          + (samData.instantWins?.flushHand || 0)
                          + (samData.instantWins?.threeTriplets || 0)
                          + (samData.instantWins?.fivePairs || 0);

        setStatistics({
          gamesPlayed: samGames + phomGames,
          wins: samWins + phomWins,
          losses: (samGames + phomGames) - (samWins + phomWins),
          winRate,
          specialWins,
        });
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setUploading(true);
        await axios.post("/api/user/profile", { profilePic: reader.result }, { withCredentials: true });
        setUser((prev) => ({ ...prev, profilePic: reader.result as string }));
      } catch (error) {
        console.error("Failed to upload new profile picture", error);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <CyberpunkLayout>
      <Logo subtitle="/ USER PROFILE /" size="md" />

      <div className="relative z-10 pt-32 flex flex-col items-center min-h-screen px-4">
        <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden p-8">

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-cyan-400 shadow-lg object-cover"
            />
            <label className="mt-4 cursor-pointer text-cyan-400 hover:text-cyan-300 font-mono text-sm">
              {uploading ? "Uploading..." : "Change Picture"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-cyan-300 font-mono">{user.fullName}</h2>
            <p className="text-gray-400 font-mono text-sm">{user.email}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4 text-center font-mono text-cyan-200">
            <div>
              <div className="text-lg font-bold">{statistics.gamesPlayed}</div>
              <div className="text-xs text-gray-400">Games Played</div>
            </div>
            <div>
              <div className="text-lg font-bold">{statistics.wins}</div>
              <div className="text-xs text-gray-400">Wins</div>
            </div>
            <div>
              <div className="text-lg font-bold">{statistics.losses}</div>
              <div className="text-xs text-gray-400">Losses</div>
            </div>
            <div>
              <div className="text-lg font-bold">{statistics.winRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-400">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold">{statistics.specialWins}</div>
              <div className="text-xs text-gray-400">Special Wins</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/game"
              className="inline-block px-6 py-3 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500 hover:text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] transition-all font-mono"
            >
              Back to Game
            </Link>
          </div>
        </div>
      </div>
    </CyberpunkLayout>
  );
};

export default Profile;
