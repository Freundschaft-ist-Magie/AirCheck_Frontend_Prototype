<script lang="ts" setup>

const router = useRouter();

const loginData = ref({
  email: '',
  password: '',
  rememberMe: false,
});

function login() {
  try {
    const response = fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData.value),
    });

    if (!response.ok) {
      throw new Error('Login failed.');
    }

    const data = response.json();
    console.log('Login successful:', data);

    router.push('/');

  } catch (error) {
    console.error('Error during login:', error);
    alert('Login failed. Please try again.');
  }
}

</script>

<template>
    <div class="bg-gray-100 p-4 flex items-center justify-center min-h-screen">
      <div class="mt-4 p-4 bg-gray2 shadow-md rounded-md w-134">
        <div class="flex justify-center">
            <Icon name="mdi-light:account" class="text-6xl text-black" />
        </div>
        <h2 class="text-center text-xl text-black font-semibold mt-2">Login</h2>

        <form @submit.prevent="login" class="mt-4">
          <div>
            <label class="block text-sm font-medium text-black">E-Mail</label>
            <input 
              type="email" 
              v-model="loginData.email"
              class="w-full px-3 py-2 mt-1 bg-white text-black rounded-md focus:outline-none focus:ring focus:ring-primary1"
              placeholder="Max.Mustermann@muster.com"
              required
            />
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-black">Password</label>
            <input 
              type="password" 
              v-model="loginData.password"
              class="w-full px-3 py-2 mt-1 bg-white text-black rounded-md focus:outline-none focus:ring focus:ring-primary1"
              placeholder="********"
              required
            />
          </div>

          <div class="flex items-center justify-between mt-3">
            <label class="flex items-center text-sm text-black">
              <input type="checkbox" v-model="loginData.rememberMe" class="mr-2 w-4 h-4 translate-y-[1px]">
              <span class="align-center">Angemeldet bleiben</span>
            </label>
            <a href="#" class="text-sm text-black underline hover:no-underline">Passwort vergessen?</a>
          </div>

          <button 
            type="submit" 
            class="w-full py-2 mt-4 text-white bg-primary1 rounded-md hover:bg-primary2/80 active:bg-primary2">
            Einloggen
          </button>
        </form>
      </div>
    </div>
</template>