// server/api/boards/[boardId].delete.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const boardId = getRouterParam(event, "boardId");

  if (!boardId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Board ID is required",
    });
  }

  // ค้นหา board เพื่อให้แน่ใจว่าผู้ใช้เป็นเจ้าของหรือสมาชิก
  const board = await db.board.findFirst({
    where: {
      id: boardId,
      memberIds: {
        has: (session.user as { id: string }).id,
      },
    },
  });

  if (!board) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "Board not found or you do not have permission to delete it",
    });
  }

  // ทำการลบ
  await db.board.delete({
    where: {
      id: boardId,
    },
  });

  return { success: true };
});
