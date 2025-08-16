import React, { useState } from 'react';
import { useIntegrations, AuditLog } from '@/contexts/IntegrationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  User,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Copy,
  RefreshCw,
  Users,
  Lock,
  Key,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminSetting {
  id: string;
  category: 'security' | 'integrations' | 'workflows' | 'general';
  name: string;
  description: string;
  value: boolean | string | number;
  type: 'boolean' | 'string' | 'number' | 'select';
  options?: string[];
  isReadOnly?: boolean;
  requiresRestart?: boolean;
}

const mockAdminSettings: AdminSetting[] = [
  {
    id: 'require_2fa',
    category: 'security',
    name: 'Require Two-Factor Authentication',
    description: 'Force all users to enable 2FA for enhanced security',
    value: true,
    type: 'boolean'
  },
  {
    id: 'session_timeout',
    category: 'security',
    name: 'Session Timeout (minutes)',
    description: 'Automatically log out users after inactivity',
    value: 480,
    type: 'number'
  },
  {
    id: 'allowed_ip_ranges',
    category: 'security',
    name: 'Allowed IP Ranges',
    description: 'Comma-separated list of allowed IP ranges (leave empty for no restrictions)',
    value: '',
    type: 'string'
  },
  {
    id: 'max_api_rate_limit',
    category: 'integrations',
    name: 'Maximum API Rate Limit (per minute)',
    description: 'Global maximum rate limit for all API endpoints',
    value: 1000,
    type: 'number'
  },
  {
    id: 'enable_webhook_retries',
    category: 'integrations',
    name: 'Enable Webhook Retries',
    description: 'Automatically retry failed webhook deliveries',
    value: true,
    type: 'boolean'
  },
  {
    id: 'webhook_timeout',
    category: 'integrations',
    name: 'Webhook Timeout (seconds)',
    description: 'Maximum time to wait for webhook responses',
    value: 30,
    type: 'number'
  },
  {
    id: 'max_workflow_executions',
    category: 'workflows',
    name: 'Max Workflow Executions per Hour',
    description: 'Limit workflow executions to prevent abuse',
    value: 1000,
    type: 'number'
  },
  {
    id: 'workflow_error_threshold',
    category: 'workflows',
    name: 'Workflow Error Threshold (%)',
    description: 'Automatically disable workflows exceeding this error rate',
    value: 50,
    type: 'number'
  },
  {
    id: 'enable_audit_logging',
    category: 'general',
    name: 'Enable Audit Logging',
    description: 'Log all administrative actions and changes',
    value: true,
    type: 'boolean',
    isReadOnly: true
  },
  {
    id: 'log_retention_days',
    category: 'general',
    name: 'Log Retention (days)',
    description: 'Number of days to retain audit logs',
    value: 90,
    type: 'number'
  }
];

const actionColors = {
  'created': 'bg-green-100 text-green-800',
  'updated': 'bg-blue-100 text-blue-800',
  'deleted': 'bg-red-100 text-red-800',
  'connected': 'bg-purple-100 text-purple-800',
  'disconnected': 'bg-gray-100 text-gray-800',
  'tested': 'bg-yellow-100 text-yellow-800'
};

const getActionIcon = (action: string) => {
  if (action.includes('created')) return <CheckCircle className="w-4 h-4" />;
  if (action.includes('updated')) return <RefreshCw className="w-4 h-4" />;
  if (action.includes('deleted')) return <AlertTriangle className="w-4 h-4" />;
  if (action.includes('connected')) return <Globe className="w-4 h-4" />;
  if (action.includes('disconnected')) return <Lock className="w-4 h-4" />;
  if (action.includes('tested')) return <Activity className="w-4 h-4" />;
  return <Activity className="w-4 h-4" />;
};

export function AuditLogs() {
  const { auditLogs, getAuditLogs } = useIntegrations();
  const { currentUser, currentWorkspace } = useAuth();
  const { toast } = useToast();

  const [adminSettings, setAdminSettings] = useState<AdminSetting[]>(mockAdminSettings);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showLogDetails, setShowLogDetails] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    resource: '',
    action: '',
    userId: '',
    dateRange: null as [Date, Date] | null
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const filteredLogs = React.useMemo(() => {
    let filtered = auditLogs;

    if (filters.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource);
    }

    if (filters.action) {
      filtered = filtered.filter(log => log.action.includes(filters.action));
    }

    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(log => 
        log.timestamp >= start && log.timestamp <= end
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(query) ||
        log.resource.toLowerCase().includes(query) ||
        log.userEmail.toLowerCase().includes(query) ||
        (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [auditLogs, filters, searchQuery]);

  const uniqueResources = [...new Set(auditLogs.map(log => log.resource))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action.split('.')[1] || log.action))];
  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.userId, email: log.userEmail })))];

  const handleUpdateSetting = (settingId: string, newValue: any) => {
    setAdminSettings(prev => prev.map(setting =>
      setting.id === settingId ? { ...setting, value: newValue } : setting
    ));

    toast({
      title: 'Setting Updated',
      description: 'The setting has been updated successfully'
    });
  };

  const handleExportLogs = () => {
    const csvData = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      action: log.action,
      resource: log.resource,
      user: log.userEmail,
      ip_address: log.ipAddress,
      metadata: JSON.stringify(log.metadata || {})
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Audit logs have been exported to CSV'
    });
  };

  const getActionColor = (action: string) => {
    for (const [key, color] of Object.entries(actionColors)) {
      if (action.includes(key)) return color;
    }
    return 'bg-gray-100 text-gray-800';
  };

  const copyLogDetails = (log: AuditLog) => {
    const details = {
      id: log.id,
      timestamp: log.timestamp.toISOString(),
      action: log.action,
      resource: log.resource,
      user: log.userEmail,
      ip: log.ipAddress,
      metadata: log.metadata
    };

    navigator.clipboard.writeText(JSON.stringify(details, null, 2));
    toast({
      title: 'Copied',
      description: 'Log details copied to clipboard'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Audit Logs & Admin Controls</h3>
          <p className="text-gray-600">Monitor system activities and manage platform settings</p>
        </div>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="admin-settings">Admin Settings</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="resource">Resource</Label>
                  <Select value={filters.resource} onValueChange={(value) => setFilters(prev => ({ ...prev, resource: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All resources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All resources</SelectItem>
                      {uniqueResources.map(resource => (
                        <SelectItem key={resource} value={resource}>{resource}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="action">Action</Label>
                  <Select value={filters.action} onValueChange={(value) => setFilters(prev => ({ ...prev, action: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All actions</SelectItem>
                      {uniqueActions.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="user">User</Label>
                  <Select value={filters.userId} onValueChange={(value) => setFilters(prev => ({ ...prev, userId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      {uniqueUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.email}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                    />
                  </PopoverContent>
                </Popover>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilters({ resource: '', action: '', userId: '', dateRange: null });
                      setSearchQuery('');
                      setSelectedDate(undefined);
                    }}
                  >
                    Clear Filters
                  </Button>
                  <Button onClick={handleExportLogs}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Audit Logs
              </CardTitle>
              <CardDescription>
                {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(log.timestamp, 'PPP')}</div>
                          <div className="text-gray-500">{format(log.timestamp, 'pp')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <Badge className={getActionColor(log.action)}>
                            {log.action}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {log.resource}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{log.userEmail}</div>
                          <div className="text-gray-500">{log.userId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {log.ipAddress}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLog(log);
                              setShowLogDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLogDetails(log)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin-settings" className="space-y-6">
          {/* Admin Settings */}
          {['security', 'integrations', 'workflows', 'general'].map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center capitalize">
                  <Settings className="w-5 h-5 mr-2" />
                  {category} Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminSettings.filter(setting => setting.category === category).map(setting => (
                    <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{setting.name}</h4>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                        {setting.requiresRestart && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Requires restart
                          </Badge>
                        )}
                      </div>
                      <div className="ml-4">
                        {setting.type === 'boolean' ? (
                          <Switch
                            checked={setting.value as boolean}
                            onCheckedChange={(checked) => handleUpdateSetting(setting.id, checked)}
                            disabled={setting.isReadOnly}
                          />
                        ) : setting.type === 'number' ? (
                          <Input
                            type="number"
                            value={setting.value as number}
                            onChange={(e) => handleUpdateSetting(setting.id, parseInt(e.target.value) || 0)}
                            className="w-24"
                            disabled={setting.isReadOnly}
                          />
                        ) : setting.type === 'select' && setting.options ? (
                          <Select 
                            value={setting.value as string} 
                            onValueChange={(value) => handleUpdateSetting(setting.id, value)}
                            disabled={setting.isReadOnly}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {setting.options.map(option => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={setting.value as string}
                            onChange={(e) => handleUpdateSetting(setting.id, e.target.value)}
                            className="w-48"
                            disabled={setting.isReadOnly}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="system-health" className="space-y-6">
          {/* System Health Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {currentWorkspace?.members?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Current workspace</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">API Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">2,456</div>
                <div className="text-sm text-gray-600">Last 24 hours</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Workflow Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Last 24 hours</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
                <div className="text-sm text-gray-600">All systems operational</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent System Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{log.action.replace('_', ' ').replace('.', ' ')}</div>
                      <div className="text-sm text-gray-600">
                        {log.userEmail} • {format(log.timestamp, 'PPp')}
                      </div>
                    </div>
                    <Badge variant="outline">{log.resource}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Details Dialog */}
      <Dialog open={showLogDetails} onOpenChange={setShowLogDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this audit log entry
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Timestamp</Label>
                  <div className="text-sm mt-1">
                    {format(selectedLog.timestamp, 'PPP pp')}
                  </div>
                </div>
                <div>
                  <Label>Action</Label>
                  <div className="mt-1">
                    <Badge className={getActionColor(selectedLog.action)}>
                      {selectedLog.action}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Resource</Label>
                  <div className="mt-1">
                    <Badge variant="outline">{selectedLog.resource}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Resource ID</Label>
                  <div className="text-sm mt-1">{selectedLog.resourceId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User</Label>
                  <div className="text-sm mt-1">
                    <div className="font-medium">{selectedLog.userEmail}</div>
                    <div className="text-gray-500">{selectedLog.userId}</div>
                  </div>
                </div>
                <div>
                  <Label>IP Address</Label>
                  <div className="text-sm mt-1">
                    <code className="bg-gray-100 px-2 py-1 rounded">
                      {selectedLog.ipAddress}
                    </code>
                  </div>
                </div>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <Label>User Agent</Label>
                  <div className="text-sm mt-1 break-all">
                    {selectedLog.userAgent}
                  </div>
                </div>
              )}

              {selectedLog.changes && (
                <div>
                  <Label>Changes</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.changes, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {selectedLog.metadata && (
                <div>
                  <Label>Metadata</Label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
