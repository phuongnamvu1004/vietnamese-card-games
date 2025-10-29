import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "invitation:created": (data: any) => void;
  "invitation:batchCreated": (data: any) => void;
  "roomUpdate": (gameState: any) => void;
}

interface ClientToServerEvents {
  joinRoom: (
    data: {
      roomId: string;
      userId: number;
      playerName: string;
      buyIn: number;
      gameBalance: number;
    },
    callback: (res: {
      success?: boolean;
      error?: string;
      isHost?: boolean;
      gameState?: any;
    }) => void
  ) => void;
}

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
  connected: boolean;
  connectSocket: (token?: string) => void; 
  disconnectSocket: () => void;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  connectSocket: () => {},
  disconnectSocket: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const fetchToken = useCallback(async (): Promise<string | null> => {
    try {
      const response = await fetch(`${backendUrl}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        console.warn("Token refresh failed:", response.status);
        return localStorage.getItem("token"); 
      }

      const data = await response.json();
      const token = data.accessToken || data.token;

      if (token) {
        localStorage.setItem("token", token);
        console.log("Refreshed and stored token:", token);
        return token;
      }

      return localStorage.getItem("token");
    } catch (err) {
      console.error("Error fetching refresh token:", err);
      return localStorage.getItem("token");
    }
  }, [backendUrl]);

  const connectSocket = useCallback(
    async (manualToken?: string) => {
      const token = manualToken || (await fetchToken());

      if (!token) {
        console.warn("No valid token found. Cannot connect socket.");
        return;
      }

      console.log("Connecting socket to:", backendUrl);
      console.log("Token used for connection:", token);

      const s: Socket<ServerToClientEvents, ClientToServerEvents> = io(backendUrl, {
        auth: { token },
        transports: ["websocket"],
        withCredentials: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      s.on("connect", () => {
        console.log("Connected to socket server!");
        setConnected(true);
      });

      s.on("disconnect", (reason) => {
        console.warn("Socket disconnected:", reason);
        setConnected(false);
      });

      s.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      setSocket(s);
    },
    [backendUrl, fetchToken]
  );

  const disconnectSocket = useCallback(() => {
    if (socket) {
      console.log("Closing socket connection...");
      socket.disconnect();
      setSocket(null);
      setConnected(false);
    }
  }, [socket]);

 
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) connectSocket(savedToken);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
