// server/api/boards/[boardId].put.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const boardId = getRouterParam(event, "boardId");
  const { name } = await readBody(event);

  if (!boardId || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Board ID and new name are required",
    });
  }

  const updatedBoard = await db.board.updateMany({
    where: {
      id: boardId,
      memberIds: {
        has: (session.user as { id: string }).id,
      },
    },
    data: {
      name: name,
    },
  });

  if (updatedBoard.count === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Board not found or you do not have permission to edit it",
    });
  }

  return { success: true };
});
