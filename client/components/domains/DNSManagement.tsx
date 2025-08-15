import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Plus, Settings } from 'lucide-react';

export function DNSManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">DNS Management</h2>
        <p className="text-muted-foreground">Configure DNS records for your domains</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wifi className="h-5 w-5 mr-2" />
            DNS Configuration
          </CardTitle>
          <CardDescription>
            Manage A, CNAME, MX, and other DNS records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Wifi className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">DNS Management</h3>
            <p className="text-muted-foreground mb-4">
              Advanced DNS record management with automatic configuration
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Features include:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A, AAAA, CNAME, MX, TXT record management</li>
                <li>• Automatic SSL certificate DNS validation</li>
                <li>• CDN and performance optimization</li>
                <li>• Real-time DNS propagation monitoring</li>
              </ul>
            </div>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add DNS Record
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
