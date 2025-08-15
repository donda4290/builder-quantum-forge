import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Domain {
  id: string;
  name: string;
  registrar: 'godaddy' | 'namecheap' | 'cloudflare' | 'custom';
  status: 'pending' | 'active' | 'expired' | 'suspended' | 'transferring';
  registrationDate: string;
  expirationDate: string;
  autoRenew: boolean;
  verified: boolean;
  sslStatus: 'none' | 'pending' | 'active' | 'expired' | 'error';
  deploymentStatus: 'none' | 'staging' | 'deploying' | 'live' | 'error';
  dnsConfigured: boolean;
  cdnEnabled: boolean;
  price: number;
  currency: string;
  workspaceId: string;
}

export interface DNSRecord {
  id: string;
  domainId: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV';
  name: string;
  value: string;
  ttl: number;
  priority?: number;
  status: 'active' | 'pending' | 'error';
}

export interface Subdomain {
  id: string;
  domainId: string;
  name: string;
  target: string;
  type: 'subdirectory' | 'redirect' | 'custom';
  sslEnabled: boolean;
  status: 'active' | 'pending' | 'error';
}

export interface DomainRedirect {
  id: string;
  domainId: string;
  from: string;
  to: string;
  type: '301' | '302' | '307';
  status: 'active' | 'pending' | 'error';
}

export interface SSLCertificate {
  id: string;
  domainId: string;
  provider: 'letsencrypt' | 'cloudflare' | 'custom';
  status: 'pending' | 'active' | 'expired' | 'error';
  issuedDate: string;
  expirationDate: string;
  autoRenew: boolean;
  wildcard: boolean;
}

export interface DeploymentEnvironment {
  id: string;
  domainId: string;
  name: string;
  type: 'staging' | 'production';
  url: string;
  branch: string;
  lastDeployment: string;
  status: 'inactive' | 'building' | 'ready' | 'error';
  buildLogs: string[];
}

export interface HostingSettings {
  id: string;
  domainId: string;
  cdnEnabled: boolean;
  compressionEnabled: boolean;
  cacheSettings: {
    browserCache: number;
    cdnCache: number;
    staticAssets: number;
  };
  performanceOptimization: {
    minification: boolean;
    imageOptimization: boolean;
    lazy Loading: boolean;
  };
  securityHeaders: {
    hsts: boolean;
    contentSecurityPolicy: boolean;
    xFrameOptions: boolean;
  };
}

export interface DomainProvider {
  id: string;
  name: 'godaddy' | 'namecheap' | 'cloudflare';
  apiKey: string;
  apiSecret: string;
  testMode: boolean;
  enabled: boolean;
}

interface DomainContextType {
  // Domains
  domains: Domain[];
  selectedDomain: Domain | null;
  availableDomains: string[];
  
  // DNS
  dnsRecords: DNSRecord[];
  
  // Subdomains
  subdomains: Subdomain[];
  
  // Redirects
  redirects: DomainRedirect[];
  
  // SSL
  sslCertificates: SSLCertificate[];
  
  // Deployment
  deploymentEnvironments: DeploymentEnvironment[];
  
  // Hosting
  hostingSettings: HostingSettings[];
  
  // Providers
  domainProviders: DomainProvider[];
  
  // Domain actions
  searchDomains: (query: string) => Promise<string[]>;
  purchaseDomain: (domain: string, registrar: string, years: number) => Promise<void>;
  selectDomain: (domain: Domain | null) => void;
  updateDomain: (domainId: string, updates: Partial<Domain>) => void;
  deleteDomain: (domainId: string) => void;
  verifyDomain: (domainId: string) => Promise<boolean>;
  
  // DNS actions
  createDNSRecord: (domainId: string, record: Omit<DNSRecord, 'id' | 'domainId' | 'status'>) => void;
  updateDNSRecord: (recordId: string, updates: Partial<DNSRecord>) => void;
  deleteDNSRecord: (recordId: string) => void;
  
  // Subdomain actions
  createSubdomain: (domainId: string, subdomain: Omit<Subdomain, 'id' | 'domainId' | 'status'>) => void;
  updateSubdomain: (subdomainId: string, updates: Partial<Subdomain>) => void;
  deleteSubdomain: (subdomainId: string) => void;
  
  // Redirect actions
  createRedirect: (domainId: string, redirect: Omit<DomainRedirect, 'id' | 'domainId' | 'status'>) => void;
  updateRedirect: (redirectId: string, updates: Partial<DomainRedirect>) => void;
  deleteRedirect: (redirectId: string) => void;
  
  // SSL actions
  setupSSL: (domainId: string, provider: string, wildcard?: boolean) => Promise<void>;
  renewSSL: (certificateId: string) => Promise<void>;
  
  // Deployment actions
  createEnvironment: (domainId: string, environment: Omit<DeploymentEnvironment, 'id' | 'domainId' | 'status'>) => void;
  deployWebsite: (environmentId: string) => Promise<void>;
  rollbackDeployment: (environmentId: string, deploymentId: string) => Promise<void>;
  
  // Hosting actions
  updateHostingSettings: (domainId: string, settings: Partial<HostingSettings>) => void;
  
  // Provider actions
  updateProvider: (providerId: string, updates: Partial<DomainProvider>) => void;
}

const DomainContext = createContext<DomainContextType | undefined>(undefined);

export function useDomain() {
  const context = useContext(DomainContext);
  if (context === undefined) {
    throw new Error('useDomain must be used within a DomainProvider');
  }
  return context;
}

// Mock data
const mockDomains: Domain[] = [
  {
    id: 'domain-1',
    name: 'luxuryfashion.com',
    registrar: 'godaddy',
    status: 'active',
    registrationDate: '2024-01-15T00:00:00Z',
    expirationDate: '2025-01-15T00:00:00Z',
    autoRenew: true,
    verified: true,
    sslStatus: 'active',
    deploymentStatus: 'live',
    dnsConfigured: true,
    cdnEnabled: true,
    price: 12.99,
    currency: 'USD',
    workspaceId: 'workspace-1'
  },
  {
    id: 'domain-2',
    name: 'techgadgets.shop',
    registrar: 'namecheap',
    status: 'active',
    registrationDate: '2024-01-10T00:00:00Z',
    expirationDate: '2025-01-10T00:00:00Z',
    autoRenew: true,
    verified: true,
    sslStatus: 'active',
    deploymentStatus: 'staging',
    dnsConfigured: true,
    cdnEnabled: false,
    price: 15.99,
    currency: 'USD',
    workspaceId: 'workspace-2'
  }
];

const mockDNSRecords: DNSRecord[] = [
  {
    id: 'dns-1',
    domainId: 'domain-1',
    type: 'A',
    name: '@',
    value: '192.168.1.1',
    ttl: 3600,
    status: 'active'
  },
  {
    id: 'dns-2',
    domainId: 'domain-1',
    type: 'CNAME',
    name: 'www',
    value: 'luxuryfashion.com',
    ttl: 3600,
    status: 'active'
  }
];

const mockProviders: DomainProvider[] = [
  {
    id: 'godaddy',
    name: 'godaddy',
    apiKey: '',
    apiSecret: '',
    testMode: true,
    enabled: false
  },
  {
    id: 'namecheap',
    name: 'namecheap',
    apiKey: '',
    apiSecret: '',
    testMode: true,
    enabled: false
  },
  {
    id: 'cloudflare',
    name: 'cloudflare',
    apiKey: '',
    apiSecret: '',
    testMode: true,
    enabled: false
  }
];

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [availableDomains, setAvailableDomains] = useState<string[]>([]);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>(mockDNSRecords);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [redirects, setRedirects] = useState<DomainRedirect[]>([]);
  const [sslCertificates, setSslCertificates] = useState<SSLCertificate[]>([]);
  const [deploymentEnvironments, setDeploymentEnvironments] = useState<DeploymentEnvironment[]>([]);
  const [hostingSettings, setHostingSettings] = useState<HostingSettings[]>([]);
  const [domainProviders, setDomainProviders] = useState<DomainProvider[]>(mockProviders);

  // Domain actions
  const searchDomains = useCallback(async (query: string): Promise<string[]> => {
    // Simulate API call to domain registrar
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      `${query}.com`,
      `${query}.net`,
      `${query}.org`,
      `${query}.io`,
      `${query}.co`
    ];
  }, []);

  const purchaseDomain = useCallback(async (domain: string, registrar: string, years: number) => {
    // Simulate domain purchase
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDomain: Domain = {
      id: `domain-${Date.now()}`,
      name: domain,
      registrar: registrar as any,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + years * 365 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true,
      verified: false,
      sslStatus: 'none',
      deploymentStatus: 'none',
      dnsConfigured: false,
      cdnEnabled: false,
      price: 12.99 * years,
      currency: 'USD',
      workspaceId: 'current-workspace'
    };

    setDomains(prev => [...prev, newDomain]);
  }, []);

  const selectDomain = useCallback((domain: Domain | null) => {
    setSelectedDomain(domain);
  }, []);

  const updateDomain = useCallback((domainId: string, updates: Partial<Domain>) => {
    setDomains(prev => prev.map(domain =>
      domain.id === domainId ? { ...domain, ...updates } : domain
    ));
  }, []);

  const deleteDomain = useCallback((domainId: string) => {
    setDomains(prev => prev.filter(domain => domain.id !== domainId));
    if (selectedDomain?.id === domainId) {
      setSelectedDomain(null);
    }
  }, [selectedDomain]);

  const verifyDomain = useCallback(async (domainId: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    updateDomain(domainId, { verified: true });
    return true;
  }, [updateDomain]);

  // DNS actions
  const createDNSRecord = useCallback((domainId: string, record: Omit<DNSRecord, 'id' | 'domainId' | 'status'>) => {
    const newRecord: DNSRecord = {
      ...record,
      id: `dns-${Date.now()}`,
      domainId,
      status: 'pending'
    };
    setDnsRecords(prev => [...prev, newRecord]);
  }, []);

  const updateDNSRecord = useCallback((recordId: string, updates: Partial<DNSRecord>) => {
    setDnsRecords(prev => prev.map(record =>
      record.id === recordId ? { ...record, ...updates } : record
    ));
  }, []);

  const deleteDNSRecord = useCallback((recordId: string) => {
    setDnsRecords(prev => prev.filter(record => record.id !== recordId));
  }, []);

  // Subdomain actions
  const createSubdomain = useCallback((domainId: string, subdomain: Omit<Subdomain, 'id' | 'domainId' | 'status'>) => {
    const newSubdomain: Subdomain = {
      ...subdomain,
      id: `subdomain-${Date.now()}`,
      domainId,
      status: 'pending'
    };
    setSubdomains(prev => [...prev, newSubdomain]);
  }, []);

  const updateSubdomain = useCallback((subdomainId: string, updates: Partial<Subdomain>) => {
    setSubdomains(prev => prev.map(subdomain =>
      subdomain.id === subdomainId ? { ...subdomain, ...updates } : subdomain
    ));
  }, []);

  const deleteSubdomain = useCallback((subdomainId: string) => {
    setSubdomains(prev => prev.filter(subdomain => subdomain.id !== subdomainId));
  }, []);

  // Redirect actions
  const createRedirect = useCallback((domainId: string, redirect: Omit<DomainRedirect, 'id' | 'domainId' | 'status'>) => {
    const newRedirect: DomainRedirect = {
      ...redirect,
      id: `redirect-${Date.now()}`,
      domainId,
      status: 'pending'
    };
    setRedirects(prev => [...prev, newRedirect]);
  }, []);

  const updateRedirect = useCallback((redirectId: string, updates: Partial<DomainRedirect>) => {
    setRedirects(prev => prev.map(redirect =>
      redirect.id === redirectId ? { ...redirect, ...updates } : redirect
    ));
  }, []);

  const deleteRedirect = useCallback((redirectId: string) => {
    setRedirects(prev => prev.filter(redirect => redirect.id !== redirectId));
  }, []);

  // SSL actions
  const setupSSL = useCallback(async (domainId: string, provider: string, wildcard = false) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const certificate: SSLCertificate = {
      id: `ssl-${Date.now()}`,
      domainId,
      provider: provider as any,
      status: 'active',
      issuedDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: true,
      wildcard
    };

    setSslCertificates(prev => [...prev, certificate]);
    updateDomain(domainId, { sslStatus: 'active' });
  }, [updateDomain]);

  const renewSSL = useCallback(async (certificateId: string) => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    setSslCertificates(prev => prev.map(cert =>
      cert.id === certificateId 
        ? { 
            ...cert, 
            expirationDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'active' as const
          } 
        : cert
    ));
  }, []);

  // Deployment actions
  const createEnvironment = useCallback((domainId: string, environment: Omit<DeploymentEnvironment, 'id' | 'domainId' | 'status'>) => {
    const newEnvironment: DeploymentEnvironment = {
      ...environment,
      id: `env-${Date.now()}`,
      domainId,
      status: 'inactive'
    };
    setDeploymentEnvironments(prev => [...prev, newEnvironment]);
  }, []);

  const deployWebsite = useCallback(async (environmentId: string) => {
    // Update status to building
    setDeploymentEnvironments(prev => prev.map(env =>
      env.id === environmentId ? { ...env, status: 'building' as const } : env
    ));

    // Simulate deployment
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Update to ready
    setDeploymentEnvironments(prev => prev.map(env =>
      env.id === environmentId 
        ? { 
            ...env, 
            status: 'ready' as const,
            lastDeployment: new Date().toISOString(),
            buildLogs: [...env.buildLogs, `Deployment completed at ${new Date().toISOString()}`]
          } 
        : env
    ));
  }, []);

  const rollbackDeployment = useCallback(async (environmentId: string, deploymentId: string) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Simulate rollback logic
  }, []);

  // Hosting actions
  const updateHostingSettings = useCallback((domainId: string, settings: Partial<HostingSettings>) => {
    setHostingSettings(prev => {
      const existing = prev.find(s => s.domainId === domainId);
      if (existing) {
        return prev.map(s => s.domainId === domainId ? { ...s, ...settings } : s);
      } else {
        const newSettings: HostingSettings = {
          id: `hosting-${Date.now()}`,
          domainId,
          cdnEnabled: false,
          compressionEnabled: true,
          cacheSettings: {
            browserCache: 86400,
            cdnCache: 3600,
            staticAssets: 604800
          },
          performanceOptimization: {
            minification: true,
            imageOptimization: true,
            lazyLoading: true
          },
          securityHeaders: {
            hsts: true,
            contentSecurityPolicy: false,
            xFrameOptions: true
          },
          ...settings
        };
        return [...prev, newSettings];
      }
    });
  }, []);

  // Provider actions
  const updateProvider = useCallback((providerId: string, updates: Partial<DomainProvider>) => {
    setDomainProviders(prev => prev.map(provider =>
      provider.id === providerId ? { ...provider, ...updates } : provider
    ));
  }, []);

  const value = {
    domains,
    selectedDomain,
    availableDomains,
    dnsRecords,
    subdomains,
    redirects,
    sslCertificates,
    deploymentEnvironments,
    hostingSettings,
    domainProviders,
    searchDomains,
    purchaseDomain,
    selectDomain,
    updateDomain,
    deleteDomain,
    verifyDomain,
    createDNSRecord,
    updateDNSRecord,
    deleteDNSRecord,
    createSubdomain,
    updateSubdomain,
    deleteSubdomain,
    createRedirect,
    updateRedirect,
    deleteRedirect,
    setupSSL,
    renewSSL,
    createEnvironment,
    deployWebsite,
    rollbackDeployment,
    updateHostingSettings,
    updateProvider
  };

  return <DomainContext.Provider value={value}>{children}</DomainContext.Provider>;
}