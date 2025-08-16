import React, { useState } from 'react';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe,
  Plus,
  Search,
  Settings,
  Shield,
  Zap,
  Server,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Clock,
  Wifi,
  Database
} from 'lucide-react';

// Import sub-components
import { DomainPurchase } from './DomainPurchase';
import { DomainManagement } from './DomainManagement';
import { DNSManagement } from './DNSManagement';
import { SSLManagement } from './SSLManagement';
import { DeploymentManagement } from './DeploymentManagement';
import { HostingSettings } from './HostingSettings';
import { DomainProviders } from './DomainProviders';
import { DomainStoreConnection } from './DomainStoreConnection';

export function DomainDashboard() {
  const { domains } = useDomain();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'purchase', label: 'Purchase', icon: Plus },
    { id: 'stores', label: 'Store Deployment', icon: Zap },
    { id: 'domains', label: 'Domains', icon: Database },
    { id: 'dns', label: 'DNS', icon: Wifi },
    { id: 'ssl', label: 'SSL', icon: Shield },
    { id: 'deployment', label: 'Deploy', icon: Zap },
    { id: 'hosting', label: 'Hosting', icon: Server },
    { id: 'providers', label: 'Providers', icon: Settings }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'expired': return AlertTriangle;
      case 'suspended': return AlertTriangle;
      default: return Clock;
    }
  };

  const quickStats = [
    {
      title: 'Total Domains',
      value: domains.length.toString(),
      description: 'Domains under management',
      icon: Globe,
      color: 'text-blue-600'
    },
    {
      title: 'Active Domains',
      value: domains.filter(d => d.status === 'active').length.toString(),
      description: 'Live and functioning',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'SSL Enabled',
      value: domains.filter(d => d.sslStatus === 'active').length.toString(),
      description: 'Secure certificates',
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      title: 'CDN Enabled',
      value: domains.filter(d => d.cdnEnabled).length.toString(),
      description: 'Performance optimized',
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Domain Status Cards */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Domain Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {domains.map((domain) => {
            const StatusIcon = getStatusIcon(domain.status);
            return (
              <Card key={domain.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{domain.name}</CardTitle>
                    <Badge className={getStatusColor(domain.status)}>
                      {domain.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Registered with {domain.registrar} • Expires {new Date(domain.expirationDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        domain.verified ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm">
                        {domain.verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className={`h-4 w-4 ${
                        domain.sslStatus === 'active' ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">
                        SSL {domain.sslStatus === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wifi className={`h-4 w-4 ${
                        domain.dnsConfigured ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">
                        DNS {domain.dnsConfigured ? 'Configured' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className={`h-4 w-4 ${
                        domain.cdnEnabled ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <span className="text-sm">
                        CDN {domain.cdnEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  {/* Deployment Status */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          domain.deploymentStatus === 'live' ? 'bg-green-500' :
                          domain.deploymentStatus === 'staging' ? 'bg-yellow-500' :
                          domain.deploymentStatus === 'deploying' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`} />
                        <span className="text-sm font-medium">
                          Deployment: {domain.deploymentStatus || 'None'}
                        </span>
                      </div>
                      {domain.deploymentStatus === 'live' && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Visit
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('dns')}>
                      Configure DNS
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('ssl')}>
                      Manage SSL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setActiveTab('deployment')}>
                      Deploy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('purchase')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Purchase Domain</h3>
                  <p className="text-sm text-muted-foreground">Buy a new domain</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('dns')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-green-50 text-green-700">
                  <Wifi className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Configure DNS</h3>
                  <p className="text-sm text-muted-foreground">Manage DNS records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('ssl')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Setup SSL</h3>
                  <p className="text-sm text-muted-foreground">Secure your domain</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('deployment')}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-orange-50 text-orange-700">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Deploy Website</h3>
                  <p className="text-sm text-muted-foreground">Go live instantly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Domain Management</h1>
            <p className="text-muted-foreground mt-2">
              Purchase, configure, and deploy domains for your websites
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{domains.filter(d => d.status === 'active').length} Active</span>
            </Badge>
            <Button onClick={() => setActiveTab('purchase')}>
              <Plus className="h-4 w-4 mr-2" />
              Purchase Domain
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="purchase" className="mt-6">
            <DomainPurchase />
          </TabsContent>

          <TabsContent value="domains" className="mt-6">
            <DomainManagement />
          </TabsContent>

          <TabsContent value="dns" className="mt-6">
            <DNSManagement />
          </TabsContent>

          <TabsContent value="ssl" className="mt-6">
            <SSLManagement />
          </TabsContent>

          <TabsContent value="deployment" className="mt-6">
            <DeploymentManagement />
          </TabsContent>

          <TabsContent value="hosting" className="mt-6">
            <HostingSettings />
          </TabsContent>

          <TabsContent value="providers" className="mt-6">
            <DomainProviders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
