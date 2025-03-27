<script setup lang="ts">

const props = defineProps({
  title: String,
  chartData: Object,
  chartOptions: Object
})

</script>

<template>
  <div class="bg-gray-300 shadow-md rounded-md flex flex-col justify-center items-center">
    <p class="mb-2 text-center">{{ props.title }}</p>
    <Chart type="line" :data="props.chartData" :options="props.chartOptions" class="h-30rem" />
  </div>
</template>