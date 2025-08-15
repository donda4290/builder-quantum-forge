import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserManagement } from '@/contexts/UserManagementContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Activity, 
  Zap, 
  User,
  Crown,
  Bell,
  Palette,
  CreditCard,
  HelpCircle,
  MessageSquare,
  TestTube,
  Monitor,
  Globe
} from 'lucide-react';

// Import all settings components
import { TeamManagement } from '@/components/settings/TeamManagement';
import { RoleManagement } from '@/components/settings/RoleManagement';
import { ActivityMonitoring } from '@/components/settings/ActivityMonitoring';
import { SecurityCompliance } from '@/components/settings/SecurityCompliance';
import { ScalabilityManagement } from '@/components/settings/ScalabilityManagement';

export default function Settings() {
  const { currentUser, currentWorkspace } = useAuth();
  const { getUserStats } = useUserManagement();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = getUserStats();

  const quickStats = [
    {
      title: 'Team Members',
      value: stats.totalUsers,
      description: `${stats.activeUsers} active`,
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Security Score',
      value: '94%',
      description: 'Excellent',
      icon: Shield,
      color: 'text-green-600'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      description: 'Last 30 days',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Active Regions',
      value: '3',
      description: 'Global deployment',
      icon: Globe,
      color: 'text-orange-600'
    }
  ];

  const settingsSections = [
    {
      id: 'team',
      title: 'Team Management',
      description: 'Manage team members, invitations, and user roles',
      icon: Users,
      component: TeamManagement,
      badge: stats.pendingInvitations > 0 ? stats.pendingInvitations : null,
      color: 'text-blue-600'
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      description: 'Define custom roles and permission structures',
      icon: Crown,
      component: RoleManagement,
      color: 'text-purple-600'
    },
    {
      id: 'activity',
      title: 'Activity Monitoring',
      description: 'Track user activity and analyze usage patterns',
      icon: Activity,
      component: ActivityMonitoring,
      color: 'text-green-600'
    },
    {
      id: 'security',
      title: 'Security & Compliance',
      description: 'Manage security settings, encryption, and compliance',
      icon: Shield,
      component: SecurityCompliance,
      color: 'text-red-600'
    },
    {
      id: 'scalability',
      title: 'Scalability & Performance',
      description: 'Auto-scaling, multi-region, and performance monitoring',
      icon: Zap,
      component: ScalabilityManagement,
      color: 'text-yellow-600'
    }
  ];

  const renderTabContent = (sectionId: string) => {
    const section = settingsSections.find(s => s.id === sectionId);
    if (!section) return null;

    const Component = section.component;
    return <Component />;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings & Configuration</h1>
          <p className="text-gray-600">
            Manage your workspace, team, security, and platform configuration
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <SettingsIcon className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            {settingsSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <TabsTrigger key={section.id} value={section.id} className="flex items-center space-x-2">
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{section.title.split(' ')[0]}</span>
                  {section.badge && (
                    <Badge variant="secondary" className="ml-1">
                      {section.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              );
            })}
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
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                          <p className="text-sm text-gray-500">{stat.description}</p>
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

            {/* Workspace Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Workspace Information
                </CardTitle>
                <CardDescription>Current workspace and user details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Workspace Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{currentWorkspace?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{currentWorkspace?.plan}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Members:</span>
                        <span className="font-medium">{currentWorkspace?.members?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{currentWorkspace?.createdAt?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Current User</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{currentUser?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{currentUser?.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Role:</span>
                        <span className="font-medium capitalize">{currentUser?.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="font-medium">{currentUser?.lastLoginAt?.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Sections Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {settingsSections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Card 
                    key={section.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setActiveTab(section.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gray-100 ${section.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span>{section.title}</span>
                        </div>
                        {section.badge && (
                          <Badge variant="secondary">
                            {section.badge}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600">
                        Click to configure these settings
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Additional Settings Categories */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
                <CardContent className="p-6 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-600 mb-2">Notifications</h3>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
                <CardContent className="p-6 text-center">
                  <Palette className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-600 mb-2">Branding</h3>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
                <CardContent className="p-6 text-center">
                  <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-600 mb-2">Billing</h3>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-60">
                <CardContent className="p-6 text-center">
                  <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-600 mb-2">Support</h3>
                  <p className="text-sm text-gray-500">Coming Soon</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">Invite Team Member</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">Security Audit</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">Export Data</div>
                  </div>
                  
                  <div className="p-4 border rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <MessageSquare className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <div className="font-medium text-sm">Contact Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Individual Settings Tabs */}
          {settingsSections.map((section) => (
            <TabsContent key={section.id} value={section.id}>
              {renderTabContent(section.id)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
