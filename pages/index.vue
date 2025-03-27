<script lang="ts" setup>
const popoverPanel = ref();
const temperature = ref(20);
const humidity = ref(45);
const co2 = ref(660);

const isServerOnline = ref(false);

const roomName = ref('Room E20');
const latestFetch = ref(new Date());
const statusMapping = [
  { status: 'Alles ok', codes: [200, 201, 204] },
  { status: 'Fast ok', codes: [400, 401, 403, 404] },
  { status: 'Alles schlecht', codes: [500, 502, 503] },
];

const normals = {
  temperature: { min: 20, max: 25 },
  humidity: { min: 30, max: 60 },
  co2: { max: 1000 },
};

function formatDate(date: Date) {
  // Should be Jan 15, 2025 15:30
  return date.toLocaleString('de-CH', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function generateStatusText(statusCode: number) {
  const status = statusMapping.find((status) => status.codes.includes(statusCode));
  return status ? status.status : 'unknown';
}

function calcNormals(value: number, type: keyof typeof normals) {
  const normal = normals[type];

  if (normal.min !== undefined && value < normal.min) {
    return 'text-blue-500';
  } else if (normal.max !== undefined && value > normal.max) {
    return 'text-red-500';
  }

  return 'text-black';
}

function calcNormalRangeText(type: keyof typeof normals) {
  const normal = normals[type];
  if (normal.min !== undefined && normal.max !== undefined) {
    return `${normal.min} - ${normal.max}`;
  } else if (normal.min !== undefined) {
    return `> ${normal.min}`;
  } else if (normal.max !== undefined) {
    return `< ${normal.max}`;
  }

  return 'unknown';
}

const chartData = ref({
  labels: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  datasets: [
    {
      label: 'Temperatur',
      data: [20, 21, 22, 23, 24, 25, 26],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
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

const togglePopover = (event: Event) => {
  popoverPanel.value.toggle(event);
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <div class="bg-gray2 p-4 flex justify-between items-center rounded-md">
      <div class="flex items-center">
        <span class="text-2xl font-bold text-primary1">&#9733; AirCheck Dashboard</span>
      </div>

      <div class="flex items-center gap-4 space-x-2 text-black">
        <div class="flex gap-2 items-center">
          <svg :class="isServerOnline ? 'text-green-500' : 'text-red-500'" class="w-3 h-3" viewBox="0 0 16 16"
            fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="8" r="8" />
          </svg>
          <span>Server {{ isServerOnline ? "Online" : "Offline" }}</span>
        </div>
        <div class="flex gap-2 items-center">
          <Button icon="pi pi-ellipsis-v" severity="secondary" rounded @click="togglePopover" aria-haspopup="true"
            aria-controls="popoverPanel" />

          <OverlayPanel ref="popoverPanel" id="popoverPanel">
            <div class="flex flex-col gap-2 p-2">
              <NuxtLink to="/user/settings" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
                Nutzer Einstellungen
              </NuxtLink>
              <NuxtLink to="/admin/dashboard" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
                Admin Dashboard
              </NuxtLink>
              <NuxtLink to="/forecast/dashboard" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
                Prognose Dashboard
              </NuxtLink>
              <NuxtLink to="/login" class="text-left hover:bg-gray-800 px-4 py-2 rounded-md">
                Login
              </NuxtLink>
            </div>
          </OverlayPanel>
        </div>

      </div>
    </div>

    <div class="mt-4 p-4 bg-white shadow-md rounded-md flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-black">{{ roomName }}</h2>
        <p class="text-gray-500">Zuletzt Aktualisiert: {{ formatDate(latestFetch) }}</p>
      </div>

      <div class="flex gap-2 items-center">
        <Icon name="mdi-light:information" style="color: black" />
        <p class="text-gray-500">{{ generateStatusText(200) }}</p>
      </div>

    </div>

    <div class="mt-4 grid grid-cols-3 gap-4">
      <div class="bg-white p-4 shadow-md rounded-md">
        <h3 class="font-bold text-primary2">Temperatur</h3>
        <p class="text-2xl font-bold" :class="calcNormals(temperature, 'temperature')">{{ temperature }} &deg;C</p>
        <p class="text-gray-500">Normaler Bereich: {{ calcNormalRangeText('temperature') }} &deg;C</p>
      </div>
      <div class="bg-white p-4 shadow-md rounded-md">
        <h3 class="font-bold text-primary2">Humidity</h3>
        <p class="text-2xl font-bold" :class="calcNormals(humidity, 'humidity')">{{ humidity }} %</p>
        <p class="text-gray-500">Normaler Bereich: {{ calcNormalRangeText('humidity') }} %</p>
      </div>
      <div class="bg-white p-4 shadow-md rounded-md">
        <h3 class="font-bold text-primary2">CO2 Level</h3>
        <p class="text-2xl font-bold" :class="calcNormals(co2, 'co2')">{{ co2 }} ppm</p>
        <p class="text-gray-500">Normaler Bereich: {{ calcNormalRangeText('co2') }} ppm</p>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-3 gap-4">
      <div class="bg-gray-300 shadow-md rounded-md flex flex-col justify-center items-center">
        <p class="mb-2 text-center text-black font-semibold">Temperatur in den letzten 24 h</p>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-30rem" />
      </div>
      <div class="bg-gray-300 p-4 shadow-md rounded-md flex items-center justify-center">Luftfeuchtigkeit in den letzten
        24 h</div>
      <div class="bg-gray-300 p-4 shadow-md rounded-md flex items-center justify-center">CO2 Level in den letzten 24 h
      </div>
    </div>
  </div>
</template>