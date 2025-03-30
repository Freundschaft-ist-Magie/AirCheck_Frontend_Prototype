<script lang="ts" setup>
defineProps({
  title: String,
  text: Number,
  icon: String,
  normalRange: String,
});
</script>

<template>
  <div class="bg-white p-4 shadow-md rounded-md">
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-primary2">{{ title }}</h3>
      <Icon :name="icon" class="text-3xl text-black" />
    </div>
    <p class="text-2xl font-bold">{{ text }}</p>
    <p class="text-gray-500">Normaler Bereich: {{ normalRange }}</p>
  </div>
</template>
