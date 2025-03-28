<script lang="ts" setup>
const userData = ref({
  id: "Dh42-das2-8pw6-Qn7C",
  username: "Max Mustermann",
  email: "max.mustermann@muster.com",
  role: "Benutzer",
  assignedDevices: "Arduino 1",
  lastLogin: "2024-12-24",
  status: "Aktiv",
  notes: "ist Teil der BM & normalen Klasse",
  notifications: true,
});

const editableUserData = ref({ ...userData.value });

const newPassword = ref({
  password: "",
  passwordConfirm: "",
});

const checkboxValue = ref(userData.value.notifications);

function saveChanges() {
  userData.value = { ...editableUserData.value };
  userData.value.notifications = checkboxValue.value;

  console.log("Changes saved:", userData.value);
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <MainLayoutHeader />

    <div class="w-1/2 mx-auto flex flex-col gap-4">
      <div class="mt-6 border-b border-gray2 my-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-black rounded-full"></div>
          <div>
            <h2 class="text-lg font-semibold text-black">
              {{ editableUserData.username }}
            </h2>
            <p class="text-gray1">{{ editableUserData.email }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-between">
        <div class="flex flex-col gap-8">
          <FloatLabel class="w-96!">
            <InputText
              id="username_label"
              v-model="editableUserData.username"
              class="w-full"
            />
            <label for="username_label">Benutzername</label>
          </FloatLabel>

          <FloatLabel class="w-96!">
            <InputText
              id="email_label"
              v-model="editableUserData.email"
              class="w-full"
              disabled
            />
            <label for="email_label">E-Mail</label>
          </FloatLabel>

          <FloatLabel class="w-96!">
            <InputText
              id="password_label"
              type="password"
              v-model="newPassword.password"
              class="w-full"
            />
            <label for="password_label">Neues Passwort</label>
          </FloatLabel>

          <FloatLabel class="w-96!">
            <InputText
              id="confirm_label"
              type="password"
              v-model="newPassword.passwordConfirm"
              class="w-full"
            />
            <label for="confirm_label">Neues Passwort</label>
          </FloatLabel>

          <Button
            label="Speichern"
            icon="pi pi-save"
            severity="info"
            class="text-white! bg-primary1! hover:bg-primary2/80! active:bg-primary2!"
            @click="saveChanges"
          />
        </div>

        <div>
          <h3 class="text font-semibold text-black">Allgemeine Informationen</h3>
          <ul class="text text-gray-600 mt-2">
            <li><strong>Id:</strong> {{ userData.id }}</li>
            <li><strong>Rolle:</strong> {{ userData.role }}</li>
            <li><strong>Zugewiesene Geräte:</strong> {{ userData.assignedDevices }}</li>
            <li><strong>Letzte Anmeldung:</strong> {{ userData.lastLogin }}</li>
            <li><strong>Status:</strong> {{ userData.status }}</li>
            <li><strong>Notizen:</strong> {{ userData.notes }}</li>
          </ul>
        </div>
      </div>

      <div class="mt-4 flex items-center">
        <div class="flex items-center gap-2">
          <Checkbox
            v-model="checkboxValue"
            inputId="checkbox"
            value="Benachrichtigungen erhalten"
          />
          <label for="checkbox"> Benachrichtigungen erhalten </label>
        </div>
      </div>
    </div>
  </div>
</template>
