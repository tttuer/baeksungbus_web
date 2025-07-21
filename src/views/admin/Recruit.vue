<template>
  <div class="admin-recruit">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">채용 공고 관리</h1>
          <p class="text-gray-600">채용 공고를 등록, 수정, 삭제할 수 있습니다</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="refreshData"
            class="btn btn-outline"
            :disabled="isLoading"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            새로고침
          </button>
          <button @click="openCreateModal" class="btn btn-primary">
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            채용 공고 작성
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-2">로딩 중...</p>
    </div>

    <!-- Recruit List -->
    <div v-else-if="recruits.length > 0" class="grid grid-cols-1 gap-6">
      <div
        v-for="recruit in recruits"
        :key="recruit.id"
        class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
      >
        <div class="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-2xl font-bold text-gray-900">
              {{ recruit.title }}
            </h3>
            <div class="flex space-x-2">
              <button
                @click="openEditModal(recruit)"
                class="btn btn-sm btn-outline"
              >
                수정
              </button>
              <button
                @click="deleteRecruit(recruit.id)"
                class="btn btn-sm btn-outline text-red-600 border-red-300 hover:bg-red-50"
              >
                삭제
              </button>
            </div>
          </div>
          <span class="inline-flex items-center bg-primary-100 text-primary-800 text-sm font-semibold px-4 py-2 rounded-full">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {{ recruit.department }}
          </span>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">응시자격</h4>
            <div class="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-800 text-white">
                    <th class="py-3 px-4 text-left font-semibold">구분</th>
                    <th class="py-3 px-4 text-left font-semibold">내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, idx) in recruit.experience"
                    :key="idx"
                    class="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td class="py-3 px-4 font-semibold text-gray-700 bg-gray-100">{{ item.label }}</td>
                    <td class="py-3 px-4 text-gray-600">{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="recruit.note" class="mb-4">
            <h4 class="text-lg font-semibold text-gray-900 mb-3">비고</h4>
            <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <pre class="text-amber-800 font-medium text-sm leading-relaxed whitespace-pre-wrap">{{ recruit.note }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
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
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        등록된 채용 공고가 없습니다
      </h3>
      <p class="text-gray-600">
        새로운 채용 공고를 등록해보세요.
      </p>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ isEditMode ? '채용 공고 수정' : '새 채용 공고 등록' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">직종명</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="예: 승무직"
              />
            </div>

            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">부서</label>
              <input
                v-model="form.department"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="예: 승무사원"
              />
            </div>

            <!-- Experience -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">응시자격</label>
              <div class="space-y-3">
                <div
                  v-for="(exp, index) in form.experience"
                  :key="index"
                  class="flex space-x-3 items-start"
                >
                  <input
                    v-model="exp.label"
                    type="text"
                    required
                    class="w-1/4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="경력"
                  />
                  <input
                    v-model="exp.value"
                    type="text"
                    required
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="내용"
                  />
                  <button
                    v-if="form.experience.length > 1"
                    @click="removeExperience(index)"
                    type="button"
                    class="text-red-600 hover:text-red-800 p-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
                <button
                  @click="addExperience"
                  type="button"
                  class="btn btn-outline btn-sm"
                >
                  + 응시자격 추가
                </button>
              </div>
            </div>

            <!-- Note -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">비고</label>
              <textarea
                v-model="form.note"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="추가 안내사항을 입력하세요"
              ></textarea>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="btn btn-outline"
              >
                취소
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn btn-primary"
              >
                {{ isSubmitting ? '저장 중...' : (isEditMode ? '수정' : '등록') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRecruitsStore } from "@/stores/recruits";

export default {
  name: "AdminRecruit",
  setup() {
    const recruitsStore = useRecruitsStore();
    const { recruits, isLoading } = storeToRefs(recruitsStore);
    
    const isModalOpen = ref(false);
    const isEditMode = ref(false);
    const isSubmitting = ref(false);
    const editingId = ref(null);

    const form = ref({
      title: "",
      department: "",
      experience: [{ label: "", value: "" }],
      note: ""
    });

    const resetForm = () => {
      form.value = {
        title: "",
        department: "",
        experience: [{ label: "", value: "" }],
        note: ""
      };
      isEditMode.value = false;
      editingId.value = null;
    };

    const openCreateModal = () => {
      resetForm();
      isModalOpen.value = true;
    };

    const openEditModal = (recruit) => {
      form.value = {
        title: recruit.title,
        department: recruit.department,
        experience: [...recruit.experience],
        note: recruit.note || ""
      };
      isEditMode.value = true;
      editingId.value = recruit.id;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
      resetForm();
    };

    const addExperience = () => {
      form.value.experience.push({ label: "", value: "" });
    };

    const removeExperience = (index) => {
      form.value.experience.splice(index, 1);
    };

    const submitForm = async () => {
      isSubmitting.value = true;
      try {
        if (isEditMode.value) {
          await recruitsStore.updateRecruit(editingId.value, form.value);
        } else {
          await recruitsStore.createRecruit(form.value);
        }
        closeModal();
      } catch (error) {
        console.error("Error saving recruit:", error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const deleteRecruit = async (id) => {
      if (!confirm("정말로 이 채용 공고를 삭제하시겠습니까?")) {
        return;
      }

      try {
        await recruitsStore.deleteRecruit(id);
      } catch (error) {
        console.error("Error deleting recruit:", error);
      }
    };

    const refreshData = () => {
      recruitsStore.fetchRecruits();
    };

    onMounted(() => {
      recruitsStore.fetchRecruits();
    });

    return {
      recruits,
      isLoading,
      isModalOpen,
      isEditMode,
      isSubmitting,
      form,
      openCreateModal,
      openEditModal,
      closeModal,
      addExperience,
      removeExperience,
      submitForm,
      deleteRecruit,
      refreshData,
    };
  },
};
</script>