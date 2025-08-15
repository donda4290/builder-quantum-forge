import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Globe } from 'lucide-react';

export default function Domains() {
  const features = [
    'Custom domain registration',
    'DNS management tools',
    'SSL certificate automation',
    'Subdomain configuration',
    'Domain forwarding and redirects',
    'Email hosting setup',
    'Domain analytics and monitoring',
    'Bulk domain management',
    'WHOIS privacy protection',
    'Domain transfer assistance'
  ];

  return (
    <PlaceholderPage
      title="Domain Management"
      description="Manage all your domains in one place. Register new domains, configure DNS settings, and ensure your websites are always accessible with enterprise-grade reliability."
      icon={Globe}
      features={features}
    />
  );
}
