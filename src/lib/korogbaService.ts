import { supabase } from './supabase';
import { Reservation, MenuItem, EventItem, GalleryItem, BusinessSettings } from '../types';
import { MENU_ITEMS, EVENTS, GALLERY_IMAGES, BUSINESS_INFO } from '../data/mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const isSupabaseConfigured = Boolean(supabaseUrl && !supabaseUrl.includes('placeholder'));

// ==========================================
// RESERVATIONS SERVICE
// ==========================================

export async function fetchReservations(): Promise<Reservation[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch reservations from Supabase:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((r: any) => ({
      id: r.id,
      guestName: r.guest_name,
      phone: r.phone,
      email: r.email,
      date: r.date,
      time: r.time,
      guests: r.guests,
      seatingArea: r.seating_area,
      specialRequests: r.special_requests || '',
      status: r.status,
      staffNotes: r.staff_notes || '',
      createdAt: r.created_at
    }));
  } catch (err: any) {
    console.error('Error fetching reservations:', err?.message || err);
    return [];
  }
}

export async function createReservation(newRes: Omit<Reservation, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Database connection is not yet configured. Please contact KÓRÓGBÁ at +234 903 281 0235 to reserve directly.'
    };
  }

  try {
    const { error } = await supabase
      .from('reservations')
      .insert({
        guest_name: newRes.guestName.trim(),
        phone: newRes.phone.trim(),
        email: newRes.email.trim(),
        date: newRes.date,
        time: newRes.time,
        guests: newRes.guests,
        seating_area: newRes.seatingArea,
        special_requests: newRes.specialRequests?.trim() || '',
        status: 'pending'
      });

    if (error) {
      console.error('Supabase reservation insertion failed:', error);
      return { 
        success: false, 
        error: error.message || 'Unable to record your reservation request. Please try again or call +234 903 281 0235.' 
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception during reservation creation:', err);
    return {
      success: false,
      error: err?.message || 'A network error occurred while connecting to the database. Please call +234 903 281 0235.'
    };
  }
}

export async function updateReservationStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to update reservation status in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Database update failed.' };
  }
}

export async function updateReservationStaffNotes(id: string, staffNotes: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('reservations')
      .update({ staff_notes: staffNotes, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Failed to update reservation staff notes in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save staff notes.' };
  }
}

export async function deleteReservation(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database is not configured.' };
  }

  try {
    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete reservation in Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Database delete failed.' };
  }
}

// ==========================================
// EVENT ENQUIRIES SERVICE
// ==========================================

export async function fetchEventEnquiries(): Promise<any[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('event_enquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch event enquiries:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function createEventEnquiry(enquiry: {
  name: string;
  phone: string;
  email: string;
  eventType: string;
  guestCount: number;
  preferredDate: string;
  details: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Backend connection not ready. Please call KÓRÓGBÁ management at +234 903 281 0235.'
    };
  }

  try {
    const { error } = await supabase
      .from('event_enquiries')
      .insert({
        name: enquiry.name.trim(),
        phone: enquiry.phone.trim(),
        email: enquiry.email.trim(),
        event_type: enquiry.eventType,
        guest_count: enquiry.guestCount,
        preferred_date: enquiry.preferredDate,
        details: enquiry.details?.trim() || '',
        status: 'new'
      });

    if (error) {
      console.error('Supabase event enquiry insertion failed:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit event enquiry.' };
  }
}

export async function updateEventEnquiryStatus(id: string, status: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { error } = await supabase
      .from('event_enquiries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Update failed.' };
  }
}

export async function deleteEventEnquiry(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { error } = await supabase
      .from('event_enquiries')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Delete operation failed.' };
  }
}

// ==========================================
// MENU SERVICE
// ==========================================

export async function fetchMenuItems(): Promise<MenuItem[]> {
  if (!isSupabaseConfigured) return MENU_ITEMS;

  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, menu_categories(name, slug)')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return MENU_ITEMS;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      category: item.category || item.menu_categories?.slug || 'food',
      subcategory: item.subcategory,
      description: item.description,
      price: typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : item.price,
      image: item.image_url || item.image,
      badge: item.badge,
      popular: item.popular,
      is_available: item.is_available ?? true
    }));
  } catch (err) {
    return MENU_ITEMS;
  }
}

export async function createMenuItem(item: {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  image?: string;
  badge?: string;
  popular?: boolean;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    // Look up or resolve category_id
    const { data: catData } = await supabase
      .from('menu_categories')
      .select('id')
      .eq('slug', item.category.toLowerCase())
      .limit(1);

    const categoryId = catData && catData.length > 0 ? catData[0].id : null;

    const payload: any = {
      name: item.name.trim(),
      subcategory: item.subcategory.trim(),
      description: item.description.trim(),
      price: item.price,
      image_url: item.image || '',
      badge: item.badge || null,
      popular: Boolean(item.popular),
      is_published: true,
      is_available: true
    };

    if (categoryId) {
      payload.category_id = categoryId;
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert(payload)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create menu item.' };
  }
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.subcategory !== undefined) payload.subcategory = updates.subcategory;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.badge !== undefined) payload.badge = updates.badge;
    if (updates.popular !== undefined) payload.popular = updates.popular;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.price !== undefined) {
      const numPrice = Number(String(updates.price).replace(/[^0-9.]/g, ''));
      if (!isNaN(numPrice)) payload.price = numPrice;
    }

    const { error } = await supabase
      .from('menu_items')
      .update(payload)
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Update failed.' };
  }
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Delete operation failed.' };
  }
}

// ==========================================
// EVENTS SERVICE
// ==========================================

export async function fetchEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured) return EVENTS;

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return EVENTS;
    }

    return data.map((e: any) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time,
      description: e.description,
      image: e.image_url || e.image,
      category: e.category,
      is_published: e.is_published ?? true
    }));
  } catch (err) {
    return EVENTS;
  }
}

export async function createEvent(event: {
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
  category: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: event.title.trim(),
        date: event.date,
        time: event.time.trim(),
        description: event.description.trim(),
        image_url: event.image.trim(),
        category: event.category.trim(),
        is_published: true
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to create event.' };
  }
}

export async function updateEvent(id: string, updates: Partial<EventItem>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.date !== undefined) payload.date = updates.date;
    if (updates.time !== undefined) payload.time = updates.time;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.image !== undefined) payload.image_url = updates.image;
    if (updates.category !== undefined) payload.category = updates.category;

    const { error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Update failed.' };
  }
}

export async function deleteEvent(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Delete operation failed.' };
  }
}

// ==========================================
// GALLERY & STORAGE SERVICE
// ==========================================

export async function fetchGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured) return GALLERY_IMAGES.map((img, idx) => ({
    id: `gal-${idx + 1}`,
    title: img.title,
    category: img.category,
    image: img.image,
    is_published: true
  }));

  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
      return GALLERY_IMAGES.map((img, idx) => ({
        id: `gal-${idx + 1}`,
        title: img.title,
        category: img.category,
        image: img.image,
        is_published: true
      }));
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      image: item.image_url || item.image,
      description: item.description,
      is_published: item.is_published ?? true
    }));
  } catch (err) {
    return GALLERY_IMAGES.map((img, idx) => ({
      id: `gal-${idx + 1}`,
      title: img.title,
      category: img.category,
      image: img.image,
      is_published: true
    }));
  }
}

export async function createGalleryItem(item: {
  title: string;
  category: string;
  image: string;
  description?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { data, error } = await supabase
      .from('gallery')
      .insert({
        title: item.title.trim(),
        category: item.category.trim(),
        image_url: item.image.trim(),
        description: item.description?.trim() || '',
        is_published: true
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save gallery item.' };
  }
}

export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Delete operation failed.' };
  }
}

export async function uploadMediaImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Storage not configured.' };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: `Invalid file format (${file.type || 'unknown'}). Only JPEG, PNG, WEBP, and GIF images are permitted.`
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please choose a smaller image.`
    };
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('korogba-media')
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage
      .from('korogba-media')
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Image upload failed.' };
  }
}

// ==========================================
// BUSINESS SETTINGS SERVICE
// ==========================================

export async function fetchBusinessSettings(): Promise<BusinessSettings> {
  const defaultSettings: BusinessSettings = {
    name: BUSINESS_INFO.name,
    tagline: '... an african experience, reimagined',
    slogan: 'LAGOS, GET READY FOR A ROYAL EXPERIENCE!',
    address: BUSINESS_INFO.address,
    phone: BUSINESS_INFO.phone,
    instagram: BUSINESS_INFO.instagram,
    tiktok: BUSINESS_INFO.tiktok,
    googleMaps: BUSINESS_INFO.googleMaps,
    is_accepting_reservations: true
  };

  if (!isSupabaseConfigured) return defaultSettings;

  try {
    const { data, error } = await supabase
      .from('business_settings')
      .select('value')
      .eq('key', 'contact_info')
      .maybeSingle();

    if (error || !data || !data.value) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...data.value
    };
  } catch (err) {
    return defaultSettings;
  }
}

export async function updateBusinessSettings(settings: Partial<BusinessSettings>): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) return { success: false, error: 'Database not configured.' };

  try {
    const current = await fetchBusinessSettings();
    const updated = { ...current, ...settings };

    const { error } = await supabase
      .from('business_settings')
      .upsert({
        key: 'contact_info',
        value: updated,
        is_public: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update settings.' };
  }
}

// ==========================================
// AUTHENTICATION & MANAGEMENT SERVICE
// ==========================================

export async function adminLogin(email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Database connection is not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { success: false, error: error.message || 'Authentication failed. Please verify your email and password.' };
    }

    if (!data.user) {
      return { success: false, error: 'No user session returned from authentication service.' };
    }

    // Role check against profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return { 
        success: false, 
        error: 'Access denied: No administrative profile found for this account. Contact system administrator.' 
      };
    }

    const authorizedRoles = ['admin', 'super_admin', 'manager'];
    if (!authorizedRoles.includes(profile.role) || profile.is_active === false) {
      await supabase.auth.signOut();
      return { 
        success: false, 
        error: `Unauthorized: Your role (${profile.role}) does not have management access.` 
      };
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid management credentials.' };
  }
}

export async function adminLogout(): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Error during sign out:', err);
  }
}

export async function getAdminSession(): Promise<{ authenticated: boolean; email?: string; role?: string }> {
  if (!isSupabaseConfigured) return { authenticated: false };

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return { authenticated: false };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return { authenticated: false };
    }

    const authorizedRoles = ['admin', 'super_admin', 'manager'];
    if (!authorizedRoles.includes(profile.role) || profile.is_active === false) {
      return { authenticated: false };
    }

    return { authenticated: true, email: session.user.email, role: profile.role };
  } catch (err) {
    return { authenticated: false };
  }
}
