<script lang="ts" setup>
const popoverPanel = ref();
const isServerOnline = ref(false);

const togglePopover = (event: Event) => {
  popoverPanel.value.toggle(event);
};

const panelLinks = [
  { to: "/", text: "AirCheck Dashboard", icon: "view-dashboard" },
  { to: "/user/settings", text: "Nutzer Einstellungen", icon: "cog" },
  { to: "/admin/dashboard", text: "Admin Dashboard", icon: "lock" },
  { to: "/forecast/dashboard", text: "Prognose Dashboard", icon: "chart-line" },
  { to: "/login", text: "Login", icon: "login" },
];
</script>

<template>
  <div class="bg-gray2 p-4 flex justify-between items-center rounded-md">
    <div class="flex items-center">
      <span class="text-2xl font-bold text-primary2">&#9733; AirCheck Dashboard</span>
    </div>

    <div class="flex items-center gap-4 space-x-2 text-black">
      <div class="flex gap-2 items-center">
        <svg
          :class="isServerOnline ? 'text-green-500' : 'text-red-500'"
          class="w-3 h-3"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8" r="8" />
        </svg>
        <span>Server {{ isServerOnline ? "Online" : "Offline" }}</span>
      </div>

      <div class="flex gap-2 items-center">
        <Button
          icon="pi pi-ellipsis-v"
          severity="secondary"
          rounded
          @click="togglePopover"
          aria-haspopup="true"
          aria-controls="popoverPanel"
        />

        <OverlayPanel ref="popoverPanel" id="popoverPanel">
          <div class="flex flex-col gap-2 p-2">
            <NuxtLink
              v-for="panelLink in panelLinks"
              :to="panelLink.to"
              class="flex items-center gap-2 text-left hover:bg-gray1/60 px-4 py-2 rounded-md"
            >
              <Icon :name="`mdi-light:${panelLink.icon}`" class="w-5 h-5" />
              <span>{{ panelLink.text }}</span>
            </NuxtLink>
          </div>
        </OverlayPanel>
      </div>
    </div>
  </div>
</template>
