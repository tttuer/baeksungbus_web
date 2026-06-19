<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="handleCancel"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4" @click.stop>
      <h3 class="text-lg font-semibold mb-4">비밀번호 확인</h3>
      <p class="text-gray-600 mb-4">이 글을 보려면 비밀번호가 필요합니다.</p>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            ref="passwordInputRef"
            :value="modelValue"
            type="password"
            class="form-input"
            placeholder="비밀번호를 입력하세요"
            required
            @input="$emit('update:modelValue', $event.target.value)"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <button type="button" class="btn btn-outline" @click="handleCancel">
            취소
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <svg
              v-if="loading"
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
            {{ loading ? "확인 중..." : "확인" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, ref } from "vue";

export default {
  name: "PasswordModal",
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "submit", "cancel"],
  setup(props, { emit }) {
    const passwordInputRef = ref(null);

    const focusInput = async () => {
      await nextTick();
      passwordInputRef.value?.focus();
    };

    const handleSubmit = () => {
      emit("submit");
    };

    const handleCancel = () => {
      emit("cancel");
    };

    onMounted(focusInput);

    return {
      passwordInputRef,
      handleSubmit,
      handleCancel,
    };
  },
};
</script>
