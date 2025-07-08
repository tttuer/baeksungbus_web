<template>
  <div class="admin-customer-detail">
    <!-- Breadcrumb -->
    <nav class="flex mb-8" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/adm/dashboard" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
            <svg class="w-3 h-3 mr-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            대시보드
          </router-link>
        </li>
        <li>
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <router-link to="/adm/customer" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
              고객 문의
            </router-link>
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="ml-1 text-sm font-medium text-gray-500 md:ml-2">문의 상세</span>
          </div>
        </li>
      </ol>
    </nav>

    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <span class="ml-2 text-gray-600">로딩 중...</span>
    </div>

    <div v-else-if="!inquiry" class="text-center py-12">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">문의를 찾을 수 없습니다</h3>
      <router-link to="/adm/customer" class="text-blue-600 hover:text-blue-800">
        목록으로 돌아가기
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <h1 class="text-2xl font-bold text-gray-900">{{ inquiry.title }}</h1>
            <span v-if="inquiry.hidden" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              비밀글
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <span v-if="inquiry.answered" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              답변완료
            </span>
            <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              미답변
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="font-medium">작성자:</span>
            <span class="ml-1">{{ inquiry.writer }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span class="font-medium">이메일:</span>
            <span class="ml-1">{{ inquiry.email }}</span>
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-medium">등록일:</span>
            <span class="ml-1">{{ formatDate(inquiry.c_date) }}</span>
          </div>
        </div>
      </div>

      <!-- Customer Inquiry Content -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">문의 내용</h2>
        <div class="prose max-w-none">
          <div class="whitespace-pre-wrap text-gray-700">{{ inquiry.content }}</div>
        </div>

        <!-- Attachments -->
        <div v-if="inquiry.attachment" class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-900 mb-3">첨부파일</h3>
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg class="w-8 h-8 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ getFileName(inquiry.attachment) }}</p>
              <p class="text-sm text-gray-500">첨부파일</p>
            </div>
            <a 
              :href="inquiry.attachment" 
              download 
              class="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              다운로드
            </a>
          </div>
        </div>
      </div>

      <!-- Admin Answer Section -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">관리자 답변</h2>
        
        <div v-if="inquiry.answer" class="mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-blue-900">관리자</p>
                  <p class="text-xs text-blue-700">{{ formatDate(inquiry.answer_date) }}</p>
                </div>
              </div>
            </div>
            <div class="whitespace-pre-wrap text-blue-800">{{ inquiry.answer }}</div>
          </div>
        </div>

        <!-- Answer Form -->
        <form @submit.prevent="submitAnswer">
          <div class="mb-4">
            <label for="answer" class="block text-sm font-medium text-gray-700 mb-2">
              {{ inquiry.answer ? '답변 수정' : '답변 작성' }}
            </label>
            <textarea
              id="answer"
              v-model="answerForm.content"
              rows="6"
              class="form-textarea"
              placeholder="고객 문의에 대한 답변을 작성해주세요..."
              required
            ></textarea>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <router-link to="/adm/customer" class="btn btn-outline">
                목록으로
              </router-link>
              <button
                type="button"
                @click="deleteInquiry"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                문의 삭제
              </button>
            </div>
            
            <div class="flex items-center space-x-2">
              <button
                v-if="inquiry.answer"
                type="button"
                @click="deleteAnswer"
                class="btn btn-outline text-red-600 border-red-300 hover:bg-red-50"
                :disabled="isSubmitting"
              >
                답변 삭제
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting || !answerForm.content.trim()"
              >
                <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                {{ isSubmitting ? '처리 중...' : (inquiry.answer ? '답변 수정' : '답변 등록') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQAsStore } from '@/stores/qas'

export default {
  name: 'AdminCustomerDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const qasStore = useQAsStore()
    
    const isLoading = ref(true)
    const isSubmitting = ref(false)
    const inquiry = ref(null)
    
    const answerForm = reactive({
      content: ''
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getFileName = (url) => {
      if (!url) return ''
      const parts = url.split('/')
      return parts[parts.length - 1]
    }

    const loadInquiry = async () => {
      try {
        isLoading.value = true
        const inquiryData = await qasStore.fetchQA(route.params.id)
        inquiry.value = inquiryData
        
        // 기존 답변이 있으면 폼에 채우기
        if (inquiryData.answer) {
          answerForm.content = inquiryData.answer
        }
      } catch (error) {
        console.error('문의 로드 실패:', error)
        alert('문의를 불러오는데 실패했습니다.')
      } finally {
        isLoading.value = false
      }
    }

    const submitAnswer = async () => {
      if (!answerForm.content.trim()) {
        alert('답변 내용을 입력해주세요.')
        return
      }

      try {
        isSubmitting.value = true
        
        await qasStore.answerQA(inquiry.value.id, {
          answer: answerForm.content.trim()
        })
        
        alert('답변이 등록되었습니다.')
        await loadInquiry() // 답변 등록 후 다시 로드
        
      } catch (error) {
        console.error('답변 등록 실패:', error)
        alert('답변 등록에 실패했습니다.')
      } finally {
        isSubmitting.value = false
      }
    }

    const deleteAnswer = async () => {
      if (!confirm('답변을 삭제하시겠습니까?')) return

      try {
        await qasStore.deleteAnswer(inquiry.value.id)
        alert('답변이 삭제되었습니다.')
        await loadInquiry()
      } catch (error) {
        console.error('답변 삭제 실패:', error)
        alert('답변 삭제에 실패했습니다.')
      }
    }

    const deleteInquiry = async () => {
      if (!confirm('문의를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return

      try {
        await qasStore.deleteQA(inquiry.value.id)
        alert('문의가 삭제되었습니다.')
        router.push('/adm/customer')
      } catch (error) {
        console.error('문의 삭제 실패:', error)
        alert('문의 삭제에 실패했습니다.')
      }
    }

    onMounted(() => {
      loadInquiry()
    })

    return {
      isLoading,
      isSubmitting,
      inquiry,
      answerForm,
      formatDate,
      getFileName,
      submitAnswer,
      deleteAnswer,
      deleteInquiry
    }
  }
}
</script>