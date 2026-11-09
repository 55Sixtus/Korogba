import { MenuItem, EventItem } from '../types';

export const BUSINESS_INFO = {
  name: 'KÓRÓGBÁ Island Bar, Restaurant & Lounge',
  tagline: '... an african experience, reimagined',
  slogan: 'LAGOS, GET READY FOR A ROYAL EXPERIENCE!',
  address: 'Royal Estate 2, Isheri-Igando Road, Lagos, Nigeria',
  phone: '+234 903 281 0235',
  instagram: 'https://www.instagram.com/korogbaisland/',
  tiktok: 'https://www.tiktok.com/@korogba.island',
  googleMaps: 'https://maps.app.goo.gl/UktYHjCdHUgXsqZV9',
  schedule: [
    { day: 'Monday', hours: 'Open 24 Hours' },
    { day: 'Tuesday', hours: 'Open 24 Hours' },
    { day: 'Wednesday', hours: 'Open 24 Hours' },
    { day: 'Thursday', hours: 'Closed', closed: true },
    { day: 'Friday', hours: 'Open 24 Hours' },
    { day: 'Saturday', hours: 'Open 24 Hours' },
    { day: 'Sunday', hours: 'Open 24 Hours' },
  ]
};

export const GALLERY_IMAGES = [
  {
    id: 'logo-official',
    title: 'Official Royal Crest Emblem',
    category: 'Brand Identity',
    image: '/assets/aistudio/image_22442516.png',
    description: 'The official KÓRÓGBÁ crest featuring African royalty gathered around the sacred gathering pot, embodying unity, heritage, and refined hospitality.'
  },
  {
    id: 'pergola-bar',
    title: 'The Outdoor Pergola Bar',
    category: 'Bar & Lounge',
    image: '/assets/aistudio/image_1cd32473.png',
    description: 'Our open-air pergola bar illuminated by warm ambient lighting, featuring fully stocked premium beverages and live match screenings.'
  },
  {
    id: 'indoor-lounge',
    title: 'The Indoor Cocktail Lounge',
    category: 'Lounge & Bar',
    image: '/assets/aistudio/image_e1aae617.png',
    description: 'Inviting indoor sanctuary with botanical ceiling decor, ambient mood lighting, and comfortable booth seating.'
  },
  {
    id: 'estate-terrace',
    title: 'The Isheri Garden Terrace',
    category: 'Garden Terrace',
    image: '/assets/aistudio/image_f66ec26e.png',
    description: 'Open-air panoramic view of the Royal Estate surroundings from our relaxing garden terrace.'
  },
  {
    id: 'restaurant-dining',
    title: 'The Restaurant & Dining Room',
    category: 'Restaurant',
    image: '/assets/aistudio/image_970bc4c1.png',
    description: 'Handwoven basket pendant lamps illuminating sleek dining tables under wooden slat architectural canopies.'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'f1',
    name: 'Kórógbá Royal Suya Platter',
    category: 'food',
    subcategory: 'Grills & Specialties',
    description: 'Tender prime beef strips and chicken skewers marinated in authentic Yaji spice blend, served with toasted peanut crumbs, crisp onions, and fresh tomatoes.',
    price: '₦12,500',
    popular: true,
    badge: 'Chef Choice',
    image: '/assets/aistudio/image_970bc4c1.png'
  },
  {
    id: 'f2',
    name: 'Asun Royale Special',
    category: 'food',
    subcategory: 'Grills & Specialties',
    description: 'Fire-roasted diced goat meat tossed in an intensely flavorful, smoky pepper sauce with native herbs and bell peppers.',
    price: '₦10,000',
    popular: true,
    image: '/assets/aistudio/image_970bc4c1.png'
  },
  {
    id: 'f3',
    name: 'Whole Grilled Catfish & Plantain',
    category: 'food',
    subcategory: 'Seafood & Grills',
    description: 'Fresh river catfish slow-grilled over hot coals with spicy pepper marinade, served alongside golden fried plantains and rich ata-roho sauce.',
    price: '₦18,000',
    popular: true,
    badge: 'Best Seller',
    image: '/assets/aistudio/image_970bc4c1.png'
  },
  {
    id: 'f4',
    name: 'Isheri Fisherman Seafood Rice',
    category: 'food',
    subcategory: 'Main Courses',
    description: 'Aromatic Nigerian jollof rice cooked in rich prawn stock with fresh jumbo prawns, calamari, crab chunks, and local spices.',
    price: '₦15,000',
    image: '/assets/aistudio/image_970bc4c1.png'
  },
  {
    id: 'f5',
    name: 'Crispy Peppered Turkey Wings',
    category: 'food',
    subcategory: 'Grills & Specialties',
    description: 'Juicy, succulent turkey wings fried to a golden crisp and smothered in our signature chef-crafted hot pepper glaze.',
    price: '₦14,000',
    image: '/assets/aistudio/image_970bc4c1.png'
  },
  {
    id: 'd1',
    name: 'Isheri Sunset Cocktail',
    category: 'drinks',
    subcategory: 'Signature Cocktails',
    description: 'A vibrant tropical blend of premium aged rum, passion fruit nectar, fresh lime juice, hibiscus reduction, and crushed mint.',
    price: '₦7,500',
    popular: true,
    badge: 'Signature',
    image: '/assets/aistudio/image_1cd32473.png'
  },
  {
    id: 'd2',
    name: 'Royal Palm Elixir',
    category: 'drinks',
    subcategory: 'Signature Cocktails',
    description: 'Infused local palm spirit paired with coconut cream, pineapple reduction, and a dusting of grated nutmeg.',
    price: '₦8,000',
    popular: true,
    image: '/assets/aistudio/image_1cd32473.png'
  },
  {
    id: 'd3',
    name: 'Cold Bottled Beer Selection',
    category: 'drinks',
    subcategory: 'Beers & Ciders',
    description: 'Choice of chilled Heineken, Star Lager, Gulder, or Stout served crisp from our illuminated display fridges.',
    price: '₦3,000',
    image: '/assets/aistudio/image_1cd32473.png'
  },
  {
    id: 'd4',
    name: 'Premium Cognac & Whisky Service',
    category: 'drinks',
    subcategory: 'Spirits & Champagne',
    description: 'Hennessey VSOP, Martell Blue Swift, or Glenfiddich 12 served with ice bucket, mixers, and dedicated tableside service.',
    price: '₦75,000+',
    badge: 'VIP Service',
    image: '/assets/aistudio/image_1cd32473.png'
  },
  {
    id: 'd5',
    name: 'Fresh Chapman Royale',
    category: 'drinks',
    subcategory: 'Mocktails & Juices',
    description: 'The quintessential Nigerian cocktail made with Fanta, Sprite, Angostura bitters, grenadine, cucumber ribbons, and fresh citrus.',
    price: '₦4,500',
    image: '/assets/aistudio/image_1cd32473.png'
  },
  {
    id: 's1',
    name: 'Kórógbá Royal Island Blend',
    category: 'shisha',
    subcategory: 'Signature Shisha',
    description: 'Our secret multi-fruit fusion with iced mint finish, smooth smoke output, and fresh fruit bowl option.',
    price: '₦8,500',
    popular: true,
    badge: 'Top Pick',
    image: '/assets/aistudio/image_e1aae617.png'
  },
  {
    id: 's2',
    name: 'Double Apple & Mint Breeze',
    category: 'shisha',
    subcategory: 'Classic Shisha',
    description: 'Traditional rich Bahraini double apple tobacco blended with cooling natural mint leaf.',
    price: '₦7,000',
    image: '/assets/aistudio/image_e1aae617.png'
  },
  {
    id: 's3',
    name: 'Blueberry Pan Raas Fusion',
    category: 'shisha',
    subcategory: 'Exotic Shisha',
    description: 'Sweet juicy blueberry coupled with aromatic Indian pan masala for a deeply satisfying sensory experience.',
    price: '₦8,000',
    image: '/assets/aistudio/image_e1aae617.png'
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Afrobeat & Palmwine Fridays',
    date: 'Every Friday Night',
    time: '8:00 PM till Dawn',
    category: 'Nightlife & Music',
    image: '/assets/aistudio/image_e1aae617.png',
    description: 'Immerse yourself in live DJ sets spinning the best of Afrobeats, Amapiano, and highlife while enjoying chilled palmwine and grills under our glowing canopy.'
  },
  {
    id: 'e2',
    title: 'Saturday Night Live VIP Lounge',
    date: 'Every Saturday',
    time: '9:00 PM - 4:00 AM',
    category: 'VIP Experience',
    image: '/assets/aistudio/image_1cd32473.png',
    description: 'Lagos elite gather at Royal Estate 2 for premium bottle service, exclusive shisha blends, and high-energy nightlife vibes.'
  },
  {
    id: 'e3',
    title: 'Sunday Sunset Chill & Grill',
    date: 'Every Sunday',
    time: '4:00 PM Onwards',
    category: 'Dining & Relaxation',
    image: '/assets/aistudio/image_970bc4c1.png',
    description: 'Unwind from the weekend with our slow-roasted suya platters, seafood specials, and relaxed ambient lounge music.'
  }
];
