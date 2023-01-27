import { createRouter, createWebHistory } from 'vue-router'
import Index from '../views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/equip-expedition',
      name: 'equip-expedition',
      component: () => import('../views/EquipExpedition.vue')
    },
    {
      path: '/items',
      name: 'items',
      component: () => import('../views/Items.vue')
    },
    {
      path: '/ships',
      name: 'ships',
      component: () => import('../views/Ships.vue')
    },
    {
      path: '/supplies',
      name: 'supplies',
      component: () => import('../views/Supplies.vue')
    }
  ]
})

export default router
