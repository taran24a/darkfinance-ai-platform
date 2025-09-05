"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ChartNoAxesCombined,
  ChartSpline,
  LayoutDashboard,
  DollarSign,
  PiggyBank,
  Wallet,
  CreditCard,
  ChartPie,
  Coins
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";
import { toast } from "sonner";

interface DashboardProps {
  className?: string;
}

interface KPIData {
  netWorth: number;
  income: number;
  expenses: number;
  savingsRate: number;
  runway: number;
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  status: "pending" | "paid" | "overdue";
}

interface ChartData {
  month: string;
  savings: number;
  target: number;
  income: number;
  expenses: number;
}

const mockKPIData: KPIData = {
  netWorth: 127500,
  income: 8500,
  expenses: 5200,
  savingsRate: 38.8,
  runway: 24.5
};

const mockTransactions: Transaction[] = [
  { id: "1", amount: -89.99, description: "Grocery Shopping", category: "Food", date: "2024-01-15", type: "expense" },
  { id: "2", amount: 3200.00, description: "Salary", category: "Income", date: "2024-01-15", type: "income" },
  { id: "3", amount: -45.20, description: "Gas Station", category: "Transportation", date: "2024-01-14", type: "expense" },
  { id: "4", amount: -12.99, description: "Netflix", category: "Entertainment", date: "2024-01-14", type: "expense" }
];

const mockUpcomingBills: Bill[] = [
  { id: "1", name: "Rent", amount: 1800, dueDate: "2024-01-28", category: "Housing", status: "pending" },
  { id: "2", name: "Electric Bill", amount: 120, dueDate: "2024-01-30", category: "Utilities", status: "pending" },
  { id: "3", name: "Phone Bill", amount: 85, dueDate: "2024-02-01", category: "Utilities", status: "pending" }
];

const mockChartData: ChartData[] = [
  { month: "Jul", savings: 2800, target: 3000, income: 8500, expenses: 5700 },
  { month: "Aug", savings: 3200, target: 3000, income: 8500, expenses: 5300 },
  { month: "Sep", savings: 2900, target: 3000, income: 8500, expenses: 5600 },
  { month: "Oct", savings: 3400, target: 3000, income: 8500, expenses: 5100 },
  { month: "Nov", savings: 3100, target: 3000, income: 8500, expenses: 5400 },
  { month: "Dec", savings: 3300, target: 3000, income: 8500, expenses: 5200 }
];

const expenseCategories = [
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Shopping",
  "Travel",
  "Other"
];

export default function DashboardOverview({ className }: DashboardProps) {
  const [kpiData, setKpiData] = useState<KPIData>(mockKPIData);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [upcomingBills] = useState<Bill[]>(mockUpcomingBills);
  const [chartData] = useState<ChartData[]>(mockChartData);
  const [isLoading, setIsLoading] = useState(false);
  const [maskedMode, setMaskedMode] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddForm, setQuickAddForm] = useState({
    amount: "",
    description: "",
    category: ""
  });

  // Command palette toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toast.info("Command palette would open here");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    if (maskedMode) return "****";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }, [maskedMode]);

  const formatPercentage = useCallback((value: number) => {
    if (maskedMode) return "**%";
    return `${value.toFixed(1)}%`;
  }, [maskedMode]);

  const handleQuickAddSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddForm.amount || !quickAddForm.description || !quickAddForm.category) {
      toast.error("Please fill in all fields");
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: -Math.abs(parseFloat(quickAddForm.amount)),
      description: quickAddForm.description,
      category: quickAddForm.category,
      date: new Date().toISOString().split('T')[0],
      type: "expense"
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setKpiData(prev => ({
      ...prev,
      expenses: prev.expenses + Math.abs(parseFloat(quickAddForm.amount))
    }));

    setQuickAddForm({ amount: "", description: "", category: "" });
    setIsQuickAddOpen(false);
    toast.success("Expense added successfully!");
  }, [quickAddForm]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face" alt="Profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good morning, John! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's your financial overview for today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="masked-mode" className="text-sm text-muted-foreground">
              Privacy Mode
            </Label>
            <Switch
              id="masked-mode"
              checked={maskedMode}
              onCheckedChange={setMaskedMode}
            />
          </div>
          <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <DollarSign className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Quick Expense</DialogTitle>
                <DialogDescription>
                  Quickly log a new expense with smart category suggestions
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={quickAddForm.amount}
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="What did you spend on?"
                    value={quickAddForm.description}
                    onChange={(e) => setQuickAddForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={quickAddForm.category} onValueChange={(value) => setQuickAddForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    Add Expense
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsQuickAddOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Worth
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(kpiData.netWorth)}
            </div>
            <p className="text-xs text-green-400">
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Income vs Expenses
            </CardTitle>
            <ChartSpline className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(kpiData.income - kpiData.expenses)}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-400">{formatCurrency(kpiData.income)} in</span>
              <span className="text-red-400">{formatCurrency(kpiData.expenses)} out</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Savings Rate
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(kpiData.savingsRate)}
            </div>
            <Progress 
              value={maskedMode ? 0 : kpiData.savingsRate} 
              className="mt-2" 
            />
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Runway
            </CardTitle>
            <ChartNoAxesCombined className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {maskedMode ? "** months" : `${kpiData.runway} months`}
            </div>
            <p className="text-xs text-muted-foreground">
              Emergency fund duration
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Monthly Savings Progress</CardTitle>
            <CardDescription>
              Tracking your savings vs target over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={maskedMode ? [] : chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="target" 
                    stackId="1" 
                    stroke="hsl(var(--muted-foreground))" 
                    fill="hsl(var(--muted))" 
                    fillOpacity={0.3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="savings" 
                    stackId="2" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Cashflow Overview</CardTitle>
            <CardDescription>
              Monthly income vs expenses breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={maskedMode ? [] : chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" fill="hsl(var(--chart-2))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-400/20' : 'bg-red-400/20'}`}>
                      {transaction.type === 'income' ? (
                        <DollarSign className="h-4 w-4 text-green-400" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {maskedMode ? "****" : formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Upcoming Bills</CardTitle>
              <CardDescription>
                Bills due in the next 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{bill.name}</p>
                      <p className="text-xs text-muted-foreground">Due {bill.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bill.status === 'overdue' ? 'destructive' : 'secondary'}>
                        {bill.status}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(bill.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardHeader>
              <CardTitle className="text-foreground">Financial Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <p className="text-sm font-medium text-foreground">Budget Alert</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're 85% through your dining budget
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-green-400/10 border border-green-400/20">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="text-sm font-medium text-foreground">Goal Achievement</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Emergency fund goal reached!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}