import React from 'react';
import { DomainProvider } from '@/contexts/DomainContext';
import { DomainDashboard } from '@/components/domains/DomainDashboard';

export default function Domains() {
  return (
    <DomainProvider>
      <DomainDashboard />
    </DomainProvider>
  );
}
