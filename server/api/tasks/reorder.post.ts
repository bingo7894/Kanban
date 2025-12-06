import db from "~/utils/db";
import type { Task } from "@prisma/client";

// API นี้จะถูกเรียกทุกครั้งที่ลาก Task ไปวาง
export default defineEventHandler(async (event) => {
  const { columnId, tasks } = (await readBody(event)) as {
    columnId: string;
    tasks: Task[];
  };

  if (!columnId || !tasks) {
    throw createError({ statusCode: 400, message: "Missing required fields" });
  }

  // ใช้ transaction เพื่ออัปเดต order ของ task ทุกตัวใน column เดียวกัน
  // ซึ่งมีประสิทธิภาพสูงกว่าการยิง API update ทีละตัว
  const updates = tasks.map((task, index) =>
    db.task.update({
      where: { id: task.id },
      data: {
        order: index, // อัปเดตลำดับตามตำแหน่งใน array ใหม่
        columnId: columnId, // อัปเดต columnId เผื่อมีการย้ายข้าม column
      },
    })
  );

  await db.$transaction(updates);

  return { success: true };
});
