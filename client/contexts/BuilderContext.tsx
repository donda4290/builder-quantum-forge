import React, { createContext, useContext, useState, useCallback } from 'react';

export interface BuilderElement {
  id: string;
  type: 'header' | 'footer' | 'section' | 'text' | 'image' | 'video' | 'button' | 'form' | 'custom';
  content: any;
  styles: Record<string, any>;
  props: Record<string, any>;
  children?: BuilderElement[];
}

export interface BuilderPage {
  id: string;
  name: string;
  slug: string;
  template: 'custom' | 'product-listing' | 'category' | 'checkout' | 'blog' | 'landing';
  elements: BuilderElement[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  customCSS: string;
  customJS: string;
  createdAt: string;
  updatedAt: string;
  versions: PageVersion[];
}

export interface PageVersion {
  id: string;
  name: string;
  elements: BuilderElement[];
  createdAt: string;
  isPublished: boolean;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  customCSS: string;
}

interface BuilderContextType {
  // Current page state
  currentPage: BuilderPage | null;
  pages: BuilderPage[];
  selectedElement: BuilderElement | null;
  draggedElement: BuilderElement | null;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
  
  // Theme state
  currentTheme: Theme;
  themes: Theme[];
  
  // Panel states
  activePanel: 'components' | 'pages' | 'theme' | 'settings' | 'versions' | 'code' | null;
  
  // Actions
  createPage: (name: string, template?: string) => void;
  loadPage: (pageId: string) => void;
  savePage: () => void;
  duplicatePage: (pageId: string) => void;
  deletePage: (pageId: string) => void;
  
  // Element actions
  addElement: (element: Omit<BuilderElement, 'id'>, parentId?: string) => void;
  updateElement: (elementId: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (elementId: string) => void;
  selectElement: (element: BuilderElement | null) => void;
  setDraggedElement: (element: BuilderElement | null) => void;
  
  // Preview actions
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  togglePreviewMode: () => void;
  
  // Theme actions
  updateTheme: (themeUpdates: Partial<Theme>) => void;
  applyTheme: (themeId: string) => void;
  
  // Panel actions
  setActivePanel: (panel: 'components' | 'pages' | 'theme' | 'settings' | 'versions' | 'code' | null) => void;
  
  // Version control
  createVersion: (name: string) => void;
  loadVersion: (versionId: string) => void;
  publishVersion: (versionId: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (context === undefined) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}

// Mock data
const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#8b5cf6',
    secondary: '#f3f4f6',
    accent: '#06b6d4',
    background: '#ffffff',
    foreground: '#1f2937',
    muted: '#6b7280',
    border: '#e5e7eb'
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter'
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  customCSS: ''
};

const mockPages: BuilderPage[] = [
  {
    id: 'home',
    name: 'Home Page',
    slug: '/',
    template: 'custom',
    elements: [],
    seo: {
      title: 'Welcome to Our Store',
      description: 'Discover amazing products',
      keywords: ['ecommerce', 'store', 'products']
    },
    customCSS: '',
    customJS: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    versions: []
  }
];

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState<BuilderPage | null>(mockPages[0]);
  const [pages, setPages] = useState<BuilderPage[]>(mockPages);
  const [selectedElement, setSelectedElement] = useState<BuilderElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<BuilderElement | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [themes, setThemes] = useState<Theme[]>([defaultTheme]);
  const [activePanel, setActivePanel] = useState<'components' | 'pages' | 'theme' | 'settings' | 'versions' | 'code' | null>('components');

  const createPage = useCallback((name: string, template = 'custom') => {
    const newPage: BuilderPage = {
      id: `page-${Date.now()}`,
      name,
      slug: `/${name.toLowerCase().replace(/\s+/g, '-')}`,
      template: template as any,
      elements: [],
      seo: {
        title: name,
        description: '',
        keywords: []
      },
      customCSS: '',
      customJS: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      versions: []
    };
    
    setPages(prev => [...prev, newPage]);
    setCurrentPage(newPage);
  }, []);

  const loadPage = useCallback((pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setCurrentPage(page);
      setSelectedElement(null);
    }
  }, [pages]);

  const savePage = useCallback(() => {
    if (currentPage) {
      setPages(prev => prev.map(p => 
        p.id === currentPage.id 
          ? { ...currentPage, updatedAt: new Date().toISOString() }
          : p
      ));
    }
  }, [currentPage]);

  const duplicatePage = useCallback((pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      const duplicated: BuilderPage = {
        ...page,
        id: `page-${Date.now()}`,
        name: `${page.name} (Copy)`,
        slug: `${page.slug}-copy`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        versions: []
      };
      setPages(prev => [...prev, duplicated]);
    }
  }, [pages]);

  const deletePage = useCallback((pageId: string) => {
    setPages(prev => prev.filter(p => p.id !== pageId));
    if (currentPage?.id === pageId) {
      setCurrentPage(pages[0] || null);
    }
  }, [pages, currentPage]);

  const addElement = useCallback((element: Omit<BuilderElement, 'id'>, parentId?: string) => {
    if (!currentPage) return;
    
    const newElement: BuilderElement = {
      ...element,
      id: `element-${Date.now()}`
    };

    const updatedElements = parentId 
      ? addElementToParent(currentPage.elements, newElement, parentId)
      : [...currentPage.elements, newElement];

    setCurrentPage({
      ...currentPage,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    });
  }, [currentPage]);

  const updateElement = useCallback((elementId: string, updates: Partial<BuilderElement>) => {
    if (!currentPage) return;

    const updatedElements = updateElementInTree(currentPage.elements, elementId, updates);
    setCurrentPage({
      ...currentPage,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    });
  }, [currentPage]);

  const deleteElement = useCallback((elementId: string) => {
    if (!currentPage) return;

    const updatedElements = deleteElementFromTree(currentPage.elements, elementId);
    setCurrentPage({
      ...currentPage,
      elements: updatedElements,
      updatedAt: new Date().toISOString()
    });
    setSelectedElement(null);
  }, [currentPage]);

  const selectElement = useCallback((element: BuilderElement | null) => {
    setSelectedElement(element);
  }, []);

  const togglePreviewMode = useCallback(() => {
    setIsPreviewMode(prev => !prev);
    if (isPreviewMode) {
      setSelectedElement(null);
    }
  }, [isPreviewMode]);

  const updateTheme = useCallback((themeUpdates: Partial<Theme>) => {
    setCurrentTheme(prev => ({ ...prev, ...themeUpdates }));
  }, []);

  const applyTheme = useCallback((themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [themes]);

  const createVersion = useCallback((name: string) => {
    if (!currentPage) return;

    const version: PageVersion = {
      id: `version-${Date.now()}`,
      name,
      elements: [...currentPage.elements],
      createdAt: new Date().toISOString(),
      isPublished: false
    };

    setCurrentPage({
      ...currentPage,
      versions: [...currentPage.versions, version]
    });
  }, [currentPage]);

  const loadVersion = useCallback((versionId: string) => {
    if (!currentPage) return;

    const version = currentPage.versions.find(v => v.id === versionId);
    if (version) {
      setCurrentPage({
        ...currentPage,
        elements: [...version.elements]
      });
    }
  }, [currentPage]);

  const publishVersion = useCallback((versionId: string) => {
    if (!currentPage) return;

    const updatedVersions = currentPage.versions.map(v => ({
      ...v,
      isPublished: v.id === versionId
    }));

    setCurrentPage({
      ...currentPage,
      versions: updatedVersions
    });
  }, [currentPage]);

  const value = {
    currentPage,
    pages,
    selectedElement,
    draggedElement,
    previewMode,
    isPreviewMode,
    currentTheme,
    themes,
    activePanel,
    createPage,
    loadPage,
    savePage,
    duplicatePage,
    deletePage,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    setDraggedElement,
    setPreviewMode,
    togglePreviewMode,
    updateTheme,
    applyTheme,
    setActivePanel,
    createVersion,
    loadVersion,
    publishVersion
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
}

// Helper functions
function addElementToParent(elements: BuilderElement[], newElement: BuilderElement, parentId: string): BuilderElement[] {
  return elements.map(element => {
    if (element.id === parentId) {
      return {
        ...element,
        children: [...(element.children || []), newElement]
      };
    }
    if (element.children) {
      return {
        ...element,
        children: addElementToParent(element.children, newElement, parentId)
      };
    }
    return element;
  });
}

function updateElementInTree(elements: BuilderElement[], elementId: string, updates: Partial<BuilderElement>): BuilderElement[] {
  return elements.map(element => {
    if (element.id === elementId) {
      return { ...element, ...updates };
    }
    if (element.children) {
      return {
        ...element,
        children: updateElementInTree(element.children, elementId, updates)
      };
    }
    return element;
  });
}

function deleteElementFromTree(elements: BuilderElement[], elementId: string): BuilderElement[] {
  return elements
    .filter(element => element.id !== elementId)
    .map(element => ({
      ...element,
      children: element.children ? deleteElementFromTree(element.children, elementId) : undefined
    }));
}
