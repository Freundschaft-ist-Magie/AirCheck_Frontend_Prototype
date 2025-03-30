<script lang="ts" setup>
const layout = "default";
</script>

<template>
  <div>
    <NuxtLayout :name="layout">
      <NuxtLoadingIndicator :color="'#fff'" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
