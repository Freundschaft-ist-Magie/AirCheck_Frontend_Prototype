<script lang="ts" setup>
import { onMounted, ref } from "vue";
import RoomsService from "~/utils/services/RoomsService";
import Room from "~/models/Room";
import GlobalHelper from "~/utils/helper/GlobalHelper";
import StatisticCardObj from "~/models/StatisticCardObj";

const latestFetch = ref(new Date());
const statusMapping = [
  { status: "Alles ok", codes: [200, 201, 204] },
  { status: "Fast ok", codes: [400, 401, 403, 404] },
  { status: "Alles schlecht", codes: [500, 502, 503] },
];

const selectedRoom = ref<Room | null>(null);
const rooms = ref<Room[]>([]);

const chartData = ref({
  labels: ["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  datasets: [
    {
      label: "Temperatur",
      data: [20, 21, 22, 23, 24, 25, 26],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
});

const chartOptions = ref({
  scales: {
    y: {
      beginAtZero: true,
    },
  },
});

const cards = ref<StatisticCardObj[]>([]);

function formatDate(date: Date) {
  return date.toLocaleString("de-CH", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateStatusText(statusCode: number) {
  const status = statusMapping.find((status) => status.codes.includes(statusCode));
  return status ? status.status : "unknown";
}

async function fetchRooms() {
  const roomsService = new RoomsService();
  const fetchedRooms = await roomsService.Get();

  // Update rooms with fetched data
  rooms.value = fetchedRooms.map((room: any) => {
    return new Room(room.id, room.name, room.description, {
      temperature: room.environmentData.temperature,
      humidity: room.environmentData.humidity,
      airQuality: room.environmentData.airQuality,
    });
  });

  selectedRoom.value = rooms.value[0];
}

function setStatisticCards() {
  if (!selectedRoom.value) {
    throw new Error("When Cards are to be set, there must be a room selected!");
  }

  const cardThemperature = GlobalHelper.MapThemperature(
    selectedRoom.value.environmentData.temperature[
      selectedRoom.value.environmentData.temperature.length - 1
    ].value
  );
  const cardHumidity = GlobalHelper.MapHumidity(
    selectedRoom.value.environmentData.humidity[
      selectedRoom.value.environmentData.humidity.length - 1
    ].value
  );
  const cardairQuality = GlobalHelper.MapairQuality(
    selectedRoom.value.environmentData.airQuality[
      selectedRoom.value.environmentData.airQuality.length - 1
    ].value
  );

  cards.value.push(cardThemperature, cardHumidity, cardairQuality);
}

onMounted(async () => {
  await fetchRooms();
  setStatisticCards();
});
</script>

<template>
  <div class="mt-4 p-4 bg-white shadow-md rounded-md flex justify-between items-center">
    <div>
      <room-selector
        :options="rooms"
        :placeholder="'Raum auswählen'"
        :filter-field="'name'"
        :selected="selectedRoom"
      />
      <p class="text-gray-500">Zuletzt Aktualisiert: {{ formatDate(latestFetch) }}</p>
    </div>

    <div class="flex gap-2 items-center">
      <Icon name="mdi-light:information" style="color: black" />
      <p class="text-gray-500">{{ generateStatusText(200) }}</p>
    </div>
  </div>

  <div class="mt-4 grid grid-cols-3 gap-4">
    <statisticCard
      v-for="card in cards"
      :key="card.title"
      :title="card.title"
      :text="card.text"
      :icon="card.icon"
      :normalRange="card.normalRange"
    />
  </div>

  <div class="mt-4 grid grid-cols-3 gap-4">
    <diagram
      :title="'Temperatur in den letzten 24 h'"
      :chart-data="chartData"
      :options="chartOptions"
    />
    <diagram
      :title="'Luftfeuchtigkeit in den letzten 24 h'"
      :chart-data="chartData"
      :options="chartOptions"
    />
    <diagram
      :title="'CO2 Level in den letzten 24 h'"
      :chart-data="chartData"
      :options="chartOptions"
    />
  </div>
</template>
