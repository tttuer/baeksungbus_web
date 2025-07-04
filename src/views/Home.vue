<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 rounded-lg mb-8">
      <div class="text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">백성운수</h1>
        <p class="text-xl md:text-2xl mb-8 text-primary-100">
          편리하고 안전한 대중교통 서비스
        </p>
        <div class="flex flex-col md:flex-row gap-4 justify-center">
          <router-link 
            to="/schedule" 
            class="btn btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 text-lg"
          >
            시간표 보기
          </router-link>
          <router-link 
            to="/ddock" 
            class="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 text-lg"
          >
            정류장 찾기
          </router-link>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <router-link 
        to="/schedule" 
        class="card p-6 hover:shadow-lg transition-shadow text-center group"
      >
        <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">시간표</h3>
        <p class="text-gray-600">버스 운행 시간을 확인하세요</p>
      </router-link>

      <router-link 
        to="/ddock" 
        class="card p-6 hover:shadow-lg transition-shadow text-center group"
      >
        <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">정류장</h3>
        <p class="text-gray-600">가까운 정류장을 찾아보세요</p>
      </router-link>

      <router-link 
        to="/notice" 
        class="card p-6 hover:shadow-lg transition-shadow text-center group"
      >
        <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">공지사항</h3>
        <p class="text-gray-600">중요한 공지사항을 확인하세요</p>
      </router-link>

      <router-link 
        to="/qa" 
        class="card p-6 hover:shadow-lg transition-shadow text-center group"
      >
        <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200 transition-colors">
          <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Q&A</h3>
        <p class="text-gray-600">궁금한 점을 문의하세요</p>
      </router-link>
    </section>

    <!-- Latest News & Info -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Notices -->
      <section class="card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">최근 공지사항</h2>
          <router-link 
            to="/notice" 
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            더보기 →
          </router-link>
        </div>
        <div v-if="recentNotices.length > 0" class="space-y-3">
          <div 
            v-for="notice in recentNotices" 
            :key="notice.id"
            class="border-b border-gray-100 pb-3 last:border-b-0"
          >
            <router-link 
              :to="`/notice/${notice.id}`"
              class="block hover:text-primary-600 transition-colors"
            >
              <h3 class="font-medium mb-1">{{ notice.title }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(notice.created_at) }}</p>
            </router-link>
          </div>
        </div>
        <div v-else class="text-gray-500 text-center py-8">
          공지사항이 없습니다.
        </div>
      </section>

      <!-- Service Info -->
      <section class="card p-6">
        <h2 class="text-xl font-semibold mb-4">운행 정보</h2>
        <div class="space-y-4">
          <div class="flex items-start">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <h3 class="font-medium mb-1">평일 운행시간</h3>
              <p class="text-gray-600">05:30 ~ 23:00</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-medium mb-1">주말/공휴일</h3>
              <p class="text-gray-600">06:00 ~ 22:30</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-1">
              <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-medium mb-1">안내사항</h3>
              <p class="text-gray-600 text-sm">날씨 및 교통상황에 따라 운행시간이 변경될 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useNoticesStore } from '@/stores/notices'

export default {
  name: 'Home',
  setup() {
    const noticesStore = useNoticesStore()
    const recentNotices = ref([])

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const loadRecentNotices = async () => {
      try {
        await noticesStore.fetchNotices({ limit: 5 })
        recentNotices.value = noticesStore.notices.slice(0, 5)
      } catch (error) {
        console.error('최근 공지사항 로드 실패:', error)
      }
    }

    onMounted(() => {
      loadRecentNotices()
    })

    return {
      recentNotices,
      formatDate
    }
  }
}
</script>