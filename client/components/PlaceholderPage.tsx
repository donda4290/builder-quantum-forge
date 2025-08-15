import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, ArrowRight, Zap } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  comingSoon?: boolean;
}

export function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon, 
  features = [],
  comingSoon = false 
}: PlaceholderPageProps) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-primary/10">
              <Icon className="h-16 w-16 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {comingSoon && (
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20">
              <Zap className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">Coming Soon</span>
            </div>
          </div>
        )}

        {/* Features List */}
        {features.length > 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What you can expect from this powerful tool
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This powerful feature is being developed to give you the best experience.
          </p>
          <Button size="lg" disabled={comingSoon}>
            {comingSoon ? 'Available Soon' : 'Get Started'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Helper Text */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Want to see this feature implemented? Continue prompting to have it built out for you!
          </p>
        </div>
      </div>
    </div>
  );
}
