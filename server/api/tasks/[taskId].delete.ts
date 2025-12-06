import db from "~/utils/db";

// API นี้จะอยู่ที่ /api/tasks/[taskId]
export default defineEventHandler(async (event) => {
  const taskId = getRouterParam(event, "taskId");

  if (!taskId) {
    throw createError({ statusCode: 400, message: "Task ID is required" });
  }

  await db.task.delete({
    where: { id: taskId },
  });

  return { success: true };
});
