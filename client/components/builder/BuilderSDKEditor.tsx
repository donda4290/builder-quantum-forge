import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Eye,
  Save,
  Settings,
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  Loader2,
} from "lucide-react";

interface BuilderSDKEditorProps {
  publicApiKey: string;
  model: string;
  contentId?: string;
  onSave?: (content: any) => void;
  onPreview?: () => void;
  className?: string;
}

export function BuilderSDKEditor({
  publicApiKey,
  model,
  contentId,
  onSave,
  onPreview,
  className = "",
}: BuilderSDKEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [previewMode, setPreviewMode] = React.useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  useEffect(() => {
    // Initialize Builder.io editor
    initializeBuilderEditor();

    return () => {
      // Cleanup editor instance
      cleanupEditor();
    };
  }, [publicApiKey, model, contentId]);

  const initializeBuilderEditor = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, this would load and initialize the Builder.io SDK
      // For demo purposes, we'll simulate the loading
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock Builder.io editor initialization
      if (editorRef.current) {
        // This would be replaced with actual Builder.io SDK initialization:
        // import { builder } from '@builder.io/sdk';
        // await builder.init(publicApiKey);
        // const editor = await builder.edit({ model, content: contentId });
        // editor.render(editorRef.current);

        // For demo, we'll show a placeholder with Builder.io styling
        editorRef.current.innerHTML = `
          <div class="builder-editor-placeholder" style="
            height: 600px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: system-ui;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
          ">
            <div style="text-align: center; z-index: 2;">
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">
                Builder.io Visual Editor
              </div>
              <div style="font-size: 14px; opacity: 0.9;">
                Connect your Builder.io account to see the live editor here
              </div>
            </div>
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" patternUnits=\"userSpaceOnUse\" width=\"100\" height=\"100\"><circle cx=\"50\" cy=\"50\" r=\"1\" fill=\"white\" opacity=\"0.1\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>');
              opacity: 0.3;
            "></div>
          </div>
        `;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to initialize Builder.io editor:", error);
      setIsLoading(false);
    }
  };

  const cleanupEditor = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, this would save the content via Builder.io SDK
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      onSave?.({
        id: contentId || "new-content",
        data: {
          /* content data from Builder.io */
        },
      });
    } catch (error) {
      console.error("Failed to save content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    onPreview?.();
  };

  const getDeviceWidth = () => {
    switch (previewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  };

  return (
    <div className={`h-full flex flex-col bg-background ${className}`}>
      {/* Editor Toolbar */}
      <div className="h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold">Visual Editor</h3>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-orange-600">
                Unsaved Changes
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Device Preview Controls */}
          <div className="flex items-center border rounded-lg p-1">
            {[
              { mode: "desktop" as const, icon: Monitor },
              { mode: "tablet" as const, icon: Tablet },
              { mode: "mobile" as const, icon: Smartphone },
            ].map(({ mode, icon: Icon }) => (
              <Button
                key={mode}
                variant="ghost"
                size="sm"
                className={
                  previewMode === mode
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                onClick={() => setPreviewMode(mode)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || !hasUnsavedChanges}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1" />
            )}
            Save
          </Button>

          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="h-full p-4">
          <div className="h-full bg-white dark:bg-background rounded-lg shadow-lg overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading Builder.io Editor...
                  </p>
                </div>
              </div>
            )}

            {/* Responsive Container */}
            <div className="h-full flex justify-center p-4">
              <div
                className="transition-all duration-300 max-w-full"
                style={{ width: getDeviceWidth() }}
              >
                {previewMode !== "desktop" && (
                  <div className="text-center text-xs text-muted-foreground mb-2">
                    {previewMode === "mobile"
                      ? "Mobile View (375px)"
                      : "Tablet View (768px)"}
                  </div>
                )}

                {/* Builder.io Editor Container */}
                <div
                  ref={editorRef}
                  className="h-full w-full border rounded-lg overflow-hidden"
                  style={{ minHeight: "600px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for Builder.io integration
export function useBuilderIO(publicApiKey: string) {
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const initialize = React.useCallback(async () => {
    if (!publicApiKey) {
      setError("Public API key is required");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would initialize the Builder.io SDK
      // import { builder } from '@builder.io/sdk';
      // await builder.init(publicApiKey);

      // For demo purposes, simulate initialization
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsInitialized(true);
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to initialize Builder.io",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [publicApiKey]);

  React.useEffect(() => {
    if (publicApiKey && !isInitialized) {
      initialize();
    }
  }, [publicApiKey, isInitialized, initialize]);

  return {
    isInitialized,
    isLoading,
    error,
    initialize,
  };
}

// Builder.io Content Component
interface BuilderContentProps {
  model: string;
  content?: any;
  publicApiKey: string;
  className?: string;
}

export function BuilderContent({
  model,
  content,
  publicApiKey,
  className = "",
}: BuilderContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isInitialized } = useBuilderIO(publicApiKey);

  React.useEffect(() => {
    if (isInitialized && contentRef.current) {
      renderContent();
    }
  }, [isInitialized, content]);

  const renderContent = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, this would render Builder.io content
      // const html = await builder.content(model, { content });
      // contentRef.current.innerHTML = html;

      // For demo purposes, show placeholder content
      if (contentRef.current) {
        contentRef.current.innerHTML = `
          <div style="padding: 2rem; text-align: center; background: #f8fafc; border-radius: 8px;">
            <h2 style="margin-bottom: 1rem; color: #1f2937;">Builder.io Content</h2>
            <p style="color: #6b7280;">Your Builder.io content would render here</p>
          </div>
        `;
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to render Builder.io content:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return <div ref={contentRef} className={className} />;
}
