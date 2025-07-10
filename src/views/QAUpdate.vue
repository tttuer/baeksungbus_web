<template>
  <div class="qa-update">
    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

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

          <!-- Current File -->
          <div v-if="qa.attachment_filename && !form.remove_current_file" class="mb-6">
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
            <div class="flex items-center p-3 bg-red-50 rounded-lg justify-between border border-red-200">
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
                <span class="text-sm text-red-700">기존 첨부파일이 삭제 예정입니다</span>
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

      <!-- Update Notice -->
      <div class="card p-6 bg-yellow-50 border-yellow-200">
        <div class="flex items-start">
          <svg
            class="w-5 h-5 text-yellow-600 mr-3 mt-0.5"
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
          <div>
            <h3 class="font-semibold text-yellow-800 mb-2">수정 안내</h3>
            <ul class="text-yellow-700 text-sm space-y-1">
              <li>• 답변이 등록된 문의는 수정할 수 없습니다.</li>
              <li>• 수정 후에는 답변 대기 상태로 변경됩니다.</li>
              <li>• 첨부파일을 변경하면 기존 파일은 삭제됩니다.</li>
            </ul>
          </div>
        </div>
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

export default {
  name: "QAUpdate",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const qasStore = useQAsStore();

    const qa = ref(null);
    const isLoading = ref(true);
    const isSubmitting = ref(false);

    const form = reactive({
      writer: "",
      email: "",
      password: "",
      category: "",
      title: "",
      content: "",
      new_file: null,
      remove_current_file: false,
    });

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 파일 크기 검증 (10MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("파일 크기는 5MB를 초과할 수 없습니다.");
          event.target.value = "";
          return;
        }

        // 파일 형식 검증 (이미지 파일만 허용)
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          alert("이미지 파일만 업로드할 수 있습니다.");
          event.target.value = "";
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

    const loadQA = async () => {
      try {
        isLoading.value = true;
        const id = route.params.id;

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
        form.password = qa.value.password || "";
        form.title = qa.value.title || "";
        form.content = qa.value.content || "";
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
        formData.append("content", form.content);

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
      handleFileUpload,
      removeNewFile,
      removeCurrentFile,
      restoreCurrentFile,
      formatFileSize,
      submitForm,
    };
  },
};
</script>
