// types.ts

import type {
  Board as PrismaBoard,
  Column as PrismaColumn,
  Task as PrismaTask,
} from "@prisma/client";

// --- Types เดิมของคุณ ---
export type APIError = {
  statusCode: number;
  statusMessage: string;
  message: string;
  data?: Record<string, string>;
};

export type State = {
  isLoading: boolean;
  appError: APIError | null;
  isConfirmModalVisible: boolean;
};

// --- Types ใหม่สำหรับ Kanban Board ---
export type Task = PrismaTask;

export interface ColumnWithTasks extends PrismaColumn {
  tasks: Task[];
}

export interface BoardWithColumns extends PrismaBoard {
  columns: ColumnWithTasks[];
}
