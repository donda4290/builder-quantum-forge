import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Globe,
  ShoppingCart,
  Plug,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  Plus,
  Zap,
  Shield,
  Palette,
  Code,
  Smartphone,
  Search,
  CreditCard,
  Package,
  MessageSquare
} from 'lucide-react';

export default function Index() {
  const { currentWorkspace, user } = useAuth();

  if (!currentWorkspace || !user) {
    return null;
  }

  const quickActions = [
    {
      title: 'Create New Page',
      description: 'Add a new page to your website',
      icon: Plus,
      href: '/builder',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Add Product',
      description: 'Add products to your store',
      icon: Package,
      href: '/ecommerce/products',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Configure Domain',
      description: 'Set up your custom domain',
      icon: Globe,
      href: '/domains',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      title: 'View Analytics',
      description: 'Check your website performance',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    }
  ];

  const platformFeatures = [
    {
      title: 'Visual Website Builder',
      description: 'Drag-and-drop builder with professional templates',
      icon: Building2,
      href: '/builder',
      status: 'active'
    },
    {
      title: 'Domain Management',
      description: 'Custom domains with SSL certificates',
      icon: Globe,
      href: '/domains',
      status: currentWorkspace.domain ? 'configured' : 'pending'
    },
    {
      title: 'E-commerce Tools',
      description: 'Product catalogs, shopping carts, and payments',
      icon: ShoppingCart,
      href: '/ecommerce',
      status: 'active'
    },
    {
      title: 'API Integrations',
      description: 'Connect with third-party services and tools',
      icon: Plug,
      href: '/integrations',
      status: 'available'
    },
    {
      title: 'Analytics & Insights',
      description: 'Track performance and user behavior',
      icon: BarChart3,
      href: '/analytics',
      status: 'active'
    },
    {
      title: 'SEO Optimization',
      description: 'Built-in SEO tools and optimization',
      icon: Search,
      href: '/seo',
      status: 'active'
    }
  ];

  const designFeatures = [
    { icon: Palette, title: 'Custom Themes', description: 'Brand-aligned design systems' },
    { icon: Smartphone, title: 'Mobile Responsive', description: 'Optimized for all devices' },
    { icon: Zap, title: 'Fast Loading', description: 'Optimized performance' },
    { icon: Shield, title: 'Secure & Reliable', description: 'Enterprise-grade security' }
  ];

  const ecommerceFeatures = [
    { icon: Package, title: 'Product Catalog', description: 'Manage unlimited products' },
    { icon: CreditCard, title: 'Payment Processing', description: 'Secure payment gateways' },
    { icon: Users, title: 'Customer Management', description: 'CRM and customer insights' },
    { icon: MessageSquare, title: 'Order Management', description: 'Streamlined fulfillment' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'configured':
        return 'bg-success text-success-foreground';
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'configured':
        return 'Configured';
      case 'active':
        return 'Active';
      case 'pending':
        return 'Setup Required';
      case 'available':
        return 'Available';
      default:
        return 'Available';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.name.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage and grow your e-commerce platform for <strong>{currentWorkspace.name}</strong>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span>Live</span>
          </Badge>
          {currentWorkspace.domain && (
            <Button variant="outline" asChild>
              <a href={`https://${currentWorkspace.domain}`} target="_blank" rel="noopener noreferrer">
                Visit Site
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +0.5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.bgColor}`}>
                      <action.icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Features Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feature) => (
            <Link key={feature.title} to={feature.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-8 w-8 text-primary" />
                    <Badge className={getStatusColor(feature.status)}>
                      {getStatusText(feature.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Design & Customization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5" />
              <span>Design & Customization</span>
            </CardTitle>
            <CardDescription>
              Create stunning, brand-aligned websites with our advanced design tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {designFeatures.map((feature) => (
              <div key={feature.title} className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* E-commerce Capabilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <span>E-commerce Capabilities</span>
            </CardTitle>
            <CardDescription>
              Everything you need to sell online and manage your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ecommerceFeatures.map((feature) => (
              <div key={feature.title} className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <feature.icon className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Setup Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Progress</CardTitle>
          <CardDescription>
            Complete these steps to get the most out of your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Platform Setup</span>
              <span>75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-sm">Website builder configured</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-sm">Payment gateway connected</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-sm">Analytics tracking enabled</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span className="text-sm">Custom domain setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted"></div>
                <span className="text-sm">Email marketing integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted"></div>
                <span className="text-sm">SEO optimization complete</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
