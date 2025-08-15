import React, { useState } from 'react';
import { useIntegrations, WorkflowTrigger, WorkflowCondition, WorkflowAction } from '@/contexts/IntegrationsContext';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Zap, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Copy, 
  TestTube,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Filter,
  Send,
  Database,
  Code,
  RefreshCw,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const availableTriggers = [
  { service: 'system', event: 'user.created', name: 'User Created', description: 'When a new user registers' },
  { service: 'system', event: 'user.updated', name: 'User Updated', description: 'When user profile is updated' },
  { service: 'system', event: 'order.created', name: 'Order Created', description: 'When a new order is placed' },
  { service: 'system', event: 'order.updated', name: 'Order Updated', description: 'When order status changes' },
  { service: 'system', event: 'payment.succeeded', name: 'Payment Successful', description: 'When payment is processed successfully' },
  { service: 'system', event: 'payment.failed', name: 'Payment Failed', description: 'When payment processing fails' },
  { service: 'mailchimp', event: 'subscriber.added', name: 'Subscriber Added', description: 'When someone subscribes to mailing list' },
  { service: 'hubspot', event: 'contact.created', name: 'Contact Created', description: 'When a new contact is added to HubSpot' },
  { service: 'stripe', event: 'invoice.paid', name: 'Invoice Paid', description: 'When a Stripe invoice is paid' }
];

const conditionOperators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' }
];

const actionTypes = [
  { value: 'api_call', label: 'API Call', icon: Code },
  { value: 'email', label: 'Send Email', icon: Send },
  { value: 'webhook', label: 'Webhook', icon: Zap },
  { value: 'data_sync', label: 'Data Sync', icon: RefreshCw },
  { value: 'create_record', label: 'Create Record', icon: Database },
  { value: 'update_record', label: 'Update Record', icon: Edit }
];

export function WorkflowAutomation() {
  const { workflows, integrations, createWorkflow, updateWorkflow, deleteWorkflow, executeWorkflow } = useIntegrations();
  const { toast } = useToast();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowTrigger | null>(null);
  const [showWorkflowDetails, setShowWorkflowDetails] = useState(false);
  const [executingWorkflow, setExecutingWorkflow] = useState<string | null>(null);

  const [newWorkflowData, setNewWorkflowData] = useState({
    name: '',
    description: '',
    service: '',
    event: '',
    conditions: [] as Omit<WorkflowCondition, 'id'>[],
    actions: [] as Omit<WorkflowAction, 'id'>[],
    isActive: true,
    createdBy: 'current_user@company.com'
  });

  const [newCondition, setNewCondition] = useState({
    field: '',
    operator: 'equals' as const,
    value: '',
    logicalOperator: 'AND' as const
  });

  const [newAction, setNewAction] = useState({
    type: 'api_call' as const,
    service: '',
    endpoint: '',
    method: 'POST' as const,
    headers: '{}',
    body: '{}',
    delay: 0,
    retryAttempts: 3
  });

  const handleCreateWorkflow = () => {
    if (!newWorkflowData.name || !newWorkflowData.service || !newWorkflowData.event) {
      toast({
        title: 'Error',
        description: 'Please provide workflow name, service, and event',
        variant: 'destructive'
      });
      return;
    }

    if (newWorkflowData.actions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one action',
        variant: 'destructive'
      });
      return;
    }

    createWorkflow({
      ...newWorkflowData,
      conditions: newWorkflowData.conditions.map((cond, index) => ({
        ...cond,
        id: `cond_${index}`
      })),
      actions: newWorkflowData.actions.map((action, index) => ({
        ...action,
        id: `action_${index}`,
        headers: action.headers ? JSON.parse(action.headers) : undefined,
        body: action.body ? JSON.parse(action.body) : undefined
      }))
    });

    setNewWorkflowData({
      name: '',
      description: '',
      service: '',
      event: '',
      conditions: [],
      actions: [],
      isActive: true,
      createdBy: 'current_user@company.com'
    });
    setShowCreateDialog(false);

    toast({
      title: 'Success',
      description: 'Workflow created successfully'
    });
  };

  const addCondition = () => {
    if (!newCondition.field || !newCondition.value) {
      toast({
        title: 'Error',
        description: 'Please provide condition field and value',
        variant: 'destructive'
      });
      return;
    }

    setNewWorkflowData(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));

    setNewCondition({
      field: '',
      operator: 'equals',
      value: '',
      logicalOperator: 'AND'
    });
  };

  const removeCondition = (index: number) => {
    setNewWorkflowData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const addAction = () => {
    if (!newAction.type) {
      toast({
        title: 'Error',
        description: 'Please select an action type',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Validate JSON for headers and body
      if (newAction.headers) JSON.parse(newAction.headers);
      if (newAction.body) JSON.parse(newAction.body);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid JSON in headers or body',
        variant: 'destructive'
      });
      return;
    }

    setNewWorkflowData(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));

    setNewAction({
      type: 'api_call',
      service: '',
      endpoint: '',
      method: 'POST',
      headers: '{}',
      body: '{}',
      delay: 0,
      retryAttempts: 3
    });
  };

  const removeAction = (index: number) => {
    setNewWorkflowData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index)
    }));
  };

  const handleTestWorkflow = async (workflowId: string) => {
    setExecutingWorkflow(workflowId);
    try {
      const success = await executeWorkflow(workflowId, { test: true });
      toast({
        title: success ? 'Test Successful' : 'Test Failed',
        description: success 
          ? 'Workflow executed successfully with test data' 
          : 'Workflow execution failed',
        variant: success ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Test Error',
        description: 'Failed to execute workflow',
        variant: 'destructive'
      });
    } finally {
      setExecutingWorkflow(null);
    }
  };

  const toggleWorkflowStatus = (workflowId: string, currentStatus: boolean) => {
    updateWorkflow(workflowId, { isActive: !currentStatus });
    toast({
      title: 'Workflow Updated',
      description: `Workflow ${!currentStatus ? 'enabled' : 'disabled'}`
    });
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-gray-500" />;
  };

  const getActionIcon = (type: WorkflowAction['type']) => {
    const actionType = actionTypes.find(at => at.value === type);
    const IconComponent = actionType?.icon || Code;
    return <IconComponent className="w-4 h-4" />;
  };

  const formatExecutionStats = (workflow: WorkflowTrigger) => {
    const total = workflow.executionCount;
    const successRate = total > 0 ? (workflow.successCount / total) * 100 : 0;
    return { total, successRate };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Workflow Automation</h3>
          <p className="text-gray-600">Create automated workflows with triggers and actions</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Automation Workflow</DialogTitle>
              <DialogDescription>
                Set up automated actions triggered by specific events
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="trigger">Trigger</TabsTrigger>
                <TabsTrigger value="conditions">Conditions</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="workflowName">Workflow Name</Label>
                  <Input
                    id="workflowName"
                    placeholder="e.g., New Customer Welcome Series"
                    value={newWorkflowData.name}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="workflowDescription">Description</Label>
                  <Textarea
                    id="workflowDescription"
                    placeholder="Describe what this workflow does"
                    value={newWorkflowData.description}
                    onChange={(e) => setNewWorkflowData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="trigger" className="space-y-4">
                <div>
                  <Label>Select Trigger Event</Label>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {availableTriggers.map((trigger) => (
                      <div
                        key={`${trigger.service}-${trigger.event}`}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          newWorkflowData.service === trigger.service && newWorkflowData.event === trigger.event
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setNewWorkflowData(prev => ({
                          ...prev,
                          service: trigger.service,
                          event: trigger.event
                        }))}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Zap className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{trigger.name}</h4>
                            <p className="text-sm text-gray-600">{trigger.description}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {trigger.service}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="conditions" className="space-y-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Add Condition</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="conditionField">Field</Label>
                      <Input
                        id="conditionField"
                        placeholder="e.g., user.email"
                        value={newCondition.field}
                        onChange={(e) => setNewCondition(prev => ({ ...prev, field: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="conditionOperator">Operator</Label>
                      <Select value={newCondition.operator} onValueChange={(value: any) => setNewCondition(prev => ({ ...prev, operator: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionOperators.map(op => (
                            <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="conditionValue">Value</Label>
                      <Input
                        id="conditionValue"
                        placeholder="Value to compare"
                        value={newCondition.value}
                        onChange={(e) => setNewCondition(prev => ({ ...prev, value: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="logicalOperator">Logic</Label>
                      <Select value={newCondition.logicalOperator} onValueChange={(value: any) => setNewCondition(prev => ({ ...prev, logicalOperator: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AND">AND</SelectItem>
                          <SelectItem value="OR">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addCondition} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Condition
                  </Button>
                </div>
                
                {newWorkflowData.conditions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Conditions</h4>
                    <div className="space-y-2">
                      {newWorkflowData.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              <code className="bg-gray-100 px-1 py-0.5 rounded">{condition.field}</code>
                              {' '}{condition.operator}{' '}
                              <code className="bg-gray-100 px-1 py-0.5 rounded">{condition.value}</code>
                            </span>
                            {index < newWorkflowData.conditions.length - 1 && (
                              <Badge variant="outline" className="text-xs">{condition.logicalOperator}</Badge>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeCondition(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Add Action</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="actionType">Action Type</Label>
                      <Select value={newAction.type} onValueChange={(value: any) => setNewAction(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="actionService">Service</Label>
                      <Select value={newAction.service} onValueChange={(value) => setNewAction(prev => ({ ...prev, service: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {integrations.filter(i => i.isConnected).map(integration => (
                            <SelectItem key={integration.service} value={integration.service}>
                              {integration.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {newAction.type === 'api_call' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="endpoint">Endpoint</Label>
                          <Input
                            id="endpoint"
                            placeholder="/api/endpoint"
                            value={newAction.endpoint}
                            onChange={(e) => setNewAction(prev => ({ ...prev, endpoint: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="method">Method</Label>
                          <Select value={newAction.method} onValueChange={(value: any) => setNewAction(prev => ({ ...prev, method: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="PATCH">PATCH</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="headers">Headers (JSON)</Label>
                        <Textarea
                          id="headers"
                          placeholder='{"Content-Type": "application/json"}'
                          value={newAction.headers}
                          onChange={(e) => setNewAction(prev => ({ ...prev, headers: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="body">Body (JSON)</Label>
                        <Textarea
                          id="body"
                          placeholder='{"key": "{{trigger.data.value}}"}'
                          value={newAction.body}
                          onChange={(e) => setNewAction(prev => ({ ...prev, body: e.target.value }))}
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="delay">Delay (seconds)</Label>
                      <Input
                        id="delay"
                        type="number"
                        value={newAction.delay}
                        onChange={(e) => setNewAction(prev => ({ ...prev, delay: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="retryAttempts">Retry Attempts</Label>
                      <Input
                        id="retryAttempts"
                        type="number"
                        value={newAction.retryAttempts}
                        onChange={(e) => setNewAction(prev => ({ ...prev, retryAttempts: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={addAction} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Action
                  </Button>
                </div>
                
                {newWorkflowData.actions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="space-y-2">
                      {newWorkflowData.actions.map((action, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {getActionIcon(action.type)}
                            </div>
                            <div>
                              <div className="text-sm font-medium">{actionTypes.find(at => at.value === action.type)?.label}</div>
                              <div className="text-xs text-gray-600">
                                {action.service && `Service: ${action.service}`}
                                {action.endpoint && ` • ${action.method} ${action.endpoint}`}
                                {action.delay && action.delay > 0 && ` • Delay: ${action.delay}s`}
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateWorkflow}>
                Create Workflow
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflows List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Active Workflows
          </CardTitle>
          <CardDescription>
            {workflows.length} workflow{workflows.length !== 1 ? 's' : ''} configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workflows.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Workflows</h3>
              <p className="text-gray-600 mb-4">Create your first automation workflow</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Workflow
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead>Actions</TableHead>
                  <TableHead>Executions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((workflow) => {
                  const stats = formatExecutionStats(workflow);
                  
                  return (
                    <TableRow key={workflow.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="text-sm text-gray-600">{workflow.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {workflow.service}
                          </Badge>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">{workflow.event}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {workflow.conditions.length > 0 ? (
                            <Badge variant="outline">
                              {workflow.conditions.length} condition{workflow.conditions.length !== 1 ? 's' : ''}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">None</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <Badge variant="outline">
                            {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{stats.total} total</div>
                          <div className="text-gray-500">{stats.successRate.toFixed(1)}% success</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(workflow.isActive)}
                          <span className="text-sm">
                            {workflow.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTestWorkflow(workflow.id)}
                            disabled={executingWorkflow === workflow.id}
                          >
                            <TestTube className="w-4 h-4" />
                            {executingWorkflow === workflow.id ? 'Testing...' : 'Test'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleWorkflowStatus(workflow.id, workflow.isActive)}
                          >
                            {workflow.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedWorkflow(workflow);
                              setShowWorkflowDetails(true);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this workflow? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteWorkflow(workflow.id)}
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
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Workflow Details Dialog */}
      <Dialog open={showWorkflowDetails} onOpenChange={setShowWorkflowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedWorkflow?.name}</DialogTitle>
            <DialogDescription>
              Workflow details and execution history
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorkflow && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Trigger</Label>
                  <div className="mt-1 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{selectedWorkflow.service}</Badge>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="text-sm">{selectedWorkflow.event}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1 p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(selectedWorkflow.isActive)}
                      <span className="text-sm">
                        {selectedWorkflow.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedWorkflow.conditions.length > 0 && (
                <div>
                  <Label>Conditions</Label>
                  <div className="mt-2 space-y-2">
                    {selectedWorkflow.conditions.map((condition, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{condition.field}</code>
                            {' '}{condition.operator}{' '}
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{condition.value}</code>
                          </span>
                          {index < selectedWorkflow.conditions.length - 1 && (
                            <Badge variant="outline" className="text-xs">{condition.logicalOperator}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label>Actions</Label>
                <div className="mt-2 space-y-2">
                  {selectedWorkflow.actions.map((action, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getActionIcon(action.type)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {actionTypes.find(at => at.value === action.type)?.label}
                          </div>
                          <div className="text-xs text-gray-600">
                            {action.service && `Service: ${action.service}`}
                            {action.endpoint && ` • ${action.method} ${action.endpoint}`}
                            {action.delay && action.delay > 0 && ` • Delay: ${action.delay}s`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedWorkflow.executionCount}
                  </div>
                  <div className="text-sm text-gray-600">Total Executions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedWorkflow.successCount}
                  </div>
                  <div className="text-sm text-gray-600">Successful</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedWorkflow.failureCount}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
