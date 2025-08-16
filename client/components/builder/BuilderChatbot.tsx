import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  Wand2,
  Palette,
  Layout,
  Type,
  Image,
  Settings,
  Zap,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdvancedWebsiteBuilder } from './AdvancedWebsiteBuilder';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: ChatAction[];
}

interface ChatAction {
  id: string;
  label: string;
  type: 'component' | 'style' | 'layout' | 'content';
  action: () => void;
  icon?: React.ReactNode;
}

interface BuilderChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  onComponentAdd?: (componentType: string) => void;
  onStyleChange?: (property: string, value: string) => void;
  onLayoutSuggestion?: (layout: string) => void;
  currentPage?: any;
}

export function BuilderChatbot({
  isOpen,
  onToggle,
  onComponentAdd,
  onStyleChange,
  onLayoutSuggestion,
  currentPage
}: BuilderChatbotProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: "🤖 Hi! I'm your AI website building assistant. I can build complete, professional websites for you automatically! Just tell me what kind of site you need.",
        timestamp: new Date(),
        actions: [
          {
            id: 'full-website-builder',
            label: '🚀 Build Complete Website',
            type: 'component',
            icon: <Wand2 className="h-4 w-4" />,
            action: () => {
              setShowAdvancedBuilder(true);
              toast({
                title: '🎯 Advanced Website Builder Activated!',
                description: 'Choose from professional templates below.'
              });
            }
          }
        ],
        suggestions: [
          "Build luxury e-commerce store",
          "Create developer portfolio",
          "Design SaaS landing page",
          "Build business website"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): ChatMessage => {
    const input = userInput.toLowerCase();

    // Check for full website building requests
    if (input.includes('fully function') || input.includes('complete website') || input.includes('build website') || input.includes('high quality')) {
      setShowAdvancedBuilder(true);
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "🎉 Perfect! I'll build you a complete, fully functional website with professional quality. Choose from these premium templates below:",
        timestamp: new Date(),
        actions: [
          {
            id: 'show-templates',
            label: '🏆 View Premium Templates',
            type: 'component',
            icon: <Building2 className="h-4 w-4" />,
            action: () => {
              toast({
                title: '🎯 Premium Templates Ready!',
                description: 'Each template includes full functionality and professional design.'
              });
            }
          }
        ]
      };
    }

    // Smart response generation based on user input
    if (input.includes('landing page') || input.includes('homepage')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "Great! I'll help you create a stunning landing page. Let me suggest a proven structure that converts well:",
        timestamp: new Date(),
        actions: [
          {
            id: 'hero-section',
            label: 'Add Hero Section',
            type: 'component',
            icon: <Zap className="h-4 w-4" />,
            action: () => {
              onComponentAdd?.('hero');
              toast({ title: 'Hero Section Added!', description: 'Perfect start for your landing page.' });
            }
          },
          {
            id: 'features-section',
            label: 'Add Features Section',
            type: 'component', 
            icon: <Layout className="h-4 w-4" />,
            action: () => {
              onComponentAdd?.('features');
              toast({ title: 'Features Section Added!', description: 'Showcase your key benefits.' });
            }
          },
          {
            id: 'cta-section',
            label: 'Add Call-to-Action',
            type: 'component',
            icon: <Wand2 className="h-4 w-4" />,
            action: () => {
              onComponentAdd?.('cta');
              toast({ title: 'CTA Section Added!', description: 'Drive conversions with compelling CTAs.' });
            }
          }
        ],
        suggestions: [
          "Change the color scheme",
          "Add testimonials section",
          "Optimize for mobile",
          "Add contact form"
        ]
      };
    }

    if (input.includes('ecommerce') || input.includes('store') || input.includes('shop')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "Perfect! Let's build an e-commerce website that sells. I'll set up the essential components for online selling:",
        timestamp: new Date(),
        actions: [
          {
            id: 'product-grid',
            label: 'Add Product Grid',
            type: 'component',
            icon: <Layout className="h-4 w-4" />,
            action: () => {
              onComponentAdd?.('product-grid');
              toast({ title: 'Product Grid Added!', description: 'Showcase your products beautifully.' });
            }
          },
          {
            id: 'shopping-cart',
            label: 'Add Shopping Cart',
            type: 'component',
            icon: <Settings className="h-4 w-4" />,
            action: () => {
              onComponentAdd?.('cart');
              toast({ title: 'Shopping Cart Added!', description: 'Enable customers to purchase easily.' });
            }
          },
          {
            id: 'product-search',
            label: 'Add Search Bar',
            type: 'component',
            icon: <Settings className="h-4 w-4" />,
            action: () => {
              onComponentAdd?.('search');
              toast({ title: 'Search Added!', description: 'Help customers find products quickly.' });
            }
          }
        ]
      };
    }

    if (input.includes('color') || input.includes('theme') || input.includes('style')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "I'll help you style your website! Here are some popular color schemes and design options:",
        timestamp: new Date(),
        actions: [
          {
            id: 'modern-blue',
            label: 'Modern Blue Theme',
            type: 'style',
            icon: <Palette className="h-4 w-4" />,
            action: () => {
              onStyleChange?.('theme', 'modern-blue');
              toast({ title: 'Theme Applied!', description: 'Modern blue theme looks professional.' });
            }
          },
          {
            id: 'warm-orange',
            label: 'Warm Orange Theme', 
            type: 'style',
            icon: <Palette className="h-4 w-4" />,
            action: () => {
              onStyleChange?.('theme', 'warm-orange');
              toast({ title: 'Theme Applied!', description: 'Warm orange creates friendly vibes.' });
            }
          },
          {
            id: 'elegant-purple',
            label: 'Elegant Purple Theme',
            type: 'style',
            icon: <Palette className="h-4 w-4" />,
            action: () => {
              onStyleChange?.('theme', 'elegant-purple');
              toast({ title: 'Theme Applied!', description: 'Elegant purple adds luxury feel.' });
            }
          }
        ]
      };
    }

    if (input.includes('mobile') || input.includes('responsive')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "Great thinking! Mobile optimization is crucial. I'll help you make your site look perfect on all devices:",
        timestamp: new Date(),
        actions: [
          {
            id: 'mobile-optimize',
            label: 'Auto-Optimize for Mobile',
            type: 'layout',
            icon: <Settings className="h-4 w-4" />,
            action: () => {
              onLayoutSuggestion?.('mobile-optimized');
              toast({ title: 'Mobile Optimized!', description: 'Your site now looks great on mobile.' });
            }
          },
          {
            id: 'tablet-view',
            label: 'Optimize Tablet Layout',
            type: 'layout',
            icon: <Layout className="h-4 w-4" />,
            action: () => {
              onLayoutSuggestion?.('tablet-optimized');
              toast({ title: 'Tablet Optimized!', description: 'Perfect tablet experience created.' });
            }
          }
        ],
        suggestions: [
          "Test mobile performance",
          "Adjust font sizes",
          "Optimize images",
          "Check touch targets"
        ]
      };
    }

    if (input.includes('content') || input.includes('text') || input.includes('copy')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "I can help you create compelling content! Here are some content suggestions based on best practices:",
        timestamp: new Date(),
        actions: [
          {
            id: 'headline-suggestions',
            label: 'Generate Headlines',
            type: 'content',
            icon: <Type className="h-4 w-4" />,
            action: () => {
              toast({ title: 'Headlines Generated!', description: 'Check your text components for new options.' });
            }
          },
          {
            id: 'cta-copy',
            label: 'Create CTA Copy',
            type: 'content',
            icon: <Wand2 className="h-4 w-4" />,
            action: () => {
              toast({ title: 'CTA Copy Created!', description: 'Conversion-focused button text added.' });
            }
          }
        ]
      };
    }

    // Default helpful response
    return {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: "I understand you'd like help with your website. Here are some things I can assist you with:",
      timestamp: new Date(),
      suggestions: [
        "Add components to page",
        "Change colors and themes", 
        "Create responsive layouts",
        "Optimize for SEO",
        "Add animations",
        "Configure forms"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSendMessage();
  };

  const handleActionClick = (action: ChatAction) => {
    action.action();
    
    // Add confirmation message
    const confirmationMessage: ChatMessage = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: `✅ Done! I've ${action.label.toLowerCase()} for you. What else would you like to work on?`,
      timestamp: new Date(),
      suggestions: [
        "Add more components",
        "Adjust styling",
        "Preview the changes",
        "Save and publish"
      ]
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmationMessage]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Builder Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isTyping ? 'Thinking...' : 'Ready to help'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessageComponent
                  key={message.id}
                  message={message}
                  onSuggestionClick={handleSuggestionClick}
                  onActionClick={handleActionClick}
                />
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything about building your website..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center mt-2 text-xs text-muted-foreground">
              <Lightbulb className="h-3 w-3 mr-1" />
              <span>Try: "Add a hero section" or "Change to blue theme"</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Chat Message Component
function ChatMessageComponent({
  message,
  onSuggestionClick,
  onActionClick
}: {
  message: ChatMessage;
  onSuggestionClick: (suggestion: string) => void;
  onActionClick: (action: ChatAction) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        message.type === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
      }`}>
        {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`flex-1 space-y-2 ${message.type === 'user' ? 'items-end' : ''}`}>
        <div className={`max-w-[280px] p-3 rounded-lg ${
          message.type === 'user'
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-muted'
        }`}>
          <p className="text-sm">{message.content}</p>
          
          {message.type === 'bot' && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 mt-2 opacity-50 hover:opacity-100"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="space-y-2">
            {message.actions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => onActionClick(action)}
                className="mr-2 mb-2"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Quick actions:</p>
            <div className="flex flex-wrap gap-1">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-xs h-7"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}

// Typing Indicator
function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-muted p-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
