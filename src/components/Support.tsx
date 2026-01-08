import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Users, 
  LifeBuoy 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SupportContact {
  name: string;
  description: string;
  phone: string;
  type: 'helpline' | 'government' | 'counseling';
}

const indianSupportContacts: SupportContact[] = [
  {
    name: "Vandrevala Foundation",
    description: "A 24/7 helpline providing free psychological counseling and crisis intervention.",
    phone: "9999666555",
    type: 'helpline',
  },
  {
    name: "KIRAN Mental Health Helpline",
    description: "A 24/7 national helpline by the Ministry of Social Justice and Empowerment for anxiety, stress, depression, and other mental health concerns.",
    phone: "1800-599-0019",
    type: 'government',
  },
  {
    name: "iCALL Psychosocial Helpline",
    description: "A service by the Tata Institute of Social Sciences (TISS) offering free telephone and email-based counseling.",
    phone: "022-25521111",
    type: 'counseling',
  },
  {
    name: "AASRA",
    description: "A 24/7 helpline for those who are distressed, depressed, or suicidal. Provides emotional support and crisis intervention.",
    phone: "9820466726",
    type: 'helpline',
  },
  {
    name: "NIMHANS",
    description: "The National Institute of Mental Health and Neuro-Sciences offers a 24/7 toll-free helpline for individuals experiencing mental health distress.",
    phone: "080-46110007",
    type: 'government',
  },
  {
    name: "Mitram Foundation",
    description: "A suicide prevention helpline that offers emotional support to those who are distressed, depressed, or suicidal.",
    phone: "080-25722573",
    type: 'helpline',
  },
    {
    name: "Connecting NGO",
    description: "A non-judgmental listening service for those feeling distressed and suicidal.",
    phone: "9922001122",
    type: 'counseling',
  }
];

const Support: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Get Support</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          You are not alone. Reach out to these verified organizations for professional help, counseling, and emotional support in India.
        </p>
      </div>

      {/* Main Helpline Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gradient-hero text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <LifeBuoy className="h-6 w-6" />
              KIRAN National Helpline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-primary-foreground/80">
              A 24/7 toll-free helpline by the Government of India for anyone experiencing anxiety, stress, depression, or other mental health concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:1800-599-0019" className="w-full">
                <Button className="w-full gradient-accent text-accent-foreground border-0">
                  <Phone className="mr-2 h-4 w-4" /> Call Now: 1800-599-0019
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Other Helplines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {indianSupportContacts.map((contact, index) => (
          <motion.div
            key={contact.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <Card className="h-full bg-background/50 backdrop-blur-sm flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{contact.name}</CardTitle>
                <span 
                  className={`text-xs font-semibold px-2 py-1 rounded-full w-min ${
                    contact.type === 'helpline' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                    contact.type === 'government' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                  {contact.type}
                </span>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow p-6">
                <p className="text-muted-foreground text-sm flex-grow">
                  {contact.description}
                </p>
                <div className="mt-4">
                  <a href={`tel:${contact.phone}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <Phone className="mr-2 h-4 w-4" /> Call {contact.phone}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* General Contact Options */}
      <Card className="bg-background/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Other Ways to Connect</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" /> Email Support
          </Button>
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" /> Live Chat
          </Button>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Community Forum
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
