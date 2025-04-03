<script lang="ts" setup>
import RoomsService from "~/utils/services/RoomsService";
import Room from "~/models/Room";
import GlobalHelper from "~/utils/helper/GlobalHelper";
import StatisticCardObj from "~/models/StatisticCardObj";
import ChartData from "~/models/ChartData";
import ChartOptions from "~/models/ChartOptions";

const latestFetch = ref(new Date());
const selectedRoom = ref<Room | null>(null);
const rooms = ref<Room[]>([]);
const cards = ref<StatisticCardObj[]>([]);
const charts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const chartTitles = ref([
  "Temperatur in den letzten 24 h",
  "Luftfeuchtigkeit in den letzten 24 h",
  "CO2 Level in den letzten 24 h",
]);

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
  const cardTemperature = GlobalHelper.MapTemperature(
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
  const temperatureData = GlobalHelper.MapChartDataTemperature(
    selectedRoom.value.environmentData.temperature
  );
  const humidityData = GlobalHelper.MapChartDataHumidity(
    selectedRoom.value.environmentData.humidity
  );
  const airQualityData = GlobalHelper.MapChartDataAirQuality(
    selectedRoom.value.environmentData.airQuality
  );

  const chartOptions = new ChartOptions();

  cards.value.push(cardTemperature, cardHumidity, cardAirQuality);
  charts.value.push(
    { data: temperatureData, options: chartOptions },
    { data: humidityData, options: chartOptions },
    { data: airQualityData, options: chartOptions }
  );
});
</script>

<template>
  <RoomSelectorCard
    :latestFetch="latestFetch"
    :selectedRoom="selectedRoom"
    :rooms="rooms"
  />

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
