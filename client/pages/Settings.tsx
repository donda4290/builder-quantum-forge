import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  const features = [
    'Workspace configuration',
    'User management and roles',
    'Billing and subscription',
    'Security and permissions',
    'API key management',
    'Notification preferences',
    'Brand customization',
    'Data export and backup',
    'Integration settings',
    'Performance optimization',
    'Custom domain settings',
    'Team collaboration tools'
  ];

  return (
    <PlaceholderPage
      title="Settings & Configuration"
      description="Customize your platform experience and manage your workspace settings. Control user access, configure integrations, and optimize your setup."
      icon={SettingsIcon}
      features={features}
    />
  );
}
