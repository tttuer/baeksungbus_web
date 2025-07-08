import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useSchedulesStore = defineStore('schedules', () => {
  const schedules = ref([])
  const currentSchedule = ref(null)
  const isLoading = ref(false)

  const fetchSchedules = async (params = {}) => {
    try {
      isLoading.value = true
      const response = await api.get('/api/schedules', { params })
      schedules.value = response.data.items || response.data.schedules || response.data || []
    } catch (error) {
      console.error('스케줄 목록 조회 실패:', error)
      schedules.value = []
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
    fetchSchedules,
    fetchScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
  }
})