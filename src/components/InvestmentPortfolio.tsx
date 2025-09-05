"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  ChartSpline, 
  ChartPie, 
  ChartBar, 
  ChartLine, 
  SquareActivity,
  BanknoteArrowUp,
  InspectionPanel
} from 'lucide-react';

// Types
interface Investment {
  id: string;
  name: string;
  type: 'equity' | 'mutual_fund' | 'sip' | 'gold' | 'crypto' | 'reit' | 'nft';
  currentValue: number;
  investedAmount: number;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  returns: number;
  returnsPercent: number;
  cagr: number;
  lastUpdated: Date;
}

interface PortfolioMetrics {
  totalValue: number;
  totalInvested: number;
  totalReturns: number;
  totalReturnsPercent: number;
  portfolioCagr: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface WhatIfScenario {
  sipAmount: number;
  prepaymentAmount: number;
  sellPercent: number;
  buyAmount: number;
  timeHorizon: number;
  riskLevel: string;
}

// Sample data
const sampleInvestments: Investment[] = [
  {
    id: '1',
    name: 'Nifty 50 Index Fund',
    type: 'mutual_fund',
    currentValue: 250000,
    investedAmount: 200000,
    quantity: 2500,
    avgPrice: 80,
    currentPrice: 100,
    returns: 50000,
    returnsPercent: 25,
    cagr: 12.5,
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Reliance Industries',
    type: 'equity',
    currentValue: 180000,
    investedAmount: 150000,
    quantity: 100,
    avgPrice: 1500,
    currentPrice: 1800,
    returns: 30000,
    returnsPercent: 20,
    cagr: 10.2,
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Gold ETF',
    type: 'gold',
    currentValue: 120000,
    investedAmount: 100000,
    quantity: 200,
    avgPrice: 500,
    currentPrice: 600,
    returns: 20000,
    returnsPercent: 20,
    cagr: 8.5,
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Bitcoin',
    type: 'crypto',
    currentValue: 80000,
    investedAmount: 50000,
    quantity: 2,
    avgPrice: 25000,
    currentPrice: 40000,
    returns: 30000,
    returnsPercent: 60,
    cagr: 25.8,
    lastUpdated: new Date()
  }
];

const typeColors = {
  equity: '#e67e22',
  mutual_fund: '#2d8659',
  sip: '#1e3a5f',
  gold: '#f1c40f',
  crypto: '#e74c3c',
  reit: '#9b59b6',
  nft: '#34495e'
};

const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];

export default function InvestmentPortfolio() {
  const [investments] = useState<Investment[]>(sampleInvestments);
  const [selectedView, setSelectedView] = useState<'allocation' | 'performance' | 'simulator'>('allocation');
  const [whatIfScenario, setWhatIfScenario] = useState<WhatIfScenario>({
    sipAmount: 10000,
    prepaymentAmount: 50000,
    sellPercent: 10,
    buyAmount: 100000,
    timeHorizon: 5,
    riskLevel: 'Moderate'
  });

  // Calculate portfolio metrics
  const portfolioMetrics = useMemo((): PortfolioMetrics => {
    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalReturns = totalValue - totalInvested;
    const totalReturnsPercent = (totalReturns / totalInvested) * 100;
    
    // Weighted CAGR calculation
    const weightedCagr = investments.reduce((sum, inv) => {
      const weight = inv.investedAmount / totalInvested;
      return sum + (inv.cagr * weight);
    }, 0);

    return {
      totalValue,
      totalInvested,
      totalReturns,
      totalReturnsPercent,
      portfolioCagr: weightedCagr,
      volatility: 15.2, // Sample value
      sharpeRatio: 1.25, // Sample value
      maxDrawdown: -8.5 // Sample value
    };
  }, [investments]);

  // Calculate allocation data for pie chart
  const allocationData = useMemo(() => {
    return investments.map(inv => ({
      name: inv.name,
      value: inv.currentValue,
      percentage: (inv.currentValue / portfolioMetrics.totalValue) * 100,
      color: typeColors[inv.type]
    }));
  }, [investments, portfolioMetrics.totalValue]);

  // Generate Monte Carlo projections
  const generateMonteCarloProjection = useCallback((scenario: WhatIfScenario) => {
    const scenarios = [];
    const baseReturn = portfolioMetrics.portfolioCagr / 100;
    const volatility = portfolioMetrics.volatility / 100;
    
    for (let i = 0; i < 1000; i++) {
      let projectedValue = portfolioMetrics.totalValue;
      const monthlyReturn = baseReturn / 12;
      const monthlyVolatility = volatility / Math.sqrt(12);
      
      for (let month = 1; month <= scenario.timeHorizon * 12; month++) {
        const randomReturn = monthlyReturn + (Math.random() - 0.5) * monthlyVolatility * 2;
        projectedValue *= (1 + randomReturn);
        projectedValue += scenario.sipAmount; // Add SIP
      }
      scenarios.push(projectedValue);
    }
    
    scenarios.sort((a, b) => a - b);
    return {
      pessimistic: scenarios[Math.floor(scenarios.length * 0.1)],
      expected: scenarios[Math.floor(scenarios.length * 0.5)],
      optimistic: scenarios[Math.floor(scenarios.length * 0.9)]
    };
  }, [portfolioMetrics]);

  const projections = useMemo(() => generateMonteCarloProjection(whatIfScenario), [whatIfScenario, generateMonteCarloProjection]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investment Portfolio</h1>
          <p className="text-muted-foreground mt-1">
            Track, analyze, and optimize your investment performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BanknoteArrowUp className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
          <Button variant="outline" size="sm">
            <InspectionPanel className="w-4 h-4 mr-2" />
            Rebalance
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(portfolioMetrics.totalValue)}
                </p>
              </div>
              <ChartLine className="w-8 h-8 text-primary" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-green-400">
                {formatPercentage(portfolioMetrics.totalReturnsPercent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Returns</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatCurrency(portfolioMetrics.totalReturns)}
                </p>
              </div>
              <SquareActivity className="w-8 h-8 text-green-400" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                CAGR: {portfolioMetrics.portfolioCagr.toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Volatility</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {portfolioMetrics.volatility.toFixed(1)}%
                </p>
              </div>
              <ChartSpline className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Sharpe: {portfolioMetrics.sharpeRatio.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Max Drawdown</p>
                <p className="text-2xl font-bold text-red-400">
                  {portfolioMetrics.maxDrawdown.toFixed(1)}%
                </p>
              </div>
              <ChartBar className="w-8 h-8 text-red-400" />
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Risk-adjusted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="allocation">Portfolio Allocation</TabsTrigger>
          <TabsTrigger value="performance">Performance Analysis</TabsTrigger>
          <TabsTrigger value="simulator">What-If Simulator</TabsTrigger>
        </TabsList>

        {/* Portfolio Allocation Tab */}
        <TabsContent value="allocation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocation Chart */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChartPie className="w-5 h-5" />
                  Asset Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocationData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(item.value)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.percentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Holdings Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Holdings Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investments.map((investment) => (
                    <div key={investment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <h4 className="font-medium text-sm">{investment.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {investment.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Qty: {investment.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(investment.currentValue)}
                        </p>
                        <p className={`text-xs ${investment.returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(investment.returnsPercent)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Analysis Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Absolute Returns</Label>
                    <div className="text-2xl font-bold text-green-400">
                      {formatCurrency(portfolioMetrics.totalReturns)}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>CAGR</Label>
                    <div className="text-2xl font-bold text-primary">
                      {portfolioMetrics.portfolioCagr.toFixed(2)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Volatility</Label>
                    <div className="text-lg font-medium text-yellow-400">
                      {portfolioMetrics.volatility.toFixed(2)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sharpe Ratio</Label>
                    <div className="text-lg font-medium text-blue-400">
                      {portfolioMetrics.sharpeRatio.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Risk Assessment</Label>
                  <div className="flex items-center gap-2">
                    <Progress value={65} className="flex-1" />
                    <span className="text-sm text-muted-foreground">Moderate Risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Performance */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Asset Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.map((investment) => (
                    <div key={investment.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{investment.name}</span>
                        <span className={`text-sm font-medium ${investment.returnsPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatPercentage(investment.returnsPercent)}
                        </span>
                      </div>
                      <Progress 
                        value={Math.max(0, Math.min(100, investment.returnsPercent + 50))} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>CAGR: {investment.cagr.toFixed(1)}%</span>
                        <span>{formatCurrency(investment.returns)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* What-If Simulator Tab */}
        <TabsContent value="simulator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Scenario Inputs */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Scenario Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Monthly SIP Amount</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[whatIfScenario.sipAmount]}
                      onValueChange={([value]) => 
                        setWhatIfScenario(prev => ({ ...prev, sipAmount: value }))
                      }
                      max={50000}
                      min={1000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹1,000</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(whatIfScenario.sipAmount)}
                      </span>
                      <span>₹50,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Loan Prepayment</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[whatIfScenario.prepaymentAmount]}
                      onValueChange={([value]) => 
                        setWhatIfScenario(prev => ({ ...prev, prepaymentAmount: value }))
                      }
                      max={500000}
                      min={0}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹0</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(whatIfScenario.prepaymentAmount)}
                      </span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Portfolio Rebalancing (%)</Label>
                  <div className="space-y-2">
                    <Slider
                      value={[whatIfScenario.sellPercent]}
                      onValueChange={([value]) => 
                        setWhatIfScenario(prev => ({ ...prev, sellPercent: value }))
                      }
                      max={50}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>0%</span>
                      <span className="font-medium text-primary">
                        {whatIfScenario.sellPercent}%
                      </span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Time Horizon (Years)</Label>
                  <Select 
                    value={whatIfScenario.timeHorizon.toString()} 
                    onValueChange={(value) => 
                      setWhatIfScenario(prev => ({ ...prev, timeHorizon: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Year</SelectItem>
                      <SelectItem value="3">3 Years</SelectItem>
                      <SelectItem value="5">5 Years</SelectItem>
                      <SelectItem value="10">10 Years</SelectItem>
                      <SelectItem value="15">15 Years</SelectItem>
                      <SelectItem value="20">20 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Risk Profile</Label>
                  <Select 
                    value={whatIfScenario.riskLevel} 
                    onValueChange={(value) => 
                      setWhatIfScenario(prev => ({ ...prev, riskLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {riskLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Monte Carlo Projections */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Monte Carlo Projections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div>
                      <p className="text-sm font-medium text-red-400">Pessimistic (10%)</p>
                      <p className="text-xs text-muted-foreground">Conservative estimate</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-400">
                        {formatCurrency(projections.pessimistic)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div>
                      <p className="text-sm font-medium text-blue-400">Expected (50%)</p>
                      <p className="text-xs text-muted-foreground">Most likely outcome</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-400">
                        {formatCurrency(projections.expected)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div>
                      <p className="text-sm font-medium text-green-400">Optimistic (90%)</p>
                      <p className="text-xs text-muted-foreground">Best case scenario</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">
                        {formatCurrency(projections.optimistic)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-medium mb-3">Scenario Impact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional SIP Value</span>
                      <span className="font-medium">
                        {formatCurrency(whatIfScenario.sipAmount * 12 * whatIfScenario.timeHorizon)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Portfolio Growth Range</span>
                      <span className="font-medium text-green-400">
                        {((projections.expected - portfolioMetrics.totalValue) / portfolioMetrics.totalValue * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Risk Adjusted Return</span>
                      <span className="font-medium text-primary">
                        {((projections.expected / portfolioMetrics.totalValue) ** (1/whatIfScenario.timeHorizon) - 1 * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recommendations Section */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Portfolio Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-medium text-blue-400 mb-2">Rebalancing</h4>
              <p className="text-sm text-muted-foreground">
                Consider reducing crypto allocation by 5% and increasing debt exposure for better risk-adjusted returns.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <h4 className="font-medium text-green-400 mb-2">Tax Optimization</h4>
              <p className="text-sm text-muted-foreground">
                Book profits in equity investments before March 31st to optimize long-term capital gains tax.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="font-medium text-yellow-400 mb-2">Goal Planning</h4>
              <p className="text-sm text-muted-foreground">
                Increase SIP by ₹5,000 monthly to achieve your retirement goal of ₹2 crores by age 60.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}