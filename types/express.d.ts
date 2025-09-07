import type { User } from "@prisma/client";

declare global {
  namespace Express {
    export interface UserPayload {
      id: string;
      email: string;
    }

    export interface Request {
        user?: import("@prisma/client").User | { id: string; email: string };
    }
  }
}
