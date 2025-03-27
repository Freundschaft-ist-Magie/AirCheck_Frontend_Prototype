<script setup lang="ts">

const roles = ref([{
    "name": "Administrator",
    "users": 12,
    "permissions": "Full Access"
  },
  {
    "name": "Users",
    "users": 2,
    "permissions": "Read Access"
  }
])

const toast = useToast();
const selectRow = (data) => {
  toast.add({ severity: 'info', summary: data.name, detail: data.permissions, life: 3000 });
};

const addRole = (data) => {
  toast.add({ severity: 'success', summary: "Hinzugefügt", detail: "Eine neue Rolle wurde hinzugefügt", life: 3000 });
  roles.value.push({
    name: "Added Role",
    users: 0,
    "permissions": "None"
  })
}

const editRole = (data) => {
  toast.add({ severity: 'warn', summary: "Edited", detail: "Eine Rolle wurde geedited", life: 3000 });
}

const deleteRole = (data) => {
  toast.add({ severity: 'error', summary: "Gelöscht", detail: "Eine wurde gelöscht", life: 3000 });
}


</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <MainLayoutHeader />

    <Accordion value="0">
      <AccordionPanel value="0">
        <AccordionHeader>Manage Roles</AccordionHeader>
        <AccordionContent>
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
                  <Button icon="" @click="editRole(data)" severity="secondary" rounded>
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
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>Manage Users</AccordionHeader>
        <AccordionContent>
          <p class="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader>Manage Devices</AccordionHeader>
        <AccordionContent>
          <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa
            qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>


  </div>
</template>