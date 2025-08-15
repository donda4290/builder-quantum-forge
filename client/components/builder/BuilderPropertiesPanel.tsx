import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { BuilderElement } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Settings,
  Palette,
  Type,
  Layout,
  Spacing,
  Eye,
  Code,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react';

export function BuilderPropertiesPanel() {
  const { selectedElement, updateElement, currentPage } = useBuilder();

  if (!selectedElement) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <Settings className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-lg">No Element Selected</h3>
            <p className="text-muted-foreground text-sm">
              Click on an element to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background border-l">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Properties</h3>
        <p className="text-sm text-muted-foreground capitalize">
          {selectedElement.type} Element
        </p>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
            <TabsTrigger value="design" className="text-xs">Design</TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            <ContentProperties element={selectedElement} updateElement={updateElement} />
          </TabsContent>

          <TabsContent value="design" className="p-4 space-y-4">
            <DesignProperties element={selectedElement} updateElement={updateElement} />
          </TabsContent>

          <TabsContent value="advanced" className="p-4 space-y-4">
            <AdvancedProperties element={selectedElement} updateElement={updateElement} />
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

interface PropertyProps {
  element: BuilderElement;
  updateElement: (elementId: string, updates: Partial<BuilderElement>) => void;
}

function ContentProperties({ element, updateElement }: PropertyProps) {
  const handleContentUpdate = (field: string, value: any) => {
    updateElement(element.id, {
      content: { ...element.content, [field]: value }
    });
  };

  const renderContentFields = () => {
    switch (element.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={element.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Enter your text..."
                className="mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Underline className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                value={element.content.src || ''}
                onChange={(e) => handleContentUpdate('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                value={element.content.alt || ''}
                onChange={(e) => handleContentUpdate('alt', e.target.value)}
                placeholder="Describe the image..."
                className="mt-1"
              />
            </div>
            <Button variant="outline" className="w-full">
              <Image className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={element.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Button text..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="button-variant">Button Style</Label>
              <Select 
                value={element.content.variant || 'default'}
                onValueChange={(value) => handleContentUpdate('variant', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="button-link">Link URL</Label>
              <Input
                id="button-link"
                value={element.content.href || ''}
                onChange={(e) => handleContentUpdate('href', e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'header':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="header-title">Logo/Title</Label>
              <Input
                id="header-title"
                value={element.content.title || ''}
                onChange={(e) => handleContentUpdate('title', e.target.value)}
                placeholder="Your Logo"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Navigation Items</Label>
              <div className="space-y-2 mt-1">
                {(element.content.navigation || ['Home', 'About', 'Contact']).map((item: string, index: number) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => {
                      const newNav = [...(element.content.navigation || ['Home', 'About', 'Contact'])];
                      newNav[index] = e.target.value;
                      handleContentUpdate('navigation', newNav);
                    }}
                    placeholder="Menu item"
                  />
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Add Menu Item
                </Button>
              </div>
            </div>
          </div>
        );

      case 'section':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                value={element.content.title || ''}
                onChange={(e) => handleContentUpdate('title', e.target.value)}
                placeholder="Section title..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="section-description">Description</Label>
              <Textarea
                id="section-description"
                value={element.content.description || ''}
                onChange={(e) => handleContentUpdate('description', e.target.value)}
                placeholder="Section description..."
                className="mt-1"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center text-muted-foreground">
            No content properties available for this element type.
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center">
          <Type className="h-4 w-4 mr-2" />
          Content
        </CardTitle>
        <CardDescription>Edit the content and text of this element</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContentFields()}
      </CardContent>
    </Card>
  );
}

function DesignProperties({ element, updateElement }: PropertyProps) {
  const handleStyleUpdate = (property: string, value: any) => {
    updateElement(element.id, {
      styles: { ...element.styles, [property]: value }
    });
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={['typography', 'colors', 'spacing']}>
        <AccordionItem value="typography">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Typography
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Font Size</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Slider
                  value={[parseInt(element.styles.fontSize) || 16]}
                  onValueChange={([value]) => handleStyleUpdate('fontSize', `${value}px`)}
                  max={72}
                  min={8}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm w-12">{element.styles.fontSize || '16px'}</span>
              </div>
            </div>
            <div>
              <Label>Font Weight</Label>
              <Select 
                value={element.styles.fontWeight || 'normal'}
                onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Light</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="300">300</SelectItem>
                  <SelectItem value="400">400</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="600">600</SelectItem>
                  <SelectItem value="700">700</SelectItem>
                  <SelectItem value="800">800</SelectItem>
                  <SelectItem value="900">900</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Text Align</Label>
              <Select 
                value={element.styles.textAlign || 'left'}
                onValueChange={(value) => handleStyleUpdate('textAlign', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="justify">Justify</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="colors">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center">
              <Palette className="h-4 w-4 mr-2" />
              Colors
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Text Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="color"
                  value={element.styles.color || '#000000'}
                  onChange={(e) => handleStyleUpdate('color', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={element.styles.color || '#000000'}
                  onChange={(e) => handleStyleUpdate('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Background Color</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  type="color"
                  value={element.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  value={element.styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center">
              <Spacing className="h-4 w-4 mr-2" />
              Spacing
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Padding</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  placeholder="Top"
                  value={element.styles.paddingTop || ''}
                  onChange={(e) => handleStyleUpdate('paddingTop', e.target.value)}
                />
                <Input
                  placeholder="Right"
                  value={element.styles.paddingRight || ''}
                  onChange={(e) => handleStyleUpdate('paddingRight', e.target.value)}
                />
                <Input
                  placeholder="Bottom"
                  value={element.styles.paddingBottom || ''}
                  onChange={(e) => handleStyleUpdate('paddingBottom', e.target.value)}
                />
                <Input
                  placeholder="Left"
                  value={element.styles.paddingLeft || ''}
                  onChange={(e) => handleStyleUpdate('paddingLeft', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Margin</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Input
                  placeholder="Top"
                  value={element.styles.marginTop || ''}
                  onChange={(e) => handleStyleUpdate('marginTop', e.target.value)}
                />
                <Input
                  placeholder="Right"
                  value={element.styles.marginRight || ''}
                  onChange={(e) => handleStyleUpdate('marginRight', e.target.value)}
                />
                <Input
                  placeholder="Bottom"
                  value={element.styles.marginBottom || ''}
                  onChange={(e) => handleStyleUpdate('marginBottom', e.target.value)}
                />
                <Input
                  placeholder="Left"
                  value={element.styles.marginLeft || ''}
                  onChange={(e) => handleStyleUpdate('marginLeft', e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dimensions">
          <AccordionTrigger className="text-sm">
            <div className="flex items-center">
              <Layout className="h-4 w-4 mr-2" />
              Dimensions
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Width</Label>
              <Input
                value={element.styles.width || ''}
                onChange={(e) => handleStyleUpdate('width', e.target.value)}
                placeholder="auto, 100px, 50%"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Height</Label>
              <Input
                value={element.styles.height || ''}
                onChange={(e) => handleStyleUpdate('height', e.target.value)}
                placeholder="auto, 100px, 50%"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Max Width</Label>
              <Input
                value={element.styles.maxWidth || ''}
                onChange={(e) => handleStyleUpdate('maxWidth', e.target.value)}
                placeholder="none, 100px, 50%"
                className="mt-1"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function AdvancedProperties({ element, updateElement }: PropertyProps) {
  const handlePropsUpdate = (field: string, value: any) => {
    updateElement(element.id, {
      props: { ...element.props, [field]: value }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Code className="h-4 w-4 mr-2" />
            Custom Properties
          </CardTitle>
          <CardDescription>Advanced element configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="element-id">Element ID</Label>
            <Input
              id="element-id"
              value={element.props.id || ''}
              onChange={(e) => handlePropsUpdate('id', e.target.value)}
              placeholder="unique-id"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="element-class">CSS Classes</Label>
            <Input
              id="element-class"
              value={element.props.className || ''}
              onChange={(e) => handlePropsUpdate('className', e.target.value)}
              placeholder="class1 class2"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="custom-css">Custom CSS</Label>
            <Textarea
              id="custom-css"
              value={element.props.customCSS || ''}
              onChange={(e) => handlePropsUpdate('customCSS', e.target.value)}
              placeholder="/* Custom CSS for this element */"
              className="mt-1 font-mono text-sm"
              rows={4}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="hidden"
              checked={element.props.hidden || false}
              onCheckedChange={(checked) => handlePropsUpdate('hidden', checked)}
            />
            <Label htmlFor="hidden">Hide Element</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
