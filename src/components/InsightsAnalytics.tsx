"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ChartArea,
  ChartSpline,
  ChartColumnBig,
  ChartColumnStacked,
  ChartBarIncreasing,
  ChartBar,
  ChartScatter,
  ChartPie,
  FileChartColumn,
  SquareActivity,
  ChartLine,
  FileChartPie
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NetWorthData {
  month: string;
  assets: number;
  liabilities: number;
  netWorth: number;
}

interface CashflowData {
  category: string;
  income: number;
  expenses: number;
  net: number;
}

interface SpendingHeatmap {
  day: string;
  hour: number;
  amount: number;
  category: string;
}

interface EmotionalSpending {
  mood: string;
  category: string;
  amount: number;
  frequency: number;
}

interface PeerComparison {
  metric: string;
  userValue: number;
  peerAverage: number;
  percentile: number;
}

interface TimeValueAnalysis {
  expense: string;
  amount: number;
  workHours: number;
  category: string;
}

interface FinancialHealthScore {
  category: string;
  score: number;
  maxScore: number;
  trend: "up" | "down" | "stable";
}

interface PredictiveAnalytics {
  category: string;
  currentTrend: number;
  predictedNext3Months: number[];
  confidence: number;
}

export default function InsightsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("3months");
  const [activeTab, setActiveTab] = useState("overview");
  const [hourlyWage, setHourlyWage] = useState(25);

  // Mock data
  const netWorthData: NetWorthData[] = [
    { month: "Jan", assets: 125000, liabilities: 45000, netWorth: 80000 },
    { month: "Feb", assets: 128000, liabilities: 44000, netWorth: 84000 },
    { month: "Mar", assets: 131000, liabilities: 43000, netWorth: 88000 },
    { month: "Apr", assets: 129000, liabilities: 42000, netWorth: 87000 },
    { month: "May", assets: 135000, liabilities: 41000, netWorth: 94000 },
    { month: "Jun", assets: 142000, liabilities: 40000, netWorth: 102000 }
  ];

  const cashflowData: CashflowData[] = [
    { category: "Salary", income: 8500, expenses: 0, net: 8500 },
    { category: "Freelance", income: 1200, expenses: 0, net: 1200 },
    { category: "Housing", income: 0, expenses: 2800, net: -2800 },
    { category: "Food", income: 0, expenses: 650, net: -650 },
    { category: "Transportation", income: 0, expenses: 420, net: -420 },
    { category: "Entertainment", income: 0, expenses: 380, net: -380 },
    { category: "Utilities", income: 0, expenses: 280, net: -280 }
  ];

  const emotionalSpendingData: EmotionalSpending[] = [
    { mood: "Stressed", category: "Food Delivery", amount: 340, frequency: 12 },
    { mood: "Happy", category: "Shopping", amount: 580, frequency: 8 },
    { mood: "Sad", category: "Entertainment", amount: 220, frequency: 6 },
    { mood: "Excited", category: "Travel", amount: 1200, frequency: 3 },
    { mood: "Anxious", category: "Retail Therapy", amount: 450, frequency: 7 }
  ];

  const peerComparisonData: PeerComparison[] = [
    { metric: "Savings Rate", userValue: 22, peerAverage: 15, percentile: 78 },
    { metric: "Emergency Fund", userValue: 6.2, peerAverage: 3.5, percentile: 85 },
    { metric: "Debt-to-Income", userValue: 0.18, peerAverage: 0.34, percentile: 92 },
    { metric: "Investment Allocation", userValue: 68, peerAverage: 45, percentile: 73 }
  ];

  const timeValueData: TimeValueAnalysis[] = [
    { expense: "Daily Coffee", amount: 6.50, workHours: 0.26, category: "Food & Drink" },
    { expense: "Streaming Services", amount: 45, workHours: 1.8, category: "Entertainment" },
    { expense: "Gym Membership", amount: 89, workHours: 3.6, category: "Health" },
    { expense: "Phone Plan", amount: 85, workHours: 3.4, category: "Utilities" },
    { expense: "Car Insurance", amount: 156, workHours: 6.2, category: "Transportation" }
  ];

  const healthScores: FinancialHealthScore[] = [
    { category: "Emergency Fund", score: 8.2, maxScore: 10, trend: "up" },
    { category: "Debt Management", score: 7.8, maxScore: 10, trend: "up" },
    { category: "Savings Rate", score: 6.9, maxScore: 10, trend: "stable" },
    { category: "Investment Diversity", score: 7.5, maxScore: 10, trend: "up" },
    { category: "Spending Control", score: 6.2, maxScore: 10, trend: "down" }
  ];

  const predictiveData: PredictiveAnalytics[] = [
    { category: "Housing", currentTrend: 2800, predictedNext3Months: [2850, 2900, 2950], confidence: 87 },
    { category: "Food", currentTrend: 650, predictedNext3Months: [680, 720, 740], confidence: 73 },
    { category: "Transportation", currentTrend: 420, predictedNext3Months: [430, 440, 445], confidence: 91 },
    { category: "Entertainment", currentTrend: 380, predictedNext3Months: [420, 450, 480], confidence: 65 }
  ];

  const overallHealthScore = useMemo(() => {
    const avg = healthScores.reduce((acc, item) => acc + item.score, 0) / healthScores.length;
    return Math.round(avg * 10) / 10;
  }, [healthScores]);

  const netWorthTrend = useMemo(() => {
    const current = netWorthData[netWorthData.length - 1]?.netWorth || 0;
    const previous = netWorthData[netWorthData.length - 2]?.netWorth || 0;
    return ((current - previous) / previous * 100).toFixed(1);
  }, [netWorthData]);

  const savingsRate = useMemo(() => {
    const totalIncome = cashflowData.filter(item => item.income > 0).reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = Math.abs(cashflowData.filter(item => item.expenses > 0).reduce((sum, item) => sum + item.expenses, 0));
    return totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : "0";
  }, [cashflowData]);

  const SpendingHeatmapGrid = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-2">
        <div className="grid grid-cols-25 gap-1 text-xs">
          <div></div>
          {hours.map(hour => (
            <div key={hour} className="text-center text-muted-foreground">
              {hour % 6 === 0 ? hour : ""}
            </div>
          ))}
        </div>
        {days.map(day => (
          <div key={day} className="grid grid-cols-25 gap-1">
            <div className="text-xs text-muted-foreground w-8">{day}</div>
            {hours.map(hour => {
              const intensity = Math.random();
              return (
                <div
                  key={`${day}-${hour}`}
                  className={cn(
                    "w-3 h-3 rounded-sm",
                    intensity < 0.2 ? "bg-muted" :
                    intensity < 0.4 ? "bg-primary/20" :
                    intensity < 0.6 ? "bg-primary/40" :
                    intensity < 0.8 ? "bg-primary/60" : "bg-primary/80"
                  )}
                  title={`${day} ${hour}:00 - $${(intensity * 200).toFixed(0)}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your financial patterns and behaviors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <FileChartColumn className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
              <ChartSpline className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$102,000</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant={parseFloat(netWorthTrend) > 0 ? "default" : "destructive"} className="text-xs">
                {parseFloat(netWorthTrend) > 0 ? "+" : ""}{netWorthTrend}%
              </Badge>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Financial Health</CardTitle>
              <SquareActivity className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallHealthScore}/10</div>
            <Progress value={overallHealthScore * 10} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">Excellent standing</div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
              <ChartBarIncreasing className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Above 78th percentile
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Debt-to-Income</CardTitle>
              <ChartArea className="w-4 h-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18%</div>
            <div className="text-xs text-muted-foreground mt-1">
              Healthy ratio
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
          <TabsTrigger value="peer">Peer Analysis</TabsTrigger>
          <TabsTrigger value="timevalue">Time Value</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Net Worth Tracking */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartSpline className="w-5 h-5 text-primary" />
                  Net Worth Trend
                </CardTitle>
                <CardDescription>
                  Assets, liabilities, and net worth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {netWorthData.slice(-3).map((data, index) => (
                    <div key={data.month} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{data.month}</span>
                      <div className="text-right">
                        <div className="text-lg font-bold">${data.netWorth.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          A: ${data.assets.toLocaleString()} | L: ${data.liabilities.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Health Scores */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SquareActivity className="w-5 h-5 text-primary" />
                  Health Score Breakdown
                </CardTitle>
                <CardDescription>
                  Individual component scores and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthScores.map((score) => (
                    <div key={score.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{score.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{score.score}</span>
                          <Badge variant={
                            score.trend === "up" ? "default" : 
                            score.trend === "down" ? "destructive" : "secondary"
                          } className="text-xs">
                            {score.trend === "up" ? "↑" : score.trend === "down" ? "↓" : "→"}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={(score.score / score.maxScore) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cashflow Tab */}
        <TabsContent value="cashflow" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cashflow Reports */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartColumnBig className="w-5 h-5 text-primary" />
                  Monthly Cashflow
                </CardTitle>
                <CardDescription>
                  Income vs expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cashflowData.map((item) => (
                    <div key={item.category} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.category}</span>
                      <div className="text-right">
                        <div className={cn(
                          "text-lg font-bold",
                          item.net > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {item.net > 0 ? "+" : ""}${Math.abs(item.net).toLocaleString()}
                        </div>
                        {item.income > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Income: ${item.income.toLocaleString()}
                          </div>
                        )}
                        {item.expenses > 0 && (
                          <div className="text-xs text-muted-foreground">
                            Expenses: ${item.expenses.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Spending Heatmap */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartScatter className="w-5 h-5 text-primary" />
                  Spending Heatmap
                </CardTitle>
                <CardDescription>
                  When you spend throughout the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SpendingHeatmapGrid />
                <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={cn(
                          "w-3 h-3 rounded-sm",
                          level === 0 ? "bg-muted" :
                          level === 1 ? "bg-primary/20" :
                          level === 2 ? "bg-primary/40" :
                          level === 3 ? "bg-primary/60" : "bg-primary/80"
                        )}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Behavioral Tab */}
        <TabsContent value="behavioral" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartPie className="w-5 h-5 text-primary" />
                Emotional Spending Analysis
              </CardTitle>
              <CardDescription>
                How your mood affects spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {emotionalSpendingData.map((data) => (
                  <div key={data.mood} className="space-y-3 p-4 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{data.mood}</h4>
                        <p className="text-sm text-muted-foreground">{data.category}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {data.frequency}x
                      </Badge>
                    </div>
                    <div className="text-xl font-bold">${data.amount}</div>
                    <div className="text-xs text-muted-foreground">
                      Avg: ${(data.amount / data.frequency).toFixed(0)} per occurrence
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peer Analysis Tab */}
        <TabsContent value="peer" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBar className="w-5 h-5 text-primary" />
                Peer Comparison
              </CardTitle>
              <CardDescription>
                How you compare to similar demographics (anonymized data)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {peerComparisonData.map((comparison) => (
                  <div key={comparison.metric} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{comparison.metric}</span>
                      <Badge className="text-xs">
                        {comparison.percentile}th percentile
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>You: {comparison.userValue}{comparison.metric.includes("Rate") || comparison.metric.includes("Allocation") ? "%" : comparison.metric.includes("Fund") ? " months" : ""}</span>
                        <span className="text-muted-foreground">
                          Peer avg: {comparison.peerAverage}{comparison.metric.includes("Rate") || comparison.metric.includes("Allocation") ? "%" : comparison.metric.includes("Fund") ? " months" : ""}
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={comparison.percentile} className="h-3" />
                        <div 
                          className="absolute top-0 w-1 h-3 bg-primary rounded-full"
                          style={{ left: `${comparison.percentile}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time Value Tab */}
        <TabsContent value="timevalue" className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Hourly Wage:</label>
            <Select value={hourlyWage.toString()} onValueChange={(value) => setHourlyWage(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">$15/hour</SelectItem>
                <SelectItem value="20">$20/hour</SelectItem>
                <SelectItem value="25">$25/hour</SelectItem>
                <SelectItem value="35">$35/hour</SelectItem>
                <SelectItem value="50">$50/hour</SelectItem>
                <SelectItem value="75">$75/hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartColumnStacked className="w-5 h-5 text-primary" />
                Time Value Analysis
              </CardTitle>
              <CardDescription>
                How much work time your expenses represent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeValueData.map((item) => {
                  const workHours = item.amount / hourlyWage;
                  return (
                    <div key={item.expense} className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                      <div>
                        <div className="font-medium">{item.expense}</div>
                        <div className="text-sm text-muted-foreground">{item.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${item.amount}</div>
                        <div className="text-sm text-muted-foreground">
                          {workHours.toFixed(1)} work hours
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Predictions */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartLine className="w-5 h-5 text-primary" />
                  Spending Predictions
                </CardTitle>
                <CardDescription>
                  AI-powered forecasts for the next 3 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictiveData.map((prediction) => (
                    <div key={prediction.category} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{prediction.category}</span>
                        <Badge variant="secondary" className="text-xs">
                          {prediction.confidence}% confidence
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current: ${prediction.currentTrend}</span>
                        <span className="text-muted-foreground">
                          Predicted: ${prediction.predictedNext3Months[2]}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {prediction.predictedNext3Months.map((amount, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>Month {index + 1}</span>
                            <span>${amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Retirement Readiness */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileChartPie className="w-5 h-5 text-primary" />
                  Retirement Readiness
                </CardTitle>
                <CardDescription>
                  Projected retirement timeline and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">62</div>
                    <div className="text-sm text-muted-foreground">Projected retirement age</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Current savings</span>
                      <span className="font-medium">$68,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly contributions</span>
                      <span className="font-medium">$1,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Projected at 65</span>
                      <span className="font-medium">$1.2M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Target needed</span>
                      <span className="font-medium">$1.5M</span>
                    </div>
                  </div>

                  <Progress value={80} className="h-3" />
                  
                  <div className="text-sm text-muted-foreground">
                    <strong>Recommendation:</strong> Increase monthly contributions by $150 to reach target by age 60.
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