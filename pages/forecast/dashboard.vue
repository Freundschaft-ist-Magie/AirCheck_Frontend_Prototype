<script lang="ts" setup>
import RoomsService from "~/utils/services/RoomsService";
import GlobalHelper from "~/utils/helper/GlobalHelper";
import type ChartData from "~/models/ChartData";
import ChartOptions from "~/models/ChartOptions";
import Room from "~/models/Room";

const latestFetch = ref(new Date());
const selectedRoom = ref<Room | null>(null);
const rooms = ref<Room[]>([]);
const selectedMetric = ref("Temperatur");
const charts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const metrics = [
  { label: "Temperatur", value: "Temperatur" },
  { label: "Luftfeuchtigkeit", value: "Luftfeuchtigkeit" },
  { label: "CO2 Level", value: "CO2 Level" },
];

// Add computed property to get the current chart based on selected metric
const currentChart = computed(() => {
  if (!selectedMetric.value || charts.value.length === 0) return null;

  if (selectedMetric.value === "Temperatur") {
    return charts.value[0];
  } else if (selectedMetric.value === "Luftfeuchtigkeit") {
    return charts.value[1];
  } else if (selectedMetric.value === "CO2 Level") {
    return charts.value[2];
  }

  return null;
});

const changeMetric = (metric: string) => {
  selectedMetric.value = metric;
};

onMounted(async () => {
  const roomsService = new RoomsService();
  const fetchedRooms = await roomsService.Get();
  const forecasts = await roomsService.GetForecasts();

  // Update rooms with fetched data
  rooms.value = fetchedRooms.map((room: any) => {
    return new Room(room.id, room.name, room.description, {
      temperature: room.environmentData.temperature,
      humidity: room.environmentData.humidity,
      airQuality: room.environmentData.airQuality,
    });
  });

  selectedRoom.value = rooms.value[0];

  // Find the forecast for the selected room
  const roomForecast = forecasts.find((f) => f.id === selectedRoom.value?.id);

  if (!roomForecast) {
    console.error(`No forecast found for room with ID ${selectedRoom.value.id}`);
    return;
  }

  // Create combined charts for temperature, humidity, and air quality
  const temperatureCombinedData = GlobalHelper.MapCombinedChartData(
    selectedRoom.value.environmentData.temperature,
    roomForecast.environmentData.temperature || [], // Handle possible undefined with empty array fallback
    "temperature"
  );

  const humidityCombinedData = GlobalHelper.MapCombinedChartData(
    selectedRoom.value.environmentData.humidity,
    roomForecast.environmentData.humidity || [], // Handle possible undefined with empty array fallback
    "humidity"
  );

  const airQualityCombinedData = GlobalHelper.MapCombinedChartData(
    selectedRoom.value.environmentData.airQuality,
    roomForecast.environmentData.airQuality || [], // Handle possible undefined with empty array fallback
    "airQuality"
  );

  const chartOptions = new ChartOptions();

  charts.value = [
    { data: temperatureCombinedData, options: chartOptions },
    { data: humidityCombinedData, options: chartOptions },
    { data: airQualityCombinedData, options: chartOptions },
  ];
});
</script>

<template>
  <div class="flex flex-col gap-8">
    <RoomSelectorCard
      :latestFetch="latestFetch"
      :selectedRoom="selectedRoom"
      :rooms="rooms"
    />

    <div class="flex justify-center mb-4">
      <ButtonGroup>
        <Button
          v-for="metric in metrics"
          :key="metric.value"
          :label="metric.label"
          :severity="selectedMetric === metric.value ? 'primary' : 'info'"
          class="px-4 py-2 text-gray-700"
          @click="changeMetric(metric.value)"
        />
      </ButtonGroup>
    </div>

    <div class="flex justify-center">
      <div class="w-3/4 bg-gray-300 p-6 rounded-lg shadow-md">
        <div v-if="currentChart">
          <StatisticDiagram
            :title="selectedMetric"
            :chartData="currentChart.data"
            :chartOptions="currentChart.options"
          />
        </div>
        <div v-else class="flex items-center justify-center h-40">
          <span class="text-gray-700">Chart wird geladen...</span>
        </div>
      </div>
    </div>
  </div>
</template>
