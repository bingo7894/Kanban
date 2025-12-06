import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const { columnId } = getRouterParams(event);
  const { title } = await readBody(event);

  if (!columnId || !title) {
    throw createError({ statusCode: 400, message: "Missing required fields" });
  }

  // หา Task ลำดับสุดท้ายเพื่อกำหนด order ให้กับ Task ใหม่
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
