import React, { createContext, useContext, useState, useCallback } from "react";

interface AIContext {
  currentPage: any;
  selectedElement: string | null;
  recentActions: string[];
  buildingGoal: string | null;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  type: "component" | "style" | "layout" | "content" | "optimization";
  priority: "high" | "medium" | "low";
  action: () => void;
  context: string;
}

interface BuilderAIContextType {
  context: AIContext;
  suggestions: AISuggestion[];
  updateContext: (updates: Partial<AIContext>) => void;
  generateSuggestions: () => AISuggestion[];
  executeSuggestion: (suggestionId: string) => void;
  trackAction: (action: string) => void;
}

const BuilderAIContext = createContext<BuilderAIContextType | undefined>(
  undefined,
);

export function useBuilderAI() {
  const context = useContext(BuilderAIContext);
  if (context === undefined) {
    throw new Error("useBuilderAI must be used within a BuilderAIProvider");
  }
  return context;
}

export function BuilderAIProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<AIContext>({
    currentPage: null,
    selectedElement: null,
    recentActions: [],
    buildingGoal: null,
  });

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);

  const updateContext = useCallback((updates: Partial<AIContext>) => {
    setContext((prev) => ({ ...prev, ...updates }));
  }, []);

  const trackAction = useCallback((action: string) => {
    setContext((prev) => ({
      ...prev,
      recentActions: [action, ...prev.recentActions.slice(0, 9)], // Keep last 10 actions
    }));
  }, []);

  const generateSuggestions = useCallback((): AISuggestion[] => {
    const contextualSuggestions: AISuggestion[] = [];

    // Analyze current state and generate smart suggestions
    if (!context.currentPage || context.recentActions.length === 0) {
      // First-time user suggestions
      contextualSuggestions.push({
        id: "start-hero",
        title: "Add a Hero Section",
        description:
          "Every great website starts with an eye-catching hero section",
        type: "component",
        priority: "high",
        action: () => console.log("Adding hero section"),
        context: "Getting started",
      });
    }

    if (context.selectedElement === "header") {
      // Header-specific suggestions
      contextualSuggestions.push({
        id: "add-navigation",
        title: "Enhance Navigation",
        description: "Add a responsive navigation menu to your header",
        type: "component",
        priority: "high",
        action: () => console.log("Enhancing navigation"),
        context: "Header selected",
      });
    }

    if (
      context.recentActions.includes("hero") &&
      !context.recentActions.includes("cta")
    ) {
      // After adding hero, suggest CTA
      contextualSuggestions.push({
        id: "add-cta",
        title: "Add Call-to-Action",
        description: "Convert visitors with a compelling call-to-action button",
        type: "component",
        priority: "high",
        action: () => console.log("Adding CTA"),
        context: "Hero section complete",
      });
    }

    if (context.buildingGoal === "ecommerce") {
      // E-commerce specific suggestions
      contextualSuggestions.push({
        id: "product-showcase",
        title: "Showcase Products",
        description: "Add a product grid to display your merchandise",
        type: "component",
        priority: "high",
        action: () => console.log("Adding product grid"),
        context: "E-commerce focus",
      });
    }

    // Performance and SEO suggestions
    if (context.recentActions.length > 5) {
      contextualSuggestions.push({
        id: "optimize-seo",
        title: "Optimize for SEO",
        description: "Add meta descriptions and improve search visibility",
        type: "optimization",
        priority: "medium",
        action: () => console.log("Optimizing SEO"),
        context: "Content-heavy page",
      });
    }

    return contextualSuggestions;
  }, [context]);

  const executeSuggestion = useCallback(
    (suggestionId: string) => {
      const suggestion = suggestions.find((s) => s.id === suggestionId);
      if (suggestion) {
        suggestion.action();
        trackAction(`executed_${suggestionId}`);
      }
    },
    [suggestions, trackAction],
  );

  const value: BuilderAIContextType = {
    context,
    suggestions,
    updateContext,
    generateSuggestions,
    executeSuggestion,
    trackAction,
  };

  return (
    <BuilderAIContext.Provider value={value}>
      {children}
    </BuilderAIContext.Provider>
  );
}

// Smart Builder Assistant Hook
export function useSmartAssistant() {
  const { context, generateSuggestions, trackAction } = useBuilderAI();

  const getNextBestAction = useCallback(() => {
    const suggestions = generateSuggestions();
    return suggestions.find((s) => s.priority === "high") || suggestions[0];
  }, [generateSuggestions]);

  const getCompletionTips = useCallback(() => {
    const tips = [];

    if (!context.recentActions.includes("hero")) {
      tips.push("Add a hero section to make a strong first impression");
    }

    if (!context.recentActions.includes("mobile-optimized")) {
      tips.push("Test your design on mobile devices");
    }

    if (
      context.recentActions.includes("hero") &&
      !context.recentActions.includes("features")
    ) {
      tips.push("Highlight your key features or benefits");
    }

    return tips;
  }, [context]);

  const analyzePageStructure = useCallback(() => {
    const analysis = {
      hasHeader: context.recentActions.includes("header"),
      hasHero: context.recentActions.includes("hero"),
      hasFeatures: context.recentActions.includes("features"),
      hasCTA: context.recentActions.includes("cta"),
      hasFooter: context.recentActions.includes("footer"),
      completionScore: 0,
    };

    // Calculate completion score
    const essentialElements = ["header", "hero", "cta"];
    const presentElements = essentialElements.filter((element) =>
      context.recentActions.includes(element),
    );

    analysis.completionScore =
      (presentElements.length / essentialElements.length) * 100;

    return analysis;
  }, [context]);

  return {
    getNextBestAction,
    getCompletionTips,
    analyzePageStructure,
    trackAction,
  };
}
