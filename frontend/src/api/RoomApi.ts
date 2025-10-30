import axios from "axios";

const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const RoomApi = {
  create: async (
    token: string,
    body: {
      gameType: "sam" | "phom";
      maxPlayers: number;
      buyIn: number;
      betUnit: number;
      players: string[];
    }
  ) => {
    const res = await axios.post(`${backendUrl}/api/room/create-room`, body, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return res.data;
  },

  getById: async (roomId: string) => {
    const res = await axios.get(`${backendUrl}/api/room/${roomId}`, {
      withCredentials: true,
    });
    return res.data;
  },

  getAll: async () => {
    const res = await axios.get(`${backendUrl}/api/room`, { withCredentials: true });
    return res.data;
  },
};