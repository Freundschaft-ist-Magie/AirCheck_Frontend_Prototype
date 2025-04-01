<script lang="ts" setup>
import { onMounted, ref } from "vue";
import RoomsService from "~/utils/services/RoomsService";
import Room from "~/models/Room";
import GlobalHelper from "~/utils/helper/GlobalHelper";
import StatisticCardObj from "~/models/StatisticCardObj";
import ChartData from "~/models/ChartData";
import ChartOptions from "~/models/ChartOptions";

const latestFetch = ref(new Date());
const statusMapping = [
  { status: "Alles ok", codes: [200, 201, 204] },
  { status: "Fast ok", codes: [400, 401, 403, 404] },
  { status: "Alles schlecht", codes: [500, 502, 503] },
];

const selectedRoom = ref<Room>();
const rooms = ref<Room[]>([]);
const cards = ref<StatisticCardObj[]>([]);
const charts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const chartTitles = ref([
  "Temperatur in den letzten 24 h",
  "Luftfeuchtigkeit in den letzten 24 h",
  "CO2 Level in den letzten 24 h",
]);

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

onMounted(async () => {
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

  // set cards
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
  const cardAirQuality = GlobalHelper.MapAirQuality(
    selectedRoom.value.environmentData.airQuality[
      selectedRoom.value.environmentData.airQuality.length - 1
    ].value
  );

  // set diagram data
  const temperatureData = GlobalHelper.MapChartData(
    selectedRoom.value.environmentData.temperature
  );
  const humidityData = GlobalHelper.MapChartData(
    selectedRoom.value.environmentData.humidity
  );
  const airQualityData = GlobalHelper.MapChartData(
    selectedRoom.value.environmentData.airQuality
  );

  const chartOptions = new ChartOptions();

  cards.value.push(cardThemperature, cardHumidity, cardAirQuality);
  charts.value.push(
    { data: temperatureData, options: chartOptions },
    { data: humidityData, options: chartOptions },
    { data: airQualityData, options: chartOptions }
  );
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
    <StatisticCard
      v-for="card in cards"
      :key="card.title"
      :title="card.title"
      :text="card.text"
      :icon="card.icon"
      :normalRange="card.normalRange"
    />
  </div>

  <div class="mt-4 grid grid-cols-3 gap-4">
    <StatisticDiagram
      v-for="(chart, index) in charts"
      :key="index"
      :title="chartTitles[index]"
      :chartData="chart.data"
      :chartOptions="chart.options"
    />
  </div>
</template>
