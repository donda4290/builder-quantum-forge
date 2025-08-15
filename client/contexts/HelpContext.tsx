import React, { createContext, useContext, useState } from 'react';

export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  subcategory?: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // in minutes
  lastUpdated: Date;
  views: number;
  helpful: number;
  notHelpful: number;
  author: string;
  featured: boolean;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  steps: TutorialStep[];
  prerequisites: string[];
  completed: boolean;
  progress: number; // percentage
  lastAccessed?: Date;
  tags: string[];
  featured: boolean;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'code';
  completed: boolean;
  optional: boolean;
  resources?: Resource[];
  nextSteps?: string[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'link' | 'download' | 'video' | 'image';
  url: string;
  description?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  lastUpdated: Date;
}

export interface HelpContextType {
  // Articles
  articles: HelpArticle[];
  getArticle: (slug: string) => HelpArticle | undefined;
  getArticlesByCategory: (category: string) => HelpArticle[];
  searchArticles: (query: string) => HelpArticle[];
  markArticleHelpful: (articleId: string, helpful: boolean) => void;
  
  // Tutorials
  tutorials: Tutorial[];
  getTutorial: (id: string) => Tutorial | undefined;
  getTutorialsByCategory: (category: string) => Tutorial[];
  startTutorial: (tutorialId: string) => void;
  completeTutorialStep: (tutorialId: string, stepId: string) => void;
  markTutorialComplete: (tutorialId: string) => void;
  
  // FAQs
  faqs: FAQ[];
  getFAQsByCategory: (category: string) => FAQ[];
  searchFAQs: (query: string) => FAQ[];
  markFAQHelpful: (faqId: string, helpful: boolean) => void;
  
  // Categories
  categories: string[];
  
  // User Progress
  getUserProgress: () => {
    completedTutorials: number;
    totalTutorials: number;
    articlesRead: number;
    helpfulVotes: number;
  };
}

// Mock data
const mockArticles: HelpArticle[] = [
  {
    id: '1',
    title: 'Getting Started with Your E-commerce Platform',
    slug: 'getting-started',
    content: `# Getting Started with Your E-commerce Platform

Welcome to your new e-commerce platform! This guide will walk you through the essential steps to set up your online store and start selling.

## Step 1: Set Up Your Store

First, let's configure your basic store settings:

1. **Store Information**: Go to Settings > Store and add your business name, description, and contact information.
2. **Payment Methods**: Configure your payment gateways in Settings > Payments.
3. **Shipping Options**: Set up your shipping methods and rates in Settings > Shipping.

## Step 2: Add Your Products

Now it's time to add your products:

1. Navigate to Products > Add Product
2. Fill in the product details:
   - **Title**: Give your product a clear, descriptive name
   - **Description**: Write a compelling product description
   - **Images**: Upload high-quality product photos
   - **Pricing**: Set your regular price and any sale prices
   - **Inventory**: Track your stock levels

## Step 3: Customize Your Store Design

Make your store uniquely yours:

1. Go to Design > Themes
2. Choose from our professionally designed themes
3. Customize colors, fonts, and layout
4. Add your logo and branding elements

## Step 4: Launch Your Store

Before going live:

1. **Test Everything**: Place a test order to ensure everything works
2. **Set Up Analytics**: Enable tracking to monitor your store's performance
3. **Configure SEO**: Optimize your store for search engines
4. **Go Live**: Remove any "Coming Soon" pages and announce your launch!

## Need Help?

If you have questions, check out our tutorials or contact our support team.`,
    category: 'Getting Started',
    tags: ['setup', 'basics', 'new-user'],
    difficulty: 'beginner',
    estimatedTime: 15,
    lastUpdated: new Date('2024-01-10'),
    views: 1250,
    helpful: 89,
    notHelpful: 12,
    author: 'Platform Team',
    featured: true
  },
  {
    id: '2',
    title: 'Managing Products and Inventory',
    slug: 'managing-products',
    content: `# Managing Products and Inventory

Learn how to effectively manage your product catalog and inventory levels.

## Product Organization

### Categories and Collections
- Create logical product categories
- Use collections to group related items
- Set up product tags for better organization

### Product Variants
- Add size, color, and other variant options
- Manage pricing for different variants
- Track inventory by variant

## Inventory Management

### Stock Tracking
- Enable inventory tracking for accurate stock levels
- Set up low stock alerts
- Configure out-of-stock behavior

### Bulk Operations
- Import products via CSV
- Bulk edit product information
- Mass update pricing and inventory

## SEO Optimization

### Product SEO
- Write compelling meta descriptions
- Optimize product URLs
- Use descriptive alt text for images

## Best Practices

1. **High-Quality Images**: Use professional product photos
2. **Detailed Descriptions**: Include all relevant product details
3. **Regular Updates**: Keep inventory levels current
4. **Customer Reviews**: Enable and encourage product reviews`,
    category: 'Products',
    tags: ['products', 'inventory', 'management'],
    difficulty: 'intermediate',
    estimatedTime: 20,
    lastUpdated: new Date('2024-01-08'),
    views: 890,
    helpful: 67,
    notHelpful: 8,
    author: 'Product Team',
    featured: false
  }
];

const mockTutorials: Tutorial[] = [
  {
    id: 'tutorial-1',
    title: 'Build Your First Online Store',
    description: 'A comprehensive tutorial that guides you through creating your first e-commerce store from scratch.',
    category: 'Getting Started',
    difficulty: 'beginner',
    estimatedTime: 45,
    steps: [
      {
        id: 'step-1',
        title: 'Welcome & Overview',
        content: 'Welcome to your e-commerce journey! In this tutorial, you\'ll learn how to build a complete online store.',
        type: 'text',
        completed: false,
        optional: false
      },
      {
        id: 'step-2',
        title: 'Store Setup',
        content: 'Let\'s start by setting up your store information and basic settings.',
        type: 'interactive',
        completed: false,
        optional: false,
        resources: [
          {
            id: 'resource-1',
            title: 'Store Setup Checklist',
            type: 'download',
            url: '/resources/store-setup-checklist.pdf',
            description: 'A printable checklist to ensure you don\'t miss any important setup steps.'
          }
        ]
      },
      {
        id: 'step-3',
        title: 'Adding Your First Product',
        content: 'Learn how to add products with images, descriptions, and pricing.',
        type: 'video',
        completed: false,
        optional: false
      },
      {
        id: 'step-4',
        title: 'Customizing Your Theme',
        content: 'Make your store look professional with theme customization.',
        type: 'interactive',
        completed: false,
        optional: false
      },
      {
        id: 'step-5',
        title: 'Payment Setup',
        content: 'Configure payment methods so customers can purchase from your store.',
        type: 'text',
        completed: false,
        optional: false
      }
    ],
    prerequisites: [],
    completed: false,
    progress: 0,
    tags: ['beginner', 'setup', 'store'],
    featured: true
  },
  {
    id: 'tutorial-2',
    title: 'Advanced Product Management',
    description: 'Master advanced product features including variants, inventory tracking, and bulk operations.',
    category: 'Products',
    difficulty: 'intermediate',
    estimatedTime: 60,
    steps: [
      {
        id: 'step-1',
        title: 'Product Variants Setup',
        content: 'Learn how to create products with multiple options like size and color.',
        type: 'interactive',
        completed: false,
        optional: false
      },
      {
        id: 'step-2',
        title: 'Inventory Management',
        content: 'Set up automated inventory tracking and low stock alerts.',
        type: 'text',
        completed: false,
        optional: false
      },
      {
        id: 'step-3',
        title: 'Bulk Product Import',
        content: 'Import hundreds of products at once using CSV files.',
        type: 'video',
        completed: false,
        optional: true
      }
    ],
    prerequisites: ['tutorial-1'],
    completed: false,
    progress: 0,
    tags: ['products', 'advanced', 'inventory'],
    featured: false
  }
];

const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I add products to my store?',
    answer: 'To add products, go to Products > Add Product in your dashboard. Fill in the product details including title, description, images, and pricing. Don\'t forget to set up inventory tracking if you want to monitor stock levels.',
    category: 'Products',
    tags: ['products', 'basics'],
    helpful: 45,
    notHelpful: 3,
    lastUpdated: new Date('2024-01-12')
  },
  {
    id: 'faq-2',
    question: 'What payment methods can I accept?',
    answer: 'Our platform supports major payment gateways including Stripe, PayPal, and Square. You can enable multiple payment methods to give your customers flexibility. Credit cards, digital wallets, and bank transfers are all supported.',
    category: 'Payments',
    tags: ['payments', 'setup'],
    helpful: 67,
    notHelpful: 5,
    lastUpdated: new Date('2024-01-10')
  },
  {
    id: 'faq-3',
    question: 'How do I customize my store\'s appearance?',
    answer: 'You can customize your store by going to Design > Themes. Choose from our collection of professional themes, then use the theme editor to customize colors, fonts, layout, and add your branding elements like logos.',
    category: 'Design',
    tags: ['design', 'themes', 'customization'],
    helpful: 89,
    notHelpful: 8,
    lastUpdated: new Date('2024-01-09')
  },
  {
    id: 'faq-4',
    question: 'Can I set up automatic backups?',
    answer: 'Yes! Automatic backups are available in Settings > Security & Compliance > Backups. You can configure daily, weekly, or monthly backups with encryption and choose storage locations including cloud and offsite options.',
    category: 'Security',
    tags: ['backups', 'security', 'data'],
    helpful: 34,
    notHelpful: 2,
    lastUpdated: new Date('2024-01-08')
  }
];

const categories = [
  'Getting Started',
  'Products',
  'Orders',
  'Customers',
  'Design',
  'Payments',
  'Shipping',
  'Marketing',
  'Analytics',
  'Integrations',
  'Security',
  'Troubleshooting'
];

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export function HelpProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<HelpArticle[]>(mockArticles);
  const [tutorials, setTutorials] = useState<Tutorial[]>(mockTutorials);
  const [faqs, setFAQs] = useState<FAQ[]>(mockFAQs);

  const getArticle = (slug: string): HelpArticle | undefined => {
    return articles.find(article => article.slug === slug);
  };

  const getArticlesByCategory = (category: string): HelpArticle[] => {
    return articles.filter(article => article.category === category);
  };

  const searchArticles = (query: string): HelpArticle[] => {
    const lowercaseQuery = query.toLowerCase();
    return articles.filter(article =>
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const markArticleHelpful = (articleId: string, helpful: boolean) => {
    setArticles(prev => prev.map(article =>
      article.id === articleId
        ? {
            ...article,
            helpful: helpful ? article.helpful + 1 : article.helpful,
            notHelpful: helpful ? article.notHelpful : article.notHelpful + 1
          }
        : article
    ));
  };

  const getTutorial = (id: string): Tutorial | undefined => {
    return tutorials.find(tutorial => tutorial.id === id);
  };

  const getTutorialsByCategory = (category: string): Tutorial[] => {
    return tutorials.filter(tutorial => tutorial.category === category);
  };

  const startTutorial = (tutorialId: string) => {
    setTutorials(prev => prev.map(tutorial =>
      tutorial.id === tutorialId
        ? { ...tutorial, lastAccessed: new Date() }
        : tutorial
    ));
  };

  const completeTutorialStep = (tutorialId: string, stepId: string) => {
    setTutorials(prev => prev.map(tutorial => {
      if (tutorial.id === tutorialId) {
        const updatedSteps = tutorial.steps.map(step =>
          step.id === stepId ? { ...step, completed: true } : step
        );
        const completedSteps = updatedSteps.filter(step => step.completed).length;
        const progress = (completedSteps / updatedSteps.length) * 100;
        
        return {
          ...tutorial,
          steps: updatedSteps,
          progress,
          completed: progress === 100,
          lastAccessed: new Date()
        };
      }
      return tutorial;
    }));
  };

  const markTutorialComplete = (tutorialId: string) => {
    setTutorials(prev => prev.map(tutorial =>
      tutorial.id === tutorialId
        ? {
            ...tutorial,
            completed: true,
            progress: 100,
            steps: tutorial.steps.map(step => ({ ...step, completed: true }))
          }
        : tutorial
    ));
  };

  const getFAQsByCategory = (category: string): FAQ[] => {
    return faqs.filter(faq => faq.category === category);
  };

  const searchFAQs = (query: string): FAQ[] => {
    const lowercaseQuery = query.toLowerCase();
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const markFAQHelpful = (faqId: string, helpful: boolean) => {
    setFAQs(prev => prev.map(faq =>
      faq.id === faqId
        ? {
            ...faq,
            helpful: helpful ? faq.helpful + 1 : faq.helpful,
            notHelpful: helpful ? faq.notHelpful : faq.notHelpful + 1
          }
        : faq
    ));
  };

  const getUserProgress = () => {
    const completedTutorials = tutorials.filter(t => t.completed).length;
    const totalTutorials = tutorials.length;
    const articlesRead = articles.reduce((sum, article) => sum + article.views, 0);
    const helpfulVotes = articles.reduce((sum, article) => sum + article.helpful, 0) +
                        faqs.reduce((sum, faq) => sum + faq.helpful, 0);

    return {
      completedTutorials,
      totalTutorials,
      articlesRead,
      helpfulVotes
    };
  };

  const value: HelpContextType = {
    // Articles
    articles,
    getArticle,
    getArticlesByCategory,
    searchArticles,
    markArticleHelpful,

    // Tutorials
    tutorials,
    getTutorial,
    getTutorialsByCategory,
    startTutorial,
    completeTutorialStep,
    markTutorialComplete,

    // FAQs
    faqs,
    getFAQsByCategory,
    searchFAQs,
    markFAQHelpful,

    // Categories
    categories,

    // User Progress
    getUserProgress
  };

  return (
    <HelpContext.Provider value={value}>
      {children}
    </HelpContext.Provider>
  );
}

export function useHelp() {
  const context = useContext(HelpContext);
  if (context === undefined) {
    throw new Error('useHelp must be used within a HelpProvider');
  }
  return context;
}
