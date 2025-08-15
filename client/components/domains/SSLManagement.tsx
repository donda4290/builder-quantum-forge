import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Plus, CheckCircle } from 'lucide-react';

export function SSLManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">SSL Certificate Management</h2>
        <p className="text-muted-foreground">Secure your domains with SSL certificates</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            SSL Certificates
          </CardTitle>
          <CardDescription>
            Automatic SSL certificate provisioning and renewal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">SSL Certificate Management</h3>
            <p className="text-muted-foreground mb-4">
              Free SSL certificates with automatic renewal
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Features include:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Let's Encrypt free SSL certificates</li>
                <li>• Wildcard SSL support</li>
                <li>• Automatic renewal and monitoring</li>
                <li>• Custom certificate upload</li>
              </ul>
            </div>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Setup SSL Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
