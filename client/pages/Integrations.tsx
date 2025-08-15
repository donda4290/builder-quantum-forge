import React, { useState } from 'react';
import { useIntegrations } from '@/contexts/IntegrationsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plug, 
  Key, 
  Globe, 
  Zap, 
  Shield, 
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users
} from 'lucide-react';

// Import all the integration components
import { APIKeyManagement } from '@/components/integrations/APIKeyManagement';
import { ServiceIntegrations } from '@/components/integrations/ServiceIntegrations';
import { APIEndpoints } from '@/components/integrations/APIEndpoints';
import { WebhookManagement } from '@/components/integrations/WebhookManagement';
import { SecurityControls } from '@/components/integrations/SecurityControls';
import { WorkflowAutomation } from '@/components/integrations/WorkflowAutomation';
import { AuditLogs } from '@/components/integrations/AuditLogs';

export default function Integrations() {
  const { integrations, apiKeys, webhooks, workflows, getIntegrationStats } = useIntegrations();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = getIntegrationStats();
  const connectedIntegrations = integrations.filter(i => i.isConnected);
  const activeWorkflows = workflows.filter(w => w.isActive);
  const recentApiKeys = apiKeys.filter(k => k.status === 'active');

  const quickStats = [
    {
      title: 'Connected Services',
      value: connectedIntegrations.length,
      total: integrations.length,
      icon: Plug,
      color: 'text-purple-600'
    },
    {
      title: 'Active API Keys',
      value: recentApiKeys.length,
      total: apiKeys.length,
      icon: Key,
      color: 'text-blue-600'
    },
    {
      title: 'API Requests (24h)',
      value: stats.totalAPIRequests.toLocaleString(),
      description: `${stats.successRate.toFixed(1)}% success rate`,
      icon: Activity,
      color: 'text-green-600'
    },
    {
      title: 'Active Workflows',
      value: activeWorkflows.length,
      total: workflows.length,
      icon: Zap,
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'integration_connected',
      message: 'Mailchimp integration connected successfully',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      id: '2',
      type: 'workflow_executed',
      message: 'Customer welcome workflow executed for 12 new users',
      timestamp: new Date('2024-01-15T09:45:00Z'),
      icon: Zap,
      color: 'text-blue-500'
    },
    {
      id: '3',
      type: 'api_key_created',
      message: 'New API key created for mobile application',
      timestamp: new Date('2024-01-15T08:20:00Z'),
      icon: Key,
      color: 'text-purple-500'
    },
    {
      id: '4',
      type: 'webhook_failed',
      message: 'Webhook delivery failed for order.created event',
      timestamp: new Date('2024-01-15T07:15:00Z'),
      icon: AlertTriangle,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Integrations & Automation</h1>
          <p className="text-gray-600">
            Connect your platform with external services, manage APIs, and automate workflows
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Plug className="w-4 h-4" />
              <span>Services</span>
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="flex items-center space-x-2">
              <Key className="w-4 h-4" />
              <span>API Keys</span>
            </TabsTrigger>
            <TabsTrigger value="endpoints" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Endpoints</span>
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Webhooks</span>
            </TabsTrigger>
            <TabsTrigger value="workflows" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Workflows</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                          <div className="flex items-baseline space-x-2">
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            {stat.total && (
                              <p className="text-sm text-gray-500">/{stat.total}</p>
                            )}
                          </div>
                          {stat.description && (
                            <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                          )}
                        </div>
                        <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Integration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plug className="w-5 h-5 mr-2" />
                    Integration Status
                  </CardTitle>
                  <CardDescription>
                    Overview of connected services and their health
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrations.slice(0, 5).map((integration) => (
                      <div key={integration.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            integration.status === 'connected' ? 'bg-green-500' :
                            integration.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                          }`} />
                          <div>
                            <div className="font-medium">{integration.displayName}</div>
                            <div className="text-sm text-gray-500">{integration.category}</div>
                          </div>
                        </div>
                        <Badge variant={integration.isConnected ? 'default' : 'secondary'}>
                          {integration.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest integration and automation activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-100 ${activity.color}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.message}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm text-green-600">{stats.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Avg Response Time</span>
                      <span className="text-sm">{stats.averageResponseTime}ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Requests</span>
                      <span className="text-sm">{stats.totalAPIRequests.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Executions</span>
                      <span className="text-sm">{workflows.reduce((sum, w) => sum + w.executionCount, 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm text-green-600">
                        {workflows.length > 0 ? 
                          ((workflows.reduce((sum, w) => sum + w.successCount, 0) / 
                            workflows.reduce((sum, w) => sum + w.executionCount, 1)) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Workflows</span>
                      <span className="text-sm">{activeWorkflows.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Active Tokens</span>
                      <span className="text-sm">{recentApiKeys.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Rate Limit Hits</span>
                      <span className="text-sm text-yellow-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Failed Authentications</span>
                      <span className="text-sm text-red-600">3</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Integrations Tab */}
          <TabsContent value="services">
            <ServiceIntegrations />
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys">
            <APIKeyManagement />
          </TabsContent>

          {/* API Endpoints Tab */}
          <TabsContent value="endpoints">
            <APIEndpoints />
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <WebhookManagement />
          </TabsContent>

          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <WorkflowAutomation />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Tabs defaultValue="security-controls" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="security-controls">Security Controls</TabsTrigger>
                <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="security-controls">
                <SecurityControls />
              </TabsContent>
              <TabsContent value="audit-logs">
                <AuditLogs />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
