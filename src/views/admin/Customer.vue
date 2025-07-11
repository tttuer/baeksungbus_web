<template>
  <div class="admin-customer">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">고객 문의 관리</h1>
          <p class="text-gray-600">
            고객 문의사항을 확인하고 답변을 등록하세요
          </p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="refreshData"
            class="btn btn-outline"
            :disabled="isLoading"
          >
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
            새로고침
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">전체 문의</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ totalCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg
              class="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">미답변</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ unansweredCount }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">답변완료</p>
            <p class="text-2xl font-bold text-gray-900">{{ answeredCount }}</p>
          </div>
        </div>
      </div>

      
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >검색</label
          >
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="제목, 내용, 작성자 검색"
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

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >답변 상태</label
          >
          <select v-model="answerStatus" class="form-select">
            <option value="">전체</option>
            <option value="false">미답변</option>
            <option value="true">답변완료</option>
          </select>
        </div>

        <div class="flex items-end space-x-2">
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
          <button @click="resetFilters" class="btn btn-outline">
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

    <!-- Customer Inquiries Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">고객 문의 목록</h3>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <span class="ml-2 text-gray-600">로딩 중...</span>
      </div>

      <div v-else-if="customerInquiries.length === 0" class="text-center py-12">
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">문의가 없습니다</h3>
        <p class="text-gray-600">검색 조건을 변경해보세요.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                제목
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                작성자
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                등록일
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                답변상태
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                관리
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="inquiry in customerInquiries"
              :key="inquiry.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ inquiry.title }}
                    </div>
                    <div class="text-sm text-gray-500 truncate max-w-xs">
                      {{ inquiry.content }}
                    </div>
                  </div>
                  <svg
                    v-if="inquiry.hidden"
                    class="w-4 h-4 text-yellow-500 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ inquiry.writer }}</div>
                <div class="text-sm text-gray-500">{{ inquiry.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(inquiry.c_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="inquiry.done"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  답변완료
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  <svg
                    class="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  미답변
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openAnswerModal(inquiry)"
                    class="text-green-600 hover:text-green-800"
                  >
                    {{ inquiry.done ? '답변수정' : '답변하기' }}
                  </button>
                  <button
                    @click="deleteInquiry(inquiry.id)"
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
      <div
        v-if="customerInquiries.length > 0 && pagination.totalPages > 1"
        class="px-6 py-4 border-t border-gray-200"
      >
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
          <div
            class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm text-gray-700">
                총 <span class="font-medium">{{ pagination.total }}</span
                >개 중
                <span class="font-medium">{{
                  (pagination.page - 1) * pagination.limit + 1
                }}</span
                >-<span class="font-medium">{{
                  Math.min(pagination.page * pagination.limit, pagination.total)
                }}</span
                >개 표시
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              >
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
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    ]"
                  >
                    {{ page }}
                  </button>
                  <span
                    v-else
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                  >
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

    <!-- Answer Modal -->
    <AnswerModal
      :show="showAnswerModal"
      :qaId="selectedQA?.id"
      @close="closeAnswerModal"
      @answered="onAnswered"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useQAsStore } from "@/stores/qas";
import AnswerModal from "@/components/AnswerModal.vue";

export default {
  name: "AdminCustomer",
  components: {
    AnswerModal
  },
  setup() {
    const qasStore = useQAsStore();

    const searchQuery = ref("");
    const answerStatus = ref("");
    const dateFilter = ref("");
    const currentPage = ref(1);
    const showAnswerModal = ref(false);
    const selectedQA = ref(null);

    const isLoading = computed(() => qasStore.isLoading);
    const customerInquiries = computed(() => qasStore.qas);
    const pagination = computed(
      () =>
        qasStore.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1,
        }
    );
    
    const totalCount = computed(() => qasStore.totalCustomerCount);
    const unansweredCount = computed(() => qasStore.unansweredTotal)
    const answeredCount = computed(() => qasStore.answeredTotal)

    const todayCount = computed(() => {
      const today = new Date().toDateString();
      return customerInquiries.value.filter(
        (qa) => new Date(qa.c_date).toDateString() === today
      ).length;
    });

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const search = async () => {
      currentPage.value = 1;
      await fetchCustomerInquiries();
    };

    const resetFilters = async () => {
      searchQuery.value = "";
      answerStatus.value = "";
      dateFilter.value = "";
      currentPage.value = 1;
      await fetchCustomerInquiries();
    };

    const refreshData = async () => {
      await fetchCustomerInquiries();
      await qasStore.fetchUnansweredCount()
      await qasStore.fetchAnsweredCount();
      await qasStore.fetchCustomerTotalCount();
    };

    const fetchCustomerInquiries = async () => {
      const params = {
        qa_type: "CUSTOMER",
        page: currentPage.value,
        page_size: 20,
      };

      if (searchQuery.value) params.filter = searchQuery.value;
      if (answerStatus.value) params.done = answerStatus.value === "true";
      if (dateFilter.value) {
        const now = new Date();
        let fromDate;

        switch (dateFilter.value) {
          case "today":
            fromDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
            break;
          case "week":
            fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case "month":
            fromDate = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            break;
        }

        if (fromDate) {
          params.from_date = fromDate.toISOString().split("T")[0];
        }
      }

      await qasStore.fetchQAs(params);
    };

    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return;
      currentPage.value = page;
      await fetchCustomerInquiries();
    };

    const getPageNumbers = () => {
      const totalPages = pagination.value.totalPages;
      const current = pagination.value.page;
      const pages = [];

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (current <= 4) {
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (current >= totalPages - 3) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = current - 1; i <= current + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    const openAnswerModal = (inquiry) => {
      selectedQA.value = inquiry;
      showAnswerModal.value = true;
    };

    const closeAnswerModal = () => {
      showAnswerModal.value = false;
      selectedQA.value = null;
    };

    const onAnswered = async () => {
      await refreshData();
    };

    const deleteInquiry = async (id) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        try {
          await qasStore.deleteQA(id);
          await refreshData();
          alert("삭제되었습니다.");
        } catch (error) {
          alert("삭제에 실패했습니다.");
        }
      }
    };

    onMounted(() => {
      fetchCustomerInquiries();
      qasStore.fetchUnansweredCount()
      qasStore.fetchAnsweredCount();
      qasStore.fetchCustomerTotalCount();
    });

    return {
      searchQuery,
      answerStatus,
      dateFilter,
      isLoading,
      customerInquiries,
      pagination,
      unansweredCount,
      answeredCount,
      todayCount,
      showAnswerModal,
      selectedQA,
      totalCount,
      formatDate,
      search,
      resetFilters,
      refreshData,
      goToPage,
      getPageNumbers,
      openAnswerModal,
      closeAnswerModal,
      onAnswered,
      deleteInquiry,
    };
  },
};
</script>
