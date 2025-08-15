import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { cn } from '@/lib/utils';

// Import builder components
import { BuilderSidebar } from './BuilderSidebar';
import { BuilderCanvas } from './BuilderCanvas';
import { BuilderToolbar } from './BuilderToolbar';
import { BuilderPropertiesPanel } from './BuilderPropertiesPanel';

export function BuilderInterface() {
  const { isPreviewMode, activePanel } = useBuilder();

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Top Toolbar */}
      <BuilderToolbar />
      
      {/* Main Builder Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Components/Pages Panel */}
        {!isPreviewMode && (
          <div className={cn(
            "transition-all duration-300 border-r bg-muted/20",
            activePanel ? "w-80" : "w-0"
          )}>
            {activePanel && <BuilderSidebar />}
          </div>
        )}

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <BuilderCanvas />
        </div>

        {/* Right Properties Panel */}
        {!isPreviewMode && (
          <div className={cn(
            "transition-all duration-300 border-l bg-muted/20",
            "w-80"
          )}>
            <BuilderPropertiesPanel />
          </div>
        )}
      </div>
    </div>
  );
}
