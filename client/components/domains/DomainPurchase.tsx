import React, { useState } from 'react';
import { useDomain } from '@/contexts/DomainContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  ShoppingCart,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  Loader2,
  ExternalLink,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function DomainPurchase() {
  const { searchDomains, purchaseDomain, domainProviders } = useDomain();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedRegistrar, setSelectedRegistrar] = useState<string>('godaddy');
  const [registrationYears, setRegistrationYears] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchDomains(searchQuery.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Domain search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedDomain || !selectedRegistrar) return;
    
    setIsPurchasing(true);
    try {
      await purchaseDomain(selectedDomain, selectedRegistrar, registrationYears);
      setPurchaseSuccess(true);
      setSelectedDomain('');
      setSearchResults([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Domain purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  const getDomainPrice = (domain: string, registrar: string) => {
    const basePrice = 12.99;
    const registrarMultiplier = {
      'godaddy': 1.0,
      'namecheap': 0.9,
      'cloudflare': 0.8
    };
    
    const tldMultiplier = {
      '.com': 1.0,
      '.net': 1.1,
      '.org': 0.9,
      '.io': 2.5,
      '.co': 1.8
    };
    
    const tld = domain.substring(domain.lastIndexOf('.'));
    return (basePrice * (registrarMultiplier[registrar as keyof typeof registrarMultiplier] || 1.0) * (tldMultiplier[tld as keyof typeof tldMultiplier] || 1.0)).toFixed(2);
  };

  const getRegistrarInfo = (registrar: string) => {
    const info = {
      'godaddy': {
        name: 'GoDaddy',
        description: 'World\'s largest domain registrar',
        features: ['24/7 Support', 'Domain Privacy', 'Easy Management'],
        color: 'bg-green-50 text-green-700'
      },
      'namecheap': {
        name: 'Namecheap',
        description: 'Affordable domains with great service',
        features: ['Free WHOIS Guard', 'Free DNS', 'Great Support'],
        color: 'bg-orange-50 text-orange-700'
      },
      'cloudflare': {
        name: 'Cloudflare',
        description: 'Domains at cost with powerful DNS',
        features: ['At-cost Pricing', 'Advanced DNS', 'Security Features'],
        color: 'bg-blue-50 text-blue-700'
      }
    };
    
    return info[registrar as keyof typeof info] || info.godaddy;
  };

  const popularDomains = [
    'mystore.com',
    'shopnow.com',
    'bestseller.com',
    'luxuryshop.com',
    'quickbuy.com',
    'premiumstore.com'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Domain Purchase</h2>
        <p className="text-muted-foreground">
          Search and purchase domains from leading registrars
        </p>
      </div>

      {/* Domain Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Domain Search
          </CardTitle>
          <CardDescription>
            Search for available domains across all extensions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                placeholder="Enter your domain name (e.g., mystore)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {/* Popular Suggestions */}
          <div>
            <p className="text-sm font-medium mb-2">Popular suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {popularDomains.map((domain) => (
                <Button
                  key={domain}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(domain.split('.')[0])}
                >
                  {domain}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Search Results</h3>
              <div className="grid gap-3">
                {searchResults.map((domain) => (
                  <div key={domain} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{domain}</p>
                          <p className="text-sm text-muted-foreground">Available for registration</p>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="font-medium">${getDomainPrice(domain, selectedRegistrar)}/year</p>
                          <p className="text-xs text-muted-foreground">Starting price</p>
                        </div>
                        <Button
                          onClick={() => setSelectedDomain(domain)}
                          variant={selectedDomain === domain ? "default" : "outline"}
                        >
                          {selectedDomain === domain ? 'Selected' : 'Select'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purchase Configuration */}
      {selectedDomain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Purchase Configuration
            </CardTitle>
            <CardDescription>
              Configure your domain purchase for {selectedDomain}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Registrar Selection */}
            <div>
              <Label className="text-base font-medium">Choose Registrar</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {['godaddy', 'namecheap', 'cloudflare'].map((registrar) => {
                  const info = getRegistrarInfo(registrar);
                  const isEnabled = domainProviders.find(p => p.name === registrar)?.enabled;
                  
                  return (
                    <div
                      key={registrar}
                      className={cn(
                        "border rounded-lg p-4 cursor-pointer transition-all",
                        selectedRegistrar === registrar 
                          ? "border-primary bg-primary/5" 
                          : "border-muted-foreground/20 hover:border-muted-foreground/40",
                        !isEnabled && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => isEnabled && setSelectedRegistrar(registrar)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{info.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className={info.color}>
                            ${getDomainPrice(selectedDomain, registrar)}
                          </Badge>
                          {!isEnabled && (
                            <Badge variant="outline" className="text-red-600">
                              Setup Required
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                      <div className="space-y-1">
                        {info.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registration Period */}
            <div>
              <Label htmlFor="years">Registration Period</Label>
              <Select value={registrationYears.toString()} onValueChange={(value) => setRegistrationYears(parseInt(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 5, 10].map((years) => (
                    <SelectItem key={years} value={years.toString()}>
                      {years} year{years > 1 ? 's' : ''} - ${(parseFloat(getDomainPrice(selectedDomain, selectedRegistrar)) * years).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purchase Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Purchase Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Domain:</span>
                  <span className="font-medium">{selectedDomain}</span>
                </div>
                <div className="flex justify-between">
                  <span>Registrar:</span>
                  <span className="font-medium">{getRegistrarInfo(selectedRegistrar).name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Period:</span>
                  <span className="font-medium">{registrationYears} year{registrationYears > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per year:</span>
                  <span className="font-medium">${getDomainPrice(selectedDomain, selectedRegistrar)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium text-lg">
                  <span>Total:</span>
                  <span>${(parseFloat(getDomainPrice(selectedDomain, selectedRegistrar)) * registrationYears).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handlePurchase} 
                disabled={isPurchasing || !domainProviders.find(p => p.name === selectedRegistrar)?.enabled}
                className="flex-1"
              >
                {isPurchasing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Purchase...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase Domain
                  </>
                )}
              </Button>
              {!domainProviders.find(p => p.name === selectedRegistrar)?.enabled && (
                <Button variant="outline" onClick={() => {}}>
                  Setup {getRegistrarInfo(selectedRegistrar).name}
                </Button>
              )}
            </div>

            {/* Provider Setup Warning */}
            {!domainProviders.find(p => p.name === selectedRegistrar)?.enabled && (
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                      Provider Setup Required
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Configure your {getRegistrarInfo(selectedRegistrar).name} API credentials in the Providers tab to enable domain purchasing.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={purchaseSuccess} onOpenChange={setPurchaseSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Domain Purchase Successful!</span>
            </DialogTitle>
            <DialogDescription>
              Your domain {selectedDomain} has been successfully registered and is being configured.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Next Steps:</h4>
              <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                <li>• Domain verification will be completed within 24 hours</li>
                <li>• DNS configuration will be available shortly</li>
                <li>• SSL certificate can be set up once verified</li>
              </ul>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setPurchaseSuccess(false)} className="flex-1">
                Continue
              </Button>
              <Button variant="outline">
                Manage Domain
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
