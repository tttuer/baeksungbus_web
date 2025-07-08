<template>
  <div class="lost">
    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">비밀번호 확인</h3>
        <p class="text-gray-600 mb-4">이 글을 보려면 비밀번호가 필요합니다.</p>
        <form @submit.prevent="checkPassword">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <input
              v-model="passwordInput"
              type="password"
              class="form-input"
              placeholder="비밀번호를 입력하세요"
              required
              ref="passwordInputRef"
            />
          </div>
          <div class="flex gap-2 justify-end">
            <button type="button" @click="closePasswordModal" class="btn btn-outline">취소</button>
            <button type="submit" class="btn btn-primary" :disabled="isCheckingPassword">
              <svg v-if="isCheckingPassword" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              {{ isCheckingPassword ? '확인 중...' : '확인' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">분실물</h1>
          <p class="text-gray-600">버스에서 잃어버린 물건을 찾아보세요</p>
        </div>
        <router-link to="/lost/form" class="btn btn-primary mt-4 md:mt-0">
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          분실물 신고
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Lost Items List -->
    <div v-else>
      <div
        v-if="lostItems.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="item in lostItems"
          :key="item.id"
          class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToDetail(item)"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ item.title }}
              </h3>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded"
              :class="getStatusClass(item.done)"
            >
              {{ getStatusLabel(item.done) }}
            </span>
          </div>

          <div class="flex justify-between items-center text-sm text-gray-500">
            <span class="flex items-center">
                  <svg
                    class="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {{ item.writer }}
                </span>
            <span>신고일: {{ formatDate(item.c_date) }}</span>
          </div>
        </div>
      </div>

      <div v-else class="card p-12 text-center">
        <svg
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          분실물이 없습니다
        </h3>
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
            <div
              class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5"
            >
              <span class="text-primary-600 text-sm font-bold">1</span>
            </div>
            <div>
              <h4 class="font-medium">분실물 신고</h4>
              <p class="text-gray-600 text-sm">
                분실 즉시 온라인 또는 전화로 신고하세요
              </p>
            </div>
          </div>

          <div class="flex items-start">
            <div
              class="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5"
            >
              <span class="text-primary-600 text-sm font-bold">2</span>
            </div>
            <div>
              <h4 class="font-medium">확인 및 연락</h4>
              <p class="text-gray-600 text-sm">분실물 발견 시 연락드립니다</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Info -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold mb-4">분실물 문의</h3>
        <div class="space-y-4">
          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-primary-600 mr-3 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <div>
              <h4 class="font-medium">전화 문의</h4>
              <p class="text-gray-600">031-673-3456</p>
              <p class="text-sm text-gray-500">운영시간: 08:30 ~ 17:00</p>
            </div>
          </div>

          <div class="flex items-start">
            <svg
              class="w-5 h-5 text-primary-600 mr-3 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div>
              <h4 class="font-medium">방문 수령</h4>
              <p class="text-gray-600">경기도 안성시 금석길 14</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useQAsStore } from "@/stores/qas";
import api from "@/services/api";

export default {
  name: "Lost",
  setup() {
    const router = useRouter();
    const qasStore = useQAsStore();

    const searchQuery = ref("");
    const lostDate = ref("");
    const selectedRoute = ref("");
    const selectedStatus = ref("");

    const isLoading = computed(() => qasStore.isLoading);
    const lostItems = computed(() => qasStore.qas);
    
    const showPasswordModal = ref(false);
    const passwordInput = ref('');
    const isCheckingPassword = ref(false);
    const passwordInputRef = ref(null);
    const selectedItemId = ref(null);

    const getStatusClass = (status) => {
      return status === false
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800";
    };

    const getStatusLabel = (status) => {
      return status === false ? "처리중" : "처리완료";
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    const search = async () => {
      const params = {
        qa_type: "LOST",
        page: 1,
        page_size: 10,
      };

      if (searchQuery.value) params.search = searchQuery.value;
      if (selectedStatus.value) params.status = selectedStatus.value;

      await qasStore.fetchQAs(params);
    };

    const resetSearch = async () => {
      searchQuery.value = "";
      lostDate.value = "";
      selectedRoute.value = "";
      selectedStatus.value = "";
      await qasStore.fetchQAs({ qa_type: "LOST", page: 1, page_size: 10 });
    };

    const contactForClaim = (item) => {
      alert(
        `분실물 찾기 신청\n\n물품: ${item.title}\n연락처: 031-673-3456`
      );
    };

    const goToDetail = async (item) => {
      selectedItemId.value = item.id;
      
      // 비밀번호가 설정된 글이면 비밀번호 모달 표시
      if (item.hidden) {
        showPasswordModal.value = true;
        await nextTick();
        passwordInputRef.value?.focus();
      } else {
        router.push(`/qa/${item.id}`);
      }
    };
    
    const checkPassword = async () => {
      try {
        isCheckingPassword.value = true;
        
        await api.get(`/api/qas/${selectedItemId.value}/check_password`, {
          params: { password: passwordInput.value }
        });
        
        showPasswordModal.value = false;
        passwordInput.value = '';
        router.push(`/qa/${selectedItemId.value}`);
        
      } catch (error) {
        if (error.response?.status === 403) {
          alert('비밀번호가 올바르지 않습니다.');
        } else {
          alert('비밀번호 확인에 실패했습니다.');
        }
      } finally {
        isCheckingPassword.value = false;
      }
    };
    
    const closePasswordModal = () => {
      showPasswordModal.value = false;
      passwordInput.value = '';
      selectedItemId.value = null;
    };

    onMounted(() => {
      qasStore.fetchQAs({ qa_type: "LOST", page: 1, page_size: 10 });
    });

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
      contactForClaim,
      goToDetail,
      showPasswordModal,
      passwordInput,
      isCheckingPassword,
      passwordInputRef,
      checkPassword,
      closePasswordModal,
    };
  },
};
</script>
