// server/api/boards/[boardId]/columns/[columnId].delete.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  // ตรวจสอบ session ของผู้ใช้
  await requireUserSession(event);
  const { columnId } = getRouterParams(event);

  // ลบ Column ออกจากฐานข้อมูล
  // Prisma จะจัดการลบ Task ทั้งหมดที่อยู่ใน Column นี้โดยอัตโนมัติ (ตามที่ตั้งค่าไว้ใน schema.prisma)
  await db.column.delete({
    where: { id: columnId },
  });

  return { success: true };
});
