import React, { createContext, useContext, useState } from 'react';

// Types for API integrations
export interface APIKey {
  id: string;
  service: string;
  name: string;
  apiKey: string;
  environment: 'production' | 'sandbox' | 'development';
  status: 'active' | 'inactive' | 'error';
  lastUsed?: Date;
  createdAt: Date;
  createdBy: string;
  permissions: string[];
  rateLimitRemaining?: number;
  rateLimitReset?: Date;
}

export interface Integration {
  id: string;
  service: string;
  displayName: string;
  description: string;
  category: 'email' | 'crm' | 'analytics' | 'payment' | 'social' | 'automation' | 'other';
  isConnected: boolean;
  config: Record<string, any>;
  apiKeys: APIKey[];
  webhooks: Webhook[];
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastSyncAt?: Date;
  features: string[];
  requiredScopes: string[];
  setupInstructions: string;
  supportedEvents: string[];
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'failed';
  secret: string;
  headers: Record<string, string>;
  lastTriggered?: Date;
  failureCount: number;
  retryCount: number;
  createdAt: Date;
  createdBy: string;
}

export interface WorkflowTrigger {
  id: string;
  name: string;
  description: string;
  service: string;
  event: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
  lastExecuted?: Date;
  executionCount: number;
  successCount: number;
  failureCount: number;
  createdAt: Date;
  createdBy: string;
}

export interface WorkflowCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'starts_with' | 'ends_with';
  value: string;
  logicalOperator?: 'AND' | 'OR';
}

export interface WorkflowAction {
  id: string;
  type: 'api_call' | 'email' | 'webhook' | 'data_sync' | 'create_record' | 'update_record';
  service?: string;
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: Record<string, any>;
  delay?: number;
  retryAttempts?: number;
}

export interface APIEndpoint {
  id: string;
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  description: string;
  isPublic: boolean;
  requiresAuth: boolean;
  allowedRoles: string[];
  rateLimitPerMinute: number;
  rateLimitPerHour: number;
  parameters: APIParameter[];
  responseSchema: Record<string, any>;
  createdAt: Date;
  createdBy: string;
  usage: APIUsageStats;
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  validation?: string;
  defaultValue?: any;
}

export interface APIUsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastUsed?: Date;
  rateLimitHits: number;
}

export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userEmail: string;
  workspaceId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, { from: any; to: any }>;
  metadata?: Record<string, any>;
}

export interface IntegrationsContextType {
  // API Keys
  apiKeys: APIKey[];
  createAPIKey: (apiKey: Omit<APIKey, 'id' | 'createdAt'>) => void;
  updateAPIKey: (id: string, updates: Partial<APIKey>) => void;
  deleteAPIKey: (id: string) => void;
  testAPIKey: (id: string) => Promise<boolean>;

  // Integrations
  integrations: Integration[];
  connectIntegration: (service: string, config: Record<string, any>) => void;
  disconnectIntegration: (id: string) => void;
  updateIntegrationConfig: (id: string, config: Record<string, any>) => void;
  syncIntegration: (id: string) => Promise<void>;

  // Webhooks
  webhooks: Webhook[];
  createWebhook: (webhook: Omit<Webhook, 'id' | 'createdAt' | 'failureCount' | 'retryCount'>) => void;
  updateWebhook: (id: string, updates: Partial<Webhook>) => void;
  deleteWebhook: (id: string) => void;
  testWebhook: (id: string) => Promise<boolean>;

  // Workflows
  workflows: WorkflowTrigger[];
  createWorkflow: (workflow: Omit<WorkflowTrigger, 'id' | 'createdAt' | 'executionCount' | 'successCount' | 'failureCount'>) => void;
  updateWorkflow: (id: string, updates: Partial<WorkflowTrigger>) => void;
  deleteWorkflow: (id: string) => void;
  executeWorkflow: (id: string, testData?: Record<string, any>) => Promise<boolean>;

  // API Endpoints
  apiEndpoints: APIEndpoint[];
  createAPIEndpoint: (endpoint: Omit<APIEndpoint, 'id' | 'createdAt' | 'usage'>) => void;
  updateAPIEndpoint: (id: string, updates: Partial<APIEndpoint>) => void;
  deleteAPIEndpoint: (id: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getAuditLogs: (filters?: { resource?: string; userId?: string; action?: string; dateRange?: [Date, Date] }) => AuditLog[];

  // Analytics
  getIntegrationStats: () => {
    totalIntegrations: number;
    activeIntegrations: number;
    totalAPIRequests: number;
    successRate: number;
    averageResponseTime: number;
  };
}

const IntegrationsContext = createContext<IntegrationsContextType | undefined>(undefined);

// Mock data for integrations
const mockIntegrations: Integration[] = [
  {
    id: '1',
    service: 'mailchimp',
    displayName: 'Mailchimp',
    description: 'Email marketing automation platform',
    category: 'email',
    isConnected: true,
    config: { listId: 'abc123', server: 'us12' },
    apiKeys: [],
    webhooks: [],
    status: 'connected',
    lastSyncAt: new Date('2024-01-15T10:30:00Z'),
    features: ['Email Campaigns', 'Subscriber Management', 'Analytics', 'Templates'],
    requiredScopes: ['read', 'write'],
    setupInstructions: 'Go to Account > Extras > API keys to generate your API key',
    supportedEvents: ['subscriber.added', 'campaign.sent', 'list.updated']
  },
  {
    id: '2',
    service: 'hubspot',
    displayName: 'HubSpot',
    description: 'CRM and marketing automation',
    category: 'crm',
    isConnected: true,
    config: { portalId: '12345678' },
    apiKeys: [],
    webhooks: [],
    status: 'connected',
    lastSyncAt: new Date('2024-01-15T09:15:00Z'),
    features: ['Contact Management', 'Deal Tracking', 'Email Marketing', 'Analytics'],
    requiredScopes: ['contacts', 'timeline', 'forms'],
    setupInstructions: 'Create a private app in HubSpot Developer Account',
    supportedEvents: ['contact.created', 'deal.updated', 'company.created']
  },
  {
    id: '3',
    service: 'google_analytics',
    displayName: 'Google Analytics',
    description: 'Web analytics and insights',
    category: 'analytics',
    isConnected: false,
    config: {},
    apiKeys: [],
    webhooks: [],
    status: 'disconnected',
    features: ['Traffic Analytics', 'Goal Tracking', 'E-commerce Tracking', 'Real-time Data'],
    requiredScopes: ['analytics.readonly'],
    setupInstructions: 'Enable Google Analytics API and create a service account',
    supportedEvents: ['pageview', 'event', 'transaction']
  },
  {
    id: '4',
    service: 'stripe',
    displayName: 'Stripe',
    description: 'Payment processing platform',
    category: 'payment',
    isConnected: true,
    config: { mode: 'test' },
    apiKeys: [],
    webhooks: [],
    status: 'connected',
    lastSyncAt: new Date('2024-01-15T11:45:00Z'),
    features: ['Payment Processing', 'Subscription Management', 'Invoice Generation', 'Analytics'],
    requiredScopes: ['payments', 'customers'],
    setupInstructions: 'Get your API keys from Stripe Dashboard > Developers > API keys',
    supportedEvents: ['payment.succeeded', 'subscription.created', 'invoice.paid']
  },
  {
    id: '5',
    service: 'zapier',
    displayName: 'Zapier',
    description: 'Workflow automation platform',
    category: 'automation',
    isConnected: false,
    config: {},
    apiKeys: [],
    webhooks: [],
    status: 'disconnected',
    features: ['Workflow Automation', 'App Integrations', 'Triggers & Actions', 'Multi-step Zaps'],
    requiredScopes: ['read', 'write'],
    setupInstructions: 'Create a webhook URL in Zapier and configure triggers',
    supportedEvents: ['trigger.activated', 'action.completed', 'workflow.executed']
  }
];

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    service: 'mailchimp',
    name: 'Production Mailchimp Key',
    apiKey: 'mc_*********************xyz',
    environment: 'production',
    status: 'active',
    lastUsed: new Date('2024-01-15T10:30:00Z'),
    createdAt: new Date('2024-01-01T08:00:00Z'),
    createdBy: 'admin@company.com',
    permissions: ['read', 'write'],
    rateLimitRemaining: 450,
    rateLimitReset: new Date('2024-01-15T11:00:00Z')
  },
  {
    id: '2',
    service: 'hubspot',
    name: 'HubSpot Private App',
    apiKey: 'hs_*********************abc',
    environment: 'production',
    status: 'active',
    lastUsed: new Date('2024-01-15T09:15:00Z'),
    createdAt: new Date('2024-01-02T10:00:00Z'),
    createdBy: 'admin@company.com',
    permissions: ['contacts', 'timeline', 'forms'],
    rateLimitRemaining: 980,
    rateLimitReset: new Date('2024-01-15T10:00:00Z')
  }
];

const mockWebhooks: Webhook[] = [
  {
    id: '1',
    url: 'https://api.yourplatform.com/webhooks/mailchimp',
    events: ['subscriber.added', 'campaign.sent'],
    status: 'active',
    secret: 'whsec_*********************',
    headers: { 'X-Source': 'mailchimp' },
    lastTriggered: new Date('2024-01-15T10:25:00Z'),
    failureCount: 0,
    retryCount: 0,
    createdAt: new Date('2024-01-05T14:00:00Z'),
    createdBy: 'admin@company.com'
  }
];

const mockWorkflows: WorkflowTrigger[] = [
  {
    id: '1',
    name: 'New Customer Welcome Series',
    description: 'Automatically add new customers to welcome email sequence',
    service: 'mailchimp',
    event: 'customer.created',
    conditions: [
      {
        id: '1',
        field: 'customer.email_verified',
        operator: 'equals',
        value: 'true'
      }
    ],
    actions: [
      {
        id: '1',
        type: 'api_call',
        service: 'mailchimp',
        endpoint: '/lists/{list_id}/members',
        method: 'POST',
        body: {
          email_address: '{{customer.email}}',
          status: 'subscribed',
          merge_fields: {
            FNAME: '{{customer.first_name}}',
            LNAME: '{{customer.last_name}}'
          }
        }
      }
    ],
    isActive: true,
    lastExecuted: new Date('2024-01-15T08:30:00Z'),
    executionCount: 156,
    successCount: 152,
    failureCount: 4,
    createdAt: new Date('2024-01-01T12:00:00Z'),
    createdBy: 'admin@company.com'
  }
];

const mockAPIEndpoints: APIEndpoint[] = [
  {
    id: '1',
    name: 'Get Products',
    path: '/api/products',
    method: 'GET',
    description: 'Retrieve all products from the store',
    isPublic: true,
    requiresAuth: false,
    allowedRoles: ['admin', 'client', 'viewer'],
    rateLimitPerMinute: 60,
    rateLimitPerHour: 1000,
    parameters: [
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of products to return (max 100)',
        defaultValue: 20
      },
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Filter by product category'
      }
    ],
    responseSchema: {
      type: 'object',
      properties: {
        products: { type: 'array' },
        pagination: { type: 'object' }
      }
    },
    createdAt: new Date('2024-01-10T16:00:00Z'),
    createdBy: 'admin@company.com',
    usage: {
      totalRequests: 2456,
      successfulRequests: 2398,
      failedRequests: 58,
      averageResponseTime: 245,
      lastUsed: new Date('2024-01-15T11:30:00Z'),
      rateLimitHits: 12
    }
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    action: 'api_key.created',
    resource: 'api_key',
    resourceId: '2',
    userId: 'user1',
    userEmail: 'admin@company.com',
    workspaceId: 'ws1',
    timestamp: new Date('2024-01-15T10:00:00Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    metadata: { service: 'hubspot' }
  },
  {
    id: '2',
    action: 'integration.connected',
    resource: 'integration',
    resourceId: '1',
    userId: 'user1',
    userEmail: 'admin@company.com',
    workspaceId: 'ws1',
    timestamp: new Date('2024-01-15T09:30:00Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    metadata: { service: 'mailchimp' }
  }
];

export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [apiKeys, setAPIKeys] = useState<APIKey[]>(mockAPIKeys);
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [workflows, setWorkflows] = useState<WorkflowTrigger[]>(mockWorkflows);
  const [apiEndpoints, setAPIEndpoints] = useState<APIEndpoint[]>(mockAPIEndpoints);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // API Keys functions
  const createAPIKey = (apiKey: Omit<APIKey, 'id' | 'createdAt'>) => {
    const newAPIKey: APIKey = {
      ...apiKey,
      id: `api_${Date.now()}`,
      createdAt: new Date()
    };
    setAPIKeys(prev => [...prev, newAPIKey]);
    addAuditLog({
      action: 'api_key.created',
      resource: 'api_key',
      resourceId: newAPIKey.id,
      userId: 'current_user',
      userEmail: 'current@user.com',
      workspaceId: 'current_workspace',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      metadata: { service: apiKey.service }
    });
  };

  const updateAPIKey = (id: string, updates: Partial<APIKey>) => {
    setAPIKeys(prev => prev.map(key => 
      key.id === id ? { ...key, ...updates } : key
    ));
    addAuditLog({
      action: 'api_key.updated',
      resource: 'api_key',
      resourceId: id,
      userId: 'current_user',
      userEmail: 'current@user.com',
      workspaceId: 'current_workspace',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      changes: updates as any
    });
  };

  const deleteAPIKey = (id: string) => {
    setAPIKeys(prev => prev.filter(key => key.id !== id));
    addAuditLog({
      action: 'api_key.deleted',
      resource: 'api_key',
      resourceId: id,
      userId: 'current_user',
      userEmail: 'current@user.com',
      workspaceId: 'current_workspace',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent
    });
  };

  const testAPIKey = async (id: string): Promise<boolean> => {
    // Simulate API key testing
    await new Promise(resolve => setTimeout(resolve, 1000));
    const success = Math.random() > 0.1; // 90% success rate
    
    updateAPIKey(id, { 
      lastUsed: new Date(),
      status: success ? 'active' : 'error'
    });
    
    return success;
  };

  // Integrations functions
  const connectIntegration = (service: string, config: Record<string, any>) => {
    setIntegrations(prev => prev.map(integration =>
      integration.service === service
        ? { ...integration, isConnected: true, status: 'connected', config, lastSyncAt: new Date() }
        : integration
    ));
    addAuditLog({
      action: 'integration.connected',
      resource: 'integration',
      resourceId: service,
      userId: 'current_user',
      userEmail: 'current@user.com',
      workspaceId: 'current_workspace',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      metadata: { service, config }
    });
  };

  const disconnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id
        ? { ...integration, isConnected: false, status: 'disconnected', config: {} }
        : integration
    ));
    addAuditLog({
      action: 'integration.disconnected',
      resource: 'integration',
      resourceId: id,
      userId: 'current_user',
      userEmail: 'current@user.com',
      workspaceId: 'current_workspace',
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent
    });
  };

  const updateIntegrationConfig = (id: string, config: Record<string, any>) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id ? { ...integration, config } : integration
    ));
  };

  const syncIntegration = async (id: string): Promise<void> => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === id ? { ...integration, lastSyncAt: new Date() } : integration
    ));
  };

  // Webhooks functions
  const createWebhook = (webhook: Omit<Webhook, 'id' | 'createdAt' | 'failureCount' | 'retryCount'>) => {
    const newWebhook: Webhook = {
      ...webhook,
      id: `wh_${Date.now()}`,
      createdAt: new Date(),
      failureCount: 0,
      retryCount: 0
    };
    setWebhooks(prev => [...prev, newWebhook]);
  };

  const updateWebhook = (id: string, updates: Partial<Webhook>) => {
    setWebhooks(prev => prev.map(webhook =>
      webhook.id === id ? { ...webhook, ...updates } : webhook
    ));
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(prev => prev.filter(webhook => webhook.id !== id));
  };

  const testWebhook = async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1;
  };

  // Workflows functions
  const createWorkflow = (workflow: Omit<WorkflowTrigger, 'id' | 'createdAt' | 'executionCount' | 'successCount' | 'failureCount'>) => {
    const newWorkflow: WorkflowTrigger = {
      ...workflow,
      id: `wf_${Date.now()}`,
      createdAt: new Date(),
      executionCount: 0,
      successCount: 0,
      failureCount: 0
    };
    setWorkflows(prev => [...prev, newWorkflow]);
  };

  const updateWorkflow = (id: string, updates: Partial<WorkflowTrigger>) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === id ? { ...workflow, ...updates } : workflow
    ));
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
  };

  const executeWorkflow = async (id: string, testData?: Record<string, any>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const success = Math.random() > 0.15;
    
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === id ? {
        ...workflow,
        lastExecuted: new Date(),
        executionCount: workflow.executionCount + 1,
        successCount: success ? workflow.successCount + 1 : workflow.successCount,
        failureCount: success ? workflow.failureCount : workflow.failureCount + 1
      } : workflow
    ));
    
    return success;
  };

  // API Endpoints functions
  const createAPIEndpoint = (endpoint: Omit<APIEndpoint, 'id' | 'createdAt' | 'usage'>) => {
    const newEndpoint: APIEndpoint = {
      ...endpoint,
      id: `ep_${Date.now()}`,
      createdAt: new Date(),
      usage: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        rateLimitHits: 0
      }
    };
    setAPIEndpoints(prev => [...prev, newEndpoint]);
  };

  const updateAPIEndpoint = (id: string, updates: Partial<APIEndpoint>) => {
    setAPIEndpoints(prev => prev.map(endpoint =>
      endpoint.id === id ? { ...endpoint, ...updates } : endpoint
    ));
  };

  const deleteAPIEndpoint = (id: string) => {
    setAPIEndpoints(prev => prev.filter(endpoint => endpoint.id !== id));
  };

  // Audit logs functions
  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 999)]); // Keep last 1000 logs
  };

  const getAuditLogs = (filters?: { resource?: string; userId?: string; action?: string; dateRange?: [Date, Date] }): AuditLog[] => {
    let filtered = auditLogs;
    
    if (filters?.resource) {
      filtered = filtered.filter(log => log.resource === filters.resource);
    }
    if (filters?.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }
    if (filters?.action) {
      filtered = filtered.filter(log => log.action === filters.action);
    }
    if (filters?.dateRange) {
      const [start, end] = filters.dateRange;
      filtered = filtered.filter(log => log.timestamp >= start && log.timestamp <= end);
    }
    
    return filtered;
  };

  // Analytics functions
  const getIntegrationStats = () => {
    const totalIntegrations = integrations.length;
    const activeIntegrations = integrations.filter(i => i.isConnected).length;
    const totalAPIRequests = apiEndpoints.reduce((sum, ep) => sum + ep.usage.totalRequests, 0);
    const successfulRequests = apiEndpoints.reduce((sum, ep) => sum + ep.usage.successfulRequests, 0);
    const totalResponseTime = apiEndpoints.reduce((sum, ep) => sum + (ep.usage.averageResponseTime * ep.usage.totalRequests), 0);
    
    return {
      totalIntegrations,
      activeIntegrations,
      totalAPIRequests,
      successRate: totalAPIRequests > 0 ? (successfulRequests / totalAPIRequests) * 100 : 0,
      averageResponseTime: totalAPIRequests > 0 ? totalResponseTime / totalAPIRequests : 0
    };
  };

  const value: IntegrationsContextType = {
    // API Keys
    apiKeys,
    createAPIKey,
    updateAPIKey,
    deleteAPIKey,
    testAPIKey,

    // Integrations
    integrations,
    connectIntegration,
    disconnectIntegration,
    updateIntegrationConfig,
    syncIntegration,

    // Webhooks
    webhooks,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,

    // Workflows
    workflows,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,

    // API Endpoints
    apiEndpoints,
    createAPIEndpoint,
    updateAPIEndpoint,
    deleteAPIEndpoint,

    // Audit Logs
    auditLogs,
    addAuditLog,
    getAuditLogs,

    // Analytics
    getIntegrationStats
  };

  return (
    <IntegrationsContext.Provider value={value}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export function useIntegrations() {
  const context = useContext(IntegrationsContext);
  if (context === undefined) {
    throw new Error('useIntegrations must be used within an IntegrationsProvider');
  }
  return context;
}
