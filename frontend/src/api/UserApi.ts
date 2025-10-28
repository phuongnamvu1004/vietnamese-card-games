import { axiosInstance } from "../lib/axios";

export const UserAPI = {
  signup: (data: { fullName: string; email: string; password: string }) =>
    axiosInstance.post("/api/auth/signup", data),

  login: (data: { email: string; password: string }) =>
    axiosInstance.post("/api/auth/login", data),

  checkAuth: () => axiosInstance.get("/api/auth/check"),

  logout: () => axiosInstance.post("/api/auth/logout"),

  getProfile: () => axiosInstance.get("/api/user/user-profile"),
  getStatistics: () => axiosInstance.get("/api/user/statistics"),

  updateProfilePic: (profilePic: string) =>
    axiosInstance.post("/api/user/profile", { profilePic }),
};
