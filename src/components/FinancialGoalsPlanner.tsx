"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Goal, 
  Target, 
  ChartBarIncreasing, 
  ChartPie, 
  CalendarPlus2, 
  FlagTriangleRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: number;
  riskProfile: string;
  monthlyContribution: number;
  photoUrl?: string;
}

interface LifeEvent {
  id: string;
  title: string;
  estimatedCost: number;
  timeframe: string;
  suggestedSavings: number;
  fundingGap: number;
}

const GOAL_CATEGORIES = [
  { value: "vacation", label: "Vacation & Travel" },
  { value: "home", label: "Home Purchase" },
  { value: "retirement", label: "Retirement" },
  { value: "education", label: "Education" },
  { value: "emergency", label: "Emergency Fund" },
  { value: "car", label: "Vehicle" },
  { value: "wedding", label: "Wedding" },
  { value: "other", label: "Other" }
];

const RISK_PROFILES = [
  { value: "conservative", label: "Conservative" },
  { value: "moderate", label: "Moderate" },
  { value: "aggressive", label: "Aggressive" }
];

const SAMPLE_GOALS: FinancialGoal[] = [
  {
    id: "1",
    title: "European Vacation",
    description: "Three-week trip through Italy, France, and Spain",
    targetAmount: 8500,
    currentAmount: 3200,
    targetDate: "2025-06-15",
    category: "vacation",
    priority: 2,
    riskProfile: "moderate",
    monthlyContribution: 450,
    photoUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    title: "House Down Payment",
    description: "20% down payment for first home",
    targetAmount: 80000,
    currentAmount: 32000,
    targetDate: "2026-12-31",
    category: "home",
    priority: 1,
    riskProfile: "conservative",
    monthlyContribution: 2000
  },
  {
    id: "3",
    title: "Retirement Fund",
    description: "Building long-term retirement security",
    targetAmount: 500000,
    currentAmount: 125000,
    targetDate: "2045-01-01",
    category: "retirement",
    priority: 1,
    riskProfile: "aggressive",
    monthlyContribution: 1200
  }
];

const LIFE_EVENTS: LifeEvent[] = [
  {
    id: "1",
    title: "Marriage & Wedding",
    estimatedCost: 35000,
    timeframe: "2-3 years",
    suggestedSavings: 1200,
    fundingGap: 15000
  },
  {
    id: "2",
    title: "Children's Education",
    estimatedCost: 120000,
    timeframe: "15-20 years",
    suggestedSavings: 500,
    fundingGap: 45000
  },
  {
    id: "3",
    title: "Career Transition",
    estimatedCost: 25000,
    timeframe: "1-2 years",
    suggestedSavings: 1000,
    fundingGap: 8000
  }
];

export default function FinancialGoalsPlanner({ className = "" }: { className?: string }) {
  const [goals, setGoals] = useState<FinancialGoal[]>(SAMPLE_GOALS);
  const [activeTab, setActiveTab] = useState("overview");
  const [isGoalWizardOpen, setIsGoalWizardOpen] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    priority: 2,
    riskProfile: "moderate",
    monthlyContribution: 0
  });

  const calculateProgress = useCallback((goal: FinancialGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  }, []);

  const calculateMonthsRemaining = useCallback((targetDate: string) => {
    const target = new Date(targetDate);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    return Math.max(diffMonths, 0);
  }, []);

  const totalNetWorth = useMemo(() => {
    return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  }, [goals]);

  const projectedNetWorth = useMemo(() => {
    const monthlyTotal = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
    return totalNetWorth + (monthlyTotal * 12 * 5); // 5-year projection
  }, [goals, totalNetWorth]);

  const handleCreateGoal = useCallback(() => {
    if (newGoal.title && newGoal.targetAmount && newGoal.targetDate && newGoal.category) {
      const goal: FinancialGoal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description || "",
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        targetDate: newGoal.targetDate,
        category: newGoal.category,
        priority: newGoal.priority || 2,
        riskProfile: newGoal.riskProfile || "moderate",
        monthlyContribution: newGoal.monthlyContribution || 0
      };
      
      setGoals(prev => [...prev, goal]);
      setNewGoal({ priority: 2, riskProfile: "moderate", monthlyContribution: 0 });
      setIsGoalWizardOpen(false);
    }
  }, [newGoal]);

  const getPriorityColor = useCallback((priority: number) => {
    switch (priority) {
      case 1: return "bg-red-500/20 text-red-400 border-red-500/30";
      case 2: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case 3: return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  }, []);

  const getPriorityLabel = useCallback((priority: number) => {
    switch (priority) {
      case 1: return "High Priority";
      case 2: return "Medium Priority";
      case 3: return "Low Priority";
      default: return "No Priority";
    }
  }, []);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--text-gradient-start)] to-[var(--text-gradient-end)] bg-clip-text text-transparent">
            Financial Goals Planner
          </h1>
          <p className="text-muted-foreground">
            Create, track, and achieve your financial objectives with AI-powered insights
          </p>
        </div>
        
        <Dialog open={isGoalWizardOpen} onOpenChange={setIsGoalWizardOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Goal className="w-4 h-4 mr-2" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle>Create New Financial Goal</DialogTitle>
              <DialogDescription>
                Set up a new financial goal with target amounts, timelines, and risk preferences
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Goal Title</Label>
                  <Input
                    id="goal-title"
                    placeholder="e.g., Dream Vacation"
                    value={newGoal.title || ""}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-category">Category</Label>
                  <Select
                    value={newGoal.category || ""}
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOAL_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  placeholder="Describe your goal in detail..."
                  value={newGoal.description || ""}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-amount">Target Amount</Label>
                  <Input
                    id="target-amount"
                    type="number"
                    placeholder="0"
                    value={newGoal.targetAmount || ""}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-date">Target Date</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={newGoal.targetDate || ""}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority Level</Label>
                  <div className="px-3 py-2">
                    <Slider
                      value={[newGoal.priority || 2]}
                      onValueChange={([value]) => setNewGoal(prev => ({ ...prev, priority: value }))}
                      max={3}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk-profile">Risk Profile</Label>
                  <Select
                    value={newGoal.riskProfile || ""}
                    onValueChange={(value) => setNewGoal(prev => ({ ...prev, riskProfile: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {RISK_PROFILES.map((profile) => (
                        <SelectItem key={profile.value} value={profile.value}>
                          {profile.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="monthly-contribution">Monthly Contribution</Label>
                <Input
                  id="monthly-contribution"
                  type="number"
                  placeholder="0"
                  value={newGoal.monthlyContribution || ""}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, monthlyContribution: Number(e.target.value) }))}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsGoalWizardOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGoal}>
                  Create Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            My Goals
          </TabsTrigger>
          <TabsTrigger value="life-events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Life Events
          </TabsTrigger>
          <TabsTrigger value="net-worth" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Net Worth Journey
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <p className="text-xs text-muted-foreground">
                  {goals.filter(g => calculateProgress(g) < 100).length} in progress
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                <ChartBarIncreasing className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalNetWorth.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Across all goals
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Contributions</CardTitle>
                <CalendarPlus2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total monthly commitment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Priority Goals */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle>High Priority Goals</CardTitle>
              <CardDescription>Your most important financial objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals
                  .filter(goal => goal.priority === 1)
                  .map((goal) => {
                    const progress = calculateProgress(goal);
                    const monthsLeft = calculateMonthsRemaining(goal.targetDate);
                    
                    return (
                      <motion.div
                        key={goal.id}
                        layout
                        className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30 border border-border/50"
                      >
                        {goal.photoUrl && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                            <img
                              src={goal.photoUrl}
                              alt={goal.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold truncate">{goal.title}</h3>
                            <Badge className={getPriorityColor(goal.priority)}>
                              {getPriorityLabel(goal.priority)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>${goal.currentAmount.toLocaleString()} of ${goal.targetAmount.toLocaleString()}</span>
                              <span>{monthsLeft} months left</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{progress.toFixed(1)}% complete</span>
                              <span>+${goal.monthlyContribution}/month</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Goals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {goals.map((goal) => {
                const progress = calculateProgress(goal);
                const monthsLeft = calculateMonthsRemaining(goal.targetDate);
                
                return (
                  <motion.div
                    key={goal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-colors group">
                      <CardHeader className="space-y-0">
                        {goal.photoUrl && (
                          <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                            <img
                              src={goal.photoUrl}
                              alt={goal.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{goal.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {GOAL_CATEGORIES.find(c => c.value === goal.category)?.label}
                            </CardDescription>
                          </div>
                          <Badge className={getPriorityColor(goal.priority)} variant="outline">
                            <FlagTriangleRight className="w-3 h-3 mr-1" />
                            P{goal.priority}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">${goal.currentAmount.toLocaleString()}</span>
                            <span className="text-muted-foreground">${goal.targetAmount.toLocaleString()}</span>
                          </div>
                          
                          <Progress value={progress} className="h-3">
                            <motion.div
                              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </Progress>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress.toFixed(1)}% complete</span>
                            <span>{monthsLeft} months left</span>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Monthly: </span>
                              <span className="font-medium text-green-400">+${goal.monthlyContribution}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {goal.riskProfile}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="life-events" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartPie className="w-5 h-5 mr-2" />
                AI Life Event Planner
              </CardTitle>
              <CardDescription>
                Get personalized savings strategies for major life events with funding gap analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {LIFE_EVENTS.map((event) => (
                  <motion.div
                    key={event.id}
                    className="p-6 rounded-xl bg-muted/20 border border-border/50"
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">Expected in {event.timeframe}</p>
                      </div>
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        AI Suggested
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Estimated Cost</p>
                        <p className="text-xl font-bold">${event.estimatedCost.toLocaleString()}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Suggested Monthly Savings</p>
                        <p className="text-xl font-bold text-green-400">${event.suggestedSavings.toLocaleString()}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Funding Gap</p>
                        <p className="text-xl font-bold text-red-400">${event.fundingGap.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Create Goal
                      </Button>
                      <Button size="sm" variant="outline">
                        View Strategy
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="net-worth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current vs Projected */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Net Worth Projection</CardTitle>
                <CardDescription>5-year outlook based on current contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Net Worth</span>
                      <span className="text-2xl font-bold">${totalNetWorth.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Projected (5 years)</span>
                      <span className="text-2xl font-bold text-green-400">${projectedNetWorth.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Progress</span>
                      <span>{((projectedNetWorth - totalNetWorth) / totalNetWorth * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((totalNetWorth / projectedNetWorth) * 100, 100)} 
                      className="h-3"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <div className="text-sm text-muted-foreground mb-2">Monthly Impact</div>
                    <div className="flex justify-between items-center">
                      <span>Total Contributions</span>
                      <span className="font-semibold text-green-400">
                        +${goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0).toLocaleString()}/month
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Modeling */}
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle>Scenario Modeling</CardTitle>
                <CardDescription>Adjust contributions to see different outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { label: "Conservative (+10%)", multiplier: 1.1, color: "text-blue-400" },
                      { label: "Aggressive (+25%)", multiplier: 1.25, color: "text-green-400" },
                      { label: "Super Saver (+50%)", multiplier: 1.5, color: "text-purple-400" }
                    ].map((scenario) => {
                      const scenarioValue = Math.floor(projectedNetWorth * scenario.multiplier);
                      return (
                        <div key={scenario.label} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                          <span className="text-sm font-medium">{scenario.label}</span>
                          <span className={`font-bold ${scenario.color}`}>
                            ${scenarioValue.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <Button className="w-full" variant="outline">
                      <ChartBarIncreasing className="w-4 h-4 mr-2" />
                      Run Advanced Scenarios
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievement Timeline */}
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle>Goal Achievement Timeline</CardTitle>
              <CardDescription>When you'll reach each financial milestone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goals
                  .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                  .map((goal, index) => {
                    const progress = calculateProgress(goal);
                    const monthsLeft = calculateMonthsRemaining(goal.targetDate);
                    
                    return (
                      <motion.div
                        key={goal.id}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-muted/20 border border-border/50"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium">{goal.title}</h4>
                            <span className="text-sm text-muted-foreground">
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <Progress value={progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium">
                              {progress >= 100 ? "Complete!" : `${monthsLeft}mo left`}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}