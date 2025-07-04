<template>
  <div class="schedule-detail">
    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Schedule Content -->
    <div v-else-if="schedule" class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500">
        <router-link to="/" class="hover:text-primary-600">홈</router-link>
        <span class="mx-2">/</span>
        <router-link to="/schedule" class="hover:text-primary-600">시간표</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{{ schedule.departure }} → {{ schedule.destination }}</span>
      </nav>

      <!-- Schedule Header -->
      <div class="card p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              {{ schedule.departure }} → {{ schedule.destination }}
            </h1>
            <p class="text-gray-600 text-lg">{{ schedule.route_name }}</p>
          </div>
          <span class="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
            {{ schedule.type }}
          </span>
        </div>

        <!-- Quick Info -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary-600 mb-1">{{ schedule.first_time }}</div>
            <div class="text-sm text-gray-600">첫차</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary-600 mb-1">{{ schedule.last_time }}</div>
            <div class="text-sm text-gray-600">막차</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary-600 mb-1">{{ schedule.interval }}분</div>
            <div class="text-sm text-gray-600">배차간격</div>
          </div>
          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <div class="text-2xl font-bold text-primary-600 mb-1">{{ schedule.duration }}분</div>
            <div class="text-sm text-gray-600">소요시간</div>
          </div>
        </div>

        <!-- Route Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold mb-3">노선 정보</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-gray-600">거리: {{ schedule.distance || '15.2' }}km</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-gray-600">정류장: {{ schedule.stop_count || '24' }}개</span>
              </div>
              <div class="flex items-center">
                <svg class="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
                <span class="text-gray-600">요금: {{ schedule.fare || '1,500' }}원</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold mb-3">운행 시간</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">평일</span>
                <span class="font-medium">{{ schedule.weekday_hours || '05:30 ~ 23:00' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">토요일</span>
                <span class="font-medium">{{ schedule.saturday_hours || '06:00 ~ 22:30' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">일요일/공휴일</span>
                <span class="font-medium">{{ schedule.sunday_hours || '06:00 ~ 22:00' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Time Table -->
      <div class="card p-6">
        <h2 class="text-xl font-semibold mb-4">시간표</h2>
        
        <!-- Day Selection -->
        <div class="flex gap-2 mb-6">
          <button 
            v-for="day in dayTypes" 
            :key="day.value"
            @click="selectedDay = day.value"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="selectedDay === day.value 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ day.label }}
          </button>
        </div>

        <!-- Timetable Grid -->
        <div class="overflow-x-auto">
          <div class="grid grid-cols-6 gap-4 min-w-[600px]">
            <div 
              v-for="hour in timeSlots" 
              :key="hour"
              class="text-center"
            >
              <div class="bg-gray-100 p-2 rounded-t-lg font-semibold">
                {{ hour }}:00
              </div>
              <div class="bg-white border border-gray-200 rounded-b-lg p-2 space-y-1">
                <div 
                  v-for="minute in getMinutesForHour(hour)" 
                  :key="minute"
                  class="text-sm text-gray-600 py-1 hover:bg-primary-50 rounded cursor-pointer"
                  :class="isCurrentTime(hour, minute) ? 'bg-primary-100 text-primary-800 font-medium' : ''"
                >
                  {{ minute }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Route Map/Images -->
      <div v-if="schedule.image_data1 || schedule.image_data2 || schedule.image_data3" class="card p-6">
        <h2 class="text-xl font-semibold mb-4">노선도</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-if="schedule.image_data1" class="relative group">
            <img 
              :src="getImageUrl(schedule.image_data1)" 
              alt="노선도 1"
              class="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageModal(getImageUrl(schedule.image_data1))"
            >
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          
          <div v-if="schedule.image_data2" class="relative group">
            <img 
              :src="getImageUrl(schedule.image_data2)" 
              alt="노선도 2"
              class="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageModal(getImageUrl(schedule.image_data2))"
            >
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          
          <div v-if="schedule.image_data3" class="relative group">
            <img 
              :src="getImageUrl(schedule.image_data3)" 
              alt="노선도 3"
              class="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageModal(getImageUrl(schedule.image_data3))"
            >
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Important Notice -->
      <div class="card p-6 bg-yellow-50 border-yellow-200">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <div>
            <h3 class="font-semibold text-yellow-800 mb-2">이용 안내</h3>
            <ul class="text-yellow-700 text-sm space-y-1">
              <li>• 날씨나 교통상황에 따라 운행시간이 변경될 수 있습니다.</li>
              <li>• 정류장에 5분 전 도착하여 대기해주세요.</li>
              <li>• 교통카드 및 현금 결제가 가능합니다.</li>
              <li>• 버스 내 취식 및 흡연은 금지되어 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <router-link to="/schedule" class="btn btn-outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          목록으로
        </router-link>
        
        <div class="flex gap-2">
          <button @click="shareSchedule" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
            </svg>
            공유
          </button>
          <button @click="printSchedule" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            인쇄
          </button>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="card p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">시간표를 찾을 수 없습니다</h3>
      <p class="text-gray-600 mb-4">요청하신 시간표가 존재하지 않거나 삭제되었습니다.</p>
      <router-link to="/schedule" class="btn btn-primary">
        시간표 목록으로
      </router-link>
    </div>

    <!-- Image Modal -->
    <div v-if="modalImage" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" @click="closeImageModal">
      <div class="relative max-w-4xl max-h-full">
        <img :src="modalImage" alt="노선도 확대보기" class="max-w-full max-h-full object-contain">
        <button @click="closeImageModal" class="absolute top-4 right-4 text-white hover:text-gray-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSchedulesStore } from '@/stores/schedules'

export default {
  name: 'ScheduleDetail',
  setup() {
    const route = useRoute()
    const schedulesStore = useSchedulesStore()
    
    const schedule = ref(null)
    const isLoading = ref(true)
    const selectedDay = ref('weekday')
    const modalImage = ref(null)

    const dayTypes = [
      { value: 'weekday', label: '평일' },
      { value: 'saturday', label: '토요일' },
      { value: 'sunday', label: '일요일/공휴일' }
    ]

    const timeSlots = computed(() => {
      if (!schedule.value) return []
      
      const start = parseInt(schedule.value.first_time.split(':')[0])
      const end = parseInt(schedule.value.last_time.split(':')[0])
      const slots = []
      
      for (let i = start; i <= end; i++) {
        slots.push(i.toString().padStart(2, '0'))
      }
      
      return slots
    })

    const getMinutesForHour = (hour) => {
      if (!schedule.value) return []
      
      const interval = parseInt(schedule.value.interval)
      const minutes = []
      
      for (let i = 0; i < 60; i += interval) {
        minutes.push(i.toString().padStart(2, '0'))
      }
      
      return minutes
    }

    const isCurrentTime = (hour, minute) => {
      const now = new Date()
      const currentHour = now.getHours().toString().padStart(2, '0')
      const currentMinute = now.getMinutes().toString().padStart(2, '0')
      
      return hour === currentHour && Math.abs(parseInt(minute) - parseInt(currentMinute)) < 5
    }

    const getImageUrl = (imageData) => {
      if (typeof imageData === 'string') {
        return imageData
      }
      // Base64 데이터인 경우
      return `data:image/jpeg;base64,${imageData}`
    }

    const openImageModal = (imageUrl) => {
      modalImage.value = imageUrl
    }

    const closeImageModal = () => {
      modalImage.value = null
    }

    const shareSchedule = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: `${schedule.value.departure} → ${schedule.value.destination} 시간표`,
            text: `백성운수 ${schedule.value.route_name} 시간표`,
            url: window.location.href
          })
        } catch (error) {
          console.log('공유 취소됨')
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href)
          alert('링크가 복사되었습니다.')
        } catch (error) {
          console.error('복사 실패:', error)
        }
      }
    }

    const printSchedule = () => {
      window.print()
    }

    const loadSchedule = async () => {
      try {
        isLoading.value = true
        const id = route.params.id
        schedule.value = await schedulesStore.fetchScheduleById(id)
      } catch (error) {
        console.error('시간표 로드 실패:', error)
        schedule.value = null
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      loadSchedule()
    })

    return {
      schedule,
      isLoading,
      selectedDay,
      modalImage,
      dayTypes,
      timeSlots,
      getMinutesForHour,
      isCurrentTime,
      getImageUrl,
      openImageModal,
      closeImageModal,
      shareSchedule,
      printSchedule
    }
  }
}
</script>

<style scoped>
@media print {
  .btn, nav {
    display: none !important;
  }
}
</style>