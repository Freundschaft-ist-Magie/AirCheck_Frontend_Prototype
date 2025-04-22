<script lang="ts" setup>
import { useLoadingStore } from "@/utils/stores/base/LoadingStore";
import { useRoomsStore } from "~/utils/stores/RoomsStore";
import RoomsService from "~/utils/services/RoomsService";
import Room from "~/models/Room";
import GlobalHelper from "~/utils/helper/GlobalHelper";
import StatisticCardObj from "~/models/StatisticCardObj";
import ChartData from "~/models/ChartData";
import ChartOptions from "~/models/ChartOptions";

const loadingStore = useLoadingStore();
const roomsStore = useRoomsStore();

const latestFetch = ref(new Date());
const selectedRoom = ref<Room | null>(null);
const rooms = ref<Room[]>([]);
const roomsHistory = ref<{ timeStamp: string; temperature: number }[]>([]);
const cards = ref<StatisticCardObj[]>([]);
const charts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const historyCharts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const chartTitles = ref([
  "Temperatur in den letzten 24 h",
  "Luftfeuchtigkeit in den letzten 24 h",
  "CO₂ Level in den letzten 24 h",
]);
const monthChartTitles = ref([
  "Temperatur in den letzten 30 Tagen",
  "Luftfeuchtigkeit in den letzten 30 Tagen",
  "CO₂ Level in den letzten 30 Tagen",
]);
const tabs = ref([
  {
    title: "Temperatur",
    value: "0",
    dayChart: 0,
    monthChart: 0,
  },
  {
    title: "Luftfeuchtigkeit",
    value: "1",
    dayChart: 1,
    monthChart: 1,
  },
  {
    title: "CO₂ Level",
    value: "2",
    dayChart: 2,
    monthChart: 2,
  },
]);

loadingStore.setLoading(true);

onMounted(async () => {
  loadingStore.setLoading(true);

  const webSocket = new WebSocket(
    `ws://${import.meta.env.VITE_API_URL}/api/roomDatas/ws`
  );
  webSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    latestFetch.value = new Date();

    // the api gives multiple data from room, first we need to sort the data by roomId
    rooms.value = data.reduce((acc: Room[], roomData: Room) => {
      const existingRoom = acc.find((room) => room.id === roomData.id);
      if (existingRoom) {
        existingRoom.temperature = roomData.temperature;
        existingRoom.humidity = roomData.humidity;
        existingRoom.pressure = roomData.pressure;
        existingRoom.timeStamp = roomData.timeStamp;
      } else {
        acc.push(roomData);
      }
      return acc;
    }, [] as Room[]);

    console.log("rooms.value", rooms.value);

    // Update roomsHistory for each room
    rooms.value.forEach((room) => {
      roomsHistory.value.push({
        timeStamp: room.timeStamp,
        temperature: room.temperature,
      });
    });

    // Update selected room if needed
    if (!selectedRoom.value) {
      selectedRoom.value = rooms.value[0];
    } else if (!rooms.value.some((room) => room.id === selectedRoom.value?.id)) {
      selectedRoom.value = rooms.value[0];
    }

    // Set cards for the selected room
    const cardTemperature = GlobalHelper.MapTemperature(selectedRoom.value.temperature);
    const cardHumidity = GlobalHelper.MapHumidity(selectedRoom.value.humidity);
    const cardAirQuality = GlobalHelper.MapAirQuality(selectedRoom.value.pressure);

    cards.value.push(cardTemperature, cardHumidity, cardAirQuality);

    // set diagram data
    const temperatureData = GlobalHelper.MapChartDataTemperature(roomsHistory.value);
    const humidityData = GlobalHelper.MapChartDataHumidity(roomsHistory.value);
    const airQualityData = GlobalHelper.MapChartDataAirQuality(roomsHistory.value);

    const chartOptions = new ChartOptions();

    charts.value.push(
      { data: temperatureData, options: chartOptions },
      { data: humidityData, options: chartOptions },
      { data: airQualityData, options: chartOptions }
    );

    console.log("WebSocket message received:", data);
    console.log("roomsHistory.value", roomsHistory.value);
    console.log("selected room ", selectedRoom.value);
  };

  loadingStore.setLoading(false);
});
</script>

<template>
  <div v-if="loadingStore.isLoading">
    <Loading class="mt-12" />
  </div>

  <div v-else>
    <RoomSelectorCard
      :latestFetch="latestFetch"
      :selectedRoom="selectedRoom"
      :rooms="rooms"
    />

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-center">
      <StatisticCard
        v-for="card in cards"
        :key="card.title"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :unit="card.unit"
        :normalRange="card.normalRange"
        :criticalText="card.criticalText"
      />
    </div>

    <div class="mt-4 block sm:hidden">
      <Tabs value="0">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.title" :value="tab.value">{{
            tab.title
          }}</Tab>
        </TabList>
        <TabPanels class="p-0!">
          <TabPanel v-for="tab in tabs" :key="tab.value" :value="tab.value">
            <div class="mt-4 flex flex-col gap-4">
              <StatisticDiagram
                v-if="charts[tab.dayChart]"
                :title="chartTitles[tab.dayChart]"
                :chartData="charts[tab.dayChart].data"
                :chartOptions="charts[tab.dayChart].options"
                chartType="line"
              />

              <!--
              <StatisticDiagram
                v-if="historyCharts[tab.monthChart]"
                :title="monthChartTitles[tab.monthChart]"
                :chartData="historyCharts[tab.monthChart].data"
                :chartOptions="historyCharts[tab.monthChart].options"
                chartType="bar"
              />
              -->
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <div class="mt-4 hidden sm:flex flex-wrap gap-4">
      <StatisticDiagram
        v-for="(chart, index) in charts"
        :key="index"
        :title="chartTitles[index]"
        :chartData="chart.data"
        :chartOptions="chart.options"
        chartType="line"
        class="flex-1 w-full sm:max-1/2 md:w-1/3"
      />
    </div>

    <div class="mt-4 hidden sm:flex flex-wrap gap-4">
      <StatisticDiagram
        v-for="(chart, index) in historyCharts"
        :key="index"
        :title="monthChartTitles[index]"
        :chartData="chart.data"
        :chartOptions="chart.options"
        chartType="bar"
        class="flex-1 w-full md:w-1/2"
      />
    </div>
  </div>
</template>
