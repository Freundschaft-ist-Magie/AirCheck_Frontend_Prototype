<script lang="ts" setup>
import { useAuthStore } from "@/utils/stores/base/AuthStore";

const authStore = useAuthStore();

const layout = authStore.isAuthenticated ? "not-logged-in" : "default";
</script>

<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtLoadingIndicator :color="'#fff'" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
