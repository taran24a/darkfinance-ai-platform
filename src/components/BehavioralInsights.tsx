"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  SmilePlus, 
  Meh, 
  ChartBarIncreasing, 
  ChartLine, 
  CreditCard, 
  PiggyBank, 
  BanknoteX,
  HandCoins,
  Percent,
  CircleDollarSign
} from 'lucide-react';

interface EmotionTag {
  id: string;
  emotion: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

interface SpendingPattern {
  id: string;
  pattern: string;
  frequency: number;
  amount: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface BehavioralGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
}

interface Nudge {
  id: string;
  type: 'warning' | 'suggestion' | 'celebration';
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

const BehavioralInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('emotions');
  const [meditationTimer, setMeditationTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [notificationPreferences, setNotificationPreferences] = useState({
    impulseAlerts: true,
    spendingNudges: true,
    goalReminders: true,
    mindfulnessPrompts: false
  });

  const emotionTags: EmotionTag[] = [
    { id: '1', emotion: 'Happy', icon: <SmilePlus className="w-4 h-4" />, color: 'bg-green-500/20 text-green-400', count: 12 },
    { id: '2', emotion: 'Stressed', icon: <Meh className="w-4 h-4" />, color: 'bg-red-500/20 text-red-400', count: 8 },
    { id: '3', emotion: 'Confident', icon: <SmilePlus className="w-4 h-4" />, color: 'bg-blue-500/20 text-blue-400', count: 6 },
    { id: '4', emotion: 'Anxious', icon: <Meh className="w-4 h-4" />, color: 'bg-yellow-500/20 text-yellow-400', count: 4 }
  ];

  const spendingPatterns: SpendingPattern[] = [
    { id: '1', pattern: 'Weekend Splurging', frequency: 85, amount: 245, trend: 'increasing' },
    { id: '2', pattern: 'Stress Shopping', frequency: 72, amount: 180, trend: 'stable' },
    { id: '3', pattern: 'Impulse Food Orders', frequency: 68, amount: 95, trend: 'decreasing' },
    { id: '4', pattern: 'Late Night Purchases', frequency: 45, amount: 120, trend: 'increasing' }
  ];

  const behavioralGoals: BehavioralGoal[] = [
    { id: '1', title: 'Reduce Impulse Purchases', description: 'Wait 24h before non-essential buys', progress: 65, target: 100, category: 'impulse' },
    { id: '2', title: 'Mindful Spending', description: 'Tag emotions before purchases', progress: 82, target: 100, category: 'mindfulness' },
    { id: '3', title: 'Savings Habit', description: 'Save before spending daily', progress: 34, target: 100, category: 'savings' },
    { id: '4', title: 'Budget Awareness', description: 'Check budget before purchases', progress: 91, target: 100, category: 'awareness' }
  ];

  const nudges: Nudge[] = [
    { id: '1', type: 'warning', message: 'You\'ve made 3 impulse purchases this week. Consider taking a pause.', timestamp: new Date(), dismissed: false },
    { id: '2', type: 'celebration', message: 'Great job! You\'ve stayed within budget for 5 days straight.', timestamp: new Date(), dismissed: false },
    { id: '3', type: 'suggestion', message: 'Your spending increases when stressed. Try our 5-minute meditation.', timestamp: new Date(), dismissed: false }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && meditationTimer > 0) {
      interval = setInterval(() => {
        setMeditationTimer(timer => timer - 1);
      }, 1000);
    } else if (meditationTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, meditationTimer]);

  const startMeditation = useCallback((minutes: number) => {
    setMeditationTimer(minutes * 60);
    setIsTimerActive(true);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <ChartBarIncreasing className="w-4 h-4 text-red-400" />;
      case 'decreasing':
        return <ChartLine className="w-4 h-4 text-green-400" />;
      default:
        return <ChartLine className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getNudgeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-red-500/50 bg-red-500/5';
      case 'celebration':
        return 'border-green-500/50 bg-green-500/5';
      case 'suggestion':
        return 'border-blue-500/50 bg-blue-500/5';
      default:
        return 'border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Behavioral Insights</h2>
        <p className="text-muted-foreground">
          Understand your spending patterns and build healthier financial habits
        </p>
      </div>

      {/* Active Nudges */}
      <div className="grid gap-4">
        {nudges.filter(n => !n.dismissed).map((nudge) => (
          <Card key={nudge.id} className={`${getNudgeColor(nudge.type)} border`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    {nudge.type === 'warning' && <BanknoteX className="w-5 h-5 text-red-400" />}
                    {nudge.type === 'celebration' && <SmilePlus className="w-5 h-5 text-green-400" />}
                    {nudge.type === 'suggestion' && <HandCoins className="w-5 h-5 text-blue-400" />}
                  </div>
                  <div>
                    <p className="font-medium">{nudge.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {nudge.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Emotion Tagging */}
        <TabsContent value="emotions" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SmilePlus className="w-5 h-5" />
                  Emotion Tags
                </CardTitle>
                <CardDescription>
                  How you felt during recent transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emotionTags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Badge className={tag.color}>
                        {tag.icon}
                        {tag.emotion}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tag.count}</p>
                      <p className="text-xs text-muted-foreground">transactions</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mood-Spending Correlation</CardTitle>
                <CardDescription>
                  Your spending patterns by emotional state
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Happy spending</span>
                    <span className="text-green-400">-12% vs average</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Stress spending</span>
                    <span className="text-red-400">+28% vs average</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Confident spending</span>
                    <span className="text-blue-400">+5% vs average</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Spending Patterns */}
        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIncreasing className="w-5 h-5" />
                Spending Pattern Recognition
              </CardTitle>
              <CardDescription>
                AI-detected behavioral patterns in your spending
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spendingPatterns.map((pattern) => (
                  <div key={pattern.id} className="p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{pattern.pattern}</h4>
                        {getTrendIcon(pattern.trend)}
                      </div>
                      <Badge variant="outline">{pattern.frequency}% frequency</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Average Amount</p>
                        <p className="font-medium">${pattern.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Trend</p>
                        <p className={`font-medium ${
                          pattern.trend === 'increasing' ? 'text-red-400' :
                          pattern.trend === 'decreasing' ? 'text-green-400' :
                          'text-muted-foreground'
                        }`}>
                          {pattern.trend}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Goals */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  Behavioral Goals
                </CardTitle>
                <CardDescription>
                  Track your progress towards healthier financial habits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {behavioralGoals.map((goal) => (
                  <div key={goal.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">{goal.description}</p>
                      </div>
                      <Badge variant={goal.progress >= 80 ? 'default' : 'secondary'}>
                        {goal.progress}%
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Personality Assessment</CardTitle>
                <CardDescription>
                  Customize your investment approach based on your risk tolerance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Risk Tolerance</label>
                    <Slider
                      value={riskTolerance}
                      onValueChange={setRiskTolerance}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Conservative</span>
                      <span>Moderate</span>
                      <span>Aggressive</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="font-medium mb-2">Recommended Portfolio:</p>
                    <p className="text-sm text-muted-foreground">
                      Based on your {riskTolerance[0] < 35 ? 'conservative' : riskTolerance[0] > 65 ? 'aggressive' : 'moderate'} risk profile,
                      we suggest a balanced approach with {100 - riskTolerance[0]}% bonds and {riskTolerance[0]}% stocks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mindfulness Tools */}
        <TabsContent value="mindfulness" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spending Meditation Timer</CardTitle>
                <CardDescription>
                  Take a mindful pause before making purchases
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold mb-4">
                    {formatTime(meditationTimer)}
                  </div>
                  <div className="flex gap-2 justify-center mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startMeditation(1)}
                      disabled={isTimerActive}
                    >
                      1 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startMeditation(3)}
                      disabled={isTimerActive}
                    >
                      3 min
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startMeditation(5)}
                      disabled={isTimerActive}
                    >
                      5 min
                    </Button>
                  </div>
                  <Button
                    variant={isTimerActive ? "destructive" : "default"}
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    disabled={meditationTimer === 0 && !isTimerActive}
                  >
                    {isTimerActive ? 'Stop' : 'Start'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emotional Awareness Prompts</CardTitle>
                <CardDescription>
                  Reflect on your financial emotions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <p className="font-medium mb-2">Today's Reflection:</p>
                  <p className="text-sm text-muted-foreground">
                    "How are you feeling right now? What emotions might be influencing your spending decisions today?"
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <SmilePlus className="w-4 h-4 mr-2" />
                    Happy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Meh className="w-4 h-4 mr-2" />
                    Neutral
                  </Button>
                  <Button variant="outline" size="sm">
                    <Meh className="w-4 h-4 mr-2" />
                    Stressed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impulse Control Tools</CardTitle>
              <CardDescription>
                Tools to help you pause and reflect before spending
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium mb-1">24-Hour Rule</h4>
                  <p className="text-xs text-muted-foreground">Wait before non-essential purchases</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <CircleDollarSign className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium mb-1">Budget Check</h4>
                  <p className="text-xs text-muted-foreground">Review remaining budget first</p>
                </div>
                <div className="p-4 rounded-lg border text-center">
                  <Percent className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <h4 className="font-medium mb-1">Cost Per Use</h4>
                  <p className="text-xs text-muted-foreground">Calculate true value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Customize how and when you receive behavioral insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Impulse Purchase Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of potential impulse buys</p>
                  </div>
                  <Switch
                    checked={notificationPreferences.impulseAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationPreferences(prev => ({ ...prev, impulseAlerts: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Spending Nudges</p>
                    <p className="text-sm text-muted-foreground">Gentle reminders about spending patterns</p>
                  </div>
                  <Switch
                    checked={notificationPreferences.spendingNudges}
                    onCheckedChange={(checked) => 
                      setNotificationPreferences(prev => ({ ...prev, spendingNudges: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Goal Reminders</p>
                    <p className="text-sm text-muted-foreground">Progress updates on behavioral goals</p>
                  </div>
                  <Switch
                    checked={notificationPreferences.goalReminders}
                    onCheckedChange={(checked) => 
                      setNotificationPreferences(prev => ({ ...prev, goalReminders: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mindfulness Prompts</p>
                    <p className="text-sm text-muted-foreground">Daily emotional awareness reminders</p>
                  </div>
                  <Switch
                    checked={notificationPreferences.mindfulnessPrompts}
                    onCheckedChange={(checked) => 
                      setNotificationPreferences(prev => ({ ...prev, mindfulnessPrompts: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cooldown Settings</CardTitle>
              <CardDescription>
                Configure spending pause mechanisms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Cooldown Period</label>
                  <Select defaultValue="24hours">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hour">1 Hour</SelectItem>
                      <SelectItem value="6hours">6 Hours</SelectItem>
                      <SelectItem value="24hours">24 Hours</SelectItem>
                      <SelectItem value="3days">3 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">High-Value Purchase Threshold</label>
                  <Select defaultValue="500">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">$100</SelectItem>
                      <SelectItem value="250">$250</SelectItem>
                      <SelectItem value="500">$500</SelectItem>
                      <SelectItem value="1000">$1,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BehavioralInsights;