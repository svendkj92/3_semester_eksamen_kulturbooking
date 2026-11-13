import { createRouter, createWebHistory } from 'vue-router';

// Layouts
import LandingPageLayout from '@/layouts/LandingPageLayout.vue';
import OnboardingLayout from '@/layouts/OnboardingLayout.vue';
import MainLayout from '@/layouts/MainLayout.vue';

const informationPages = [
  { path: 'skabere', title: 'Skabere', description: 'Her kommer et overblik over skabere på KulturBooking.' },
  { path: 'hangouts', title: 'Hangouts', description: 'Her kommer et overblik over hangouts på KulturBooking.' },
  { path: 'faellesskaber', title: 'Fællesskaber', description: 'Her kommer et overblik over fællesskaber på KulturBooking.' },
  { path: 'om', title: 'Om KulturBooking', description: 'Her kommer information om KulturBooking.' },
  { path: 'effekt', title: 'Effekt', description: 'Her kommer information om KulturBookings effekt.' },
  { path: 'kontakt', title: 'Kontakt', description: 'Her kommer kontaktoplysninger til KulturBooking.' },
  { path: 'blog', title: 'Blog', description: 'Her kommer indlæg og nyheder fra KulturBooking.' },
  { path: 'privatliv', title: 'Privatliv', description: 'Privatlivspolitikken er endnu ikke tilgængelig. Her kommer information om behandling af personoplysninger.' },
  { path: 'servicevilkaar', title: 'Servicevilkår', description: 'Servicevilkårene er endnu ikke tilgængelige. Her kommer vilkår for brug af KulturBooking.' },
  { path: 'data-sikkerhed', title: 'Data & sikkerhed', description: 'Her kommer information om data og sikkerhed på KulturBooking.' },
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
          path: 'events',
          name: 'events',
          component: () => import('@/views/EventsView.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        ...informationPages.map(({ path, title, description }) => ({
          path,
          name: path,
          component: () => import('@/views/InformationView.vue'),
          props: { title, description },
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