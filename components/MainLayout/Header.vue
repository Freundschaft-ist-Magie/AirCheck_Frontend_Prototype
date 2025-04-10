<script lang="ts" setup>
import { useAuthStore } from "~/utils/stores/base/AuthStore";

const authStore = useAuthStore();
const navLinksPanel = ref();
const notifPanel = ref();
const isServerOnline = ref(false);
const userData = ref({
  // this will contain the current user's data
  name: "Max Mustermann",
  image: "https://avatars.githubusercontent.com/u/143788063?s=200&v=4",
});

const toggleNavLinksPanel = (event: Event) => {
  navLinksPanel.value.toggle(event);
};

const toggleNotifPanel = (event: Event) => {
  notifPanel.value.toggle(event);
};

const panelLinks = computed(() => {
  const links = [
    { to: "/", text: "AirCheck Dashboard", icon: "view-dashboard" },
    { to: "/forecast/dashboard", text: "Prognose Dashboard", icon: "chart-line" },
    { to: "/user/settings", text: "Nutzer Einstellungen", icon: "cog" },
  ];

  // Only show admin dashboard link if user has admin role
  if (authStore.role === "admin") {
    links.push({ to: "/admin/dashboard", text: "Admin Dashboard", icon: "lock" });
  }

  links.push({ to: "/logout", text: "Logout", icon: "logout" });

  return links;
});
</script>

<template>
  <div class="bg-gray2 p-4 flex justify-between items-center rounded-md">
    <div class="flex justify-center items-center gap-4">
      <Icon name="mdi:air-conditioner" class="text-3xl text-primary2" />
      <span class="text-2xl font-bold text-primary2"> AirCheck Dashboard </span>
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
          icon="pi pi-bell"
          severity="secondary"
          class="bg-transparent! border-0! rounded-full!"
          @click="toggleNotifPanel"
          aria-haspopup="true"
          aria-controls="notifPanel"
        />
        <Button
          severity="secondary"
          class="p-0 bg-transparent! border-0!"
          @click="toggleNavLinksPanel"
          aria-haspopup="true"
          aria-controls="navLinksPanel"
        >
          <img
            class="w-10 h-10 rounded-full"
            :src="userData.image"
            :alt="userData.name"
          />
          <p>{{ userData.name }}</p>
          <i class="pi pi-chevron-down text-sm" />
        </Button>

        <OverlayPanel ref="notifPanel" id="notifPanel">
          <div class="flex flex-col gap-2 p-2">
            <span>NOT IMPLEMENTED.</span>
          </div>
        </OverlayPanel>

        <OverlayPanel ref="navLinksPanel" id="navLinksPanel">
          <div class="flex flex-col gap-2 p-2">
            <NuxtLink
              v-for="link in panelLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-2 text-left hover:bg-gray1/60 px-4 py-2 rounded-md"
            >
              <Icon :name="`mdi-light:${link.icon}`" class="w-5 h-5" />
              <span>{{ link.text }}</span>
            </NuxtLink>
          </div>
        </OverlayPanel>
      </div>
    </div>
  </div>
</template>
