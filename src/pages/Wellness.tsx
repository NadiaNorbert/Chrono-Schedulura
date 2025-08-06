import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useApi, useMutation } from "@/hooks/useApi";
import { apiClient, WellnessData } from "@/services/api";
import {
  Moon,
  Coffee,
  Clock,
  Brain,
  BookOpen,
  Flower2,
  Move,
  Heart,
  TrendingUp,
  Plus
} from "lucide-react";

const Wellness = () => {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const { toast } = useToast();
  const { data, loading, error, refetch } = useApi<WellnessData[]>(() => apiClient.getWellnessData(today), [today]);
  const [sleepHours, setSleepHours] = useState([7.5]);
  const [breakTime, setBreakTime] = useState([45]);
  const [usageTime, setUsageTime] = useState([6]);
  const [mentalHealth, setMentalHealth] = useState([7]);
  const [journalEntry, setJournalEntry] = useState("");
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const w = data[0];
      setSleepHours([w.sleep_duration]);
      setBreakTime([w.break_duration]);
      setUsageTime([w.usage_duration]);
      setMentalHealth([w.mental_health_score]);
    }
  }, [data]);

  const saveWellness = async () => {
    const payload = {
      sleep_duration: sleepHours[0],
      break_duration: breakTime[0],
      usage_duration: usageTime[0],
      mental_health_score: mentalHealth[0],
      date: today,
    };
    try {
      await apiClient.updateWellnessData(payload);
      toast({ title: "Wellness saved", description: "Your wellness data for today was updated." });
      refetch();
    } catch (e) {
      toast({ title: "Failed to save", description: e instanceof Error ? e.message : "", variant: "destructive" as any });
    }
  };

  const wellnessMetrics = [
    { label: "Sleep Quality", value: Math.round((sleepHours[0] / 8) * 100), color: "bg-wellness-mental", icon: Moon },
    { label: "Break Frequency", value: Math.min(100, Math.round((breakTime[0] / 60) * 100)), color: "bg-primary", icon: Coffee },
    { label: "Mental Wellness", value: Math.min(100, mentalHealth[0] * 10), color: "bg-secondary", icon: Brain },
    { label: "Screen Balance", value: Math.max(0, 100 - Math.round((usageTime[0] / 10) * 100)), color: "bg-accent", icon: Clock },
  ];

  const activities = [
    { id: 'meditation', name: 'Meditation', icon: Flower2, duration: '10 min', description: 'Mindfulness breathing exercise' },
    { id: 'stretching', name: 'Stretching', icon: Move, duration: '15 min', description: 'Full body stretch routine' },
    { id: 'journaling', name: 'Journaling', icon: BookOpen, duration: '20 min', description: 'Reflective writing session' },
    { id: 'breathing', name: 'Deep Breathing', icon: Heart, duration: '5 min', description: 'Stress relief breathing' },
  ];

  const startActivity = (activityId: string) => {
    setCurrentActivity(activityId);
    // Simulate activity timer
    setTimeout(() => setCurrentActivity(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Wellness & Break
          </h1>
          {error && <div className="text-destructive text-sm mb-4">{error}</div>}
          
          {/* Wellness Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {wellnessMetrics.map((metric, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="w-5 h-5 text-primary" />
                    <Badge variant="secondary">{metric.value}%</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{metric.label}</h3>
                  <Progress value={metric.value} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tracking Controls */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Wellness Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center space-x-2">
                        <Moon className="w-4 h-4" />
                        <span>Sleep Duration</span>
                      </label>
                      <Badge variant="outline">{sleepHours[0]}h</Badge>
                    </div>
                    <Slider
                      value={sleepHours}
                      onValueChange={setSleepHours}
                      max={12}
                      min={4}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center space-x-2">
                        <Coffee className="w-4 h-4" />
                        <span>Break Duration</span>
                      </label>
                      <Badge variant="outline">{breakTime[0]}m</Badge>
                    </div>
                    <Slider
                      value={breakTime}
                      onValueChange={setBreakTime}
                      max={120}
                      min={15}
                      step={15}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Screen Usage</span>
                      </label>
                      <Badge variant="outline">{usageTime[0]}h</Badge>
                    </div>
                    <Slider
                      value={usageTime}
                      onValueChange={setUsageTime}
                      max={12}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium flex items-center space-x-2">
                        <Brain className="w-4 h-4" />
                        <span>Mental Health</span>
                      </label>
                      <Badge variant="outline">{mentalHealth[0]}/10</Badge>
                    </div>
                    <Slider
                      value={mentalHealth}
                      onValueChange={setMentalHealth}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Journaling */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Daily Journal</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write about your day, thoughts, or feelings..."
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-[120px] mb-3"
                  />
                  <Button size="sm" className="w-full" onClick={saveWellness} disabled={loading}>
                    <Plus className="w-4 h-4 mr-1" />
                    {loading ? "Saving…" : "Save Wellness"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Wellness Activities */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span>Wellness Activities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20 hover:from-primary/5 hover:to-secondary/5 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <activity.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{activity.name}</h3>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <Badge variant="outline" className="text-xs mt-1">{activity.duration}</Badge>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => startActivity(activity.id)}
                        disabled={currentActivity === activity.id}
                        variant={currentActivity === activity.id ? "secondary" : "outline"}
                      >
                        {currentActivity === activity.id ? "Active..." : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Activity Timer */}
                {currentActivity && (
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="text-center">
                      <div className="animate-pulse">
                        <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1">Activity in Progress</h3>
                      <p className="text-sm text-muted-foreground">Focus on your breathing and relax...</p>
                      <Progress value={75} className="mt-3" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wellness;