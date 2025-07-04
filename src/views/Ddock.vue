<template>
  <div class="ddock">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">정류장</h1>
      <p class="text-gray-600">백성운수 버스 정류장 위치를 확인하세요</p>
    </div>

    <!-- Search & Filter -->
    <div class="card p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2">정류장 검색</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="정류장 이름으로 검색..."
              class="form-input pl-10"
              @keyup.enter="search"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div class="w-full md:w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">지역</label>
          <select v-model="selectedArea" class="form-select">
            <option value="">전체</option>
            <option value="평택시">평택시</option>
            <option value="안중읍">안중읍</option>
            <option value="서정리">서정리</option>
            <option value="현화리">현화리</option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button @click="search" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            검색
          </button>
          <button @click="resetSearch" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            초기화
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Ddock List -->
    <div v-else>
      <div v-if="ddocks.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="ddock in ddocks" 
          :key="ddock.id"
          class="card p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ ddock.name }}
              </h3>
              <p class="text-gray-600 mb-2">{{ ddock.address }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ ddock.area || '정류장' }}
              </div>
            </div>
          </div>
          
          <div class="space-y-2 mb-4">
            <div v-if="ddock.next_bus_time" class="flex justify-between items-center">
              <span class="text-sm text-gray-500">다음 버스</span>
              <span class="font-medium text-primary-600">{{ ddock.next_bus_time }}</span>
            </div>
            <div v-if="ddock.bus_routes" class="flex justify-between items-center">
              <span class="text-sm text-gray-500">운행 노선</span>
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="route in ddock.bus_routes" 
                  :key="route"
                  class="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded"
                >
                  {{ route }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              @click="viewOnMap(ddock)"
              class="flex-1 btn btn-outline text-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
              </svg>
              지도보기
            </button>
            <button 
              @click="copyLocation(ddock)"
              class="btn btn-outline text-sm"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="card p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">정류장이 없습니다</h3>
        <p class="text-gray-600">검색 조건을 변경해보세요.</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">자주 찾는 정류장</h3>
        <div class="space-y-2">
          <button 
            v-for="popular in popularStops" 
            :key="popular.name"
            @click="searchByName(popular.name)"
            class="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="font-medium">{{ popular.name }}</div>
            <div class="text-sm text-gray-500">{{ popular.address }}</div>
          </button>
        </div>
      </div>
      
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">정류장 이용 안내</h3>
        <div class="space-y-3 text-sm">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>정류장에서 5분 전 대기하세요</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>실시간 버스 위치는 앱에서 확인 가능합니다</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span>날씨나 교통상황에 따라 지연될 수 있습니다</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useDdocksStore } from '@/stores/ddocks'

export default {
  name: 'Ddock',
  setup() {
    const ddocksStore = useDdocksStore()
    
    const searchQuery = ref('')
    const selectedArea = ref('')

    const isLoading = computed(() => ddocksStore.isLoading)
    const ddocks = computed(() => ddocksStore.ddocks)

    const popularStops = ref([
      { name: '평택터미널', address: '경기도 평택시 중앙로 123' },
      { name: '안중터미널', address: '경기도 평택시 안중읍 중앙로 456' },
      { name: '서정리입구', address: '경기도 평택시 서정리 789' },
      { name: '현화리사거리', address: '경기도 평택시 안중읍 현화리 101' }
    ])

    const search = async () => {
      const params = {}
      if (searchQuery.value) params.search = searchQuery.value
      if (selectedArea.value) params.area = selectedArea.value
      
      await ddocksStore.fetchDdocks(params)
    }

    const resetSearch = async () => {
      searchQuery.value = ''
      selectedArea.value = ''
      await ddocksStore.fetchDdocks()
    }

    const searchByName = async (name) => {
      searchQuery.value = name
      await search()
    }

    const viewOnMap = (ddock) => {
      // 지도 연동 (카카오맵 등)
      if (ddock.latitude && ddock.longitude) {
        const url = `https://map.kakao.com/link/map/${ddock.name},${ddock.latitude},${ddock.longitude}`
        window.open(url, '_blank')
      } else {
        const url = `https://map.kakao.com/link/search/${encodeURIComponent(ddock.address)}`
        window.open(url, '_blank')
      }
    }

    const copyLocation = async (ddock) => {
      try {
        const text = `${ddock.name}\n${ddock.address}`
        await navigator.clipboard.writeText(text)
        // 토스트 메시지 표시 (추후 구현)
        alert('주소가 복사되었습니다.')
      } catch (error) {
        console.error('복사 실패:', error)
        alert('복사에 실패했습니다.')
      }
    }

    onMounted(() => {
      ddocksStore.fetchDdocks()
    })

    return {
      searchQuery,
      selectedArea,
      isLoading,
      ddocks,
      popularStops,
      search,
      resetSearch,
      searchByName,
      viewOnMap,
      copyLocation
    }
  }
}
</script>