import React, { useState } from 'react';
import { useUserManagement, ActivityLog, TeamMember } from '@/contexts/UserManagementContext';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  Users, 
  Clock, 
  Eye, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  User,
  Globe,
  Monitor,
  Smartphone,
  Search,
  RefreshCw,
  MapPin,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';

interface UserAnalytics {
  userId: string;
  sessionsToday: number;
  averageSessionTime: number;
  totalActions: number;
  lastActiveAt: Date;
  preferredDevice: 'desktop' | 'mobile' | 'tablet';
  location: string;
  productivityScore: number;
}

interface SystemAnalytics {
  totalSessions: number;
  averageSessionTime: number;
  totalActions: number;
  uniqueUsers: number;
  peakHour: number;
  topActions: { action: string; count: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
  locationBreakdown: { location: string; count: number }[];
}

// Mock analytics data
const mockUserAnalytics: UserAnalytics[] = [
  {
    userId: 'user1',
    sessionsToday: 5,
    averageSessionTime: 125,
    totalActions: 89,
    lastActiveAt: new Date('2024-01-15T14:30:00Z'),
    preferredDevice: 'desktop',
    location: 'New York, US',
    productivityScore: 85
  },
  {
    userId: 'user2',
    sessionsToday: 3,
    averageSessionTime: 98,
    totalActions: 56,
    lastActiveAt: new Date('2024-01-15T13:45:00Z'),
    preferredDevice: 'mobile',
    location: 'Los Angeles, US',
    productivityScore: 72
  },
  {
    userId: 'user3',
    sessionsToday: 2,
    averageSessionTime: 67,
    totalActions: 34,
    lastActiveAt: new Date('2024-01-15T11:20:00Z'),
    preferredDevice: 'desktop',
    location: 'Chicago, US',
    productivityScore: 68
  }
];

const mockSystemAnalytics: SystemAnalytics = {
  totalSessions: 45,
  averageSessionTime: 96,
  totalActions: 567,
  uniqueUsers: 12,
  peakHour: 14,
  topActions: [
    { action: 'page.viewed', count: 156 },
    { action: 'product.created', count: 89 },
    { action: 'user.login', count: 67 },
    { action: 'order.processed', count: 45 },
    { action: 'integration.configured', count: 32 }
  ],
  deviceBreakdown: [
    { device: 'Desktop', percentage: 68 },
    { device: 'Mobile', percentage: 24 },
    { device: 'Tablet', percentage: 8 }
  ],
  locationBreakdown: [
    { location: 'New York, US', count: 15 },
    { location: 'Los Angeles, US', count: 12 },
    { location: 'Chicago, US', count: 8 },
    { location: 'London, UK', count: 6 },
    { location: 'Toronto, CA', count: 4 }
  ]
};

export function ActivityMonitoring() {
  const { 
    activityLogs, 
    teamMembers, 
    getUserActivity, 
    getTeamActivity 
  } = useUserManagement();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = React.useMemo(() => {
    let filtered = activityLogs;

    if (selectedUser && selectedUser !== 'all') {
      filtered = filtered.filter(log => log.userId === selectedUser);
    }

    if (selectedAction && selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action.includes(selectedAction));
    }

    if (selectedDate) {
      filtered = filtered.filter(log => 
        log.timestamp.toDateString() === selectedDate.toDateString()
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.userEmail.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activityLogs, selectedUser, selectedAction, selectedDate, searchQuery]);

  const uniqueActions = [...new Set(activityLogs.map(log => log.action.split('.')[0]))];

  const getUserAnalytics = (userId: string): UserAnalytics => {
    return mockUserAnalytics.find(ua => ua.userId === userId) || {
      userId,
      sessionsToday: 0,
      averageSessionTime: 0,
      totalActions: 0,
      lastActiveAt: new Date(),
      preferredDevice: 'desktop',
      location: 'Unknown',
      productivityScore: 0
    };
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login')) return <User className="w-4 h-4" />;
    if (action.includes('created')) return <Zap className="w-4 h-4" />;
    if (action.includes('updated')) return <RefreshCw className="w-4 h-4" />;
    if (action.includes('viewed')) return <Eye className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getProductivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const exportActivityData = () => {
    const csvData = filteredLogs.map(log => ({
      timestamp: log.timestamp.toISOString(),
      user: log.userEmail,
      action: log.action,
      resource: log.resource,
      details: log.details,
      ip_address: log.ipAddress,
      location: log.location || 'Unknown'
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Activity Monitoring</h3>
          <p className="text-gray-600">Track user activity and analyze usage patterns</p>
        </div>
        <Button onClick={exportActivityData}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="user-analytics">User Analytics</TabsTrigger>
          <TabsTrigger value="activity-logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="system-analytics">System Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-blue-600">{mockSystemAnalytics.uniqueUsers}</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-green-600">{mockSystemAnalytics.totalSessions}</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
                    <p className="text-2xl font-bold text-purple-600">{formatDuration(mockSystemAnalytics.averageSessionTime)}</p>
                    <p className="text-sm text-gray-500">Per session</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Actions</p>
                    <p className="text-2xl font-bold text-orange-600">{mockSystemAnalytics.totalActions}</p>
                    <p className="text-sm text-gray-500">Today</p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Top Actions</CardTitle>
                <CardDescription>Most performed actions today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSystemAnalytics.topActions.map((action, index) => (
                    <div key={action.action} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getActionIcon(action.action)}
                        </div>
                        <div>
                          <div className="font-medium">{action.action.replace('_', ' ').replace('.', ' ')}</div>
                          <div className="text-sm text-gray-500">#{index + 1} most common</div>
                        </div>
                      </div>
                      <Badge variant="outline">{action.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Usage</CardTitle>
                <CardDescription>How users access the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSystemAnalytics.deviceBreakdown.map(device => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getDeviceIcon(device.device)}
                        </div>
                        <div>
                          <div className="font-medium">{device.device}</div>
                          <div className="text-sm text-gray-500">{device.percentage}% of sessions</div>
                        </div>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${device.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Where your team is accessing from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockSystemAnalytics.locationBreakdown.map(location => (
                  <div key={location.location} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="font-medium">{location.location}</div>
                      <div className="text-sm text-gray-500">{location.count} sessions</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user-analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Performance Analytics</CardTitle>
              <CardDescription>Individual user activity and productivity metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Sessions Today</TableHead>
                    <TableHead>Avg Session Time</TableHead>
                    <TableHead>Total Actions</TableHead>
                    <TableHead>Productivity Score</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map(member => {
                    const analytics = getUserAnalytics(member.id);
                    
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.firstName[0]}{member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.firstName} {member.lastName}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{analytics.sessionsToday}</Badge>
                        </TableCell>
                        <TableCell>{formatDuration(analytics.averageSessionTime)}</TableCell>
                        <TableCell>{analytics.totalActions}</TableCell>
                        <TableCell>
                          <div className={`font-medium ${getProductivityColor(analytics.productivityScore)}`}>
                            {analytics.productivityScore}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(analytics.preferredDevice)}
                            <span className="capitalize">{analytics.preferredDevice}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span>{analytics.location}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {analytics.lastActiveAt.toLocaleDateString()}
                            <div className="text-gray-500">
                              {analytics.lastActiveAt.toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity-logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                  <Label htmlFor="user">User</Label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      {teamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="action">Action</Label>
                  <Select value={selectedAction} onValueChange={setSelectedAction}>
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
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
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
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedUser('');
                      setSelectedAction('');
                      setSelectedDate(undefined);
                      setSearchQuery('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          <div>{format(log.timestamp, 'MMM dd, yyyy')}</div>
                          <div className="text-gray-500">{format(log.timestamp, 'HH:mm:ss')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {log.userEmail[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{log.userEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getActionIcon(log.action)}
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {log.resource}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm max-w-xs truncate" title={log.details}>
                          {log.details}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span>{log.location || 'Unknown'}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system-analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>System performance and usage trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Peak Usage Hour</div>
                        <div className="text-sm text-gray-500">Highest activity period</div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      {mockSystemAnalytics.peakHour}:00
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium">User Engagement</div>
                        <div className="text-sm text-gray-500">Actions per user today</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {Math.round(mockSystemAnalytics.totalActions / mockSystemAnalytics.uniqueUsers)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Session Quality</div>
                        <div className="text-sm text-gray-500">Average session duration</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">
                      {formatDuration(mockSystemAnalytics.averageSessionTime)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Activity patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Charts Coming Soon</h4>
                    <p className="text-gray-600">
                      Interactive charts and graphs will be displayed here to show usage trends over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Health */}
          <Card>
            <CardHeader>
              <CardTitle>System Health Indicators</CardTitle>
              <CardDescription>Key metrics for system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Activity className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-medium">System Uptime</h4>
                  <p className="text-2xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-gray-500">Last 30 days</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-medium">Response Time</h4>
                  <p className="text-2xl font-bold text-blue-600">245ms</p>
                  <p className="text-sm text-gray-500">Average</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-medium">Concurrent Users</h4>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-sm text-gray-500">Right now</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
