<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? '답변 수정' : '답변 작성' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
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

      <!-- Modal Body -->
      <div class="p-6 space-y-6">
        <!-- QA Info -->
        <div v-if="qa" class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">문의 내용</h4>
          <div class="text-sm text-gray-700">
            <p class="font-medium">{{ qa.title }}</p>
            <p class="text-gray-600 mt-1">{{ qa.writer }}</p>
            <p class="text-gray-600 mt-2">{{ qa.content }}</p>
          </div>
        </div>

        <!-- Current Answer (for edit mode) -->
        <div v-if="currentAnswer" class="bg-blue-50 rounded-lg p-4">
          <h4 class="font-medium text-gray-900 mb-2">현재 답변</h4>
          <div class="text-sm text-gray-700">
            <p class="whitespace-pre-wrap">{{ currentAnswer.content }}</p>
          </div>
        </div>

        <!-- Answer Form -->
        <form @submit.prevent="submitAnswer" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ isEditMode ? '수정할 답변 내용 *' : '답변 내용 *' }}
            </label>
            <textarea
              v-model="answerContent"
              rows="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="isEditMode ? '답변을 수정하세요...' : '답변을 입력하세요...'"
              required
            ></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !answerContent.trim()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              <svg
                v-if="isSubmitting"
                class="w-4 h-4 mr-2 animate-spin inline"
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
              {{ isSubmitting ? (isEditMode ? "답변 수정 중..." : "답변 등록 중...") : (isEditMode ? "답변 수정" : "답변 등록") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import api from "@/services/api";

export default {
  name: "AnswerModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    qa: {
      type: Object,
      default: null,
    },
  },
  emits: ["close", "answered"],
  setup(props, { emit }) {
    const isSubmitting = ref(false);

    const form = reactive({
      content: "",
      file: null,
    });

    const answerContent = ref("");
    const currentAnswer = ref(null);
    const isEditMode = ref(false);

    const resetForm = () => {
      form.content = "";
      form.file = null;
      answerContent.value = "";
      currentAnswer.value = null;
      isEditMode.value = false;
    };

    const closeModal = () => {
      resetForm();
      emit("close");
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert("파일 크기는 10MB를 초과할 수 없습니다.");
          event.target.value = "";
          return;
        }
        form.file = file;
      }
    };

    const submitAnswer = async () => {
      if (!props.qa || !answerContent.value.trim()) {
        return;
      }

      try {
        isSubmitting.value = true;

        const answerData = {
          content: answerContent.value.trim(),
          qa_id: props.qa.id
        };

        await api.post(`/api/answers`, answerData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        alert(isEditMode.value ? "답변이 성공적으로 수정되었습니다." : "답변이 성공적으로 등록되었습니다.");
        emit("answered");
        closeModal();
      } catch (error) {
        console.error("답변 등록 실패:", error);
        alert("답변 등록에 실패했습니다.");
      } finally {
        isSubmitting.value = false;
      }
    };

    // props.show가 변경될 때 처리
    watch(
      () => props.show,
      (newVal) => {
        if (!newVal) {
          resetForm();
        } else if (props.qa && props.qa.answers && props.qa.answers.length > 0) {
          // 답변이 있는 경우 수정 모드로 설정
          isEditMode.value = true;
          currentAnswer.value = props.qa.answers[0];
          answerContent.value = props.qa.answers[0].content;
        } else {
          // 답변이 없는 경우 새 답변 작성 모드
          isEditMode.value = false;
          currentAnswer.value = null;
          answerContent.value = "";
        }
      }
    );

    return {
      form,
      isSubmitting,
      answerContent,
      currentAnswer,
      isEditMode,
      closeModal,
      handleFileChange,
      submitAnswer,
    };
  },
};
</script>
