<template>
  <div
    v-if="board"
    class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50"
  >
    <!-- Elegant Header -->
    <div class="border-b border-white/10 bg-white/10 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-8 py-6">
        <div class="flex items-center justify-between">
          <!-- Brand & Board Name -->
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div
                class="w-12 h-12 bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl shadow-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                  ></path>
                </svg>
              </div>
              <div
                class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-300 rounded-full border-2 border-white"
              ></div>
            </div>

            <div>
              <UInput
                v-if="isEditingBoardName"
                v-model="editedBoardName"
                @blur="saveBoardName"
                @keyup.enter="saveBoardName"
                v-focus
                :ui="{
                  base: 'text-2xl font-medium text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-400',
                }"
              />
              <div
                v-else
                class="cursor-pointer group"
                @click="startEditingBoardName"
              >
                <h1
                  class="text-2xl font-medium text-gray-800 group-hover:text-pink-400 transition-colors duration-300 tracking-wide"
                >
                  {{ board.name }}
                </h1>
                <p class="text-gray-500 text-sm mt-1 font-light">
                  Premium workspace
                </p>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div
            class="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10"
          >
            <div class="flex items-center space-x-6">
              <div class="text-center">
                <div class="text-xl font-medium text-gray-800">
                  {{ board.columns?.length || 0 }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-widest">
                  Lists
                </div>
              </div>
              <div class="w-px h-6 bg-white/20"></div>
              <div class="text-center">
                <div class="text-xl font-medium text-gray-800">
                  {{ totalTasks }}
                </div>
                <div class="text-xs text-gray-500 uppercase tracking-widest">
                  Tasks
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Board Columns -->
    <div class="max-w-7xl mx-auto p-8">
      <div class="flex items-start space-x-6 overflow-x-auto pb-6">
        <Draggable
          v-model="board.columns"
          group="columns"
          item-key="id"
          class="flex space-x-6"
          handle=".column-handle"
        >
          <template #item="{ element: column, index }">
            <div class="w-[320px] flex-shrink-0">
              <div
                class="bg-white/20 backdrop-blur-sm rounded-2xl border border-white/10 shadow-md overflow-hidden hover:scale-105 hover:bg-white/30 transition-all duration-300"
              >
                <!-- Column Header -->
                <div
                  class="p-4 flex justify-between items-center"
                  :class="getColumnAccent(index)"
                >
                  <template v-if="renamingColumnId === column.id">
                    <UInput
                      v-model="newColumnNameForRename"
                      @blur="saveColumnRename(column.id)"
                      @keyup.enter="saveColumnRename(column.id)"
                      v-focus
                      :ui="{
                        base: 'font-medium text-gray-800 bg-white/10 border-white/20 focus:border-white/40 rounded-md',
                      }"
                    />
                  </template>
                  <template v-else>
                    <div class="flex items-center space-x-2">
                      <div class="w-2 h-2 rounded-full bg-gray-400"></div>
                      <h3
                        @click="startRenamingColumn(column)"
                        class="font-medium text-gray-800 cursor-grab column-handle hover:text-pink-400 text-lg tracking-wide"
                      >
                        {{ column.name }}
                      </h3>
                    </div>
                  </template>

                  <div class="flex items-center space-x-2">
                    <div
                      class="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1"
                    >
                      <span class="text-gray-800 text-sm font-medium">{{
                        column.tasks?.length || 0
                      }}</span>
                    </div>
                    <UButton
                      icon="i-heroicons-x-mark"
                      size="sm"
                      variant="ghost"
                      @click="deleteColumn(column.id)"
                      class="text-gray-400 hover:text-gray-700 hover:bg-white/20"
                    />
                  </div>
                </div>

                <!-- Tasks -->
                <div class="p-4">
                  <Draggable
                    v-model="column.tasks"
                    group="tasks"
                    item-key="id"
                    class="space-y-4 min-h-[250px]"
                    @end="(event) => onTaskDragEnd(event, column.id)"
                  >
                    <template #item="{ element: task }">
                      <div
                        class="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/10 cursor-pointer hover:scale-[1.03] hover:shadow-md transition-all duration-300"
                        @click="openTaskModal(task)"
                      >
                        <template v-if="editingTaskId === task.id">
                          <UInput
                            v-model="editedTaskTitle"
                            @keyup.enter="saveTaskEdit(task.id)"
                            @blur="saveTaskEdit(task.id)"
                            v-focus
                            :ui="{
                              base: 'text-gray-800 bg-transparent border-none focus:ring-0 font-medium',
                            }"
                          />
                        </template>
                        <template v-else>
                          <div class="flex items-start justify-between">
                            <p class="text-gray-700 font-medium flex-1 pr-2">
                              {{ task.title }}
                            </p>
                            <div
                              class="flex items-center space-x-1 opacity-0 group-hover/task:opacity-100 transition-all duration-200"
                            >
                              <UButton
                                icon="i-heroicons-pencil-square"
                                size="xs"
                                variant="ghost"
                                @click.stop="startEditingTask(task)"
                                class="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                              />
                              <UButton
                                icon="i-heroicons-trash"
                                size="xs"
                                variant="ghost"
                                @click.stop="deleteTask(task.id)"
                                class="text-gray-400 hover:text-red-500 hover:bg-red-50"
                              />
                            </div>
                          </div>

                          <div
                            class="mt-2 flex items-center justify-between text-xs text-gray-400"
                          >
                            <div>ID-{{ task.id.slice(-4).toUpperCase() }}</div>
                            <div
                              class="w-2 h-2 rounded-full"
                              :class="getTaskPriority(index)"
                            ></div>
                          </div>
                        </template>
                      </div>
                    </template>
                  </Draggable>

                  <!-- Add Task -->
                  <div class="mt-4">
                    <div class="relative">
                      <UInput
                        v-model="newTaskTitles[column.id]"
                        placeholder="Add new task..."
                        @keyup.enter="createTask(column.id)"
                        :ui="{
                          base: 'bg-white/20 backdrop-blur-sm border border-white/20 text-gray-800 placeholder-gray-400 rounded-xl',
                          padding: { sm: 'px-4 py-3' },
                        }"
                      />
                      <div
                        v-if="newTaskTitles[column.id]"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2"
                      >
                        <UButton
                          icon="i-heroicons-plus"
                          size="xs"
                          variant="solid"
                          color="pink"
                          @click="createTask(column.id)"
                          class="shadow-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Draggable>

        <!-- Add Column -->
        <div class="w-[320px] flex-shrink-0">
          <div
            class="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-white/20 p-6 text-center hover:bg-white/20 hover:border-white/30 transition-all duration-300 min-h-[350px] flex flex-col justify-center"
          >
            <div class="mb-4">
              <div
                class="w-14 h-14 mx-auto bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center shadow-md mb-3"
              >
                <svg
                  class="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-800 mb-1 tracking-wide">
                New List
              </h4>
              <p class="text-gray-500 text-sm font-light">Enter to Add</p>
            </div>

            <UInput
              v-model="newColumnName"
              placeholder="Enter list name..."
              @keyup.enter="createColumn"
              :ui="{
                base: 'bg-white/20 backdrop-blur-sm border border-white/20 focus:bg-white/30 focus:border-white/30 text-gray-800 placeholder-gray-400 rounded-2xl text-center font-light',
                padding: { sm: 'px-4 py-3' },
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div
    v-else
    class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex items-center justify-center"
  >
    <div class="text-center">
      <div class="relative mb-6">
        <div
          class="w-20 h-20 mx-auto bg-gradient-to-br from-pink-300 to-pink-400 rounded-2xl flex items-center justify-center shadow-md"
        >
          <svg
            class="w-10 h-10 text-white animate-pulse"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            ></path>
          </svg>
        </div>
        <div
          class="absolute -bottom-2 -right-2 w-5 h-5 bg-emerald-300 rounded-full border-4 border-white"
        ></div>
      </div>
      <h2 class="text-xl font-medium text-gray-800 mb-1 tracking-wide">
        Loading workspace
      </h2>
      <p class="text-gray-500 font-light">Preparing your premium experience</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Draggable from "vuedraggable";
import type { BoardWithColumns, ColumnWithTasks, Task } from "~/types";

definePageMeta({ middleware: "protected" });

const route = useRoute();
const boardId = computed(() => route.params.boardId as string);

const { data: board, refresh: refreshBoard } =
  await useAsyncData<BoardWithColumns>(
    () => `board-${boardId.value}`,
    () => $fetch(`/api/boards/${boardId.value}`),
    { watch: [boardId] }
  );

// Computed
const totalTasks = computed(() => {
  return (
    board.value?.columns?.reduce(
      (total, column) => total + (column.tasks?.length || 0),
      0
    ) || 0
  );
});

// Premium styling functions
const getColumnAccent = (index: number) => {
  const accents = [
    "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
    "bg-gradient-to-r from-purple-500/20 to-pink-500/20",
    "bg-gradient-to-r from-emerald-500/20 to-teal-500/20",
    "bg-gradient-to-r from-orange-500/20 to-red-500/20",
    "bg-gradient-to-r from-indigo-500/20 to-purple-500/20",
    "bg-gradient-to-r from-rose-500/20 to-pink-500/20",
  ];
  return accents[index % accents.length];
};

const getTaskPriority = (index: number) => {
  const priorities = [
    "bg-red-400",
    "bg-amber-400",
    "bg-emerald-400",
    "bg-blue-400",
    "bg-purple-400",
    "bg-pink-400",
  ];
  return priorities[index % priorities.length];
};

// State
const newTaskTitles = ref<Record<string, string>>({});
const editingTaskId = ref<string | null>(null);
const editedTaskTitle = ref("");
const newColumnName = ref("");
const renamingColumnId = ref<string | null>(null);
const newColumnNameForRename = ref("");
const isEditingBoardName = ref(false);
const editedBoardName = ref("");

const vFocus = {
  mounted: (el: HTMLElement) => el.querySelector("input")?.focus(),
};

// Board functions
const startEditingBoardName = () => {
  if (board.value) {
    editedBoardName.value = board.value.name;
    isEditingBoardName.value = true;
  }
};

const saveBoardName = async () => {
  isEditingBoardName.value = false;
  if (
    !board.value ||
    !editedBoardName.value.trim() ||
    editedBoardName.value.trim() === board.value.name
  )
    return;
  await useFetch<{ success: boolean }>(`/api/boards/${boardId.value}`, {
    method: "PUT",
    body: { name: editedBoardName.value },
  });
  await refreshBoard();
};

// Column functions
const createColumn = async () => {
  if (!newColumnName.value.trim()) return;
  await useFetch<ColumnWithTasks>(`/api/boards/${boardId.value}/columns`, {
    method: "POST",
    body: { name: newColumnName.value },
  });
  newColumnName.value = "";
  await refreshBoard();
};

const startRenamingColumn = (column: ColumnWithTasks) => {
  renamingColumnId.value = column.id;
  newColumnNameForRename.value = column.name;
};

const cancelColumnRename = () => {
  renamingColumnId.value = null;
  newColumnNameForRename.value = "";
};

const saveColumnRename = async (columnId: string) => {
  const originalColumn = board.value?.columns.find((c) => c.id === columnId);
  if (
    !newColumnNameForRename.value.trim() ||
    newColumnNameForRename.value.trim() === originalColumn?.name
  ) {
    cancelColumnRename();
    return;
  }
  await useFetch<ColumnWithTasks>(
    `/api/boards/${boardId.value}/columns/${columnId}`,
    { method: "PUT", body: { name: newColumnNameForRename.value } }
  );
  cancelColumnRename();
  await refreshBoard();
};

const deleteColumn = async (columnId: string) => {
  if (
    !confirm("Are you sure you want to delete this column and all its tasks?")
  )
    return;
  await useFetch<{ success: boolean }>(
    `/api/boards/${boardId.value}/columns/${columnId}`,
    { method: "DELETE" }
  );
  await refreshBoard();
};

// Task functions
const createTask = async (columnId: string) => {
  const title = newTaskTitles.value[columnId];
  if (!title || !title.trim()) return;
  await useFetch<Task>(
    `/api/boards/${boardId.value}/columns/${columnId}/tasks`,
    { method: "POST", body: { title } }
  );
  newTaskTitles.value[columnId] = "";
  await refreshBoard();
};

const deleteTask = async (taskId: string) => {
  if (!confirm("Are you sure you want to delete this task?")) return;
  await useFetch<{ success: boolean }>(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  await refreshBoard();
};

const startEditingTask = (task: Task) => {
  editingTaskId.value = task.id;
  editedTaskTitle.value = task.title;
};

const saveTaskEdit = async (taskId: string) => {
  if (!editedTaskTitle.value.trim()) {
    cancelTaskEdit();
    return;
  }
  await useFetch(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: { title: editedTaskTitle.value },
  });
  editingTaskId.value = null;
  editedTaskTitle.value = "";
  await refreshBoard();
};

const cancelTaskEdit = () => {
  editingTaskId.value = null;
  editedTaskTitle.value = "";
};

const openTaskModal = (task: Task) => {
  console.log("Open modal for task:", task);
};

const onTaskDragEnd = async (event: any, newColumnId: string) => {
  if (!board.value) return;
  const newColumn = board.value.columns.find((c) => c.id === newColumnId);
  if (!newColumn) return;

  await useFetch<{ success: boolean }>("/api/tasks/reorder", {
    method: "POST",
    body: { columnId: newColumnId, tasks: newColumn.tasks },
  });
};
</script>
