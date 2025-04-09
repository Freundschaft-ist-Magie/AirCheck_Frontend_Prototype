<script setup lang="ts">
import { useDialog } from "#imports";
import { useToastStore } from "~/utils/stores/base/ToastStore";
import { useRoleStore } from "~/utils/stores/RoleStore";
import EditRole from "./Modal/EditRole.vue";

defineProps<{
  roles: {
    id: number;
    name: string;
    permissions: string;
  }[];
}>();

const toastStore = useToastStore();
const dialog = useDialog();

// ignore
/* const confirm = useConfirm(); */

const addRole = () => {
  editRole({
    id: 0, // id 0 will trigger 'create' inside UpdateRole
    name: "",
    permissions: "",
  });
};

function editRole(role: { id: number; name: string; permissions: string }) {
  dialog.open(EditRole, {
    props: {
      header: `${role.name} bearbeiten`,
      style: { width: "50vw" },
      modal: true,
    },
    data: {
      role: role,
    },
    onClose: (options) => {
      const result = options?.data;
      if (result) {
        useRoleStore().UpdateRole(result);
      } else {
        console.log("Abgebrochen oder geschlossen");
      }
    },
  });
}

// ignore
const deleteRole = (data: Object) => {
  /*
  confirm.require({
    message: 'Do you want to delete the "' + data.name + '" role?',
    header: "Danger Zone",
    icon: "pi pi-info-circle",
    rejectLabel: "Cancel",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      toastStore.setToast(
        "success",
        "Erfolgreich",
        "Die Rolle wurde erfolgreich gelöscht."
      );

      const index = roles.value.findIndex((role) => role.name === data.name);
      if (index !== -1) {
        roles.value.splice(index, 1);
      }
    },
    reject: () => {
      toastStore.setToast("warn", "Abgebrochen", "Die Aktion wurde abgebrochen.");
    },
  });
  */
};
</script>

<template>
  <DataTable :value="roles" tableStyle="min-width: 50rem">
    <template #header>
      <div class="flex justify-end">
        <Button text icon="" @click="addRole" rounded>
          <Icon class="text-2xl" name="mdi:plus" />
        </Button>
      </div>
    </template>
    <Column field="id" header="ID"></Column>
    <Column field="name" header="Rolle"></Column>
    <!--
    <Column field="users" header="Anz. Benutzer"></Column>
    -->
    <Column field="permissions" header="Berechtigungen"></Column>

    <Column>
      <template #body="{ data }">
        <div class="flex items-center justify-end gap-2">
          <Button
            @click="editRole(data)"
            severity="info"
            rounded
            class="bg-primary1! hover:bg-primary2/80! active:bg-primary2!"
          >
            <Icon name="mdi:pencil" />
          </Button>
          <Button @click="deleteRole(data)" severity="danger" rounded>
            <Icon name="mdi:delete" />
          </Button>
        </div>
      </template>
    </Column>
  </DataTable>
</template>
