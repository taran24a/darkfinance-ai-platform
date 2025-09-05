"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  WalletMinimal, 
  ReceiptText, 
  ChartColumnStacked, 
  SquareActivity, 
  Receipt, 
  CreditCard, 
  ChartBarIncreasing, 
  Wallet, 
  PiggyBank, 
  ChartBar,
  Coins 
} from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  merchant: string;
  description: string;
  date: string;
  tags: string[];
  isRecurring: boolean;
}

interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
}

interface LifestyleMetric {
  name: string;
  dailyCount: number;
  cost: number;
  yearlyProjection: number;
  opportunityCost: number;
}

interface HealthCorrelation {
  metric: string;
  value: number;
  spendingImpact: number;
  trend: "up" | "down" | "stable";
}

export default function ExpenseBudgetManager() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      amount: 5.50,
      category: "Food & Dining",
      merchant: "Starbucks",
      description: "Morning coffee",
      date: "2024-01-15",
      tags: ["coffee", "morning"],
      isRecurring: true
    },
    {
      id: "2",
      amount: 89.99,
      category: "Shopping",
      merchant: "Amazon",
      description: "Bluetooth headphones",
      date: "2024-01-14",
      tags: ["electronics", "tech"],
      isRecurring: false
    },
    {
      id: "3",
      amount: 45.20,
      category: "Transportation",
      merchant: "Shell",
      description: "Gas fill-up",
      date: "2024-01-13",
      tags: ["fuel", "car"],
      isRecurring: false
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "1", category: "Food & Dining", limit: 300, spent: 165.50 },
    { id: "2", category: "Shopping", limit: 500, spent: 289.99 },
    { id: "3", category: "Transportation", limit: 200, spent: 145.20 },
    { id: "4", category: "Entertainment", limit: 150, spent: 75.00 }
  ]);

  const [lifestyleMetrics] = useState<LifestyleMetric[]>([
    {
      name: "Coffee",
      dailyCount: 2,
      cost: 5.50,
      yearlyProjection: 4015,
      opportunityCost: 5420
    },
    {
      name: "Lunch Out",
      dailyCount: 1,
      cost: 12.00,
      yearlyProjection: 4380,
      opportunityCost: 5914
    },
    {
      name: "Rideshare",
      dailyCount: 0.5,
      cost: 15.00,
      yearlyProjection: 2737.50,
      opportunityCost: 3696
    }
  ]);

  const [healthCorrelations] = useState<HealthCorrelation[]>([
    { metric: "Steps", value: 8542, spendingImpact: -12, trend: "up" },
    { metric: "Sleep Hours", value: 7.2, spendingImpact: -5, trend: "stable" },
    { metric: "Stress Level", value: 6.8, spendingImpact: 23, trend: "down" }
  ]);

  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "",
    merchant: "",
    description: "",
    tags: ""
  });

  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: ""
  });

  const [hourlyWage, setHourlyWage] = useState(25);
  const [selectedTab, setSelectedTab] = useState("expenses");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false);

  const categories = [
    "Food & Dining",
    "Shopping",
    "Transportation",
    "Entertainment",
    "Healthcare",
    "Utilities",
    "Travel",
    "Education",
    "Personal Care",
    "Other"
  ];

  const addExpense = useCallback(() => {
    if (!newExpense.amount || !newExpense.category || !newExpense.merchant) return;

    const expense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      merchant: newExpense.merchant,
      description: newExpense.description,
      date: new Date().toISOString().split('T')[0],
      tags: newExpense.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isRecurring: false
    };

    setExpenses(prev => [expense, ...prev]);
    
    // Update budget spending
    setBudgets(prev => prev.map(budget => 
      budget.category === expense.category 
        ? { ...budget, spent: budget.spent + expense.amount }
        : budget
    ));

    setNewExpense({
      amount: "",
      category: "",
      merchant: "",
      description: "",
      tags: ""
    });
    setIsAddExpenseOpen(false);
  }, [newExpense]);

  const addBudget = useCallback(() => {
    if (!newBudget.category || !newBudget.limit) return;

    const budget: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: 0
    };

    setBudgets(prev => [...prev, budget]);
    setNewBudget({ category: "", limit: "" });
    setIsAddBudgetOpen(false);
  }, [newBudget]);

  const calculateSpendingProgress = useCallback((spent: number, limit: number) => {
    return Math.min((spent / limit) * 100, 100);
  }, []);

  const getProgressColor = useCallback((progress: number) => {
    if (progress >= 90) return "bg-destructive";
    if (progress >= 75) return "bg-yellow-500";
    return "bg-primary";
  }, []);

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense & Budget Manager</h1>
          <p className="text-muted-foreground">Track expenses, manage budgets, and optimize your spending habits</p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
            <DialogTrigger asChild>
              <Button>
                <Receipt className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>Log a new expense to track your spending</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newExpense.category} onValueChange={(value) => setNewExpense(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="merchant">Merchant</Label>
                  <Input
                    id="merchant"
                    placeholder="Store or service name"
                    value={newExpense.merchant}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, merchant: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What did you buy?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="coffee, morning, work"
                    value={newExpense.tags}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, tags: e.target.value }))}
                  />
                </div>
                <Button onClick={addExpense} className="w-full">Add Expense</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddBudgetOpen} onOpenChange={setIsAddBudgetOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PiggyBank className="h-4 w-4 mr-2" />
                Add Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>Set spending limits for a category</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-category">Category</Label>
                  <Select value={newBudget.category} onValueChange={(value) => setNewBudget(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => !budgets.some(b => b.category === cat)).map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget-limit">Monthly Limit</Label>
                  <Input
                    id="budget-limit"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget(prev => ({ ...prev, limit: e.target.value }))}
                  />
                </div>
                <Button onClick={addBudget} className="w-full">Create Budget</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <WalletMinimal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget used
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-destructive' : 'text-foreground'}`}>
              ${remainingBudget.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {remainingBudget < 0 ? 'Over budget' : 'Available to spend'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ReceiptText className="h-5 w-5" />
                Recent Expenses
              </CardTitle>
              <CardDescription>Your latest spending activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{expense.merchant}</span>
                        {expense.isRecurring && (
                          <Badge variant="secondary" className="text-xs">Recurring</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{expense.category}</Badge>
                        {expense.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">${expense.amount.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{expense.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budgets Tab */}
        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4">
            {budgets.map((budget) => {
              const progress = calculateSpendingProgress(budget.spent, budget.limit);
              const remaining = budget.limit - budget.spent;
              
              return (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{budget.category}</CardTitle>
                      <Badge variant={progress >= 90 ? "destructive" : progress >= 75 ? "secondary" : "default"}>
                        {progress.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Spent: ${budget.spent.toFixed(2)}</span>
                        <span>Limit: ${budget.limit.toFixed(2)}</span>
                      </div>
                      <Progress 
                        value={progress} 
                        className={`w-full ${getProgressColor(progress)}`}
                      />
                      <div className="text-sm text-muted-foreground">
                        {remaining >= 0 ? (
                          <span>${remaining.toFixed(2)} remaining</span>
                        ) : (
                          <span className="text-destructive">${Math.abs(remaining).toFixed(2)} over budget</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Cost of Habits Calculator
              </CardTitle>
              <CardDescription>See the true cost of your daily habits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="hourly-wage">Your Hourly Wage ($)</Label>
                  <Input
                    id="hourly-wage"
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>
              
              <div className="grid gap-4">
                {lifestyleMetrics.map((metric) => {
                  const hoursToWork = metric.cost / hourlyWage;
                  const minutesToWork = hoursToWork * 60;
                  
                  return (
                    <div key={metric.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg">{metric.name}</h3>
                        <Badge>{metric.dailyCount}x daily</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Daily Cost</p>
                          <p className="font-semibold">${(metric.cost * metric.dailyCount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Work Time</p>
                          <p className="font-semibold">{minutesToWork.toFixed(0)} min</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Yearly Cost</p>
                          <p className="font-semibold">${metric.yearlyProjection.toFixed(0)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Opportunity Cost</p>
                          <p className="font-semibold text-primary">${metric.opportunityCost.toFixed(0)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SquareActivity className="h-5 w-5" />
                Health-Expense Correlations
              </CardTitle>
              <CardDescription>How your health metrics affect your spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {healthCorrelations.map((correlation) => (
                  <div key={correlation.metric} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{correlation.metric}</span>
                        <Badge variant={correlation.trend === "up" ? "default" : correlation.trend === "down" ? "destructive" : "secondary"}>
                          {correlation.trend}
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold">{correlation.value}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Spending Impact</p>
                      <p className={`text-lg font-semibold ${correlation.spendingImpact > 0 ? 'text-destructive' : 'text-green-500'}`}>
                        {correlation.spendingImpact > 0 ? '+' : ''}{correlation.spendingImpact}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBarIncreasing className="h-5 w-5" />
                  Spending Forecast
                </CardTitle>
                <CardDescription>AI-powered predictions for your upcoming expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Overspend Alert</span>
                    </div>
                    <p className="text-sm">You're on track to exceed your Food & Dining budget by $85 this month based on current spending patterns.</p>
                  </div>
                  
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Saving Opportunity</span>
                    </div>
                    <p className="text-sm">Your coffee purchases have increased 23% this month. Consider brewing at home to save $67.</p>
                  </div>
                  
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Good Progress</span>
                    </div>
                    <p className="text-sm">You're 15% under budget in Transportation this month. Great job on optimizing your commute!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
                  Spending Patterns
                </CardTitle>
                <CardDescription>Analysis of your financial behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Peak Spending Day</span>
                    <Badge>Fridays</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Most Frequent Category</span>
                    <Badge>Food & Dining</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Average Transaction</span>
                    <Badge>$23.45</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span>Impulse Purchase Risk</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}