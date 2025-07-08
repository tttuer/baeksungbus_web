<template>
  <div id="app" class="min-h-screen flex flex-col bg-gray-50">
    <TheHeader v-if="!isAdminPage" />
    <main class="flex-1" :class="isAdminPage ? '' : 'container mx-auto px-4 py-8'">
      <router-view />
    </main>
    <TheFooter v-if="!isAdminPage" />
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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
    const route = useRoute()
    const authStore = useAuthStore()

    const isAdminPage = computed(() => {
      return route.path.startsWith('/adm')
    })

    onMounted(() => {
      authStore.initAuth()
    })

    return {
      isAdminPage
    }
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