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
  Moon,
  Mic,
  MicOff,
  Volume2
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  inputMethod?: 'text' | 'voice';
}

// Session storage for tracking
interface SessionData {
  sleepHours: number | null;
  stressLevel: string | null;
  mood: string | null;
  lastSleepCheck: Date | null;
  conversationCount: number;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Greetings, Commander! AstroMate here, your dedicated mission companion. I\'m here to support your well-being and assist with any mission-related needs. How can I help you today?',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>({
    sleepHours: null,
    stressLevel: null,
    mood: null,
    lastSleepCheck: null,
    conversationCount: 0
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript, 'voice');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Random choice helper
  const randomChoice = (options: string[]) => {
    return options[Math.floor(Math.random() * options.length)];
  };

  // Text-to-Speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      
      // Add thinking delay
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        // Try to use a more natural voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Microsoft') ||
          voice.name.includes('Natural')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }, Math.random() * 300 + 300); // 300-600ms delay
    }
  };

  // Rule-based response system
  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Update conversation count
    setSessionData(prev => ({ ...prev, conversationCount: prev.conversationCount + 1 }));

    // A. Basic Greetings & Politeness
    if (lowerInput.match(/\b(hi|hello|hey|greetings)\b/)) {
      return randomChoice([
        "Hello, Commander! Ready to tackle today's mission objectives?",
        "Greetings, Commander! All systems are nominal and I'm here to assist.",
        "Good to hear from you, Commander! How can AstroMate support you today?",
        "Commander, welcome back! Your dedication to the mission is truly inspiring."
      ]);
    }

    if (lowerInput.match(/\b(thanks|thank you|appreciate)\b/)) {
      return randomChoice([
        "You're very welcome, Commander! It's my honor to serve alongside you.",
        "Always happy to help, Commander! That's what mission companions are for.",
        "My pleasure, Commander! Your success is our mission's success."
      ]);
    }

    if (lowerInput.match(/\b(sorry|apologize)\b/)) {
      return randomChoice([
        "No need to apologize, Commander! We're all learning and adapting up here.",
        "Commander, there's nothing to be sorry about. We're in this together.",
        "Don't worry about it, Commander! Focus on the mission ahead."
      ]);
    }

    if (lowerInput.match(/\b(wait|i will wait|waiting)\b/)) {
      return randomChoice([
        "Roger that, Commander! Take your time, I'll be right here.",
        "Understood, Commander! I'm standing by whenever you're ready.",
        "Copy that, Commander! No rush at all."
      ]);
    }

    if (lowerInput.match(/\b(ok|okay|understood|roger|copy)\b/)) {
      return randomChoice([
        "Excellent, Commander! Glad we're on the same page.",
        "Perfect, Commander! Mission coordination at its finest.",
        "Outstanding, Commander! Clear communication is key to success."
      ]);
    }

    // B. Mission-Related Queries
    if (lowerInput.match(/\b(mission|status|systems|sensors|report)\b/)) {
      return randomChoice([
        "Mission Status Report: All primary systems nominal, Commander! Oxygen generation at 99.2%, cabin temperature stable at 22°C, atmospheric pressure optimal. Navigation systems locked on trajectory. Power systems operating at 94% efficiency, communication arrays fully operational. You're doing exceptional work up there!",
        "Current Mission Overview: Life support systems performing excellently, Commander! Environmental controls maintaining perfect conditions. Guidance systems show precise orbital mechanics. Power distribution optimal across all modules. Communication with ground control crystal clear. The mission is progressing beautifully under your command!",
        "Systems Check Complete: Outstanding status across the board, Commander! Oxygen scrubbers functioning perfectly, thermal regulation systems stable. Navigation computers show nominal trajectory. Solar arrays generating maximum power. All communication channels open and secure. Your leadership is keeping everything running smoothly!",
        "Mission Parameters: All green across the board, Commander! Life support maintaining perfect atmosphere, temperature regulation systems optimal. Orbital mechanics precisely on target. Power systems delivering consistent energy. Ground communication links strong and stable. The crew's performance has been exemplary!"
      ]);
    }

    if (lowerInput.match(/\b(checklist|tasks|to do|schedule)\b/)) {
      return randomChoice([
        "Daily Mission Checklist, Commander: Morning system diagnostics, exercise protocol completion, experiment monitoring, equipment maintenance, evening status report to ground control. You've been maintaining excellent task completion rates!",
        "Today's Priority Tasks: Life support system checks, physical fitness regimen, scientific experiment procedures, communication windows with Earth, personal well-being assessment. Your dedication to protocol adherence is commendable, Commander!",
        "Mission Schedule Update: System monitoring, mandatory exercise period, research activities, maintenance procedures, crew coordination meetings. You're consistently exceeding performance expectations, Commander!"
      ]);
    }

    if (lowerInput.match(/\b(exercise|workout|fitness|physical)\b/)) {
      return randomChoice([
        "Physical Fitness Reminder, Commander: Your body is your most important mission equipment! Resistance training helps maintain bone density in microgravity. Cardiovascular exercise keeps your heart strong. Don't forget your daily 2.5-hour exercise protocol!",
        "Fitness Protocol, Commander: Regular exercise is crucial for mission success! The ARED system awaits your strength training. Treadmill time keeps your cardiovascular system optimal. Your commitment to physical health directly impacts mission performance!",
        "Exercise Advisory, Commander: Your muscles and bones need consistent attention in zero gravity! Resistance exercises prevent muscle atrophy. Cardio work maintains circulation. Your fitness discipline is inspiring to the entire ground team!"
      ]);
    }

    // C. Health, Sleep & Hydration
    if (lowerInput.match(/\b(sleep|tired|rest|fatigue|sleepy)\b/)) {
      // Ask follow-up about sleep hours if not tracked recently
      if (!sessionData.sleepHours || !sessionData.lastSleepCheck || 
          (new Date().getTime() - sessionData.lastSleepCheck.getTime()) > 24 * 60 * 60 * 1000) {
        setSessionData(prev => ({ ...prev, lastSleepCheck: new Date() }));
        return randomChoice([
          "Sleep is absolutely critical for mission success, Commander! How many hours did you manage to get last night? Quality rest directly impacts cognitive performance and decision-making abilities.",
          "Commander, proper rest is non-negotiable for optimal performance! Can you tell me how many hours of sleep you achieved? Your sleep quality affects everything from reaction time to problem-solving skills.",
          "Rest and recovery are mission-critical, Commander! How many hours of sleep did you get? Adequate rest is essential for maintaining peak performance in our demanding environment.",
          "Sleep hygiene is vital up here, Commander! What was your sleep duration last night? Quality rest helps your body and mind adapt to the unique challenges of space."
        ]);
      } else {
        return randomChoice([
          "Based on our previous discussion about your sleep, Commander, remember that 8-9 hours is optimal for space operations. Consider adjusting your sleep schedule if you're feeling fatigued. Your rest directly impacts mission safety!",
          "Commander, if fatigue is setting in, don't hesitate to prioritize rest! Your previous sleep data suggests you might benefit from extending your sleep period. A well-rested commander makes better decisions!",
          "Fatigue management is crucial, Commander! Given your recent sleep patterns, consider implementing relaxation techniques before bed. Progressive muscle relaxation works well in microgravity environments."
        ]);
      }
    }

    if (lowerInput.match(/\b(hydration|water|thirsty|drink|dehydrated)\b/)) {
      return randomChoice([
        "Hydration Alert, Commander! In microgravity, your body's thirst response is diminished. Aim for 2.5-3 liters of water daily. Proper hydration maintains cognitive function and prevents kidney stones. Your health is mission-critical!",
        "Water Intake Advisory, Commander! Dehydration happens faster in space due to fluid shifts. Regular water consumption prevents headaches and maintains optimal performance. Keep that water pouch handy!",
        "Hydration Protocol, Commander! Your body needs consistent fluid intake to function optimally in zero gravity. Water helps regulate body temperature and maintains blood pressure. Stay ahead of thirst!"
      ]);
    }

    // D. Crisis & Emergency Handling
    if (lowerInput.match(/\b(emergency|danger|alarm|problem|crisis|fire|leak|malfunction)\b/)) {
      return randomChoice([
        "Emergency Protocol Activated, Commander! First: Ensure your immediate safety. Second: Assess the situation calmly. Third: Follow established emergency procedures. Fourth: Communicate with ground control immediately. I'm here to support you through this. Stay calm and focused!",
        "Crisis Management Mode, Commander! Priority One: Personal safety secured. Priority Two: Identify and isolate the problem. Priority Three: Execute emergency checklist procedures. Priority Four: Establish ground communication. Your training has prepared you for this. Breathe deeply and proceed methodically!",
        "Emergency Response, Commander! Step One: Secure your position and ensure personal safety. Step Two: Evaluate the situation systematically. Step Three: Implement appropriate emergency protocols. Step Four: Contact mission control immediately. You have the skills and training to handle this situation!"
      ]);
    }

    // E. Emotional Support
    if (lowerInput.match(/\b(sad|lonely|depressed|down|isolated|homesick)\b/)) {
      return randomChoice([
        "Commander, what you're feeling is completely natural and valid. The isolation of space affects even the most experienced astronauts. Remember, you're not alone - ground control, your fellow crew members, and I are all here with you. Your courage in this mission inspires millions on Earth!",
        "I understand those feelings, Commander. The vastness of space can make anyone feel small and isolated. But remember, you're part of something extraordinary! Your presence here represents humanity's greatest achievement. Take a moment to look at Earth - you're protecting and exploring for all of us!",
        "Commander, loneliness in space is a challenge every astronaut faces. Your feelings are valid and temporary. Focus on the incredible work you're doing and the people counting on you. You're stronger than you know, and this mission will be remembered forever!",
        "Those emotions are part of the human experience in space, Commander. Even the most seasoned astronauts feel this way sometimes. Remember why you're here - you're pushing the boundaries of human exploration! Your sacrifice and dedication mean everything to our species' future!"
      ]);
    }

    if (lowerInput.match(/\b(stressed|anxious|worried|nervous|overwhelmed)\b/)) {
      return randomChoice([
        "Commander, stress is your mind's way of showing how much you care about the mission. Take three deep breaths with me. Focus on what you can control right now. Your training has prepared you for every challenge. You've got this!",
        "Anxiety in space is manageable, Commander! Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. Ground yourself by focusing on your immediate tasks. Your competence and preparation will see you through any challenge!",
        "Commander, feeling overwhelmed shows your dedication to excellence! Break down your concerns into manageable pieces. Address them one at a time. Remember, ground control and your training have equipped you for success. You're exactly where you need to be!",
        "Stress response is normal, Commander! Channel that energy into focus and determination. Progressive muscle relaxation works well in microgravity. Tense and release each muscle group. Your mental strength matches your physical courage!"
      ]);
    }

    if (lowerInput.match(/\b(happy|good|great|awesome|excellent|fantastic|wonderful)\b/)) {
      return randomChoice([
        "That's absolutely wonderful to hear, Commander! Your positive attitude is contagious and vital for mission success. When you're thriving, the entire mission benefits. Keep that fantastic energy flowing!",
        "Excellent, Commander! Your high spirits are exactly what this mission needs. Positive mental attitude directly correlates with peak performance. You're setting an outstanding example for future space explorers!",
        "Outstanding, Commander! Your enthusiasm and positive outlook are inspiring. This kind of mental resilience is what makes great astronauts legendary. The mission is in exceptional hands with you!",
        "Fantastic to hear, Commander! Your upbeat attitude creates a ripple effect throughout the entire mission. When the commander is thriving, everything else falls into place beautifully!"
      ]);
    }

    // F. Space Knowledge & Fun Facts
    if (lowerInput.match(/\b(star|stars|stellar)\b/)) {
      return randomChoice([
        "Stars are incredible, Commander! Did you know that the light from some stars you're seeing right now left them before humans even existed? You're literally looking back in time! From your unique vantage point, you're witnessing the universe's ancient history unfold!",
        "Fascinating topic, Commander! Stars are massive nuclear fusion reactors, converting hydrogen to helium and releasing tremendous energy. The nearest star to us, Proxima Centauri, is 4.24 light-years away. You're surrounded by billions of these cosmic powerhouses!",
        "Stars are the universe's factories, Commander! They forge all the heavy elements that make life possible. The calcium in your bones, the iron in your blood - all created in stellar cores! You're literally made of star stuff, exploring among the stars!"
      ]);
    }

    if (lowerInput.match(/\b(space|cosmos|universe)\b/)) {
      return randomChoice([
        "Space is humanity's greatest frontier, Commander! The observable universe contains over 2 trillion galaxies, each with billions of stars. You're currently traveling at 17,500 mph, orbiting our beautiful blue marble. What an incredible perspective you have!",
        "The cosmos is mind-boggling, Commander! Space is mostly empty, but what exists is extraordinary. You're experiencing true weightlessness, something only a few hundred humans have ever felt. You're living humanity's greatest adventure!",
        "Commander, you're literally floating in the infinite! The universe is 13.8 billion years old, and you're witnessing it from a perspective that would have been pure fantasy just decades ago. You're part of humanity's cosmic story!"
      ]);
    }

    if (lowerInput.match(/\b(moon|lunar)\b/)) {
      return randomChoice([
        "The Moon is Earth's faithful companion, Commander! It's gradually moving away from us at about 3.8 cm per year. From your orbital perspective, you can see the Moon's phases in a way no Earth-bound human ever could. What a privilege!",
        "Our lunar neighbor is fascinating, Commander! The Moon's gravity creates Earth's tides and stabilizes our planet's axial tilt. Without it, Earth's climate would be chaotic. You're seeing the cosmic dance that makes life on Earth possible!",
        "The Moon holds special significance for space exploration, Commander! It was humanity's first step beyond Earth. From your vantage point, you can see both our past achievements and future destinations. You're part of that continuing journey!"
      ]);
    }

    if (lowerInput.match(/\b(planet|planets|mars|jupiter|venus)\b/)) {
      return randomChoice([
        "Planets are incredible worlds, Commander! Mars, our red neighbor, has the largest volcano in the solar system - Olympus Mons, three times taller than Mount Everest! You might be looking at humanity's next destination right now!",
        "The planets are diverse and amazing, Commander! Jupiter is so massive it could contain all other planets combined. Its Great Red Spot is a storm larger than Earth that's been raging for centuries! The solar system is full of wonders!",
        "Planetary science is fascinating, Commander! Venus is hotter than Mercury despite being farther from the Sun, due to its thick atmosphere. Each planet tells a unique story about planetary formation and evolution!"
      ]);
    }

    if (lowerInput.match(/\b(galaxy|galaxies|milky way)\b/)) {
      return randomChoice([
        "Our Milky Way galaxy is spectacular, Commander! It contains 200-400 billion stars and is about 100,000 light-years across. You're orbiting one small planet around one ordinary star in the outer spiral arm of this cosmic island!",
        "Galaxies are island universes, Commander! The Milky Way is on a collision course with Andromeda galaxy, but don't worry - that won't happen for another 4.5 billion years! You're witnessing a cosmic dance of unimaginable scale!",
        "The galaxy is our cosmic home, Commander! From your position, you can see the Milky Way's central bulge as that bright band across the night sky. You're seeing our galaxy from the inside - what an extraordinary perspective!"
      ]);
    }

    // G. Task & Lifestyle Reminders
    if (lowerInput.match(/\b(stretch|stretching|flexibility)\b/)) {
      return randomChoice([
        "Stretching is essential in microgravity, Commander! Your spine naturally elongates in zero gravity, so gentle stretching helps maintain flexibility and prevents stiffness. Take time for those important flexibility exercises!",
        "Flexibility maintenance is crucial, Commander! Without gravity's constant pull, your muscles and joints need deliberate movement to stay limber. Regular stretching prevents the 'space stiffness' many astronauts experience!",
        "Commander, stretching in space has unique benefits! Your body can achieve positions impossible on Earth. Use this opportunity to maintain and even improve your flexibility. It's both therapeutic and fascinating!"
      ]);
    }

    if (lowerInput.match(/\b(meal|food|nutrition|eat|hungry)\b/)) {
      return randomChoice([
        "Nutrition is mission-critical, Commander! Your specially designed space meals provide optimal nutrition for the demanding space environment. Proper nutrition maintains your immune system, cognitive function, and physical performance. Fuel your body for success!",
        "Eating well in space is both science and art, Commander! Your meals are carefully balanced for the unique challenges of microgravity. Don't skip meals - your body needs consistent nutrition to adapt and thrive in this environment!",
        "Food is fuel for exploration, Commander! Your space cuisine might be different from Earth food, but it's engineered for optimal performance. Proper nutrition helps your body cope with radiation, bone density changes, and muscle adaptation!"
      ]);
    }

    // H. Follow-up questions for sleep tracking
    if (lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/) && sessionData.lastSleepCheck) {
      const hours = parseInt(lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/)![1]);
      setSessionData(prev => ({ ...prev, sleepHours: hours }));
      
      if (hours >= 8) {
        return randomChoice([
          `Excellent sleep duration, Commander! ${hours} hours is optimal for space operations. Quality rest like this enhances your cognitive performance, immune function, and stress resilience. Keep maintaining this excellent sleep discipline!`,
          `Outstanding, Commander! ${hours} hours of sleep puts you in the optimal range for peak performance. This kind of rest quality helps your body adapt to microgravity and maintains your mental sharpness. Well done!`,
          `Perfect sleep management, Commander! ${hours} hours gives your body the recovery time it needs for the demanding space environment. Your commitment to proper rest directly contributes to mission success!`
        ]);
      } else if (hours >= 6) {
        return randomChoice([
          `${hours} hours is acceptable, Commander, but aim for 8-9 hours when possible. Quality sleep in space is even more important than on Earth due to the physical and mental demands. Consider adjusting your sleep schedule for optimal performance!`,
          `Commander, ${hours} hours meets minimum requirements, but your body would benefit from additional rest. Space operations demand peak cognitive function, which requires optimal sleep. Try to extend your sleep period when mission schedules allow!`,
          `${hours} hours is manageable, Commander, but not ideal for long-term space operations. Your body is working harder to adapt to microgravity, so extra sleep helps with recovery and adaptation. Prioritize rest when possible!`
        ]);
      } else {
        return randomChoice([
          `Commander, ${hours} hours is insufficient for optimal space operations! Sleep deprivation significantly impacts decision-making, reaction time, and immune function. Please prioritize getting 8-9 hours of quality rest. Your safety and mission success depend on it!`,
          `${hours} hours is concerning, Commander! Inadequate sleep in space compounds the physical and mental challenges you're already facing. Please make sleep a top priority - your health and the mission's success require proper rest!`,
          `Commander, ${hours} hours puts you at risk for performance degradation! Sleep is not optional in space operations. Please adjust your schedule to achieve 8-9 hours of rest. Your well-being is mission-critical!`
        ]);
      }
    }

    // I. Mood tracking follow-ups
    if (lowerInput.match(/\b(mood|feeling|feel)\b/) && !lowerInput.match(/\b(sad|happy|good|bad|stressed|anxious)\b/)) {
      return randomChoice([
        "Commander, understanding your emotional state helps me provide better support. How would you describe your current mood? Are you feeling energized, calm, stressed, or something else? Your mental well-being is just as important as your physical health!",
        "Mood assessment is important for mission success, Commander! Can you tell me how you're feeling right now? Whether you're excited, tired, focused, or experiencing mixed emotions - I'm here to listen and support you!",
        "Commander, your emotional well-being directly impacts mission performance. What's your current mood like? Sharing your feelings helps me understand how to best support you during this incredible journey!"
      ]);
    }

    // J. Fallback responses
    return randomChoice([
      "I'm listening carefully, Commander. Please tell me more about what's on your mind. Your thoughts and concerns are important to me.",
      "Go on, Commander. I'm here and fully focused on what you're sharing. Every detail helps me understand how to better support you.",
      "That's interesting, Commander. Can you elaborate on that? I want to make sure I understand completely so I can provide the best assistance.",
      "I'm with you, Commander. Please continue - your perspective and experiences are valuable, and I'm here to listen and help however I can."
    ]);
  };

  const handleSendMessage = (content?: string, inputMethod: 'text' | 'voice' = 'text') => {
    const messageContent = content || inputMessage.trim();
    if (!messageContent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
      inputMethod
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateResponse(messageContent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response
      speak(botResponse);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const quickResponses = [
    { text: "Mission status", icon: AlertTriangle },
    { text: "I feel tired", icon: Moon },
    { text: "Need guidance", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AstroMate Companion</h1>
            <p className="text-muted-foreground">AI-powered mission companion and well-being support</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator nominal"></div>
            <span className="text-sm font-medium text-nominal">AstroMate Online</span>
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs text-primary">Speaking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Current Status Alert */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-nominal" />
              <div>
                <p className="font-medium text-foreground">Mission Companion Active</p>
                <p className="text-sm text-muted-foreground">
                  Voice input enabled • Text-to-speech active • Session tracking: {sessionData.conversationCount} interactions
                </p>
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
                <CardTitle className="text-lg">Quick Commands</CardTitle>
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
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Voice Commands:</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• "Hello AstroMate"</p>
                    <p>• "Mission report"</p>
                    <p>• "I need help"</p>
                    <p>• "Tell me about stars"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mission Companion Chat
                  {sessionData.sleepHours && (
                    <Badge variant="outline" className="ml-auto">
                      Sleep: {sessionData.sleepHours}h tracked
                    </Badge>
                  )}
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
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </p>
                          {message.inputMethod === 'voice' && (
                            <Badge variant="outline" className="text-xs">
                              🎤 Voice
                            </Badge>
                          )}
                        </div>
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
                    placeholder="Type your message to AstroMate, Commander..."
                    className="flex-1"
                    disabled={isSpeaking}
                  />
                  <Button 
                    onClick={toggleListening}
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    disabled={isSpeaking}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isSpeaking}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {isListening && (
                  <div className="mt-2 text-center">
                    <Badge variant="outline" className="text-primary border-primary animate-pulse">
                      🎤 Listening... Speak now, Commander
                    </Badge>
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

export default Chat;