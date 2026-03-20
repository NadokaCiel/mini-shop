import { ROUTE_META, ROUTE_PATH } from '@/router/route-map'
import { useAuthStore } from '@/stores/auth'

function normalizePath(rawUrl: string) {
  const [path] = rawUrl.split('?')
  return path.startsWith('/') ? path : `/${path}`
}

function buildLoginRedirect(path: string) {
  return `${ROUTE_PATH.login}?redirect=${encodeURIComponent(path)}`
}

function redirectToLogin(path: string) {
  uni.navigateTo({ url: buildLoginRedirect(path) })
}

function canPass(path: string) {
  const authStore = useAuthStore()
  const meta = ROUTE_META[path]

  if (!meta) {
    return true
  }

  if (meta.requiresAuth && !authStore.isLoggedIn) {
    redirectToLogin(path)
    return false
  }

  if (meta.guestOnly && authStore.isLoggedIn) {
    uni.switchTab({ url: ROUTE_PATH.tabMine })
    return false
  }

  return true
}

function createRouteInterceptor() {
  return {
    invoke(args: UniApp.NavigateToOptions | UniApp.RedirectToOptions | UniApp.ReLaunchOptions | UniApp.SwitchTabOptions) {
      const path = normalizePath(String(args.url || ''))
      if (!path) {
        return args
      }
      if (!canPass(path)) {
        return false
      }
      return args
    },
  }
}

export function registerRouteGuard() {
  const interceptor = createRouteInterceptor()
  uni.addInterceptor('navigateTo', interceptor)
  uni.addInterceptor('redirectTo', interceptor)
  uni.addInterceptor('reLaunch', interceptor)
  uni.addInterceptor('switchTab', interceptor)
}
