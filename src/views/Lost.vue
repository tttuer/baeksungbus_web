<template>
  <div class="lost">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">분실물</h1>
          <p class="text-gray-600">버스에서 잃어버린 물건을 찾아보세요</p>
        </div>
        <router-link to="/lost/form" class="btn btn-primary mt-4 md:mt-0">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          분실물 신고
        </router-link>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="card p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">물품명</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="물품명으로 검색..."
            class="form-input"
            @keyup.enter="search"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">분실일</label>
          <input
            v-model="lostDate"
            type="date"
            class="form-input"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">노선</label>
          <select v-model="selectedRoute" class="form-select">
            <option value="">전체</option>
            <option value="15번">15번</option>
            <option value="25번">25번</option>
            <option value="30번">30번</option>
            <option value="35번">35번</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">상태</label>
          <select v-model="selectedStatus" class="form-select">
            <option value="">전체</option>
            <option value="found">보관중</option>
            <option value="returned">인계완료</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
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

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Lost Items List -->
    <div v-else>
      <div v-if="lostItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="item in lostItems" 
          :key="item.id"
          class="card p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ item.item_name }}
              </h3>
              <div class="space-y-1 text-sm text-gray-600">
                <p class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2 2H8a2 2 0 01-2-2v0a2 2 0 01-2-2V9a2 2 0 012-2h2Z"/>
                  </svg>
                  {{ item.bus_route }} 노선
                </p>
                <p class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0v1a2 2 0 002 2h4a2 2 0 002-2V7m-6 0h6"/>
                  </svg>
                  {{ formatDate(item.lost_date) }}
                </p>
                <p class="flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ item.lost_location }}
                </p>
              </div>
            </div>
            <span 
              class="px-2 py-1 text-xs font-medium rounded"
              :class="getStatusClass(item.status)"
            >
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
          
          <div class="mb-4">
            <p class="text-gray-600 text-sm">{{ item.description }}</p>
          </div>
          
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>신고일: {{ formatDate(item.created_at) }}</span>
            <button 
              v-if="item.status === 'found'"
              @click="contactForClaim(item)"
              class="text-primary-600 hover:text-primary-700 font-medium"
            >
              찾기 신청
            </button>
          </div>
        </div>
      </div>
      
      <div v-else class="card p-12 text-center">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">분실물이 없습니다</h3>
        <p class="text-gray-600 mb-4">검색 조건을 변경하거나 분실물을 신고해보세요.</p>
        <router-link to="/lost/form" class="btn btn-primary">
          분실물 신고하기
        </router-link>
      </div>
    </div>

    <!-- Info Section -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Lost Items Guide -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">분실물 찾기 안내</h3>
        <div class="space-y-3">
          <div class="flex items-start">
            <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span class="text-primary-600 text-sm font-bold">1</span>
            </div>
            <div>
              <h4 class="font-medium">분실물 신고</h4>
              <p class="text-gray-600 text-sm">분실 즉시 온라인 또는 전화로 신고하세요</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span class="text-primary-600 text-sm font-bold">2</span>
            </div>
            <div>
              <h4 class="font-medium">확인 및 연락</h4>
              <p class="text-gray-600 text-sm">분실물 발견 시 연락드립니다</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <div class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span class="text-primary-600 text-sm font-bold">3</span>
            </div>
            <div>
              <h4 class="font-medium">본인확인 후 인계</h4>
              <p class="text-gray-600 text-sm">신분증 지참 후 회사 방문하여 수령</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">분실물 문의</h3>
        <div class="space-y-4">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-primary-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <div>
              <h4 class="font-medium">전화 문의</h4>
              <p class="text-gray-600">031-123-4567</p>
              <p class="text-sm text-gray-500">운영시간: 09:00 ~ 18:00</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <svg class="w-5 h-5 text-primary-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <div>
              <h4 class="font-medium">방문 수령</h4>
              <p class="text-gray-600">경기도 평택시 안중읍 현화리 123-45</p>
              <p class="text-sm text-gray-500">신분증 지참 필수</p>
            </div>
          </div>
          
          <div class="flex items-start">
            <svg class="w-5 h-5 text-primary-600 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h4 class="font-medium">보관 기간</h4>
              <p class="text-gray-600">발견일로부터 6개월</p>
              <p class="text-sm text-gray-500">기간 초과 시 폐기 처리</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'

export default {
  name: 'Lost',
  setup() {
    const isLoading = ref(false)
    const lostItems = ref([])
    
    const searchQuery = ref('')
    const lostDate = ref('')
    const selectedRoute = ref('')
    const selectedStatus = ref('')

    // 더미 데이터 (실제로는 API에서 가져옴)
    const dummyLostItems = [
      {
        id: 1,
        item_name: '검은색 지갑',
        description: '가죽 소재, 신용카드 여러 장 들어있음',
        lost_date: '2024-01-15',
        lost_location: '평택터미널',
        bus_route: '25번',
        status: 'found',
        created_at: '2024-01-15'
      },
      {
        id: 2,
        item_name: '아이폰 13',
        description: '흰색, 투명 케이스 착용',
        lost_date: '2024-01-14',
        lost_location: '안중터미널',
        bus_route: '15번',
        status: 'found',
        created_at: '2024-01-14'
      },
      {
        id: 3,
        item_name: '학생 가방',
        description: '파란색 백팩, 교과서 들어있음',
        lost_date: '2024-01-13',
        lost_location: '서정리',
        bus_route: '30번',
        status: 'returned',
        created_at: '2024-01-13'
      }
    ]

    const getStatusClass = (status) => {
      return status === 'found' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }

    const getStatusLabel = (status) => {
      return status === 'found' ? '보관중' : '인계완료'
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    }

    const search = () => {
      isLoading.value = true
      
      // 필터링 로직
      let filtered = dummyLostItems
      
      if (searchQuery.value) {
        filtered = filtered.filter(item => 
          item.item_name.includes(searchQuery.value) ||
          item.description.includes(searchQuery.value)
        )
      }
      
      if (lostDate.value) {
        filtered = filtered.filter(item => item.lost_date === lostDate.value)
      }
      
      if (selectedRoute.value) {
        filtered = filtered.filter(item => item.bus_route === selectedRoute.value)
      }
      
      if (selectedStatus.value) {
        filtered = filtered.filter(item => item.status === selectedStatus.value)
      }
      
      setTimeout(() => {
        lostItems.value = filtered
        isLoading.value = false
      }, 500)
    }

    const resetSearch = () => {
      searchQuery.value = ''
      lostDate.value = ''
      selectedRoute.value = ''
      selectedStatus.value = ''
      lostItems.value = dummyLostItems
    }

    const contactForClaim = (item) => {
      alert(`분실물 찾기 신청\n\n물품: ${item.item_name}\n연락처: 031-123-4567\n\n신분증을 지참하고 회사로 방문해주세요.`)
    }

    onMounted(() => {
      lostItems.value = dummyLostItems
    })

    return {
      isLoading,
      lostItems,
      searchQuery,
      lostDate,
      selectedRoute,
      selectedStatus,
      getStatusClass,
      getStatusLabel,
      formatDate,
      search,
      resetSearch,
      contactForClaim
    }
  }
}
</script>