// server/api/boards/index.get.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const boards = await db.board.findMany({
    where: {
      // ค้นหา Board ที่มี ID ของผู้ใช้ปัจจุบันอยู่ใน Array 'memberIds'
      memberIds: {
        // --- แก้ไขจุดนี้ ---
        has: (session.user as { id: string }).id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return boards;
});
