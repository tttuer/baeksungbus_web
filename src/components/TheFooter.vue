<template>
  <footer class="bg-gray-800 text-white py-8 mt-12">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h5 class="text-xl font-bold mb-4">백성운수</h5>
          <div class="space-y-2 text-gray-300">
            <p class="flex items-center">
              <svg
                class="w-4 h-4 mr-2 text-primary-400"
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
              경기도 안성시 금석길 14
            </p>
            <p class="flex items-center">
              <svg
                class="w-4 h-4 mr-2 text-primary-400"
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
              대표전화: 031-673-3456
            </p>
            <p class="flex items-center">
              <svg
                class="w-4 h-4 mr-2 text-primary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              baeksungbus@email.com
            </p>
          </div>
        </div>

        <div>
          <h5 class="text-xl font-bold mb-4">운행 시간</h5>
          <div class="space-y-2 text-gray-300">
            <p>평일: 05:30 ~ 23:00</p>
            <p>주말/공휴일: 06:00 ~ 22:30</p>
            <p class="text-sm text-gray-400">
              ※ 날씨 및 교통상황에 따라 변경될 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      <hr class="my-8 border-gray-700" />

      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-gray-400">
            &copy; {{ currentYear }} 백성운수. All rights reserved.
          </p>
        </div>
        <div class="flex space-x-6">
          <router-link
            to="/qa"
            class="text-gray-300 hover:text-white transition-colors duration-200"
          >
            고객센터
          </router-link>
          <router-link
            to="/lost"
            class="text-gray-300 hover:text-white transition-colors duration-200"
          >
            분실물센터
          </router-link>
          <router-link
            to="/recruit"
            class="text-gray-300 hover:text-white transition-colors duration-200"
          >
            채용정보
          </router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { computed } from "vue";

export default {
  name: "TheFooter",
  setup() {
    const currentYear = computed(() => new Date().getFullYear());

    return {
      currentYear,
    };
  },
};
</script>
