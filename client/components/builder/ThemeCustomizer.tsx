import React from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Palette, Type, Spacing, Download, Upload, RotateCcw } from 'lucide-react';

export function ThemeCustomizer() {
  const { currentTheme, updateTheme, themes, applyTheme } = useBuilder();

  const handleColorChange = (colorKey: string, value: string) => {
    updateTheme({
      colors: { ...currentTheme.colors, [colorKey]: value }
    });
  };

  const handleFontChange = (fontKey: string, value: string) => {
    updateTheme({
      fonts: { ...currentTheme.fonts, [fontKey]: value }
    });
  };

  const handleSpacingChange = (spacingKey: string, value: string) => {
    updateTheme({
      spacing: { ...currentTheme.spacing, [spacingKey]: value }
    });
  };

  const handleCustomCSSChange = (value: string) => {
    updateTheme({ customCSS: value });
  };

  const presetThemes = [
    {
      id: 'modern-purple',
      name: 'Modern Purple',
      colors: {
        primary: '#8b5cf6',
        secondary: '#f3f4f6',
        accent: '#06b6d4',
        background: '#ffffff',
        foreground: '#1f2937',
        muted: '#6b7280',
        border: '#e5e7eb'
      }
    },
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      colors: {
        primary: '#0ea5e9',
        secondary: '#f0f9ff',
        accent: '#10b981',
        background: '#ffffff',
        foreground: '#0f172a',
        muted: '#64748b',
        border: '#cbd5e1'
      }
    },
    {
      id: 'forest-green',
      name: 'Forest Green',
      colors: {
        primary: '#059669',
        secondary: '#f0fdf4',
        accent: '#f59e0b',
        background: '#ffffff',
        foreground: '#1f2937',
        muted: '#6b7280',
        border: '#d1d5db'
      }
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      colors: {
        primary: '#ea580c',
        secondary: '#fff7ed',
        accent: '#8b5cf6',
        background: '#ffffff',
        foreground: '#1f2937',
        muted: '#6b7280',
        border: '#fed7aa'
      }
    }
  ];

  const googleFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Source Sans Pro',
    'Oswald',
    'Raleway',
    'PT Sans',
    'Lora',
    'Playfair Display',
    'Merriweather',
    'Nunito',
    'Ubuntu',
    'Poppins'
  ];

  return (
    <div className="h-full bg-background">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-2">Theme Customization</h3>
        <p className="text-sm text-muted-foreground">
          Customize colors, fonts, and styles for your website
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Preset Themes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Preset Themes
              </CardTitle>
              <CardDescription>Quick start with pre-designed themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {presetThemes.map((theme) => (
                  <Button
                    key={theme.id}
                    variant="outline"
                    className="h-auto p-3 flex flex-col items-start space-y-2"
                    onClick={() => updateTheme({ colors: theme.colors })}
                  >
                    <div className="flex space-x-1">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                    </div>
                    <span className="text-xs font-medium">{theme.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Accordion type="single" collapsible defaultValue="colors">
            <AccordionItem value="colors">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Colors
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        className="w-12 h-8 p-1 border rounded"
                      />
                      <Input
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        placeholder="#000000"
                        className="flex-1 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="typography">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  Typography
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Heading Font</Label>
                  <Select 
                    value={currentTheme.fonts.heading}
                    onValueChange={(value) => handleFontChange('heading', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {googleFonts.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Body Font</Label>
                  <Select 
                    value={currentTheme.fonts.body}
                    onValueChange={(value) => handleFontChange('body', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {googleFonts.map((font) => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="spacing">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center">
                  <Spacing className="h-4 w-4 mr-2" />
                  Spacing Scale
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {Object.entries(currentTheme.spacing).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="text-xs capitalize">{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) => handleSpacingChange(key, e.target.value)}
                      placeholder="1rem"
                      className="text-xs"
                    />
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="custom-css">
              <AccordionTrigger className="text-sm">
                <div className="flex items-center">
                  <Type className="h-4 w-4 mr-2" />
                  Custom CSS
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Additional CSS</Label>
                  <Textarea
                    value={currentTheme.customCSS}
                    onChange={(e) => handleCustomCSSChange(e.target.value)}
                    placeholder="/* Your custom CSS here */"
                    className="font-mono text-xs"
                    rows={8}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Theme Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Theme
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Theme
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview Note */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Changes are applied in real-time to your canvas
                </p>
                <p className="text-xs text-muted-foreground">
                  Use the preview mode to see the final result
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
