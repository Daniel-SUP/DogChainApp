// Generated visual assets
import driverSpecialistImg from '../assets/images/driver_pet_specialist_1791222745212.jpg';

export const TARIFFS = [
  {
    id: 'small',
    title: 'Маленький пес',
    sub: '1 щенок или кошка до 12 кг',
    features: 'Шлейка безопасности',
    carType: 'Седан',
    etaMin: 4,
    priceByn: 18.5,
    isPopular: false,
  },
  {
    id: 'standard',
    title: 'Стандарт Зоо',
    sub: 'Питомцы до 35 кг',
    features: 'Свежая вода',
    carType: 'Кроссовер / Универсал',
    etaMin: 3,
    priceByn: 26.0,
    isPopular: true,
  },
  {
    id: 'xl',
    title: 'Зоо XL',
    sub: 'Крупные породы до 70 кг',
    features: 'Просторный бокс / багажный отсек',
    carType: 'Минивэн',
    etaMin: 6,
    priceByn: 36.5,
    isPopular: false,
  },
];

export const BREST_LOCATIONS = [
  {
    id: 'vet-1',
    name: 'Ветклиника «Айболит»',
    address: 'ул. Московская, 326 (Брест-Восток)',
    category: 'vet',
    coords: [52.1009, 23.7431],
  },
  {
    id: 'vet-2',
    name: 'Ветклиника «ВетМедСервис»',
    address: 'ул. Гоголя, 71 (Центр)',
    category: 'vet',
    coords: [52.0912, 23.6991],
  },
  {
    id: 'vet-3',
    name: 'Ветцентр «Доктор Вет»',
    address: 'Варшавское шоссе, 11 (Юго-Запад)',
    category: 'vet',
    coords: [52.0768, 23.7082],
  },
  {
    id: 'pickup-1',
    name: 'ул. Советская, 42',
    address: 'ул. Советская, 42 (Центр, пешеходная)',
    category: 'home',
    coords: [52.0975, 23.6877],
  },
  {
    id: 'pickup-2',
    name: 'пр-т Машерова, 50',
    address: 'пр-т Машерова, 50 (Возле ЦУМа)',
    category: 'home',
    coords: [52.0886, 23.7042],
  },
  {
    id: 'park-1',
    name: 'Брестский Парк культуры (Зона выгула)',
    address: 'ул. Ленина, 3 (Парк 1 Мая)',
    category: 'park',
    coords: [52.0945, 23.6789],
  },
  {
    id: 'fortress',
    name: 'Мемориал «Брестская крепость»',
    address: 'ул. Героев обороны',
    category: 'landmark',
    coords: [52.0833, 23.6552],
  },
];

export const MOCK_DRIVER = {
  name: 'Александр Ковальчук',
  rating: 4.98,
  completedRides: 1480,
  carModel: 'Škoda Kodiaq 4x4 (Pet Edition)',
  licensePlate: '7 TAX 4129',
  photoUrl: driverSpecialistImg,
  phone: '+375 (29) 723-44-12',
  cprCertified: true,
};
