<script lang="ts" setup>
defineProps({
  title: String,
  text: String,
  icon: String,
  normalRange: String,
  isCritical: Boolean,
});
</script>

<template>
  <div
    class="bg-white p-4 shadow-md shadow-black/40 rounded-md"
    :class="{ 'border border-red-600': isCritical }"
  >
    <div class="flex justify-between items-center mb-2">
      <h3 class="font-bold text-primary2" :class="{ 'text-red-600': isCritical }">
        {{ title }}
      </h3>
      <Icon :name="icon" class="text-3xl text-black" />
    </div>
    <p class="text-2xl font-bold">{{ text }}</p>
    <p class="text-gray-500">Normaler Bereich: {{ normalRange }}</p>
  </div>
</template>
