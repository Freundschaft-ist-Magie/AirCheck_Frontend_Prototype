<script setup lang="ts">
import EditRoles from "~/components/editRoles.vue";

const isModalOpen = ref(true);
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<template>
  <div class="w-1/2 mx-auto flex flex-col gap-4">
    <div class="mt-6 border-b border-gray2 my-4">
      <Modal
        :title="'Edit'"
        :visible="isModalOpen"
        @cancel="closeModal"
        @save="closeModal"
      >
        <span class="text-surface-500 dark:text-surface-400 block mb-8"
          >Update your information.</span
        >
        <div class="flex items-center gap-4 mb-4">
          <label for="username" class="font-semibold w-24">Username</label>
          <InputText id="username" class="flex-auto" autocomplete="off" />
        </div>
        <div class="flex items-center gap-4 mb-8">
          <label for="email" class="font-semibold w-24">Email</label>
          <InputText id="email" class="flex-auto" autocomplete="off" />
        </div>
      </Modal>

      <Accordion value="0">
        <AccordionPanel value="0">
          <AccordionHeader>Manage Roles</AccordionHeader>
          <AccordionContent>
            <edit-roles />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="1">
          <AccordionHeader>Manage Users</AccordionHeader>
          <AccordionContent>
            <edit-users />
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel value="2">
          <AccordionHeader>Manage Devices</AccordionHeader>
          <AccordionContent>
            <edit-devices />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>
