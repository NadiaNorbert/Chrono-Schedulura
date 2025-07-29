import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  Paperclip, 
  Calendar,
  Clock,
  CheckSquare,
  Plus,
  MoreVertical
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
}

const SmartScheduler = () => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Morning workout', completed: false, priority: 'high', category: 'daily', createdAt: new Date() },
    { id: '2', title: 'Team meeting review', completed: true, priority: 'medium', category: 'daily', createdAt: new Date() },
    { id: '3', title: 'Grocery shopping', completed: false, priority: 'low', category: 'weekly', createdAt: new Date() },
    { id: '4', title: 'Monthly budget planning', completed: false, priority: 'high', category: 'monthly', createdAt: new Date() },
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add new task from message
      const newTask: Task = {
        id: Date.now().toString(),
        title: message,
        completed: false,
        priority: 'medium',
        category: 'daily',
        createdAt: new Date()
      };
      setTasks([...tasks, newTask]);
      setMessage("");
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filterTasksByCategory = (category: 'daily' | 'weekly' | 'monthly') => {
    return tasks.filter(task => task.category === category);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Smart Scheduler
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-1">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>AI Assistant</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 bg-muted/30 rounded-lg p-4 mb-4 overflow-y-auto">
                    <div className="space-y-3">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm">Hello! I'm your AI scheduling assistant. Tell me what you'd like to add to your schedule.</p>
                      </div>
                      {tasks.slice(-3).map(task => (
                        <div key={task.id} className="bg-muted rounded-lg p-3">
                          <p className="text-sm">✅ Added "{task.title}" to your {task.category} tasks</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="Type your task or question..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setIsListening(!isListening)}
                        className={isListening ? "bg-red-500 text-white" : ""}
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Task Organization */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="w-5 h-5" />
                      <span>Task Organization</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="daily" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="daily">Daily ({filterTasksByCategory('daily').length})</TabsTrigger>
                      <TabsTrigger value="weekly">Weekly ({filterTasksByCategory('weekly').length})</TabsTrigger>
                      <TabsTrigger value="monthly">Monthly ({filterTasksByCategory('monthly').length})</TabsTrigger>
                    </TabsList>
                    
                    {(['daily', 'weekly', 'monthly'] as const).map(category => (
                      <TabsContent key={category} value={category} className="mt-4">
                        <div className="space-y-3">
                          {filterTasksByCategory(category).map(task => (
                            <div 
                              key={task.id} 
                              className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                              <Checkbox 
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                              />
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                              <div className="flex-1">
                                <p className={`text-sm font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {task.priority}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {task.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          
                          {filterTasksByCategory(category).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                              <p>No {category} tasks yet</p>
                              <p className="text-sm">Add some tasks using the AI assistant!</p>
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartScheduler;