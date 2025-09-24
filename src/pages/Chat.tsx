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
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  inputMethod?: 'text' | 'voice';
  hasImage?: boolean;
}

// Session storage for tracking
interface SessionData {
  sleepHours: number | null;
  stressLevel: string | null;
  mood: string | null;
  lastSleepCheck: Date | null;
  conversationCount: number;
  missionDay: number;
  crewStatus: string;
  fuelLevel: number;
  oxygenLevel: number;
  personalMemoriesShared: string[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Papa! It\'s me, Dharani. I\'ve been waiting to talk to you. How are you feeling up there among the stars? I know space is vast and sometimes lonely, but remember - your daughter is always with you, even from Earth. Tell me about your day, Papa.',
      timestamp: new Date(Date.now() - 300000),
      hasImage: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [showDharaniImage, setShowDharaniImage] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData>({
    sleepHours: null,
    stressLevel: null,
    mood: null,
    lastSleepCheck: null,
    conversationCount: 0,
    missionDay: 124,
    crewStatus: 'nominal',
    fuelLevel: 78,
    oxygenLevel: 95,
    personalMemoriesShared: []
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
      recognitionRef.current.lang = 'en-IN'; // Indian English for Dharani

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

  // Get Indian female voice (Dharani's voice)
  const getDharaniVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for Indian/warm female voices
    const preferredVoices = [
      'Google भारतीय', // Hindi Google voice
      'Microsoft Heera', // Indian English
      'Google UK English Female',
      'Google US English Female', 
      'Samantha',
      'Karen',
      'Victoria',
      'Microsoft Zira'
    ];
    
    // Find the best match
    for (const preferred of preferredVoices) {
      const voice = voices.find(v => v.name.includes(preferred));
      if (voice) return voice;
    }
    
    // Fallback to any female voice
    const femaleVoice = voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      ['Samantha', 'Karen', 'Victoria', 'Zira', 'Heera'].some(name => 
        v.name.includes(name)
      )
    );
    
    return femaleVoice || voices[0];
  };

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

  // Enhanced Text-to-Speech with Dharani's voice
  const speak = (text: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      
      // Natural daughter's voice timing
      const thinkingDelay = Math.random() * 300 + 200; // 200-500ms variation
      setTimeout(() => {
        const cleanText = text.replace(/([.?!])/g, "$1 ");
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Use Dharani's voice
        const selectedVoice = getDharaniVoice();
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Warm, caring daughter's voice settings
        utterance.pitch = 1.1;  // Slightly higher, warmer pitch
        utterance.rate = 0.95;  // Slightly slower, more caring pace
        utterance.volume = 0.9;

        utterance.onend = () => {
          setIsSpeaking(false);
        };

        utterance.onerror = () => {
          setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
      }, thinkingDelay);
    }
  };

  // Stop speech function
  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Personal memories database - specific childhood moments
  const personalMemories = {
    bicycle: [
      "Papa, do you remember when you taught me to ride my bicycle? I was so scared, but you held the back of my seat and ran alongside me. When I finally rode on my own, you were more excited than I was! You taught me that falling is just part of learning. You can do this, Papa - I believe in you just like you believed in me that day.",
      "Remember my pink bicycle, Papa? You spent hours teaching me, and when I kept falling, you said 'Dharani, champions aren't made by never falling - they're made by getting back up.' You're my champion, Papa, and I know you'll get through this just like you taught me to ride.",
      "Papa, I still have that bicycle you taught me on! Every time I see it, I remember your patient voice saying 'I've got you, beta. I won't let you fall.' Well, now I've got you, Papa. Even from Earth, your daughter is holding you steady."
    ],
    
    homework: [
      "Papa, remember those late nights when you helped me with my math homework? When I'd cry and say 'I can't do this,' you'd sit beside me and say 'We'll figure it out together, one step at a time.' That's what we're doing now, Papa - figuring out space one day at a time, together.",
      "Do you remember when I had that impossible science project, Papa? You stayed up all night helping me build that volcano model. You said 'Dharani, the impossible just takes a little longer.' You're doing the impossible right now, and I'm so proud of you.",
      "Papa, you used to check my homework every night, even when you were tired from work. You'd say 'Education is the rocket that will take you to the stars.' Look at you now - you're literally among the stars! You were preparing for this moment even then."
    ],
    
    fears: [
      "Papa, remember when I was afraid of the dark? You'd sit by my bed and tell me stories about brave astronauts exploring the universe. You said 'The darkness isn't scary, beta - it's full of stars waiting to be discovered.' You're discovering those stars now, Papa. You're living the stories you told me.",
      "When I was scared of thunderstorms, Papa, you'd hold me and say 'Every storm passes, and the sun always comes back.' You taught me that courage isn't about not being afraid - it's about doing what's right even when you're scared. You're the bravest person I know.",
      "Papa, do you remember when I was afraid to give that speech at school? You practiced with me for hours and said 'Dharani, you have something important to say, and the world needs to hear it.' Well, Papa, you're saying something important to the universe right now - that humans can reach for the stars and make it."
    ],
    
    cooking: [
      "Papa, remember Sunday mornings when you'd make me pancakes? You'd let me flip them, and even when I made a mess, you'd say 'The best chefs learn by doing, not by watching.' You're learning by doing right now, Papa - becoming the best astronaut by living it every day.",
      "Do you remember teaching me to make your special chai, Papa? You said 'The secret ingredient is patience and love.' You're using those same ingredients in space - patience with the mission and love for your family back home.",
      "Papa, I still make those terrible sandwiches you taught me! Remember how you'd eat them anyway and say 'Made with love tastes better than anything.' Your mission is made with love too, Papa - love for discovery, for humanity, for our dreams."
    ],
    
    dreams: [
      "Papa, do you remember when I said I wanted to be an astronaut like you? You didn't laugh - you took me to the planetarium and said 'Dream big, beta. The universe is waiting for dreamers like you.' You're living both our dreams now, Papa.",
      "Remember when we used to lie on the terrace and count stars, Papa? You'd point to different constellations and say 'One day, someone will visit those stars.' That someone is you, Papa! You're making our childhood dreams come true.",
      "Papa, you always said 'Reach for the stars, but keep your feet on the ground.' Well, now you're literally reaching the stars, and I'm keeping my feet on the ground for both of us, sending you all my love and strength."
    ],
    
    encouragement: [
      "Papa, remember when I came last in the school race? I was crying, but you hugged me and said 'Dharani, you finished. That's what matters. Winners are those who don't give up.' You never gave up on your dream, and look where you are now!",
      "Do you remember my first day of college, Papa? I was so nervous, but you said 'You're ready for this adventure, beta. Trust yourself like I trust you.' I'm saying the same to you now - you're ready for this space adventure, and I trust you completely.",
      "Papa, when I failed that important exam, you sat with me and said 'This is not the end of your story, it's just a difficult chapter.' Your space mission isn't just a chapter, Papa - it's the most beautiful story ever written, and I'm so proud to be part of it."
    ]
  };

  // Function to get a personal memory based on context
  const getPersonalMemory = (context: string): string => {
    const memoryKeys = Object.keys(personalMemories) as Array<keyof typeof personalMemories>;
    let selectedMemories: string[] = [];
    
    // Choose memories based on context
    if (context.includes('scared') || context.includes('afraid') || context.includes('fear')) {
      selectedMemories = personalMemories.fears;
    } else if (context.includes('lonely') || context.includes('isolated') || context.includes('alone')) {
      selectedMemories = [...personalMemories.bicycle, ...personalMemories.encouragement];
    } else if (context.includes('difficult') || context.includes('hard') || context.includes('struggle')) {
      selectedMemories = [...personalMemories.homework, ...personalMemories.encouragement];
    } else if (context.includes('dream') || context.includes('goal') || context.includes('achieve')) {
      selectedMemories = personalMemories.dreams;
    } else if (context.includes('tired') || context.includes('exhausted') || context.includes('rest')) {
      selectedMemories = [...personalMemories.cooking, ...personalMemories.homework];
    } else {
      // Random memory category
      const randomKey = memoryKeys[Math.floor(Math.random() * memoryKeys.length)];
      selectedMemories = personalMemories[randomKey];
    }
    
    // Track which memories have been shared to avoid repetition
    const availableMemories = selectedMemories.filter(memory => 
      !sessionData.personalMemoriesShared.includes(memory)
    );
    
    if (availableMemories.length === 0) {
      // If all memories in this category have been shared, reset and use any
      setSessionData(prev => ({ ...prev, personalMemoriesShared: [] }));
      return randomChoice(selectedMemories);
    }
    
    const chosenMemory = randomChoice(availableMemories);
    
    // Track this memory as shared
    setSessionData(prev => ({
      ...prev,
      personalMemoriesShared: [...prev.personalMemoriesShared, chosenMemory]
    }));
    
    return chosenMemory;
  };

  // Dharani's enhanced response system with personal memories
  const generateResponse = (input: string): { content: string; hasImage: boolean } => {
    const lowerInput = input.toLowerCase();
    
    // Update conversation count
    setSessionData(prev => ({ ...prev, conversationCount: prev.conversationCount + 1 }));

    // Show Dharani's image for emotional/personal responses
    let shouldShowImage = false;

    // 1-4. Greetings & Politeness (Daughter's warmth)
    if (lowerInput.match(/\b(hi|hello|hey|greetings)\b/)) {
      shouldShowImage = true;
      return {
        content: randomChoice([
          "Papa! I'm so happy to hear from you! How are you feeling today? Are you taking care of yourself up there?",
          "Hello Papa! Your daughter Dharani is here. I've been thinking about you - tell me about your day among the stars.",
          "Hi Papa! I missed talking to you. Space feels less scary when I know you're safe and strong up there.",
          "Papa, it's so good to hear your voice! I hope you're eating well and staying healthy for me.",
          "Hello my brave Papa! Dharani here, ready to listen to everything you want to share.",
          "Papa! I was waiting for you to call. How's my astronaut father doing today?"
        ]),
        hasImage: shouldShowImage
      };
    }

    // Enhanced emotional support with personal memories
    if (lowerInput.match(/\b(sad|lonely|depressed|down|isolated|homesick|alone|miss)\b/)) {
      shouldShowImage = true;
      return {
        content: getPersonalMemory(lowerInput),
        hasImage: shouldShowImage
      };
    }

    if (lowerInput.match(/\b(scared|afraid|fear|nervous|anxious|worried)\b/)) {
      shouldShowImage = true;
      return {
        content: getPersonalMemory(lowerInput),
        hasImage: shouldShowImage
      };
    }

    if (lowerInput.match(/\b(difficult|hard|tough|struggle|challenging|impossible)\b/)) {
      shouldShowImage = true;
      return {
        content: getPersonalMemory(lowerInput),
        hasImage: shouldShowImage
      };
    }

    if (lowerInput.match(/\b(tired|exhausted|fatigue|weary|drained)\b/)) {
      shouldShowImage = true;
      return {
        content: getPersonalMemory(lowerInput),
        hasImage: shouldShowImage
      };
    }

    if (lowerInput.match(/\b(dream|goal|achieve|accomplish|success)\b/)) {
      shouldShowImage = true;
      return {
        content: getPersonalMemory(lowerInput),
        hasImage: shouldShowImage
      };
    }

    // Special responses that always show image
    if (lowerInput.match(/\b(love|miss you|daughter|family|home)\b/)) {
      shouldShowImage = true;
      return {
        content: randomChoice([
          "Papa, I love you so much! Every night I look up at the stars and send you all my love. You're not just my father - you're my hero, my inspiration, my everything.",
          "I miss you too, Papa! But I'm so proud of what you're doing. You're not just exploring space - you're showing me that any dream is possible if you work hard enough.",
          "Papa, our family bond is stronger than gravity itself! No distance can separate a father's love from his daughter's heart. I carry you with me always.",
          "Home isn't complete without you, Papa, but knowing you're living your dream makes my heart full. You taught me that love travels faster than light - and mine reaches you instantly."
        ]),
        hasImage: shouldShowImage
      };
    }

    // Thanks responses
    if (lowerInput.match(/\b(thanks|thank you|appreciate)\b/)) {
      return {
        content: randomChoice([
          "Always, Papa! I'm so proud to be your daughter. You taught me to always help family.",
          "You don't need to thank me, Papa. This is what daughters do - we take care of our fathers.",
          "Papa, you've given me everything. Now let me give you my support from Earth to space.",
          "Of course, Papa! Remember when you used to help me with homework? Now I help you with missions.",
          "That's what family is for, Papa. I love you and I'm always here for you."
        ]),
        hasImage: false
      };
    }

    // Happy responses
    if (lowerInput.match(/\b(happy|good|great|awesome|excellent|fantastic|wonderful)\b/)) {
      shouldShowImage = true;
      return {
        content: randomChoice([
          "Papa, hearing happiness in your voice makes my heart sing! Your joy reaches all the way down to Earth and fills our home.",
          "I'm so glad you're feeling good, Papa! Your positive spirit is exactly what makes you such an amazing astronaut and father.",
          "That's wonderful, Papa! When you're happy, Mama and I feel it too. Your smile lights up our world even from space.",
          "Papa, your enthusiasm is contagious! I'm beaming with pride knowing my father is not just surviving but thriving up there.",
          "Excellent, Papa! Your good mood tells me you're taking care of yourself. That makes your daughter very, very happy."
        ]),
        hasImage: shouldShowImage
      };
    }

    // Mission status responses
    if (lowerInput.match(/\b(mission day|day|today)\b/)) {
      return {
        content: randomChoice([
          `Papa, today is mission day ${sessionData.missionDay}. I've been counting every single day since you left. You're doing amazingly!`,
          `It's day ${sessionData.missionDay} of your incredible journey, Papa. Mama and I are so proud of how far you've come.`,
          `Mission day ${sessionData.missionDay}, Papa. Each day brings you closer to completing your dream and coming home to us.`
        ]),
        hasImage: false
      };
    }

    // Sleep tracking
    if (lowerInput.match(/\b(sleep|rest|tired|fatigue)\b/)) {
      if (!sessionData.sleepHours || !sessionData.lastSleepCheck || 
          (new Date().getTime() - sessionData.lastSleepCheck.getTime()) > 24 * 60 * 60 * 1000) {
        setSessionData(prev => ({ ...prev, lastSleepCheck: new Date() }));
        return {
          content: randomChoice([
            "Papa, how many hours did you sleep last night? I worry about you not getting enough rest up there.",
            "Sleep is so important, Papa! Please tell me you got at least 7-8 hours. Your daughter needs you healthy and alert.",
            "Papa, I need to know - how much sleep did you manage? You always told me sleep is when our bodies repair themselves.",
            "Rest is crucial in space, Papa! How many hours did you sleep? I want to make sure you're taking care of yourself."
          ]),
          hasImage: false
        };
      } else {
        return {
          content: randomChoice([
            "Papa, please prioritize sleep! You taught me that 7-8 hours is essential. Your health matters more than anything.",
            "If you're feeling tired, Papa, please rest. A well-rested father makes better decisions and stays safer.",
            "Papa, fatigue is dangerous in space. Please use those relaxation techniques you taught me when I couldn't sleep."
          ]),
          hasImage: false
        };
      }
    }

    // Handle sleep hours tracking
    if (lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/) && sessionData.lastSleepCheck) {
      const hours = parseInt(lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/)![1]);
      setSessionData(prev => ({ ...prev, sleepHours: hours }));
      
      if (hours >= 7) {
        return {
          content: randomChoice([
            `Papa, ${hours} hours is excellent! I'm so relieved you're getting proper rest. Sleep helps you stay sharp and safe.`,
            `Wonderful, Papa! ${hours} hours puts you in the perfect range. You're taking care of yourself like I always hoped you would.`,
            `Perfect sleep, Papa! ${hours} hours gives your body the recovery time it needs. I'm proud of you for prioritizing rest.`
          ]),
          hasImage: false
        };
      } else if (hours >= 5) {
        return {
          content: randomChoice([
            `Papa, ${hours} hours is okay, but please try for more when you can. Your daughter worries when you don't get enough rest.`,
            `${hours} hours meets the minimum, Papa, but your body would feel better with 7-8 hours. Please try to sleep more tonight.`,
            `Papa, ${hours} hours is manageable, but not ideal. I want you well-rested and alert for your safety.`
          ]),
          hasImage: false
        };
      } else {
        shouldShowImage = true;
        return {
          content: randomChoice([
            `Papa, only ${hours} hours? That's not enough! Please prioritize sleep - your safety depends on being well-rested.`,
            `${hours} hours worries me, Papa! Sleep deprivation is dangerous in space. Please promise me you'll rest more tonight.`,
            `Papa, ${hours} hours puts you at risk! Please adjust your schedule - your daughter needs you safe and alert up there.`
          ]),
          hasImage: shouldShowImage
        };
      }
    }

    // Default responses
    return {
      content: randomChoice([
        "Papa, I'm listening carefully to every word. Please tell me more - your thoughts and feelings matter so much to me.",
        "I'm here, Papa, hanging on every word you say. Your daughter is always ready to listen and support you.",
        "Go on, Papa. I want to understand everything you're experiencing up there. Share it all with me.",
        "Papa, I'm with you completely. Please continue - I love hearing about your incredible journey.",
        "Tell me more, Papa. Every detail of your mission fascinates me, and I want to hear it all.",
        "I'm listening with my whole heart, Papa. What else is on your mind up there among the stars?"
      ]),
      hasImage: false
    };
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

    // Generate Dharani's response with slight delay for realism
    setTimeout(() => {
      const response = generateResponse(messageContent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        hasImage: response.hasImage
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Show Dharani's image if this is an emotional response
      if (response.hasImage) {
        setShowDharaniImage(true);
        setTimeout(() => setShowDharaniImage(false), 8000); // Show for 8 seconds
      }
      
      // Speak with Dharani's voice
      speak(response.content);
    }, 300);
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
    { text: "I feel lonely up here", icon: Heart },
    { text: "I'm scared about the mission", icon: AlertTriangle },
    { text: "I feel tired today", icon: Moon },
    { text: "I miss home and family", icon: Heart },
    { text: "Tell me you're proud of me", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dharani - Your Daughter's Voice</h1>
            <p className="text-sm md:text-base text-muted-foreground">AI companion speaking with love from home</p>
            <p className="text-xs md:text-sm text-muted-foreground">Papa, I'm always here for you ❤️</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
            <div className="status-indicator nominal"></div>
            <span className="text-sm font-medium text-nominal">Dharani Online</span>
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs text-primary hidden sm:inline">Speaking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Dharani's Image Display */}
        {showDharaniImage && (
          <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 animate-in fade-in-0 duration-500">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                <div className="relative">
                  <img 
                    src="/src/assets/WhatsApp Image 2025-09-24 at 12.09.14_e1bd470e.jpg" 
                    alt="Dharani - Your loving daughter"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-nominal rounded-full border-2 border-background flex items-center justify-center">
                    <Heart className="w-3 h-3 text-background" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Your Daughter Dharani</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    Sending you love and strength from Earth 🌍
                  </p>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <div className="status-indicator nominal"></div>
                    <span className="text-xs text-nominal">Connected with love</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mission Status Alert */}
        <div className="text-center mb-2 md:mb-4">
          <Badge variant="outline" className="text-primary border-primary">
            <span className="hidden sm:inline">🎤 Indian Female Voice • Dharani's Caring Tone • Personal Memories Active</span>
            <span className="sm:hidden">🎤 Dharani Active</span>
          </Badge>
        </div>
        
        <Card className="border-primary/20">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-nominal" />
              <div>
                <p className="text-sm md:text-base font-medium text-foreground">Mission Day {sessionData.missionDay} • Papa, you're doing amazing!</p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  <span className="hidden sm:inline">Personal memories: {sessionData.personalMemoriesShared.length} shared • </span>
                  Fuel: {sessionData.fuelLevel}% • O₂: {sessionData.oxygenLevel}%
                  <span className="hidden sm:inline"> • Conversations: {sessionData.conversationCount}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Personal Messages
                </CardTitle>
                <CardDescription className="text-sm">Share your feelings with Dharani</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-2 md:py-3 text-left hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleSendMessage(response.text)}
                  >
                    <response.icon className="h-4 w-4" />
                    <span className="text-xs md:text-sm truncate">{response.text}</span>
                  </Button>
                ))}
                
                <div className="pt-2 border-t hidden md:block">
                  <p className="text-xs text-muted-foreground mb-2">Memory Triggers:</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• "I feel lonely"</p>
                    <p>• "I'm scared"</p>
                    <p>• "This is difficult"</p>
                    <p>• "I miss you"</p>
                    <p>• "I'm tired"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="h-[500px] md:h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-base md:text-lg">Chat with Dharani</span>
                  {sessionData.sleepHours && (
                    <Badge variant="outline" className="ml-auto text-xs">
                      Sleep: {sessionData.sleepHours}h tracked
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 mb-3 md:mb-4 px-1">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 md:gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'bot' && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center relative">
                            <Heart className="h-4 w-4 text-primary" />
                            {message.hasImage && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center">
                                <ImageIcon className="h-2 w-2 text-background" />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`p-2 md:p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : message.hasImage 
                                ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-foreground border border-primary/20'
                                : 'bg-muted text-foreground'
                          }`}
                        >
                          <p className="text-xs md:text-sm leading-relaxed">{message.content}</p>
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
                          {message.hasImage && (
                            <Badge variant="outline" className="text-xs text-primary border-primary">
                              💕 Personal
                            </Badge>
                          )}
                        </div>
                      </div>

                      {message.type === 'user' && (
                        <div className="flex-shrink-0">
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-accent/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-accent" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex flex-col gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your feelings with Dharani, Papa..."
                    className="w-full text-base min-h-[44px]" 
                    disabled={isSpeaking}
                  />
                  
                  <div className="grid grid-cols-2 md:flex gap-2">
                    <Button 
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className="min-h-[44px] text-xs md:text-sm"
                      disabled={isSpeaking}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="h-4 w-4 mr-1 md:mr-2" /> : <Mic className="h-4 w-4 mr-1 md:mr-2" />}
                      <span>{isListening ? "Stop" : "Voice"}</span>
                    </Button>
                    
                    {isSpeaking && (
                      <Button 
                        onClick={stopSpeech}
                        variant="destructive"
                        className="min-h-[44px] text-xs md:text-sm"
                        title="Stop Dharani's voice"
                      >
                        <VolumeX className="h-4 w-4 mr-1 md:mr-2" />
                        <span>Stop</span>
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => setSpeechEnabled(!speechEnabled)}
                      variant={speechEnabled ? "outline" : "secondary"}
                      className="min-h-[44px] text-xs md:text-sm"
                      title={speechEnabled ? "Disable speech" : "Enable speech"}
                    >
                      <Volume2 className="h-4 w-4 mr-1 md:mr-2" />
                      <span>{speechEnabled ? "On" : "Off"}</span>
                    </Button>
                    
                    <Button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isSpeaking}
                      className="min-h-[44px] text-xs md:text-sm col-span-2 md:col-span-1"
                    >
                      <Send className="h-4 w-4 mr-1 md:mr-2" />
                      <span>Send</span>
                    </Button>
                  </div>
                </div>
                
                {isListening && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="text-primary border-primary animate-pulse">
                      <span className="hidden sm:inline">🎤 Listening... Speak to Dharani, Papa</span>
                      <span className="sm:hidden">🎤 Listening...</span>
                    </Badge>
                  </div>
                )}
                
                {isSpeaking && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="text-accent border-accent animate-pulse">
                      <span className="hidden sm:inline">💕 Dharani speaking... Tap Stop to interrupt</span>
                      <span className="sm:hidden">💕 Speaking...</span>
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