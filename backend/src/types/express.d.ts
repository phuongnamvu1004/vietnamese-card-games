// types/express.d.ts
import { SafeUser } from "../mappers/user.mapper";

declare global {
  namespace Express {
    interface Request {
      user?: SafeUser;
    }
  }
}
