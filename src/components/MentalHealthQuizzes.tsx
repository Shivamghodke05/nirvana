
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Award, Target, Zap, Activity, Shield, FileText, Star } from 'lucide-react';
import { toast } from 'sonner';

const quizzes = [
    {
    id: 'phq-9',
    title: 'PHQ-9 Depression Screener',
    icon: <Target className="h-8 w-8 text-red-500" />,
    questions: [
      { question: "Little interest or pleasure in doing things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Feeling down, depressed, or hopeless?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Trouble falling or staying asleep, or sleeping too much?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Feeling tired or having little energy?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Poor appetite or overeating?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Feeling bad about yourself, or that you are a failure or have let yourself or your family down?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Trouble concentrating on things, such as reading the newspaper or watching television?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
      { question: "Thoughts that you would be better off dead, or of hurting yourself in some way?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] }
    ],
    results: {
      low: "Your score suggests minimal to mild depression. Monitoring your mood and maintaining self-care are recommended.",
      mild: "Your score suggests mild to moderate depression. Consider talking to a healthcare provider about your symptoms.",
      moderate: "Your score suggests moderate to severe depression. It is highly recommended to consult a mental health professional.",
      severe: "Your score indicates severe depression. Please seek professional help immediately. You are not alone and help is available.",
    }
  },
  {
    id: 'gad-7',
    title: 'GAD-7 Anxiety Screener',
    icon: <Brain className="h-8 w-8 text-blue-500" />,
    questions: [
        { question: "Feeling nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
        { question: "Not being able to stop or control worrying?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
        { question: "Worrying too much about different things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
        { question: "Trouble relaxing?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
        { question: "Being so restless that it is hard to sit still?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
        { question: "Becoming easily annoyed or irritable?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] },
        { question: "Feeling afraid, as if something awful might happen?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"], points: [0, 1, 2, 3] }
    ],
    results: {
      low: "Your score suggests minimal to mild anxiety. Practicing mindfulness and relaxation techniques can be beneficial.",
      mild: "Your score suggests mild to moderate anxiety. A healthcare provider can help you explore coping strategies.",
      moderate: "Your score suggests moderate to severe anxiety. Professional support from a therapist or counselor is strongly recommended.",
      severe: "Your score indicates severe anxiety. It is important to seek professional help as soon as possible.",
    }
  },
  {
    id: 'who-5',
    title: 'WHO-5 Well-being Index',
    icon: <Activity className="h-8 w-8 text-green-500" />,
    questions: [
      { question: "I have felt cheerful and in good spirits.", options: ["At no time", "Some of the time", "Less than half of the time", "More than half of the time", "Most of the time", "All of the time"], points: [0, 1, 2, 3, 4, 5] },
      { question: "I have felt calm and relaxed.", options: ["At no time", "Some of the time", "Less than half of the time", "More than half of the time", "Most of the time", "All of the time"], points: [0, 1, 2, 3, 4, 5] },
      { question: "I have felt active and vigorous.", options: ["At no time", "Some of the time", "Less than half of the time", "More than half of the time", "Most of the time", "All of the time"], points: [0, 1, 2, 3, 4, 5] },
      { question: "I woke up feeling fresh and rested.", options: ["At no time", "Some of the time", "Less than half of the time", "More than half of the time", "Most of the time", "All of the time"], points: [0, 1, 2, 3, 4, 5] },
      { question: "My daily life has been filled with things that interest me.", options: ["At no time", "Some of the time", "Less than half of the time", "More than half of the time", "Most of the time", "All of the time"], points: [0, 1, 2, 3, 4, 5] }
    ],
    results: {
        low: "Your well-being score is low. It's important to prioritize self-care and consider talking to someone about how you're feeling.",
        mild: "Your well-being score is moderate. There's room for improvement, and focusing on enjoyable activities may help.",
        moderate: "You have a good level of well-being. Keep doing what you're doing!",
        severe: "You have a high level of well-being. That's fantastic!",
    }
  },
  {
    id: 'pss',
    title: 'Perceived Stress Scale',
    icon: <Shield className="h-8 w-8 text-purple-500" />,
    questions: [
      { question: "In the last month, how often have you been upset because of something that happened unexpectedly?", options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you felt that you were unable to control the important things in your life?", options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you felt nervous and stressed?", options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you felt confident about your ability to handle your personal problems?", options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you felt that things were going your way?", options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you found that you could not cope with all the things that you had to do?", options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you been able to control irritations in your life?", options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you felt that you were on top of things?", options: ["Very Often", "Fairly Often", "Sometimes", "Almost Never", "Never"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you been angered because of things that were outside of your control?", options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], points: [0, 1, 2, 3, 4] },
      { question: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?", options: ["Never", "Almost Never", "Sometimes", "Fairly Often", "Very Often"], points: [0, 1, 2, 3, 4] },
    ],
    results: {
      low: "You seem to be experiencing a low level of stress. That's great!",
      mild: "Your stress level appears to be moderate. Consider incorporating stress-management techniques into your routine.",
      moderate: "You may be experiencing a high level of stress. It could be beneficial to identify stressors and develop coping mechanisms.",
      severe: "Your score indicates a very high level of perceived stress. Seeking support from a professional is highly recommended.",
    }
  },
  {
    id: 'dass-21',
    title: 'DASS-21 Screener',
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    questions: [
      { question: "I found it hard to wind down.", points: [0, 1, 2, 3] },
      { question: "I was aware of dryness of my mouth.", points: [0, 1, 2, 3] },
      { question: "I couldn’t seem to experience any positive feeling at all.", points: [0, 1, 2, 3] },
      { question: "I experienced breathing difficulty.", points: [0, 1, 2, 3] },
      { question: "I found it difficult to work up the initiative to do things.", points: [0, 1, 2, 3] },
      { question: "I tended to over-react to situations.", points: [0, 1, 2, 3] },
      { question: "I experienced trembling (e.g. in the hands).", points: [0, 1, 2, 3] },
      { question: "I felt that I was using a lot of nervous energy.", points: [0, 1, 2, 3] },
      { question: "I was worried about situations in which I might panic and make a fool of myself.", points: [0, 1, 2, 3] },
      { question: "I felt that I had nothing to look forward to.", points: [0, 1, 2, 3] },
      { question: "I found myself getting agitated.", points: [0, 1, 2, 3] },
      { question: "I found it difficult to relax.", points: [0, 1, 2, 3] },
      { question: "I felt down-hearted and blue.", points: [0, 1, 2, 3] },
      { question: "I was intolerant of anything that kept me from gettin on with what I was doing.", points: [0, 1, 2, 3] },
      { question: "I felt I was close to panic.", points: [0, 1, 2, 3] },
      { question: "I was unable to become enthusiastic about anything.", points: [0, 1, 2, 3] },
      { question: "I felt I wasn’t worth much as a person.", points: [0, 1, 2, 3] },
      { question: "I felt that I was rather touchy.", points: [0, 1, 2, 3] },
      { question: "I was aware of the action of my heart in the absence of physical exertion.", points: [0, 1, 2, 3] },
      { question: "I felt scared without any good reason.", points: [0, 1, 2, 3] },
      { question: "I felt that life was meaningless.", points: [0, 1, 2, 3] },
    ],
    options: ["Did not apply to me at all", "Applied to me to some degree", "Applied to me a considerable degree", "Applied to me very much"],
    results: {
      depression: "Depression Score (multiply by 2): ",
      anxiety: "Anxiety Score (multiply by 2): ",
      stress: "Stress Score (multiply by 2): ",
    }
  },
  {
    id: 'mdq',
    title: 'Mood Disorder Questionnaire',
    icon: <Star className="h-8 w-8 text-indigo-500" />,
    questions: [
      { question: "Has there ever been a period of time when you were not your usual self and...you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?", points: [0, 1] },
      { question: "...you were so irritable that you shouted at people or started fights or arguments?", points: [0, 1] },
      { question: "...you felt much more self-confident than usual?", points: [0, 1] },
      { question: "...you got much less sleep than usual and found you didn’t really miss it?", points: [0, 1] },
      { question: "...you were much more talkative or spoke much faster than usual?", points: [0, 1] },
      { question: "...thoughts raced through your head or you couldn’t slow your mind down?", points: [0, 1] },
      { question: "...you were so easily distracted by things around you that you had trouble concentrating or staying on track?", points: [0, 1] },
      { question: "...you were much more active or did many more things than usual?", points: [0, 1] },
      { question: "...you were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?", points: [0, 1] },
      { question: "...you were much more interested in sex than usual?", points: [0, 1] },
      { question: "...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?", points: [0, 1] },
      { question: "...spending money got you or your family into trouble?", points: [0, 1] },
    ],
    options: ["No", "Yes"],
    results: {
      positive: "A positive screen suggests the possibility of a mood disorder. It is recommended to consult with a healthcare professional for a comprehensive evaluation.",
      negative: "A negative screen suggests that a mood disorder is unlikely, but it does not rule it out. If you have concerns, please speak with a healthcare provider.",
    }
  }
];

const QuizComponent = ({ quiz, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const handleFinish = () => {
    setIsQuizFinished(true);
    toast.success("Quiz completed!");
  }

  const handleAnswer = (points: number) => {
    const newScore = score + points;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setScore(newScore);
    } else {
      setScore(newScore);
      handleFinish();
    }
  };

  const getResult = (finalScore) => {
    if (quiz.id === 'dass-21') {
      return `Check DASS-21 scoring guidelines. Your raw score is ${finalScore}.`;
    } else if (quiz.id === 'mdq') {
      return finalScore >= 7 ? quiz.results.positive : quiz.results.negative;
    }
    const totalPoints = quiz.questions.reduce((max, q) => Math.max(max, ...q.points), 0) * quiz.questions.length;
    const percentage = (finalScore / totalPoints) * 100;

    if (quiz.id === 'who-5') {
        if (percentage > 75) return quiz.results.severe;
        if (percentage > 50) return quiz.results.moderate;
        if (percentage > 25) return quiz.results.mild;
        return quiz.results.low;
    }

    if (percentage < 25) return quiz.results.low;
    if (percentage < 50) return quiz.results.mild;
    if (percentage < 75) return quiz.results.moderate;
    return quiz.results.severe;
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsQuizFinished(false);
  }

  if (isQuizFinished) {
    return (
      <Card className="w-full max-w-xl mx-auto bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Award className="h-6 w-6 text-yellow-500" /> Results</CardTitle>
          <CardDescription>You've completed the {quiz.title} quiz!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-lg">{getResult(score)}</p>
          <div className="flex gap-4 mt-6">
            <Button onClick={restartQuiz}>Take Again</Button>
            <Button variant="outline" onClick={onBack}>Choose Another Quiz</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Card className="w-full max-w-xl mx-auto bg-background/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={onBack}>&larr; Back</Button>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </CardHeader>
      <CardContent className="mt-6">
        <p className="mb-6 font-semibold text-xl text-center">{currentQuestion.question}</p>
        <div className="grid grid-cols-1 gap-3">
          {(quiz.options || currentQuestion.options).map((option, index) => (
            <Button 
              key={index}
              variant="outline"
              className="h-auto py-4 justify-center text-center whitespace-normal text-base hover:bg-primary/10"
              onClick={() => handleAnswer(currentQuestion.points[index])}
            >
              {option}
            </Button>
          ))}\
        </div>
      </CardContent>
    </Card>
  );
};

export const MentalHealthQuizzes = ({ userId }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  if (selectedQuiz) {
    return <QuizComponent quiz={selectedQuiz} onBack={() => setSelectedQuiz(null)} />;
  }

  return (
    <div className="p-4 md:p-6">
        <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3"><Zap className="h-8 w-8 text-yellow-400"/>Mental Health Check-in</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">These screeners are not a diagnosis, but can be a helpful way to check in with yourself. Your results are saved for your personal tracking.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {quizzes.map(quiz => (
                <Card 
                    key={quiz.id} 
                    className="cursor-pointer hover:shadow-xl transition-shadow duration-300 bg-background/50 backdrop-blur-sm flex flex-col"
                    onClick={() => setSelectedQuiz(quiz)}
                >
                    <CardHeader className="flex flex-row items-start gap-4 pb-4">
                        {React.cloneElement(quiz.icon, { key: quiz.id })}
                        <div>
                            <CardTitle className="text-xl">{quiz.title}</CardTitle>
                            <CardDescription>{quiz.questions.length} questions</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-end">
                       <Button variant="secondary" className="w-full">Start Quiz</Button>
                    </CardContent>
                </Card>
            ))}\
        </div>
    </div>
  )
}
