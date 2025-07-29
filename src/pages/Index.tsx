import { useState } from "react";
import Navigation from "@/components/Navigation";
import EnergyLevelWidget from "@/components/widgets/EnergyLevelWidget";
import AIMotivatorWidget from "@/components/widgets/AIMotivatorWidget";
import GoalTrackingWidget from "@/components/widgets/GoalTrackingWidget";
import AuthWidget from "@/components/auth/AuthWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Bell, 
  Brain, 
  Activity, 
  Sparkles, 
  Plus,
  ArrowRight,
  Target,
  Heart,
  MessageCircle
} from "lucide-react";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Scheduling</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Your Intelligent Life
                <br />
                Management Companion
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Transform your daily routine with AI-driven scheduling, wellness tracking, 
                and personalized insights that adapt to your lifestyle.
              </p>
            </div>

            {/* Auth Widget */}
            <div className="flex justify-center mb-12">
              <AuthWidget />
            </div>

            {/* Features Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Smart Scheduler</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-powered chatbot that organizes your tasks intelligently with voice input and file attachments.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-secondary" />
                    <CardTitle className="text-lg">Intelligent Reminders</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adaptive alerts that learn from your behavior and send timely notifications.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-accent" />
                    <CardTitle className="text-lg">Wellness Tracking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor sleep, breaks, mental health with personalized suggestions.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-wellness-physical/5 to-wellness-physical/10 border-wellness-physical/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-wellness-physical" />
                    <CardTitle className="text-lg">Health Companion</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive health tracking including hydration, calories, and workouts.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-wellness-mental/5 to-wellness-mental/10 border-wellness-mental/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-wellness-mental" />
                    <CardTitle className="text-lg">AI Companion</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    ChatGPT-style voice assistant for natural conversations and support.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-energy-high/5 to-energy-high/10 border-energy-high/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-energy-high" />
                    <CardTitle className="text-lg">Neuro Flow</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Advanced analytics that learn your patterns and optimize your schedule.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Good Morning, User!
                </h1>
                <p className="text-muted-foreground">
                  Here's your personalized AI-powered dashboard
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>AI Active</span>
              </Badge>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Main Widgets */}
            <div className="lg:col-span-2 space-y-6">
              {/* Goal Tracking - Full Width */}
              <GoalTrackingWidget />
              
              {/* Quick Actions */}
              <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Quick Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <Button variant="outline" size="sm" className="flex flex-col items-center space-y-1 h-auto py-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Schedule</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex flex-col items-center space-y-1 h-auto py-3">
                      <Bell className="w-4 h-4" />
                      <span className="text-xs">Remind</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex flex-col items-center space-y-1 h-auto py-3">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">Wellness</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex flex-col items-center space-y-1 h-auto py-3">
                      <Activity className="w-4 h-4" />
                      <span className="text-xs">Health</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Side Widgets */}
            <div className="space-y-6">
              <EnergyLevelWidget />
              <AIMotivatorWidget />
            </div>
          </div>

          {/* Bottom Row - Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Smart Scheduler</h3>
                <p className="text-xs text-muted-foreground">8 tasks pending</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Reminders</h3>
                <p className="text-xs text-muted-foreground">3 active alerts</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-5 h-5 text-wellness-mental" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-wellness-mental transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Wellness</h3>
                <p className="text-xs text-muted-foreground">Sleep: 7.5h</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-5 h-5 text-wellness-physical" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-wellness-physical transition-colors" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Health</h3>
                <p className="text-xs text-muted-foreground">Steps: 8.2k</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
