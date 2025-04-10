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

  async function Create(role: { id: number; name: string; permissions: string }) {
    try {
      role.id = roles.value.length + 1;
      roles.value.push(role);

      useToastStore().setToast(
        "success",
        "Hinzugefügt",
        "Rolle erfolgreich hinzugefügt."
      );
    } catch (e) {
      console.error("Error, during creating a new Role");

      useToastStore().setToast(
        "danger",
        "Fehler",
        "Rolle konnte nicht hinzugefügt werden."
      );
    }
  }

  async function UpdateRole(role: { id: number; name: string; permissions: string }) {
    const index = roles.value.findIndex(r => r.id === role.id);

    // edit endpoint can be used to create
    if (role.id === 0) {
      await Create(role);
      return
    }

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

  async function Delete(role: { id: number; name: string; permissions: string }) {
    const index = roles.value.findIndex(r => r.id === role.id);

    if (index !== -1) {
      const removed = roles.value.splice(index, 1)[0];

      useToastStore().setToast(
        "success",
        "Entfernt",
        "Rolle erfolgreich entfernt."
      );

      return removed;
    } else {
      console.error("Not found Role with ID:", role.id);

      useToastStore().setToast(
        "danger",
        "Fehler",
        "Rolle konnte nicht gelöscht werden."
      );

      return null;
    }
  }

  return { Roles, GetAll, Create, UpdateRole, Delete };
});