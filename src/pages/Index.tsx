import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import BreathingExercise from '@/components/BreathingExercise';
import MoodTracker from '@/components/MoodTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Brain, 
  Heart, 
  Users, 
  BookOpen, 
  Headphones, 
  MessageCircle,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  // Animated sections
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [toolsRef, toolsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [resourcesRef, resourcesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: Brain,
      title: 'Mindfulness & Meditation',
      description: 'Guided breathing exercises, progressive muscle relaxation, and mindfulness practices tailored for student life.',
      highlights: ['4-7-8 Breathing', 'Body Scans', '5-Minute Meditations']
    },
    {
      icon: Heart,
      title: 'Mood & Emotional Tracking',
      description: 'Daily check-ins, mood journaling, and emotional pattern recognition to build self-awareness.',
      highlights: ['Daily Mood Logs', 'Emotion Mapping', 'Trigger Identification']
    },
    {
      icon: Users,
      title: 'Peer Support Network',
      description: 'Connect with other students, share experiences, and participate in supportive community discussions.',
      highlights: ['Anonymous Chat', 'Support Groups', 'Peer Mentoring']
    },
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Comprehensive library of mental health information, coping strategies, and academic stress management.',
      highlights: ['Study Guides', 'Stress Management', 'Sleep Hygiene']
    }
  ];

  const tools = [
    {
      icon: Brain,
      title: 'Breathing Exercise',
      description: 'Immediate anxiety relief through guided breathing',
      component: 'breathing'
    },
    {
      icon: Heart,
      title: 'Mood Tracker',
      description: 'Track and understand your emotional patterns',
      component: 'mood'
    },
    {
      icon: Headphones,
      title: 'Meditation Library',
      description: 'Curated collection of calming audio sessions',
      component: 'meditation'
    },
    {
      icon: MessageCircle,
      title: 'Crisis Support',
      description: '24/7 access to mental health resources and hotlines',
      component: 'support'
    }
  ];

  const [activeComponent, setActiveComponent] = useState<string>('breathing');

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'breathing':
        return <BreathingExercise />;
      case 'mood':
        return <MoodTracker />;
      case 'meditation':
        return (
          <Card className="max-w-md mx-auto bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-6 text-center">
              <Headphones className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Meditation Library</h3>
              <p className="text-muted-foreground mb-4">
                Coming soon! A curated collection of guided meditations for students.
              </p>
              <Button className="gradient-primary text-primary-foreground border-0">
                Join Waitlist
              </Button>
            </CardContent>
          </Card>
        );
      case 'support':
        return (
          <Card className="max-w-md mx-auto bg-background/50 backdrop-blur-sm">
            <CardContent className="pt-6 text-center space-y-4">
              <MessageCircle className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold">Crisis Support</h3>
              <div className="space-y-3 text-left">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">National Suicide Prevention Lifeline</h4>
                  <p className="text-muted-foreground text-sm">988 (24/7)</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">Crisis Text Line</h4>
                  <p className="text-muted-foreground text-sm">Text HOME to 741741</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium">SAMHSA National Helpline</h4>
                  <p className="text-muted-foreground text-sm">1-800-662-4357</p>
                </div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0">
                Find Local Resources
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return <BreathingExercise />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for{' '}
              <span className="gradient-primary bg-clip-text text-transparent">
                Mental Wellness
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and resources designed specifically for students navigating academic stress and life transitions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
                  <CardHeader>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.highlights.map((highlight) => (
                        <div key={highlight} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools Section */}
      <section id="tools" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={toolsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={toolsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Try Our{' '}
              <span className="gradient-primary bg-clip-text text-transparent">
                Interactive Tools
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience immediate relief and build lasting wellness habits with our student-focused tools.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tool Selection */}
              <div className="space-y-4">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={toolsInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        activeComponent === tool.component 
                          ? 'border-primary bg-primary/5' 
                          : 'bg-background/50 backdrop-blur-sm'
                      }`}
                      onClick={() => setActiveComponent(tool.component)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          activeComponent === tool.component 
                            ? 'gradient-primary' 
                            : 'bg-muted'
                        }`}>
                          <tool.icon className={`h-6 w-6 ${
                            activeComponent === tool.component 
                              ? 'text-primary-foreground' 
                              : 'text-muted-foreground'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{tool.title}</h3>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        <ArrowRight className={`h-5 w-5 transition-colors ${
                          activeComponent === tool.component 
                            ? 'text-primary' 
                            : 'text-muted-foreground'
                        }`} />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Active Component Display */}
              <motion.div
                key={activeComponent}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                {renderActiveComponent()}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={resourcesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={resourcesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to{' '}
              <span className="gradient-primary bg-clip-text text-transparent">
                Start Your Journey?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students who are prioritizing their mental health and building resilience for academic success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 py-3 text-lg">
                <a href="/auth">Create Free Account</a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                Browse Resources
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: '10,000+', label: 'Students Supported' },
              { number: '500+', label: 'Daily Check-ins' },
              { number: '95%', label: 'Feel More Confident' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={resourcesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">MindEase</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Supporting student mental health, one check-in at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Crisis Resources</a>
              <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
            </div>
            <div className="mt-6 text-xs text-muted-foreground">
              © 2024 MindEase. Built with care for student mental health.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
