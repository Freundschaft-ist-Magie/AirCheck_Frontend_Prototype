<script lang="ts" setup>
defineProps({
  title: String,
  text: Number,
  normalRange: String,
});
</script>

<template>
  <div class="bg-white p-4 shadow-md rounded-md">
    <h3 class="font-bold text-primary2">{{ title }}</h3>
    <p class="text-2xl font-bold">{{ text }}</p>
    <p class="text-gray-500">Normaler Bereich: {{ normalRange }}</p>
  </div>
</template>
