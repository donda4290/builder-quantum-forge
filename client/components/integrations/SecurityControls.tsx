import React, { useState } from 'react';
import { useIntegrations } from '@/contexts/IntegrationsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Shield, 
  Key, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Copy, 
  RefreshCw, 
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Lock,
  Unlock,
  Plus,
  UserCheck,
  UserX
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthToken {
  id: string;
  name: string;
  token: string;
  scopes: string[];
  expiresAt?: Date;
  lastUsed?: Date;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  usageCount: number;
  ipRestrictions?: string[];
}

interface RateLimitRule {
  id: string;
  name: string;
  resource: string;
  method?: string;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  isActive: boolean;
  exemptRoles: string[];
  createdAt: Date;
}

interface SecurityEvent {
  id: string;
  type: 'rate_limit_exceeded' | 'unauthorized_access' | 'token_used' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userAgent?: string;
  ipAddress: string;
  timestamp: Date;
  userId?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

// Mock data for security features
const mockAuthTokens: AuthToken[] = [
  {
    id: '1',
    name: 'Production API Token',
    token: 'pat_live_*********************xyz',
    scopes: ['read:products', 'write:orders', 'read:analytics'],
    expiresAt: new Date('2024-12-31T23:59:59Z'),
    lastUsed: new Date('2024-01-15T10:30:00Z'),
    isActive: true,
    createdAt: new Date('2024-01-01T08:00:00Z'),
    createdBy: 'admin@company.com',
    usageCount: 1456,
    ipRestrictions: ['192.168.1.0/24', '10.0.0.0/8']
  },
  {
    id: '2',
    name: 'Mobile App Token',
    token: 'pat_app_*********************abc',
    scopes: ['read:products', 'read:orders'],
    lastUsed: new Date('2024-01-15T09:15:00Z'),
    isActive: true,
    createdAt: new Date('2024-01-10T12:00:00Z'),
    createdBy: 'developer@company.com',
    usageCount: 892
  }
];

const mockRateLimitRules: RateLimitRule[] = [
  {
    id: '1',
    name: 'API General Limit',
    resource: '/api/*',
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    isActive: true,
    exemptRoles: ['admin'],
    createdAt: new Date('2024-01-01T08:00:00Z')
  },
  {
    id: '2',
    name: 'Auth Endpoints',
    resource: '/api/auth/*',
    requestsPerMinute: 10,
    requestsPerHour: 100,
    requestsPerDay: 500,
    isActive: true,
    exemptRoles: [],
    createdAt: new Date('2024-01-01T08:00:00Z')
  }
];

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: '1',
    type: 'rate_limit_exceeded',
    severity: 'medium',
    description: 'Rate limit exceeded for /api/products endpoint',
    ipAddress: '203.0.113.1',
    timestamp: new Date('2024-01-15T10:25:00Z'),
    resource: '/api/products',
    metadata: { requests: 65, limit: 60 }
  },
  {
    id: '2',
    type: 'unauthorized_access',
    severity: 'high',
    description: 'Unauthorized access attempt with invalid token',
    ipAddress: '198.51.100.1',
    timestamp: new Date('2024-01-15T09:45:00Z'),
    resource: '/api/admin/users'
  }
];

export function SecurityControls() {
  const { getIntegrationStats } = useIntegrations();
  const { currentWorkspace } = useAuth();
  const { toast } = useToast();
  
  const [authTokens, setAuthTokens] = useState<AuthToken[]>(mockAuthTokens);
  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>(mockRateLimitRules);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  
  const [showCreateTokenDialog, setShowCreateTokenDialog] = useState(false);
  const [showCreateRuleDialog, setShowCreateRuleDialog] = useState(false);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  const [newTokenData, setNewTokenData] = useState({
    name: '',
    scopes: [] as string[],
    expiresInDays: 0,
    ipRestrictions: ''
  });

  const [newRuleData, setNewRuleData] = useState({
    name: '',
    resource: '',
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    exemptRoles: [] as string[]
  });

  const availableScopes = [
    'read:products',
    'write:products',
    'read:orders',
    'write:orders',
    'read:customers',
    'write:customers',
    'read:analytics',
    'read:integrations',
    'write:integrations',
    'admin:all'
  ];

  const availableRoles = ['admin', 'client', 'viewer', 'developer'];

  const handleCreateToken = () => {
    if (!newTokenData.name || newTokenData.scopes.length === 0) {
      toast({
        title: 'Error',
        description: 'Please provide token name and select at least one scope',
        variant: 'destructive'
      });
      return;
    }

    const newToken: AuthToken = {
      id: `token_${Date.now()}`,
      name: newTokenData.name,
      token: `pat_${Math.random().toString(36).substr(2, 32)}`,
      scopes: newTokenData.scopes,
      expiresAt: newTokenData.expiresInDays > 0 
        ? new Date(Date.now() + newTokenData.expiresInDays * 24 * 60 * 60 * 1000)
        : undefined,
      isActive: true,
      createdAt: new Date(),
      createdBy: 'current_user@company.com',
      usageCount: 0,
      ipRestrictions: newTokenData.ipRestrictions 
        ? newTokenData.ipRestrictions.split(',').map(ip => ip.trim())
        : undefined
    };

    setAuthTokens(prev => [...prev, newToken]);
    setNewTokenData({
      name: '',
      scopes: [],
      expiresInDays: 0,
      ipRestrictions: ''
    });
    setShowCreateTokenDialog(false);

    toast({
      title: 'Success',
      description: 'Authentication token created successfully'
    });
  };

  const handleCreateRule = () => {
    if (!newRuleData.name || !newRuleData.resource) {
      toast({
        title: 'Error',
        description: 'Please provide rule name and resource pattern',
        variant: 'destructive'
      });
      return;
    }

    const newRule: RateLimitRule = {
      id: `rule_${Date.now()}`,
      ...newRuleData,
      isActive: true,
      createdAt: new Date()
    };

    setRateLimitRules(prev => [...prev, newRule]);
    setNewRuleData({
      name: '',
      resource: '',
      requestsPerMinute: 60,
      requestsPerHour: 1000,
      requestsPerDay: 10000,
      exemptRoles: []
    });
    setShowCreateRuleDialog(false);

    toast({
      title: 'Success',
      description: 'Rate limit rule created successfully'
    });
  };

  const toggleTokenStatus = (tokenId: string) => {
    setAuthTokens(prev => prev.map(token =>
      token.id === tokenId ? { ...token, isActive: !token.isActive } : token
    ));
  };

  const deleteToken = (tokenId: string) => {
    setAuthTokens(prev => prev.filter(token => token.id !== tokenId));
    toast({
      title: 'Token Deleted',
      description: 'Authentication token has been deleted',
      variant: 'destructive'
    });
  };

  const regenerateToken = (tokenId: string) => {
    setAuthTokens(prev => prev.map(token =>
      token.id === tokenId ? {
        ...token,
        token: `pat_${Math.random().toString(36).substr(2, 32)}`,
        usageCount: 0,
        lastUsed: undefined
      } : token
    ));
    toast({
      title: 'Token Regenerated',
      description: 'New token has been generated. Update your applications.'
    });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Copied',
      description: 'Token copied to clipboard'
    });
  };

  const toggleShowToken = (tokenId: string) => {
    setShowTokens(prev => ({
      ...prev,
      [tokenId]: !prev[tokenId]
    }));
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRateLimitRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
    }
  };

  const getEventIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'rate_limit_exceeded':
        return <Clock className="w-4 h-4" />;
      case 'unauthorized_access':
        return <Lock className="w-4 h-4" />;
      case 'token_used':
        return <Key className="w-4 h-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatToken = (token: string, show: boolean) => {
    if (show) return token;
    const parts = token.split('_');
    if (parts.length >= 2) {
      return `${parts[0]}_${parts[1]}_${'*'.repeat(16)}${token.slice(-4)}`;
    }
    return `${'*'.repeat(token.length - 8)}${token.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Security & Access Control</h3>
          <p className="text-gray-600">Manage authentication, rate limiting, and security policies</p>
        </div>
      </div>

      <Tabs defaultValue="tokens" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tokens">Auth Tokens</TabsTrigger>
          <TabsTrigger value="rate-limits">Rate Limits</TabsTrigger>
          <TabsTrigger value="access-control">Access Control</TabsTrigger>
          <TabsTrigger value="security-events">Security Events</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Authentication Tokens</h4>
            <Dialog open={showCreateTokenDialog} onOpenChange={setShowCreateTokenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Token
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Authentication Token</DialogTitle>
                  <DialogDescription>
                    Generate a new API token for secure access
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tokenName">Token Name</Label>
                    <Input
                      id="tokenName"
                      placeholder="e.g., Production API Token"
                      value={newTokenData.name}
                      onChange={(e) => setNewTokenData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Scopes</Label>
                    <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                      {availableScopes.map(scope => (
                        <div key={scope} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={scope}
                            checked={newTokenData.scopes.includes(scope)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewTokenData(prev => ({
                                  ...prev,
                                  scopes: [...prev.scopes, scope]
                                }));
                              } else {
                                setNewTokenData(prev => ({
                                  ...prev,
                                  scopes: prev.scopes.filter(s => s !== scope)
                                }));
                              }
                            }}
                          />
                          <Label htmlFor={scope} className="text-sm">{scope}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expiresIn">Expires in (days, 0 = never)</Label>
                    <Input
                      id="expiresIn"
                      type="number"
                      value={newTokenData.expiresInDays}
                      onChange={(e) => setNewTokenData(prev => ({ ...prev, expiresInDays: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ipRestrictions">IP Restrictions (comma-separated)</Label>
                    <Input
                      id="ipRestrictions"
                      placeholder="192.168.1.0/24, 10.0.0.0/8"
                      value={newTokenData.ipRestrictions}
                      onChange={(e) => setNewTokenData(prev => ({ ...prev, ipRestrictions: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateTokenDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateToken}>
                      Create Token
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead>Scopes</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {authTokens.map((token) => (
                    <TableRow key={token.id}>
                      <TableCell className="font-medium">{token.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {formatToken(token.token, showTokens[token.id] || false)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleShowToken(token.id)}
                          >
                            {showTokens[token.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToken(token.token)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {token.scopes.slice(0, 2).map(scope => (
                            <Badge key={scope} variant="outline" className="text-xs">
                              {scope}
                            </Badge>
                          ))}
                          {token.scopes.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{token.scopes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {token.expiresAt ? (
                          <span className="text-sm">
                            {token.expiresAt.toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{token.usageCount} requests</div>
                          {token.lastUsed && (
                            <div className="text-gray-500">
                              Last: {token.lastUsed.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {token.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="text-sm">
                            {token.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTokenStatus(token.id)}
                          >
                            {token.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => regenerateToken(token.id)}
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Token</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the token. Applications using this token will lose access.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteToken(token.id)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rate-limits" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Rate Limit Rules</h4>
            <Dialog open={showCreateRuleDialog} onOpenChange={setShowCreateRuleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Rate Limit Rule</DialogTitle>
                  <DialogDescription>
                    Define rate limiting for API endpoints
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      placeholder="e.g., API General Limit"
                      value={newRuleData.name}
                      onChange={(e) => setNewRuleData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resource">Resource Pattern</Label>
                    <Input
                      id="resource"
                      placeholder="/api/products/*"
                      value={newRuleData.resource}
                      onChange={(e) => setNewRuleData(prev => ({ ...prev, resource: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="perMinute">Per Minute</Label>
                      <Input
                        id="perMinute"
                        type="number"
                        value={newRuleData.requestsPerMinute}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, requestsPerMinute: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perHour">Per Hour</Label>
                      <Input
                        id="perHour"
                        type="number"
                        value={newRuleData.requestsPerHour}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, requestsPerHour: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="perDay">Per Day</Label>
                      <Input
                        id="perDay"
                        type="number"
                        value={newRuleData.requestsPerDay}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, requestsPerDay: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateRuleDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRule}>
                      Create Rule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Exempt Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimitRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {rule.resource}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{rule.requestsPerMinute}/min</div>
                          <div>{rule.requestsPerHour}/hour</div>
                          <div>{rule.requestsPerDay}/day</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {rule.exemptRoles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {rule.exemptRoles.map(role => (
                              <Badge key={role} variant="outline" className="text-xs">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => toggleRuleStatus(rule.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access-control" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Access Control</CardTitle>
              <CardDescription>
                Configure permissions for different user roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableRoles.map(role => (
                  <div key={role} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium capitalize">{role}</h4>
                      <Badge variant="outline">{role}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableScopes.map(scope => {
                        const hasAccess = role === 'admin' || 
                          (role === 'client' && !scope.includes('admin')) ||
                          (role === 'developer' && scope.includes('read')) ||
                          (role === 'viewer' && scope.includes('read'));
                        
                        return (
                          <div key={scope} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`${role}-${scope}`}
                              checked={hasAccess}
                              readOnly
                            />
                            <Label htmlFor={`${role}-${scope}`} className="text-sm">
                              {scope}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security-events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>
                Monitor security-related activities and potential threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${getSeverityColor(event.severity)}`}>
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{event.description}</h4>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>IP: {event.ipAddress}</div>
                            <div>Time: {event.timestamp.toLocaleString()}</div>
                            {event.resource && <div>Resource: {event.resource}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
