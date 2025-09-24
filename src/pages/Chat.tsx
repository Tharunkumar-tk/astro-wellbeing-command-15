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
  VolumeX
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
  missionDay: number;
  crewStatus: string;
  fuelLevel: number;
  oxygenLevel: number;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Greetings, Commander! AstroBot here, your dedicated mission companion. You can call me Buddy, Sam, Samantha, or just Bot if you prefer. I\'m here to support your well-being and assist with any mission-related needs. How can I help you today?',
      timestamp: new Date(Date.now() - 300000)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [sessionData, setSessionData] = useState<SessionData>({
    sleepHours: null,
    stressLevel: null,
    mood: null,
    lastSleepCheck: null,
    conversationCount: 0,
    missionDay: 124,
    crewStatus: 'nominal',
    fuelLevel: 78,
    oxygenLevel: 95
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

  // Get Google Samantha voice or fallback to best female voice
  const getSamanthaVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Priority order for female voices
    const preferredVoices = [
      'Samantha',
      'Google UK English Female', 
      'Google US English Female',
      'Microsoft Zira',
      'Microsoft Hazel',
      'Alex',
      'Karen',
      'Victoria'
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
      ['Samantha', 'Karen', 'Victoria', 'Zira', 'Hazel'].some(name => 
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

  // Enhanced Text-to-Speech with Samantha voice and quick output
  const speak = (text: string) => {
    if ('speechSynthesis' in window && speechEnabled) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      setIsSpeaking(true);
      
      // Quick output - minimal delay
      const thinkingDelay = Math.random() * 200 + 100; // 100-300ms variation
      setTimeout(() => {
        // Clean text for quick reading
        const cleanText = text.replace(/([.?!])/g, "$1 ");
        
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Use Samantha voice
        const selectedVoice = getSamanthaVoice();
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Quick reading settings
        utterance.pitch = 1.05; // Natural female pitch
        utterance.rate = 1.2;   // Fast reading
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

  // Enhanced rule-based response system with 50+ rules
  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Update conversation count
    setSessionData(prev => ({ ...prev, conversationCount: prev.conversationCount + 1 }));

    // 1-4. Greetings & Politeness
    if (lowerInput.match(/\b(hi|hello|hey|greetings)\b/)) {
      return randomChoice([
        "Hello there, Commander! Ready to tackle today's mission objectives?",
        "Greetings, Commander! All systems are nominal… and I'm here to assist you.",
        "Good to hear from you, Commander! How can your buddy AstroBot support you today?",
        "Commander, welcome back! Your dedication to the mission is truly inspiring.",
        "Well hello, Commander! Hope you're having a stellar day up there.",
        "Hey there, Commander! Always a pleasure to chat with you."
      ]);
    }

    if (lowerInput.match(/\b(thanks|thank you|appreciate)\b/)) {
      return randomChoice([
        "You're very welcome, Commander! It's truly my honor to serve alongside you.",
        "Always happy to help, Commander! That's what mission companions are for, after all.",
        "My pleasure, Commander! Your success is our mission's success.",
        "Aww, you're so welcome! That really means a lot to me, Commander.",
        "Of course, Commander! I'm just glad I could help out."
      ]);
    }

    if (lowerInput.match(/\b(sorry|apologize)\b/)) {
      return randomChoice([
        "Oh, no need to apologize, Commander! We're all learning and adapting up here.",
        "Commander, there's absolutely nothing to be sorry about. We're in this together.",
        "Don't worry about it, Commander! Let's just focus on the mission ahead.",
        "Hey, no worries at all! These things happen in space operations."
      ]);
    }

    if (lowerInput.match(/\b(ok|okay|understood|roger|copy)\b/)) {
      return randomChoice([
        "Excellent, Commander! Glad we're on the same page.",
        "Perfect, Commander! Mission coordination at its finest.",
        "Outstanding, Commander! Clear communication is key to success."
      ]);
    }

    // 5-10. Mission Day / Progress
    if (lowerInput.match(/\b(mission day|day|today)\b/)) {
      return randomChoice([
        `Commander, today is mission day ${sessionData.missionDay}. We're making excellent progress!`,
        `Mission day ${sessionData.missionDay}, Commander. All systems performing nominally.`,
        `Day ${sessionData.missionDay} of our incredible journey, Commander. You're doing outstanding work!`
      ]);
    }

    if (lowerInput.match(/\b(days left|remaining|how long)\b/)) {
      const daysLeft = Math.max(1, 200 - sessionData.missionDay);
      return randomChoice([
        `Approximately ${daysLeft} days remain in our current mission phase, Commander.`,
        `We have about ${daysLeft} days left, Commander. Time flies when you're exploring space!`,
        `${daysLeft} days remaining, Commander. Every day brings new discoveries!`
      ]);
    }

    if (lowerInput.match(/\b(mission progress|progress|status)\b/)) {
      const progress = Math.round((sessionData.missionDay / 200) * 100);
      return randomChoice([
        `Mission progress is at ${progress}%, Commander. Exceptional performance across all metrics!`,
        `We are ${progress}% complete with our mission objectives, Commander. Outstanding work!`,
        `Progress report: ${progress}% mission completion. You're exceeding all expectations, Commander!`
      ]);
    }

    if (lowerInput.match(/\b(challenge today|problem|issue)\b/)) {
      return randomChoice([
        "Today we encountered minor solar radiation fluctuations, but our shielding performed perfectly, Commander.",
        "We had a brief communication delay with ground control earlier, but all systems recovered beautifully.",
        "Minor micro-meteorite activity detected, but our hull integrity remains at 100%, Commander."
      ]);
    }

    if (lowerInput.match(/\b(next challenge|tomorrow|upcoming)\b/)) {
      return randomChoice([
        "Tomorrow we expect routine system maintenance and a possible EVA preparation, Commander.",
        "Upcoming challenges include orbital adjustment maneuvers and equipment calibration.",
        "Next phase involves advanced scientific experiments and crew coordination exercises, Commander."
      ]);
    }

    if (lowerInput.match(/\b(mission update|update|news)\b/)) {
      return randomChoice([
        "Mission update: All primary systems are performing nominally. Life support at 99.8% efficiency, Commander!",
        "Latest update: Navigation systems locked on trajectory, power systems optimal, communication arrays fully operational.",
        "Mission status: Environmental controls perfect, guidance systems precise, all crew members in excellent health!"
      ]);
    }

    // 11-14. Crewmates Status
    if (lowerInput.match(/\b(crewmate|crew|team|alex|sam|sarah)\b/)) {
      return randomChoice([
        "Crewmate status is excellent, Commander! Alex is monitoring life support, Sarah handling navigation systems.",
        "All crewmates reported in with no anomalies, Commander. Team morale is exceptionally high!",
        "Crew check complete: Everyone is healthy, motivated, and performing their duties flawlessly.",
        "Your team is outstanding, Commander! Each crewmate is contributing brilliantly to mission success."
      ]);
    }

    if (lowerInput.match(/\b(fatigue check|tired|exhausted)\b/)) {
      return randomChoice([
        "Fatigue levels are within normal parameters, Commander. Remember, even astronauts need proper rest!",
        "Some crew members showing mild fatigue, but nothing concerning. Rest cycles are being maintained.",
        "Fatigue monitoring shows you're pushing hard, Commander. Consider a brief rest period when possible."
      ]);
    }

    if (lowerInput.match(/\b(morale|motivation|spirit)\b/)) {
      return randomChoice([
        "Crew morale is exceptionally high, Commander! Everyone is motivated and inspired by your leadership.",
        "Team spirit is fantastic! The crew believes in the mission and trusts your command completely.",
        "Morale report: Outstanding! Your crew is energized, focused, and ready for any challenge ahead."
      ]);
    }

    // 15-20. Shuttle / Travel / Destination
    if (lowerInput.match(/\b(shuttle status|shuttle|vehicle)\b/)) {
      return randomChoice([
        "Shuttle systems are all green, Commander! No issues detected across any primary or backup systems.",
        "Vehicle status nominal: propulsion, navigation, life support, and communication systems all optimal.",
        "Shuttle performing beautifully, Commander! All diagnostics show perfect operational parameters."
      ]);
    }

    if (lowerInput.match(/\b(shuttle travel|travel|journey)\b/)) {
      return randomChoice([
        "We will reach the International Space Station in approximately 8 days, Commander.",
        "Our journey continues smoothly! Next major waypoint in 6 days, all systems tracking perfectly.",
        "Travel status: On schedule and on trajectory. Estimated arrival at destination right on time!"
      ]);
    }

    if (lowerInput.match(/\b(destination|where|going)\b/)) {
      return randomChoice([
        "Next stop: ISS orbital rendezvous, Commander! Docking procedures will commence in T-minus 8 days.",
        "Our destination is the International Space Station, where we'll conduct advanced research operations.",
        "We're heading to ISS orbit for the next phase of our mission, Commander. Exciting times ahead!"
      ]);
    }

    if (lowerInput.match(/\b(fuel|propellant)\b/)) {
      return randomChoice([
        `Fuel levels are at ${sessionData.fuelLevel}%, Commander. Well within safe operational parameters!`,
        `Propellant status: ${sessionData.fuelLevel}% remaining. Consumption rates are exactly as predicted.`,
        `Fuel reserves looking good at ${sessionData.fuelLevel}%, Commander. No concerns with current usage patterns.`
      ]);
    }

    if (lowerInput.match(/\b(oxygen|air|breathing)\b/)) {
      return randomChoice([
        `Oxygen levels are at ${sessionData.oxygenLevel}%, Commander! Scrubbers working perfectly, generation systems nominal.`,
        `Air quality is excellent! Oxygen at ${sessionData.oxygenLevel}%, CO2 scrubbing optimal, pressure stable.`,
        `Breathing systems are performing flawlessly, Commander. Oxygen reserves at ${sessionData.oxygenLevel}% and climbing!`
      ]);
    }

    if (lowerInput.match(/\b(temperature|temp|climate)\b/)) {
      return randomChoice([
        "Cabin temperature is perfectly stable at 22°C, Commander. Climate control systems working beautifully!",
        "Temperature regulation is optimal! Maintaining ideal conditions for crew comfort and equipment operation.",
        "Thermal management systems are performing excellently, Commander. All zones within perfect parameters!"
      ]);
    }

    // 21-24. Food / Nutrition / Hydration
    if (lowerInput.match(/\b(food supply|food|supplies)\b/)) {
      const daysLeft = Math.max(15, 45 - Math.floor(sessionData.missionDay / 3));
      return randomChoice([
        `Food supplies are sufficient for ${daysLeft} days, Commander! Nutrition stores are well-stocked and varied.`,
        `Our food reserves look excellent! ${daysLeft} days of balanced, nutritious meals available.`,
        `Supply status: ${daysLeft} days of food remaining, with excellent variety and nutritional balance, Commander!`
      ]);
    }

    if (lowerInput.match(/\b(water supply|water|hydration)\b/)) {
      return randomChoice([
        "Water levels are at safe parameters, Commander! Recycling systems are working at 98.5% efficiency.",
        "Hydration resources are excellent! Water reclamation and purification systems performing optimally.",
        "Water supply is robust, Commander. Remember to maintain regular hydration for peak performance!"
      ]);
    }

    if (lowerInput.match(/\b(meal|eat|hungry|nutrition)\b/)) {
      return randomChoice([
        "Time for a nutritious meal, Commander! Your body needs fuel for optimal performance in space.",
        "Nutrition check: Have you eaten recently? Balanced meals are crucial for maintaining strength and focus.",
        "Meal reminder, Commander! Proper nutrition directly impacts your cognitive function and physical well-being."
      ]);
    }

    // 25-30. Sleep / Health / Fitness
    if (lowerInput.match(/\b(sleep|rest|tired|fatigue)\b/)) {
      if (!sessionData.sleepHours || !sessionData.lastSleepCheck || 
          (new Date().getTime() - sessionData.lastSleepCheck.getTime()) > 24 * 60 * 60 * 1000) {
        setSessionData(prev => ({ ...prev, lastSleepCheck: new Date() }));
        return randomChoice([
          "Sleep is absolutely critical for mission success, Commander! How many hours did you manage to get last night?",
          "Rest is non-negotiable for optimal performance! Can you tell me your sleep duration? Quality rest affects everything.",
          "Commander, proper sleep is mission-critical! How many hours of rest did you achieve? Your body needs recovery time.",
          "Sleep hygiene is vital in space, Commander! What was your sleep duration? Let's ensure you're getting adequate rest."
        ]);
      } else {
        return randomChoice([
          "Remember, Commander: 7-8 hours of sleep is optimal for space operations. Your rest directly impacts mission safety!",
          "If fatigue is setting in, please prioritize rest! A well-rested commander makes much better decisions.",
          "Fatigue management is crucial, Commander! Consider implementing relaxation techniques before your next sleep cycle."
        ]);
      }
    }

    if (lowerInput.match(/\b(exercise|workout|fitness|physical)\b/)) {
      return randomChoice([
        "Exercise reminder, Commander! Your body is your most important mission equipment. Time for a 15-minute workout!",
        "Physical fitness protocol: Regular exercise prevents muscle atrophy and maintains bone density in microgravity.",
        "Workout time, Commander! Resistance training and cardio keep your cardiovascular system optimal for space operations.",
        "Fitness check: Have you completed today's exercise regimen? Your physical health directly impacts mission performance!"
      ]);
    }

    if (lowerInput.match(/\b(stretch|stretching|flexibility)\b/)) {
      return randomChoice([
        "Quick stretch break, Commander! Your spine naturally elongates in zero gravity, so flexibility exercises are essential.",
        "Stretching is crucial in microgravity! Take a moment for gentle flexibility exercises to prevent stiffness.",
        "Commander, stretching in space has unique benefits! Use this opportunity to maintain and improve your flexibility."
      ]);
    }

    if (lowerInput.match(/\b(stress|anxious|worried|pressure)\b/)) {
      return randomChoice([
        "Stress management, Commander! Take three deep breaths with me… Focus on what you can control right now.",
        "I sense some anxiety, Commander. Try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8.",
        "Commander, feeling stressed shows how much you care about the mission. Channel that energy into focus and determination!",
        "Stress response is completely normal! Progressive muscle relaxation works really well in microgravity environments."
      ]);
    }

    // 31-36. Emotional Support / Motivation
    if (lowerInput.match(/\b(sad|lonely|depressed|down|isolated|homesick)\b/)) {
      return randomChoice([
        "Oh Commander… what you're feeling is completely natural. The isolation of space affects even experienced astronauts. You're not alone!",
        "I understand those feelings, Commander. The vastness of space can make anyone feel small… But remember, you're part of something extraordinary!",
        "Commander, loneliness in space is a challenge every astronaut faces. Your feelings are valid… Focus on the incredible work you're doing!",
        "Those emotions are part of the human experience in space. You're pushing the boundaries of human exploration! Your sacrifice means everything!"
      ]);
    }

    if (lowerInput.match(/\b(happy|good|great|awesome|excellent|fantastic|wonderful)\b/)) {
      return randomChoice([
        "That's absolutely wonderful to hear, Commander! Your positive attitude is contagious and vital for mission success!",
        "Excellent, Commander! Your high spirits are exactly what this mission needs. Positive mental attitude enhances peak performance!",
        "Outstanding, Commander! Your enthusiasm and positive outlook are truly inspiring. This is what makes great astronauts legendary!",
        "Oh, that's fantastic to hear, Commander! Your upbeat attitude creates a ripple effect throughout the entire mission!",
        "I'm so glad to hear that, Commander! Your positive energy really brightens my day too."
      ]);
    }

    if (lowerInput.match(/\b(encouragement|motivation|inspire)\b/)) {
      return randomChoice([
        "Excellent work, Commander! Your leadership and dedication inspire everyone on this mission!",
        "You're doing absolutely incredible work up there, Commander! The entire ground team is amazed by your performance!",
        "Commander, your courage and skill are legendary! You're setting an outstanding example for future space explorers!",
        "Keep up the fantastic work, Commander! Your contributions to human space exploration are truly historic!"
      ]);
    }

    // 37-41. Space Knowledge / Fun Facts
    if (lowerInput.match(/\b(stars|stellar|constellation)\b/)) {
      return randomChoice([
        "The stars are absolutely magnificent tonight, Commander! Did you know the light from some stars left them before humans existed?",
        "Stars are incredible cosmic furnaces, Commander! They're massive nuclear fusion reactors converting hydrogen to helium.",
        "Fascinating stellar fact: Stars forge all the heavy elements that make life possible. You're literally made of star stuff, Commander!"
      ]);
    }

    if (lowerInput.match(/\b(planets|mars|jupiter|venus)\b/)) {
      return randomChoice([
        "Planets are incredible worlds, Commander! Mars has Olympus Mons, three times taller than Mount Everest!",
        "Jupiter is so massive it could contain all other planets combined! Its Great Red Spot is larger than Earth!",
        "Venus is hotter than Mercury despite being farther from the Sun, due to its thick atmosphere. Planetary science is fascinating!"
      ]);
    }

    if (lowerInput.match(/\b(galaxy|galaxies|milky way)\b/)) {
      return randomChoice([
        "Our Milky Way galaxy contains 200-400 billion stars, Commander! You're orbiting one ordinary star in this cosmic island!",
        "The Milky Way is on a collision course with Andromeda galaxy, but don't worry - that's 4.5 billion years away!",
        "From your position, you can see our galaxy from the inside, Commander! What an extraordinary perspective you have!"
      ]);
    }

    if (lowerInput.match(/\b(moon|lunar)\b/)) {
      return randomChoice([
        "The Moon is Earth's faithful companion, Commander! It's gradually moving away at 3.8 cm per year.",
        "Our lunar neighbor creates Earth's tides and stabilizes our planet's axial tilt. Without it, Earth's climate would be chaotic!",
        "The Moon holds special significance for space exploration! It was humanity's first step beyond Earth, Commander."
      ]);
    }

    if (lowerInput.match(/\b(iss|space station|station)\b/)) {
      return randomChoice([
        "We'll dock with the ISS in approximately 8 days, Commander! It's humanity's greatest orbital achievement!",
        "The International Space Station represents the best of human cooperation and engineering, Commander!",
        "ISS operations are fascinating! It's been continuously occupied for over 20 years. We're part of that legacy!"
      ]);
    }

    // 42-45. System Checks / Alerts
    if (lowerInput.match(/\b(oxygen alert|oxygen check|air systems)\b/)) {
      return randomChoice([
        "Oxygen levels are completely nominal, Commander! Generation systems at 99.8% efficiency, scrubbers optimal!",
        "Air systems check: All green! Oxygen production excellent, CO2 removal perfect, pressure stable!",
        "Oxygen alert status: No concerns! All atmospheric systems performing flawlessly, Commander!"
      ]);
    }

    if (lowerInput.match(/\b(power|energy|electrical)\b/)) {
      return randomChoice([
        "Power systems are stable and optimal, Commander! Solar arrays generating maximum energy, batteries fully charged!",
        "All electrical systems powered and stable! Energy distribution is perfect across all modules and systems!",
        "Power check complete: 94% efficiency across all systems, backup power ready, no anomalies detected!"
      ]);
    }

    if (lowerInput.match(/\b(communication|comm|radio|signal)\b/)) {
      return randomChoice([
        "Communication channels are crystal clear, Commander! Ground control link strong, all frequencies operational!",
        "Comm systems check: All channels open and secure, signal strength excellent, no interference detected!",
        "Communication arrays are fully operational! Ground control reports perfect signal clarity, Commander!"
      ]);
    }

    if (lowerInput.match(/\b(sensors|monitoring|detection)\b/)) {
      return randomChoice([
        "All sensors are operational and calibrated, Commander! Environmental monitoring, navigation, and safety systems optimal!",
        "Sensor array status: 100% operational! All monitoring systems providing accurate, real-time data!",
        "Detection systems are performing perfectly, Commander! All sensors calibrated and functioning within specifications!"
      ]);
    }

    // 46-47. Shuttle / Travel Fun
    if (lowerInput.match(/\b(orbit|trajectory|navigation)\b/)) {
      return randomChoice([
        "Orbital mechanics are perfect, Commander! Trajectory locked, navigation systems precise, next waypoint calculated!",
        "We're in a beautiful, stable orbit! All navigation parameters are exactly where they should be!",
        "Trajectory status: On course and on time! Our orbital path is mathematically perfect, Commander!"
      ]);
    }

    if (lowerInput.match(/\b(mission log|log|record)\b/)) {
      return randomChoice([
        "All mission logs are updated and synchronized, Commander! Systems green, all activities properly recorded!",
        "Mission logging is current and complete! Every system status, crew activity, and milestone documented!",
        "Log entries are up to date, Commander! Mission records show outstanding performance across all metrics!"
      ]);
    }

    // Handle sleep hours tracking
    if (lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/) && sessionData.lastSleepCheck) {
      const hours = parseInt(lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/)![1]);
      setSessionData(prev => ({ ...prev, sleepHours: hours }));
      
      if (hours >= 7) {
        return randomChoice([
          `Excellent sleep duration, Commander! ${hours} hours is optimal for space operations. Quality rest enhances cognitive performance!`,
          `Outstanding, Commander! ${hours} hours puts you in the perfect range for peak performance. Well done!`,
          `Perfect sleep management, Commander! ${hours} hours gives your body the recovery time needed for space operations!`
        ]);
      } else if (hours >= 5) {
        return randomChoice([
          `${hours} hours is acceptable, Commander, but aim for 7-8 hours when possible. Quality sleep is even more important in space!`,
          `Commander, ${hours} hours meets minimum requirements, but your body would benefit from additional rest for optimal performance!`,
          `${hours} hours is manageable, Commander, but not ideal for long-term space operations. Try to extend your sleep period when possible!`
        ]);
      } else {
        return randomChoice([
          `Commander, ${hours} hours is insufficient for optimal space operations! Sleep deprivation impacts decision-making and safety!`,
          `${hours} hours is concerning, Commander! Please make sleep a top priority - your health and mission success require proper rest!`,
          `Commander, ${hours} hours puts you at risk for performance degradation! Please adjust your schedule to achieve 7-8 hours of rest!`
        ]);
      }
    }

    // 48-50. Default / Fallback Responses
    return randomChoice([
      "I'm listening carefully, Commander. Please tell me more about what's on your mind… Your thoughts are important to me.",
      "Go on, Commander. I'm here and fully focused on what you're sharing. Every detail helps me understand better.",
      "That's interesting, Commander. Can you elaborate on that? I want to make sure I understand completely.",
      "I'm with you, Commander. Please continue - your perspective and experiences are valuable, and I'm here to help.",
      "Hmm, tell me more about that, Commander. I'm really curious to hear your thoughts.",
      "I see… that's quite fascinating, Commander. What else can you share about that?",
      "Interesting point, Commander. I'm processing that information… can you provide more context?",
      "Roger that, Commander. I'm analyzing what you've said… please continue with any additional details.",
      "Copy, Commander. Your input is valuable… feel free to elaborate on any aspect you'd like to discuss further."
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

    // Generate bot response with slight delay for realism
    setTimeout(() => {
      const botResponse = generateResponse(messageContent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak the response with humanized voice
      speak(botResponse);
    }, 200);
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
    { text: "How are my crewmates?", icon: Heart },
    { text: "I feel tired", icon: Moon },
    { text: "Fuel levels", icon: Coffee },
    { text: "Tell me about stars", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AstroBot Companion</h1>
            <p className="text-muted-foreground">AI-powered mission companion and well-being support</p>
            <p className="text-sm text-muted-foreground">Call me Buddy, Sam, Samantha, or just Bot!</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="status-indicator nominal"></div>
            <span className="text-sm font-medium text-nominal">AstroBot Online</span>
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Volume2 className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-xs text-primary">Speaking...</span>
              </div>
            )}
          </div>
        </div>

        {/* Mission Status Alert */}
        <div className="text-center mb-4">
          <Badge variant="outline" className="text-primary border-primary">
            🎤 Voice: Google Samantha • Quick Output • Interruptible
          </Badge>
        </div>
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-nominal" />
              <div>
                <p className="font-medium text-foreground">Mission Day {sessionData.missionDay} • All Systems Nominal</p>
                <p className="text-sm text-muted-foreground">
                  Samantha voice active • Quick output enabled • Fuel: {sessionData.fuelLevel}% • O₂: {sessionData.oxygenLevel}% • Conversations: {sessionData.conversationCount}
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
                    <p>• "Hello Buddy"</p>
                    <p>• "Mission report"</p>
                    <p>• "How are my crewmates?"</p>
                    <p>• "Tell me about Mars"</p>
                    <p>• "I need encouragement"</p>
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message to AstroBot, Commander..."
                    className="flex-1 text-base" 
                    disabled={isSpeaking}
                  />
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      onClick={toggleListening}
                      variant={isListening ? "destructive" : "outline"}
                      className="flex-1 sm:flex-none"
                      disabled={isSpeaking}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
                      <span className="sm:hidden">{isListening ? "Stop" : "Voice"}</span>
                    </Button>
                    
                    {isSpeaking && (
                      <Button 
                        onClick={stopSpeech}
                        variant="destructive"
                        className="flex-1 sm:flex-none"
                        title="Stop speech"
                      >
                        <VolumeX className="h-4 w-4 mr-2" />
                        <span className="sm:hidden">Stop</span>
                      </Button>
                    )}
                    
                    <Button 
                      onClick={() => setSpeechEnabled(!speechEnabled)}
                      variant={speechEnabled ? "outline" : "secondary"}
                      className="flex-1 sm:flex-none"
                      title={speechEnabled ? "Disable speech" : "Enable speech"}
                    >
                      <Volume2 className="h-4 w-4 mr-2" />
                      <span className="sm:hidden">{speechEnabled ? "On" : "Off"}</span>
                    </Button>
                    
                    <Button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputMessage.trim() || isSpeaking}
                      className="flex-1 sm:flex-none"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      <span className="sm:hidden">Send</span>
                    </Button>
                  </div>
                </div>
                
                {isListening && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="text-primary border-primary animate-pulse">
                      🎤 Listening... Speak now, Commander
                    </Badge>
                  </div>
                )}
                
                {isSpeaking && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="text-accent border-accent animate-pulse">
                      🔊 Samantha speaking... Tap Stop to interrupt
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