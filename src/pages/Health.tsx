import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Droplets, 
  Calculator, 
  Activity, 
  RotateCcw, 
  Dumbbell,
  Sparkles,
  Shield,
  Heart,
  Plus,
  Minus,
  Target
} from "lucide-react";

const Health = () => {
  const [hydrationGoal] = useState(2500);
  const [hydrationCurrent, setHydrationCurrent] = useState(1200);
  const [calories, setCalories] = useState({ consumed: 1850, target: 2200 });
  const [steps, setSteps] = useState(8247);
  const [workoutMinutes, setWorkoutMinutes] = useState(45);
  
  const addHydration = (amount: number) => {
    setHydrationCurrent(prev => Math.min(prev + amount, hydrationGoal));
  };

  const healthMetrics = [
    { 
      label: "Hydration", 
      value: Math.round((hydrationCurrent / hydrationGoal) * 100), 
      current: `${hydrationCurrent}ml`, 
      target: `${hydrationGoal}ml`,
      icon: Droplets,
      color: "bg-blue-500"
    },
    { 
      label: "Calories", 
      value: Math.round((calories.consumed / calories.target) * 100), 
      current: `${calories.consumed}`, 
      target: `${calories.target}`,
      icon: Calculator,
      color: "bg-orange-500"
    },
    { 
      label: "Activity", 
      value: Math.round((steps / 10000) * 100), 
      current: `${steps.toLocaleString()}`, 
      target: "10,000 steps",
      icon: Activity,
      color: "bg-green-500"
    },
    { 
      label: "Workout", 
      value: Math.round((workoutMinutes / 60) * 100), 
      current: `${workoutMinutes}min`, 
      target: "60min",
      icon: Dumbbell,
      color: "bg-purple-500"
    },
  ];

  const workoutPlans = [
    { name: "Morning Cardio", duration: "30 min", intensity: "Medium", type: "Cardio" },
    { name: "Strength Training", duration: "45 min", intensity: "High", type: "Strength" },
    { name: "Yoga Flow", duration: "20 min", intensity: "Low", type: "Flexibility" },
    { name: "HIIT Session", duration: "25 min", intensity: "High", type: "HIIT" },
  ];

  const skinCareRoutine = [
    { step: "Cleanser", time: "Morning", completed: true },
    { step: "Moisturizer", time: "Morning", completed: true },
    { step: "Sunscreen", time: "Morning", completed: false },
    { step: "Cleanser", time: "Evening", completed: false },
    { step: "Serum", time: "Evening", completed: false },
    { step: "Night Cream", time: "Evening", completed: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Health Companion
          </h1>
          
          {/* Health Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {healthMetrics.map((metric, index) => (
              <Card key={index} className="bg-gradient-to-br from-card to-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon className="w-5 h-5 text-primary" />
                    <Badge variant="secondary">{metric.value}%</Badge>
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{metric.label}</h3>
                  <p className="text-xs text-muted-foreground mb-2">
                    {metric.current} / {metric.target}
                  </p>
                  <Progress value={metric.value} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="hydration" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="hydration">Hydration</TabsTrigger>
              <TabsTrigger value="calories">Nutrition</TabsTrigger>
              <TabsTrigger value="movement">Movement</TabsTrigger>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="care">Self Care</TabsTrigger>
            </TabsList>

            {/* Hydration Tab */}
            <TabsContent value="hydration" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Droplets className="w-5 h-5" />
                      <span>Hydration Tracker</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {hydrationCurrent}ml
                      </div>
                      <p className="text-sm text-muted-foreground">
                        of {hydrationGoal}ml goal
                      </p>
                      <Progress 
                        value={(hydrationCurrent / hydrationGoal) * 100} 
                        className="mt-3 h-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => addHydration(250)}
                        variant="outline"
                        className="h-12"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        250ml
                      </Button>
                      <Button 
                        onClick={() => addHydration(500)}
                        variant="outline"
                        className="h-12"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        500ml
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Hydration Goals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm">Morning (6-12pm)</span>
                        <Badge variant="secondary">800ml</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm">Afternoon (12-6pm)</span>
                        <Badge variant="secondary">1000ml</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <span className="text-sm">Evening (6-10pm)</span>
                        <Badge variant="secondary">700ml</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="calories" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calculator className="w-5 h-5" />
                    <span>Calorie Calculator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500 mb-1">
                        {calories.consumed}
                      </div>
                      <p className="text-sm text-muted-foreground">Consumed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500 mb-1">
                        {calories.target - calories.consumed}
                      </div>
                      <p className="text-sm text-muted-foreground">Remaining</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">
                        {calories.target}
                      </div>
                      <p className="text-sm text-muted-foreground">Goal</p>
                    </div>
                  </div>
                  
                  <Progress 
                    value={(calories.consumed / calories.target) * 100} 
                    className="mt-6 h-3"
                  />
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center space-x-3">
                      <Input placeholder="Food item" className="flex-1" />
                      <Input placeholder="Calories" className="w-24" />
                      <Button size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Movement Tab */}
            <TabsContent value="movement" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Movement Tracking</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {steps.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Steps Today</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary mb-1">
                        {Math.round(steps * 0.0005 * 10) / 10}km
                      </div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-1">
                        {Math.round(steps * 0.04)}
                      </div>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                  </div>
                  
                  <Progress value={(steps / 10000) * 100} className="h-3" />
                  
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Cyclic Patterns</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">{day}</div>
                          <div className={`h-12 rounded ${index < 5 ? 'bg-primary' : 'bg-muted'} flex items-center justify-center`}>
                            <span className="text-xs text-white">
                              {index < 5 ? '✓' : '-'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workout Tab */}
            <TabsContent value="workout" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5" />
                    <span>Workout Planner</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workoutPlans.map((workout, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20">
                        <div>
                          <h3 className="font-semibold text-sm">{workout.name}</h3>
                          <p className="text-xs text-muted-foreground">{workout.duration} • {workout.type}</p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs mt-1 ${
                              workout.intensity === 'High' ? 'border-red-500 text-red-500' :
                              workout.intensity === 'Medium' ? 'border-yellow-500 text-yellow-500' :
                              'border-green-500 text-green-500'
                            }`}
                          >
                            {workout.intensity}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Self Care Tab */}
            <TabsContent value="care" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>Skin Care Routine</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {skinCareRoutine.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${item.completed ? 'bg-primary border-primary' : 'border-muted-foreground'}`} />
                            <div>
                              <span className="text-sm font-medium">{item.step}</span>
                              <div className="text-xs text-muted-foreground">{item.time}</div>
                            </div>
                          </div>
                          {item.completed && <Badge variant="secondary">Done</Badge>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Heart className="w-5 h-5" />
                      <span>Stress Relief</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Shield className="w-4 h-4 mr-3" />
                        5-Minute Meditation
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12">
                        <RotateCcw className="w-4 h-4 mr-3" />
                        Breathing Exercise
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-12">
                        <Activity className="w-4 h-4 mr-3" />
                        Quick Stretch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Health;