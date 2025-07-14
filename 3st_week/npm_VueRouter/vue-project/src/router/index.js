import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BookList from '../components/BookList.vue'
import BookDetails from '../components/BookDetails.vue'

// 임시 데이터
const books = [
  { id: 1, title: "코딩 자율학습 HTML+CSS+자바스크립트", author: "김기수", publishYear: 2022, description: "코딩 입문자도 쉽게 배울 수 있는 HTML+CSS+자바스크립트 입문서" },
  { id: 2, title: "코딩 자율학습 나도코딩의 파이썬 입문", author: "나도코딩", publishYear: 2023, description: "일상 속 재미있는 예제로 파이썬 기본 개념을 배울 수 있는 입문서" },
  { id: 3, title: "코딩 자율학습 스프링 부트 3 자바 백엔드 개발 입문", author: "홍팍", publishYear: 2023, description: "스프링 부트로 백엔드 개발 과정과 핵심 개념을 배울 수 있는 입문서" },
  { id: 4, title: "코딩 자율학습 나도코딩의 C 언어 입문", author: "나도코딩", publishYear: 2022, description: "C 언어를 혼자서도 끝까지 공부할 수 있게 돕는 프로그래밍 자습서" },
  { id: 5, title: "코딩 자율학습 제로초의 자바스크립트 입문", author: "조현영", publishYear: 2024, description: "12가지 프로그램을 만들면서 개념과 문법을 익히는 자바스크립트 입문서" }
];


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/books',
      alias: '/bk',
      name: 'books',
      component: BookList
    },
    {
      path: '/books/:id',
      alias: '/:id',
      name: 'book-details',
      component: BookDetails,
      props: true
    },
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
  // 1. 'user' 라우트 유효성 검사
  if (to.name === 'user') {
    if (!isValidUserId(to.params.id)) {
      // 유효하지 않은 user ID인 경우 'not-found' 페이지로 리다이렉트
      next({ name: 'not-found', params: { pathMatch: to.path } });
      return; // 다음 로직이 실행되지 않도록 여기서 함수 종료
    }
  }

  // 2. 'book-details' 라우트 유효성 검사
  if (to.name === 'book-details') {
    const id = parseInt(to.params.id);
    // id가 숫자가 아니거나, 해당 id를 가진 책이 없는 경우
    // 'books' 페이지로 리다이렉트
    if (isNaN(id) || !books.find(b => b.id === id)) {
      next({ name: 'books' });
      return;
    }
  }

  // 위에 정의된 어떤 유효성 검사에도 걸리지 않았다면, 정상적으로 다음 네비게이션을 진행
  next();
});

export default router;
