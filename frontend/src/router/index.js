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

  // ADMIN
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/AdminView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

  // TEACHER
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

  // STUDENT
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

  // COMMON
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

  { path: '*', redirect: '/' }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 })
})

/** Util: route par rôle */
function dashboardFor(role) {
  if (role === 'admin') return '/admin'
  if (role === 'teacher') return '/teacher/session'
  return '/student/scan'
}

let userFetchedOnce = false

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  let userRole = store.getters['auth/userRole']

  // Toujours essayer de charger l'utilisateur si on est auth mais sans rôle
  if (isAuthenticated && !userRole && !userFetchedOnce) {
    userFetchedOnce = true
    await store.dispatch('auth/fetchUser').catch(() => {})
    userRole = store.getters['auth/userRole']
  }

  // Routes protégées
  if (to.matched.some(r => r.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    // Si on ouvre "Home", rediriger vers le bon tableau de bord
    if (to.name === 'Home') {
      return next(dashboardFor(userRole))
    }

    // Rôle requis mais différent → renvoyer vers son dashboard
    if (to.meta.role && to.meta.role !== userRole) {
      return next(dashboardFor(userRole))
    }

    return next()
  }

  // Routes invité : si déjà connecté, envoyer au dashboard adapté
  if (to.matched.some(r => r.meta.guest) && isAuthenticated) {
    return next(dashboardFor(userRole))
  }

  return next()
})

/** Éviter les erreurs bruyantes de redirections "Redirected when going from..." */
Vue.config.errorHandler = (err) => {
  if (err && err.message && err.message.startsWith('Redirected when going from')) {
    return
  }
  console.error(err)
}

// Éviter NavigationDuplicated non fatales
const origPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(loc, onResolve, onReject) {
  if (onResolve || onReject) return origPush.call(this, loc, onResolve, onReject)
  return origPush.call(this, loc).catch(err => err)
}
const origReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(loc, onResolve, onReject) {
  if (onResolve || onReject) return origReplace.call(this, loc, onResolve, onReject)
  return origReplace.call(this, loc).catch(err => err)
}

export default router
