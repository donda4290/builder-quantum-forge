import React, { useRef, useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { BuilderElement } from '@/contexts/BuilderContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Move, 
  Eye,
  MousePointer2 
} from 'lucide-react';

export function BuilderCanvas() {
  const {
    currentPage,
    selectedElement,
    previewMode,
    isPreviewMode,
    selectElement,
    deleteElement,
    updateElement
  } = useBuilder();

  const [dragOver, setDragOver] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getCanvasWidth = () => {
    switch (previewMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  const handleDragOver = (e: React.DragEvent, elementId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(elementId || 'canvas');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent, parentId?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(null);
    // Handle drop logic here - will be implemented with component library
  };

  const handleElementClick = (element: BuilderElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPreviewMode) {
      selectElement(element);
    }
  };

  const handleCanvasClick = () => {
    if (!isPreviewMode) {
      selectElement(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
      {/* Canvas Container */}
      <div className="p-4 min-h-full flex justify-center">
        <div
          ref={canvasRef}
          className={cn(
            "bg-white dark:bg-background shadow-lg transition-all duration-300 min-h-full relative",
            previewMode === 'mobile' && "rounded-lg",
            dragOver === 'canvas' && "ring-2 ring-primary ring-opacity-50"
          )}
          style={{ width: getCanvasWidth(), maxWidth: '100%' }}
          onDragOver={(e) => handleDragOver(e)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e)}
          onClick={handleCanvasClick}
        >
          {/* Device Frame for Mobile/Tablet */}
          {previewMode !== 'desktop' && (
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
              {previewMode === 'mobile' ? 'Mobile View (375px)' : 'Tablet View (768px)'}
            </div>
          )}

          {/* Empty State */}
          {(!currentPage?.elements || currentPage.elements.length === 0) && !isPreviewMode && (
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg m-4">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Start Building Your Page</h3>
                  <p className="text-muted-foreground text-sm">
                    Drag components from the sidebar to start designing
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Render Elements */}
          {currentPage?.elements.map((element) => (
            <BuilderElementRenderer
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              isPreviewMode={isPreviewMode}
              onElementClick={handleElementClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              dragOver={dragOver}
            />
          ))}

          {/* Preview Mode Overlay */}
          {isPreviewMode && (
            <div className="absolute top-4 right-4 z-50">
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                <Eye className="h-3 w-3" />
                <span>Preview Mode</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface BuilderElementRendererProps {
  element: BuilderElement;
  isSelected: boolean;
  isPreviewMode: boolean;
  onElementClick: (element: BuilderElement, e: React.MouseEvent) => void;
  onDragOver: (e: React.DragEvent, elementId?: string) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, parentId?: string) => void;
  dragOver: string | null;
}

function BuilderElementRenderer({
  element,
  isSelected,
  isPreviewMode,
  onElementClick,
  onDragOver,
  onDragLeave,
  onDrop,
  dragOver
}: BuilderElementRendererProps) {
  const { deleteElement, updateElement } = useBuilder();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElement(element.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement duplication logic
  };

  // Render different element types
  const renderElementContent = () => {
    switch (element.type) {
      case 'text':
        return (
          <div 
            className="p-4"
            style={element.styles}
          >
            <p>{element.content.text || 'Click to edit text'}</p>
          </div>
        );
      
      case 'header':
        return (
          <header 
            className="bg-primary text-primary-foreground p-6"
            style={element.styles}
          >
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">{element.content.title || 'Your Logo'}</h1>
              <nav className="space-x-4">
                <a href="#" className="hover:underline">Home</a>
                <a href="#" className="hover:underline">About</a>
                <a href="#" className="hover:underline">Contact</a>
              </nav>
            </div>
          </header>
        );
      
      case 'section':
        return (
          <section 
            className="py-12 px-6"
            style={element.styles}
            onDragOver={(e) => onDragOver(e, element.id)}
            onDragLeave={onDragLeave}
            onDrop={(e) => onDrop(e, element.id)}
          >
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold mb-6">{element.content.title || 'Section Title'}</h2>
              <p className="text-lg text-muted-foreground">
                {element.content.description || 'Section description goes here.'}
              </p>
              
              {/* Render child elements */}
              {element.children?.map((child) => (
                <BuilderElementRenderer
                  key={child.id}
                  element={child}
                  isSelected={false}
                  isPreviewMode={isPreviewMode}
                  onElementClick={onElementClick}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  dragOver={dragOver}
                />
              ))}
              
              {/* Drop zone for section */}
              {dragOver === element.id && (
                <div className="border-2 border-dashed border-primary border-opacity-50 rounded-lg p-4 mt-4">
                  <p className="text-center text-muted-foreground">Drop component here</p>
                </div>
              )}
            </div>
          </section>
        );
      
      case 'image':
        return (
          <div className="p-4" style={element.styles}>
            <img 
              src={element.content.src || '/api/placeholder/400/300'} 
              alt={element.content.alt || 'Image'}
              className="w-full h-auto rounded-lg"
            />
          </div>
        );
      
      case 'button':
        return (
          <div className="p-4" style={element.styles}>
            <Button 
              variant={element.content.variant || 'default'}
              size={element.content.size || 'default'}
            >
              {element.content.text || 'Button Text'}
            </Button>
          </div>
        );
      
      case 'footer':
        return (
          <footer 
            className="bg-muted text-muted-foreground py-8 px-6"
            style={element.styles}
          >
            <div className="container mx-auto text-center">
              <p>&copy; 2024 {element.content.company || 'Your Company'}. All rights reserved.</p>
            </div>
          </footer>
        );
      
      default:
        return (
          <div className="p-4 border border-dashed border-muted-foreground/25" style={element.styles}>
            <p className="text-muted-foreground">Unknown element type: {element.type}</p>
          </div>
        );
    }
  };

  return (
    <div
      className={cn(
        "relative group",
        isSelected && !isPreviewMode && "ring-2 ring-primary ring-opacity-50",
        dragOver === element.id && "ring-2 ring-primary ring-opacity-75"
      )}
      onClick={(e) => onElementClick(element, e)}
    >
      {/* Element Content */}
      {renderElementContent()}

      {/* Element Controls */}
      {isSelected && !isPreviewMode && (
        <div className="absolute top-2 right-2 flex items-center space-x-1 bg-white dark:bg-background border rounded-lg shadow-lg p-1">
          <Button variant="ghost" size="sm" onClick={handleDuplicate}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm">
            <Move className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Hover Indicator */}
      {!isSelected && !isPreviewMode && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
            {element.type}
          </div>
        </div>
      )}
    </div>
  );
}
