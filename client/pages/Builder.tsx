import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { Building2 } from 'lucide-react';

export default function Builder() {
  const features = [
    'Drag-and-drop visual editor',
    'Professional templates library',
    'Custom component builder',
    'Responsive design tools',
    'Real-time preview',
    'SEO optimization tools',
    'Custom CSS and code injection',
    'Version history and rollback',
    'Team collaboration features',
    'Brand asset management'
  ];

  return (
    <PlaceholderPage
      title="Website Builder"
      description="Create stunning, professional websites with our intuitive drag-and-drop builder. Design pixel-perfect pages that convert visitors into customers."
      icon={Building2}
      features={features}
    />
  );
}
