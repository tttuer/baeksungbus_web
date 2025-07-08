<template>
  <div class="admin-notice">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">공지사항 관리</h1>
          <p class="text-gray-600">공지사항을 등록, 수정, 삭제할 수 있습니다</p>
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
            공지사항 작성
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">전체 공지</p>
            <p class="text-2xl font-bold text-gray-900">{{ pagination.total || 0 }}</p>
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
            <p class="text-sm font-medium text-gray-600">공개 중</p>
            <p class="text-2xl font-bold text-gray-900">{{ publishedCount }}</p>
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
            <p class="text-sm font-medium text-gray-600">비공개</p>
            <p class="text-2xl font-bold text-gray-900">{{ unpublishedCount }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">중요 공지</p>
            <p class="text-2xl font-bold text-gray-900">{{ importantCount }}</p>
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
              placeholder="제목, 내용 검색"
              class="form-input pl-10"
              @keyup.enter="search"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">공개 상태</label>
          <select v-model="publishStatus" class="form-select">
            <option value="">전체</option>
            <option value="true">공개</option>
            <option value="false">비공개</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">중요도</label>
          <select v-model="importanceFilter" class="form-select">
            <option value="">전체</option>
            <option value="true">중요</option>
            <option value="false">일반</option>
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

    <!-- Notices Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">공지사항 목록</h3>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-gray-600">로딩 중...</span>
      </div>

      <div v-else-if="!Array.isArray(notices) || notices.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">공지사항이 없습니다</h3>
        <p class="text-gray-600">새 공지사항을 작성해보세요.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작성자
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                조회수
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="notice in notices" :key="notice.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <svg v-if="notice.important" class="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                      <div class="text-sm font-medium text-gray-900">
                        {{ notice.title }}
                      </div>
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ notice.content }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ notice.writer || '관리자' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(notice.c_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span v-if="notice.published" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    공개
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                    </svg>
                    비공개
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ notice.views || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="viewNotice(notice)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    보기
                  </button>
                  <button
                    @click="editNotice(notice)"
                    class="text-indigo-600 hover:text-indigo-800"
                  >
                    수정
                  </button>
                  <button
                    @click="togglePublish(notice)"
                    :class="notice.published ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'"
                  >
                    {{ notice.published ? '비공개' : '공개' }}
                  </button>
                  <button
                    @click="deleteNotice(notice.id)"
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
      <div v-if="Array.isArray(notices) && notices.length > 0 && pagination.totalPages > 1" class="px-6 py-4 border-t border-gray-200">
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
            {{ editingNotice ? '공지사항 수정' : '공지사항 작성' }}
          </h3>
        </div>
        
        <form @submit.prevent="submitNotice" class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
              <input
                v-model="noticeForm.title"
                type="text"
                class="form-input"
                placeholder="공지사항 제목을 입력하세요"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">작성자</label>
              <input
                v-model="noticeForm.writer"
                type="text"
                class="form-input"
                placeholder="작성자명"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
            <textarea
              v-model="noticeForm.content"
              rows="10"
              class="form-textarea"
              placeholder="공지사항 내용을 입력하세요"
              required
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="flex items-center">
              <input
                id="published"
                v-model="noticeForm.published"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="published" class="ml-2 block text-sm text-gray-900">
                즉시 공개
              </label>
            </div>

            <div class="flex items-center">
              <input
                id="important"
                v-model="noticeForm.important"
                type="checkbox"
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label for="important" class="ml-2 block text-sm text-gray-900">
                중요 공지
              </label>
            </div>

            <div class="flex items-center">
              <input
                id="pinned"
                v-model="noticeForm.pinned"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="pinned" class="ml-2 block text-sm text-gray-900">
                상단 고정
              </label>
            </div>
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
              {{ isSubmitting ? '처리 중...' : (editingNotice ? '수정' : '등록') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useNoticesStore } from '@/stores/notices'

export default {
  name: 'AdminNotice',
  setup() {
    const noticesStore = useNoticesStore()
    
    const searchQuery = ref('')
    const publishStatus = ref('')
    const importanceFilter = ref('')
    const currentPage = ref(1)
    const showModal = ref(false)
    const editingNotice = ref(null)
    const isSubmitting = ref(false)
    
    const isLoading = computed(() => noticesStore.isLoading)
    const notices = computed(() => noticesStore.notices)
    const pagination = computed(() => noticesStore.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 1
    })

    const publishedCount = computed(() => {
      if (!Array.isArray(notices.value)) return 0
      return notices.value.filter(notice => notice.published).length
    })
    
    const unpublishedCount = computed(() => {
      if (!Array.isArray(notices.value)) return 0
      return notices.value.filter(notice => !notice.published).length
    })
    
    const importantCount = computed(() => {
      if (!Array.isArray(notices.value)) return 0
      return notices.value.filter(notice => notice.important).length
    })

    const noticeForm = reactive({
      title: '',
      content: '',
      writer: '관리자',
      published: true,
      important: false,
      pinned: false
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
      await fetchNotices()
    }

    const resetFilters = async () => {
      searchQuery.value = ''
      publishStatus.value = ''
      importanceFilter.value = ''
      currentPage.value = 1
      await fetchNotices()
    }

    const refreshData = async () => {
      await fetchNotices()
    }

    const fetchNotices = async () => {
      const params = {
        page: currentPage.value,
        page_size: 20
      }

      if (searchQuery.value) params.filter = searchQuery.value
      if (publishStatus.value) params.published = publishStatus.value === 'true'
      if (importanceFilter.value) params.important = importanceFilter.value === 'true'

      await noticesStore.fetchNotices(params)
    }

    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return
      currentPage.value = page
      await fetchNotices()
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
      editingNotice.value = null
      Object.assign(noticeForm, {
        title: '',
        content: '',
        writer: '관리자',
        published: true,
        important: false,
        pinned: false
      })
      showModal.value = true
    }

    const editNotice = (notice) => {
      editingNotice.value = notice
      Object.assign(noticeForm, {
        title: notice.title,
        content: notice.content,
        writer: notice.writer || '관리자',
        published: notice.published,
        important: notice.important,
        pinned: notice.pinned
      })
      showModal.value = true
    }

    const closeModal = () => {
      showModal.value = false
      editingNotice.value = null
    }

    const submitNotice = async () => {
      try {
        isSubmitting.value = true
        
        if (editingNotice.value) {
          await noticesStore.updateNotice(editingNotice.value.id, noticeForm)
          alert('공지사항이 수정되었습니다.')
        } else {
          await noticesStore.createNotice(noticeForm)
          alert('공지사항이 등록되었습니다.')
        }
        
        closeModal()
        await fetchNotices()
        
      } catch (error) {
        console.error('공지사항 저장 실패:', error)
        alert('공지사항 저장에 실패했습니다.')
      } finally {
        isSubmitting.value = false
      }
    }

    const viewNotice = (notice) => {
      window.open(`/notice/${notice.id}`, '_blank')
    }

    const togglePublish = async (notice) => {
      try {
        await noticesStore.updateNotice(notice.id, {
          ...notice,
          published: !notice.published
        })
        
        alert(`공지사항이 ${!notice.published ? '공개' : '비공개'}되었습니다.`)
        await fetchNotices()
      } catch (error) {
        console.error('공개 상태 변경 실패:', error)
        alert('공개 상태 변경에 실패했습니다.')
      }
    }

    const deleteNotice = async (id) => {
      if (!confirm('정말 삭제하시겠습니까?')) return

      try {
        await noticesStore.deleteNotice(id)
        alert('공지사항이 삭제되었습니다.')
        await fetchNotices()
      } catch (error) {
        console.error('공지사항 삭제 실패:', error)
        alert('공지사항 삭제에 실패했습니다.')
      }
    }

    onMounted(() => {
      fetchNotices()
    })

    return {
      searchQuery,
      publishStatus,
      importanceFilter,
      isLoading,
      notices,
      pagination,
      publishedCount,
      unpublishedCount,
      importantCount,
      showModal,
      editingNotice,
      isSubmitting,
      noticeForm,
      formatDate,
      search,
      resetFilters,
      refreshData,
      goToPage,
      getPageNumbers,
      openCreateModal,
      editNotice,
      closeModal,
      submitNotice,
      viewNotice,
      togglePublish,
      deleteNotice
    }
  }
}
</script>