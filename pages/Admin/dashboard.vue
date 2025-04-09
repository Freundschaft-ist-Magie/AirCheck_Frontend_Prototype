<script setup lang="ts">
import EditRoles from "~/components/editRoles.vue";
import { useRoleStore } from "~/utils/stores/RoleStore";

const roles = ref<
  {
    id: number;
    name: string;
    permissions: string;
  }[]
>([]);

onMounted(async () => {
  roles.value = await useRoleStore().GetAll();
});
</script>

<template>
  <div class="container mx-auto flex flex-col gap-4 p-4">
    <div class="mt-6 border-b border-gray-300 pb-4 mb-4">
      <h1 class="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      <Accordion :multiple="true" :activeIndex="[0]">
        <AccordionPanel value="0">
          <AccordionHeader>Rollen verwalten</AccordionHeader>
          <AccordionContent>
            <edit-roles :roles="roles" />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>Nutzer verwalten</AccordionHeader>
          <AccordionContent>
            <edit-users />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>Räume verwalten</AccordionHeader>
          <AccordionContent>
            <edit-devices />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>
