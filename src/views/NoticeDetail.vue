<template>
  <div class="notice-detail">
    <!-- Loading -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
    </div>

    <!-- Notice Content -->
    <div v-else-if="notice" class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex text-sm text-gray-500">
        <router-link to="/" class="hover:text-primary-600">홈</router-link>
        <span class="mx-2">/</span>
        <router-link to="/notice" class="hover:text-primary-600"
          >공지사항</router-link
        >
        <span class="mx-2">/</span>
        <span class="text-gray-900">{{ notice.title }}</span>
      </nav>

      <!-- Notice Header -->
      <div class="card p-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            
            <h1 class="text-2xl font-bold text-gray-900 mb-3">
              {{ notice.title }}
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
                백성운수(주)
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
                {{ formatDate(notice.c_date) }}
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                조회 {{ notice.read_cnt || 0 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Notice Content -->
      <div class="card p-6">
        <!-- Question Attachments (Images) -->
        <div
          v-if="notice.attachment_filename && notice.attachment"
          class="mb-6"
        >
          <div class="bg-gray-50 rounded-lg p-4">
            <img
              :src="getImageUrl(notice.attachment)"
              :alt="notice.attachment_filename"
              class="max-w-7/10 max-h-7/10 object-contain rounded-lg shadow-sm"
            />
          </div>
        </div>
        <div class="prose prose-lg max-w-none">
          <div v-html="formatContent(notice.content)"></div>
        </div>

        <!-- Attachments -->
        <div
          v-if="notice.file_name || notice.file_data"
          class="mt-6 pt-6 border-t border-gray-200"
        >
          <h3 class="text-lg font-semibold mb-3">첨부파일</h3>
          <div class="flex items-center p-3 bg-gray-50 rounded-lg">
            <svg
              class="w-5 h-5 text-gray-400 mr-3"
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
            <span class="flex-1">{{ notice.file_name }}</span>
            <button
              @click="downloadFile"
              class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              다운로드
            </button>
          </div>
        </div>
      </div>


      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <router-link to="/notice" class="btn btn-outline">
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          목록으로
        </router-link>

        <div class="flex gap-2">
          <button @click="goToEdit" v-if="canEdit" class="btn btn-outline">
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            수정
          </button>
          <button
            @click="deleteNotice"
            v-if="canDelete"
            class="btn bg-red-600 text-white hover:bg-red-700"
          >
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            삭제
          </button>
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
        공지사항을 찾을 수 없습니다
      </h3>
      <p class="text-gray-600 mb-4">
        요청하신 공지사항이 존재하지 않거나 삭제되었습니다.
      </p>
      <router-link to="/notice" class="btn btn-primary">
        공지사항 목록으로
      </router-link>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNoticesStore } from "@/stores/notices";
import { useAuthStore } from "@/stores/auth";
import { formatDate } from "@/utils/format";

export default {
  name: "NoticeDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const noticesStore = useNoticesStore();
    const authStore = useAuthStore();

    const notice = ref(null);
    const previousNotice = ref(null);
    const nextNotice = ref(null);
    const isLoading = ref(true);

    const canEdit = computed(() => authStore.isAdmin);
    const canDelete = computed(() => authStore.isAdmin);

    const getTypeClass = (type) => {
      const classes = {
        NOTICE: "bg-blue-100 text-blue-800",
        TIME: "bg-green-100 text-green-800",
        TTOCK: "bg-purple-100 text-purple-800",
      };
      return classes[type] || "bg-gray-100 text-gray-800";
    };

    const getTypeLabel = (type) => {
      const labels = {
        NOTICE: "일반공지",
        TIME: "시간표",
        TTOCK: "정류장",
      };
      return labels[type] || "기타";
    };

    

    const formatContent = (content) => {
      if (!content) return "";
      return content.replace(/\n/g, "<br>");
    };

    const shareNotice = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: notice.value.title,
            text: notice.value.content.substring(0, 100) + "...",
            url: window.location.href,
          });
        } catch (error) {
          console.log("공유 취소됨");
        }
      } else {
        // 폴백: URL 복사
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert("링크가 복사되었습니다.");
        } catch (error) {
          console.error("복사 실패:", error);
        }
      }
    };

    const getImageUrl = (imageData) => {
      if (!imageData) return "";

      // Base64 문자열인 경우
      if (typeof imageData === "string" && imageData.startsWith("data:")) {
        return imageData;
      }

      // Base64 문자열인 경우 (data: 접두사 없음)
      if (typeof imageData === "string") {
        return `data:image/jpeg;base64,${imageData}`;
      }

      // Blob 데이터인 경우
      if (imageData instanceof Blob) {
        return URL.createObjectURL(imageData);
      }

      // ArrayBuffer나 Uint8Array인 경우
      if (imageData instanceof ArrayBuffer || imageData instanceof Uint8Array) {
        const blob = new Blob([imageData], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
      }

      // 바이트 배열인 경우 Base64로 변환
      if (Array.isArray(imageData)) {
        const uint8Array = new Uint8Array(imageData);
        const blob = new Blob([uint8Array], { type: "image/jpeg" });
        return URL.createObjectURL(blob);
      }

      return "";
    };

    const printNotice = () => {
      window.print();
    };

    const downloadFile = () => {
      if (notice.value.file_data && notice.value.file_name) {
        const blob = new Blob([notice.value.file_data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = notice.value.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };

    const goToEdit = () => {
      router.push(`/admin/notice/edit/${notice.value.id}`);
    };

    const deleteNotice = async () => {
      if (confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
        try {
          await noticesStore.deleteNotice(notice.value.id);
          alert("공지사항이 삭제되었습니다.");
          router.push("/notice");
        } catch (error) {
          alert("삭제에 실패했습니다.");
        }
      }
    };

    const loadNotice = async () => {
      try {
        isLoading.value = true;
        const id = route.params.id;

        // 공지사항 상세 정보 로드
        notice.value = await noticesStore.fetchNoticeById(id);

        // 이전/다음 공지사항 정보 (더미 데이터)
        // 실제로는 API에서 가져와야 함
        if (parseInt(id) > 1) {
          previousNotice.value = {
            id: parseInt(id) - 1,
            title: "이전 공지사항 제목",
            created_at: "2024-01-14",
          };
        }

        nextNotice.value = {
          id: parseInt(id) + 1,
          title: "다음 공지사항 제목",
          created_at: "2024-01-16",
        };
      } catch (error) {
        console.error("공지사항 로드 실패:", error);
        notice.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadNotice();
    });

    return {
      notice,
      previousNotice,
      nextNotice,
      isLoading,
      canEdit,
      canDelete,
      getTypeClass,
      getTypeLabel,
      formatDate,
      formatContent,
      shareNotice,
      printNotice,
      downloadFile,
      goToEdit,
      deleteNotice,
      getImageUrl,
    };
  },
};
</script>

<style scoped>
@media print {
  .btn,
  nav {
    display: none !important;
  }
}
</style>
