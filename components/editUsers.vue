<script setup lang="ts">

const users = ref([{
    "id": 1,
    "name": "User 1",
    "email": "user1@example.com",
    "roles": []
  },
  {
    "id": 2,
    "name": "User 2",
    "email": "user2@example.com",
    "roles": []
  }
])

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

const showEdit = ref(false)
const editData = ref({
  id: 0,
  name: "",
  email: "",
  roles: [],
})

const selectRow = (data: Object) => {
  toast.add({ severity: 'info', summary: data.name, detail: data.email, life: 3000 });
};

const addEntry = (data: Object) => {
  toast.add({ severity: 'success', summary: "Hinzugefügt", detail: "Eine neue Rolle wurde hinzugefügt", life: 3000 });
  users.value.push({
    name: "Added Role",
    email: "mail@example.com",
    roles: [],
    id: Math.floor(Math.random() * 9999)
  })
}

const prefill = (data: Object) => {
  editData.value.name = data.name
  editData.value.email = data.email
  editData.value.roles = data.roles
  editData.value.id = data.id

  showEdit.value = true

}

const editEntry = () => {
  const updatedUser = editData.value
  const index = users.value.findIndex(user => user.id === updatedUser.id)

  if (index !== -1) {
    users.value[index] = { ...users.value[index], ...updatedUser }
    toast.add({ severity: 'success', summary: "Edited", detail: "Die Rolle wurde geändert.", life: 3000 })
  } else {
    toast.add({ severity: 'warn', summary: "Edited", detail: "Die Rolle konnte nicht gefunden werden.", life: 3000 })
  }

  showEdit.value = false
}


const deleteEntry = (data: Object) => {
  confirm.require({
    message: 'Do you want to delete "' + data.name + '" ?',
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

      const index = users.value.findIndex(user => user.id === data.id)
      if (index !== -1) {
        users.value.splice(index, 1)
      }

    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
}
</script>

<template>
  <DataTable :value="users" tableStyle="min-width: 50rem">
    <template #header>
              <span class="flex justify-end">
                  <Button text icon="" @click="addEntry" rounded>
                    <Icon class="text-2xl" name="mdi-light:plus" />
                  </Button>
              </span>
    </template>
    <Column field="name" header="User Name"></Column>
    <Column field="email" header="Email"></Column>
    <Column header="Roles">
      <template #body="{ data }">
        <div v-if="data.roles && data.roles.length > 0">
      <span v-for="(role, index) in data.roles" :key="role.id">
        {{ role.name }}<span v-if="index < data.roles.length - 1">, </span>
      </span>
        </div>
        <div v-else>
          <span class="text-surface-500 italic">Keine Rolle</span>
        </div>
      </template>
    </Column>
    <Column class="w-24 !text-end">
      <template #body="{ data }">
        <div class="flex items-center justify-between gap-2">
          <Button icon="" @click="prefill(data)" severity="secondary" rounded>
            <Icon name="mdi-light:pencil" />
          </Button>
          <Button icon="" @click="deleteEntry(data)" severity="danger" rounded>
            <Icon name="mdi-light:delete" />
          </Button>
        </div>
      </template>
    </Column>
  </DataTable>
  <Toast />

  <Dialog v-model:visible="showEdit" modal header="Edit Profile" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span>
    <div class="flex items-center gap-4 mb-4">
      <label for="name" class="font-semibold w-24">User Name</label>
      <InputText id="name" class="flex-auto" autocomplete="off" v-model="editData.name"  />
    </div>
    <div class="flex items-center gap-4 mb-4">
      <label for="email" class="font-semibold w-24">Email</label>
      <InputText id="email" class="flex-auto" autocomplete="off" v-model="editData.email" />
    </div>
    <div class="flex items-center gap-4 mb-12">
      <label for="roles" class="font-semibold w-24">Roles</label>
      <MultiSelect id="roles" v-model="editData.roles" display="chip" :options="roles" optionLabel="name" filter placeholder="Select Roles"
                   :maxSelectedLabels="3" class="w-62" />
    </div>
    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="showEdit = false"></Button>
      <Button type="button" label="Save" @click="editEntry()"></Button>
    </div>
  </Dialog>
</template>

<style scoped>

</style>