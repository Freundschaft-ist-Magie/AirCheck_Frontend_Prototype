<script setup lang="ts">

import EditRoles from "~/components/editRoles.vue";

</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <ConfirmDialog></ConfirmDialog>
    <MainLayoutHeader />
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

</template>