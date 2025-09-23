import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  AlertTriangle,
  Heart,
  Coffee,
  Moon
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello Commander! I\'m your AstroBot companion. I\'m here to support your well-being during the mission. How are you feeling today?',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickResponses = [
    { text: "I feel tired", icon: Moon, response: "I understand you're feeling tired, Commander. Based on your recent activity patterns, I recommend taking a 15-minute rest break and ensuring proper hydration. Would you like me to set a reminder for a short meditation session?" },
    { text: "Need guidance", icon: Heart, response: "I'm here to help guide you through any challenges. Can you tell me more about what specific area you'd like guidance with? Whether it's stress management, sleep optimization, or general well-being, I have protocols designed to support you." },
    { text: "Report issue", icon: AlertTriangle, response: "Thank you for reporting an issue, Commander. Please describe the concern in detail. I'll document it in the mission log and provide immediate recommendations while alerting ground control if necessary." }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content?: string) => {
    const messageContent = content || inputMessage.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';
      
      if (content) {
        // Use predefined response for quick buttons
        const quickResponse = quickResponses.find(qr => qr.text === content);
        botResponse = quickResponse?.response || 'Thank you for your input, Commander. I\'m processing your request.';
      } else {
        // Generate contextual responses based on user input
        const input = messageContent.toLowerCase();
        if (input.includes('stress') || input.includes('anxiety')) {
          botResponse = 'I notice you mentioned stress, Commander. Deep breathing exercises can be very effective in space. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. Your current stress indicators show manageable levels. Would you like me to guide you through a brief relaxation session?';
        } else if (input.includes('sleep') || input.includes('tired')) {
          botResponse = 'Sleep quality is crucial for mission performance, Commander. Your sleep data shows you had 7.2 hours last night with good REM cycles. For better rest, I recommend maintaining your sleep schedule and ensuring the cabin temperature is set to 19°C. Should I adjust the lighting schedule for optimal circadian rhythm?';
        } else if (input.includes('exercise') || input.includes('workout')) {
          botResponse = 'Physical activity is essential in microgravity, Commander. Your exercise compliance is excellent at 95% this week. The resistance training today will help maintain bone density and muscle mass. Remember to secure all equipment properly. Do you need assistance with today\'s workout protocol?';
        } else {
          botResponse = 'I understand, Commander. Your well-being is my priority. Based on current biometric data, all systems appear nominal. Your heart rate is steady at 78 bpm and stress levels are low. Is there anything specific I can help you with today?';
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AstroBot Companion</h1>
            <p className="text-muted-foreground">AI-powered well-being support and guidance</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator nominal"></div>
            <span className="text-sm font-medium text-nominal">AI Assistant Online</span>
          </div>
        </div>

        {/* Current Status Alert */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-nominal" />
              <div>
                <p className="font-medium text-foreground">Current Status: All Parameters Normal</p>
                <p className="text-sm text-muted-foreground">Heart rate: 78 bpm • Stress level: Low • Fatigue: Minimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Common requests and support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-3"
                    onClick={() => handleSendMessage(response.text)}
                  >
                    <response.icon className="h-4 w-4" />
                    <span className="text-sm">{response.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>

                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts or ask for guidance..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;