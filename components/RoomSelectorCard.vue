<script lang="ts" setup>
import Room from "~/models/Room";

defineProps<{
  latestFetch: Date;
  selectedRoom: Room | null;
  rooms: Room[];
}>();

function formatDate(date: Date) {
  return date.toLocaleString("de-CH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
</script>

<template>
  <div class="mt-4 p-4 bg-white shadow-md rounded-md flex justify-between items-center">
    <div>
      <room-selector
        :options="rooms"
        :placeholder="'Raum auswählen'"
        :filter-field="'name'"
        :selected="selectedRoom"
      />
      <p class="text-gray-500">Zuletzt Aktualisiert: {{ formatDate(latestFetch) }}</p>
    </div>
  </div>
</template>
