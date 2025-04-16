<script lang="ts" setup>
import { useLoadingStore } from "@/utils/stores/base/LoadingStore";
import RoomsService from "~/utils/services/RoomsService";
import Room from "~/models/Room";
import GlobalHelper from "~/utils/helper/GlobalHelper";
import StatisticCardObj from "~/models/StatisticCardObj";
import ChartData from "~/models/ChartData";
import ChartOptions from "~/models/ChartOptions";

const loadingStore = useLoadingStore();
const latestFetch = ref(new Date());
const selectedRoom = ref<Room | null>(null);
const rooms = ref<Room[]>([]);
const cards = ref<StatisticCardObj[]>([]);
const charts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const historyCharts = ref<{ data: ChartData; options: ChartOptions }[]>([]);
const chartTitles = ref([
  "Temperatur in den letzten 24 h",
  "Luftfeuchtigkeit in den letzten 24 h",
  "CO2 Level in den letzten 24 h",
]);
const monthChartTitles = ref([
  "Temperatur in den letzten 30 Tagen",
  "Luftfeuchtigkeit in den letzten 30 Tagen",
  "CO2 Level in den letzten 30 Tagen",
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
    title: "CO2 Level",
    value: "2",
    dayChart: 2,
    monthChart: 2,
  },
]);

loadingStore.setLoading(true);

onMounted(async () => {
  loadingStore.setLoading(true);

  const roomsService = new RoomsService();
  const fetchedRooms = await roomsService.Get();
  const fetchedHistory = await roomsService.GetHistory();

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

  // set history diagram data
  const temperatureHistoryData = GlobalHelper.MapHistoryChartDataTemperature(
    fetchedHistory,
    selectedRoom.value
  );
  const humidityHistoryData = GlobalHelper.MapHistoryChartDataHumidity(
    fetchedHistory,
    selectedRoom.value
  );
  const airQualityHistoryData = GlobalHelper.MapHistoryChartDataAirQuality(
    fetchedHistory,
    selectedRoom.value
  );

  const chartOptions = new ChartOptions();

  cards.value.push(cardTemperature, cardHumidity, cardAirQuality);
  charts.value.push(
    { data: temperatureData, options: chartOptions },
    { data: humidityData, options: chartOptions },
    { data: airQualityData, options: chartOptions }
  );

  historyCharts.value.push(
    { data: temperatureHistoryData, options: chartOptions },
    { data: humidityHistoryData, options: chartOptions },
    { data: airQualityHistoryData, options: chartOptions }
  );

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

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <StatisticCard
        v-for="card in cards"
        :key="card.title"
        :title="card.title"
        :text="card.text"
        :icon="card.icon"
        :normalRange="card.normalRange"
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

              <StatisticDiagram
                v-if="historyCharts[tab.monthChart]"
                :title="monthChartTitles[tab.monthChart]"
                :chartData="historyCharts[tab.monthChart].data"
                :chartOptions="historyCharts[tab.monthChart].options"
                chartType="bar"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>

    <div class="mt-4 hidden sm:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <StatisticDiagram
        v-for="(chart, index) in charts"
        :key="index"
        :title="chartTitles[index]"
        :chartData="chart.data"
        :chartOptions="chart.options"
        chartType="line"
      />
    </div>
    <div class="mt-4 hidden sm:grid grid-cols-1 md:grid-cols-2 gap-4">
      <StatisticDiagram
        v-for="(chart, index) in historyCharts"
        :key="index"
        :title="monthChartTitles[index]"
        :chartData="chart.data"
        :chartOptions="chart.options"
        chartType="bar"
      />
    </div>
  </div>
</template>
