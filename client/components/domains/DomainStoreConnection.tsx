import React, { useState } from 'react';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Globe, 
  Store, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Settings,
  Loader2,
  Rocket,
  Link2,
  Server,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoreProject {
  id: string;
  name: string;
  type: 'ecommerce' | 'landing' | 'blog' | 'portfolio';
  status: 'draft' | 'ready' | 'deployed';
  lastModified: Date;
  pages: number;
  products?: number;
  previewUrl: string;
}

// Mock store projects for demonstration
const mockStoreProjects: StoreProject[] = [
  {
    id: 'store-1',
    name: 'Luxury Fashion Store',
    type: 'ecommerce',
    status: 'ready',
    lastModified: new Date('2024-01-15'),
    pages: 8,
    products: 45,
    previewUrl: 'https://preview.builder.com/luxury-fashion'
  },
  {
    id: 'store-2',
    name: 'Tech Gadgets Shop',
    type: 'ecommerce',
    status: 'draft',
    lastModified: new Date('2024-01-12'),
    pages: 5,
    products: 23,
    previewUrl: 'https://preview.builder.com/tech-gadgets'
  },
  {
    id: 'store-3',
    name: 'Photography Portfolio',
    type: 'portfolio',
    status: 'ready',
    lastModified: new Date('2024-01-10'),
    pages: 6,
    previewUrl: 'https://preview.builder.com/photography'
  },
  {
    id: 'store-4',
    name: 'Coffee Shop Landing',
    type: 'landing',
    status: 'ready',
    lastModified: new Date('2024-01-08'),
    pages: 3,
    previewUrl: 'https://preview.builder.com/coffee-shop'
  }
];

export function DomainStoreConnection() {
  const { domains, deployWebsite, createEnvironment, updateDomain, setupSSL } = useDomain();
  const { toast } = useToast();
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentNotes, setDeploymentNotes] = useState('');
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const handleConnectStore = async () => {
    if (!selectedDomain || !selectedStore) return;

    setIsConnecting(true);
    try {
      const domain = domains.find(d => d.id === selectedDomain);
      const store = mockStoreProjects.find(s => s.id === selectedStore);
      
      if (!domain || !store) return;

      // Create deployment environment
      createEnvironment(selectedDomain, {
        name: `${store.name} Production`,
        type: 'production',
        url: `https://${domain.name}`,
        branch: 'main',
        lastDeployment: new Date().toISOString(),
        buildLogs: [`Connected to store: ${store.name}`]
      });

      // Update domain with connection info
      updateDomain(selectedDomain, {
        deploymentStatus: 'staging',
        dnsConfigured: true
      });

      toast({
        title: 'Store Connected Successfully!',
        description: `${store.name} is now connected to ${domain.name}. Ready for deployment.`
      });

      setShowConnectionDialog(false);
      setSelectedDomain('');
      setSelectedStore('');
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect store to domain. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDeployStore = async (domainId: string) => {
    setIsDeploying(true);
    try {
      const domain = domains.find(d => d.id === domainId);
      if (!domain) return;

      // Setup SSL first if not already active
      if (domain.sslStatus !== 'active') {
        await setupSSL(domainId, 'letsencrypt');
      }

      // Find the production environment for this domain
      const envId = `env-${Date.now()}`; // In real app, this would be retrieved
      
      // Deploy the website
      await deployWebsite(envId);

      // Update domain status
      updateDomain(domainId, {
        deploymentStatus: 'live',
        verified: true
      });

      toast({
        title: 'Deployment Successful!',
        description: `Your store is now live at https://${domain.name}`,
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`https://${domain.name}`, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Visit Site
          </Button>
        )
      });
    } catch (error) {
      toast({
        title: 'Deployment Failed',
        description: 'Failed to deploy store. Please check your configuration.',
        variant: 'destructive'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const getStoreTypeIcon = (type: string) => {
    switch (type) {
      case 'ecommerce': return <Store className="h-4 w-4" />;
      case 'landing': return <Rocket className="h-4 w-4" />;
      case 'blog': return <Globe className="h-4 w-4" />;
      case 'portfolio': return <Server className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'staging': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const connectedDomains = domains.filter(d => d.deploymentStatus !== 'none');
  const availableDomains = domains.filter(d => d.status === 'active' && d.verified);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Store Deployment</h2>
          <p className="text-muted-foreground">
            Connect and deploy your stores to purchased domains
          </p>
        </div>
        <Dialog open={showConnectionDialog} onOpenChange={setShowConnectionDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <Link2 className="h-4 w-4 mr-2" />
              Connect Store to Domain
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Store to Domain</DialogTitle>
              <DialogDescription>
                Choose a domain and store to connect for deployment
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Select Domain</Label>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a verified domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDomains.map(domain => (
                      <SelectItem key={domain.id} value={domain.id}>
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>{domain.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {domain.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="store">Select Store</Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a store to deploy" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStoreProjects.map(store => (
                      <SelectItem key={store.id} value={store.id}>
                        <div className="flex items-center space-x-2">
                          {getStoreTypeIcon(store.type)}
                          <span>{store.name}</span>
                          <Badge variant="outline" className={getStatusColor(store.status)}>
                            {store.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Deployment Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any deployment notes..."
                  value={deploymentNotes}
                  onChange={(e) => setDeploymentNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowConnectionDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConnectStore}
                  disabled={!selectedDomain || !selectedStore || isConnecting}
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect Store
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Connected Domains */}
      {connectedDomains.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Connected Domains
            </CardTitle>
            <CardDescription>
              Domains connected to your stores and ready for deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {connectedDomains.map(domain => {
                const connectedStore = mockStoreProjects.find(s => s.name.toLowerCase().includes(domain.name.split('.')[0]));
                
                return (
                  <div key={domain.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{domain.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {connectedStore ? `Connected to ${connectedStore.name}` : 'Store connection pending'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3" />
                            <span>SSL: </span>
                            <Badge variant="outline" className={
                              domain.sslStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }>
                              {domain.sslStatus}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Server className="h-3 w-3" />
                            <span>Status: </span>
                            <Badge variant="outline" className={getStatusColor(domain.deploymentStatus)}>
                              {domain.deploymentStatus}
                            </Badge>
                          </div>
                          {domain.cdnEnabled && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              CDN Enabled
                            </Badge>
                          )}
                        </div>

                        {connectedStore && (
                          <div className="bg-muted/50 rounded p-3 mt-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {getStoreTypeIcon(connectedStore.type)}
                                <span className="font-medium">{connectedStore.name}</span>
                                <Badge variant="outline">
                                  {connectedStore.type}
                                </Badge>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(connectedStore.previewUrl, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                              <span>{connectedStore.pages} pages</span>
                              {connectedStore.products && <span>{connectedStore.products} products</span>}
                              <span>Updated {connectedStore.lastModified.toLocaleDateString()}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2">
                        {domain.deploymentStatus === 'staging' && (
                          <Button
                            onClick={() => handleDeployStore(domain.id)}
                            disabled={isDeploying}
                            className="w-32"
                          >
                            {isDeploying ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deploying...
                              </>
                            ) : (
                              <>
                                <Rocket className="h-4 w-4 mr-2" />
                                Deploy Live
                              </>
                            )}
                          </Button>
                        )}
                        
                        {domain.deploymentStatus === 'live' && (
                          <Button
                            variant="outline"
                            onClick={() => window.open(`https://${domain.name}`, '_blank')}
                            className="w-32"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Site
                          </Button>
                        )}

                        <Button variant="ghost" size="sm" className="w-32">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Stores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2" />
            Available Stores
          </CardTitle>
          <CardDescription>
            Stores ready to be connected to domains and deployed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {mockStoreProjects.map(store => {
              const isConnected = connectedDomains.some(d => 
                d.name.toLowerCase().includes(store.name.toLowerCase().split(' ')[0])
              );

              return (
                <div key={store.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStoreTypeIcon(store.type)}
                      <div>
                        <h3 className="font-medium">{store.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{store.type} website</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getStatusColor(store.status)}>
                        {store.status}
                      </Badge>
                      {isConnected && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>{store.pages} pages</span>
                    {store.products && <span>{store.products} products</span>}
                    <span>Updated {store.lastModified.toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(store.previewUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Preview
                    </Button>

                    {!isConnected && store.status === 'ready' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedStore(store.id);
                          setShowConnectionDialog(true);
                        }}
                      >
                        <Link2 className="h-3 w-3 mr-1" />
                        Connect Domain
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Quick Setup Guide
          </CardTitle>
          <CardDescription>
            Follow these steps to get your store live
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Purchase a Domain</p>
                <p className="text-sm text-muted-foreground">Go to the Purchase tab to buy a domain for your store</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Connect Your Store</p>
                <p className="text-sm text-muted-foreground">Use the "Connect Store to Domain" button to link your website</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Configure & Deploy</p>
                <p className="text-sm text-muted-foreground">Set up SSL, DNS, and deploy your store with one click</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <div>
                <p className="font-medium">Go Live!</p>
                <p className="text-sm text-muted-foreground">Your store is now live and accessible to customers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
