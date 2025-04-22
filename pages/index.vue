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

function setCards() {

  console.log("Selected Rooms aber slay", selectedRoom.value);

  // Set cards for the selected room
  const cardTemperature = GlobalHelper.MapTemperature(selectedRoom.value.temperature);
  const cardHumidity = GlobalHelper.MapHumidity(selectedRoom.value.humidity);
  const cardAirQuality = GlobalHelper.MapAirQuality(selectedRoom.value.pressure);

  if (cardTemperature.value !== undefined) {
    // Vorhandene Karten ersetzen statt hinzufügen
    cards.value = [cardTemperature, cardHumidity, cardAirQuality];
  }

  console.log("cards", cards.value);
}

function setCharts() {
  console.log("Full roomsHistory:", roomsHistory.value);

  // Charts zurücksetzen, damit nicht immer weiter angehängt wird
  charts.value = [];

  // 1️⃣ History des selektierten Raums auslesen (falls vorhanden)
  const roomId = selectedRoom.value?.roomId;
  const historyForSelected = roomId != null
      ? roomsHistory.value[roomId] ?? []
      : [];

  console.log(`History für Raum ${roomId}:`, historyForSelected);

  // 2️⃣ Diagrammdaten nur für den selektierten Raum erstellen
  const temperatureData = GlobalHelper.MapChartDataTemperature(historyForSelected);
  const humidityData    = GlobalHelper.MapChartDataHumidity(historyForSelected);
  const airQualityData  = GlobalHelper.MapChartDataAirQuality(historyForSelected);

  // 3️⃣ Options initialisieren
  const chartOptions = new ChartOptions();

  // 4️⃣ Charts-Array befüllen
  charts.value.push(
      { data: temperatureData, options: chartOptions },
      { data: humidityData,    options: chartOptions },
      { data: airQualityData,  options: chartOptions }
  );

  console.log("Charts für selektierten Raum:", charts.value);
}


onMounted(async () => {
  loadingStore.setLoading(true);

  const webSocket = new WebSocket(
    `ws://${import.meta.env.VITE_API_URL}/api/roomDatas/ws`
  );
  webSocket.onmessage = (event) => {
    loadingStore.setLoading(true);
    console.log("Skibidi loading");

    const data = JSON.parse(event.data);
    latestFetch.value = new Date();

    // 1️⃣ Jeden Raum aktualisieren oder hinzufügen:
    data.forEach((roomData: any) => {
      const existingRoom = rooms.value.find((room) => room.roomId === roomData.roomId);
      if (existingRoom !== undefined) {
        console.warn("Updated existing Room:", roomData.roomId);
        existingRoom.temperature = roomData.temperature;
        existingRoom.humidity    = roomData.humidity;
        existingRoom.pressure    = roomData.pressure;
        existingRoom.gas         = roomData.gas;
        existingRoom.timeStamp   = roomData.timeStamp;
      } else {
        console.warn("Added new Room:", roomData.roomId);
        rooms.value.push({
          roomId:    roomData.roomId,
          temperature: roomData.temperature,
          humidity:  roomData.humidity,
          pressure:  roomData.pressure,
          gas:       roomData.gas,
          timeStamp: roomData.timeStamp,
        });
      }
    });

    console.log("rooms.value", rooms.value);

    // 2️⃣ History pro Raum:
    data.forEach((roomData: any) => {
      const id = roomData.roomId;
      // Hole oder initialisiere das Array für diese roomId
      const historyForRoom = roomsHistory.value[id] ?? [];

      // Optional: Nur hinzufügen, wenn neuer Timestamp
      const lastEntry = historyForRoom[historyForRoom.length - 1];
      if (!lastEntry || new Date(roomData.timeStamp) > new Date(lastEntry.timeStamp)) {
        historyForRoom.push({
          timeStamp:  roomData.timeStamp,
          temperature: roomData.temperature,
          humidity: roomData.humidity,
          pressure: roomData.pressure,
          airQuality: roomData.gas,
        });
      }

      // Speichere zurück
      roomsHistory.value[id] = historyForRoom;
    });

    console.log("roomsHistory.value", roomsHistory.value);

    // 3️⃣ Selected Room aktualisieren:
    if (!selectedRoom.value) {
      selectedRoom.value = rooms.value[0];
    } else if (!rooms.value.some((room) => room.roomId === selectedRoom.value.roomId)) {
      selectedRoom.value = rooms.value[0];
    }

    // 4️⃣ Karten setzen:
    setCards();
    // 5️⃣ Charts setzen:
    setCharts();

    console.log("cards", cards.value);
    console.log("selected room", selectedRoom.value);

    loadingStore.setLoading(false);
  };


  loadingStore.setLoading(false);

  console.error("Cool Rooms", rooms.value)

});


function roomSelected(room) {
  console.log("Set new room", selectedRoom.value.roomId, room.roomId);
  selectedRoom.value = room;
  setCards();
  setCharts();
}

</script>

<template>
  <div v-if="loadingStore.isLoading">
    <Loading class="mt-12" />
  </div>

  <div v-else>
    <RoomSelectorCard
      :latestFetch="latestFetch"
      :rooms="rooms"
      :selectedRoom="selectedRoom"
      @roomSelected="roomSelected"
    />

    <RoomTable :room-data="rooms" class="mt-4" />

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
