import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('@/views/Schedule.vue')
    },
    {
      path: '/schedule/:id',
      name: 'schedule-detail',
      component: () => import('@/views/ScheduleDetail.vue')
    },
    {
      path: '/ddock',
      name: 'ddock',
      component: () => import('@/views/Ddock.vue')
    },
    {
      path: '/location',
      name: 'location',
      component: () => import('@/views/Location.vue')
    },
    {
      path: '/notice',
      name: 'notice',
      component: () => import('@/views/Notice.vue')
    },
    {
      path: '/notice/:id',
      name: 'notice-detail',
      component: () => import('@/views/NoticeDetail.vue')
    },
    {
      path: '/qa',
      name: 'qa',
      component: () => import('@/views/QA.vue')
    },
    {
      path: '/qa/form',
      name: 'qa-form',
      component: () => import('@/views/QAForm.vue')
    },
    {
      path: '/qa/:id',
      name: 'qa-detail',
      component: () => import('@/views/QADetail.vue')
    },
    {
      path: '/qa/:id/update',
      name: 'qa-update',
      component: () => import('@/views/QAUpdate.vue')
    },
    {
      path: '/lost',
      name: 'lost',
      component: () => import('@/views/Lost.vue')
    },
    {
      path: '/lost/form',
      name: 'lost-form',
      component: () => import('@/views/LostForm.vue')
    },
    {
      path: '/recruit',
      name: 'recruit',
      component: () => import('@/views/Recruit.vue')
    },
    {
      path: '/adm',
      name: 'admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      redirect: '/adm/dashboard',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        },
        {
          path: 'schedule',
          name: 'admin-schedule',
          component: () => import('@/views/admin/Schedule.vue')
        },
        {
          path: 'notice',
          name: 'admin-notice',
          component: () => import('@/views/admin/Notice.vue')
        },
        {
          path: 'customer',
          name: 'admin-customer',
          component: () => import('@/views/admin/Customer.vue')
        },
        {
          path: 'customer/:id',
          name: 'admin-customer-detail',
          component: () => import('@/views/admin/CustomerDetail.vue')
        },
        {
          path: 'ddock',
          name: 'admin-ddock',
          component: () => import('@/views/admin/Ddock.vue')
        },
        {
          path: 'lost',
          name: 'admin-lost',
          component: () => import('@/views/admin/Lost.vue')
        }
      ]
    },
    {
      path: '/adm/login',
      name: 'admin-login',
      component: () => import('@/views/admin/Login.vue')
    }
  ]
})

export default router