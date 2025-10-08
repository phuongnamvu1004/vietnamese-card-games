import { Response } from "express";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { log } from "../lib/utils/logger";
import { initializeUserStatisticsPhom, initializeUserStatisticsSam } from "../repositories/user-statistics.repository";
import { generateToken } from "../lib/utils/generators";

export type SignUpAuthServiceInput = {
  fullName: string;
  email: string;
  password: string;
}

export type LoginAuthServiceInput = {
  email: string;
  password: string;
}

export const AuthService = {
  async signup(input: SignUpAuthServiceInput, res: Response) {
    const { fullName, email, password } = input;
    if (!fullName || !email || !password) {
      log("All fields are required", "warn");
      throw new Error("All fields are required");
    }

    if (password.length < 6) {
      log("Password must be at least 6 characters", "warn");
      throw new Error("Password must be at least 6 characters");
    }

    const user = await findUserByEmail(email);
    if (user) {
      log("Email already exists", "warn");
      throw new Error("Email already exists");
    }

    // Implementation of signup logic
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    log("Hashed password:", hashedPassword, "info");

    const newUser = await createUser({
      fullName,
      email,
      hashedPassword,
    });

    if (!newUser) {
      log("Invalid user data", "warn");
      throw new Error("Invalid user data");
    }

    await initializeUserStatisticsSam(newUser.id);
    await initializeUserStatisticsPhom(newUser.id);

    // generate jwt token
    generateToken(newUser.id.toString(), res);

    log("User created successfully:", newUser, "info");

    return {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      balance: newUser.balance,
    };
  },

  async login(input: LoginAuthServiceInput, res: Response) {
    const { email, password } = input;

    const user = await findUserByEmail(email);

    if (!user) {
      log("Invalid credentials", "warn");
      throw new Error("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      log("Invalid credentials", "warn");
      throw new Error("Invalid credentials");
    }

    generateToken(user.id.toString(), res);

    log("User logged in successfully:", user, "info");

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      balance: user.balance,
    }
  },

  logout(res: Response) {
    res.cookie("jwt", "", { maxAge: 0 });
    log("User logged out successfully", "info");
  }
}