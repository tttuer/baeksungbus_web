<template>
  <div class="qa-detail">
    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- QA Content -->
    <div v-else-if="qa" class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500">
        <router-link to="/" class="hover:text-primary-600">홈</router-link>
        <span class="mx-2">/</span>
        <router-link to="/qa" class="hover:text-primary-600">Q&A</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-900">{{ qa.title }}</span>
      </nav>

      <!-- Question -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <span class="bg-blue-100 text-blue-800 px-2 py-1 text-sm font-medium rounded">
                질문
              </span>
              <span 
                class="px-2 py-1 text-sm font-medium rounded"
                :class="getStatusClass(qa.status)"
              >
                {{ getStatusLabel(qa.status) }}
              </span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-3">{{ qa.title }}</h1>
            <div class="flex items-center text-sm text-gray-500 gap-4">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ qa.author_name }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                {{ qa.email }}
              </span>
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ formatDate(qa.created_at) }}
              </span>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 ml-4" v-if="canEditQA">
            <router-link 
              :to="`/qa/${qa.id}/update`"
              class="btn btn-outline btn-sm"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              수정
            </router-link>
            <button @click="deleteQA" class="btn bg-red-600 text-white hover:bg-red-700 btn-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              삭제
            </button>
          </div>
        </div>

        <!-- Question Content -->
        <div class="prose prose-lg max-w-none mb-6">
          <div v-html="formatContent(qa.content)"></div>
        </div>

        <!-- Question Attachments -->
        <div v-if="qa.file_name || qa.file_data" class="pt-4 border-t border-gray-200">
          <h4 class="font-medium mb-2">첨부파일</h4>
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
            <span class="flex-1">{{ qa.file_name }}</span>
            <button 
              @click="downloadFile(qa.file_data, qa.file_name)"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              다운로드
            </button>
          </div>
        </div>
      </div>

      <!-- Answer -->
      <div v-if="qa.answer" class="card p-6">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">관리자 답변</h2>
            <p class="text-sm text-gray-500">{{ formatDate(qa.answer.created_at) }}</p>
          </div>
        </div>

        <div class="prose prose-lg max-w-none">
          <div v-html="formatContent(qa.answer.content)"></div>
        </div>

        <!-- Answer Attachments -->
        <div v-if="qa.answer.file_name || qa.answer.file_data" class="mt-4 pt-4 border-t border-gray-200">
          <h4 class="font-medium mb-2">첨부파일</h4>
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg class="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
            </svg>
            <span class="flex-1">{{ qa.answer.file_name }}</span>
            <button 
              @click="downloadFile(qa.answer.file_data, qa.answer.file_name)"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              다운로드
            </button>
          </div>
        </div>
      </div>

      <!-- No Answer Yet -->
      <div v-else class="card p-6">
        <div class="text-center py-8">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">답변 대기 중</h3>
          <p class="text-gray-600">관리자가 검토 중입니다. 빠른 시일 내에 답변드리겠습니다.</p>
        </div>
      </div>

      <!-- Admin Answer Form -->
      <div v-if="canAnswer && !qa.answer" class="card p-6">
        <h3 class="text-lg font-semibold mb-4">답변 작성</h3>
        <form @submit.prevent="submitAnswer">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">답변 내용</label>
            <textarea
              v-model="answerForm.content"
              rows="6"
              class="form-textarea"
              placeholder="답변을 입력하세요..."
              required
            ></textarea>
          </div>
          
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
            <input
              type="file"
              @change="handleAnswerFile"
              class="form-input"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.hwp"
            >
            <p class="text-sm text-gray-500 mt-1">
              JPG, PNG, PDF, DOC, HWP 파일만 업로드 가능 (최대 10MB)
            </p>
          </div>
          
          <div class="flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
              <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              {{ isSubmitting ? '답변 등록 중...' : '답변 등록' }}
            </button>
            <button type="button" @click="cancelAnswer" class="btn btn-outline">
              취소
            </button>
          </div>
        </form>
      </div>

      <!-- Navigation -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">다른 Q&A</h3>
        <div class="space-y-3">
          <!-- Previous QA -->
          <div v-if="previousQA" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center flex-1">
              <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <div>
                <p class="text-sm text-gray-500">이전글</p>
                <router-link 
                  :to="`/qa/${previousQA.id}`"
                  class="text-gray-900 hover:text-primary-600 font-medium"
                >
                  {{ previousQA.title }}
                </router-link>
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ formatDate(previousQA.created_at) }}</span>
          </div>
          
          <!-- Next QA -->
          <div v-if="nextQA" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="flex items-center flex-1">
              <svg class="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              <div>
                <p class="text-sm text-gray-500">다음글</p>
                <router-link 
                  :to="`/qa/${nextQA.id}`"
                  class="text-gray-900 hover:text-primary-600 font-medium"
                >
                  {{ nextQA.title }}
                </router-link>
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ formatDate(nextQA.created_at) }}</span>
          </div>
          
          <div v-if="!previousQA && !nextQA" class="text-center py-4 text-gray-500">
            다른 Q&A가 없습니다.
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <router-link to="/qa" class="btn btn-outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          목록으로
        </router-link>
        
        <router-link to="/qa/form" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          새 문의하기
        </router-link>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="card p-12 text-center">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Q&A를 찾을 수 없습니다</h3>
      <p class="text-gray-600 mb-4">요청하신 Q&A가 존재하지 않거나 삭제되었습니다.</p>
      <router-link to="/qa" class="btn btn-primary">
        Q&A 목록으로
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQAsStore } from '@/stores/qas'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'QADetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const qasStore = useQAsStore()
    const authStore = useAuthStore()
    
    const qa = ref(null)
    const previousQA = ref(null)
    const nextQA = ref(null)
    const isLoading = ref(true)
    const isSubmitting = ref(false)

    const answerForm = reactive({
      content: '',
      file: null
    })

    const canEditQA = computed(() => {
      return authStore.isAdmin || (qa.value && qa.value.author_email === authStore.user?.email)
    })
    const canAnswer = computed(() => authStore.isAdmin)

    const getStatusClass = (status) => {
      return status === 'answered' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    }

    const getStatusLabel = (status) => {
      return status === 'answered' ? '답변완료' : '답변대기'
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatContent = (content) => {
      if (!content) return ''
      return content.replace(/\n/g, '<br>')
    }

    const downloadFile = (fileData, fileName) => {
      if (fileData && fileName) {
        const blob = new Blob([fileData])
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }

    const handleAnswerFile = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('파일 크기는 10MB를 초과할 수 없습니다.')
          event.target.value = ''
          return
        }
        answerForm.file = file
      }
    }

    const submitAnswer = async () => {
      try {
        isSubmitting.value = true
        
        const answerData = {
          qa_id: qa.value.id,
          content: answerForm.content,
          file: answerForm.file
        }
        
        // API 호출 (실제 구현 필요)
        // await answersStore.createAnswer(answerData)
        
        alert('답변이 등록되었습니다.')
        await loadQA() // 답변 등록 후 다시 로드
        
        // 폼 초기화
        answerForm.content = ''
        answerForm.file = null
        
      } catch (error) {
        console.error('답변 등록 실패:', error)
        alert('답변 등록에 실패했습니다.')
      } finally {
        isSubmitting.value = false
      }
    }

    const cancelAnswer = () => {
      answerForm.content = ''
      answerForm.file = null
    }

    const deleteQA = async () => {
      if (confirm('정말로 이 Q&A를 삭제하시겠습니까?')) {
        try {
          await qasStore.deleteQA(qa.value.id)
          alert('Q&A가 삭제되었습니다.')
          router.push('/qa')
        } catch (error) {
          alert('삭제에 실패했습니다.')
        }
      }
    }

    const loadQA = async () => {
      try {
        isLoading.value = true
        const id = route.params.id
        
        qa.value = await qasStore.fetchQAById(id)
        
        // 이전/다음 Q&A 정보 (더미 데이터)
        if (parseInt(id) > 1) {
          previousQA.value = {
            id: parseInt(id) - 1,
            title: '이전 Q&A 제목',
            created_at: '2024-01-14'
          }
        }
        
        nextQA.value = {
          id: parseInt(id) + 1,
          title: '다음 Q&A 제목',
          created_at: '2024-01-16'
        }
        
      } catch (error) {
        console.error('Q&A 로드 실패:', error)
        qa.value = null
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      loadQA()
    })

    return {
      qa,
      previousQA,
      nextQA,
      isLoading,
      isSubmitting,
      answerForm,
      canEditQA,
      canAnswer,
      getStatusClass,
      getStatusLabel,
      formatDate,
      formatContent,
      downloadFile,
      handleAnswerFile,
      submitAnswer,
      cancelAnswer,
      deleteQA
    }
  }
}
</script>