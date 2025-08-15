import React, { useState } from 'react';
import { useIntegrations, Webhook } from '@/contexts/IntegrationsContext';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Webhook as WebhookIcon, 
  TestTube, 
  Copy, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Settings,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const availableEvents = [
  { id: 'user.created', name: 'User Created', description: 'Triggered when a new user is created' },
  { id: 'user.updated', name: 'User Updated', description: 'Triggered when user data is updated' },
  { id: 'user.deleted', name: 'User Deleted', description: 'Triggered when a user is deleted' },
  { id: 'order.created', name: 'Order Created', description: 'Triggered when a new order is placed' },
  { id: 'order.updated', name: 'Order Updated', description: 'Triggered when order status changes' },
  { id: 'order.cancelled', name: 'Order Cancelled', description: 'Triggered when an order is cancelled' },
  { id: 'payment.succeeded', name: 'Payment Succeeded', description: 'Triggered when payment is successful' },
  { id: 'payment.failed', name: 'Payment Failed', description: 'Triggered when payment fails' },
  { id: 'product.created', name: 'Product Created', description: 'Triggered when a new product is added' },
  { id: 'product.updated', name: 'Product Updated', description: 'Triggered when product data changes' },
  { id: 'inventory.low', name: 'Low Inventory', description: 'Triggered when inventory falls below threshold' },
  { id: 'subscription.created', name: 'Subscription Created', description: 'Triggered when a new subscription starts' },
  { id: 'subscription.cancelled', name: 'Subscription Cancelled', description: 'Triggered when subscription is cancelled' }
];

export function WebhookManagement() {
  const { webhooks, createWebhook, updateWebhook, deleteWebhook, testWebhook } = useIntegrations();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const [newWebhookData, setNewWebhookData] = useState({
    url: '',
    events: [] as string[],
    secret: '',
    headers: {} as Record<string, string>,
    status: 'active' as const,
    createdBy: 'current_user@company.com'
  });

  const [newHeader, setNewHeader] = useState({
    key: '',
    value: ''
  });

  const handleCreateWebhook = () => {
    if (!newWebhookData.url || newWebhookData.events.length === 0) {
      toast({
        title: 'Error',
        description: 'Please provide webhook URL and select at least one event',
        variant: 'destructive'
      });
      return;
    }

    // Generate secret if not provided
    const secret = newWebhookData.secret || `whsec_${Math.random().toString(36).substr(2, 32)}`;

    createWebhook({
      ...newWebhookData,
      secret
    });

    setNewWebhookData({
      url: '',
      events: [],
      secret: '',
      headers: {},
      status: 'active',
      createdBy: 'current_user@company.com'
    });
    setSelectedEvents([]);
    setShowCreateDialog(false);

    toast({
      title: 'Success',
      description: 'Webhook created successfully'
    });
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhook(webhookId);
    try {
      const success = await testWebhook(webhookId);
      toast({
        title: success ? 'Test Successful' : 'Test Failed',
        description: success 
          ? 'Webhook endpoint responded successfully' 
          : 'Webhook endpoint failed to respond or returned an error',
        variant: success ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Test Error',
        description: 'Failed to test webhook',
        variant: 'destructive'
      });
    } finally {
      setTestingWebhook(null);
    }
  };

  const handleToggleWebhook = (webhookId: string, currentStatus: Webhook['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateWebhook(webhookId, { status: newStatus });
    
    toast({
      title: 'Webhook Updated',
      description: `Webhook ${newStatus === 'active' ? 'enabled' : 'disabled'}`
    });
  };

  const copyWebhookSecret = (secret: string) => {
    navigator.clipboard.writeText(secret);
    toast({
      title: 'Copied',
      description: 'Webhook secret copied to clipboard'
    });
  };

  const addHeader = () => {
    if (!newHeader.key || !newHeader.value) {
      toast({
        title: 'Error',
        description: 'Please provide both header key and value',
        variant: 'destructive'
      });
      return;
    }

    setNewWebhookData(prev => ({
      ...prev,
      headers: {
        ...prev.headers,
        [newHeader.key]: newHeader.value
      }
    }));

    setNewHeader({ key: '', value: '' });
  };

  const removeHeader = (key: string) => {
    setNewWebhookData(prev => {
      const { [key]: removed, ...rest } = prev.headers;
      return { ...prev, headers: rest };
    });
  };

  const handleEventToggle = (eventId: string, checked: boolean) => {
    if (checked) {
      setSelectedEvents(prev => [...prev, eventId]);
      setNewWebhookData(prev => ({
        ...prev,
        events: [...prev.events, eventId]
      }));
    } else {
      setSelectedEvents(prev => prev.filter(id => id !== eventId));
      setNewWebhookData(prev => ({
        ...prev,
        events: prev.events.filter(id => id !== eventId)
      }));
    }
  };

  const getStatusIcon = (status: Webhook['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: Webhook['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Webhook Management</h3>
          <p className="text-gray-600">Configure webhooks to receive real-time event notifications</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Webhook</DialogTitle>
              <DialogDescription>
                Set up a webhook to receive event notifications
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium">Basic Configuration</h4>
                <div>
                  <Label htmlFor="url">Webhook URL</Label>
                  <Input
                    id="url"
                    placeholder="https://your-app.com/webhooks"
                    value={newWebhookData.url}
                    onChange={(e) => setNewWebhookData(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="secret">Webhook Secret (optional)</Label>
                  <Input
                    id="secret"
                    placeholder="Auto-generated if empty"
                    value={newWebhookData.secret}
                    onChange={(e) => setNewWebhookData(prev => ({ ...prev, secret: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Used to verify webhook authenticity. Will be auto-generated if not provided.
                  </p>
                </div>
              </div>

              {/* Events Selection */}
              <div className="space-y-4">
                <h4 className="font-medium">Events to Subscribe</h4>
                <div className="max-h-48 overflow-y-auto border rounded-lg p-4">
                  <div className="space-y-3">
                    {availableEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={event.id}
                          checked={selectedEvents.includes(event.id)}
                          onCheckedChange={(checked) => handleEventToggle(event.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={event.id} className="font-medium">
                            {event.name}
                          </Label>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Selected {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Custom Headers */}
              <div className="space-y-4">
                <h4 className="font-medium">Custom Headers</h4>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="headerKey">Header Key</Label>
                      <Input
                        id="headerKey"
                        placeholder="X-Custom-Header"
                        value={newHeader.key}
                        onChange={(e) => setNewHeader(prev => ({ ...prev, key: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="headerValue">Header Value</Label>
                      <Input
                        id="headerValue"
                        placeholder="header-value"
                        value={newHeader.value}
                        onChange={(e) => setNewHeader(prev => ({ ...prev, value: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button onClick={addHeader} variant="outline" size="sm">
                    Add Header
                  </Button>
                </div>
                
                {Object.keys(newWebhookData.headers).length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-2">Added Headers</h5>
                    <div className="space-y-2">
                      {Object.entries(newWebhookData.headers).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded mr-2">{key}</code>
                            <span className="text-sm text-gray-600">{value}</span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeHeader(key)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebhook}>
                Create Webhook
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <WebhookIcon className="w-5 h-5 mr-2" />
            Active Webhooks
          </CardTitle>
          <CardDescription>
            {webhooks.length} webhook{webhooks.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <WebhookIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Webhooks</h3>
              <p className="text-gray-600 mb-4">Create your first webhook to receive event notifications</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Events</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Triggered</TableHead>
                  <TableHead>Failures</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhooks.map((webhook) => (
                  <TableRow key={webhook.id}>
                    <TableCell>
                      <div>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {webhook.url}
                        </code>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Secret:</span>
                          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                            {webhook.secret.substring(0, 12)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyWebhookSecret(webhook.secret)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {webhook.events.slice(0, 2).map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                        {webhook.events.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{webhook.events.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(webhook.status)}
                        <Badge className={getStatusColor(webhook.status)}>
                          {webhook.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {webhook.lastTriggered ? (
                        <div className="text-sm">
                          <div>{webhook.lastTriggered.toLocaleDateString()}</div>
                          <div className="text-gray-500">{webhook.lastTriggered.toLocaleTimeString()}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {webhook.failureCount > 0 ? (
                          <span className="text-red-600">{webhook.failureCount} failures</span>
                        ) : (
                          <span className="text-green-600">No failures</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTestWebhook(webhook.id)}
                          disabled={testingWebhook === webhook.id}
                        >
                          <TestTube className="w-4 h-4" />
                          {testingWebhook === webhook.id ? 'Testing...' : 'Test'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleWebhook(webhook.id, webhook.status)}
                        >
                          {webhook.status === 'active' ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this webhook? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteWebhook(webhook.id)}
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

      {/* Webhook Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Webhook Format</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800">
{`{
  "event": "user.created",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "webhook_id": "wh_abc123"
}`}
              </pre>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Verification</h4>
            <p className="text-sm text-gray-600">
              Each webhook request includes a signature in the <code>X-Signature</code> header. 
              Use your webhook secret to verify the request authenticity.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-2">Retry Policy</h4>
            <p className="text-sm text-gray-600">
              Failed webhooks are retried up to 3 times with exponential backoff. 
              If all retries fail, the webhook is marked as failed and must be manually re-enabled.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
