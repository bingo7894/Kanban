<script setup lang="ts">
import { reactive } from "vue";
import { handleError } from "~/utils/error";
import type { FormSubmitEvent } from "#ui/types";
import type { LoginSchema, RegisterSchema } from "~/utils/schemas";
import useStore from "~/composables/useStore";

const items = [
  { slot: "login", label: "Login", description: "เข้าสู่บัญชีของคุณ" },
  { slot: "register", label: "Register", description: "สร้างบัญชีใหม่" },
];

const loginForm = reactive({
  email: "",
  password: "",
});

const registerForm = reactive({
  email: "",
  password: "",
  name: "",
});

const { isLoading, toggleLoading, showMessage, showError } = useStore();

async function login(event: FormSubmitEvent<LoginSchema>) {
  try {
    toggleLoading(true);

    await $fetch("/api/auth/login", {
      method: "POST",
      body: event.data,
    });

    showMessage({
      title: "เข้าสู่ระบบสำเร็จ",
      description: "กำลังนำคุณไปยังหน้าหลัก...",
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await navigateTo("/kanban", { replace: true });
    window.location.reload();
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
}

async function register(event: FormSubmitEvent<RegisterSchema>) {
  try {
    toggleLoading(true);

    await $fetch("/api/auth/register", {
      method: "POST",
      body: event.data,
    });

    showMessage({
      title: "สมัครสมาชิกสำเร็จ",
      description: "บัญชีของคุณถูกสร้างเรียบร้อยแล้ว",
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await navigateTo("/kanban", { replace: true });
    window.location.reload();
  } catch (error) {
    const err = handleError(error);
    showError(err);
  } finally {
    toggleLoading(false);
  }
}

definePageMeta({
  layout: "auth",
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors"
  >
    <div
      class="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-white/40 dark:border-gray-700"
    >
      <UTabs :items="items" class="w-full">
        <!-- Login -->
        <template #login="{ item }">
          <UCard class="bg-transparent shadow-none">
            <template #header>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>
            </template>

            <UForm
              :schema="loginSchema"
              class="space-y-4"
              @submit="login"
              :state="loginForm"
            >
              <UFormGroup label="Email" name="email">
                <UInput
                  v-model="loginForm.email"
                  type="email"
                  placeholder="กรอกอีเมล"
                  :disabled="isLoading"
                />
              </UFormGroup>

              <UFormGroup label="Password" name="password">
                <UInput
                  v-model="loginForm.password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  :disabled="isLoading"
                />
              </UFormGroup>

              <UButton
                block
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
                class="mt-5 bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white rounded-xl"
              >
                {{ isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ" }}
              </UButton>
            </UForm>
          </UCard>
        </template>

        <!-- Register -->
        <template #register="{ item }">
          <UCard class="bg-transparent shadow-none">
            <template #header>
              <p class="text-lg font-bold text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ item.description }}
              </p>
            </template>

            <UForm
              :schema="registerSchema"
              class="space-y-4"
              @submit="register"
              :state="registerForm"
            >
              <UFormGroup label="Name" name="name">
                <UInput
                  v-model="registerForm.name"
                  placeholder="กรอกชื่อของคุณ"
                  :disabled="isLoading"
                />
              </UFormGroup>

              <UFormGroup label="Email" name="email">
                <UInput
                  v-model="registerForm.email"
                  type="email"
                  placeholder="กรอกอีเมล"
                  :disabled="isLoading"
                />
              </UFormGroup>

              <UFormGroup label="Password" name="password">
                <UInput
                  v-model="registerForm.password"
                  type="password"
                  placeholder="กรอกรหัสผ่าน"
                  :disabled="isLoading"
                />
              </UFormGroup>

              <UButton
                block
                type="submit"
                :loading="isLoading"
                :disabled="isLoading"
                class="mt-5 bg-gradient-to-r from-purple-300 to-purple-400 hover:from-purple-400 hover:to-purple-500 text-white rounded-xl"
              >
                {{ isLoading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก" }}
              </UButton>
            </UForm>
          </UCard>
        </template>
      </UTabs>
    </div>
  </div>
</template>
