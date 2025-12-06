// server/api/boards/[boardId]/columns.post.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const boardId = getRouterParam(event, "boardId");
  const { name } = await readBody(event);

  if (!boardId || !name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Board ID and column name are required",
    });
  }

  // หาลำดับสุดท้ายของ column ที่มีอยู่เพื่อกำหนดลำดับให้ column ใหม่
  const lastColumn = await db.column.findFirst({
    where: { boardId },
    orderBy: { order: "desc" },
  });

  const newOrder = lastColumn ? lastColumn.order + 1 : 1;

  const newColumn = await db.column.create({
    data: {
      name,
      boardId,
      order: newOrder,
    },
  });

  return newColumn;
});
