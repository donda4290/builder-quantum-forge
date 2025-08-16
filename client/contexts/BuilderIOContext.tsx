import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface BuilderIOConfig {
  publicApiKey: string;
  privateApiKey: string;
  spaceId: string;
  organizationId?: string;
  isConfigured: boolean;
  environment: 'development' | 'staging' | 'production';
}

export interface BuilderIOContent {
  id: string;
  name: string;
  model: string;
  data: any;
  published: boolean;
  lastModified: Date;
  createdBy: string;
  url: string;
  status: 'draft' | 'published' | 'archived';
  variations?: BuilderIOVariation[];
}

export interface BuilderIOVariation {
  id: string;
  name: string;
  testRatio: number;
  data: any;
  stats: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

export interface BuilderIOModel {
  name: string;
  displayName: string;
  fields: BuilderIOField[];
  kind: 'page' | 'component' | 'data';
  publicReadable: boolean;
  publicWritable: boolean;
  preview: {
    url: string;
    defaultData: any;
  };
}

export interface BuilderIOField {
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'image' | 'richText' | 'reference' | 'list';
  required: boolean;
  defaultValue?: any;
  enum?: string[];
  subFields?: BuilderIOField[];
}

export interface BuilderIOAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  topPages: Array<{
    name: string;
    url: string;
    views: number;
  }>;
  performance: {
    avgLoadTime: number;
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
  };
}

interface BuilderIOContextType {
  // Configuration
  config: BuilderIOConfig;
  isConfigured: boolean;
  
  // Content Management
  content: BuilderIOContent[];
  models: BuilderIOModel[];
  selectedContent: BuilderIOContent | null;
  
  // Analytics
  analytics: BuilderIOAnalytics | null;
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  configure: (config: Omit<BuilderIOConfig, 'isConfigured'>) => Promise<boolean>;
  createContent: (model: string, data: any) => Promise<BuilderIOContent>;
  updateContent: (id: string, updates: Partial<BuilderIOContent>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  publishContent: (id: string) => Promise<void>;
  previewContent: (id: string) => string;
  
  // Models
  createModel: (model: Omit<BuilderIOModel, 'name'> & { name: string }) => Promise<void>;
  updateModel: (name: string, updates: Partial<BuilderIOModel>) => Promise<void>;
  deleteModel: (name: string) => Promise<void>;
  
  // Analytics
  fetchAnalytics: (dateRange?: { start: Date; end: Date }) => Promise<void>;
  
  // Selection
  selectContent: (content: BuilderIOContent | null) => void;
  
  // Sync
  syncWithBuilderIO: () => Promise<void>;
}

const BuilderIOContext = createContext<BuilderIOContextType | undefined>(undefined);

export function useBuilderIO() {
  const context = useContext(BuilderIOContext);
  if (context === undefined) {
    throw new Error('useBuilderIO must be used within a BuilderIOProvider');
  }
  return context;
}

// Mock data for demonstration
const mockConfig: BuilderIOConfig = {
  publicApiKey: 'pub-12345demo67890',
  privateApiKey: 'priv-demo-key-12345',
  spaceId: 'demo-space-12345',
  organizationId: 'demo-org-67890',
  isConfigured: true,
  environment: 'development'
};

const mockContent: BuilderIOContent[] = [
  {
    id: 'content-home',
    name: 'Home Page',
    model: 'page',
    data: {
      title: 'Welcome to Our Store',
      blocks: []
    },
    published: true,
    lastModified: new Date('2024-01-15'),
    createdBy: 'admin@example.com',
    url: '/',
    status: 'published'
  },
  {
    id: 'content-products',
    name: 'Products Page',
    model: 'page',
    data: {
      title: 'Our Products',
      blocks: []
    },
    published: false,
    lastModified: new Date('2024-01-12'),
    createdBy: 'admin@example.com',
    url: '/products',
    status: 'draft'
  }
];

const mockModels: BuilderIOModel[] = [
  {
    name: 'page',
    displayName: 'Page',
    kind: 'page',
    publicReadable: true,
    publicWritable: false,
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        defaultValue: 'New Page'
      },
      {
        name: 'description',
        type: 'text',
        required: false
      },
      {
        name: 'blocks',
        type: 'list',
        required: false,
        subFields: []
      }
    ],
    preview: {
      url: 'https://example.com',
      defaultData: {}
    }
  },
  {
    name: 'product',
    displayName: 'Product',
    kind: 'data',
    publicReadable: true,
    publicWritable: false,
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true
      },
      {
        name: 'price',
        type: 'number',
        required: true
      },
      {
        name: 'description',
        type: 'richText',
        required: false
      },
      {
        name: 'image',
        type: 'image',
        required: false
      }
    ],
    preview: {
      url: 'https://example.com/products',
      defaultData: {}
    }
  }
];

const mockAnalytics: BuilderIOAnalytics = {
  pageViews: 12456,
  uniqueVisitors: 3428,
  avgTimeOnPage: 145,
  bounceRate: 0.42,
  conversionRate: 0.032,
  topPages: [
    { name: 'Home Page', url: '/', views: 5432 },
    { name: 'Products Page', url: '/products', views: 3210 },
    { name: 'About Page', url: '/about', views: 1876 }
  ],
  performance: {
    avgLoadTime: 0.8,
    coreWebVitals: {
      lcp: 2.1,
      fid: 12,
      cls: 0.05
    }
  }
};

export function BuilderIOProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<BuilderIOConfig>(mockConfig);
  const [content, setContent] = useState<BuilderIOContent[]>(mockContent);
  const [models, setModels] = useState<BuilderIOModel[]>(mockModels);
  const [selectedContent, setSelectedContent] = useState<BuilderIOContent | null>(null);
  const [analytics, setAnalytics] = useState<BuilderIOAnalytics | null>(mockAnalytics);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = config.isConfigured && config.publicApiKey && config.privateApiKey;

  // Configuration
  const configure = useCallback(async (newConfig: Omit<BuilderIOConfig, 'isConfigured'>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would validate the API keys with Builder.io
      // const isValid = await validateBuilderIOCredentials(newConfig);
      const isValid = true; // Mock validation
      
      if (isValid) {
        setConfig({
          ...newConfig,
          isConfigured: true
        });
        return true;
      } else {
        setError('Invalid Builder.io credentials');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Configuration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Content Management
  const createContent = useCallback(async (model: string, data: any): Promise<BuilderIOContent> => {
    setIsLoading(true);
    try {
      // Simulate content creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newContent: BuilderIOContent = {
        id: `content-${Date.now()}`,
        name: data.title || 'New Content',
        model,
        data,
        published: false,
        lastModified: new Date(),
        createdBy: 'current-user@example.com',
        url: `/${data.title?.toLowerCase().replace(/\s+/g, '-') || 'new-content'}`,
        status: 'draft'
      };
      
      setContent(prev => [...prev, newContent]);
      return newContent;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateContent = useCallback(async (id: string, updates: Partial<BuilderIOContent>): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContent(prev => prev.map(item =>
        item.id === id
          ? { ...item, ...updates, lastModified: new Date() }
          : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteContent = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setContent(prev => prev.filter(item => item.id !== id));
      if (selectedContent?.id === id) {
        setSelectedContent(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedContent]);

  const publishContent = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setContent(prev => prev.map(item =>
        item.id === id
          ? { ...item, published: true, status: 'published', lastModified: new Date() }
          : item
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish content');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const previewContent = useCallback((id: string): string => {
    const contentItem = content.find(item => item.id === id);
    if (!contentItem) return '';
    
    // In a real implementation, this would generate a Builder.io preview URL
    return `https://cdn.builder.io/api/v1/content/${contentItem.model}/${id}?apiKey=${config.publicApiKey}`;
  }, [content, config.publicApiKey]);

  // Models
  const createModel = useCallback(async (model: BuilderIOModel): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setModels(prev => [...prev, model]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create model');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateModel = useCallback(async (name: string, updates: Partial<BuilderIOModel>): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModels(prev => prev.map(model =>
        model.name === name ? { ...model, ...updates } : model
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update model');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteModel = useCallback(async (name: string): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setModels(prev => prev.filter(model => model.name !== name));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete model');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Analytics
  const fetchAnalytics = useCallback(async (dateRange?: { start: Date; end: Date }): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real implementation, this would fetch analytics from Builder.io
      setAnalytics(mockAnalytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Selection
  const selectContent = useCallback((contentItem: BuilderIOContent | null) => {
    setSelectedContent(contentItem);
  }, []);

  // Sync
  const syncWithBuilderIO = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      // In a real implementation, this would sync with Builder.io API
      // Refresh content, models, and analytics
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with Builder.io');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-sync on mount if configured
  useEffect(() => {
    if (isConfigured && content.length === 0) {
      // Initial sync would happen here in a real implementation
    }
  }, [isConfigured, content.length]);

  const value: BuilderIOContextType = {
    config,
    isConfigured,
    content,
    models,
    selectedContent,
    analytics,
    isLoading,
    error,
    configure,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    previewContent,
    createModel,
    updateModel,
    deleteModel,
    fetchAnalytics,
    selectContent,
    syncWithBuilderIO
  };

  return (
    <BuilderIOContext.Provider value={value}>
      {children}
    </BuilderIOContext.Provider>
  );
}
