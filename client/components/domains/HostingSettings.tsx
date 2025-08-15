import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Server, Zap, Shield, Globe } from 'lucide-react';

export function HostingSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hosting & Performance</h2>
        <p className="text-muted-foreground">Configure hosting, CDN, and performance optimization</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              CDN & Performance
            </CardTitle>
            <CardDescription>Global content delivery and optimization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">CDN Enabled</p>
                <p className="text-sm text-muted-foreground">Global content delivery network</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Image Optimization</p>
                <p className="text-sm text-muted-foreground">Automatic image compression</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Minification</p>
                <p className="text-sm text-muted-foreground">Compress CSS, JS, and HTML</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Headers
            </CardTitle>
            <CardDescription>Security and protection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">HSTS</p>
                <p className="text-sm text-muted-foreground">HTTP Strict Transport Security</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">X-Frame-Options</p>
                <p className="text-sm text-muted-foreground">Clickjacking protection</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Content Security Policy</p>
                <p className="text-sm text-muted-foreground">XSS attack prevention</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
