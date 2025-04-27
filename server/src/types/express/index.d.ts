import { User as PassportUser } from "passport";

declare global {
  namespace Express {
    interface User extends PassportUser {
      id: string;
      email: string;
      name?: string;
      image?: string;
      // Add any other fields you expect
    }
  }
}

export {};
