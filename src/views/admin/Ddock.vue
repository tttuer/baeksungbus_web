<template>
  <div class="admin-ddock">
    <!-- Page Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">사진 갤러리 관리</h1>
          <p class="text-gray-600">홈페이지에 표시될 사진들을 관리할 수 있습니다</p>
        </div>
        <div class="flex space-x-3">
          <button
            @click="refreshData"
            class="btn btn-outline"
            :disabled="isLoading"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            새로고침
          </button>
          <button
            @click="openUploadModal"
            class="btn btn-primary"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            사진 업로드
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">전체 사진</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalImages }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">표시 중</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeImages }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">오늘 업로드</p>
            <p class="text-2xl font-bold text-gray-900">{{ todayUploads }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM6 8v10a2 2 0 002 2h4a2 2 0 002-2V8"/>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">총 용량</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatFileSize(totalSize) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Gallery -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">사진 갤러리</h3>
          <div class="flex items-center space-x-4">
            <label class="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                v-model="enableDragSort"
                class="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              드래그 정렬 모드
            </label>
            <button
              v-if="hasOrderChanges"
              @click="saveOrder"
              class="btn btn-primary btn-sm"
              :disabled="isUpdatingOrder"
            >
              <svg v-if="isUpdatingOrder" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              순서 저장
            </button>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span class="ml-2 text-gray-600">로딩 중...</span>
      </div>

      <div v-else-if="!Array.isArray(ddocks) || ddocks.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">사진이 없습니다</h3>
        <p class="text-gray-600 mb-4">새 사진을 업로드해보세요.</p>
        <button @click="openUploadModal" class="btn btn-primary">
          사진 업로드
        </button>
      </div>

      <div v-else class="p-6">
        <div 
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          :class="{ 'sortable-enabled': enableDragSort }"
        >
          <div
            v-for="(ddock, index) in sortedDdocks"
            :key="ddock.id"
            class="relative group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            :class="{ 'cursor-move': enableDragSort }"
            @dragstart="onDragStart($event, index)"
            @dragover="onDragOver"
            @drop="onDrop($event, index)"
            :draggable="enableDragSort"
          >
            <!-- Image -->
            <div class="aspect-square relative overflow-hidden">
              <img
                v-if="ddock.image"
                :src="`data:image/jpeg;base64,${ddock.image}`"
                :alt="ddock.image_name"
                class="w-full h-full object-cover"
                @click="viewImage(ddock)"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-gray-200">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              
              <!-- Order Badge -->
              <div class="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                #{{ ddock.order }}
              </div>

              <!-- Drag Handle -->
              <div v-if="enableDragSort" class="absolute top-2 right-2 bg-black bg-opacity-70 text-white p-1 rounded cursor-move">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
                </svg>
              </div>

              <!-- Hover Actions -->
              <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  @click="viewImage(ddock)"
                  class="p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors"
                  title="크게 보기"
                >
                  <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button
                  @click="moveUp(index)"
                  :disabled="index === 0"
                  class="p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                  title="위로 이동"
                >
                  <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                  </svg>
                </button>
                <button
                  @click="moveDown(index)"
                  :disabled="index === sortedDdocks.length - 1"
                  class="p-2 bg-white bg-opacity-90 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                  title="아래로 이동"
                >
                  <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <button
                  @click="deleteImage(ddock)"
                  class="p-2 bg-red-500 bg-opacity-90 rounded-full hover:bg-red-600 transition-colors"
                  title="삭제"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Image Info -->
            <div class="p-3">
              <p class="text-sm font-medium text-gray-900 truncate" :title="ddock.image_name">
                {{ ddock.image_name || `이미지 ${ddock.id}` }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                순서: {{ ddock.order }} | ID: {{ ddock.id }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">사진 업로드</h3>
            <button @click="closeUploadModal" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- File Drop Zone -->
          <div
            @drop="onFileDrop"
            @dragover.prevent
            @dragenter.prevent
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors"
            :class="{ 'border-primary-400 bg-primary-50': isDragging }"
          >
            <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-lg font-medium text-gray-900 mb-2">사진을 여기에 드래그하거나</p>
            <button
              @click="$refs.fileInput.click()"
              class="btn btn-primary"
            >
              파일 선택
            </button>
            <p class="text-sm text-gray-500 mt-2">
              JPG, PNG, GIF 파일 지원 (최대 10MB)
            </p>
          </div>

          <!-- File Input -->
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="image/*"
            @change="onFileSelect"
            class="hidden"
          />

          <!-- Selected Files -->
          <div v-if="selectedFiles.length > 0" class="mt-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">선택된 파일 ({{ selectedFiles.length }}개)</h4>
            <div class="space-y-2 max-h-48 overflow-y-auto">
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center">
                  <img
                    v-if="file.preview"
                    :src="file.preview"
                    class="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                    <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                  </div>
                </div>
                <button
                  @click="removeFile(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Upload Progress -->
          <div v-if="uploadProgress.show" class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-gray-700">업로드 중...</span>
              <span class="text-sm text-gray-500">{{ uploadProgress.current }}/{{ uploadProgress.total }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              @click="closeUploadModal"
              class="btn btn-outline"
              :disabled="uploadProgress.show"
            >
              취소
            </button>
            <button
              @click="uploadFiles"
              class="btn btn-primary"
              :disabled="selectedFiles.length === 0 || uploadProgress.show"
            >
              <svg v-if="uploadProgress.show" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              {{ uploadProgress.show ? '업로드 중...' : `업로드 (${selectedFiles.length}개)` }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="showImageViewer" class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div class="relative max-w-screen-lg max-h-screen">
        <button
          @click="closeImageViewer"
          class="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        
        <img
          v-if="selectedImage"
          :src="`data:image/jpeg;base64,${selectedImage.image}`"
          :alt="selectedImage.image_name"
          class="max-w-full max-h-full object-contain"
        />
        
        <div class="absolute bottom-4 left-4 right-4 text-white text-center">
          <p class="text-lg font-medium">{{ selectedImage?.image_name }}</p>
          <p class="text-sm opacity-75">순서: {{ selectedImage?.order }} | ID: {{ selectedImage?.id }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useDdocksStore } from '@/stores/ddocks'

export default {
  name: 'AdminDdock',
  setup() {
    const ddocksStore = useDdocksStore()
    
    const enableDragSort = ref(false)
    const showUploadModal = ref(false)
    const showImageViewer = ref(false)
    const selectedImage = ref(null)
    const selectedFiles = ref([])
    const isDragging = ref(false)
    const isUpdatingOrder = ref(false)
    const hasOrderChanges = ref(false)
    const draggedIndex = ref(-1)
    
    const uploadProgress = reactive({
      show: false,
      current: 0,
      total: 0
    })
    
    const isLoading = computed(() => ddocksStore.isLoading)
    const ddocks = computed(() => ddocksStore.ddocks)
    
    const sortedDdocks = computed(() => {
      if (!Array.isArray(ddocks.value)) return []
      return [...ddocks.value].sort((a, b) => a.order - b.order)
    })

    const totalImages = computed(() => {
      if (!Array.isArray(ddocks.value)) return 0
      return ddocks.value.length
    })
    
    const activeImages = computed(() => {
      if (!Array.isArray(ddocks.value)) return 0
      return ddocks.value.filter(ddock => ddock.image).length
    })
    
    const todayUploads = computed(() => {
      if (!Array.isArray(ddocks.value)) return 0
      const today = new Date().toDateString()
      return ddocks.value.filter(ddock => {
        if (ddock.created_at) {
          return new Date(ddock.created_at).toDateString() === today
        }
        return false
      }).length
    })
    
    const totalSize = computed(() => {
      if (!Array.isArray(ddocks.value)) return 0
      return ddocks.value.reduce((sum, ddock) => {
        if (ddock.image) {
          // Base64 크기를 대략적으로 계산 (실제 바이너리 크기의 약 4/3)
          return sum + (ddock.image.length * 3/4)
        }
        return sum
      }, 0)
    })

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const refreshData = async () => {
      await ddocksStore.fetchDdocks()
    }

    const openUploadModal = () => {
      selectedFiles.value = []
      showUploadModal.value = true
    }

    const closeUploadModal = () => {
      showUploadModal.value = false
      selectedFiles.value = []
      uploadProgress.show = false
      uploadProgress.current = 0
      uploadProgress.total = 0
    }

    const onFileSelect = (event) => {
      const files = Array.from(event.target.files)
      addFiles(files)
    }

    const onFileDrop = (event) => {
      event.preventDefault()
      isDragging.value = false
      const files = Array.from(event.dataTransfer.files)
      addFiles(files)
    }

    const addFiles = (files) => {
      files.forEach(file => {
        if (file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024) {
          const reader = new FileReader()
          reader.onload = (e) => {
            selectedFiles.value.push({
              file,
              name: file.name,
              size: file.size,
              preview: e.target.result
            })
          }
          reader.readAsDataURL(file)
        } else {
          alert(`${file.name}은(는) 지원하지 않는 파일이거나 크기가 너무 큽니다.`)
        }
      })
    }

    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1)
    }

    const uploadFiles = async () => {
      if (selectedFiles.value.length === 0) return

      try {
        uploadProgress.show = true
        uploadProgress.total = selectedFiles.value.length
        uploadProgress.current = 0

        const formData = new FormData()
        selectedFiles.value.forEach(fileItem => {
          formData.append('images', fileItem.file)
        })

        await ddocksStore.createDdock(formData)
        
        uploadProgress.current = uploadProgress.total
        
        alert(`${selectedFiles.value.length}개 사진이 업로드되었습니다.`)
        closeUploadModal()
        await refreshData()
        
      } catch (error) {
        console.error('업로드 실패:', error)
        alert('사진 업로드에 실패했습니다.')
      }
    }

    const viewImage = (ddock) => {
      selectedImage.value = ddock
      showImageViewer.value = true
    }

    const closeImageViewer = () => {
      showImageViewer.value = false
      selectedImage.value = null
    }

    const moveUp = (index) => {
      if (index === 0) return
      const newOrder = [...sortedDdocks.value]
      const temp = newOrder[index]
      newOrder[index] = newOrder[index - 1]
      newOrder[index - 1] = temp
      updateOrder(newOrder)
    }

    const moveDown = (index) => {
      if (index === sortedDdocks.value.length - 1) return
      const newOrder = [...sortedDdocks.value]
      const temp = newOrder[index]
      newOrder[index] = newOrder[index + 1]
      newOrder[index + 1] = temp
      updateOrder(newOrder)
    }

    const updateOrder = (newOrder) => {
      newOrder.forEach((ddock, index) => {
        ddock.order = index + 1
      })
      hasOrderChanges.value = true
    }

    const onDragStart = (event, index) => {
      draggedIndex.value = index
      event.dataTransfer.effectAllowed = 'move'
    }

    const onDragOver = (event) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    }

    const onDrop = (event, dropIndex) => {
      event.preventDefault()
      if (draggedIndex.value === -1 || draggedIndex.value === dropIndex) return

      const newOrder = [...sortedDdocks.value]
      const draggedItem = newOrder.splice(draggedIndex.value, 1)[0]
      newOrder.splice(dropIndex, 0, draggedItem)
      
      updateOrder(newOrder)
      draggedIndex.value = -1
    }

    const saveOrder = async () => {
      try {
        isUpdatingOrder.value = true
        
        const orderData = sortedDdocks.value.map(ddock => ({
          id: ddock.id,
          order: ddock.order
        }))

        await ddocksStore.updateOrder(orderData)
        
        hasOrderChanges.value = false
        alert('순서가 저장되었습니다.')
        
      } catch (error) {
        console.error('순서 저장 실패:', error)
        alert('순서 저장에 실패했습니다.')
      } finally {
        isUpdatingOrder.value = false
      }
    }

    const deleteImage = async (ddock) => {
      if (!confirm(`'${ddock.image_name || `이미지 ${ddock.id}`}'을(를) 삭제하시겠습니까?`)) return

      try {
        await ddocksStore.deleteDdock(ddock.id)
        alert('사진이 삭제되었습니다.')
        await refreshData()
      } catch (error) {
        console.error('삭제 실패:', error)
        alert('사진 삭제에 실패했습니다.')
      }
    }

    onMounted(() => {
      refreshData()
    })

    return {
      isLoading,
      ddocks,
      sortedDdocks,
      totalImages,
      activeImages,
      todayUploads,
      totalSize,
      enableDragSort,
      showUploadModal,
      showImageViewer,
      selectedImage,
      selectedFiles,
      isDragging,
      isUpdatingOrder,
      hasOrderChanges,
      uploadProgress,
      formatFileSize,
      refreshData,
      openUploadModal,
      closeUploadModal,
      onFileSelect,
      onFileDrop,
      removeFile,
      uploadFiles,
      viewImage,
      closeImageViewer,
      moveUp,
      moveDown,
      onDragStart,
      onDragOver,
      onDrop,
      saveOrder,
      deleteImage
    }
  }
}
</script>

<style scoped>
.sortable-enabled .cursor-move:hover {
  transform: scale(1.02);
  transition: transform 0.2s ease;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>