import pkg from "@prisma/client";
const PrismaClient = pkg.PrismaClient; // หรือ const { PrismaClient } = pkg;

declare global {
  var prisma: InstanceType<typeof PrismaClient> | undefined; // <-- บรรทัดนี้
}

const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;

export default db;
