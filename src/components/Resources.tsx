import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  BookOpen, 
  Mic, 
  Film, 
  Star, 
  ExternalLink,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'podcast' | 'video';
  rating: number;
  category: string;
  url: string;
}

const allResources: Resource[] = [
  // Articles
  {
    id: 1,
    title: "Understanding Anxiety Disorders",
    description: "An in-depth guide from the National Institute of Mental Health (NIMH) on different types of anxiety disorders, their symptoms, and treatment options.",
    type: 'article',
    rating: 4.8,
    category: 'anxiety',
    url: 'https://www.psychiatry.org/patients-families/anxiety-disorders/what-are-anxiety-disorders'
  },
  {
    id: 2,
    title: "How to Meditate",
    description: "A beginner-friendly article from Mindful.org that walks you through the basics of mindfulness meditation.",
    type: 'article',
    rating: 4.7,
    category: 'mindfulness',
    url: 'https://www.nytimes.com/article/how-to-meditate.html'
  },
  {
    id: 3,
    title: "The 4-7-8 Breath: A Simple and Effective Breathing Technique",
    description: "Learn about the 4-7-8 breathing technique, a powerful tool for managing stress and promoting relaxation.",
    type: 'article',
    rating: 4.9,
    category: 'breathing',
    url: 'https://www.medicalnewstoday.com/articles/324417'
  },
  {
    id: 4,
    title: "Building Better Mental Health",
    description: "Actionable tips from HelpGuide.org on how to improve your mental and emotional health, build resilience, and strengthen your well-being.",
    type: 'article',
    rating: 4.8,
    category: 'wellness',
    url: 'https://www.helpguide.org/articles/mental-health/building-better-mental-health.htm'
  },

  // Podcasts
  {
    id: 5,
    title: "If you are struggling with anxiety, This podcast will change your life",
    description: "In this episode, you’re invited to sit in on a really personal and raw conversation with our 17-year-old son, Oakley.",
    type: 'podcast',
    rating: 4.9,
    category: 'anxiety',
    url: 'https://open.spotify.com/embed/episode/6MUUMQmE6iSeqcyFyxuYIm?utm_source=generator'
  },
  {
    id: 6,
    title: "The Happiness Lab",
    description: "Dr. Laurie Santos of Yale University shares surprising and inspiring stories that will change the way you think about happiness.",
    type: 'podcast',
    rating: 4.8,
    category: 'wellness',
    url: 'https://open.spotify.com/embed/show/3i5TCKhc6GY42pOWkpWveG'
  },
  {
    id: 7,
    title: "Feel Better, Live More",
    description: "Dr. Rangan Chatterjee provides simple, actionable advice to help you improve your overall health and well-being.",
    type: 'podcast',
    rating: 4.9,
    category: 'wellness',
    url: 'https://open.spotify.com/embed/episode/4ap8eCUfHIQEsVbU1cuP94?utm_source=generator'
  },
  
  // Videos
  {
    id: 8,
    title: "10-Minute Guided Meditation for Beginners",
    description: "A simple and effective guided meditation from Headspace to help you start your mindfulness journey.",
    type: 'video',
    rating: 4.8,
    category: 'mindfulness',
    url: 'https://www.youtube.com/embed/Evgx9yX2Vw8?si=zqdEbBZNv7S6oKM8'
  },
  {
    id: 9,
    title: "How to Cope with Anxiety | A Clinical Psychologist Explains",
    description: "A clinical psychologist breaks down the science of anxiety and offers practical coping strategies.",
    type: 'video',
    rating: 4.9,
    category: 'anxiety',
    url: 'https://www.youtube.com/embed/WWloIAQpMcQ'
  },
  {
    id: 10,
    title: "The Power of Vulnerability",
    description: "Brené Brown's iconic TED talk on the importance of vulnerability in building meaningful connections.",
    type: 'video',
    rating: 5.0,
    category: 'wellness',
    url: 'https://www.youtube.com/embed/iCvmsMzlF7o'
  },
];

const ResourceModal = ({ resource, onClose }: { resource: Resource; onClose: () => void }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100vh", opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-background rounded-lg shadow-2xl w-full max-w-4xl h-[90%] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{resource.title}</CardTitle>
            <p className="text-sm text-muted-foreground truncate">{resource.description}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-4">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <div className="h-full w-full">
          <iframe 
            src={resource.url}
            title={resource.title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        </div>
      </motion.div>
    </div>
  );
};


const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const filteredResources = useMemo(() => {
    return allResources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const openResource = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const closeResource = () => {
    setSelectedResource(null);
  };

  const renderResourceList = (type: 'article' | 'podcast' | 'video') => {
    const resources = filteredResources.filter(r => r.type === type);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <motion.div
            key={resource.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Card className="h-full flex flex-col bg-background/50 backdrop-blur-sm hover:bg-muted/30 transition-colors duration-300">
              <CardContent className="p-6 flex-grow flex flex-col">
                <div className="flex-grow">
                  <Badge variant="outline" className="mb-3">{resource.category}</Badge>
                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold">{resource.rating}</span>
                  </div>
                  <Button 
                    onClick={() => openResource(resource)}
                    className="gradient-accent text-accent-foreground border-0"
                  >
                    {resource.type === 'article' && <BookOpen className="h-4 w-4 mr-2" />}
                    {resource.type === 'podcast' && <Mic className="h-4 w-4 mr-2" />}
                    {resource.type === 'video' && <Film className="h-4 w-4 mr-2" />}
                    {resource.type === 'article' ? 'Read' : (resource.type === 'podcast' ? 'Listen' : 'Watch')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Explore curated articles, podcasts, and videos to support your mental well-being.</p>
        <div className="relative mt-6 max-w-lg">
          <Input 
            placeholder="Search for topics like 'anxiety', 'meditation'..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg mb-6">
          <TabsTrigger value="articles">
            <BookOpen className="h-4 w-4 mr-2" /> Articles
          </TabsTrigger>
          <TabsTrigger value="podcasts">
            <Mic className="h-4 w-4 mr-2" /> Podcasts
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Film className="h-4 w-4 mr-2" /> Videos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">{renderResourceList('article')}</TabsContent>
        <TabsContent value="podcasts">{renderResourceList('podcast')}</TabsContent>
        <TabsContent value="videos">{renderResourceList('video')}</TabsContent>
      </Tabs>

      <AnimatePresence>
        {selectedResource && (
          <ResourceModal resource={selectedResource} onClose={closeResource} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Resources;
