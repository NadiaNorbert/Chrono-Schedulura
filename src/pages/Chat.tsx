import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Mic, 
  MicOff,
  Bot,
  User,
  Volume2,
  VolumeX,
  Sparkles
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isVoice?: boolean;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI companion. I'm here to chat, provide support, and help you with anything you need. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInputMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: generateAIResponse(inputMessage),
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const generateAIResponse = (userInput: string): string => {
    const responses = [
      "That's really interesting! I'd love to hear more about that.",
      "I understand how you're feeling. It's completely normal to have those thoughts.",
      "Thank you for sharing that with me. How does that make you feel?",
      "That sounds like a meaningful experience. What did you learn from it?",
      "I'm here to listen and support you. Would you like to talk about anything else?",
      "That's a great question! Let me think about that for a moment...",
      "I appreciate you opening up to me. Your feelings are valid.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("This is a voice message simulation");
      }, 3000);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Simulate text-to-speech
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AI Companion Chat
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant={isVoiceMode ? "default" : "secondary"} className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>{isVoiceMode ? "Voice Mode" : "Text Mode"}</span>
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleVoiceMode}
              >
                {isVoiceMode ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white">
                    <Bot className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">AI Companion</CardTitle>
                  <p className="text-sm text-muted-foreground">Always here to listen and help</p>
                </div>
                <div className="flex-1" />
                {isSpeaking && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">Speaking...</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={
                        message.sender === 'ai' 
                          ? "bg-gradient-to-r from-primary to-secondary text-white" 
                          : "bg-muted"
                      }>
                        {message.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === 'ai'
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {message.sender === 'ai' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={toggleSpeaking}
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3 h-3" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Voice Mode Interface */}
              {isVoiceMode && (
                <div className="border-t bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
                  <div className="text-center">
                    <div className="mb-4">
                      <Button
                        size="lg"
                        onClick={toggleListening}
                        className={`w-20 h-20 rounded-full ${
                          isListening 
                            ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                            : "bg-primary hover:bg-primary/90"
                        }`}
                      >
                        <Mic className="w-8 h-8" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isListening ? "Listening... Speak now" : "Tap to speak"}
                    </p>
                    {isListening && (
                      <div className="mt-3">
                        <div className="flex justify-center space-x-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-1 bg-primary rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 20 + 10}px`,
                                animationDelay: `${i * 0.1}s`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Text Input */}
              {!isVoiceMode && (
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!inputMessage.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chat;