import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // hash를 이용한 동적 섹션 처리
      props: (route) => ({
        section: route.hash || 'main',
        userId: route.query.userId || null
      })
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    // http://localhost:5173/user/123
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('../views/UserView.vue'),
      props: true
    },
    // http://localhost:5173/product/electronics/456
    // http://localhost:5173/product/electronics
    // http://localhost:5173/product/electronics?filter=popular
    {
      path: '/product/:category/:itemId?',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
      props: (route) => ({
        category: route.params.category,
        itemId: route.params.itemId || 'default',
        filter: route.query.filter || 'all'
      })
    },
    // 정의되지 않은 경로로 접근한 경우 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      props: {
        errorMessage: 'Page not found'
      }
    }
  ],

  // 스크롤 동작 정의
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition)
      return savedPosition; // 스크롤 위치가 같기 때문에 behavior 옵션 필요 없음
    else if (to.hash) return { el: to.hash, behavior: 'smooth' };
    else
      return new Promise((resolve) => {
        // 500ms 기다린 후 스크롤
        setTimeout(() => {
          resolve({ left: 0, top: 0, behavior: 'smooth' });
        }, 500);
      });
  },
});

// 유효한 user ID인지 확인하는 함수
function isValidUserId(id) {
  return id && !isNaN(id) && Number(id) > 0;
}

router.beforeEach((to, from, next) => {
  if (to.name === 'user' && !isValidUserId(to.params.id)) {
    // 유효하지 않은 user ID인 경우
    next({ name: 'not-found', params: { pathMatch: to.path } });
  } else {
    next();
  }
});

export default router;
