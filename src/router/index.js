import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import LandingPageLayout from '@/layouts/LandingPageLayout.vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const informationPages = [
  'skabere', 'hangouts', 'faellesskaber', 'om', 'effekt', 'kontakt',
  'blog', 'privatliv', 'servicevilkaar', 'data-sikkerhed',
];

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
          path: 'login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: 'events',
          name: 'events',
          component: () => import('@/views/EventsView.vue'),
          children: [
            {
              path: ':id',
              name: 'event-detail',
              component: () => import('@/views/EventDetailView.vue'),
            },
          ],
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
          children: [
            {
              path: 'events/:id',
              name: 'profile-event-detail',
              component: () => import('@/views/EventDetailView.vue'),
            },
          ],
        },
        ...informationPages.map((path) => ({
          path,
          name: path,
          component: () => import('@/views/InformationView.vue'),
          props: { page: path },
        })),
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