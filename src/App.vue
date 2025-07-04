<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <TheHeader />
    <main class="flex-1 container mx-auto px-4 py-8">
      <router-view />
    </main>
    <TheFooter />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter
  },
  setup() {
    const authStore = useAuthStore()

    onMounted(() => {
      authStore.initAuth()
    })

    return {}
  }
}
</script>

<style>
@import '@/assets/main.css';

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.loading {
  @apply flex justify-center items-center min-h-[200px];
}

.spinner {
  @apply w-8 h-8 border-4 border-gray-200 border-t-primary-600 rounded-full animate-spin;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>