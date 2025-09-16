import axios from "axios";

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
    const res = await axios.post("/api/room", body, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return res.data; 
  },


  getById: async (roomId: string) => {
    const res = await axios.get(`/api/room/${roomId}`, {
      withCredentials: true,
    });
    return res.data; 
  },

  getAll: async () => {
    const res = await axios.get("/api/room", { withCredentials: true });
    return res.data; 
  },
};
