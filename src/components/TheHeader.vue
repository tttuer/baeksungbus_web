<template>
  <header class="bg-primary-600 text-white shadow-lg">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-3">
            <img src="@/assets/logo.png" alt="백성운수" class="h-10 w-10 rounded">
            <span class="text-xl font-bold">백성운수</span>
          </router-link>
        </div>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-8">
          <router-link 
            to="/" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            홈
          </router-link>
          <router-link 
            to="/schedule" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            시간표
          </router-link>
          <router-link 
            to="/ddock" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            정류장
          </router-link>
          <router-link 
            to="/location" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            위치
          </router-link>
          <router-link 
            to="/notice" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            공지사항
          </router-link>
          <router-link 
            to="/qa" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            Q&A
          </router-link>
          <router-link 
            to="/lost" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            분실물
          </router-link>
          <router-link 
            to="/recruit" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            active-class="bg-primary-700"
          >
            채용
          </router-link>
        </nav>
        
        <!-- Right Side Menu -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link 
            v-if="isAuthenticated && isAdmin" 
            to="/admin" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            관리자
          </router-link>
          <button 
            v-if="isAuthenticated" 
            @click="logout" 
            class="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            로그아웃
          </button>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button 
            @click="toggleMobileMenu" 
            class="text-white hover:text-primary-200 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          >
            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <router-link 
            to="/" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            홈
          </router-link>
          <router-link 
            to="/schedule" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            시간표
          </router-link>
          <router-link 
            to="/ddock" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            정류장
          </router-link>
          <router-link 
            to="/location" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            위치
          </router-link>
          <router-link 
            to="/notice" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            공지사항
          </router-link>
          <router-link 
            to="/qa" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            Q&A
          </router-link>
          <router-link 
            to="/lost" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            분실물
          </router-link>
          <router-link 
            to="/recruit" 
            class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
            active-class="bg-primary-700"
            @click="closeMobileMenu"
          >
            채용
          </router-link>
          
          <div v-if="isAuthenticated" class="border-t border-primary-700 pt-4">
            <router-link 
              v-if="isAdmin" 
              to="/admin" 
              class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
              @click="closeMobileMenu"
            >
              관리자
            </router-link>
            <button 
              @click="logout" 
              class="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'TheHeader',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const showMobileMenu = ref(false)

    const isAuthenticated = computed(() => authStore.isAuthenticated)
    const isAdmin = computed(() => authStore.isAdmin)

    const logout = async () => {
      authStore.logout()
      closeMobileMenu()
      await router.push('/')
    }

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value
    }

    const closeMobileMenu = () => {
      showMobileMenu.value = false
    }

    return {
      isAuthenticated,
      isAdmin,
      showMobileMenu,
      logout,
      toggleMobileMenu,
      closeMobileMenu
    }
  }
}
</script>