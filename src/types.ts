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
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  category: string;
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
  createdAt: string;
}
