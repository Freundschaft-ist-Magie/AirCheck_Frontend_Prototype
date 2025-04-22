<script lang="ts" setup>
import { ref, computed } from "vue";

const props = defineProps({
  roomData: Array, // Das komplette Array (mit den Subarrays pro Raum)
  selectedRoomId: Number,
});

// Hier kannst du das gewünschte Room-Id setzen:
const selectedRoomId = ref(props.selectedRoomId); // z.B. 1, 2, 3 ...

// Die Daten für das gewählte Room-Id herausfiltern:
const filteredRoomData = computed(() => {
  const data = props.roomData[selectedRoomId.value];
  if (!data) return [];
  // Optional: Id hinzufügen, wenn gewünscht
  return data.map((entry, index) => ({
    id: index + 1,
    ...entry,
    roomId: selectedRoomId.value,
  }));
});
</script>

<template>
  <Accordion value="0">
    <AccordionPanel value="0">
      <AccordionHeader>Raumtabelle für Raum {{ selectedRoomId }}</AccordionHeader>
      <AccordionContent>
        <DataTable
            :value="filteredRoomData"
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

        <!-- Dropdown zum Wechseln des Raums -->
        <div style="margin-top: 1rem;">
          <label for="room-select">Raum auswählen:</label>
          <select id="room-select" v-model="selectedRoomId">
            <option v-for="(data, index) in props.roomData" :key="index" :value="index">
              Raum {{ index }}
            </option>
          </select>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
