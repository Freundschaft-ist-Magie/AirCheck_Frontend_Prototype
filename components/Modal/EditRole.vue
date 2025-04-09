<script lang="ts" setup>
const dialogRef = inject("dialogRef");

const originalRole = dialogRef?.value?.data?.role ?? {
  id: 0,
  name: "",
  permission: "",
};

const role = reactive({
  id: originalRole.id,
  name: originalRole.name,
  permission: originalRole.permission,
});

const permissions = ref([{ name: "Benutzer" }, { name: "Administrator" }]);

function cancel() {
  dialogRef?.value?.close();
}

function save() {
  dialogRef?.value?.close({
    id: role.id,
    name: role.name,
    permissions: role.permission,
  });
}
</script>

<template>
  <div class="flex items-center gap-4 mb-4">
    <label for="name" class="font-semibold w-24">Rolle</label>
    <InputText id="name" class="flex-auto" autocomplete="off" v-model="role.name" />
  </div>
  <div class="flex items-center gap-4 mb-8">
    <label for="permissions" class="font-semibold w-24">Berechtigungen</label>
    <MultiSelect
      v-model="role.permission"
      display="chip"
      :options="permissions"
      optionLabel="name"
      filter
      placeholder="Berechtigungen auswählen"
      class="w-full"
    />
  </div>
  <div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Abbrechen"
        severity="secondary"
        @click="cancel"
      ></Button>
      <Button type="button" label="Speichern" @click="save"></Button>
    </div>
  </div>
</template>
