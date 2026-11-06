import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import LandingPageLayout from '@/layouts/LandingPageLayout.vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

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
          component: () => import('@/views/LandingPageView.vue'),
        },
      ],
    },

    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/EventsView.vue'),
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