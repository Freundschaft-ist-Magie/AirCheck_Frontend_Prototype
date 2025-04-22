<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps({
  roomData: Array, // Dein komplettes Daten-Array (Index = roomId)
});

// Daten vorbereiten, um jedem Eintrag die roomId hinzuzufügen:
const preparedData = computed(() => {
  return props.roomData
      .map((roomEntries, roomId) => {
        if (!roomEntries) return []; // Falls z.B. [0] null ist
        return roomEntries.map((entry, index) => ({
          id: index + 1,
          roomId,
          ...entry,
        }));
      })
      .filter((room) => room.length > 0); // Leere rausfiltern
});
</script>

<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>Raumtabellen</AccordionHeader>
      <AccordionContent>
        <!-- Loop über alle Räume -->
        <div v-for="(roomEntries, index) in preparedData" :key="index" style="margin-bottom: 2rem;">
          <h3>Raum {{ roomEntries[0].roomId }}</h3>
          <DataTable
              :value="roomEntries"
              tableStyle="min-width: 50rem"
              paginator
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20, 50]"
          >
            <Column field="id" header="Id"></Column>
            <Column field="humidity" header="Feuchtigkeit"></Column>
            <Column field="temperature" header="Temperatur"></Column>
            <Column field="pressure" header="Druck"></Column>
            <Column field="airQuality" header="Luftqualität"></Column>
            <Column field="timeStamp" header="Zeitstempel"></Column>
            <Column field="roomId" header="Raum Id"></Column>
          </DataTable>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
