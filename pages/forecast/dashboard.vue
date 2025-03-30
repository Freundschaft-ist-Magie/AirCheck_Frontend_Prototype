<script lang="ts" setup>
const selectedMetric = ref("Temperatur");

const metrics = [
  { label: "Temperatur", value: "Temperatur" },
  { label: "Luftfeuchtigkeit", value: "Luftfeuchtigkeit" },
  { label: "CO2 Level", value: "CO2 Level" },
];

const changeMetric = (metric: string) => {
  selectedMetric.value = metric;
};
</script>

<template>
  <div class="my-8">
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
      <div class="w-3/4 bg-gray-300 p-6 rounded-lg flex items-center justify-center">
        <span class="text-gray-700">Chart ({{ selectedMetric }})</span>
      </div>
    </div>
  </div>
</template>
