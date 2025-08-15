import React, { useState } from 'react';
import { useIntegrations, APIKey } from '@/contexts/IntegrationsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Key, Eye, EyeOff, Copy, Trash2, TestTube, AlertCircle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function APIKeyManagement() {
  const { apiKeys, createAPIKey, updateAPIKey, deleteAPIKey, testAPIKey } = useIntegrations();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAPIKey, setShowAPIKey] = useState<Record<string, boolean>>({});
  const [testingKey, setTestingKey] = useState<string | null>(null);

  const [newKeyData, setNewKeyData] = useState({
    service: '',
    name: '',
    apiKey: '',
    environment: 'production' as const,
    permissions: [] as string[]
  });

  const handleCreateAPIKey = () => {
    if (!newKeyData.service || !newKeyData.name || !newKeyData.apiKey) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    createAPIKey({
      ...newKeyData,
      status: 'active',
      createdBy: 'current_user@company.com'
    });

    setNewKeyData({
      service: '',
      name: '',
      apiKey: '',
      environment: 'production',
      permissions: []
    });
    setShowCreateDialog(false);

    toast({
      title: 'Success',
      description: 'API key created successfully'
    });
  };

  const handleTestAPIKey = async (keyId: string) => {
    setTestingKey(keyId);
    try {
      const success = await testAPIKey(keyId);
      toast({
        title: success ? 'Test Successful' : 'Test Failed',
        description: success ? 'API key is working correctly' : 'API key test failed',
        variant: success ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Test Error',
        description: 'Failed to test API key',
        variant: 'destructive'
      });
    } finally {
      setTestingKey(null);
    }
  };

  const handleCopyAPIKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard'
    });
  };

  const toggleShowAPIKey = (keyId: string) => {
    setShowAPIKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const getStatusIcon = (status: APIKey['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEnvironmentColor = (environment: APIKey['environment']) => {
    switch (environment) {
      case 'production':
        return 'bg-red-100 text-red-800';
      case 'sandbox':
        return 'bg-yellow-100 text-yellow-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAPIKey = (apiKey: string, show: boolean) => {
    if (show) return apiKey;
    const prefix = apiKey.substring(0, 8);
    const suffix = apiKey.substring(apiKey.length - 4);
    return `${prefix}${'*'.repeat(12)}${suffix}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">API Keys</h3>
          <p className="text-gray-600">Manage API keys for third-party integrations</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Add a new API key for integrating with third-party services
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="service">Service</Label>
                <Select value={newKeyData.service} onValueChange={(value) => setNewKeyData(prev => ({ ...prev, service: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mailchimp">Mailchimp</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="google_analytics">Google Analytics</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="zapier">Zapier</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="slack">Slack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production Mailchimp Key"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API key"
                  value={newKeyData.apiKey}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, apiKey: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select value={newKeyData.environment} onValueChange={(value: any) => setNewKeyData(prev => ({ ...prev, environment: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="sandbox">Sandbox</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateAPIKey}>
                  Create Key
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Keys Overview
          </CardTitle>
          <CardDescription>
            {apiKeys.length} API key{apiKeys.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Key className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first API key</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create API Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium capitalize">
                      {key.service.replace('_', ' ')}
                    </TableCell>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {formatAPIKey(key.apiKey, showAPIKey[key.id] || false)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleShowAPIKey(key.id)}
                        >
                          {showAPIKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyAPIKey(key.apiKey)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEnvironmentColor(key.environment)}>
                        {key.environment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(key.status)}
                        <span className="text-sm capitalize">{key.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {key.rateLimitRemaining !== undefined ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="text-sm">
                                {key.rateLimitRemaining} remaining
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Resets at {key.rateLimitReset?.toLocaleTimeString()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {key.lastUsed ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-sm">
                                {key.lastUsed.toLocaleDateString()}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              {key.lastUsed.toLocaleString()}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestAPIKey(key.id)}
                          disabled={testingKey === key.id}
                        >
                          <TestTube className="w-4 h-4" />
                          {testingKey === key.id ? 'Testing...' : 'Test'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this API key? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteAPIKey(key.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Security Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">API Key Security</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Store API keys securely and never commit them to version control</li>
                <li>• Use environment-specific keys for different stages</li>
                <li>• Regularly rotate API keys to maintain security</li>
                <li>• Monitor API key usage and set up alerts for unusual activity</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Access Control</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Grant minimum required permissions for each integration</li>
                <li>• Review and audit API key permissions regularly</li>
                <li>• Disable or delete unused API keys immediately</li>
                <li>• Use separate keys for different applications or environments</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
