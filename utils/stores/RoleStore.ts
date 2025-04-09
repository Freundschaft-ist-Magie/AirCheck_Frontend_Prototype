import { defineStore } from 'pinia';
import { useToastStore } from './base/ToastStore';

export const useRoleStore = defineStore("role", () => {
  const roles = ref([
    {
      id: 1,
      name: "Benutzer",
      permissions: "Lesen"
    },
    {
      id: 2,
      name: "Admin",
      permissions: "Administrator"
    }
  ])
  const Roles = computed(() => roles);

  async function GetAll() {
    return roles.value;
  }

  async function UpdateRole(role: { id: number; name: string; permissions: string }) {
    const index = roles.value.findIndex(r => r.id === role.id);

    if (index !== -1) {
      roles.value[index] = { ...roles.value[index], ...role };
      useToastStore().setToast(
        "success",
        "Aktualisiert",
        "Rolle erfolgreich aktualisiert."
      );
      return roles.value[index];
    } else {
      console.error("Was not able to update Role with ID:", role.id);
      useToastStore().setToast(
        "danger",
        "Fehler",
        "Rolle konnte nicht aktualisiert werden."
      );
      return null;
    }
  }

  return { Roles, GetAll, UpdateRole };
});