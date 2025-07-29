import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Activity, 
  Clock, 
  TrendingUp,
  Calendar,
  Target,
  Zap,
  BarChart3,
  PieChart,
  Lightbulb,
  Settings
} from "lucide-react";

const NeuroFlow = () => {
  const [analysisData] = useState({
    productivityScore: 82,
    focusTime: 6.5,
    breakEfficiency: 75,
    taskCompletionRate: 88,
    energyOptimization: 71
  });

  const activityPatterns = [
    { time: '9:00 AM', activity: 'Deep Work', efficiency: 95, duration: '2h' },
    { time: '11:00 AM', activity: 'Meetings', efficiency: 70, duration: '1h' },
    { time: '12:00 PM', activity: 'Break', efficiency: 85, duration: '30m' },
    { time: '2:00 PM', activity: 'Creative Work', efficiency: 88, duration: '2h' },
    { time: '4:00 PM', activity: 'Administrative', efficiency: 65, duration: '1h' },
    { time: '5:00 PM', activity: 'Planning', efficiency: 92, duration: '30m' },
  ];

  const recommendations = [
    {
      title: "Optimize Morning Focus",
      description: "Your peak focus time is 9-11 AM. Schedule complex tasks during this window.",
      impact: "High",
      category: "Scheduling"
    },
    {
      title: "Extend Break Duration",
      description: "15-minute breaks show 23% better recovery than 5-minute breaks.",
      impact: "Medium",
      category: "Wellness"
    },
    {
      title: "Batch Similar Tasks",
      description: "Group administrative tasks to reduce context switching by 31%.",
      impact: "High",
      category: "Productivity"
    },
    {
      title: "Energy-Task Alignment",
      description: "Creative work performs 18% better when energy levels are above 75%.",
      impact: "Medium",
      category: "Energy"
    }
  ];

  const weeklyTrends = [
    { day: 'Mon', productivity: 85, energy: 80, focus: 90 },
    { day: 'Tue', productivity: 92, energy: 85, focus: 88 },
    { day: 'Wed', productivity: 78, energy: 75, focus: 82 },
    { day: 'Thu', productivity: 88, energy: 82, focus: 85 },
    { day: 'Fri', productivity: 75, energy: 70, focus: 78 },
    { day: 'Sat', productivity: 60, energy: 85, focus: 65 },
    { day: 'Sun', productivity: 55, energy: 90, focus: 60 },
  ];

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return 'text-green-500';
    if (efficiency >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Neuro Flow Analytics
          </h1>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Brain className="w-5 h-5 text-primary" />
                  <Badge variant="secondary">{analysisData.productivityScore}%</Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">Productivity Score</h3>
                <Progress value={analysisData.productivityScore} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  <Badge variant="secondary">{analysisData.focusTime}h</Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">Focus Time</h3>
                <Progress value={(analysisData.focusTime / 8) * 100} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <Badge variant="secondary">{analysisData.breakEfficiency}%</Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">Break Efficiency</h3>
                <Progress value={analysisData.breakEfficiency} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-wellness-mental/5 to-wellness-mental/10 border-wellness-mental/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-5 h-5 text-wellness-mental" />
                  <Badge variant="secondary">{analysisData.taskCompletionRate}%</Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">Task Completion</h3>
                <Progress value={analysisData.taskCompletionRate} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-energy-high/5 to-energy-high/10 border-energy-high/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-energy-high" />
                  <Badge variant="secondary">{analysisData.energyOptimization}%</Badge>
                </div>
                <h3 className="font-semibold text-sm mb-1">Energy Optimization</h3>
                <Progress value={analysisData.energyOptimization} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="patterns" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="patterns">Activity Patterns</TabsTrigger>
              <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
              <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
              <TabsTrigger value="scheduling">Smart Scheduling</TabsTrigger>
            </TabsList>

            {/* Activity Patterns */}
            <TabsContent value="patterns" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Daily Activity Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityPatterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium text-primary">{pattern.time}</div>
                          <div>
                            <h3 className="font-semibold text-sm">{pattern.activity}</h3>
                            <p className="text-xs text-muted-foreground">Duration: {pattern.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className={`text-sm font-semibold ${getEfficiencyColor(pattern.efficiency)}`}>
                              {pattern.efficiency}%
                            </div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                          </div>
                          <Progress value={pattern.efficiency} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weekly Trends */}
            <TabsContent value="trends" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Weekly Performance Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-7 gap-2">
                      {weeklyTrends.map((day, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium mb-2">{day.day}</div>
                          <div className="space-y-2">
                            <div className="bg-muted rounded p-2">
                              <div className="text-xs text-muted-foreground mb-1">Productivity</div>
                              <div className="text-sm font-semibold">{day.productivity}%</div>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <div className="text-xs text-muted-foreground mb-1">Energy</div>
                              <div className="text-sm font-semibold">{day.energy}%</div>
                            </div>
                            <div className="bg-muted rounded p-2">
                              <div className="text-xs text-muted-foreground mb-1">Focus</div>
                              <div className="text-sm font-semibold">{day.focus}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Recommendations */}
            <TabsContent value="recommendations" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5" />
                    <span>AI-Powered Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm">{rec.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                            <div className={`w-2 h-2 rounded-full ${getImpactColor(rec.impact)}`} />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Smart Scheduling */}
            <TabsContent value="scheduling" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Optimized Schedule Suggestions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                      <h3 className="font-semibold text-sm mb-2">Tomorrow's Optimized Schedule</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>9:00 - 11:00 AM</span>
                          <span className="font-medium">Deep Work (High Priority Tasks)</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>11:00 - 11:15 AM</span>
                          <span className="font-medium">Break (Recommended: Walk)</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>11:15 AM - 12:15 PM</span>
                          <span className="font-medium">Meetings & Communication</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>2:00 - 4:00 PM</span>
                          <span className="font-medium">Creative Work & Planning</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span>4:00 - 5:00 PM</span>
                          <span className="font-medium">Administrative Tasks</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/30">
                        <h4 className="font-semibold text-sm mb-2">Energy Alignment</h4>
                        <p className="text-xs text-muted-foreground">
                          Tasks are scheduled when your energy levels historically peak for optimal performance.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/30">
                        <h4 className="font-semibold text-sm mb-2">Context Switching</h4>
                        <p className="text-xs text-muted-foreground">
                          Similar tasks are batched together to minimize cognitive load and maximize flow state.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NeuroFlow;