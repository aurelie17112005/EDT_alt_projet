import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true }
  },
  // Routes Enseignant
  {
    path: '/teacher/session',
    name: 'TeacherSession',
    component: () => import('@/views/teacher/SessionView.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: '/teacher/attendances',
    name: 'TeacherAttendances',
    component: () => import('@/views/teacher/AttendanceView.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  // Routes Étudiant
  {
    path: '/student/scan',
    name: 'StudentScan',
    component: () => import('@/views/student/ScanView.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/student/validation',
    name: 'StudentValidation',
    component: () => import('@/views/student/PeerValidationDialog.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  // Routes communes
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue')
  },
  // Redirection pour les routes inconnues
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/userRole']

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } 
    // ✅ PROTECTION ajoutée ici :
    else if (to.meta.role) {
      if (!userRole) {
        console.warn('⚠️ userRole non encore chargé, navigation suspendue')
        return // ou `next(false)` pour bloquer
      }
      if (userRole !== to.meta.role) {
        const redirectPath = userRole === 'teacher' 
          ? '/teacher/session' 
          : '/student/scan'
        next(redirectPath)
      } else {
        next()
      }
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})


export default router