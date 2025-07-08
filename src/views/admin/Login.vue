<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center bg-primary-600 rounded-full">
          <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          백성운수 관리자 로그인
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          관리자 계정으로 로그인하세요
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">사용자명</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="사용자명"
            />
          </div>
          <div>
            <label for="password" class="sr-only">비밀번호</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="비밀번호"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              로그인 상태 유지
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg
                v-if="isLoading"
                class="h-5 w-5 text-primary-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <svg
                v-else
                class="h-5 w-5 text-primary-500 group-hover:text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </span>
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>
        </div>

        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                로그인 실패
              </h3>
              <div class="mt-2 text-sm text-red-700">
                {{ errorMessage }}
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="text-center">
        <p class="text-xs text-gray-500">
          관리자 전용 페이지입니다. 권한이 없는 접근은 제한됩니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'AdminLogin',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLoading = ref(false)
    const errorMessage = ref('')
    
    const form = reactive({
      username: '',
      password: '',
      rememberMe: false
    })

    const handleLogin = async () => {
      if (!form.username.trim() || !form.password.trim()) {
        errorMessage.value = '사용자명과 비밀번호를 입력해주세요.'
        return
      }

      try {
        isLoading.value = true
        errorMessage.value = ''
        
        await authStore.login({
          username: form.username,
          password: form.password,
          remember: form.rememberMe
        })
        
        // 로그인 성공 시 대시보드로 이동
        router.push('/adm/dashboard')
        
      } catch (error) {
        console.error('로그인 실패:', error)
        
        if (error.response?.status === 401) {
          errorMessage.value = '사용자명 또는 비밀번호가 올바르지 않습니다.'
        } else if (error.response?.status === 403) {
          errorMessage.value = '관리자 권한이 없습니다.'
        } else {
          errorMessage.value = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
        }
      } finally {
        isLoading.value = false
      }
    }

    // 이미 로그인된 경우 대시보드로 리다이렉트
    onMounted(() => {
      if (authStore.isAuthenticated && authStore.user?.role === 'admin') {
        router.push('/adm/dashboard')
      }
    })

    return {
      form,
      isLoading,
      errorMessage,
      handleLogin
    }
  }
}
</script>

<style scoped>
.bg-primary-600 {
  background-color: #2563eb;
}

.bg-primary-700 {
  background-color: #1d4ed8;
}

.text-primary-500 {
  color: #3b82f6;
}

.text-primary-400 {
  color: #60a5fa;
}

.border-primary-500 {
  border-color: #3b82f6;
}

.ring-primary-500 {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.focus\:ring-primary-500:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.focus\:border-primary-500:focus {
  border-color: #3b82f6;
}
</style>