import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(/*import.meta.env.BASE_URL*/),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: () => import('@/views/common/Main.vue'),
    },
    {
      path: '/cmn/Login',
      name: 'Login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/cmn/Login.vue'),
    },
  ],
});

// 동적으로 경로가 변경되면 해당 컴포넌트도 변경되도록 설정
// router.beforeEach((to, from, next) => {
//   const routerStore = useRouterStore();
//   if (to.path !== routerStore.currentPath) {
//     routerStore.setRoute(to.path, to.name); // 라우터 경로 및 컴포넌트를 동적으로 업데이트
//   }
//   next();
// });

// 네비게이션 가드 설정
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = false; // 사용자 인증 여부 (예: Vuex 또는 Pinia에서 가져옴)
//   if (to.path !== '/cmn/Login' && !isAuthenticated) {
//     next('/cmn/Login'); // 로그인 페이지로 리다이렉트
//   } else {
//     next(); // 정상적으로 이동
//   }
// });

export default router
