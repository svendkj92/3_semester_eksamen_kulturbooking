import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import LandingPageLayout from '@/layouts/LandingPageLayout.vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';

// Views
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      component: LandingPageLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
      ],
    },

    {
      path: '/onboarding',
      component: OnboardingLayout,
      children: [
        {
          path: '',
          name: 'onboarding',
          component: () => import('@/views/OnboardingView.vue'),
        },
      ],
    },
  ],
});

export default router;