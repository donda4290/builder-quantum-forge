import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  Type,
  Image,
  Video,
  Button as ButtonIcon,
  Layout,
  Header,
  Footer,
  Grid,
  Form,
  ShoppingCart,
  Calendar,
  Map,
  Code,
  Layers,
  FileText,
  Plus,
  Trash2,
  Copy,
  FolderOpen,
  Template
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeCustomizer } from './ThemeCustomizer';
import { CodeEditor } from './CodeEditor';
import { ecommerceTemplates, generateTemplateElements } from './EcommerceTemplates';

export function BuilderSidebar() {
  const { 
    activePanel, 
    addElement, 
    currentPage, 
    pages, 
    loadPage, 
    createPage, 
    duplicatePage, 
    deletePage 
  } = useBuilder();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Component Library
  const componentCategories = [
    {
      id: 'layout',
      name: 'Layout',
      icon: Layout,
      components: [
        {
          id: 'header',
          name: 'Header',
          icon: Header,
          description: 'Navigation header with logo and menu',
          element: {
            type: 'header' as const,
            content: { title: 'Your Logo' },
            styles: {},
            props: {}
          }
        },
        {
          id: 'footer',
          name: 'Footer',
          icon: Footer,
          description: 'Site footer with copyright',
          element: {
            type: 'footer' as const,
            content: { company: 'Your Company' },
            styles: {},
            props: {}
          }
        },
        {
          id: 'section',
          name: 'Section',
          icon: Layers,
          description: 'Container section for content',
          element: {
            type: 'section' as const,
            content: { title: 'Section Title', description: 'Section description' },
            styles: { backgroundColor: '#ffffff' },
            props: {}
          }
        },
        {
          id: 'grid',
          name: 'Grid',
          icon: Grid,
          description: 'Responsive grid layout',
          element: {
            type: 'section' as const,
            content: { title: 'Grid Section' },
            styles: { 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              padding: '2rem'
            },
            props: {}
          }
        }
      ]
    },
    {
      id: 'content',
      name: 'Content',
      icon: Type,
      components: [
        {
          id: 'text',
          name: 'Text',
          icon: Type,
          description: 'Editable text content',
          element: {
            type: 'text' as const,
            content: { text: 'Your text content goes here' },
            styles: { fontSize: '16px', lineHeight: '1.6' },
            props: {}
          }
        },
        {
          id: 'heading',
          name: 'Heading',
          icon: Type,
          description: 'Large heading text',
          element: {
            type: 'text' as const,
            content: { text: 'Your Heading' },
            styles: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' },
            props: {}
          }
        },
        {
          id: 'paragraph',
          name: 'Paragraph',
          icon: Type,
          description: 'Paragraph text content',
          element: {
            type: 'text' as const,
            content: { text: 'This is a paragraph of text. You can edit this content and style it however you like.' },
            styles: { fontSize: '16px', lineHeight: '1.6', marginBottom: '1rem' },
            props: {}
          }
        }
      ]
    },
    {
      id: 'media',
      name: 'Media',
      icon: Image,
      components: [
        {
          id: 'image',
          name: 'Image',
          icon: Image,
          description: 'Responsive image',
          element: {
            type: 'image' as const,
            content: { src: '/api/placeholder/400/300', alt: 'Sample image' },
            styles: { width: '100%', height: 'auto' },
            props: {}
          }
        },
        {
          id: 'video',
          name: 'Video',
          icon: Video,
          description: 'Video player',
          element: {
            type: 'video' as const,
            content: { src: '', poster: '/api/placeholder/400/300' },
            styles: { width: '100%', height: 'auto' },
            props: {}
          }
        },
        {
          id: 'gallery',
          name: 'Gallery',
          icon: Grid,
          description: 'Image gallery',
          element: {
            type: 'section' as const,
            content: { title: 'Gallery' },
            styles: { 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              padding: '2rem'
            },
            props: {}
          }
        }
      ]
    },
    {
      id: 'interactive',
      name: 'Interactive',
      icon: ButtonIcon,
      components: [
        {
          id: 'button',
          name: 'Button',
          icon: ButtonIcon,
          description: 'Call-to-action button',
          element: {
            type: 'button' as const,
            content: { text: 'Click Me', variant: 'default' },
            styles: {},
            props: {}
          }
        },
        {
          id: 'form',
          name: 'Form',
          icon: Form,
          description: 'Contact or signup form',
          element: {
            type: 'form' as const,
            content: { title: 'Contact Form' },
            styles: { padding: '2rem' },
            props: {}
          }
        }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      icon: ShoppingCart,
      components: [
        {
          id: 'product-grid',
          name: 'Product Grid',
          icon: Grid,
          description: 'Product listing grid',
          element: {
            type: 'section' as const,
            content: { title: 'Featured Products' },
            styles: { 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              padding: '2rem'
            },
            props: { ecommerce: 'product-grid' }
          }
        },
        {
          id: 'product-card',
          name: 'Product Card',
          icon: ShoppingCart,
          description: 'Individual product showcase',
          element: {
            type: 'section' as const,
            content: { title: 'Product Name', description: 'Product description' },
            styles: { 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center'
            },
            props: { ecommerce: 'product-card' }
          }
        },
        {
          id: 'cart-button',
          name: 'Add to Cart',
          icon: ButtonIcon,
          description: 'Add to cart button',
          element: {
            type: 'button' as const,
            content: { text: 'Add to Cart', variant: 'default' },
            styles: { backgroundColor: '#10b981', color: 'white' },
            props: { ecommerce: 'add-to-cart' }
          }
        }
      ]
    },
    {
      id: 'advanced',
      name: 'Advanced',
      icon: Code,
      components: [
        {
          id: 'custom-code',
          name: 'Custom HTML',
          icon: Code,
          description: 'Custom HTML/CSS/JS',
          element: {
            type: 'custom' as const,
            content: { html: '<div>Custom HTML content</div>' },
            styles: {},
            props: {}
          }
        },
        {
          id: 'embed',
          name: 'Embed',
          icon: Code,
          description: 'Third-party embeds',
          element: {
            type: 'custom' as const,
            content: { html: '<iframe src="" width="100%" height="400"></iframe>' },
            styles: {},
            props: {}
          }
        }
      ]
    }
  ];

  const handleDragStart = (e: React.DragEvent, component: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  const handleAddComponent = (component: any) => {
    addElement(component.element);
  };

  const filteredCategories = componentCategories.map(category => ({
    ...category,
    components: category.components.filter(component =>
      component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.components.length > 0);

  const renderComponentsPanel = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-3">Components</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <Accordion type="multiple" className="w-full" defaultValue={['layout', 'content']}>
          {filteredCategories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({category.components.length})
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-1 gap-2">
                  {category.components.map((component) => (
                    <div
                      key={component.id}
                      className="group border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                      draggable
                      onDragStart={(e) => handleDragStart(e, component)}
                      onClick={() => handleAddComponent(component)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-md">
                          <component.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{component.name}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {component.description}
                          </p>
                        </div>
                        <Plus className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );

  const renderPagesPanel = () => (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Pages</h3>
          <Button size="sm" onClick={() => createPage('New Page')}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {/* E-commerce Templates */}
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm mb-3 flex items-center">
            <Template className="h-4 w-4 mr-2" />
            E-commerce Templates
          </h4>
          <div className="space-y-2">
            {Object.entries(ecommerceTemplates).map(([key, template]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                className="w-full justify-start h-auto p-3"
                onClick={() => {
                  const elements = generateTemplateElements(key);
                  const newPage = {
                    id: `page-${Date.now()}`,
                    name: template.name,
                    slug: `/${key}`,
                    template: key as any,
                    elements,
                    seo: {
                      title: template.name,
                      description: template.description,
                      keywords: []
                    },
                    customCSS: '',
                    customJS: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    versions: []
                  };
                  // Add the page and load it
                  createPage(template.name, key);
                }}
              >
                <div className="text-left">
                  <div className="font-medium text-xs">{template.name}</div>
                  <div className="text-xs text-muted-foreground">{template.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Existing Pages */}
        <div className="p-4 space-y-2">
          <h4 className="font-medium text-sm mb-3">Your Pages</h4>
          {pages.map((page) => (
            <div
              key={page.id}
              className={cn(
                "group border rounded-lg p-3 cursor-pointer transition-colors",
                currentPage?.id === page.id
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-muted/50"
              )}
              onClick={() => loadPage(page.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-sm">{page.name}</h4>
                    <p className="text-xs text-muted-foreground">{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    duplicatePage(page.id);
                  }}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    deletePage(page.id);
                  }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const renderPanel = () => {
    switch (activePanel) {
      case 'components':
        return renderComponentsPanel();
      case 'pages':
        return renderPagesPanel();
      case 'theme':
        return <ThemeCustomizer />;
      case 'versions':
        return <div className="p-4">Version control panel coming soon...</div>;
      case 'code':
        return <CodeEditor />;
      case 'settings':
        return <div className="p-4">Settings panel coming soon...</div>;
      default:
        return <div className="p-4">Select a panel from the toolbar</div>;
    }
  };

  return (
    <div className="h-full bg-background">
      {renderPanel()}
    </div>
  );
}
