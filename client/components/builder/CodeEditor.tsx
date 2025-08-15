import React, { useState } from 'react';
import { useBuilder } from '@/contexts/BuilderContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Code,
  Save,
  Eye,
  RotateCcw,
  FileCode,
  Palette,
  Zap,
  Copy
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CodeEditor() {
  const { currentPage, updateElement, selectedElement } = useBuilder();
  const [customHTML, setCustomHTML] = useState(currentPage?.customJS || '');
  const [customCSS, setCustomCSS] = useState(currentPage?.customCSS || '');
  const [customJS, setCustomJS] = useState(currentPage?.customJS || '');
  const [elementHTML, setElementHTML] = useState(selectedElement?.content.html || '');
  const [activeTab, setActiveTab] = useState('page-css');

  const handleSavePageCode = () => {
    // In a real implementation, this would update the page in the builder context
    console.log('Saving page code:', { customHTML, customCSS, customJS });
  };

  const handleSaveElementCode = () => {
    if (selectedElement) {
      updateElement(selectedElement.id, {
        content: { ...selectedElement.content, html: elementHTML }
      });
    }
  };

  const codeExamples = {
    css: `/* Custom CSS Examples */

/* Custom button hover effect */
.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

/* Gradient background */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Custom animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.6s ease-out;
}`,
    
    javascript: `/* Custom JavaScript Examples */

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Product quantity selector
function updateQuantity(productId, change) {
  const quantityEl = document.getElementById('quantity-' + productId);
  let currentQuantity = parseInt(quantityEl.textContent);
  const newQuantity = Math.max(1, currentQuantity + change);
  quantityEl.textContent = newQuantity;
  updateCartTotal();
}

// Shopping cart functionality
function addToCart(productId, name, price) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, name, price, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartDisplay();
}`,

    html: `<!-- Custom HTML Examples -->

<!-- Advanced product card with custom elements -->
<div class="product-card-advanced">
  <div class="product-image-container">
    <img src="/api/placeholder/300/300" alt="Product" class="product-image">
    <div class="product-overlay">
      <button class="quick-view-btn" onclick="openQuickView()">
        <i class="icon-eye"></i> Quick View
      </button>
    </div>
  </div>
  <div class="product-info">
    <h3 class="product-title">Premium Product</h3>
    <div class="product-rating">
      <span class="stars">★★★★★</span>
      <span class="rating-count">(24 reviews)</span>
    </div>
    <div class="product-price">
      <span class="current-price">$299.99</span>
      <span class="original-price">$399.99</span>
    </div>
  </div>
</div>

<!-- Newsletter signup with validation -->
<form class="newsletter-form" onsubmit="subscribeNewsletter(event)">
  <div class="form-group">
    <input type="email" placeholder="Enter your email" required>
    <button type="submit" class="subscribe-btn">
      Subscribe
    </button>
  </div>
  <p class="form-disclaimer">
    By subscribing, you agree to our privacy policy.
  </p>
</form>`
  };

  return (
    <div className="h-full bg-background">
      <div className="p-4 border-b">
        <h3 className="font-semibold mb-2">Custom Code Editor</h3>
        <p className="text-sm text-muted-foreground">
          Add custom HTML, CSS, and JavaScript to enhance your website
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="page-css" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                CSS
              </TabsTrigger>
              <TabsTrigger value="page-js" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                JS
              </TabsTrigger>
              <TabsTrigger value="element-html" className="text-xs">
                <Code className="h-3 w-3 mr-1" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="examples" className="text-xs">
                <FileCode className="h-3 w-3 mr-1" />
                Examples
              </TabsTrigger>
            </TabsList>

            <TabsContent value="page-css" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Custom CSS
                  </CardTitle>
                  <CardDescription>
                    Add custom styles that will be applied to your entire page
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="custom-css">CSS Code</Label>
                    <Textarea
                      id="custom-css"
                      value={customCSS}
                      onChange={(e) => setCustomCSS(e.target.value)}
                      placeholder="/* Your custom CSS here */"
                      className="mt-1 font-mono text-sm"
                      rows={12}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSavePageCode} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Apply CSS
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="page-js" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Custom JavaScript
                  </CardTitle>
                  <CardDescription>
                    Add interactive functionality with custom JavaScript
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertDescription>
                      JavaScript will be executed when the page loads. Be careful with custom code.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <Label htmlFor="custom-js">JavaScript Code</Label>
                    <Textarea
                      id="custom-js"
                      value={customJS}
                      onChange={(e) => setCustomJS(e.target.value)}
                      placeholder="// Your custom JavaScript here"
                      className="mt-1 font-mono text-sm"
                      rows={12}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleSavePageCode} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Apply JS
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="element-html" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    Element HTML
                  </CardTitle>
                  <CardDescription>
                    {selectedElement 
                      ? `Edit custom HTML for the selected ${selectedElement.type} element`
                      : 'Select an element to edit its custom HTML'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedElement ? (
                    <>
                      <div>
                        <Label htmlFor="element-html">Custom HTML</Label>
                        <Textarea
                          id="element-html"
                          value={elementHTML}
                          onChange={(e) => setElementHTML(e.target.value)}
                          placeholder="<div>Your custom HTML here</div>"
                          className="mt-1 font-mono text-sm"
                          rows={8}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveElementCode} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Update Element
                        </Button>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select an element on the canvas to edit its HTML</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">CSS Examples</CardTitle>
                    <CardDescription>Copy and customize these CSS snippets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={codeExamples.css}
                      readOnly
                      className="font-mono text-xs"
                      rows={8}
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy CSS
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">JavaScript Examples</CardTitle>
                    <CardDescription>Interactive functionality snippets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={codeExamples.javascript}
                      readOnly
                      className="font-mono text-xs"
                      rows={8}
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy JS
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">HTML Examples</CardTitle>
                    <CardDescription>Advanced HTML structures and components</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={codeExamples.html}
                      readOnly
                      className="font-mono text-xs"
                      rows={8}
                    />
                    <Button variant="outline" size="sm" className="mt-2">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy HTML
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
