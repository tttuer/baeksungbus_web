import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useDdocksStore = defineStore('ddocks', () => {
  const ddocks = ref([])
  const currentDdock = ref(null)
  const isLoading = ref(false)

  const fetchDdocks = async (params = {}) => {
    try {
      isLoading.value = true
      const response = await api.get('/api/ddocks', { params })
      ddocks.value = response.data.ddocks || response.data.items || response.data || []
    } catch (error) {
      console.error('갤러리 목록 조회 실패:', error)
      ddocks.value = []
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

  const createDdock = async (ddockData) => {
    try {
      const response = await api.post('/api/ddocks', ddockData)
      await fetchDdocks()
      return response.data
    } catch (error) {
      console.error('갤러리 생성 실패:', error)
      throw error
    }
  }

  const updateDdock = async (id, ddockData) => {
    try {
      const response = await api.put(`/api/ddocks/${id}`, ddockData)
      await fetchDdocks()
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
    fetchDdocks,
    fetchDdockById,
    createDdock,
    updateDdock,
    updateOrder,
    deleteDdock
  }
})