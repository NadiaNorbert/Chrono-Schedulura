import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Clock, 
  Calendar,
  Smartphone,
  Volume2,
  Brain,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  priority: 'low' | 'medium' | 'high';
  enabled: boolean;
  adaptive: boolean;
  lastTriggered?: Date;
  completionRate: number;
}

const Reminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Take morning vitamins',
      description: 'Don\'t forget your daily supplements',
      time: '08:00',
      frequency: 'daily',
      priority: 'medium',
      enabled: true,
      adaptive: true,
      completionRate: 85
    },
    {
      id: '2',
      title: 'Team standup meeting',
      description: 'Daily sync with the development team',
      time: '09:30',
      frequency: 'daily',
      priority: 'high',
      enabled: true,
      adaptive: false,
      completionRate: 95
    },
    {
      id: '3',
      title: 'Drink water',
      description: 'Stay hydrated throughout the day',
      time: '14:00',
      frequency: 'daily',
      priority: 'low',
      enabled: true,
      adaptive: true,
      completionRate: 70
    },
    {
      id: '4',
      title: 'Weekly planning session',
      description: 'Plan tasks and goals for the upcoming week',
      time: '17:00',
      frequency: 'weekly',
      priority: 'high',
      enabled: true,
      adaptive: true,
      completionRate: 90
    }
  ]);

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    frequency: 'daily' as 'once' | 'daily' | 'weekly' | 'monthly',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableSound: true,
    enableVibration: true,
    adaptiveTiming: true,
    smartPriority: true
  });

  const addReminder = () => {
    if (newReminder.title && newReminder.time) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        ...newReminder,
        enabled: true,
        adaptive: notificationSettings.adaptiveTiming,
        completionRate: 0
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        time: '',
        frequency: 'daily',
        priority: 'medium'
      });
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(reminder =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const simulateNotification = (reminder: Reminder) => {
    // This would trigger an actual system notification in a real app
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: '/favicon.ico'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Intelligent Reminders
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Reminder */}
            <Card className="lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Reminder</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Reminder title"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                />
                <Input
                  placeholder="Description (optional)"
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                />
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
                <Select 
                  value={newReminder.frequency} 
                  onValueChange={(value: 'once' | 'daily' | 'weekly' | 'monthly') => 
                    setNewReminder({...newReminder, frequency: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Select 
                  value={newReminder.priority} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setNewReminder({...newReminder, priority: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addReminder} className="w-full">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Reminder
                </Button>
              </CardContent>
            </Card>

            {/* Reminders List */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Active Reminders</span>
                  </div>
                  <Badge variant="secondary">{reminders.filter(r => r.enabled).length} active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div 
                      key={reminder.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-card to-muted/20"
                    >
                      <div className="flex items-center space-x-4">
                        <Switch 
                          checked={reminder.enabled}
                          onCheckedChange={() => toggleReminder(reminder.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-sm">{reminder.title}</h3>
                            <AlertCircle className={`w-4 h-4 ${getPriorityColor(reminder.priority)}`} />
                            {reminder.adaptive && (
                              <Badge variant="outline" className="text-xs">
                                <Brain className="w-3 h-3 mr-1" />
                                Adaptive
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{reminder.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {reminder.time}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {reminder.frequency}
                            </span>
                            <span className={`flex items-center ${getCompletionColor(reminder.completionRate)}`}>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {reminder.completionRate}% completion
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => simulateNotification(reminder)}
                      >
                        Test
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Notification Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Sound Alerts</p>
                        <p className="text-xs text-muted-foreground">Play notification sounds</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.enableSound}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, enableSound: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Vibration</p>
                        <p className="text-xs text-muted-foreground">Enable vibration alerts</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.enableVibration}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, enableVibration: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <Brain className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Adaptive Timing</p>
                        <p className="text-xs text-muted-foreground">AI learns your patterns</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.adaptiveTiming}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, adaptiveTiming: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-sm">Smart Priority</p>
                        <p className="text-xs text-muted-foreground">Intelligent importance ranking</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.smartPriority}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({...notificationSettings, smartPriority: checked})
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;