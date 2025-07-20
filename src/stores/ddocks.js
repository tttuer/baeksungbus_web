import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useDdocksStore = defineStore('ddocks', () => {
  const ddocks = ref([])
  const currentDdock = ref(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    total_pages: 1,
    total_count: 0
  })

  const fetchDdocks = async (params = {}) => {
    try {
      isLoading.value = true
      const response = await api.get('/api/ddocks', { params })
      
      // 첫 페이지인 경우 기존 데이터 교체, 아니면 추가 (무한스크롤용)
      if (params.page === 1 || !params.page) {
        ddocks.value = response.data.ddocks || []
      } else {
        ddocks.value = [...ddocks.value, ...(response.data.ddocks || [])]
      }
      
      // 페이지네이션 정보 업데이트
      pagination.value = {
        page: response.data.page || 1,
        total_pages: response.data.total_pages || 1,
        total_count: response.data.total_count || 0
      }
    } catch (error) {
      console.error('갤러리 목록 조회 실패:', error)
      if (params.page === 1 || !params.page) {
        ddocks.value = []
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchDdockById = async (id) => {
    try {
      isLoading.value = true
      const response = await api.get(`/api/ddocks/${id}`)
      currentDdock.value = response.data
      return response.data
    } catch (error) {
      console.error('정류장 상세 조회 실패:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createDdock = async (formData) => {
    try {
      const response = await api.post('/api/ddocks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      // 새로 업로드한 후 첫 페이지를 다시 로드
      await fetchDdocks({ page: 1 })
      return response.data
    } catch (error) {
      console.error('갤러리 생성 실패:', error)
      throw error
    }
  }

  const updateDdock = async (id, formData) => {
    try {
      const response = await api.put(`/api/ddocks/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      await fetchDdocks({ page: 1 })
      return response.data
    } catch (error) {
      console.error('갤러리 수정 실패:', error)
      throw error
    }
  }

  const updateOrder = async (orderData) => {
    try {
      const response = await api.patch('/api/ddocks/order', { orders: orderData })
      await fetchDdocks()
      return response.data
    } catch (error) {
      console.error('순서 업데이트 실패:', error)
      throw error
    }
  }

  const deleteDdock = async (id) => {
    try {
      await api.delete(`/api/ddocks/${id}`)
      await fetchDdocks()
    } catch (error) {
      console.error('갤러리 삭제 실패:', error)
      throw error
    }
  }

  return {
    ddocks,
    currentDdock,
    isLoading,
    pagination,
    fetchDdocks,
    fetchDdockById,
    createDdock,
    updateDdock,
    updateOrder,
    deleteDdock
  }
})