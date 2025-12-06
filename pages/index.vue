<template>
  <div>
    <pre>
      {{ user }}
    </pre>

    <UButton @click="logout">Logout</UButton>
    <UButton to="/KanBan">Task Mode</UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // @ts-ignore
  middleware: "protected",
});
const { user, clear } = useUserSession();

const logout = async () => {
  await clear();
  await navigateTo("/auth");
};
</script>

<style scoped></style>
