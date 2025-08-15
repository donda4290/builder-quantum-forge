import React from 'react';
import { BuilderElement } from '@/contexts/BuilderContext';

export const ecommerceTemplates = {
  'product-listing': {
    name: 'Product Listing',
    description: 'Showcase multiple products in a grid layout',
    elements: [
      {
        type: 'header' as const,
        content: { title: 'Your Store' },
        styles: { backgroundColor: '#8b5cf6', color: 'white', padding: '1rem 0' },
        props: {}
      },
      {
        type: 'section' as const,
        content: { 
          title: 'Featured Products',
          description: 'Discover our best-selling items'
        },
        styles: { 
          padding: '4rem 2rem',
          textAlign: 'center'
        },
        props: {}
      },
      {
        type: 'section' as const,
        content: { title: 'Product Grid' },
        styles: { 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '2rem',
          backgroundColor: '#f8fafc'
        },
        props: { ecommerce: 'product-grid' },
        children: [
          {
            type: 'section' as const,
            content: { 
              title: 'Premium Headphones',
              description: '$299.99'
            },
            styles: {
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            },
            props: { ecommerce: 'product-card' }
          },
          {
            type: 'section' as const,
            content: { 
              title: 'Wireless Mouse',
              description: '$79.99'
            },
            styles: {
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            },
            props: { ecommerce: 'product-card' }
          },
          {
            type: 'section' as const,
            content: { 
              title: 'Smart Watch',
              description: '$399.99'
            },
            styles: {
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            },
            props: { ecommerce: 'product-card' }
          }
        ]
      },
      {
        type: 'footer' as const,
        content: { company: 'Your Store' },
        styles: { backgroundColor: '#1f2937', color: 'white', padding: '2rem 0' },
        props: {}
      }
    ]
  },

  'category': {
    name: 'Category Page',
    description: 'Browse products by category with filters',
    elements: [
      {
        type: 'header' as const,
        content: { title: 'Your Store' },
        styles: { backgroundColor: '#8b5cf6', color: 'white', padding: '1rem 0' },
        props: {}
      },
      {
        type: 'section' as const,
        content: { 
          title: 'Electronics',
          description: 'Latest gadgets and tech accessories'
        },
        styles: { 
          padding: '3rem 2rem',
          textAlign: 'center',
          backgroundColor: '#f1f5f9'
        },
        props: {}
      },
      {
        type: 'section' as const,
        content: { title: 'Filters & Products' },
        styles: { 
          display: 'grid',
          gridTemplateColumns: '250px 1fr',
          gap: '2rem',
          padding: '2rem'
        },
        props: {},
        children: [
          {
            type: 'section' as const,
            content: { title: 'Filters' },
            styles: {
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              height: 'fit-content',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            },
            props: { ecommerce: 'filters' }
          },
          {
            type: 'section' as const,
            content: { title: 'Product Results' },
            styles: { 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            },
            props: { ecommerce: 'product-results' }
          }
        ]
      }
    ]
  },

  'checkout': {
    name: 'Checkout Flow',
    description: 'Complete checkout experience with forms',
    elements: [
      {
        type: 'header' as const,
        content: { title: 'Your Store' },
        styles: { backgroundColor: '#8b5cf6', color: 'white', padding: '1rem 0' },
        props: {}
      },
      {
        type: 'section' as const,
        content: { 
          title: 'Checkout',
          description: 'Complete your purchase'
        },
        styles: { 
          padding: '2rem',
          textAlign: 'center'
        },
        props: {}
      },
      {
        type: 'section' as const,
        content: { title: 'Checkout Form' },
        styles: { 
          display: 'grid',
          gridTemplateColumns: '1fr 400px',
          gap: '3rem',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        },
        props: {},
        children: [
          {
            type: 'form' as const,
            content: { title: 'Billing Information' },
            styles: {
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            },
            props: { ecommerce: 'checkout-form' }
          },
          {
            type: 'section' as const,
            content: { title: 'Order Summary' },
            styles: {
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '2rem',
              height: 'fit-content',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            },
            props: { ecommerce: 'order-summary' }
          }
        ]
      }
    ]
  },

  'landing': {
    name: 'Landing Page',
    description: 'High-converting product landing page',
    elements: [
      {
        type: 'header' as const,
        content: { title: 'Your Store' },
        styles: { backgroundColor: '#8b5cf6', color: 'white', padding: '1rem 0' },
        props: {}
      },
      {
        type: 'section' as const,
        content: { 
          title: 'Revolutionary Product',
          description: 'Transform your life with our amazing product'
        },
        styles: { 
          padding: '6rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        },
        props: {},
        children: [
          {
            type: 'button' as const,
            content: { text: 'Shop Now - $299', variant: 'default' },
            styles: { 
              marginTop: '2rem',
              backgroundColor: 'white',
              color: '#8b5cf6',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            },
            props: {}
          }
        ]
      },
      {
        type: 'section' as const,
        content: { 
          title: 'Features',
          description: 'Why choose our product?'
        },
        styles: { 
          padding: '4rem 2rem',
          textAlign: 'center'
        },
        props: {},
        children: [
          {
            type: 'section' as const,
            content: { title: 'Feature Grid' },
            styles: { 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginTop: '3rem'
            },
            props: {}
          }
        ]
      },
      {
        type: 'section' as const,
        content: { 
          title: 'Ready to Get Started?',
          description: 'Join thousands of satisfied customers'
        },
        styles: { 
          padding: '4rem 2rem',
          textAlign: 'center',
          backgroundColor: '#f8fafc'
        },
        props: {},
        children: [
          {
            type: 'button' as const,
            content: { text: 'Order Now', variant: 'default' },
            styles: { 
              marginTop: '2rem',
              backgroundColor: '#10b981',
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            },
            props: {}
          }
        ]
      }
    ]
  }
};

export function generateTemplateElements(templateId: string): BuilderElement[] {
  const template = ecommerceTemplates[templateId as keyof typeof ecommerceTemplates];
  if (!template) return [];

  return template.elements.map((element, index) => ({
    ...element,
    id: `element-${Date.now()}-${index}`,
    children: element.children?.map((child, childIndex) => ({
      ...child,
      id: `element-${Date.now()}-${index}-${childIndex}`
    }))
  })) as BuilderElement[];
}
