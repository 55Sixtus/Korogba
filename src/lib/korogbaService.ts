import { supabase } from './supabase';
import { Reservation, MenuItem, EventItem } from '../types';
import { MENU_ITEMS, EVENTS } from '../data/mockData';

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
    const { data, error } = await supabase
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
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase reservation insertion failed:', error);
      return { 
        success: false, 
        error: error.message || 'Unable to record your reservation request. Please try again or call +234 903 281 0235.' 
      };
    }

    return { success: true, data };
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
      // Fallback to verified local menu items if table has not been populated yet
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
      popular: item.popular
    }));
  } catch (err) {
    return MENU_ITEMS;
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
      category: e.category
    }));
  } catch (err) {
    return EVENTS;
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
// GALLERY SERVICE
// ==========================================

export async function fetchGallery(): Promise<any[]> {
  if (!isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
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
