import React from 'react';
import { BuilderProvider } from '@/contexts/BuilderContext';
import { BuilderIOIntegration } from '@/components/builder/BuilderIOIntegration';

export default function Builder() {
  return (
    <BuilderProvider>
      <BuilderIOIntegration />
    </BuilderProvider>
  );
}
