# Builder.io Integration Guide

This document explains how to fully integrate Builder.io's visual editor into your platform.

## Overview

The Builder.io integration provides:

- **Visual Drag & Drop Editor**: Professional visual page builder
- **Content Management**: Full CMS capabilities with versioning
- **Performance Optimization**: Built-in CDN and optimization
- **A/B Testing**: Built-in experimentation platform
- **Analytics**: Comprehensive performance tracking

## Installation

### 1. Install Builder.io Dependencies

```bash
npm install @builder.io/react @builder.io/sdk @builder.io/widgets
```

### 2. Add Builder.io Types (Optional)

```bash
npm install -D @builder.io/dev-tools
```

## Configuration

### 1. Environment Variables

Add these to your `.env` file:

```env
VITE_BUILDER_PUBLIC_KEY=your_public_api_key
VITE_BUILDER_PRIVATE_KEY=your_private_api_key
VITE_BUILDER_SPACE_ID=your_space_id
```

### 2. Builder.io Account Setup

1. **Create Account**: Sign up at https://builder.io
2. **Get API Keys**: Go to Account Settings → API Keys
3. **Copy Keys**: Get your Public and Private API keys
4. **Note Space ID**: Found in your dashboard URL

## Implementation

### 1. Initialize Builder.io SDK

```tsx
// utils/builder.ts
import { builder } from "@builder.io/sdk";

// Initialize Builder
builder.init(process.env.VITE_BUILDER_PUBLIC_KEY!);

// Configure API key for editing
if (process.env.VITE_BUILDER_PRIVATE_KEY) {
  builder.authToken = process.env.VITE_BUILDER_PRIVATE_KEY;
}

export { builder };
```

### 2. Create Builder Component

```tsx
// components/BuilderComponent.tsx
import { BuilderComponent as BuilderComponentSDK } from "@builder.io/react";
import { builder } from "../utils/builder";

interface Props {
  model: string;
  content?: any;
}

export function BuilderComponent({ model, content }: Props) {
  return (
    <BuilderComponentSDK
      model={model}
      content={content}
      apiKey={builder.apiKey}
    />
  );
}
```

### 3. Integrate Visual Editor

```tsx
// components/BuilderEditor.tsx
import { BuilderEditor } from "@builder.io/widgets";

interface Props {
  model: string;
  contentId?: string;
  onSave?: (content: any) => void;
}

export function VisualEditor({ model, contentId, onSave }: Props) {
  return (
    <BuilderEditor
      model={model}
      contentId={contentId}
      onSave={onSave}
      apiKey={process.env.VITE_BUILDER_PUBLIC_KEY}
    />
  );
}
```

## Content Models

### 1. Default Models

Builder.io comes with these models:

- **page**: Web pages
- **symbol**: Reusable components
- **data**: Structured data

### 2. Custom Models

Create custom models for your needs:

```tsx
// Define custom models
const models = {
  "product-page": {
    fields: [
      { name: "title", type: "text", required: true },
      { name: "price", type: "number", required: true },
      { name: "description", type: "richText" },
      {
        name: "images",
        type: "list",
        subFields: [
          { name: "image", type: "image" },
          { name: "alt", type: "text" },
        ],
      },
    ],
  },
};
```

## API Integration

### 1. Fetch Content

```tsx
import { builder } from "@builder.io/sdk";

// Fetch page content
const getPage = async (url: string) => {
  const content = await builder.get("page", { url }).promise();
  return content;
};

// Fetch all products
const getProducts = async () => {
  const products = await builder.getAll("product", { limit: 100 }).promise();
  return products;
};
```

### 2. Create Content

```tsx
// Create new page
const createPage = async (pageData: any) => {
  const content = await builder.create("page", pageData).promise();
  return content;
};
```

### 3. Update Content

```tsx
// Update existing content
const updateContent = async (id: string, updates: any) => {
  const content = await builder.update("page", id, updates).promise();
  return content;
};
```

## Features Implementation

### 1. Visual Editor Integration

The current implementation provides:

- ✅ **Configuration Management**: API key setup and validation
- ✅ **Content Management**: Create, edit, publish content
- ✅ **Page Management**: Multiple page support
- ✅ **Preview System**: Real-time preview capabilities
- ✅ **Analytics Dashboard**: Performance metrics
- ✅ **Model Management**: Custom content types

### 2. Available Components

- `BuilderIOIntegration`: Main integration component
- `BuilderSDKEditor`: Visual editor wrapper
- `BuilderContent`: Content rendering component
- `useBuilderIO`: React hook for Builder.io state

### 3. Context Management

The `BuilderIOContext` provides:

- Configuration state
- Content management
- Analytics data
- Loading states
- Error handling

## Production Deployment

### 1. Environment Configuration

```env
# Production environment
VITE_BUILDER_PUBLIC_KEY=prod_public_key
VITE_BUILDER_PRIVATE_KEY=prod_private_key
VITE_BUILDER_SPACE_ID=prod_space_id
```

### 2. CDN Integration

Builder.io automatically provides:

- Global CDN delivery
- Image optimization
- Code splitting
- Performance monitoring

### 3. SEO Configuration

```tsx
// SEO integration
import { builder } from "@builder.io/sdk";

const getPageSEO = async (url: string) => {
  const content = await builder
    .get("page", {
      url,
      fields: "data.title,data.description,data.keywords",
    })
    .promise();

  return {
    title: content?.data?.title,
    description: content?.data?.description,
    keywords: content?.data?.keywords,
  };
};
```

## Testing

### 1. Content Preview

Test content before publishing:

```tsx
// Preview mode
const previewContent = async (id: string) => {
  const content = await builder
    .get("page", {
      id,
      cachebust: true,
      preview: true,
    })
    .promise();
  return content;
};
```

### 2. A/B Testing

Builder.io includes built-in A/B testing:

```tsx
// Create variation
const createVariation = async (contentId: string, variation: any) => {
  const result = await builder
    .create("page", {
      ...variation,
      testRatio: 0.5, // 50/50 split
      baseContentId: contentId,
    })
    .promise();
  return result;
};
```

## Troubleshooting

### Common Issues

1. **API Key Issues**: Verify keys in Builder.io dashboard
2. **CORS Errors**: Configure allowed domains in Builder.io
3. **Content Not Loading**: Check model names and permissions
4. **Editor Not Opening**: Verify private API key permissions

### Support Resources

- [Builder.io Documentation](https://www.builder.io/c/docs)
- [React SDK Guide](https://www.builder.io/c/docs/developers/react)
- [API Reference](https://www.builder.io/c/docs/api)
- [Community Forum](https://github.com/BuilderIO/builder/discussions)

## Next Steps

1. **Connect MCP Integration**: Use [Connect to Builder.io](#open-mcp-popover)
2. **Configure API Keys**: Add your Builder.io credentials
3. **Create Content Models**: Define your content structure
4. **Build Pages**: Use the visual editor to create pages
5. **Deploy**: Publish your content to production

The Builder.io integration is now ready to provide professional-grade visual editing capabilities to your platform!
