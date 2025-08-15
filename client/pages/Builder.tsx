import React from 'react';
import { BuilderProvider } from '@/contexts/BuilderContext';
import { BuilderInterface } from '@/components/builder/BuilderInterface';

export default function Builder() {
  return (
    <BuilderProvider>
      <BuilderInterface />
    </BuilderProvider>
  );
}
