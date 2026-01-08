import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MoodTracker from '@/components/MoodTracker';
import BreathingExercise from '@/components/BreathingExercise';
import AIChatbot from '@/components/AIChatbot';
import Resources from '@/components/Resources';
import Support from '@/components/Support';
import Booking from '@/components/Booking';
import Games from '@/components/Games';
import Community from '@/components/Community';
import { MentalHealthQuizzes } from '@/components/MentalHealthQuizzes';
import { motion } from 'framer-motion';
import logo from '/logo.png';
import { 
  LogOut,
  Brain, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Sun, 
  Moon, 
  Zap,
  Target,
  Clock,
  Award,
  MessageCircle,
  BookOpen,
  Phone,
  CalendarDays,
  ClipboardList, 
  Gamepad,
  Users,
  LucideIcon
} from 'lucide-react';
import { signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { auth } from "../firebase";

interface User {
  email: string;
  name: string;
  userType: string;
  institution: string;
}

interface Activity {
  type: string;
  description: string;
  createdAt: Date;
}

const mockActivities: Activity[] = [
  {
    type: 'breathing',
    description: 'Completed a 5-minute breathing exercise',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    type: 'chat',
    description: 'Chatted with the AI therapy bot',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

const mockUserStats = {
    streak: 5,
    weeklyMoodAverage: 4.2,
    completedSessions: 12,
    totalMinutes: 128,
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/auth');
    }

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setFirebaseUser(user);
      } else {
        localStorage.removeItem('user');
        navigate('/auth');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    navigate('/auth', { replace: true });
  };

  if (!user || !firebaseUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <img src={logo} alt="NIRVANA" className="h-12 w-12 mx-auto mb-4 animate-pulse" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  const userStats = mockUserStats;
  const recentActivities = mockActivities;

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <Card className="gradient-hero text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                <p className="text-primary-foreground/80">Ready to continue your wellness journey?</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{userStats?.streak || 0}</div>
                <div className="text-sm text-primary-foreground/80">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { 
            icon: logo, 
            label: 'Weekly Mood Avg', 
            value: (userStats?.weeklyMoodAverage || 0).toFixed(1),
            color: 'text-red-500' 
          },
          { 
            icon: Zap, 
            label: 'Current Streak', 
            value: `${userStats?.streak || 0} days`,
            color: 'text-yellow-500' 
          },
          { 
            icon: Target, 
            label: 'Sessions Done', 
            value: userStats?.completedSessions || 0,
            color: 'text-blue-500' 
          },
          { 
            icon: Clock, 
            label: 'Total Minutes', 
            value: `${userStats?.totalMinutes || 0}m`,
            color: 'text-green-500' 
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-background/50 backdrop-blur-sm">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  {typeof stat.icon === 'string' ? <img src={stat.icon} className={`h-5 w-5 ${stat.color}`} /> : <stat.icon className={`h-5 w-5 ${stat.color}`} />}
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Today's Wellness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="gradient-primary text-primary-foreground border-0 h-auto py-4 px-6"
              onClick={() => setActiveTab('mood')}
            >
              <div className="text-center">
                <img src={logo} alt="NIRVANA" className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Mood Check-in</div>
                <div className="text-sm text-primary-foreground/80">How are you feeling?</div>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto py-4 px-6"
              onClick={() => setActiveTab('breathing')}
            >
              <div className="text-center">
                <Brain className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Breathing Exercise</div>
                <div className-="text-sm text-muted-foreground">Take a mindful moment</div>
              </div>
            </Button>

            <Button 
              variant="outline"
              className="h-auto py-4 px-6"
              onClick={() => setActiveTab('quizzes')}
            >
              <div className="text-center">
                <ClipboardList className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Mental Assessment</div>
                <div className="text-sm text-muted-foreground">Check in with yourself</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{activity.description}</div>
                  <div className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-calm">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <img src={logo} alt="NIRVANA" className="h-6 w-6" />
              <span className="hidden font-bold sm:inline-block">NIRVANA</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Badge variant="outline">{user.institution}</Badge>
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'mood', label: 'Mood Tracker', icon: logo },
            { id: 'breathing', label: 'Breathing', icon: Brain },
            { id: 'quizzes', label: 'Mental Assessment', icon: ClipboardList },
            { id: 'games', label: 'Games', icon: Gamepad },
            { id: 'chatbot', label: 'AI Therapy', icon: MessageCircle },
            { id: 'community', label: 'Community', icon: Users },
            { id: 'resources', label: 'Resources', icon: BookOpen },
            { id: 'support', label: 'Support', icon: Phone },
            { id: 'booking', label: 'Book Session', icon: CalendarDays },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 ${
                activeTab === tab.id ? 'gradient-primary text-primary-foreground border-0' : ''
              }`}
            >
              {typeof tab.icon === 'string' ? <img src={tab.icon} className="h-4 w-4" /> : <tab.icon className="h-4 w-4" />}
              {tab.label}
            </Button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'mood' && <MoodTracker userId={firebaseUser.uid} />}
          {activeTab === 'breathing' && <div className="flex justify-center"><BreathingExercise /></div>}
          {activeTab === 'quizzes' && <MentalHealthQuizzes userId={firebaseUser.uid} />}
          {activeTab === 'games' && <Games />}
          {activeTab === 'chatbot' && <AIChatbot />}
          {activeTab === 'community' && <Community />}
          {activeTab === 'resources' && <Resources />}
          {activeTab === 'support' && <Support />}
          {activeTab === 'booking' && <Booking />}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
