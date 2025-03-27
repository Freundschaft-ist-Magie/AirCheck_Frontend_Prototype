<script setup lang="ts">

const props = defineProps({
  options: Array,
  placeholder: String,
  filterField: String
})

const model = ref()

</script>

<template>
  <Select v-model="model" :options="props.options" filter :optionLabel="props.filterField" :placeholder="props.placeholder" size="large" class="w-full md:w-56 bg-white! border-0! shadow-none!">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center">
        <div class="text-3xl font-bold text-black">{{ slotProps.value.name }}</div>
      </div>
      <span v-else class="text-3xl font-bold text-black">

        <span v-if="!props.options[0]">
          {{ slotProps.placeholder }}
        </span>
        <span v-else>
          {{ props.options[0].name }}
        </span>

      </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center">
        <div>{{ slotProps.option.name }}</div>
      </div>
    </template>
  </Select>
</template>