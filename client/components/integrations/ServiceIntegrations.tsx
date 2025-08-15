import React, { useState } from 'react';
import { useIntegrations, Integration } from '@/contexts/IntegrationsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Users, 
  BarChart3, 
  CreditCard, 
  Zap, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const serviceIcons = {
  email: Mail,
  crm: Users,
  analytics: BarChart3,
  payment: CreditCard,
  automation: Zap,
  other: Settings
};

const statusColors = {
  connected: 'bg-green-100 text-green-800',
  disconnected: 'bg-gray-100 text-gray-800',
  error: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

export function ServiceIntegrations() {
  const { integrations, connectIntegration, disconnectIntegration, updateIntegrationConfig, syncIntegration } = useIntegrations();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [connectionConfig, setConnectionConfig] = useState<Record<string, string>>({});
  const [syncingIntegration, setSyncingIntegration] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'email', name: 'Email Marketing', count: integrations.filter(i => i.category === 'email').length },
    { id: 'crm', name: 'CRM', count: integrations.filter(i => i.category === 'crm').length },
    { id: 'analytics', name: 'Analytics', count: integrations.filter(i => i.category === 'analytics').length },
    { id: 'payment', name: 'Payments', count: integrations.filter(i => i.category === 'payment').length },
    { id: 'automation', name: 'Automation', count: integrations.filter(i => i.category === 'automation').length }
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setConnectionConfig({});
    setShowConnectDialog(true);
  };

  const handleConnectionSubmit = () => {
    if (!selectedIntegration) return;

    connectIntegration(selectedIntegration.service, connectionConfig);
    setShowConnectDialog(false);
    setSelectedIntegration(null);
    setConnectionConfig({});

    toast({
      title: 'Integration Connected',
      description: `${selectedIntegration.displayName} has been successfully connected.`
    });
  };

  const handleDisconnect = (integration: Integration) => {
    disconnectIntegration(integration.id);
    toast({
      title: 'Integration Disconnected',
      description: `${integration.displayName} has been disconnected.`,
      variant: 'destructive'
    });
  };

  const handleSync = async (integration: Integration) => {
    setSyncingIntegration(integration.id);
    try {
      await syncIntegration(integration.id);
      toast({
        title: 'Sync Complete',
        description: `${integration.displayName} data has been synchronized.`
      });
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: `Failed to sync ${integration.displayName} data.`,
        variant: 'destructive'
      });
    } finally {
      setSyncingIntegration(null);
    }
  };

  const getStatusIcon = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getConnectionFields = (service: string) => {
    switch (service) {
      case 'mailchimp':
        return [
          { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your Mailchimp API key' },
          { key: 'server', label: 'Server Prefix', type: 'text', placeholder: 'e.g., us12' },
          { key: 'listId', label: 'Default List ID', type: 'text', placeholder: 'Your default mailing list ID' }
        ];
      case 'hubspot':
        return [
          { key: 'apiKey', label: 'Private App Token', type: 'password', placeholder: 'Enter your HubSpot private app token' },
          { key: 'portalId', label: 'Portal ID', type: 'text', placeholder: 'Your HubSpot portal ID' }
        ];
      case 'google_analytics':
        return [
          { key: 'clientId', label: 'Client ID', type: 'text', placeholder: 'Google OAuth Client ID' },
          { key: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: 'Google OAuth Client Secret' },
          { key: 'propertyId', label: 'Property ID', type: 'text', placeholder: 'GA4 Property ID' }
        ];
      case 'stripe':
        return [
          { key: 'publishableKey', label: 'Publishable Key', type: 'text', placeholder: 'pk_live_...' },
          { key: 'secretKey', label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
          { key: 'webhookSecret', label: 'Webhook Endpoint Secret', type: 'password', placeholder: 'whsec_...' }
        ];
      case 'zapier':
        return [
          { key: 'webhookUrl', label: 'Webhook URL', type: 'text', placeholder: 'Your Zapier webhook URL' }
        ];
      default:
        return [
          { key: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Enter your API key' }
        ];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Service Integrations</h3>
          <p className="text-gray-600">Connect and manage third-party services</p>
        </div>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-2">
                {category.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const IconComponent = serviceIcons[integration.category] || Settings;
          
          return (
            <Card key={integration.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.displayName}</CardTitle>
                      <CardDescription className="text-sm">
                        {integration.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(integration.status)}
                    <Badge className={statusColors[integration.status]}>
                      {integration.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {integration.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {integration.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{integration.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Last Sync */}
                {integration.isConnected && integration.lastSyncAt && (
                  <div className="text-xs text-gray-500">
                    Last synced: {integration.lastSyncAt.toLocaleString()}
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  {integration.isConnected ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration)}
                        disabled={syncingIntegration === integration.id}
                      >
                        <RefreshCw className={`w-4 h-4 mr-1 ${syncingIntegration === integration.id ? 'animate-spin' : ''}`} />
                        {syncingIntegration === integration.id ? 'Syncing...' : 'Sync'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(integration)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(integration)}
                    >
                      Connect
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connection Dialog */}
      <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect {selectedIntegration?.displayName}</DialogTitle>
            <DialogDescription>
              Configure your {selectedIntegration?.displayName} integration
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="space-y-4">
              {/* Setup Instructions */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">Setup Instructions</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {selectedIntegration.setupInstructions}
                    </p>
                  </div>
                </div>
              </div>

              {/* Configuration Fields */}
              <div className="space-y-3">
                {getConnectionFields(selectedIntegration.service).map((field) => (
                  <div key={field.key}>
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={connectionConfig[field.key] || ''}
                      onChange={(e) => setConnectionConfig(prev => ({
                        ...prev,
                        [field.key]: e.target.value
                      }))}
                    />
                  </div>
                ))}
              </div>

              {/* Required Scopes */}
              <div>
                <Label>Required Permissions</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedIntegration.requiredScopes.map((scope) => (
                    <Badge key={scope} variant="outline" className="text-xs">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnectionSubmit}>
                  Connect
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {integrations.filter(i => i.isConnected).length}
              </div>
              <div className="text-sm text-gray-600">Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {integrations.filter(i => !i.isConnected).length}
              </div>
              <div className="text-sm text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {integrations.filter(i => i.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600">Healthy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {integrations.filter(i => i.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
