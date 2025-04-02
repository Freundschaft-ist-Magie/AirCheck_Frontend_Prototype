<script lang="ts" setup>
import { useAuthStore } from "@/utils/stores/base/AuthStore";

// Form data
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const router = useRouter();

const authStore = useAuthStore();

// Mock authentication function
const mockLogin = async (email, password) => {
  // Simulate API delay
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  loading.value = false;

  // Mock successful login with admin role
  return {
    id: "Dh42-das2-8pw6-Qn7C",
    username: "Admin User",
    email: email,
    role: "admin",
    accessToken: "mock-access-token-12345",
    refreshToken: "mock-refresh-token-67890",
  };
};

const handleLogin = async () => {
  try {
    error.value = "";

    if (!email.value || !password.value) {
      error.value = "Bitte E-Mail und Passwort eingeben";
      return;
    }

    const userData = await mockLogin(email.value, password.value);

    authStore.setTokens(userData.accessToken, userData.refreshToken);
    authStore.setRole(userData.role);

    console.log("Login successful - User role: admin");

    router.push("/");
  } catch (err) {
    error.value = "Login fehlgeschlagen. Bitte versuchen Sie es erneut.";
    console.error("Login error:", err);
  }
};
</script>

<template>
  <div class="bg-gray-100 p-4 flex items-center justify-center min-h-screen">
    <div class="mt-4 p-4 bg-gray2 shadow-md rounded-md w-134">
      <div class="flex justify-center">
        <i class="pi pi-user" style="font-size: 3rem"></i>
      </div>

      <h2 class="text-center text-xl text-black font-semibold mt-2">Login</h2>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-2">
        <div>
          <label for="email_label">E-Mail</label>
          <InputText
            type="email"
            id="email_label"
            class="w-full"
            v-model="email"
            required
            placeholder="max.mustermann@muster.com"
          />
        </div>

        <div>
          <label for="password_label">Password</label>
          <Password
            id="password_label"
            v-model="password"
            toggleMask
            :feedback="false"
            placeholder="Passwort eingeben"
            class="w-full"
            inputClass="w-full"
          />
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <NuxtLink to="/" class="text-sm text-black underline hover:no-underline">
          Passwort vergessen?
        </NuxtLink>

        <Button
          icon="pi pi-sign-in"
          label="Einloggen"
          type="submit"
          severity="info"
          class="w-full text-white! bg-primary1! hover:bg-primary2/80! active:bg-primary2!"
          :loading="loading"
        />
      </form>
    </div>
  </div>
</template>
