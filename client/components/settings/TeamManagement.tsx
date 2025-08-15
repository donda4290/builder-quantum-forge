import React, { useState } from 'react';
import { useUserManagement, TeamMember, UserInvitation } from '@/contexts/UserManagementContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Users, 
  Mail, 
  Crown, 
  Shield, 
  Eye, 
  UserPlus, 
  UserMinus, 
  UserX, 
  MoreVertical,
  Calendar,
  Clock,
  Activity,
  Send,
  RefreshCw,
  Trash2,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function TeamManagement() {
  const { 
    teamMembers, 
    invitations, 
    roles, 
    inviteUser, 
    updateUserRole, 
    suspendUser, 
    reactivateUser, 
    removeUser,
    cancelInvitation,
    resendInvitation,
    getUserStats
  } = useUserManagement();
  
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);

  const [inviteData, setInviteData] = useState({
    email: '',
    role: '',
    message: ''
  });

  const stats = getUserStats();

  const handleInviteUser = () => {
    if (!inviteData.email || !inviteData.role) {
      toast({
        title: 'Error',
        description: 'Please provide email and select a role',
        variant: 'destructive'
      });
      return;
    }

    inviteUser(inviteData.email, inviteData.role, inviteData.message);
    setInviteData({ email: '', role: '', message: '' });
    setShowInviteDialog(false);

    toast({
      title: 'Invitation Sent',
      description: `Invitation sent to ${inviteData.email}`
    });
  };

  const handleUpdateRole = (userId: string, newRole: string) => {
    updateUserRole(userId, newRole);
    toast({
      title: 'Role Updated',
      description: 'User role has been updated successfully'
    });
  };

  const handleSuspendUser = (userId: string) => {
    suspendUser(userId, 'Suspended by administrator');
    toast({
      title: 'User Suspended',
      description: 'User has been suspended',
      variant: 'destructive'
    });
  };

  const handleReactivateUser = (userId: string) => {
    reactivateUser(userId);
    toast({
      title: 'User Reactivated',
      description: 'User has been reactivated'
    });
  };

  const handleRemoveUser = (userId: string) => {
    removeUser(userId);
    toast({
      title: 'User Removed',
      description: 'User has been removed from the team',
      variant: 'destructive'
    });
  };

  const getStatusIcon = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'suspended':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
    }
  };

  const getInvitationStatusColor = (status: UserInvitation['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || { name: roleId, color: 'bg-gray-100 text-gray-800' };
  };

  const getActivityLevel = (level: TeamMember['activityLevel']) => {
    switch (level) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
    }
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Team Management</h3>
          <p className="text-gray-600">Manage team members, roles, and permissions</p>
        </div>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your workspace
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center space-x-2">
                          <span>{role.name}</span>
                          <Badge className={role.color}>{role.name}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Welcome Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Welcome to the team! We're excited to have you."
                  value={inviteData.message}
                  onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleInviteUser}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
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
                <p className="text-sm font-medium text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvitations}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <Mail className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Time</p>
                <p className="text-2xl font-bold text-purple-600">{formatTimeSpent(stats.averageSessionTime)}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Pending Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Team Members
              </CardTitle>
              <CardDescription>
                {teamMembers.length} team member{teamMembers.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => {
                    const roleInfo = getRoleInfo(member.role);
                    
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
                          <div className="flex items-center space-x-2">
                            <Badge className={roleInfo.color}>
                              {roleInfo.name}
                            </Badge>
                            {member.role === 'owner' && (
                              <Crown className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(member.status)}
                            <Badge className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Badge className={getActivityLevel(member.activityLevel)}>
                              {member.activityLevel}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {member.totalLogins} logins
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.lastLoginAt ? (
                            <div className="text-sm">
                              <div>{member.lastLoginAt.toLocaleDateString()}</div>
                              <div className="text-gray-500">{member.lastLoginAt.toLocaleTimeString()}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                setSelectedMember(member);
                                setShowMemberDetails(true);
                              }}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {member.role !== 'owner' && (
                                <>
                                  <DropdownMenuItem onClick={() => {
                                    // Open role change dialog
                                  }}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Change Role
                                  </DropdownMenuItem>
                                  {member.status === 'active' ? (
                                    <DropdownMenuItem onClick={() => handleSuspendUser(member.id)}>
                                      <UserX className="w-4 h-4 mr-2" />
                                      Suspend
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleReactivateUser(member.id)}>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Reactivate
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    onClick={() => handleRemoveUser(member.id)}
                                    className="text-red-600"
                                  >
                                    <UserMinus className="w-4 h-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Pending Invitations
              </CardTitle>
              <CardDescription>
                {invitations.length} pending invitation{invitations.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invitations.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Invitations</h3>
                  <p className="text-gray-600 mb-4">All team members have been onboarded</p>
                  <Button onClick={() => setShowInviteDialog(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Someone
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invitations.map((invitation) => {
                      const roleInfo = getRoleInfo(invitation.role);
                      
                      return (
                        <TableRow key={invitation.id}>
                          <TableCell>
                            <div className="font-medium">{invitation.email}</div>
                            {invitation.message && (
                              <div className="text-sm text-gray-500 mt-1">
                                "{invitation.message}"
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={roleInfo.color}>
                              {roleInfo.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getInvitationStatusColor(invitation.status)}>
                              {invitation.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{invitation.invitedAt.toLocaleDateString()}</div>
                              <div className="text-gray-500">by {invitation.invitedBy}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {invitation.expiresAt.toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {invitation.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => resendInvitation(invitation.id)}
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => cancelInvitation(invitation.id)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
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
        </TabsContent>
      </Tabs>

      {/* Member Details Dialog */}
      <Dialog open={showMemberDetails} onOpenChange={setShowMemberDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
            <DialogDescription>
              View detailed information and activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedMember.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedMember.firstName[0]}{selectedMember.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h3>
                  <p className="text-gray-600">{selectedMember.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRoleInfo(selectedMember.role).color}>
                      {getRoleInfo(selectedMember.role).name}
                    </Badge>
                    <Badge className={getStatusColor(selectedMember.status)}>
                      {selectedMember.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span>{selectedMember.joinedAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Login:</span>
                      <span>
                        {selectedMember.lastLoginAt 
                          ? selectedMember.lastLoginAt.toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Logins:</span>
                      <span>{selectedMember.totalLogins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Spent:</span>
                      <span>{formatTimeSpent(selectedMember.totalTimeSpent)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Activity Level</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <Badge className={getActivityLevel(selectedMember.activityLevel)}>
                        {selectedMember.activityLevel} activity
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on login frequency and time spent in platform
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.permissions.slice(0, 8).map(permission => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                  {selectedMember.permissions.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedMember.permissions.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
