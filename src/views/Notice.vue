<template>
  <div class="notice">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">공지사항</h1>
      <p class="text-gray-600">백성운수의 공지사항을 확인하세요</p>
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
              placeholder="제목 또는 내용으로 검색..."
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

    <!-- Notice List -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                제목
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                작성일
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                조회
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="notice in notices"
              :key="notice.id"
              class="hover:bg-gray-50 cursor-pointer transition-colors"
              @click="goToDetail(notice.id)"
            >
              <td class="px-6 py-4">
                <div
                  class="text-sm font-medium text-gray-900 hover:text-primary-600"
                >
                  {{ notice.title }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(notice.c_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ notice.read_cnt }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="notices.length === 0" class="p-12 text-center">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          공지사항이 없습니다
        </h3>
        <p class="text-gray-600">검색 조건을 변경해보세요.</p>
      </div>

      <!-- Pagination -->
      <div v-if="notices.length > 0" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            총 {{ pagination.total }}개 중
            {{ (pagination.page - 1) * pagination.limit + 1 }}-{{
              Math.min(pagination.page * pagination.limit, pagination.total)
            }}개 표시
          </div>
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
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useNoticesStore } from "@/stores/notices";

export default {
  name: "Notice",
  setup() {
    const router = useRouter();
    const noticesStore = useNoticesStore();

    const searchQuery = ref("");
    const selectedType = ref("");

    const isLoading = computed(() => noticesStore.isLoading);
    const notices = computed(() => noticesStore.notices);
    const pagination = computed(() => noticesStore.pagination);

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

    const getTypeClass = (type) => {
      const classes = {
        NOTICE: "bg-blue-100 text-blue-800",
        TIME: "bg-green-100 text-green-800",
        TTOCK: "bg-purple-100 text-purple-800",
      };
      return classes[type] || "bg-gray-100 text-gray-800";
    };

    const getTypeLabel = (type) => {
      const labels = {
        NOTICE: "일반공지",
        TIME: "시간표",
        TTOCK: "정류장",
      };
      return labels[type] || "기타";
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
        page: 1,
        limit: 10,
      };

      if (searchQuery.value) params.search = searchQuery.value;
      if (selectedType.value) params.type = selectedType.value;

      await noticesStore.fetchNotices(params);
    };

    const resetSearch = async () => {
      searchQuery.value = "";
      selectedType.value = "";
      await noticesStore.fetchNotices({ page: 1, limit: 10 });
    };

    const changePage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return;

      const params = {
        page,
        limit: 10,
      };

      if (searchQuery.value) params.search = searchQuery.value;
      if (selectedType.value) params.type = selectedType.value;

      await noticesStore.fetchNotices(params);
    };

    const goToDetail = (id) => {
      noticesStore.updateNoticeReadCnt(id);
      router.push(`/notice/${id}`);
    };

    onMounted(() => {
      noticesStore.fetchNotices({ page: 1, limit: 10 });
    });

    return {
      searchQuery,
      selectedType,
      isLoading,
      notices,
      pagination,
      visiblePages,
      getTypeClass,
      getTypeLabel,
      formatDate,
      search,
      resetSearch,
      changePage,
      goToDetail,
    };
  },
};
</script>
