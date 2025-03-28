'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translations: Record<string, string>;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.boards': 'Boards',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account settings and preferences.',
    'settings.quickActions': 'Quick Actions',
    'settings.backupData': 'Backup Data',
    'settings.changeLanguage': 'Change Language',

    // Settings Sections
    'settings.profile': 'Profile Settings',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.team': 'Team & Organization',
    'settings.billing': 'Billing & Subscription',
    'settings.data': 'Data & Storage',

    // Profile Settings
    'profile.personalInfo': 'Personal Information',
    'profile.emailPrefs': 'Email Preferences',
    'profile.password': 'Password & Security',
    'profile.2fa': 'Two-Factor Authentication',

    // Appearance
    'appearance.theme': 'Theme Settings',
    'appearance.language': 'Language & Region',
    'appearance.customization': 'Customization',

    // Notifications
    'notifications.email': 'Email Notifications',
    'notifications.push': 'Push Notifications',
    'notifications.marketing': 'Marketing Emails',

    // Team
    'team.members': 'Team Members',
    'team.roles': 'Roles & Permissions',
    'team.organization': 'Organization Settings',

    // Billing
    'billing.payment': 'Payment Methods',
    'billing.history': 'Billing History',
    'billing.subscription': 'Subscription Plan',

    // Data
    'data.backup': 'Backup & Restore',
    'data.export': 'Data Export',
    'data.deletion': 'Account Deletion',

    // Language Selection
    'language.select': 'Select Language'
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel',
    'nav.boards': 'Tableros',
    'nav.analytics': 'Análisis',
    'nav.settings': 'Configuración',

    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Gestiona la configuración y preferencias de tu cuenta.',
    'settings.quickActions': 'Acciones Rápidas',
    'settings.backupData': 'Respaldar Datos',
    'settings.changeLanguage': 'Cambiar Idioma',

    // Settings Sections
    'settings.profile': 'Perfil',
    'settings.appearance': 'Apariencia',
    'settings.notifications': 'Notificaciones',
    'settings.team': 'Equipo y Organización',
    'settings.billing': 'Facturación y Suscripción',
    'settings.data': 'Datos y Almacenamiento',

    // Profile Settings
    'profile.personalInfo': 'Información Personal',
    'profile.emailPrefs': 'Preferencias de Email',
    'profile.password': 'Contraseña y Seguridad',
    'profile.2fa': 'Autenticación de Dos Factores',

    // Appearance
    'appearance.theme': 'Tema',
    'appearance.language': 'Idioma y Región',
    'appearance.customization': 'Personalización',

    // Notifications
    'notifications.email': 'Notificaciones por Email',
    'notifications.push': 'Notificaciones Push',
    'notifications.marketing': 'Emails de Marketing',

    // Team
    'team.members': 'Miembros del Equipo',
    'team.roles': 'Roles y Permisos',
    'team.organization': 'Configuración de la Organización',

    // Billing
    'billing.payment': 'Métodos de Pago',
    'billing.history': 'Historial de Facturación',
    'billing.subscription': 'Plan de Suscripción',

    // Data
    'data.backup': 'Respaldo y Restauración',
    'data.export': 'Exportar Datos',
    'data.deletion': 'Eliminación de Cuenta',

    // Language Selection
    'language.select': 'Seleccionar Idioma'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage as keyof typeof translations]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translations: translations[currentLanguage as keyof typeof translations]
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 