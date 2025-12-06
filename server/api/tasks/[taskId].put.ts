import db from "~/utils/db";

// API นี้จะอยู่ที่ /api/tasks/[taskId]
export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, "taskId");
  const { title, description } = await readBody(event);

  if (!taskId) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  const updatedTask = await db.task.update({
    where: { id: taskId },
    data: {
      title,
      description,
    },
  });

  return updatedTask;
});
