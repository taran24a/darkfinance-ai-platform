"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Milestone,
  ChartSpline,
  Target,
  PiggyBank,
  TrendingUp,
  CalendarFold,
  CalendarPlus2,
  ChartGantt,
  Turtle,
  ChartBarIncreasing
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LifeEvent {
  id: string;
  name: string;
  targetDate: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Home' | 'Education' | 'Travel' | 'Emergency' | 'Retirement' | 'Family';
  monthlyContribution: number;
  icon: React.ReactNode;
  color: string;
}

interface NetWorthProjection {
  year: number;
  netWorth: number;
  milestone: string | null;
}

interface RetirementScenario {
  name: string;
  monthlyContribution: number;
  retirementAge: number;
  projectedValue: number;
  monthlyIncome: number;
}

const mockLifeEvents: LifeEvent[] = [
  {
    id: '1',
    name: 'House Down Payment',
    targetDate: '2026-06-15',
    targetAmount: 80000,
    currentAmount: 32000,
    priority: 'High',
    category: 'Home',
    monthlyContribution: 2400,
    icon: <PiggyBank className="h-5 w-5" />,
    color: 'bg-emerald-500'
  },
  {
    id: '2',
    name: 'Emergency Fund',
    targetDate: '2025-12-31',
    targetAmount: 25000,
    currentAmount: 18500,
    priority: 'High',
    category: 'Emergency',
    monthlyContribution: 800,
    icon: <Target className="h-5 w-5" />,
    color: 'bg-orange-500'
  },
  {
    id: '3',
    name: 'Retirement Savings',
    targetDate: '2055-01-01',
    targetAmount: 1200000,
    currentAmount: 145000,
    priority: 'Medium',
    category: 'Retirement',
    monthlyContribution: 1500,
    icon: <Turtle className="h-5 w-5" />,
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'European Vacation',
    targetDate: '2025-07-01',
    targetAmount: 8000,
    currentAmount: 4200,
    priority: 'Low',
    category: 'Travel',
    monthlyContribution: 500,
    icon: <CalendarFold className="h-5 w-5" />,
    color: 'bg-blue-500'
  }
];

const mockNetWorthProjections: NetWorthProjection[] = [
  { year: 2024, netWorth: 185000, milestone: 'Current Position' },
  { year: 2025, netWorth: 225000, milestone: 'Emergency Fund Complete' },
  { year: 2026, netWorth: 285000, milestone: 'Home Purchase' },
  { year: 2030, netWorth: 485000, milestone: 'Half Million Net Worth' },
  { year: 2035, netWorth: 725000, milestone: null },
  { year: 2040, netWorth: 1050000, milestone: 'Millionaire Status' },
  { year: 2045, netWorth: 1485000, milestone: null },
  { year: 2050, netWorth: 2150000, milestone: null },
  { year: 2055, netWorth: 2850000, milestone: 'Retirement Ready' }
];

const retirementScenarios: RetirementScenario[] = [
  {
    name: 'Conservative',
    monthlyContribution: 1000,
    retirementAge: 67,
    projectedValue: 1850000,
    monthlyIncome: 6200
  },
  {
    name: 'Balanced',
    monthlyContribution: 1500,
    retirementAge: 65,
    projectedValue: 2250000,
    monthlyIncome: 7500
  },
  {
    name: 'Aggressive',
    monthlyContribution: 2200,
    retirementAge: 62,
    projectedValue: 2650000,
    monthlyIncome: 8800
  }
];

export default function LongTermPlanning() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [retirementAge, setRetirementAge] = useState([65]);
  const [monthlyContribution, setMonthlyContribution] = useState([1500]);
  const [inflationRate, setInflationRate] = useState([2.5]);
  const [selectedScenario, setSelectedScenario] = useState('Balanced');
  const [showWizard, setShowWizard] = useState(false);

  const calculateProgress = useCallback((event: LifeEvent) => {
    return Math.min((event.currentAmount / event.targetAmount) * 100, 100);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  }, []);

  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  }, []);

  const projectedRetirementValue = useMemo(() => {
    const currentAge = 32;
    const yearsToRetirement = retirementAge[0] - currentAge;
    const currentSavings = 145000;
    const monthlyAmount = monthlyContribution[0];
    const annualReturn = 0.07;
    
    // Future value calculation
    const futureValueCurrent = currentSavings * Math.pow(1 + annualReturn, yearsToRetirement);
    const futureValueContributions = monthlyAmount * 12 * (Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn;
    
    return futureValueCurrent + futureValueContributions;
  }, [retirementAge, monthlyContribution]);

  const monthlyRetirementIncome = useMemo(() => {
    return projectedRetirementValue * 0.04 / 12;
  }, [projectedRetirementValue]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-finance-flow">Long-Term Planning</h1>
          <p className="text-muted-foreground mt-2">
            Plan for your future with comprehensive financial projections and milestone tracking
          </p>
        </div>
        <Button 
          onClick={() => setShowWizard(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <CalendarPlus2 className="h-4 w-4 mr-2" />
          Add Life Event
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-card">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartSpline className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Life Events
          </TabsTrigger>
          <TabsTrigger value="retirement" className="flex items-center gap-2">
            <Turtle className="h-4 w-4" />
            Retirement
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Net Worth Journey */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIncreasing className="h-5 w-5 text-primary" />
                Net Worth Journey
              </CardTitle>
              <CardDescription>
                Your projected financial growth over the next 30 years
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline Visualization */}
                <div className="relative">
                  <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border"></div>
                  <div className="space-y-4">
                    {mockNetWorthProjections.slice(0, 6).map((projection, index) => (
                      <motion.div
                        key={projection.year}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-center gap-4"
                      >
                        <div className="relative z-10">
                          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                            projection.milestone 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'bg-card border-border'
                          }`}>
                            {projection.milestone ? (
                              <Milestone className="h-4 w-4" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{projection.year}</p>
                              {projection.milestone && (
                                <p className="text-sm text-muted-foreground">{projection.milestone}</p>
                              )}
                            </div>
                            <p className="text-lg font-semibold">{formatCurrency(projection.netWorth)}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-400">$2.85M</p>
                    <p className="text-sm text-muted-foreground">Projected at 65</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">32x</p>
                    <p className="text-sm text-muted-foreground">Growth Multiple</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">7.2%</p>
                    <p className="text-sm text-muted-foreground">Annual Return</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400">$9.5K</p>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Goals Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockLifeEvents.map((event) => (
              <Card key={event.id} className="bg-card border border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${event.color}`}>
                      {event.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(event.targetDate)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{formatCurrency(event.currentAmount)}</span>
                      <span>{formatCurrency(event.targetAmount)}</span>
                    </div>
                    <Progress value={calculateProgress(event)} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {calculateProgress(event).toFixed(1)}% complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Life Events Planning */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Events List */}
            <div className="lg:col-span-2 space-y-4">
              {mockLifeEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className={`bg-card border transition-all cursor-pointer ${
                    selectedEvent === event.id ? 'border-primary' : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${event.color}`}>
                          {event.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.name}</h3>
                          <p className="text-sm text-muted-foreground">{event.category}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getPriorityColor(event.priority)}>
                        {event.priority}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Target Amount</p>
                        <p className="font-semibold">{formatCurrency(event.targetAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Target Date</p>
                        <p className="font-semibold">{formatDate(event.targetDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Progress</p>
                        <p className="font-semibold">{formatCurrency(event.currentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Contribution</p>
                        <p className="font-semibold">{formatCurrency(event.monthlyContribution)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{calculateProgress(event).toFixed(1)}% Complete</span>
                        <span>{formatCurrency(event.targetAmount - event.currentAmount)} remaining</span>
                      </div>
                      <Progress value={calculateProgress(event)} className="h-3" />
                    </div>

                    <AnimatePresence>
                      {selectedEvent === event.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-border space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="adjust-amount">Adjust Monthly Contribution</Label>
                              <Input
                                id="adjust-amount"
                                type="number"
                                defaultValue={event.monthlyContribution}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="adjust-date">Adjust Target Date</Label>
                              <Input
                                id="adjust-date"
                                type="date"
                                defaultValue={event.targetDate}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Update Goal</Button>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Goal Statistics */}
            <div className="space-y-4">
              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Goal Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Total Target</span>
                      <span className="font-semibold">{formatCurrency(1313000)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Current Savings</span>
                      <span className="font-semibold">{formatCurrency(199700)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Contributions</span>
                      <span className="font-semibold">{formatCurrency(5200)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">Priority Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-red-400">High Priority</span>
                        <span className="text-sm">2 goals</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-yellow-400">Medium Priority</span>
                        <span className="text-sm">1 goal</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-green-400">Low Priority</span>
                        <span className="text-sm">1 goal</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Timeline View</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLifeEvents
                      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())
                      .map((event) => (
                        <div key={event.id} className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{event.name}</p>
                            <p className="text-xs text-muted-foreground">{formatDate(event.targetDate)}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Retirement Calculator */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Turtle className="h-5 w-5 text-primary" />
                  Retirement Calculator
                </CardTitle>
                <CardDescription>
                  Adjust your retirement plan and see projected outcomes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Retirement Age: {retirementAge[0]}</Label>
                    <Slider
                      value={retirementAge}
                      onValueChange={setRetirementAge}
                      min={55}
                      max={75}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Monthly Contribution: {formatCurrency(monthlyContribution[0])}</Label>
                    <Slider
                      value={monthlyContribution}
                      onValueChange={setMonthlyContribution}
                      min={500}
                      max={5000}
                      step={100}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Expected Inflation Rate: {inflationRate[0]}%</Label>
                    <Slider
                      value={inflationRate}
                      onValueChange={setInflationRate}
                      min={1}
                      max={5}
                      step={0.1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Projected Retirement Value</span>
                    <span className="font-semibold">{formatCurrency(projectedRetirementValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Retirement Income</span>
                    <span className="font-semibold">{formatCurrency(monthlyRetirementIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Years to Retirement</span>
                    <span className="font-semibold">{retirementAge[0] - 32} years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Comparison */}
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle>Retirement Scenarios</CardTitle>
                <CardDescription>
                  Compare different retirement strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {retirementScenarios.map((scenario) => (
                        <SelectItem key={scenario.name} value={scenario.name}>
                          {scenario.name} Strategy
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {retirementScenarios.map((scenario) => (
                    <motion.div
                      key={scenario.name}
                      initial={{ opacity: 0.6 }}
                      animate={{ 
                        opacity: selectedScenario === scenario.name ? 1 : 0.6,
                        scale: selectedScenario === scenario.name ? 1 : 0.98
                      }}
                      className={`p-4 rounded-lg border transition-all ${
                        selectedScenario === scenario.name 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{scenario.name}</h4>
                        <Badge variant={selectedScenario === scenario.name ? 'default' : 'secondary'}>
                          Retire at {scenario.retirementAge}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Monthly Contribution</p>
                          <p className="font-semibold">{formatCurrency(scenario.monthlyContribution)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Projected Value</p>
                          <p className="font-semibold">{formatCurrency(scenario.projectedValue)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Monthly Retirement Income</p>
                          <p className="font-semibold text-emerald-400">{formatCurrency(scenario.monthlyIncome)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Security & Benefits */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartGantt className="h-5 w-5 text-primary" />
                Social Security & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="p-4 bg-blue-500/10 rounded-lg mb-2">
                    <p className="text-2xl font-bold text-blue-400">$2,800</p>
                  </div>
                  <p className="font-medium">Estimated Social Security</p>
                  <p className="text-sm text-muted-foreground">Monthly at full retirement</p>
                </div>
                
                <div className="text-center">
                  <div className="p-4 bg-green-500/10 rounded-lg mb-2">
                    <p className="text-2xl font-bold text-green-400">$1,200</p>
                  </div>
                  <p className="font-medium">401(k) Match</p>
                  <p className="text-sm text-muted-foreground">Current annual employer match</p>
                </div>
                
                <div className="text-center">
                  <div className="p-4 bg-purple-500/10 rounded-lg mb-2">
                    <p className="text-2xl font-bold text-purple-400">$850</p>
                  </div>
                  <p className="font-medium">Health Savings</p>
                  <p className="text-sm text-muted-foreground">HSA monthly contribution limit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projections" className="space-y-6">
          {/* Comprehensive Projections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Net Worth Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNetWorthProjections.map((projection, index) => (
                    <motion.div
                      key={projection.year}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex justify-between items-center p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{projection.year}</p>
                        {projection.milestone && (
                          <p className="text-xs text-primary">{projection.milestone}</p>
                        )}
                      </div>
                      <p className="font-semibold">{formatCurrency(projection.netWorth)}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border">
              <CardHeader>
                <CardTitle>Inflation Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg">
                    <div>
                      <p className="font-medium">Today's $100K</p>
                      <p className="text-xs text-muted-foreground">Purchasing power in 2054</p>
                    </div>
                    <p className="font-semibold text-orange-400">$40K</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                    <div>
                      <p className="font-medium">Required Income</p>
                      <p className="text-xs text-muted-foreground">To maintain lifestyle</p>
                    </div>
                    <p className="font-semibold text-blue-400">$15K/mo</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                    <div>
                      <p className="font-medium">Real Returns</p>
                      <p className="text-xs text-muted-foreground">After inflation</p>
                    </div>
                    <p className="font-semibold text-green-400">4.7%</p>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">
                      Inflation assumptions: {inflationRate[0]}% annually
                    </p>
                    <Button variant="outline" size="sm">
                      Adjust Assumptions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estate Planning */}
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle>Estate & Legacy Planning</CardTitle>
              <CardDescription>
                Plan for wealth transfer and legacy considerations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-purple-400">$12.9M</p>
                  <p className="font-medium">Estate Tax Exemption</p>
                  <p className="text-xs text-muted-foreground">2024 Federal limit</p>
                </div>
                
                <div className="text-center p-4 bg-green-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">$18K</p>
                  <p className="font-medium">Annual Gift Limit</p>
                  <p className="text-xs text-muted-foreground">Per recipient, tax-free</p>
                </div>
                
                <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-blue-400">85%</p>
                  <p className="font-medium">Wealth Transfer</p>
                  <p className="text-xs text-muted-foreground">With proper planning</p>
                </div>
                
                <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                  <p className="text-2xl font-bold text-orange-400">$2.5K</p>
                  <p className="font-medium">Life Insurance</p>
                  <p className="text-xs text-muted-foreground">Recommended coverage</p>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <Button variant="outline" size="sm">
                  Estate Planning Checklist
                </Button>
                <Button variant="outline" size="sm">
                  Insurance Review
                </Button>
                <Button variant="outline" size="sm">
                  Tax Optimization
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Life Event Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowWizard(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card border border-border rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Life Event</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowWizard(false)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input id="event-name" placeholder="e.g., Wedding, Home Purchase" />
                </div>
                
                <div>
                  <Label htmlFor="target-amount">Target Amount</Label>
                  <Input id="target-amount" type="number" placeholder="50000" />
                </div>
                
                <div>
                  <Label htmlFor="target-date">Target Date</Label>
                  <Input id="target-date" type="date" />
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="low">Low Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={() => setShowWizard(false)}>
                    Create Event
                  </Button>
                  <Button variant="outline" onClick={() => setShowWizard(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}