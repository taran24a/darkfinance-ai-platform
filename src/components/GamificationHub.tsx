"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  PiggyBank, 
  CircleDollarSign, 
  Goal, 
  BadgeIndianRupee,
  Wallet,
  Coins,
  DiamondPercent,
  BanknoteArrowUp,
  ChartBarIncreasing,
  ChartColumnBig,
  CreditCard,
  ChartSpline,
  Diamond,
  ReceiptCent
} from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'community';
  category: 'savings' | 'no-spend' | 'debt' | 'investment';
  duration: number;
  participants: number;
  progress: number;
  reward: string;
  isActive: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  earnedDate?: Date;
  progress: number;
  category: 'savings' | 'streak' | 'challenge' | 'milestone';
}

interface Streak {
  type: string;
  current: number;
  best: number;
  lastActivity: Date;
}

const GamificationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [privacySettings, setPrivacySettings] = useState({
    showStats: true,
    showLeaderboard: true,
    showAchievements: true
  });

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first savings challenge',
      icon: PiggyBank,
      earned: true,
      earnedDate: new Date('2024-01-15'),
      progress: 100,
      category: 'challenge'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 30-day no-spend streak',
      icon: DiamondPercent,
      earned: true,
      earnedDate: new Date('2024-02-01'),
      progress: 100,
      category: 'streak'
    },
    {
      id: '3',
      title: 'Savings Champion',
      description: 'Save $1,000 in a single month',
      icon: CircleDollarSign,
      earned: false,
      progress: 65,
      category: 'savings'
    },
    {
      id: '4',
      title: 'Debt Destroyer',
      description: 'Pay off your first debt completely',
      icon: CreditCard,
      earned: false,
      progress: 40,
      category: 'milestone'
    }
  ];

  const streaks: Streak[] = [
    {
      type: 'No Impulse Buying',
      current: 12,
      best: 45,
      lastActivity: new Date()
    },
    {
      type: 'Daily Budget Tracking',
      current: 28,
      best: 35,
      lastActivity: new Date()
    },
    {
      type: 'Savings Goal Progress',
      current: 7,
      best: 15,
      lastActivity: new Date()
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: '30-Day No Coffee Challenge',
      description: 'Skip coffee purchases for 30 days and save money',
      type: 'community',
      category: 'no-spend',
      duration: 30,
      participants: 1247,
      progress: 60,
      reward: '$150 average savings',
      isActive: true,
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'Emergency Fund Builder',
      description: 'Save $1,000 for your emergency fund',
      type: 'personal',
      category: 'savings',
      duration: 90,
      participants: 1,
      progress: 35,
      reward: 'Financial Security Badge',
      isActive: true,
      difficulty: 'hard'
    },
    {
      id: '3',
      title: 'Debt Snowball Sprint',
      description: 'Pay off smallest debt in 60 days',
      type: 'community',
      category: 'debt',
      duration: 60,
      participants: 892,
      progress: 0,
      reward: 'Debt-Free Milestone',
      isActive: false,
      difficulty: 'hard'
    }
  ];

  const leaderboardData = [
    { rank: 1, name: 'Sarah M.', points: 2840, streak: 45 },
    { rank: 2, name: 'Mike R.', points: 2720, streak: 38 },
    { rank: 3, name: 'Alex K.', points: 2650, streak: 42 },
    { rank: 4, name: 'You', points: 2480, streak: 28 },
    { rank: 5, name: 'Emma L.', points: 2390, streak: 35 }
  ];

  const motivationalQuotes = [
    "Every dollar saved is a step toward financial freedom.",
    "Small changes today, big results tomorrow.",
    "Your future self will thank you for today's discipline.",
    "Building wealth is a marathon, not a sprint."
  ];

  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings': return PiggyBank;
      case 'no-spend': return Wallet;
      case 'debt': return CreditCard;
      case 'investment': return ChartBarIncreasing;
      default: return CircleDollarSign;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient-finance-flow">
          Gamification Hub
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Turn your financial journey into an engaging adventure with challenges, achievements, and community support.
        </p>
        
        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-lg italic text-center">
              "{motivationalQuotes[currentQuote]}"
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Diamond className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,480</div>
                <p className="text-xs text-muted-foreground">
                  +240 from last month
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Streaks</CardTitle>
                <DiamondPercent className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Longest: 28 days
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Challenges</CardTitle>
                <Goal className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  2 this month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Streaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DiamondPercent className="h-5 w-5" />
                Current Streaks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {streaks.map((streak, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{streak.type}</span>
                    <Badge variant={streak.current > 0 ? "default" : "secondary"}>
                      {streak.current} days
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Best: {streak.best} days</span>
                    <Progress 
                      value={(streak.current / streak.best) * 100} 
                      className="flex-1 max-w-32"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Challenges Preview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Goal className="h-5 w-5" />
                  Active Challenges
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('challenges')}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.filter(c => c.isActive).slice(0, 2).map((challenge) => {
                const IconComponent = getCategoryIcon(challenge.category);
                return (
                  <div key={challenge.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{challenge.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {challenge.description}
                          </p>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${getDifficultyColor(challenge.difficulty)}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Challenges</h2>
            <Dialog open={showCreateChallenge} onOpenChange={setShowCreateChallenge}>
              <DialogTrigger asChild>
                <Button>Create Challenge</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Custom Challenge</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Challenge Title</Label>
                    <Input id="title" placeholder="Enter challenge title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Describe your challenge" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="no-spend">No Spend</SelectItem>
                        <SelectItem value="debt">Debt Payoff</SelectItem>
                        <SelectItem value="investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input id="duration" type="number" placeholder="30" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="public" />
                    <Label htmlFor="public">Make this challenge public</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1">Create Challenge</Button>
                    <Button variant="outline" onClick={() => setShowCreateChallenge(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {challenges.map((challenge) => {
              const IconComponent = getCategoryIcon(challenge.category);
              return (
                <Card key={challenge.id} className={`${challenge.isActive ? 'border-primary/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{challenge.title}</h3>
                          <p className="text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getDifficultyColor(challenge.difficulty)}`} />
                        <Badge variant={challenge.type === 'community' ? 'default' : 'secondary'}>
                          {challenge.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{challenge.duration}</div>
                        <div className="text-sm text-muted-foreground">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{challenge.participants}</div>
                        <div className="text-sm text-muted-foreground">Participants</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{challenge.progress}%</div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-primary">{challenge.reward}</div>
                        <div className="text-sm text-muted-foreground">Reward</div>
                      </div>
                    </div>

                    <Progress value={challenge.progress} className="mb-4" />

                    <div className="flex gap-2">
                      {challenge.isActive ? (
                        <Button variant="destructive" size="sm">Leave Challenge</Button>
                      ) : (
                        <Button size="sm">Join Challenge</Button>
                      )}
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <h2 className="text-2xl font-bold">Achievements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={achievement.id} className={`${achievement.earned ? 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20' : 'opacity-75'}`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                      achievement.earned ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>

                    {achievement.earned ? (
                      <Badge className="bg-green-500 text-white">
                        Earned {achievement.earnedDate?.toLocaleDateString()}
                      </Badge>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} />
                      </div>
                    )}

                    <Badge variant="outline" className="capitalize">
                      {achievement.category}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Social Tab */}
        <TabsContent value="social" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Social Hub</h2>
            <div className="flex gap-2">
              <Button variant="outline">Privacy Settings</Button>
              <Button>Create Room</Button>
            </div>
          </div>

          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-stats">Show My Stats</Label>
                  <p className="text-sm text-muted-foreground">Allow others to see your masked financial progress</p>
                </div>
                <Switch 
                  id="show-stats" 
                  checked={privacySettings.showStats}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showStats: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-leaderboard">Appear on Leaderboards</Label>
                  <p className="text-sm text-muted-foreground">Show anonymized ranking in community challenges</p>
                </div>
                <Switch 
                  id="show-leaderboard" 
                  checked={privacySettings.showLeaderboard}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showLeaderboard: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-achievements">Share Achievements</Label>
                  <p className="text-sm text-muted-foreground">Allow sharing of milestone achievements</p>
                </div>
                <Switch 
                  id="show-achievements" 
                  checked={privacySettings.showAchievements}
                  onCheckedChange={(checked) => 
                    setPrivacySettings(prev => ({ ...prev, showAchievements: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIncreasing className="h-5 w-5" />
                Community Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboardData.map((entry) => (
                  <div key={entry.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.name === 'You' ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-black' :
                        entry.rank === 2 ? 'bg-gray-400 text-black' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <span className={`font-medium ${entry.name === 'You' ? 'text-primary' : ''}`}>
                        {entry.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{entry.points} pts</span>
                      <Badge variant="outline">{entry.streak}d streak</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Community Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <PiggyBank className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Alex K. completed "30-Day Savings Challenge"</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <DiamondPercent className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Sarah M. reached a 45-day streak!</p>
                    <p className="text-sm text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                  <Goal className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">New challenge: "Debt Snowball Sprint" is now available</p>
                    <p className="text-sm text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationHub;