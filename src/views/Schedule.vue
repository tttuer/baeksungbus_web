<template>
  <div class="schedule">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">버스 노선</h1>
      <p class="text-gray-600">백성운수 버스 운행 노선을 확인하세요</p>
    </div>

    <!-- Filters -->
    <!-- <div class="card p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">출발지</label>
          <select v-model="filters.departure" class="form-select">
            <option value="">전체</option>
            <option value="평택터미널">평택터미널</option>
            <option value="안중터미널">안중터미널</option>
            <option value="서정리">서정리</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">도착지</label>
          <select v-model="filters.destination" class="form-select">
            <option value="">전체</option>
            <option value="평택터미널">평택터미널</option>
            <option value="안중터미널">안중터미널</option>
            <option value="서정리">서정리</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">운행 유형</label>
          <select v-model="filters.type" class="form-select">
            <option value="">전체</option>
            <option value="평일">평일</option>
            <option value="주말">주말</option>
            <option value="공휴일">공휴일</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button @click="applyFilters" class="btn btn-primary">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          검색
        </button>
        <button @click="resetFilters" class="btn btn-outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          초기화
        </button>
      </div>
    </div> -->

    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Schedule List -->
    <div v-else>
      <div
        v-if="schedules.length > 0"
        class="grid grid-cols-1 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="schedule in schedules"
          :key="schedule.id"
          class="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          @click="goToDetail(schedule.url)"
        >
          <div class="mb-4">
            <h2 class="text-3xl font-semibold mb-2">
              {{ schedule.route_number }}번
            </h2>
          </div>

          <div class="flex justify-between items-center">
            <button
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              상세보기 →
            </button>
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
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSchedulesStore } from "@/stores/schedules";

export default {
  name: "Schedule",
  setup() {
    const router = useRouter();
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
      if (filters.departure) params.departure = filters.departure;
      if (filters.destination) params.destination = filters.destination;
      if (filters.type) params.type = filters.type;

      await schedulesStore.fetchSchedules(params);
    };

    const resetFilters = async () => {
      filters.departure = "";
      filters.destination = "";
      filters.type = "";
      await schedulesStore.fetchSchedules();
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
      applyFilters,
      resetFilters,
      goToDetail,
    };
  },
};
</script>
