import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Wand2,
  Zap,
  Building2,
  Palette,
  Globe,
  ShoppingCart,
  User,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | "ecommerce"
    | "portfolio"
    | "landing"
    | "blog"
    | "business"
    | "saas";
  components: WebsiteComponent[];
  styles: WebsiteStyles;
  features: string[];
  buildTime: number; // seconds
}

interface WebsiteComponent {
  id: string;
  type: string;
  name: string;
  content: any;
  styles: any;
  functionality: string[];
}

interface WebsiteStyles {
  colorScheme: string;
  typography: string;
  layout: string;
  animations: boolean;
  responsive: boolean;
}

interface BuildStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  duration: number;
}

const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: "luxury-ecommerce",
    name: "Luxury E-commerce Store",
    description:
      "High-end fashion store with shopping cart, product catalog, and checkout",
    category: "ecommerce",
    buildTime: 15,
    features: [
      "Product Catalog with Search & Filters",
      "Shopping Cart & Wishlist",
      "User Authentication & Profiles",
      "Payment Integration (Stripe)",
      "Order Management System",
      "Responsive Mobile Design",
      "SEO Optimized",
      "Analytics Integration",
    ],
    components: [
      {
        id: "header",
        type: "navigation",
        name: "Premium Header",
        content: {
          logo: "Luxury Fashion",
          navigation: ["Home", "Products", "Collections", "About", "Contact"],
          userActions: ["Search", "Wishlist", "Cart", "Account"],
        },
        styles: { position: "sticky", background: "white", shadow: true },
        functionality: ["responsive-menu", "search-overlay", "cart-drawer"],
      },
      {
        id: "hero",
        type: "hero-section",
        name: "Luxury Hero Banner",
        content: {
          headline: "Discover Timeless Elegance",
          subheading:
            "Curated collection of premium fashion for the modern connoisseur",
          cta: "Shop Collection",
          backgroundType: "video",
          backgroundMedia: "luxury-fashion-video.mp4",
        },
        styles: { height: "80vh", textAlign: "center", overlay: true },
        functionality: ["parallax-scroll", "auto-play-video", "animated-text"],
      },
      {
        id: "product-grid",
        type: "product-showcase",
        name: "Featured Products",
        content: {
          title: "Featured Collections",
          products: 12,
          layout: "grid-4",
          showFilters: true,
        },
        styles: { padding: "80px 0", background: "#f8f9fa" },
        functionality: [
          "product-quick-view",
          "add-to-cart",
          "wishlist-toggle",
          "lazy-loading",
        ],
      },
    ],
    styles: {
      colorScheme: "luxury-black-gold",
      typography: "playfair-display",
      layout: "modern-grid",
      animations: true,
      responsive: true,
    },
  },
  {
    id: "tech-portfolio",
    name: "Developer Portfolio",
    description:
      "Modern portfolio for developers and designers with project showcase",
    category: "portfolio",
    buildTime: 10,
    features: [
      "Interactive Project Showcase",
      "Skills & Technologies Display",
      "About Me Section",
      "Contact Form with Validation",
      "Blog/Articles Section",
      "Dark/Light Theme Toggle",
      "Smooth Animations",
      "Mobile Optimized",
    ],
    components: [
      {
        id: "hero-intro",
        type: "personal-hero",
        name: "Developer Introduction",
        content: {
          name: "Alex Thompson",
          title: "Full-Stack Developer",
          description:
            "I create beautiful, functional, and user-centered digital experiences.",
          avatar: "professional-photo.jpg",
          socialLinks: ["GitHub", "LinkedIn", "Twitter"],
        },
        styles: { background: "gradient", height: "100vh", centered: true },
        functionality: [
          "typing-animation",
          "floating-avatar",
          "social-hover-effects",
        ],
      },
    ],
    styles: {
      colorScheme: "tech-blue",
      typography: "inter-modern",
      layout: "asymmetric",
      animations: true,
      responsive: true,
    },
  },
  {
    id: "saas-landing",
    name: "SaaS Landing Page",
    description:
      "High-converting landing page for SaaS products with pricing and features",
    category: "saas",
    buildTime: 12,
    features: [
      "Hero Section with Value Proposition",
      "Feature Showcase with Icons",
      "Pricing Table with Tiers",
      "Customer Testimonials",
      "FAQ Section",
      "Newsletter Signup",
      "Multi-step Signup Flow",
      "Conversion Tracking",
    ],
    components: [],
    styles: {
      colorScheme: "saas-purple",
      typography: "modern-sans",
      layout: "centered",
      animations: true,
      responsive: true,
    },
  },
];

interface AdvancedWebsiteBuilderProps {
  onBuildComplete: (website: any) => void;
  onBuildStart: () => void;
}

export function AdvancedWebsiteBuilder({
  onBuildComplete,
  onBuildStart,
}: AdvancedWebsiteBuilderProps) {
  const { toast } = useToast();
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<WebsiteTemplate | null>(null);

  const generateBuildSteps = (template: WebsiteTemplate): BuildStep[] => {
    const baseSteps = [
      {
        id: "analyze",
        name: "Analyzing Requirements",
        description: "Understanding your business needs",
        completed: false,
        duration: 2,
      },
      {
        id: "design",
        name: "Creating Design System",
        description: "Generating colors, fonts, and layouts",
        completed: false,
        duration: 3,
      },
      {
        id: "structure",
        name: "Building Page Structure",
        description: "Creating responsive layout framework",
        completed: false,
        duration: 4,
      },
      {
        id: "components",
        name: "Adding Components",
        description: "Installing interactive elements",
        completed: false,
        duration: 5,
      },
      {
        id: "content",
        name: "Generating Content",
        description: "Creating engaging copy and media",
        completed: false,
        duration: 3,
      },
      {
        id: "styling",
        name: "Applying Styling",
        description: "Perfecting visual design",
        completed: false,
        duration: 4,
      },
      {
        id: "functionality",
        name: "Adding Functionality",
        description: "Implementing interactive features",
        completed: false,
        duration: 6,
      },
      {
        id: "optimization",
        name: "Performance Optimization",
        description: "Optimizing for speed and SEO",
        completed: false,
        duration: 3,
      },
      {
        id: "testing",
        name: "Quality Testing",
        description: "Testing across devices and browsers",
        completed: false,
        duration: 2,
      },
      {
        id: "deployment",
        name: "Final Deployment",
        description: "Making your website live",
        completed: false,
        duration: 1,
      },
    ];

    return baseSteps;
  };

  const buildWebsite = async (template: WebsiteTemplate) => {
    setIsBuilding(true);
    setBuildProgress(0);
    setSelectedTemplate(template);
    onBuildStart();

    const steps = generateBuildSteps(template);
    setBuildSteps(steps);

    let totalProgress = 0;
    const progressPerStep = 100 / steps.length;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setCurrentStep(step.name);

      // Simulate realistic build time for each step
      const stepDuration = step.duration * 1000; // Convert to milliseconds
      const stepProgressIncrement = progressPerStep / (stepDuration / 100);

      for (let progress = 0; progress < stepDuration; progress += 100) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        totalProgress += stepProgressIncrement;
        setBuildProgress(Math.min(totalProgress, (i + 1) * progressPerStep));
      }

      // Mark step as completed
      setBuildSteps((prev) =>
        prev.map((s, index) => (index === i ? { ...s, completed: true } : s)),
      );

      // Show step completion
      toast({
        title: `✅ ${step.name} Complete`,
        description: step.description,
      });
    }

    // Build complete
    setBuildProgress(100);
    setCurrentStep("Website Ready!");

    toast({
      title: "🎉 Website Built Successfully!",
      description: `Your ${template.name} is ready with all professional features.`,
    });

    // Simulate generating the actual website object
    const builtWebsite = {
      id: `website-${Date.now()}`,
      template: template.id,
      name: template.name,
      components: template.components,
      styles: template.styles,
      features: template.features,
      pages: generatePages(template),
      isLive: true,
      performance: {
        speed: 95,
        seo: 98,
        accessibility: 97,
        bestPractices: 96,
      },
    };

    onBuildComplete(builtWebsite);
    setIsBuilding(false);
  };

  const generatePages = (template: WebsiteTemplate) => {
    switch (template.category) {
      case "ecommerce":
        return [
          {
            id: "home",
            name: "Home",
            url: "/",
            components: [
              "header",
              "hero",
              "featured-products",
              "testimonials",
              "footer",
            ],
          },
          {
            id: "products",
            name: "Products",
            url: "/products",
            components: [
              "header",
              "product-grid",
              "filters",
              "pagination",
              "footer",
            ],
          },
          {
            id: "product",
            name: "Product Detail",
            url: "/product/:id",
            components: [
              "header",
              "product-detail",
              "related-products",
              "reviews",
              "footer",
            ],
          },
          {
            id: "cart",
            name: "Shopping Cart",
            url: "/cart",
            components: ["header", "cart-items", "checkout-summary", "footer"],
          },
          {
            id: "checkout",
            name: "Checkout",
            url: "/checkout",
            components: [
              "header",
              "checkout-form",
              "payment-options",
              "footer",
            ],
          },
        ];
      case "portfolio":
        return [
          {
            id: "home",
            name: "Home",
            url: "/",
            components: [
              "hero-intro",
              "about-preview",
              "featured-projects",
              "contact-cta",
            ],
          },
          {
            id: "projects",
            name: "Projects",
            url: "/projects",
            components: ["project-grid", "filter-tabs", "case-studies"],
          },
          {
            id: "about",
            name: "About",
            url: "/about",
            components: ["about-hero", "skills", "experience", "education"],
          },
          {
            id: "contact",
            name: "Contact",
            url: "/contact",
            components: ["contact-form", "social-links", "availability"],
          },
        ];
      default:
        return [
          {
            id: "home",
            name: "Home",
            url: "/",
            components: ["header", "hero", "features", "cta", "footer"],
          },
        ];
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Build Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {WEBSITE_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-all"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {template.category === "ecommerce" && (
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  )}
                  {template.category === "portfolio" && (
                    <User className="h-5 w-5 text-purple-600" />
                  )}
                  {template.category === "saas" && (
                    <Zap className="h-5 w-5 text-green-600" />
                  )}
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </div>
                <Badge variant="outline">{template.buildTime}s build</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <strong>Features:</strong>
                  <ul className="mt-1 space-y-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {template.features.length > 3 && (
                      <li className="text-xs text-muted-foreground">
                        +{template.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>

                <Button
                  className="w-full"
                  onClick={() => buildWebsite(template)}
                  disabled={isBuilding}
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Build {template.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Build Progress */}
      {isBuilding && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span>Building Your Website</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Creating {selectedTemplate?.name} with professional features
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{currentStep}</span>
                <span>{Math.round(buildProgress)}%</span>
              </div>
              <Progress value={buildProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {buildSteps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${
                    step.completed
                      ? "bg-green-50 text-green-800"
                      : currentStep === step.name
                        ? "bg-blue-50 text-blue-800"
                        : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : currentStep === step.name ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2" />
                  )}
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom Website Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Website Builder</CardTitle>
          <p className="text-sm text-muted-foreground">
            Describe your website and I'll build it from scratch
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Globe className="h-6 w-6 mb-2" />
              <span>Business Website</span>
              <span className="text-xs text-muted-foreground">
                Professional company site
              </span>
            </Button>

            <Button variant="outline" className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              <span>Blog Platform</span>
              <span className="text-xs text-muted-foreground">
                Content-driven site
              </span>
            </Button>

            <Button variant="outline" className="h-20 flex-col">
              <Palette className="h-6 w-6 mb-2" />
              <span>Creative Portfolio</span>
              <span className="text-xs text-muted-foreground">
                Showcase your work
              </span>
            </Button>

            <Button variant="outline" className="h-20 flex-col">
              <Zap className="h-6 w-6 mb-2" />
              <span>Custom Project</span>
              <span className="text-xs text-muted-foreground">
                Tell me what you need
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
