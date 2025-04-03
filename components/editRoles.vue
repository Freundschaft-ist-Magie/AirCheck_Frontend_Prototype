<script setup lang="ts">
import { useToastStore } from "~/utils/stores/base/ToastStore";

const roles = ref([
  {
    id: 1,
    name: "Administrator",
    users: 12,
    permissions: "Full Access",
  },
  {
    id: 2,
    name: "Users",
    users: 2,
    permissions: "Read Access",
  },
]);

const confirm = useConfirm();
const toastStore = useToastStore();

const rolesEditShowEdit = ref(false);
const rolesEditData = ref({
  name: "",
  permissions: "",
  id: 0,
});

const addRole = (data: Object) => {
  toastStore.setToast("success", "Hinzugefügt", "Eine neue Rolle wurde hinzugefügt");
  roles.value.push({
    name: "Added Role",
    users: 0,
    permissions: "None",
    id: Math.floor(Math.random() * 9999),
  });
};

const prefillEditRole = (data: Object) => {
  rolesEditData.value.name = data.name;
  rolesEditData.value.permissions = data.permissions;
  rolesEditData.value.id = data.id;

  rolesEditShowEdit.value = true;
};

const editRole = () => {
  const updatedRole = rolesEditData.value;
  const index = roles.value.findIndex((role) => role.id === updatedRole.id);
  let severity = "error";

  if (index !== -1) {
    roles.value[index] = { ...roles.value[index], ...updatedRole };
    severity = "success";
  } else {
    severity = "warn";
  }

  toastStore.setToast(
    "success",
    "Erfolgreich",
    "Die Rolle wurde erfolgreich bearbeitet."
  );
  rolesEditShowEdit.value = false;
};

const deleteRole = (data: Object) => {
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
    <Column field="name" header="Rolle"></Column>
    <Column field="users" header="Anz. Benutzer"></Column>
    <Column field="permissions" header="Berechtigungen"></Column>

    <Column>
      <template #body="{ data }">
        <div class="flex items-center justify-end gap-2">
          <Button
            @click="prefillEditRole(data)"
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

  <!--
  <Dialog
    v-model:visible="rolesEditShowEdit"
    modal
    header="Edit Profile"
    :style="{ width: '25rem' }"
  >
    <span class="text-surface-500 dark:text-surface-400 block mb-8"
      >Update your information.</span
    >
    <div class="flex items-center gap-4 mb-4">
      <label for="name" class="font-semibold w-24">Role Name</label>
      <InputText
        id="name"
        class="flex-auto"
        autocomplete="off"
        v-model="rolesEditData.name"
      />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="permissions" class="font-semibold w-24">Permissions</label>
      <InputText
        id="permissions"
        class="flex-auto"
        autocomplete="off"
        v-model="rolesEditData.permissions"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="rolesEditShowEdit = false"
      ></Button>
      <Button type="button" label="Save" @click="editRole()"></Button>
    </div>
  </Dialog>
  -->
</template>

<style scoped></style>
