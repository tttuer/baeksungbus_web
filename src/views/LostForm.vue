<template>
  <div class="lost-form">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">분실물 신고</h1>
      <p class="text-gray-600">
        버스에서 잃어버린 물건을 신고해주세요. 발견 시 연락드리겠습니다.
      </p>
    </div>

    <!-- Form -->
    <div class="card p-6">
      <form @submit.prevent="submitForm">
        <!-- Personal Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              신고자명 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.reporter_name"
              type="text"
              class="form-input"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              연락처 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="form-input"
              placeholder="연락처를 입력하세요"
              required
            />
          </div>
        </div>

        <!-- Lost Item Info -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4">분실물 정보</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                분실물명 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.item_name"
                type="text"
                class="form-input"
                placeholder="예: 검은색 지갑, 아이폰 13"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                분실일 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.lost_date"
                type="date"
                class="form-input"
                :max="todayDate"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                버스 노선 <span class="text-red-500">*</span>
              </label>
              <select v-model="form.bus_route" class="form-select" required>
                <option value="">노선을 선택하세요</option>
                <option value="15번">15번</option>
                <option value="25번">25번</option>
                <option value="30번">30번</option>
                <option value="35번">35번</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                분실 장소
              </label>
              <select v-model="form.lost_location" class="form-select">
                <option value="">선택하세요</option>
                <option value="평택터미널">평택터미널</option>
                <option value="안중터미널">안중터미널</option>
                <option value="서정리">서정리</option>
                <option value="현화리">현화리</option>
                <option value="버스 내부">버스 내부</option>
                <option value="기타">기타</option>
              </select>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              상세 설명 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              class="form-textarea"
              placeholder="분실물의 색상, 크기, 특징 등을 자세히 기록해주세요"
              required
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              {{ form.description.length }}/500자
            </p>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-4">추가 정보</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                탑승 시간 (대략)
              </label>
              <input
                v-model="form.boarding_time"
                type="time"
                class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                하차 정류장
              </label>
              <input
                v-model="form.drop_off_location"
                type="text"
                class="form-input"
                placeholder="하차한 정류장명"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              기타 특이사항
            </label>
            <textarea
              v-model="form.additional_info"
              rows="3"
              class="form-textarea"
              placeholder="버스 기사님께 말씀드린 내용이나 기타 도움이 될 만한 정보"
            ></textarea>
          </div>
        </div>

        <!-- Contact Preference -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            연락 받을 방법
          </label>
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="form.contact_method"
                type="radio"
                value="phone"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">전화</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.contact_method"
                type="radio"
                value="sms"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">문자메시지</span>
            </label>
            <label class="flex items-center">
              <input
                v-model="form.contact_method"
                type="radio"
                value="both"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <span class="ml-2 text-sm text-gray-700">전화 + 문자</span>
            </label>
          </div>
        </div>

        <!-- Privacy Agreement -->
        <div class="mb-6">
          <div class="flex items-start">
            <input
              v-model="form.privacy_agreed"
              type="checkbox"
              id="privacy"
              class="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              required
            />
            <label for="privacy" class="ml-2 text-sm text-gray-700">
              <span class="text-red-500">*</span>
              개인정보 수집 및 이용에 동의합니다.
              <button
                type="button"
                @click="showPrivacyModal = true"
                class="text-primary-600 hover:text-primary-700 underline ml-1"
              >
                자세히 보기
              </button>
            </label>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex gap-4 justify-end">
          <router-link to="/lost" class="btn btn-outline"> 취소 </router-link>
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
            {{ isSubmitting ? "신고 중..." : "분실물 신고" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Info Section -->
    <div class="mt-8 card p-6 bg-blue-50 border-blue-200">
      <h3 class="text-lg font-semibold text-blue-900 mb-3">분실물 신고 안내</h3>
      <div class="space-y-2 text-blue-800 text-sm">
        <p class="flex items-start">
          <svg
            class="w-4 h-4 mr-2 mt-0.5 text-blue-600"
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
          분실물 발견 시 즉시 연락드립니다.
        </p>
        <p class="flex items-start">
          <svg
            class="w-4 h-4 mr-2 mt-0.5 text-blue-600"
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
          분실물은 발견일로부터 6개월간 보관됩니다.
        </p>
        <p class="flex items-start">
          <svg
            class="w-4 h-4 mr-2 mt-0.5 text-blue-600"
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
          수령 시 신분증을 지참해주세요.
        </p>
        <p class="flex items-start">
          <svg
            class="w-4 h-4 mr-2 mt-0.5 text-blue-600"
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
          문의: 031-673-3456 (평일 09:00~18:00)
        </p>
      </div>
    </div>

    <!-- Privacy Modal -->
    <div
      v-if="showPrivacyModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white"
      >
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              개인정보 수집 및 이용 동의
            </h3>
            <button
              @click="showPrivacyModal = false"
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

          <div class="text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h4 class="font-semibold mb-2">1. 개인정보 수집 목적</h4>
              <p>분실물 신고 접수 및 발견 시 연락</p>
            </div>

            <div>
              <h4 class="font-semibold mb-2">2. 수집하는 개인정보 항목</h4>
              <ul class="list-disc ml-4">
                <li>필수: 신고자명, 연락처</li>
                <li>선택: 기타 연락 정보</li>
              </ul>
            </div>

            <div>
              <h4 class="font-semibold mb-2">3. 개인정보 보유 및 이용기간</h4>
              <p>분실물 보관기간(6개월) 경과 후 파기</p>
            </div>

            <div>
              <h4 class="font-semibold mb-2">4. 개인정보 제공 거부권</h4>
              <p>
                개인정보 수집에 동의하지 않을 권리가 있으나, 동의 거부 시 분실물
                신고 서비스 이용이 제한될 수 있습니다.
              </p>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <button @click="showPrivacyModal = false" class="btn btn-primary">
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "LostForm",
  setup() {
    const router = useRouter();

    const isSubmitting = ref(false);
    const showPrivacyModal = ref(false);

    const form = reactive({
      reporter_name: "",
      phone: "",
      item_name: "",
      lost_date: "",
      bus_route: "",
      lost_location: "",
      description: "",
      boarding_time: "",
      drop_off_location: "",
      additional_info: "",
      contact_method: "phone",
      privacy_agreed: false,
    });

    const todayDate = computed(() => {
      const today = new Date();
      return today.toISOString().split("T")[0];
    });

    const submitForm = async () => {
      // 폼 유효성 검사
      if (!form.reporter_name.trim()) {
        alert("신고자명을 입력해주세요.");
        return;
      }

      if (!form.phone.trim()) {
        alert("연락처를 입력해주세요.");
        return;
      }

      if (!form.item_name.trim()) {
        alert("분실물명을 입력해주세요.");
        return;
      }

      if (!form.lost_date) {
        alert("분실일을 선택해주세요.");
        return;
      }

      if (!form.bus_route) {
        alert("버스 노선을 선택해주세요.");
        return;
      }

      if (!form.description.trim()) {
        alert("상세 설명을 입력해주세요.");
        return;
      }

      if (form.description.length > 500) {
        alert("상세 설명은 500자를 초과할 수 없습니다.");
        return;
      }

      if (!form.privacy_agreed) {
        alert("개인정보 수집 및 이용에 동의해주세요.");
        return;
      }

      try {
        isSubmitting.value = true;

        const lostItemData = {
          reporter_name: form.reporter_name,
          phone: form.phone,
          item_name: form.item_name,
          lost_date: form.lost_date,
          bus_route: form.bus_route,
          lost_location: form.lost_location || "",
          description: form.description,
          boarding_time: form.boarding_time || "",
          drop_off_location: form.drop_off_location || "",
          additional_info: form.additional_info || "",
          contact_method: form.contact_method,
        };

        // API 호출 (실제 구현 필요)
        // await lostItemsStore.createLostItem(lostItemData)
        console.log("분실물 신고 데이터:", lostItemData);

        alert("분실물 신고가 접수되었습니다. 발견 시 연락드리겠습니다.");
        router.push("/lost");
      } catch (error) {
        console.error("분실물 신고 실패:", error);
        alert("분실물 신고에 실패했습니다. 다시 시도해주세요.");
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      form,
      isSubmitting,
      showPrivacyModal,
      todayDate,
      submitForm,
    };
  },
};
</script>
