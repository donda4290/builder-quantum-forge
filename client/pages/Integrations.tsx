import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Plug } from 'lucide-react';

export default function Integrations() {
  const features = [
    'Payment gateway integrations',
    'Email marketing platforms',
    'CRM and customer tools',
    'Analytics and tracking',
    'Social media integration',
    'Inventory management systems',
    'Shipping and logistics',
    'Accounting software',
    'Customer support tools',
    'Marketing automation',
    'API webhook management',
    'Custom integration builder'
  ];

  return (
    <PlaceholderPage
      title="API Integrations"
      description="Connect your platform with the tools you already use. Seamlessly integrate with popular services to streamline your workflow and automate your business processes."
      icon={Plug}
      features={features}
    />
  );
}
