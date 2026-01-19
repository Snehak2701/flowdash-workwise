// src/types/express.d.ts

// What your JWT contains:
export type JWTPayload = {
  id: string;
  email: string;
  role: "MANAGER" | "OPERATOR" | "PROJECT_MANAGER";
};

declare module "express-serve-static-core" {
  interface Request {
    user?: JWTPayload;
    validAccessToken?: string;
  }
}
