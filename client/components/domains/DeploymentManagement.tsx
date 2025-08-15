import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Play, Settings, Globe, ExternalLink } from 'lucide-react';

export function DeploymentManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Website Deployment</h2>
        <p className="text-muted-foreground">Deploy websites to your domains with zero downtime</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            One-Click Deployment
          </CardTitle>
          <CardDescription>
            Deploy websites from the builder directly to your custom domains
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Production Environment</CardTitle>
                <CardDescription>Live website accessible to visitors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge className="bg-green-100 text-green-800">Live</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Domain:</span>
                  <span className="font-medium">luxuryfashion.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Deploy:</span>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Deploy
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://luxuryfashion.com" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staging Environment</CardTitle>
                <CardDescription>Test changes before going live</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant="outline">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Domain:</span>
                  <span className="font-medium">staging.luxuryfashion.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Deploy:</span>
                  <span className="text-sm text-muted-foreground">5 minutes ago</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-1" />
                    Deploy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-1" />
                    Promote to Live
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Deployment Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Zero Downtime Deployment</p>
                  <p className="text-xs text-muted-foreground">Seamless updates without interruption</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Settings className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Automatic SSL Configuration</p>
                  <p className="text-xs text-muted-foreground">SSL certificates applied automatically</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Global CDN</p>
                  <p className="text-xs text-muted-foreground">Fast loading worldwide</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Play className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-sm">Staging Environments</p>
                  <p className="text-xs text-muted-foreground">Test before deploying live</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
