<template>
  <div class="sidebar bg-white shadow-lg border-r border-gray-200">
    <div class="sidebar-header p-4 border-b border-gray-200">
      <h5 class="text-lg font-semibold text-gray-900">메뉴</h5>
    </div>
    
    <nav class="sidebar-nav flex-1 overflow-y-auto">
      <ul class="space-y-1 p-4">
        <li>
          <router-link 
            to="/" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            홈
          </router-link>
        </li>
        <li>
          <router-link 
            to="/schedule" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            시간표
          </router-link>
        </li>
        <li>
          <router-link 
            to="/ddock" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            정류장
          </router-link>
        </li>
        <li>
          <router-link 
            to="/location" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
            위치
          </router-link>
        </li>
        <li>
          <router-link 
            to="/notice" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
            </svg>
            공지사항
          </router-link>
        </li>
        <li>
          <router-link 
            to="/qa" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Q&A
          </router-link>
        </li>
        <li>
          <router-link 
            to="/lost" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            분실물
          </router-link>
        </li>
        <li>
          <router-link 
            to="/recruit" 
            class="nav-link group flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
            active-class="bg-primary-100 text-primary-700 border-r-2 border-primary-600"
          >
            <svg class="w-5 h-5 mr-3 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            채용
          </router-link>
        </li>
      </ul>
      
      <div class="sidebar-footer mt-auto p-4 border-t border-gray-200" v-if="isAdmin">
        <router-link 
          to="/admin" 
          class="btn btn-primary w-full flex items-center justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          관리자
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'TheSidebar',
  setup() {
    const authStore = useAuthStore()

    const isAdmin = computed(() => authStore.isAdmin)

    return {
      isAdmin
    }
  }
}
</script>

<style scoped>
.sidebar {
  min-height: 100vh;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
}
</style>