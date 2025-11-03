import { UserAPI } from "../api/UserApi";
import { useSocket } from "../socket/SocketProvider";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useLogout = () => {
    const { disconnectSocket } = useSocket();
    const navigate = useNavigate();
    const handleLogout = useCallback(async () => {
      try {
        await UserAPI.logout();
        localStorage.removeItem("token");
        disconnectSocket();

        console.log("Logged out successfully");
        navigate("/login");
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }, [disconnectSocket, navigate]);
  
    return { handleLogout };
  };
