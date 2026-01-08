import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Sun, Cloud, CloudRain, Heart, Zap, Coffee, BarChartHorizontal } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, query, onSnapshot, orderBy, doc, setDoc } from "firebase/firestore";

interface MoodEntry {
  id: string;
  date: string;
  mood: number;
  energy: number;
  note: string;
  tags: string[];
}

interface MoodTrackerProps {
  userId: string;
}

const moodEmojis = [
  { icon: Frown, color: 'text-red-500', label: 'Struggling' },
  { icon: CloudRain, color: 'text-orange-500', label: 'Low' },
  { icon: Cloud, color: 'text-yellow-500', label: 'Okay' },
  { icon: Sun, color: 'text-blue-500', label: 'Good' },
  { icon: Smile, color: 'text-green-500', label: 'Great' },
];

const energyLevels = [
  { icon: Coffee, label: 'Exhausted' },
  { icon: Cloud, label: 'Tired' },
  { icon: Meh, label: 'Neutral' },
  { icon: Zap, label: 'Energetic' },
  { icon: Heart, label: 'Vibrant' },
];

const commonTags = [
  'anxious', 'stressed', 'grateful', 'accomplished', 'lonely',
  'excited', 'overwhelmed', 'peaceful', 'motivated', 'tired'
];

const formatRelativeDate = (dateString: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const entryDate = new Date(dateString);
    entryDate.setUTCHours(0, 0, 0, 0);
    today.setUTCHours(0, 0, 0, 0);
    yesterday.setUTCHours(0, 0, 0, 0);

    if (entryDate.getTime() === today.getTime()) return 'Today';
    if (entryDate.getTime() === yesterday.getTime()) return 'Yesterday';
    return new Date(dateString).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
};

const MoodTracker: React.FC<MoodTrackerProps> = ({ userId }) => {
  const [currentMood, setCurrentMood] = useState<number | null>(null);
  const [currentEnergy, setCurrentEnergy] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (userId) {
      const q = query(collection(db, "users", userId, "moodEntries"), orderBy("date", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const moodEntries: MoodEntry[] = [];
        querySnapshot.forEach((doc) => {
          moodEntries.push({ id: doc.id, ...doc.data() } as MoodEntry);
        });
        setEntries(moodEntries);
      }, (error) => {
        console.error("Error in MoodTracker snapshot listener:", error);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  const handleSubmitEntry = async () => {
    if (currentMood === null || currentEnergy === null || !userId) return;
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = entries.find(entry => entry.date === today);
    const newEntryData = { date: today, mood: currentMood, energy: currentEnergy, note, tags: selectedTags };

    if (todayEntry) {
      await setDoc(doc(db, "users", userId, "moodEntries", todayEntry.id), newEntryData, { merge: true });
    } else {
      await addDoc(collection(db, "users", userId, "moodEntries"), newEntryData);
    }
    
    setCurrentMood(null);
    setCurrentEnergy(null);
    setNote('');
    setSelectedTags([]);
    setShowForm(false);
  };

  const toggleTag = (tag: string) => setSelectedTags(p => p.includes(tag) ? p.filter(t => t !== tag) : [...p, tag]);
  
  const todayEntry = useMemo(() => entries.find(e => e.date === new Date().toISOString().split('T')[0]), [entries]);
  const recentEntries = useMemo(() => entries.slice(0, 5), [entries]);

  const overviewData = useMemo(() => {
    if (entries.length === 0) return null;

    const moodCounts = entries.reduce((acc, entry) => {
      const label = moodEmojis[entry.mood].label;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const tagCounts = entries.reduce((acc, entry) => {
      entry.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const last7Days = entries.slice(0, 7).reverse();

    return { sortedMoods, sortedTags, last7Days };
  }, [entries]);

  const mainContent = (
    <>
      {todayEntry && !showForm ? (
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10"><CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Check-in Complete!</h3>
            <div className="flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Mood</div>
                {React.createElement(moodEmojis[todayEntry.mood].icon, { className: `h-8 w-8 ${moodEmojis[todayEntry.mood].color}` })}
                <div className="text-xs text-muted-foreground mt-1">{moodEmojis[todayEntry.mood].label}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Energy</div>
                {React.createElement(energyLevels[todayEntry.energy].icon, { className: 'h-8 w-8 text-accent' })}
                <div className="text-xs text-muted-foreground mt-1">{energyLevels[todayEntry.energy].label}</div>
              </div>
            </div>
            {todayEntry.tags.length > 0 && <div className="flex flex-wrap gap-2 justify-center">{todayEntry.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>}
            <Button variant="outline" onClick={() => setShowForm(true)} className="mt-4">Update Today's Entry</Button>
          </div>
        </CardContent></Card>
      ) : (
        <Card className="bg-background/50 backdrop-blur-sm"><CardHeader><CardTitle>How are you feeling today?</CardTitle></CardHeader><CardContent className="space-y-6">
          <div><label className="text-sm font-medium text-foreground mb-3 block">Your mood right now:</label><div className="flex justify-between gap-2">{moodEmojis.map((mood, index) => <motion.button key={index} onClick={() => setCurrentMood(index)} className={`p-3 rounded-xl border-2 transition-all ${currentMood === index ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{React.createElement(mood.icon, { className: `h-6 w-6 mx-auto ${mood.color}` })}<div className="text-xs mt-1 text-muted-foreground">{mood.label}</div></motion.button>)}</div></div>
          <div><label className="text-sm font-medium text-foreground mb-3 block">Your energy level:</label><div className="flex justify-between gap-2">{energyLevels.map((energy, index) => <motion.button key={index} onClick={() => setCurrentEnergy(index)} className={`p-3 rounded-xl border-2 transition-all ${currentEnergy === index ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/50'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>{React.createElement(energy.icon, { className: 'h-6 w-6 mx-auto text-accent' })}<div className="text-xs mt-1 text-muted-foreground">{energy.label}</div></motion.button>)}</div></div>
          <div><label className="text-sm font-medium text-foreground mb-3 block">What describes your day? (optional)</label><div className="flex flex-wrap gap-2">{commonTags.map(tag => <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => toggleTag(tag)}>{tag}</Badge>)}</div></div>
          <div><label className="text-sm font-medium text-foreground mb-3 block">Any thoughts to capture? (optional)</label><Textarea placeholder="What's on your mind today..." value={note} onChange={(e) => setNote(e.target.value)} className="min-h-20"/></div>
          <Button onClick={handleSubmitEntry} disabled={currentMood === null || currentEnergy === null} className="w-full gradient-primary text-primary-foreground border-0" size="lg">Save Today's Check-in</Button>
        </CardContent></Card>
      )}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checkin">Daily Check-in</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>
        <TabsContent value="checkin" className="pt-6">
          {mainContent}
          {recentEntries.length > 0 && (
            <Card className="bg-background/50 backdrop-blur-sm mt-6"><CardHeader><CardTitle className="text-lg">Recent Check-ins</CardTitle></CardHeader><CardContent><div className="space-y-3">
              {recentEntries.map((entry) => (
                <motion.div key={entry.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3"><div className="text-sm font-semibold text-muted-foreground w-20">{formatRelativeDate(entry.date)}</div><div className="flex items-center gap-2">{React.createElement(moodEmojis[entry.mood].icon, { className: `h-5 w-5 ${moodEmojis[entry.mood].color}` })}{React.createElement(energyLevels[entry.energy].icon, { className: 'h-5 w-5 text-accent' })}</div></div>
                  {entry.tags.length > 0 && <div className="flex gap-1 flex-wrap">{entry.tags.slice(0, 2).map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}</div>}
                </motion.div>
              ))}
            </div></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="overview" className="pt-6">
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChartHorizontal/> Mood & Energy Overview</CardTitle>
              <CardDescription>Your emotional trends based on your check-ins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {!overviewData ? (
                <div className="text-center py-12 text-muted-foreground">Log your first mood entry to see your overview!</div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Last 7 Days Mood</h3>
                    <div className="flex h-32 items-end gap-2 p-4 rounded-lg bg-muted/50">
                      {overviewData.last7Days.map((entry) => (
                        <div key={entry.id} className="flex-1 text-center group relative">
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {moodEmojis[entry.mood].label}
                          </div>
                          <motion.div
                            initial={{height: '0%'}}
                            animate={{height: `${(entry.mood / (moodEmojis.length -1)) * 100}%`}}
                            className="bg-primary rounded-t-lg mx-auto w-3/4"
                          ></motion.div>
                          <div className="text-xs text-muted-foreground mt-1">{formatRelativeDate(entry.date)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Frequent Moods</h3>
                      <div className="space-y-2">
                        {overviewData.sortedMoods.map(([label, count]) => (
                          <div key={label} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{label}</span>
                            <span className="text-muted-foreground">{count} {count > 1 ? 'days' : 'day'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Frequent Tags</h3>
                      <div className="space-y-2">
                      {overviewData.sortedTags.length > 0 ? overviewData.sortedTags.map(([tag, count]) => (
                          <div key={tag} className="flex items-center justify-between text-sm">
                            <span className="font-medium">{tag}</span>
                            <span className="text-muted-foreground">{count}</span>
                          </div>
                        )) : (
                          <p className="text-sm text-muted-foreground">No tags used yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MoodTracker;
