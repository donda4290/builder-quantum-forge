import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  currentWorkspace?: string;
  workspaces: string[];
}

export interface Workspace {
  id: string;
  name: string;
  domain?: string;
  plan: 'free' | 'pro' | 'enterprise';
  owner: string;
}

interface AuthContextType {
  user: User | null;
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchWorkspace: (workspaceId: string) => void;
  createWorkspace: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock data for demo
const mockUser: User = {
  id: '1',
  email: 'admin@platformbuilder.com',
  name: 'Platform Admin',
  role: 'admin',
  currentWorkspace: 'workspace-1',
  workspaces: ['workspace-1', 'workspace-2', 'workspace-3']
};

const mockWorkspaces: Workspace[] = [
  {
    id: 'workspace-1',
    name: 'Luxury Fashion Store',
    domain: 'luxuryfashion.com',
    plan: 'enterprise',
    owner: '1'
  },
  {
    id: 'workspace-2',
    name: 'Tech Gadgets Hub',
    domain: 'techgadgets.shop',
    plan: 'pro',
    owner: '1'
  },
  {
    id: 'workspace-3',
    name: 'Artisan Crafts',
    plan: 'free',
    owner: '1'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading auth state
    const timer = setTimeout(() => {
      setUser(mockUser);
      setWorkspaces(mockWorkspaces);
      setCurrentWorkspace(mockWorkspaces[0]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(mockUser);
    setWorkspaces(mockWorkspaces);
    setCurrentWorkspace(mockWorkspaces[0]);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setWorkspaces([]);
    setCurrentWorkspace(null);
  };

  const switchWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      setUser(prev => prev ? { ...prev, currentWorkspace: workspaceId } : null);
    }
  };

  const createWorkspace = async (name: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newWorkspace: Workspace = {
      id: `workspace-${Date.now()}`,
      name,
      plan: 'free',
      owner: user?.id || '1'
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    setIsLoading(false);
  };

  const value = {
    user,
    workspaces,
    currentWorkspace,
    isLoading,
    login,
    logout,
    switchWorkspace,
    createWorkspace
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
