<template>
  <div class="ddock-gallery">
    <!-- Page Header -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">똑버스</h1>
      <p class="text-gray-600">백성운수의 똑버스를 확인하세요</p>
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
    const observer = ref(null)


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


    // Image load handlers
    const onImageLoad = () => {
      // 이미지 로드 완료 시 처리 (필요한 경우)
    }

    const onImageError = (event) => {
      console.error('이미지 로드 실패:', event.target.src)
      // 이미지 로드 실패 시 placeholder 표시 등
    }

    // Lifecycle
    onMounted(async () => {
      await loadInitialImages()
      
      // DOM 업데이트 후 intersection observer 설정
      await nextTick()
      setupIntersectionObserver()
    })

    onUnmounted(() => {
      if (observer.value) {
        observer.value.disconnect()
      }
    })

    return {
      // Gallery
      ddocks,
      isInitialLoading,
      isLoadingMore,
      hasMoreItems,
      loadMoreTrigger,
      
      // Methods
      onImageLoad,
      onImageError
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
}

@media (max-width: 480px) {
  .gallery-container {
    padding: 0 0.5rem;
  }
  
  .strip-image {
    max-width: 100%;
  }
}
</style>