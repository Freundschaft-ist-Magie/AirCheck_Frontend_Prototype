<script lang="ts" setup>
const popoverPanel = ref();
const isServerOnline = ref(false);

const togglePopover = (event: Event) => {
  popoverPanel.value.toggle(event);
};
</script>

<template>
  <div class="bg-gray2 p-4 flex justify-between items-center rounded-md">
    <div class="flex items-center">
      <span class="text-2xl font-bold text-primary1">&#9733; AirCheck Dashboard</span>
    </div>

    <div class="flex items-center gap-4 space-x-2 text-black">
      <div class="flex gap-2 items-center">
        <svg :class="isServerOnline ? 'text-green-500' : 'text-red-500'" class="w-3 h-3" viewBox="0 0 16 16"
          fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="8" />
        </svg>
        <span>Server {{ isServerOnline ? "Online" : "Offline" }}</span>
      </div>
      <div class="flex gap-2 items-center">
        <Button icon="pi pi-ellipsis-v" severity="secondary" rounded @click="togglePopover" aria-haspopup="true"
          aria-controls="popoverPanel" />

        <OverlayPanel ref="popoverPanel" id="popoverPanel">
          <div class="flex flex-col gap-2 p-2">
            <NuxtLink to="/user/settings" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
              Nutzer Einstellungen
            </NuxtLink>
            <NuxtLink to="/admin/dashboard" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
              Admin Dashboard
            </NuxtLink>
            <NuxtLink to="/forecast/dashboard" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
              Prognose Dashboard
            </NuxtLink>
            <NuxtLink to="/login" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
              Login
            </NuxtLink>
          </div>
        </OverlayPanel>
      </div>

    </div>
  </div>
</template>