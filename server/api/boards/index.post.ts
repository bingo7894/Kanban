// server/api/boards/index.post.ts

import db from "~/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const { name } = await readBody(event);

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Board name is required",
    });
  }

  // สร้าง Board พร้อมกับเชื่อมความสัมพันธ์กับผู้สร้างในขั้นตอนเดียว
  const newBoard = await db.board.create({
    data: {
      name,
      members: {
        connect: {
          id: (session.user as { id: string }).id,
        },
      },
    },
  });

  return newBoard;
});
