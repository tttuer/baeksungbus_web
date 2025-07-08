<template>
  <div class="admin-schedule">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">시간표 관리</h1>
          <p class="text-gray-600">버스 운행 시간표를 관리할 수 있습니다</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="refreshData"
            class="btn btn-outline"
            :disabled="isLoading"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            새로고침
          </button>
          <button
            @click="openCreateModal"
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            시간표 추가
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">전체 노선</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalRoutes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">운행 중</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeRoutes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">임시 중단</p>
            <p class="text-2xl font-bold text-gray-900">{{ suspendedRoutes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">총 운행 횟수</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalTrips }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">검색</label>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="노선명, 출발지, 도착지 검색"
              class="form-input pl-10"
              @keyup.enter="search"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">운행 상태</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">전체</option>
            <option value="active">운행 중</option>
            <option value="suspended">임시 중단</option>
            <option value="inactive">운행 종료</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">노선 유형</label>
          <select v-model="typeFilter" class="form-select">
            <option value="">전체</option>
            <option value="regular">정규</option>
            <option value="express">급행</option>
            <option value="special">특수</option>
          </select>
        </div>

        <div class="flex items-end space-x-2">
          <button @click="search" class="btn btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            검색
          </button>
          <button @click="resetFilters" class="btn btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            초기화
          </button>
        </div>
      </div>
    </div>

    <!-- Schedule Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">시간표 목록</h3>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-gray-600">로딩 중...</span>
      </div>

      <div v-else-if="!Array.isArray(schedules) || schedules.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">시간표가 없습니다</h3>
        <p class="text-gray-600">새 시간표를 추가해보세요.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                노선 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                운행 구간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                운행 시간
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="schedule in schedules" :key="schedule.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-blue-900">{{ schedule.route_number }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ schedule.route_name }}</div>
                    <div class="text-sm text-gray-500">{{ schedule.route_type || '정규' }} 노선</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <div class="flex items-center">
                    <span>{{ schedule.departure }}</span>
                    <svg class="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                    <span>{{ schedule.arrival }}</span>
                  </div>
                </div>
                <div class="text-sm text-gray-500">소요시간: {{ schedule.duration || '미설정' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <div>첫차: {{ schedule.first_bus || '미설정' }}</div>
                  <div>막차: {{ schedule.last_bus || '미설정' }}</div>
                  <div class="text-gray-500">배차간격: {{ schedule.interval || '미설정' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="schedule.status === 'active'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  운행 중
                </span>
                <span v-else-if="schedule.status === 'suspended'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  임시 중단
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  운행 종료
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewSchedule(schedule)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    상세보기
                  </button>
                  <button
                    @click="editSchedule(schedule)"
                    class="text-indigo-600 hover:text-indigo-800"
                  >
                    수정
                  </button>
                  <button
                    @click="toggleStatus(schedule)"
                    :class="schedule.status === 'active' ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
                  >
                    {{ schedule.status === 'active' ? '중단' : '운행' }}
                  </button>
                  <button
                    @click="deleteSchedule(schedule.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="schedules.length > 0 && pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <nav class="flex items-center justify-between">
          <div class="flex justify-between flex-1 sm:hidden">
            <button
              @click="goToPage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              이전
            </button>
            <button
              @click="goToPage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              다음
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                총 <span class="font-medium">{{ pagination.total }}</span>개 중 
                <span class="font-medium">{{ ((pagination.page - 1) * pagination.limit) + 1 }}</span>-<span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>개 표시
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="goToPage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                <template v-for="page in getPageNumbers()" :key="page">
                  <button
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === pagination.page
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                </template>
                <button
                  @click="goToPage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </nav>
            </div>
          </div>
        </nav>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingSchedule ? '시간표 수정' : '시간표 추가' }}
          </h3>
        </div>
        
        <form @submit.prevent="submitSchedule" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">노선번호 *</label>
              <input
                v-model="scheduleForm.route_number"
                type="text"
                class="form-input"
                placeholder="예: 142"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">노선명 *</label>
              <input
                v-model="scheduleForm.route_name"
                type="text"
                class="form-input"
                placeholder="예: 안성터미널-수원역"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">노선 유형</label>
              <select v-model="scheduleForm.route_type" class="form-select">
                <option value="regular">정규</option>
                <option value="express">급행</option>
                <option value="special">특수</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">출발지 *</label>
              <input
                v-model="scheduleForm.departure"
                type="text"
                class="form-input"
                placeholder="예: 안성터미널"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">도착지 *</label>
              <input
                v-model="scheduleForm.arrival"
                type="text"
                class="form-input"
                placeholder="예: 수원역"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">첫차 시간</label>
              <input
                v-model="scheduleForm.first_bus"
                type="time"
                class="form-input"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">막차 시간</label>
              <input
                v-model="scheduleForm.last_bus"
                type="time"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">배차간격(분)</label>
              <input
                v-model="scheduleForm.interval"
                type="number"
                class="form-input"
                placeholder="예: 30"
                min="1"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">소요시간</label>
              <input
                v-model="scheduleForm.duration"
                type="text"
                class="form-input"
                placeholder="예: 1시간 20분"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">운행 상태</label>
              <select v-model="scheduleForm.status" class="form-select">
                <option value="active">운행 중</option>
                <option value="suspended">임시 중단</option>
                <option value="inactive">운행 종료</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">비고</label>
            <textarea
              v-model="scheduleForm.notes"
              rows="3"
              class="form-textarea"
              placeholder="추가 정보나 특이사항을 입력하세요"
            ></textarea>
          </div>

          <div class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeModal"
              class="btn btn-outline"
            >
              취소
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              {{ isSubmitting ? '처리 중...' : (editingSchedule ? '수정' : '추가') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSchedulesStore } from '@/stores/schedules'

export default {
  name: 'AdminSchedule',
  setup() {
    const schedulesStore = useSchedulesStore()
    
    const searchQuery = ref('')
    const statusFilter = ref('')
    const typeFilter = ref('')
    const currentPage = ref(1)
    const showModal = ref(false)
    const editingSchedule = ref(null)
    const isSubmitting = ref(false)
    
    const isLoading = computed(() => schedulesStore.isLoading)
    const schedules = computed(() => schedulesStore.schedules)
    const pagination = computed(() => schedulesStore.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1
    })

    const totalRoutes = computed(() => {
      if (!Array.isArray(schedules.value)) return 0
      return schedules.value.length
    })
    
    const activeRoutes = computed(() => {
      if (!Array.isArray(schedules.value)) return 0
      return schedules.value.filter(schedule => schedule.status === 'active').length
    })
    
    const suspendedRoutes = computed(() => {
      if (!Array.isArray(schedules.value)) return 0
      return schedules.value.filter(schedule => schedule.status === 'suspended').length
    })
    
    const totalTrips = computed(() => {
      if (!Array.isArray(schedules.value)) return 0
      return schedules.value.reduce((sum, schedule) => {
        const interval = parseInt(schedule.interval) || 30
        const firstBus = schedule.first_bus ? new Date(`1970-01-01T${schedule.first_bus}`) : null
        const lastBus = schedule.last_bus ? new Date(`1970-01-01T${schedule.last_bus}`) : null
        
        if (firstBus && lastBus) {
          const duration = (lastBus - firstBus) / (1000 * 60) // minutes
          return sum + Math.floor(duration / interval) + 1
        }
        return sum
      }, 0)
    })

    const scheduleForm = reactive({
      route_number: '',
      route_name: '',
      route_type: 'regular',
      departure: '',
      arrival: '',
      first_bus: '',
      last_bus: '',
      interval: '',
      duration: '',
      status: 'active',
      notes: ''
    })

    const search = async () => {
      currentPage.value = 1
      await fetchSchedules()
    }

    const resetFilters = async () => {
      searchQuery.value = ''
      statusFilter.value = ''
      typeFilter.value = ''
      currentPage.value = 1
      await fetchSchedules()
    }

    const refreshData = async () => {
      await fetchSchedules()
    }

    const fetchSchedules = async () => {
      const params = {
        page: currentPage.value,
        page_size: 20
      }

      if (searchQuery.value) params.filter = searchQuery.value
      if (statusFilter.value) params.status = statusFilter.value
      if (typeFilter.value) params.route_type = typeFilter.value

      await schedulesStore.fetchSchedules(params)
    }

    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return
      currentPage.value = page
      await fetchSchedules()
    }

    const getPageNumbers = () => {
      const totalPages = pagination.value.totalPages
      const current = pagination.value.page
      const pages = []

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(totalPages)
        } else if (current >= totalPages - 3) {
          pages.push(1)
          pages.push('...')
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i)
          }
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i)
          }
          pages.push('...')
          pages.push(totalPages)
        }
      }

      return pages
    }

    const openCreateModal = () => {
      editingSchedule.value = null
      Object.assign(scheduleForm, {
        route_number: '',
        route_name: '',
        route_type: 'regular',
        departure: '',
        arrival: '',
        first_bus: '',
        last_bus: '',
        interval: '',
        duration: '',
        status: 'active',
        notes: ''
      })
      showModal.value = true
    }

    const editSchedule = (schedule) => {
      editingSchedule.value = schedule
      Object.assign(scheduleForm, {
        route_number: schedule.route_number,
        route_name: schedule.route_name,
        route_type: schedule.route_type || 'regular',
        departure: schedule.departure,
        arrival: schedule.arrival,
        first_bus: schedule.first_bus || '',
        last_bus: schedule.last_bus || '',
        interval: schedule.interval || '',
        duration: schedule.duration || '',
        status: schedule.status || 'active',
        notes: schedule.notes || ''
      })
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      editingSchedule.value = null
    }

    const submitSchedule = async () => {
      try {
        isSubmitting.value = true
        
        if (editingSchedule.value) {
          await schedulesStore.updateSchedule(editingSchedule.value.id, scheduleForm)
          alert('시간표가 수정되었습니다.')
        } else {
          await schedulesStore.createSchedule(scheduleForm)
          alert('시간표가 추가되었습니다.')
        }
        
        closeModal()
        await fetchSchedules()
        
      } catch (error) {
        console.error('시간표 저장 실패:', error)
        alert('시간표 저장에 실패했습니다.')
      } finally {
        isSubmitting.value = false
      }
    }

    const viewSchedule = (schedule) => {
      window.open(`/schedule/${schedule.id}`, '_blank')
    }

    const toggleStatus = async (schedule) => {
      const newStatus = schedule.status === 'active' ? 'suspended' : 'active'
      
      try {
        await schedulesStore.updateSchedule(schedule.id, {
          ...schedule,
          status: newStatus
        })
        
        alert(`시간표가 ${newStatus === 'active' ? '운행 중' : '중단'}으로 변경되었습니다.`)
        await fetchSchedules()
      } catch (error) {
        console.error('운행 상태 변경 실패:', error)
        alert('운행 상태 변경에 실패했습니다.')
      }
    }

    const deleteSchedule = async (id) => {
      if (!confirm('정말 삭제하시겠습니까?')) return

      try {
        await schedulesStore.deleteSchedule(id)
        alert('시간표가 삭제되었습니다.')
        await fetchSchedules()
      } catch (error) {
        console.error('시간표 삭제 실패:', error)
        alert('시간표 삭제에 실패했습니다.')
      }
    }

    onMounted(() => {
      fetchSchedules()
    })

    return {
      searchQuery,
      statusFilter,
      typeFilter,
      isLoading,
      schedules,
      pagination,
      totalRoutes,
      activeRoutes,
      suspendedRoutes,
      totalTrips,
      showModal,
      editingSchedule,
      isSubmitting,
      scheduleForm,
      search,
      resetFilters,
      refreshData,
      goToPage,
      getPageNumbers,
      openCreateModal,
      editSchedule,
      closeModal,
      submitSchedule,
      viewSchedule,
      toggleStatus,
      deleteSchedule
    }
  }
}
</script>