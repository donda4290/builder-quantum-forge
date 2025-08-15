import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  attributes: Record<string, string>; // e.g., { color: 'red', size: 'M' }
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  tags: string[];
  variants: ProductVariant[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  status: 'draft' | 'active' | 'archived';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  orders: string[];
  totalSpent: number;
  createdAt: string;
  lastOrderAt?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  items: OrderItem[];
  billingAddress: Address;
  shippingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

export interface PaymentGateway {
  id: string;
  name: 'stripe' | 'paypal' | 'square';
  enabled: boolean;
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  testMode: boolean;
}

export interface ShippingProvider {
  id: string;
  name: 'ups' | 'fedex' | 'usps' | 'dhl';
  enabled: boolean;
  apiKey: string;
  accountNumber?: string;
  testMode: boolean;
}

export interface TaxSettings {
  enabled: boolean;
  includedInPrices: boolean;
  defaultRate: number;
  regions: TaxRegion[];
}

export interface TaxRegion {
  id: string;
  name: string;
  country: string;
  state?: string;
  rate: number;
}

export interface EcommerceSettings {
  storeName: string;
  storeUrl: string;
  currency: string;
  weightUnit: 'kg' | 'lb';
  paymentGateways: PaymentGateway[];
  shippingProviders: ShippingProvider[];
  taxSettings: TaxSettings;
  emailNotifications: {
    orderConfirmation: boolean;
    orderShipped: boolean;
    abandonedCart: boolean;
    lowInventory: boolean;
  };
}

interface EcommerceContextType {
  // Products
  products: Product[];
  selectedProduct: Product | null;
  
  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  
  // Customers
  customers: Customer[];
  selectedCustomer: Customer | null;
  
  // Cart
  cart: CartItem[];
  
  // Settings
  settings: EcommerceSettings;
  
  // Product actions
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  selectProduct: (product: Product | null) => void;
  
  // Variant actions
  addVariant: (productId: string, variant: Omit<ProductVariant, 'id'>) => void;
  updateVariant: (productId: string, variantId: string, updates: Partial<ProductVariant>) => void;
  deleteVariant: (productId: string, variantId: string) => void;
  
  // Order actions
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  selectOrder: (order: Order | null) => void;
  
  // Customer actions
  createCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  updateCustomer: (customerId: string, updates: Partial<Customer>) => void;
  selectCustomer: (customer: Customer | null) => void;
  
  // Cart actions
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  
  // Settings actions
  updateSettings: (updates: Partial<EcommerceSettings>) => void;
  
  // Analytics
  getAnalytics: () => {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    averageOrderValue: number;
    topProducts: Product[];
    recentOrders: Order[];
  };
}

const EcommerceContext = createContext<EcommerceContextType | undefined>(undefined);

export function useEcommerce() {
  const context = useContext(EcommerceContext);
  if (context === undefined) {
    throw new Error('useEcommerce must be used within an EcommerceProvider');
  }
  return context;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    shortDescription: 'Premium wireless headphones with noise cancellation',
    images: ['/api/placeholder/400/400', '/api/placeholder/400/400'],
    category: 'Electronics',
    tags: ['audio', 'wireless', 'premium'],
    variants: [
      {
        id: 'var-1',
        name: 'Black',
        sku: 'HEADPHONE-BLACK',
        price: 299.99,
        compareAtPrice: 399.99,
        inventory: 15,
        attributes: { color: 'Black' },
        image: '/api/placeholder/400/400'
      },
      {
        id: 'var-2',
        name: 'White',
        sku: 'HEADPHONE-WHITE',
        price: 299.99,
        compareAtPrice: 399.99,
        inventory: 8,
        attributes: { color: 'White' },
        image: '/api/placeholder/400/400'
      }
    ],
    seo: {
      title: 'Premium Wireless Headphones - High Quality Audio',
      description: 'Shop premium wireless headphones with noise cancellation',
      keywords: ['headphones', 'wireless', 'audio', 'noise cancellation']
    },
    status: 'active',
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring and GPS.',
    shortDescription: 'Smart fitness watch with heart rate monitoring',
    images: ['/api/placeholder/400/400'],
    category: 'Wearables',
    tags: ['fitness', 'smart', 'health'],
    variants: [
      {
        id: 'var-3',
        name: 'Black - 42mm',
        sku: 'WATCH-BLACK-42',
        price: 199.99,
        inventory: 25,
        attributes: { color: 'Black', size: '42mm' },
        image: '/api/placeholder/400/400'
      },
      {
        id: 'var-4',
        name: 'Silver - 42mm',
        sku: 'WATCH-SILVER-42',
        price: 199.99,
        inventory: 20,
        attributes: { color: 'Silver', size: '42mm' },
        image: '/api/placeholder/400/400'
      }
    ],
    seo: {
      title: 'Smart Fitness Watch - Advanced Health Tracking',
      description: 'Track your fitness goals with our advanced smart watch',
      keywords: ['fitness', 'watch', 'health', 'tracking']
    },
    status: 'active',
    featured: false,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z'
  }
];

const mockOrders: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-001',
    customerId: 'cust-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        variantId: 'var-1',
        productName: 'Premium Wireless Headphones',
        variantName: 'Black',
        price: 299.99,
        quantity: 1,
        total: 299.99,
        image: '/api/placeholder/100/100'
      }
    ],
    billingAddress: {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      isDefault: true
    },
    shippingAddress: {
      id: 'addr-1',
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      isDefault: true
    },
    subtotal: 299.99,
    tax: 24.00,
    shipping: 9.99,
    discount: 0,
    total: 333.98,
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'Stripe',
    shippingMethod: 'Standard Shipping',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  }
];

const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-0123',
    addresses: [
      {
        id: 'addr-1',
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        isDefault: true
      }
    ],
    orders: ['order-1'],
    totalSpent: 333.98,
    createdAt: '2024-01-15T10:00:00Z',
    lastOrderAt: '2024-01-20T14:30:00Z'
  }
];

const defaultSettings: EcommerceSettings = {
  storeName: 'Your Store',
  storeUrl: 'yourstore.com',
  currency: 'USD',
  weightUnit: 'lb',
  paymentGateways: [
    {
      id: 'stripe',
      name: 'stripe',
      enabled: false,
      apiKey: '',
      secretKey: '',
      webhookSecret: '',
      testMode: true
    },
    {
      id: 'paypal',
      name: 'paypal',
      enabled: false,
      apiKey: '',
      secretKey: '',
      testMode: true
    }
  ],
  shippingProviders: [
    {
      id: 'ups',
      name: 'ups',
      enabled: false,
      apiKey: '',
      accountNumber: '',
      testMode: true
    },
    {
      id: 'fedex',
      name: 'fedex',
      enabled: false,
      apiKey: '',
      accountNumber: '',
      testMode: true
    }
  ],
  taxSettings: {
    enabled: true,
    includedInPrices: false,
    defaultRate: 8.0,
    regions: [
      {
        id: 'ny',
        name: 'New York',
        country: 'US',
        state: 'NY',
        rate: 8.0
      }
    ]
  },
  emailNotifications: {
    orderConfirmation: true,
    orderShipped: true,
    abandonedCart: true,
    lowInventory: true
  }
};

export function EcommerceProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<EcommerceSettings>(defaultSettings);

  // Product actions
  const createProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, ...updates, updatedAt: new Date().toISOString() }
        : product
    ));
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  }, [selectedProduct]);

  const selectProduct = useCallback((product: Product | null) => {
    setSelectedProduct(product);
  }, []);

  // Variant actions
  const addVariant = useCallback((productId: string, variantData: Omit<ProductVariant, 'id'>) => {
    const newVariant: ProductVariant = {
      ...variantData,
      id: `var-${Date.now()}`
    };
    
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, variants: [...product.variants, newVariant], updatedAt: new Date().toISOString() }
        : product
    ));
  }, []);

  const updateVariant = useCallback((productId: string, variantId: string, updates: Partial<ProductVariant>) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? {
            ...product,
            variants: product.variants.map(variant =>
              variant.id === variantId ? { ...variant, ...updates } : variant
            ),
            updatedAt: new Date().toISOString()
          }
        : product
    ));
  }, []);

  const deleteVariant = useCallback((productId: string, variantId: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? {
            ...product,
            variants: product.variants.filter(variant => variant.id !== variantId),
            updatedAt: new Date().toISOString()
          }
        : product
    ));
  }, []);

  // Order actions
  const createOrder = useCallback((orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => [...prev, newOrder]);
  }, [orders.length]);

  const updateOrder = useCallback((orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, ...updates, updatedAt: new Date().toISOString() }
        : order
    ));
  }, []);

  const selectOrder = useCallback((order: Order | null) => {
    setSelectedOrder(order);
  }, []);

  // Customer actions
  const createCustomer = useCallback((customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [...prev, newCustomer]);
  }, []);

  const updateCustomer = useCallback((customerId: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, ...updates } : customer
    ));
  }, []);

  const selectCustomer = useCallback((customer: Customer | null) => {
    setSelectedCustomer(customer);
  }, []);

  // Cart actions
  const addToCart = useCallback((itemData: Omit<CartItem, 'id'>) => {
    const existingItem = cart.find(item => 
      item.productId === itemData.productId && item.variantId === itemData.variantId
    );
    
    if (existingItem) {
      setCart(prev => prev.map(item =>
        item.id === existingItem.id 
          ? { ...item, quantity: item.quantity + itemData.quantity }
          : item
      ));
    } else {
      const newItem: CartItem = {
        ...itemData,
        id: `cart-${Date.now()}`
      };
      setCart(prev => [...prev, newItem]);
    }
  }, [cart]);

  const updateCartItem = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCart(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Settings actions
  const updateSettings = useCallback((updates: Partial<EcommerceSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Analytics
  const getAnalytics = useCallback(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = customers.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const topProducts = products.slice(0, 5); // Simplified - would be based on sales
    const recentOrders = orders.slice(-5);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      averageOrderValue,
      topProducts,
      recentOrders
    };
  }, [orders, customers, products]);

  const value = {
    products,
    selectedProduct,
    orders,
    selectedOrder,
    customers,
    selectedCustomer,
    cart,
    settings,
    createProduct,
    updateProduct,
    deleteProduct,
    selectProduct,
    addVariant,
    updateVariant,
    deleteVariant,
    createOrder,
    updateOrder,
    selectOrder,
    createCustomer,
    updateCustomer,
    selectCustomer,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    updateSettings,
    getAnalytics
  };

  return <EcommerceContext.Provider value={value}>{children}</EcommerceContext.Provider>;
}
