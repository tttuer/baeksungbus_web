<template>
  <div>
    <input
      ref="fileInput"
      type="file"
      class="sr-only"
      :accept="accept"
      :multiple="multiple"
      @change="onInputChange"
    />
    <div
      class="file-drop-zone group"
      :class="{ 'file-drop-zone-active': isDragging }"
      role="button"
      tabindex="0"
      @click="openFilePicker"
      @keydown.enter.prevent="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @dragenter.prevent="isDragging = true"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 group-hover:bg-primary-200">
        <svg
          class="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>
      <p class="text-base font-semibold text-gray-900">{{ title }}</p>
      <p class="text-sm text-gray-600 mt-1">
        파일을 이 영역에 끌어다 놓거나 아래 버튼을 눌러 첨부하세요.
      </p>
      <p class="text-xs text-gray-500 mt-1">{{ description }}</p>
      <button type="button" class="btn btn-primary btn-sm mt-4" @click.stop="openFilePicker">
        파일 선택
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  name: "FileDropZone",
  props: {
    accept: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    maxSizeMb: {
      type: Number,
      default: 10,
    },
    title: {
      type: String,
      default: "파일을 여기에 끌어오세요",
    },
    description: {
      type: String,
      default: "또는 클릭해서 파일을 선택하세요.",
    },
  },
  emits: ["selected"],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const isDragging = ref(false);

    const openFilePicker = () => {
      fileInput.value?.click();
    };

    const isAccepted = (file) => {
      if (!props.accept) return true;
      const accepts = props.accept.split(",").map((item) => item.trim().toLowerCase());
      const fileName = file.name.toLowerCase();
      const fileType = file.type.toLowerCase();

      return accepts.some((accept) => {
        if (accept.endsWith("/*")) {
          return fileType.startsWith(accept.replace("/*", "/"));
        }
        if (accept.startsWith(".")) {
          return fileName.endsWith(accept);
        }
        return fileType === accept;
      });
    };

    const handleFiles = (fileList) => {
      const files = Array.from(fileList || []);
      const validFiles = [];

      for (const file of files) {
        if (file.size > props.maxSizeMb * 1024 * 1024) {
          alert(`${file.name} 파일은 ${props.maxSizeMb}MB를 초과할 수 없습니다.`);
          continue;
        }
        if (!isAccepted(file)) {
          alert(`${file.name} 파일 형식은 업로드할 수 없습니다.`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        emit("selected", props.multiple ? validFiles : [validFiles[0]]);
      }

      if (fileInput.value) {
        fileInput.value.value = "";
      }
    };

    const onInputChange = (event) => {
      handleFiles(event.target.files);
    };

    const onDrop = (event) => {
      isDragging.value = false;
      handleFiles(event.dataTransfer.files);
    };

    return {
      fileInput,
      isDragging,
      openFilePicker,
      onInputChange,
      onDrop,
    };
  },
};
</script>
