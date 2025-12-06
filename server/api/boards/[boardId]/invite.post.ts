// server/api/boards/[boardId]/invite.post.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const boardId = getRouterParam(event, "boardId");
  const { email } = await readBody(event); // รับ email ของคนที่จะเชิญ

  if (!boardId || !email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Board ID and user email are required",
    });
  }

  // ค้นหา user จาก email ที่ส่งมา
  const userToInvite = await db.user.findUnique({ where: { email } });

  if (!userToInvite) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }

  // เพิ่ม user คนนั้นเข้าไปใน `members` ของ Board
  await db.board.update({
    where: {
      id: boardId,
      // ตรวจสอบว่าคนที่กำลังเชิญเป็นสมาชิกของบอร์ดอยู่แล้ว
      memberIds: { has: (session.user as { id: string }).id },
    },
    data: {
      members: {
        connect: { id: userToInvite.id }, // เชื่อมความสัมพันธ์
      },
    },
  });

  return { success: true };
});
