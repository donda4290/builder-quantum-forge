import React, { createContext, useContext, useState } from 'react';

// Types for User Management
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'builder' | 'ecommerce' | 'domains' | 'integrations' | 'billing' | 'admin';
  action: string;
  resource: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInvitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  message?: string;
  permissions?: string[];
}

export interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  joinedAt: Date;
  permissions: string[];
  activityLevel: 'high' | 'medium' | 'low';
  totalLogins: number;
  totalTimeSpent: number; // in minutes
}

export interface ActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  location?: string;
  sessionId: string;
}

export interface SecuritySetting {
  id: string;
  name: string;
  description: string;
  type: 'boolean' | 'string' | 'number' | 'select';
  value: any;
  category: 'authentication' | 'data' | 'access' | 'monitoring';
  isEnforced: boolean;
  options?: string[];
}

export interface UserManagementContextType {
  // Users & Teams
  teamMembers: TeamMember[];
  invitations: UserInvitation[];
  roles: Role[];
  permissions: Permission[];
  
  // User Management
  inviteUser: (email: string, role: string, message?: string, customPermissions?: string[]) => void;
  updateUserRole: (userId: string, roleId: string) => void;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
  suspendUser: (userId: string, reason: string) => void;
  reactivateUser: (userId: string) => void;
  removeUser: (userId: string) => void;
  
  // Role Management
  createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRole: (roleId: string, updates: Partial<Role>) => void;
  deleteRole: (roleId: string) => void;
  
  // Invitation Management
  cancelInvitation: (invitationId: string) => void;
  resendInvitation: (invitationId: string) => void;
  acceptInvitation: (invitationId: string, userData: { firstName: string; lastName: string; password: string }) => void;
  
  // Activity Monitoring
  activityLogs: ActivityLog[];
  getUserActivity: (userId: string, dateRange?: [Date, Date]) => ActivityLog[];
  getTeamActivity: (timeframe: 'day' | 'week' | 'month') => ActivityLog[];
  
  // Security Settings
  securitySettings: SecuritySetting[];
  updateSecuritySetting: (settingId: string, value: any) => void;
  
  // Analytics
  getUserStats: () => {
    totalUsers: number;
    activeUsers: number;
    pendingInvitations: number;
    totalSessions: number;
    averageSessionTime: number;
  };
}

// Default permissions system
const defaultPermissions: Permission[] = [
  // General
  { id: 'view_dashboard', name: 'View Dashboard', description: 'Access main dashboard', category: 'general', action: 'read', resource: 'dashboard' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Access analytics and reports', category: 'general', action: 'read', resource: 'analytics' },
  
  // Builder
  { id: 'create_pages', name: 'Create Pages', description: 'Create new pages and templates', category: 'builder', action: 'create', resource: 'pages' },
  { id: 'edit_pages', name: 'Edit Pages', description: 'Modify existing pages', category: 'builder', action: 'update', resource: 'pages' },
  { id: 'delete_pages', name: 'Delete Pages', description: 'Remove pages and templates', category: 'builder', action: 'delete', resource: 'pages' },
  { id: 'manage_themes', name: 'Manage Themes', description: 'Customize themes and styling', category: 'builder', action: 'manage', resource: 'themes' },
  
  // E-commerce
  { id: 'manage_products', name: 'Manage Products', description: 'Create, edit, and delete products', category: 'ecommerce', action: 'manage', resource: 'products' },
  { id: 'manage_orders', name: 'Manage Orders', description: 'View and process orders', category: 'ecommerce', action: 'manage', resource: 'orders' },
  { id: 'manage_customers', name: 'Manage Customers', description: 'Handle customer accounts and data', category: 'ecommerce', action: 'manage', resource: 'customers' },
  { id: 'view_reports', name: 'View Reports', description: 'Access sales and performance reports', category: 'ecommerce', action: 'read', resource: 'reports' },
  
  // Domains
  { id: 'manage_domains', name: 'Manage Domains', description: 'Purchase and configure domains', category: 'domains', action: 'manage', resource: 'domains' },
  { id: 'manage_dns', name: 'Manage DNS', description: 'Configure DNS settings', category: 'domains', action: 'manage', resource: 'dns' },
  { id: 'manage_ssl', name: 'Manage SSL', description: 'Handle SSL certificates', category: 'domains', action: 'manage', resource: 'ssl' },
  
  // Integrations
  { id: 'manage_integrations', name: 'Manage Integrations', description: 'Configure third-party integrations', category: 'integrations', action: 'manage', resource: 'integrations' },
  { id: 'manage_apis', name: 'Manage APIs', description: 'Handle API keys and endpoints', category: 'integrations', action: 'manage', resource: 'apis' },
  { id: 'manage_webhooks', name: 'Manage Webhooks', description: 'Configure webhook endpoints', category: 'integrations', action: 'manage', resource: 'webhooks' },
  
  // Billing
  { id: 'view_billing', name: 'View Billing', description: 'Access billing information', category: 'billing', action: 'read', resource: 'billing' },
  { id: 'manage_billing', name: 'Manage Billing', description: 'Modify billing and subscription', category: 'billing', action: 'manage', resource: 'billing' },
  
  // Admin
  { id: 'manage_users', name: 'Manage Users', description: 'Invite, edit, and remove users', category: 'admin', action: 'manage', resource: 'users' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Create and modify user roles', category: 'admin', action: 'manage', resource: 'roles' },
  { id: 'view_audit_logs', name: 'View Audit Logs', description: 'Access system audit logs', category: 'admin', action: 'read', resource: 'audit_logs' },
  { id: 'manage_security', name: 'Manage Security', description: 'Configure security settings', category: 'admin', action: 'manage', resource: 'security' }
];

// Default roles
const defaultRoles: Role[] = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to all features and settings',
    permissions: defaultPermissions.map(p => p.id),
    isSystem: true,
    color: 'bg-red-100 text-red-800',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full access except billing and user management',
    permissions: defaultPermissions.filter(p => !['manage_billing', 'manage_users', 'manage_roles'].includes(p.id)).map(p => p.id),
    isSystem: true,
    color: 'bg-purple-100 text-purple-800',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'editor',
    name: 'Editor',
    description: 'Can build pages and manage content',
    permissions: [
      'view_dashboard', 'view_analytics', 'create_pages', 'edit_pages', 'manage_themes',
      'manage_products', 'view_reports', 'manage_integrations'
    ],
    isSystem: true,
    color: 'bg-blue-100 text-blue-800',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to most features',
    permissions: ['view_dashboard', 'view_analytics', 'view_reports'],
    isSystem: true,
    color: 'bg-gray-100 text-gray-800',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: 'user1',
    email: 'admin@company.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'owner',
    status: 'active',
    lastLoginAt: new Date('2024-01-15T10:30:00Z'),
    joinedAt: new Date('2024-01-01T08:00:00Z'),
    permissions: defaultPermissions.map(p => p.id),
    activityLevel: 'high',
    totalLogins: 245,
    totalTimeSpent: 18500
  },
  {
    id: 'user2',
    email: 'sarah@company.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'admin',
    status: 'active',
    lastLoginAt: new Date('2024-01-15T09:15:00Z'),
    joinedAt: new Date('2024-01-05T10:00:00Z'),
    permissions: defaultPermissions.filter(p => !['manage_billing', 'manage_users'].includes(p.id)).map(p => p.id),
    activityLevel: 'high',
    totalLogins: 156,
    totalTimeSpent: 12300
  },
  {
    id: 'user3',
    email: 'mike@company.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'editor',
    status: 'active',
    lastLoginAt: new Date('2024-01-14T16:45:00Z'),
    joinedAt: new Date('2024-01-08T14:00:00Z'),
    permissions: ['view_dashboard', 'create_pages', 'edit_pages', 'manage_products'],
    activityLevel: 'medium',
    totalLogins: 89,
    totalTimeSpent: 7800
  }
];

const mockInvitations: UserInvitation[] = [
  {
    id: 'inv1',
    email: 'alex@company.com',
    role: 'editor',
    status: 'pending',
    invitedBy: 'admin@company.com',
    invitedAt: new Date('2024-01-12T14:30:00Z'),
    expiresAt: new Date('2024-01-19T14:30:00Z'),
    message: 'Welcome to the team! You\'ll be helping with content creation.'
  },
  {
    id: 'inv2',
    email: 'jennifer@company.com',
    role: 'viewer',
    status: 'pending',
    invitedBy: 'admin@company.com',
    invitedAt: new Date('2024-01-14T10:00:00Z'),
    expiresAt: new Date('2024-01-21T10:00:00Z')
  }
];

const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log1',
    userId: 'user1',
    userEmail: 'admin@company.com',
    action: 'user.login',
    resource: 'authentication',
    details: 'User logged in successfully',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    location: 'New York, US',
    sessionId: 'sess_123'
  },
  {
    id: 'log2',
    userId: 'user2',
    userEmail: 'sarah@company.com',
    action: 'product.created',
    resource: 'products',
    resourceId: 'prod_456',
    details: 'Created new product: Premium T-Shirt',
    timestamp: new Date('2024-01-15T09:45:00Z'),
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0...',
    location: 'Los Angeles, US',
    sessionId: 'sess_456'
  }
];

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: 'enforce_2fa',
    name: 'Enforce Two-Factor Authentication',
    description: 'Require all users to enable 2FA',
    type: 'boolean',
    value: true,
    category: 'authentication',
    isEnforced: true
  },
  {
    id: 'session_timeout',
    name: 'Session Timeout (minutes)',
    description: 'Automatically log out inactive users',
    type: 'number',
    value: 480,
    category: 'authentication',
    isEnforced: false
  },
  {
    id: 'password_policy',
    name: 'Password Policy',
    description: 'Minimum password requirements',
    type: 'select',
    value: 'strong',
    category: 'authentication',
    isEnforced: true,
    options: ['basic', 'medium', 'strong', 'enterprise']
  },
  {
    id: 'data_encryption',
    name: 'Data Encryption at Rest',
    description: 'Encrypt sensitive data in database',
    type: 'boolean',
    value: true,
    category: 'data',
    isEnforced: true
  }
];

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export function UserManagementProvider({ children }: { children: React.ReactNode }) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [invitations, setInvitations] = useState<UserInvitation[]>(mockInvitations);
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [permissions] = useState<Permission[]>(defaultPermissions);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(mockActivityLogs);
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(mockSecuritySettings);

  // User Management Functions
  const inviteUser = (email: string, roleId: string, message?: string, customPermissions?: string[]) => {
    const newInvitation: UserInvitation = {
      id: `inv_${Date.now()}`,
      email,
      role: roleId,
      status: 'pending',
      invitedBy: 'current_user@company.com',
      invitedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      message,
      permissions: customPermissions
    };
    
    setInvitations(prev => [...prev, newInvitation]);
    
    // Log activity
    const log: ActivityLog = {
      id: `log_${Date.now()}`,
      userId: 'current_user',
      userEmail: 'current_user@company.com',
      action: 'user.invited',
      resource: 'users',
      resourceId: newInvitation.id,
      details: `Invited ${email} with role ${roleId}`,
      timestamp: new Date(),
      ipAddress: '192.168.1.100',
      userAgent: navigator.userAgent,
      sessionId: 'current_session'
    };
    setActivityLogs(prev => [log, ...prev]);
  };

  const updateUserRole = (userId: string, roleId: string) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId ? { ...member, role: roleId } : member
    ));
  };

  const updateUserPermissions = (userId: string, newPermissions: string[]) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId ? { ...member, permissions: newPermissions } : member
    ));
  };

  const suspendUser = (userId: string, reason: string) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId ? { ...member, status: 'suspended' } : member
    ));
  };

  const reactivateUser = (userId: string) => {
    setTeamMembers(prev => prev.map(member =>
      member.id === userId ? { ...member, status: 'active' } : member
    ));
  };

  const removeUser = (userId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== userId));
  };

  // Role Management Functions
  const createRole = (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRoles(prev => [...prev, newRole]);
  };

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role =>
      role.id === roleId ? { ...role, ...updates, updatedAt: new Date() } : role
    ));
  };

  const deleteRole = (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId && !role.isSystem));
  };

  // Invitation Management Functions
  const cancelInvitation = (invitationId: string) => {
    setInvitations(prev => prev.map(inv =>
      inv.id === invitationId ? { ...inv, status: 'cancelled' } : inv
    ));
  };

  const resendInvitation = (invitationId: string) => {
    setInvitations(prev => prev.map(inv =>
      inv.id === invitationId ? {
        ...inv,
        invitedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      } : inv
    ));
  };

  const acceptInvitation = (invitationId: string, userData: { firstName: string; lastName: string; password: string }) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    if (!invitation) return;

    // Create new team member
    const newMember: TeamMember = {
      id: `user_${Date.now()}`,
      email: invitation.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: invitation.role,
      status: 'active',
      joinedAt: new Date(),
      permissions: invitation.permissions || roles.find(r => r.id === invitation.role)?.permissions || [],
      activityLevel: 'low',
      totalLogins: 0,
      totalTimeSpent: 0
    };

    setTeamMembers(prev => [...prev, newMember]);
    setInvitations(prev => prev.map(inv =>
      inv.id === invitationId ? { ...inv, status: 'accepted', acceptedAt: new Date() } : inv
    ));
  };

  // Activity Monitoring Functions
  const getUserActivity = (userId: string, dateRange?: [Date, Date]): ActivityLog[] => {
    let filtered = activityLogs.filter(log => log.userId === userId);
    
    if (dateRange) {
      const [start, end] = dateRange;
      filtered = filtered.filter(log => log.timestamp >= start && log.timestamp <= end);
    }
    
    return filtered;
  };

  const getTeamActivity = (timeframe: 'day' | 'week' | 'month'): ActivityLog[] => {
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeframe) {
      case 'day':
        cutoff.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
    }
    
    return activityLogs.filter(log => log.timestamp >= cutoff);
  };

  // Security Settings Functions
  const updateSecuritySetting = (settingId: string, value: any) => {
    setSecuritySettings(prev => prev.map(setting =>
      setting.id === settingId ? { ...setting, value } : setting
    ));
  };

  // Analytics Functions
  const getUserStats = () => {
    const totalUsers = teamMembers.length;
    const activeUsers = teamMembers.filter(m => m.status === 'active').length;
    const pendingInvitations = invitations.filter(i => i.status === 'pending').length;
    const totalSessions = activityLogs.filter(log => log.action === 'user.login').length;
    const averageSessionTime = teamMembers.reduce((sum, m) => sum + m.totalTimeSpent, 0) / totalUsers;

    return {
      totalUsers,
      activeUsers,
      pendingInvitations,
      totalSessions,
      averageSessionTime
    };
  };

  const value: UserManagementContextType = {
    // State
    teamMembers,
    invitations,
    roles,
    permissions,
    activityLogs,
    securitySettings,

    // User Management
    inviteUser,
    updateUserRole,
    updateUserPermissions,
    suspendUser,
    reactivateUser,
    removeUser,

    // Role Management
    createRole,
    updateRole,
    deleteRole,

    // Invitation Management
    cancelInvitation,
    resendInvitation,
    acceptInvitation,

    // Activity Monitoring
    getUserActivity,
    getTeamActivity,

    // Security Settings
    updateSecuritySetting,

    // Analytics
    getUserStats
  };

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
}
