import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import MenuSection from './components/MenuSection';
import ExperienceSection from './components/ExperienceSection';
import GallerySection from './components/GallerySection';
import EventsSection from './components/EventsSection';
import LocationContact from './components/LocationContact';
import ReservationModal from './components/ReservationModal';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import { Reservation } from './types';
import { fetchReservations, updateReservationStatus, deleteReservation } from './lib/korogbaService';

export default function App() {
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetchReservations().then(data => {
      if (data) {
        setReservations(data);
      }
    });
  }, []);

  const handleAddReservation = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);
  };

  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'declined' | 'cancelled' | 'pending') => {
    const res = await updateReservationStatus(id, newStatus);
    if (res.success) {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } else {
      console.error('Failed to update reservation status in Supabase:', res.error);
    }
  };

  const handleDeleteReservation = async (id: string) => {
    const res = await deleteReservation(id);
    if (res.success) {
      setReservations(prev => prev.filter(r => r.id !== id));
    } else {
      console.error('Failed to delete reservation in Supabase:', res.error);
    }
  };

  const handleExploreMenu = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0e] text-[#f1f1f5] selection:bg-[#bf953f] selection:text-black">
      {/* Navbar */}
      <Navbar
        onOpenReservation={() => setReservationModalOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onOpenReservation={() => setReservationModalOpen(true)}
        onExploreMenu={handleExploreMenu}
      />

      {/* Brand Story & Zones */}
      <Story />

      {/* Curated Menu */}
      <MenuSection />

      {/* Experience Pillars */}
      <ExperienceSection />

      {/* Visual Gallery */}
      <GallerySection />

      {/* Events & Private Booking */}
      <EventsSection />

      {/* Location, Hours & Contact */}
      <LocationContact />

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <ReservationModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        onAddReservation={handleAddReservation}
      />

      <AdminPortal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        reservations={reservations}
        onUpdateStatus={handleUpdateStatus}
        onDeleteReservation={handleDeleteReservation}
      />
    </div>
  );
}
