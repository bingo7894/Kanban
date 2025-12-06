// server/api/columns/[columnId]/tasks.post.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const columnId = getRouterParam(event, "columnId");
  const { title } = await readBody(event);

  if (!columnId || !title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Column ID and task title are required",
    });
  }

  const lastTask = await db.task.findFirst({
    where: { columnId },
    orderBy: { order: "desc" },
  });

  const newOrder = lastTask ? lastTask.order + 1 : 1;

  const newTask = await db.task.create({
    data: {
      title,
      columnId,
      order: newOrder,
    },
  });

  return newTask;
});
