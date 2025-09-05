"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  University,
  BookOpenCheck,
  GraduationCap,
  MessageCircleQuestionMark,
  BookUser,
  ChartSpline,
  BanknoteArrowUp,
  Brain,
  PiggyBank,
  Library,
  MonitorPlay,
  BookOpen,
  BookText,
  CircleDollarSign
} from 'lucide-react';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  completed: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

interface ScenarioResult {
  originalAmount: number;
  newAmount: number;
  difference: number;
  feasible: boolean;
}

const learningModules: LearningModule[] = [
  {
    id: 'budgeting',
    title: 'Smart Budgeting Fundamentals',
    description: 'Master the 50/30/20 rule and advanced budgeting techniques',
    progress: 85,
    difficulty: 'Beginner',
    duration: '45 min',
    completed: false,
    icon: PiggyBank
  },
  {
    id: 'investing',
    title: 'Investment Portfolio Basics',
    description: 'Understanding risk, diversification, and compound growth',
    progress: 60,
    difficulty: 'Intermediate',
    duration: '1h 15min',
    completed: false,
    icon: ChartSpline
  },
  {
    id: 'sip',
    title: 'SIP Strategy Optimization',
    description: 'Maximizing returns through systematic investment plans',
    progress: 100,
    difficulty: 'Intermediate',
    duration: '50 min',
    completed: true,
    icon: BanknoteArrowUp
  }
];

const faqData = [
  {
    question: 'What is compound interest and how does it work?',
    answer: 'Compound interest is interest calculated on both the initial principal and previously earned interest. It\'s often called "interest on interest" and can significantly accelerate wealth growth over time. For example, ₹10,000 invested at 8% annual compound interest becomes ₹21,589 after 10 years.'
  },
  {
    question: 'How much should I invest in equity vs debt?',
    answer: 'A common rule of thumb is to subtract your age from 100 - that percentage should go to equity. For example, if you\'re 30, consider 70% equity and 30% debt. However, this depends on your risk tolerance, financial goals, and investment timeline.'
  },
  {
    question: 'When should I start investing?',
    answer: 'The best time to start investing is as early as possible, even with small amounts. Time is your biggest advantage due to compound interest. Starting with ₹1,000 per month at age 25 can result in significantly more wealth than starting with ₹3,000 per month at age 35.'
  }
];

export default function LearningGuidance() {
  const [activeTab, setActiveTab] = useState('modules');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sipAmount, setSipAmount] = useState([5000]);
  const [inflationRate, setInflationRate] = useState([6]);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      let response = '';
      
      if (aiQuery.toLowerCase().includes('vacation') && aiQuery.toLowerCase().includes('sip')) {
        response = 'Based on your current financial profile, increasing your SIP by 10% (from ₹5,000 to ₹5,500) would still leave you with sufficient funds for a vacation. Your monthly surplus after the increased SIP would be approximately ₹12,000, which can comfortably accommodate a ₹50,000 vacation if saved over 4-5 months. This strategy actually improves your long-term wealth while maintaining lifestyle flexibility.';
      } else if (aiQuery.toLowerCase().includes('emergency fund')) {
        response = 'An ideal emergency fund should cover 6-12 months of your expenses. Based on typical spending patterns, if your monthly expenses are ₹40,000, aim for ₹2.4-4.8 lakhs in your emergency fund. Keep this in liquid investments like savings accounts or liquid mutual funds for easy access during unexpected situations.';
      } else if (aiQuery.toLowerCase().includes('tax saving')) {
        response = 'Under Section 80C, you can save up to ₹1.5 lakhs in taxes annually through investments in ELSS, PPF, EPF, or life insurance. ELSS mutual funds offer the shortest lock-in period (3 years) with potential for higher returns. Additionally, consider Section 80D for health insurance premiums (up to ₹25,000) for additional tax benefits.';
      } else {
        response = 'I understand you\'re looking for personalized financial guidance. Could you provide more specific details about your financial situation, goals, or the particular scenario you\'d like me to analyze? This will help me give you more accurate and actionable advice.';
      }
      
      setAiResponse(response);
      setIsProcessing(false);
    }, 2000);
  };

  const calculateScenario = () => {
    const currentSip = sipAmount[0];
    const increasedSip = currentSip * 1.1; // 10% increase
    const inflationAdjustment = 1 + (inflationRate[0] / 100);
    
    // Simulate 10-year projection
    const years = 10;
    const annualReturn = 0.12; // 12% average return
    
    const originalAmount = currentSip * 12 * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
    const newAmount = increasedSip * 12 * ((Math.pow(1 + annualReturn, years) - 1) / annualReturn);
    
    setScenarioResult({
      originalAmount: originalAmount / inflationAdjustment,
      newAmount: newAmount / inflationAdjustment,
      difference: (newAmount - originalAmount) / inflationAdjustment,
      feasible: true
    });
  };

  const filteredModules = learningModules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-primary/10">
            <University className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-finance-flow">Learning Center</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Master personal finance with interactive lessons, AI coaching, and real-world scenarios
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card border border-border">
          <TabsTrigger value="modules" className="flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4" />
            Modules
          </TabsTrigger>
          <TabsTrigger value="ai-coach" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Coach
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <ChartSpline className="h-4 w-4" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Library className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        {/* Learning Modules */}
        <TabsContent value="modules" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search learning modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-card border-border"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <BookUser className="h-4 w-4" />
              My Learning Path
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card key={module.id} className="bg-card border-border hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant={module.completed ? "default" : "secondary"}>
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{module.duration}</span>
                        <Button size="sm" variant={module.completed ? "outline" : "default"}>
                          {module.completed ? 'Review' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* AI Coach */}
        <TabsContent value="ai-coach" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>AI Financial Coach</CardTitle>
                  <CardDescription>
                    Ask me anything about your finances. I can analyze scenarios and provide personalized advice.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="ai-query">Your Financial Question</Label>
                <Textarea
                  id="ai-query"
                  placeholder="e.g., 'Can I afford a vacation if I increase my SIP by 10%?' or 'How much should I keep in my emergency fund?'"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="min-h-[100px] bg-background border-border"
                />
                <Button 
                  onClick={handleAiQuery} 
                  disabled={isProcessing || !aiQuery.trim()}
                  className="w-full"
                >
                  {isProcessing ? 'Analyzing...' : 'Get AI Guidance'}
                </Button>
              </div>

              {aiResponse && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-3">
                    <MessageCircleQuestionMark className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div className="space-y-2">
                      <h4 className="font-medium">AI Coach Response:</h4>
                      <p className="text-sm leading-relaxed">{aiResponse}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Questions */}
              <div className="space-y-3">
                <h4 className="font-medium">Quick Questions:</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiQuery("How much should I keep in my emergency fund?")}
                    className="justify-start text-left h-auto p-3"
                  >
                    Emergency Fund Size
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiQuery("What are the best tax saving investment options?")}
                    className="justify-start text-left h-auto p-3"
                  >
                    Tax Saving Options
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiQuery("Should I invest in debt or equity funds?")}
                    className="justify-start text-left h-auto p-3"
                  >
                    Debt vs Equity
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setAiQuery("How to plan for retirement at age 60?")}
                    className="justify-start text-left h-auto p-3"
                  >
                    Retirement Planning
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartSpline className="h-5 w-5 text-primary" />
                  What-If Scenario Simulator
                </CardTitle>
                <CardDescription>
                  Explore how changes in your investment strategy affect long-term wealth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Monthly SIP Amount</Label>
                    <div className="mt-2">
                      <Slider
                        value={sipAmount}
                        onValueChange={setSipAmount}
                        max={50000}
                        min={1000}
                        step={500}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>₹1,000</span>
                        <span className="font-medium">₹{sipAmount[0].toLocaleString()}</span>
                        <span>₹50,000</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Expected Inflation Rate</Label>
                    <div className="mt-2">
                      <Slider
                        value={inflationRate}
                        onValueChange={setInflationRate}
                        max={10}
                        min={3}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>3%</span>
                        <span className="font-medium">{inflationRate[0]}%</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={calculateScenario} className="w-full">
                    Calculate Impact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {scenarioResult && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                    10-Year Projection Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-muted/30">
                      <div className="text-sm text-muted-foreground">Current Strategy</div>
                      <div className="text-2xl font-bold">₹{Math.round(scenarioResult.originalAmount).toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/10">
                      <div className="text-sm text-muted-foreground">With 10% SIP Increase</div>
                      <div className="text-2xl font-bold text-primary">₹{Math.round(scenarioResult.newAmount).toLocaleString()}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-500/10">
                      <div className="text-sm text-muted-foreground">Additional Wealth</div>
                      <div className="text-xl font-bold text-green-400">+₹{Math.round(scenarioResult.difference).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    *Assuming 12% average annual returns, adjusted for inflation
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Resources */}
        <TabsContent value="resources" className="space-y-6">
          <div className="grid gap-6">
            {/* Featured Articles */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Featured Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: 'The Psychology of Money: 5 Behavioral Biases to Avoid',
                      description: 'Understanding how emotions affect financial decisions',
                      readTime: '8 min read',
                      category: 'Psychology'
                    },
                    {
                      title: 'Building Your First Investment Portfolio',
                      description: 'Step-by-step guide for investment beginners',
                      readTime: '12 min read',
                      category: 'Investing'
                    },
                    {
                      title: 'Tax Planning Strategies for 2024',
                      description: 'Maximize your tax savings with smart planning',
                      readTime: '15 min read',
                      category: 'Tax Planning'
                    },
                    {
                      title: 'Emergency Fund: How Much is Enough?',
                      description: 'Calculate your ideal emergency fund size',
                      readTime: '6 min read',
                      category: 'Budgeting'
                    }
                  ].map((article, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        <h3 className="font-medium leading-tight">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                        <div className="text-xs text-muted-foreground">{article.readTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorPlay className="h-5 w-5 text-primary" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    'SIP vs Lumpsum: Which is Better?',
                    'Understanding Mutual Fund NAV',
                    'How to Read Financial Statements',
                    'Debt Mutual Funds Explained',
                    'ELSS vs PPF: Tax Saving Comparison',
                    'Portfolio Rebalancing Strategy'
                  ].map((title, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                      <div className="aspect-video bg-muted/30 rounded-md mb-3 flex items-center justify-center">
                        <MonitorPlay className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-sm">{title}</h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircleQuestionMark className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-border">
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Progress Tracking */}
        <TabsContent value="progress" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">68%</div>
                    <div className="text-sm text-muted-foreground">Overall Progress</div>
                  </div>
                  <Progress value={68} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold">3</div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold">2</div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'First Investment', earned: true },
                    { name: 'Budget Master', earned: true },
                    { name: 'SIP Champion', earned: true },
                    { name: 'Tax Optimizer', earned: false },
                    { name: 'Portfolio Builder', earned: false }
                  ].map((achievement, index) => (
                    <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${achievement.earned ? 'bg-primary/10' : 'bg-muted/20'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <GraduationCap className="h-4 w-4" />
                      </div>
                      <span className={`text-sm ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Learning Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Days in a row</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-sm ${
                          i < 12 ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Keep it up! You're on fire 🔥
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookText className="h-5 w-5 text-primary" />
                Recent Learning Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: 'Completed quiz',
                    module: 'SIP Strategy Optimization',
                    score: '9/10',
                    time: '2 hours ago'
                  },
                  {
                    action: 'Read article',
                    module: 'Tax Planning Strategies',
                    score: null,
                    time: '1 day ago'
                  },
                  {
                    action: 'Watched video',
                    module: 'Mutual Fund Basics',
                    score: null,
                    time: '2 days ago'
                  },
                  {
                    action: 'Asked AI Coach',
                    module: 'Emergency Fund Planning',
                    score: null,
                    time: '3 days ago'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <div className="font-medium text-sm">{activity.action}</div>
                      <div className="text-xs text-muted-foreground">{activity.module}</div>
                    </div>
                    <div className="text-right">
                      {activity.score && (
                        <div className="text-sm font-medium text-primary">{activity.score}</div>
                      )}
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}