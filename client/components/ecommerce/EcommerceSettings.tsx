import React, { useState } from 'react';
import { useEcommerce } from '@/contexts/EcommerceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  CreditCard,
  Truck,
  Calculator,
  Mail,
  Store,
  Shield,
  Globe,
  Key,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function EcommerceSettings() {
  const { settings, updateSettings } = useEcommerce();
  const [activeTab, setActiveTab] = useState('general');

  const handleStoreSettingsUpdate = (field: string, value: any) => {
    updateSettings({
      [field]: value
    });
  };

  const handlePaymentGatewayUpdate = (gatewayId: string, field: string, value: any) => {
    const updatedGateways = settings.paymentGateways.map(gateway =>
      gateway.id === gatewayId ? { ...gateway, [field]: value } : gateway
    );
    updateSettings({ paymentGateways: updatedGateways });
  };

  const handleShippingProviderUpdate = (providerId: string, field: string, value: any) => {
    const updatedProviders = settings.shippingProviders.map(provider =>
      provider.id === providerId ? { ...provider, [field]: value } : provider
    );
    updateSettings({ shippingProviders: updatedProviders });
  };

  const handleTaxSettingsUpdate = (field: string, value: any) => {
    updateSettings({
      taxSettings: { ...settings.taxSettings, [field]: value }
    });
  };

  const handleEmailNotificationUpdate = (field: string, value: boolean) => {
    updateSettings({
      emailNotifications: { ...settings.emailNotifications, [field]: value }
    });
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Store },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'taxes', label: 'Taxes', icon: Calculator },
    { id: 'notifications', label: 'Notifications', icon: Mail }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">E-commerce Settings</h2>
        <p className="text-muted-foreground">
          Configure your store settings, payment gateways, and integrations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="h-5 w-5 mr-2" />
                Store Information
              </CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => handleStoreSettingsUpdate('storeName', e.target.value)}
                    placeholder="Your Store Name"
                  />
                </div>
                <div>
                  <Label htmlFor="storeUrl">Store URL</Label>
                  <Input
                    id="storeUrl"
                    value={settings.storeUrl}
                    onChange={(e) => handleStoreSettingsUpdate('storeUrl', e.target.value)}
                    placeholder="yourstore.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.currency} 
                    onValueChange={(value) => handleStoreSettingsUpdate('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weightUnit">Weight Unit</Label>
                  <Select 
                    value={settings.weightUnit} 
                    onValueChange={(value: any) => handleStoreSettingsUpdate('weightUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lb">Pounds (lb)</SelectItem>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid gap-6">
            {settings.paymentGateways.map((gateway) => (
              <Card key={gateway.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      {gateway.name.charAt(0).toUpperCase() + gateway.name.slice(1)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={gateway.enabled}
                        onCheckedChange={(checked) => 
                          handlePaymentGatewayUpdate(gateway.id, 'enabled', checked)
                        }
                      />
                      {gateway.enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Configure {gateway.name} payment processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`${gateway.id}-apiKey`}>API Key</Label>
                      <Input
                        id={`${gateway.id}-apiKey`}
                        type="password"
                        value={gateway.apiKey}
                        onChange={(e) => 
                          handlePaymentGatewayUpdate(gateway.id, 'apiKey', e.target.value)
                        }
                        placeholder="Enter API key"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${gateway.id}-secretKey`}>Secret Key</Label>
                      <Input
                        id={`${gateway.id}-secretKey`}
                        type="password"
                        value={gateway.secretKey}
                        onChange={(e) => 
                          handlePaymentGatewayUpdate(gateway.id, 'secretKey', e.target.value)
                        }
                        placeholder="Enter secret key"
                      />
                    </div>
                  </div>
                  {gateway.webhookSecret !== undefined && (
                    <div>
                      <Label htmlFor={`${gateway.id}-webhookSecret`}>Webhook Secret</Label>
                      <Input
                        id={`${gateway.id}-webhookSecret`}
                        type="password"
                        value={gateway.webhookSecret}
                        onChange={(e) => 
                          handlePaymentGatewayUpdate(gateway.id, 'webhookSecret', e.target.value)
                        }
                        placeholder="Enter webhook secret"
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={gateway.testMode}
                      onCheckedChange={(checked) => 
                        handlePaymentGatewayUpdate(gateway.id, 'testMode', checked)
                      }
                    />
                    <Label>Test Mode</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping" className="space-y-6">
          <div className="grid gap-6">
            {settings.shippingProviders.map((provider) => (
              <Card key={provider.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      {provider.name.toUpperCase()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={provider.enabled}
                        onCheckedChange={(checked) => 
                          handleShippingProviderUpdate(provider.id, 'enabled', checked)
                        }
                      />
                      {provider.enabled ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Configure {provider.name.toUpperCase()} shipping integration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`${provider.id}-apiKey`}>API Key</Label>
                      <Input
                        id={`${provider.id}-apiKey`}
                        type="password"
                        value={provider.apiKey}
                        onChange={(e) => 
                          handleShippingProviderUpdate(provider.id, 'apiKey', e.target.value)
                        }
                        placeholder="Enter API key"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${provider.id}-accountNumber`}>Account Number</Label>
                      <Input
                        id={`${provider.id}-accountNumber`}
                        value={provider.accountNumber || ''}
                        onChange={(e) => 
                          handleShippingProviderUpdate(provider.id, 'accountNumber', e.target.value)
                        }
                        placeholder="Enter account number"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={provider.testMode}
                      onCheckedChange={(checked) => 
                        handleShippingProviderUpdate(provider.id, 'testMode', checked)
                      }
                    />
                    <Label>Test Mode</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="taxes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Tax Configuration
              </CardTitle>
              <CardDescription>
                Configure tax calculations for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.taxSettings.enabled}
                  onCheckedChange={(checked) => handleTaxSettingsUpdate('enabled', checked)}
                />
                <Label>Enable tax calculations</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.taxSettings.includedInPrices}
                  onCheckedChange={(checked) => handleTaxSettingsUpdate('includedInPrices', checked)}
                />
                <Label>Tax included in prices</Label>
              </div>

              <div>
                <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                <Input
                  id="defaultTaxRate"
                  type="number"
                  step="0.01"
                  value={settings.taxSettings.defaultRate}
                  onChange={(e) => handleTaxSettingsUpdate('defaultRate', parseFloat(e.target.value))}
                  placeholder="8.00"
                />
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Tax Regions</h4>
                {settings.taxSettings.regions.map((region) => (
                  <div key={region.id} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>Region Name</Label>
                        <Input value={region.name} readOnly />
                      </div>
                      <div>
                        <Label>Location</Label>
                        <Input value={`${region.state ? region.state + ', ' : ''}${region.country}`} readOnly />
                      </div>
                      <div>
                        <Label>Tax Rate (%)</Label>
                        <Input value={region.rate} readOnly />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline">
                  <Calculator className="h-4 w-4 mr-2" />
                  Add Tax Region
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Configure automated email notifications for your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Order Confirmation</h4>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation emails when orders are placed
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications.orderConfirmation}
                    onCheckedChange={(checked) => 
                      handleEmailNotificationUpdate('orderConfirmation', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Order Shipped</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify customers when their orders are shipped
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications.orderShipped}
                    onCheckedChange={(checked) => 
                      handleEmailNotificationUpdate('orderShipped', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Abandoned Cart Recovery</h4>
                    <p className="text-sm text-muted-foreground">
                      Send emails to recover abandoned shopping carts
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications.abandonedCart}
                    onCheckedChange={(checked) => 
                      handleEmailNotificationUpdate('abandonedCart', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Low Inventory Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Get notified when product inventory is running low
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications.lowInventory}
                    onCheckedChange={(checked) => 
                      handleEmailNotificationUpdate('lowInventory', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
