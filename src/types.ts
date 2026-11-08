export interface MenuItem {
  id: string;
  name: string;
  category: 'food' | 'drinks' | 'shisha';
  subcategory: string;
  description: string;
  price: string;
  image?: string;
  badge?: string;
  popular?: boolean;
  is_available?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  category: string;
  is_published?: boolean;
}

export interface Reservation {
  id: string;
  guestName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'declined' | 'cancelled';
  staffNotes?: string;
  createdAt: string;
}

export interface EventInquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  guestCount: number;
  preferredDate: string;
  details: string;
  status?: 'new' | 'contacted' | 'booked' | 'archived';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  is_published?: boolean;
}

export interface BusinessSettings {
  id?: string;
  name: string;
  tagline?: string;
  slogan?: string;
  address: string;
  phone: string;
  instagram?: string;
  tiktok?: string;
  googleMaps?: string;
  is_accepting_reservations?: boolean;
}
