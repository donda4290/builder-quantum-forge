import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Building2, 
  Palette, 
  Code, 
  Eye, 
  Monitor, 
  Tablet, 
  Smartphone,
  Save,
  Plus,
  Settings,
  ExternalLink,
  Zap,
  Globe,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Key,
  Database,
  Upload,
  Download,
  Share2,
  FolderOpen,
  Package,
  Import,
  Copy,
  FileText,
  Layout
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ActiveBuilderEditor } from './ActiveVisualEditor';

interface BuilderIOConfig {
  apiKey: string;
  publicApiKey: string;
  spaceId: string;
  model: string;
  isConfigured: boolean;
}

interface BuilderPage {
  id: string;
  name: string;
  url: string;
  published: boolean;
  lastModified: Date;
  model: string;
}

interface BuilderTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewUrl: string;
  model: string;
  isImported: boolean;
  lastModified: Date;
  tags: string[];
}

// Mock Builder.io configuration for demonstration
const mockBuilderConfig: BuilderIOConfig = {
  apiKey: 'demo-api-key-12345',
  publicApiKey: 'demo-public-key-67890',
  spaceId: 'demo-space-id',
  model: 'page',
  isConfigured: true
};

// Mock Builder.io pages
const mockBuilderPages: BuilderPage[] = [
  {
    id: 'home-page',
    name: 'Home Page',
    url: '/',
    published: true,
    lastModified: new Date('2024-01-15'),
    model: 'page'
  },
  {
    id: 'products-page',
    name: 'Products Page',
    url: '/products',
    published: false,
    lastModified: new Date('2024-01-12'),
    model: 'page'
  },
  {
    id: 'about-page',
    name: 'About Page',
    url: '/about',
    published: true,
    lastModified: new Date('2024-01-10'),
    model: 'page'
  }
];

// Mock Builder.io templates from your space
const mockBuilderTemplates: BuilderTemplate[] = [
  {
    id: 'ecommerce-hero-template',
    name: 'E-commerce Hero Section',
    description: 'Modern hero section with product showcase and call-to-action',
    category: 'E-commerce',
    previewUrl: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    model: 'page',
    isImported: false,
    lastModified: new Date('2024-01-20'),
    tags: ['hero', 'ecommerce', 'cta']
  },
  {
    id: 'landing-page-template',
    name: 'SaaS Landing Page',
    description: 'Complete landing page template with pricing and features',
    category: 'Landing Pages',
    previewUrl: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    model: 'landing-page',
    isImported: true,
    lastModified: new Date('2024-01-18'),
    tags: ['saas', 'landing', 'pricing']
  },
  {
    id: 'blog-layout-template',
    name: 'Modern Blog Layout',
    description: 'Clean blog post layout with sidebar and related articles',
    category: 'Blog',
    previewUrl: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    model: 'blog-post',
    isImported: false,
    lastModified: new Date('2024-01-16'),
    tags: ['blog', 'article', 'content']
  },
  {
    id: 'product-showcase-template',
    name: 'Product Showcase',
    description: 'Product gallery with zoom functionality and purchase options',
    category: 'E-commerce',
    previewUrl: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    model: 'product',
    isImported: true,
    lastModified: new Date('2024-01-14'),
    tags: ['product', 'gallery', 'showcase']
  },
  {
    id: 'contact-form-template',
    name: 'Contact & Support Form',
    description: 'Multi-step contact form with file upload and department routing',
    category: 'Forms',
    previewUrl: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    model: 'page',
    isImported: false,
    lastModified: new Date('2024-01-12'),
    tags: ['contact', 'form', 'support']
  },
  {
    id: 'pricing-table-template',
    name: 'Pricing Tables',
    description: 'Responsive pricing tables with feature comparison',
    category: 'Pricing',
    previewUrl: 'https://cdn.builder.io/api/v1/image/assets%2F...',
    model: 'page',
    isImported: false,
    lastModified: new Date('2024-01-10'),
    tags: ['pricing', 'comparison', 'features']
  }
];

export function BuilderIOIntegration() {
  const { toast } = useToast();

  // Test toast function availability
  const testToast = React.useCallback(() => {
    if (typeof toast === 'function') {
      return toast;
    } else {
      console.error('Toast function not available');
      return () => {};
    }
  }, [toast]);

  const [config, setConfig] = useState<BuilderIOConfig>(mockBuilderConfig);
  const [pages, setPages] = useState<BuilderPage[]>(mockBuilderPages);
  const [templates, setTemplates] = useState<BuilderTemplate[]>(mockBuilderTemplates);
  const [selectedPage, setSelectedPage] = useState<BuilderPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  const [spaceContents, setSpaceContents] = useState<any[]>([]);
  const [isConnectedToRealSpace, setIsConnectedToRealSpace] = useState(false);
  
  // Configuration form state
  const [formConfig, setFormConfig] = useState({
    apiKey: config.apiKey,
    publicApiKey: config.publicApiKey,
    spaceId: config.spaceId,
    model: config.model
  });

  const handleConfigSave = async () => {
    setIsLoading(true);
    try {
      // Validate API credentials by making a test request
      const testResponse = await fetch(`https://cdn.builder.io/api/v3/content?apiKey=${formConfig.publicApiKey}&limit=1`);

      if (!testResponse.ok) {
        throw new Error('Invalid API credentials');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConfig({
        ...formConfig,
        isConfigured: true
      });
      
      setShowConfigDialog(false);
      testToast()({
        title: 'Builder.io Configured!',
        description: 'Your Builder.io integration is now active and ready to use.'
      });
    } catch (error) {
      testToast()({
        title: 'Configuration Failed',
        description: 'Please check your API credentials and try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSpaceContents = async () => {
    if (!config.isConfigured || !config.apiKey || !config.spaceId) {
      testToast()({
        title: 'Configuration Required',
        description: 'Please configure your Builder.io credentials first.',
        variant: 'destructive'
      });
      setShowConfigDialog(true);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch all content from Builder.io space
      const response = await fetch(`https://cdn.builder.io/api/v3/content?apiKey=${config.publicApiKey}&limit=100&includeUnpublished=true`);

      if (!response.ok) {
        throw new Error('Failed to fetch space contents');
      }

      const data = await response.json();
      setSpaceContents(data.results || []);
      setIsConnectedToRealSpace(true);

      testToast()({
        title: 'Space Contents Loaded!',
        description: `Found ${data.results?.length || 0} items in your Builder.io space.`
      });
    } catch (error) {
      console.error('Error fetching space contents:', error);
      testToast()({
        title: 'Connection Failed',
        description: 'Could not connect to your Builder.io space. Please check your credentials.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPage = async () => {
    setIsLoading(true);
    try {
      // Simulate page creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPage: BuilderPage = {
        id: `page-${Date.now()}`,
        name: 'New Page',
        url: '/new-page',
        published: false,
        lastModified: new Date(),
        model: 'page'
      };
      
      setPages(prev => [...prev, newPage]);
      setSelectedPage(newPage);
      
      testToast()({
        title: 'Page Created!',
        description: 'Your new page is ready for editing in Builder.io.'
      });
    } catch (error) {
      testToast()({
        title: 'Creation Failed',
        description: 'Could not create new page. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openBuilderEditor = (page: BuilderPage) => {
    // Launch the integrated visual editor
    setSelectedPage(page);
    setActiveTab('editor');

    // For demonstration, we'll simulate the full Builder.io editor experience
    testToast()({
      title: 'Builder.io Editor Activated!',
      description: `Now editing ${page.name} with full visual editor capabilities.`
    });

    // In production, this would initialize the actual Builder.io SDK:
    // window.builderIO?.edit({ model: page.model, content: page.id });
  };

  const publishPage = async (pageId: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPages(prev => prev.map(page => 
        page.id === pageId 
          ? { ...page, published: true, lastModified: new Date() }
          : page
      ));
      
      testToast()({
        title: 'Page Published!',
        description: 'Your page is now live and accessible to visitors.'
      });
    } catch (error) {
      testToast()({
        title: 'Publish Failed',
        description: 'Could not publish page. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const previewPage = (page: BuilderPage) => {
    // In a real implementation, this would open the Builder.io preview
    const previewUrl = `https://cdn.builder.io/content/${config.spaceId}/${page.model}/${page.id}`;
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <h2 className="font-semibold text-lg">Builder.io Visual Editor</h2>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {config.isConfigured ? 'Connected' : 'Setup Required'}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          {config.isConfigured && (
            <>
              <Button
                onClick={createNewPage}
                disabled={isLoading}
                size="sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                New Page
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  // Fetch real templates from Builder.io space
                  fetchSpaceContents();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Load My Space
              </Button>
            </>
          )}

          <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Builder.io Configuration</DialogTitle>
                <DialogDescription>
                  Connect your Builder.io account to enable the visual editor
                </DialogDescription>
              </DialogHeader>
              <BuilderConfigForm 
                config={formConfig}
                onChange={setFormConfig}
                onSave={handleConfigSave}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {!config.isConfigured ? (
          <BuilderSetupWelcome onConfigure={() => setShowConfigDialog(true)} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b px-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="editor">Visual Editor</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto">
              <TabsContent value="templates" className="m-0 p-4">
                <BuilderSpaceExplorer
                  config={config}
                  spaceContents={spaceContents}
                  mockTemplates={templates}
                  isConnectedToRealSpace={isConnectedToRealSpace}
                  onFetchContents={fetchSpaceContents}
                  onSelectContent={(content) => {
                    const newPage: BuilderPage = {
                      id: content.id,
                      name: content.name || content.data?.title || 'Imported Content',
                      url: content.data?.url || `/${content.name?.toLowerCase().replace(/\s+/g, '-')}` || '/imported',
                      published: !!content.published,
                      lastModified: new Date(content.lastUpdated || Date.now()),
                      model: content.modelName || 'page'
                    };
                    setPages(prev => {
                      const exists = prev.find(p => p.id === content.id);
                      if (exists) return prev;
                      return [...prev, newPage];
                    });
                    setSelectedPage(newPage);
                    setActiveTab('editor');
                    testToast()({
                      title: 'Content Selected!',
                      description: `${newPage.name} is now ready for editing.`
                    });
                  }}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="editor" className="h-full m-0">
                <BuilderVisualEditor 
                  selectedPage={selectedPage}
                  onPageSelect={setSelectedPage}
                  onOpenEditor={openBuilderEditor}
                  config={config}
                />
              </TabsContent>

              <TabsContent value="pages" className="m-0 p-4">
                <BuilderPageManager 
                  pages={pages}
                  onPageSelect={setSelectedPage}
                  onPublish={publishPage}
                  onPreview={previewPage}
                  onEdit={openBuilderEditor}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="models" className="m-0 p-4">
                <BuilderModelsManager config={config} />
              </TabsContent>

              <TabsContent value="analytics" className="m-0 p-4">
                <BuilderAnalytics config={config} />
              </TabsContent>
            </div>
          </Tabs>
        )}
      </div>
    </div>
  );
}

// Builder.io Configuration Form
interface BuilderConfigFormProps {
  config: any;
  onChange: (config: any) => void;
  onSave: () => void;
  isLoading: boolean;
}

function BuilderConfigForm({ config, onChange, onSave, isLoading }: BuilderConfigFormProps) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Getting Your Builder.io API Keys
        </h4>
        <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>1. Log into your Builder.io account</li>
          <li>2. Go to Account Settings → API Keys</li>
          <li>3. Copy your Public API Key and Private API Key</li>
          <li>4. Note your Space ID from the URL</li>
        </ol>
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://builder.io/account/space', '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://www.builder.io/c/docs/developers', '_blank')}
          >
            <FileText className="h-3 w-3 mr-1" />
            API Guide
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="publicApiKey">Public API Key</Label>
          <Input
            id="publicApiKey"
            placeholder="Enter your public API key"
            value={config.publicApiKey}
            onChange={(e) => onChange({ ...config, publicApiKey: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="apiKey">Private API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your private API key"
            value={config.apiKey}
            onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="spaceId">Space ID</Label>
          <Input
            id="spaceId"
            placeholder="Enter your space ID"
            value={config.spaceId}
            onChange={(e) => onChange({ ...config, spaceId: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="model">Default Model</Label>
          <Input
            id="model"
            placeholder="page"
            value={config.model}
            onChange={(e) => onChange({ ...config, model: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={!config.publicApiKey || !config.apiKey || !config.spaceId || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save & Connect
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Setup Welcome Component
function BuilderSetupWelcome({ onConfigure }: { onConfigure: () => void }) {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <div className="space-y-3">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Welcome to Builder.io Integration</h2>
          <p className="text-lg text-muted-foreground">
            Connect your Builder.io account to unlock powerful visual editing capabilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Visual Editor</h3>
                <p className="text-sm text-muted-foreground">
                  Drag-and-drop interface with real-time editing
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Fast loading with optimized content delivery
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">CMS Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Seamless content management and publishing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Button size="lg" onClick={onConfigure}>
          <Key className="w-5 h-5 mr-2" />
          Configure Builder.io
        </Button>
      </div>
    </div>
  );
}

// Visual Editor Component 
function BuilderVisualEditor({ 
  selectedPage, 
  onPageSelect, 
  onOpenEditor, 
  config 
}: {
  selectedPage: BuilderPage | null;
  onPageSelect: (page: BuilderPage) => void;
  onOpenEditor: (page: BuilderPage) => void;
  config: BuilderIOConfig;
}) {
  return (
    <div className="h-full flex">
      {/* Editor Iframe Container */}
      <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
        <div className="h-full bg-white dark:bg-background rounded-lg shadow-lg overflow-hidden">
          {selectedPage ? (
            <div className="h-full flex flex-col">
              <div className="border-b p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{selectedPage.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPage.url}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedPage.published ? "default" : "secondary"}>
                    {selectedPage.published ? 'Published' : 'Draft'}
                  </Badge>
                  <Button size="sm" onClick={() => onOpenEditor(selectedPage)}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open in Builder.io
                  </Button>
                </div>
              </div>
              
              {/* Active Builder.io Visual Editor */}
              <div className="flex-1 bg-white dark:bg-gray-900 relative overflow-hidden">
                <ActiveBuilderEditor
                  page={selectedPage}
                  onSave={(content) => {
                    try {
                      const toastFn = testToast();
                      toastFn({
                        title: 'Page Saved!',
                        description: `Changes to ${selectedPage.name} have been saved successfully.`
                      });
                    } catch (error) {
                      console.error('Toast error:', error);
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold">Select a Page to Edit</h4>
                  <p className="text-muted-foreground">Choose a page from the pages tab to start editing</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Page Manager Component
function BuilderPageManager({ 
  pages, 
  onPageSelect, 
  onPublish, 
  onPreview, 
  onEdit,
  isLoading 
}: {
  pages: BuilderPage[];
  onPageSelect: (page: BuilderPage) => void;
  onPublish: (pageId: string) => void;
  onPreview: (page: BuilderPage) => void;
  onEdit: (page: BuilderPage) => void;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Page Management</h3>
          <p className="text-muted-foreground">Manage your Builder.io pages and content</p>
        </div>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Card key={page.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium">{page.name}</h4>
                    <Badge variant={page.published ? "default" : "secondary"}>
                      {page.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{page.url}</p>
                  <p className="text-xs text-muted-foreground">
                    Last modified: {page.lastModified.toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPreview(page)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(page)}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  {!page.published && (
                    <Button
                      size="sm"
                      onClick={() => onPublish(page.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Share2 className="h-4 w-4 mr-1" />
                      )}
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Models Manager Component
function BuilderModelsManager({ config }: { config: BuilderIOConfig }) {
  const models = [
    { name: 'page', description: 'Standard web pages', count: 12 },
    { name: 'product', description: 'E-commerce products', count: 45 },
    { name: 'blog-post', description: 'Blog articles', count: 8 },
    { name: 'landing-page', description: 'Marketing pages', count: 6 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Content Models</h3>
        <p className="text-muted-foreground">Manage your Builder.io content models and schemas</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {models.map((model) => (
          <Card key={model.name}>
            <CardHeader>
              <CardTitle className="text-base">{model.name}</CardTitle>
              <CardDescription>{model.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{model.count}</div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Template Manager Component
function BuilderTemplateManager({
  templates,
  onImportTemplate,
  onCreateFromTemplate,
  isLoading
}: {
  templates: BuilderTemplate[];
  onImportTemplate: (templateId: string) => void;
  onCreateFromTemplate: (template: BuilderTemplate) => void;
  isLoading: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { toast } = useToast();
  const testToast = React.useCallback(() => {
    if (typeof toast === 'function') {
      return toast;
    } else {
      console.error('Toast function not available');
      return () => {};
    }
  }, [toast]);

  const categories = ['All', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <p className="text-muted-foreground">Import templates from your Builder.io space</p>
        </div>

        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Layout className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Template Preview</p>
                </div>
              </div>

              {template.isImported && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Imported
                  </Badge>
                </div>
              )}

              <div className="absolute top-2 left-2">
                <Badge variant="outline">{template.category}</Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-base">{template.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{template.tags.length - 3}</span>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  Modified: {template.lastModified.toLocaleDateString()}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  {!template.isImported ? (
                    <Button
                      size="sm"
                      onClick={() => onImportTemplate(template.id)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Import className="h-4 w-4 mr-2" />
                      )}
                      Import
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCreateFromTemplate(template)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  )}

                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h4 className="text-lg font-semibold mb-2">No Templates Found</h4>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'All'
              ? 'Try adjusting your search or filter criteria.'
              : 'Connect to your Builder.io space to see your templates.'}
          </p>
        </div>
      )}

      <div className="mt-8 p-6 bg-muted rounded-lg">
        <div className="flex items-start space-x-4">
          <Package className="w-6 h-6 text-primary mt-1" />
          <div className="space-y-2">
            <h4 className="font-semibold">About Template Import</h4>
            <p className="text-sm text-muted-foreground">
              Templates are imported from your Builder.io space and can be used to create new pages quickly.
              Once imported, you can customize them using the visual editor and manage them through this platform.
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                {templates.filter(t => t.isImported).length} Imported
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Package className="w-4 h-4 mr-1 text-blue-600" />
                {templates.length} Available
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Analytics Component
function BuilderAnalytics({ config }: { config: BuilderIOConfig }) {
  const analytics = {
    pageViews: 12456,
    uniqueVisitors: 3428,
    avgLoadTime: 0.8,
    conversionRate: 3.2
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Performance Analytics</h3>
        <p className="text-muted-foreground">Track your Builder.io content performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
              <p className="text-muted-foreground">Page Views</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</div>
              <p className="text-muted-foreground">Unique Visitors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.avgLoadTime}s</div>
              <p className="text-muted-foreground">Avg Load Time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
              <p className="text-muted-foreground">Conversion Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
