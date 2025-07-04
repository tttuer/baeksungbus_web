<template>
  <div class="qa-form">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">문의하기</h1>
      <p class="text-gray-600">궁금한 점이나 건의사항을 남겨주세요. 빠른 시일 내에 답변드리겠습니다.</p>
    </div>

    <!-- Form -->
    <div class="card p-6">
      <form @submit.prevent="submitForm">
        <!-- Personal Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              이름 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.author_name"
              type="text"
              class="form-input"
              placeholder="이름을 입력하세요"
              required
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              이메일 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="이메일을 입력하세요"
              required
            >
            <p class="text-sm text-gray-500 mt-1">답변을 받을 이메일 주소입니다.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              연락처
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="연락처를 입력하세요"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              문의 유형
            </label>
            <select v-model="form.category" class="form-select">
              <option value="">선택하세요</option>
              <option value="schedule">시간표 문의</option>
              <option value="route">노선 문의</option>
              <option value="lost">분실물 문의</option>
              <option value="complaint">불편사항</option>
              <option value="suggestion">건의사항</option>
              <option value="other">기타</option>
            </select>
          </div>
        </div>

        <!-- Title -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            제목 <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="문의 제목을 입력하세요"
            required
          >
        </div>

        <!-- Content -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            내용 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.content"
            rows="8"
            class="form-textarea"
            placeholder="문의 내용을 자세히 작성해주세요"
            required
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">
            {{ form.content.length }}/1000자
          </p>
        </div>

        <!-- File Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            첨부파일
          </label>
          <div class="mt-2">
            <input
              type="file"
              @change="handleFileUpload"
              class="form-input"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.hwp"
            >
          </div>
          <p class="text-sm text-gray-500 mt-1">
            JPG, PNG, PDF, DOC, HWP 파일만 업로드 가능 (최대 10MB)
          </p>
          
          <!-- File Preview -->
          <div v-if="form.file" class="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
              </svg>
              <span class="text-sm text-gray-700">{{ form.file.name }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ formatFileSize(form.file.size) }})</span>
            </div>
            <button type="button" @click="removeFile" class="text-red-600 hover:text-red-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Privacy Agreement -->
        <div class="mb-6">
          <div class="flex items-start">
            <input
              v-model="form.privacy_agreed"
              type="checkbox"
              id="privacy"
              class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              required
            >
            <label for="privacy" class="ml-2 text-sm text-gray-700">
              <span class="text-red-500">*</span>
              개인정보 수집 및 이용에 동의합니다.
              <button type="button" @click="showPrivacyModal = true" class="text-primary-600 hover:text-primary-700 underline ml-1">
                자세히 보기
              </button>
            </label>
          </div>
        </div>

        <!-- CAPTCHA (Optional) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            보안문자 <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <input
                v-model="form.captcha"
                type="text"
                class="form-input"
                placeholder="보안문자를 입력하세요"
                required
              >
            </div>
            <div class="bg-gray-100 p-3 rounded border">
              <img v-if="captchaImage" :src="captchaImage" alt="보안문자" class="h-12">
              <div v-else class="h-12 flex items-center justify-center text-gray-500">
                로딩 중...
              </div>
            </div>
            <button type="button" @click="refreshCaptcha" class="btn btn-outline btn-sm">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              새로고침
            </button>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4 justify-end">
          <router-link to="/qa" class="btn btn-outline">
            취소
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            <svg v-if="isSubmitting" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            {{ isSubmitting ? '등록 중...' : '문의 등록' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Privacy Modal -->
    <div v-if="showPrivacyModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">개인정보 수집 및 이용 동의</h3>
            <button @click="showPrivacyModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h4 class="font-semibold mb-2">1. 개인정보 수집 목적</h4>
              <p>고객 문의 접수 및 답변, 서비스 개선을 위한 분석</p>
            </div>
            
            <div>
              <h4 class="font-semibold mb-2">2. 수집하는 개인정보 항목</h4>
              <ul class="list-disc ml-4">
                <li>필수: 이름, 이메일</li>
                <li>선택: 연락처, 첨부파일</li>
              </ul>
            </div>
            
            <div>
              <h4 class="font-semibold mb-2">3. 개인정보 보유 및 이용기간</h4>
              <p>문의 답변 완료 후 1년간 보관 후 파기</p>
            </div>
            
            <div>
              <h4 class="font-semibold mb-2">4. 개인정보 제공 거부권</h4>
              <p>개인정보 수집에 동의하지 않을 권리가 있으나, 동의 거부 시 문의 서비스 이용이 제한될 수 있습니다.</p>
            </div>
          </div>
          
          <div class="flex justify-end mt-6">
            <button @click="showPrivacyModal = false" class="btn btn-primary">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQAsStore } from '@/stores/qas'

export default {
  name: 'QAForm',
  setup() {
    const router = useRouter()
    const qasStore = useQAsStore()
    
    const isSubmitting = ref(false)
    const showPrivacyModal = ref(false)
    const captchaImage = ref(null)

    const form = reactive({
      author_name: '',
      email: '',
      phone: '',
      category: '',
      title: '',
      content: '',
      file: null,
      privacy_agreed: false,
      captcha: ''
    })

    const handleFileUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        // 파일 크기 검증 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert('파일 크기는 10MB를 초과할 수 없습니다.')
          event.target.value = ''
          return
        }
        
        // 파일 형식 검증
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!allowedTypes.includes(file.type)) {
          alert('지원하지 않는 파일 형식입니다.')
          event.target.value = ''
          return
        }
        
        form.file = file
      }
    }

    const removeFile = () => {
      form.file = null
      // 파일 input 초기화
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) {
        fileInput.value = ''
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const loadCaptcha = async () => {
      try {
        // 실제로는 API에서 캡차 이미지를 가져와야 함
        // const response = await api.get('/api/captcha')
        // captchaImage.value = response.data.image
        
        // 더미 캡차 이미지
        captchaImage.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzMzIj5BQkNEMTI8L3RleHQ+PC9zdmc+'
      } catch (error) {
        console.error('캡차 로드 실패:', error)
      }
    }

    const refreshCaptcha = () => {
      form.captcha = ''
      loadCaptcha()
    }

    const submitForm = async () => {
      // 폼 유효성 검사
      if (!form.author_name.trim()) {
        alert('이름을 입력해주세요.')
        return
      }
      
      if (!form.email.trim()) {
        alert('이메일을 입력해주세요.')
        return
      }
      
      if (!form.title.trim()) {
        alert('제목을 입력해주세요.')
        return
      }
      
      if (!form.content.trim()) {
        alert('내용을 입력해주세요.')
        return
      }
      
      if (form.content.length > 1000) {
        alert('내용은 1000자를 초과할 수 없습니다.')
        return
      }
      
      if (!form.privacy_agreed) {
        alert('개인정보 수집 및 이용에 동의해주세요.')
        return
      }
      
      if (!form.captcha.trim()) {
        alert('보안문자를 입력해주세요.')
        return
      }

      try {
        isSubmitting.value = true
        
        const formData = new FormData()
        formData.append('author_name', form.author_name)
        formData.append('email', form.email)
        formData.append('phone', form.phone || '')
        formData.append('category', form.category || '')
        formData.append('title', form.title)
        formData.append('content', form.content)
        formData.append('captcha', form.captcha)
        
        if (form.file) {
          formData.append('file', form.file)
        }
        
        await qasStore.createQA(formData)
        
        alert('문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다.')
        router.push('/qa')
        
      } catch (error) {
        console.error('문의 등록 실패:', error)
        alert('문의 등록에 실패했습니다. 다시 시도해주세요.')
      } finally {
        isSubmitting.value = false
      }
    }

    onMounted(() => {
      loadCaptcha()
    })

    return {
      form,
      isSubmitting,
      showPrivacyModal,
      captchaImage,
      handleFileUpload,
      removeFile,
      formatFileSize,
      refreshCaptcha,
      submitForm
    }
  }
}
</script>