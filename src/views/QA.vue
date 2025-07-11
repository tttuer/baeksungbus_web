<template>
  <div class="qa">
    <!-- Password Modal -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">비밀번호 확인</h3>
        <p class="text-gray-600 mb-4">이 글을 보려면 비밀번호가 필요합니다.</p>
        <form @submit.prevent="checkPassword">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >비밀번호</label
            >
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
            <button
              type="button"
              @click="closePasswordModal"
              class="btn btn-outline"
            >
              취소
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isCheckingPassword"
            >
              <svg
                v-if="isCheckingPassword"
                class="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              {{ isCheckingPassword ? "확인 중..." : "확인" }}
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
          <h1 class="text-3xl font-bold text-gray-900 mb-2">고객 문의</h1>
          <p class="text-gray-600">궁금한 점이나 건의사항을 문의해주세요</p>
        </div>
        <router-link to="/qa/form" class="btn btn-primary mt-4 md:mt-0">
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
          문의하기
        </router-link>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="card p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >검색</label
          >
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="제목, 내용 또는 작성자로 검색"
              class="form-input pl-10"
              @keyup.enter="search"
            />
            <svg
              class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
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
          </div>
        </div>
        <div class="flex items-end gap-2">
          <button @click="search" class="btn btn-primary">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            검색
          </button>
          <button @click="resetSearch" class="btn btn-outline">
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
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

    <!-- QA List -->
    <div v-else>
      <div v-if="qas.length > 0" class="space-y-4">
        <div
          v-for="qa in qas"
          :key="qa.id"
          class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToDetail(qa)"
        >
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3
                  class="text-lg font-semibold text-gray-900 hover:text-primary-600"
                >
                  {{ qa.title }}
                </h3>
                <span
                  class="px-2 py-1 text-xs font-medium rounded"
                  :class="getStatusClass(qa.done)"
                >
                  {{ getStatusLabel(qa.done) }}
                </span>
              </div>
              <div class="flex items-center text-sm text-gray-500 gap-4">
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
                  {{ qa.writer }}
                </span>
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {{ formatDate(qa.c_date) }}
                </span>
                <span v-if="qa.file_name" class="flex items-center">
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
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  첨부파일
                </span>
              </div>
            </div>
            <button
              class="text-primary-600 hover:text-primary-700 text-sm font-medium ml-4"
            >
              상세보기 →
            </button>
          </div>

          <!-- Answer Preview -->
          <div
            v-if="qa.answer && qa.answer.content"
            class="border-t border-gray-200 pt-4 mt-4"
          >
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg
                  class="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-900"
                  >관리자 답변</span
                >
                <span class="text-sm text-gray-500 ml-2">{{
                  formatDate(qa.answer.created_at)
                }}</span>
              </div>
              <p class="text-gray-600 text-sm line-clamp-2">
                {{ qa.answer.content.substring(0, 100) }}...
              </p>
            </div>
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          문의 내역이 없습니다
        </h3>
        <p class="text-gray-600 mb-4">궁금한 점이나 건의사항을 문의해보세요.</p>
        <router-link to="/qa/form" class="btn btn-primary">
          문의하기
        </router-link>
      </div>

      <!-- Pagination -->
      <div v-if="qas.length > 0" class="mt-8">
        <div class="flex items-center justify-center">
          <div class="pagination">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="pagination-item"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page <= 1 }"
            >
              이전
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              class="pagination-item"
              :class="{ active: page === pagination.page }"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="pagination-item"
              :class="{
                'opacity-50 cursor-not-allowed':
                  pagination.page >= pagination.totalPages,
              }"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useQAsStore } from "@/stores/qas";
import api from "@/services/api";

export default {
  name: "QA",
  setup() {
    const router = useRouter();
    const qasStore = useQAsStore();

    const searchQuery = ref("");
    const selectedStatus = ref("");

    const showPasswordModal = ref(false);
    const passwordInput = ref("");
    const isCheckingPassword = ref(false);
    const passwordInputRef = ref(null);
    const selectedItemId = ref(null);

    const isLoading = computed(() => qasStore.isLoading);
    const qas = computed(() => qasStore.qas);
    const pagination = computed(() => qasStore.pagination);

    const visiblePages = computed(() => {
      const current = pagination.value.page;
      const total = pagination.value.totalPages;
      const delta = 2;
      const range = [];

      for (
        let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++
      ) {
        range.push(i);
      }

      if (current - delta > 2) {
        range.unshift("...");
      }
      if (current + delta < total - 1) {
        range.push("...");
      }

      range.unshift(1);
      if (total > 1) {
        range.push(total);
      }

      return range.filter((item, index, self) => self.indexOf(item) === index);
    });

    const getStatusClass = (status) => {
      return status === true
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800";
    };

    const getStatusLabel = (status) => {
      return status === true ? "답변완료" : "답변대기";
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
        qa_type: "CUSTOMER",
        page: 1,
        page_size: 10,
      };

      if (searchQuery.value) params.filter = searchQuery.value;
      if (selectedStatus.value) params.status = selectedStatus.value;

      await qasStore.fetchQAs(params);
    };

    const resetSearch = async () => {
      searchQuery.value = "";
      selectedStatus.value = "";
      await qasStore.fetchQAs({ qa_type: "CUSTOMER", page: 1, page_size: 10 });
    };

    const changePage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return;

      const params = {
        qa_type: "CUSTOMER",
        page,
        page_size: 10,
      };

      if (searchQuery.value) params.search = searchQuery.value;
      if (selectedStatus.value) params.status = selectedStatus.value;

      await qasStore.fetchQAs(params);
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
          params: { password: passwordInput.value },
        });

        showPasswordModal.value = false;
        passwordInput.value = "";
        router.push(`/qa/${selectedItemId.value}`);
      } catch (error) {
        if (error.response?.status === 403) {
          alert("비밀번호가 올바르지 않습니다.");
        } else {
          alert("비밀번호 확인에 실패했습니다.");
        }
      } finally {
        isCheckingPassword.value = false;
      }
    };

    const closePasswordModal = () => {
      showPasswordModal.value = false;
      passwordInput.value = "";
      selectedItemId.value = null;
    };

    onMounted(() => {
      qasStore.fetchQAs({ qa_type: "CUSTOMER", page: 1, page_size: 10 });
    });

    return {
      searchQuery,
      selectedStatus,
      isLoading,
      qas,
      pagination,
      visiblePages,
      getStatusClass,
      getStatusLabel,
      formatDate,
      search,
      resetSearch,
      changePage,
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
