import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Save,
  Eye,
  EyeOff,
  Monitor,
  Tablet,
  Smartphone,
  ChevronDown,
  Undo2,
  Redo2,
  Settings,
  Code,
  Layers,
  Palette,
  FileText,
  History,
  Share,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BuilderToolbar() {
  const {
    currentPage,
    previewMode,
    isPreviewMode,
    activePanel,
    setPreviewMode,
    togglePreviewMode,
    setActivePanel,
    savePage,
    createVersion
  } = useBuilder();

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop', width: '100%' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet', width: '768px' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile', width: '375px' }
  ];

  const panels = [
    { id: 'components' as const, icon: Layers, label: 'Components' },
    { id: 'pages' as const, icon: FileText, label: 'Pages' },
    { id: 'theme' as const, icon: Palette, label: 'Theme' },
    { id: 'versions' as const, icon: History, label: 'Versions' },
    { id: 'code' as const, icon: Code, label: 'Code' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="h-14 border-b bg-background flex items-center justify-between px-4">
      {/* Left Section - Page Info and Panel Toggles */}
      <div className="flex items-center space-x-4">
        {/* Page Info */}
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold text-lg">{currentPage?.name || 'Untitled Page'}</h2>
          <Badge variant="outline" className="text-xs">
            {currentPage?.template || 'Custom'}
          </Badge>
        </div>

        {/* Panel Toggles */}
        {!isPreviewMode && (
          <div className="flex items-center border rounded-lg p-1">
            {panels.map((panel) => {
              const Icon = panel.icon;
              const isActive = activePanel === panel.id;
              
              return (
                <Button
                  key={panel.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3 text-xs",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => setActivePanel(isActive ? null : panel.id)}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {panel.label}
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Center Section - Preview Mode Controls */}
      <div className="flex items-center space-x-2">
        {/* Device Preview Selector */}
        <div className="flex items-center border rounded-lg p-1">
          {previewModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = previewMode === mode.mode;
            
            return (
              <Button
                key={mode.mode}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => setPreviewMode(mode.mode)}
              >
                <Icon className="h-4 w-4" />
                <span className="ml-1 hidden sm:inline">{mode.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Preview Toggle */}
        <Button
          variant={isPreviewMode ? "default" : "outline"}
          size="sm"
          onClick={togglePreviewMode}
          className="flex items-center space-x-2"
        >
          {isPreviewMode ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span className="hidden sm:inline">Exit Preview</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Preview</span>
            </>
          )}
        </Button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        {/* Undo/Redo */}
        {!isPreviewMode && (
          <>
            <Button variant="ghost" size="sm" disabled>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <Redo2 className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
          </>
        )}

        {/* Version Control */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <History className="h-4 w-4 mr-1" />
              Versions
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Version Control</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => createVersion(`Version ${Date.now()}`)}>
              <Save className="mr-2 h-4 w-4" />
              Create Version
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Export Page
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {currentPage?.versions.map((version) => (
              <DropdownMenuItem key={version.id}>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">{version.name}</span>
                  {version.isPublished && (
                    <Badge variant="outline" className="text-xs">Live</Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Save */}
        <Button onClick={savePage} size="sm">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>

        {/* Publish */}
        <Button variant="default" size="sm">
          <Share className="h-4 w-4 mr-1" />
          Publish
        </Button>
      </div>
    </div>
  );
}
