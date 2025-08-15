import React from 'react';
import { PlaceholderPage } from '@/components/PlaceholderPage';
import { ShoppingCart } from 'lucide-react';

export default function Ecommerce() {
  const features = [
    'Product catalog management',
    'Inventory tracking and alerts',
    'Shopping cart and checkout',
    'Payment gateway integrations',
    'Order management system',
    'Customer account portal',
    'Discount and coupon system',
    'Shipping calculations',
    'Tax management',
    'Sales reporting and analytics',
    'Abandoned cart recovery',
    'Multi-currency support'
  ];

  return (
    <PlaceholderPage
      title="E-commerce Tools"
      description="Build and manage your online store with powerful e-commerce features. From product catalogs to payment processing, everything you need to sell online successfully."
      icon={ShoppingCart}
      features={features}
    />
  );
}
