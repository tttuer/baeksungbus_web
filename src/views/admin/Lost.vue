<template>
  <div class="admin-lost">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">분실물 관리</h1>
          <p class="text-gray-600">분실물 신고를 확인하고 처리 상태를 관리할 수 있습니다</p>
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
            @click="exportToExcel"
            class="btn btn-outline"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            </svg>
            엑셀 다운로드
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">전체 신고</p>
            <p class="text-2xl font-bold text-gray-900">{{ pagination.total || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">처리 중</p>
            <p class="text-2xl font-bold text-gray-900">{{ processingCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-gray-100 rounded-lg">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">처리 완료</p>
            <p class="text-2xl font-bold text-gray-900">{{ completedCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">오늘 신고</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayCount }}</p>
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
              placeholder="제목, 내용, 작성자 검색"
              class="form-input pl-10"
              @keyup.enter="search"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">처리 상태</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">전체</option>
            <option value="false">처리 중</option>
            <option value="true">처리 완료</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">기간</label>
          <select v-model="dateFilter" class="form-select">
            <option value="">전체</option>
            <option value="today">오늘</option>
            <option value="week">일주일</option>
            <option value="month">한달</option>
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

    <!-- Lost Items Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">분실물 신고 목록</h3>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-gray-600">로딩 중...</span>
      </div>

      <div v-else-if="lostItems.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">분실물 신고가 없습니다</h3>
        <p class="text-gray-600">검색 조건을 변경해보세요.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신고자 정보
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                신고일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                처리상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in lostItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <div class="text-sm font-medium text-gray-900">
                        {{ item.title }}
                      </div>
                      <svg v-if="item.hidden" class="w-4 h-4 text-yellow-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ item.content }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.writer }}</div>
                <div class="text-sm text-gray-500">{{ item.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(item.c_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="!item.done" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                  처리 중
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  처리 완료
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewDetail(item)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    상세보기
                  </button>
                  <button
                    @click="toggleStatus(item)"
                    :class="item.done ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
                  >
                    {{ item.done ? '처리중으로' : '완료처리' }}
                  </button>
                  <button
                    @click="contactOwner(item)"
                    class="text-purple-600 hover:text-purple-800"
                  >
                    연락하기
                  </button>
                  <button
                    @click="deleteItem(item.id)"
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
      <div v-if="lostItems.length > 0 && pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
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

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">분실물 상세 정보</h3>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="selectedItem" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">제목</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedItem.title }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">신고자</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedItem.writer }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">이메일</label>
              <p class="mt-1 text-sm text-gray-900">{{ selectedItem.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">신고일</label>
              <p class="mt-1 text-sm text-gray-900">{{ formatDate(selectedItem.c_date) }}</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">내용</label>
            <div class="mt-1 p-3 bg-gray-50 rounded-md">
              <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ selectedItem.content }}</p>
            </div>
          </div>

          <div v-if="selectedItem.attachment" class="border-t pt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
            <div class="flex items-center p-3 bg-gray-50 rounded-lg">
              <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">첨부파일</p>
              </div>
              <a 
                :href="selectedItem.attachment" 
                download 
                class="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                다운로드
              </a>
            </div>
          </div>

          <div class="flex items-center justify-between pt-4 border-t">
            <div class="flex items-center space-x-4">
              <span v-if="!selectedItem.done" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                처리 중
              </span>
              <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                처리 완료
              </span>
            </div>
            <div class="flex space-x-2">
              <button
                @click="toggleStatus(selectedItem)"
                :class="[
                  'btn',
                  selectedItem.done ? 'btn-outline' : 'btn-primary'
                ]"
              >
                {{ selectedItem.done ? '처리 중으로 변경' : '완료 처리' }}
              </button>
              <button @click="contactOwner(selectedItem)" class="btn btn-outline">
                연락하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQAsStore } from '@/stores/qas'

export default {
  name: 'AdminLost',
  setup() {
    const qasStore = useQAsStore()
    
    const searchQuery = ref('')
    const statusFilter = ref('')
    const dateFilter = ref('')
    const currentPage = ref(1)
    const showDetailModal = ref(false)
    const selectedItem = ref(null)
    
    const isLoading = computed(() => qasStore.isLoading)
    const lostItems = computed(() => qasStore.qas)
    const pagination = computed(() => qasStore.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1
    })

    const processingCount = computed(() => 
      lostItems.value.filter(item => !item.done).length
    )
    
    const completedCount = computed(() => 
      lostItems.value.filter(item => item.done).length
    )
    
    const todayCount = computed(() => {
      const today = new Date().toDateString()
      return lostItems.value.filter(item => 
        new Date(item.c_date).toDateString() === today
      ).length
    })

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const search = async () => {
      currentPage.value = 1
      await fetchLostItems()
    }

    const resetFilters = async () => {
      searchQuery.value = ''
      statusFilter.value = ''
      dateFilter.value = ''
      currentPage.value = 1
      await fetchLostItems()
    }

    const refreshData = async () => {
      await fetchLostItems()
    }

    const fetchLostItems = async () => {
      const params = {
        qa_type: 'LOST',
        page: currentPage.value,
        page_size: 20
      }

      if (searchQuery.value) params.filter = searchQuery.value
      if (statusFilter.value) params.done = statusFilter.value === 'true'
      if (dateFilter.value) {
        const now = new Date()
        let fromDate
        
        switch (dateFilter.value) {
          case 'today':
            fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            break
          case 'week':
            fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            break
        }
        
        if (fromDate) {
          params.from_date = fromDate.toISOString().split('T')[0]
        }
      }

      await qasStore.fetchQAs(params)
    }

    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return
      currentPage.value = page
      await fetchLostItems()
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

    const viewDetail = (item) => {
      selectedItem.value = item
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedItem.value = null
    }

    const toggleStatus = async (item) => {
      try {
        const newStatus = !item.done
        await qasStore.updateQA(item.id, {
          ...item,
          done: newStatus
        })
        
        alert(`분실물이 ${newStatus ? '완료 처리' : '처리 중으로'}되었습니다.`)
        await fetchLostItems()
        
        if (selectedItem.value && selectedItem.value.id === item.id) {
          selectedItem.value.done = newStatus
        }
      } catch (error) {
        console.error('상태 변경 실패:', error)
        alert('상태 변경에 실패했습니다.')
      }
    }

    const contactOwner = (item) => {
      const message = `분실물 관련 연락드립니다.\n\n제목: ${item.title}\n신고자: ${item.writer}\n이메일: ${item.email}\n\n백성운수 담당자`
      
      // 실제로는 이메일 발송 API를 호출하거나 메일 클라이언트를 열어야 함
      if (confirm(`${item.writer}님께 연락하시겠습니까?\n\n${message}`)) {
        // 메일 클라이언트 열기
        const subject = encodeURIComponent(`[백성운수] 분실물 관련 연락 - ${item.title}`)
        const body = encodeURIComponent(message)
        window.location.href = `mailto:${item.email}?subject=${subject}&body=${body}`
      }
    }

    const deleteItem = async (id) => {
      if (!confirm('정말 삭제하시겠습니까?')) return

      try {
        await qasStore.deleteQA(id)
        alert('분실물 신고가 삭제되었습니다.')
        await fetchLostItems()
      } catch (error) {
        console.error('삭제 실패:', error)
        alert('삭제에 실패했습니다.')
      }
    }

    const exportToExcel = async () => {
      try {
        // 실제로는 백엔드 API를 호출해서 엑셀 파일을 다운로드
        alert('엑셀 다운로드 기능을 준비 중입니다.')
      } catch (error) {
        console.error('엑셀 다운로드 실패:', error)
        alert('엑셀 다운로드에 실패했습니다.')
      }
    }

    onMounted(() => {
      fetchLostItems()
    })

    return {
      searchQuery,
      statusFilter,
      dateFilter,
      isLoading,
      lostItems,
      pagination,
      processingCount,
      completedCount,
      todayCount,
      showDetailModal,
      selectedItem,
      formatDate,
      search,
      resetFilters,
      refreshData,
      goToPage,
      getPageNumbers,
      viewDetail,
      closeDetailModal,
      toggleStatus,
      contactOwner,
      deleteItem,
      exportToExcel
    }
  }
}
</script>