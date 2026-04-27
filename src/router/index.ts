import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import InventoryView from '@/views/InventoryView.vue'
import LoginView from '@/views/LoginView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventario',
    name: 'Inventory',
    component: InventoryView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/escaner',
    name: 'Scanner',
    component: () => import('@/views/ScannerView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/marcas',
    name: 'Brands',
    component: () => import('@/views/BrandsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/producto/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/movimientos',
    name: 'Movements',
    component: () => import('@/views/MovementsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/soporte',
    name: 'support',
    component: () => import('../views/SupportView.vue')
  },
  {
    path: '/agregar',
    name: 'AddProduct',
    component: () => import('@/views/AddProductView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Auth Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  if (auth.isInitializing) {
     await auth.initialize()
  }

  if (to.meta.requiresAuth && !auth.user) {
    next('/login')
  } else if (to.path === '/login' && auth.user) {
    next('/')
  } else {
    next()
  }
})

export default router
