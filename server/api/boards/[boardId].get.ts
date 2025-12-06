// server/api/boards/[boardId].get.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  // 1. ตรวจสอบว่าผู้ใช้ Login อยู่หรือไม่
  const session = await requireUserSession(event);
  const boardId = getRouterParam(event, "boardId");

  if (!boardId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Board ID is required",
    });
  }

  // 2. ค้นหา Board โดยมีเงื่อนไขเพิ่มเติมว่า "ผู้ใช้ปัจจุบันต้องเป็นสมาชิก"
  const board = await db.board.findFirst({
    where: {
      id: boardId,
      // เพิ่มเงื่อนไขนี้เข้าไปเพื่อความปลอดภัยและแก้ปัญหา
      memberIds: {
        has: (session.user as { id: string }).id,
      },
    },
    include: {
      columns: {
        orderBy: { order: "asc" },
        include: {
          tasks: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!board) {
    throw createError({ statusCode: 404, statusMessage: "Board not found" });
  }

  return board;
});
