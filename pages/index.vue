<script lang="ts" setup>
const latestFetch = ref(new Date());
const statusMapping = [
  { status: "Alles ok", codes: [200, 201, 204] },
  { status: "Fast ok", codes: [400, 401, 403, 404] },
  { status: "Alles schlecht", codes: [500, 502, 503] },
];

const selectedRoom = ref();
const rooms = ref([
  {
    id: 1,
    name: "Room 1",
    humidity: 0,
    client: {
      id: 1,
      name: "string",
    },
    clientId: 0,
  },
  {
    id: 2,
    name: "Room 2",
    humidity: 0,
    client: {
      id: 2,
      name: "string",
    },
    clientId: 0,
  },
]);

function formatDate(date: Date) {
  // Should be Jan 15, 2025 15:30
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

const cards = ref([
  {
    title: "Temperatur",
    text: "20 °C",
    icon: "mdi:thermometer-low",
    normalRange: "20 - 25 °C",
  },
  {
    title: "Luftfeuchtigkeit",
    text: "45 %",
    icon: "mdi:weather-rainy",
    normalRange: "30 - 60 %",
  },
  {
    title: "CO2 Level",
    text: "660 ppm",
    icon: "mdi:molecule-co2",
    normalRange: "< 2000 ppm",
  },
]);
</script>

<template>
  <div class="mt-4 p-4 bg-white shadow-md rounded-md flex justify-between items-center">
    <div>
      <room-selector
        :options="rooms"
        :placeholder="'Hallo :D'"
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
