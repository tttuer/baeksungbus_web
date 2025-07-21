<template>
  <div class="recruit">
    <!-- Page Header -->
    <div
      class="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8 mb-6"
    >
      <h1 class="text-3xl font-bold mb-2">채용 정보</h1>
      <p class="text-primary-100 text-lg">
        백성운수와 함께 성장할 인재를 모집합니다
      </p>
    </div>

    <!-- Current Openings -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">현재 모집 중인 직종</h2>

      <!-- Loading -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p class="text-gray-600 mt-2">로딩 중...</p>
      </div>

      <div
        v-else-if="openings.length > 0"
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div
          v-for="opening in openings"
          :key="opening.id"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
        >
          <div class="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b border-gray-100">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-2xl font-bold text-gray-900">
                {{ opening.title }}
              </h3>
              <span class="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                모집중
              </span>
            </div>
            <span class="inline-flex items-center bg-primary-100 text-primary-800 text-sm font-semibold px-4 py-2 rounded-full">
              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {{ opening.department }}
            </span>
          </div>

          <div class="p-6 space-y-6">
            <div>
              <h4 class="flex items-center text-lg font-semibold text-gray-900 mb-4">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                응시자격
              </h4>
              <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <table class="w-full">
                  <thead>
                    <tr class="bg-gray-800 text-white">
                      <th class="py-3 px-4 text-left font-semibold">구분</th>
                      <th class="py-3 px-4 text-left font-semibold">내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, idx) in opening.experience"
                      :key="idx"
                      class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-100">{{ item.label }}</td>
                      <td class="py-3 px-4 text-gray-600">{{ item.value }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="opening.application_method">
              <h4 class="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                응시방법
              </h4>
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <p class="text-gray-700 font-medium">{{ opening.application_method }}</p>
              </div>
            </div>

            <div v-if="opening.note">
              <h4 class="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <svg class="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
                비고
              </h4>
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <pre class="text-amber-800 font-medium text-sm leading-relaxed whitespace-pre-wrap">{{ opening.note }}</pre>
              </div>
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          현재 채용 공고가 없습니다
        </h3>
        <p class="text-gray-600">
          새로운 채용 공고가 올라오면 알려드리겠습니다.
        </p>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="card p-6">
      <h2 class="text-xl font-semibold mb-4">채용 문의</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 class="font-medium mb-3">연락처 정보</h3>
          <div class="space-y-2 text-gray-600">
            <p class="flex items-center">
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              031-673-3456
            </p>
            <p class="flex items-center">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              평일 08:30 ~ 17:00
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRecruitsStore } from "@/stores/recruits";

export default {
  name: "Recruit",
  setup() {
    const recruitsStore = useRecruitsStore();
    const { recruits, isLoading } = storeToRefs(recruitsStore);

    onMounted(() => {
      recruitsStore.fetchRecruits();
    });

    return {
      openings: recruits,
      isLoading,
    };
  },
};
</script>
