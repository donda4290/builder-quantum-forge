import React, { useState } from 'react';
import { useDomain } from '@/contexts/DomainContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Key, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export function DomainProviders() {
  const { domainProviders, updateProvider } = useDomain();
  const [editingProvider, setEditingProvider] = useState<string>('');

  const providerInfo = {
    godaddy: {
      name: 'GoDaddy',
      description: 'World\'s largest domain registrar with comprehensive domain services',
      website: 'https://developer.godaddy.com',
      features: ['Domain Registration', 'DNS Management', 'Domain Privacy', 'Bulk Operations']
    },
    namecheap: {
      name: 'Namecheap',
      description: 'Affordable domain registration with excellent customer service',
      website: 'https://www.namecheap.com/support/api/',
      features: ['Competitive Pricing', 'Free WHOIS Guard', 'Easy Management', 'SSL Certificates']
    },
    cloudflare: {
      name: 'Cloudflare',
      description: 'Domains at cost with powerful DNS and security features',
      website: 'https://developers.cloudflare.com',
      features: ['At-cost Pricing', 'Advanced DNS', 'Security Features', 'Analytics']
    }
  };

  const handleSaveProvider = (providerId: string) => {
    setEditingProvider('');
    // In a real implementation, this would validate the API credentials
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Domain Providers</h2>
        <p className="text-muted-foreground">
          Configure API access for domain registrars and DNS providers
        </p>
      </div>

      <div className="space-y-6">
        {domainProviders.map((provider) => {
          const info = providerInfo[provider.name as keyof typeof providerInfo];
          const isEditing = editingProvider === provider.id;
          
          return (
            <Card key={provider.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{info.name}</CardTitle>
                      <CardDescription>{info.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={provider.enabled ? 'default' : 'secondary'}>
                      {provider.enabled ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Enabled
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Setup Required
                        </>
                      )}
                    </Badge>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(checked) => 
                        updateProvider(provider.id, { enabled: checked })
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {info.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">API Configuration</h4>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <a href={info.website} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          API Docs
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProvider(isEditing ? '' : provider.id)}
                      >
                        {isEditing ? 'Cancel' : 'Configure'}
                      </Button>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`${provider.id}-api-key`}>API Key</Label>
                          <Input
                            id={`${provider.id}-api-key`}
                            type="password"
                            placeholder="Enter API key"
                            defaultValue={provider.apiKey}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`${provider.id}-api-secret`}>API Secret</Label>
                          <Input
                            id={`${provider.id}-api-secret`}
                            type="password"
                            placeholder="Enter API secret"
                            defaultValue={provider.apiSecret}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={provider.testMode}
                          onCheckedChange={(checked) => 
                            updateProvider(provider.id, { testMode: checked })
                          }
                        />
                        <Label>Test Mode (Sandbox)</Label>
                      </div>

                      <div className="flex space-x-2">
                        <Button onClick={() => handleSaveProvider(provider.id)}>
                          <Key className="h-4 w-4 mr-2" />
                          Save Configuration
                        </Button>
                        <Button variant="outline" onClick={() => setEditingProvider('')}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded-lg bg-muted/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {provider.apiKey ? 'API credentials configured' : 'No API credentials configured'}
                          </span>
                        </div>
                        {provider.testMode && (
                          <Badge variant="outline" className="text-xs">
                            Test Mode
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Setup Instructions */}
                {!provider.enabled && (
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Setup Instructions
                    </h4>
                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Visit the {info.name} API documentation</li>
                      <li>Create an API key and secret in your {info.name} account</li>
                      <li>Enter the credentials in the configuration above</li>
                      <li>Enable test mode for initial testing</li>
                      <li>Enable the provider to start using it</li>
                    </ol>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
