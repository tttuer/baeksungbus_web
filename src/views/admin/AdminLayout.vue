<template>
  <div class="admin-layout min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 lg:hidden">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-gray-900 ml-2">백성운수 관리자</h1>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              {{ currentTime }}
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">관리자</span>
              <button @click="logout" class="text-sm text-red-600 hover:text-red-700">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex">
      <!-- Sidebar -->
      <nav 
        class="w-64 bg-white shadow-sm border-r min-h-screen transition-transform duration-200 ease-in-out"
        :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }"
      >
        <div class="p-4">
          <div class="space-y-2">
            <router-link 
              v-for="item in menuItems" 
              :key="item.name"
              :to="item.path"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="$route.path === item.path 
                ? 'bg-primary-100 text-primary-900' 
                : 'text-gray-700 hover:bg-gray-100'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"/>
              </svg>
              {{ item.name }}
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="sidebarOpen" 
        class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        @click="toggleSidebar"
      ></div>

      <!-- Main Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AdminLayout',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const sidebarOpen = ref(true)
    const currentTime = ref('')
    let timeInterval = null

    const menuItems = [
      {
        name: '대시보드',
        path: '/admin/dashboard',
        icon: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z'
      },
      {
        name: '시간표 관리',
        path: '/admin/schedule',
        icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        name: '공지사항 관리',
        path: '/admin/notice',
        icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z'
      },
      {
        name: '고객 문의',
        path: '/admin/customer',
        icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
      },
      {
        name: '정류장 관리',
        path: '/admin/ddock',
        icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z'
      },
      {
        name: '분실물 관리',
        path: '/admin/lost',
        icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
      }
    ]

    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const updateTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    const logout = async () => {
      if (confirm('로그아웃 하시겠습니까?')) {
        await authStore.logout()
        router.push('/admin/login')
      }
    }

    onMounted(() => {
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
      
      // 데스크톱에서는 사이드바 열기
      if (window.innerWidth >= 1024) {
        sidebarOpen.value = true
      } else {
        sidebarOpen.value = false
      }

      // 창 크기 변경 시 처리
      const handleResize = () => {
        if (window.innerWidth >= 1024) {
          sidebarOpen.value = true
        } else {
          sidebarOpen.value = false
        }
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    return {
      sidebarOpen,
      currentTime,
      menuItems,
      toggleSidebar,
      logout
    }
  }
}
</script>

<style scoped>
.admin-layout {
  font-family: 'Noto Sans KR', sans-serif;
}

@media (max-width: 1024px) {
  nav {
    position: fixed;
    top: 64px;
    left: 0;
    z-index: 50;
    height: calc(100vh - 64px);
  }
}
</style>