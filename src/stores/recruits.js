import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";

export const useRecruitsStore = defineStore("recruits", () => {
  const recruits = ref([]);
  const currentRecruit = ref(null);
  const isLoading = ref(false);

  const fetchRecruits = async () => {
    try {
      isLoading.value = true;
      const response = await api.get("/api/recruits");
      recruits.value = response.data || [];
    } catch (error) {
      console.error("채용 공고 목록 조회 실패:", error);
      recruits.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchAdminRecruits = async () => {
    try {
      isLoading.value = true;
      const response = await api.get("/api/recruits/admin/all");
      recruits.value = response.data || [];
    } catch (error) {
      console.error("관리자 채용 공고 목록 조회 실패:", error);
      recruits.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const fetchRecruitById = async (id) => {
    try {
      isLoading.value = true;
      const response = await api.get(`/api/recruits/${id}`);
      currentRecruit.value = response.data;
      return response.data;
    } catch (error) {
      console.error("채용 공고 상세 조회 실패:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  const createRecruit = async (recruitData) => {
    try {
      const response = await api.post("/api/recruits", recruitData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchAdminRecruits();
      return response.data;
    } catch (error) {
      console.error("채용 공고 생성 실패:", error);
      throw error;
    }
  };

  const updateRecruit = async (id, recruitData) => {
    try {
      const response = await api.patch(`/api/recruits/${id}`, recruitData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchAdminRecruits();
      return response.data;
    } catch (error) {
      console.error("채용 공고 수정 실패:", error);
      throw error;
    }
  };

  const deleteRecruit = async (id) => {
    try {
      await api.delete(`/api/recruits/${id}`);
      await fetchAdminRecruits();
    } catch (error) {
      console.error("채용 공고 삭제 실패:", error);
      throw error;
    }
  };

  const toggleRecruitShow = async (id, showStatus) => {
    try {
      const recruit = recruits.value.find(r => r.id === id);
      if (!recruit) return;

      const updatedData = {
        title: recruit.title,
        department: recruit.department,
        experience: recruit.experience,
        note: recruit.note,
        show: showStatus
      };

      await api.patch(`/api/recruits/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      await fetchAdminRecruits();
    } catch (error) {
      console.error("채용 공고 노출 상태 변경 실패:", error);
      throw error;
    }
  };

  return {
    recruits,
    currentRecruit,
    isLoading,
    fetchRecruits,
    fetchAdminRecruits,
    fetchRecruitById,
    createRecruit,
    updateRecruit,
    deleteRecruit,
    toggleRecruitShow,
  };
});