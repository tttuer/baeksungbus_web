<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ isEditMode ? "답변 수정" : "답변 작성" }}
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
            <h1 class="text-xl font-bold text-gray-900 mb-3">
              {{ qa.title }}
            </h1>
            <div class="flex items-center text-sm text-gray-500 gap-4">
              <span class="flex items-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {{ qa.writer }}
              </span>
              <span class="flex items-center">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {{ qa.email }}
              </span>
              <span class="flex items-center">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {{ formatDate(qa.c_date) }}
              </span>
            </div>

            <!-- Question Attachments -->
            <div
              v-if="qa.attachment_filename && qa.attachment"
              class="mt-3 mb-3"
            >
              <div class="bg-white rounded-lg p-3 border">
                <img
                  :src="`data:image/jpeg;base64,${qa.attachment}`"
                  :alt="qa.attachment_filename"
                  class="max-w-full max-h-52 object-contain rounded-lg cursor-zoom-in hover:opacity-90"
                  @click="openImageViewer(`data:image/jpeg;base64,${qa.attachment}`, qa.attachment_filename)"
                />
                <p class="text-xs text-gray-500 mt-2">이미지를 클릭하면 크게 볼 수 있습니다.</p>
              </div>
            </div>

            <div
              v-if="getLostContentParts(qa.content).details.length > 0"
              class="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <table class="w-full text-sm">
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="detail in getLostContentParts(qa.content).details"
                    :key="detail.label"
                  >
                    <th class="w-32 bg-gray-50 px-3 py-2 text-left font-medium text-gray-700">
                      {{ detail.label }}
                    </th>
                    <td class="px-3 py-2 text-gray-900">
                      {{ detail.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                v-if="getLostContentParts(qa.content).body"
                class="border-t border-gray-200 p-3"
              >
                <p class="text-xs font-medium text-gray-500 mb-1">상세 내용</p>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">
                  {{ getLostContentParts(qa.content).body }}
                </p>
              </div>
            </div>
            <p v-else class="text-gray-600 mt-2">{{ qa.content }}</p>
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
              빠른 답변
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="template in answerTemplates"
                :key="template.label"
                type="button"
                @click="applyAnswerTemplate(template.content)"
                class="px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50"
              >
                {{ template.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ isEditMode ? "수정할 답변 내용 *" : "답변 내용 *" }}
            </label>
            <textarea
              v-model="answerContent"
              rows="8"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :placeholder="
                isEditMode ? '답변을 수정하세요...' : '답변을 입력하세요...'
              "
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
              {{
                isSubmitting
                  ? isEditMode
                    ? "답변 수정 중..."
                    : "답변 등록 중..."
                  : isEditMode
                    ? "답변 수정"
                    : "답변 등록"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="imageViewer.show"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-4"
      @click.self="closeImageViewer"
    >
      <button
        type="button"
        class="absolute top-4 right-4 text-white hover:text-gray-300"
        @click="closeImageViewer"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <div class="max-w-6xl max-h-[90vh]" @click.stop>
        <img
          :src="imageViewer.src"
          :alt="imageViewer.alt"
          class="max-w-full max-h-[85vh] object-contain"
        />
        <p v-if="imageViewer.alt" class="text-white text-center mt-3 text-sm">
          {{ imageViewer.alt }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from "vue";
import api from "@/services/api";
import { useQAsStore } from "@/stores/qas";
import { formatDate } from "@/utils/format";

export default {
  name: "AnswerModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    qaId: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ["close", "answered"],
  setup(props, { emit }) {
    const qasStore = useQAsStore();
    const isSubmitting = ref(false);
    const qa = ref(null);
    const isLoading = ref(false);

    const form = reactive({
      content: "",
      file: null,
    });

    const answerContent = ref("");
    const currentAnswer = ref(null);
    const isEditMode = ref(false);
    const imageViewer = reactive({
      show: false,
      src: "",
      alt: "",
    });
    const answerTemplates = [
      {
        label: "확인 후 연락",
        content:
          "접수해주신 내용을 확인했습니다. 담당자가 확인 후 입력하신 이메일로 안내드리겠습니다.",
      },
      {
        label: "추가 정보 요청",
        content:
          "확인을 위해 노선번호, 탑승 시간, 탑승/하차 정류장 정보를 추가로 알려주세요.",
      },
      {
        label: "분실물 보관 안내",
        content:
          "문의하신 분실물이 확인되어 보관 중입니다. 방문 전 전화로 수령 가능 시간을 확인해주세요.",
      },
    ];

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

    const applyAnswerTemplate = (content) => {
      answerContent.value = answerContent.value.trim()
        ? `${answerContent.value.trim()}\n\n${content}`
        : content;
    };

    const getLostContentParts = (content) => {
      if (!content || !content.includes("[분실 상황]")) {
        return { details: [], body: content || "" };
      }

      const [detailsBlock = "", bodyBlock = ""] = content.split("[상세 내용]");
      const details = detailsBlock
        .replace("[분실 상황]", "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const separatorIndex = line.indexOf(":");
          if (separatorIndex === -1) return null;
          return {
            label: line.slice(0, separatorIndex).trim(),
            value: formatLostDetailValue(
              line.slice(0, separatorIndex).trim(),
              line.slice(separatorIndex + 1).trim()
            ),
          };
        })
        .filter(Boolean);

      return {
        details,
        body: bodyBlock.trim(),
      };
    };

    const openImageViewer = (src, alt = "") => {
      imageViewer.src = src;
      imageViewer.alt = alt;
      imageViewer.show = true;
    };

    const closeImageViewer = () => {
      imageViewer.show = false;
      imageViewer.src = "";
      imageViewer.alt = "";
    };

    const formatLostDetailValue = (label, value) => {
      if (label !== "분실 추정 일시" || !value) return value;
      const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
      if (!match) return value;
      const [, year, month, day, hour, minute] = match;
      return `${year}년 ${month}월 ${day}일 ${hour}:${minute}`;
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
      if (!qa.value || !answerContent.value.trim()) {
        return;
      }

      try {
        isSubmitting.value = true;

        const answerData = {
          content: answerContent.value.trim(),
          qa_id: qa.value.id,
        };
        if (isEditMode.value) {
          answerData.id = currentAnswer.value.id; // 답변 수정 시 ID 포함

          await api.patch(
            `/api/answers/${currentAnswer.value.id}`,
            answerData,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          await api.post(`/api/answers`, answerData, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        }

        alert(
          isEditMode.value
            ? "답변이 성공적으로 수정되었습니다."
            : "답변이 성공적으로 등록되었습니다."
        );
        emit("answered");
        closeModal();
      } catch (error) {
        console.error("답변 등록 실패:", error);
        alert("답변 등록에 실패했습니다.");
      } finally {
        isSubmitting.value = false;
      }
    };

    const loadQA = async () => {
      if (!props.qaId) return;

      try {
        isLoading.value = true;
        qa.value = await qasStore.fetchQAById(props.qaId);

        if (qa.value.answers && qa.value.answers.length > 0) {
          // 답변이 있는 경우 수정 모드로 설정
          isEditMode.value = true;
          currentAnswer.value = qa.value.answers[0];
          answerContent.value = qa.value.answers[0].content;
        } else {
          // 답변이 없는 경우 새 답변 작성 모드
          isEditMode.value = false;
          currentAnswer.value = null;
          answerContent.value = "";
        }
      } catch (error) {
        console.error("QA 정보 로드 실패:", error);
        qa.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    // props.show가 변경될 때 처리
    watch(
      () => props.show,
      (newVal) => {
        if (!newVal) {
          resetForm();
        } else {
          loadQA();
        }
      }
    );

    return {
      form,
      qa,
      isSubmitting,
      isLoading,
      answerContent,
      currentAnswer,
      isEditMode,
      imageViewer,
      answerTemplates,
      closeModal,
      applyAnswerTemplate,
      getLostContentParts,
      openImageViewer,
      closeImageViewer,
      handleFileChange,
      submitAnswer,
      formatDate,
    };
  },
};
</script>
