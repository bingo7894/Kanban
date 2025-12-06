<template>
  <div
    class="p-10 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 min-h-screen"
  >
    <h1 class="text-4xl font-semibold mb-8 text-gray-800 tracking-tight">
      My Boards
    </h1>

    <!-- Form สร้าง Board -->
    <form
      @submit.prevent="handleCreateBoard"
      class="mb-10 flex items-center gap-3 max-w-md"
    >
      <UInput
        v-model="newBoardName"
        placeholder="Enter new board name"
        class="flex-grow bg-white/40 backdrop-blur-md rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-pink-300"
        required
      />
      <UButton
        type="submit"
        :loading="isLoading"
        class="bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white shadow-md rounded-xl px-5 py-2.5"
      >
        Create
      </UButton>
    </form>

    <!-- แสดงสถานะกำลังโหลด -->
    <div v-if="pending" class="text-gray-600 italic">
      <p>Loading boards...</p>
    </div>

    <!-- แสดงรายการ Board -->
    <div
      v-else-if="boards && boards.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
    >
      <div
        v-for="board in boards"
        :key="board.id"
        class="relative group p-5 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/40"
        @click="navigateToBoard(board.id)"
      >
        <!-- ชื่อ + วันที่ -->
        <div v-if="renamingBoardId !== board.id">
          <h2
            class="font-semibold text-lg text-gray-800 truncate group-hover:text-pink-500 transition-colors"
          >
            {{ board.name }}
          </h2>
          <p class="text-xs text-gray-500 mt-1">
            Created: {{ new Date(board.createdAt).toLocaleDateString() }}
          </p>
        </div>

        <!-- Input แก้ไขชื่อ -->
        <div v-else>
          <UInput
            v-model="newBoardNameForRename"
            v-focus
            @click.stop
            @keyup.enter="saveRename(board.id)"
            @blur="cancelRename"
            class="w-full bg-white/70 backdrop-blur rounded-lg px-3 py-2 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <!-- ปุ่ม Actions -->
        <div
          class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <UButton
            icon="i-heroicons-pencil-square"
            size="sm"
            variant="soft"
            class="bg-white/50 text-gray-600 hover:text-pink-500 hover:bg-white/70 rounded-lg shadow-sm"
            @click.stop="startRenaming(board)"
          />
          <UButton
            icon="i-heroicons-x-mark"
            size="sm"
            color="red"
            variant="soft"
            class="bg-white/50 text-gray-600 hover:text-red-500 hover:bg-white/70 rounded-lg shadow-sm"
            @click.stop="handleDeleteBoard(board.id)"
          />
        </div>
      </div>
    </div>

    <!-- เมื่อไม่มี Board -->
    <div
      v-else-if="!pending && (!boards || boards.length === 0)"
      class="mt-12 text-center text-gray-500"
    >
      <p class="text-lg">No boards found. 🚀</p>
      <p class="text-sm text-gray-400">Create your first one above!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Board } from "@prisma/client";

definePageMeta({
  middleware: "protected",
});

const newBoardName = ref("");
const isLoading = ref(false);
const boards = ref<Board[] | null>(null);

const {
  data,
  pending,
  refresh: refreshBoards,
} = useAsyncData("boards", () => $fetch<Board[]>("/api/boards"));

// sync boards
watchEffect(() => {
  if (data.value) boards.value = data.value;
});

// --- สร้าง Board ---
const handleCreateBoard = async () => {
  if (!newBoardName.value.trim()) return;
  isLoading.value = true;
  await useFetch("/api/boards", {
    method: "POST",
    body: { name: newBoardName.value },
  });
  newBoardName.value = "";
  await refreshBoards();
  isLoading.value = false;
};

// --- ลบ Board ---
const handleDeleteBoard = async (boardId: string) => {
  if (!confirm("Are you sure? This action cannot be undone.")) return;
  await useFetch<{ success: boolean }>(`/api/boards/${boardId}`, {
    method: "DELETE",
  });
  await refreshBoards();
};

// --- Rename ---
const renamingBoardId = ref<string | null>(null);
const newBoardNameForRename = ref("");

const startRenaming = (board: Board) => {
  renamingBoardId.value = board.id;
  newBoardNameForRename.value = board.name;
};

const cancelRename = () => {
  renamingBoardId.value = null;
  newBoardNameForRename.value = "";
};

const saveRename = async (boardId: string) => {
  if (!newBoardNameForRename.value.trim()) return;

  await useFetch<{ success: boolean }>(`/api/boards/${boardId}`, {
    method: "PUT",
    body: { name: newBoardNameForRename.value },
  });
  await refreshBoards();
  cancelRename();
};

// --- Navigate ---
const navigateToBoard = (boardId: string) => {
  if (renamingBoardId.value === boardId) return;
  navigateTo(`/kanban/${boardId}`);
};

// --- Directive ---
const vFocus = {
  mounted: (el: HTMLInputElement) => el.focus(),
};
</script>
