import React, { useEffect, useState } from 'react';
import { Header } from './components/Header.jsx';
import { MapInteractive } from './components/MapInteractive.jsx';
import { BookingSheet } from './components/BookingSheet.jsx';
import { SwitchPetModal } from './components/SwitchPetModal.jsx';
import { AddressPickerModal } from './components/AddressPickerModal.jsx';
import { ScheduleModal } from './components/ScheduleModal.jsx';
import { AddStopModal } from './components/AddStopModal.jsx';
import { ClimateInfoModal } from './components/ClimateInfoModal.jsx';
import { ActiveRideModal } from './components/ActiveRideModal.jsx';
import { PaymentModal } from './components/PaymentModal.jsx';
import { RegionSelectorModal } from './components/RegionSelectorModal.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { ActivityTab } from './components/ActivityTab.jsx';
import { PetsTab } from './components/PetsTab.jsx';
import { AccountTab } from './components/AccountTab.jsx';
import { AuthScreen } from './components/AuthScreen.jsx';

import { TARIFFS } from './data/mockData.js';
import { forwardGeocode } from './utils/geocoding.js';

export default function App() {
  // Navigation & Screen tab
  const [activeTab, setActiveTab] = useState('rides');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((response) => response.json())
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  // Region state (Only Brest available)
  const [selectedRegion, setSelectedRegion] = useState('г. Брест');
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // Pet state
  const [pets, setPets] = useState([]);
  const [activePet, setActivePet] = useState(null);
  const [petsLoadError, setPetsLoadError] = useState('');
  const [rides, setRides] = useState([]);
  const [ridesLoadError, setRidesLoadError] = useState('');

  useEffect(() => {
    if (!user) {
      setPets([]);
      setActivePet(null);
      return undefined;
    }

    setPetsLoadError('');
    let cancelled = false;

    fetch('/api/pets', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Не удалось загрузить питомцев из базы.');
        return response.json();
      })
      .then((savedPets) => {
        if (cancelled || !Array.isArray(savedPets)) return;
        const normalizedPets = savedPets.map((pet) => ({
          ...pet,
          category: pet.category || pet.species || 'Питомец',
          weightKg: pet.weightKg ?? 0,
          heightCm: pet.heightCm ?? 0,
          tempMin: pet.tempMin ?? 18,
          tempMax: pet.tempMax ?? 22,
        }));
        setPets(normalizedPets);
        setActivePet((current) => normalizedPets.find((pet) => pet.id === current?.id) || normalizedPets[0] || null);
      })
      .catch((error) => {
        if (!cancelled) setPetsLoadError(error.message);
      });

    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setRides([]);
      setRidesLoadError('');
      return undefined;
    }
    let cancelled = false;
    fetch('/api/orders', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Не удалось загрузить чеки поездок.');
        return response.json();
      })
      .then((orders) => {
        if (cancelled || !Array.isArray(orders)) return;
        const normalized = orders.map((order) => {
          let details = {};
          try { details = JSON.parse(order.description); } catch { details = { note: order.description }; }
          return { ...details, id: order.id, dbId: order.id, petName: details.petName || order.pet_name, status: order.status, createdAt: order.created_at };
        });
        setRides(normalized);
      })
      .catch((error) => { if (!cancelled) setRidesLoadError(error.message); });
    return () => { cancelled = true; };
  }, [user]);

  const handleAddNewPet = async (newPet) => {
    const response = await fetch('/api/pets', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPet),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Не удалось сохранить питомца.');

    const savedPet = {
      ...newPet,
      id: result.id,
    };
    setPets((current) => [...current, savedPet]);
    return savedPet;
  };

  const handleUpdatePet = async (updatedPet) => {
    const response = await fetch('/api/pets', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPet),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Не удалось изменить питомца.');
    const savedPet = { ...updatedPet };
    setPets((current) => current.map((pet) => pet.id === savedPet.id ? savedPet : pet));
    setActivePet((current) => current?.id === savedPet.id ? savedPet : current);
    return savedPet;
  };

  const handleDeletePet = async (pet) => {
    if (!window.confirm(`Удалить профиль питомца «${pet.name}»?`)) return;
    try {
      const response = await fetch(`/api/pets?id=${encodeURIComponent(pet.id)}`, {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Не удалось удалить питомца.');
      const remainingPets = pets.filter((item) => item.id !== pet.id);
      setPets(remainingPets);
      setActivePet((current) => current?.id === pet.id ? (remainingPets[0] || null) : current);
    } catch (error) {
      setPetsLoadError(error.message || 'Не удалось удалить питомца.');
    }
  };

  const handleCompleteRide = async (ride) => {
    if (!activePet?.id) {
      const localRide = { ...ride, id: `demo-${Date.now()}`, status: 'completed' };
      setRides((current) => [localRide, ...current]);
      return localRide;
    }
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pet_id: Number(activePet.id), description: JSON.stringify(ride), status: 'completed' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Не удалось сохранить чек.');
      const savedRide = { ...ride, id: result.id, dbId: result.id, status: 'completed' };
      setRides((current) => [savedRide, ...current]);
      setRidesLoadError('');
      return savedRide;
    } catch (error) {
      setRidesLoadError(`${error.message} Чек останется доступен до перезагрузки страницы.`);
      const localRide = { ...ride, id: `demo-${Date.now()}`, status: 'completed' };
      setRides((current) => [localRide, ...current]);
      return localRide;
    }
  };

  const handleRateRide = async (ride) => {
    const savedRide = { ...ride, status: 'completed' };
    if (ride.dbId) {
      try {
        const response = await fetch('/api/orders', {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: ride.dbId, description: JSON.stringify(savedRide) }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Не удалось сохранить оценку.');
      } catch (error) {
        setRidesLoadError(error.message);
      }
    }
    setRides((current) => current.map((item) => item.id === savedRide.id ? savedRide : item));
    return savedRide;
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
    } finally {
      setUser(null);
      setPets([]);
      setActivePet(null);
    }
  };

  // Tariffs & selection
  const [tariffs] = useState(TARIFFS);
  const [selectedTariff, setSelectedTariff] = useState(TARIFFS[1]);

  // Dynamic Route Coordinates & Addresses in Brest
  // Point A: ул. Советская, 42, Брест [52.0975, 23.6877]
  const [pickupAddress, setPickupAddress] = useState('ул. Советская, 42');
  const [pickupCoords, setPickupCoords] = useState([52.0975, 23.6877]);

  // Point B: Ветклиника «Айболит», ул. Московская, 326 [52.1009, 23.7431]
  const [destinationAddress, setDestinationAddress] = useState(
    'Ветклиника «Айболит», ул. Московская, 326'
  );
  const [destinationCoords, setDestinationCoords] = useState([52.1009, 23.7431]);

  // Режим выбора точки кликом по карте (активен только когда пользователь нажал "Указать на карте")
  // null | 'pickup' | 'destination'
  const [mapPickingTarget, setMapPickingTarget] = useState(null);

  const [additionalStops, setAdditionalStops] = useState([]);
  const [editingStopIndex, setEditingStopIndex] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');

  // Payment methods state (Cards & Cash)
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'cash-driver',
      type: 'cash',
      title: 'Наличные водителю',
      subtitle: 'Оплата белорусскими рублями (Br) при посадке',
      isDefault: false,
    },
  ]);
  const [selectedPaymentId, setSelectedPaymentId] = useState('cash-driver');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Modals state
  const [isSwitchPetOpen, setIsSwitchPetOpen] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [isAddressPickerOpen, setIsAddressPickerOpen] = useState(false);
  const [addressPickerType, setAddressPickerType] = useState('pickup');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [isClimateInfoOpen, setIsClimateInfoOpen] = useState(false);
  const [isActiveRideOpen, setIsActiveRideOpen] = useState(false);

  // Address picker trigger
  const handleOpenAddressPicker = (type) => {
    setAddressPickerType(type);
    setIsAddressPickerOpen(true);
  };

  // Called when user selects an address from AddressPickerModal
  const handleSelectAddress = async (address, coords) => {
    let resolvedCoords = coords;
    if (!resolvedCoords) {
      resolvedCoords = await forwardGeocode(address);
    }

    if (addressPickerType === 'pickup') {
      setPickupAddress(address);
      if (resolvedCoords) setPickupCoords(resolvedCoords);
    } else {
      setDestinationAddress(address);
      if (resolvedCoords) setDestinationCoords(resolvedCoords);
    }
  };

  // Called when user clicks "Указать на карте" in AddressPickerModal
  const handleSelectOnMap = (targetType) => {
    setMapPickingTarget(targetType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when a point is clicked on the map in picking mode
  const handlePointSelectedOnMap = ({ type, coords, address }) => {
    if (type === 'pickup') {
      setPickupAddress(address);
      setPickupCoords(coords);
    } else {
      setDestinationAddress(address);
      setDestinationCoords(coords);
    }
    // Выходим из режима выбора точки после клика
    setMapPickingTarget(null);
  };

  const handleCancelMapPicking = () => {
    setMapPickingTarget(null);
  };

  // Swap pickup & destination
  const handleSwapAddresses = () => {
    const tempAddr = pickupAddress;
    const tempCoords = pickupCoords;

    setPickupAddress(destinationAddress);
    setPickupCoords(destinationCoords);

    setDestinationAddress(tempAddr);
    setDestinationCoords(tempCoords);
  };

  // Stop handlers
  const handleOpenAddStop = () => {
    setEditingStopIndex(null);
    setIsAddStopOpen(true);
  };

  const handleOpenEditStop = (index) => {
    setEditingStopIndex(index);
    setIsAddStopOpen(true);
  };

  const handleSaveStop = (address, index) => {
    if (index !== null && index !== undefined) {
      setAdditionalStops((prev) => {
        const copy = [...prev];
        copy[index] = address;
        return copy;
      });
    } else {
      setAdditionalStops((prev) => [...prev, address]);
    }
    setEditingStopIndex(null);
  };

  const handleDeleteStop = (indexToDelete) => {
    setAdditionalStops((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // Payment handlers
  const handleAddCard = (newCard) => {
    setPaymentMethods((prev) => [newCard, ...prev]);
  };

  const handleDeleteCard = (cardId) => {
    setPaymentMethods((prev) => prev.filter((p) => p.id !== cardId));
    if (selectedPaymentId === cardId) {
      setSelectedPaymentId('cash-driver');
    }
  };

  const selectedPaymentMethod =
    paymentMethods.find((p) => p.id === selectedPaymentId) || paymentMethods[0];

  // Order ride trigger
  const handleOrderRide = () => {
    setIsActiveRideOpen(true);
  };

  if (authLoading) {
    return <main className="min-h-screen bg-[#f4ede3] flex items-center justify-center text-[#7d6e61]">Загрузка…</main>;
  }
  if (!user) return <AuthScreen onAuthenticated={setUser} />;

  return (
    <div className="min-h-screen bg-[#f4ede3] flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-[#faf5ee] shadow-2xl relative flex flex-col justify-between">
        {/* Sahara Luxury Top Bar with Region Selector */}
        <Header
          onOpenClimateInfo={() => setIsClimateInfoOpen(true)}
          onOpenPetProfile={() => setIsSwitchPetOpen(true)}
          onOpenRegionSelector={() => setIsRegionModalOpen(true)}
          activePet={activePet}
          cityArea={selectedRegion}
        />

        {/* Tab 1: Rides (Main screen) */}
        {activeTab === 'rides' && (
          <main className="flex-1 pb-28">
            {/* Interactive OpenStreetMap with Controlled Point Selection */}
            <MapInteractive
              pickupLocation={pickupAddress}
              destinationLocation={destinationAddress}
              pickupCoords={pickupCoords}
              destinationCoords={destinationCoords}
              mapPickingTarget={mapPickingTarget}
              onCancelMapPicking={handleCancelMapPicking}
              onPointSelectedOnMap={handlePointSelectedOnMap}
              availableDriversCount={3}
            />

            {/* Booking Sheet */}
            <BookingSheet
              activePet={activePet}
              tariffs={tariffs}
              selectedTariff={selectedTariff}
              onSelectTariff={setSelectedTariff}
              onOpenSwitchPet={() => setIsSwitchPetOpen(true)}
              onOpenSchedule={() => setIsScheduleOpen(true)}
              onOpenAddStop={handleOpenAddStop}
              onEditStop={handleOpenEditStop}
              onDeleteStop={handleDeleteStop}
              onOpenAddressPicker={handleOpenAddressPicker}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              selectedPaymentMethod={selectedPaymentMethod}
              onOrderRide={handleOrderRide}
              pickupAddress={pickupAddress}
              destinationAddress={destinationAddress}
              onSwapAddresses={handleSwapAddresses}
              scheduledTime={scheduledTime}
              additionalStops={additionalStops}
            />
          </main>
        )}

        {/* Tab 2: Activity */}
        {activeTab === 'activity' && (
          <main className="flex-1">
            <ActivityTab rides={rides} error={ridesLoadError} />
          </main>
        )}

        {/* Tab 3: Saved Pets */}
        {activeTab === 'pets' && (
          <main className="flex-1">
            {petsLoadError && <p role="alert" className="mx-4 mt-3 text-sm text-red-700">{petsLoadError}</p>}
            <PetsTab
              pets={pets}
              activePet={activePet}
              onSelectPet={setActivePet}
              onOpenAddNew={() => { setEditingPet(null); setIsSwitchPetOpen(true); }}
              onEditPet={(pet) => { setEditingPet(pet); setIsSwitchPetOpen(true); }}
              onDeletePet={handleDeletePet}
            />
          </main>
        )}

        {/* Tab 4: Account & Safety Standards */}
        {activeTab === 'account' && (
          <main className="flex-1">
            <AccountTab
              user={user}
              onLogout={handleLogout}
              paymentMethods={paymentMethods}
              selectedPaymentId={selectedPaymentId}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              selectedRegion={selectedRegion}
            />
          </main>
        )}

        {/* Fixed Bottom Navigation (4 tabs) */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Payment Methods Modal (Cards & Cash) */}
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          paymentMethods={paymentMethods}
          selectedPaymentId={selectedPaymentId}
          onSelectPayment={(id) => {
            setSelectedPaymentId(id);
            setIsPaymentModalOpen(false);
          }}
          onAddCard={handleAddCard}
          onDeleteCard={handleDeleteCard}
        />

        {/* Region Selector Modal (Only Brest active) */}
        <RegionSelectorModal
          isOpen={isRegionModalOpen}
          onClose={() => setIsRegionModalOpen(false)}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Intermediate Stop Modal (Add & Edit) */}
        <AddStopModal
          isOpen={isAddStopOpen}
          onClose={() => {
            setIsAddStopOpen(false);
            setEditingStopIndex(null);
          }}
          onSaveStop={handleSaveStop}
          editingIndex={editingStopIndex}
          initialAddress={
            editingStopIndex !== null ? additionalStops[editingStopIndex] : ''
          }
        />

        {/* Address Picker Modal with "Указать на карте" button */}
        <AddressPickerModal
          isOpen={isAddressPickerOpen}
          onClose={() => setIsAddressPickerOpen(false)}
          type={addressPickerType}
          currentAddress={
            addressPickerType === 'pickup' ? pickupAddress : destinationAddress
          }
          onSelectAddress={handleSelectAddress}
          onSelectOnMap={handleSelectOnMap}
        />

        {/* Other Modals */}
        <SwitchPetModal
          isOpen={isSwitchPetOpen}
          onClose={() => { setIsSwitchPetOpen(false); setEditingPet(null); }}
          pets={pets}
          activePet={activePet}
          onSelectPet={setActivePet}
          onAddNewPet={handleAddNewPet}
          onUpdatePet={handleUpdatePet}
          initialPet={editingPet}
        />

        <ScheduleModal
          isOpen={isScheduleOpen}
          onClose={() => setIsScheduleOpen(false)}
          onSchedule={setScheduledTime}
        />

        <ClimateInfoModal
          isOpen={isClimateInfoOpen}
          onClose={() => setIsClimateInfoOpen(false)}
        />

        <ActiveRideModal
          isOpen={isActiveRideOpen}
          onClose={() => setIsActiveRideOpen(false)}
          onCompleteRide={handleCompleteRide}
          onRateRide={handleRateRide}
          onViewReceipt={() => setActiveTab('activity')}
          pickup={pickupAddress}
          destination={destinationAddress}
          pet={activePet}
          tariff={selectedTariff}
          price={Math.max(10, selectedTariff.priceByn - 5)}
          paymentMethod={selectedPaymentMethod?.title}
        />
      </div>
    </div>
  );
}
