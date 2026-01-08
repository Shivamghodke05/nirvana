import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Brain, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Mindfulness Tools',
      description: 'Breathing exercises and meditation guides'
    },
    {
      icon: Heart,
      title: 'Mood Tracking',
      description: 'Daily check-ins and emotional insights'
    },
    {
      icon: Users,
      title: 'Peer Support',
      description: 'Connect with others on similar journeys'
    },
    {
      icon: Shield,
      title: 'Safe Space',
      description: 'Private, secure, and judgment-free'
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center gradient-calm overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Mental Health{' '}
              <span className="gradient-primary bg-clip-text text-transparent">
                Companion
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A safe, supportive space for students to find balance, connect with resources, 
              and prioritize their mental wellbeing.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 px-8 py-3 text-lg">
                <a href="/auth">Start Your Journey</a>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="p-6 text-center bg-background/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 gradient-primary rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;