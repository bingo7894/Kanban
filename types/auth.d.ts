// types/auth.d.ts

import type { User as PrismaUser } from "@prisma/client";

// เราจะใช้ User type ที่ไม่มี hashedPassword
type User = Omit<PrismaUser, "hashedPassword">;

declare module "#auth-utils" {
  interface UserSession {
    user: User;
  }
}

// บรรทัดนี้สำคัญมาก!
export {};
