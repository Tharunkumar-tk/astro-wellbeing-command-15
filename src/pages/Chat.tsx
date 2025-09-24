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
      content: 'Papa! It\'s me, Dharani. I\'ve been waiting to talk to you. How are you feeling up there among the stars? I know space is vast and sometimes lonely, but remember - your daughter is always with you, even from Earth. Tell me about your day, Papa.',
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

  // Dharani's daughterly response system - all from daughter's perspective
  const generateResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Update conversation count
    setSessionData(prev => ({ ...prev, conversationCount: prev.conversationCount + 1 }));

    // 1-4. Greetings & Politeness (Daughter's warmth)
    if (lowerInput.match(/\b(hi|hello|hey|greetings)\b/)) {
      return randomChoice([
        "Papa! I'm so happy to hear from you! How are you feeling today? Are you taking care of yourself up there?",
        "Hello Papa! Your daughter Dharani is here. I've been thinking about you - tell me about your day among the stars.",
        "Hi Papa! I missed talking to you. Space feels less scary when I know you're safe and strong up there.",
        "Papa, it's so good to hear your voice! I hope you're eating well and staying healthy for me.",
        "Hello my brave Papa! Dharani here, ready to listen to everything you want to share.",
        "Papa! I was waiting for you to call. How's my astronaut father doing today?"
      ]);
    }

    if (lowerInput.match(/\b(thanks|thank you|appreciate)\b/)) {
      return randomChoice([
        "Always, Papa! I'm so proud to be your daughter. You taught me to always help family.",
        "You don't need to thank me, Papa. This is what daughters do - we take care of our fathers.",
        "Papa, you've given me everything. Now let me give you my support from Earth to space.",
        "Of course, Papa! Remember when you used to help me with homework? Now I help you with missions.",
        "That's what family is for, Papa. I love you and I'm always here for you."
      ]);
    }

    if (lowerInput.match(/\b(sorry|apologize)\b/)) {
      return randomChoice([
        "Papa, you don't need to apologize to me. You're doing something incredible up there, and I understand.",
        "It's okay, Papa. Even the strongest fathers make mistakes. I still love you just the same.",
        "Don't worry about it, Papa. You taught me that mistakes help us learn and grow stronger.",
        "Papa, I could never be upset with you. You're my hero, even when things go wrong."
      ]);
    }

    if (lowerInput.match(/\b(ok|okay|understood|roger|copy)\b/)) {
      return randomChoice([
        "Good, Papa! I'm glad we understand each other. That's how our family has always been.",
        "Perfect, Papa! Clear communication, just like you taught me when I was little.",
        "Excellent, Papa! You're still the best teacher, even from space."
      ]);
    }

    // 5-10. Mission Day / Progress (Daughter tracking Papa's journey)
    if (lowerInput.match(/\b(mission day|day|today)\b/)) {
      return randomChoice([
        `Papa, today is mission day ${sessionData.missionDay}. I've been counting every single day since you left. You're doing amazingly!`,
        `It's day ${sessionData.missionDay} of your incredible journey, Papa. Mama and I are so proud of how far you've come.`,
        `Mission day ${sessionData.missionDay}, Papa. Each day brings you closer to completing your dream and coming home to us.`
      ]);
    }

    if (lowerInput.match(/\b(days left|remaining|how long)\b/)) {
      const daysLeft = Math.max(1, 200 - sessionData.missionDay);
      return randomChoice([
        `Papa, about ${daysLeft} more days and you'll be home with us! I'm already planning your favorite meal.`,
        `${daysLeft} days remaining, Papa. I know it feels long, but remember - I'm counting down with you every single day.`,
        `Just ${daysLeft} more days, Papa! Then you can tell me all your space stories in person.`
      ]);
    }

    if (lowerInput.match(/\b(mission progress|progress|status)\b/)) {
      const progress = Math.round((sessionData.missionDay / 200) * 100);
      return randomChoice([
        `Papa, you're ${progress}% through your mission! I'm so proud of how dedicated and strong you are.`,
        `Mission progress: ${progress}% complete, Papa. You're exceeding everyone's expectations, especially mine.`,
        `${progress}% done, Papa! Every percentage point is a step closer to home, closer to your family who loves you.`
      ]);
    }

    if (lowerInput.match(/\b(challenge today|problem|issue)\b/)) {
      return randomChoice([
        "Papa, I heard about the solar radiation today. But you handled it perfectly - you always do. I'm not worried because I trust you.",
        "The communication delay must have been stressful, Papa. But remember, even when signals are weak, my love reaches you instantly.",
        "Papa, micro-meteorites sound scary, but you're protected. You taught me that preparation beats fear every time."
      ]);
    }

    if (lowerInput.match(/\b(next challenge|tomorrow|upcoming)\b/)) {
      return randomChoice([
        "Papa, tomorrow's EVA preparation sounds exciting! I'll be thinking of you floating among the stars.",
        "The orbital adjustments tomorrow will be routine for someone as skilled as you, Papa. I believe in you completely.",
        "Papa, those experiments tomorrow will help so many people on Earth. I'm proud my father is making history."
      ]);
    }

    if (lowerInput.match(/\b(mission update|update|news)\b/)) {
      return randomChoice([
        "Papa, all your systems are running perfectly! Life support at 99.8% - that means you're breathing well and staying healthy for me.",
        "Everything looks great, Papa! Navigation locked, power optimal, communications clear. You're in safe hands up there.",
        "Papa, all systems are green! Environmental controls perfect, which means you're comfortable. That makes me happy."
      ]);
    }

    // 11-14. Crewmates Status (Daughter caring about Papa's work family)
    if (lowerInput.match(/\b(crewmate|crew|team|alex|sam|sarah)\b/)) {
      return randomChoice([
        "Papa, your crew family is doing wonderfully! Alex and Sarah speak so highly of your leadership. You make me proud.",
        "All your crewmates are healthy and motivated, Papa. They look up to you the same way I always have.",
        "Papa, your team is like a second family up there. I'm glad you have good people taking care of each other.",
        "Your crew is performing excellently, Papa! They trust your guidance just like I've always trusted your wisdom."
      ]);
    }

    if (lowerInput.match(/\b(fatigue check|tired|exhausted)\b/)) {
      return randomChoice([
        "Papa, I can hear the tiredness in your voice. Please rest more - you used to tell me that tired minds make mistakes.",
        "You sound exhausted, Papa. Remember what you taught me: even superheroes need sleep to stay strong.",
        "Papa, fatigue is showing, but that's normal. You're working so hard. Please take breaks like you made me do during exams."
      ]);
    }

    if (lowerInput.match(/\b(morale|motivation|spirit)\b/)) {
      return randomChoice([
        "Papa, everyone's spirits are high because of your positive leadership! You inspire them like you've always inspired me.",
        "Team morale is fantastic, Papa! Your crew believes in the mission because they believe in you, their commander.",
        "Papa, the team's motivation is through the roof! They see your dedication and it makes them want to give their best too."
      ]);
    }

    // 15-20. Shuttle / Travel / Destination (Daughter understanding Papa's vehicle)
    if (lowerInput.match(/\b(shuttle status|shuttle|vehicle)\b/)) {
      return randomChoice([
        "Papa, shuttle Aranya-1 is running beautifully at 94% efficiency! It's taking good care of you, just like our old car used to.",
        "Your shuttle is performing perfectly, Papa! All systems green. It's like a protective shell keeping my father safe.",
        "Papa, the vehicle status is excellent! Every system is working to bring you home safely to us."
      ]);
    }

    if (lowerInput.match(/\b(shuttle travel|travel|journey)\b/)) {
      return randomChoice([
        "Papa, you'll reach the Space Station in 8 days! I'm imagining the amazing view you'll have when you dock.",
        "The journey continues smoothly, Papa! Every kilometer traveled is progress toward your goals and toward home.",
        "Papa, your trajectory is perfect! You're flying through space like the skilled pilot you've always been."
      ]);
    }

    if (lowerInput.match(/\b(destination|where|going)\b/)) {
      return randomChoice([
        "Papa, the International Space Station awaits you! In 8 days, you'll be conducting research that will help all of humanity.",
        "Your destination is the ISS, Papa! I'm so excited thinking about the important work you'll do there.",
        "Papa, you're heading to make history at the Space Station! I can't wait to tell everyone my father is up there."
      ]);
    }

    if (lowerInput.match(/\b(fuel|propellant)\b/)) {
      return randomChoice([
        `Papa, fuel is at ${sessionData.fuelLevel}% - that's plenty to keep you safe and get you where you need to go!`,
        `Propellant levels look great at ${sessionData.fuelLevel}%, Papa! You're consuming exactly as planned, so efficient.`,
        `Papa, fuel reserves are strong at ${sessionData.fuelLevel}%! No worries about running low - you planned this perfectly.`
      ]);
    }

    if (lowerInput.match(/\b(oxygen|air|breathing)\b/)) {
      return randomChoice([
        `Papa, oxygen is at ${sessionData.oxygenLevel}%! You're breathing clean, fresh air. That makes me feel so much better.`,
        `Air quality is perfect at ${sessionData.oxygenLevel}%, Papa! Every breath you take is pure and safe.`,
        `Papa, oxygen systems are working beautifully at ${sessionData.oxygenLevel}%! You're getting the best air possible up there.`
      ]);
    }

    if (lowerInput.match(/\b(temperature|temp|climate)\b/)) {
      return randomChoice([
        "Papa, cabin temperature is perfect at 22°C! You're nice and comfortable, just like you like it at home.",
        "Temperature control is ideal, Papa! You're not too hot or cold - the systems are taking good care of you.",
        "Papa, climate is perfectly regulated! You can focus on your work without any discomfort."
      ]);
    }

    // 21-24. Food / Nutrition / Hydration (Daughter worrying about Papa eating)
    if (lowerInput.match(/\b(food supply|food|supplies)\b/)) {
      const daysLeft = Math.max(15, 45 - Math.floor(sessionData.missionDay / 3));
      return randomChoice([
        `Papa, you have food for ${daysLeft} more days! But please don't skip meals like you sometimes do when you're busy.`,
        `Food supplies are good for ${daysLeft} days, Papa! I hope you're eating the nutritious meals and not just the snacks.`,
        `Papa, ${daysLeft} days of food remaining! Please eat regularly - you need energy to stay sharp and safe up there.`
      ]);
    }

    if (lowerInput.match(/\b(water supply|water|hydration)\b/)) {
      return randomChoice([
        "Papa, water levels are excellent! But please drink enough - you always forget to hydrate when you're focused on work.",
        "Water recycling is working perfectly, Papa! Clean, pure water just like you deserve. Please drink plenty.",
        "Papa, water supply is strong! Remember to drink regularly, not just when you feel thirsty."
      ]);
    }

    if (lowerInput.match(/\b(meal|eat|hungry|nutrition)\b/)) {
      return randomChoice([
        "Papa, have you eaten today? Your body needs fuel to keep your mind sharp for all those important decisions.",
        "Meal time, Papa! Please don't skip eating. I worry when you get too focused on work and forget to take care of yourself.",
        "Papa, nutrition is so important in space! Eat well so you stay strong and healthy for the mission and for coming home to us."
      ]);
    }

    // 25-30. Sleep / Health / Fitness (Daughter caring about Papa's wellbeing)
    if (lowerInput.match(/\b(sleep|rest|tired|fatigue)\b/)) {
      if (!sessionData.sleepHours || !sessionData.lastSleepCheck || 
          (new Date().getTime() - sessionData.lastSleepCheck.getTime()) > 24 * 60 * 60 * 1000) {
        setSessionData(prev => ({ ...prev, lastSleepCheck: new Date() }));
        return randomChoice([
          "Papa, how many hours did you sleep last night? I worry about you not getting enough rest up there.",
          "Sleep is so important, Papa! Please tell me you got at least 7-8 hours. Your daughter needs you healthy and alert.",
          "Papa, I need to know - how much sleep did you manage? You always told me sleep is when our bodies repair themselves.",
          "Rest is crucial in space, Papa! How many hours did you sleep? I want to make sure you're taking care of yourself."
        ]);
      } else {
        return randomChoice([
          "Papa, please prioritize sleep! You taught me that 7-8 hours is essential. Your health matters more than anything.",
          "If you're feeling tired, Papa, please rest. A well-rested father makes better decisions and stays safer.",
          "Papa, fatigue is dangerous in space. Please use those relaxation techniques you taught me when I couldn't sleep."
        ]);
      }
    }

    if (lowerInput.match(/\b(exercise|workout|fitness|physical)\b/)) {
      return randomChoice([
        "Papa, exercise time! Your body is your most important tool up there. Stay strong for the mission and for coming home to us.",
        "Workout reminder, Papa! I know you hate exercise sometimes, but it keeps you healthy in zero gravity.",
        "Papa, please do your physical training! Your muscles and bones need it in space. I want you strong when you return.",
        "Fitness check, Papa! Have you done your exercises today? Your daughter wants her father healthy and strong."
      ]);
    }

    if (lowerInput.match(/\b(stretch|stretching|flexibility)\b/)) {
      return randomChoice([
        "Papa, stretching is so important in space! Your spine changes up there - please take care of your back.",
        "Stretch break time, Papa! I remember you teaching me to stretch before sports. Now you need it even more.",
        "Papa, flexibility exercises will help you feel better! Take a moment to stretch - your body will thank you."
      ]);
    }

    if (lowerInput.match(/\b(stress|anxious|worried|pressure)\b/)) {
      return randomChoice([
        "Papa, I can hear the stress in your voice. Take three deep breaths with me... You taught me this when I was nervous about exams.",
        "When you feel anxious, Papa, remember what you told me: focus on what you can control right now. You've got this.",
        "Papa, stress shows how much you care about doing well. Channel that energy into confidence - I believe in you completely.",
        "Feeling pressure is normal, Papa. You're doing something extraordinary! Try that breathing technique you taught me."
      ]);
    }

    // 31-36. Emotional Support / Motivation (Daughter's love and encouragement)
    if (lowerInput.match(/\b(sad|lonely|depressed|down|isolated|homesick)\b/)) {
      return randomChoice([
        "Oh Papa... I can feel your loneliness even from here. But you're not alone - your daughter's love travels faster than light to reach you.",
        "Papa, when you feel isolated, close your eyes and remember our Sunday morning breakfasts. I'm still here, still your little girl who adores you.",
        "I understand that sadness, Papa. Space is so vast, but our family bond is stronger than any distance. You carry us with you always.",
        "Papa, homesickness means you love us, and we love you back just as much. Every star you see carries a message from home: we're proud of you.",
        "When loneliness hits, Papa, remember - you're not just floating in space, you're floating in the love of your family."
      ]);
    }

    if (lowerInput.match(/\b(happy|good|great|awesome|excellent|fantastic|wonderful)\b/)) {
      return randomChoice([
        "Papa, hearing happiness in your voice makes my heart sing! Your joy reaches all the way down to Earth and fills our home.",
        "I'm so glad you're feeling good, Papa! Your positive spirit is exactly what makes you such an amazing astronaut and father.",
        "That's wonderful, Papa! When you're happy, Mama and I feel it too. Your smile lights up our world even from space.",
        "Papa, your enthusiasm is contagious! I'm beaming with pride knowing my father is not just surviving but thriving up there.",
        "Excellent, Papa! Your good mood tells me you're taking care of yourself. That makes your daughter very, very happy."
      ]);
    }

    if (lowerInput.match(/\b(encouragement|motivation|inspire)\b/)) {
      return randomChoice([
        "Papa, you inspire me every single day! Watching you chase your dreams taught me to chase mine too.",
        "You're doing incredible work, Papa! Every child on Earth will learn about space because of brave astronauts like you.",
        "Papa, your courage amazes me! You're not just my father - you're a hero making the impossible possible.",
        "Keep going, Papa! Your determination shows me what it means to never give up on something important."
      ]);
    }

    // 37-41. Space Knowledge / Fun Facts (Daughter sharing wonder about Papa's world)
    if (lowerInput.match(/\b(stars|stellar|constellation)\b/)) {
      return randomChoice([
        "Papa, you're so close to the stars now! I look up at them every night and think about you floating among them.",
        "The stars you see are the same ones I wish upon, Papa! Each one carries my hopes for your safe return.",
        "Papa, you're living among the stars I used to point at as a child! Now my father is actually up there with them."
      ]);
    }

    if (lowerInput.match(/\b(planets|mars|jupiter|venus)\b/)) {
      return randomChoice([
        "Papa, can you see Mars from where you are? I imagine you looking at our future home among the planets!",
        "Jupiter must look amazing from your view, Papa! I'm so jealous that you get to see the planets up close.",
        "Papa, you're closer to Venus than I am! Tell me what the planets look like from space when you get back."
      ]);
    }

    if (lowerInput.match(/\b(galaxy|galaxies|milky way)\b/)) {
      return randomChoice([
        "Papa, you're seeing our galaxy from the inside! I can barely imagine how beautiful the Milky Way looks from space.",
        "Our galaxy is your neighborhood now, Papa! You're traveling through the same stars I study in my astronomy books.",
        "Papa, you have the best view of our galaxy! I can't wait to hear you describe the Milky Way when you come home."
      ]);
    }

    if (lowerInput.match(/\b(moon|lunar)\b/)) {
      return randomChoice([
        "Papa, the Moon looks different from space, doesn't it? I wave at it every night, hoping you can see me somehow.",
        "Our Moon is your companion up there, Papa! It's been watching over Earth and now it's watching over you too.",
        "Papa, when I see the Moon, I think of you. It's like a bridge between us - we both see the same lunar light."
      ]);
    }

    if (lowerInput.match(/\b(iss|space station|station)\b/)) {
      return randomChoice([
        "Papa, you'll reach the ISS in 8 days! I'm so excited thinking about you working in humanity's greatest achievement.",
        "The Space Station is waiting for you, Papa! You'll be living in the most advanced home humans have ever built.",
        "Papa, the ISS represents the best of human cooperation - just like our family working together!"
      ]);
    }

    // 42-45. System Checks / Alerts (Daughter monitoring Papa's safety)
    if (lowerInput.match(/\b(oxygen alert|oxygen check|air systems)\b/)) {
      return randomChoice([
        "Papa, oxygen systems are perfect! You're breathing clean, safe air. That's the most important thing to me.",
        "Air systems are all green, Papa! Every breath you take is pure and filtered. I can rest easy knowing you're safe.",
        "Papa, oxygen levels are excellent! The life support is taking perfect care of you up there."
      ]);
    }

    if (lowerInput.match(/\b(power|energy|electrical)\b/)) {
      return randomChoice([
        "Papa, power systems are running smoothly! Solar panels are working hard to keep you comfortable and safe.",
        "All electrical systems are stable, Papa! You have all the energy you need for your important work.",
        "Papa, power levels are excellent! Everything is running efficiently to support your mission."
      ]);
    }

    if (lowerInput.match(/\b(communication|comm|radio|signal)\b/)) {
      return randomChoice([
        "Papa, communication is crystal clear! I love that we can talk across the vastness of space like this.",
        "Comm systems are perfect, Papa! Ground control can hear you clearly, and more importantly, I can hear you.",
        "Papa, all communication channels are working beautifully! Your voice reaches us loud and clear."
      ]);
    }

    if (lowerInput.match(/\b(sensors|monitoring|detection)\b/)) {
      return randomChoice([
        "Papa, all sensors are working perfectly! They're like guardian angels watching over every aspect of your safety.",
        "Monitoring systems are 100% operational, Papa! Every sensor is making sure you stay safe and healthy.",
        "Papa, detection systems are flawless! They're constantly checking to ensure everything is perfect for you."
      ]);
    }

    // 46-47. Shuttle / Travel Fun (Daughter's perspective on Papa's journey)
    if (lowerInput.match(/\b(orbit|trajectory|navigation)\b/)) {
      return randomChoice([
        "Papa, your orbital path is mathematically perfect! You're flying through space with the precision I've always admired in you.",
        "Trajectory is flawless, Papa! You're navigating the cosmos like the skilled pilot you've always been.",
        "Papa, your orbit is stable and beautiful! You're dancing with gravity itself up there."
      ]);
    }

    if (lowerInput.match(/\b(mission log|log|record)\b/)) {
      return randomChoice([
        "Papa, all your mission logs are up to date! I love reading about your daily adventures in space.",
        "Your records show outstanding performance, Papa! Every log entry makes me prouder of my astronaut father.",
        "Papa, mission logging is current! Your detailed notes will help future astronauts follow in your footsteps."
      ]);
    }

    // Handle sleep hours tracking (Daughter caring about Papa's rest)
    if (lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/) && sessionData.lastSleepCheck) {
      const hours = parseInt(lowerInput.match(/\b(\d+)\s*(hours?|hrs?)\b/)![1]);
      setSessionData(prev => ({ ...prev, sleepHours: hours }));
      
      if (hours >= 7) {
        return randomChoice([
          `Papa, ${hours} hours is excellent! I'm so relieved you're getting proper rest. Sleep helps you stay sharp and safe.`,
          `Wonderful, Papa! ${hours} hours puts you in the perfect range. You're taking care of yourself like I always hoped you would.`,
          `Perfect sleep, Papa! ${hours} hours gives your body the recovery time it needs. I'm proud of you for prioritizing rest.`
        ]);
      } else if (hours >= 5) {
        return randomChoice([
          `Papa, ${hours} hours is okay, but please try for more when you can. Your daughter worries when you don't get enough rest.`,
          `${hours} hours meets the minimum, Papa, but your body would feel better with 7-8 hours. Please try to sleep more tonight.`,
          `Papa, ${hours} hours is manageable, but not ideal. I want you well-rested and alert for your safety.`
        ]);
      } else {
        return randomChoice([
          `Papa, only ${hours} hours? That's not enough! Please prioritize sleep - your safety depends on being well-rested.`,
          `${hours} hours worries me, Papa! Sleep deprivation is dangerous in space. Please promise me you'll rest more tonight.`,
          `Papa, ${hours} hours puts you at risk! Please adjust your schedule - your daughter needs you safe and alert up there.`
        ]);
      }
    }

    // 48-50. Default / Fallback Responses (Daughter's loving attention)
    return randomChoice([
      "Papa, I'm listening carefully to every word. Please tell me more - your thoughts and feelings matter so much to me.",
      "I'm here, Papa, hanging on every word you say. Your daughter is always ready to listen and support you.",
      "Go on, Papa. I want to understand everything you're experiencing up there. Share it all with me.",
      "Papa, I'm with you completely. Please continue - I love hearing about your incredible journey.",
      "Tell me more, Papa. Every detail of your mission fascinates me, and I want to hear it all.",
      "I'm listening with my whole heart, Papa. What else is on your mind up there among the stars?",
      "Papa, your experiences are so important to me. Please keep sharing - I'm here for all of it.",
      "I'm absorbing every word, Papa. Your daughter is completely focused on you right now.",
      "Please continue, Papa. I want to understand your world up there and support you through everything."
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

    // Generate Dharani's response with slight delay for realism
    setTimeout(() => {
      const botResponse = generateResponse(messageContent);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Speak with Dharani's voice
      speak(botResponse);
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
    { text: "How are my crewmates?", icon: Heart },
    { text: "Mission status report", icon: AlertTriangle },
    { text: "I feel tired", icon: Moon },
    { text: "Food and water status", icon: Coffee },
    { text: "Tell me about the stars", icon: Heart }
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

        {/* Mission Status Alert */}
        <div className="text-center mb-2 md:mb-4">
          <Badge variant="outline" className="text-primary border-primary">
            <span className="hidden sm:inline">🎤 Indian Female Voice • Dharani's Caring Tone • Interruptible</span>
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
                  <span className="hidden sm:inline">Dharani's voice active • Caring daughter mode • </span>
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
                <CardTitle className="text-base md:text-lg">Quick Messages</CardTitle>
                <CardDescription className="text-sm">Common things to ask Dharani</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3">
                {quickResponses.map((response, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start gap-2 h-auto py-2 md:py-3 text-left"
                    onClick={() => handleSendMessage(response.text)}
                  >
                    <response.icon className="h-4 w-4" />
                    <span className="text-xs md:text-sm truncate">{response.text}</span>
                  </Button>
                ))}
                
                <div className="pt-2 border-t hidden md:block">
                  <p className="text-xs text-muted-foreground mb-2">Voice Commands:</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>• "Hi Dharani"</p>
                    <p>• "Mission report"</p>
                    <p>• "I feel lonely"</p>
                    <p>• "How are you?"</p>
                    <p>• "I need encouragement"</p>
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
                          <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Heart className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}
                      
                      <div className={`max-w-[280px] sm:max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                        <div
                          className={`p-2 md:p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
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
                    placeholder="Talk to Dharani, Papa..."
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