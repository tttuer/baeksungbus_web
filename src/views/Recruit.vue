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

      <div
        v-if="openings.length > 0"
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div
          v-for="opening in openings"
          :key="opening.id"
          class="card p-6 hover:shadow-lg transition-shadow"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                {{ opening.title }}
              </h3>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  class="bg-primary-100 text-primary-800 text-sm px-2 py-1 rounded"
                >
                  {{ opening.department }}
                </span>
                <span
                  class="bg-green-100 text-green-800 text-sm px-2 py-1 rounded"
                >
                  {{ opening.employment_type }}
                </span>
              </div>
            </div>
            <span
              class="px-2 py-1 text-xs font-medium rounded"
              :class="
                opening.urgent
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              "
            >
              {{ opening.urgent ? "급구" : "모집중" }}
            </span>
          </div>

          <div class="space-y-3 mb-4">
            <div class="flex items-center text-gray-600">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ opening.location }}
            </div>

            <div class="flex items-center text-gray-600">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              {{ opening.salary }}
            </div>

            <div class="flex items-center text-gray-600">
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
              {{ opening.schedule }}
            </div>
          </div>

          <div class="mb-4">
            <h4 class="font-medium mb-2">주요 업무</h4>
            <ul class="text-gray-600 text-sm space-y-1">
              <li
                v-for="task in opening.tasks"
                :key="task"
                class="flex items-start"
              >
                <span class="text-primary-600 mr-2">•</span>
                {{ task }}
              </li>
            </ul>
          </div>

          <div class="mb-4">
            <h4 class="font-medium mb-2">자격 요건</h4>
            <ul class="text-gray-600 text-sm space-y-1">
              <li
                v-for="requirement in opening.requirements"
                :key="requirement"
                class="flex items-start"
              >
                <span class="text-primary-600 mr-2">•</span>
                {{ requirement }}
              </li>
            </ul>
          </div>

          <div
            class="flex justify-between items-center pt-4 border-t border-gray-200"
          >
            <span class="text-sm text-gray-500">
              마감: {{ formatDate(opening.deadline) }}
            </span>
            <button
              @click="applyForJob(opening)"
              class="btn btn-primary btn-sm"
            >
              지원하기
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
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"
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
import { ref, onMounted } from "vue";
import { formatDate } from "@/utils/format";

export default {
  name: "Recruit",
  setup() {
    const openings = ref([]);

    // 더미 채용 공고 데이터
    const dummyOpenings = [
      // {
      //   id: 1,
      //   title: "버스 운전기사",
      //   department: "운송부",
      //   employment_type: "정규직",
      //   location: "경기도 평택시",
      //   salary: "월 280만원~320만원 (경력에 따라 차등)",
      //   schedule: "2교대 근무 (주 5일)",
      //   urgent: true,
      //   deadline: "2024-02-29",
      //   tasks: [
      //     "시내버스 및 시외버스 운전",
      //     "승객 안전 관리",
      //     "차량 점검 및 관리",
      //     "운행일지 작성",
      //   ],
      //   requirements: [
      //     "대형면허 소지자 (1종 대형)",
      //     "버스 운전 경력 1년 이상 우대",
      //     "무사고 운전자 우대",
      //     "성실하고 책임감 있는 분",
      //   ],
      // },
      // {
      //   id: 2,
      //   title: "정비기사",
      //   department: "정비부",
      //   employment_type: "정규직",
      //   location: "경기도 평택시",
      //   salary: "월 250만원~300만원",
      //   schedule: "주간 근무 (주 5일)",
      //   urgent: false,
      //   deadline: "2024-03-15",
      //   tasks: [
      //     "버스 정기점검 및 수리",
      //     "고장 진단 및 부품 교체",
      //     "안전점검 실시",
      //     "정비 기록 관리",
      //   ],
      //   requirements: [
      //     "자동차 정비 관련 자격증 소지",
      //     "대형차 정비 경력 우대",
      //     "기계 관련 전문지식 보유",
      //     "체력이 좋으신 분",
      //   ],
      // },
    ];

    

    const applyForJob = (opening) => {
      alert(
        `${opening.title} 지원하기\n\n지원 방법:\n1. 이메일: recruit@baeksungbus.com\n2. 전화 문의: 031-673-3456\n3. 방문 접수: 경기도 안성시 금석길 14\n\n※ 이력서와 자기소개서를 준비해주세요.`
      );
    };

    onMounted(() => {
      openings.value = dummyOpenings;
    });

    return {
      openings,
      formatDate,
      applyForJob,
    };
  },
};
</script>
