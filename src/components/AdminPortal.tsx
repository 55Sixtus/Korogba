import { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Lock, Calendar, Utensils, Trash2, CheckCircle2, XCircle, 
  LogOut, CalendarDays, Search, ImageIcon, 
  Layers, Settings, Users, Plus, UploadCloud, Save, MessageSquare
} from 'lucide-react';
import { Reservation, MenuItem, EventItem, GalleryItem, BusinessSettings } from '../types';
import { BUSINESS_INFO, MENU_ITEMS, EVENTS, GALLERY_IMAGES } from '../data/mockData';
import { 
  adminLogin, 
  adminLogout, 
  getAdminSession, 
  fetchEventEnquiries, 
  deleteMenuItem, 
  createMenuItem,
  deleteEvent, 
  createEvent,
  deleteEventEnquiry,
  updateEventEnquiryStatus,
  fetchMenuItems,
  fetchEvents,
  fetchGallery,
  createGalleryItem,
  deleteGalleryItem,
  uploadMediaImage,
  fetchBusinessSettings,
  updateBusinessSettings,
  updateReservationStaffNotes
} from '../lib/korogbaService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  onUpdateStatus: (id: string, newStatus: 'confirmed' | 'declined' | 'cancelled' | 'pending') => void;
  onDeleteReservation?: (id: string) => void;
  onRefreshReservations?: () => Promise<void> | void;
}

export default function AdminPortal({ 
  isOpen, 
  onClose, 
  reservations, 
  onUpdateStatus,
  onDeleteReservation,
  onRefreshReservations
}: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<{ email?: string; role?: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'menu' | 'events' | 'gallery' | 'enquiries' | 'settings'>('overview');
  
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);
  const [eventList, setEventList] = useState<EventItem[]>(EVENTS);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [enquiriesList, setEnquiriesList] = useState<any[]>([]);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    name: BUSINESS_INFO.name,
    tagline: '... an african experience, reimagined',
    slogan: 'LAGOS, GET READY FOR A ROYAL EXPERIENCE!',
    address: BUSINESS_INFO.address,
    phone: BUSINESS_INFO.phone,
    instagram: BUSINESS_INFO.instagram,
    tiktok: BUSINESS_INFO.tiktok,
    googleMaps: BUSINESS_INFO.googleMaps,
    is_accepting_reservations: true
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals and forms state
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    category: 'food' as 'food' | 'drinks' | 'shisha',
    subcategory: '',
    description: '',
    price: '',
    badge: ''
  });

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    image: '',
    category: 'Nightlife'
  });

  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Atmosphere',
    image: '',
    description: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAdminSession().then(session => {
        if (session.authenticated) {
          setIsAuthenticated(true);
          setAdminUser({ email: session.email, role: session.role });
        } else {
          setIsAuthenticated(false);
          setAdminUser(null);
        }
      });
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    if (onRefreshReservations) {
      await onRefreshReservations();
    }
    const [enq, items, evts, gal, settings] = await Promise.all([
      fetchEventEnquiries(),
      fetchMenuItems(),
      fetchEvents(),
      fetchGallery(),
      fetchBusinessSettings()
    ]);
    if (enq) setEnquiriesList(enq);
    if (items && items.length > 0) setMenuList(items);
    if (evts && evts.length > 0) setEventList(evts);
    if (gal && gal.length > 0) setGalleryList(gal);
    if (settings) setBusinessSettings(settings);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    const res = await adminLogin(loginEmail, loginPassword);
    if (res.success && res.user) {
      setIsAuthenticated(true);
      setAdminUser({ email: res.user.email, role: 'admin' });
      await loadData();
    } else {
      setLoginError(res.error || 'Invalid management credentials.');
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  // Staff notes update
  const handleSaveStaffNotes = async (id: string) => {
    await updateReservationStaffNotes(id, notesText);
    setEditingNotesId(null);
    const target = reservations.find(r => r.id === id);
    if (target) target.staffNotes = notesText;
  };

  // Menu Handlers
  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(newMenu.price.replace(/[^0-9.]/g, '')) || 0;
    const res = await createMenuItem({
      name: newMenu.name,
      category: newMenu.category,
      subcategory: newMenu.subcategory || 'Specialty',
      description: newMenu.description,
      price: numPrice,
      badge: newMenu.badge || undefined
    });
    if (res.success) {
      setIsAddingMenu(false);
      setNewMenu({ name: '', category: 'food', subcategory: '', description: '', price: '', badge: '' });
      const updated = await fetchMenuItems();
      setMenuList(updated);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    const res = await deleteMenuItem(id);
    if (res.success) {
      setMenuList(prev => prev.filter(m => m.id !== id));
    }
  };

  // Event Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createEvent(newEvent);
    if (res.success) {
      setIsAddingEvent(false);
      setNewEvent({ title: '', date: '', time: '', description: '', image: '', category: 'Nightlife' });
      const updated = await fetchEvents();
      setEventList(updated);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event listing?')) return;
    const res = await deleteEvent(id);
    if (res.success) {
      setEventList(prev => prev.filter(e => e.id !== id));
    }
  };

  // Gallery & Storage Upload Handlers
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const res = await uploadMediaImage(file);
    if (res.success && res.url) {
      setNewGallery(prev => ({ ...prev, image: res.url! }));
    } else {
      alert(`Upload failed: ${res.error || 'Please ensure you are signed in as an admin.'}`);
    }
    setUploadingImage(false);
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.image) {
      alert('Please provide or upload an image first.');
      return;
    }
    const res = await createGalleryItem(newGallery);
    if (res.success) {
      setIsAddingGallery(false);
      setNewGallery({ title: '', category: 'Atmosphere', image: '', description: '' });
      const updated = await fetchGallery();
      setGalleryList(updated);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Remove this photo from the gallery?')) return;
    const res = await deleteGalleryItem(id);
    if (res.success) {
      setGalleryList(prev => prev.filter(g => g.id !== id));
    }
  };

  // Enquiry status
  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    const res = await updateEventEnquiryStatus(id, status);
    if (res.success) {
      setEnquiriesList(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    const res = await deleteEventEnquiry(id);
    if (res.success) {
      setEnquiriesList(prev => prev.filter(enq => enq.id !== id));
    }
  };

  // Settings update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateBusinessSettings(businessSettings);
    if (res.success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="relative max-w-6xl w-full glass-panel rounded-3xl p-4 sm:p-8 border border-[#bf953f]/40 my-4 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-[#bf953f] transition-colors z-20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto text-center py-12 flex-1 flex flex-col justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#bf953f]/20 border border-[#bf953f]/50 flex items-center justify-center mx-auto mb-4 text-[#bf953f]">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#bf953f] block mb-1">Secure Management Portal</span>
            <h3 className="font-cinzel text-2xl font-bold text-white mb-2">Staff Sign In</h3>
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
              Enter your authorized management credentials to access live KÓRÓGBÁ operations.
            </p>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">Authorized Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@korogba.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#bf953f]"
                />
              </div>

              {loginError && (
                <p className="text-red-400 text-xs font-medium text-center p-2 rounded-lg bg-red-950/40 border border-red-900/60">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#bf953f] via-[#d4af37] to-[#aa771c] text-black font-bold text-sm shadow-lg hover:shadow-[#bf953f]/30 transition-all mt-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800 mb-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#bf953f]/20 border border-[#bf953f]/50 flex items-center justify-center text-[#bf953f]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl font-bold text-white">KÓRÓGBÁ Management Dashboard</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#bf953f]">Supabase PostgreSQL • RLS Enforced</span>
                    {adminUser?.email && (
                      <span className="text-xs text-neutral-400 font-mono">({adminUser.email})</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 shrink-0 border-b border-neutral-800/60">
              {[
                { id: 'overview', name: 'Overview', icon: <Layers className="w-4 h-4" /> },
                { id: 'reservations', name: 'Reservations', icon: <Calendar className="w-4 h-4" /> },
                { id: 'menu', name: 'Menu', icon: <Utensils className="w-4 h-4" /> },
                { id: 'events', name: 'Events', icon: <CalendarDays className="w-4 h-4" /> },
                { id: 'gallery', name: 'Gallery', icon: <ImageIcon className="w-4 h-4" /> },
                { id: 'enquiries', name: 'Event Enquiries', icon: <Users className="w-4 h-4" /> },
                { id: 'settings', name: 'Business Settings', icon: <Settings className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black shadow-lg font-bold' : 'bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white'}`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto pr-1">
              
              {/* 1. OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-card rounded-2xl p-6 border border-[#bf953f]/20">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Total Reservations</span>
                      <span className="font-cinzel text-3xl font-bold text-white">{reservations.length}</span>
                      <span className="text-[11px] text-emerald-400 mt-2 block">Live from Supabase</span>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#bf953f]/20">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Pending Review</span>
                      <span className="font-cinzel text-3xl font-bold text-amber-400">
                        {reservations.filter(r => r.status === 'pending').length}
                      </span>
                      <span className="text-[11px] text-amber-300 mt-2 block">Awaiting staff action</span>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#bf953f]/20">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Published Menu Items</span>
                      <span className="font-cinzel text-3xl font-bold text-white">{menuList.length}</span>
                      <span className="text-[11px] text-[#bf953f] mt-2 block">Active offerings</span>
                    </div>
                    <div className="glass-card rounded-2xl p-6 border border-[#bf953f]/20">
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">Active Events</span>
                      <span className="font-cinzel text-3xl font-bold text-white">{eventList.length}</span>
                      <span className="text-[11px] text-[#bf953f] mt-2 block">Live schedule</span>
                    </div>
                  </div>

                  <div className="glass-panel rounded-2xl p-6 border border-neutral-800">
                    <h4 className="font-cinzel text-lg font-bold text-white mb-4">Recent Reservation Requests</h4>
                    <div className="space-y-3">
                      {reservations.length === 0 ? (
                        <p className="text-neutral-400 text-sm">No reservations recorded yet in the database.</p>
                      ) : (
                        reservations.slice(0, 5).map(res => (
                          <div key={res.id} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                            <div>
                              <span className="text-sm font-bold text-white block">{res.guestName}</span>
                              <span className="text-xs text-neutral-400">{res.date} at {res.time} • {res.guests} Guests • {res.seatingArea}</span>
                            </div>
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                              res.status === 'confirmed' ? 'bg-green-950 text-green-400 border border-green-800' :
                              res.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                              'bg-red-950 text-red-400 border border-red-800'
                            }`}>
                              {res.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. RESERVATIONS TAB */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search by name, phone or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#bf953f]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {['all', 'pending', 'confirmed', 'declined'].map(s => (
                        <button
                          key={s}
                          onClick={() => setStatusFilter(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize cursor-pointer ${statusFilter === s ? 'bg-[#bf953f] text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List */}
                  <div className="space-y-4">
                    {filteredReservations.length === 0 ? (
                      <div className="text-center py-16 text-neutral-400">
                        <p>No reservations found matching your criteria.</p>
                      </div>
                    ) : (
                      filteredReservations.map(res => (
                        <div key={res.id} className="glass-card rounded-2xl p-5 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-[#bf953f]">{res.id}</span>
                              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                res.status === 'confirmed' ? 'bg-green-950 text-green-400 border border-green-800' :
                                res.status === 'pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                                'bg-red-950 text-red-400 border border-red-800'
                              }`}>
                                {res.status}
                              </span>
                            </div>
                            <h4 className="font-cinzel font-bold text-white text-lg">{res.guestName}</h4>
                            <p className="text-xs text-neutral-300 mt-1">
                              📅 {res.date} at {res.time} • 👥 {res.guests} Guests • Seating: <strong className="text-white">{res.seatingArea}</strong>
                            </p>
                            {res.specialRequests && (
                              <p className="text-xs text-neutral-400 italic mt-1 bg-black/40 p-2 rounded-lg border border-neutral-800">"{res.specialRequests}"</p>
                            )}

                            {/* Staff Notes */}
                            <div className="mt-3 pt-2 border-t border-neutral-800/80">
                              {editingNotesId === res.id ? (
                                <div className="flex items-center gap-2 mt-1">
                                  <input
                                    type="text"
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    placeholder="Enter internal staff notes..."
                                    className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-[#bf953f] flex-1"
                                  />
                                  <button
                                    onClick={() => handleSaveStaffNotes(res.id)}
                                    className="px-3 py-1.5 rounded-lg bg-[#bf953f] text-black font-semibold text-xs cursor-pointer flex items-center gap-1"
                                  >
                                    <Save className="w-3 h-3" /> Save
                                  </button>
                                  <button
                                    onClick={() => setEditingNotesId(null)}
                                    className="px-2 py-1.5 text-xs text-neutral-400 hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-xs text-neutral-400">
                                  <span className="flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#bf953f]" />
                                    <span>Staff Notes: {res.staffNotes || <em className="text-neutral-500">None</em>}</span>
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingNotesId(res.id);
                                      setNotesText(res.staffNotes || '');
                                    }}
                                    className="text-[11px] text-[#bf953f] hover:underline cursor-pointer"
                                  >
                                    Edit Notes
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                            <div className="text-right text-xs text-neutral-400">
                              <span className="block font-medium text-neutral-200">📞 {res.phone}</span>
                              <span>✉️ {res.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {res.status !== 'confirmed' && (
                                <button
                                  onClick={() => onUpdateStatus(res.id, 'confirmed')}
                                  className="px-3 py-1.5 rounded-lg bg-green-950/60 border border-green-800/60 text-green-400 hover:bg-green-900 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Confirm
                                </button>
                              )}
                              {res.status !== 'declined' && (
                                <button
                                  onClick={() => onUpdateStatus(res.id, 'declined')}
                                  className="px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 hover:bg-red-900 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> Decline
                                </button>
                              )}
                              {onDeleteReservation && (
                                <button
                                  onClick={() => onDeleteReservation(res.id)}
                                  className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 3. MENU MANAGEMENT TAB */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white">Menu Inventory</h4>
                      <p className="text-xs text-neutral-400">Manage food, drinks, and shisha items in PostgreSQL.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingMenu(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Item
                    </button>
                  </div>

                  {isAddingMenu && (
                    <form onSubmit={handleCreateMenu} className="glass-panel p-5 rounded-2xl border border-[#bf953f]/40 space-y-4">
                      <h5 className="font-cinzel text-sm font-bold text-white">Add New Menu Item</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Item Name (e.g., Royal Grilled Prawns)"
                          value={newMenu.name}
                          onChange={e => setNewMenu({ ...newMenu, name: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                        <select
                          value={newMenu.category}
                          onChange={e => setNewMenu({ ...newMenu, category: e.target.value as any })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        >
                          <option value="food">Food & Grills</option>
                          <option value="drinks">Drinks & Cocktails</option>
                          <option value="shisha">Shisha Lounge</option>
                        </select>
                        <input
                          type="text"
                          required
                          placeholder="Subcategory (e.g., Main Grills, Signature Cocktails)"
                          value={newMenu.subcategory}
                          onChange={e => setNewMenu({ ...newMenu, subcategory: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Price (e.g. 15000)"
                          value={newMenu.price}
                          onChange={e => setNewMenu({ ...newMenu, price: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Description..."
                        value={newMenu.description}
                        onChange={e => setNewMenu({ ...newMenu, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingMenu(false)}
                          className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#bf953f] text-black text-xs font-bold"
                        >
                          Save Item
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menuList.map(item => (
                      <div key={item.id} className="glass-card rounded-2xl p-4 border border-neutral-800 flex items-center justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-semibold text-[#bf953f] uppercase tracking-wider">{item.category} • {item.subcategory}</span>
                          <h5 className="font-cinzel font-bold text-white text-base">{item.name}</h5>
                          <p className="text-xs text-neutral-300 font-semibold mt-1">{item.price}</p>
                          {item.description && (
                            <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteMenu(item.id)}
                          className="p-2 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                          title="Delete from Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. EVENT MANAGEMENT TAB */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white">Event Schedule</h4>
                      <p className="text-xs text-neutral-400">Manage VIP night sessions and live resident acts.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingEvent(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Event
                    </button>
                  </div>

                  {isAddingEvent && (
                    <form onSubmit={handleCreateEvent} className="glass-panel p-5 rounded-2xl border border-[#bf953f]/40 space-y-4">
                      <h5 className="font-cinzel text-sm font-bold text-white">Create New Event</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Event Title"
                          value={newEvent.title}
                          onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                        <input
                          type="date"
                          required
                          value={newEvent.date}
                          onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Time (e.g. 8:00 PM - Late)"
                          value={newEvent.time}
                          onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Image URL"
                          value={newEvent.image}
                          onChange={e => setNewEvent({ ...newEvent, image: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                      </div>
                      <textarea
                        rows={2}
                        required
                        placeholder="Event Description..."
                        value={newEvent.description}
                        onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingEvent(false)}
                          className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-[#bf953f] text-black text-xs font-bold"
                        >
                          Save Event
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {eventList.map(event => (
                      <div key={event.id} className="glass-card rounded-2xl p-5 border border-neutral-800 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <img src={event.image} alt={event.title} className="w-16 h-16 rounded-xl object-cover border border-neutral-800" />
                          <div>
                            <span className="text-[10px] font-semibold text-[#bf953f] uppercase">{event.category} • {event.date} • {event.time}</span>
                            <h5 className="font-cinzel font-bold text-white text-base">{event.title}</h5>
                            <p className="text-xs text-neutral-400 line-clamp-1">{event.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                          title="Delete from Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. GALLERY TAB */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white">Visual Gallery</h4>
                      <p className="text-xs text-neutral-400">Upload to Supabase Storage ('korogba-media') & manage photos.</p>
                    </div>
                    <button
                      onClick={() => setIsAddingGallery(true)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#bf953f] to-[#aa771c] text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Photo
                    </button>
                  </div>

                  {isAddingGallery && (
                    <form onSubmit={handleCreateGallery} className="glass-panel p-5 rounded-2xl border border-[#bf953f]/40 space-y-4">
                      <h5 className="font-cinzel text-sm font-bold text-white">Upload New Photo</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Photo Title"
                          value={newGallery.title}
                          onChange={e => setNewGallery({ ...newGallery, title: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        />
                        <select
                          value={newGallery.category}
                          onChange={e => setNewGallery({ ...newGallery, category: e.target.value })}
                          className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                        >
                          <option value="Atmosphere">Atmosphere</option>
                          <option value="Culinary">Culinary</option>
                          <option value="Nightlife">Nightlife</option>
                          <option value="VIP Lounge">VIP Lounge</option>
                        </select>
                      </div>

                      {/* File Upload Selector */}
                      <div className="border border-dashed border-neutral-700 rounded-xl p-4 text-center">
                        <label className="cursor-pointer block">
                          <UploadCloud className="w-8 h-8 mx-auto text-[#bf953f] mb-2" />
                          <span className="text-xs text-neutral-300 block font-medium">
                            {uploadingImage ? 'Uploading image to Supabase...' : 'Click to select a photo from your computer'}
                          </span>
                          <span className="text-[11px] text-neutral-500 block mt-1">PNG, JPG, WEBP up to 5MB</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingImage}
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        required
                        placeholder="Image URL (or uploaded automatically above)"
                        value={newGallery.image}
                        onChange={e => setNewGallery({ ...newGallery, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                      />

                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingGallery(false)}
                          className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={uploadingImage}
                          className="px-4 py-2 rounded-xl bg-[#bf953f] text-black text-xs font-bold"
                        >
                          Save Photo
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryList.map(img => (
                      <div key={img.id} className="glass-card rounded-2xl overflow-hidden border border-neutral-800 relative group">
                        <div className="h-44 bg-black">
                          <img src={img.image} alt={img.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-[#bf953f] uppercase">{img.category}</span>
                            <h5 className="font-cinzel font-bold text-white text-sm mt-0.5">{img.title}</h5>
                          </div>
                          <button
                            onClick={() => handleDeleteGallery(img.id)}
                            className="p-2 rounded-lg bg-red-950/60 border border-red-800/60 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                            title="Delete Photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. ENQUIRIES TAB */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white">Private Event Enquiries</h4>
                      <p className="text-xs text-neutral-400">Review incoming VIP private lockout and celebration requests.</p>
                    </div>
                  </div>
                  {enquiriesList.length === 0 ? (
                    <div className="glass-card rounded-2xl p-8 text-center text-neutral-400">
                      <p>No event enquiries logged yet in the database.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {enquiriesList.map((enq: any) => (
                        <div key={enq.id} className="glass-card rounded-2xl p-5 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-mono font-bold text-[#bf953f]">{enq.event_type}</span>
                              <select
                                value={enq.status || 'new'}
                                onChange={e => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-900 border border-neutral-700 text-amber-400 uppercase cursor-pointer"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="booked">Booked</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                            <h4 className="font-cinzel font-bold text-white text-lg">{enq.name}</h4>
                            <p className="text-xs text-neutral-300 mt-1">
                              📅 Preferred Date: <strong>{enq.preferred_date}</strong> • 👥 {enq.guest_count} Guests
                            </p>
                            {enq.details && (
                              <p className="text-xs text-neutral-400 italic mt-2 bg-black/40 p-2.5 rounded-lg border border-neutral-800">"{enq.details}"</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-xs text-neutral-400">
                              <span className="block font-medium text-neutral-200">📞 {enq.phone}</span>
                              <span>✉️ {enq.email}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteEnquiry(enq.id)}
                              className="p-2 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 hover:bg-red-900 transition-colors cursor-pointer"
                              title="Delete Enquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7. SETTINGS TAB */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cinzel text-xl font-bold text-white">Business Settings</h4>
                      <p className="text-xs text-neutral-400">Synced directly with PostgreSQL database 'business_settings'.</p>
                    </div>
                    {settingsSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Saved Successfully
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Venue Name</label>
                      <input
                        type="text"
                        value={businessSettings.name}
                        onChange={e => setBusinessSettings({ ...businessSettings, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Official Address</label>
                      <input
                        type="text"
                        value={businessSettings.address}
                        onChange={e => setBusinessSettings({ ...businessSettings, address: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Official Phone</label>
                      <input
                        type="text"
                        value={businessSettings.phone}
                        onChange={e => setBusinessSettings({ ...businessSettings, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={businessSettings.instagram}
                        onChange={e => setBusinessSettings({ ...businessSettings, instagram: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 uppercase mb-1">TikTok URL</label>
                      <input
                        type="text"
                        value={businessSettings.tiktok}
                        onChange={e => setBusinessSettings({ ...businessSettings, tiktok: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-sm focus:outline-none focus:border-[#bf953f]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#bf953f] via-[#d4af37] to-[#aa771c] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-[#bf953f]/30 transition-all"
                      >
                        <Save className="w-4 h-4" /> Save Business Settings
                      </button>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
