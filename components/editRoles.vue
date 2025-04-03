<script setup lang="ts">

const roles = ref([{
  "id": 1,
  "name": "Administrator",
  "users": 12,
  "permissions": "Full Access"
},
  {
    "id": 2,
    "name": "Users",
    "users": 2,
    "permissions": "Read Access"
  }
])

const confirm = useConfirm();
const toast = useToast();

const rolesEditShowEdit = ref(false)
const rolesEditData = ref({
  name: "",
  permissions: "",
  id: 0,
})

const selectRow = (data: Object) => {
  toast.add({ severity: 'info', summary: data.name, detail: data.permissions, life: 3000 });
};

const addRole = (data: Object) => {
  toast.add({ severity: 'success', summary: "Hinzugefügt", detail: "Eine neue Rolle wurde hinzugefügt", life: 3000 });
  roles.value.push({
    name: "Added Role",
    users: 0,
    "permissions": "None",
    id: Math.floor(Math.random() * 9999)
  })
}

const prefillEditRole = (data: Object) => {
  rolesEditData.value.name = data.name
  rolesEditData.value.permissions = data.permissions
  rolesEditData.value.id = data.id

  rolesEditShowEdit.value = true

}

const editRole = () => {
  const updatedRole = rolesEditData.value
  const index = roles.value.findIndex(role => role.id === updatedRole.id)

  if (index !== -1) {
    roles.value[index] = { ...roles.value[index], ...updatedRole }
    toast.add({ severity: 'success', summary: "Edited", detail: "Die Rolle wurde geändert.", life: 3000 })
  } else {
    toast.add({ severity: 'warn', summary: "Edited", detail: "Die Rolle konnte nicht gefunden werden.", life: 3000 })
  }

  rolesEditShowEdit.value = false
}


const deleteRole = (data: Object) => {
  confirm.require({
    message: 'Do you want to delete the "' + data.name + '" role?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });

      const index = roles.value.findIndex(role => role.name === data.name)
      if (index !== -1) {
        roles.value.splice(index, 1)
      }

    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
}
</script>

<template>
  <DataTable :value="roles" tableStyle="min-width: 50rem">
    <template #header>
              <span class="flex justify-end">
                  <Button text icon="" @click="addRole" rounded>
                    <Icon class="text-2xl" name="mdi-light:plus" />
                  </Button>
              </span>
    </template>
    <Column field="name" header="Role Name"></Column>
    <Column field="users" header="Users"></Column>
    <Column field="permissions" header="Permissions"></Column>
    <Column class="w-24 !text-end">
      <template #body="{ data }">
        <div class="flex items-center justify-between gap-2">
          <Button icon="" @click="prefillEditRole(data)" severity="secondary" rounded>
            <Icon name="mdi-light:pencil" />
          </Button>
          <Button icon="" @click="deleteRole(data)" severity="danger" rounded>
            <Icon name="mdi-light:delete" />
          </Button>
        </div>
      </template>
    </Column>
  </DataTable>
  <Toast />

  <Dialog v-model:visible="rolesEditShowEdit" modal header="Edit Profile" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
    <div class="flex items-center gap-4 mb-4">
      <label for="name" class="font-semibold w-24">Role Name</label>
      <InputText id="name" class="flex-auto" autocomplete="off" v-model="rolesEditData.name"  />
    </div>
    <div class="flex items-center gap-4 mb-8">
      <label for="permissions" class="font-semibold w-24">Permissions</label>
      <InputText id="permissions" class="flex-auto" autocomplete="off" v-model="rolesEditData.permissions" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="rolesEditShowEdit = false"></Button>
      <Button type="button" label="Save" @click="editRole()"></Button>
    </div>
  </Dialog>
</template>

<style scoped>

</style>