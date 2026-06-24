import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref([])
  const currentSchedule = ref(null)
  const isLoading = ref(false)
  const totalCount = ref(0)
  const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1
  })

  const fetchSchedules = async (params = {}) => {
    try {
      isLoading.value = true
      const response = await api.get('/api/schedules', { params })
      const data = response.data || {}
      const list = data.items || data.schedules || (Array.isArray(data) ? data : [])
      const page = data.pagination?.page || data.page || params.page || 1
      const limit = data.pagination?.limit || params.page_size || params.limit || 20
      const total = data.pagination?.total || data.total_count || list.length || 0
      const totalPages =
        data.pagination?.totalPages ||
        data.total_pages ||
        Math.max(Math.ceil(total / limit), 1)

      schedules.value = list
      totalCount.value = total
      pagination.value = {
        page,
        limit,
        total,
        totalPages
      }
    } catch (error) {
      console.error('스케줄 목록 조회 실패:', error)
      schedules.value = []
      totalCount.value = 0
      pagination.value = {
        page: params.page || 1,
        limit: params.page_size || params.limit || 20,
        total: 0,
        totalPages: 1
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchScheduleById = async (id) => {
    try {
      isLoading.value = true
      const response = await api.get(`/api/schedules/${id}`)
      currentSchedule.value = response.data
      return response.data
    } catch (error) {
      console.error('스케줄 상세 조회 실패:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const createSchedule = async (scheduleData) => {
    try {
      const response = await api.post('/api/schedules', scheduleData)
      await fetchSchedules()
      return response.data
    } catch (error) {
      console.error('스케줄 생성 실패:', error)
      throw error
    }
  }

  const createSchedules = async (schedulesData) => {
    try {
      const response = await api.post('/api/schedules', schedulesData)
      await fetchSchedules()
      return response.data
    } catch (error) {
      console.error('다중 스케줄 생성 실패:', error)
      throw error
    }
  }

  const updateSchedule = async (id, scheduleData) => {
    try {
      const response = await api.put(`/api/schedules/${id}`, scheduleData)
      await fetchSchedules()
      return response.data
    } catch (error) {
      console.error('스케줄 수정 실패:', error)
      throw error
    }
  }

  const deleteSchedule = async (id) => {
    try {
      await api.delete(`/api/schedules/${id}`)
      await fetchSchedules()
    } catch (error) {
      console.error('스케줄 삭제 실패:', error)
      throw error
    }
  }

  return {
    schedules,
    currentSchedule,
    isLoading,
    totalCount,
    pagination,
    fetchSchedules,
    fetchScheduleById,
    createSchedule,
    createSchedules,
    updateSchedule,
    deleteSchedule
  }
})
