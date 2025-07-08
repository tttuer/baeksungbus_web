<template>
  <div class="qa-form">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">분실물 문의</h1>
      <p class="text-gray-600">분실된 물건에 대한 정보를 입력해주세요.</p>
    </div>

    <!-- Form -->
    <div class="card p-6">
      <form @submit.prevent="submitForm">
        <!-- Personal Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              작성자 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.writer"
              type="text"
              class="form-input"
              placeholder="이름을 입력하세요"
              required
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
            />
            <p class="text-sm text-gray-500 mt-1">
              답변을 받을 이메일 주소입니다.
            </p>
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

        <!-- Content -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            내용 <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.content"
            rows="8"
            class="form-textarea"
            placeholder="문의 내용을 자세히 작성해주세요"
            required
          ></textarea>
          <p class="text-sm text-gray-500 mt-1">
            {{ form.content.length }}/1000자
          </p>
        </div>

        <!-- File Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            첨부파일
          </label>
          <div class="mt-2">
            <input
              type="file"
              @change="handleFileUpload"
              class="form-input"
              accept=".jpg,.jpeg,.png"
            />
          </div>
          <p class="text-sm text-gray-500 mt-1">
            JPG, PNG 파일만 업로드 가능 (최대 10MB)
          </p>

          <!-- File Preview -->
          <div
            v-if="form.file"
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
              <span class="text-sm text-gray-700">{{ form.file.name }}</span>
              <span class="text-sm text-gray-500 ml-2"
                >({{ formatFileSize(form.file.size) }})</span
              >
            </div>
            <button
              type="button"
              @click="removeFile"
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

        <!-- File Upload -->
        <div class="mb-6">
          <div class="form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="hidden"
              name="hidden"
              v-model="form.hidden"
            />
            <label class="form-check-label m-2" for="hidden">비밀글</label>
          </div>
        </div>

        <!-- CAPTCHA (Optional) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            보안문자 <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <input
                v-model="form.captcha"
                type="text"
                class="form-input"
                placeholder="보안문자를 입력하세요"
                required
              />
            </div>
            <div class="bg-gray-100 p-3 rounded border">
              <img
                v-if="captchaImage"
                :src="captchaImage"
                alt="보안문자"
                class="h-12"
              />
              <div
                v-else
                class="h-12 flex items-center justify-center text-gray-500"
              >
                로딩 중...
              </div>
            </div>
            <button
              type="button"
              @click="refreshCaptcha"
              class="btn btn-outline btn-sm"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              새로고침
            </button>
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
            {{ isSubmitting ? "등록 중..." : "문의 등록" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Privacy Modal -->
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQAsStore } from "@/stores/qas";
import api from "@/services/api";

export default {
  name: "LostForm",
  setup() {
    const router = useRouter();
    const qasStore = useQAsStore();

    const isSubmitting = ref(false);
    const showPrivacyModal = ref(false);
    const captchaImage = ref(null);
    const captchaId = ref(null);

    const form = reactive({
      writer: "",
      email: "",
      qa_type: "LOST",
      title: "",
      content: "",
      file: null,
      captcha: "",
      hidden: true, // 비밀글 여부
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 파일 크기 검증 (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert("파일 크기는 10MB를 초과할 수 없습니다.");
          event.target.value = "";
          return;
        }

        // 파일 형식 검증
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          alert("지원하지 않는 파일 형식입니다.");
          event.target.value = "";
          return;
        }

        form.file = file;
      }
    };

    const removeFile = () => {
      form.file = null;
      // 파일 input 초기화
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const loadCaptcha = async () => {
      try {
        const response = await api.get("/api/captcha_image");
        captchaId.value = response.data.captcha_id;
        captchaImage.value = response.data.image; // base64 URI
      } catch (error) {
        console.error("캡차 로드 실패:", error);
      }
    };

    const refreshCaptcha = () => {
      form.captcha = "";
      loadCaptcha();
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

      if (!form.captcha.trim()) {
        alert("보안문자를 입력해주세요.");
        return;
      }

      try {
        isSubmitting.value = true;

        // 1. 먼저 CAPTCHA 검증
        await api.post(
          "/api/submit",
          new URLSearchParams({
            captcha_id: captchaId.value, // ← 이걸 함께 보내야 서버가 유효성 검사 가능
            captcha: form.captcha,
          })
        );

        const formData = new FormData();
        formData.append("writer", form.writer);
        formData.append("email", form.email);
        formData.append("password", form.password || "");
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("hidden", form.hidden);
        formData.append("qa_type", form.qa_type);

        if (form.file) {
          formData.append("attachment", form.file);
        }

        await qasStore.createQA(formData);

        alert(
          "문의가 성공적으로 등록되었습니다. 빠른 시일 내에 답변드리겠습니다."
        );
        router.push("/lost");
      } catch (error) {
        if (error.response?.data?.detail === "Invalid CAPTCHA") {
          alert("보안문자가 올바르지 않습니다. 다시 입력해주세요.");
          refreshCaptcha();
        } else {
          console.error("문의 등록 실패:", error);
          alert("문의 등록에 실패했습니다. 다시 시도해주세요.");
        }
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      loadCaptcha();
    });

    return {
      form,
      isSubmitting,
      showPrivacyModal,
      captchaImage,
      handleFileUpload,
      removeFile,
      formatFileSize,
      refreshCaptcha,
      submitForm,
    };
  },
};
</script>
