-- =========================================================================
-- SECUREFLOW - SCRIPT DE CREACIÓN DE BASE DE DATOS (SUPABASE DDL SQL)
-- =========================================================================
-- Este archivo contiene la configuración oficial para inicializar y mantener
-- la arquitectura de base de datos relacional de SecureFlow en Supabase.
-- Incluye la sincronización del tipo de vehículo, los contactos de emergencia,
-- saldos de usuarios, control de tarifas transparentes y emergencias activas.
--
-- INSTRUCCIONES:
-- 1. Ve a tu consola de Supabase (https://supabase.com).
-- 2. Selecciona tu proyecto y abre la pestaña "SQL Editor".
-- 3. Crea una nueva consulta ("New Query"), pega este script completo y haz clic en "Run".
-- =========================================================================

-- Habilitar extensión UUID para identificadores seguros
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TABLA: USUARIOS (Perfiles generales sincronizados)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL, -- Vinculado con auth.users de Supabase Auth
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('citizen', 'lawyer', 'driver', 'ambulance', 'medic')),
    nombre_completo VARCHAR(255) NOT NULL,
    tipo_vehiculo VARCHAR(20) CHECK (tipo_vehiculo IN ('coche', 'moto')), -- Determina tarifas de grúa/ambulancia
    
    -- Contactos de Alerta SOS del Ciudadano
    contacto_emergencia_1_nombre VARCHAR(150) DEFAULT 'Mi Madre',
    contacto_emergencia_1_telefono VARCHAR(50) DEFAULT '584249998877',
    contacto_emergencia_2_nombre VARCHAR(150) DEFAULT 'Mi Hermano',
    contacto_emergencia_2_telefono VARCHAR(50) DEFAULT '584126665544',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices para optimizar búsquedas por auth_id y roles en consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_id ON public.usuarios(auth_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON public.usuarios(rol);

-- =========================================================================
-- 2. TABLA: SALDOS (Billeteras y coberturas del ecosistema)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.saldos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES public.usuarios(auth_id) ON DELETE CASCADE,
    plan_activo VARCHAR(50) DEFAULT 'estandar' CHECK (plan_activo IN ('gratis', 'estandar', 'premium')),
    creditos_disponibles NUMERIC(10, 2) DEFAULT 35.00 NOT NULL, -- Cobertura de protección en USD
    consultas_ia_usadas INTEGER DEFAULT 0 NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =========================================================================
-- 3. TABLA: GEOLOCALIZACIÓN Y EMERGENCIAS ACTIVAS
-- =========================================================================
-- Esta tabla unificada resguarda las llamadas de auxilio jurídicas, despacho
-- de grúas, triajes de telemedicina médica y solicitudes de ambulancia.
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.emergencias_activas (
    id VARCHAR(100) PRIMARY KEY, -- ID corto de emergencia (ej: VIAL-A8C, AMB-C1D, MED-1234)
    ciudadano_id UUID REFERENCES public.usuarios(auth_id) ON DELETE SET NULL,
    
    -- Tipo de alerta y ciclo de vida de la emergencia
    estado VARCHAR(50) NOT NULL CHECK (
        estado IN ('active', 'calling', 'calling_ambulance', 'calling_medic', 'pending', 'dispatched', 'completed')
    ),
    
    -- Localización GPS exacta en tiempo real
    ubicacion_texto VARCHAR(255) DEFAULT 'Caracas',
    ubicacion_lat NUMERIC(10, 6) NOT NULL,
    ubicacion_lng NUMERIC(10, 6) NOT NULL,
    
    -- Datos Financieros Transparentes
    tarifa_aplicada NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Debitado total del cliente
    
    -- Metadatos de la sesión WebRTC / Mensajes comprimidos (Daily.co & Chat Logs)
    sala_webrtc_url TEXT, -- Almacena JSON string de chat y enlaces WebRTC Daily.co
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Índices de consulta rápida de emergencias activas
CREATE INDEX IF NOT EXISTS idx_emergencias_estado ON public.emergencias_activas(estado);
CREATE INDEX IF NOT EXISTS idx_emergencias_ciudadano ON public.emergencias_activas(ciudadano_id);

-- =========================================================================
-- 4. TABLAS COMPLEMENTARIAS DE PROVEEDORES DE SOPORTE VIAL Y LEGAL
-- =========================================================================

-- Tabla de Abogados con guardia vigente y tarifas por sesión
CREATE TABLE IF NOT EXISTS public.abogados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL REFERENCES public.usuarios(auth_id) ON DELETE CASCADE,
    nombre_completo VARCHAR(255) NOT NULL,
    tarifa_sesion NUMERIC(10, 2) DEFAULT 15.00 NOT NULL,
    disponible BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla de Operadores de Grúa (Grueros)
CREATE TABLE IF NOT EXISTS public.grueros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE NOT NULL REFERENCES public.usuarios(auth_id) ON DELETE CASCADE,
    nombre_completo VARCHAR(255) NOT NULL,
    placa_vehiculo VARCHAR(50) NOT NULL,
    telefono VARCHAR(50) DEFAULT '584241234567',
    deuda_comisiones NUMERIC(10, 2) DEFAULT 0.00 NOT NULL, -- Comisiones por pagar a la plataforma
    disponible BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =========================================================================
-- 5. POLÍTICAS DE SEGURIDAD (Row-Level Security - RLS)
-- =========================================================================
-- Supabase exige políticas estrictas para que el frontend pueda consultar
-- los datos de forma autorizada y segura. Ejecuta esto para activar RLS:

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saldos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergencias_activas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abogados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grueros ENABLE ROW LEVEL SECURITY;

-- 5a. Políticas para la tabla 'usuarios'
CREATE POLICY "Permitir lectura de perfiles a todos los autenticados"
    ON public.usuarios FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir a cada usuario insertar su propio perfil"
    ON public.usuarios FOR INSERT TO authenticated WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Permitir a cada usuario actualizar su propio perfil"
    ON public.usuarios FOR UPDATE TO authenticated USING (auth_id = auth.uid());

-- 5b. Políticas para la tabla 'saldos' (Wallet)
CREATE POLICY "Permitir lectura del propio saldo"
    ON public.saldos FOR SELECT TO authenticated USING (usuario_id = auth.uid());

CREATE POLICY "Permitir insertar saldo inicial en registro"
    ON public.saldos FOR INSERT TO authenticated WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Permitir actualizar saldo al propietario"
    ON public.saldos FOR UPDATE TO authenticated USING (usuario_id = auth.uid());

-- 5c. Políticas para la tabla 'emergencias_activas'
CREATE POLICY "Permitir visualizar emergencias activas a involucrados"
    ON public.emergencias_activas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir crear alertas de emergencias"
    ON public.emergencias_activas FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Permitir actualizar estado de alertas"
    ON public.emergencias_activas FOR UPDATE TO authenticated USING (true);

-- 5d. Políticas para las tablas 'abogados' y 'grueros'
CREATE POLICY "Lectura pública de abogados disponibles"
    ON public.abogados FOR SELECT TO authenticated USING (true);

CREATE POLICY "Lectura pública de grueros disponibles"
    ON public.grueros FOR SELECT TO authenticated USING (true);
