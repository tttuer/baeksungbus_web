<template>
  <div class="admin-dashboard">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">대시보드</h1>
      <p class="text-gray-600">백성운수 관리자 대시보드</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <p class="text-sm font-medium text-gray-600">총 고객 문의</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalQAs || 0 }}
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
            <p class="text-sm font-medium text-gray-600">미답변 문의</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.unansweredQAs || 0 }}
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg
              class="w-6 h-6 text-yellow-600"
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
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">분실물 신고</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalLostItems || 0 }}
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
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">공지사항</p>
            <p class="text-2xl font-bold text-gray-900">
              {{ stats.totalNotices || 0 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Customer Inquiries -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">최근 고객 문의</h2>
            <router-link
              to="/adm/customer"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              전체 보기 →
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="recentQAs.length === 0"
            class="text-center py-8 text-gray-500"
          >
            최근 문의가 없습니다.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="qa in recentQAs"
              :key="qa.id"
              class="border-l-4 border-blue-500 pl-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 truncate">
                  {{ qa.title }}
                </h3>
                <span
                  v-if="qa.answered"
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded"
                >
                  답변완료
                </span>
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded"
                >
                  미답변
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                {{ qa.writer }} · {{ formatDate(qa.c_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Lost Items -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">
              최근 분실물 신고
            </h2>
            <router-link
              to="/adm/lost"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              전체 보기 →
            </router-link>
          </div>
        </div>
        <div class="p-6">
          <div
            v-if="recentLostItems.length === 0"
            class="text-center py-8 text-gray-500"
          >
            최근 분실물 신고가 없습니다.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in recentLostItems"
              :key="item.id"
              class="border-l-4 border-yellow-500 pl-4"
            >
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-gray-900 truncate">
                  {{ item.title }}
                </h3>
                <span
                  v-if="item.done"
                  class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded"
                >
                  처리완료
                </span>
                <span
                  v-else
                  class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded"
                >
                  처리중
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1">
                {{ item.writer }} · {{ formatDate(item.c_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mt-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/adm/notice"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="font-medium text-gray-900">공지사항 작성</p>
              <p class="text-sm text-gray-600">새 공지사항 등록</p>
            </div>
          </div>
        </router-link>

        <router-link
          to="/adm/schedule"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="font-medium text-gray-900">시간표 관리</p>
              <p class="text-sm text-gray-600">운행 시간표 수정</p>
            </div>
          </div>
        </router-link>

        <router-link
          to="/adm/customer"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg
                class="w-6 h-6 text-yellow-600"
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
              <p class="font-medium text-gray-900">고객 문의</p>
              <p class="text-sm text-gray-600">문의 답변 관리</p>
            </div>
          </div>
        </router-link>

        <router-link
          to="/adm/ddock"
          class="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-2 bg-purple-100 rounded-lg">
              <svg
                class="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div class="ml-4">
              <p class="font-medium text-gray-900">정류장 관리</p>
              <p class="text-sm text-gray-600">정류장 정보 수정</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useQAsStore } from "@/stores/qas";
import { useNoticesStore } from "@/stores/notices";

export default {
  name: "AdminDashboard",
  setup() {
    const qasStore = useQAsStore();
    const noticesStore = useNoticesStore();

    const stats = reactive({
      totalQAs: 0,
      unansweredQAs: 0,
      totalLostItems: 0,
      totalNotices: 0,
    });

    const recentQAs = ref([]);
    const recentLostItems = ref([]);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const loadDashboardData = async () => {
      try {
        // 고객 문의 데이터 로드
        await qasStore.fetchQAs({
          qa_type: "CUSTOMER",
          page: 1,
          page_size: 100,
        });
        recentQAs.value = qasStore.qas.slice(0, 5);
        stats.totalQAs = qasStore.pagination?.total || 0;

        await qasStore.fetchQAs({
          qa_type: "CUSTOMER",
          page: 1,
          page_size: 100,
          done: false,
        });

        stats.unansweredQAs = qasStore.pagination?.total || 0;

        // 분실물 데이터 로드
        await qasStore.fetchQAs({ qa_type: "LOST", page: 1, page_size: 5 });
        recentLostItems.value = qasStore.qas.slice(0, 5);
        stats.totalLostItems = qasStore.pagination?.total || 0;

        // 공지사항 데이터 로드
        await noticesStore.fetchNotices({ page: 1, page_size: 1 });
        stats.totalNotices = noticesStore.pagination?.total || 0;
      } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
      }
    };

    onMounted(() => {
      loadDashboardData();
    });

    return {
      stats,
      recentQAs,
      recentLostItems,
      formatDate,
    };
  },
};
</script>
