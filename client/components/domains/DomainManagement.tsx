import React, { useState } from 'react';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Globe,
  Settings,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calendar,
  ExternalLink,
  Edit,
  Trash2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DomainManagement() {
  const { domains, selectDomain, updateDomain, verifyDomain, deleteDomain } = useDomain();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<string>('');

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerifyDomain = async (domainId: string) => {
    setIsVerifying(domainId);
    try {
      await verifyDomain(domainId);
    } catch (error) {
      console.error('Domain verification failed:', error);
    } finally {
      setIsVerifying('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DomainDetailDialog = ({ domain }: { domain: any }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{domain.name}</DialogTitle>
          <DialogDescription>Domain details and configuration</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Registration Details</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Registrar:</span> {domain.registrar}</p>
                <p><span className="text-muted-foreground">Registered:</span> {new Date(domain.registrationDate).toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Expires:</span> {new Date(domain.expirationDate).toLocaleDateString()}</p>
                <p><span className="text-muted-foreground">Auto-renew:</span> {domain.autoRenew ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Status Overview</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Verified</span>
                  <Badge variant={domain.verified ? 'default' : 'secondary'}>
                    {domain.verified ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SSL Status</span>
                  <Badge variant={domain.sslStatus === 'active' ? 'default' : 'secondary'}>
                    {domain.sslStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">DNS Configured</span>
                  <Badge variant={domain.dnsConfigured ? 'default' : 'secondary'}>
                    {domain.dnsConfigured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CDN Enabled</span>
                  <Switch checked={domain.cdnEnabled} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Domain Management</h2>
          <p className="text-muted-foreground">
            Manage your registered domains and their configurations
          </p>
        </div>
        <Badge variant="outline">
          {domains.length} domain{domains.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search domains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Domains List */}
      <div className="space-y-4">
        {filteredDomains.map((domain) => (
          <Card key={domain.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium text-lg">{domain.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Expires {new Date(domain.expirationDate).toLocaleDateString()} • 
                      Registered with {domain.registrar}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(domain.status)}>
                    {domain.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">${domain.price}/{domain.currency}</p>
                    <p className="text-xs text-muted-foreground">per year</p>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <span className="text-sm">SSL {domain.sslStatus}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className={`h-4 w-4 ${
                    domain.dnsConfigured ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="text-sm">DNS {domain.dnsConfigured ? 'Ready' : 'Pending'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    domain.deploymentStatus === 'live' ? 'bg-green-500' :
                    domain.deploymentStatus === 'staging' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm capitalize">
                    {domain.deploymentStatus || 'Not deployed'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {!domain.verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleVerifyDomain(domain.id)}
                      disabled={isVerifying === domain.id}
                    >
                      {isVerifying === domain.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      Verify Domain
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure DNS
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-1" />
                    Setup SSL
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  {domain.deploymentStatus === 'live' && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://${domain.name}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visit
                      </a>
                    </Button>
                  )}
                  <DomainDetailDialog domain={domain} />
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteDomain(domain.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Auto-renewal Toggle */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Auto-renewal</p>
                    <p className="text-xs text-muted-foreground">
                      Automatically renew this domain before expiration
                    </p>
                  </div>
                  <Switch
                    checked={domain.autoRenew}
                    onCheckedChange={(checked) => 
                      updateDomain(domain.id, { autoRenew: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDomains.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">No domains found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'No domains match your search.' : 'You haven\'t registered any domains yet.'}
            </p>
            {!searchTerm && (
              <Button>
                <Globe className="h-4 w-4 mr-2" />
                Purchase Your First Domain
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
