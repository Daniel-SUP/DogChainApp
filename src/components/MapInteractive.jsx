import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Compass, Navigation, MapPin, X, Check } from 'lucide-react';
import { reverseGeocode } from '../utils/geocoding.js';

/* =========================================================================
   КАСТОМНЫЕ МАРКЕРЫ (L.divIcon / L.icon)
   ========================================================================= */

// 1. Маркер точки подачи (Точка А)
export const createStartIcon = () =>
  L.divIcon({
    className: 'custom-start-marker',
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(16, 185, 129, 0.3); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: absolute; width: 18px; height: 18px; border-radius: 50%; background: #10b981; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

// 2. Маркер клиники / назначения (Точка Б)
export const createFinishIcon = () =>
  L.divIcon({
    className: 'custom-finish-marker',
    html: `
      <div style="background: #ffffff; border: 2.5px solid #c2652a; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(0,0,0,0.25);">
        <span style="color: #c2652a; font-weight: 900; font-size: 15px; line-height: 1;">✚</span>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

// 3. Маркер зоотакси на маршруте
export const createCarIcon = () =>
  L.divIcon({
    className: 'custom-car-marker',
    html: `
      <div style="background: #c2652a; border: 2px solid #ffffff; border-radius: 10px; width: 32px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(194, 101, 42, 0.45);">
        <span style="font-size: 13px;">🚗</span>
      </div>
    `,
    iconSize: [32, 26],
    iconAnchor: [16, 13],
  });

/**
 * Внутренний компонент OSRM роутинга с динамическими координатами
 */
function DynamicRoutingMachine({
  pickupCoords,
  destinationCoords,
  onRouteSummaryUpdate,
  setCarCoordinates,
}) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !pickupCoords || !destinationCoords) return;

    const startLatLng = L.latLng(pickupCoords[0], pickupCoords[1]);
    const finishLatLng = L.latLng(destinationCoords[0], destinationCoords[1]);

    if (routingControlRef.current) {
      try {
        routingControlRef.current.setWaypoints([startLatLng, finishLatLng]);
        return;
      } catch (err) {
        console.warn('Error setting waypoints, recreating routing control:', err);
      }
    }

    const routingControl = L.Routing.control({
      waypoints: [startLatLng, finishLatLng],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [
          { color: '#7a320d', weight: 7, opacity: 0.25 },
          { color: '#c2652a', weight: 5, opacity: 0.95 },
        ],
      },
      addWaypoints: false,
      draggableWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: function (i, wp) {
        if (i === 0) {
          return L.marker(wp.latLng, {
            icon: createStartIcon(),
            draggable: false,
          });
        }
        return L.marker(wp.latLng, {
          icon: createFinishIcon(),
          draggable: false,
        });
      },
    }).addTo(map);

    routingControlRef.current = routingControl;

    routingControl.on('routesfound', (e) => {
      try {
        const routes = e.routes;
        if (routes && routes.length > 0) {
          const summary = routes[0].summary;
          const durationMin = Math.max(1, Math.round(summary.totalTime / 60));
          const distanceKm = (summary.totalDistance / 1000).toFixed(1);

          onRouteSummaryUpdate({
            durationMin,
            distanceKm,
          });

          if (routes[0].coordinates && routes[0].coordinates.length > 0) {
            const coords = routes[0].coordinates;
            const midIndex = Math.floor(coords.length * 0.35);
            setCarCoordinates([coords[midIndex].lat, coords[midIndex].lng]);
          }
        }
      } catch (err) {
        console.warn('Error handling routesfound:', err);
      }
    });

    routingControl.on('routingerror', () => {
      const R = 6371;
      const dLat = ((destinationCoords[0] - pickupCoords[0]) * Math.PI) / 180;
      const dLon = ((destinationCoords[1] - pickupCoords[1]) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((pickupCoords[0] * Math.PI) / 180) *
          Math.cos((destinationCoords[0] * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = (R * c * 1.3).toFixed(1);
      const time = Math.max(2, Math.round(dist * 1.5));

      onRouteSummaryUpdate({
        durationMin: time,
        distanceKm: dist,
      });
    });

    return () => {
      try {
        if (routingControl && map) {
          map.removeControl(routingControl);
          routingControlRef.current = null;
        }
      } catch (e) {
        // cleanup safe
      }
    };
  }, [map, pickupCoords, destinationCoords]);

  return null;
}

/**
 * Обработчик кликов по карте: активен ТОЛЬКО при выборе адреса на карте
 */
function MapClickHandler({ isPickingActive, onMapClick }) {
  useMapEvents({
    click(e) {
      if (isPickingActive) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

/**
 * Маркер автомобиля такси на маршруте
 */
function CarMarker({ position }) {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !position) return;
    if (!markerRef.current) {
      markerRef.current = L.marker(position, {
        icon: createCarIcon(),
        interactive: false,
      }).addTo(map);
    } else {
      markerRef.current.setLatLng(position);
    }

    return () => {
      if (markerRef.current && map) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [map, position]);

  return null;
}

/**
 * Кнопки управления положением карты
 */
function MapControls({ pickupCoords, destinationCoords }) {
  const map = useMap();

  return (
    <div className="absolute right-3 top-3 flex flex-col gap-2 z-[400]">
      <button
        type="button"
        onClick={() => {
          if (pickupCoords && destinationCoords) {
            map.fitBounds([pickupCoords, destinationCoords], { padding: [50, 50] });
          }
        }}
        title="Сфокусировать маршрут"
        className="w-9 h-9 rounded-full bg-white/95 text-[#5e5145] hover:text-[#c2652a] shadow-md border border-[#e8ded2] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
      >
        <Compass className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => {
          if (pickupCoords) {
            map.setView(pickupCoords, 14);
          }
        }}
        title="К точке подачи"
        className="w-9 h-9 rounded-full bg-white/95 text-[#5e5145] hover:text-[#c2652a] shadow-md border border-[#e8ded2] flex items-center justify-center transition-all active:scale-95 cursor-pointer"
      >
        <Navigation className="w-4 h-4" />
      </button>
    </div>
  );
}

/**
 * Главный интерактивный компонент карты
 */
export function MapInteractive({
  pickupLocation,
  destinationLocation,
  pickupCoords = [52.0975, 23.6877],
  destinationCoords = [52.1009, 23.7431],
  mapPickingTarget = null, // null | 'pickup' | 'destination'
  onCancelMapPicking,
  onPointSelectedOnMap,
  availableDriversCount = 3,
  onRouteCalculated,
}) {
  const [routeInfo, setRouteInfo] = useState({
    durationMin: 3,
    distanceKm: '3.8',
  });

  const [carCoordinates, setCarCoordinates] = useState([52.0988, 23.705]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleRouteSummaryUpdate = (summary) => {
    setRouteInfo(summary);
    if (onRouteCalculated) {
      onRouteCalculated(summary);
    }
  };

  // Клик по карте срабатывает ТОЛЬКО когда активен режим выбора (mapPickingTarget !== null)
  const handleMapClick = async (latlng) => {
    if (!mapPickingTarget) return;

    setIsGeocoding(true);
    const lat = latlng.lat;
    const lon = latlng.lng;

    // Получаем адрес через Nominatim Reverse Geocoding
    const textAddress = await reverseGeocode(lat, lon);

    if (onPointSelectedOnMap) {
      onPointSelectedOnMap({
        type: mapPickingTarget,
        coords: [lat, lon],
        address: textAddress,
      });
    }

    setIsGeocoding(false);
  };

  const isPickingActive = mapPickingTarget !== null;

  return (
    <div
      className={`relative w-full h-[370px] sm:h-[400px] overflow-hidden bg-[#faf5ee] select-none border-b border-[#ded1bf] ${
        isPickingActive ? 'cursor-crosshair ring-2 ring-inset ring-[#c2652a]' : ''
      }`}
    >
      {/* Карта Leaflet */}
      <MapContainer
        center={[
          (pickupCoords[0] + destinationCoords[0]) / 2,
          (pickupCoords[1] + destinationCoords[1]) / 2,
        ]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={true}
        className="w-full h-full"
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Обработчик клика: активен ТОЛЬКО при выборе точки */}
        <MapClickHandler
          isPickingActive={isPickingActive}
          onMapClick={handleMapClick}
        />

        {/* Динамический OSRM роутер */}
        <DynamicRoutingMachine
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
          onRouteSummaryUpdate={handleRouteSummaryUpdate}
          setCarCoordinates={setCarCoordinates}
        />

        <CarMarker position={carCoordinates} />

        <MapControls
          pickupCoords={pickupCoords}
          destinationCoords={destinationCoords}
        />
      </MapContainer>

      {/* Оранжевая плашка времени подачи (связанная с OSRM) */}
      <div className="absolute left-4 top-4 z-[400] pointer-events-none">
        <div className="flex items-center gap-1.5 bg-[#c2652a] text-white px-3.5 py-1.5 rounded-xl shadow-lg text-xs font-semibold whitespace-nowrap">
          <span className="text-sm">🐾</span>
          <span>Подача через {routeInfo.durationMin} мин</span>
          <span className="opacity-80 text-[10px] ml-0.5">({routeInfo.distanceKm} км)</span>
        </div>
      </div>

      {/* БАННЕР РЕЖИМА ВЫБОРА ТОЧКИ НА КАРТЕ: виден ТОЛЬКО когда пользователь выбрал изменить адрес на карте */}
      {isPickingActive ? (
        <div className="absolute left-1/2 -translate-x-1/2 top-4 z-[400] w-[92%] max-w-sm">
          <div
            className={`flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
              mapPickingTarget === 'pickup'
                ? 'bg-emerald-950/90 text-white border-emerald-500'
                : 'bg-[#401e0a]/90 text-white border-[#c2652a]'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping shrink-0" />
              <div className="text-xs font-bold truncate">
                {isGeocoding
                  ? 'Сохраняем адрес точки...'
                  : mapPickingTarget === 'pickup'
                  ? 'Кликните на карту: Точка подачи (А)'
                  : 'Кликните на карту: Место назначения (Б)'}
              </div>
            </div>
            <button
              type="button"
              onClick={onCancelMapPicking}
              className="px-2 py-1 bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : null}

      {/* Нижняя информационная плашка: статус водителей в Бресте */}
      <div className="absolute left-4 bottom-7 z-[400] pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#e2d5c4] shadow-md text-xs font-medium text-[#4a3e35]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{availableDriversCount} сертифицированных водителя в Бресте</span>
        </div>
      </div>
    </div>
  );
}
