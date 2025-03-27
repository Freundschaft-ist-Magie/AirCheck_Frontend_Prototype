<script lang="ts" setup>

const userData = ref({
  id: 'Dh42-das2-8pw6-Qn7C',
  username: 'Max Mustermann',
  email: 'max.mustermann@muster.com',
  role: 'Benutzer',
  assignedDevices: 'Arduino 1',
  lastLogin: '2024-12-24',
  status: 'Aktiv',
  notes: 'ist Teil der BM & normalen Klasse',
  notifications: true,
});

const newPassword = ref({
  password: '',
  passwordConfirm: '',
});

</script>

<template>
  <div class="bg-gray-100 min-h-screen p-4">
    <MainLayoutHeader />

    <div class="mt-6 border-b border-gray2 my-4">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-16 h-16 bg-black rounded-full"></div>
        <div>
          <h2 class="text-lg font-semibold text-black">{{ userData.username }}</h2>
          <p class="text-gray1">{{ userData.email }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-black">Benutzername</label>
          <input type="text" class="w-full p-2 rounded bg-gray2 text-black" :disabled="role != 'Admin'"
            v-model="userData.username" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-black">E-Mail</label>
          <input type="email" class="w-full p-2 rounded bg-gray2 text-black" :disabled="role != 'Admin'"
            v-model="userData.email" />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-black">Neues Passwort</label>
          <input type="password" class="w-full p-2 rounded bg-gray2 text-black" placeholder="Neues Passwort"
            v-model="newPassword.password" />
        </div>

        <div class="mb-4">
          <input type="password" class="w-full p-2 rounded bg-gray2 text-black" placeholder="Neues Passwort bestätigen"
            v-model="newPassword.passwordConfirm" />
        </div>

        <button
          class="w-full py-2 mt-4 text-white bg-primary1 rounded-md hover:bg-primary2/80 active:bg-primary2">Speichern</button>

        <div class="border-b border-gray-300 my-4"></div>
      </div>

      <div>
        <h3 class="text-sm font-semibold text-black">Allgemeine Informationen</h3>
        <ul class="text-sm text-gray-600 mt-2">
          <li><strong>Id:</strong> Dh42-das2-8pw6-Qn7C</li>
          <li><strong>Rolle:</strong> Benutzer</li>
          <li><strong>Zugewiesene Geräte:</strong> Arduino 1</li>
          <li><strong>Letzte Anmeldung:</strong> 2024-12-24</li>
          <li><strong>Status:</strong> Aktiv</li>
          <li><strong>Notizen:</strong> ist Teil der BM & normalen Klasse</li>
        </ul>
      </div>
    </div>



    <div class="mt-4 flex items-center">
      <input type="checkbox" id="notifications" class="mr-2" />
      <label for="notifications" class="text-sm text-gray-700">Benachrichtigungen erhalten</label>
    </div>
  </div>

</template>
