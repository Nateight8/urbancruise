import { type Session } from "@auth/express";

//extend response typescript type to include session
declare module "express" {
  interface Response {
    locals: {
      session?: Session;
    };
  }
}
