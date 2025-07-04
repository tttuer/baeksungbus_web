import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useQAsStore = defineStore('qas', () => {
  const qas = ref([])
  const currentQA = ref(null)
  const isLoading = ref(false)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  const fetchQAs = async (params = {}) => {
    try {
      isLoading.value = true
      const response = await api.get('/api/qas', { params })
      qas.value = response.data.items || response.data
      
      if (response.data.pagination) {
        pagination.value = response.data.pagination
      }
    } catch (error) {
      console.error('Q&A 목록 조회 실패:', error)
    } finally {
      isLoading.value = false
    }
  }

  const fetchQAById = async (id) => {
    try {
      isLoading.value = true
      const response = await api.get(`/api/qas/${id}`)
      currentQA.value = response.data
      return response.data
    } catch (error) {
      console.error('Q&A 상세 조회 실패:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createQA = async (qaData) => {
    try {
      const response = await api.post('/api/qas', qaData)
      await fetchQAs()
      return response.data
    } catch (error) {
      console.error('Q&A 생성 실패:', error)
      throw error
    }
  }

  const updateQA = async (id, qaData) => {
    try {
      const response = await api.put(`/api/qas/${id}`, qaData)
      await fetchQAs()
      return response.data
    } catch (error) {
      console.error('Q&A 수정 실패:', error)
      throw error
    }
  }

  const deleteQA = async (id) => {
    try {
      await api.delete(`/api/qas/${id}`)
      await fetchQAs()
    } catch (error) {
      console.error('Q&A 삭제 실패:', error)
      throw error
    }
  }

  return {
    qas,
    currentQA,
    isLoading,
    pagination,
    fetchQAs,
    fetchQAById,
    createQA,
    updateQA,
    deleteQA
  }
})