<template>
  <div class="schedule">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">버스 운행 노선</h1>
      <p class="text-gray-600">백성운수 버스 운행 노선을 확인하세요</p>
    </div>

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
              placeholder="노선 번호로 검색(예: 70)"
              class="form-input pl-10"
              @keyup.enter="applyFilters"
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
          <button @click="applyFilters" class="btn btn-primary">
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

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Schedule List -->
    <div v-else>
      <div
        v-if="schedules.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="schedule in schedules"
          :key="schedule.id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <!-- 카드 헤더 -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
            <h2 class="text-2xl font-bold text-center">
              {{ schedule.route_number }}번
            </h2>
            <p v-if="schedule.route_name" class="text-center text-blue-100 text-sm mt-1">
              {{ schedule.route_name }}
            </p>
          </div>

          <!-- 시간표 이미지 -->
          <div class="p-4">
            <div v-if="schedule.image_data" class="mb-4">
              <img
                :src="`data:image/jpeg;base64,${schedule.image_data}`"
                :alt="schedule.image_filename || '노선 시간표'"
                class="w-full h-48 object-cover rounded-lg shadow-sm cursor-pointer"
                @click="openTimetableModal(schedule)"
              />
            </div>
            <div v-else class="mb-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <div class="text-center text-gray-500">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm">시간표 이미지 없음</p>
              </div>
            </div>

            <!-- 액션 버튼들 -->
            <div class="space-y-3">
              <button
                v-if="schedule.image_data"
                @click="openTimetableModal(schedule)"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                노선 시간표
              </button>
              
              <button
                v-if="schedule.url"
                @click="openNaverMap(schedule.url)"
                class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                네이버 지도에서 보기
              </button>
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">노선이 없습니다</h3>
        <p class="text-gray-600">검색 조건을 변경해보세요.</p>
      </div>
    </div>

    <!-- Timetable Modal -->
    <div
      v-if="showTimetableModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="closeTimetableModal"
    >
      <div
        class="bg-white rounded-lg max-w-4xl max-h-screen overflow-y-auto"
        @click.stop
      >
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ selectedSchedule?.route_number }}번 노선 시간표
            </h3>
            <button
              @click="closeTimetableModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg
                class="w-6 h-6"
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
        </div>

        <div class="p-6">
          <div v-if="selectedSchedule?.image_data" class="text-center">
            <img
              :src="`data:image/jpeg;base64,${selectedSchedule.image_data}`"
              :alt="selectedSchedule.image_filename || '노선 시간표'"
              class="max-w-full max-h-96 object-contain mx-auto rounded-lg shadow-sm"
            />
          </div>
          <div v-else class="text-center py-12">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="text-gray-500">시간표 이미지가 없습니다</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useSchedulesStore } from "@/stores/schedules";

export default {
  name: "Schedule",
  setup() {
    const searchQuery = ref("");
    const showTimetableModal = ref(false);
    const selectedSchedule = ref(null);

    const schedulesStore = useSchedulesStore();

    const filters = reactive({
      departure: "",
      destination: "",
      type: "",
    });

    const isLoading = computed(() => schedulesStore.isLoading);
    const schedules = computed(() => schedulesStore.schedules);

    const applyFilters = async () => {
      const params = {};
      if (searchQuery.value) params.filter = searchQuery.value;

      await schedulesStore.fetchSchedules(params);
    };

    const resetFilters = async () => {
      searchQuery.value = "";
      await schedulesStore.fetchSchedules();
    };

    const openTimetableModal = (schedule) => {
      selectedSchedule.value = schedule;
      showTimetableModal.value = true;
    };

    const closeTimetableModal = () => {
      showTimetableModal.value = false;
      selectedSchedule.value = null;
    };

    const openNaverMap = (url) => {
      if (url) {
        window.open(url, "_blank");
      }
    };

    const goToDetail = (url) => {
      window.open(url, "_blank");
    };

    onMounted(() => {
      schedulesStore.fetchSchedules();
    });

    return {
      filters,
      isLoading,
      schedules,
      searchQuery,
      showTimetableModal,
      selectedSchedule,
      applyFilters,
      resetFilters,
      openTimetableModal,
      closeTimetableModal,
      openNaverMap,
      goToDetail,
    };
  },
};
</script>
