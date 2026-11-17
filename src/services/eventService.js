import jazzJamImage from '@/assets/img/event_images/jazz_jam.jpg';
import hipHopDansWorkshopImage from '@/assets/img/event_images/hip_hop_danseworkshop.jpg';
import teaterImage from '@/assets/img/event_images/teater.jpg';
import designWorkshopImage from '@/assets/img/event_images/design_workshop.jpg';

export const events = [
  {
    id: 1,
    title: 'Jazz Jam',
    category: 'Musik',
    date: '2026-11-15',
    time: '19:00',
    location: 'Kulturmaskinen, Odense',
    price: 'Gratis',
    image: jazzJamImage,
    description: 'Oplev en stemningsfuld aften med live jazz og nye musikalske talenter.',
  },
  {
    id: 2,
    title: 'Hip hop danseworkshop',
    category: 'Dans',
    date: '2026-11-12',
    time: '17:30',
    location: 'Dansens Hus, Odense',
    price: 'Gratis',
    image: hipHopDansWorkshopImage,
    description: 'En uformel danseworkshop, hvor alle kan være med.',
  },
  {
    id: 3,
    title: 'Teater i øjenhøjde',
    category: 'Teater',
    date: '2026-11-13',
    time: '19:30',
    location: 'Teater Momentum',
    price: '150 ,-',
    image: teaterImage,
    description: 'Oplev moderne teater og mød nye mennesker.',
  },
  {
    id: 4,
    title: 'Design workshop',
    category: 'Design',
    date: '2026-11-29',
    time: '14:00',
    location: 'Kulturmaskinen, Odense',
    price: 'Gratis',
    image: designWorkshopImage,
    description: 'En workshop for dig, der elsker at udvikle kreative idéer.',
  },
];
