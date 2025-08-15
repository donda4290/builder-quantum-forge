import React from 'react';
import { EcommerceProvider } from '@/contexts/EcommerceContext';
import { EcommerceDashboard } from '@/components/ecommerce/EcommerceDashboard';

export default function Ecommerce() {
  return (
    <EcommerceProvider>
      <EcommerceDashboard />
    </EcommerceProvider>
  );
}
