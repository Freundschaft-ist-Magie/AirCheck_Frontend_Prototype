<script lang="ts" setup>
import Room from "~/models/Room";

const props = defineProps({
  roomData: Array<Room>,
});
</script>

<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>Raumtabelle</AccordionHeader>
      <AccordionContent>
        <DataTable
          :value="roomData"
          tableStyle="min-width: 50rem"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20, 50]"
        >
          <Column field="id" header="Id"></Column>
          <Column field="humidity" header="Feuchtigkeit"></Column>
          <Column field="temperature" header="Temperatur"></Column>
          <Column field="roomId" header="Raum Id"></Column>
        </DataTable>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
