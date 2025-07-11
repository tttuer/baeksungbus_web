import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";

export const useNoticesStore = defineStore("notices", () => {
  const notices = ref([]);
  const currentNotice = ref(null);
  const isLoading = ref(false);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchNotices = async (params = {}) => {
    try {
      isLoading.value = true;
      const response = await api.get("/api/notices", { params });
      notices.value =
        response.data.items || response.data.notices || response.data || [];

      if (response.data.pagination) {
        pagination.value = response.data.pagination;
      }
    } catch (error) {
      console.error("공지사항 목록 조회 실패:", error);
      notices.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchNoticeById = async (id) => {
    try {
      isLoading.value = true;
      const response = await api.get(`/api/notices/${id}`);
      currentNotice.value = response.data;
      return response.data;
    } catch (error) {
      console.error("공지사항 상세 조회 실패:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createNotice = async (noticeData) => {
    try {
      console.log("createNotice received data:", noticeData);
      
      const formData = new FormData();
      
      console.log("Adding title:", noticeData.title);
      console.log("Adding content:", noticeData.content);
      console.log("Adding file:", noticeData.file);
      
      formData.append('title', noticeData.title || '');
      formData.append('content', noticeData.content || '');
      
      if (noticeData.file) {
        formData.append('attachment', noticeData.file);
      }

      // FormData 내용 확인
      for (let [key, value] of formData.entries()) {
        console.log(`FormData ${key}:`, value);
      }

      const response = await api.post("/api/notices", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchNotices();
      return response.data;
    } catch (error) {
      console.error("공지사항 생성 실패:", error);
      throw error;
    }
  };

  const updateNotice = async (id, noticeData) => {
    try {
      const response = await api.put(`/api/notices/${id}`, noticeData);
      await fetchNotices();
      return response.data;
    } catch (error) {
      console.error("공지사항 수정 실패:", error);
      throw error;
    }
  };

  const deleteNotice = async (id) => {
    try {
      await api.delete(`/api/notices/${id}`);
      await fetchNotices();
    } catch (error) {
      console.error("공지사항 삭제 실패:", error);
      throw error;
    }
  };

  return {
    notices,
    currentNotice,
    isLoading,
    pagination,
    fetchNotices,
    fetchNoticeById,
    createNotice,
    updateNotice,
    deleteNotice,
  };
});
