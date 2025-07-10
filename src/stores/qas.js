import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";

export const useQAsStore = defineStore("qas", () => {
  const qas = ref([]);
  const currentQA = ref(null);
  const isLoading = ref(false);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const unansweredTotal = ref(0);
  const answeredTotal = ref(0);

  const fetchUnansweredCount = async () => {
    try {
      const response = await api.get("/api/qas", {
        params: {
          qa_type: "CUSTOMER",
          done: false,
          page_size: 1, // 실제 데이터는 필요 없고, pagination.total만 필요함
          page: 1,
        },
      });
      unansweredTotal.value = response.data.pagination.total;
    } catch (error) {
      console.error("미답변 수 조회 실패:", error);
    }
  };

  const fetchAnsweredCount = async () => {
    try {
      const response = await api.get("/api/qas", {
        params: {
          qa_type: "CUSTOMER",
          done: true,
          page_size: 1, // 실제 데이터는 필요 없고, pagination.total만 필요함
          page: 1,
        },
      });
      answeredTotal.value = response.data.pagination.total;
    } catch (error) {
      console.error("미답변 수 조회 실패:", error);
    }
  };

  const fetchQAs = async (params = {}) => {
    try {
      isLoading.value = true;
      const response = await api.get("/api/qas", { params });
      qas.value = response.data.items || response.data;

      if (response.data.pagination) {
        pagination.value = response.data.pagination;
      }
    } catch (error) {
      console.error("Q&A 목록 조회 실패:", error);
    } finally {
      isLoading.value = false;
    }
  };

  const fetchQAById = async (id) => {
    try {
      isLoading.value = true;
      const response = await api.get(`/api/qas/${id}`);
      currentQA.value = response.data;
      return response.data;
    } catch (error) {
      console.error("Q&A 상세 조회 실패:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createQA = async (qaData) => {
    try {
      const response = await api.post("/api/qas", qaData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchQAs();
      return response.data;
    } catch (error) {
      console.error("Q&A 생성 실패:", error);
      throw error;
    }
  };

  const updateQA = async (id, qaData) => {
    try {
      const response = await api.patch(`/api/qas/${id}`, qaData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchQAs();
      return response.data;
    } catch (error) {
      console.error("Q&A 수정 실패:", error);
      throw error;
    }
  };

  const deleteQA = async (id) => {
    try {
      await api.delete(`/api/qas/${id}`);
      await fetchQAs();
    } catch (error) {
      console.error("Q&A 삭제 실패:", error);
      throw error;
    }
  };

  return {
    qas,
    currentQA,
    isLoading,
    pagination,
    unansweredTotal,
    answeredTotal,
    fetchQAs,
    fetchQAById,
    createQA,
    updateQA,
    deleteQA,
    fetchUnansweredCount,
    fetchAnsweredCount,
  };
});
