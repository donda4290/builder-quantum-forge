import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Smile,
  Paperclip,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  HelpCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  type: 'text' | 'file' | 'system';
  agentName?: string;
  agentAvatar?: string;
  fileUrl?: string;
  fileName?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: Date;
  updatedAt: Date;
  assignedAgent?: string;
  messages: ChatMessage[];
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'bot',
    timestamp: new Date(Date.now() - 300000),
    type: 'text'
  },
  {
    id: '2',
    content: 'I\'m having trouble setting up my payment gateway. Can you help?',
    sender: 'user',
    timestamp: new Date(Date.now() - 240000),
    type: 'text'
  },
  {
    id: '3',
    content: 'I\'d be happy to help you with payment gateway setup! Let me connect you with one of our specialists.',
    sender: 'bot',
    timestamp: new Date(Date.now() - 180000),
    type: 'text'
  },
  {
    id: '4',
    content: 'Hi there! I\'m Sarah from the support team. I see you need help with payment gateway setup. Which payment provider are you trying to integrate?',
    sender: 'agent',
    timestamp: new Date(Date.now() - 120000),
    type: 'text',
    agentName: 'Sarah Johnson',
    agentAvatar: '/avatars/sarah.jpg'
  }
];

const mockTickets: SupportTicket[] = [
  {
    id: 'TICK-001',
    subject: 'Payment Gateway Setup Issue',
    description: 'Having trouble configuring Stripe payment gateway',
    category: 'Technical',
    priority: 'medium',
    status: 'in-progress',
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 120000),
    assignedAgent: 'Sarah Johnson',
    messages: mockMessages
  },
  {
    id: 'TICK-002',
    subject: 'Domain Configuration Help',
    description: 'Need assistance with DNS configuration for custom domain',
    category: 'Technical',
    priority: 'low',
    status: 'waiting',
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 1800000),
    assignedAgent: 'Mike Wilson',
    messages: []
  }
];

export function ChatSupport() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showTicketHistory, setShowTicketHistory] = useState(false);
  const [tickets] = useState<SupportTicket[]>(mockTickets);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: '',
    priority: 'medium' as const
  });

  const supportHours = {
    weekdays: '9:00 AM - 6:00 PM EST',
    weekends: '10:00 AM - 4:00 PM EST'
  };

  const isOnline = true; // This would be determined by actual availability

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = (content: string, type: 'text' | 'file' = 'text') => {
    if (!content.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentInput('');

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      // Simulate agent response
      const agentResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getAutomatedResponse(content),
        sender: 'agent',
        timestamp: new Date(),
        type: 'text',
        agentName: 'Sarah Johnson',
        agentAvatar: '/avatars/sarah.jpg'
      };
      
      setMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const getAutomatedResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('payment') || message.includes('stripe') || message.includes('paypal')) {
      return 'I can help you with payment gateway configuration. Would you like me to walk you through the setup process step by step?';
    } else if (message.includes('domain') || message.includes('dns')) {
      return 'For domain configuration, I\'ll need to know which domain provider you\'re using. Are you using GoDaddy, Namecheap, or another provider?';
    } else if (message.includes('product') || message.includes('inventory')) {
      return 'I can help you with product management. Are you looking to add new products, manage inventory, or set up product variants?';
    } else if (message.includes('theme') || message.includes('design') || message.includes('customize')) {
      return 'I\'d be happy to help with theme customization! What specific changes are you looking to make to your store\'s appearance?';
    } else {
      return 'Thank you for reaching out! I\'d be happy to help. Could you provide a bit more detail about what you\'re trying to accomplish?';
    }
  };

  const handleTicketSubmit = () => {
    if (!ticketForm.subject || !ticketForm.description || !ticketForm.category) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    // Here you would submit the ticket to your backend
    toast({
      title: 'Ticket Created',
      description: 'Your support ticket has been submitted. We\'ll get back to you soon!'
    });

    setTicketForm({
      subject: '',
      description: '',
      category: '',
      priority: 'medium'
    });
    setShowTicketForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
          size="lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {isOnline && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="h-full flex flex-col shadow-xl">
        {/* Header */}
        <CardHeader className="flex-shrink-0 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/avatars/support.jpg" />
                  <AvatarFallback>
                    <MessageCircle className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div>
                <CardTitle className="text-lg">Support Chat</CardTitle>
                <CardDescription className="text-xs">
                  {isOnline ? 'We\'re online' : 'We\'ll get back to you soon'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            {/* Quick Actions */}
            <div className="px-6 pb-3">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTicketForm(true)}
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Create Ticket
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTicketHistory(true)}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  History
                </Button>
              </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 pb-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.sender === 'bot'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-white border text-gray-900'
                    }`}
                  >
                    {(message.sender === 'agent' || message.sender === 'bot') && (
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === 'bot' ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <Avatar className="w-4 h-4">
                            <AvatarImage src={message.agentAvatar} />
                            <AvatarFallback>
                              <User className="w-2 h-2" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-xs font-medium">
                          {message.sender === 'bot' ? 'Support Bot' : message.agentName}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">Agent is typing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage(currentInput);
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => sendMessage(currentInput)}
                  disabled={!currentInput.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Quick Replies */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage('I need help with payment setup')}
                >
                  Payment Help
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage('How do I add products?')}
                >
                  Add Products
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage('Domain configuration help')}
                >
                  Domain Help
                </Button>
              </div>
            </div>

            {/* Support Hours */}
            <div className="px-4 pb-3">
              <div className="text-xs text-gray-500 text-center">
                Support Hours: {supportHours.weekdays} (Weekdays) • {supportHours.weekends} (Weekends)
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Ticket Form Modal */}
      <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and we'll get back to you as soon as possible
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                placeholder="Brief description of your issue"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={ticketForm.category} onValueChange={(value) => setTicketForm(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Issue</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="general">General Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select value={ticketForm.priority} onValueChange={(value: any) => setTicketForm(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Please provide as much detail as possible"
                value={ticketForm.description}
                onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTicketForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleTicketSubmit}>
                Create Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket History Modal */}
      <Dialog open={showTicketHistory} onOpenChange={setShowTicketHistory}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Support Ticket History</DialogTitle>
            <DialogDescription>
              Your previous support requests and their status
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{ticket.subject}</h4>
                    <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>#{ticket.id}</span>
                      <span>{ticket.category}</span>
                      <span>Created {ticket.createdAt.toLocaleDateString()}</span>
                      {ticket.assignedAgent && <span>Assigned to {ticket.assignedAgent}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
