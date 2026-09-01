<template>
  <div v-if="show" ref="panel" class="image-viewer" @click="$emit('close')">
    <button type="button" class="image-viewer-close" aria-label="닫기" @click.stop="$emit('close')">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    <button type="button" class="image-viewer-mode" @click.stop="toggleSize">
      {{ fitToScreen ? "원본 크기" : "화면 맞춤" }}
    </button>
    <div class="image-viewer-content">
      <img
        :src="src"
        :alt="alt"
        class="image-viewer-image"
        :class="{ 'is-fit': fitToScreen }"
        @click.stop="toggleSize"
      />
    </div>
  </div>
</template>

<script>
import { nextTick, onUnmounted, ref, watch } from "vue";

export default {
  name: "ImageViewer",
  props: {
    show: Boolean,
    src: { type: String, default: "" },
    alt: { type: String, default: "" },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const panel = ref(null);
    const fitToScreen = ref(true);

    const getFocus = (event) => {
      const image = panel.value?.querySelector(".image-viewer-image");
      if (!image || typeof event?.clientX !== "number") return { x: 0.5, y: 0.5 };
      const rect = image.getBoundingClientRect();
      return {
        x: Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1),
        y: Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1),
      };
    };

    const toggleSize = async (event) => {
      const focus = getFocus(event);
      fitToScreen.value = !fitToScreen.value;
      await nextTick();
      const image = panel.value?.querySelector(".image-viewer-image");
      if (image) {
        panel.value.scrollLeft = Math.max(0, image.offsetWidth * focus.x - panel.value.clientWidth / 2);
        panel.value.scrollTop = Math.max(0, image.offsetHeight * focus.y - panel.value.clientHeight / 2);
      }
    };

    const onKeydown = (event) => {
      if (event.key === "Escape") emit("close");
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleSize();
      }
    };

    watch(() => props.show, (show) => {
      fitToScreen.value = true;
      if (show) document.addEventListener("keydown", onKeydown);
      else document.removeEventListener("keydown", onKeydown);
    });
    onUnmounted(() => document.removeEventListener("keydown", onKeydown));
    return { panel, fitToScreen, toggleSize };
  },
};
</script>

<style scoped>
.image-viewer { position: fixed; inset: 0; z-index: 70; overflow: auto; padding: 4.75rem 1rem 1rem; background: rgba(0, 0, 0, .88); }
.image-viewer-content { display: flex; min-width: 100%; min-height: calc(100vh - 5.75rem); justify-content: center; align-items: flex-start; }
.image-viewer-image { width: auto; height: auto; max-width: none; display: block; background: white; cursor: zoom-out; }
.image-viewer-image.is-fit { max-width: min(100%, 1200px); cursor: zoom-in; }
.image-viewer-close, .image-viewer-mode { position: fixed; top: 1rem; z-index: 71; border-radius: 9999px; background: rgba(255, 255, 255, .95); color: #111827; box-shadow: 0 10px 25px rgba(0, 0, 0, .25); }
.image-viewer-close { right: 1rem; display: flex; width: 2.75rem; height: 2.75rem; align-items: center; justify-content: center; }
.image-viewer-mode { right: 4.25rem; min-width: 5.25rem; padding: .75rem 1rem; font-size: .875rem; font-weight: 600; }
</style>
