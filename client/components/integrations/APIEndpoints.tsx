import React, { useState } from 'react';
import { useIntegrations, APIEndpoint, APIParameter } from '@/contexts/IntegrationsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Globe, 
  Lock, 
  Eye, 
  BarChart3, 
  Settings, 
  Trash2, 
  Copy, 
  TestTube,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
const parameterTypes = ['string', 'number', 'boolean', 'object', 'array'] as const;

export function APIEndpoints() {
  const { apiEndpoints, createAPIEndpoint, updateAPIEndpoint, deleteAPIEndpoint } = useIntegrations();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [showEndpointDetails, setShowEndpointDetails] = useState(false);

  const [newEndpointData, setNewEndpointData] = useState({
    name: '',
    path: '',
    method: 'GET' as const,
    description: '',
    isPublic: false,
    requiresAuth: true,
    allowedRoles: ['admin'] as string[],
    rateLimitPerMinute: 60,
    rateLimitPerHour: 1000,
    parameters: [] as Omit<APIParameter, 'name'>[],
    responseSchema: {}
  });

  const [newParameter, setNewParameter] = useState({
    name: '',
    type: 'string' as const,
    required: false,
    description: '',
    defaultValue: ''
  });

  const handleCreateEndpoint = () => {
    if (!newEndpointData.name || !newEndpointData.path) {
      toast({
        title: 'Error',
        description: 'Please provide endpoint name and path',
        variant: 'destructive'
      });
      return;
    }

    createAPIEndpoint({
      ...newEndpointData,
      createdBy: 'current_user@company.com'
    });

    setNewEndpointData({
      name: '',
      path: '',
      method: 'GET',
      description: '',
      isPublic: false,
      requiresAuth: true,
      allowedRoles: ['admin'],
      rateLimitPerMinute: 60,
      rateLimitPerHour: 1000,
      parameters: [],
      responseSchema: {}
    });
    setShowCreateDialog(false);

    toast({
      title: 'Success',
      description: 'API endpoint created successfully'
    });
  };

  const addParameter = () => {
    if (!newParameter.name) {
      toast({
        title: 'Error',
        description: 'Parameter name is required',
        variant: 'destructive'
      });
      return;
    }

    const parameter: APIParameter = {
      ...newParameter,
      defaultValue: newParameter.defaultValue || undefined
    };

    setNewEndpointData(prev => ({
      ...prev,
      parameters: [...prev.parameters, parameter]
    }));

    setNewParameter({
      name: '',
      type: 'string',
      required: false,
      description: '',
      defaultValue: ''
    });
  };

  const removeParameter = (index: number) => {
    setNewEndpointData(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  const copyEndpointURL = (endpoint: APIEndpoint) => {
    const url = `${window.location.origin}${endpoint.path}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Copied',
      description: 'Endpoint URL copied to clipboard'
    });
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PATCH':
        return 'bg-orange-100 text-orange-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">API Endpoints</h3>
          <p className="text-gray-600">Manage custom API endpoints for your platform</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Endpoint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create API Endpoint</DialogTitle>
              <DialogDescription>
                Define a new API endpoint for your platform
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="parameters">Parameters</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Endpoint Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Get Products"
                      value={newEndpointData.name}
                      onChange={(e) => setNewEndpointData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select value={newEndpointData.method} onValueChange={(value: any) => setNewEndpointData(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {httpMethods.map(method => (
                          <SelectItem key={method} value={method}>{method}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="path">API Path</Label>
                  <Input
                    id="path"
                    placeholder="/api/products"
                    value={newEndpointData.path}
                    onChange={(e) => setNewEndpointData(prev => ({ ...prev, path: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this endpoint does"
                    value={newEndpointData.description}
                    onChange={(e) => setNewEndpointData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="parameters" className="space-y-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Add Parameter</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paramName">Name</Label>
                      <Input
                        id="paramName"
                        placeholder="Parameter name"
                        value={newParameter.name}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="paramType">Type</Label>
                      <Select value={newParameter.type} onValueChange={(value: any) => setNewParameter(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {parameterTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="paramDescription">Description</Label>
                    <Input
                      id="paramDescription"
                      placeholder="Parameter description"
                      value={newParameter.description}
                      onChange={(e) => setNewParameter(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newParameter.required}
                        onCheckedChange={(checked) => setNewParameter(prev => ({ ...prev, required: checked }))}
                      />
                      <Label>Required</Label>
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="defaultValue">Default Value</Label>
                      <Input
                        id="defaultValue"
                        placeholder="Default value (optional)"
                        value={newParameter.defaultValue}
                        onChange={(e) => setNewParameter(prev => ({ ...prev, defaultValue: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={addParameter} variant="outline" size="sm">
                    Add Parameter
                  </Button>
                </div>
                
                {newEndpointData.parameters.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Parameters</h4>
                    <div className="space-y-2">
                      {newEndpointData.parameters.map((param, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="flex items-center space-x-2">
                              <code className="text-sm bg-gray-100 px-2 py-1 rounded">{param.name}</code>
                              <Badge variant="outline">{param.type}</Badge>
                              {param.required && <Badge variant="secondary">Required</Badge>}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{param.description}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeParameter(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newEndpointData.isPublic}
                      onCheckedChange={(checked) => setNewEndpointData(prev => ({ ...prev, isPublic: checked }))}
                    />
                    <Label>Public Endpoint</Label>
                    <span className="text-sm text-gray-500">(No authentication required)</span>
                  </div>
                  
                  {!newEndpointData.isPublic && (
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newEndpointData.requiresAuth}
                        onCheckedChange={(checked) => setNewEndpointData(prev => ({ ...prev, requiresAuth: checked }))}
                      />
                      <Label>Requires Authentication</Label>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rateLimitMinute">Rate Limit (per minute)</Label>
                      <Input
                        id="rateLimitMinute"
                        type="number"
                        value={newEndpointData.rateLimitPerMinute}
                        onChange={(e) => setNewEndpointData(prev => ({ ...prev, rateLimitPerMinute: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rateLimitHour">Rate Limit (per hour)</Label>
                      <Input
                        id="rateLimitHour"
                        type="number"
                        value={newEndpointData.rateLimitPerHour}
                        onChange={(e) => setNewEndpointData(prev => ({ ...prev, rateLimitPerHour: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEndpoint}>
                Create Endpoint
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Endpoints List */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>
            {apiEndpoints.length} endpoint{apiEndpoints.length !== 1 ? 's' : ''} defined
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiEndpoints.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API Endpoints</h3>
              <p className="text-gray-600 mb-4">Create your first custom API endpoint</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Endpoint
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Access</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiEndpoints.map((endpoint) => (
                  <TableRow key={endpoint.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{endpoint.name}</div>
                        <code className="text-sm text-gray-600">{endpoint.path}</code>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getMethodColor(endpoint.method)}>
                        {endpoint.method}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {endpoint.isPublic ? (
                          <Globe className="w-4 h-4 text-green-500" />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className="text-sm">
                          {endpoint.isPublic ? 'Public' : 'Protected'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{endpoint.rateLimitPerMinute}/min</div>
                        <div className="text-gray-500">{endpoint.rateLimitPerHour}/hour</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{endpoint.usage.totalRequests} requests</div>
                        <div className="text-gray-500">
                          {endpoint.usage.successRate?.toFixed(1)}% success rate
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEndpoint(endpoint);
                            setShowEndpointDetails(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyEndpointURL(endpoint)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAPIEndpoint(endpoint.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Endpoint Details Dialog */}
      <Dialog open={showEndpointDetails} onOpenChange={setShowEndpointDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedEndpoint?.name}</DialogTitle>
            <DialogDescription>
              API endpoint details and documentation
            </DialogDescription>
          </DialogHeader>
          
          {selectedEndpoint && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Method & Path</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getMethodColor(selectedEndpoint.method)}>
                      {selectedEndpoint.method}
                    </Badge>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {selectedEndpoint.path}
                    </code>
                  </div>
                </div>
                <div>
                  <Label>Access Control</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    {selectedEndpoint.isPublic ? (
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Protected</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-sm text-gray-600 mt-1">{selectedEndpoint.description}</p>
              </div>
              
              {selectedEndpoint.parameters.length > 0 && (
                <div>
                  <Label>Parameters</Label>
                  <div className="mt-2 space-y-2">
                    {selectedEndpoint.parameters.map((param, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{param.name}</code>
                          <Badge variant="outline">{param.type}</Badge>
                          {param.required && <Badge variant="secondary">Required</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{param.description}</p>
                        {param.defaultValue && (
                          <p className="text-xs text-gray-500">Default: {param.defaultValue}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedEndpoint.usage.totalRequests}
                  </div>
                  <div className="text-sm text-gray-600">Total Requests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {((selectedEndpoint.usage.successfulRequests / selectedEndpoint.usage.totalRequests) * 100 || 0).toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedEndpoint.usage.averageResponseTime}ms
                  </div>
                  <div className="text-sm text-gray-600">Avg Response</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
