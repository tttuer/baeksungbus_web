<template>
  <div class="qa-update">
    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <PasswordModal
      v-if="showPasswordModal"
      v-model="passwordInput"
      :loading="isVerifying"
      @submit="verifyPassword"
      @cancel="goBack"
    />

    <!-- Update Form -->
    <div v-else-if="qa" class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Q&A 수정</h1>
        <p class="text-gray-600">문의 내용을 수정할 수 있습니다.</p>
      </div>

      <!-- Form -->
      <div class="card p-6">
        <form @submit.prevent="submitForm">
          <!-- Personal Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                이름 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.writer"
                type="text"
                class="form-input"
                placeholder="이름을 입력하세요"
                required
                disabled
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                이메일 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                placeholder="이메일을 입력하세요"
                required
                disabled
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                비밀번호(글 수정, 삭제 시 필요합니다)
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          </div>

          <!-- Title -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              제목 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="문의 제목을 입력하세요"
              required
            />
          </div>

          <div
            v-if="isLostQA()"
            class="mb-6 rounded-lg border border-primary-100 bg-primary-50 p-4"
          >
            <h2 class="text-base font-semibold text-gray-900 mb-1">
              분실 상황
            </h2>
            <p class="text-sm text-gray-600 mb-4">
              분실 당시 정보를 항목별로 수정할 수 있습니다.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  노선번호
                </label>
                <input
                  v-model="form.routeNumber"
                  type="text"
                  class="form-input"
                  placeholder="예: 70, 370"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  분실 추정 일시
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    v-model="form.lostDate"
                    type="date"
                    class="form-input"
                    aria-label="분실 추정 날짜"
                  />
                  <input
                    v-model="form.lostTime"
                    type="time"
                    class="form-input"
                    aria-label="분실 추정 시간"
                  />
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <button
                    v-for="time in quickTimeOptions"
                    :key="time.value"
                    type="button"
                    class="px-3 py-1.5 text-xs font-medium rounded border"
                    :class="
                      form.lostTime === time.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    "
                    @click="selectLostTime(time.value)"
                  >
                    {{ time.label }}
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  탑승/하차 정류장
                </label>
                <input
                  v-model="form.stopInfo"
                  type="text"
                  class="form-input"
                  placeholder="예: 안성터미널 승차, 중앙대 하차"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  버스 안 위치
                </label>
                <input
                  v-model="form.busPosition"
                  type="text"
                  class="form-input"
                  placeholder="예: 뒷문 근처, 맨 뒷좌석"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  물건 종류
                </label>
                <input
                  v-model="form.itemType"
                  type="text"
                  class="form-input"
                  placeholder="예: 지갑, 휴대폰, 가방"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  색상/특징
                </label>
                <input
                  v-model="form.itemFeature"
                  type="text"
                  class="form-input"
                  placeholder="예: 검은색, 이름표 있음"
                />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ isLostQA() ? "상세 내용" : "내용" }}
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.content"
              rows="8"
              class="form-textarea"
              :placeholder="
                isLostQA()
                  ? '물건의 특징, 분실 당시 상황, 연락 가능한 시간 등을 적어주세요'
                  : '문의 내용을 자세히 작성해주세요'
              "
              required
            ></textarea>
            <p class="text-sm text-gray-500 mt-1">
              {{ form.content.length }}/1000자
            </p>
          </div>

          <!-- Current File -->
          <div
            v-if="qa.attachment_filename && !form.remove_current_file"
            class="mb-6"
          >
            <label class="block text-sm font-medium text-gray-700 mb-2">
              현재 첨부파일
            </label>
            <div
              class="flex items-center p-3 bg-gray-50 rounded-lg justify-between"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span class="text-sm text-gray-700">{{
                  qa.attachment_filename
                }}</span>
              </div>
              <button
                type="button"
                @click="removeCurrentFile"
                class="text-red-600 hover:text-red-700 text-sm"
              >
                삭제
              </button>
            </div>
          </div>

          <!-- File Removed Notice -->
          <div v-if="form.remove_current_file" class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              첨부파일 상태
            </label>
            <div
              class="flex items-center p-3 bg-red-50 rounded-lg justify-between border border-red-200"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-red-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span class="text-sm text-red-700"
                  >기존 첨부파일이 삭제 예정입니다</span
                >
              </div>
              <button
                type="button"
                @click="restoreCurrentFile"
                class="text-blue-600 hover:text-blue-700 text-sm"
              >
                복원
              </button>
            </div>
          </div>

          <!-- File Upload -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              새 첨부파일 끌어다 놓기
            </label>
            <FileDropZone
              accept=".jpg,.jpeg,.png"
              :max-size-mb="5"
              title="새 첨부 이미지를 끌어오세요"
              description="JPG, PNG 파일만 업로드 가능 (최대 5MB, 기존 파일은 삭제됩니다)"
              @selected="handleFileSelect"
            />
            <p class="text-sm text-gray-500 mt-1">
              JPG, PNG 파일만 업로드 가능 (최대 5MB, 기존 파일은 삭제됩니다)
            </p>

            <!-- New File Preview -->
            <div
              v-if="form.new_file"
              class="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between"
            >
              <div class="flex items-center">
                <svg
                  class="w-5 h-5 text-gray-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span class="text-sm text-gray-700">{{
                  form.new_file.name
                }}</span>
                <span class="text-sm text-gray-500 ml-2"
                  >({{ formatFileSize(form.new_file.size) }})</span
                >
              </div>
              <button
                type="button"
                @click="removeNewFile"
                class="text-red-600 hover:text-red-700"
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
          </div>

          <!-- Submit Buttons -->
          <div class="flex gap-4 justify-end">
            <router-link :to="`/qa/${qa.id}`" class="btn btn-outline">
              취소
            </router-link>
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
              {{ isSubmitting ? "수정 중..." : "수정 완료" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error State -->
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
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        Q&A를 찾을 수 없습니다
      </h3>
      <p class="text-gray-600 mb-4">
        요청하신 Q&A가 존재하지 않거나 수정 권한이 없습니다.
      </p>
      <router-link to="/qa" class="btn btn-primary"> Q&A 목록으로 </router-link>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQAsStore } from "@/stores/qas";
import FileDropZone from "@/components/FileDropZone.vue";
import PasswordModal from "@/components/PasswordModal.vue";
import api from "@/services/api";

export default {
  name: "QAUpdate",
  components: {
    FileDropZone,
    PasswordModal,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const qasStore = useQAsStore();

    const qa = ref(null);
    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const showPasswordModal = ref(false);
    const passwordInput = ref("");
    const isVerifying = ref(false);

    const form = reactive({
      writer: "",
      email: "",
      password: "",
      category: "",
      title: "",
      content: "",
      routeNumber: "",
      lostDate: "",
      lostTime: "",
      stopInfo: "",
      busPosition: "",
      itemType: "",
      itemFeature: "",
      new_file: null,
      remove_current_file: false,
    });

    const quickTimeOptions = [
      { label: "출근 07:00", value: "07:00" },
      { label: "오전 09:00", value: "09:00" },
      { label: "점심 12:00", value: "12:00" },
      { label: "오후 15:00", value: "15:00" },
      { label: "퇴근 18:00", value: "18:00" },
      { label: "저녁 20:00", value: "20:00" },
    ];

    const selectLostTime = (time) => {
      form.lostTime = time;
    };

    const handleFileUpload = (event) => {
      handleFileSelect(Array.from(event.target.files || []));
    };

    const handleFileSelect = (files) => {
      const file = files[0];
      if (file) {
        // 파일 크기 검증 (10MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB를 초과할 수 없습니다.");
          return;
        }

        // 파일 형식 검증 (이미지 파일만 허용)
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          alert("이미지 파일만 업로드할 수 있습니다.");
          return;
        }

        form.new_file = file;
      }
    };

    const removeNewFile = () => {
      form.new_file = null;
      // 파일 input 초기화
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    };

    const removeCurrentFile = () => {
      form.remove_current_file = true;
    };

    const restoreCurrentFile = () => {
      form.remove_current_file = false;
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const isLostQA = () => {
      return qa.value?.qa_type === "LOST";
    };

    const parseLostContent = (content) => {
      if (!content || !content.includes("[분실 상황]")) {
        return { details: {}, body: content || "" };
      }

      const [detailsBlock = "", bodyBlock = ""] = content.split("[상세 내용]");
      const details = {};

      detailsBlock
        .replace("[분실 상황]", "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => {
          const separatorIndex = line.indexOf(":");
          if (separatorIndex === -1) return;
          const label = line.slice(0, separatorIndex).trim();
          const value = line.slice(separatorIndex + 1).trim();
          details[label] = value;
        });

      return {
        details,
        body: bodyBlock.trim(),
      };
    };

    const toLostDateTimeParts = (value) => {
      if (!value) return { date: "", time: "" };

      const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (isoMatch) {
        const [, year, month, day, hour, minute] = isoMatch;
        return { date: `${year}-${month}-${day}`, time: `${hour}:${minute}` };
      }

      const koreanMatch = value.match(
        /^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일\s*(\d{1,2}):(\d{2})/
      );
      if (!koreanMatch) return { date: "", time: "" };

      const [, year, month, day, hour, minute] = koreanMatch;
      return {
        date: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
        time: `${hour.padStart(2, "0")}:${minute}`,
      };
    };

    const formatLostDateTime = (date, time) => {
      if (!date && !time) return "";
      if (!date) return time || "";
      if (!time) return date;
      const [year, month, day] = date.split("-");
      return `${year}년 ${month}월 ${day}일 ${time}`;
    };

    const buildLostContent = () => {
      const lostDetails = [
        ["노선번호", form.routeNumber],
        ["분실 추정 일시", formatLostDateTime(form.lostDate, form.lostTime)],
        ["탑승/하차 정류장", form.stopInfo],
        ["버스 안 위치", form.busPosition],
        ["물건 종류", form.itemType],
        ["색상/특징", form.itemFeature],
      ]
        .filter(([, value]) => value && String(value).trim())
        .map(([label, value]) => `${label}: ${value}`)
        .join("\n");

      return lostDetails
        ? `[분실 상황]\n${lostDetails}\n\n[상세 내용]\n${form.content}`
        : form.content;
    };

    const getStoredAccess = () => {
      return sessionStorage.getItem(`qaAccess:${route.params.id}`);
    };

    const canFetchDetail = () => {
      const storedAccess = getStoredAccess();
      return storedAccess === "authenticated";
    };

    const verifyPassword = async () => {
      try {
        isVerifying.value = true;

        await api.get(`/api/qas/${route.params.id}/check_password`, {
          params: { password: passwordInput.value },
        });

        sessionStorage.setItem(`qaAccess:${route.params.id}`, "authenticated");
        showPasswordModal.value = false;
        passwordInput.value = "";
        await loadQA({ force: true });
      } catch (error) {
        if (error.response?.status === 403) {
          alert("비밀번호가 올바르지 않습니다.");
        } else {
          console.error("비밀번호 확인 실패:", error);
          alert("비밀번호 확인 중 오류가 발생했습니다.");
        }
        passwordInput.value = "";
      } finally {
        isVerifying.value = false;
      }
    };

    const goBack = () => {
      router.push("/qa");
    };

    const loadQA = async ({ force = false } = {}) => {
      try {
        isLoading.value = true;
        const id = route.params.id;

        if (!force && !canFetchDetail()) {
          showPasswordModal.value = true;
          return;
        }

        qa.value = await qasStore.fetchQAById(id);

        // 답변이 있으면 수정 불가
        if (qa.value.answer) {
          alert("답변이 등록된 문의는 수정할 수 없습니다.");
          router.push(`/qa/${id}`);
          return;
        }

        // 폼에 기존 데이터 설정
        form.writer = qa.value.writer || "";
        form.email = qa.value.email || "";
        form.password = "";
        form.title = qa.value.title || "";

        if (isLostQA()) {
          const { details, body } = parseLostContent(qa.value.content || "");
          const lostDateTime = toLostDateTimeParts(details["분실 추정 일시"]);
          form.routeNumber = details["노선번호"] || "";
          form.lostDate = lostDateTime.date;
          form.lostTime = lostDateTime.time;
          form.stopInfo = details["탑승/하차 정류장"] || "";
          form.busPosition = details["버스 안 위치"] || "";
          form.itemType = details["물건 종류"] || "";
          form.itemFeature = details["색상/특징"] || "";
          form.content = body || "";
        } else {
          form.content = qa.value.content || "";
        }
      } catch (error) {
        console.error("Q&A 로드 실패:", error);
        qa.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const submitForm = async () => {
      // 폼 유효성 검사
      if (!form.writer.trim()) {
        alert("이름을 입력해주세요.");
        return;
      }

      if (!form.email.trim()) {
        alert("이메일을 입력해주세요.");
        return;
      }

      if (!form.password.trim()) {
        alert("비밀번호를 입력해주세요.");
        return;
      }

      if (!form.title.trim()) {
        alert("제목을 입력해주세요.");
        return;
      }

      if (!form.content.trim()) {
        alert("내용을 입력해주세요.");
        return;
      }

      if (form.content.length > 1000) {
        alert("내용은 1000자를 초과할 수 없습니다.");
        return;
      }

      try {
        isSubmitting.value = true;

        const formData = new FormData();
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("title", form.title);
        formData.append("content", isLostQA() ? buildLostContent() : form.content);

        // keepAttachment 로직 수정
        if (form.remove_current_file) {
          formData.append("keepAttachment", "false");
        } else {
          formData.append("keepAttachment", "true");
        }

        if (form.new_file) {
          formData.append("keepAttachment", "false");

          formData.append("attachment", form.new_file);
        }

        await qasStore.updateQA(qa.value.id, formData);

        alert("Q&A가 성공적으로 수정되었습니다.");
        router.push(`/qa/${qa.value.id}`);
      } catch (error) {
        console.error("Q&A 수정 실패:", error);
        alert("Q&A 수정에 실패했습니다. 다시 시도해주세요.");
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      loadQA();
    });

    return {
      qa,
      form,
      isLoading,
      isSubmitting,
      showPasswordModal,
      passwordInput,
      isVerifying,
      handleFileUpload,
      handleFileSelect,
      removeNewFile,
      removeCurrentFile,
      restoreCurrentFile,
      formatFileSize,
      isLostQA,
      quickTimeOptions,
      selectLostTime,
      verifyPassword,
      goBack,
      submitForm,
    };
  },
};
</script>
