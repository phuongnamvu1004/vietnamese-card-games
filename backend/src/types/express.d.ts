// types/express.d.ts
import { SafeUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
