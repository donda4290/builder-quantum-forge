import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Palette, 
  Code, 
  Eye, 
  Monitor, 
  Tablet, 
  Smartphone,
  Save,
  Plus,
  Layers,
  Type,
  Image,
  Layout
} from 'lucide-react';

export default function Builder() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const previewModes = [
    { mode: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { mode: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { mode: 'mobile' as const, icon: Smartphone, label: 'Mobile' }
  ];

  const components = [
    { id: 'header', name: 'Header', icon: Layout, category: 'Layout' },
    { id: 'text', name: 'Text', icon: Type, category: 'Content' },
    { id: 'image', name: 'Image', icon: Image, category: 'Media' },
    { id: 'button', name: 'Button', icon: Button, category: 'Interactive' }
  ];

  const getCanvasWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Toolbar */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h2 className="font-semibold text-lg">Website Builder</h2>
          <Badge variant="outline">Stage 2: Advanced Builder</Badge>
        </div>

        <div className="flex items-center space-x-2">
          {/* Preview Mode Controls */}
          <div className="flex items-center border rounded-lg p-1">
            {previewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.mode}
                  variant="ghost"
                  size="sm"
                  className={previewMode === mode.mode ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setPreviewMode(mode.mode)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="ml-1 hidden sm:inline">{mode.label}</span>
                </Button>
              );
            })}
          </div>

          <Button
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="h-4 w-4 mr-1" />
            {isPreviewMode ? 'Exit Preview' : 'Preview'}
          </Button>

          <Button size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Components Sidebar */}
        {!isPreviewMode && (
          <div className="w-80 border-r bg-muted/20">
            <div className="p-4 border-b">
              <h3 className="font-semibold mb-3">Components</h3>
            </div>
            <div className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Layers className="h-4 w-4 mr-2" />
                    Drag & Drop Components
                  </CardTitle>
                  <CardDescription>
                    Click components to add to your page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className="group border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <component.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{component.name}</h4>
                          <p className="text-xs text-muted-foreground">{component.category}</p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    E-commerce Templates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {['Product Listing', 'Category Page', 'Checkout Flow', 'Landing Page'].map((template) => (
                    <Button
                      key={template}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {template}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 min-h-full flex justify-center">
            <div
              className="bg-white dark:bg-background shadow-lg transition-all duration-300 min-h-full relative"
              style={{ width: getCanvasWidth(), maxWidth: '100%' }}
            >
              {previewMode !== 'desktop' && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                  {previewMode === 'mobile' ? 'Mobile View (375px)' : 'Tablet View (768px)'}
                </div>
              )}

              {/* Demo Content */}
              <div className="p-8 space-y-8">
                {/* Header */}
                <header className="bg-primary text-primary-foreground p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Your Store</h1>
                    <nav className="space-x-4">
                      <a href="#" className="hover:underline">Home</a>
                      <a href="#" className="hover:underline">Products</a>
                      <a href="#" className="hover:underline">About</a>
                    </nav>
                  </div>
                </header>

                {/* Hero Section */}
                <section className="text-center py-12 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 rounded-lg">
                  <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Discover amazing products with our advanced website builder
                  </p>
                  <Button size="lg">
                    Shop Now
                  </Button>
                </section>

                {/* Features */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { icon: Building2, title: 'Visual Builder', desc: 'Drag & drop components' },
                    { icon: Palette, title: 'Theme System', desc: 'Custom colors & fonts' },
                    { icon: Code, title: 'Custom Code', desc: 'HTML, CSS & JavaScript' }
                  ].map((feature, i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <feature.icon className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </section>
              </div>

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

        {/* Properties Panel */}
        {!isPreviewMode && (
          <div className="w-80 border-l bg-muted/20">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Properties</h3>
              <p className="text-sm text-muted-foreground">Element settings</p>
            </div>
            <div className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Palette className="h-4 w-4 mr-2" />
                      Theme Editor
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="h-4 w-4 mr-2" />
                      Custom Code
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Building2 className="h-4 w-4 mr-2" />
                      Page Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
