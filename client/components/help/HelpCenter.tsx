import React, { useState } from 'react';
import { useHelp, HelpArticle, Tutorial, FAQ } from '@/contexts/HelpContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  BookOpen, 
  Play, 
  HelpCircle, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  User,
  ChevronRight,
  Star,
  CheckCircle,
  ExternalLink,
  Download,
  Video,
  FileText,
  Lightbulb,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function HelpCenter() {
  const { 
    articles, 
    tutorials, 
    faqs, 
    categories,
    searchArticles,
    searchFAQs,
    markArticleHelpful,
    markFAQHelpful,
    startTutorial,
    completeTutorialStep,
    getUserProgress
  } = useHelp();
  
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const progress = getUserProgress();
  const featuredArticles = articles.filter(article => article.featured);
  const featuredTutorials = tutorials.filter(tutorial => tutorial.featured);

  const searchResults = searchQuery ? {
    articles: searchArticles(searchQuery),
    faqs: searchFAQs(searchQuery)
  } : { articles: [], faqs: [] };

  const handleStartTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStep(0);
    startTutorial(tutorial.id);
  };

  const handleCompleteStep = (stepId: string) => {
    if (!selectedTutorial) return;
    
    completeTutorialStep(selectedTutorial.id, stepId);
    
    // Update local state
    const updatedSteps = selectedTutorial.steps.map(step =>
      step.id === stepId ? { ...step, completed: true } : step
    );
    setSelectedTutorial({ ...selectedTutorial, steps: updatedSteps });
    
    // Move to next step
    if (currentStep < selectedTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    toast({
      title: 'Step Completed!',
      description: 'Great progress! Moving to the next step.'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'interactive':
        return <Target className="w-4 h-4" />;
      case 'code':
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers, learn new skills, and get the most out of your e-commerce platform
        </p>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search for help articles, tutorials, or FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* User Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Your Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{progress.completedTutorials}</div>
              <div className="text-sm text-gray-600">Tutorials Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{progress.articlesRead}</div>
              <div className="text-sm text-gray-600">Articles Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progress.helpfulVotes}</div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((progress.completedTutorials / progress.totalTutorials) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
          </div>
          <Progress 
            value={(progress.completedTutorials / progress.totalTutorials) * 100} 
            className="mt-4"
          />
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results for "{searchQuery}"</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="articles">
              <TabsList>
                <TabsTrigger value="articles">Articles ({searchResults.articles.length})</TabsTrigger>
                <TabsTrigger value="faqs">FAQs ({searchResults.faqs.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="articles" className="space-y-4">
                {searchResults.articles.map(article => (
                  <div key={article.id} className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                       onClick={() => setSelectedArticle(article)}>
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {article.content.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{article.category}</span>
                      <span>{article.estimatedTime} min read</span>
                      <Badge className={getDifficultyColor(article.difficulty)}>
                        {article.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="faqs" className="space-y-4">
                {searchResults.faqs.map(faq => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{faq.question}</h3>
                    <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{faq.category}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markFAQHelpful(faq.id, true)}
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="ml-1">{faq.helpful}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markFAQHelpful(faq.id, false)}
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span className="ml-1">{faq.notHelpful}</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {!searchQuery && (
        <Tabs defaultValue="tutorials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="articles">Documentation</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
          </TabsList>

          <TabsContent value="tutorials" className="space-y-6">
            {/* Featured Tutorials */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Featured Tutorials
                </CardTitle>
                <CardDescription>
                  Hand-picked tutorials to help you get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredTutorials.map(tutorial => (
                    <Card key={tutorial.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{tutorial.title}</span>
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{tutorial.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {tutorial.estimatedTime} min
                              </span>
                              <span>{tutorial.steps.length} steps</span>
                            </div>
                            <span>{tutorial.category}</span>
                          </div>
                          
                          {tutorial.progress > 0 && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{tutorial.progress}%</span>
                              </div>
                              <Progress value={tutorial.progress} />
                            </div>
                          )}
                          
                          <Button 
                            className="w-full"
                            onClick={() => handleStartTutorial(tutorial)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {tutorial.progress > 0 ? 'Continue' : 'Start Tutorial'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Tutorials by Category */}
            <Card>
              <CardHeader>
                <CardTitle>All Tutorials</CardTitle>
                <CardDescription>
                  Browse tutorials by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.slice(0, 6).map(category => {
                    const categoryTutorials = tutorials.filter(t => t.category === category);
                    if (categoryTutorials.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-medium mb-3">{category}</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                          {categoryTutorials.map(tutorial => (
                            <div key={tutorial.id} 
                                 className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                                 onClick={() => handleStartTutorial(tutorial)}>
                              <h4 className="font-medium">{tutorial.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{tutorial.description}</p>
                              <div className="flex items-center justify-between mt-3">
                                <Badge className={getDifficultyColor(tutorial.difficulty)} variant="outline">
                                  {tutorial.difficulty}
                                </Badge>
                                <span className="text-xs text-gray-500">{tutorial.estimatedTime} min</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            {/* Featured Articles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Popular Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map(article => (
                    <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => setSelectedArticle(article)}>
                      <CardHeader>
                        <CardTitle>{article.title}</CardTitle>
                        <CardDescription>
                          {article.content.substring(0, 120)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {article.estimatedTime} min
                            </span>
                            <span className="flex items-center">
                              <TrendingUp className="w-4 h-4 mr-1" />
                              {article.views} views
                            </span>
                          </div>
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Articles by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {categories.map(category => {
                    const categoryArticles = articles.filter(a => a.category === category);
                    if (categoryArticles.length === 0) return null;
                    
                    return (
                      <div key={category} 
                           className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                           onClick={() => setSelectedCategory(category)}>
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''}
                        </p>
                        <ChevronRight className="w-4 h-4 mt-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categories.slice(0, 6).map(category => {
                    const categoryFAQs = faqs.filter(f => f.category === category);
                    if (categoryFAQs.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <h3 className="font-medium mb-3">{category}</h3>
                        <div className="space-y-3">
                          {categoryFAQs.slice(0, 3).map(faq => (
                            <div key={faq.id} className="border rounded-lg p-4">
                              <h4 className="font-medium">{faq.question}</h4>
                              <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-xs text-gray-500">
                                  Updated {faq.lastUpdated.toLocaleDateString()}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markFAQHelpful(faq.id, true)}
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="ml-1">{faq.helpful}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markFAQHelpful(faq.id, false)}
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span className="ml-1">{faq.notHelpful}</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedArticle.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>{selectedArticle.category}</span>
                    <span>•</span>
                    <span>{selectedArticle.estimatedTime} min read</span>
                    <span>•</span>
                    <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                      {selectedArticle.difficulty}
                    </Badge>
                    <span>•</span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {selectedArticle.author}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-gray-500">
                  Last updated: {selectedArticle.lastUpdated.toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Was this helpful?</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markArticleHelpful(selectedArticle.id, true)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="ml-1">{selectedArticle.helpful}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markArticleHelpful(selectedArticle.id, false)}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="ml-1">{selectedArticle.notHelpful}</span>
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Tutorial Modal */}
      <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTutorial && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTutorial.title}</DialogTitle>
                <DialogDescription>
                  Step {currentStep + 1} of {selectedTutorial.steps.length}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <Progress value={((currentStep + 1) / selectedTutorial.steps.length) * 100} />
                
                <div className="border rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {getStepIcon(selectedTutorial.steps[currentStep].type)}
                    <h3 className="text-lg font-medium">{selectedTutorial.steps[currentStep].title}</h3>
                  </div>
                  
                  <div className="prose max-w-none">
                    <p>{selectedTutorial.steps[currentStep].content}</p>
                  </div>
                  
                  {selectedTutorial.steps[currentStep].resources && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Resources</h4>
                      <div className="space-y-2">
                        {selectedTutorial.steps[currentStep].resources?.map(resource => (
                          <div key={resource.id} className="flex items-center space-x-2">
                            {resource.type === 'download' && <Download className="w-4 h-4" />}
                            {resource.type === 'link' && <ExternalLink className="w-4 h-4" />}
                            <a href={resource.url} className="text-blue-600 hover:underline text-sm">
                              {resource.title}
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex space-x-2">
                    {!selectedTutorial.steps[currentStep].completed && (
                      <Button onClick={() => handleCompleteStep(selectedTutorial.steps[currentStep].id)}>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                    
                    {currentStep < selectedTutorial.steps.length - 1 ? (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button>
                        Finish Tutorial
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
