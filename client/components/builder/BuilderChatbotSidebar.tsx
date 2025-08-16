import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Wand2,
  Palette,
  Layout,
  Type,
  Image,
  Settings,
  Zap,
  Lightbulb,
  Copy,
  Check,
  Building2,
  ShoppingCart,
  Loader2,
  Sparkles
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

interface BuilderChatbotSidebarProps {
  onComponentAdd?: (componentType: string) => void;
  onStyleChange?: (property: string, value: string) => void;
  onLayoutSuggestion?: (layout: string) => void;
  currentPage?: any;
}

export function BuilderChatbotSidebar({
  onComponentAdd,
  onStyleChange,
  onLayoutSuggestion,
  currentPage
}: BuilderChatbotSidebarProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAdvancedBuilder, setShowAdvancedBuilder] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'bot',
        content: "🤖 Hi! I'm your AI website building assistant. I can build complete, professional websites automatically or help with specific components.",
        timestamp: new Date(),
        actions: [
          {
            id: 'full-website-builder',
            label: '🚀 Build Complete Website',
            type: 'component',
            icon: <Sparkles className="h-4 w-4" />,
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
          "Add hero section",
          "Change color theme"
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        content: "🎉 Perfect! I'll build you a complete, fully functional website with professional quality. Choose from these premium templates:",
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

    // E-commerce store requests
    if (input.includes('ecommerce') || input.includes('store') || input.includes('shop') || input.includes('luxury')) {
      setShowAdvancedBuilder(true);
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "🛍️ Excellent! I'll build you a complete luxury e-commerce store with shopping cart, payment processing, user accounts, and mobile optimization.",
        timestamp: new Date(),
        actions: [
          {
            id: 'build-luxury-store',
            label: '🏆 Build Luxury E-commerce Store',
            type: 'component',
            icon: <ShoppingCart className="h-4 w-4" />,
            action: () => {
              toast({ 
                title: '🛍️ Building Luxury Store!', 
                description: 'Creating complete e-commerce with all features.' 
              });
            }
          }
        ]
      };
    }

    // Landing page requests
    if (input.includes('landing page') || input.includes('homepage')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "Great! I'll help you create a high-converting landing page with professional structure:",
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
          }
        ]
      };
    }

    // Style and theme requests
    if (input.includes('color') || input.includes('theme') || input.includes('style')) {
      return {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: "I'll help you style your website! Here are professional theme options:",
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

    // Default helpful response
    return {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content: "I understand you'd like help with your website. Here are some things I can do:",
      timestamp: new Date(),
      suggestions: [
        "Build complete website",
        "Add components", 
        "Change colors and themes",
        "Create responsive layouts",
        "Optimize for mobile"
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => handleSendMessage(), 100);
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
        "Build complete website",
        "Add more components",
        "Adjust styling",
        "Preview changes"
      ]
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, confirmationMessage]);
    }, 500);
  };

  return (
    <div className="w-96 border-l bg-white dark:bg-gray-900 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold">AI Website Builder</h3>
            <p className="text-xs text-muted-foreground">
              {isTyping ? 'Thinking...' : 'Ready to build'}
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Website Builder */}
      {showAdvancedBuilder && (
        <div className="border-b">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-sm">🚀 AI Website Builder</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAdvancedBuilder(false)}
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
            <div className="max-h-96 overflow-auto">
              <AdvancedWebsiteBuilder 
                onBuildComplete={(website) => {
                  toast({
                    title: '🎉 Website Built Successfully!',
                    description: `Your ${website.name} is live with all professional features!`
                  });
                  setShowAdvancedBuilder(false);
                }}
                onBuildStart={() => {
                  toast({
                    title: '🔨 Building Your Website...',
                    description: 'AI is creating your professional website now!'
                  });
                }}
              />
            </div>
          </div>
          <Separator />
        </div>
      )}

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
            placeholder="Ask me to build anything..."
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
          <span>Try: "Build luxury e-commerce store" or "Add hero section"</span>
        </div>
      </div>
    </div>
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
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
        message.type === 'user' 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
      }`}>
        {message.type === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
      </div>

      <div className={`flex-1 space-y-2 ${message.type === 'user' ? 'items-end' : ''}`}>
        <div className={`max-w-[260px] p-3 rounded-lg text-sm ${
          message.type === 'user'
            ? 'bg-primary text-primary-foreground ml-auto'
            : 'bg-muted'
        }`}>
          <p>{message.content}</p>
        </div>

        {/* Action Buttons */}
        {message.actions && message.actions.length > 0 && (
          <div className="space-y-1">
            {message.actions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                size="sm"
                onClick={() => onActionClick(action)}
                className="w-full justify-start text-xs h-8"
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
                  className="text-xs h-6"
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
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <Bot className="h-3 w-3 text-white" />
      </div>
      <div className="bg-muted p-3 rounded-lg">
        <div className="flex space-x-1">
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
