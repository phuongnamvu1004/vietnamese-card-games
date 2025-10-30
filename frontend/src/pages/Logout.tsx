import { UserAPI } from "../api/UserApi";
import { useSocket } from "../socket/SocketProvider";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useLogout = () => {
    const { disconnectSocket } = useSocket();
    const navigate = useNavigate();
    const handleLogout = useCallback(async () => {
        try {
          localStorage.removeItem("token");
          disconnectSocket();
          await UserAPI.logout(); 
          console.log("Logged out successfully");
          navigate("/login");
        } catch (err) {
          console.error("Logout failed:", err);
        }
      }, [disconnectSocket, navigate]);
    
      return { handleLogout };
    };