<template>
  <div class="ddock-gallery">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">똑버스</h1>
      <p class="text-gray-600">백성운수의 똑버스 정보를 확인하세요</p>
    </div>

    <!-- Image Gallery -->
    <div class="gallery-container">
      <!-- Initial Loading -->
      <div v-if="isInitialLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <span class="ml-3 text-gray-600">사진을 불러오는 중...</span>
      </div>

      <!-- Continuous Vertical Image Strip -->
      <div v-else-if="ddocks && ddocks.length > 0" class="vertical-image-strip">
        <template v-for="(ddock, index) in ddocks" :key="ddock?.id || index">
          <!-- Valid Image -->
          <img
            v-if="ddock && ddock.image"
            :src="`data:image/jpeg;base64,${ddock.image}`"
            :alt="ddock.image_name || `이미지 ${ddock.id || index}`"
            class="strip-image"
            :style="{ animationDelay: `${(index % 20) * 0.1}s` }"
            @load="onImageLoad"
            @error="onImageError"
            @click="openImageViewer(ddock)"
          />
          
          <!-- Placeholder for missing images -->
          <div 
            v-else-if="ddock && !ddock.image"
            class="strip-placeholder"
          >
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-gray-500 mt-2">이미지 없음</p>
          </div>
        </template>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">아직 사진이 없습니다</h3>
        <p class="text-gray-600">똑버스 관련 정보들이 업로드 될 예정입니다</p>
      </div>

      <!-- Load More Trigger -->
      <div
        v-if="ddocks && ddocks.length > 0 && hasMoreItems"
        ref="loadMoreTrigger"
        class="flex items-center justify-center py-8"
      >
        <div v-if="isLoadingMore" class="flex items-center">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span class="ml-2 text-gray-600">더 많은 사진을 불러오는 중...</span>
        </div>
      </div>
    </div>

    <!-- Scroll to Top Button -->
    <button
      v-show="showScrollToTop"
      @click="scrollToTop"
      class="scroll-to-top-btn"
      aria-label="맨 위로 이동"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
      </svg>
    </button>

    <div
      v-if="imageViewer.show"
      ref="imageViewerPanel"
      class="image-viewer"
      @click="closeImageViewer"
    >
      <button
        type="button"
        class="image-viewer-close"
        aria-label="닫기"
        @click.stop="closeImageViewer"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <button
        type="button"
        class="image-viewer-mode"
        @click.stop="toggleImageViewerSize()"
      >
        {{ imageViewer.fitToScreen ? '원본 크기' : '화면 맞춤' }}
      </button>
      <div class="image-viewer-content">
        <img
          :src="imageViewer.src"
          :alt="imageViewer.alt"
          class="image-viewer-image"
          :class="{ 'is-fit': imageViewer.fitToScreen }"
          @click.stop="toggleImageViewerSize"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useDdocksStore } from '@/stores/ddocks'

export default {
  name: 'Ddock',
  setup() {
    const ddocksStore = useDdocksStore()
    
    // Gallery state
    const currentPage = ref(1)
    const isInitialLoading = ref(true)
    const isLoadingMore = ref(false)
    const loadMoreTrigger = ref(null)
    const imageViewerPanel = ref(null)
    const observer = ref(null)
    
    // Scroll to top state
    const showScrollToTop = ref(false)
    const imageViewer = ref({
      show: false,
      src: '',
      alt: '',
      fitToScreen: true
    })


    // Computed
    const ddocks = computed(() => ddocksStore.ddocks || [])
    const pagination = computed(() => ddocksStore.pagination || { page: 1, total_pages: 1 })
    
    const hasMoreItems = computed(() => {
      return pagination.value && pagination.value.page < pagination.value.total_pages
    })

    // Gallery functions
    const loadInitialImages = async () => {
      try {
        isInitialLoading.value = true
        currentPage.value = 1
        await ddocksStore.fetchDdocks({ 
          page: 1, 
          page_size: 20 
        })
      } catch (error) {
        console.error('초기 이미지 로드 실패:', error)
      } finally {
        isInitialLoading.value = false
      }
    }

    const loadMoreImages = async () => {
      if (isLoadingMore.value || !hasMoreItems.value) return

      try {
        isLoadingMore.value = true
        currentPage.value += 1
        await ddocksStore.fetchDdocks({ 
          page: currentPage.value, 
          page_size: 20 
        })
      } catch (error) {
        console.error('추가 이미지 로드 실패:', error)
        currentPage.value -= 1 // 실패 시 페이지 번호 롤백
      } finally {
        isLoadingMore.value = false
      }
    }

    // Intersection Observer for infinite scroll
    const setupIntersectionObserver = () => {
      if (!loadMoreTrigger.value) return

      observer.value = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasMoreItems.value && !isLoadingMore.value) {
            loadMoreImages()
          }
        },
        {
          rootMargin: '100px'
        }
      )

      observer.value.observe(loadMoreTrigger.value)
    }


    // Scroll to top functionality
    const handleScroll = () => {
      showScrollToTop.value = window.scrollY > 300
    }

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    // Image load handlers
    const onImageLoad = () => {
      // 이미지 로드 완료 시 처리 (필요한 경우)
    }

    const onImageError = (event) => {
      console.error('이미지 로드 실패:', event.target.src)
      // 이미지 로드 실패 시 placeholder 표시 등
    }

    const openImageViewer = (ddock) => {
      if (!ddock?.image) return

      imageViewer.value = {
        show: true,
        src: `data:image/jpeg;base64,${ddock.image}`,
        alt: ddock.image_name || `이미지 ${ddock.id || ''}`,
        fitToScreen: true
      }
      document.addEventListener('keydown', handleImageViewerKeydown)
    }

    const closeImageViewer = () => {
      imageViewer.value = {
        show: false,
        src: '',
        alt: '',
        fitToScreen: true
      }
      document.removeEventListener('keydown', handleImageViewerKeydown)
    }

    const clampRatio = (value) => Math.min(Math.max(value, 0), 1)

    const getViewerFocusRatios = (event = null) => {
      const panel = imageViewerPanel.value
      const image = panel?.querySelector('.image-viewer-image')
      if (!panel || !image) {
        return { x: 0.5, y: 0.5 }
      }

      const imageRect = image.getBoundingClientRect()
      if (!imageRect.width || !imageRect.height) {
        return { x: 0.5, y: 0.5 }
      }

      if (event && imageViewer.value.fitToScreen) {
        return {
          x: clampRatio((event.clientX - imageRect.left) / imageRect.width),
          y: clampRatio((event.clientY - imageRect.top) / imageRect.height)
        }
      }

      const panelRect = panel.getBoundingClientRect()
      const focusX = panelRect.left + panel.clientWidth / 2
      const focusY = panelRect.top + panel.clientHeight / 2

      return {
        x: clampRatio((focusX - imageRect.left) / imageRect.width),
        y: clampRatio((focusY - imageRect.top) / imageRect.height)
      }
    }

    const scrollViewerToRatios = async ({ x, y }) => {
      await nextTick()
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const panel = imageViewerPanel.value
      const image = panel?.querySelector('.image-viewer-image')
      if (!panel || !image) return

      const panelRect = panel.getBoundingClientRect()
      const imageRect = image.getBoundingClientRect()
      const targetX = panel.scrollLeft + (imageRect.left - panelRect.left) + imageRect.width * x
      const targetY = panel.scrollTop + (imageRect.top - panelRect.top) + imageRect.height * y

      panel.scrollLeft = Math.max(0, targetX - panel.clientWidth / 2)
      panel.scrollTop = Math.max(0, targetY - panel.clientHeight / 2)
    }

    const toggleImageViewerSize = async (event = null) => {
      const focusRatios = getViewerFocusRatios(event)

      imageViewer.value.fitToScreen = !imageViewer.value.fitToScreen

      await scrollViewerToRatios(focusRatios)
    }

    const handleImageViewerKeydown = (event) => {
      if (event.key === 'Escape') {
        closeImageViewer()
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggleImageViewerSize()
      }
    }

    // Lifecycle
    onMounted(async () => {
      await loadInitialImages()
      
      // DOM 업데이트 후 intersection observer 설정
      await nextTick()
      setupIntersectionObserver()
      
      // 스크롤 이벤트 리스너 등록
      window.addEventListener('scroll', handleScroll, { passive: true })
    })

    onUnmounted(() => {
      if (observer.value) {
        observer.value.disconnect()
      }
      // 스크롤 이벤트 리스너 제거
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('keydown', handleImageViewerKeydown)
    })

    return {
      // Gallery
      ddocks,
      isInitialLoading,
      isLoadingMore,
      hasMoreItems,
      loadMoreTrigger,
      imageViewerPanel,
      
      // Scroll to top
      showScrollToTop,
      imageViewer,
      scrollToTop,
       
      // Methods
      onImageLoad,
      onImageError,
      openImageViewer,
      closeImageViewer,
      toggleImageViewerSize
    }
  }
}
</script>

<style scoped>
.ddock-gallery {
  padding: 1rem;
}

.gallery-container {
  max-width: 800px;
  margin: 0 auto;
}

.vertical-image-strip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.strip-image {
  width: 100%;
  max-width: 800px;
  height: auto;
  display: block;
  cursor: zoom-in;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out;
}

.strip-image:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.strip-placeholder {
  width: 100%;
  max-width: 800px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border: 2px dashed #d1d5db;
  margin: 1rem 0;
}

.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 60;
  overflow: auto;
  background: rgba(0, 0, 0, 0.88);
  padding: 4.75rem 1rem 1rem;
}

.image-viewer-content {
  width: fit-content;
  min-width: 100%;
  min-height: calc(100vh - 5.75rem);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.image-viewer-image {
  width: auto;
  height: auto;
  max-width: none;
  display: block;
  background: white;
  cursor: zoom-out;
}

.image-viewer-image.is-fit {
  width: auto;
  max-width: min(100%, 1200px);
  max-height: none;
  object-fit: initial;
  cursor: zoom-in;
}

.image-viewer-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 61;
  display: flex;
  width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.95);
  color: #111827;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  transition: background 0.2s ease, transform 0.2s ease;
}

.image-viewer-close:hover {
  background: white;
  transform: translateY(-1px);
}

.image-viewer-mode {
  position: fixed;
  top: 1rem;
  right: 4.25rem;
  z-index: 61;
  min-width: 5.25rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.95);
  color: #111827;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  transition: background 0.2s ease, transform 0.2s ease;
}

.image-viewer-mode:hover {
  background: white;
  transform: translateY(-1px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@media (max-width: 768px) {
  .gallery-container {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .ddock-gallery {
    padding: 0.5rem;
  }

  .image-viewer {
    padding: 4.75rem 0.5rem 0.5rem;
  }

  .image-viewer-mode {
    right: 4rem;
    padding: 0.75rem 0.875rem;
  }
}

@media (max-width: 480px) {
  .gallery-container {
    padding: 0 0.5rem;
  }
  
  .strip-image {
    max-width: 100%;
  }
}

/* Scroll to Top Button */
.scroll-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 40;
  backdrop-filter: blur(10px);
}

.scroll-to-top-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.scroll-to-top-btn:active {
  transform: translateY(0) scale(0.95);
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .scroll-to-top-btn {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 2.75rem;
    height: 2.75rem;
  }
}

@media (max-width: 480px) {
  .scroll-to-top-btn {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
