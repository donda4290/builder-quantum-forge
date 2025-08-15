import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Globe, 
  Server, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Settings,
  Plus,
  BarChart3,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Monitor,
  CloudDrizzle,
  Gauge,
  RefreshCw,
  Target,
  Users,
  Timer
} from 'lucide-react';

interface Region {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  latency: number;
  users: number;
  capacity: number;
  load: number;
}

interface AutoScalingRule {
  id: string;
  name: string;
  metric: 'cpu' | 'memory' | 'requests' | 'response_time';
  threshold: number;
  action: 'scale_up' | 'scale_down';
  minInstances: number;
  maxInstances: number;
  isEnabled: boolean;
  cooldown: number;
  lastTriggered?: Date;
}

interface PerformanceMetric {
  name: string;
  current: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface CDNConfig {
  enabled: boolean;
  provider: 'cloudflare' | 'amazon' | 'google' | 'custom';
  cacheStrategy: 'aggressive' | 'moderate' | 'conservative';
  ttl: number;
  compression: boolean;
  regions: string[];
}

// Mock data
const mockRegions: Region[] = [
  {
    id: 'us-east-1',
    name: 'US East (N. Virginia)',
    code: 'USE1',
    location: 'Virginia, USA',
    status: 'active',
    latency: 12,
    users: 1250,
    capacity: 80,
    load: 65
  },
  {
    id: 'us-west-2',
    name: 'US West (Oregon)',
    code: 'USW2',
    location: 'Oregon, USA',
    status: 'active',
    latency: 28,
    users: 890,
    capacity: 60,
    load: 45
  },
  {
    id: 'eu-west-1',
    name: 'Europe (Ireland)',
    code: 'EUW1',
    location: 'Dublin, Ireland',
    status: 'active',
    latency: 15,
    users: 2100,
    capacity: 100,
    load: 78
  },
  {
    id: 'ap-southeast-1',
    name: 'Asia Pacific (Singapore)',
    code: 'APS1',
    location: 'Singapore',
    status: 'maintenance',
    latency: 45,
    users: 650,
    capacity: 40,
    load: 20
  }
];

const mockAutoScalingRules: AutoScalingRule[] = [
  {
    id: 'rule1',
    name: 'CPU High Usage',
    metric: 'cpu',
    threshold: 80,
    action: 'scale_up',
    minInstances: 2,
    maxInstances: 10,
    isEnabled: true,
    cooldown: 300,
    lastTriggered: new Date('2024-01-15T14:30:00Z')
  },
  {
    id: 'rule2',
    name: 'CPU Low Usage',
    metric: 'cpu',
    threshold: 20,
    action: 'scale_down',
    minInstances: 2,
    maxInstances: 10,
    isEnabled: true,
    cooldown: 600
  },
  {
    id: 'rule3',
    name: 'High Request Rate',
    metric: 'requests',
    threshold: 1000,
    action: 'scale_up',
    minInstances: 2,
    maxInstances: 15,
    isEnabled: true,
    cooldown: 300
  }
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  { name: 'Response Time', current: 245, target: 200, unit: 'ms', status: 'warning', trend: 'up' },
  { name: 'Throughput', current: 1250, target: 1000, unit: 'req/s', status: 'good', trend: 'up' },
  { name: 'Error Rate', current: 0.2, target: 0.1, unit: '%', status: 'warning', trend: 'stable' },
  { name: 'CPU Usage', current: 68, target: 70, unit: '%', status: 'good', trend: 'stable' },
  { name: 'Memory Usage', current: 72, target: 80, unit: '%', status: 'good', trend: 'down' },
  { name: 'Uptime', current: 99.9, target: 99.9, unit: '%', status: 'good', trend: 'stable' }
];

const mockCDNConfig: CDNConfig = {
  enabled: true,
  provider: 'cloudflare',
  cacheStrategy: 'moderate',
  ttl: 3600,
  compression: true,
  regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1']
};

export function ScalabilityManagement() {
  const [regions, setRegions] = useState<Region[]>(mockRegions);
  const [autoScalingRules, setAutoScalingRules] = useState<AutoScalingRule[]>(mockAutoScalingRules);
  const [performanceMetrics] = useState<PerformanceMetric[]>(mockPerformanceMetrics);
  const [cdnConfig, setCdnConfig] = useState<CDNConfig>(mockCDNConfig);
  const [showCreateRuleDialog, setShowCreateRuleDialog] = useState(false);

  const [newRuleData, setNewRuleData] = useState({
    name: '',
    metric: 'cpu' as const,
    threshold: 80,
    action: 'scale_up' as const,
    minInstances: 2,
    maxInstances: 10,
    cooldown: 300
  });

  const handleCreateAutoScalingRule = () => {
    if (!newRuleData.name) return;

    const newRule: AutoScalingRule = {
      id: `rule_${Date.now()}`,
      ...newRuleData,
      isEnabled: true
    };

    setAutoScalingRules(prev => [...prev, newRule]);
    setNewRuleData({
      name: '',
      metric: 'cpu',
      threshold: 80,
      action: 'scale_up',
      minInstances: 2,
      maxInstances: 10,
      cooldown: 300
    });
    setShowCreateRuleDialog(false);
  };

  const toggleAutoScalingRule = (ruleId: string) => {
    setAutoScalingRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, isEnabled: !rule.isEnabled } : rule
    ));
  };

  const updateCDNConfig = (updates: Partial<CDNConfig>) => {
    setCdnConfig(prev => ({ ...prev, ...updates }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'critical':
      case 'maintenance':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'cpu':
        return <Cpu className="w-4 h-4" />;
      case 'memory':
        return <HardDrive className="w-4 h-4" />;
      case 'requests':
        return <Activity className="w-4 h-4" />;
      case 'response_time':
        return <Timer className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Scalability & Performance</h3>
          <p className="text-gray-600">Manage auto-scaling, multi-region deployment, and performance monitoring</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auto-scaling">Auto-Scaling</TabsTrigger>
          <TabsTrigger value="regions">Multi-Region</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="cdn">CDN & Cache</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Regions</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {regions.filter(r => r.status === 'active').length}
                    </p>
                    <p className="text-sm text-gray-500">of {regions.length} total</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-green-600">
                      {regions.reduce((sum, r) => sum + r.users, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">across all regions</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(regions.reduce((sum, r) => sum + r.latency, 0) / regions.length)}ms
                    </p>
                    <p className="text-sm text-gray-500">global average</p>
                  </div>
                  <Gauge className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">System Load</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.round(regions.reduce((sum, r) => sum + r.load, 0) / regions.length)}%
                    </p>
                    <p className="text-sm text-gray-500">average load</p>
                  </div>
                  <Server className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{metric.name}</h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(metric.status)}
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold">{metric.current}</span>
                      <span className="text-sm text-gray-500">{metric.unit}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      Target: {metric.target} {metric.unit}
                    </div>
                    <Progress 
                      value={Math.min((metric.current / metric.target) * 100, 100)} 
                      className={`h-2 ${metric.status === 'good' ? '' : 'bg-red-100'}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common scalability and performance tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Zap className="w-6 h-6 mb-2" />
                  Scale Up
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <RefreshCw className="w-6 h-6 mb-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  View Metrics
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Settings className="w-6 h-6 mb-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-scaling" className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium">Auto-Scaling Rules</h4>
            <Dialog open={showCreateRuleDialog} onOpenChange={setShowCreateRuleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Auto-Scaling Rule</DialogTitle>
                  <DialogDescription>
                    Define conditions for automatic scaling
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      placeholder="e.g., High CPU Usage"
                      value={newRuleData.name}
                      onChange={(e) => setNewRuleData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="metric">Metric</Label>
                      <Select value={newRuleData.metric} onValueChange={(value: any) => setNewRuleData(prev => ({ ...prev, metric: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpu">CPU Usage</SelectItem>
                          <SelectItem value="memory">Memory Usage</SelectItem>
                          <SelectItem value="requests">Request Count</SelectItem>
                          <SelectItem value="response_time">Response Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="action">Action</Label>
                      <Select value={newRuleData.action} onValueChange={(value: any) => setNewRuleData(prev => ({ ...prev, action: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scale_up">Scale Up</SelectItem>
                          <SelectItem value="scale_down">Scale Down</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="threshold">Threshold</Label>
                    <Input
                      id="threshold"
                      type="number"
                      value={newRuleData.threshold}
                      onChange={(e) => setNewRuleData(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="minInstances">Min Instances</Label>
                      <Input
                        id="minInstances"
                        type="number"
                        value={newRuleData.minInstances}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, minInstances: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxInstances">Max Instances</Label>
                      <Input
                        id="maxInstances"
                        type="number"
                        value={newRuleData.maxInstances}
                        onChange={(e) => setNewRuleData(prev => ({ ...prev, maxInstances: parseInt(e.target.value) || 10 }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cooldown">Cooldown (seconds)</Label>
                    <Input
                      id="cooldown"
                      type="number"
                      value={newRuleData.cooldown}
                      onChange={(e) => setNewRuleData(prev => ({ ...prev, cooldown: parseInt(e.target.value) || 300 }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateRuleDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAutoScalingRule}>
                      Create Rule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {autoScalingRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{rule.name}</span>
                        {rule.isEnabled ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {rule.action === 'scale_up' ? 'Scale up' : 'Scale down'} when {rule.metric} {rule.action === 'scale_up' ? '>' : '<'} {rule.threshold}%
                      </CardDescription>
                    </div>
                    <Switch
                      checked={rule.isEnabled}
                      onCheckedChange={() => toggleAutoScalingRule(rule.id)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Metric</div>
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(rule.metric)}
                        <span className="capitalize">{rule.metric.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Threshold</div>
                      <div>{rule.threshold}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Instances</div>
                      <div>{rule.minInstances} - {rule.maxInstances}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Cooldown</div>
                      <div>{rule.cooldown}s</div>
                    </div>
                  </div>
                  
                  {rule.lastTriggered && (
                    <div className="text-sm text-gray-600 pt-2 border-t">
                      Last triggered: {rule.lastTriggered.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Auto-Scaling Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Auto-Scaling Configuration</CardTitle>
              <CardDescription>Global auto-scaling settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Auto-Scaling</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Predictive Scaling</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Weekend Scaling</Label>
                    <Switch />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Default Cooldown Period</Label>
                    <Input type="number" defaultValue="300" />
                  </div>
                  <div>
                    <Label>Health Check Grace Period</Label>
                    <Input type="number" defaultValue="300" />
                  </div>
                  <div>
                    <Label>Termination Policy</Label>
                    <Select defaultValue="oldest">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oldest">Oldest Instance</SelectItem>
                        <SelectItem value="newest">Newest Instance</SelectItem>
                        <SelectItem value="closest_to_hour">Closest to Next Instance Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Region Deployment</CardTitle>
              <CardDescription>
                Manage your global infrastructure across multiple regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {regions.map((region) => (
                  <Card key={region.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span>{region.name}</span>
                          </CardTitle>
                          <CardDescription>{region.location}</CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(region.status)}
                          <Badge className={getStatusColor(region.status)}>
                            {region.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Latency</div>
                          <div className="font-medium">{region.latency}ms</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Active Users</div>
                          <div className="font-medium">{region.users.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Capacity</div>
                          <div className="font-medium">{region.capacity}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Current Load</div>
                          <div className="font-medium">{region.load}%</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Load</span>
                          <span>{region.load}%</span>
                        </div>
                        <Progress value={region.load} className="h-2" />
                      </div>
                      
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Monitor className="w-4 h-4 mr-1" />
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Region Management */}
          <Card>
            <CardHeader>
              <CardTitle>Region Management</CardTitle>
              <CardDescription>Add or remove regions from your deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex-col">
                    <Plus className="w-6 h-6 mb-2" />
                    Add Region
                  </Button>
                  <Button variant="outline" className="h-24 flex-col">
                    <Globe className="w-6 h-6 mb-2" />
                    Load Balancer
                  </Button>
                  <Button variant="outline" className="h-24 flex-col">
                    <Target className="w-6 h-6 mb-2" />
                    Failover
                  </Button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Multi-Region Best Practices</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Deploy in regions close to your users for better performance</li>
                    <li>• Use at least 2 regions for high availability</li>
                    <li>• Configure automatic failover between regions</li>
                    <li>• Monitor cross-region latency and data replication</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Real-time Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Performance Metrics</CardTitle>
              <CardDescription>Live system performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {performanceMetrics.map((metric) => (
                  <div key={metric.name} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{metric.name}</h4>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {metric.current} {metric.unit}
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Target: {metric.target} {metric.unit}
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress 
                        value={Math.min((metric.current / metric.target) * 100, 100)} 
                        className="flex-1 mr-3"
                      />
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Optimization */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Optimization</CardTitle>
              <CardDescription>Automated and manual optimization options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Automatic Optimizations</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Query Optimization</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Image Compression</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Code Minification</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lazy Loading</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Manual Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Optimize Database
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear All Caches
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Performance Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Target className="w-4 h-4 mr-2" />
                      Run Benchmarks
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Configuration</CardTitle>
              <CardDescription>Configure alerts and monitoring thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Response Time Alert Threshold</Label>
                    <Input type="number" defaultValue="500" placeholder="milliseconds" />
                  </div>
                  <div>
                    <Label>Error Rate Alert Threshold</Label>
                    <Input type="number" defaultValue="1" placeholder="percentage" />
                  </div>
                  <div>
                    <Label>CPU Usage Alert Threshold</Label>
                    <Input type="number" defaultValue="85" placeholder="percentage" />
                  </div>
                  <div>
                    <Label>Memory Usage Alert Threshold</Label>
                    <Input type="number" defaultValue="90" placeholder="percentage" />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch defaultChecked />
                  <Label>Send email alerts for performance issues</Label>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch defaultChecked />
                  <Label>Enable automatic performance optimization</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cdn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CDN Configuration</CardTitle>
              <CardDescription>
                Content Delivery Network settings for global performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable CDN</h4>
                    <p className="text-sm text-gray-600">Accelerate content delivery globally</p>
                  </div>
                  <Switch
                    checked={cdnConfig.enabled}
                    onCheckedChange={(checked) => updateCDNConfig({ enabled: checked })}
                  />
                </div>

                {cdnConfig.enabled && (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>CDN Provider</Label>
                        <Select value={cdnConfig.provider} onValueChange={(value: any) => updateCDNConfig({ provider: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cloudflare">Cloudflare</SelectItem>
                            <SelectItem value="amazon">Amazon CloudFront</SelectItem>
                            <SelectItem value="google">Google Cloud CDN</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Cache Strategy</Label>
                        <Select value={cdnConfig.cacheStrategy} onValueChange={(value: any) => updateCDNConfig({ cacheStrategy: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="aggressive">Aggressive</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="conservative">Conservative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Cache TTL (seconds)</Label>
                        <Input
                          type="number"
                          value={cdnConfig.ttl}
                          onChange={(e) => updateCDNConfig({ ttl: parseInt(e.target.value) || 3600 })}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={cdnConfig.compression}
                          onCheckedChange={(checked) => updateCDNConfig({ compression: checked })}
                        />
                        <Label>Enable Compression</Label>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Edge Locations</h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {regions.map((region) => (
                          <div key={region.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <input
                              type="checkbox"
                              id={region.id}
                              checked={cdnConfig.regions.includes(region.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateCDNConfig({ regions: [...cdnConfig.regions, region.id] });
                                } else {
                                  updateCDNConfig({ regions: cdnConfig.regions.filter(r => r !== region.id) });
                                }
                              }}
                            />
                            <Label htmlFor={region.id} className="flex-1">
                              {region.name}
                            </Label>
                            <span className="text-xs text-gray-500">{region.latency}ms</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">CDN Performance</h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-green-600 font-medium">Cache Hit Rate</div>
                          <div className="text-green-800">94.2%</div>
                        </div>
                        <div>
                          <div className="text-green-600 font-medium">Bandwidth Saved</div>
                          <div className="text-green-800">2.3 TB</div>
                        </div>
                        <div>
                          <div className="text-green-600 font-medium">Avg Response Time</div>
                          <div className="text-green-800">45ms</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cache Management */}
          <Card>
            <CardHeader>
              <CardTitle>Cache Management</CardTitle>
              <CardDescription>Control and monitor caching across your platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Cache Controls</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear All Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CloudDrizzle className="w-4 h-4 mr-2" />
                      Purge CDN Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Clear Database Cache
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Monitor className="w-4 h-4 mr-2" />
                      Cache Analytics
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Cache Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Hit Rate</span>
                      <span className="font-medium">92.1%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Miss Rate</span>
                      <span className="font-medium">7.9%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cache Size</span>
                      <span className="font-medium">1.2 GB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Requests/Hour</span>
                      <span className="font-medium">45,231</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
