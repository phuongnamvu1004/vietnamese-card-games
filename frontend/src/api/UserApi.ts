import { axiosInstance } from "../lib/axios";

export const UserAPI = {
  signup: (data: { fullName: string; email: string; password: string }) =>
    axiosInstance.post("/api/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/api/auth/login", data),

  logout: () => axiosInstance.post("/api/auth/logout"),

  checkAuth: () => axiosInstance.get("/api/auth/check"),

  refreshToken: async (): Promise<string | null> => {
    try {
      const res = await axiosInstance.post("/api/auth/refresh", {}, { withCredentials: true });

      const token = res.data?.accessToken || res.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token refreshed and saved:", token);
        return token;
      }

      console.warn("No token returned from refresh endpoint.");
      return null;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  },

  getProfile: () => axiosInstance.get("/api/user/user-profile"),

  getStatistics: () => axiosInstance.get("/api/user/user-statistics"),

  updateProfilePic: (profilePic: string) =>
    axiosInstance.post("/api/user/profile", { profilePic }),
};
