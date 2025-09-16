import React, { createContext, useContext, useEffect, useState } from "react";
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
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    console.log(" Connecting socket to:", backendUrl);
    console.log(" Token found:", token);

    const s: Socket<ServerToClientEvents, ClientToServerEvents> = io(backendUrl, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    s.on("connect", () => {
      console.log("✅ Connected to socket server!");
      setConnected(true);
    });

    s.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
      setConnected(false);
    });

    s.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    setSocket(s);

    return () => {
      console.log("🔻 Closing socket connection...");
      s.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
