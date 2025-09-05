"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  BotMessageSquare, 
  MessageSquareText, 
  Speech, 
  ChartSpline, 
  BrainCog,
  CircleDollarSign,
  PiggyBank,
  MessageCircleQuestionMark,
  ChartCandlestick,
  CircleQuestionMark,
  Brain,
  MessageCircleMore
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  assumptions?: string[];
  parameters?: { [key: string]: number };
  insights?: string[];
  followUpQuestions?: string[];
  educationalLinks?: { title: string; url: string }[];
  isBookmarked?: boolean;
}

interface ConversationThread {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

interface AIFinancialAssistantProps {
  className?: string;
}

export default function AIFinancialAssistant({ className }: AIFinancialAssistantProps) {
  const [threads, setThreads] = useState<ConversationThread[]>([
    {
      id: 'default',
      title: 'New Conversation',
      messages: [],
      lastUpdated: new Date(),
    }
  ]);
  const [activeThreadId, setActiveThreadId] = useState('default');
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAssumptions, setShowAssumptions] = useState(true);
  const [parameters, setParameters] = useState({
    riskTolerance: 50,
    timeHorizon: 10,
    monthlyInvestment: 1000,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeThread.messages, scrollToBottom]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const createNewThread = useCallback(() => {
    const newThread: ConversationThread = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      lastUpdated: new Date(),
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
  }, []);

  const updateThreadTitle = useCallback((threadId: string, firstMessage: string) => {
    const title = firstMessage.substring(0, 30) + (firstMessage.length > 30 ? '...' : '');
    setThreads(prev => prev.map(thread => 
      thread.id === threadId 
        ? { ...thread, title }
        : thread
    ));
  }, []);

  const simulateAIResponse = useCallback((userMessage: string): Message => {
    // Simulate AI processing with realistic financial advice
    const responses = [
      {
        content: "Based on your current financial situation and the parameters you've set, I'd recommend a balanced investment approach. With a moderate risk tolerance of 50% and a 10-year time horizon, you could consider a 70/30 stock-to-bond allocation.",
        assumptions: [
          "Assuming stable income growth of 3% annually",
          "Market returns averaging 7% for stocks, 3% for bonds",
          "No major life changes in the next 10 years"
        ],
        insights: [
          "Your monthly investment of $1,000 could grow to approximately $175,000 in 10 years",
          "Consider maximizing your 401(k) match before taxable investments",
          "Emergency fund should cover 6 months of expenses before investing"
        ],
        followUpQuestions: [
          "Would you like to explore tax-advantaged account options?",
          "How does inflation affect my investment strategy?",
          "What if I need to access funds before 10 years?"
        ],
        educationalLinks: [
          { title: "Understanding Asset Allocation", url: "#asset-allocation" },
          { title: "Risk vs. Return in Investing", url: "#risk-return" }
        ]
      },
      {
        content: "Let me analyze your spending patterns and suggest budget optimizations. Based on typical financial behaviors, I see opportunities to improve your financial efficiency.",
        assumptions: [
          "Monthly expenses follow the 50/30/20 rule guideline",
          "Income stability over the analysis period",
          "No major debt obligations affecting cash flow"
        ],
        insights: [
          "You could save an additional $200/month by optimizing subscriptions",
          "Meal planning could reduce food expenses by 15-20%",
          "Consider automating savings to improve consistency"
        ],
        followUpQuestions: [
          "What's your biggest spending category you'd like to optimize?",
          "Are you interested in automating your savings strategy?",
          "Would you like a personalized budget breakdown?"
        ],
        educationalLinks: [
          { title: "The 50/30/20 Budget Rule", url: "#budget-rule" },
          { title: "Automated Savings Strategies", url: "#auto-savings" }
        ]
      }
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      assumptions: response.assumptions,
      parameters: { ...parameters },
      insights: response.insights,
      followUpQuestions: response.followUpQuestions,
      educationalLinks: response.educationalLinks,
    };
  }, [parameters]);

  const sendMessage = useCallback(async () => {
    if (!currentMessage.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date(),
    };

    // Update thread with user message
    setThreads(prev => prev.map(thread => 
      thread.id === activeThreadId
        ? {
            ...thread,
            messages: [...thread.messages, userMessage],
            lastUpdated: new Date(),
          }
        : thread
    ));

    // Update thread title if it's the first message
    if (activeThread.messages.length === 0) {
      updateThreadTitle(activeThreadId, currentMessage.trim());
    }

    setCurrentMessage('');
    setIsProcessing(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = simulateAIResponse(currentMessage.trim());
      
      setThreads(prev => prev.map(thread => 
        thread.id === activeThreadId
          ? {
              ...thread,
              messages: [...thread.messages, aiResponse],
              lastUpdated: new Date(),
            }
          : thread
      ));
      
      setIsProcessing(false);
    }, 1500);
  }, [currentMessage, isProcessing, activeThreadId, activeThread.messages.length, updateThreadTitle, simulateAIResponse]);

  const toggleBookmark = useCallback((messageId: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === activeThreadId
        ? {
            ...thread,
            messages: thread.messages.map(msg => 
              msg.id === messageId
                ? { ...msg, isBookmarked: !msg.isBookmarked }
                : msg
            ),
          }
        : thread
    ));
  }, [activeThreadId]);

  const askFollowUp = useCallback((question: string) => {
    setCurrentMessage(question);
  }, []);

  const suggestedQuestions = [
    "How much should I save for retirement?",
    "What's the best investment strategy for my age?",
    "How can I reduce my monthly expenses?",
    "Should I pay off debt or invest first?",
  ];

  return (
    <div className={`flex h-[800px] bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
      {/* Sidebar - Conversation Threads */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Button 
            onClick={createNewThread}
            className="w-full justify-start gap-2"
          >
            <MessageSquareText className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {threads.map((thread) => (
              <Card
                key={thread.id}
                className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                  thread.id === activeThreadId ? 'bg-accent' : ''
                }`}
                onClick={() => setActiveThreadId(thread.id)}
              >
                <CardContent className="p-3">
                  <div className="font-medium text-sm truncate">
                    {thread.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {thread.messages.length} messages
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {thread.lastUpdated.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <BotMessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">AI Financial Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized financial advice powered by AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="show-assumptions" className="text-sm">
                Show Assumptions
              </Label>
              <Switch
                id="show-assumptions"
                checked={showAssumptions}
                onCheckedChange={setShowAssumptions}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {activeThread.messages.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Start a conversation</h3>
                <p className="text-muted-foreground mb-6">
                  Ask me anything about your finances, investments, or budgeting.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="text-left justify-start h-auto p-3"
                      onClick={() => askFollowUp(question)}
                    >
                      <CircleQuestionMark className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              activeThread.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <BotMessageSquare className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  
                  <div className={`max-w-3xl ${message.type === 'user' ? 'order-first' : ''}`}>
                    <Card className={message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}>
                      <CardContent className="p-4">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        
                        {message.type === 'assistant' && (
                          <div className="mt-4 space-y-4">
                            {/* Assumptions */}
                            {showAssumptions && message.assumptions && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <BrainCog className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-xs font-medium text-muted-foreground">
                                    Key Assumptions
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {message.assumptions.map((assumption, i) => (
                                    <div key={i} className="text-xs text-muted-foreground pl-6">
                                      • {assumption}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Insights */}
                            {message.insights && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <ChartSpline className="w-4 h-4 text-primary" />
                                  <span className="text-xs font-medium text-primary">
                                    Key Insights
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {message.insights.map((insight, i) => (
                                    <div key={i} className="text-xs bg-primary/10 rounded p-2">
                                      {insight}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Educational Links */}
                            {message.educationalLinks && (
                              <div className="space-y-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Learn More
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {message.educationalLinks.map((link, i) => (
                                    <Button
                                      key={i}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-7"
                                      onClick={() => window.open(link.url, '_blank')}
                                    >
                                      {link.title}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Follow-up Questions */}
                            {message.followUpQuestions && (
                              <div className="space-y-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Follow-up Questions
                                </span>
                                <div className="space-y-1">
                                  {message.followUpQuestions.map((question, i) => (
                                    <Button
                                      key={i}
                                      variant="ghost"
                                      size="sm"
                                      className="text-xs h-auto p-2 text-left justify-start w-full"
                                      onClick={() => askFollowUp(question)}
                                    >
                                      <MessageCircleQuestionMark className="w-3 h-3 mr-2 flex-shrink-0" />
                                      {question}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.type === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => toggleBookmark(message.id)}
                            >
                              <span className={`text-xs ${message.isBookmarked ? 'text-primary' : 'text-muted-foreground'}`}>
                                {message.isBookmarked ? '★' : '☆'}
                              </span>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-xs font-medium">You</span>
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <BotMessageSquare className="w-4 h-4 text-primary" />
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Analyzing your financial situation...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Parameters Panel */}
        <div className="border-t border-border p-4">
          <Tabs defaultValue="parameters" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Risk Tolerance</Label>
                  <Slider
                    value={[parameters.riskTolerance]}
                    onValueChange={([value]) => setParameters(prev => ({ ...prev, riskTolerance: value }))}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {parameters.riskTolerance}%
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Time Horizon (years)</Label>
                  <Slider
                    value={[parameters.timeHorizon]}
                    onValueChange={([value]) => setParameters(prev => ({ ...prev, timeHorizon: value }))}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {parameters.timeHorizon} years
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-xs">Monthly Investment</Label>
                  <Slider
                    value={[parameters.monthlyInvestment]}
                    onValueChange={([value]) => setParameters(prev => ({ ...prev, monthlyInvestment: value }))}
                    min={100}
                    max={5000}
                    step={100}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    ${parameters.monthlyInvestment}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis" className="mt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <PiggyBank className="w-4 h-4 text-chart-2" />
                    <span className="text-xs font-medium">Projected Growth</span>
                  </div>
                  <div className="text-lg font-bold text-chart-2">
                    ${Math.round(parameters.monthlyInvestment * 12 * parameters.timeHorizon * 1.07).toLocaleString()}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <ChartCandlestick className="w-4 h-4 text-chart-1" />
                    <span className="text-xs font-medium">Risk Level</span>
                  </div>
                  <Badge variant={parameters.riskTolerance > 70 ? 'destructive' : parameters.riskTolerance > 30 ? 'default' : 'secondary'}>
                    {parameters.riskTolerance > 70 ? 'High' : parameters.riskTolerance > 30 ? 'Moderate' : 'Conservative'}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <CircleDollarSign className="w-4 h-4 text-chart-4" />
                    <span className="text-xs font-medium">Total Investment</span>
                  </div>
                  <div className="text-lg font-bold text-chart-4">
                    ${(parameters.monthlyInvestment * 12 * parameters.timeHorizon).toLocaleString()}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me about your finances, investments, or budgeting..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                disabled={isProcessing}
              />
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={isListening ? 'bg-destructive text-destructive-foreground' : ''}
            >
              <Speech className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={sendMessage}
              disabled={!currentMessage.trim() || isProcessing}
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <MessageCircleMore className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}