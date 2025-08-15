import React from 'react';
import { useEcommerce } from '@/contexts/EcommerceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Target,
  Calendar,
  MapPin
} from 'lucide-react';

export function EcommerceAnalytics() {
  const { getAnalytics, products, orders, customers } = useEcommerce();
  const analytics = getAnalytics();

  // Calculate additional metrics
  const conversionRate = customers.length > 0 ? (orders.length / customers.length * 100) : 0;
  const returningCustomers = customers.filter(c => c.orders.length > 1).length;
  const returningCustomerRate = customers.length > 0 ? (returningCustomers / customers.length * 100) : 0;
  
  const lowStockProducts = products.filter(product => 
    product.variants.some(variant => variant.inventory < 10)
  );

  const topSellingProducts = products
    .sort((a, b) => b.variants.reduce((sum, v) => sum + v.inventory, 0) - 
                    a.variants.reduce((sum, v) => sum + v.inventory, 0))
    .slice(0, 5);

  const recentOrdersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyRevenue = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 18200 },
    { month: 'Apr', revenue: 22100 },
    { month: 'May', revenue: 19500 },
    { month: 'Jun', revenue: 25300 }
  ];

  const keyMetrics = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'Total sales revenue'
    },
    {
      title: 'Total Orders',
      value: analytics.totalOrders.toString(),
      change: '+23.1%',
      trend: 'up',
      icon: ShoppingCart,
      description: 'Number of orders placed'
    },
    {
      title: 'Average Order Value',
      value: `$${analytics.averageOrderValue.toFixed(2)}`,
      change: '-2.4%',
      trend: 'down',
      icon: Target,
      description: 'Average value per order'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+5.2%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Visitors to customers'
    },
    {
      title: 'Total Customers',
      value: analytics.totalCustomers.toString(),
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      description: 'Registered customers'
    },
    {
      title: 'Returning Customers',
      value: `${returningCustomerRate.toFixed(1)}%`,
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      description: 'Customers with repeat orders'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics & Insights</h2>
        <p className="text-muted-foreground">
          Track your store performance and identify growth opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className={`text-xs flex items-center ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.change} from last month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary/10">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyRevenue.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(data.revenue / 25300) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">${data.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(recentOrdersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      status === 'delivered' ? 'bg-green-500' :
                      status === 'shipped' ? 'bg-blue-500' :
                      status === 'processing' ? 'bg-yellow-500' :
                      status === 'pending' ? 'bg-orange-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm capitalize">{status}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Top Products
            </CardTitle>
            <CardDescription>Best performing products by inventory turnover</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-muted-foreground w-6">
                    #{index + 1}
                  </div>
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {product.variants.reduce((sum, v) => sum + v.inventory, 0)} units
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${Math.min(...product.variants.map(v => v.price)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Customers
            </CardTitle>
            <CardDescription>Latest customer registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${customer.totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {customer.orders.length} order{customer.orders.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Alerts */}
      {lowStockProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-orange-600">
              <Package className="h-5 w-5 mr-2" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>Products that need restocking soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg border-orange-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-orange-600">
                      {Math.min(...product.variants.map(v => v.inventory))} units left
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key recommendations to improve your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Revenue Growth</h4>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                Your revenue has increased by 12.5% this month. Consider expanding your top-selling product categories.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100">Customer Retention</h4>
              <p className="text-sm text-green-700 dark:text-green-200 mt-1">
                {returningCustomerRate.toFixed(1)}% of your customers are returning buyers. Consider implementing a loyalty program.
              </p>
            </div>
            {lowStockProducts.length > 0 && (
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-100">Inventory Management</h4>
                <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">
                  {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} running low on stock. Restock soon to avoid stockouts.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
