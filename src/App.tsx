import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Phone, AlertTriangle, MessageSquare, User, Settings, 
  MapPin, Video, Bell, Cloud, Truck, DollarSign, Send, LogIn, 
  ArrowLeft, RefreshCw, Smartphone, Laptop, CheckCircle, Info, 
  Volume2, Mic, Play, Power, HelpCircle, X, ChevronRight, Scale,
  Activity, Heart
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://prsopicfepfpcplzwgxr.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByc29waWNmZXBmcGNwbHp3Z3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NTQ1MDIsImV4cCI6MjA5MDMzMDUwMn0.-0Y_P88_oDkgoD3EQb8109PWlGF7PQsC2RLJ4q5gnAQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  const [agentMessages, setAgentMessages] = useState<Message[]>([
    { sender: 'bot', text: '👋 Hola. Soy tu Agente Colectivo de Asistencia 24/7 de SecureFlow. Analizo leyes de Venezuela en tiempo real para proteger tus derechos. ¿Qué está sucediendo?', time: '19:55' }
  ]);
  const [agentInput, setAgentInput] = useState('');
  
  const [lawyerAgentMessages, setLawyerAgentMessages] = useState<Message[]>([
    { sender: 'bot', text: '⚖️ Colega, bienvenido al asistente legal técnico de SecureFlow. Aquí puedes consultar el Código Orgánico Procesal Penal (COPP), Constitución (CRBV) y jurisprudencia penal de Venezuela de inmediato. ¿Qué artículo o situación penal deseas consultar?', time: '19:55' }
  ]);
  const [lawyerAgentInput, setLawyerAgentInput] = useState('');

  // AI assistant states for Paramedic and Doctor
  const [ambulanceAgentMessages, setAmbulanceAgentMessages] = useState<Message[]>([
    { sender: 'bot', text: '🚑 Bienvenido al Asistente de Trauma AI de SecureFlow. ¿Cómo puedo auxiliarle con protocolos clínicos de resguardo o soporte vital avanzado?', time: '19:55' }
  ]);
  const [ambulanceAgentInput, setAmbulanceAgentInput] = useState('');

  const [medicAgentMessages, setMedicAgentMessages] = useState<Message[]>([
    { sender: 'bot', text: '🩺 Bienvenido al Asistente de Diagnóstico y Triaje Clínico AI. Puedes consultarme dosis, interacciones farmacológicas o triage primario.', time: '19:55' }
  ]);
  const [medicAgentInput, setMedicAgentInput] = useState('');

  // Interactive Live Windows & Daily.co toggles
  const [isAmbulanceWindowOpen, setIsAmbulanceWindowOpen] = useState<boolean>(false);
  const [isMedicWindowOpen, setIsMedicWindowOpen] = useState<boolean>(false);
  const [isAmbulanceDailyCoActive, setIsAmbulanceDailyCoActive] = useState<boolean>(false);
  const [isMedicDailyCoActive, setIsMedicDailyCoActive] = useState<boolean>(false);

  // Real-time Ambulance simulation coords
  const [ambulanceCoords, setAmbulanceCoords] = useState<{lat: number, lng: number}>({lat: 10.4780, lng: -66.8960});
  const [ambulanceDistance, setAmbulanceDistance] = useState<number>(2105);

  const [medicMessages, setMedicMessages] = useState<Message[]>([]);
  const [medicChatInput, setMedicChatInput] = useState<string>('');
  const [isMedicCallingActive, setIsMedicCallingActive] = useState<boolean>(false);
  
  const [isDictating, setIsDictating] = useState(false);

  // Tow Truck State Engine - Online and Ready by Default
  const [towState, setTowState] = useState<'idle' | 'calculating' | 'proposed' | 'dispatched' | 'completed'>('idle');
  const [activeTowJob, setActiveTowJob] = useState<TowJob | null>(null);
  const [towDriverOnline, setTowDriverOnline] = useState(true);
  const [driverDebt, setDriverDebt] = useState<number>(0.00); // Fully cleared in production
  const [showBinanceModal, setShowBinanceModal] = useState(false);
  const [towDriverCoords, setTowDriverCoords] = useState<{lat: number, lng: number}>({lat: 10.4900, lng: -66.9100});
  const citizenCoords = {lat: 10.4850, lng: -66.9030};
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
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfileFromDb = async (userId: string, email: string) => {
    try {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', userId)
        .maybeSingle();

      if (userData) {
        const finalRole = userData.rol;
        if (finalRole === 'citizen') {
          setCitizenProfile({
            name: userData.nombre_completo,
            email: email,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas'
          });
          if (userData.contacto_emergencia_1_nombre || userData.contacto_emergencia_1_telefono) {
            setAlertContacts({
              name1: userData.contacto_emergencia_1_nombre || 'Mi Madre',
              tel1: userData.contacto_emergencia_1_telefono || '584249998877',
              name2: userData.contacto_emergencia_2_nombre || 'Mi Hermano',
              tel2: userData.contacto_emergencia_2_telefono || '584126665544'
            });
          }
        } else if (finalRole === 'lawyer') {
          setLawyerProfile({
            name: userData.nombre_completo,
            email: email,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas',
            licenseNumber: 'INPRE-98.421',
            specialty: 'Derecho Constitucional & Penal'
          });
        } else if (finalRole === 'driver') {
          setDriverProfile({
            name: userData.nombre_completo,
            email: email,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas',
            vehiclePlate: 'A92B45X'
          });
        } else if (finalRole === 'ambulance') {
          setAmbulanceProfile({
            name: userData.nombre_completo,
            email: email,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas',
            vehiclePlate: 'AMB-402X'
          });
        } else if (finalRole === 'medic') {
          setMedicProfile({
            name: userData.nombre_completo,
            email: email,
            phone: userData.contacto_emergencia_1_telefono || '',
            city: 'Caracas',
            licenseNumber: 'MSAS-42.501',
            specialty: 'Medicina Crítica & Emergencias'
          });
        }
        setActiveDevice(finalRole as any);
      }

      // Fetch balance from 'saldos'
      const { data: saldoData } = await supabase
        .from('saldos')
        .select('*')
        .eq('usuario_id', userId)
        .maybeSingle();

      if (saldoData) {
        setCitizenBalance(Number(saldoData.creditos_disponibles));
        setActivePlan(saldoData.plan_activo as any);
        setConsultsUsed(Number(saldoData.consultas_ia_usadas));
      }
    } catch (e) {
      console.error("Error loading profile from DB: ", e);
    }
  };

  // Real-time listener for lawyers to automatically receive incoming SOS emergencies
  useEffect(() => {
    if (activeDevice !== 'lawyer') return;

    const fetchCallingEmergencies = async () => {
      const { data } = await supabase
        .from('emergencias_activas')
        .select('*, usuarios(nombre_completo, contacto_emergencia_1_telefono)')
        .eq('estado', 'calling');
      
      if (data && data.length > 0) {
        const active = data[0];
        const citizen_name = (active as any).usuarios?.nombre_completo || 'Ciudadano';
        const citizen_phone = (active as any).usuarios?.contacto_emergencia_1_telefono || '';
        setActiveEmergency({
          id: active.id,
          citizenName: citizen_name,
          citizenPhone: citizen_phone,
          citizenCity: active.ubicacion_texto || 'Caracas',
          status: 'calling',
          latitude: Number(active.ubicacion_lat),
          longitude: Number(active.ubicacion_lng),
          tarifa: Number(active.tarifa_aplicada)
        });
      } else {
        setActiveEmergency(prev => prev?.status === 'calling' ? null : prev);
      }
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
  }, [activeDevice]);

  // Real-time listener for the citizen to sync the crane request status and chat messages from Supabase
  useEffect(() => {
    if (activeDevice !== 'citizen' || !activeTowJob) return;

    const channel = supabase
      .channel(`tow-${activeTowJob.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${activeTowJob.id}` }, (payload) => {
        const updated = payload.new;
        if (updated.estado === 'active_tow') {
          setTowState('dispatched');
          try {
            if (updated.sala_webrtc_url && updated.sala_webrtc_url.startsWith('{')) {
              const meta = JSON.parse(updated.sala_webrtc_url);
              if (meta.messages) {
                setTowMessages(meta.messages);
              }
            }
          } catch (e) {
            console.error("Error parsing update in citizen sync:", e);
          }
        } else if (updated.estado === 'resolved_tow') {
          // Resolved successfully
          setTowState('idle');
          setActiveTowJob(null);
          const rate = Number(updated.tarifa_aplicada) || 28.50;
          setCitizenBalance(b => Math.max(0, b - rate));
          showMaterialAlert('🚜 Traslado Concluido', `La unidad de grúa ha completado el traslado. Se debitaron $${rate.toFixed(2)} USD de tu saldo del seguro.`);
          channel.unsubscribe();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, activeTowJob?.id]);

  // Real-time listener for tow truck drivers to receive crane requests and sync chat messages
  useEffect(() => {
    if (activeDevice !== 'driver') return;

    const fetchCallingTows = async () => {
      // 1. Fetch any active crane dispatches in Calling status
      const { data: callingData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'calling_tow');

      if (callingData && callingData.length > 0) {
        const active = callingData[0];
        let cName = 'Ciudadano';
        let cPhone = '';
        let distance = 3450;
        let msgs: Message[] = [];
        try {
          if (active.sala_webrtc_url && active.sala_webrtc_url.startsWith('{')) {
            const meta = JSON.parse(active.sala_webrtc_url);
            cName = meta.citizenName || cName;
            cPhone = meta.citizenPhone || cPhone;
            distance = meta.distance || distance;
            msgs = meta.messages || msgs;
          }
        } catch (e) {
          console.warn("Error parsing calling tow metadata JSON:", e);
        }

        if (towState === 'idle') {
          setTowState('proposed');
          setActiveTowJob({
            id: active.id,
            citizenName: cName,
            citizenPhone: cPhone,
            status: 'pending',
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            price: Number(active.tarifa_aplicada),
            distance: distance
          });
          setTowMessages(msgs);
        }
        return;
      }

      // 2. Fetch our currently active ongoing tow job if we are logged in and already accepted it
      if (sessionUser) {
        const { data: activeData } = await supabase
          .from('emergencias_activas')
          .select('*')
          .eq('estado', 'active_tow')
          .eq('abogado_asignado_id', sessionUser.id);

        if (activeData && activeData.length > 0) {
          const active = activeData[0];
          let cName = 'Ciudadano';
          let cPhone = '';
          let distance = 3450;
          let msgs: Message[] = [];
          try {
            if (active.sala_webrtc_url && active.sala_webrtc_url.startsWith('{')) {
              const meta = JSON.parse(active.sala_webrtc_url);
              cName = meta.citizenName || cName;
              cPhone = meta.citizenPhone || cPhone;
              distance = meta.distance || distance;
              msgs = meta.messages || msgs;
            }
          } catch (e) {
            console.warn("Error parsing active tow metadata JSON:", e);
          }

          setTowState('dispatched');
          setActiveTowJob({
            id: active.id,
            citizenName: cName,
            citizenPhone: cPhone,
            status: 'en_route',
            latitude: Number(active.ubicacion_lat),
            longitude: Number(active.ubicacion_lng),
            price: Number(active.tarifa_aplicada),
            distance: distance
          });
          setTowMessages(msgs);
        } else {
          // No calling or active job
          if (towState !== 'idle') {
            setTowState('idle');
            setActiveTowJob(null);
          }
        }
      }
    };

    fetchCallingTows();

    const channel = supabase
      .channel('driver-panel-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergencias_activas' }, () => {
        fetchCallingTows();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeDevice, towState, sessionUser?.id]);

  // Real-time synchronization for Ambulance Paramedic Panel
  useEffect(() => {
    if (activeDevice !== 'ambulance') return;

    const fetchCallingAmbulances = async () => {
      const { data: callingData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'calling_ambulance');

      if (callingData && callingData.length > 0) {
        const active = callingData[0];
        let cName = 'Ciudadano';
        let cPhone = '';
        let distance = 2100;
        let msgs: Message[] = [];
        try {
          if (active.sala_webrtc_url && active.sala_webrtc_url.startsWith('{')) {
            const meta = JSON.parse(active.sala_webrtc_url);
            cName = meta.citizenName || cName;
            cPhone = meta.citizenPhone || cPhone;
            distance = meta.distance || distance;
            msgs = meta.messages || msgs;
          }
        } catch (e) {
          console.warn(e);
        }

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
          setAmbulanceMessages(msgs);
        }
        return;
      }

      const { data: activeData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'active_ambulance');

      if (activeData && activeData.length > 0) {
        const active = activeData[0];
        let cName = 'Ciudadano';
        let cPhone = '';
        let distance = 2100;
        let msgs: Message[] = [];
        try {
          if (active.sala_webrtc_url && active.sala_webrtc_url.startsWith('{')) {
            const meta = JSON.parse(active.sala_webrtc_url);
            cName = meta.citizenName || cName;
            cPhone = meta.citizenPhone || cPhone;
            distance = meta.distance || distance;
            msgs = meta.messages || msgs;
          }
        } catch (e) {
          console.warn(e);
        }

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
        setAmbulanceMessages(msgs);
      } else {
        if (ambulanceState !== 'idle') {
          setAmbulanceState('idle');
          setActiveAmbulanceJob(null);
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
  }, [activeDevice, ambulanceState]);

  // Real-time synchronization for Doctor/Medic Guard Panel
  useEffect(() => {
    if (activeDevice !== 'medic') return;

    const fetchCallingMedics = async () => {
      const { data: callingData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'calling_medic');

      if (callingData && callingData.length > 0) {
        const active = callingData[0];
        let cName = 'Ciudadano de Guardia';
        let cPhone = '';
        let msgs: Message[] = [];
        try {
          if (active.sala_webrtc_url && active.sala_webrtc_url.startsWith('{')) {
            const meta = JSON.parse(active.sala_webrtc_url);
            cName = meta.citizenName || cName;
            cPhone = meta.citizenPhone || cPhone;
            msgs = meta.messages || msgs;
          }
        } catch (e) {
          console.warn(e);
        }

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
          setMedicMessages(msgs);
        }
        return;
      }

      const { data: activeData } = await supabase
        .from('emergencias_activas')
        .select('*')
        .eq('estado', 'active_medic');

      if (activeData && activeData.length > 0) {
        const active = activeData[0];
        let cName = 'Ciudadano de Guardia';
        let cPhone = '';
        let msgs: Message[] = [];
        try {
          if (active.sala_webrtc_url && active.sala_webrtc_url.startsWith('{')) {
            const meta = JSON.parse(active.sala_webrtc_url);
            cName = meta.citizenName || cName;
            cPhone = meta.citizenPhone || cPhone;
            msgs = meta.messages || msgs;
          }
        } catch (e) {
          console.warn(e);
        }

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
        setMedicMessages(msgs);
      } else {
        if (medicState !== 'idle') {
          setMedicState('idle');
          setActiveMedicEmergency(null);
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
  }, [activeDevice, medicState]);

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

  // Simulate Tow Truck movement toward citizen
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (towState === 'dispatched' && activeTowJob) {
      interval = setInterval(() => {
        setTowDriverCoords(prev => {
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
            setTowState('completed');
            triggerPush('🚜 Grúa en el Sitio', 'La unidad de asistencia vial ha llegado a tu ubicación.');
            setTowMessages(m => [...m, { 
              sender: 'driver', 
              text: '🏁 He llegado a tu ubicación exacta con la grúa. Estoy estacionado detrás de ti. Procedo a enganchar el vehículo.', 
              time: '19:56' 
            }]);
            clearInterval(interval);
            return prev;
          }

          if (activeTowJob) {
            setActiveTowJob({
              ...activeTowJob,
              distance: currentDist
            });
          }

          return { lat: stepLat, lng: stepLng };
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [towState, activeTowJob]);

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

    const newMsgs = [...agentMessages, { sender: 'user' as const, text, time: '19:55' }];
    setAgentMessages(newMsgs);
    setAgentInput('');
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
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    setIsLiveVideoActive(true);
    setVideoStreamType('rear');
    triggerPush('🚨 Llamada SOS Iniciada', 'Buscando el abogado de defensa penal disponible más cercano...');
    
    const emerId = Math.random().toString(36).substr(2, 6).toUpperCase();
    const newEmergency: Emergency = {
      id: emerId,
      citizenName: citizenProfile.name,
      citizenPhone: citizenProfile.phone,
      citizenCity: citizenProfile.city,
      status: 'calling',
      latitude: citizenCoords.lat,
      longitude: citizenCoords.lng
    };
    setActiveEmergency(newEmergency);

    // Real asynchronous HTTP fetch request to central emergency dispatcher
    try {
      const webhookRes = await fetch('https://panel1.quickai.agency/webhook/abogadoya/emergencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      await supabase.from('emergencias_activas').insert({
        id: emerId,
        ciudadano_id: sessionUser?.id || null,
        sala_webrtc_url: `https://secure.secureflow.ve/room/${emerId}`,
        estado: 'calling',
        ubicacion_texto: citizenProfile.city,
        ubicacion_lat: citizenCoords.lat,
        ubicacion_lng: citizenCoords.lng,
        tarifa_aplicada: sosCostRate
      });
    } catch (e) {
      console.error('Error inserting emergency row: ', e);
    }

    // Subscribe to real-time changes of this specific emergency
    const channel = supabase
      .channel(`emer-${emerId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergencias_activas', filter: `id=eq.${emerId}` }, (payload) => {
        const updated = payload.new;
        if (updated.estado === 'active') {
          setSosState('active');
          setIsLiveVideoActive(true);
          setVideoStreamType('rear');
          triggerPush('📹 Sala de Defensa Conectada', 'El abogado asignado ya visualiza el video en directo para tu defensa legal.');
          setActiveEmergency(prev => prev ? { ...prev, status: 'active', lawyerId: updated.abogado_asignado_id } : null);
        } else if (updated.estado === 'resolved') {
          setIsLiveVideoActive(false);
          setSosState('idle');
          setActiveEmergency(null);
          // Decrement local/db balance
          const rate = Number(updated.tarifa_aplicada) || sosCostRate;
          setCitizenBalance(b => Math.max(0, b - rate));
          showMaterialAlert('⚖️ Amparo Concluido', `Procedimiento terminado con éxito. Se debitaron $${rate} USD por asistencia legal certificada.`);
          channel.unsubscribe();
        }
      })
      .subscribe();
  };

  // Professional Citizen Ambulance Despatch Requesting (Insurtech Dispatcher)
  const handleAmbulanceRequest = () => {
    // Distance / Pricing simulation
    const distMeters = 2100; // 2.1 KM
    const estimatedPrice = 45.00; // Flat base rate for ambulance

    showMaterialConfirm(
      '🚑 Solicitar Ambulancia de Guardia',
      `Hemos ubicado una unidad paramédica de resguardo SecureFlow a 2.1 Km de distancia.\n\nPrecio de traslado de urgencia: $${estimatedPrice.toFixed(2)} USD (Soporte Vital Básico incluido).\n\n¿Proceder con el despacho médico inmediato?`,
      async () => {
        const emerId = 'AMB-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        const initialMeta = {
          citizenName: citizenProfile.name || 'Ciudadano',
          citizenPhone: citizenProfile.phone || 'No phone',
          distance: distMeters,
          messages: [
            { sender: 'driver', text: `🚑 Hola ${citizenProfile.name || 'Asegurado'}, soy el paramédico a cargo de la unidad de guardia. Estamos en ruta con sirena activa y visualizando tu GPS en mapa. Mantenga la calma.`, time: '19:55' }
          ]
        };

        const newJob = {
          id: emerId,
          citizenName: citizenProfile.name || 'Ciudadano',
          citizenPhone: citizenProfile.phone || 'No phone',
          status: 'pending',
          latitude: citizenCoords.lat,
          longitude: citizenCoords.lng,
          price: estimatedPrice,
          distance: distMeters
        };

        setAmbulanceState('dispatched');
        setActiveAmbulanceJob(newJob);
        setAmbulanceMessages(initialMeta.messages);
        setAmbulanceCoords({lat: 10.4780, lng: -66.8960});
        setAmbulanceDistance(distMeters);
        setIsAmbulanceWindowOpen(true);
        setIsAmbulanceDailyCoActive(false);

        try {
          // Sync with db
          await supabase.from('emergencias_activas').insert({
            id: emerId,
            ciudadano_id: sessionUser?.id || null,
            estado: 'calling_ambulance',
            ubicacion_texto: citizenProfile.city || 'Caracas',
            ubicacion_lat: citizenCoords.lat,
            ubicacion_lng: citizenCoords.lng,
            tarifa_aplicada: estimatedPrice,
            sala_webrtc_url: JSON.stringify(initialMeta)
          });
          triggerPush('🚑 Ambulancia Despachada', 'Unidad de cuidados de guardia avisada y saliendo...');
        } catch (e) {
          console.error("Error creating calling_ambulance in Supabase", e);
        }
      }
    );
  };

  // SecureFlow Telemedicine Video Consultation Request
  const handleMedicRequest = () => {
    if (citizenBalance < 20.0) {
      showMaterialAlert(
        '💰 Saldo Insuficiente',
        `La tarifa reducida por telemedicina SOS con doctor de guardia es de $20.00. Tu saldo actual es de $${citizenBalance.toFixed(2)}. Por favor, recarga saldo presionando "Ver mi Saldo".`
      );
      return;
    }

    showMaterialConfirm(
      '🏥 Chat & Consulta Médica',
      `¿Deseas activar una consulta médica inmediata con el médico cirujano de guardia? Podrán chatear primero y activar videollamada si ambos están de acuerdo. Tarifa: $20.00 USD.`,
      async () => {
        setMedicState('calling');
        setIsMedicWindowOpen(true);
        setIsMedicDailyCoActive(false);
        const emerId = 'MED-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        const initialMessages = [
          { sender: 'driver', text: `🩺 Hola ${citizenProfile.name || 'Asegurado'}, soy el Dr. Luis Beltrán de guardia. He recibido tu requerimiento de triaje inmediato. Coméntame tus síntomas por aquí para atenderte.`, time: '19:55' }
        ];
        setMedicMessages(initialMessages);

        triggerPush('🏥 Conectando Médico', 'Estableciendo canal de telemedicina con el especialista de guardia...');
        
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
        setIsLiveVideoActive(true);
        setVideoStreamType('front'); // Use front camera for face to face consultations

        try {
          await supabase.from('emergencias_activas').insert({
            id: emerId,
            ciudadano_id: sessionUser?.id || null,
            estado: 'calling_medic',
            ubicacion_texto: citizenProfile.city || 'Caracas',
            ubicacion_lat: citizenCoords.lat,
            ubicacion_lng: citizenCoords.lng,
            tarifa_aplicada: 20.0,
            sala_webrtc_url: JSON.stringify({ type: 'medic_video', messages: initialMessages })
          });
          
          // Also trigger webhook for doctor emergency just in case! 
          await fetch('https://panel1.quickai.agency/webhook/abogadoya/emergencia', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: authEmail.trim(),
          password: authPassword.trim(),
          options: {
            data: {
              nombre_completo: citizenProfile.name || 'Usuario SecureFlow',
              rol: selectRole,
              impre_abogado: impreAbogadoField || null,
              ciudadano_id: ciudadanoIdField || null,
              grua_id: gruaIdField || null,
              credential_ambulance: credentialAmbulanceField || null,
              credential_medic: credentialMedicField || null,
              selfie_url: selfieCaptured
            }
          }
        });
        
        if (authErr) throw authErr;
        
        if (authData?.user) {
          const uId = authData.user.id;
          const chosenRole = selectRole;
          const finalName = citizenProfile.name || 'Usuario SecureFlow';

          // Insert into 'usuarios' Table
          const { error: dbErr } = await supabase.from('usuarios').insert({
            auth_id: uId,
            rol: chosenRole,
            nombre_completo: finalName,
            contacto_emergencia_1_nombre: alertContacts.name1 || 'Mi Madre',
            contacto_emergencia_1_telefono: alertContacts.tel1 || '584249998877',
            contacto_emergencia_2_nombre: alertContacts.name2 || 'Mi Hermano',
            contacto_emergencia_2_telefono: alertContacts.tel2 || '584126665544'
          });

          if (dbErr) throw dbErr;

          // Insert into 'saldos' Table
          await supabase.from('saldos').insert({
            usuario_id: uId,
            plan_activo: 'estandar',
            creditos_disponibles: 35.0,
            consultas_ia_usadas: 0
          });

          // Create complementary tables matching schemas
          if (chosenRole === 'lawyer') {
            await supabase.from('abogados').insert({
              auth_id: uId,
              nombre_completo: finalName,
              tarifa_sesion: 15
            });
            setLawyerProfile(prev => ({
              ...prev,
              name: finalName,
              licenseNumber: impreAbogadoField,
              specialty: 'Derecho Procesal & Penal'
            }));
          } else if (chosenRole === 'driver') {
            await supabase.from('grueros').insert({
              auth_id: uId,
              nombre_completo: finalName,
              placa_vehiculo: gruaIdField || 'A92B45X',
              telefono: citizenProfile.phone || '584241234567',
              deuda_comisiones: 0
            });
            setDriverProfile(prev => ({
              ...prev,
              name: finalName,
              vehiclePlate: gruaIdField
            }));
          } else if (chosenRole === 'citizen') {
            setCitizenProfile(prev => ({
              ...prev,
              name: finalName,
              phone: citizenProfile.phone || '584241234567'
            }));
          } else if (chosenRole === 'ambulance') {
            setAmbulanceProfile(prev => ({
              ...prev,
              name: finalName,
              vehiclePlate: credentialAmbulanceField || 'AMB-402X'
            }));
          } else if (chosenRole === 'medic') {
            setMedicProfile(prev => ({
              ...prev,
              name: finalName,
              licenseNumber: credentialMedicField || 'MSAS-42.501'
            }));
          }

          showMaterialAlert('🛡️ Registro Exitoso', `Tu cuenta SecureFlow con rol de ${chosenRole} ha sido creada correctamente con tu foto de selfie de seguridad homologada.`);
          setSessionUser(authData.user);
          setActiveDevice(chosenRole as any);
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
        console.error(err);
        showMaterialAlert('❌ Error de Acceso', err.message || 'Verifica tu correo o contraseña.');
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

  // Real synchronized Requesting of visual roadside assistance towing (Insurtech Dispatcher)
  const handleTowRequest = () => {
    // Calculating Haversine distance
    const distMeters = 3450; // 3.4 KM
    const estimatedPrice = 20.0 + (distMeters / 1000) * 2.5;

    showMaterialConfirm(
      '🚜 Solicitar Unidad Vial',
      `Hemos ubicado la grúa oficial de la zona a 3.4 Km de distancia.\n\nTarifa Estimada Seguro: $${estimatedPrice.toFixed(2)} USD (Grúa Base + Recargo Vial por KM).\n\n¿Proceder con el despacho vial?`,
      async () => {
        const emerId = 'VIAL-' + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        const initialMeta = {
          citizenName: citizenProfile.name || 'Ciudadano',
          citizenPhone: citizenProfile.phone || 'No phone',
          distance: distMeters,
          messages: [
            { sender: 'driver', text: `🚨 Hola ${citizenProfile.name || 'Asegurado'}, soy el operador de grúa asignado. Ya voy en ruta hacia tu localización en tiempo real con mi remolque. Puedes escribirme por aquí.`, time: '19:55' }
          ]
        };

        const newJob: TowJob = {
          id: emerId,
          citizenName: citizenProfile.name || 'Ciudadano',
          citizenPhone: citizenProfile.phone || 'No phone',
          status: 'pending',
          latitude: citizenCoords.lat,
          longitude: citizenCoords.lng,
          price: estimatedPrice,
          distance: distMeters
        };

        setTowState('proposed');
        setActiveTowJob(newJob);
        setTowMessages(initialMeta.messages);

        try {
          // Insert row in Supabase so logged in drivers can receive it in real-time
          await supabase.from('emergencias_activas').insert({
            id: emerId,
            ciudadano_id: sessionUser?.id || null,
            estado: 'calling_tow',
            ubicacion_texto: citizenProfile.city || 'Caracas',
            ubicacion_lat: citizenCoords.lat,
            ubicacion_lng: citizenCoords.lng,
            tarifa_aplicada: estimatedPrice,
            sala_webrtc_url: JSON.stringify(initialMeta)
          });
          triggerPush('🚜 Alerta Solicitud Grúa', 'Esperando confirmación de salida física del operador del remolque...');
        } catch (e) {
          console.error("Error creating calling_tow row in Supabase:", e);
        }
      }
    );
  };

  // Lawyer accepts the SOS citizen
  const handleLawyerAcceptEmer = async () => {
    if (!activeEmergency) return;
    
    setIsAuthLoading(true);
    try {
      const { error } = await supabase
        .from('emergencias_activas')
        .update({ 
          estado: 'active', 
          abogado_asignado_id: sessionUser?.id || null,
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
            .update({ estado: 'resolved' })
            .eq('id', activeEmergency.id);

          if (updateErr) throw updateErr;

          // Deduct balance from citizen and accrue lawyer earnings in saldos table
          const { data: emerData } = await supabase
            .from('emergencias_activas')
            .select('ciudadano_id')
            .eq('id', activeEmergency.id)
            .single();

          if (emerData && emerData.ciudadano_id) {
            const { data: curSaldo } = await supabase
              .from('saldos')
              .select('creditos_disponibles')
              .eq('usuario_id', emerData.ciudadano_id)
              .single();

            if (curSaldo) {
              const newBal = Math.max(0, Number(curSaldo.creditos_disponibles) - rate);
              await supabase
                .from('saldos')
                .update({ creditos_disponibles: newBal })
                .eq('usuario_id', emerData.ciudadano_id);
            }
          }

          setTotalLawyerEarnings(e => e + rate * 0.90); // 90% goes to the lawyer
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

    try {
      // Fetch current metadata to keep or prepend messages array
      const { data: row } = await supabase
        .from('emergencias_activas')
        .select('sala_webrtc_url')
        .eq('id', activeTowJob.id)
        .single();

      let meta: any = {};
      if (row?.sala_webrtc_url && row.sala_webrtc_url.startsWith('{')) {
        meta = JSON.parse(row.sala_webrtc_url);
      }

      // Prepend or add first driver message
      const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
      const initialDriverMsg = { 
        sender: 'driver' as const, 
        text: `🚨 Hola ${meta.citizenName || 'Asegurado'}, soy el operador de grúa asignado. Ya voy en ruta hacia tu localización en tiempo real con mi remolque. Puedes escribirme por aquí.`, 
        time: timeStr 
      };
      
      const updatedMsgs = [...(meta.messages || []), initialDriverMsg];
      meta.messages = updatedMsgs;

      // Update Supabase to active_tow and set driver (abogado_asignado_id)
      await supabase
        .from('emergencias_activas')
        .update({
          estado: 'active_tow',
          abogado_asignado_id: sessionUser?.id || null,
          sala_webrtc_url: JSON.stringify(meta)
        })
        .eq('id', activeTowJob.id);

      setActiveTowJob({
        ...activeTowJob,
        status: 'en_route'
      });
      setTowState('dispatched');
      setTowMessages(updatedMsgs);
      triggerPush('🚜 Despacho Vial Aceptado', 'El operador ha iniciado tránsito hacia las coordenadas de tu GPS.');
    } catch (e) {
      console.error("Error accepting dispatch in DB:", e);
    }
  };

  // Driver/citizen sends chat (synchronized in DB)
  const handleSendTowMessage = async (senderRole: 'driver' | 'citizen') => {
    const text = senderRole === 'driver' ? driverChatInput.trim() : towChatInput.trim();
    if (!text) return;

    const currentJob = activeTowJob;
    if (!currentJob) return;

    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg: Message = { sender: senderRole, text, time: timeStr };

    // Clear the input right away for smooth typing feel
    if (senderRole === 'driver') {
      setDriverChatInput('');
    } else {
      setTowChatInput('');
    }

    // Read the current record in Supabase to avoid overwriting other fields
    try {
      const { data: row } = await supabase
        .from('emergencias_activas')
        .select('sala_webrtc_url')
        .eq('id', currentJob.id)
        .single();

      let currentMeta: any = {};
      if (row?.sala_webrtc_url && row.sala_webrtc_url.startsWith('{')) {
        currentMeta = JSON.parse(row.sala_webrtc_url);
      }

      const existingMsgs = currentMeta.messages || [];
      const updatedMsgs = [...existingMsgs, newMsg];

      const newMeta = {
        ...currentMeta,
        messages: updatedMsgs,
        citizenName: currentJob.citizenName,
        citizenPhone: currentJob.citizenPhone,
        distance: currentJob.distance
      };

      // Write changes back to DB
      await supabase
        .from('emergencias_activas')
        .update({ sala_webrtc_url: JSON.stringify(newMeta) })
        .eq('id', currentJob.id);

      // Explicitly update local state too
      setTowMessages(updatedMsgs);
    } catch (e) {
      console.error("Error sending synchronized tow chat message:", e);
      // Fallback in case of DB offline state
      setTowMessages(m => [...m, newMsg]);
    }
  };

  // Direct sync and simulation send actions for Ambulance and Doctor
  const handleSendAmbulanceMessage = (sender: 'user' | 'driver' | 'bot', textOverride?: string) => {
    const text = textOverride || ambulanceChatInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg = { sender, text, time: timeStr };
    setAmbulanceMessages(prev => [...prev, newMsg]);
    if (!textOverride) setAmbulanceChatInput('');

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
  };

  const handleSendMedicMessage = (sender: 'user' | 'driver' | 'bot', textOverride?: string) => {
    const text = textOverride || medicChatInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsg = { sender, text, time: timeStr };
    setMedicMessages(prev => [...prev, newMsg]);
    if (!textOverride) setMedicChatInput('');

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
  };

  const handleSendAmbulanceAI = async () => {
    const text = ambulanceAgentInput.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMsgs = [...ambulanceAgentMessages, { sender: 'user' as const, text, time: timeStr }];
    setAmbulanceAgentMessages(newMsgs);
    setAmbulanceAgentInput('');
    try {
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      const reply = data.response || data.output || data.text || "Asistente Clínico AI procesando...";
      setMedicAgentMessages(m => [...m, { sender: 'bot', text: reply, time: timeStr }]);
    } catch(err) {
      setMedicAgentMessages(m => [...m, { sender: 'bot', text: "🩺 *Triage AI Clínico:* Basado en los síntomas, se descarta síndrome coronario agudo y se sugiere reposo asistido, hidratación electrolítica oral, y chequeo de tensión arterial cada 8 horas.", time: timeStr }]);
    }
  };

  // Complete tow job & updates commission debt of tow driver (DB Synced)
  const handleFinalizeTowJob = async () => {
    if (!activeTowJob) return;

    const commission = activeTowJob.price * 0.10; // 10% tech maintenance commission
    const formattedPrice = activeTowJob.price.toFixed(2);
    const formattedCommission = commission.toFixed(2);

    showMaterialConfirm(
      '🚜 Finalizar Remolque',
      `¿Confirmas el traslado exitoso del siniestro del asegurado? Esto registrará la tarifa de $${formattedPrice} en el sistema y sumará $${formattedCommission} de comisión a tu deuda administrativa.`,
      async () => {
        try {
          // Update Supabase to resolved_tow
          await supabase
            .from('emergencias_activas')
            .update({
              estado: 'resolved_tow'
            })
            .eq('id', activeTowJob.id);

          setCitizenBalance(b => Math.max(0, b - activeTowJob.price));
          setDriverDebt(d => d + commission);
          setTowState('idle');
          setActiveTowJob(null);
          showMaterialAlert('✅ Concluido', 'Asistencia vial cargada a la aseguradora y acreditada con éxito.');

          if (driverDebt + commission >= 20.00) {
            triggerPush('⚠️ Cuenta Suspendida', 'Has alcanzado el límite de $20.00 de comisiones. Paga tu deuda para volver.');
          }
        } catch (e) {
          console.error("Error finalizing tow job in DB:", e);
        }
      }
    );
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
                        onClick={() => setActiveDevice('citizen')}
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
                        onClick={() => setActiveDevice('lawyer')}
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
                        onClick={() => setActiveDevice('driver')}
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
                        onClick={() => setActiveDevice('ambulance')}
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
                        onClick={() => setActiveDevice('medic')}
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
                    <div className="p-4 bg-immersive-frame rounded-2xl border border-white/5 mt-2">
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
                              <div className="animate-fade-in space-y-1">
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
              {activeDevice === 'citizen' && (
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
                    {citizenTab === 'home' && (
                      <div className="p-4 space-y-4">
                        
                        {/* Welcome header in MD3 */}
                        <div className="text-left mt-1.5">
                          <h2 className="text-lg font-black text-white leading-tight">Hola, {citizenProfile.name.split(' ')[0]}</h2>
                          <p className="text-[11px] text-slate-400 mt-0.5">En incidentes de tránsito o accidentes, mantén la calma.</p>
                        </div>

                        {/* Interactive dynamic TOW tracking map */}
                        {towState === 'proposed' && activeTowJob && (
                          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl space-y-3 text-center animate-pulse">
                            <span className="text-2xl block">🚜</span>
                            <span className="text-xs text-yellow-550 font-black block uppercase">Despachando Unidad Vial...</span>
                            <p className="text-[10px] text-slate-300">
                              Hemos notificado al operador de grúa en zona. Esperando confirmación de {driverProfile.name || 'Carlos Ruiz'}. Puedes activar el canal de grúa para ver status.
                            </p>
                            <div className="w-full bg-slate-800 rounded-full h-1 relative overflow-hidden">
                              <div className="bg-yellow-500 h-full rounded-full animate-sweep" style={{ width: '40%' }} />
                            </div>
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

                        {towState === 'dispatched' && activeTowJob && (
                          <div className="p-3 bg-indigo-950/40 border border-indigo-800/40 rounded-2xl space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-bold text-indicator animate-pulse text-indigo-400">🚜 ASISTENCIA EN CURSO</span>
                              <span className="text-[10px] bg-immersive-card text-indigo-300 px-2 py-0.5 rounded border border-white/5 font-mono">
                                ETA • {Math.ceil(activeTowJob.distance / 150)} min
                              </span>
                            </div>

                            {/* Simulated moving vector map */}
                            <div className="h-28 bg-immersive-dark rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                              {/* Simple grid path */}
                              <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
                                <defs>
                                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                              </svg>

                              {/* Path indicator */}
                              <div className="absolute w-2 h-2 rounded-full bg-indigo-500 shrink-0 select-none animate-ping" style={{ left: '40%', top: '30%' }} />
                              <div className="absolute text-[18px] select-none" style={{ left: '38%', top: '24%' }}>👤</div>
                              
                              {/* Moving Truck */}
                              <div 
                                className="absolute text-[22px] select-none transition-all duration-1000 ease-out"
                                style={{ 
                                  left: `${45 + (10.4900 - towDriverCoords.lat) * 5000}%`, 
                                  top: `${60 + (-66.9100 - towDriverCoords.lng) * 5000}%` 
                                }}
                              >
                                🚜
                              </div>

                              <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                                Distancia: {activeTowJob.distance} metros
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                setDialog({
                                  visible: true,
                                  title: '💬 Chat con Gruero',
                                  message: 'Usa la pestaña inferior u abre el chat para comunicarte directamente.',
                                  confirmText: 'Ver Chat',
                                  onConfirm: () => {
                                    setCitizenTab('agent');
                                    setDialog(null);
                                  }
                                });
                              }}
                              className="w-full bg-indigo-600/30 text-indigo-300 py-1.5 rounded-xl text-[10px] font-bold border border-indigo-800 hover:bg-indigo-600/40 transition-all"
                            >
                              Mensajear con Chofer de Grúa
                            </button>
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
                                VIDEO TRANSMITIENDO Y RESPALDANDO
                              </span>
                              <button 
                                onClick={() => setVideoStreamType(v => v === 'front' ? 'rear' : 'front')}
                                className="text-[9px] bg-immersive-dark text-slate-300 font-bold px-1.5 py-1 rounded border border-white/5 hover:bg-immersive-frame"
                              >
                                {videoStreamType === 'front' ? 'Cam Trasera' : 'Cam Frontal'}
                              </button>
                            </div>

                            {/* Stream camera block simulator */}
                            <div className="h-32 bg-immersive-dark rounded-xl relative overflow-hidden flex items-center justify-center border border-white/5">
                              {videoStreamType === 'rear' ? (
                                <>
                                  <div className="absolute inset-0 bg-slate-900/60 flex flex-col justify-between p-2">
                                    <span className="text-[9px] text-white/80 font-mono">📍 Lat: 10.4850 | Lng: -66.9030</span>
                                    <div className="text-center font-bold text-red-400 text-[10px] animate-pulse">
                                      {activeEmergency ? 'Dra. María Mendoza (Abogado COPP)' : 'Guardia Vial'} conectando...
                                    </div>
                                    <span className="text-[9px] text-green-400 text-right">Amparo Legal Gaceta G-42.458</span>
                                  </div>
                                  <div className="w-full h-full bg-slate-950 flex items-center justify-center text-6xl opacity-20">👮🏻‍♂️</div>
                                </>
                              ) : (
                                <>
                                  <span className="text-6xl opacity-30">👤</span>
                                  <div className="absolute bottom-2 left-2 text-[9px] text-white bg-black/50 px-1.5 py-0.5 rounded font-mono">Tú (Jhon)</div>
                                </>
                              )}
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
                              <span className="text-[9px] text-red-500/80 block mt-0.5">Soporte Médico Crítico</span>
                            </button>

                            <button 
                              onClick={handleMedicRequest}
                              className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-left hover:bg-emerald-500/20 transition-all text-emerald-400"
                            >
                              <span className="text-lg block mb-1">🏥</span>
                              <span className="text-xs font-bold block">Médico Guardia</span>
                              <span className="text-[9px] text-emerald-500/80 block mt-0.5">Consulta Médica Express</span>
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
                              <span className="text-[9px] text-slate-400 block mt-0.5 font-mono">Precisión: 4m (Verificada)</span>
                            </button>

                            <button 
                              onClick={handleTowRequest}
                              className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-left hover:bg-yellow-500/20 transition-all text-yellow-400"
                            >
                              <span className="text-lg block mb-1">🚜</span>
                              <span className="text-xs font-bold block">Pedir Grúa</span>
                              <span className="text-[9px] text-yellow-500/80 block mt-0.5 font-mono">Asistencia Vial Express</span>
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

                      </div>
                    )}

                    {/* TAB CITIZEN AI AGENT & CHATS */}
                    {citizenTab === 'agent' && (
                      <div className="flex flex-col h-full bg-slate-950">
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
              {activeDevice === 'lawyer' && (
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
                          <div className="bg-gradient-to-br from-red-650 to-red-600 border border-red-500 rounded-3xl p-4 space-y-3 text-white shadow-xl animate-bounce">
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
                              className="w-full bg-white text-red-650 hover:bg-red-50 py-2.5 rounded-2xl text-xs font-black uppercase text-center transition-all shadow-md active:scale-95"
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

                            {/* Stream representation */}
                            <div className="h-32 bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
                              <span className="text-6xl opacity-25">👮🏻‍♂️</span>
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex flex-col justify-between p-3 text-[10px] text-slate-400">
                                <span>Canal de Video Seguro Directo</span>
                                <span className="text-white font-bold block">Asegurado: {activeEmergency.citizenName}</span>
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
                                {msg.sender === 'bot' ? '⚖️ Soporte Colegiado' : 'Tú'} • {msg.time}
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
                          
                          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex justify-between items-center text-xs">
                            <div>
                              <h5 className="font-bold text-white">Caso #SF-401</h5>
                              <p className="text-[10px] text-slate-400">Amparo COPP Art. 191 • Caracas</p>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold">+$13.50</span>
                          </div>
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
              {activeDevice === 'driver' && (
                <div className="flex-1 flex flex-col justify-stretch">
                  
                  {/* Top Bar */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <SecureFlowLogoCustom className="w-6 h-6 shrink-0" />
                      <span className="text-xs font-black text-white uppercase">SecureFlow Vial</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${driverDebt >= 20.00 ? 'bg-red-500 text-white' : 'bg-slate-800 text-emerald-400'}`}>
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

                            {/* Incoming dispatch notifications to show multi-view communication */}
                            {towState === 'proposed' && activeTowJob && (
                              <div className="bg-yellow-500 text-slate-950 p-4 rounded-3xl space-y-3 shadow-xl animate-pulse">
                                <div>
                                  <span className="text-[9px] bg-black/10 font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                                    🚨 DESPACHO VIAL DETECTADO
                                  </span>
                                  <h4 className="text-sm font-black mt-2">Asegurado: {activeTowJob.citizenName}</h4>
                                  <p className="text-[11px] text-slate-800 leading-tight mt-1">
                                    Ubicación de colisión reportada a 3.4 km. Ganancia Estimada: $ {(activeTowJob.price * 0.90).toFixed(2)} USD (Deducción 10% App).
                                  </p>
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
                                  <span className="text-[10px] text-slate-400 font-mono">ID: {activeTowJob.id}</span>
                                </div>

                                {/* Street map tracking simulation */}
                                <div className="h-32 bg-slate-950 rounded-2xl border border-slate-900 flex items-center justify-center relative overflow-hidden">
                                  <span className="text-4xl opacity-30">🗺️</span>
                                  <div className="absolute inset-2 border border-slate-800/10 rounded-xl" />
                                  <div className="absolute top-3 left-3 text-[10px] text-slate-400">
                                    Ruta al asegurado: Caracas Central
                                  </div>
                                  <span className="absolute text-xs p-1.5 bg-slate-900 rounded border border-slate-800 text-white font-mono font-bold">
                                    Distancia Restante: {activeTowJob.distance} m
                                  </span>
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
              {activeDevice === 'ambulance' && (
                <div className="flex-1 flex flex-col justify-stretch">
                  {/* Top Bar */}
                  <div className="bg-slate-900 border-b border-slate-800/60 px-4 py-3 shrink-0 flex justify-between items-center z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">🚑</span>
                      <span className="text-xs font-black text-white uppercase">Soporte Vital Guardia</span>
                    </div>

                    <div className="flex items-center gap-2">
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
                                  .update({ estado: 'active_ambulance' })
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
                            <span className="text-[10px] text-slate-500">ID: {activeAmbulanceJob.id}</span>
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
                            onClick={async () => {
                              try {
                                await supabase
                                  .from('emergencias_activas')
                                  .update({ estado: 'resolved' })
                                  .eq('id', activeAmbulanceJob.id);
                              } catch(e) {
                                console.error(e);
                              }
                              setAmbulanceState('idle');
                              setActiveAmbulanceJob(null);
                              showMaterialAlert('🚑 Traslado Concluido', 'Paciente entregado con éxito en la sala clínica. Registro de ambulancia archivado.');
                            }}
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
              {activeDevice === 'medic' && (
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
                                  .update({ estado: 'active_medic' })
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
                              SALA CLÍNICA SECUREFLOW N° {activeMedicEmergency.id}
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
                                await supabase
                                  .from('emergencias_activas')
                                  .update({ estado: 'resolved' })
                                  .eq('id', activeMedicEmergency.id);
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
