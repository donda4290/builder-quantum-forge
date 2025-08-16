import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Monitor, 
  Tablet, 
  Smartphone,
  Eye,
  Save,
  Plus,
  Upload,
  Settings,
  Code
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BuilderChatbot } from './BuilderChatbot';

interface BuilderPage {
  id: string;
  name: string;
  url: string;
  published: boolean;
  lastModified: Date;
  model: string;
}

interface ActiveBuilderEditorProps {
  page: BuilderPage;
  onSave: (content: any) => void;
}

export function ActiveBuilderEditor({ page, onSave }: ActiveBuilderEditorProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isChatbotOpen, setIsChatbotOpen] = useState(true); // Always open as sidebar
  const [chatbotCollapsed, setChatbotCollapsed] = useState(false);

  const components = [
    { id: 'text', name: 'Text Block', icon: '📝', color: 'bg-blue-100 text-blue-800' },
    { id: 'image', name: 'Image', icon: '🖼️', color: 'bg-green-100 text-green-800' },
    { id: 'button', name: 'Button', icon: '🔘', color: 'bg-purple-100 text-purple-800' },
    { id: 'container', name: 'Container', icon: '📦', color: 'bg-orange-100 text-orange-800' },
    { id: 'hero', name: 'Hero Section', icon: '🎯', color: 'bg-red-100 text-red-800' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const getCanvasWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const handleDragStart = (componentId: string) => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast({
      title: 'Component Added!',
      description: 'New component has been added to your page.'
    });
  };

  const handleComponentAdd = (componentType: string) => {
    toast({
      title: `${componentType} Added!`,
      description: `AI Assistant added a ${componentType} component to your page.`
    });
    // In a real implementation, this would add the actual component
  };

  const handleStyleChange = (property: string, value: string) => {
    toast({
      title: 'Style Updated!',
      description: `AI Assistant applied ${value} ${property} to your page.`
    });
    // In a real implementation, this would apply the actual styles
  };

  const handleLayoutSuggestion = (layout: string) => {
    toast({
      title: 'Layout Optimized!',
      description: `AI Assistant applied ${layout} layout optimizations.`
    });
    // In a real implementation, this would apply the layout changes
  };

  return (
    <div className="h-full flex">
      {/* Components Sidebar */}
      <div className="w-80 border-r bg-gray-50 dark:bg-gray-800 flex flex-col">
        <div className="p-4 border-b bg-white dark:bg-gray-900">
          <h3 className="font-semibold text-lg">Components</h3>
          <p className="text-sm text-muted-foreground">Drag to add to your page</p>
        </div>
        
        <div className="flex-1 p-4 space-y-3 overflow-auto">
          {components.map((component) => (
            <div
              key={component.id}
              draggable
              onDragStart={() => handleDragStart(component.id)}
              onDragEnd={handleDragEnd}
              className={`p-4 rounded-lg border cursor-move hover:shadow-md transition-all ${component.color}`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{component.icon}</span>
                <div>
                  <h4 className="font-medium">{component.name}</h4>
                  <p className="text-xs opacity-75">Drag to canvas</p>
                </div>
                <Plus className="h-4 w-4 opacity-50" />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-white dark:bg-gray-900">
          <Button className="w-full" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Component
          </Button>
        </div>
      </div>

      {/* Visual Editor Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Canvas Toolbar */}
        <div className="h-12 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              ✨ Live Editor Active
            </Badge>
            <span className="text-sm text-muted-foreground">|</span>
            <span className="text-sm font-medium">{page.name}</span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Device Preview */}
            <div className="flex items-center border rounded-lg p-1">
              {[
                { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
                { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
                { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' }
              ].map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant="ghost"
                  size="sm"
                  className={previewMode === mode ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setPreviewMode(mode)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>

            <Button size="sm" onClick={() => onSave({})}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setChatbotCollapsed(!chatbotCollapsed)}
              className={!chatbotCollapsed ? "bg-primary/10 border-primary" : ""}
            >
              <div className="relative">
                🤖
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span className="ml-2">{chatbotCollapsed ? 'Show' : 'Hide'} AI Assistant</span>
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-800 p-6 overflow-auto">
          <div className="flex justify-center">
            <div
              className={`bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 min-h-full relative ${isDragging ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
              style={{ width: getCanvasWidth(), maxWidth: '100%', minHeight: '800px' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {previewMode !== 'desktop' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  {previewMode === 'mobile' ? 'Mobile View (375px)' : 'Tablet View (768px)'}
                </div>
              )}

              {/* Live Preview Content */}
              <ActiveLivePreview 
                page={page}
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
                isDragging={isDragging}
              />

              {/* Drop Zone Indicator */}
              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="text-primary font-medium">Drop component here</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {!chatbotCollapsed && (
        <div className="w-80 border-l bg-gray-50 dark:bg-gray-800 flex flex-col">
          <div className="p-4 border-b bg-white dark:bg-gray-900">
            <h3 className="font-semibold text-lg">Properties</h3>
            <p className="text-sm text-muted-foreground">
              {selectedElement ? 'Edit selected element' : 'Select an element to edit'}
            </p>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-auto">
            {selectedElement ? (
              <ElementProperties elementId={selectedElement} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Select an element on the canvas to see its properties</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chatbot Sidebar */}
      {!chatbotCollapsed && (
        <BuilderChatbotSidebar
          onComponentAdd={handleComponentAdd}
          onStyleChange={handleStyleChange}
          onLayoutSuggestion={handleLayoutSuggestion}
          currentPage={page}
        />
      )}
    </div>
  );
}

// Live Preview Component
function ActiveLivePreview({ 
  page, 
  selectedElement, 
  onElementSelect, 
  isDragging 
}: {
  page: BuilderPage;
  selectedElement: string | null;
  onElementSelect: (id: string | null) => void;
  isDragging: boolean;
}) {
  const elements = [
    { id: 'header', type: 'header', content: 'Welcome to Our Store' },
    { id: 'hero', type: 'hero', content: 'Build Amazing Websites' },
    { id: 'features', type: 'section', content: 'Features Section' },
    { id: 'cta', type: 'button', content: 'Get Started' }
  ];

  return (
    <div className="p-8 space-y-6">
      {elements.map((element) => (
        <div
          key={element.id}
          className={`
            relative group cursor-pointer transition-all duration-200
            ${selectedElement === element.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:ring-1 hover:ring-primary/50'}
            ${isDragging ? 'pointer-events-none' : ''}
          `}
          onClick={() => onElementSelect(element.id)}
        >
          {/* Element Content */}
          <ElementRenderer element={element} />
          
          {/* Selection Overlay */}
          {selectedElement === element.id && (
            <div className="absolute -inset-1 border-2 border-primary rounded pointer-events-none">
              <div className="absolute -top-6 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                {element.type}
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <div className="absolute inset-0 bg-primary/5 border border-primary/20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Element Renderer
function ElementRenderer({ element }: { element: any }) {
  switch (element.type) {
    case 'header':
      return (
        <header className="bg-primary text-primary-foreground p-6 rounded-lg">
          <h1 className="text-3xl font-bold">{element.content}</h1>
        </header>
      );
    case 'hero':
      return (
        <section className="text-center py-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg">
          <h2 className="text-5xl font-bold mb-4">{element.content}</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create stunning websites with our visual editor
          </p>
          <Button size="lg">Get Started</Button>
        </section>
      );
    case 'section':
      return (
        <section className="py-12 px-6 border rounded-lg">
          <h3 className="text-2xl font-semibold mb-4">{element.content}</h3>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center p-4 border rounded">
                <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-primary font-bold">{i}</span>
                </div>
                <h4 className="font-medium">Feature {i}</h4>
                <p className="text-sm text-muted-foreground">Amazing feature description</p>
              </div>
            ))}
          </div>
        </section>
      );
    case 'button':
      return (
        <div className="text-center py-8">
          <Button size="lg">{element.content}</Button>
        </div>
      );
    default:
      return (
        <div className="p-4 border rounded bg-muted">
          <p>{element.content}</p>
        </div>
      );
  }
}

// Element Properties Panel
function ElementProperties({ elementId }: { elementId: string }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="content">Content</Label>
        <Input id="content" placeholder="Enter content..." className="mt-1" />
      </div>
      
      <div>
        <Label htmlFor="color">Color</Label>
        <Input id="color" type="color" className="mt-1 h-10" />
      </div>

      <div>
        <Label htmlFor="padding">Padding</Label>
        <Input id="padding" placeholder="16px" className="mt-1" />
      </div>

      <div>
        <Label htmlFor="margin">Margin</Label>
        <Input id="margin" placeholder="8px" className="mt-1" />
      </div>

      <div className="pt-4 border-t">
        <Button className="w-full" variant="outline">
          <Code className="h-4 w-4 mr-2" />
          Edit Custom CSS
        </Button>
      </div>
    </div>
  );
}
