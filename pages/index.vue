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
  "Luftqualität Level in den letzten 24 h",
  "Luftdruck in den letzten 24h",
]);
const monthChartTitles = ref([
  "Temperatur in den letzten 30 Tagen",
  "Luftfeuchtigkeit in den letzten 30 Tagen",
  "Luftqualität in den letzten 30 Tagen",
  "Luftdruck in den letzten 30 Tagen",
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
  {
    title: "Luftdruck",
    value: "3",
    dayChart: 3,
    monthChart: 3,
  },
]);

loadingStore.setLoading(true);

function setCards() {
  // Set cards for the selected room
  const cardTemperature = GlobalHelper.MapTemperature(selectedRoom.value.temperature);
  const cardHumidity = GlobalHelper.MapHumidity(selectedRoom.value.humidity);
  const cardAirQuality = GlobalHelper.MapAirQuality(selectedRoom.value.gas);
  const cardPressure = GlobalHelper.MapPressure(selectedRoom.value.pressure);


  if (cardTemperature.value !== undefined) {
    // Vorhandene Karten ersetzen statt hinzufügen
    cards.value = [cardTemperature, cardHumidity, cardAirQuality, cardPressure];
  }
}

function setCharts() {
  console.log(roomsHistory.value);
  // Charts zurücksetzen, damit nicht immer weiter angehängt wird
  charts.value = [];

  // 1️⃣ History des selektierten Raums auslesen (falls vorhanden)
  const roomId = selectedRoom.value?.roomId;
  const historyForSelected = roomId != null ? roomsHistory.value[roomId] ?? [] : [];

  // 2️⃣ Diagrammdaten nur für den selektierten Raum erstellen
  const temperatureData = GlobalHelper.MapChartDataTemperature(historyForSelected);
  const humidityData = GlobalHelper.MapChartDataHumidity(historyForSelected);
  const airQualityData = GlobalHelper.MapChartDataAirQuality(historyForSelected);
  const pressureData = GlobalHelper.MapChartDataPressure(historyForSelected);

  // 3️⃣ Options initialisieren
  const chartOptions = new ChartOptions();

  // 4️⃣ Charts-Array befüllen
  charts.value.push(
    { data: temperatureData, options: chartOptions },
    { data: humidityData, options: chartOptions },
    { data: airQualityData, options: chartOptions },
    { data: pressureData, options: chartOptions },
  );
}

onMounted(async () => {
  loadingStore.setLoading(true);

  const webSocket = new WebSocket(
    `ws://${import.meta.env.VITE_API_URL}/api/roomDatas/ws`
  );
  webSocket.onmessage = (event) => {
    loadingStore.setLoading(true);

    const data = JSON.parse(event.data);
    latestFetch.value = new Date();

    // 1️⃣ Jeden Raum aktualisieren oder hinzufügen:
    data.forEach((roomData: any) => {
      const existingRoom = rooms.value.find((room) => room.roomId === roomData.roomId);
      if (existingRoom !== undefined) {
        existingRoom.temperature = roomData.temperature;
        existingRoom.humidity = roomData.humidity;
        existingRoom.pressure = roomData.pressure;
        existingRoom.gas = roomData.gas;
        existingRoom.timeStamp = roomData.timeStamp;
      } else {
        rooms.value.push({
          roomId: roomData.roomId,
          temperature: roomData.temperature,
          humidity: roomData.humidity,
          pressure: roomData.pressure,
          gas: roomData.gas,
          timeStamp: roomData.timeStamp,
        });
      }
    });

    // 2️⃣ History pro Raum:
    data.forEach((roomData: any) => {
      const id = roomData.roomId;
      // Hole oder initialisiere das Array für diese roomId
      const historyForRoom = roomsHistory.value[id] ?? [];

      // Optional: Nur hinzufügen, wenn neuer Timestamp
      const lastEntry = historyForRoom[historyForRoom.length - 1];
      if (!lastEntry || new Date(roomData.timeStamp) > new Date(lastEntry.timeStamp)) {
        historyForRoom.push({
          timeStamp: roomData.timeStamp,
          temperature: roomData.temperature,
          humidity: roomData.humidity,
          pressure: roomData.pressure,
          airQuality: roomData.gas,
        });
      }

      // Speichere zurück
      roomsHistory.value[id] = historyForRoom;
    });

    // 3️⃣ Selected Room aktualisieren:
    if (!selectedRoom.value) {
      selectedRoom.value = rooms.value[0];
    } else if (!rooms.value.some((room) => room.roomId === selectedRoom.value.roomId)) {
      selectedRoom.value = rooms.value[0];
    }

    // 4️⃣ Karten setzen:
    setCards();

    if (charts.value.length == 0) {
      // 5️⃣ Charts setzen:
      setCharts();
    }

    loadingStore.setLoading(false);
  };

  loadingStore.setLoading(false);
});

function roomSelected(room) {
  console.log("Set new room", selectedRoom.value.roomId, room.roomId);
  selectedRoom.value = room;

  const ws = new WebSocket(
    `ws://${import.meta.env.VITE_API_URL}/api/roomDatas/ws/${room.roomId}`
  );

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log("🔥Received data for room:", data.roomId, data);

    if (data.isBurning) {
      console.warn("🔥🔥🔥 ALARM: Dieser Raum brennt! 🔥🔥🔥");
      triggerTheInferno();
    }
  };

  setCards();
  setCharts();
}

function triggerTheInferno() {
  alert("🔥 Achtung: Der Raum steht in Flammen!");
  launchFlyingFlames(15); // <– hier knallt's los

  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.classList.add("inferno-effect");
    setTimeout(() => {
      mainContent.classList.remove("inferno-effect");
    }, 8000);
  }

  const statCards = document.querySelectorAll(".stat-card");
  statCards.forEach((card) => {
    (card as HTMLElement).classList.add("inferno-effect");
    setTimeout(() => {
      (card as HTMLElement).classList.remove("inferno-effect");
    }, 8000);
  });
}
</script>

<template>
  <div v-if="loadingStore.isLoading">
    <Loading class="mt-12" />
  </div>

  <div v-else id="main-content">
    <RoomSelectorCard
      :latestFetch="latestFetch"
      :rooms="rooms"
      :selectedRoom="selectedRoom"
      @roomSelected="roomSelected"
    />

    <RoomTable :room-data="roomsHistory" :selected-room="selectedRoom" class="mt-4" />

    <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 items-center">
      <StatisticCard
        v-for="card in cards"
        :key="card.title"
        class="stat-card"
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
        class="flex-1 w-full sm:max-1/2 md:w-1/2"
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

<style scoped>
@keyframes infernoShake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}

@keyframes infernoGlow {
  0% {
    box-shadow: 0 0 10px red;
  }
  50% {
    box-shadow: 0 0 30px orange;
  }
  100% {
    box-shadow: 0 0 10px red;
  }
}

@keyframes flyAcross {
  0% {
    transform: translateX(-100px) translateY(0px) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateX(110vw) translateY(-200px) scale(1.5);
    opacity: 0;
  }
}

.flame {
  position: fixed;
  width: 40px;
  height: 40px;
  background-image: url("https://c.tenor.com/K3j9pwWlME0AAAAC/tenor.gif"); /* Oder ein SVG oder Emoji 🔥 */
  background-size: cover;
  z-index: 9999;
  pointer-events: none;
  animation: flyAcross 4s linear forwards;
}

.inferno-effect {
  animation: infernoShake 0.5s infinite, infernoGlow 1s infinite;
  background: linear-gradient(45deg, #ff0000cc, #ff9900cc);
  color: white !important;
  border: 2px solid #ff9900;
}
</style>
