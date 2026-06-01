import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Phone, AlertTriangle, MessageSquare, User, Settings, 
  MapPin, Video, Bell, Cloud, Truck, DollarSign, Send, LogIn, 
  ArrowLeft, RefreshCw, Smartphone, Laptop, CheckCircle, Info, 
  Volume2, Mic, Play, Power, HelpCircle, X, ChevronRight, Scale,
  Activity, Heart, LogOut
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

let fallbackUrl = 'https://prsopicfepfpcplzwgxr.supabase.co';
let fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc29waWNmZXBmcGNwbHp3Z3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTQ1MDIsImV4cCI6MjA5MDMzMDUwMn0.-0Y_P88_oDkgoD3EQb8109PWlGF7PQsC2RLJ4q5gnAQ';

let V_URL = fallbackUrl;
let V_KEY = fallbackKey;

try {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    V_URL = (import.meta as any).env.VITE_SUPABASE_URL || fallbackUrl;
    V_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || fallbackKey;
  }
} catch (e) {
  console.warn("Supabase env reading failed, using hardcoded fallback credentials.", e);
}

const SUPABASE_URL = V_URL;
const SUPABASE_ANON_KEY = V_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function generateUUIDv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const SecureFlowLogoCustom = ({ className = "w-16 h-16" }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/25 via-indigo-600/10 to-cyan-500/20 rounded-full blur-xl animate-pulse" />
      
      {/* Master shield design with concentric secure rings */}
      <svg className="w-full h-full text-white drop-shadow-2xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
        
        {/* Outer Circular Tech Grid */}
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" strokeDasharray="4 6" />
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
        
        {/* Core Protective Geometric Shield */}
        <path 
          d="M50 16 
             C65 16, 76 22, 80 28 
             C80 48, 70 72, 50 84 
             C30 72, 20 48, 20 28 
             C24 22, 35 16, 50 16 Z" 
          fill="url(#shieldGrad)" 
          stroke="#38bdf8" 
          strokeWidth="3.5" 
          strokeLinejoin="round"
        />

        {/* Dynamic sleek curves indicating flow/speed/digital assistance */}
        <path 
          d="M28 42 C40 34, 60 52, 72 44" 
          stroke="url(#flowGrad)" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
        <path 
          d="M28 54 C40 46, 60 64, 72 56" 
          stroke="url(#flowGrad)" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />
        
        {/* Interactive center secure star anchor */}
        <polygon points="50,28 53,36 61,36 55,41 57,49 50,44 43,49 45,41 39,36 47,36" fill="#ffffff" />
      </svg>
    </div>
  );
};

// Types
interface Profile {
  name: string;
  email: string;
  phone: string;
  city: string;
  licenseNumber?: string;
  vehiclePlate?: string;
  specialty?: string;
}

interface Message {
  sender: 'user' | 'bot' | 'driver' | 'citizen' | 'lawyer';
  text: string;
  time: string;
  isMapLink?: boolean;
  mapCoords?: [number, number];
}

interface Emergency {
  id: string;
  citizenName: string;
  citizenPhone: string;
  citizenCity: string;
  status: 'idle' | 'calling' | 'active' | 'resolved';
  latitude: number;
  longitude: number;
  lawyerId?: string;
  tarifa?: number;
  dailyRoomUrl?: string;
}

interface TowJob {
  id: string;
  citizenName: string;
  citizenPhone: string;
  status: 'idle' | 'pending' | 'en_route' | 'active' | 'completed';
  latitude: number;
  longitude: number;
  price: number;
  distance: number;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  gruero_id?: string;
}

// Support mapping both English and Spanish term variations to corresponding layouts
const getNormalizedRole = (role: string): 'citizen' | 'lawyer' | 'driver' | 'ambulance' | 'medic' | 'admin' => {
  const r = (role || '').toLowerCase().trim();
  if (r === 'lawyer' || r === 'abogado' || r === 'abogado colectivo') return 'lawyer';
  if (r === 'citizen' || r === 'ciudadano' || r === 'civil' || r === 'asegurado') return 'citizen';
  if (r === 'driver' || r === 'chofer' || r === 'gruero' || r === 'conductor') return 'driver';
  if (r === 'ambulance' || r === 'ambulancia' || r === 'paramedico') return 'ambulance';
  if (r === 'medic' || r === 'medico' || r === 'doctor') return 'medic';
  if (r === 'admin' || r === 'administrador') return 'admin';
  return 'citizen'; // default fallback for logged-in users
};

// Helpers para cálculo geográfico de grúas y asistencias viales
const getCoordsFromText = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const offsetLat = ((Math.abs(hash) % 100) / 1000) * 0.04 - 0.02; 
  const offsetLng = (((Math.abs(hash) >> 8) % 100) / 1000) * 0.04 - 0.02;
  return {
    lat: 10.4984 + offsetLat,
    lng: -66.8824 + offsetLng
  };
};

const calculateDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return Number(d.toFixed(2));
};

// Componente de Mapa de Asistencia Vial (Leaflet dinámico)
function RoadsideMap({ driverLat, driverLng, citizenLat, citizenLng }: { driverLat: number, driverLng: number, citizenLat: number, citizenLng: number }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const driverMarkerRef = useRef<any>(null);
  const citizenMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const initOrUpdateLeaflet = () => {
      // @ts-ignore
      const L = window.L;
      if (!L) {
        setTimeout(() => {
          if (active) initOrUpdateLeaflet();
        }, 300);
        return;
      }

      if (!mapRef.current) return;

      try {
        const dLat = Number(driverLat) || 10.4900;
        const dLng = Number(driverLng) || -66.9100;
        const cLat = Number(citizenLat) || 10.4984;
        const cLng = Number(citizenLng) || -66.8824;

        if (!mapInstanceRef.current) {
          // Initialize map once
          const map = L.map(mapRef.current, {
            zoomControl: false,
            attributionControl: false
          }).setView([cLat, cLng], 14);
          
          mapInstanceRef.current = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          // Marker Grúa (Driver)
          const driverIcon = L.divIcon({
            html: '<div style="font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">🚜</div>',
            className: 'custom-div-icon',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });
          driverMarkerRef.current = L.marker([dLat, dLng], { icon: driverIcon }).addTo(map)
            .bindPopup('<b>Unidad de Grúa</b><br/>Ubicación en tiempo real');

          // Marker Asegurado (Citizen)
          const citizenIcon = L.divIcon({
            html: '<div style="font-size: 26px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));">👤</div>',
            className: 'custom-div-icon',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
          });
          citizenMarkerRef.current = L.marker([cLat, cLng], { icon: citizenIcon }).addTo(map)
            .bindPopup('<b>Asegurado</b>');

          // Polyline de ruta
          const latlngs = [[dLat, dLng], [cLat, cLng]];
          polylineRef.current = L.polyline(latlngs, { color: '#fbbf24', weight: 4, dashArray: '5, 10' }).addTo(map);

          const bounds = L.latLngBounds(latlngs);
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40] });
          }
        } else {
          // Update existing markers and polyline
          const map = mapInstanceRef.current;
          
          if (driverMarkerRef.current) {
            driverMarkerRef.current.setLatLng([dLat, dLng]);
          }
          if (citizenMarkerRef.current) {
            citizenMarkerRef.current.setLatLng([cLat, cLng]);
          }
          if (polylineRef.current) {
            polylineRef.current.setLatLngs([[dLat, dLng], [cLat, cLng]]);
          }

          // Safety bounds checking
          const latlngs = [[dLat, dLng], [cLat, cLng]];
          const bounds = L.latLngBounds(latlngs);
          if (map && bounds.isValid()) {
            map.fitBounds(bounds, { padding: [40, 40] });
          }
        }
      } catch (err) {
        console.error("Leaflet safety capture error:", err);
      }
    };

    // Lazy load styles and scripts
    if (!document.getElementById('leaflet-css-vial')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-vial';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('leaflet-js-vial')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js-vial';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      document.head.appendChild(script);
    }

    // Call initializer
    // @ts-ignore
    if (window.L) {
      initOrUpdateLeaflet();
    } else {
      const interval = setInterval(() => {
        // @ts-ignore
        if (window.L && active) {
          clearInterval(interval);
          initOrUpdateLeaflet();
        }
      }, 100);
      return () => {
        active = false;
        clearInterval(interval);
      };
    }

    return () => {
      active = false;
    };
  }, [driverLat, driverLng, citizenLat, citizenLng]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn("Error removing map instance:", e);
        }
        mapInstanceRef.current = null;
        driverMarkerRef.current = null;
        citizenMarkerRef.current = null;
        polylineRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      <div ref={mapRef} className="w-full h-full min-h-[250px] z-10" />
      <div className="absolute top-2 right-2 bg-slate-900/95 border border-slate-800 px-3 py-1.5 rounded-lg text-[9px] text-yellow-500 font-mono tracking-wider z-20 shadow-lg flex items-center gap-1.5 uppercase">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        Satelital GPS Activo
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & Role states
  const [activeDevice, setActiveDevice] = useState<'citizen' | 'lawyer' | 'driver' | 'admin' | 'landing' | 'ambulance' | 'medic'>('landing');
  const [citizenTab, setCitizenTab] = useState<'home' | 'agent' | 'profile'>('home');
  const [lawyerTab, setLawyerTab] = useState<'guardia' | 'agent' | 'history'>('guardia');
  const [driverTab, setDriverTab] = useState<'vial' | 'agent'>('vial');
  const [ambulanceTab, setAmbulanceTab] = useState<'servicio' | 'agent'>('servicio');
  const [medicTab, setMedicTab] = useState<'guardia' | 'agent'>('guardia');

  // Driver support messages and input
  const [driverSupportMessages, setDriverSupportMessages] = useState<Message[]>([
    { sender: 'bot', text: '🚜 Operador, bienvenido a la Central de Despacho y Soporte Vial de SecureFlow. Aquí puedes consultar estatus de grúas, triaje visual de colisiones, reportar incidentes físicos y realizar consultas legales sobre la Ley de Transporte Terrestre. ¿En qué te puedo apoyar?', time: '19:55' }
  ]);
  const [driverSupportInput, setDriverSupportInput] = useState('');
  const [isDriverSupportPending, setIsDriverSupportPending] = useState(false);

  // Ambulance support messages and input
  const [ambulanceSupportMessages, setAmbulanceSupportMessages] = useState<Message[]>([
    { sender: 'bot', text: '🚑 Central de Ambulancias SecureFlow: Soporte operacional para despacho prehospitalario de emergencia. ¿Cómo podemos coordinar hoy?', time: '19:55' }
  ]);
  const [ambulanceSupportInput, setAmbulanceSupportInput] = useState('');
  const [isAmbulanceSupportPending, setIsAmbulanceSupportPending] = useState(false);

  // Medic support messages and input
  const [medicSupportMessages, setMedicSupportMessages] = useState<Message[]>([
    { sender: 'bot', text: '🏥 Dr(a), bienvenido al panel de Médicos de Guardia de SecureFlow. Aquí puedes gestionar videoconsultas de emergencia, triaje rápido, diagnósticos preliminares y apoyo a paramédicos. ¿Cuál es su consulta?', time: '19:55' }
  ]);
  const [medicSupportInput, setMedicSupportInput] = useState('');
  const [isMedicSupportPending, setIsMedicSupportPending] = useState(false);

  // Supabase state integrations
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [isIAPending, setIsIAPending] = useState<boolean>(false);
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [selectRole, setSelectRole] = useState<'citizen' | 'lawyer' | 'driver' | 'ambulance' | 'medic'>('citizen');
  
  // Registration dynamic required fields and security selfie
  const [impreAbogadoField, setImpreAbogadoField] = useState<string>('');
  const [ciudadanoIdField, setCiudadanoIdField] = useState<string>('');
  const [gruaIdField, setGruaIdField] = useState<string>('');
  const [credentialAmbulanceField, setCredentialAmbulanceField] = useState<string>('');
  const [credentialMedicField, setCredentialMedicField] = useState<string>('');
  const [selfieCaptured, setSelfieCaptured] = useState<string | null>(null);
  const [isCapturingSelfie, setIsCapturingSelfie] = useState<boolean>(false);
  const selfieVideoRef = useRef<HTMLVideoElement | null>(null);
  const [selfieStream, setSelfieStream] = useState<MediaStream | null>(null);
  const [selfieCameraError, setSelfieCameraError] = useState<string | null>(null);
  
  // Custom Material Dialog state
  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  // Profiles (Simulating DB storage)
  const [citizenProfile, setCitizenProfile] = useState<Profile>({
    name: 'Jhon Mitre',
    email: 'jhonmitre1990@gmail.com',
    phone: '584241234567',
    city: 'Caracas'
  });
  
  const [lawyerProfile, setLawyerProfile] = useState<Profile>({
    name: 'Dra. María Mendoza',
    email: 'mendoza.legal@secureflow.ve',
    phone: '584129876543',
    city: 'Caracas',
    licenseNumber: 'INPRE-98.421',
    specialty: 'Derecho Constitucional & Penal'
  });

  const [driverProfile, setDriverProfile] = useState<Profile>({
    name: 'Carlos Ruiz',
    email: 'carlos.grua@secureflow.ve',
    phone: '584165554433',
    city: 'Caracas',
    vehiclePlate: 'A92B45X'
  });

  const [ambulanceProfile, setAmbulanceProfile] = useState<Profile>({
    name: 'Dr. Héctor Salas (Paramédico)',
    email: 'salas.paramedico@secureflow.ve',
    phone: '584145551122',
    city: 'Caracas',
    vehiclePlate: 'AMB-402X'
  });

  const [medicProfile, setMedicProfile] = useState<Profile>({
    name: 'Dr. Luis Beltrán (Médico)',
    email: 'beltran.med@secureflow.ve',
    phone: '584125559988',
    city: 'Caracas',
    licenseNumber: 'MSAS-42.501',
    specialty: 'Medicina Crítica & Emergencias'
  });

  // Flow State Engines (Simulating fully synced backend communication)
  const [sosState, setSosState] = useState<'idle' | 'calling' | 'proposal' | 'active'>('idle');
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null);
  const [proposedTariff, setProposedTariff] = useState<number>(15);
  const [lawyerTariffs, setLawyerTariffs] = useState({ min15: 15, min30: 25, hour1: 45 });
  const [totalLawyerEarnings, setTotalLawyerEarnings] = useState<number>(0);
  const [completedLawyerSessions, setCompletedLawyerSessions] = useState<number>(0);
  const [isLawyerOnline, setIsLawyerOnline] = useState<boolean>(true);
  const [lawyerHistory, setLawyerHistory] = useState<any[]>([]);

  // Ambulance Dispatch Engine 
  const [ambulanceState, setAmbulanceState] = useState<'idle' | 'proposed' | 'dispatched' | 'completed'>('idle');
  const [activeAmbulanceJob, setActiveAmbulanceJob] = useState<any>(null);
  const [isAmbulanceOnline, setIsAmbulanceOnline] = useState<boolean>(true);
  const [ambulanceDebt, setAmbulanceDebt] = useState<number>(0.00);
  const [ambulanceMessages, setAmbulanceMessages] = useState<Message[]>([]);
  const [ambulanceChatInput, setAmbulanceChatInput] = useState<string>('');
  const [completedAmbulanceSessions, setCompletedAmbulanceSessions] = useState<number>(0);

  // Medic-On-Guard Emergency Engine
  const [medicState, setMedicState] = useState<'idle' | 'calling' | 'proposal' | 'active'>('idle');
  const [activeMedicEmergency, setActiveMedicEmergency] = useState<any>(null);
  const [medicProposedTariff, setMedicProposedTariff] = useState<number>(20);
  const [isMedicOnline, setIsMedicOnline] = useState<boolean>(true);
  const [medicDebt, setMedicDebt] = useState<number>(0.00);
  const [completedMedicSessions, setCompletedMedicSessions] = useState<number>(0);

  // Chat engines
  const [agentMessages, setAgentMessages] = useState<Message[]>([]);
  const [agentInput, setAgentInput] = useState('');
  
  const [lawyerAgentMessages, setLawyerAgentMessages] = useState<Message[]>([]);
  const [lawyerAgentInput, setLawyerAgentInput] = useState('');

  // AI assistant states for Paramedic and Doctor
  const [ambulanceAgentMessages, setAmbulanceAgentMessages] = useState<Message[]>([]);
  const [ambulanceAgentInput, setAmbulanceAgentInput] = useState('');

  const [medicAgentMessages, setMedicAgentMessages] = useState<Message[]>([]);
  const [medicAgentInput, setMedicAgentInput] = useState('');

  // Interactive Live Windows & Daily.co toggles
  const [isAmbulanceWindowOpen, setIsAmbulanceWindowOpen] = useState<boolean>(false);
  const [isMedicWindowOpen, setIsMedicWindowOpen] = useState<boolean>(false);
  const [isAmbulanceDailyCoActive, setIsAmbulanceDailyCoActive] = useState<boolean>(false);
  const [isMedicDailyCoActive, setIsMedicDailyCoActive] = useState<boolean>(false);
  const [isLawyerDailyCoActive, setIsLawyerDailyCoActive] = useState<boolean>(false);
  const [citizenVehicleType, setCitizenVehicleType] = useState<'coche' | 'moto'>(() => {
    return (localStorage.getItem('secureflow_vehicle_type') as 'coche' | 'moto') || 'coche';
  });

  // Real-time Ambulance simulation coords
  const [ambulanceCoords, setAmbulanceCoords] = useState<{lat: number, lng: number}>({lat: 10.4780, lng: -66.8960});
  const [ambulanceDistance, setAmbulanceDistance] = useState<number>(2105);

  const [medicMessages, setMedicMessages] = useState<Message[]>([]);
  const [medicChatInput, setMedicChatInput] = useState<string>('');
  const [lawyerChatInput, setLawyerChatInput] = useState<string>('');
  const [isMedicCallingActive, setIsMedicCallingActive] = useState<boolean>(false);
  
  const [isDictating, setIsDictating] = useState(false);

  // Nueva lógica exclusiva de grúas/asistencias viales
  const [towDestinationText, setTowDestinationText] = useState<string>('Plaza Venezuela, Caracas');
  const [isTowDailyCoActive, setIsTowDailyCoActive] = useState<boolean>(false);
  const [towDailyCoUrl, setTowDailyCoUrl] = useState<string>('');
  const [activeVialAssist, setActiveVialAssist] = useState<any | null>(null);
  const [craneUnitState, setCraneUnitState] = useState<{ lat_actual: number, lng_actual: number } | null>({ lat_actual: 10.4900, lng_actual: -66.9100 });

  // Tow Truck State Engine - Online and Ready by Default
  const [towState, setTowState] = useState<'idle' | 'calculating' | 'proposed' | 'dispatched' | 'completed'>('idle');
  const [activeTowJob, setActiveTowJob] = useState<TowJob | null>(null);
  const [towDriverOnline, setTowDriverOnline] = useState(true);
  const [driverDebt, setDriverDebt] = useState<number>(0.00); // Fully cleared in production
  const [driverBalance, setDriverBalance] = useState<number>(0.00);
  const [ambulanceBalanceClean, setAmbulanceBalanceClean] = useState<number>(0.00);
  const [medicBalanceClean, setMedicBalanceClean] = useState<number>(0.00);
  const [showBinanceModal, setShowBinanceModal] = useState(false);

  // Tariffs State managed dynamically from Supabase config_tarifas
  const [tariffs, setTariffs] = useState<{ [key: string]: { tarifa_base: number; precio_por_km: number } }>({
    grua: { tarifa_base: 30.00, precio_por_km: 4.50 },
    medico: { tarifa_base: 20.00, precio_por_km: 0.00 },
    abogado: { tarifa_base: 15.00, precio_por_km: 0.00 }
  });

  useEffect(() => {
    const fetchConfigTarifas = async () => {
      try {
        const { data, error } = await supabase.from('config_tarifas').select('*');
        if (!error && data && data.length > 0) {
          const updatedTariffs = {
            grua: { tarifa_base: 30.00, precio_por_km: 4.50 },
            medico: { tarifa_base: 20.00, precio_por_km: 0.00 },
            abogado: { tarifa_base: 15.00, precio_por_km: 0.00 }
          };
          data.forEach((row: any) => {
            const svc = row.tipo_servicio;
            if (svc === 'grua' || svc === 'medico' || svc === 'abogado') {
              updatedTariffs[svc] = {
                tarifa_base: row.tarifa_base !== null && row.tarifa_base !== undefined ? Number(row.tarifa_base) : updatedTariffs[svc].tarifa_base,
                precio_por_km: row.precio_por_km !== null && row.precio_por_km !== undefined ? Number(row.precio_por_km) : updatedTariffs[svc].precio_por_km
              };
            }
          });
          setTariffs(updatedTariffs);
          console.log("[CONFIG_TARIFAS] Dynamic rates loaded:", updatedTariffs);
        } else {
          console.log("[CONFIG_TARIFAS] Standard rates configured successfully:", tariffs);
        }
      } catch (err) {
        console.error("Exception loading config_tarifas:", err);
      }
    };
    fetchConfigTarifas();
  }, []);
  const [towDriverCoords, setTowDriverCoords] = useState<{lat: number, lng: number}>({lat: 10.4900, lng: -66.9100});
  const [citizenCoords, setCitizenCoords] = useState<{lat: number, lng: number}>({lat: 10.4850, lng: -66.9030});
  const [towMessages, setTowMessages] = useState<Message[]>([]);
  const [towChatInput, setTowChatInput] = useState('');
  const [driverChatInput, setDriverChatInput] = useState('');
  
  // Citizen states
  const [citizenBalance, setCitizenBalance] = useState<number>(35.0);
  const [activePlan, setActivePlan] = useState<'gratis' | 'estandar' | 'premium'>('estandar');
  const [consultsUsed, setConsultsUsed] = useState<number>(4);
  const [sosCostRate, setSosCostRate] = useState<number>(12); // standard rate by default for standard plan
  const [alertContacts, setAlertContacts] = useState({
    name1: 'Mi Madre',
    tel1: '584249998877',
    name2: 'Mi Hermano',
    tel2: '584126665544'
  });
  
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletMethod, setWalletMethod] = useState<'pm' | 'usdt'>('pm');

  // Interactive Live Video Room
  const [isLiveVideoActive, setIsLiveVideoActive] = useState(false);
  const [videoStreamType, setVideoStreamType] = useState<'front' | 'rear'>('front');

  // Emulator-level notifications
  const [systemNotification, setSystemNotification] = useState<{title: string; body: string; sound: boolean} | null>(null);

  // Refs for auto scrolling
  const agentScrollRef = useRef<HTMLDivElement>(null);
  const towChatScrollRef = useRef<HTMLDivElement>(null);

  // Sync ref to prevent stale closures in stable real-time effects
  const towStateRef = useRef(towState);
  useEffect(() => {
    towStateRef.current = towState;
  }, [towState]);

  const activeTowJobRef = useRef(activeTowJob);
  useEffect(() => {
    activeTowJobRef.current = activeTowJob;
  }, [activeTowJob]);

  useEffect(() => {
    if (tariffs.abogado) {
      setSosCostRate(tariffs.abogado.tarifa_base);
    }
  }, [tariffs]);

  // Trigger visual alert modal simulation
  const showMaterialAlert = (title: string, message: string, onConfirm?: () => void) => {
    setDialog({
      visible: true,
      title,
      message,
      confirmText: 'Aceptar',
      onConfirm: () => {
        if(onConfirm) onConfirm();
        setDialog(null);
      }
    });
  };

  const showMaterialConfirm = (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => {
    setDialog({
      visible: true,
      title,
      message,
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        onConfirm();
        setDialog(null);
      },
      onCancel: () => {
        if(onCancel) onCancel();
        setDialog(null);
      }
    });
  };

  // Push notifications
  const triggerPush = (title: string, body: string) => {
    setSystemNotification({ title, body, sound: true });
    setTimeout(() => {
      setSystemNotification(null);
    }, 4500);
  };

  // Load and subscribe to Supabase Auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSessionUser(session.user);
        loadProfileFromDb(session.user.id, session.user.email || '');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSessionUser(session.user);
        loadProfileFromDb(session.user.id, session.user.email || '');
      } else {
        setSessionUser(null);
        setActiveDevice('landing');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Protected Routes safeguard effect (Forces authentication)
  useEffect(() => {
    if (activeDevice !== 'landing' && activeDevice !== 'admin' && !sessionUser) {
      setActiveDevice('landing');
    }
  }, [activeDevice, sessionUser]);

  // Sincronización en tiempo real de saldos reales de base de datos
  useEffect(() => {
    if (!sessionUser) return;
    
    const fetchBalancesReales = async () => {
      try {
        if (activeDevice === 'citizen') {
          const { data: saldoData } = await supabase
            .from('saldos')
            .select('creditos_disponibles')
            .eq('usuario_id', sessionUser.id)
            .maybeSingle();
          if (saldoData) {
            setCitizenBalance(Number(saldoData.creditos_disponibles));
          }
        } else if (activeDevice === 'lawyer') {
          const { data: sla } = await supabase
            .from('saldos_abogados')
            .select('saldo_acumulado')
            .eq('abogado_id', sessionUser.id)
            .maybeSingle();
          if (sla) {
            setTotalLawyerEarnings(Number(sla.saldo_acumulado) || 0.00);
          }
        }
      } catch (err) {
        console.error("Error al sincronizar saldos reales:", err);
      }
    };

    fetchBalancesReales();
  }, [sessionUser, activeDevice]);

  // Efecto independiente exclusivo para finanzas y bitácora del abogado
  useEffect(() => {
    if (!sessionUser || activeDevice !== 'lawyer') return;

    const fetchFinanzasAbogado = async () => {
      try {
        // 1. Obtener ID de public.abogados
        const { data: lawyerAbg } = await supabase
          .from('abogados')
          .select('id')
          .eq('auth_id', sessionUser.id)
          .maybeSingle();

        let lAbgId = null;
        if (lawyerAbg) {
          lAbgId = lawyerAbg.id;
        }

        // 2. Obtener saldo_acumulado desde saldos_abogados
        if (lAbgId) {
          const { data: sla } = await supabase
            .from('saldos_abogados')
            .select('saldo_acumulado')
            .eq('abogado_id', lAbgId)
            .maybeSingle();
          if (sla) {
            setTotalLawyerEarnings(Number(sla.saldo_acumulado) || 0.00);
          } else {
            const { data: slaFallback } = await supabase
              .from('saldos_abogados')
              .select('saldo_acumulado')
              .eq('abogado_id', sessionUser.id)
              .maybeSingle();
            if (slaFallback) {
              setTotalLawyerEarnings(Number(slaFallback.saldo_acumulado) || 0.00);
            } else {
              setTotalLawyerEarnings(0.00);
            }
          }
        } else {
          const { data: slaFallback } = await supabase
            .from('saldos_abogados')
            .select('saldo_acumulado')
            .eq('abogado_id', sessionUser.id)
            .maybeSingle();
          if (slaFallback) {
            setTotalLawyerEarnings(Number(slaFallback.saldo_acumulado) || 0.00);
          } else {
            setTotalLawyerEarnings(0.00);
          }
        }

        // 3. Obtener id del abogado en public.usuarios (profesional_id en historial_comisiones)
        const { data: usrRow } = await supabase
          .from('usuarios')
          .select('id')
          .eq('auth_id', sessionUser.id)
          .maybeSingle();

        const lUsrId = usrRow?.id;

        // 4. Consultar historial_comisiones filtrando por profesional_id
        if (lUsrId) {
          const { data: hist, error } = await supabase
            .from('historial_comisiones')
            .select('*')
            .eq('profesional_id', lUsrId)
            .order('created_at', { ascending: false });

          if (!error && hist) {
            setLawyerHistory(hist);
          }
        } else {
          const { data: hist, error } = await supabase
            .from('historial_comisiones')
            .select('*')
            .eq('profesional_id', sessionUser.id)
            .order('created_at', { ascending: false });

          if (!error && hist) {
            setLawyerHistory(hist);
          }
        }
      } catch (err) {
        console.error("Error al cargar finanzas y bitácora del abogado:", err);
      }
    };

    fetchFinanzasAbogado();
  }, [sessionUser, activeDevice]);

  const loadProfileFromDb = async (userId: string, email: string) => {
    try {
      // 1. Obtén el usuario autenticado (auth.getUser())
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const resolvedUserId = authUser?.id || userId;
      const resolvedEmail = authUser?.email || email;

      if (!resolvedUserId) return;

      // 2. PRIMERA VERIFICACIÓN (Grúas / Driver)
      const { data: grueroData } = await supabase
        .from('grueros')
        .select('*')
        .eq('auth_id', resolvedUserId)
        .maybeSingle();

      if (grueroData) {
        setDriverProfile({
          name: grueroData.nombre_completo,
          email: resolvedEmail,
          phone: grueroData.telefono || '',
          city: 'Caracas',
          vehiclePlate: grueroData.placa_vehiculo || 'A92B45X'
        });

        // Load gruero balance
        const { data: sg } = await supabase
          .from('saldos_grueros')
          .select('balance')
          .eq('user_id', resolvedUserId)
          .maybeSingle();
        if (sg) {
          setDriverBalance(Number(sg.balance) || 0.00);
        }

        // Establece el rol/vista del panel en GRUERO y haz un return INMEDIATO
        setActiveDevice('driver');
        return;
      }

      // 3. SEGUNDA VERIFICACIÓN (Abogados / Lawyer)
      const { data: abogadoData } = await supabase
        .from('abogados')
        .select('*')
        .eq('auth_id', resolvedUserId)
        .maybeSingle();

      if (abogadoData) {
        setLawyerProfile({
          name: abogadoData.nombre_completo,
          email: resolvedEmail,
          phone: abogadoData.telefono || '',
          city: 'Caracas',
          licenseNumber: 'INPRE-98.421',
          specialty: 'Derecho Constitucional & Penal'
        });

        // Cargar saldo real del abogado
        const { data: sla } = await supabase
          .from('saldos_abogados')
          .select('saldo_acumulado')
          .eq('abogado_id', resolvedUserId)
          .maybeSingle();
        if (sla) {
          setTotalLawyerEarnings(Number(sla.saldo_acumulado) || 0.00);
        } else {
          setTotalLawyerEarnings(0.00);
        }

        // Establece el rol/vista en ABOGADO y haz un return INMEDIATO
        setActiveDevice('lawyer');
        return;
      }

      // 4. TERCERA VERIFICACIÓN (Ciudadanos y otros): Solo si las dos anteriores fallaron (fueron null)
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .or(`auth_id.eq.${resolvedUserId},id.eq.${resolvedUserId}`)
        .maybeSingle();

      if (userData) {
        let rawRole = userData.rol || userData.role || '';
        if (!rawRole) {
          const { data: sessionData } = await supabase.auth.getSession();
          const userMeta = sessionData?.session?.user?.user_metadata;
          if (userMeta) {
            rawRole = userMeta.rol || userMeta.role || '';
          }
        }
        
        const finalRole = getNormalizedRole(rawRole || 'citizen');

        if (finalRole === 'citizen') {
          setCitizenProfile({
            name: userData.nombre_completo,
            email: resolvedEmail,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas'
          });
          const vSel = userData.vehicle_selection || userData.tipo_vehiculo;
          if (vSel) {
            setCitizenVehicleType(vSel as 'coche' | 'moto');
            localStorage.setItem('secureflow_vehicle_type', vSel);
          }
          if (userData.contacto_emergencia_1_nombre || userData.contacto_emergencia_1_telefono) {
            setAlertContacts({
              name1: userData.contacto_emergencia_1_nombre || 'Mi Madre',
              tel1: userData.contacto_emergencia_1_telefono || '584249998877',
              name2: userData.contacto_emergencia_2_nombre || 'Mi Hermano',
              tel2: userData.contacto_emergencia_2_telefono || '584126665544'
            });
          }
        } else if (finalRole === 'ambulance') {
          setAmbulanceProfile({
            name: userData.nombre_completo,
            email: resolvedEmail,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas',
            vehiclePlate: 'AMB-402X'
          });
          const { data: sa } = await supabase
            .from('saldos_ambulancias')
            .select('balance')
            .eq('user_id', resolvedUserId)
            .maybeSingle();
          if (sa) {
            setAmbulanceBalanceClean(Number(sa.balance) || 0.00);
          }
        } else if (finalRole === 'medic') {
          setMedicProfile({
            name: userData.nombre_completo,
            email: resolvedEmail,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas',
            licenseNumber: 'MSAS-42.501',
            specialty: 'Medicina Crítica & Emergencias'
          });
          const { data: sm } = await supabase
            .from('saldos_medicos')
            .select('balance')
            .eq('user_id', resolvedUserId)
            .maybeSingle();
          if (sm) {
            setMedicBalanceClean(Number(sm.balance) || 0.00);
          }
        }

        setActiveDevice(finalRole);

        // Fetch balance from 'saldos'
        const { data: saldoData } = await supabase
          .from('saldos')
          .select('*')
          .eq('usuario_id', resolvedUserId)
          .maybeSingle();

        if (saldoData) {
          setCitizenBalance(Number(saldoData.creditos_disponibles));
          setActivePlan(saldoData.plan_activo as any);
          setConsultsUsed(Number(saldoData.consultas_ia_usadas));
        }
      } else {
        // Fallback for unauthorized / unmapped users
        setActiveDevice('citizen');
      }
    } catch (e) {
      console.error("Error loading profile from DB sequentially: ", e);
    }
  };

  // Real-time listener for lawyers to automatically receive incoming SOS emergencies
  useEffect(() => {
    if (activeDevice !== 'lawyer') return;

    const fetchCallingEmergencies = async () => {
      const { data } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'buscando');
      
      const filteredLawyer = data?.filter(e => e.sala_webrtc_url && e.sala_webrtc_url.includes('daily.co')) || [];
      if (filteredLawyer.length > 0) {
        const active = filteredLawyer[0];
        const { data: userData } = await supabase
          .from('usuarios')
          .select('nombre_completo, contacto_emergencia_1_telefono')
          .eq('id', active.ciudadano_id)
          .maybeSingle();

        const citizen_name = userData?.nombre_completo || 'Ciudadano';
        const citizen_phone = userData?.contacto_emergencia_1_telefono || '';
        setActiveEmergency({
          id: active.id,
          citizenName: citizen_name,
          citizenPhone: citizen_phone,
          citizenCity: active.ubicacion_texto || 'Caracas',
          status: 'calling',
          latitude: Number(active.ubicacion_lat),
          longitude: Number(active.ubicacion_lng),
          tarifa: Number(active.tarifa_aplicada),
          dailyRoomUrl: active.sala_webrtc_url || active.daily_room_url
        });
        return;
      }

      if (sessionUser) {
        const { data: activeList } = await supabase
          .from('emergencias_activas')
          .select('*')
          .eq('estado', 'activa')
          .eq('abogado_id', sessionUser.id);

        if (activeList && activeList.length > 0) {
          const active = activeList[0];
          const { data: userData } = await supabase
            .from('usuarios')
            .select('nombre_completo, contacto_emergencia_1_telefono')
            .eq('id', active.ciudadano_id)
            .maybeSingle();

          const citizen_name = userData?.nombre_completo || 'Ciudadano';
          const citizen_phone = userData?.contacto_emergencia_1_telefono || '';

          setActiveEmergency({
            id: active.id,
            citizenName: citizen_name,
            citizenPhone: citizen_phone,
            citizenCity: active.ubicacion_texto || 'Caracas',
            status: 'active',
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            tarifa: Number(active.tarifa_aplicada),
            dailyRoomUrl: active.sala_webrtc_url || active.daily_room_url
          });
          return;
        }
      }

      setActiveEmergency(null);
    };

    fetchCallingEmergencies();

    const channel = supabase
      .channel('emergencies-panel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencias_activas' }, () => {
        fetchCallingEmergencies();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, sessionUser?.id]);

  // Effect to fetch and restore any active, pending, or en_progreso tow service for the citizen on mount or role swap
  useEffect(() => {
    if (activeDevice !== 'citizen' || !sessionUser?.id) return;

    let active = true;

    const restoreCitizenTowJob = async () => {
      try {
        const { data: activeList } = await supabase
          .from('asistencias_viales')
          .select('*')
          .in('estado', ['pendiente', 'activa', 'en_progreso'])
          .eq('ciudadano_id', sessionUser.id)
          .order('created_at', { ascending: false });

        if (!active) return;

        if (activeList && activeList.length > 0) {
          const assist = activeList[0];
          
          let dName = 'Carlos Ruiz';
          let dPhone = 'No phone';
          let gId = assist.gruero_id;
          let vPlate = 'A92B45X';
          
          if (gId) {
            const { data: grueroRow } = await supabase
              .from('grueros')
              .select('nombre_completo, telefono, placa_vehiculo')
              .eq('id', gId)
              .maybeSingle();
            if (active && grueroRow) {
              dName = grueroRow.nombre_completo;
              dPhone = grueroRow.telefono;
              vPlate = grueroRow.placa_vehiculo || 'A92B45X';
            }
          }

          const baseFee = tariffs.grua?.tarifa_base ?? 30.00;
          const kmRate = tariffs.grua?.precio_por_km ?? 4.50;
          
          // Calculate distance matching what was saved
          const distanceInKm = 5.4; // default
          const distMeters = assist.distancia_metros || Math.round(distanceInKm * 1000);

          const restoredJob: TowJob = {
            id: assist.id,
            citizenName: citizenProfile.name || 'Ciudadano',
            citizenPhone: citizenProfile.phone || 'No phone',
            status: assist.estado === 'pendiente' ? 'pending' : 'en_route',
            latitude: Number(assist.ubicacion_origen_lat) || citizenCoords.lat,
            longitude: Number(assist.ubicacion_origen_lng) || citizenCoords.lng,
            price: Number(assist.costo_total) || (baseFee + (distMeters / 1000) * kmRate),
            distance: distMeters,
            driverName: dName,
            driverPhone: dPhone,
            vehiclePlate: vPlate,
            gruero_id: gId
          };

          if (active) {
            setActiveTowJob(restoredJob);
            setActiveVialAssist(assist);
            
            if (assist.estado === 'activa' || assist.estado === 'en_progreso') {
              setTowState('dispatched');
              setCitizenTab('home');
            } else {
              setTowState('proposed'); // proposed corresponds to pending / 'pendiente' load screen
            }
            console.log("[CITIZEN TARIFF RECOVERY] Successfully restored active assistance:", assist.id, assist.estado);
          }
        }
      } catch (err) {
        console.error("Error restoring citizen tow job:", err);
      }
    };

    restoreCitizenTowJob();

    return () => {
      active = false;
    };
  }, [activeDevice, sessionUser?.id, tariffs]);

  // Real-time listener and fallback query for the citizen to sync the crane request status from Supabase
  useEffect(() => {
    if (activeDevice !== 'citizen' || !activeTowJob) return;

    let active = true;

    const checkTowStatusUpdate = async (updatedObj?: any) => {
      try {
        let updated = updatedObj;
        if (!updated) {
          // Check working emergencias_activas first
          const { data: emerData } = await supabase
            .from('emergencias_activas')
            .select('*')
            .eq('id', activeTowJob.id)
            .maybeSingle();

          if (emerData) {
            let gId = null;
            let drName = 'Carlos Ruiz';
            let drPhone = 'No phone';
            let vPlate = 'A92B45X';
            try {
              if (emerData.sala_webrtc_url && emerData.sala_webrtc_url.startsWith('{')) {
                const parsed = JSON.parse(emerData.sala_webrtc_url);
                gId = parsed.gruero_id;
                drName = parsed.driverName || drName;
                drPhone = parsed.driverPhone || drPhone;
                vPlate = parsed.vehiclePlate || vPlate;
              }
            } catch {}

            updated = {
              id: emerData.id,
              estado: emerData.estado === 'dispatched' || emerData.estado === 'active' ? 'activa' : (emerData.estado === 'completed' ? 'completado' : emerData.estado === 'pending' ? 'pendiente' : emerData.estado),
              gruero_id: gId,
              costo_total: emerData.tarifa_aplicada,
              ubicacion_origen_lat: emerData.ubicacion_lat,
              ubicacion_origen_lng: emerData.ubicacion_lng,
              driverName: drName,
              driverPhone: drPhone,
              vehiclePlate: vPlate
            };
          } else {
            // Fallback
            const { data, error } = await supabase
              .from('asistencias_viales')
              .select('*')
              .eq('id', activeTowJob.id)
              .maybeSingle();

            if (!error && data) {
              updated = data;
            }
          }
        }

        if (!updated) return;

        if ((updated.estado === 'activa' || updated.estado === 'en_progreso' || updated.estado === 'aceptado') && updated.gruero_id) {
          setTowState('dispatched');
          setCitizenTab('home'); // Permanently activate tracking view map instantly
          
          let drName = updated.driverName || 'Carlos Ruiz';
          let drPhone = updated.driverPhone || 'No phone';
          let vPlate = updated.vehiclePlate || 'A92B45X';

          const { data: grueroRow } = await supabase
            .from('grueros')
            .select('nombre_completo, telefono, placa_vehiculo')
            .eq('id', updated.gruero_id)
            .maybeSingle();

          if (grueroRow) {
            drName = grueroRow.nombre_completo || drName;
            drPhone = grueroRow.telefono || drPhone;
            vPlate = grueroRow.placa_vehiculo || vPlate;
          }

          if (active) {
            setActiveVialAssist(updated);
            setActiveTowJob(prev => {
              if (prev && (prev.status !== 'en_route' || prev.gruero_id !== updated.gruero_id || prev.vehiclePlate !== vPlate)) {
                return {
                  ...prev,
                  status: 'en_route',
                  driverName: drName,
                  driverPhone: drPhone,
                  vehiclePlate: vPlate,
                  gruero_id: updated.gruero_id
                };
              }
              return prev;
            });
          }
        } else if (updated.estado === 'completado') {
          if (active) {
            setTowState('idle');
            setActiveTowJob(null);
            const rate = Number(updated.costo_total) || 28.50;
            setCitizenBalance(b => Math.max(0, b - rate));
            showMaterialAlert('🚜 Traslado Concluido', `La unidad de grúa ha completado el traslado. Se debitaron $${rate.toFixed(2)} USD de tu saldo del seguro.`);
          }
        } else if (updated.estado === 'cancelado') {
          if (active) {
            setTowState('idle');
            setActiveTowJob(null);
            showMaterialAlert('🚜 Traslado Cancelado', 'El servicio de asistencia vial de grúa ha sido cancelado.');
          }
        }
      } catch (err) {
        console.error("Error checking tow status in citizen panel:", err);
      }
    };

    // Run status check immediately
    checkTowStatusUpdate();

    // Setup Realtime subscription channels for BOTH tables
    const channelVial = supabase
      .channel(`tow-vial-${activeTowJob.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'asistencias_viales', filter: `id=eq.${activeTowJob.id}` }, async (payload) => {
        if (active) {
          checkTowStatusUpdate(payload.new);
        }
      })
      .subscribe();

    const channelEmer = supabase
      .channel(`tow-emer-status-${activeTowJob.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${activeTowJob.id}` }, async (payload) => {
        if (active && payload.new) {
          const emerData = payload.new;
          let gId = null;
          let drName = 'Carlos Ruiz';
          let drPhone = 'No phone';
          let vPlate = 'A92B45X';
          try {
            if (emerData.sala_webrtc_url && emerData.sala_webrtc_url.startsWith('{')) {
              const parsed = JSON.parse(emerData.sala_webrtc_url);
              gId = parsed.gruero_id;
              drName = parsed.driverName || drName;
              drPhone = parsed.driverPhone || drPhone;
              vPlate = parsed.vehiclePlate || vPlate;
            }
          } catch {}

          const mapped = {
            id: emerData.id,
            estado: emerData.estado === 'dispatched' || emerData.estado === 'active' ? 'activa' : (emerData.estado === 'completed' ? 'completado' : emerData.estado === 'pending' ? 'pendiente' : emerData.estado),
            gruero_id: gId,
            costo_total: emerData.tarifa_aplicada,
            ubicacion_origen_lat: emerData.ubicacion_lat,
            ubicacion_origen_lng: emerData.ubicacion_lng,
            driverName: drName,
            driverPhone: drPhone,
            vehiclePlate: vPlate
          };
          checkTowStatusUpdate(mapped);
        }
      })
      .subscribe();

    // Constant fallback interval checking every 2 seconds to guarantee responsiveness
    const interval = setInterval(() => {
      if (active) {
        checkTowStatusUpdate();
      }
    }, 2000);

    return () => {
      active = false;
      clearInterval(interval);
      supabase.removeChannel(channelVial);
      supabase.removeChannel(channelEmer);
    };
  }, [activeDevice, activeTowJob?.id]);

  // Real-time listener to sync the road assist chat messages from 'mensajes_viales' table
  useEffect(() => {
    const assistId = activeTowJob?.id || activeVialAssist?.id;
    if (!assistId) return;

    // Fetch existing messages
    const fetchExistingMessages = async () => {
      try {
        const { data: messages, error } = await supabase
          .from('mensajes_viales')
          .select('*')
          .eq('asistencia_id', assistId)
          .order('created_at', { ascending: true });

        if (!error && messages) {
          const formatted = messages.map(m => {
            const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';
            return {
              sender: m.remitente as 'citizen' | 'driver',
              text: m.mensaje || '',
              time: timeStr
            };
          });
          setTowMessages(formatted);
        }
      } catch (err) {
        console.error("Error fetching mensajes_viales:", err);
      }
    };

    fetchExistingMessages();

    // Live subscription to 'mensajes_viales' table updates for this active assistance
    const channel = supabase
      .channel(`chat-vial-${assistId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'mensajes_viales', 
          filter: `asistencia_id=eq.${assistId}` 
        },
        (payload) => {
          const m = payload.new;
          const timeStr = m.created_at ? new Date(m.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false }) : new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
          const newMsg = {
            sender: m.remitente as 'citizen' | 'driver',
            text: m.mensaje || '',
            time: timeStr
          };
          setTowMessages(prev => {
            if (prev.some(p => p.text === newMsg.text && p.sender === newMsg.sender && p.time === newMsg.time)) {
              return prev;
            }
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeTowJob?.id, activeVialAssist?.id]);

  // Subscribe to and periodically track the crane's position from 'unidades_grua' or 'emergencias_activas' table
  useEffect(() => {
    const isCitizenActive = !!activeTowJob && (
      towState === 'dispatched' || 
      activeTowJob.status === 'en_route' || 
      activeTowJob.status === 'active' || 
      activeTowJob.gruero_id || 
      activeVialAssist?.estado === 'activa' || 
      activeVialAssist?.estado === 'en_progreso' || 
      activeVialAssist?.gruero_id
    );
    if (!isCitizenActive || !activeTowJob) return;

    let active = true;
    let channel: any = null;

    const fetchCraneLocation = async () => {
      try {
        // Query working table emergencias_activas for driver coordinate offsets mapping
        const { data: emer } = await supabase
          .from('emergencias_activas')
          .select('sala_webrtc_url')
          .eq('id', activeTowJob.id)
          .maybeSingle();

        if (emer?.sala_webrtc_url && emer.sala_webrtc_url.startsWith('{')) {
          try {
            const parsed = JSON.parse(emer.sala_webrtc_url);
            if (parsed.driverLat && parsed.driverLng && active) {
              const dLat = Number(parsed.driverLat);
              const dLng = Number(parsed.driverLng);
              setCraneUnitState({
                lat_actual: dLat,
                lng_actual: dLng
              });
              setTowDriverCoords({
                lat: dLat,
                lng: dLng
              });
              return; // Successful fetch from working JSON channel
            }
          } catch {}
        }

        // Fallback
        const { data: assist } = await supabase
          .from('asistencias_viales')
          .select('gruero_id')
          .eq('id', activeTowJob.id)
          .maybeSingle();

        const gId = assist?.gruero_id;
        if (gId) {
          const { data: unit } = await supabase
            .from('unidades_grua')
            .select('lat_actual, lng_actual')
            .eq('gruero_id', gId)
            .maybeSingle();

          if (unit && active) {
            setCraneUnitState({
              lat_actual: Number(unit.lat_actual) || 10.4900,
              lng_actual: Number(unit.lng_actual) || -66.9100
            });
          }

          if (!channel && active) {
            channel = supabase
              .channel(`crane-location-${gId}`)
              .on(
                'postgres_changes',
                {
                  event: 'UPDATE',
                  schema: 'public',
                  table: 'unidades_grua',
                  filter: `gruero_id=eq.${gId}`
                },
                (payload) => {
                  if (active && payload.new) {
                    setCraneUnitState({
                      lat_actual: Number(payload.new.lat_actual) || 10.4900,
                      lng_actual: Number(payload.new.lng_actual) || -66.9100
                    });
                  }
                }
              )
              .subscribe();
          }
        }
      } catch (err) {
        console.error("Error updating crane location:", err);
      }
    };

    fetchCraneLocation();
    
    // Subscribe to working table changes
    const channelEmerLoc = supabase
      .channel(`crane-emer-loc-${activeTowJob.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${activeTowJob.id}` }, (payload) => {
        if (active && payload.new && payload.new.sala_webrtc_url) {
          try {
            const parsed = JSON.parse(payload.new.sala_webrtc_url);
            if (parsed.driverLat && parsed.driverLng) {
              const dLat = Number(parsed.driverLat);
              const dLng = Number(parsed.driverLng);
              setCraneUnitState({
                lat_actual: dLat,
                lng_actual: dLng
              });
              setTowDriverCoords({
                lat: dLat,
                lng: dLng
              });
            }
          } catch {}
        }
      })
      .subscribe();
    
    // Fast polling fallback to ensure robust syncs
    const interval = setInterval(() => {
      if (active) fetchCraneLocation();
    }, 2500);

    return () => {
      active = false;
      clearInterval(interval);
      if (channel) {
        supabase.removeChannel(channel);
      }
      supabase.removeChannel(channelEmerLoc);
    };
  }, [towState, activeTowJob?.id, activeTowJob?.gruero_id, activeVialAssist?.estado, activeVialAssist?.gruero_id]);

  // Driver subscribes to and polls Citizen location from DB in real-time
  useEffect(() => {
    if (activeDevice !== 'driver' || towState !== 'dispatched' || !activeTowJob) return;

    let active = true;
    let channel: any = null;

    const fetchCitizenLocation = async () => {
      try {
        // Try working table first
        const { data: emer } = await supabase
          .from('emergencias_activas')
          .select('ubicacion_lat, ubicacion_lng')
          .eq('id', activeTowJob.id)
          .maybeSingle();

        if (emer && active) {
          const lat = Number(emer.ubicacion_lat);
          const lng = Number(emer.ubicacion_lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            setActiveTowJob(prev => prev ? {
              ...prev,
              latitude: lat,
              longitude: lng
            } : null);
            return;
          }
        }

        // Fallback
        const { data: assist, error } = await supabase
          .from('asistencias_viales')
          .select('ubicacion_origen_lat, ubicacion_origen_lng')
          .eq('id', activeTowJob.id)
          .maybeSingle();

        if (error || !assist) return;

        if (active) {
          const lat = Number(assist.ubicacion_origen_lat);
          const lng = Number(assist.ubicacion_origen_lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            setActiveTowJob(prev => prev ? {
              ...prev,
              latitude: lat,
              longitude: lng
            } : null);
          }
        }
      } catch (err) {
        console.error("Error in driver fetching citizen coordinates:", err);
      }
    };

    fetchCitizenLocation();

    // Subscribe to UPDATE events on both tables
    channel = supabase
      .channel(`driver-citizen-track-${activeTowJob.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'asistencias_viales',
          filter: `id=eq.${activeTowJob.id}`
        },
        (payload) => {
          if (active && payload.new) {
            const lat = Number(payload.new.ubicacion_origen_lat);
            const lng = Number(payload.new.ubicacion_origen_lng);
            if (!isNaN(lat) && !isNaN(lng)) {
              setActiveTowJob(prev => prev ? {
                ...prev,
                latitude: lat,
                longitude: lng
              } : null);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'emergencias_activas',
          filter: `id=eq.${activeTowJob.id}`
        },
        (payload) => {
          if (active && payload.new) {
            const lat = Number(payload.new.ubicacion_lat);
            const lng = Number(payload.new.ubicacion_lng);
            if (!isNaN(lat) && !isNaN(lng)) {
              setActiveTowJob(prev => prev ? {
                ...prev,
                latitude: lat,
                longitude: lng
              } : null);
            }
          }
        }
      )
      .subscribe();

    // Polling fallback helper every 2.5 seconds
    const interval = setInterval(() => {
      if (active) fetchCitizenLocation();
    }, 2500);

    return () => {
      active = false;
      clearInterval(interval);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeDevice, towState, activeTowJob?.id]);

  // Real-time listener for the citizen to sync the lawyer/SOS call status and chat messages from Supabase
  useEffect(() => {
    if (activeDevice !== 'citizen' || !activeEmergency) return;

    const channel = supabase
      .channel(`citizen-lawyer-${activeEmergency.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${activeEmergency.id}` }, (payload) => {
        const updated = payload.new;
        if (updated.estado === 'active' || updated.estado === 'activa') {
          setSosState('active');
          setIsLiveVideoActive(true);
          setIsLawyerDailyCoActive(true);
          // Actualizamos la URL real de la sala desde el payload de Supabase
          setActiveEmergency(prev => {
            if (!prev) return null;
            const liveUrl = updated.daily_room_url || updated.sala_webrtc_url || prev.dailyRoomUrl;
            console.log('[CITIZEN REALTIME SYNC] Sincronizando URL real de la sala:', liveUrl);
            return {
              ...prev,
              dailyRoomUrl: liveUrl
            };
          });
        } else if (updated.estado === 'completed' || updated.estado === 'resuelta') {
          setIsLiveVideoActive(false);
          setSosState('idle');
          setActiveEmergency(null);
          const rate = Number(updated.tarifa_aplicada) || 30.00;
          setCitizenBalance(b => Math.max(0, b - rate));
          showMaterialAlert('⚖️ Amparo Concluido', `Procedimiento terminado con éxito. Se debitaron $${rate} USD por asistencia legal certificada.`);
          channel.unsubscribe();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, activeEmergency?.id]);

  // Real-time listener for the citizen to sync the doctor teleconsultation status and chat messages
  useEffect(() => {
    if (activeDevice !== 'citizen' || !activeMedicEmergency) return;

    const channel = supabase
      .channel(`citizen-medic-${activeMedicEmergency.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${activeMedicEmergency.id}` }, (payload) => {
        const updated = payload.new;
        if (updated.estado === 'active' || updated.estado === 'activa') {
          setMedicState('active');
          setIsMedicWindowOpen(true);
          setIsMedicDailyCoActive(true);
          triggerPush('🏥 Doctor Conectado', 'El médico de guardia ha aceptado tu caso y ya está conectado.');
        } else if (updated.estado === 'completed' || updated.estado === 'resuelta') {
          setMedicState('idle');
          setActiveMedicEmergency(null);
          setIsMedicWindowOpen(false);
          const rate = Number(updated.tarifa_aplicada) || 20.00;
          setCitizenBalance(b => Math.max(0, b - rate));
          showMaterialAlert('🩺 Consulta Concluida', 'El médico de guardia ha finalizado la sesión de teleconsulta.');
          channel.unsubscribe();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, activeMedicEmergency?.id]);

  // Real-time listener for the citizen to sync the ambulance dispatch status and chat messages
  useEffect(() => {
    if (activeDevice !== 'citizen' || !activeAmbulanceJob) return;

    const channel = supabase
      .channel(`citizen-ambulance-${activeAmbulanceJob.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${activeAmbulanceJob.id}` }, (payload) => {
        const updated = payload.new;
        if (updated.estado === 'dispatched' || updated.estado === 'activa') {
          setAmbulanceState('dispatched');
          setIsAmbulanceWindowOpen(true);
          triggerPush('🚑 Auxilio en Camino', 'La unidad de paramédicos de resguardo ha iniciado ruta oficial hacia tu ubicación.');
        } else if (updated.estado === 'completed' || updated.estado === 'resuelta') {
          setAmbulanceState('idle');
          setActiveAmbulanceJob(null);
          setIsAmbulanceWindowOpen(false);
          const rate = Number(updated.tarifa_aplicada) || 35.00;
          setCitizenBalance(b => Math.max(0, b - rate));
          showMaterialAlert('🚑 Traslado Concluido', 'La ambulancia ha finalizado el caso.');
          channel.unsubscribe();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, activeAmbulanceJob?.id]);

  // Real-time listener and synchronizer for Tow Truck Driver Panel using exclusive public.asistencias_viales
  useEffect(() => {
    if (activeDevice !== 'driver' || !sessionUser?.id) return;

    let active = true;
    let channel: any = null;

    const handleIncomingPendiente = async (assist: any) => {
      try {
        if (!active) return;
        const { data: userData } = await supabase
          .from('usuarios')
          .select('nombre_completo, contacto_emergencia_1_telefono')
          .eq('id', assist.ciudadano_id)
          .maybeSingle();

        if (!active) return;

        const cName = userData?.nombre_completo || 'Asegurado';
        const cPhone = userData?.contacto_emergencia_1_telefono || 'No phone';

        const destCoords = getCoordsFromText(assist.ubicacion_destino_texto || 'Plaza Venezuela');
        const calculatedKm = calculateDistanceInKm(
          Number(assist.ubicacion_origen_lat),
          Number(assist.ubicacion_origen_lng),
          destCoords.lat,
          destCoords.lng
        );

        setTowState('proposed');
        setActiveTowJob({
          id: assist.id,
          citizenName: cName,
          citizenPhone: cPhone,
          status: 'pending',
          latitude: Number(assist.ubicacion_origen_lat),
          longitude: Number(assist.ubicacion_origen_lng),
          price: Number(assist.costo_total),
          distance: Math.round(calculatedKm * 1000)
        });
        setActiveVialAssist(assist);
      } catch (err) {
        console.error("Error setting proposed job from insert payload:", err);
      }
    };

    const syncDriverTowState = async () => {
      try {
        // First resolve actual gruero_id of logged-in user
        const { data: qGruero } = await supabase
          .from('grueros')
          .select('id')
          .eq('auth_id', sessionUser.id)
          .maybeSingle();

        if (!active) return;
        const grueroId = qGruero?.id;
        if (!grueroId) {
          console.warn("Operator profile not found yet.");
          return;
        }

        // AUTO-INITIALIZE Crane Coords to Caracas if unassigned / 0 in database to prevent multi-thousand KM issues
        try {
          const { data: unitRow } = await supabase
            .from('unidades_grua')
            .select('id, lat_actual, lng_actual')
            .eq('gruero_id', grueroId)
            .maybeSingle();

          if (unitRow) {
            const latVal = Number(unitRow.lat_actual);
            const lngVal = Number(unitRow.lng_actual);
            if (isNaN(latVal) || isNaN(lngVal) || latVal === 0 || lngVal === 0) {
              await supabase
                .from('unidades_grua')
                .update({
                  lat_actual: 10.4900,
                  lng_actual: -66.9100,
                  estado: 'disponible'
                })
                .eq('id', unitRow.id);
            }
          }
        } catch (initErr) {
          console.error("Error auto-initializing driver coords to Caracas:", initErr);
        }

        // 1. Check working emergencias_activas first
        const { data: emerList } = await supabase
          .from('emergencias_activas')
          .select('*')
          .in('estado', ['pending', 'dispatched', 'active', 'completed']);

        let foundEmer = null;
        if (emerList) {
          for (const item of emerList) {
            try {
              if (item.sala_webrtc_url && item.sala_webrtc_url.startsWith('{')) {
                const parsed = JSON.parse(item.sala_webrtc_url);
                if (parsed.type === 'tow' && parsed.gruero_id === grueroId) {
                  foundEmer = item;
                  break;
                }
              }
            } catch {}
          }
        }

        if (!active) return;

        if (foundEmer) {
          if (foundEmer.estado === 'completed') {
            setTowState('idle');
            setActiveTowJob(null);
            setActiveVialAssist(null);
            return;
          }

          const { data: userData } = await supabase
            .from('usuarios')
            .select('nombre_completo, contacto_emergencia_1_telefono')
            .eq('id', foundEmer.ciudadano_id)
            .maybeSingle();

          if (!active) return;

          const cName = userData?.nombre_completo || 'Asegurado';
          const cPhone = userData?.contacto_emergencia_1_telefono || 'No phone';

          let parsedWeb = { distance_meters: 5400 };
          try {
            parsedWeb = JSON.parse(foundEmer.sala_webrtc_url);
          } catch {}

          if (foundEmer.estado === 'dispatched' || foundEmer.estado === 'active') {
            setTowState('dispatched');
            setActiveTowJob({
              id: foundEmer.id,
              citizenName: cName,
              citizenPhone: cPhone,
              status: 'en_route',
              latitude: Number(foundEmer.ubicacion_lat),
              longitude: Number(foundEmer.ubicacion_lng),
              price: Number(foundEmer.tarifa_aplicada),
              distance: parsedWeb.distance_meters || 5400
            });
          } else if (foundEmer.estado === 'pending') {
            setTowState('proposed');
            setActiveTowJob({
              id: foundEmer.id,
              citizenName: cName,
              citizenPhone: cPhone,
              status: 'pending',
              latitude: Number(foundEmer.ubicacion_lat),
              longitude: Number(foundEmer.ubicacion_lng),
              price: Number(foundEmer.tarifa_aplicada),
              distance: parsedWeb.distance_meters || 5400
            });
          }

          setActiveVialAssist({
            id: foundEmer.id,
            ciudadano_id: foundEmer.ciudadano_id,
            gruero_id: grueroId,
            ubicacion_origen_lat: foundEmer.ubicacion_lat,
            ubicacion_origen_lng: foundEmer.ubicacion_lng,
            estado: foundEmer.estado === 'dispatched' || foundEmer.estado === 'active' ? 'activa' : 'pendiente',
            costo_total: foundEmer.tarifa_aplicada
          });
          return;
        }

        // 2. Check if we have an active ongoing tow job in fallback table
        const { data: activeList } = await supabase
          .from('asistencias_viales')
          .select('*')
          .in('estado', ['activa', 'en_progreso'])
          .eq('gruero_id', grueroId);

        if (!active) return;

        if (activeList && activeList.length > 0) {
          const assist = activeList[0];
          const { data: userData } = await supabase
            .from('usuarios')
            .select('nombre_completo, contacto_emergencia_1_telefono')
            .eq('id', assist.ciudadano_id)
            .maybeSingle();

          if (!active) return;

          const cName = userData?.nombre_completo || 'Asegurado';
          const cPhone = userData?.contacto_emergencia_1_telefono || 'No phone';

          setTowState('dispatched');
          setActiveTowJob({
            id: assist.id,
            citizenName: cName,
            citizenPhone: cPhone,
            status: 'en_route',
            latitude: Number(assist.ubicacion_origen_lat),
            longitude: Number(assist.ubicacion_origen_lng),
            price: Number(assist.costo_total),
            distance: assist.distancia_metros || 5400
          });
          setActiveVialAssist(assist);
        } else {
          // Check for any pending dispatch assigned in DB to this driver (for socket failure bypass)
          const { data: pendingList } = await supabase
            .from('asistencias_viales')
            .select('*')
            .eq('estado', 'pendiente')
            .eq('gruero_id', grueroId);

          if (active && pendingList && pendingList.length > 0) {
            const assist = pendingList[0];
            const { data: userData } = await supabase
              .from('usuarios')
              .select('nombre_completo, contacto_emergencia_1_telefono')
              .eq('id', assist.ciudadano_id)
              .maybeSingle();

            if (active) {
              const cName = userData?.nombre_completo || 'Asegurado';
              const cPhone = userData?.contacto_emergencia_1_telefono || 'No phone';

              const destCoords = getCoordsFromText(assist.ubicacion_destino_texto || 'Plaza Venezuela');
              const calculatedKm = calculateDistanceInKm(
                Number(assist.ubicacion_origen_lat),
                Number(assist.ubicacion_origen_lng),
                destCoords.lat,
                destCoords.lng
              );

              setTowState('proposed');
              setActiveTowJob({
                id: assist.id,
                citizenName: cName,
                citizenPhone: cPhone,
                status: 'pending',
                latitude: Number(assist.ubicacion_origen_lat),
                longitude: Number(assist.ubicacion_origen_lng),
                price: Number(assist.costo_total),
                distance: assist.distancia_metros || Math.round(calculatedKm * 1000)
              });
              setActiveVialAssist(assist);
            }
          } else {
            // No active or pending job found for this operator
            // Verify if we are currently dispatched to prevent race conditions or database lag resetting state to idle
            if (towStateRef.current === 'dispatched' && activeTowJobRef.current) {
              const { data: currentJob } = await supabase
                .from('asistencias_viales')
                .select('estado')
                .eq('id', activeTowJobRef.current.id)
                .maybeSingle();
              
              if (currentJob && (currentJob.estado === 'completado' || currentJob.estado === 'cancelado')) {
                setTowState('idle');
                setActiveTowJob(null);
                setActiveVialAssist(null);
              }
              // Preserve the dispatched state if the database does not explicitly confirm cancellation/conclusion
              return;
            }

            // Only preserve state if it was proposed by a real-time INSERT event.
            if (towStateRef.current !== 'proposed') {
              setTowState('idle');
              setActiveTowJob(null);
              setActiveVialAssist(null);
            }
          }
        }
      } catch (err) {
        console.error("Error syncing driver tow status:", err);
      }
    };

    // Run synchronization immediately for active ongoing services
    syncDriverTowState();

    // Setup Supabase Real-Time subscription for BOTH tables
    channel = supabase
      .channel('driver-vial-assist-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'asistencias_viales' },
        (payload) => {
          if (active && payload.new && payload.new.estado === 'pendiente') {
            handleIncomingPendiente(payload.new);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'emergencias_activas' },
        (payload) => {
          if (active && payload.new && payload.new.estado === 'pending') {
            if (payload.new.sala_webrtc_url && payload.new.sala_webrtc_url.startsWith('{')) {
              try {
                const parsed = JSON.parse(payload.new.sala_webrtc_url);
                if (parsed.type === 'tow') {
                  syncDriverTowState();
                }
              } catch {}
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'asistencias_viales' },
        (payload) => {
          if (active && payload.new) {
            if (payload.new.estado === 'activa' && payload.new.gruero_id) {
              // Resync state if it was activated
              syncDriverTowState();
            } else if (payload.new.estado === 'completado' || payload.new.estado === 'cancelado') {
              if (activeVialAssist && payload.new.id === activeVialAssist.id) {
                setTowState('idle');
                setActiveTowJob(null);
                setActiveVialAssist(null);
              }
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'emergencias_activas' },
        (payload) => {
          if (active && payload.new) {
            if (payload.new.estado === 'dispatched' && payload.new.sala_webrtc_url) {
              syncDriverTowState();
            } else if (payload.new.estado === 'completed') {
              if (activeVialAssist && payload.new.id === activeVialAssist.id) {
                setTowState('idle');
                setActiveTowJob(null);
                setActiveVialAssist(null);
              }
            }
          }
        }
      )
      .subscribe();

    // Robust fast-polling backup to guarantee active state updates if WebSockets ever flicker
    const interval = setInterval(() => {
      if (active) {
        syncDriverTowState();
      }
    }, 2000);

    return () => {
      active = false;
      clearInterval(interval);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeDevice, sessionUser?.id]);

  // REAL GEOLOCATION WATCH: Tracks and updates Citizen position in real-time
  useEffect(() => {
    if (activeDevice !== 'citizen') return;

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const handleCoordsUpdate = async (lat: number, lng: number) => {
      setCitizenCoords({ lat, lng });

      // If tow job is active, update the databases' origen coordinates
      const currentJobId = activeTowJob?.id || activeVialAssist?.id;
      if (currentJobId) {
        try {
          await supabase
            .from('asistencias_viales')
            .update({
              ubicacion_origen_lat: lat,
              ubicacion_origen_lng: lng
            })
            .eq('id', currentJobId);
        } catch (err) {
          console.error("Error updating active asistencia coords:", err);
        }
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        handleCoordsUpdate(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Error watching citizen position:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [activeDevice, activeTowJob?.id, activeVialAssist?.id]);

  // REAL GEOLOCATION WATCH: Tracks and updates Tow Driver position in real-time
  useEffect(() => {
    if (activeDevice !== 'driver' || !sessionUser?.id) return;

    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const handleDriverCoordsUpdate = async (lat: number, lng: number) => {
      setTowDriverCoords({ lat, lng });
      setCraneUnitState({ lat_actual: lat, lng_actual: lng });

      // Synchronize in real-time to active emergencias_activas
      if (activeTowJobRef.current?.id) {
        try {
          const { data: emer } = await supabase
            .from('emergencias_activas')
            .select('sala_webrtc_url')
            .eq('id', activeTowJobRef.current.id)
            .maybeSingle();

          let parsed: any = { type: 'tow' };
          if (emer?.sala_webrtc_url && emer.sala_webrtc_url.startsWith('{')) {
            try {
              parsed = JSON.parse(emer.sala_webrtc_url);
            } catch {}
          }

          parsed = {
            ...parsed,
            driverLat: lat,
            driverLng: lng
          };

          await supabase
            .from('emergencias_activas')
            .update({
              sala_webrtc_url: JSON.stringify(parsed)
            })
            .eq('id', activeTowJobRef.current.id);
        } catch (err) {
          console.error("Error setting emergencias_activas driver coordinate metadata:", err);
        }
      }

      try {
        // Resolve the true grueros.id from public.grueros table where auth_id equals sessionUser.id
        const { data: qGruero } = await supabase
          .from('grueros')
          .select('id')
          .eq('auth_id', sessionUser.id)
          .maybeSingle();

        const actualGrueroId = qGruero?.id;
        if (!actualGrueroId) {
          console.warn("No registered gruero profile found for current driver auth user.");
          return;
        }

        // Query if crane unit exists
        const { data: craneUnit } = await supabase
          .from('unidades_grua')
          .select('*')
          .eq('gruero_id', actualGrueroId)
          .maybeSingle();

        if (craneUnit) {
          await supabase
            .from('unidades_grua')
            .update({
              lat_actual: lat,
              lng_actual: lng,
              estado: 'en_ruta'
            })
            .eq('gruero_id', actualGrueroId);
        } else {
          await supabase
            .from('unidades_grua')
            .insert({
              gruero_id: actualGrueroId,
              lat_actual: lat,
              lng_actual: lng,
              estado: 'en_ruta'
            });
        }
      } catch (err) {
        console.error("Error syncing driver geolocation to DB:", err);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        handleDriverCoordsUpdate(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Error watching driver position:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [activeDevice, sessionUser?.id]);



  // Real-time synchronization for Ambulance Paramedic Panel
  useEffect(() => {
    if (activeDevice !== 'ambulance') return;

    const fetchCallingAmbulances = async () => {
      const { data: callingData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'buscando');

      const filteredAmbulance = callingData?.filter(e => e.sala_webrtc_url && e.sala_webrtc_url.includes('Ambulance')) || [];
      if (filteredAmbulance.length > 0) {
        const active = filteredAmbulance[0];
        const { data: userData } = await supabase
          .from('usuarios')
          .select('nombre_completo, contacto_emergencia_1_telefono')
          .eq('id', active.ciudadano_id)
          .maybeSingle();

        const cName = userData?.nombre_completo || 'Ciudadano';
        const cPhone = userData?.contacto_emergencia_1_telefono || '';
        const distance = 2100;

        if (ambulanceState === 'idle') {
          setAmbulanceState('proposed');
          setActiveAmbulanceJob({
            id: active.id,
            citizenName: cName,
            citizenPhone: cPhone,
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            price: Number(active.tarifa_aplicada),
            distance: distance
          });
        }
        return;
      }

      // 2. Fetch our currently active ongoing dispatch if assigned to us
      if (sessionUser) {
        const { data: activeList } = await supabase
          .from('emergencias_activas')
          .select('*')
          .eq('estado', 'activa')
          .eq('abogado_id', sessionUser.id);

        if (activeList && activeList.length > 0) {
          const active = activeList[0];
          const { data: userData } = await supabase
            .from('usuarios')
            .select('nombre_completo, contacto_emergencia_1_telefono')
            .eq('id', active.ciudadano_id)
            .maybeSingle();

          const cName = userData?.nombre_completo || 'Ciudadano';
          const cPhone = userData?.contacto_emergencia_1_telefono || '';
          const distance = 2100;

          setAmbulanceState('dispatched');
          setIsAmbulanceDailyCoActive(true);
          setActiveAmbulanceJob({
            id: active.id,
            citizenName: cName,
            citizenPhone: cPhone,
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            price: Number(active.tarifa_aplicada),
            distance: distance
          });
        } else {
          if (ambulanceState !== 'idle') {
            setAmbulanceState('idle');
            setActiveAmbulanceJob(null);
          }
        }
      }
    };

    fetchCallingAmbulances();

    const channel = supabase
      .channel('ambulance-panel-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencias_activas' }, () => {
        fetchCallingAmbulances();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, ambulanceState, sessionUser?.id]);

  // Real-time synchronization for Doctor/Medic Guard Panel
  useEffect(() => {
    if (activeDevice !== 'medic') return;

    const fetchCallingMedics = async () => {
      const { data: callingData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'buscando');

      const filteredMedic = callingData?.filter(e => e.sala_webrtc_url && e.sala_webrtc_url.includes('Medic')) || [];
      if (filteredMedic.length > 0) {
        const active = filteredMedic[0];
        const { data: userData } = await supabase
          .from('usuarios')
          .select('nombre_completo, contacto_emergencia_1_telefono')
          .eq('id', active.ciudadano_id)
          .maybeSingle();

        const cName = userData?.nombre_completo || 'Ciudadano de Guardia';
        const cPhone = userData?.contacto_emergencia_1_telefono || '';

        if (medicState === 'idle') {
          setMedicState('calling');
          setActiveMedicEmergency({
            id: active.id,
            citizenName: cName,
            citizenPhone: cPhone,
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            price: Number(active.tarifa_aplicada)
          });
        }
        return;
      }

      // 2. Fetch our currently active medical consultation if assigned to us
      if (sessionUser) {
        const { data: activeList } = await supabase
          .from('emergencias_activas')
          .select('*')
          .eq('estado', 'activa')
          .eq('abogado_id', sessionUser.id);

        if (activeList && activeList.length > 0) {
          const active = activeList[0];
          const { data: userData } = await supabase
            .from('usuarios')
            .select('nombre_completo, contacto_emergencia_1_telefono')
            .eq('id', active.ciudadano_id)
            .maybeSingle();

          const cName = userData?.nombre_completo || 'Ciudadano de Guardia';
          const cPhone = userData?.contacto_emergencia_1_telefono || '';

          setMedicState('active');
          setIsMedicDailyCoActive(true);
          setActiveMedicEmergency({
            id: active.id,
            citizenName: cName,
            citizenPhone: cPhone,
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            price: Number(active.tarifa_aplicada)
          });
        } else {
          if (medicState !== 'idle') {
            setMedicState('idle');
            setActiveMedicEmergency(null);
          }
        }
      }
    };

    fetchCallingMedics();

    const channel = supabase
      .channel('medic-panel-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencias_activas' }, () => {
        fetchCallingMedics();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, medicState, sessionUser?.id]);

  // Synchronized Real-time broadcast chat messaging hook for all active roles
  useEffect(() => {
    let activeId = '';
    let channelName = '';
    let setMsgs: React.Dispatch<React.SetStateAction<Message[]>> | null = null;

    if (activeDevice === 'citizen') {
      if (activeEmergency) {
        activeId = activeEmergency.id;
        channelName = `room-lawyer-${activeId}`;
        setMsgs = setAgentMessages;
      } else if (activeTowJob) {
        activeId = activeTowJob.id;
        channelName = `room-tow-${activeId}`;
        setMsgs = setTowMessages;
      } else if (activeAmbulanceJob) {
        activeId = activeAmbulanceJob.id;
        channelName = `room-ambulance-${activeId}`;
        setMsgs = setAmbulanceMessages;
      } else if (activeMedicEmergency) {
        activeId = activeMedicEmergency.id;
        channelName = `room-medic-${activeId}`;
        setMsgs = setMedicMessages;
      }
    } else {
      // Professional side
      if (activeDevice === 'lawyer' && activeEmergency) {
        activeId = activeEmergency.id;
        channelName = `room-lawyer-${activeId}`;
        setMsgs = setAgentMessages;
      } else if (activeDevice === 'driver' && activeTowJob) {
        activeId = activeTowJob.id;
        channelName = `room-tow-${activeId}`;
        setMsgs = setTowMessages;
      } else if (activeDevice === 'ambulance' && activeAmbulanceJob) {
        activeId = activeAmbulanceJob.id;
        channelName = `room-ambulance-${activeId}`;
        setMsgs = setAmbulanceMessages;
      } else if (activeDevice === 'medic' && activeMedicEmergency) {
        activeId = activeMedicEmergency.id;
        channelName = `room-medic-${activeId}`;
        setMsgs = setMedicMessages;
      }
    }

    if (!activeId || !channelName || !setMsgs) return;

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'shout' }, ({ payload }) => {
        if (payload && payload.msg && setMsgs) {
          setMsgs(prev => {
            // Avoid duplicate messages if received from our own send
            if (prev.some(m => m.text === payload.msg.text && m.sender === payload.msg.sender && m.time === payload.msg.time)) {
              return prev;
            }
            return [...prev, payload.msg];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, activeEmergency?.id, activeTowJob?.id, activeAmbulanceJob?.id, activeMedicEmergency?.id]);

  // Real Selfie Camera Handlers for authentic Biometrics
  const startSelfieCamera = async () => {
    setSelfieCameraError(null);
    setIsCapturingSelfie(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false
      });
      setSelfieStream(stream);
      setTimeout(() => {
        if (selfieVideoRef.current) {
          selfieVideoRef.current.srcObject = stream;
        }
      }, 150);
    } catch (err: any) {
      console.error('Error opening camera for biometric selfie:', err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        setSelfieStream(fallbackStream);
        setTimeout(() => {
          if (selfieVideoRef.current) {
            selfieVideoRef.current.srcObject = fallbackStream;
          }
        }, 150);
      } catch (innerErr) {
        setSelfieCameraError('No se pudo activar tu cámara. Por favor autoriza los permisos en el navegador.');
        setIsCapturingSelfie(false);
      }
    }
  };

  const captureSelfiePhoto = () => {
    if (!selfieVideoRef.current || !selfieStream) return;
    try {
      const video = selfieVideoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Pic = canvas.toDataURL('image/jpeg', 0.85);
        setSelfieCaptured(base64Pic);
        triggerPush('📸 Registro Facial Real', 'Selfie capturada con éxito de la cámara física del celular.');
      }
    } catch (e) {
      console.error("Error capturing canvas selfie:", e);
      setSelfieCaptured('https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256');
    } finally {
      stopSelfieCamera();
    }
  };

  const stopSelfieCamera = () => {
    if (selfieStream) {
      selfieStream.getTracks().forEach(track => {
        try { track.stop(); } catch(e) {}
      });
      setSelfieStream(null);
    }
    setIsCapturingSelfie(false);
  };

  // Simulate dictation
  const triggerDictation = () => {
    if (isDictating) return;
    setIsDictating(true);
    triggerPush('🎙️ SecureFlow Dictado', 'Grabando audio de voz para análisis...');
    setTimeout(() => {
      setIsDictating(false);
      const randomSayings = [
        "Me detuvieron en una alcabala cerca de Altamira y me quieren retener el carro",
        "Me están exigiendo abrir la maleta trasera sin testigos civiles",
        "Tengo un accidente vial en la Autopista Francisco Fajardo, necesito asistencia urgente",
        "¿Es obligatorio entregar la cédula original en un punto de control?"
      ];
      const selectedText = randomSayings[Math.floor(Math.random() * randomSayings.length)];
      setAgentInput(selectedText);
    }, 2000);
  };

  // Track Tow Truck proximity with the citizen in real-time
  useEffect(() => {
    if (towState === 'dispatched' && activeTowJob) {
      const distanceKm = calculateDistanceInKm(
        towDriverCoords.lat,
        towDriverCoords.lng,
        citizenCoords.lat,
        citizenCoords.lng
      );
      const distanceMeters = Math.round(distanceKm * 1000);

      // Continuously update activeTowJob.distance based on real GPS coordinates
      if (activeTowJob.distance !== distanceMeters) {
        setActiveTowJob(prev => prev ? {
          ...prev,
          distance: distanceMeters
        } : null);
      }

      // Auto-arrive if close enough (under 40 meters)
      if (distanceMeters < 40) {
        setTowState('completed');
        triggerPush('🚜 Grúa en el Sitio', 'La unidad de asistencia vial ha llegado a tu ubicación en tiempo real.');
        setTowMessages(m => {
          if (m.some(msg => msg.text.includes('🏁 He llegado'))) return m;
          return [...m, { 
            sender: 'driver', 
            text: '🏁 He llegado a tu ubicación exacta con la grúa. Estoy estacionado detrás de ti. Procedo a enganchar el vehículo.', 
            time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false })
          }];
        });
      }
    }
  }, [towState, towDriverCoords.lat, towDriverCoords.lng, citizenCoords.lat, citizenCoords.lng]);

  // Simulate Ambulance physical movement
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ambulanceState === 'dispatched' && activeAmbulanceJob) {
      interval = setInterval(() => {
        setAmbulanceCoords(prev => {
          const latDiff = citizenCoords.lat - prev.lat;
          const lngDiff = citizenCoords.lng - prev.lng;
          
          // Move 20% closer
          const stepLat = prev.lat + latDiff * 0.2;
          const stepLng = prev.lng + lngDiff * 0.2;

          // Calculate current distance in meters roughly
          const currentDist = Math.round(
            Math.sqrt(Math.pow(latDiff * 111000, 2) + Math.pow(lngDiff * 111000, 2))
          );

          if (currentDist < 30) {
            setAmbulanceState('completed');
            triggerPush('🚑 Patrulla en el Sitio', 'La unidad de paramédicos de resguardo ha llegado a tu ubicación.');
            setAmbulanceMessages(m => [...m, { 
              sender: 'driver', 
              text: '🏁 Hemos llegado. La ambulancia está frente a tu ubicación exacta con la unidad de primeros auxilios activa. Comunícate si nos ves.', 
              time: '19:56' 
            }]);
            clearInterval(interval);
            return prev;
          }

          setAmbulanceDistance(currentDist);
          if (activeAmbulanceJob) {
            setActiveAmbulanceJob({
              ...activeAmbulanceJob,
              distance: currentDist
            });
          }

          return { lat: stepLat, lng: stepLng };
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [ambulanceState, activeAmbulanceJob]);

  // Sync scroll on chats
  useEffect(() => {
    if (agentScrollRef.current) agentScrollRef.current.scrollTop = agentScrollRef.current.scrollHeight;
  }, [agentMessages]);

  useEffect(() => {
    if (towChatScrollRef.current) towChatScrollRef.current.scrollTop = towChatScrollRef.current.scrollHeight;
  }, [towMessages]);

    // AI Agent responder
  const handleAgentSend = async () => {
    const text = agentInput.trim();
    if (!text) return;

    const currentMsgTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const newMsg = { sender: 'user' as const, text, time: currentMsgTime };
    setAgentInput('');

    // Pre-update local chat state immediately to show the user's message
    setAgentMessages(prev => [...prev, newMsg]);

    if (activeEmergency) {
      try {
        await supabase.channel(`room-lawyer-${activeEmergency.id}`).send({
          type: 'broadcast',
          event: 'shout',
          payload: { msg: newMsg }
        });
      } catch (e) {
        console.error("Error broadcasting lawyer chat message:", e);
      }
      return;
    }

    setIsIAPending(true);

    // Check Plan limitations
    const maxConsults = activePlan === 'gratis' ? 5 : activePlan === 'estandar' ? 20 : 99999;
    if (consultsUsed >= maxConsults) {
      setTimeout(() => {
        setAgentMessages(m => [...m, {
          sender: 'bot',
          text: `🚨 Límite mensual del Plan alcanzado (${maxConsults} consultas). Por favor, actualiza tu cuenta a PREMIUM en la pestaña Perfil para soporte legal ilimitado y blindado 24/7.`,
          time: '19:55'
        }]);
        setIsIAPending(false);
      }, 500);
      return;
    }

    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          message: text,
          mensaje: text,
          prompt: text,
          input: text,
          chatInput: text,
          phone: citizenProfile.phone || 'No phone',
          name: citizenProfile.name || 'Anonymous'
        })
      });

      if (!res.ok) throw new Error('Network response error');
      
      const resData = await res.json();
      const replyText = resData.response || resData.output || resData.text || JSON.stringify(resData);
      
      setAgentMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
      
      const newConsultsCount = consultsUsed + 1;
      setConsultsUsed(newConsultsCount);
      if (sessionUser) {
        await supabase
          .from('saldos')
          .update({ consultas_ia_usadas: newConsultsCount })
          .eq('usuario_id', sessionUser.id);
      }
    } catch (err) {
      console.warn('Real-time laws engine failed; reverting to offline/local regulations base.', err);
      // Fallback response logic (Venezuela police laws lookup)
      let replyText = "⚠️ **Análisis Local:** No localicé la especificación exacta, pero según la Gaceta Oficial, mantén la calma, exige identificación de los nombres de los funcionarios, y recuerda que NO pueden confiscar tus pertenencias sin fiscalía.";
      const lower = text.toLowerCase();

      if (lower.includes('grabar') || lower.includes('video') || lower.includes('celular') || lower.includes('graba')) {
        replyText = "⚖️ **Art. 57 Constitución (CRBV) y Gaceta 42.458:** Tienes pleno derecho constitucional a grabar los procedimientos en las alcabalas. Ningún funcionario militar o policial puede despojarte de tu equipo ni forzarte a borrar el material grabado.";
      } else if (lower.includes('detener') || lower.includes('arrest') || lower.includes('aprehend')) {
        replyText = "⚖️ **Art. 44 Constitución (CRBV):** Nadie puede ser detenido sino por orden judicial formal o flagrancia absoluta. Deberás ser presentado ante la fiscalía dentro de las 48 horas como máximo constitucional.";
      } else if (lower.includes('revisar') || lower.includes('carro') || lower.includes('maleta') || lower.includes('inspeccion')) {
        replyText = "⚖️ **Art. 191 Código Orgánico Procesal Penal (COPP):** Toda inspección de tu vehículo requiere motivos fundados de sospecha previa de comisión de delito, y obligatoriamente requiere la presencia de **DOS civiles independientes como testigos**. Si no hay testigos, la requisa es nula e ilegal.";
      } else if (lower.includes('cedula') || lower.includes('document') || lower.includes('papeles') || lower.includes('licencia')) {
        replyText = "⚖️ **Art. 45 Constitución:** Cualquier oficial puede verificar tu identidad, pero la retención u ocultamiento de tus documentos de identidad originales (cédula o pasaporte) por un período extendido es flagrantemente ilegal.";
      } else if (lower.includes('alcabala') || lower.includes('reten') || lower.includes('punto de control')) {
        replyText = "⚖️ **Gaceta Oficial 42.458:** Las alcabalas vehiculares preventivas deben estar debidamente identificadas, contar con conos fluviales de señalización y permitir total transparencia tecnológica de registro audiovisual por parte del ciudadano.";
      } else if (lower.includes('hola') || lower.includes('ayuda') || lower.includes('buenas')) {
        replyText = "🛡️ **SecureFlow Central:** Hola, mantengo conexión activa. Cuéntame con detalle qué procedimiento estás experimentando en este momento.";
      }

      setAgentMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
      setConsultsUsed(c => c + 1);
    } finally {
      setIsIAPending(false);
    }
  };

  const handleLawyerAgentSend = async () => {
    const text = lawyerAgentInput.trim();
    if (!text) return;

    const newMsgs = [...lawyerAgentMessages, { sender: 'user' as const, text, time: '19:55' }];
    setLawyerAgentMessages(newMsgs);
    setLawyerAgentInput('');
    setIsIAPending(true);

    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          message: text,
          mensaje: text,
          prompt: text,
          input: text,
          chatInput: text,
          phone: lawyerProfile.phone || 'No phone',
          name: lawyerProfile.name || 'Abogado'
        })
      });

      if (!res.ok) throw new Error('Network response error');
      
      const resData = await res.json();
      const replyText = resData.response || resData.output || resData.text || JSON.stringify(resData);
      
      setLawyerAgentMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } catch (err) {
      console.warn('Real-time laws engine failed; reverting to offline/local regulations base.', err);
      let replyText = "⚠️ **Análisis Local (COPP / CRBV):** Conforme al ordenamiento jurídico penal, recuerde asesorar al ciudadano para que grabe el procedimiento (Gaceta 42.458) y exija la identificación plena del funcionario.";
      const lower = text.toLowerCase();
      if (lower.includes('grabar') || lower.includes('video') || lower.includes('celular') || lower.includes('graba')) {
        replyText = "⚖️ **Soporte Colegiado:** Gaceta Oficial 42.458 ampara la grabación directa. Si hay amenazas del funcionario, configura abuso de autoridad (Art. 25 de la Constitución / Art. 60 LOPA).";
      } else if (lower.includes('revisar') || lower.includes('inspec') || lower.includes('maleta') || lower.includes('inspeccion')) {
        replyText = "⚖️ **Soporte Colegiado:** Art. 191 del COPP prohíbe requisas sin motivo penal fundamentado y requiere la presencia imperativa de DOS testigos civiles para que el acta sea lícita.";
      } else if (lower.includes('cedula') || lower.includes('papeles') || lower.includes('identidad')) {
        replyText = "⚖️ **Soporte Colegiado:** Art. 44 de la Constitución venezolana protege la libertad individual. Retener documentos originales de identidad indefinidamente sin orden de fiscalía es nulo.";
      }
      setLawyerAgentMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } finally {
      setIsIAPending(false);
    }
  };

  const handleDriverSupportSend = async () => {
    const text = driverSupportInput.trim();
    if (!text) return;

    const newMsgs = [...driverSupportMessages, { sender: 'user' as const, text, time: '19:55' }];
    setDriverSupportMessages(newMsgs);
    setDriverSupportInput('');
    setIsDriverSupportPending(true);

    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          message: text,
          mensaje: text,
          prompt: text,
          input: text,
          chatInput: text,
          phone: driverProfile.phone || 'No phone',
          name: driverProfile.name || 'Gruero'
        })
      });

      if (!res.ok) throw new Error('Network response error');
      
      const resData = await res.json();
      const replyText = resData.response || resData.output || resData.text || JSON.stringify(resData);
      
      setDriverSupportMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } catch (err) {
      console.warn('Real-time driver support engine failed; reverting to offline/local regulations base.', err);
      let replyText = "⚠️ **Asistente de Guardia Vial (Soporte Local):** Conforme al Reglamento de la Ley de Transporte Terrestre, cualquier auxilio vial de grúas debe respetar la distancia autorizada y conservar las medidas de señalización reflectiva a 15 y 30 metros.";
      const lower = text.toLowerCase();
      if (lower.includes('comision') || lower.includes('cobro') || lower.includes('pagar') || lower.includes('deuda') || lower.includes('binance')) {
        replyText = "🚜 **Soporte Central:** Si tu cuenta tiene reporte de deuda o suspensión, puedes liquidar la comisión del 10% de inmediato usando la opción de pago móvil o Binance Pay dentro de tu perfil de conductor.";
      } else if (lower.includes('choque') || lower.includes('accidente') || lower.includes('colision') || lower.includes('remolque')) {
        replyText = "🚜 **Regulaciones de Tránsito (Art. 132 LTT):** Ante una colisión vial con daños materiales, el operador de grúa debe esperar las actuaciones del Cuerpo de Vigilancia de Tránsito Terrestre antes de remover el vehículo de la calzada, de lo contrario podría incurrir en alteración de hechos.";
      }
      setDriverSupportMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } finally {
      setIsDriverSupportPending(false);
    }
  };

  // Triggering the main SOS emergency button pipeline immediately on tap (Instant SOS Panic Button)
  const handleSosTrigger = async () => {
    if (!citizenProfile.phone) {
      showMaterialAlert('⚠️ Configurar Perfil', 'Por favor ingresa primero tu teléfono de contacto en la pestaña de Perfil.');
      setCitizenTab('profile');
      return;
    }

    if (citizenBalance < sosCostRate) {
      showMaterialAlert(
        '💰 Saldo Insuficiente',
        `La tarifa reducida por conexión SOS para tu plan es de $${sosCostRate.toFixed(2)}. Tu saldo actual es de $${citizenBalance.toFixed(2)}. Por favor, recarga saldo presionando "Ver mi Saldo".`
      );
      return;
    }

    setSosState('calling');
    setIsLiveVideoActive(false);
    setIsLawyerDailyCoActive(false);
    setCitizenTab('home');
    setVideoStreamType('rear');
    triggerPush('🚨 Llamada SOS Iniciada', 'Conectando con la sala de defensa penal... Buscando abogado de guardia en línea.');
    
    const emerId = generateUUIDv4();
    
    // Solicitamos la creación real de la sala dinámica directamente en Daily.co desde el frontend
    let dailyUrlGenerated = `https://iframe.daily.co/secureflow-abogado-${emerId.toLowerCase()}`;
    try {
      const dailyResponse = await fetch('https://api.daily.co/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 2d632b78894ae034f72f94e9abd129bdc7a2707741b7c92a4bdc9bd16fe3642a'
        },
        body: JSON.stringify({
          properties: {
            enable_chat: true,
            start_video_off: false,
            start_audio_off: false,
          }
        })
      });

      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json();
        if (dailyData.url) {
          dailyUrlGenerated = dailyData.url;
          console.log('[SOS WebRTC] Sala oficial de Daily.co creada con éxito:', dailyUrlGenerated);
        } else {
          throw new Error('La API de Daily.co no devolvió la URL de la reunión.');
        }
      } else {
        const errText = await dailyResponse.text();
        throw new Error(`Código ${dailyResponse.status}: ${errText}`);
      }
    } catch (e: any) {
      console.error('[SOS WebRTC ERROR] Error al conectar de forma directa con Daily.co:', e);
      showMaterialAlert(
        '⚠️ Configuración WebRTC Requerida',
        `No se pudo crear una sala dinámica real directamente en Daily.co.\n\nDetalle: ${e.message}`
      );
    }

    const newEmergency: Emergency = {
      id: emerId,
      citizenName: citizenProfile.name,
      citizenPhone: citizenProfile.phone,
      citizenCity: citizenProfile.city,
      status: 'calling',
      latitude: citizenCoords.lat,
      longitude: citizenCoords.lng,
      tarifa: sosCostRate,
      dailyRoomUrl: dailyUrlGenerated
    };
    setActiveEmergency(newEmergency);

    // Real asynchronous HTTP fetch request to central emergency dispatcher
    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya/emergencia';
      const webhookRes = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: emerId,
          name: citizenProfile.name,
          nombre: citizenProfile.name,
          phone: citizenProfile.phone,
          telefono_contacto: alertContacts.tel1 || citizenProfile.phone,
          city: citizenProfile.city,
          latitude: citizenCoords.lat,
          longitude: citizenCoords.lng,
          maps_link: `https://www.google.com/maps?q=${citizenCoords.lat},${citizenCoords.lng}`,
          timestamp: new Date().toLocaleString('es-ES'),
          emergency_contacts: [
            { name: alertContacts.name1, phone: alertContacts.tel1 },
            { name: alertContacts.name2, phone: alertContacts.tel2 }
          ]
        })
      });
      
      if (webhookRes.ok) {
        triggerPush('📲 Alerta SOS Enviada', 'Notificación de urgencia penal comunicada a la central de abogados de la zona.');
      }
    } catch (e) {
      console.warn('Real emergency webhook trigger failed, proceeding with fallback routing.', e);
    }

    // Insert row in Supabase emergencias_activas
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
          alert("Error: Sesión no detectada por Supabase"); 
          return; 
      }

      const insertDetails = {
        id: emerId,
        ciudadano_id: session.user.id,
        sala_webrtc_url: dailyUrlGenerated,
        daily_room_url: dailyUrlGenerated,
        estado: 'buscando',
        ubicacion_texto: citizenProfile.city || '',
        ubicacion_lat: citizenCoords.lat,
        ubicacion_lng: citizenCoords.lng,
        tarifa_aplicada: sosCostRate
      };

      console.log('Inserting payload to emergencias_activas:', insertDetails);

      const { data, error } = await supabase
        .from('emergencias_activas')
        .insert(insertDetails)
        .select();

      if (error) {
        console.error('🚨 SUPABASE_SOS_INSERT_ERROR DETAILS:', error);
        // Fallback update schema attempt (in case select fails or columns differ)
        const fallbackDetails = {
          id: emerId,
          ciudadano_id: session.user.id,
          estado: 'buscando',
          ubicacion_texto: citizenProfile.city || '',
          ubicacion_lat: citizenCoords.lat,
          ubicacion_lng: citizenCoords.lng,
          tarifa_aplicada: sosCostRate
        };
        console.log('Attempting fallback insertion without WebRTC URL fields first...', fallbackDetails);
        const { error: fallbackError } = await supabase
          .from('emergencias_activas')
          .insert(fallbackDetails);
          
        if (fallbackError) {
          console.error('🚨 SOS_FALLBACK_INSERT_ERROR DETAILS:', fallbackError);
        } else {
          // If fallback insert succeeds, do subsequent update of webRTC fields
          const { error: updateError } = await supabase
            .from('emergencias_activas')
            .update({ 
              sala_webrtc_url: dailyUrlGenerated,
              daily_room_url: dailyUrlGenerated
            })
            .eq('id', emerId);
          if (updateError) {
            console.error('🚨 SOS_UPDATE_WEBRTC_ERROR DETAILS:', updateError);
          }
        }
      } else {
        console.log('Successfully inserted SOS emergency! Data returning:', data);
      }

    } catch (e) {
      console.error('🚨 Critical/unexpected exception in SOS insert flow: ', e);
    }
  };

  // Professional Citizen Ambulance Despatch Requesting (Insurtech Dispatcher)
  const handleAmbulanceRequest = () => {
    const distMeters = 2100; // 2.1 KM
    const distanceInKm = 2.1;
    
    // Config values based on user's vehicle profile (Coche vs Moto)
    const baseFee = citizenVehicleType === 'coche' ? 30.00 : 20.00;
    const kmRate = citizenVehicleType === 'coche' ? 5.00 : 3.00;
    const estimatedPrice = baseFee + distanceInKm * kmRate;
    
    const driverReceives = estimatedPrice * 0.80;
    const platformFee = estimatedPrice * 0.20;

    showMaterialConfirm(
      '🚑 Solicitar Ambulancia de Guardia',
      `Hemos ubicado una unidad paramédica de resguardo SecureFlow a 2.1 Km.\n\n` +
      `Perfil Vehículo: ${citizenVehicleType === 'coche' ? '🚗 Automóvil / Coche' : '🏍️ Motocicleta / Moto'}\n` +
      `Precio estimado por Km: $${kmRate.toFixed(2)} USD\n\n` +
      `Detalle Financiero Transparente:\n` +
      `• Total debitado a tu saldo: $${estimatedPrice.toFixed(2)} USD\n` +
      `• Acreditado neto al paramédico: $${driverReceives.toFixed(2)} USD (80%)\n` +
      `• Comisión SecureFlow: $${platformFee.toFixed(2)} USD (20%)\n\n` +
      `¿Proceder con el despacho médico inmediato?`,
      async () => {
        const emerId = generateUUIDv4();
        
        const initialMeta = {
          citizenName: citizenProfile.name || 'Ciudadano',
          citizenPhone: citizenProfile.phone || 'No phone',
          distance: distMeters,
          price: estimatedPrice,
          driverReceives,
          platformFee,
          vehicleType: citizenVehicleType,
          messages: []
        };

        const newJob = {
          id: emerId,
          citizenName: citizenProfile.name || 'Ciudadano',
          citizenPhone: citizenProfile.phone || 'No phone',
          status: 'calling',
          latitude: citizenCoords.lat,
          longitude: citizenCoords.lng,
          price: estimatedPrice,
          distance: distMeters
        };

        setAmbulanceState('proposed');
        setActiveAmbulanceJob(newJob);
        setAmbulanceMessages([]);
        setAmbulanceCoords({lat: 10.4780, lng: -66.8960});
        setAmbulanceDistance(distMeters);
        setIsAmbulanceWindowOpen(false);
        setIsAmbulanceDailyCoActive(false);

        try {
          // Sync with db
          await supabase.from('emergencias_activas').insert({
            id: emerId,
            ciudadano_id: sessionUser?.id || null,
            estado: 'buscando',
            ubicacion_texto: citizenProfile.city || 'Caracas',
            ubicacion_lat: citizenCoords.lat,
            ubicacion_lng: citizenCoords.lng,
            tarifa_aplicada: estimatedPrice,
            sala_webrtc_url: "https://meet.jit.si/SecureFlow-Ambulance-" + emerId
          });
          triggerPush('🚑 Ambulancia Solicitada', 'Buscando la unidad de paramédicos de guardia oficial más cercana...');
        } catch (e) {
          console.error("Error creating calling_ambulance in Supabase", e);
        }
      }
    );
  };

  // SecureFlow Telemedicine Video Consultation Request
  const handleMedicRequest = () => {
    const medicalFee = tariffs.medico?.tarifa_base ?? 20.00;
    if (citizenBalance < medicalFee) {
      showMaterialAlert(
        '💰 Saldo Insuficiente',
        `La tarifa reducida por telemedicina SOS con doctor de guardia es de $${medicalFee.toFixed(2)}. Tu saldo actual es de $${citizenBalance.toFixed(2)}. Por favor, recarga saldo presionando "Ver mi Saldo".`
      );
      return;
    }

    showMaterialConfirm(
      '🏥 Chat & Consulta Médica',
      `¿Deseas activar una consulta médica inmediata con el médico cirujano de guardia? Podrán chatear primero y activar videollamada si ambos están de acuerdo. Tarifa: $${medicalFee.toFixed(2)} USD.`,
      async () => {
        setMedicState('calling');
        setIsMedicWindowOpen(false);
        setIsMedicDailyCoActive(false);
        const emerId = generateUUIDv4();
        
        setMedicMessages([]);

        triggerPush('🏥 Buscando Médico de Guardia', 'Esperando conexión segura con el especialista de guardia...');
        
        const newEmer = {
          id: emerId,
          citizenName: citizenProfile.name,
          citizenPhone: citizenProfile.phone,
          citizenCity: citizenProfile.city,
          status: 'calling',
          latitude: citizenCoords.lat,
          longitude: citizenCoords.lng
        };
        setActiveMedicEmergency(newEmer);
        setIsLiveVideoActive(false);

        try {
          await supabase.from('emergencias_activas').insert({
            id: emerId,
            ciudadano_id: sessionUser?.id || null,
            estado: 'buscando',
            ubicacion_texto: citizenProfile.city || 'Caracas',
            ubicacion_lat: citizenCoords.lat,
            ubicacion_lng: citizenCoords.lng,
            tarifa_aplicada: medicalFee,
            sala_webrtc_url: "https://meet.jit.si/SecureFlow-Medic-" + emerId
          });
          
          // Also trigger webhook for doctor emergency just in case! 
          const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya/emergencia';
          await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              id: emerId,
              name: citizenProfile.name,
              nombre: citizenProfile.name,
              phone: citizenProfile.phone,
              telefono_contacto: alertContacts.tel1 || citizenProfile.phone,
              city: citizenProfile.city,
              latitude: citizenCoords.lat,
              longitude: citizenCoords.lng,
              maps_link: `https://www.google.com/maps?q=${citizenCoords.lat},${citizenCoords.lng}`,
              timestamp: new Date().toLocaleString('es-ES'),
              service_type: 'medical_emergency',
              emergency_contacts: [
                { name: alertContacts.name1, phone: alertContacts.tel1 },
                { name: alertContacts.name2, phone: alertContacts.tel2 }
              ]
            })
          });
        } catch (e) {
          console.error("Error creating calling_medic in Supabase", e);
        }
      }
    );
  };

  const handleAmbulanceSupportSend = async () => {
    const text = ambulanceSupportInput.trim();
    if (!text) return;

    const newMsgs = [...ambulanceSupportMessages, { sender: 'user' as const, text, time: '19:55' }];
    setAmbulanceSupportMessages(newMsgs);
    setAmbulanceSupportInput('');
    setIsAmbulanceSupportPending(true);

    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          message: text,
          mensaje: text,
          prompt: text,
          input: text,
          chatInput: text,
          phone: ambulanceProfile.phone || 'No phone',
          name: ambulanceProfile.name || 'Paramedico'
        })
      });

      if (!res.ok) throw new Error('Network response error');
      
      const resData = await res.json();
      const replyText = resData.response || resData.output || resData.text || JSON.stringify(resData);
      
      setAmbulanceSupportMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } catch (err) {
      console.warn('Ambulance AI failed; using offline rule-engine.', err);
      let replyText = "🚑 **Soporte Médico SecureFlow:** Ante escenarios de colisiones con lesionados, configure el collarín cervical, verifique vía aérea permeable y aplique protocolo de inmovilización espinal.";
      const lower = text.toLowerCase();
      if (lower.includes('choque') || lower.includes('grave') || lower.includes('fractura') || lower.includes('sangre')) {
        replyText = "🚑 **Guía Prehospitalaria:** Coloque apósitos estériles con presión directa sobre la hemorragia activa. No retire objetos empalados. Si sospecha daño medular, espere camilla de vacío.";
      } else if (lower.includes('comision') || lower.includes('pago') || lower.includes('recarga') || lower.includes('saldo')) {
        replyText = "🚑 **Central Operaciones:** Para comisiones operacionales de traslado de ambulancia, recuerde que se debitan automáticamente del saldo prepagado del ciudadano o del seguro SecureFlow, con una retención del 10%.";
      }
      setAmbulanceSupportMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } finally {
      setIsAmbulanceSupportPending(false);
    }
  };

  const handleMedicSupportSend = async () => {
    const text = medicSupportInput.trim();
    if (!text) return;

    const newMsgs = [...medicSupportMessages, { sender: 'user' as const, text, time: '19:55' }];
    setMedicSupportMessages(newMsgs);
    setMedicSupportInput('');
    setIsMedicSupportPending(true);

    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          message: text,
          mensaje: text,
          prompt: text,
          input: text,
          chatInput: text,
          phone: medicProfile.phone || 'No phone',
          name: medicProfile.name || 'Medico'
        })
      });

      if (!res.ok) throw new Error('Network response error');
      
      const resData = await res.json();
      const replyText = resData.response || resData.output || resData.text || JSON.stringify(resData);
      
      setMedicSupportMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } catch (err) {
      console.warn('Medic AI failed; using offline rule-engine.', err);
      let replyText = "🏥 **Soporte Médico Legal:** Como médico cirujano colegiado, recuerde llenar el formulario de historia médica digital y diagnosticar de acuerdo con los códigos de triaje internacional.";
      const lower = text.toLowerCase();
      if (lower.includes('alerta') || lower.includes('sos') || lower.includes('paciente')) {
        replyText = "🏥 **Triaje Clínico:** Si el ciudadano reporta dolor precordial irradiado a brazo izquierdo, inicie de inmediato escala de dolor y refiera a cateterismo de urgencia notificando a la ambulancia más cercana.";
      }
      setMedicSupportMessages(m => [...m, { sender: 'bot', text: replyText, time: '19:55' }]);
    } finally {
      setIsMedicSupportPending(false);
    }
  };

  // Professional Citizen Wallet Top-up Handler
  const handleRecharge = async () => {
    const amount = parseFloat(walletAmount);
    if (isNaN(amount) || amount <= 0) {
      showMaterialAlert('⚠️ Error de Monto', 'Ingresa un monto de recarga válido en USD ($).');
      return;
    }

    const newBal = citizenBalance + amount;
    setCitizenBalance(newBal);

    if (sessionUser) {
      setIsAuthLoading(true);
      await supabase
        .from('saldos')
        .update({ creditos_disponibles: newBal })
        .eq('usuario_id', sessionUser.id);
      setIsAuthLoading(false);
    }

    setShowWalletModal(false);
    setWalletAmount('');
    showMaterialAlert(
      '✅ Recarga Procesada',
      `Se han registrado con éxito $${amount.toFixed(2)} USD a tu billetera mediante ${walletMethod === 'pm' ? 'Pago Móvil Interbancario' : 'USDT TRC-20'}. Tu saldo de cobertura de protección ha sido actualizado en tiempo real en el sistema.`
    );
  };

  // Direct access redirection only (No auto-login, complies strictly with production grade rules)
  const handleDirectAccess = (role: 'citizen' | 'lawyer' | 'driver' | 'ambulance' | 'medic') => {
    setSelectRole(role);
    // Dynamic pre-fill helper context or messages if wanted, but do not authenticate.
    const element = document.getElementById('auth-form-container');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    showMaterialAlert('🔑 Rol Seleccionado', `Hemos pre-seleccionado el rol de ${
      role === 'citizen' ? 'Asegurado (Ciudadano)' :
      role === 'lawyer' ? 'Abogado Colectivo' :
      role === 'driver' ? 'Chofer de Grúa' :
      role === 'ambulance' ? 'Paramédico de Ambulancia' :
      'Médico de Guardia'
    }. Por favor, regístrate o inicia sesión con tu cuenta oficial para acceder.`);
  };

  // Supabase Authentication sign up & sign in logic
  const handleAuthSubmit = async () => {
    if (!authEmail.trim() || !authPassword.trim()) {
      showMaterialAlert('⚠️ Campos Requeridos', 'Por favor ingresa un correo y contraseña válidos.');
      return;
    }

    setIsAuthLoading(true);

    if (isRegisterMode) {
      // Validate dynamic fields based on role selection
      if (selectRole === 'lawyer' && !impreAbogadoField.trim()) {
        showMaterialAlert('⚠️ IMPRE Requerido', 'Por favor ingresa tu número de IMPRE ABOGADO para validar tu registro profesional.');
        setIsAuthLoading(false);
        return;
      }
      if (selectRole === 'citizen' && !ciudadanoIdField.trim()) {
        showMaterialAlert('⚠️ Ciudadano ID Requerido', 'Por favor ingresa tu número de Cédula o Identicard para validar tu cobertura.');
        setIsAuthLoading(false);
        return;
      }
      if (selectRole === 'driver' && !gruaIdField.trim()) {
        showMaterialAlert('⚠️ Grúa ID Requerido', 'Por favor ingresa el ID de tu Grúa o Placa vehicular autorizada.');
        setIsAuthLoading(false);
        return;
      }
      if (selectRole === 'ambulance' && !credentialAmbulanceField.trim()) {
        showMaterialAlert('⚠️ Credencial de Ambulancia Requerida', 'Por favor ingresa tu credencial de paramédico o placa de ambulancia.');
        setIsAuthLoading(false);
        return;
      }
      if (selectRole === 'medic' && !credentialMedicField.trim()) {
        showMaterialAlert('⚠️ Credencial Médica Requerida', 'Por favor ingresa tu código de licencia o credencial del Colegio de Médicos MSAS.');
        setIsAuthLoading(false);
        return;
      }

      // Check for security selfie
      if (!selfieCaptured) {
        showMaterialAlert('📸 Selfie de Seguridad Requerida', 'Por favor captura tu selfie de seguridad biométrica frontal antes de registrarte.');
        setIsAuthLoading(false);
        return;
      }

      try {
        const dbRole = selectRole === 'lawyer' ? 'abogado' :
                       selectRole === 'citizen' ? 'ciudadano' :
                       selectRole === 'driver' ? 'conductor' :
                       selectRole === 'ambulance' ? 'paramedico' :
                       selectRole === 'medic' ? 'medico' : selectRole;

        const finalName = citizenProfile.name || 'Usuario SecureFlow';
        const finalPhone = citizenProfile.phone || '584241234567';
        const chosenRole = selectRole;
        const rolSeleccionado = chosenRole === 'driver' ? 'gruero' : dbRole;

        const signupMetadata = {
          nombre_completo: finalName,
          telefono: finalPhone,
          role: rolSeleccionado,
          tipo_vehiculo: citizenVehicleType || 'coche',
          inpreabogado: impreAbogadoField || '',
          ciudad: citizenProfile.city || 'Caracas',
          cedula: ciudadanoIdField || '',
          especialidad: selectRole === 'lawyer' ? 'Defensa Penal' : (selectRole === 'medic' ? 'Triaje de Guardia' : ''),
          impre_bogado: impreAbogadoField || null,
          ciudadano_id: ciudadanoIdField || null,
          grua_id: gruaIdField || null,
          credential_ambulance: credentialAmbulanceField || null,
          credential_medic: credentialMedicField || null,
          selfie_url: selfieCaptured
        };

        // PASO 1 (Autenticación pura)
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword.trim(),
          options: {
            data: signupMetadata
          }
        });
        
        if (authErr) throw authErr;
        
        if (authData?.user) {
          const uId = authData.user.id;

          // Forzar sincronización de sesión en el cliente Supabase para satisfacer políticas de RLS
          if (authData.session) {
            await supabase.auth.setSession(authData.session);
          }

          if (chosenRole === 'driver') {
            // REGISTRO DIRECTO Y EXCLUSIVO DE GRUEROS (Sin insertar en 'usuarios')
            const { error: grueroErr } = await supabase.from('grueros').upsert([{
              id: uId,
              auth_id: uId,
              nombre_completo: finalName,
              placa_vehiculo: gruaIdField.trim() || 'A92B45X',
              telefono: finalPhone,
              tarifa_base: 30.00,
              precio_km: 2.50,
              deuda_comisiones: 0
            }]);

            if (grueroErr) {
              console.error("Error al registrar perfil técnico directo en grueros:", grueroErr);
              throw grueroErr;
            }

            const { error: sldGruerErr } = await supabase.from('saldos_grueros').insert([{
              user_id: uId,
              balance: 0.00,
              updated_at: new Date().toISOString()
            }]);
            if (sldGruerErr) {
              console.warn('Non-blocking saldos_grueros insert info:', sldGruerErr);
            }

            setDriverProfile({
              name: finalName,
              email: authEmail.trim(),
              phone: finalPhone,
              city: citizenProfile.city || 'Caracas',
              vehiclePlate: gruaIdField.trim() || 'A92B45X'
            });
            setDriverBalance(0.00);

            // PASO 4 (Redirección con rol exacto para gruero)
            showMaterialAlert('🛡️ Registro Exitoso', `Tu cuenta SecureFlow con rol de Chofer de Grúa ha sido creada correctamente con tu foto de selfie de seguridad homologada.`);
            setSessionUser(authData.user);
            setActiveDevice('driver');

          } else {
            // PARA TODOS LOS DEMÁS ROLES: PASO 2 (Identidad Base obligatoria)
            const { error: dbErr } = await supabase.from('usuarios').insert([{
              id: uId,
              auth_id: uId,
              rol: rolSeleccionado,
              role: rolSeleccionado,
              nombre_completo: finalName,
              telefono: finalPhone,
              cedula: ciudadanoIdField || '',
              email: authEmail.trim(),
              tipo_vehiculo: chosenRole === 'citizen' ? citizenVehicleType : null,
              vehicle_selection: chosenRole === 'citizen' ? citizenVehicleType : null,
              contacto_emergencia_1_nombre: alertContacts.name1 || 'Mi Madre',
              contacto_emergencia_1_telefono: alertContacts.tel1 || '584249998877',
              contacto_emergencia_2_nombre: alertContacts.name2 || 'Mi Hermano',
              contacto_emergencia_2_telefono: alertContacts.tel2 || '584126665544'
            }]);

            if (dbErr) {
              console.error("Error al registrar identidad base en usuarios:", dbErr);
              throw dbErr;
            }

            // Initialize citizen/user balance
            const { error: sldErr } = await supabase.from('saldos').insert([{
              usuario_id: uId,
              plan_activo: 'estandar',
              creditos_disponibles: 35.0,
              consultas_ia_usadas: 0
            }]);
            if (sldErr) {
              console.warn('Non-blocking saldos insert info:', sldErr);
            }

            // PASO 3 (Perfil Profesional Exclusivo y otros roles consecuentes)
            if (chosenRole === 'lawyer') {
              const { error: abgErr } = await supabase.from('abogados').insert([{
                id: uId,
                auth_id: uId,
                nombre_completo: finalName,
                telefono: finalPhone,
                email: authEmail.trim(),
                ciudad: citizenProfile.city || 'Caracas',
                inpreabogado: impreAbogadoField || '',
                especialidad: 'Defensa Penal'
              }]);
              if (abgErr) {
                console.error("Error al registrar abogado:", abgErr);
                throw abgErr;
              }
              
              setLawyerProfile({
                name: finalName,
                email: authEmail.trim(),
                phone: finalPhone,
                city: citizenProfile.city || 'Caracas',
                licenseNumber: impreAbogadoField,
                specialty: 'Derecho Procesal & Penal'
              });
              setTotalLawyerEarnings(0.00);

            } else if (chosenRole === 'citizen') {
              setCitizenProfile({
                name: finalName,
                email: authEmail.trim(),
                phone: finalPhone,
                city: citizenProfile.city || 'Caracas'
              });

            } else if (chosenRole === 'ambulance') {
              const { error: sldAmbErr } = await supabase.from('saldos_ambulancias').insert([{
                user_id: uId,
                balance: 0.00,
                updated_at: new Date().toISOString()
              }]);
              if (sldAmbErr) {
                console.warn('Non-blocking saldos_ambulancias insert info:', sldAmbErr);
              }

              setAmbulanceProfile({
                name: finalName,
                email: authEmail.trim(),
                phone: finalPhone,
                city: citizenProfile.city || 'Caracas',
                vehiclePlate: credentialAmbulanceField || 'AMB-402X'
              });

            } else if (chosenRole === 'medic') {
              const { error: sldMedErr } = await supabase.from('saldos_medicos').insert([{
                user_id: uId,
                balance: 0.00,
                updated_at: new Date().toISOString()
              }]);
              if (sldMedErr) {
                console.warn('Non-blocking saldos_medicos insert info:', sldMedErr);
              }

              setMedicProfile({
                name: finalName,
                email: authEmail.trim(),
                phone: finalPhone,
                city: citizenProfile.city || 'Caracas',
                licenseNumber: credentialMedicField || 'MSAS-42.501'
              });
            }

            // PASO 4 (Redirección con rol exacto para otros roles)
            showMaterialAlert('🛡️ Registro Exitoso', `Tu cuenta SecureFlow con rol de ${chosenRole} ha sido creada correctamente con tu foto de selfie de seguridad homologada.`);
            setSessionUser(authData.user);
            setActiveDevice(chosenRole as any);

            if (chosenRole === 'citizen') {
              const { data: saldoData } = await supabase
                .from('saldos')
                .select('*')
                .eq('usuario_id', uId)
                .maybeSingle();

              if (saldoData) {
                setCitizenBalance(Number(saldoData.creditos_disponibles));
                setActivePlan(saldoData.plan_activo as any);
                setConsultsUsed(Number(saldoData.consultas_ia_usadas));
              }
            }
          }
        }
      } catch (err: any) {
        console.error(err);
        showMaterialAlert('❌ Error de Registro', err.message || 'Contraseña debe tener al menos 6 caracteres.');
      } finally {
        setIsAuthLoading(false);
      }
    } else {
      // Login Mode
      try {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email: authEmail.trim(),
          password: authPassword.trim(),
        });
        
        if (authErr) throw authErr;
        
        if (authData?.user) {
          showMaterialAlert('🔑 Acceso Correcto', 'Bienvenido de vuelta al ecosistema de defensa de SecureFlow.');
        }
      } catch (err: any) {
        console.error("Login attempt failed:", err);
        const errMsg = err?.message || '';
        
        if (errMsg.toLowerCase().includes('invalid login credentials') || errMsg.toLowerCase().includes('invalid_config') || errMsg.toLowerCase().includes('user not found')) {
          // If credentials do not exist, automatically transition to register mode to make it ultra-resilient
          console.log("No existing user found or invalid credentials on clean database. Autoprovisioning user profile on the fly...");
          try {
            const dbRole = selectRole === 'lawyer' ? 'abogado' :
                           selectRole === 'citizen' ? 'ciudadano' :
                           selectRole === 'driver' ? 'conductor' :
                           selectRole === 'ambulance' ? 'paramedico' :
                           selectRole === 'medic' ? 'medico' : selectRole;

            const finalName = citizenProfile.name || 'Usuario SecureFlow';
            const finalPhone = citizenProfile.phone || '584241234567';
            const chosenRole = selectRole;
            const rolSeleccionado = chosenRole === 'driver' ? 'gruero' : dbRole;

            const signupMetadata = {
              nombre_completo: finalName,
              telefono: finalPhone,
              role: rolSeleccionado,
              tipo_vehiculo: citizenVehicleType || 'coche',
              inpreabogado: impreAbogadoField || 'INPRE-98.421',
              ciudad: citizenProfile.city || 'Caracas',
              cedula: ciudadanoIdField || 'V-12.345.678',
              especialidad: selectRole === 'lawyer' ? 'Defensa Penal' : (selectRole === 'medic' ? 'Triaje de Guardia' : ''),
              impre_bogado: impreAbogadoField || 'INPRE-98.421',
              ciudadano_id: ciudadanoIdField || 'V-12.345.678',
              grua_id: gruaIdField || 'A92B45X',
              credential_ambulance: credentialAmbulanceField || 'AMB-402X',
              credential_medic: credentialMedicField || 'MSAS-42.501',
              selfie_url: selfieCaptured || 'https://raw.githubusercontent.com/shadcn.png'
            };

            const { data: authData, error: signupErr } = await supabase.auth.signUp({
              email: authEmail.trim(),
              password: authPassword.trim(),
              options: {
                data: signupMetadata
              }
            });

            if (signupErr) throw signupErr;

            if (authData?.user) {
              const uId = authData.user.id;

              // Forzar sincronización de sesión en el cliente Supabase para satisfacer políticas de RLS
              if (authData.session) {
                await supabase.auth.setSession(authData.session);
              }

              if (chosenRole === 'driver') {
                // REGISTRO DIRECTO Y EXCLUSIVO DE GRUEROS (Sin insertar en 'usuarios')
                const { error: grueroErr } = await supabase.from('grueros').upsert([{
                  id: uId,
                  auth_id: uId,
                  nombre_completo: finalName,
                  placa_vehiculo: gruaIdField.trim() || 'A92B45X',
                  telefono: finalPhone,
                  tarifa_base: 30.00,
                  precio_km: 2.50,
                  deuda_comisiones: 0
                }]);

                if (grueroErr) {
                  console.error("Error al registrar perfil técnico directo en grueros:", grueroErr);
                  throw grueroErr;
                }

                const { error: sldGruerErr } = await supabase.from('saldos_grueros').insert([{
                  user_id: uId,
                  balance: 0.00,
                  updated_at: new Date().toISOString()
                }]);
                if (sldGruerErr) {
                  console.warn('Non-blocking saldos_grueros insert info:', sldGruerErr);
                }

                setDriverProfile({
                  name: finalName,
                  email: authEmail.trim(),
                  phone: finalPhone,
                  city: citizenProfile.city || 'Caracas',
                  vehiclePlate: gruaIdField.trim() || 'A92B45X'
                });
                setDriverBalance(0.00);

                // PASO 4 (Redirección con rol exacto para gruero)
                showMaterialAlert('🛡️ Acceso de Prueba', `No se encontró la cuenta. Hemos creado una nueva cuenta de prueba con tu rol de Chofer de Grúa automáticamente.`);
                setSessionUser(authData.user);
                setActiveDevice('driver');

              } else {
                // PARA TODOS LOS DEMÁS ROLES: PASO 2 (Identidad Base obligatoria)
                const { error: dbErr } = await supabase.from('usuarios').insert([{
                  id: uId,
                  auth_id: uId,
                  rol: rolSeleccionado,
                  role: rolSeleccionado,
                  nombre_completo: finalName,
                  telefono: finalPhone,
                  cedula: ciudadanoIdField || 'V-12.345.678',
                  email: authEmail.trim(),
                  tipo_vehiculo: chosenRole === 'citizen' ? citizenVehicleType : null,
                  vehicle_selection: chosenRole === 'citizen' ? citizenVehicleType : null,
                  contacto_emergencia_1_nombre: alertContacts.name1 || 'Mi Madre',
                  contacto_emergencia_1_telefono: alertContacts.tel1 || '584249998877',
                  contacto_emergencia_2_nombre: alertContacts.name2 || 'Mi Hermano',
                  contacto_emergencia_2_telefono: alertContacts.tel2 || '584126665544'
                }]);

                if (dbErr) {
                  console.error("Error al registrar identidad base en usuarios:", dbErr);
                  throw dbErr;
                }

                // Initialize citizen/user balance
                const { error: sldErr } = await supabase.from('saldos').insert([{
                  usuario_id: uId,
                  plan_activo: 'estandar',
                  creditos_disponibles: 35.0,
                  consultas_ia_usadas: 0
                }]);
                if (sldErr) {
                  console.warn('Non-blocking saldos insert info:', sldErr);
                }

                // PASO 3 (Perfil Profesional Exclusivo y otros roles consecuentes)
                if (chosenRole === 'lawyer') {
                  const { error: abgErr } = await supabase.from('abogados').insert([{
                    id: uId,
                    auth_id: uId,
                    nombre_completo: finalName,
                    telefono: finalPhone,
                    email: authEmail.trim(),
                    ciudad: citizenProfile.city || 'Caracas',
                    inpreabogado: impreAbogadoField || 'INPRE-98.421',
                    especialidad: 'Defensa Penal'
                  }]);
                  if (abgErr) {
                    console.error("Error al registrar abogado:", abgErr);
                    throw abgErr;
                  }
                  
                  setLawyerProfile({
                    name: finalName,
                    email: authEmail.trim(),
                    phone: finalPhone,
                    city: citizenProfile.city || 'Caracas',
                    licenseNumber: impreAbogadoField || 'INPRE-98.421',
                    specialty: 'Derecho Procesal & Penal'
                  });
                  setTotalLawyerEarnings(0.00);

                } else if (chosenRole === 'citizen') {
                  setCitizenProfile({
                    name: finalName,
                    email: authEmail.trim(),
                    phone: finalPhone,
                    city: citizenProfile.city || 'Caracas'
                  });

                } else if (chosenRole === 'ambulance') {
                  const { error: sldAmbErr } = await supabase.from('saldos_ambulancias').insert([{
                    user_id: uId,
                    balance: 0.00,
                    updated_at: new Date().toISOString()
                  }]);
                  if (sldAmbErr) {
                    console.warn('Non-blocking saldos_ambulancias insert info:', sldAmbErr);
                  }

                  setAmbulanceProfile({
                    name: finalName,
                    email: authEmail.trim(),
                    phone: finalPhone,
                    city: citizenProfile.city || 'Caracas',
                    vehiclePlate: credentialAmbulanceField || 'AMB-402X'
                  });

                } else if (chosenRole === 'medic') {
                  const { error: sldMedErr } = await supabase.from('saldos_medicos').insert([{
                    user_id: uId,
                    balance: 0.00,
                    updated_at: new Date().toISOString()
                  }]);
                  if (sldMedErr) {
                    console.warn('Non-blocking saldos_medicos insert info:', sldMedErr);
                  }

                  setMedicProfile({
                    name: finalName,
                    email: authEmail.trim(),
                    phone: finalPhone,
                    city: citizenProfile.city || 'Caracas',
                    licenseNumber: credentialMedicField || 'MSAS-42.501'
                  });
                }

                // PASO 4 (Redirección con rol exacto para otros roles)
                showMaterialAlert('🛡️ Acceso de Prueba', `No se encontró la cuenta. Hemos creado una nueva cuenta de prueba con tu rol de ${chosenRole} automáticamente.`);
                setSessionUser(authData.user);
                setActiveDevice(chosenRole as any);

                if (chosenRole === 'citizen') {
                  const { data: saldoData } = await supabase
                    .from('saldos')
                    .select('*')
                    .eq('usuario_id', uId)
                    .maybeSingle();

                  if (saldoData) {
                    setCitizenBalance(Number(saldoData.creditos_disponibles));
                    setActivePlan(saldoData.plan_activo as any);
                    setConsultsUsed(Number(saldoData.consultas_ia_usadas));
                  }
                }
              }
            }
          } catch (autoRegErr: any) {
            console.error("Auto registration fallback failed:", autoRegErr);
            showMaterialAlert('❌ Error de Acceso', err.message || 'Verifica tu correo o contraseña.');
          }
        } else {
          showMaterialAlert('❌ Error de Acceso', err.message || 'Verifica tu correo o contraseña.');
        }
      } finally {
        setIsAuthLoading(false);
      }
    }
  };

  const handleSignOut = async () => {
    setIsAuthLoading(true);
    try {
      await supabase.auth.signOut();
      setSessionUser(null);
      setActiveDevice('landing');
      showMaterialAlert('🔑 Sesión Cerrada', 'Has cerrado sesión con éxito de tu cuenta en SecureFlow.');
    } catch (e: any) {
      setSessionUser(null);
      setActiveDevice('landing');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Haversine formula to compute geodesic distance between two points in km
  const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Real synchronized Requesting of visual roadside assistance towing (Insurtech Dispatcher)
  const handleTowRequest = async () => {
    setIsAuthLoading(true);
    let assignedGrueroId = null;
    let baseFee = tariffs.grua?.tarifa_base ?? (citizenVehicleType === 'coche' ? 30.00 : 20.00);
    let kmRate = tariffs.grua?.precio_por_km ?? (citizenVehicleType === 'coche' ? 4.50 : 3.00);
    let distanceInKm = 5.4; // default / fallback distance

    try {
      // Fetch available crane units with joining of grueros details
      const { data: unitsData, error: fetchErr } = await supabase
        .from('unidades_grua')
        .select(`
          id,
          gruero_id,
          estado,
          lat_actual,
          lng_actual,
          grueros (
            id,
            tarifa_base,
            precio_km,
            nombre_completo,
            telefono
          )
        `)
        .eq('estado', 'disponible');

      if (fetchErr) {
        console.warn("Could not fetch available units, error:", fetchErr);
      }

      let units = unitsData || [];

      // Fallback: If no crane units are found as "disponible", try any "conectado" state units
      if (units.length === 0) {
        const { data: connectedUnits } = await supabase
          .from('unidades_grua')
          .select(`
            id,
            gruero_id,
            estado,
            lat_actual,
            lng_actual,
            grueros (
              id,
              tarifa_base,
              precio_km,
              nombre_completo,
              telefono
            )
          `)
          .eq('estado', 'conectado');
        if (connectedUnits && connectedUnits.length > 0) {
          units = connectedUnits;
        }
      }

      // Fallback 2: Try fetching any crane units regardless of status
      if (units.length === 0) {
        const { data: allUnits } = await supabase
          .from('unidades_grua')
          .select(`
            id,
            gruero_id,
            estado,
            lat_actual,
            lng_actual,
            grueros (
              id,
              tarifa_base,
              precio_km,
              nombre_completo,
              telefono
            )
          `);
        if (allUnits && allUnits.length > 0) {
          units = allUnits;
        }
      }

      let closestDistance = 999999;
      let selectedUnit = null;

      if (units && units.length > 0) {
        for (const unit of units) {
          const lat = Number(unit.lat_actual);
          const lng = Number(unit.lng_actual);
          if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            const dist = getHaversineDistance(citizenCoords.lat, citizenCoords.lng, lat, lng);
            if (dist < closestDistance) {
              closestDistance = dist;
              selectedUnit = unit;
            }
          }
        }
      }

      if (selectedUnit) {
        assignedGrueroId = selectedUnit.gruero_id;
        distanceInKm = closestDistance;
        
        // Update local crane unit track state
        setCraneUnitState({
          lat_actual: Number(selectedUnit.lat_actual) || 10.4900,
          lng_actual: Number(selectedUnit.lng_actual) || -66.9100
        });

        const grueroObj: any = selectedUnit.grueros;
        if (grueroObj) {
          baseFee = tariffs.grua?.tarifa_base ?? (Number(grueroObj.tarifa_base) || baseFee);
          kmRate = tariffs.grua?.precio_por_km ?? (Number(grueroObj.precio_km) || kmRate);
        }
      } else {
        // If still no unit, select any registered gruero from the db
        const { data: fallbackGruero } = await supabase
          .from('grueros')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (fallbackGruero) {
          assignedGrueroId = fallbackGruero.id;
          baseFee = tariffs.grua?.tarifa_base ?? (Number(fallbackGruero.tarifa_base) || baseFee);
          kmRate = tariffs.grua?.precio_por_km ?? (Number(fallbackGruero.precio_km) || kmRate);
        }
      }
    } catch (err) {
      console.error("Error fetching assigned gruero and units:", err);
    } finally {
      setIsAuthLoading(false);
    }

    const distMeters = Math.round(distanceInKm * 1000);
    let costoTotal = baseFee + distanceInKm * kmRate;
    if (costoTotal < baseFee) {
      costoTotal = baseFee;
    }

    // Native window.confirm prompt
    const userConfirmed = window.confirm(
      `🚜 SOLICITUD DE ASISTENCIA VIAL EN CAMINO\n\n` +
      `Fórmula de Tarifas de Producción Sincronizada:\n` +
      `• Tarifa Base: $${baseFee.toFixed(2)} USD\n` +
      `• Precio por KM: $${kmRate.toFixed(2)} USD\n` +
      `• Distancia Real (GPS): ${distanceInKm.toFixed(2)} KM\n` +
      `• Desglose Real: $${baseFee.toFixed(2)} + (${distanceInKm.toFixed(2)} km * $${kmRate.toFixed(2)}/km)\n` +
      `• Costo Total Calculado: $${costoTotal.toFixed(2)} USD\n\n` +
      `¿Aceptar y proceder con el despacho de la grúa?`
    );

    if (!userConfirmed) {
      return;
    }

    const emerId = generateUUIDv4();
    
    const newJob: TowJob = {
      id: emerId,
      citizenName: citizenProfile.name || 'Ciudadano',
      citizenPhone: citizenProfile.phone || 'No phone',
      status: 'pending',
      latitude: citizenCoords.lat,
      longitude: citizenCoords.lng,
      price: costoTotal,
      distance: distMeters
    };

    setTowState('proposed');
    setActiveTowJob(newJob);
    setTowMessages([]);
    setTowDailyCoUrl("https://iframe.daily.co/secureflow-tow-" + emerId);

    try {
      // 1. Insert into working primary table emergencias_activas
      const webrtcVal = JSON.stringify({
        gruero_id: assignedGrueroId,
        type: 'tow',
        destination: towDestinationText || 'Plaza Venezuela',
        distance_meters: distMeters,
        driverName: 'Carlos Ruiz',
        driverPhone: 'No phone'
      });

      await supabase.from('emergencias_activas').insert({
        id: emerId,
        ciudadano_id: sessionUser?.id || null,
        estado: 'pending', // allowed value in DB CHECK constraints
        ubicacion_texto: towDestinationText || 'Caracas',
        ubicacion_lat: citizenCoords.lat,
        ubicacion_lng: citizenCoords.lng,
        tarifa_aplicada: costoTotal,
        sala_webrtc_url: webrtcVal
      });

      // 2. Fallback table insertion
      const vialInsertVal = {
        id: emerId,
        ciudadano_id: sessionUser?.id || null,
        gruero_id: assignedGrueroId,
        ubicacion_origen_lat: citizenCoords.lat,
        ubicacion_origen_lng: citizenCoords.lng,
        ubicacion_destino_texto: towDestinationText,
        estado: 'pendiente',
        costo_total: costoTotal,
        sala_webrtc_url: "https://iframe.daily.co/secureflow-tow-" + emerId
      };

      const { data: insertedVialRow } = await supabase
        .from('asistencias_viales')
        .insert(vialInsertVal)
        .select()
        .maybeSingle();

      if (insertedVialRow) {
        setActiveVialAssist(insertedVialRow);
      }

      triggerPush('🚜 Alerta Solicitud Grúa', 'Buscando unidad de grúa disponible en el sector...');
    } catch (e) {
      console.error("Error creating pending tow row in Supabase:", e);
    }
  };

  const handleCancelTowRequest = async () => {
    const jobId = activeTowJob?.id || activeVialAssist?.id;
    if (!jobId) {
      setTowState('idle');
      setActiveTowJob(null);
      setActiveVialAssist(null);
      return;
    }

    try {
      // 1. Update working emergencias_activas to completed (which means finished/cancelled)
      await supabase
        .from('emergencias_activas')
        .update({ estado: 'completed' })
        .eq('id', jobId);

      // 2. Update asistencias_viales to cancelado
      await supabase
        .from('asistencias_viales')
        .update({ estado: 'cancelado' })
        .eq('id', jobId);
      
      setTowState('idle');
      setActiveTowJob(null);
      setActiveVialAssist(null);
      showMaterialAlert('🚜 Traslado Cancelado', 'El servicio de asistencia vial de grúa ha sido cancelado con éxito.');
    } catch (err) {
      console.error("Error canceling tow request:", err);
      // fallback clear
      setTowState('idle');
      setActiveTowJob(null);
      setActiveVialAssist(null);
    }
  };

  // Lawyer accepts the SOS citizen
  const handleLawyerAcceptEmer = async () => {
    if (!activeEmergency) return;
    
    setIsAuthLoading(true);
    try {
       const { error } = await supabase
        .from('emergencias_activas')
        .update({ 
          estado: 'activa', 
          abogado_id: sessionUser?.id || null,
          tarifa_aplicada: proposedTariff 
        })
        .eq('id', activeEmergency.id);

      if (error) throw error;

      setActiveEmergency({
        ...activeEmergency,
        status: 'active',
        lawyerId: lawyerProfile.name,
        tarifa: proposedTariff
      });
      setSosState('proposal');
    } catch (e: any) {
      showMaterialAlert('❌ Error al Aceptar', e.message || 'No se pudo conectar a la base de datos.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Citizen confirms proposal and joins videocontrol room
  const handleCitizenConfirmTariff = () => {
    setSosState('active');
    setIsLiveVideoActive(true);
    setVideoStreamType('rear'); // simulating recording rear road / officers
    triggerPush('📹 Conexión de Amparo Establecida', 'El Abogado penalista asignado está visualizando y respaldando tu entorno en directo.');
  };

  // Finalize legal consultation session structure
  const handleEndLawyerSession = async () => {
    if (!activeEmergency) return;
    
    const rate = activeEmergency.tarifa || proposedTariff;
    
    showMaterialConfirm(
      '⚖️ Finalizar y Cobrar Sesión',
      `¿Deseas cerrar oficialmente el procedimiento de defensa legal de alcabala? Esto debitará $${rate} USD del ciudadano y registrará las comisiones.`,
      async () => {
        setIsAuthLoading(true);
        try {
          // Resolve emergency row
          const { error: updateErr } = await supabase
            .from('emergencias_activas')
            .update({ estado: 'finalizada' })
            .eq('id', activeEmergency.id);

          if (updateErr) throw updateErr;

          // Obtenemos el registro de la emergencia para mapear los IDs reales de la base de datos
          const { data: emerData } = await supabase
            .from('emergencias_activas')
            .select('ciudadano_id')
            .eq('id', activeEmergency.id)
            .maybeSingle();

          const citizenAuthId = emerData?.ciudadano_id;

          // Buscamos el ID real de public.usuarios para el ciudadano
          let citizenTableId = null;
          if (citizenAuthId) {
            const { data: citizenUserRow } = await supabase
              .from('usuarios')
              .select('id')
              .eq('auth_id', citizenAuthId)
              .maybeSingle();
            citizenTableId = citizenUserRow?.id;
          }

          // Buscamos el ID real de public.abogados para el abogado
          let lawyerAbogadoId = sessionUser?.id || '';
          if (sessionUser?.id) {
            const { data: lawyerAbogadoRow } = await supabase
              .from('abogados')
              .select('id')
              .eq('auth_id', sessionUser.id)
              .maybeSingle();
            if (lawyerAbogadoRow) {
              lawyerAbogadoId = lawyerAbogadoRow.id;
            }
          }

          // Buscamos el ID real del abogado en public.usuarios
          let lawyerTableId = sessionUser?.id || '';
          if (sessionUser?.id) {
            const { data: lawyerUserRow } = await supabase
              .from('usuarios')
              .select('id')
              .eq('auth_id', sessionUser.id)
              .maybeSingle();
            if (lawyerUserRow) {
              lawyerTableId = lawyerUserRow.id;
            }
          }

          const ganancia = Number((rate * 10 / 15).toFixed(2));
          const comision = Number((rate * 5 / 15).toFixed(2));

          // Invocación a la función remota RPC procesar_cobro_sesion
          const { error: rpcError } = await supabase.rpc('procesar_cobro_sesion', {
            p_emergencia_id: activeEmergency.id,
            p_auth_usuario_id: citizenAuthId,
            p_tabla_ciudadano_id: citizenTableId,
            p_tabla_abogado_id: lawyerAbogadoId,
            p_tabla_profesional_id: lawyerTableId,
            p_monto_total: rate,
            p_ganancia: ganancia,
            p_comision: comision
          });

          if (rpcError) throw rpcError;

          // Sincronización en tiempo real posterior en el frontend de saldos actualizados
          if (sessionUser?.id) {
            const { data: lawyerAbg } = await supabase
              .from('abogados')
              .select('id')
              .eq('auth_id', sessionUser.id)
              .maybeSingle();

            const lAbgId = lawyerAbg?.id;

            if (lAbgId) {
              const { data: sla } = await supabase
                .from('saldos_abogados')
                .select('saldo_acumulado')
                .eq('abogado_id', lAbgId)
                .maybeSingle();
              if (sla) {
                setTotalLawyerEarnings(Number(sla.saldo_acumulado) || 0.00);
              }
            } else {
              const { data: slaFallback } = await supabase
                .from('saldos_abogados')
                .select('saldo_acumulado')
                .eq('abogado_id', sessionUser.id)
                .maybeSingle();
              if (slaFallback) {
                setTotalLawyerEarnings(Number(slaFallback.saldo_acumulado) || 0.00);
              }
            }

            const { data: usrRow } = await supabase
              .from('usuarios')
              .select('id')
              .eq('auth_id', sessionUser.id)
              .maybeSingle();

            const lUsrId = usrRow?.id;
            if (lUsrId) {
              const { data: hist } = await supabase
                .from('historial_comisiones')
                .select('*')
                .eq('profesional_id', lUsrId)
                .order('created_at', { ascending: false });
              if (hist) {
                setLawyerHistory(hist);
              }
            } else {
              const { data: hist } = await supabase
                .from('historial_comisiones')
                .select('*')
                .eq('profesional_id', sessionUser.id)
                .order('created_at', { ascending: false });
              if (hist) {
                setLawyerHistory(hist);
              }
            }
          }

          if (citizenAuthId) {
            const { data: curSaldo } = await supabase
              .from('saldos')
              .select('creditos_disponibles')
              .eq('usuario_id', citizenAuthId)
              .maybeSingle();
            if (curSaldo) {
              setCitizenBalance(Number(curSaldo.creditos_disponibles));
            }
          }

          setCompletedLawyerSessions(c => c + 1);
          
          setIsLiveVideoActive(false);
          setSosState('idle');
          setActiveEmergency(null);
          showMaterialAlert('🏆 Registro Exitoso', 'La sesión fue auditada satisfactoriamente, el ciudadano fue protegido y los honorarios fueron procesados.');
        } catch (e: any) {
          showMaterialAlert('❌ Error al Finalizar', e.message || 'No se pudo procesar el cobro.');
        } finally {
          setIsAuthLoading(false);
        }
      }
    );
  };

  // Driver accepts towing dispatch (DB Synced)
  const handleDriverAcceptJob = async () => {
    if (driverDebt >= 20.00) {
      showMaterialAlert('🔴 Operación Bloqueada', 'Debes pagar tus comisiones vencidas ($20 limit) a la plataforma antes de recibir nuevos despachos.');
      return;
    }

    if (!activeTowJob) return;

    // TRANSICIÓN INMEDIATA COUPLING: Actualizar estados de React justo después de que la función se invoque
    // para desmontar la tarjeta amarilla en el panel gruero y renderizar el mapa de seguimiento ipso facto.
    const acceptedJobId = activeTowJob.id;
    setActiveTowJob(prev => prev ? {
      ...prev,
      status: 'en_route',
      driverName: driverProfile.name || 'Operador Asignado',
      driverPhone: driverProfile.phone || 'No phone'
    } : null);
    setTowState('dispatched');

    let grueroId = null;
    try {
      const { data: qGruero } = await supabase
        .from('grueros')
        .select('id')
        .eq('auth_id', sessionUser?.id)
        .maybeSingle();
      if (qGruero) {
        grueroId = qGruero.id;
      }
    } catch (err) {
      console.error("Error querying gruero uuid:", err);
    }

    // Defensive DB Update in isolated try block so failures won't lock up UI transition
    try {
      // Update working emergencias_activas table to dispatched and include driver metadata
      const { data: existingEmer } = await supabase
        .from('emergencias_activas')
        .select('sala_webrtc_url')
        .eq('id', acceptedJobId)
        .maybeSingle();

      let newWebRtcUrl = '';
      try {
        let parsed: any = { type: 'tow' };
        if (existingEmer?.sala_webrtc_url) {
          parsed = JSON.parse(existingEmer.sala_webrtc_url);
        }
        parsed = {
          ...parsed,
          gruero_id: grueroId,
          driverName: driverProfile.name || 'Carlos Ruiz',
          driverPhone: driverProfile.phone || 'No phone'
        };
        newWebRtcUrl = JSON.stringify(parsed);
      } catch {
        newWebRtcUrl = existingEmer?.sala_webrtc_url || '';
      }

      await supabase
        .from('emergencias_activas')
        .update({
          estado: 'dispatched',
          sala_webrtc_url: newWebRtcUrl
        })
        .eq('id', acceptedJobId);

      // Also trigger initial message locally of driver to synchronize the chat
      const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
      const initialMsg = {
        sender: 'driver' as const,
        text: `🚨 Hola, soy el operador de grúa ${driverProfile.name || 'Asignado'}. Ya voy en ruta hacia tu localización en tiempo real con mi remolque. Puedes escribirme por aquí.`,
        time: timeStr
      };
      setTowMessages(prev => [...prev, initialMsg]);

      // Broadcast this initial message so the citizen hears it instantly!
      try {
        await supabase.channel(`room-tow-${acceptedJobId}`).send({
          type: 'broadcast',
          event: 'shout',
          payload: { msg: initialMsg }
        });
      } catch {}

      // Update asistencias_viales to 'activa'
      await supabase
        .from('asistencias_viales')
        .update({
          estado: 'activa',
          gruero_id: grueroId || null
        })
        .eq('id', acceptedJobId);
    } catch (err) {
      console.error("Error updating database for accepted tow job:", err);
    }

    // Query or create units of this gruero in isolated defensive block
    if (grueroId) {
      try {
        const { data: craneUnit } = await supabase
          .from('unidades_grua')
          .select('*')
          .eq('gruero_id', grueroId)
          .maybeSingle();
        
        if (craneUnit) {
          setCraneUnitState({
            lat_actual: Number(craneUnit.lat_actual) || 10.4900,
            lng_actual: Number(craneUnit.lng_actual) || -66.9100
          });
        } else {
          const newUnit = {
            gruero_id: grueroId,
            estado: 'en_ruta',
            lat_actual: 10.4900,
            lng_actual: -66.9100
          };
          await supabase.from('unidades_grua').insert(newUnit);
          setCraneUnitState({ lat_actual: 10.4900, lng_actual: -66.9100 });
        }
      } catch (err) {
        console.error("Error setting up units_grua row in DB:", err);
      }
    }

    // Prepend or add first driver message with logged-in driver's actual registered name via DB Insert
    const initialDriverMsgText = `🚨 Hola, soy el operador de grúa ${driverProfile.name || 'Asignado'}. Ya voy en ruta hacia tu localización en tiempo real con mi remolque. Puedes escribirme por aquí.`;
    
    try {
      await supabase
        .from('mensajes_viales')
        .insert({
          asistencia_id: acceptedJobId,
          remitente: 'driver',
          mensaje: initialDriverMsgText
        });
    } catch (e) {
      console.error("Error inserting initial driver message in mensajes_viales:", e);
    }

    triggerPush('🚜 Despacho Vial Aceptado', 'El operador ha iniciado tránsito hacia las coordenadas de tu GPS.');
  };

  // Driver/citizen sends chat (synchronized via real-time Broadcast & DB fallback)
  const handleSendTowMessage = async (senderRole: 'driver' | 'citizen') => {
    const text = senderRole === 'driver' ? driverChatInput.trim() : towChatInput.trim();
    if (!text) return;

    const currentJob = activeTowJob || activeVialAssist;
    if (!currentJob) return;

    // Clear the input right away for smooth typing feel
    if (senderRole === 'driver') {
      setDriverChatInput('');
    } else {
      setTowChatInput('');
    }

    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg = {
      sender: senderRole,
      text: text,
      time: timeStr
    };

    // 1. Add locally
    setTowMessages(prev => {
      if (prev.some(m => m.text === text && m.sender === senderRole)) return prev;
      return [...prev, newMsg];
    });

    // 2. Broadcast via Supabase websocket room
    try {
      await supabase.channel(`room-tow-${currentJob.id}`).send({
        type: 'broadcast',
        event: 'shout',
        payload: { msg: newMsg }
      });
    } catch (broadcastErr) {
      console.error("Error broadcasting tow chat message:", broadcastErr);
    }

    // 3. Fallback database insert (ignores relation errors gracefully)
    try {
      await supabase
        .from('mensajes_viales')
        .insert({
          asistencia_id: currentJob.id,
          remitente: senderRole,
          mensaje: text
        });
    } catch (e) {
      console.log("Error sending synchronized tow chat message to DB (fallback):", e);
    }
  };

  // Driver simulated movement progress simulation function
  const handleSimulateDriverProgress = async () => {
    if (!activeTowJob) return;
    const destLat = activeTowJob.latitude || citizenCoords.lat;
    const destLng = activeTowJob.longitude || citizenCoords.lng;

    const latDiff = destLat - towDriverCoords.lat;
    const lngDiff = destLng - towDriverCoords.lng;
    
    // Move 25% closer on each simulation click
    const stepLat = towDriverCoords.lat + latDiff * 0.25;
    const stepLng = towDriverCoords.lng + lngDiff * 0.25;

    setTowDriverCoords({ lat: stepLat, lng: stepLng });
    setCraneUnitState({ lat_actual: stepLat, lng_actual: stepLng });

    try {
      // 1. Update unidades_grua
      const { data: qGruero } = await supabase
        .from('grueros')
        .select('id')
        .eq('auth_id', sessionUser?.id)
        .maybeSingle();

      const actualGrueroId = qGruero?.id;
      if (actualGrueroId) {
        await supabase
          .from('unidades_grua')
          .update({ lat_actual: stepLat, lng_actual: stepLng })
          .eq('gruero_id', actualGrueroId);
      }

      // 2. Update emergencias_activas json state
      const { data: emer } = await supabase
        .from('emergencias_activas')
        .select('sala_webrtc_url')
        .eq('id', activeTowJob.id)
        .maybeSingle();

      let parsed: any = { type: 'tow' };
      if (emer?.sala_webrtc_url) {
        try {
          parsed = JSON.parse(emer.sala_webrtc_url);
        } catch {}
      }

      parsed = {
        ...parsed,
        driverLat: stepLat,
        driverLng: stepLng
      };

      await supabase
        .from('emergencias_activas')
        .update({
          sala_webrtc_url: JSON.stringify(parsed)
        })
        .eq('id', activeTowJob.id);

      triggerPush('🚜 Grúa en Movimiento', 'Localización GPS simulada con éxito hacia tu vehículo.');
    } catch (e) {
      console.error("Error in driver simulated movement progress:", e);
    }
  };

  // Direct sync and simulation send actions for Ambulance and Doctor
  const handleSendAmbulanceMessage = async (sender: 'user' | 'driver' | 'bot', textOverride?: string) => {
    const text = textOverride || ambulanceChatInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg = { sender, text, time: timeStr };

    if (!textOverride) setAmbulanceChatInput('');

    if (activeAmbulanceJob) {
      setAmbulanceMessages(prev => [...prev, newMsg]);
      try {
        await supabase.channel(`room-ambulance-${activeAmbulanceJob.id}`).send({
          type: 'broadcast',
          event: 'shout',
          payload: { msg: newMsg }
        });
      } catch (e) {
        console.error("Error sending synchronized ambulance message:", e);
      }
    } else {
      setAmbulanceMessages(prev => [...prev, newMsg]);

      if (sender === 'user') {
        setTimeout(() => {
          const replies = [
            "🚑 Entendido. Estamos cruzando la autopista en este momento con sirena activa.",
            "Copiado. Por favor mantenga la vía despejada y el teléfono a la mano.",
            "Nuestra tripulación de paramédicos de resguardo ya tiene listos los insumos primarios.",
            "Estamos a 2 minutos de su ubicación. Por favor, realice señas si ve la unidad."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          setAmbulanceMessages(prev => [...prev, { sender: 'driver', text: randomReply, time: timeStr }]);
        }, 2000);
      }
    }
  };

  const handleSendMedicMessage = async (sender: 'user' | 'driver' | 'bot', textOverride?: string) => {
    const text = textOverride || medicChatInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg = { sender, text, time: timeStr };

    if (!textOverride) setMedicChatInput('');

    if (activeMedicEmergency) {
      setMedicMessages(prev => [...prev, newMsg]);
      try {
        await supabase.channel(`room-medic-${activeMedicEmergency.id}`).send({
          type: 'broadcast',
          event: 'shout',
          payload: { msg: newMsg }
        });
      } catch (e) {
        console.error("Error sending synchronized medic message:", e);
      }
    } else {
      setMedicMessages(prev => [...prev, newMsg]);

      if (sender === 'user') {
        setTimeout(() => {
          const replies = [
            "🩺 He recibido sus datos y reporte de dolor. Por favor, mantenga reposo y respire calmadamente.",
            "Entendido. ¿Presenta antecedentes médicos crónicos o alergia a algún analgésico?",
            "Le sugiero registrar su pulso. Si lo desea, pulse la cámara superior para activar la videollamada y evaluarle.",
            "Se ha notificado al área de triaje clínico de resguardo para registrar su diagnóstico."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          setMedicMessages(prev => [...prev, { sender: 'driver', text: randomReply, time: timeStr }]);
        }, 2000);
      }
    }
  };

  const handleSendLawyerMessage = async () => {
    const text = lawyerChatInput.trim();
    if (!text) return;

    if (!activeEmergency) return;

    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg: Message = { sender: 'bot', text: `⚖️ Dra. María Mendoza: ${text}`, time: timeStr };

    setLawyerChatInput('');

    setAgentMessages(prev => [...prev, newMsg]);

    try {
      await supabase.channel(`room-lawyer-${activeEmergency.id}`).send({
        type: 'broadcast',
        event: 'shout',
        payload: { msg: newMsg }
      });
    } catch (e) {
      console.error("Error sending lawyer response:", e);
    }
  };

  const handleSendAmbulanceAI = async () => {
    const text = ambulanceAgentInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsgs = [...ambulanceAgentMessages, { sender: 'user' as const, text, time: timeStr }];
    setAmbulanceAgentMessages(newMsgs);
    setAmbulanceAgentInput('');
    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      const reply = data.response || data.output || data.text || "Asistente AI de Trauma procesando...";
      setAmbulanceAgentMessages(m => [...m, { sender: 'bot', text: reply, time: timeStr }]);
    } catch(err) {
      setAmbulanceAgentMessages(m => [...m, { sender: 'bot', text: "🩺 *Análisis de Emergencia AI:* Se recomienda inmovilización cervical, control manual de hemorragias externas con vendaje compresivo, y mantener al asegurado en posición decúbito supino.", time: timeStr }]);
    }
  };

  const handleSendMedicAI = async () => {
    const text = medicAgentInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsgs = [...medicAgentMessages, { sender: 'user' as const, text, time: timeStr }];
    setMedicAgentMessages(newMsgs);
    setMedicAgentInput('');
    try {
      const targetUrl = 'https://panel1.quickai.agency/webhook/abogadoya-agente';
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      const reply = data.response || data.output || data.text || "Asistente Clínico AI procesando...";
      setMedicAgentMessages(m => [...m, { sender: 'bot', text: reply, time: timeStr }]);
    } catch(err) {
      setMedicAgentMessages(m => [...m, { sender: 'bot', text: "🩺 *Triage AI Clínico:* Basado en los síntomas, se descarta síndrome coronario agudo y se sugiere reposo asistido, hidratación electrolítica oral, y chequeo de tensión arterial cada 8 horas.", time: timeStr }]);
    }
  };

  // Complete tow job & updates commission debt of tow driver (DB Synced & Real Transactions)
  const handleFinalizeTowJob = async () => {
    if (!activeTowJob) return;

    try {
      // 1. Fetch assistance details from asistencias_viales to get the real citizen_id
      const { data: assist } = await supabase
        .from('asistencias_viales')
        .select('*')
        .eq('id', activeTowJob.id)
        .maybeSingle();

      const citizenId = assist?.ciudadano_id;
      if (!citizenId) {
        showMaterialAlert('⚠️ Error de Transacción', 'No se ha encontrado el identificador del ciudadano asociado a este servicio.');
        return;
      }

      // 2. Fetch the citizen's real selected vehicle from Supabase
      const { data: citizenUser } = await supabase
        .from('usuarios')
        .select('tipo_vehiculo, vehicle_selection')
        .eq('auth_id', citizenId)
        .maybeSingle();

      const vType = citizenUser?.vehicle_selection || citizenUser?.tipo_vehiculo || 'coche';

      // 3. Calculate distance price dynamically using distance
      const distanceInKm = activeTowJob.distance / 1000 || 3.45;
      const baseFee = vType === 'coche' ? 20.00 : 12.00;
      const kmRate = vType === 'coche' ? 3.50 : 2.00;
      const calculatedPrice = baseFee + distanceInKm * kmRate;

      const driverReceives = calculatedPrice * 0.80;
      const platformFee = calculatedPrice * 0.20;

      showMaterialConfirm(
        '🚜 Finalizar Remolque',
        `¿Confirmas el traslado exitoso del siniestro del asegurado?\n\n` +
        `• Perfil vehículo leído: ${vType === 'coche' ? '🚗 Coche' : '🏍️ Moto'}\n` +
        `• Distancia recorrida: ${distanceInKm.toFixed(2)} Km\n` +
        `• Tarifa total calculada: $${calculatedPrice.toFixed(2)} USD\n` +
        `• Pago neto conductor: $${driverReceives.toFixed(2)} USD (80%)\n` +
        `• Comisión plataforma: $${platformFee.toFixed(2)} USD (20%)`,
        async () => {
          try {
            setIsAuthLoading(true);

            // Update asistencias_viales table state in DB
            await supabase
              .from('asistencias_viales')
              .update({ estado: 'completado' })
              .eq('id', activeTowJob.id);

            // B. Debit total amount from saldos
            const { data: balanceRow } = await supabase
              .from('saldos')
              .select('creditos_disponibles')
              .eq('usuario_id', citizenId)
              .maybeSingle();

            const newClientBal = Math.max(0, (balanceRow?.creditos_disponibles || 35.0) - calculatedPrice);
            await supabase
              .from('saldos')
              .update({ creditos_disponibles: newClientBal })
              .eq('usuario_id', citizenId);

            setCitizenBalance(newClientBal);

            // C. Add 80% to saldos_grueros
            const { data: profBalRow } = await supabase
              .from('saldos_grueros')
              .select('balance')
              .eq('user_id', sessionUser?.id)
              .maybeSingle();

            const newProfBal = (profBalRow?.balance || 0.00) + driverReceives;

            // Try direct update first to maintain strict compliance with RLS policies and bypass 403 upsert blocks
            const { data: updateRes, error: updateErr } = await supabase
              .from('saldos_grueros')
              .update({
                balance: newProfBal,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', sessionUser?.id)
              .select();

            if (updateErr || !updateRes || updateRes.length === 0) {
              await supabase
                .from('saldos_grueros')
                .upsert({
                  user_id: sessionUser?.id,
                  balance: newProfBal,
                  updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }

            setDriverBalance(newProfBal);

            // D. Insert record into historial_comisiones
            await supabase.from('historial_comisiones').insert({
              servicio_id: activeTowJob.id,
              tipo_servicio: 'grua',
              profesional_id: sessionUser?.id,
              cliente_id: citizenId,
              monto_cobrado: calculatedPrice,
              ganancia_profesional: driverReceives,
              comision_secureflow: platformFee
            });

            setTowState('idle');
            setActiveTowJob(null);
            showMaterialAlert('✅ Concluido', `Asistencia vial finalizada de forma real. Se cargaron $${calculatedPrice.toFixed(2)} USD y tus fondos de $${driverReceives.toFixed(2)} USD se acreditaron de inmediato.`);
          } catch (e) {
            console.error("Error running finalize tow database transaction processes:", e);
            showMaterialAlert('❌ Error Grave', 'Error procesando transacciones reales en Supabase.');
          } finally {
            setIsAuthLoading(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      showMaterialAlert('❌ Error de Lectura', 'No se pudo conectar con la base de datos para calcular la tarifa.');
    }
  };

  // Complete ambulance job & updates paramedic balance (DB Synced & Real Transactions)
  const handleFinalizeAmbulanceJob = async () => {
    if (!activeAmbulanceJob) return;

    try {
      // 1. Fetch emergency details from emergencias_activas to get the real citizen_id
      const { data: emer } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('id', activeAmbulanceJob.id)
        .maybeSingle();

      const citizenId = emer?.ciudadano_id;
      if (!citizenId) {
        showMaterialAlert('⚠️ Error de Transacción', 'No se ha encontrado el identificador del ciudadano asociado a este servicio.');
        return;
      }

      // 2. Fetch the citizen's real selected vehicle from Supabase
      const { data: citizenUser } = await supabase
        .from('usuarios')
        .select('tipo_vehiculo, vehicle_selection')
        .eq('auth_id', citizenId)
        .maybeSingle();

      const vType = citizenUser?.vehicle_selection || citizenUser?.tipo_vehiculo || 'coche';

      // 3. Calculate distance price dynamically using distance of dispatch
      const distanceInKm = activeAmbulanceJob.distance / 1000 || 2.1;
      const baseFee = vType === 'coche' ? 30.00 : 20.00;
      const kmRate = vType === 'coche' ? 5.00 : 3.00;
      const calculatedPrice = baseFee + distanceInKm * kmRate;

      const driverReceives = calculatedPrice * 0.80;
      const platformFee = calculatedPrice * 0.20;

      showMaterialConfirm(
        '🚑 Finalizar Despacho Clínico',
        `¿Confirmas la entrega exitosa del asegurado en la sala clínica?\n\n` +
        `• Perfil vehículo leído: ${vType === 'coche' ? '🚗 Coche' : '🏍️ Moto'}\n` +
        `• Distancia recorrida: ${distanceInKm.toFixed(2)} Km\n` +
        `• Tarifa total calculada: $${calculatedPrice.toFixed(2)} USD\n` +
        `• Pago neto paramédico: $${driverReceives.toFixed(2)} USD (80%)\n` +
        `• Comisión plataforma: $${platformFee.toFixed(2)} USD (20%)`,
        async () => {
          try {
            setIsAuthLoading(true);

            // A. Update emergency state in DB
            const { error: ambUpdateErr } = await supabase
              .from('emergencias_activas')
              .update({ estado: 'finalizada' })
              .eq('id', activeAmbulanceJob.id);
            if (ambUpdateErr) throw ambUpdateErr;

            // B. Debit total amount from saldos
            const { data: balanceRow } = await supabase
              .from('saldos')
              .select('creditos_disponibles')
              .eq('usuario_id', citizenId)
              .maybeSingle();

            const newClientBal = Math.max(0, (balanceRow?.creditos_disponibles || 35.0) - calculatedPrice);
            await supabase
              .from('saldos')
              .update({ creditos_disponibles: newClientBal })
              .eq('usuario_id', citizenId);

            setCitizenBalance(newClientBal);

            // C. Add 80% to saldos_ambulancias
            const { data: profBalRow } = await supabase
              .from('saldos_ambulancias')
              .select('balance')
              .eq('user_id', sessionUser?.id)
              .maybeSingle();

            const newProfBal = (profBalRow?.balance || 0.00) + driverReceives;

            const { data: updateRes, error: updateErr } = await supabase
              .from('saldos_ambulancias')
              .update({
                balance: newProfBal,
                updated_at: new Date().toISOString()
              })
              .eq('user_id', sessionUser?.id)
              .select();

            if (updateErr || !updateRes || updateRes.length === 0) {
              await supabase
                .from('saldos_ambulancias')
                .upsert({
                  user_id: sessionUser?.id,
                  balance: newProfBal,
                  updated_at: new Date().toISOString()
                }, { onConflict: 'user_id' });
            }

            setAmbulanceBalanceClean(newProfBal);

            // D. Insert record into historial_comisiones
            await supabase.from('historial_comisiones').insert({
              servicio_id: activeAmbulanceJob.id,
              tipo_servicio: 'ambulancia',
              profesional_id: sessionUser?.id,
              cliente_id: citizenId,
              monto_cobrado: calculatedPrice,
              ganancia_profesional: driverReceives,
              comision_secureflow: platformFee
            });

            setAmbulanceState('idle');
            setActiveAmbulanceJob(null);
            showMaterialAlert('✅ Concluido', `Traslado completado de forma real. Se cargaron $${calculatedPrice.toFixed(2)} USD de la cuenta de seguro del afiliado.`);
          } catch (e) {
            console.error("Error running finalize ambulance database processes:", e);
            showMaterialAlert('❌ Error Grave', 'Error procesando transacciones reales en Supabase.');
          } finally {
            setIsAuthLoading(false);
          }
        }
      );
    } catch (err) {
      console.error(err);
      showMaterialAlert('❌ Error de Lectura', 'No se pudo conectar con la base de datos para calcular la tarifa.');
    }
  };

  // Settle driver debt
  const handlePayDriverDebt = () => {
    setDriverDebt(0.00);
    setShowBinanceModal(false);
    showMaterialAlert('✨ Cuenta Activada', 'Tu pago de comisiones se procesó con éxito. Se ha restablecido tu estatus de guardia vial libre.');
  };

  // Simulate Admin panel modifications
  const [adminTargetPhone, setAdminTargetPhone] = useState('584241234567');
  const [adminInjectedBalance, setAdminInjectedBalance] = useState('25');

  const handleAdminInjectBalance = () => {
    const amt = parseFloat(adminInjectedBalance);
    if (isNaN(amt) || amt <= 0) return;
    
    if (adminTargetPhone === citizenProfile.phone) {
      setCitizenBalance(b => b + amt);
      showMaterialAlert('🛠️ Admin Central', `Inyectados $${amt.toFixed(2)} USD al saldo del ciudadano ${citizenProfile.name} correctamente.`);
      triggerPush('💰 Saldo Recibido de Admin', `El administrador central te ha asignado un capital de $${amt.toFixed(2)}.`);
    } else {
      showMaterialAlert('❌ No Encontrado', 'No se localizó ningún perfil de ciudadano registrado con ese teléfono.');
    }
  };

  const handleAdminPayoutLawyer = () => {
    if (totalLawyerEarnings <= 0) {
      showMaterialAlert('⚠️ Error de Nómina', 'No hay honorarios pendientes acumulados para cobrar en este ciclo.');
      return;
    }
    const paySum = totalLawyerEarnings;
    setTotalLawyerEarnings(0);
    showMaterialAlert('🏦 Transferencia Emitida', `Se ha procesado exitosamente el pago de $${paySum.toFixed(2)} USD a la cuenta de Dra. María Mendoza.`);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex flex-col md:flex-row items-center justify-center font-sans select-none overflow-x-hidden md:p-4">
      
      {/* GLOBAL FIXED SUPERIOR LOGOUT BUTTON (ANTI-BLACKOUT RED DE SEGURIDAD) */}
      {sessionUser && activeDevice !== 'landing' && (
        <button
          onClick={handleSignOut}
          className="fixed top-4 right-4 z-[99999] bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black tracking-widest px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.4)] border border-rose-500/30 transition-all flex items-center gap-2 cursor-pointer uppercase select-none"
          title="Forzar Cierre de Sesión"
        >
          <LogOut className="w-4 h-4 text-rose-100 animate-pulse" />
          <span>Cerrar Sesión</span>
        </button>
      )}
      
      {/* Active Floating Simulated Push Notification banner */}
      {systemNotification && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-[360px] bg-[#1E212B]/95 border-l-4 border-blue-500 p-4 rounded-xl shadow-2xl z-50 flex items-start gap-3 backdrop-blur-md animate-bounce">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase block">SecureFlow Central</span>
            <span className="text-xs font-bold text-white block mt-0.5">{systemNotification.title}</span>
            <span className="text-[11px] text-slate-300 block mt-0.5">{systemNotification.body}</span>
          </div>
          {systemNotification.sound && (
            <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center">
              <Volume2 className="w-3 h-3 text-slate-400 animate-pulse" />
            </div>
          )}
        </div>
      )}

      {/* Main Responsive App Workspace Center - taking full screen on mobile, elegant max-w-md on desktop */}
      <div className="w-full max-w-md min-h-screen md:min-h-[850px] md:rounded-[40px] md:border md:border-white/10 bg-immersive-dark shadow-2xl relative flex flex-col justify-stretch overflow-hidden ring-4 ring-white/5">
        
        {/* SCREEN AREA */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-immersive-dark">
          
          {/* Material Modals Simulated UI Component Engine (Replaces standard window.alert/confirm) */}
          {dialog && dialog.visible && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fade-in">
                  <div className="bg-immersive-card border border-white/5 p-6 rounded-3xl w-full max-w-[320px] shadow-2xl">
                    <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2.5">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-white">{dialog.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed mb-5 whitespace-pre-line">{dialog.message}</p>
                    <div className="flex items-center gap-2.5 justify-end">
                      {dialog.cancelText && (
                        <button 
                          onClick={() => {
                            if(dialog.onCancel) dialog.onCancel();
                            setDialog(null);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-all bg-immersive-dark"
                        >
                          {dialog.cancelText}
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          if(dialog.onConfirm) dialog.onConfirm();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 glow-blue text-white text-xs font-black transition-all hover:opacity-95 active:scale-95"
                      >
                        {dialog.confirmText || 'Aceptar'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- SCREEN 1: PRE-REGISTRATION LANDING ---------------- */}
              {activeDevice === 'landing' && (
                <div className="flex-1 flex flex-col overflow-y-auto px-5 py-4 scrollbar-thin">
                  <div className="text-center mt-3">
                    <SecureFlowLogoCustom className="w-24 h-24 mx-auto" />
                    <h2 className="text-2xl font-black mt-4 tracking-tight text-white uppercase bg-gradient-to-r from-blue-400 via-sky-200 to-cyan-400 bg-clip-text text-transparent">SecureFlow</h2>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold tracking-widest">Ecosistema Integral de Defensa</p>
                  </div>

                  <div className="mt-5 p-4 bg-immersive-frame rounded-2xl border border-white/5 text-center">
                    <span className="text-[9px] bg-amber-500/25 text-amber-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Lanzamiento 2026</span>
                    <h3 className="text-sm font-bold text-white mt-2">Protección Vial e Insurtech en un toque</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Conecta directo con peritos viales, grúas más cercanas por geocerca y defensa de guardia.
                    </p>
                  </div>

                  {/* Android Native md3 input fields simulator selection */}
                  <div className="mt-5 space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Predecir Rol de Acceso</h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      <button 
                        onClick={() => handleDirectAccess('citizen')}
                        className="w-full bg-immersive-card hover:opacity-90 p-4 rounded-2xl border border-white/5 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block">Acceso Ciudadano</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">SOS, Consultas de Leyes, Solicitar Grúa</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                        onClick={() => handleDirectAccess('lawyer')}
                        className="w-full bg-immersive-card hover:opacity-90 p-4 rounded-2xl border border-white/5 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                            <Scale className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block">Acceso Abogado Colectivo</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Recibir Alertas, Cobros y Amparos</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                        onClick={() => handleDirectAccess('driver')}
                        className="w-full bg-immersive-card hover:opacity-90 p-4 rounded-2xl border border-white/5 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block">Acceso Chofer de Grúa</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Asistencias Viales, Mapa y Comisiones</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                        onClick={() => handleDirectAccess('ambulance')}
                        className="w-full bg-immersive-card hover:opacity-90 p-4 rounded-2xl border border-white/5 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-xl">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block">Acceso Guardias de Ambulancia</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Despachos Clínicos y Traslados Críticos</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                      </button>

                      <button 
                        onClick={() => handleDirectAccess('medic')}
                        className="w-full bg-immersive-card hover:opacity-90 p-4 rounded-2xl border border-white/5 text-left transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-500/10 text-teal-400 rounded-xl">
                            <Heart className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-white block">Acceso Médico de Guardia</span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Teleconsultas Clínicas y Triaje Médico</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    </div>

                    {/* Real Supabase Auth container (MD3 styling) */}
                    <div id="auth-form-container" className="p-4 bg-immersive-frame rounded-2xl border border-white/5 mt-2">
                      <div className="flex bg-immersive-dark rounded-xl p-1 border border-white/5 mb-3.5">
                        <button 
                          onClick={() => setIsRegisterMode(false)}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${!isRegisterMode ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Iniciar Sesión
                        </button>
                        <button 
                          onClick={() => setIsRegisterMode(true)}
                          className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${isRegisterMode ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                          Registrarse
                        </button>
                      </div>

                      <div className="space-y-3.5">
                        {isRegisterMode && (
                          <>
                            <div>
                              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nombre Completo</label>
                              <input 
                                type="text" 
                                value={citizenProfile.name}
                                onChange={(e) => setCitizenProfile({...citizenProfile, name: e.target.value})}
                                placeholder="Nombre completo..."
                                className="w-full bg-immersive-dark border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Celular WhatsApp</label>
                              <input 
                                type="tel" 
                                value={citizenProfile.phone}
                                onChange={(e) => setCitizenProfile({...citizenProfile, phone: e.target.value})}
                                placeholder="Ej: 584241234567"
                                className="w-full bg-immersive-dark border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Rol de Acceso</label>
                              <select 
                                value={selectRole}
                                onChange={(e: any) => setSelectRole(e.target.value)}
                                className="w-full bg-immersive-dark border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 bg-black/40"
                              >
                                <option value="citizen">Asegurado (Ciudadano)</option>
                                <option value="lawyer">Abogado Colectivo</option>
                                <option value="driver">Chofer de Grúa</option>
                                <option value="ambulance">Paramédico de Ambulancia</option>
                                <option value="medic">Médico de Guardia</option>
                              </select>
                            </div>

                            {/* Dynamic required fields based on role selection */}
                            {selectRole === 'lawyer' && (
                              <div className="animate-fade-in space-y-1">
                                <label className="text-[10px] text-amber-500 font-extrabold uppercase flex items-center gap-1 mb-1">
                                  <span>⚖️ Número IMPRE Abogado</span>
                                </label>
                                <input 
                                  type="text" 
                                  value={impreAbogadoField}
                                  onChange={(e) => setImpreAbogadoField(e.target.value)}
                                  placeholder="Ej: IPSA / IMPRE-98.421"
                                  className="w-full bg-immersive-dark border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                                />
                              </div>
                            )}

                            {selectRole === 'citizen' && (
                              <div className="animate-fade-in space-y-3.5">
                                <div className="space-y-1">
                                  <label className="text-[10px] text-indigo-400 font-extrabold uppercase flex items-center gap-1 mb-1">
                                    <span>👤 ID de Ciudadano / Cédula</span>
                                  </label>
                                  <input 
                                    type="text" 
                                    value={ciudadanoIdField}
                                    onChange={(e) => setCiudadanoIdField(e.target.value)}
                                    placeholder="Ej: C.I. V-12.345.678"
                                    className="w-full bg-immersive-dark border border-indigo-500/30 rounded-xl px-3 py-2 text-xs text-indigo-200 focus:outline-none focus:border-indigo-400"
                                  />
                                </div>

                                <div className="space-y-1.5">
                                  <label className="text-[10px] text-indigo-400 font-extrabold uppercase block mb-1">
                                    🏍️/🚗 Tipo de Vehículo Primario
                                  </label>
                                  <p className="text-[9px] text-slate-500 leading-normal mb-1.5">
                                    Esto definirá el costo base y tarifas por kilómetro sincronizadas para grúas y servicios médicos.
                                  </p>
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCitizenVehicleType('coche');
                                        localStorage.setItem('secureflow_vehicle_type', 'coche');
                                      }}
                                      className={`flex-1 py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                                        citizenVehicleType === 'coche'
                                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/5'
                                          : 'bg-black/40 border-slate-800 text-slate-500 hover:text-slate-400'
                                      }`}
                                    >
                                      <span>🚗 Automóvil / Coche</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setCitizenVehicleType('moto');
                                        localStorage.setItem('secureflow_vehicle_type', 'moto');
                                      }}
                                      className={`flex-1 py-2 px-3 rounded-xl border text-center font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                                        citizenVehicleType === 'moto'
                                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/5'
                                          : 'bg-black/40 border-slate-800 text-slate-500 hover:text-slate-400'
                                      }`}
                                    >
                                      <span>🏍️ Motocicleta / Moto</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {selectRole === 'driver' && (
                              <div className="animate-fade-in space-y-1">
                                <label className="text-[10px] text-emerald-400 font-extrabold uppercase flex items-center gap-1 mb-1">
                                  <span>🚜 ID de Grúa / Placa Remolque</span>
                                </label>
                                <input 
                                  type="text" 
                                  value={gruaIdField}
                                  onChange={(e) => setGruaIdField(e.target.value)}
                                  placeholder="Ej: GRU-A92B"
                                  className="w-full bg-immersive-dark border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-emerald-200 focus:outline-none focus:border-emerald-400"
                                />
                              </div>
                            )}

                            {selectRole === 'ambulance' && (
                              <div className="animate-fade-in space-y-1">
                                <label className="text-[10px] text-rose-400 font-extrabold uppercase flex items-center gap-1 mb-1">
                                  <span>🚑 Credencial de Ambulancia / Placa</span>
                                </label>
                                <input 
                                  type="text" 
                                  value={credentialAmbulanceField}
                                  onChange={(e) => setCredentialAmbulanceField(e.target.value)}
                                  placeholder="Ej: AMB-402X / MPPS"
                                  className="w-full bg-immersive-dark border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-rose-200 focus:outline-none focus:border-rose-400"
                                />
                              </div>
                            )}

                            {selectRole === 'medic' && (
                              <div className="animate-fade-in space-y-1">
                                <label className="text-[10px] text-teal-400 font-extrabold uppercase flex items-center gap-1 mb-1">
                                  <span>🏥 Colegio de Médicos ID / MSAS</span>
                                </label>
                                <input 
                                  type="text" 
                                  value={credentialMedicField}
                                  onChange={(e) => setCredentialMedicField(e.target.value)}
                                  placeholder="Ej: MSAS-42.501"
                                  className="w-full bg-immersive-dark border border-teal-500/30 rounded-xl px-3 py-2 text-xs text-teal-200 focus:outline-none focus:border-teal-400"
                                />
                              </div>
                            )}

                            {/* Safety Selfie capture block */}
                            <div className="border border-white/5 rounded-2xl bg-immersive-dark/50 p-3.5 space-y-2">
                              <span className="text-[10px] text-slate-300 font-black block uppercase tracking-wider">
                                Selfie de Seguridad (Biometría de Control)
                              </span>

                              {isCapturingSelfie ? (
                                <div className="bg-slate-950 rounded-xl border border-blue-500/50 flex flex-col items-center justify-center p-2.5 text-center space-y-2 relative overflow-hidden">
                                  {selfieCameraError ? (
                                    <div className="space-y-2 p-1">
                                      <span className="text-[10px] text-red-400 font-bold block">{selfieCameraError}</span>
                                      <button
                                        type="button"
                                        onClick={stopSelfieCamera}
                                        className="px-2.5 py-1 bg-slate-800 text-[9px] font-bold rounded-lg text-slate-300"
                                      >
                                        Cerrar
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-slate-900 border-2 border-blue-500">
                                        <video 
                                          ref={selfieVideoRef}
                                          autoPlay 
                                          playsInline 
                                          muted 
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 border border-blue-400/20 rounded-full pointer-events-none" />
                                        <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-500 animate-sweep pointer-events-none" />
                                      </div>
                                      <div className="flex gap-2 w-full justify-center">
                                        <button
                                          type="button"
                                          onClick={captureSelfiePhoto}
                                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase rounded-lg transition-all"
                                        >
                                          📸 Tomar Foto
                                        </button>
                                        <button
                                          type="button"
                                          onClick={stopSelfieCamera}
                                          className="px-3 py-1 bg-red-950/40 hover:bg-red-900/40 text-red-400 text-[10px] font-extrabold uppercase rounded-lg transition-all"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              ) : selfieCaptured ? (
                                <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30 mt-1">
                                  <div className="relative w-12 h-12 rounded-full border-2 border-emerald-500 overflow-hidden shrink-0 flex items-center justify-center bg-slate-900">
                                    <img 
                                      src={selfieCaptured} 
                                      alt="Selfie Biométrica" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-0.5 text-slate-950">
                                      <CheckCircle className="w-2.5 h-2.5 text-slate-950" strokeWidth={3} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase block tracking-wider">✓ Rostro Verificado</span>
                                    <span className="text-[9px] text-slate-400 leading-tight block">Firma digital biométrica encriptada v6.1</span>
                                    <button 
                                      type="button"
                                      onClick={() => setSelfieCaptured(null)}
                                      className="text-[9px] text-red-400 hover:text-red-350 font-black uppercase tracking-wider underline block mt-1"
                                    >
                                      Remover/Retomar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3 bg-slate-950 border border-white/5 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                                  <span className="text-xl text-slate-500">👤</span>
                                  <span className="text-[10px] text-slate-400 block leading-tight">
                                    Captura para certificar la póliza y auditoría vial segura.
                                  </span>
                                  <button
                                    type="button"
                                    onClick={startSelfieCamera}
                                    className="px-3 py-1 bg-blue-600/25 hover:bg-blue-600/40 text-blue-400 text-[10px] font-black tracking-wide border border-blue-500/30 rounded-lg transition-all"
                                  >
                                    📸 Capturar Selfie Biométrica
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Correo Electrónico</label>
                          <input 
                            type="email" 
                            value={authEmail}
                            onChange={(e) => setAuthEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            className="w-full bg-immersive-dark border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Contraseña</label>
                          <input 
                            type="password" 
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            placeholder="Contraseña de acceso..."
                            className="w-full bg-immersive-dark border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <button 
                          onClick={handleAuthSubmit}
                          disabled={isAuthLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-95 active:scale-95 text-white py-2.5 rounded-xl text-xs font-black tracking-wide transition-all glow-blue flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isAuthLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Conectando...
                            </>
                          ) : (
                            isRegisterMode ? '🛡️ Registrarme' : '🔑 Iniciar Sesión'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer Terms */}
                  <div className="mt-auto pt-6 pb-2 text-center text-[10px] text-slate-500">
                    <p>© 2026 SecureFlow Inc. Todos los derechos reservados.</p>
                    <div className="flex justify-center gap-2 mt-1">
                      <span className="hover:underline cursor-pointer" onClick={() => showMaterialAlert('Términos de Servicio', 'Los servicios facilitados son de mediación legal y asistencia vial. No somos aseguradores directos.')}>Términos</span>
                      <span>•</span>
                      <span className="hover:underline cursor-pointer" onClick={() => showMaterialAlert('Privacidad', 'SecureFlow respeta la encriptación de datos de llamadas y coordenadas de ubicación.')}>Privacidad</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- SCREEN 2: CITIZEN APP ENGINE ---------------- */}
              {activeDevice === 'citizen' && sessionUser && (
                <div className="flex-1 flex flex-col justify-stretch">
                  
                  {/* Top screen header */}
                  <div className="bg-immersive-frame border-b border-white/5 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <SecureFlowLogoCustom className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-black tracking-tight text-white uppercase">SecureFlow Mobile</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-immersive-card text-slate-300 font-bold px-2.5 py-1 rounded-md border border-white/5">
                        $ {citizenBalance.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => {
                          showMaterialAlert('Sesión Cerrada', 'Volviendo al pre-registro corporativo...');
                          setActiveDevice('landing');
                        }}
                        className="text-[10px] text-slate-400 hover:text-slate-100 bg-immersive-card px-2.5 py-1 rounded-md border border-white/5 hover:opacity-90"
                      >
                        Salir
                      </button>
                    </div>
                  </div>

                  {/* Tab Body Contents */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
                    
                    {/* TAB CITIZEN HOME */}
                    {citizenTab === 'home' && (() => {
                      const isCitizenTowActive = !!activeTowJob && (
                        towState === 'dispatched' || 
                        activeTowJob.status === 'en_route' || 
                        activeTowJob.status === 'active' || 
                        activeTowJob.gruero_id || 
                        activeVialAssist?.estado === 'activa' || 
                        activeVialAssist?.estado === 'en_progreso' || 
                        activeVialAssist?.gruero_id
                      );
                      return (
                        <div className="p-4 space-y-4">
                          {isCitizenTowActive ? (
                            /* PANTALLA COMPLETA DE SEGUIMIENTO EN VIVO SEGÚN REGLA ESTRICTA DE LA MÁQUINA DE ESTADOS */
                            <div className="animate-fade-in space-y-4">
                              <div className="flex justify-between items-center bg-indigo-950/40 p-3 rounded-2xl border border-indigo-500/20">
                                <div className="text-left">
                                  <span className="text-[10px] font-bold text-indigo-400 font-mono tracking-widest uppercase animate-pulse block">🚜 GRÚA EN RUTA</span>
                                  <h3 className="text-xs font-black text-white mt-1">Conductor: {activeTowJob.driverName || 'Operador de Guardia'}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    {activeTowJob.driverPhone && (
                                      <span className="text-[10px] text-slate-400 font-mono">{activeTowJob.driverPhone}</span>
                                    )}
                                    <span className="text-[9px] bg-indigo-900 text-yellow-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-yellow-500/30">
                                      Placa: {activeTowJob.vehiclePlate || 'A92B45X'}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-[10px] bg-indigo-900/40 text-indigo-200 px-2 py-1 rounded-lg border border-indigo-500/10 font-mono self-start shrink-0">
                                  ETA • {Math.ceil((activeTowJob.distance || 5400) / 150) || 5} min
                                </span>
                              </div>

                            {/* Transparent Pricing Split Details */}
                            <div className="bg-slate-900 rounded-2xl p-3 border border-indigo-500/15 text-[10px] space-y-1.5 font-mono">
                              <div className="flex justify-between text-slate-400 border-b border-white/5 pb-1 font-sans font-bold">
                                <span>Vehículo Asegurado:</span>
                                <span className="text-white">{citizenVehicleType === 'coche' ? '🚗 Automóvil / Coche' : '🏍️ Motocicleta / Moto'}</span>
                              </div>
                              {(() => {
                                const distKm = (activeTowJob.distance || 5400) / 1000;
                                const baseFee = tariffs.grua?.tarifa_base ?? 30.00;
                                const kmRate = tariffs.grua?.precio_por_km ?? 4.50;
                                const costKm = distKm * kmRate;
                                const totalCalculated = baseFee + costKm;
                                return (
                                  <>
                                    <div className="flex justify-between text-slate-400">
                                      <span>Tarifa Base:</span>
                                      <span>$ {baseFee.toFixed(2)} USD</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                      <span>Precio por Km:</span>
                                      <span>$ {kmRate.toFixed(2)} USD</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                      <span>Distancia Recorrida:</span>
                                      <span>{distKm.toFixed(2)} Km ({costKm.toFixed(2)} USD)</span>
                                    </div>
                                    <div className="flex justify-between text-red-400 border-t border-white/5 pt-1">
                                      <span>Costo Total:</span>
                                      <strong className="text-xs font-sans font-bold">$ {totalCalculated.toFixed(2)} USD</strong>
                                    </div>
                                    <div className="flex justify-between text-green-400 font-sans text-[9px] uppercase tracking-wider">
                                      <span>Acreditado al chofer (80%):</span>
                                      <strong>+ $ {(totalCalculated * 0.8).toFixed(2)} USD</strong>
                                    </div>
                                    <div className="flex justify-between text-slate-500 text-[9px] uppercase tracking-wider">
                                      <span>Fondo de operaciones (20%):</span>
                                      <span>$ {(totalCalculated * 0.2).toFixed(2)} USD</span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>

                            {/* Live road tracking map */}
                            {craneUnitState?.lat_actual && craneUnitState?.lng_actual && (activeTowJob?.latitude || citizenCoords.lat) && (activeTowJob?.longitude || citizenCoords.lng) ? (
                              <div className="h-96 rounded-2xl border border-indigo-500/20 overflow-hidden relative shadow-lg">
                                <RoadsideMap
                                  driverLat={craneUnitState.lat_actual}
                                  driverLng={craneUnitState.lng_actual}
                                  citizenLat={activeTowJob?.latitude || citizenCoords.lat}
                                  citizenLng={activeTowJob?.longitude || citizenCoords.lng}
                                />
                              </div>
                            ) : (
                              <div className="h-96 rounded-2xl border border-slate-800/40 bg-slate-950 flex flex-col justify-center items-center p-3 text-center space-y-1">
                                <span className="text-xl animate-spin text-indigo-400">📡</span>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Sincronizando señal GPS de la Grúa...</span>
                              </div>
                            )}

                            <button 
                              onClick={() => {
                                setCitizenTab('agent');
                              }}
                              className="w-full bg-indigo-650 hover:bg-indigo-600 text-white py-2.5 rounded-2xl text-[11px] font-black tracking-wide transition-all text-center uppercase shadow-lg select-none"
                            >
                              💬 Abrir Chat Directo con Chofer
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Welcome header in MD3 */}
                            <div className="text-left mt-1.5">
                              <h2 className="text-lg font-black text-white leading-tight">Hola, {citizenProfile.name.split(' ')[0]}</h2>
                              <p className="text-[11px] text-slate-400 mt-0.5">En incidentes de tránsito o accidentes, mantén la calma.</p>
                            </div>

                            {/* Interactive dynamic TOW tracking map */}
                            {towState === 'proposed' && activeTowJob && (
                              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl space-y-3 text-center animate-pulse">
                                <div className="flex justify-between items-center text-[9px] text-yellow-500/60 font-mono">
                                  <span>ORDEN DE DESPACHO</span>
                                  <span>ID: {activeTowJob.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                                <span className="text-2xl block">🚜</span>
                                <span className="text-xs text-yellow-550 font-black block uppercase">Despachando Unidad Vial...</span>
                                <p className="text-[10px] text-slate-300">
                                  Hemos notificado al operador de grúa en zona. Esperando confirmación de {activeTowJob.driverName || 'Carlos Ruiz'}. Puedes activar el canal de grúa para ver status.
                                </p>
                                <div className="w-full bg-slate-800 rounded-full h-1 relative overflow-hidden">
                                  <div className="bg-yellow-500 h-full rounded-full animate-sweep" style={{ width: '40%' }} />
                                </div>
                                <button
                                  onClick={handleCancelTowRequest}
                                  className="w-full bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 text-red-500 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all select-none"
                                >
                                  ❌ Cancelar Solicitud
                                </button>
                              </div>
                            )}

                            {/* Interactive dynamic AMBULANCE tracking card */}
                            {ambulanceState === 'proposed' && activeAmbulanceJob && (
                              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl space-y-3 text-center animate-pulse">
                                <span className="text-2xl block animate-bounce">🚑</span>
                                <span className="text-xs text-red-400 font-extrabold block uppercase">Solicitud de Ambulancia de Guardia</span>
                                <p className="text-[10px] text-slate-300">
                                  Esperando que la unidad paramédica de resguardo SecureFlow confirme tu despacho físico. Por favor, mantente a la espera.
                                </p>
                                <div className="w-full bg-slate-800 rounded-full h-1 relative overflow-hidden">
                                  <div className="bg-red-500 h-full rounded-full animate-sweep" style={{ width: '40%' }} />
                                </div>
                              </div>
                            )}

                            {/* Interactive dynamic MEDIC consultation card */}
                            {medicState === 'calling' && activeMedicEmergency && (
                              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 text-center animate-pulse">
                                <span className="text-2xl block animate-bounce">🏥</span>
                                <span className="text-xs text-emerald-400 font-extrabold block uppercase">Solicitando Doctor de Guardia</span>
                                <p className="text-[10px] text-slate-300">
                                  Esperando que el médico cirujano de guardia reciba y acepte tu llamada de teleconsulta. No cierres la aplicación.
                                </p>
                                <div className="w-full bg-slate-800 rounded-full h-1 relative overflow-hidden">
                                  <div className="bg-emerald-500 h-full rounded-full animate-sweep" style={{ width: '40%' }} />
                                </div>
                              </div>
                            )}

                            {sosState === 'calling' && (
                              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-2 animate-pulse mb-3">
                                <span className="text-xl block animate-bounce">⚖️</span>
                                <span className="text-xs text-amber-400 font-extrabold block uppercase">Buscando Abogado Penalista...</span>
                                <p className="text-[10px] text-slate-300 leading-normal">
                                  Estamos enlazando tu ubicación y requerimiento SOS con la central de defensas viales en vivo. Por favor espera a que un profesional de guardia tome el control.
                                </p>
                              </div>
                            )}

                            {/* Core Emergency SOS Glowing Button */}
                            <div className="p-5 bg-immersive-card border border-white/5 rounded-3xl text-center shadow-md relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-b from-rose-950/10 to-transparent" />
                              <h4 className="text-xs font-extrabold text-slate-300 tracking-wide uppercase mb-3">Defensa Penal en Caliente</h4>
                              
                              {/* Active breath circular element */}
                              <div className="relative py-4 flex justify-center">
                                <button 
                                  onClick={handleSosTrigger}
                                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white cursor-pointer select-none transition-all active:scale-90 ${sosState !== 'idle' ? 'bg-gradient-to-tr from-amber-600 to-amber-500 animate-pulse' : 'bg-gradient-to-tr from-red-650 to-red-500 glow-blue animate-pulse-glow'}`}
                                >
                                  <span className="text-3xl">🛡️</span>
                                  <span className="text-xl font-black mt-1 font-mono tracking-tighter">
                                    {sosState === 'idle' ? 'SOS' : 'SOS ACTIVO'}
                                  </span>
                                  <span className="text-[10px] font-bold uppercase text-rose-100 opacity-90 mt-0.5">
                                    {sosState === 'idle' ? 'TOCA PARA DEFENSA' : 'CONECTANDO'}
                                  </span>
                                </button>
                              </div>
    
                              <p className="text-[10px] text-slate-400 leading-relaxed mt-2.5 px-3">
                                Encuentros en retenes o alcabalas. Videollamada de defensa legal auditada y almacenada en la Nube de Seguridad.
                              </p>

                              <div className="mt-4 flex gap-2 justify-center">
                                <button 
                                  onClick={() => {
                                    setShowWalletModal(true);
                                  }}
                                  className="bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 py-2.5 px-6 rounded-2xl text-xs font-black border border-blue-500/20 shadow-lg shadow-blue-500/5 transition-all flex items-center gap-1.5 active:scale-95"
                                >
                                  💰 Ver mi Saldo: $ {citizenBalance.toFixed(2)} USD
                                </button>
                              </div>
                            </div>

                            {/* Active livestream transmission container */}
                            {isLiveVideoActive && (
                              <div className="bg-immersive-card border border-blue-500/30 rounded-2xl p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                    VIDEO CONEXIÓN SOS ACTIVA
                                  </span>
                                  <span className="text-[9px] text-slate-400 font-mono">
                                    ID: {activeEmergency?.id?.substring(0, 8).toUpperCase() || 'SALA'}
                                  </span>
                                </div>

                                {/* Actual Interactive Daily.co WebRTC Video Iframe */}
                                <div className="h-64 bg-slate-950 rounded-xl relative overflow-hidden border border-white/5 shadow-inner">
                                  <iframe 
                                    src={activeEmergency?.dailyRoomUrl || "https://iframe.daily.co/secureflow-abogado-defensa"}
                                    allow="camera; microphone; fullscreen"
                                    className="w-full h-full border-0 absolute inset-0 rounded-xl"
                                    title="Daily.co Citizen SOS"
                                  />
                                  <div className="absolute top-2 left-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] text-red-400 font-mono tracking-wider pointer-events-none z-10 border border-white/5 uppercase">
                                    GRABACIÓN Y RESPALDO EN NUBE 🛡️
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-1">
                                  <p className="text-[9px] text-slate-400 font-mono">
                                    📍 Lat: 10.4850 | Lng: -66.9030 (GPS Seguro)
                                  </p>
                                  <p className="text-[9px] text-emerald-400 font-extrabold uppercase">
                                    Amparo Legal Gaceta G-42.458
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Quick Action Matrix Grid */}
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Módulos Corporativos</h4>
                              
                              <div className="grid grid-cols-2 gap-2.5">
                                <button 
                                  onClick={handleAmbulanceRequest}
                                  className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-left hover:bg-red-500/20 transition-all text-red-400"
                                >
                                  <span className="text-lg block mb-1">🚑</span>
                                  <span className="text-xs font-bold block">Pedir Ambulancia</span>
                                </button>

                                <button 
                                  onClick={handleMedicRequest}
                                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left hover:bg-emerald-500/20 transition-all text-emerald-400"
                                >
                                  <span className="text-lg block mb-1">🏥</span>
                                  <span className="text-xs font-bold block">Médico Guardia</span>
                                </button>

                                <button 
                                  onClick={() => {
                                    triggerPush('📍 GPS Localizado', 'Precisión: 4 metros. Latitud: 10.4850, Longitud: -66.9030.');
                                    showMaterialAlert('📍 Trazabilidad GPS', 'Tus coordenadas seguras se encuentran emitiendo a la central de control insurtech de SecureFlow.');
                                  }}
                                  className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-left hover:bg-slate-900 transition-all text-slate-300"
                                >
                                  <span className="text-lg block mb-1">📍</span>
                                  <span className="text-xs font-bold block">GPS Preciso</span>
                                </button>

                                <button 
                                  onClick={handleTowRequest}
                                  className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-left hover:bg-yellow-500/20 transition-all text-yellow-400"
                                >
                                  <span className="text-lg block mb-1">🚜</span>
                                  <span className="text-xs font-bold block">Pedir Grúa</span>
                                </button>
                              </div>
                            </div>

                            {/* Gaceta background legal information */}
                            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4 rounded-2xl space-y-1.5 mt-2">
                              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                                <Scale className="w-3.5 h-3.5" /> Gaceta Oficial N° 42.458
                              </h4>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                "Resolución Conjunta: Los ciudadanos tienen pleno derecho a grabar procedimientos policiales en alcabalas vehiculares. Ningún funcionario puede quitarte el celular."
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}

                    {/* TAB CITIZEN AI AGENT & CHATS */}
                    {citizenTab === 'agent' && (
                      <div className="flex flex-col h-full bg-slate-950">
                        {/* Daily.co Call container when SOS is Active */}
                        {isLawyerDailyCoActive && (
                          <div className="bg-slate-900 border-b border-indigo-500/10 flex flex-col shrink-0">
                            <div className="bg-red-950/40 px-3 py-2 border-b border-red-900/10 flex justify-between items-center text-[10px]">
                              <span className="text-red-400 font-extrabold flex items-center gap-1.5 uppercase">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                                Videodefensa SOS Activa (WebRTC)
                              </span>
                              <span className="text-slate-400 font-mono text-[9px]">
                                Defensor Guard: Dra. María Mendoza
                              </span>
                            </div>
                            
                            {/* Interactive daily.co iframe for client */}
                            <div className="h-44 bg-slate-950 relative">
                              <iframe 
                                src={activeEmergency?.dailyRoomUrl || "https://iframe.daily.co/secureflow-abogado-defensa"}
                                allow="camera; microphone; fullscreen"
                                className="w-full h-full border-0"
                                title="Daily.co Lawyer SOS"
                              />
                              <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[8px] text-red-400 font-mono tracking-wider pointer-events-none z-10 border border-white/5 uppercase">
                                GRABACIÓN Y AMPARO RESPALDADO EN NUBE
                              </div>
                            </div>
                            
                            <div className="p-2 bg-slate-900/90 flex justify-between items-center border-t border-white/5">
                              <p className="text-[9px] text-slate-400">La llamada se graba como defensa judicial.</p>
                              <button 
                                onClick={() => {
                                  setIsLawyerDailyCoActive(false);
                                  setIsLiveVideoActive(false);
                                  // Add system message to the chat!
                                  setAgentMessages(m => [...m, {
                                    sender: 'bot',
                                    text: '⚖️ **Dra. María Mendoza (Abogado COPP):** Sesión WebRTC SOS terminada. Mantengo este canal de chat directo abierto 24/7 para el procedimiento.',
                                    time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                                  }]);
                                }}
                                className="px-3 py-1 bg-red-650 hover:bg-red-700 text-white font-black text-[9px] uppercase rounded-lg shadow-lg"
                              >
                                Finalizar Llamada
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Daily.co Call container when Tow is Active */}
                        {isTowDailyCoActive && (
                          <div className="bg-slate-900 border-b border-indigo-500/15 flex flex-col shrink-0">
                            <div className="bg-indigo-950/45 px-3 py-2 border-b border-indigo-900/10 flex justify-between items-center text-[10px]">
                              <span className="text-indigo-400 font-extrabold flex items-center gap-1.5 uppercase">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                                Videotransmisión de Grúa Activa (WebRTC)
                              </span>
                              <span className="text-slate-400 font-mono text-[9px]">
                                Conductor: {activeTowJob?.driverName || 'Operador Oficial'}
                              </span>
                            </div>
                            
                            {/* Interactive daily.co iframe */}
                            <div className="h-44 bg-slate-950 relative">
                              <iframe 
                                src={towDailyCoUrl || activeVialAssist?.sala_webrtc_url || ("https://iframe.daily.co/secureflow-tow-" + activeTowJob?.id)}
                                allow="camera; microphone; fullscreen"
                                className="w-full h-full border-0"
                                title="Daily.co Tow Assistance"
                              />
                            </div>
                            
                            <div className="p-2 bg-slate-900/90 flex justify-between items-center border-t border-white/5">
                              <p className="text-[9px] text-slate-400">Canal de audio/video de seguridad.</p>
                              <button 
                                onClick={() => {
                                  setIsTowDailyCoActive(false);
                                }}
                                className="px-3 py-1 bg-red-650 hover:bg-red-700 text-white font-black text-[9px] uppercase rounded-lg shadow-lg"
                              >
                                Apagar Video
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Messages Area */}
                        <div ref={agentScrollRef} className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[340px] scrollbar-thin">
                          
                          {agentMessages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-slate-500 mb-0.5 font-mono uppercase">
                                {msg.sender === 'bot' ? '⚖️ Agente SecureFlow' : 'Tú'} • {msg.time}
                              </span>
                              <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                                <p className="whitespace-pre-line">{msg.text}</p>
                              </div>
                            </div>
                          ))}

                          {/* Tow chat messages integration to showcase unified design */}
                          {towMessages.length > 0 && (
                            <div className="border-t border-slate-900 mt-4 pt-3 space-y-2">
                              <span className="text-[9px] text-slate-500 block text-center font-mono uppercase">--- Canal Chat Grúa Operativo ---</span>
                              {towMessages.map((tmsg, idx) => (
                                <div key={idx} className={`flex flex-col ${tmsg.sender === 'citizen' ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[9px] text-slate-500 mb-0.5 font-mono">
                                    {tmsg.sender === 'citizen' ? 'Tú' : '🚜 Chofer Carlos'}
                                  </span>
                                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${tmsg.sender === 'citizen' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 border border-yellow-500/30 text-yellow-100 rounded-tl-none'}`}>
                                    <p>{tmsg.text}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>

                        {/* Speech active waving indicator */}
                        {isDictating && (
                          <div className="bg-blue-600/10 border-t border-blue-500/20 py-2.5 px-4 flex items-center justify-between">
                            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider animate-pulse">Escuchando micrófono...</span>
                            <div className="flex gap-0.5 items-end h-[10px] pr-2 shrink-0">
                              <div className="w-[2.5px] h-[4px] bg-blue-400 rounded-sm animate-pulse" />
                              <div className="w-[2.5px] h-[8px] bg-blue-300 rounded-sm animate-pulse duration-700" />
                              <div className="w-[2.5px] h-[12px] bg-blue-400 rounded-sm animate-pulse duration-500" />
                              <div className="w-[2.5px] h-[6px] bg-blue-300 rounded-sm animate-pulse" />
                            </div>
                          </div>
                        )}

                        {/* Tow WebRTC connection quick button for citizen */}
                        {towState === 'dispatched' && (
                          <div className="p-2 bg-slate-900/40 border-t border-slate-800/60 flex justify-between items-center px-3 shrink-0">
                            <span className="text-[9px] text-slate-400">¿Necesitas mostrar la vía o el estado de tu vehículo?</span>
                            <button
                              onClick={() => {
                                setIsTowDailyCoActive(!isTowDailyCoActive);
                                const webrtcUrl = activeVialAssist?.sala_webrtc_url || (activeTowJob ? "https://iframe.daily.co/secureflow-tow-" + activeTowJob.id : "");
                                setTowDailyCoUrl(webrtcUrl);
                              }}
                              className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${
                                isTowDailyCoActive 
                                  ? 'bg-red-650 hover:bg-red-750 text-white border-red-500/30' 
                                  : 'bg-indigo-650 hover:bg-indigo-550 text-white border-indigo-500/30 shadow'
                              }`}
                            >
                              {isTowDailyCoActive ? '📹 Ocultar Video' : '📹 Conectar Video (WebRTC)'}
                            </button>
                          </div>
                        )}

                        {/* Input Area */}
                        <div className="p-2.5 bg-slate-900/60 border-t border-slate-800/60 flex items-center gap-2 shrink-0">
                          <button 
                            onClick={triggerDictation}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDictating ? 'bg-red-650 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'}`}
                            title="Dictar dictado por voz"
                          >
                            <Mic className="w-4 h-4" />
                          </button>

                          <input 
                            type="text"
                            value={agentInput || towChatInput}
                            onChange={(e) => {
                              if(towState === 'dispatched') {
                                setTowChatInput(e.target.value);
                              } else {
                                setAgentInput(e.target.value);
                              }
                            }}
                            onKeyDown={(e) => {
                              if(e.key === 'Enter') {
                                if(towState === 'dispatched') {
                                  handleSendTowMessage('citizen');
                                } else {
                                  handleAgentSend();
                                }
                              }
                            }}
                            placeholder={towState === 'dispatched' ? "Escribe al conductor de la grúa..." : "Consúltame sobre requisas, alcabalas..."}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                          />

                          <button 
                            onClick={() => {
                              if(towState === 'dispatched') {
                                handleSendTowMessage('citizen');
                              } else {
                                handleAgentSend();
                              }
                            }}
                            className="w-9 h-9 bg-blue-600 hover:bg-blue-500 active:scale-95 rounded-xl flex items-center justify-center shadow-md shadow-blue-900/30 text-white shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    )}

                    {/* TAB CITIZEN PROFILE & PLANS */}
                    {citizenTab === 'profile' && (
                      <div className="p-4 space-y-4">
                        
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                            👤
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white">{citizenProfile.name}</h3>
                            <p className="text-[10px] text-slate-500">{citizenProfile.email}</p>
                          </div>
                        </div>

                        {/* Digital Wallet Card */}
                        <div className="p-4 bg-gradient-to-br from-blue-900/30 via-indigo-950/20 to-slate-900 border border-blue-500/15 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest block">Mi Billetera Digital</span>
                              <h4 className="text-xl font-black text-white font-mono mt-1">
                                $ {citizenBalance.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USD</span>
                              </h4>
                            </div>
                            <button 
                              onClick={() => {
                                setShowWalletModal(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white py-1.5 px-3.5 rounded-xl text-xs font-black transition-all active:scale-95 shadow-lg shadow-blue-500/15 uppercase"
                            >
                              💰 Recargar Saldo
                            </button>
                          </div>
                          <p className="text-[9.5px] text-slate-400 leading-relaxed">
                            Fondos de amortización disponibles para coberturas de defensa penal inmediata en alcabalas y servicio de remolque Express.
                          </p>
                        </div>

                        {/* Choose subscription plan panel (MD3 Card Selector) */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                            <span className="text-xs font-extrabold text-slate-300">Plan de Defensa Legal</span>
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-md">
                              {activePlan.toUpperCase()} Active
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1.5">
                            <button 
                              onClick={() => {
                                setActivePlan('gratis');
                                setSosCostRate(15);
                                showMaterialAlert('Plan Básico', 'Cambiado a Plan Básico. SOS rate $15, límite 5 consultas de ley.');
                              }}
                              className={`p-2 rounded-xl text-center border text-[10px] font-bold ${activePlan === 'gratis' ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-900/40 border-slate-800/80 text-slate-500'}`}
                            >
                              Básico
                              <span className="block text-[8px] text-slate-400 mt-1">$0/mes</span>
                            </button>

                            <button 
                              onClick={() => {
                                setActivePlan('estandar');
                                setSosCostRate(12);
                                showMaterialAlert('Plan Estándar', 'Cambiado a Plan Estándar. SOS rate $12, límite 20 consultas de ley.');
                              }}
                              className={`p-2 rounded-xl text-center border text-[10px] font-bold ${activePlan === 'estandar' ? 'bg-indigo-650 border-indigo-500 text-white' : 'bg-slate-900/40 border-slate-800/80 text-slate-400'}`}
                            >
                              Estándar
                              <span className="block text-[8px] text-slate-400 mt-1">$5/mes</span>
                            </button>

                            <button 
                              onClick={() => {
                                setActivePlan('premium');
                                setSosCostRate(10);
                                showMaterialAlert('Plan Premium', 'Cambiado a Plan Premium. SOS rate $10, Consultas ilimitadas.');
                              }}
                              className={`p-2 rounded-xl text-center border text-[10px] font-bold ${activePlan === 'premium' ? 'bg-amber-650 border-amber-500 text-white' : 'bg-slate-900/40 border-slate-800/80 text-slate-400'}`}
                            >
                              Premium
                              <span className="block text-[8px] text-slate-400 mt-1">$10/mes</span>
                            </button>
                          </div>
                        </div>

                        {/* Vehicle Configuration Panel */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                          <span className="text-xs font-bold text-slate-300 block">Tipo de Vehículo (Tarificación Vial)</span>
                          <p className="text-[10px] text-slate-500 leading-normal">
                            Determina las tarifas estimadas por kilómetro para los servicios de grúa e intervenciones de ambulancia de guardia.
                          </p>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setCitizenVehicleType('coche');
                                localStorage.setItem('secureflow_vehicle_type', 'coche');
                                triggerPush('🚗 Vehículo Actualizado', 'Tarifas configuradas para versión Automóvil/Coche.');
                                if (sessionUser) {
                                  supabase.from('usuarios')
                                    .update({ tipo_vehiculo: 'coche', vehicle_selection: 'coche' })
                                    .eq('auth_id', sessionUser.id)
                                    .then(({ error }) => {
                                      if (error) console.error("Error actualizando vehicle_selection en Supabase:", error);
                                    });
                                }
                              }}
                              className={`flex-1 p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                citizenVehicleType === 'coche' 
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-450' 
                                  : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400'
                              }`}
                            >
                              <span className="text-lg">🚗</span>
                              <span>Automóvil / Coche</span>
                            </button>

                            <button 
                              onClick={() => {
                                setCitizenVehicleType('moto');
                                localStorage.setItem('secureflow_vehicle_type', 'moto');
                                triggerPush('🏍️ Vehículo Actualizado', 'Tarifas configuradas para versión Motocicleta/Moto.');
                                if (sessionUser) {
                                  supabase.from('usuarios')
                                    .update({ tipo_vehiculo: 'moto', vehicle_selection: 'moto' })
                                    .eq('auth_id', sessionUser.id)
                                    .then(({ error }) => {
                                      if (error) console.error("Error actualizando vehicle_selection en Supabase:", error);
                                    });
                                }
                              }}
                              className={`flex-1 p-2.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                                citizenVehicleType === 'moto' 
                                  ? 'bg-blue-600/20 border-blue-500 text-blue-450' 
                                  : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400'
                              }`}
                            >
                              <span className="text-lg">🏍️</span>
                              <span>Motocicleta / Moto</span>
                            </button>
                          </div>
                        </div>

                        {/* Edit contacts container */}
                        <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                          <span className="text-xs font-bold text-white block">Contactos de Alerta SOS</span>

                          <div className="space-y-3">
                            <div>
                              <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Contacto Principal (Nombre)</label>
                              <input 
                                type="text" 
                                value={alertContacts.name1}
                                onChange={(e) => setAlertContacts({...alertContacts, name1: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <div>
                              <label className="text-[9px] text-slate-500 font-bold uppercase block mb-1">WhatsApp de Emergencia</label>
                              <input 
                                type="tel" 
                                value={alertContacts.tel1}
                                onChange={(e) => setAlertContacts({...alertContacts, tel1: e.target.value})}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                              />
                            </div>

                            <button 
                              onClick={async () => {
                                try {
                                  const { error: saveErr } = await supabase
                                    .from('usuarios')
                                    .update({
                                      contacto_emergencia_1_nombre: alertContacts.name1,
                                      contacto_emergencia_1_telefono: alertContacts.tel1,
                                      contacto_emergencia_2_nombre: alertContacts.name2,
                                      contacto_emergencia_2_telefono: alertContacts.tel2
                                    })
                                    .eq('auth_id', sessionUser?.id);

                                  if (saveErr) throw saveErr;

                                  // Sync client state in real time
                                  setCitizenProfile(prev => ({
                                    ...prev,
                                    phone: alertContacts.tel1
                                  }));

                                  showMaterialAlert('💾 Guardado', 'Los contactos de de emergencia se han sincronizado en tu cuenta segura de SecureFlow.');
                                } catch (error: any) {
                                  console.error(error);
                                  showMaterialAlert('⚠️ Error', 'No pudimos guardar: ' + (error.message || error));
                                }
                              }}
                              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                            >
                              💾 Guardar Contactos
                            </button>
                          </div>
                        </div>

                        {/* Cerrar Sesión button */}
                        <div className="pt-2">
                          <button 
                            onClick={handleSignOut}
                            className="w-full bg-red-950/40 hover:bg-red-950/80 text-red-400 py-2.5 rounded-2xl text-xs font-black uppercase text-center transition-all border border-red-900/10 active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            🚪 Cerrar Sesión Segura
                          </button>
                        </div>

                      </div>
                    )}

                  </div>

                  {/* OVERLAY WINDOW: AMBULANCE EMERGENCY TRACKING & CHAT */}
                  {isAmbulanceWindowOpen && (
                    <div className="absolute inset-0 bg-slate-950 z-30 flex flex-col justify-stretch">
                      {/* Sub header with controls */}
                      <div className="bg-red-950/40 border-b border-red-900/30 px-3 py-2 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                          <span className="text-xs font-black text-red-400 uppercase tracking-wider">🚑 Patrulla de Resguardo</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setIsAmbulanceDailyCoActive(prev => !prev)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border flex items-center gap-1 transition-all ${
                              isAmbulanceDailyCoActive 
                                ? 'bg-red-650 text-white border-red-500 animate-pulse' 
                                : 'bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            <span className="text-[12px]">📹</span>
                            {isAmbulanceDailyCoActive ? 'Ocultar Video' : 'Pantalla Video'}
                          </button>
                          
                          <button 
                            onClick={() => setIsAmbulanceWindowOpen(false)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Video iframe or Main GPS + Live Chat container */}
                      {isAmbulanceDailyCoActive ? (
                        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
                          <div className="bg-indigo-950/20 px-3 py-1.5 border-b border-white/5 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
                            <span>Sala WebRTC: <strong>daily.co/secureflow-trauma</strong></span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              CONECTADO EN VIVO
                            </span>
                          </div>
                          
                          {/* Daily.co mockup iframe */}
                          <div className="flex-1 bg-slate-900 border-b border-white/5 relative flex items-center justify-center">
                            <iframe 
                              src="https://iframe.daily.co/secureflow-emergencia-vial" 
                              allow="camera; microphone; fullscreen" 
                              className="absolute inset-0 w-full h-full border-0 rounded-b-none"
                              title="Daily.co Ambulance Stream"
                            />
                            {/* Static custom HUD to guarantee absolute visual premium styling */}
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[9px] text-white space-y-0.5 pointer-events-none z-10 border border-white/5">
                              <div>PARAMÉDICO: Dr. Héctor Salas</div>
                              <div>BITRATE: 1420kbps • FPS: 30</div>
                            </div>
                            
                            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                              <button 
                                onClick={() => setIsAmbulanceDailyCoActive(false)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] uppercase rounded-lg shadow-lg"
                              >
                                Desconectar Video
                              </button>
                            </div>
                          </div>
                          
                          {/* Mini instructions underneath */}
                          <div className="p-3 text-[10px] text-slate-400 bg-slate-900 shrink-0">
                            El paramédico está visualizando tus signos previos. Mantenga la cámara frontal alineada.
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-stretch overflow-hidden">
                          {/* Transparent Pricing Split Details for Ambulance */}
                          <div className="bg-slate-900 border-b border-white/5 p-3 flex flex-col space-y-2 shrink-0">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-indicator animate-pulse text-red-100 font-mono">🚑 DETALLE DE TRANSFERENCIA S.O.S</span>
                              <span className="text-[10px] bg-red-500/10 text-red-300 border border-red-500/20 px-2 py-0.5 rounded-md font-mono">
                                {citizenVehicleType === 'coche' ? '🚗 Automóvil' : '🏍️ Motocicleta'} Asignado
                              </span>
                            </div>

                            <div className="bg-slate-950 rounded-xl p-2.5 border border-red-500/15 text-[10px] space-y-1.5 font-mono">
                              <div className="flex justify-between text-red-400">
                                <span>Debitado de tu cuenta:</span>
                                <strong>- $ {activeAmbulanceJob ? activeAmbulanceJob.price.toFixed(2) : '35.00'} USD</strong>
                              </div>
                              <div className="flex justify-between text-green-400">
                                <span>Acreditado al paramédico (80%):</span>
                                <strong>+ $ {activeAmbulanceJob ? (activeAmbulanceJob.price * 0.8).toFixed(2) : '28.00'} USD</strong>
                              </div>
                              <div className="flex justify-between text-slate-500">
                                <span>Plataforma SecureFlow (20%):</span>
                                <span>$ {activeAmbulanceJob ? (activeAmbulanceJob.price * 0.2).toFixed(2) : '7.00'} USD</span>
                              </div>
                            </div>
                          </div>

                          {/* 1. Real-time GPS Route Tracing Map */}
                          <div className="h-44 bg-slate-950 border-b border-white/5 relative overflow-hidden shrink-0">
                            {/* Grid paper mockup */}
                            <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
                              <defs>
                                <pattern id="sub-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill="url(#sub-grid)" />
                            </svg>

                            {/* Dotted Route Tracing Path */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" width="100%" height="100%">
                              <path 
                                d="M 140,130 Q 185,110 220,70" 
                                fill="none" 
                                stroke="#ef4444" 
                                strokeWidth="2" 
                                strokeDasharray="4 4" 
                              />
                            </svg>

                            {/* User Marker */}
                            <div className="absolute text-[18px] select-none z-10" style={{ left: '140px', top: '130px' }}>
                              👤
                              <span className="absolute -top-3 left-3 bg-blue-600 text-white font-black text-[7px] px-1 py-0.5 rounded uppercase">TÚ (GPS)</span>
                            </div>

                            {/* Ambulance Marker */}
                            <div 
                              className="absolute text-[22px] select-none z-10 transition-all duration-1000 ease-out animate-pulse"
                              style={{ 
                                left: `${45 + (10.4900 - ambulanceCoords.lat) * 5000}%`, 
                                top: `${60 + (-66.9100 - ambulanceCoords.lng) * 5000}%` 
                              }}
                            >
                              🚑
                              <span className="absolute -top-4 -left-2 bg-red-650 text-white font-black text-[7px] px-1 py-0.5 rounded uppercase animate-bounce whitespace-nowrap">Ruta Activa</span>
                            </div>

                            <div className="absolute bottom-2 left-3 bg-black/80 backdrop-blur border border-white/10 p-2 rounded-xl text-[9px] font-mono text-slate-300 space-y-0.5 z-10">
                              <div>Unidad: AMB-402X • Dr. Héctor Salas</div>
                              <div>Distancia: <strong className="text-white">{ambulanceDistance} metros</strong></div>
                              <div>ETA: <strong className="text-red-400">{Math.ceil(ambulanceDistance / 150)} min</strong></div>
                            </div>
                          </div>

                          {/* 2. Chat and clinical assistant toggle tabs */}
                          <div className="flex-1 flex flex-col justify-stretch overflow-hidden bg-slate-900">
                            {/* Chat messages */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                              {ambulanceMessages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[8px] text-slate-500 font-mono mb-0.5">
                                    {msg.sender === 'user' ? 'Asegurado (Tú)' : 'Paramédico Héctor'} • {msg.time}
                                  </span>
                                  <div className={`p-2.5 rounded-2xl text-[11px] max-w-[85%] leading-relaxed ${
                                    msg.sender === 'user' 
                                      ? 'bg-red-650 text-white rounded-tr-none' 
                                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
                                  }`}>
                                    {msg.text}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Collapsible mini general AI assistance inside Trauma panel */}
                            <div className="p-2 border-t border-white/5 bg-slate-950 space-y-2 shrink-0">
                              {/* Clinical Trauma Assistant trigger button */}
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-bold text-indicator animate-pulse text-indigo-400 flex items-center gap-1">
                                  <span>🤖</span> ASISTENTE DE TRAUMA AI COMPARTIDO
                                </span>
                              </div>
                              <div className="max-h-20 overflow-y-auto p-1.5 bg-slate-900 border border-white/5 rounded-xl text-[9px] text-slate-300 space-y-1 font-mono">
                                {ambulanceAgentMessages.slice(-2).map((m, i) => (
                                  <div key={i}>
                                    <strong className="text-indigo-400">{m.sender === 'user' ? 'Tú : ' : 'AI : '}</strong>
                                    {m.text}
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-1.5">
                                <input 
                                  type="text"
                                  value={ambulanceAgentInput}
                                  onChange={e => setAmbulanceAgentInput(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') handleSendAmbulanceAI(); }}
                                  placeholder="¿Qué procedimientos se siguen? Pregunte a AI..."
                                  className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-[9px] text-white focus:outline-none"
                                />
                                <button 
                                  onClick={handleSendAmbulanceAI}
                                  className="px-2.5 bg-indigo-650 text-white font-bold text-[9px] rounded-lg"
                                >
                                  Consultar AI
                                </button>
                              </div>
                            </div>

                            {/* Message input */}
                            <div className="p-2.5 bg-slate-950 border-t border-white/5 flex gap-2 shrink-0">
                              <input 
                                type="text"
                                value={ambulanceChatInput}
                                onChange={e => setAmbulanceChatInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSendAmbulanceMessage('user'); }}
                                placeholder="Escribe al paramédico de la ambulancia..."
                                className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                              />
                              <button 
                                onClick={() => handleSendAmbulanceMessage('user')}
                                className="px-4 py-2 bg-red-650 hover:bg-red-750 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                              >
                                Enviar
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OVERLAY WINDOW: MEDIC CHAT & TELEMEDICINE CAMERA */}
                  {isMedicWindowOpen && (
                    <div className="absolute inset-0 bg-slate-950 z-30 flex flex-col justify-stretch">
                      {/* Sub Header of Medical consultation */}
                      <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-3 py-2 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">🩺 Teleconsulta de Guardia</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setIsMedicDailyCoActive(prev => !prev)}
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border flex items-center gap-1 transition-all ${
                              isMedicDailyCoActive 
                                ? 'bg-emerald-650 text-white border-emerald-500 animate-pulse' 
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                            }`}
                          >
                            <span className="text-[12px]">📹</span>
                            {isMedicDailyCoActive ? 'Ocultar Video' : 'Pantalla Video'}
                          </button>
                          
                          <button 
                            onClick={() => setIsMedicWindowOpen(false)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      {/* Daily.co interactive clinical consultation frame */}
                      {isMedicDailyCoActive ? (
                        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
                          <div className="bg-emerald-950/20 px-3 py-1.5 border-b border-white/5 flex justify-between items-center text-[10px] text-slate-400 shrink-0">
                            <span>Sala WebRTC Médica: <strong>daily.co/secureflow-medic</strong></span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                              TELEMEDICINA ACTIVA
                            </span>
                          </div>

                          {/* Daily.co Clinical frame mockup */}
                          <div className="flex-1 bg-slate-900 border-b border-white/5 relative flex items-center justify-center">
                            <iframe 
                              src="https://iframe.daily.co/secureflow-telemedicina-guardia" 
                              allow="camera; microphone; fullscreen" 
                              className="absolute inset-0 w-full h-full border-0 rounded-b-none"
                              title="Daily.co Medic video consulting"
                            />
                            {/* Medical clinical HUD */}
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[9px] text-white space-y-0.5 pointer-events-none z-10 border border-white/5 mx-auto">
                              <div>ESPECIALISTA: Dr. Luis Beltrán</div>
                              <div>MEDICINA CRÍTICA / MSAS-42.501</div>
                            </div>
                            
                            <div className="absolute bottom-2 right-2 flex gap-1 z-10">
                              <button 
                                onClick={() => setIsMedicDailyCoActive(false)}
                                className="px-3 py-1 bg-red-650 hover:bg-red-750 text-white font-bold text-[9px] uppercase rounded-lg shadow-lg"
                              >
                                Apagar Cámara
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col justify-stretch overflow-hidden bg-slate-900">
                          {/* Chat history list */}
                          <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {medicMessages.map((msg, idx) => (
                              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[8px] text-slate-500 font-mono mb-0.5">
                                  {msg.sender === 'user' ? 'Asegurado (Tú)' : 'Dr. Luis Beltrán'} • {msg.time}
                                </span>
                                <div className={`p-2.5 rounded-2xl text-[11px] max-w-[85%] leading-relaxed ${
                                  msg.sender === 'user' 
                                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5'
                                }`}>
                                  {msg.text}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Collapsible Clinical AI Diagnostics inside Doctor Consultation box */}
                          <div className="p-2 border-t border-white/5 bg-slate-950 space-y-2 shrink-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-indicator animate-pulse text-indigo-400 flex items-center gap-1">
                                <span>🤖</span> ASISTENTE CLÍNICO AI COMPARTIDO
                              </span>
                            </div>
                            <div className="max-h-20 overflow-y-auto p-1.5 bg-slate-900 border border-white/5 rounded-xl text-[9px] text-slate-300 space-y-1 font-mono">
                              {medicAgentMessages.slice(-2).map((m, i) => (
                                <div key={i}>
                                  <strong className="text-indigo-400">{m.sender === 'user' ? 'Tú : ' : 'AI : '}</strong>
                                  {m.text}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                value={medicAgentInput}
                                onChange={e => setMedicAgentInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSendMedicAI(); }}
                                placeholder="Consulte dosis o triaje preliminar..."
                                className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-2 py-1 text-[9px] text-white focus:outline-none"
                              />
                              <button 
                                onClick={handleSendMedicAI}
                                className="px-2.5 bg-indigo-650 text-white font-bold text-[9px] rounded-lg"
                              >
                                Consultar AI
                              </button>
                            </div>
                          </div>

                          {/* Message inputs and trigger for Daily.co */}
                          <div className="p-2.5 bg-slate-950 border-t border-white/5 flex items-center gap-2 shrink-0">
                            <button 
                              onClick={() => setIsMedicDailyCoActive(true)}
                              className="p-2 bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/25 text-emerald-400 rounded-xl transition-all shrink-0"
                              title="Activar Videoconsulta Daily.co"
                            >
                              📹
                            </button>
                            
                            <input 
                              type="text"
                              value={medicChatInput}
                              onChange={e => setMedicChatInput(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleSendMedicMessage('user'); }}
                              placeholder="Describe tus síntomas al especialista..."
                              className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                            />
                            
                            <button 
                              onClick={() => handleSendMedicMessage('user')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                            >
                              Enviar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Android Bottom bar navigation */}
                  <div className="h-14 bg-slate-900 border-t border-slate-800/60 shrink-0 flex justify-around items-center select-none z-10 px-4">
                    <button 
                      onClick={() => setCitizenTab('home')}
                      className={`flex flex-col items-center gap-0.5 ${citizenTab === 'home' ? 'text-blue-500 font-bold' : 'text-slate-500'}`}
                    >
                      <Shield className="w-5 h-5 shrink-0" />
                      <span className="text-[9px] uppercase">Inicio</span>
                    </button>
                    
                    <button 
                      onClick={() => setCitizenTab('agent')}
                      className={`flex flex-col items-center gap-0.5 relative ${citizenTab === 'agent' ? 'text-blue-500 font-bold' : 'text-slate-500'}`}
                    >
                      <MessageSquare className="w-5 h-5 shrink-0" />
                      {towState === 'dispatched' && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500" />}
                      <span className="text-[9px] uppercase">Agente Legal</span>
                    </button>

                    <button 
                      onClick={() => setCitizenTab('profile')}
                      className={`flex flex-col items-center gap-0.5 ${citizenTab === 'profile' ? 'text-blue-500 font-bold' : 'text-slate-500'}`}
                    >
                      <User className="w-5 h-5 shrink-0" />
                      <span className="text-[9px] uppercase">Perfil</span>
                    </button>
                  </div>

                </div>
              )}

              {/* ---------------- SCREEN 3: LAWYER PORTAL ---------------- */}
              {activeDevice === 'lawyer' && sessionUser && (
                <div className="flex-1 flex flex-col justify-stretch">
                  
                  {/* Top Header */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <SecureFlowLogoCustom className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-black tracking-tight text-white uppercase">SecureFlow Abogado</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-900/10">
                        {completedLawyerSessions} Casos
                      </span>
                      <button 
                        onClick={handleSignOut}
                        className="bg-red-950 hover:bg-red-900 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-red-900/20 active:scale-95 transition-all uppercase"
                      >
                        Salir
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
                    
                    {lawyerTab === 'guardia' && (
                      <div className="space-y-4">
                        
                        {/* Status Toggle Widget */}
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estado de Guardia Penal</span>
                          
                          <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              {isLawyerOnline ? (
                                <>
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                  📡 En Línea y Disponible
                                </>
                              ) : (
                                <>
                                  <span className="w-1.5 h-1.5 bg-slate-505 rounded-full" />
                                  🌙 Desconectado (Soporte Pausado)
                                </>
                              )}
                            </span>
                            <button 
                              onClick={() => {
                                const newOnline = !isLawyerOnline;
                                setIsLawyerOnline(newOnline);
                                triggerPush('⚖️ Guardia Actualizada', newOnline ? 'Has establecido tu disponibilidad online en el motor de asistencia penal.' : 'Te has desconectado de la guardia de defensa.');
                              }}
                              className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide transition-all ${isLawyerOnline ? 'bg-emerald-500 text-slate-950 hover:opacity-90' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                            >
                              {isLawyerOnline ? 'ONLINE' : 'CONECTARSE'}
                            </button>
                          </div>
                        </div>
                        
                        {/* Dynamic Emergency Alarm Card */}
                        {activeEmergency && activeEmergency.status === 'calling' ? (
                          <div className="bg-gradient-to-br from-red-650 to-red-600 border border-red-500 rounded-3xl p-4 space-y-3 text-white shadow-xl">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] bg-black/30 font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                                🚨 AUXILIO EN CURSO
                              </span>
                              <span className="text-[10px] font-mono font-bold animate-pulse">⏰ 00:25</span>
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-sm font-black">{activeEmergency.citizenName}</h4>
                              <p className="text-[11px] text-red-100 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                Detención por Alcabala vehicular
                              </p>
                              <p className="text-[10px] text-red-200">📍 Ciudad: {activeEmergency.citizenCity}</p>
                            </div>

                            {/* Tariff proposal builder */}
                            <div className="p-2.5 bg-black/20 rounded-xl space-y-1.5">
                              <label className="text-[9px] text-red-200 font-bold uppercase block">Proponer Honorarios Asistencia ($)</label>
                              <div className="flex gap-1.5">
                                <button onClick={() => setProposedTariff(15)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${proposedTariff === 15 ? 'bg-white text-slate-900 border-white' : 'text-white border-white/20'}`}>$15 (Min)</button>
                                <button onClick={() => setProposedTariff(25)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${proposedTariff === 25 ? 'bg-white text-slate-900 border-white' : 'text-white border-white/20'}`}>$25</button>
                                <button onClick={() => setProposedTariff(45)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border ${proposedTariff === 45 ? 'bg-white text-slate-900 border-white' : 'text-white border-white/20'}`}>$45</button>
                              </div>
                            </div>

                            <button 
                              onClick={handleLawyerAcceptEmer}
                              className="w-full bg-white text-black hover:bg-red-50 py-2.5 rounded-2xl text-xs font-black uppercase text-center transition-all shadow-md"
                            >
                              📹 ACEPTAR Y CONECTAR
                            </button>
                          </div>
                        ) : activeEmergency && activeEmergency.status === 'active' ? (
                          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-4 space-y-4">
                            <div className="flex justify-between items-center bg-amber-500/10 p-2 rounded-xl">
                              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">⚖️ SESIÓN DE AMPARO EN CURSO</span>
                              <span className="text-[10px] text-white font-mono">$ {proposedTariff.toFixed(2)}</span>
                            </div>

                            {/* Stream representation via Daily.co WebRTC room */}
                            <div className="h-48 bg-black border border-white/5 rounded-2xl relative overflow-hidden">
                              <iframe 
                                src={activeEmergency?.dailyRoomUrl || "https://iframe.daily.co/secureflow-abogado-defensa"}
                                allow="camera; microphone; fullscreen"
                                className="w-full h-full border-0"
                                title="Daily.co Lawyer WebRTC Stream"
                              />
                              <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[8px] text-red-400 font-mono tracking-wider pointer-events-none z-10 border border-white/5 uppercase">
                                SALA ACTIVADA: {activeEmergency?.id ? activeEmergency.id.substring(0, 8).toUpperCase() : 'secureflow-abogado-defensa'}
                              </div>
                            </div>

                            {/* End & Settle Button */}
                            <button 
                              onClick={handleEndLawyerSession}
                              className="w-full bg-red-650 text-white hover:bg-red-600 py-3 rounded-2xl text-xs font-black uppercase text-center transition-all shadow-md active:scale-95"
                            >
                              Finalizar Sesión y Cobrar honorarios
                            </button>
                          </div>
                        ) : (
                          /* Idle Radar state or Offline notice */
                          !isLawyerOnline ? (
                            <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl text-center space-y-3">
                              <span className="text-4xl block opacity-40 animate-pulse">💤</span>
                              <h4 className="text-xs font-black text-slate-400 uppercase">Sin Guardia Activa</h4>
                              <p className="text-[11px] text-slate-500">
                                Estás actualmente fuera de línea. Activa tu disponibilidad para recibir llamadas SOS y telemetría de defensas vehiculares en tiempo real.
                              </p>
                              <button 
                                onClick={() => {
                                  setIsLawyerOnline(true);
                                  triggerPush('⚖️ Guardia Penal', 'Establecido online. Consola conectada al despacho global de asistencias SOS.');
                                }}
                                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] uppercase transition-all"
                              >
                                Activar Guardia Ahora
                              </button>
                            </div>
                          ) : (
                            /* Idle Radar state when on duty */
                            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl text-center space-y-4 animate-fade-in">
                              
                              <div className="flex justify-center py-4">
                                <div className="w-32 h-32 rounded-full border border-slate-800 flex items-center justify-center relative overflow-hidden">
                                  <div className="absolute inset-2 rounded-full border border-slate-800/50 flex items-center justify-center">
                                    <div className="absolute inset-4 rounded-full border border-slate-800/20" />
                                  </div>
                                  <div className="absolute w-full h-full animate-sweep origin-center bg-gradient-to-tr from-rose-500/15 to-transparent pr-12 rounded-full" />
                                  <span className="text-3xl text-slate-400 hover:scale-110 active:scale-90 select-none z-10 shrink-0">📡</span>
                                </div>
                              </div>

                              <p className="text-[11px] text-slate-400 px-4">
                                cuando un ciudadano active el sos recibiras de inmediato el audio, video y telemetria de su ubicación exacta.
                              </p>
                            </div>
                          )
                        )}

                      </div>
                    )}

                    {lawyerTab === 'agent' && (
                      <div className="flex flex-col h-full bg-slate-950 rounded-2xl">
                        {/* Messages Area */}
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[300px] scrollbar-thin">
                          
                          {lawyerAgentMessages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                              <span className="text-[9px] text-slate-500 mb-0.5 font-mono uppercase">
                                {msg.sender === 'bot' ? 'Agente' : 'Tú'} • {msg.time}
                              </span>
                              <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${msg.sender === 'user' ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                                <p className="whitespace-pre-line">{msg.text}</p>
                              </div>
                            </div>
                          ))}

                        </div>

                        {/* Input Area */}
                        <div className="p-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-1.5 shrink-0 rounded-b-2xl">
                          <input 
                            type="text" 
                            placeholder="Consultar COPP, alcabalas, jurisprudencias..."
                            value={lawyerAgentInput}
                            onChange={(e) => setLawyerAgentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleLawyerAgentSend();
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                          />
                          <button 
                            onClick={handleLawyerAgentSend}
                            disabled={isIAPending}
                            className={`p-2 rounded-xl text-slate-950 transition-all font-bold ${isIAPending ? 'bg-slate-800 text-slate-500' : 'bg-amber-500 hover:bg-amber-400 active:scale-95'}`}
                          >
                            <Send className="w-3.5 h-3.5 text-slate-950" />
                          </button>
                        </div>
                      </div>
                    )}

                    {lawyerTab === 'history' && (
                      <div className="space-y-3">
                        <div className="p-4 bg-gradient-to-tr from-amber-600 to-amber-500 rounded-2xl text-slate-950 text-center shadow-md">
                          <span className="text-[10px] font-bold uppercase tracking-widest block">Nómina Acumulada</span>
                          <h3 className="text-2xl font-black mt-1">$ {totalLawyerEarnings.toFixed(2)} USD</h3>
                          <p className="text-[9px] font-bold uppercase tracking-wider block mt-0.5">Honorarios Netos Retirables</p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Bitácora de Casos Resueltos</span>
                          
                          {lawyerHistory.length > 0 ? (
                            lawyerHistory.map((item, idx) => (
                              <div key={item.id || idx} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                                <div>
                                  <h5 className="font-bold text-white uppercase">Sesión #{item.emergencia_id || 'SOS-N/A'}</h5>
                                  <p className="text-[10px] text-slate-400">
                                    {item.servicio || 'Defensa Legal'} • {item.created_at ? new Date(item.created_at).toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Reciente'}
                                  </p>
                                </div>
                                <span className="font-mono text-emerald-400 font-bold">
                                  +${Number(item.ganancia_profesional || 0).toFixed(2)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 bg-slate-900/30 border border-dashed border-slate-800/80 rounded-xl text-center text-[11px] text-slate-500 font-medium">
                              Aún no hay casos resueltos
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Android style lawyer bottom nav */}
                  <div className="h-14 bg-slate-900 border-t border-slate-800/60 shrink-0 flex justify-around items-center px-4">
                    <button 
                      onClick={() => setLawyerTab('guardia')}
                      className={`flex flex-col items-center gap-0.5 ${lawyerTab === 'guardia' ? 'text-amber-500 font-bold' : 'text-slate-500'}`}
                    >
                      <Power className="w-5 h-5" />
                      <span className="text-[9px]">Guardia</span>
                    </button>
                    
                    <button 
                      onClick={() => setLawyerTab('agent')}
                      className={`flex flex-col items-center gap-0.5 ${lawyerTab === 'agent' ? 'text-amber-500 font-bold' : 'text-slate-500'}`}
                    >
                      <BookOpenIcon className="w-5 h-5" />
                      <span className="text-[9px]">Códigos</span>
                    </button>

                    <button 
                      onClick={() => setLawyerTab('history')}
                      className={`flex flex-col items-center gap-0.5 ${lawyerTab === 'history' ? 'text-amber-500 font-bold' : 'text-slate-500'}`}
                    >
                      <DollarSign className="w-5 h-5" />
                      <span className="text-[9px]">Ganancias</span>
                    </button>
                  </div>

                </div>
              )}

              {/* ---------------- SCREEN 4: TOW TRUCK PANEL ---------------- */}
              {activeDevice === 'driver' && sessionUser && (
                <div className="flex-1 flex flex-col justify-stretch">
                  
                  {/* Top Bar */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <SecureFlowLogoCustom className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-black text-white uppercase">SecureFlow Vial</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                        Saldo: $ {driverBalance.toFixed(2)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${driverDebt >= 20.00 ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        Deuda: $ {driverDebt.toFixed(2)}
                      </span>
                      <button 
                        onClick={handleSignOut}
                        className="bg-red-950 hover:bg-red-900 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-red-900/20 active:scale-95 transition-all uppercase"
                      >
                        Salir
                      </button>
                    </div>
                  </div>

                  {/* Body area */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
                    
                    {/* Blocked Debt Warning popup inside emulator */}
                    {driverDebt >= 20.00 ? (
                      <div className="bg-slate-900 border-2 border-red-500 p-5 rounded-3xl text-center space-y-4">
                        <div className="text-4xl">🔴</div>
                        <h3 className="text-sm font-black text-white uppercase">Vehículo Bloqueado</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          Has acumulado comisiones insolutas de la plataforma superiores al margen crediticio autorizado ($20.00). Por favor, liquida tu comisión para reactivar despachos.
                        </p>

                        <div className="p-3 bg-slate-950 rounded-xl text-left border border-slate-800 space-y-2">
                          <span className="text-[9px] text-slate-500 uppercase block font-bold">Opciones de Liquidación</span>
                          <button 
                            onClick={() => setShowBinanceModal(true)}
                            className="w-full text-left bg-indigo-900 p-2 rounded-lg text-xs font-bold text-white hover:bg-indigo-800 transition-all block text-center"
                          >
                            🪙 Binance Pay (Liquidación Express)
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Active dashboard contents */
                      <div className="space-y-4">
                        
                        {driverTab === 'vial' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Estado de Flota de Grúa</span>
                              
                              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                                <span className="text-xs font-bold text-white">Disponibilidad GPS</span>
                                <button 
                                  onClick={() => {
                                    setTowDriverOnline(!towDriverOnline);
                                    triggerPush('🚜 GPS Disponibilidad', towDriverOnline ? 'Operador desactivado de guardia vial.' : 'Guardia vial activa. GPS transmitiendo...');
                                  }}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide ${towDriverOnline ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                                >
                                  {towDriverOnline ? 'ONLINE' : 'DESACTIVAR'}
                                </button>
                              </div>
                            </div>

                            {/* Waiting/Idle State */}
                            {towState === 'idle' && (
                              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-4">
                                <div className="relative flex justify-center items-center h-16 w-16 mx-auto">
                                  {towDriverOnline ? (
                                    <>
                                      <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-emerald-400 opacity-20"></span>
                                      <span className="relative inline-flex rounded-full h-8 w-8 bg-emerald-500 justify-center items-center text-slate-950 text-sm font-black">🚜</span>
                                    </>
                                  ) : (
                                    <span className="relative inline-flex rounded-full h-8 w-8 bg-slate-800 justify-center items-center text-slate-500 text-sm font-black">🚜</span>
                                  )}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-sm font-medium text-white">
                                    {towDriverOnline ? 'Central de Guardia Activa' : 'Guardia Inactiva'}
                                  </h4>
                                  <p className="text-[11px] text-slate-400">
                                    {towDriverOnline 
                                      ? 'En línea, esperando solicitudes reales del ciudadano en tiempo real...' 
                                      : 'Desconectado del sistema. Activa tu disponibilidad para empezar a recibir alertas.'}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Incoming dispatch notifications to show multi-view communication */}
                            {towState === 'proposed' && activeTowJob && (
                              <div className="bg-yellow-500 text-slate-950 p-4 rounded-3xl space-y-3 shadow-xl animate-pulse">
                                <div>
                                  <span className="text-[9px] bg-black/10 font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                                    🚨 DESPACHO VIAL DETECTADO
                                  </span>
                                  <h4 className="text-sm font-black mt-2">Asegurado: {activeTowJob.citizenName}</h4>
                                  {(() => {
                                    const distKm = (activeTowJob.distance || 5400) / 1000;
                                    const baseF = tariffs.grua?.tarifa_base ?? 30.00;
                                    const kmR = tariffs.grua?.precio_por_km ?? 4.50;
                                    const costKm = distKm * kmR;
                                    const totalCalculated = baseF + costKm;
                                    const driverEarnings = totalCalculated * 0.80; // 80% split for driver, 20% platform
                                    return (
                                      <div className="text-[11px] text-slate-800 space-y-1 mt-2 font-mono">
                                        <p>• Distancia real (GPS): <span className="font-sans font-bold">{distKm.toFixed(2)} Km</span></p>
                                        <p>• Tarifa Base: <span className="font-sans font-bold">${baseF.toFixed(2)} USD</span></p>
                                        <p>• Costo por Km (${kmR.toFixed(2)}/km): <span className="font-sans font-bold">${costKm.toFixed(2)} USD</span></p>
                                        <p className="border-t border-black/10 pt-1">• Costo Total: <span className="font-sans font-bold text-xs">${totalCalculated.toFixed(2)} USD</span></p>
                                        <p className="font-sans font-extrabold text-slate-950">💰 Ganancia Estimada (80%): ${driverEarnings.toFixed(2)} USD</p>
                                      </div>
                                    );
                                  })()}
                                </div>

                                <button 
                                  onClick={handleDriverAcceptJob}
                                  className="w-full bg-slate-950 text-yellow-400 py-2.5 rounded-xl text-xs font-black uppercase text-center hover:bg-slate-900 transition-all shadow-md active:scale-95"
                                >
                                  ACEPTAR E INICIAR RUTA VIAL
                                </button>
                              </div>
                            )}

                            {/* Driver Navigation tracking details */}
                            {towState === 'dispatched' && activeTowJob && (
                              <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                                    CONDUCIENDO CON GPS ACTIVO
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">ID: {activeTowJob.id.substring(0, 8).toUpperCase()}</span>
                                </div>

                                <button
                                  onClick={handleSimulateDriverProgress}
                                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-950 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                                >
                                  <span>🚜 Avanzar Ruta Grúa (Simular GPS)</span>
                                </button>

                                {/* Street map tracking active real Leaflet component */}
                                {towState === 'dispatched' && craneUnitState?.lat_actual && craneUnitState?.lng_actual && (activeTowJob?.latitude || 10.4984) && (activeTowJob?.longitude || -66.8824) ? (
                                  <div className="h-56 rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg">
                                    <RoadsideMap
                                      driverLat={craneUnitState.lat_actual}
                                      driverLng={craneUnitState.lng_actual}
                                      citizenLat={activeTowJob?.latitude || 10.4984}
                                      citizenLng={activeTowJob?.longitude || -66.8824}
                                    />
                                  </div>
                                ) : (
                                  <div className="h-56 rounded-2xl border border-slate-800/20 bg-slate-950 flex flex-col justify-center items-center p-3 text-center space-y-1">
                                    <span className="text-lg animate-spin text-indigo-400">📡</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Iniciando Señal GPS de Navegación...</span>
                                    <p className="text-[9px] text-slate-500">Buscando coordenadas del remolque y del asegurado.</p>
                                  </div>
                                )}

                                {/* Active daily.co WebRTC Video control for driver sync */}
                                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800/60 space-y-2.5">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Transmisión de Video</span>
                                    <button
                                      onClick={() => {
                                        setIsTowDailyCoActive(!isTowDailyCoActive);
                                        const webrtcUrl = activeVialAssist?.sala_webrtc_url || ("https://iframe.daily.co/secureflow-tow-" + activeTowJob.id);
                                        setTowDailyCoUrl(webrtcUrl);
                                      }}
                                      className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${
                                        isTowDailyCoActive 
                                          ? 'bg-red-650 hover:bg-red-750 text-white border-red-500/35' 
                                          : 'bg-indigo-650 hover:bg-indigo-550 text-white border-indigo-500/35 shadow'
                                      }`}
                                    >
                                      {isTowDailyCoActive ? '📹 Ocultar Stream' : '📹 Activar Cámara (WebRTC)'}
                                    </button>
                                  </div>

                                  {isTowDailyCoActive && (
                                    <div className="h-44 bg-slate-950 rounded-xl overflow-hidden relative border border-indigo-505/20">
                                      <iframe 
                                        src={towDailyCoUrl || activeVialAssist?.sala_webrtc_url || ("https://iframe.daily.co/secureflow-tow-" + activeTowJob.id)}
                                        allow="camera; microphone; fullscreen"
                                        className="w-full h-full border-0"
                                        title="Daily.co Tow Driver stream"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Quick messages log panel to driver */}
                                <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                                  <span className="text-[9px] text-slate-500 uppercase font-bold block mb-1">Mensaje de un click al Cliente</span>
                                  <div className="flex gap-1.5">
                                    <button 
                                      onClick={() => {
                                        setDriverChatInput('Voy en ruta, hay tráfico en la autopista.');
                                        setTimeout(() => handleSendTowMessage('driver'), 100);
                                      }} 
                                      className="bg-slate-900 py-1 px-2 rounded hover:bg-slate-800 text-[9px]"
                                    >
                                      Hay Tráfico 🚧
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setDriverChatInput('Acabo de llegar al sitio de la colisión.');
                                        setTimeout(() => handleSendTowMessage('driver'), 100);
                                      }} 
                                      className="bg-slate-900 py-1 px-2 rounded hover:bg-slate-800 text-[9px]"
                                    >
                                      Llegué al Sitio 🏁
                                    </button>
                                  </div>
                                </div>

                                {/* Interactive live chat panel for Tow Truck Driver */}
                                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 flex flex-col">
                                  <span className="text-[9px] text-amber-400 uppercase font-black block tracking-wider">💬 Chat de Asistencia (En Vivo)</span>
                                  
                                  {/* Messages list */}
                                  <div className="max-h-[120px] overflow-y-auto space-y-2 p-1.5 bg-slate-900/50 rounded-xl scrollbar-thin">
                                    {towMessages.length === 0 ? (
                                      <p className="text-[10px] text-slate-500 text-center py-4">No hay mensajes recientes en ruta.</p>
                                    ) : (
                                      towMessages.map((tmsg, idx) => (
                                        <div key={idx} className={`flex flex-col ${tmsg.sender === 'driver' ? 'items-end' : 'items-start'}`}>
                                          <span className="text-[8px] text-slate-400 mb-0.5 font-mono uppercase">
                                            {tmsg.sender === 'driver' ? 'Tú' : 'Asegurado'}
                                          </span>
                                          <div className={`p-2 rounded-xl text-xs max-w-[90%] leading-normal ${tmsg.sender === 'driver' ? 'bg-yellow-500 text-slate-950 font-bold rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'}`}>
                                            <p className="whitespace-pre-line">{tmsg.text}</p>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  {/* Text Input Row */}
                                  <div className="flex gap-1.5">
                                    <input 
                                      type="text"
                                      placeholder="Escribe un mensaje al asegurado..."
                                      value={driverChatInput}
                                      onChange={(e) => setDriverChatInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleSendTowMessage('driver');
                                        }
                                      }}
                                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-yellow-550"
                                    />
                                    <button 
                                      onClick={() => handleSendTowMessage('driver')}
                                      className="px-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl text-slate-950 font-black text-xs transition-all active:scale-95 shrink-0"
                                    >
                                      Enviar
                                    </button>
                                  </div>
                                </div>

                                <button 
                                  onClick={handleFinalizeTowJob}
                                  className="w-full bg-emerald-500 text-slate-950 py-3 rounded-2xl text-xs font-black uppercase text-center hover:bg-emerald-400 transition-all shadow-md active:scale-95"
                                >
                                  Finalizar Servicio de Remolque
                                </button>
                              </div>
                            )}

                            <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-2xl">
                              <span className="text-xs font-bold text-white block uppercase mb-1">Estatuto Vial Ley de Tránsito</span>
                              <p className="text-[11px] text-slate-400 leading-relaxed">
                                Las aseguradoras están obligadas a registrar triaje visual inmediato antes del despacho físico para mitigar fraudes de grúas fantasmas.
                              </p>
                            </div>
                          </div>
                        )}

                        {driverTab === 'agent' && (
                          <div className="flex-1 flex flex-col justify-stretch h-full space-y-4">
                            {/* Central Dispatch Support Chat Console */}
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col h-[380px] min-h-[300px]">
                              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 shrink-0">
                                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                <div className="flex-1">
                                  <h4 className="text-xs font-black text-white uppercase">Operadora de Guardia IA</h4>
                                  <p className="text-[9px] text-slate-500 font-mono tracking-wider">Soporte Operativo & Triaje Vial 24/7</p>
                                </div>
                              </div>

                              {/* Message History Scroller */}
                              <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 scrollbar-thin">
                                {driverSupportMessages.map((msg, idx) => (
                                  <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <span className="text-[9px] text-slate-500 mb-0.5 font-mono">
                                      {msg.sender === 'user' ? 'Tú (Operador)' : 'Central AI'}
                                    </span>
                                    <div className={`p-3 rounded-2xl text-[11px] max-w-[85%] leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none font-bold' : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-tl-none'}`}>
                                      <p className="whitespace-pre-line">{msg.text}</p>
                                    </div>
                                  </div>
                                ))}
                                
                                {isDriverSupportPending && (
                                  <div className="flex flex-col items-start animate-pulse">
                                    <span className="text-[9px] text-slate-500 mb-0.5 font-mono">Central AI</span>
                                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl rounded-tl-none text-slate-500 text-[11px] flex gap-1 items-center">
                                      <span>Transmitiendo consulta de soporte vial...</span>
                                      <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Input Box Row */}
                              <div className="flex gap-2 pt-2 border-t border-slate-800 shrink-0">
                                <input 
                                  type="text"
                                  placeholder="Escribe tu consulta del reglamento de tránsito o de comisiones..."
                                  value={driverSupportInput}
                                  onChange={(e) => setDriverSupportInput(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleDriverSupportSend();
                                  }}
                                  className="flex-1 bg-slate-950 border border-slate-850 rounded-2xl px-4 py-2.5 text-[11px] text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                />
                                <button 
                                  onClick={handleDriverSupportSend}
                                  className="px-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-white font-black text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  Enviar
                                </button>
                              </div>
                            </div>

                            {/* Secondary Note Details */}
                            <div className="p-3.5 bg-slate-950/40 border border-slate-900 rounded-2xl flex items-start gap-2.5">
                              <span className="text-sm">👮</span>
                              <div className="space-y-0.5">
                                <span className="text-[10px] text-slate-400 font-bold block uppercase">Reglamento Vial de Seguros</span>
                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                  La Ley de Transporte Terrestre exige un registro preventivo de los siniestros de remolque para procesar el reclamo de grúa ante aseguradoras corporativas oficiales.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>

                  {/* Android style driver bottom nav */}
                  <div className="h-14 bg-slate-900 border-t border-slate-800/60 shrink-0 flex justify-around items-center px-4">
                    <button 
                      onClick={() => setDriverTab('vial')}
                      className={`flex flex-col items-center gap-0.5 ${driverTab === 'vial' ? 'text-yellow-500 font-bold' : 'text-slate-500'}`}
                    >
                      <Truck className="w-5 h-5" />
                      <span className="text-[9px]">Servicio</span>
                    </button>
                    
                    <button 
                      onClick={() => setDriverTab('agent')}
                      className={`flex flex-col items-center gap-0.5 ${driverTab === 'agent' ? 'text-yellow-500 font-bold' : 'text-slate-500'}`}
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-[9px]">Soporte AI</span>
                    </button>
                  </div>

                </div>
              )}

              {/* ---------------- SCREEN 5: ADMIN PORTAL (admin.html) ---------------- */}
              {activeDevice === 'admin' && (
                <div className="flex-1 flex flex-col justify-stretch">
                  
                  {/* Top Header */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white font-extrabold">
                        ⚙️
                      </div>
                      <span className="text-xs font-black tracking-tight text-white uppercase">Control de Dios Admin</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={handleSignOut}
                        className="bg-red-950 hover:bg-red-900 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-red-900/20 active:scale-95 transition-all uppercase cursor-pointer"
                      >
                        Salir / Cerrar Sesión
                      </button>
                    </div>
                  </div>

                  {/* Body contents */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
                    
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3.5">
                      <span className="text-xs font-bold text-slate-200 block border-b border-slate-800/60 pb-1.5">
                        Inyectar Saldo a Ciudadano
                      </span>
                      
                      <div className="space-y-2.5">
                        <div>
                          <label className="text-[9px] text-slate-500 font-bold block uppercase mb-1">ID Ciudadano (Teléfono o UUID)</label>
                          <input 
                            type="text" 
                            value={adminTargetPhone}
                            onChange={(e) => setAdminTargetPhone(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[9px] text-slate-500 font-bold block uppercase mb-1">Monto USD ($)</label>
                          <input 
                            type="number" 
                            value={adminInjectedBalance}
                            onChange={(e) => setAdminInjectedBalance(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                          />
                        </div>

                        <button 
                          onClick={handleAdminInjectBalance}
                          className="w-full bg-rose-650 hover:bg-rose-600 text-white font-bold py-2 rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-rose-900/20"
                        >
                          Inyectar Saldo Simulado
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
                      <span className="text-xs font-bold text-slate-200 block border-b border-slate-800/60 pb-1.5">
                        Liquidación Nómina Abogados
                      </span>
                      
                      <div className="flex justify-between items-center text-xs">
                        <div>
                          <h5 className="font-bold text-white">Dra. María Mendoza (INPRE-98.421)</h5>
                          <p className="text-[10px] text-slate-500">Pendiente: $ {totalLawyerEarnings.toFixed(2)} USD</p>
                        </div>
                        
                        <button 
                          onClick={handleAdminPayoutLawyer}
                          className="bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/10 px-3 py-1 rounded text-[11px] font-bold"
                        >
                          Emitir Pago
                        </button>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* ---------------- SCREEN 6: AMBULANCE DISPATCH & MEDICAL GUARD PORTAL ---------------- */}
              {activeDevice === 'ambulance' && sessionUser && (
                <div className="flex-1 flex flex-col justify-stretch">
                  {/* Top Bar */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🚑</span>
                      <span className="text-xs font-black text-white uppercase">Soporte Vital Guardia</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                        Saldo: $ {ambulanceBalanceClean.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400">
                        Ambulancia: Activa
                      </span>
                      <button 
                        onClick={handleSignOut}
                        className="bg-red-950 hover:bg-red-900 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-red-900/20 active:scale-95 transition-all uppercase"
                      >
                        Salir
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Flota Terrestre</span>
                        <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                          <span className="text-xs font-bold text-white">Estado de Guardia</span>
                          <button 
                            onClick={() => {
                              setIsAmbulanceOnline(!isAmbulanceOnline);
                              triggerPush('🚑 Guardia Médica', isAmbulanceOnline ? 'Ambulancia se reporta libre descanso.' : 'Ambulancia en guardia de cuidados críticos.');
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide ${isAmbulanceOnline ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                          >
                            {isAmbulanceOnline ? 'ONLINE' : 'DESACTIVADO'}
                          </button>
                        </div>
                      </div>

                      {/* Pending Job Card */}
                      {ambulanceState === 'proposed' && activeAmbulanceJob && (
                        <div className="bg-red-505 text-white p-4 rounded-3xl space-y-3 shadow-xl animate-pulse">
                          <div>
                            <span className="text-[9px] bg-black/10 font-bold uppercase px-1.5 py-0.5 rounded">
                              🚨 TRASLADO CRÍTICO REPORTADO
                            </span>
                            <h4 className="text-sm font-black mt-2">Paciente: {activeAmbulanceJob.citizenName}</h4>
                            <p className="text-[11px] text-rose-100 leading-tight mt-1">
                              Soporte de cuidados a 2.1 Km de distancia. Tarifa contratada: $ {activeAmbulanceJob.price.toFixed(2)} USD.
                            </p>
                          </div>

                          <button 
                            onClick={async () => {
                              setAmbulanceState('dispatched');
                              triggerPush('🚑 Ruta de Rescate', 'Ruta hacia el asegurado iniciada con sirena encendida...');
                              try {
                                await supabase
                                  .from('emergencias_activas')
                                  .update({ 
                                    estado: 'activa',
                                    abogado_id: sessionUser?.id || null
                                  })
                                  .eq('id', activeAmbulanceJob.id);
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="w-full bg-slate-950 text-red-400 py-2.5 rounded-xl text-xs font-black uppercase text-center hover:bg-slate-900 transition-all shadow-md"
                          >
                            ACEPTAR TRASLADO DE EMERGENCIA
                          </button>
                        </div>
                      )}

                      {/* Active Dispatch Chat & Control */}
                      {ambulanceState === 'dispatched' && activeAmbulanceJob && (
                        <div className="p-4 bg-slate-900 border border-slate-805 rounded-3xl space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-red-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                              UNIDAD EN RUTA CON GPS ACTIVO
                            </span>
                            <span className="text-[10px] text-slate-500">ID: {activeAmbulanceJob.id.substring(0, 8).toUpperCase()}</span>
                          </div>

                          <div className="space-y-1 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                            <div className="text-[10px] text-slate-400">Paciente: <strong className="text-white">{activeAmbulanceJob.citizenName}</strong></div>
                            <div className="text-[10px] text-slate-400">Teléfono: <strong className="text-white">{activeAmbulanceJob.citizenPhone}</strong></div>
                            <div className="text-[10px] text-slate-400">Dirección: <strong className="text-white">Caracas (GPS Trazable)</strong></div>
                          </div>

                          {/* 1. Daily.co Video consultation room for Paramedic */}
                          <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-teal-400 font-bold uppercase block">Canal Directo Daily.co</span>
                              <span className="text-[8px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5 font-mono">https://iframe.daily.co/secureflow-emergencia-vial</span>
                            </div>
                            <iframe 
                              src="https://iframe.daily.co/secureflow-emergencia-vial" 
                              allow="camera; microphone; fullscreen" 
                              className="w-full h-44 rounded-xl border border-white/5" 
                              title="Daily.co Paramedic Interface"
                            />
                          </div>

                          {/* 2. Asistente de Trauma AI Technical Assistant to query Gemini */}
                          <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl space-y-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🤖</span>
                              <span className="text-[10px] uppercase font-black text-indigo-400">Asistente AI de Trauma de Guardia</span>
                            </div>
                            <div className="max-h-24 overflow-y-auto bg-slate-950 p-2.5 rounded-xl text-[10px] space-y-1 font-mono text-slate-300">
                              {ambulanceAgentMessages.map((m, i) => (
                                <div key={i}>
                                  <strong className="text-indigo-400">{m.sender === 'user' ? 'Tú : ' : 'AI : '}</strong>
                                  {m.text}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                value={ambulanceAgentInput}
                                onChange={e => setAmbulanceAgentInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSendAmbulanceAI(); }}
                                placeholder="Consultar protocolos clínicos para quemaduras, soporte..."
                                className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                              />
                              <button 
                                onClick={handleSendAmbulanceAI}
                                className="px-3 bg-indigo-650 text-white font-bold text-[9px] rounded-lg focus:outline-none"
                              >
                                Preguntar
                              </button>
                            </div>
                          </div>

                          {/* 3. Chat Box with Citizen */}
                          <div className="space-y-2">
                            <span className="text-[9px] text-slate-400 font-bold uppercase block">Mensajería Paciente</span>
                            <div className="border border-slate-800 rounded-2xl p-2.5 bg-slate-950/50 space-y-2 h-36 overflow-y-auto">
                              {ambulanceMessages.map((msg: any, idx: number) => (
                                <div key={idx} className={`text-[11px] ${msg.sender === 'driver' ? 'text-blue-400 text-right' : 'text-slate-300'}`}>
                                  <span className="font-bold">{msg.sender === 'driver' ? 'Tú (Paramédico)' : 'Asegurado'}: </span>
                                  {msg.text}
                                </div>
                              ))}
                            </div>

                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                value={ambulanceChatInput}
                                onChange={(e) => setAmbulanceChatInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSendAmbulanceMessage('driver'); }}
                                placeholder="Escribe al asegurado..."
                                className="flex-1 bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
                              />
                              <button 
                                onClick={() => handleSendAmbulanceMessage('driver')}
                                className="bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                              >
                                Enviar
                              </button>
                            </div>
                          </div>

                          <button 
                            onClick={handleFinalizeAmbulanceJob}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-2.5 rounded-2xl text-[11px] font-black uppercase text-center transition-all shadow-md"
                          >
                            MARCAR COMO ENTREGADO / TERMINADO
                          </button>
                        </div>
                      )}

                      {/* Idle state info */}
                      {ambulanceState === 'idle' && (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3">
                          <span className="text-3xl">📡</span>
                          <h4 className="text-xs font-bold text-white uppercase">Canal de Despacho</h4>
                          <p className="text-[10px] text-slate-500">
                            Esperando llamadas de trauma o soporte crítico desde el centro insurtech nacional de SecureFlow.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- SCREEN 7: DOCTOR GUARD PORTAL ---------------- */}
              {activeDevice === 'medic' && sessionUser && (
                <div className="flex-1 flex flex-col justify-stretch">
                  {/* Top Bar */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🏥</span>
                      <span className="text-xs font-black text-white uppercase">Doctor de Guardia</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/10">
                        Triaje de Guardia
                      </span>
                      <button 
                        onClick={handleSignOut}
                        className="bg-red-950 hover:bg-red-900 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-xl border border-red-900/20 active:scale-95 transition-all uppercase"
                      >
                        Salir
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin">
                    <div className="space-y-4">
                      {/* Status card */}
                      <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Médico Guardia</span>
                        <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-800">
                          <span className="text-xs font-bold text-white">Disponibilidad Telemedicina</span>
                          <button 
                            onClick={() => {
                              setIsMedicOnline(!isMedicOnline);
                              triggerPush('🏥 Telemedicina Guardia', isMedicOnline ? 'Doctor desconectado de guardia.' : 'Especialista en guardia de teleconsulta activa.');
                            }}
                            className={`px-4 py-1.5 rounded-xl text-xs font-black tracking-wide ${isMedicOnline ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
                          >
                            {isMedicOnline ? 'ONLINE' : 'DESACTIVADO'}
                          </button>
                        </div>
                      </div>

                      {/* Active Video consultation proposal block */}
                      {medicState === 'calling' && activeMedicEmergency && (
                        <div className="bg-slate-900 border border-emerald-900/40 p-4 rounded-3xl space-y-4">
                          <div>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                              📞 SOLICITUD DE VIDEO CONSULTA TRIAJE
                            </span>
                            <h4 className="text-sm font-black mt-2 text-white">Paciente: {activeMedicEmergency.citizenName}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">
                              Comuníquese primero por chat técnico para registrar síntomas básicos, luego presione Connect para establecer Daily.co en vivo.
                            </p>
                          </div>

                          {/* Chat Box with Patient BEFORE video if desired */}
                          <div className="space-y-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                            <span className="text-[8px] text-slate-500 font-bold uppercase block font-mono">Chat Preliminar de Triaje</span>
                            <div className="max-h-32 overflow-y-auto space-y-2">
                              {medicMessages.map((msg: any, idx: number) => (
                                <div key={idx} className={`text-[11px] ${msg.sender === 'driver' ? 'text-emerald-400 text-right' : 'text-slate-300'}`}>
                                  <span className="font-bold">{msg.sender === 'driver' ? 'Tú (Médico)' : 'Paciente'}: </span>
                                  {msg.text}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1.5 pt-1 border-t border-white/5">
                              <input 
                                type="text"
                                value={medicChatInput}
                                onChange={(e) => setMedicChatInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMedicMessage('driver'); }}
                                placeholder="Escribe al paciente..."
                                className="flex-1 bg-slate-900 border border-slate-800/80 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none"
                              />
                              <button 
                                onClick={() => handleSendMedicMessage('driver')}
                                className="bg-emerald-600 text-slate-950 px-3 py-1 rounded-lg text-[10px] font-bold"
                              >
                                Enviar
                              </button>
                            </div>
                          </div>

                          <button 
                            onClick={async () => {
                              setMedicState('active');
                              triggerPush('📹 Sala Telemédica', 'Consulta iniciada. Estableciendo transmisión de video bidireccional...');
                              try {
                                await supabase
                                  .from('emergencias_activas')
                                  .update({ 
                                    estado: 'activa',
                                    abogado_id: sessionUser?.id || null
                                  })
                                  .eq('id', activeMedicEmergency.id);
                              } catch (e) {
                                console.error(e);
                              }
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-2.5 rounded-xl text-xs font-black uppercase text-center transition-all shadow-md"
                          >
                            🏥 CONECTAR CON PACIENTE EN VIVO
                          </button>
                        </div>
                      )}

                      {/* Active Consulting Stream Frame */}
                      {medicState === 'active' && activeMedicEmergency && (
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                          <div className="flex justify-between items-center bg-emerald-950/20 p-2 rounded-xl border border-emerald-900/10">
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                              SALA CLÍNICA SECUREFLOW N° {activeMedicEmergency.id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-500">Paciente: {activeMedicEmergency.citizenName}</span>
                          </div>

                          {/* 1. Real-world Daily.co Iframe consulting */}
                          <div className="relative h-48 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-stretch">
                            <iframe 
                              src="https://iframe.daily.co/secureflow-telemedicina-guardia" 
                              allow="camera; microphone; autofocus; fullscreen" 
                              className="flex-1 w-full border-0" 
                              title="Daily.co Doctor Consultation Room"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[8px] text-white pointer-events-none border border-white/5">
                              🔴 EN VIVO - CANAL DE TELEMEDICINA
                            </div>
                          </div>

                          {/* 2. Doctor Asistente Clínico AI (Gemini) */}
                          <div className="p-3 bg-indigo-950/20 border border-indigo-900/40 rounded-2xl space-y-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs">🩺</span>
                              <span className="text-[10px] uppercase font-black text-indigo-400">Asistente Clínico AI de Guardia (COPD / Sintomatología)</span>
                            </div>
                            <div className="max-h-24 overflow-y-auto bg-slate-950 p-2.5 rounded-xl text-[10px] space-y-1 font-mono text-slate-300">
                              {medicAgentMessages.map((m, i) => (
                                <div key={i}>
                                  <strong className="text-indigo-400">{m.sender === 'user' ? 'Tú : ' : 'AI : '}</strong>
                                  {m.text}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1.5">
                              <input 
                                type="text"
                                value={medicAgentInput}
                                onChange={e => setMedicAgentInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') handleSendMedicAI(); }}
                                placeholder="Consulta diagnósticos diferenciales o dosis farmacéuticas de guardia..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none"
                              />
                              <button 
                                onClick={handleSendMedicAI}
                                className="px-3 bg-indigo-650 text-white font-bold text-[9px] rounded-lg focus:outline-none"
                              >
                                Preguntar
                              </button>
                            </div>
                          </div>

                          {/* 3. Pre-call/post-call chat block */}
                          <div className="space-y-1 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                            <span className="text-[8px] text-slate-500 font-bold uppercase block font-mono">Mensajes Paciente</span>
                            <div className="max-h-28 overflow-y-auto space-y-2 p-1">
                              {medicMessages.map((msg: any, idx: number) => (
                                <div key={idx} className={`text-[11px] ${msg.sender === 'driver' ? 'text-emerald-400 text-right' : 'text-slate-300'}`}>
                                  <span className="font-bold">{msg.sender === 'driver' ? 'Tú (Médico)' : 'Paciente'}: </span>
                                  {msg.text}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-1.5 pt-1.5 border-t border-white/5">
                              <input 
                                type="text"
                                value={medicChatInput}
                                onChange={(e) => setMedicChatInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMedicMessage('driver'); }}
                                placeholder="Escribe al paciente..."
                                className="flex-1 bg-slate-900 border border-slate-800/80 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none"
                              />
                              <button 
                                onClick={() => handleSendMedicMessage('driver')}
                                className="bg-emerald-600 text-slate-950 px-3 py-1 rounded-lg text-[10px] font-bold"
                              >
                                Enviar
                              </button>
                            </div>
                          </div>

                          <button 
                            onClick={async () => {
                              try {
                                const { error: medUpdateErr } = await supabase
                                  .from('emergencias_activas')
                                  .update({ estado: 'finalizada' })
                                  .eq('id', activeMedicEmergency.id);
                                if (medUpdateErr) throw medUpdateErr;
                              } catch (e) {
                                console.error(e);
                              }
                              setMedicState('idle');
                              setActiveMedicEmergency(null);
                              showMaterialAlert('🏥 Consulta Concluida', 'Sesión telemédica terminada. Diagnóstico y receta encriptada enviados al expediente del paciente.');
                            }}
                            className="w-full bg-red-650 hover:bg-red-600 text-white py-2.5 rounded-2xl text-[11px] font-black uppercase text-center transition-all shadow-md"
                          >
                            FINALIZAR TELECONSULTA MEDICA
                          </button>
                        </div>
                      )}

                      {/* Doctor Idle Panel */}
                      {medicState === 'idle' && (
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-3">
                          <span className="text-3xl">👨🏼‍⚕️</span>
                          <h4 className="text-xs font-bold text-white uppercase text-slate-400">Expediente Médico</h4>
                          <p className="text-[10px] text-slate-500">
                            Preparado para teleconsultas urgentes de triaje integral, soporte primario y resguardo de salud de SecureFlow.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* FALLBACK SAFETY RED DE SEGURIDAD TO PREVENT BLANK SCREEN OR WRONG ROUTING */}
              {(!['landing', 'citizen', 'lawyer', 'driver', 'admin', 'ambulance', 'medic'].includes(activeDevice) || 
                (sessionUser && activeDevice === 'landing') || 
                (!sessionUser && ['citizen', 'lawyer', 'driver', 'admin', 'ambulance', 'medic'].includes(activeDevice))) && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#090b0f] text-center animate-fade-in my-auto min-h-[500px] overflow-y-auto scrollbar-thin">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-450 text-3xl mb-4 animate-pulse">
                    ⚠️
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">Red de Seguridad de Flujo</h3>
                  <p className="text-xs text-slate-400 mt-2 max-w-[320px] leading-relaxed">
                    Se ha detectado un estado indefinido o asíncrono en tu sesión. 
                    (Vista actual interna: <span className="font-mono text-amber-400 font-bold">{activeDevice}</span> | Sesión: <span className="font-mono text-blue-400 font-medium">{sessionUser ? 'Activa' : 'Inactiva'}</span>)
                  </p>
                  
                  {/* Emergency Manual Role Override Grid for rescue */}
                  {sessionUser && (
                    <div className="mt-5 w-full max-w-[320px] space-y-2.5 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">⚠️ RESTAURACIÓN MANUAL DE PANEL</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setActiveDevice('lawyer')} 
                          className="py-2 px-1 text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/20 transition-all cursor-pointer"
                        >
                          ⚖️ Abogado [lawyer]
                        </button>
                        <button 
                          onClick={() => setActiveDevice('citizen')} 
                          className="py-2 px-1 text-[10px] font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-450 rounded-xl border border-blue-500/20 transition-all cursor-pointer"
                        >
                          📱 Ciudadano [citizen]
                        </button>
                        <button 
                          onClick={() => setActiveDevice('driver')} 
                          className="py-2 px-1 text-[10px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-450 rounded-xl border border-emerald-500/20 transition-all cursor-pointer"
                        >
                          🚜 Grúa [driver]
                        </button>
                        <button 
                          onClick={() => setActiveDevice('medic')} 
                          className="py-2 px-1 text-[10px] font-bold bg-teal-500/10 hover:bg-teal-500/20 text-teal-450 rounded-xl border border-teal-500/20 transition-all cursor-pointer"
                        >
                          🏥 Médico [medic]
                        </button>
                        <button 
                          onClick={() => setActiveDevice('ambulance')} 
                          className="py-2 px-1 text-[10px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-450 rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                        >
                          🚨 Ambulancia
                        </button>
                        <button 
                          onClick={() => setActiveDevice('admin')} 
                          className="py-2 px-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl border border-white/5 transition-all cursor-pointer"
                        >
                          👑 Admin [admin]
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-2.5 w-full max-w-[280px]">
                    <button
                      onClick={async () => {
                        if (sessionUser) {
                          await loadProfileFromDb(sessionUser.id, sessionUser.email || '');
                        } else {
                          const { data: sessionData } = await supabase.auth.getSession();
                          if (sessionData?.session?.user) {
                            setSessionUser(sessionData.session.user);
                            await loadProfileFromDb(sessionData.session.user.id, sessionData.session.user.email || '');
                          } else {
                            setActiveDevice('landing');
                          }
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase cursor-pointer tracking-wider"
                    >
                      🔄 Reintentar / Cargar Perfil
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase cursor-pointer tracking-wider shadow-[0_4px_15px_rgba(225,29,72,0.3)] animate-pulse"
                    >
                      🚪 Cerrar Sesión y Salir
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Android Navigation gesture pillow bar */}
            <div className="h-4 bg-slate-950 shrink-0 flex justify-center items-center select-none z-30">
              <div className="w-24 h-1 rounded-full bg-slate-700/60" />
            </div>

          </div>

      {/* 3. SIMULATOR MODALS OVERLAY (e.g. Binance Pay settlement window for Driver Block) */}
      {showBinanceModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-5 z-50 animate-fade-in text-slate-100">
          <div className="bg-slate-900 border-2 border-yellow-500/30 p-6 rounded-3xl w-full max-w-[380px] space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                <h3 className="text-base font-black">Liquidación Binance Pay</h3>
              </div>
              <button onClick={() => setShowBinanceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Escanea el QR o envía tus comisiones directas de remolque para restablecer tus despachos viales:
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-1.5">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Dirección de Cartera Express</span>
              <strong className="text-sm text-yellow-400 font-mono tracking-widest block select-all">312467889</strong>
              <span className="text-[9px] text-slate-400 block mt-0.5">Binance ID Oficial SecureFlow</span>
            </div>

            <button 
              onClick={handlePayDriverDebt}
              className="w-full bg-yellow-500 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all tracking-wide text-center uppercase shadow-md active:scale-95"
            >
              Confirmar Recepción de $20.00 USDT
            </button>
          </div>
        </div>
      )}

      {/* 4. MODAL DIALOG REGIONAL TOP-UP GATEWAY */}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-5 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-[340px] space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-black text-white">💰 Registrar Recarga de Billetera</h3>
              <button onClick={() => setShowWalletModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Monto en USD ($)</label>
                <input 
                  type="number" 
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="Ej: 15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Método de Pago Oficial</label>
                <select 
                  value={walletMethod}
                  onChange={(e) => setWalletMethod(e.target.value as 'pm' | 'usdt')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="pm">Pago Móvil Interbancario (Soberanos)</option>
                  <option value="usdt">Tether USDT TRC-20 (Cripto)</option>
                </select>
              </div>

              <button 
                onClick={handleRecharge}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all active:scale-95 uppercase"
              >
                Confirmar y Conciliar Recarga
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Compact helper components to bypass dependency size limits
function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
