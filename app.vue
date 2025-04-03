<script lang="ts" setup>
import { useAuthStore } from "@/utils/stores/base/AuthStore";

const authStore = useAuthStore();

const layout = authStore.isAuthenticated ? "default" : "not-logged-in";
</script>

<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtLoadingIndicator :color="'#fff'" />
      <Toast />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
