// server/api/boards/[boardId]/columns/[columnId].put.ts
import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  // ตรวจสอบ session ของผู้ใช้
  await requireUserSession(event);

  // ดึงค่า columnId จาก URL และ name จาก body
  const { columnId } = getRouterParams(event);
  const { name } = await readBody(event);

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Column name is required",
    });
  }

  // อัปเดตชื่อของ Column ในฐานข้อมูล
  const updatedColumn = await db.column.update({
    where: { id: columnId },
    data: { name },
  });

  return updatedColumn;
});
