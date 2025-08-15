import React, { useState } from 'react';
import { useEcommerce } from '@/contexts/EcommerceContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  ImageIcon,
  Palette,
  Tag,
  DollarSign,
  Package2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProductManagement() {
  const { 
    products, 
    selectedProduct, 
    selectProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    addVariant,
    updateVariant,
    deleteVariant
  } = useEcommerce();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form state for new/edit product
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    tags: '',
    status: 'draft' as const,
    featured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });

  // Variant form state
  const [variantForm, setVariantForm] = useState({
    name: '',
    sku: '',
    price: '',
    compareAtPrice: '',
    inventory: '',
    color: '',
    size: '',
    material: ''
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  const handleCreateProduct = () => {
    const productData = {
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription,
      images: ['/api/placeholder/400/400'],
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      variants: [],
      seo: {
        title: formData.seoTitle || formData.name,
        description: formData.seoDescription || formData.shortDescription,
        keywords: formData.seoKeywords.split(',').map(kw => kw.trim()).filter(Boolean)
      },
      status: formData.status,
      featured: formData.featured
    };
    
    createProduct(productData);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;
    
    const updates = {
      name: formData.name,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      status: formData.status,
      featured: formData.featured,
      seo: {
        title: formData.seoTitle || formData.name,
        description: formData.seoDescription || formData.shortDescription,
        keywords: formData.seoKeywords.split(',').map(kw => kw.trim()).filter(Boolean)
      }
    };
    
    updateProduct(editingProduct.id, updates);
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const handleAddVariant = (productId: string) => {
    const variantData = {
      name: variantForm.name,
      sku: variantForm.sku,
      price: parseFloat(variantForm.price),
      compareAtPrice: variantForm.compareAtPrice ? parseFloat(variantForm.compareAtPrice) : undefined,
      inventory: parseInt(variantForm.inventory),
      attributes: {
        ...(variantForm.color && { color: variantForm.color }),
        ...(variantForm.size && { size: variantForm.size }),
        ...(variantForm.material && { material: variantForm.material })
      },
      image: '/api/placeholder/400/400'
    };
    
    addVariant(productId, variantData);
    resetVariantForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      tags: '',
      status: 'draft',
      featured: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: ''
    });
  };

  const resetVariantForm = () => {
    setVariantForm({
      name: '',
      sku: '',
      price: '',
      compareAtPrice: '',
      inventory: '',
      color: '',
      size: '',
      material: ''
    });
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      category: product.category,
      tags: product.tags.join(', '),
      status: product.status,
      featured: product.featured,
      seoTitle: product.seo.title,
      seoDescription: product.seo.description,
      seoKeywords: product.seo.keywords.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const ProductForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">Short Description</Label>
            <Input
              id="shortDescription"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              placeholder="Brief product description"
            />
          </div>

          <div>
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed product description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tag1, tag2, tag3"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            <Label htmlFor="featured">Featured Product</Label>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          {isEdit && editingProduct && (
            <div className="space-y-4">
              <h4 className="font-medium">Existing Variants</h4>
              {editingProduct.variants.map((variant: any) => (
                <Card key={variant.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{variant.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {variant.sku} • ${variant.price} • Stock: {variant.inventory}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteVariant(editingProduct.id, variant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Add New Variant</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Variant name"
                    value={variantForm.name}
                    onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })}
                  />
                  <Input
                    placeholder="SKU"
                    value={variantForm.sku}
                    onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    value={variantForm.price}
                    onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })}
                  />
                  <Input
                    placeholder="Compare at price"
                    type="number"
                    value={variantForm.compareAtPrice}
                    onChange={(e) => setVariantForm({ ...variantForm, compareAtPrice: e.target.value })}
                  />
                  <Input
                    placeholder="Inventory"
                    type="number"
                    value={variantForm.inventory}
                    onChange={(e) => setVariantForm({ ...variantForm, inventory: e.target.value })}
                  />
                  <Input
                    placeholder="Color"
                    value={variantForm.color}
                    onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })}
                  />
                </div>
                <Button 
                  className="mt-4" 
                  onClick={() => handleAddVariant(editingProduct.id)}
                  disabled={!variantForm.name || !variantForm.sku || !variantForm.price}
                >
                  Add Variant
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              value={formData.seoTitle}
              onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
              placeholder="SEO optimized title"
            />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              value={formData.seoDescription}
              onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
              placeholder="SEO meta description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="seoKeywords">SEO Keywords</Label>
            <Input
              id="seoKeywords"
              value={formData.seoKeywords}
              onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => {
          isEdit ? setIsEditDialogOpen(false) : setIsCreateDialogOpen(false);
          resetForm();
        }}>
          Cancel
        </Button>
        <Button onClick={isEdit ? handleEditProduct : handleCreateProduct}>
          {isEdit ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog, variants, and inventory
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your catalog with variants and details.
              </DialogDescription>
            </DialogHeader>
            <ProductForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
              {product.featured && (
                <Badge className="absolute top-2 left-2">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              <Badge 
                variant={
                  product.status === 'active' ? 'default' :
                  product.status === 'draft' ? 'secondary' : 'outline'
                }
                className="absolute top-2 right-2"
              >
                {product.status}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {product.shortDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {product.variants.length} variant(s)
                </span>
              </div>
              
              {product.variants.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Price Range:</span>
                    <span className="text-sm">
                      ${Math.min(...product.variants.map(v => v.price)).toFixed(2)} - 
                      ${Math.max(...product.variants.map(v => v.price)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Stock:</span>
                    <span className="text-sm">
                      {product.variants.reduce((sum, v) => sum + v.inventory, 0)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => selectProduct(product)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => deleteProduct(product.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information, variants, and settings.
            </DialogDescription>
          </DialogHeader>
          <ProductForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
