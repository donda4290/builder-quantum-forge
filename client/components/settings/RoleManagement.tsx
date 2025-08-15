import React, { useState } from 'react';
import { useUserManagement, Role, Permission } from '@/contexts/UserManagementContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Shield, 
  Users, 
  Settings, 
  Trash2, 
  Edit,
  Crown,
  Lock,
  Unlock,
  Eye,
  Copy,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const permissionCategories = [
  { id: 'general', name: 'General', icon: Eye, color: 'text-blue-600' },
  { id: 'builder', name: 'Website Builder', icon: Settings, color: 'text-purple-600' },
  { id: 'ecommerce', name: 'E-commerce', icon: Users, color: 'text-green-600' },
  { id: 'domains', name: 'Domains', icon: Shield, color: 'text-orange-600' },
  { id: 'integrations', name: 'Integrations', icon: Settings, color: 'text-pink-600' },
  { id: 'billing', name: 'Billing', icon: Crown, color: 'text-yellow-600' },
  { id: 'admin', name: 'Administration', icon: Shield, color: 'text-red-600' }
];

export function RoleManagement() {
  const { 
    roles, 
    permissions, 
    teamMembers,
    createRole, 
    updateRole, 
    deleteRole 
  } = useUserManagement();
  
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [roleData, setRoleData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
    color: 'bg-blue-100 text-blue-800'
  });

  const handleCreateRole = () => {
    if (!roleData.name || !roleData.description) {
      toast({
        title: 'Error',
        description: 'Please provide role name and description',
        variant: 'destructive'
      });
      return;
    }

    if (roleData.permissions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one permission',
        variant: 'destructive'
      });
      return;
    }

    createRole({
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      isSystem: false,
      color: roleData.color
    });

    setRoleData({
      name: '',
      description: '',
      permissions: [],
      color: 'bg-blue-100 text-blue-800'
    });
    setShowCreateDialog(false);

    toast({
      title: 'Role Created',
      description: `${roleData.name} role has been created successfully`
    });
  };

  const handleEditRole = () => {
    if (!selectedRole) return;

    updateRole(selectedRole.id, {
      name: roleData.name,
      description: roleData.description,
      permissions: roleData.permissions,
      color: roleData.color
    });

    setShowEditDialog(false);
    setSelectedRole(null);

    toast({
      title: 'Role Updated',
      description: `${roleData.name} role has been updated successfully`
    });
  };

  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) {
      toast({
        title: 'Cannot Delete',
        description: 'System roles cannot be deleted',
        variant: 'destructive'
      });
      return;
    }

    // Check if role is in use
    const usersWithRole = teamMembers.filter(member => member.role === role.id);
    if (usersWithRole.length > 0) {
      toast({
        title: 'Cannot Delete',
        description: `This role is assigned to ${usersWithRole.length} user(s)`,
        variant: 'destructive'
      });
      return;
    }

    deleteRole(role.id);
    toast({
      title: 'Role Deleted',
      description: `${role.name} role has been deleted`
    });
  };

  const openEditDialog = (role: Role) => {
    setSelectedRole(role);
    setRoleData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
      color: role.color
    });
    setShowEditDialog(true);
  };

  const handlePermissionToggle = (permissionId: string, checked: boolean) => {
    if (checked) {
      setRoleData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setRoleData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => id !== permissionId)
      }));
    }
  };

  const duplicateRole = (role: Role) => {
    setRoleData({
      name: `${role.name} (Copy)`,
      description: role.description,
      permissions: [...role.permissions],
      color: role.color
    });
    setShowCreateDialog(true);
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  const getUsersWithRole = (roleId: string) => {
    return teamMembers.filter(member => member.role === roleId).length;
  };

  const getPermissionSummary = (permissionIds: string[]) => {
    const categories = permissionCategories.map(cat => ({
      ...cat,
      count: permissionIds.filter(id => {
        const permission = permissions.find(p => p.id === id);
        return permission?.category === cat.id;
      }).length
    }));

    return categories.filter(cat => cat.count > 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Role Management</h3>
          <p className="text-gray-600">Define roles and permissions for your team</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Define a custom role with specific permissions
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div>
                  <Label htmlFor="roleName">Role Name</Label>
                  <Input
                    id="roleName"
                    placeholder="e.g., Content Manager"
                    value={roleData.name}
                    onChange={(e) => setRoleData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="roleDescription">Description</Label>
                  <Textarea
                    id="roleDescription"
                    placeholder="Describe what this role can do"
                    value={roleData.description}
                    onChange={(e) => setRoleData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Role Color</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {[
                      'bg-blue-100 text-blue-800',
                      'bg-green-100 text-green-800',
                      'bg-yellow-100 text-yellow-800',
                      'bg-red-100 text-red-800',
                      'bg-purple-100 text-purple-800',
                      'bg-pink-100 text-pink-800',
                      'bg-orange-100 text-orange-800',
                      'bg-gray-100 text-gray-800'
                    ].map(color => (
                      <Button
                        key={color}
                        variant={roleData.color === color ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setRoleData(prev => ({ ...prev, color }))}
                        className="h-8"
                      >
                        <Badge className={color}>Sample</Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions" className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium">Permissions</h4>
                    <div className="text-sm text-gray-600">
                      {roleData.permissions.length} permission{roleData.permissions.length !== 1 ? 's' : ''} selected
                    </div>
                  </div>
                  
                  {permissionCategories.map(category => {
                    const categoryPermissions = getPermissionsByCategory(category.id);
                    const IconComponent = category.icon;
                    
                    return (
                      <Card key={category.id}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center text-lg">
                            <IconComponent className={`w-5 h-5 mr-2 ${category.color}`} />
                            {category.name}
                          </CardTitle>
                          <CardDescription>
                            {categoryPermissions.length} permission{categoryPermissions.length !== 1 ? 's' : ''} available
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryPermissions.map(permission => (
                              <div key={permission.id} className="flex items-center space-x-3">
                                <Checkbox
                                  id={permission.id}
                                  checked={roleData.permissions.includes(permission.id)}
                                  onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                                />
                                <div className="flex-1">
                                  <Label htmlFor={permission.id} className="font-medium text-sm">
                                    {permission.name}
                                  </Label>
                                  <div className="text-xs text-gray-500">{permission.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => {
          const usersCount = getUsersWithRole(role.id);
          const permissionSummary = getPermissionSummary(role.permissions);
          
          return (
            <Card key={role.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Shield className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{role.name}</span>
                        {role.isSystem && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{role.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={role.color}>
                    {role.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Users assigned:</span>
                  <span className="font-medium">{usersCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Permissions:</span>
                  <span className="font-medium">{role.permissions.length}</span>
                </div>

                {/* Permission Summary */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Access to:</div>
                  <div className="flex flex-wrap gap-1">
                    {permissionSummary.slice(0, 3).map(category => (
                      <Badge key={category.id} variant="outline" className="text-xs">
                        {category.name} ({category.count})
                      </Badge>
                    ))}
                    {permissionSummary.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{permissionSummary.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => duplicateRole(role)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(role)}
                      disabled={role.isSystem}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={role.isSystem || usersCount > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Role</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the "{role.name}" role? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteRole(role)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
              
              {role.isSystem && (
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-xs">
                    System
                  </Badge>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Modify role permissions and settings
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="editRoleName">Role Name</Label>
                <Input
                  id="editRoleName"
                  value={roleData.name}
                  onChange={(e) => setRoleData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editRoleDescription">Description</Label>
                <Textarea
                  id="editRoleDescription"
                  value={roleData.description}
                  onChange={(e) => setRoleData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <Label>Role Color</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[
                    'bg-blue-100 text-blue-800',
                    'bg-green-100 text-green-800',
                    'bg-yellow-100 text-yellow-800',
                    'bg-red-100 text-red-800',
                    'bg-purple-100 text-purple-800',
                    'bg-pink-100 text-pink-800',
                    'bg-orange-100 text-orange-800',
                    'bg-gray-100 text-gray-800'
                  ].map(color => (
                    <Button
                      key={color}
                      variant={roleData.color === color ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setRoleData(prev => ({ ...prev, color }))}
                      className="h-8"
                    >
                      <Badge className={color}>Sample</Badge>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium">Permissions</h4>
                  <div className="text-sm text-gray-600">
                    {roleData.permissions.length} permission{roleData.permissions.length !== 1 ? 's' : ''} selected
                  </div>
                </div>
                
                {permissionCategories.map(category => {
                  const categoryPermissions = getPermissionsByCategory(category.id);
                  const IconComponent = category.icon;
                  
                  return (
                    <Card key={category.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center text-lg">
                          <IconComponent className={`w-5 h-5 mr-2 ${category.color}`} />
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryPermissions.map(permission => (
                            <div key={permission.id} className="flex items-center space-x-3">
                              <Checkbox
                                id={`edit-${permission.id}`}
                                checked={roleData.permissions.includes(permission.id)}
                                onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked as boolean)}
                              />
                              <div className="flex-1">
                                <Label htmlFor={`edit-${permission.id}`} className="font-medium text-sm">
                                  {permission.name}
                                </Label>
                                <div className="text-xs text-gray-500">{permission.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>
              Update Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Permission Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Reference</CardTitle>
          <CardDescription>
            Available permissions organized by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {permissionCategories.map(category => {
              const categoryPermissions = getPermissionsByCategory(category.id);
              const IconComponent = category.icon;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <IconComponent className={`w-4 h-4 ${category.color}`} />
                    <h4 className="font-medium">{category.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {categoryPermissions.length}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {categoryPermissions.map(permission => (
                      <div key={permission.id} className="text-sm">
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-gray-500 text-xs">{permission.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
