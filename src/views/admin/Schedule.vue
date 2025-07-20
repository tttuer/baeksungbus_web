<template>
  <div class="admin-schedule">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">노선 관리</h1>
          <p class="text-gray-600">버스 운행 노선을 관리할 수 있습니다</p>
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
          <button @click="openCreateModal" class="btn btn-primary">
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
            노선 추가
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
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
                d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
              />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">전체 노선</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalRoutes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">노선 목록</h3>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
        ></div>
        <span class="ml-2 text-gray-600">로딩 중...</span>
      </div>

      <div
        v-else-if="!Array.isArray(schedules) || schedules.length === 0"
        class="text-center py-12"
      >
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">노선이 없습니다</h3>
        <p class="text-gray-600">새 노선을 추가해보세요.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                노선 정보
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                시간표 이미지
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                링크
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
              v-for="schedule in schedules"
              :key="schedule.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-blue-900">{{
                        schedule.route_number
                      }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ schedule.route_name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="schedule.images && schedule.images.length > 0" class="flex items-center space-x-2">
                  <div 
                    v-for="(image, index) in schedule.images.slice(0, 3)" 
                    :key="index"
                    class="relative"
                  >
                    <img
                      :src="`data:image/jpeg;base64,${image.data}`"
                      :alt="image.filename || `노선 시간표 ${index + 1}`"
                      class="w-12 h-12 object-cover rounded-lg border shadow-sm"
                    />
                  </div>
                  <div 
                    v-if="schedule.images.length > 3" 
                    class="w-12 h-12 bg-gray-100 rounded-lg border flex items-center justify-center text-xs text-gray-500"
                  >
                    +{{ schedule.images.length - 3 }}
                  </div>
                </div>
                <div v-else-if="schedule.image_data" class="flex items-center">
                  <!-- 하위 호환성을 위한 단일 이미지 지원 -->
                  <img
                    :src="`data:image/jpeg;base64,${schedule.image_data}`"
                    :alt="schedule.image_filename || '노선 시간표'"
                    class="w-12 h-12 object-cover rounded-lg border shadow-sm"
                  />
                </div>
                <div v-else class="text-sm text-gray-500">
                  이미지 없음
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  <a 
                    v-if="schedule.url" 
                    :href="schedule.url" 
                    target="_blank"
                    class="text-blue-600 hover:text-blue-800 underline"
                  >
                    네이버 지도에서 보기
                  </a>
                  <span v-else class="text-gray-500">링크 없음</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="editSchedule(schedule)"
                    class="text-indigo-600 hover:text-indigo-800"
                  >
                    수정
                  </button>
                  <button
                    @click="deleteSchedule(schedule.id)"
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
        v-if="schedules.length > 0 && pagination.totalPages > 1"
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

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto"
      >
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingSchedule ? "노선 수정" : "노선 추가" }}
          </h3>
          <a
            href="https://map.naver.com/p?c=15.00,0,0,0,dh"
            target="_blank"
            class="flex items-center gap-1 text-blue-600"
          >
            네이버 지도 바로가기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>

        <form @submit.prevent="submitSchedule" class="p-6 space-y-6">
          <!-- 단일 노선 생성 (수정 모드) -->
          <div v-if="editingSchedule" class="space-y-6">
            <!-- 기본 정보 -->
            <div class="flex gap-4 items-start">
              <div class="w-32">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >노선번호 *</label
                >
                <input
                  v-model="scheduleForm.route_number"
                  type="text"
                  class="form-input"
                  placeholder="예: 142"
                  required
                  :disabled="editingSchedule"
                />
              </div>

              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >네이버 지도 링크</label
                >
                <input
                  v-model="scheduleForm.url"
                  type="text"
                  class="form-input"
                  placeholder="네이버 지도의 노선 검색 링크를 입력해주세요"
                />
              </div>
            </div>

            <!-- 이미지 업로드 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >노선 시간표 (여러 개 선택 가능)</label
              >
              <div class="space-y-4">
                <input
                  type="file"
                  @change="handleImageUpload"
                  accept="image/*"
                  multiple
                  class="form-input"
                />
                <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div 
                    v-for="(preview, index) in imagePreviews" 
                    :key="index"
                    class="relative"
                  >
                    <img
                      :src="preview.url"
                      :alt="`노선 시간표 미리보기 ${index + 1}`"
                      class="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      @click="removeImage(index)"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 다중 노선 생성 (신규 생성 모드) -->
          <div v-else>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-md font-medium text-gray-900">노선 정보</h4>
              <button
                type="button"
                @click="addRoute"
                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                노선 추가
              </button>
            </div>

            <div class="space-y-6">
              <div
                v-for="(route, index) in routeList"
                :key="index"
                class="border border-gray-200 rounded-lg p-6 space-y-4"
              >
                <div class="flex items-center justify-between">
                  <h5 class="text-sm font-medium text-gray-700">
                    노선 {{ index + 1 }}
                  </h5>
                  <button
                    v-if="routeList.length > 1"
                    type="button"
                    @click="removeRoute(index)"
                    class="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- 기본 정보 -->
                <div class="flex gap-4 items-start">
                  <div class="w-32">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >노선번호 *</label
                    >
                    <input
                      v-model="route.route_number"
                      type="text"
                      class="form-input"
                      placeholder="예: 142"
                      required
                    />
                  </div>

                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >네이버 지도 링크</label
                    >
                    <input
                      v-model="route.url"
                      type="text"
                      class="form-input"
                      placeholder="네이버 지도의 노선 검색 링크를 입력해주세요"
                    />
                  </div>
                </div>

                <!-- 이미지 업로드 -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >노선 시간표 (여러 개 선택 가능)</label
                  >
                  <div class="space-y-4">
                    <input
                      type="file"
                      @change="
                        (event) => handleMultipleImageUpload(event, index)
                      "
                      accept="image/*"
                      multiple
                      class="form-input"
                    />
                    <div
                      v-if="route.imagePreviews && route.imagePreviews.length > 0"
                      class="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      <div 
                        v-for="(preview, imgIndex) in route.imagePreviews" 
                        :key="imgIndex"
                        class="relative"
                      >
                        <img
                          :src="preview.url"
                          :alt="`노선 시간표 미리보기 ${imgIndex + 1}`"
                          class="w-full h-32 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          @click="removeMultipleImage(index, imgIndex)"
                          class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200"
          >
            <button type="button" @click="closeModal" class="btn btn-outline">
              취소
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <svg
                v-if="isSubmitting"
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
              {{
                isSubmitting ? "처리 중..." : editingSchedule ? "수정" : "추가"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useSchedulesStore } from "@/stores/schedules";

export default {
  name: "AdminSchedule",
  setup() {
    const schedulesStore = useSchedulesStore();

    const searchQuery = ref("");
    const statusFilter = ref("");
    const typeFilter = ref("");
    const currentPage = ref(1);
    const showModal = ref(false);
    const editingSchedule = ref(null);
    const isSubmitting = ref(false);

    const isLoading = computed(() => schedulesStore.isLoading);
    const schedules = computed(() => schedulesStore.schedules);
    const pagination = computed(
      () =>
        schedulesStore.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1,
        }
    );

    const totalRoutes = computed(() => schedulesStore.totalCount);

    const activeRoutes = computed(() => {
      if (!Array.isArray(schedules.value)) return 0;
      return schedules.value.filter((schedule) => schedule.status === "active")
        .length;
    });

    const suspendedRoutes = computed(() => {
      if (!Array.isArray(schedules.value)) return 0;
      return schedules.value.filter(
        (schedule) => schedule.status === "suspended"
      ).length;
    });

    const totalTrips = computed(() => {
      if (!Array.isArray(schedules.value)) return 0;
      return schedules.value.reduce((sum, schedule) => {
        const interval = parseInt(schedule.interval) || 30;
        const firstBus = schedule.first_bus
          ? new Date(`1970-01-01T${schedule.first_bus}`)
          : null;
        const lastBus = schedule.last_bus
          ? new Date(`1970-01-01T${schedule.last_bus}`)
          : null;

        if (firstBus && lastBus) {
          const duration = (lastBus - firstBus) / (1000 * 60); // minutes
          return sum + Math.floor(duration / interval) + 1;
        }
        return sum;
      }, 0);
    });

    const scheduleForm = reactive({
      route_number: "",
      url: "",
      images: [],
      images_data: [],
      images_filenames: [],
    });

    const routeList = ref([
      {
        route_number: "",
        url: "",
        images: [],
        images_data: [],
        images_filenames: [],
        imagePreviews: [],
      },
    ]);

    const imagePreviews = ref([]);

    const search = async () => {
      currentPage.value = 1;
      await fetchSchedules();
    };

    const resetFilters = async () => {
      searchQuery.value = "";
      statusFilter.value = "";
      typeFilter.value = "";
      currentPage.value = 1;
      await fetchSchedules();
    };

    const refreshData = async () => {
      await fetchSchedules();
    };

    const fetchSchedules = async () => {
      const params = {
        page: currentPage.value,
        page_size: 20,
      };

      if (searchQuery.value) params.filter = searchQuery.value;
      if (statusFilter.value) params.status = statusFilter.value;
      if (typeFilter.value) params.route_type = typeFilter.value;

      await schedulesStore.fetchSchedules(params);
    };

    const goToPage = async (page) => {
      if (page < 1 || page > pagination.value.totalPages) return;
      currentPage.value = page;
      await fetchSchedules();
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

    const openCreateModal = () => {
      editingSchedule.value = null;
      Object.assign(scheduleForm, {
        route_number: "",
        url: "",
        images: [],
        images_data: [],
        images_filenames: [],
      });
      imagePreviews.value = [];
      routeList.value = [
        {
          route_number: "",
          url: "",
          images: [],
          images_data: [],
          images_filenames: [],
          imagePreviews: [],
        },
      ];
      showModal.value = true;
    };

    const editSchedule = (schedule) => {
      editingSchedule.value = schedule;
      Object.assign(scheduleForm, {
        route_number: schedule.route_number,
        url: schedule.url || "",
        images: [],
        images_data: [],
        images_filenames: [],
      });

      // 기존 이미지들이 있는 경우 미리보기 설정
      imagePreviews.value = [];
      if (schedule.images && Array.isArray(schedule.images)) {
        // 백엔드 API 형식: [{data: "base64", filename: "name"}, ...]
        imagePreviews.value = schedule.images.map((image, index) => ({
          url: `data:image/jpeg;base64,${image.data}`,
          filename: image.filename || `image_${index + 1}.jpg`
        }));
        scheduleForm.images_data = schedule.images.map(img => img.data);
        scheduleForm.images_filenames = schedule.images.map(img => img.filename || 'image.jpg');
      } else if (schedule.image_data) {
        // 기존 단일 이미지 지원 (하위 호환성)
        imagePreviews.value = [{
          url: `data:image/jpeg;base64,${schedule.image_data}`,
          filename: schedule.image_filename || 'image.jpg'
        }];
        scheduleForm.images_data = [schedule.image_data];
        scheduleForm.images_filenames = [schedule.image_filename || 'image.jpg'];
      }
      
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
      editingSchedule.value = null;
      imagePreviews.value = [];
    };

    const handleImageUpload = (event) => {
      const files = Array.from(event.target.files);
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`파일 ${file.name}의 크기는 5MB를 초과할 수 없습니다.`);
          continue;
        }

        if (!file.type.startsWith("image/")) {
          alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
          continue;
        }

        scheduleForm.images.push(file);
        scheduleForm.images_filenames.push(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreviews.value.push({
            url: e.target.result,
            filename: file.name
          });
          // Base64 데이터만 추출 (data:image/jpeg;base64, 부분 제거)
          scheduleForm.images_data.push(e.target.result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      }
      
      event.target.value = "";
    };

    const removeImage = (index) => {
      scheduleForm.images.splice(index, 1);
      scheduleForm.images_data.splice(index, 1);
      scheduleForm.images_filenames.splice(index, 1);
      imagePreviews.value.splice(index, 1);
    };

    const handleMultipleImageUpload = (event, routeIndex) => {
      const files = Array.from(event.target.files);
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          alert(`파일 ${file.name}의 크기는 5MB를 초과할 수 없습니다.`);
          continue;
        }

        if (!file.type.startsWith("image/")) {
          alert(`${file.name}은(는) 이미지 파일이 아닙니다.`);
          continue;
        }

        if (!routeList.value[routeIndex].images) {
          routeList.value[routeIndex].images = [];
          routeList.value[routeIndex].images_data = [];
          routeList.value[routeIndex].images_filenames = [];
          routeList.value[routeIndex].imagePreviews = [];
        }

        routeList.value[routeIndex].images.push(file);
        routeList.value[routeIndex].images_filenames.push(file.name);

        const reader = new FileReader();
        reader.onload = (e) => {
          routeList.value[routeIndex].imagePreviews.push({
            url: e.target.result,
            filename: file.name
          });
          // Base64 데이터만 추출 (data:image/jpeg;base64, 부분 제거)
          routeList.value[routeIndex].images_data.push(e.target.result.split(',')[1]);
        };
        reader.readAsDataURL(file);
      }
      
      event.target.value = "";
    };

    const removeMultipleImage = (routeIndex, imageIndex) => {
      routeList.value[routeIndex].images.splice(imageIndex, 1);
      routeList.value[routeIndex].images_data.splice(imageIndex, 1);
      routeList.value[routeIndex].images_filenames.splice(imageIndex, 1);
      routeList.value[routeIndex].imagePreviews.splice(imageIndex, 1);
    };

    const addRoute = () => {
      routeList.value.push({
        route_number: "",
        url: "",
        images: [],
        images_data: [],
        images_filenames: [],
        imagePreviews: [],
      });
    };

    const removeRoute = (index) => {
      if (routeList.value.length > 1) {
        routeList.value.splice(index, 1);
      }
    };

    const submitSchedule = async () => {
      try {
        isSubmitting.value = true;

        if (editingSchedule.value) {
          // 단일 노선 수정 - 백엔드 API 형식에 맞게 전송
          const images = [];
          for (let i = 0; i < scheduleForm.images_data.length; i++) {
            images.push({
              data: scheduleForm.images_data[i],
              filename: scheduleForm.images_filenames[i] || `image_${i + 1}.jpg`
            });
          }

          const updateData = {
            route_number: scheduleForm.route_number,
            url: scheduleForm.url,
            images: images,
          };
          
          await schedulesStore.updateSchedule(
            editingSchedule.value.id,
            updateData
          );
          alert("노선이 수정되었습니다.");
        } else {
          // 다중 노선 생성 - 백엔드 API 형식에 맞게 배열로 전송
          const validRoutes = routeList.value.filter((route) =>
            route.route_number.trim()
          );

          if (validRoutes.length > 0) {
            const routesToSubmit = validRoutes.map(route => {
              const images = [];
              if (route.images_data && route.images_data.length > 0) {
                for (let i = 0; i < route.images_data.length; i++) {
                  images.push({
                    data: route.images_data[i],
                    filename: route.images_filenames[i] || `image_${i + 1}.jpg`
                  });
                }
              }

              return {
                route_number: route.route_number,
                url: route.url,
                images: images,
              };
            });
            
            await schedulesStore.createSchedule(routesToSubmit);
            alert(`${validRoutes.length}개의 노선이 추가되었습니다.`);
          }
        }

        closeModal();
        await fetchSchedules();
      } catch (error) {
        console.error("노선 저장 실패:", error);
        alert("노선 저장에 실패했습니다.");
      } finally {
        isSubmitting.value = false;
      }
    };

    const viewSchedule = (schedule) => {
      window.open(`/schedule/${schedule.id}`, "_blank");
    };

    const toggleStatus = async (schedule) => {
      const newStatus = schedule.status === "active" ? "suspended" : "active";

      try {
        await schedulesStore.updateSchedule(schedule.id, {
          ...schedule,
          status: newStatus,
        });

        alert(
          `노선이 ${newStatus === "active" ? "운행 중" : "중단"}으로 변경되었습니다.`
        );
        await fetchSchedules();
      } catch (error) {
        console.error("운행 상태 변경 실패:", error);
        alert("운행 상태 변경에 실패했습니다.");
      }
    };

    const deleteSchedule = async (id) => {
      if (!confirm("정말 삭제하시겠습니까?")) return;

      try {
        await schedulesStore.deleteSchedule(id);
        alert("노선이 삭제되었습니다.");
        await fetchSchedules();
      } catch (error) {
        console.error("노선 삭제 실패:", error);
        alert("노선 삭제에 실패했습니다.");
      }
    };

    onMounted(() => {
      fetchSchedules();
    });

    return {
      searchQuery,
      statusFilter,
      typeFilter,
      isLoading,
      schedules,
      pagination,
      totalRoutes,
      activeRoutes,
      suspendedRoutes,
      totalTrips,
      showModal,
      editingSchedule,
      isSubmitting,
      scheduleForm,
      routeList,
      imagePreviews,
      search,
      resetFilters,
      refreshData,
      goToPage,
      getPageNumbers,
      openCreateModal,
      editSchedule,
      closeModal,
      addRoute,
      removeRoute,
      handleImageUpload,
      removeImage,
      handleMultipleImageUpload,
      removeMultipleImage,
      submitSchedule,
      viewSchedule,
      toggleStatus,
      deleteSchedule,
    };
  },
};
</script>
