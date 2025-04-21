import { User as AuthUser } from "@auth/express";

declare module "@auth/express" {
  interface User extends AuthUser {
    username?: string;
    participantId?: string;
  }
}
