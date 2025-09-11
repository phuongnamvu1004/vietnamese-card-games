export interface User {
  id: number;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}