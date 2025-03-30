<script lang="ts" setup>
const router = useRouter();

const loginData = ref({
  email: "",
  password: "",
  rememberMe: false,
});

function login() {
  try {
    const response = fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData.value),
    });

    if (!response.ok) {
      throw new Error("Login failed.");
    }

    const data = response.json();
    console.log("Login successful:", data);

    router.push("/");
  } catch (error) {
    console.error("Error during login:", error);
    alert("Login failed. Please try again.");
  }
}
</script>

<template>
  <div class="bg-gray-100 p-4 flex items-center justify-center min-h-screen">
    <div class="mt-4 p-4 bg-gray2 shadow-md rounded-md w-134">
      <div class="flex justify-center">
        <i class="pi pi-user" style="font-size: 3rem"></i>
      </div>

      <h2 class="text-center text-xl text-black font-semibold mt-2">Login</h2>

      <form @submit.prevent="login" class="flex flex-col gap-2">
        <div>
          <label for="username_label">E-Mail</label>
          <InputText
            type="email"
            id="username_label"
            class="w-full"
            v-model="loginData.email"
            required
            placeholder="max.mustermann@muster.com"
          />
        </div>

        <div>
          <label for="password_label">Password</label>
          <InputText
            type="email"
            id="password_label"
            class="w-full"
            v-model="loginData.password"
            required
            placeholder="********"
          />
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
        />
      </form>
    </div>
  </div>
</template>
