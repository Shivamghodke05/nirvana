import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  CheckCircle,
  Video,
  Users,
  Heart,
  MessageCircle,
  DollarSign,
  CreditCard,
  QrCode
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import emailjs from 'emailjs-com';
import { onAuthStateChanged } from 'firebase/auth';

// TODO: Replace with a real payment provider SDK (e.g., Razorpay, Stripe)

interface Therapist {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  experience: string;
  rate: string;
  availability: string[];
  image: string;
  bio: string;
  isPinned?: boolean;
}

interface Appointment {
  id: string;
  therapist: string;
  date: Date;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const Booking: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<string>('');

  const therapists: Therapist[] = [
    {
      id: '0',
      name: 'Dr. Nagesh Rajopadhye',
      title: 'College Counsellor',
      specialties: ['Student Stress', 'Career Guidance', 'Academic Pressure'],
      rating: 5.0,
      experience: '15 years',
      rate: 'Free for Students',
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      image: '',
      bio: 'Dedicated to helping students navigate the challenges of college life.',
      isPinned: true,
    },
    {
      id: '1',
      name: 'Dr. Piyush Udapurkar',
      title: 'Licensed Clinical Psychologist',
      specialties: ['Anxiety', 'Depression', 'Trauma', 'CBT'],
      rating: 4.9,
      experience: '12 years',
      rate: '₹400/session (Discounted for Students)',
      availability: ['Mon', 'Wed', 'Fri'],
      image: '',
      bio: 'Specializing in cognitive behavioral therapy and trauma-informed care.'
    },
    {
      id: '2',
      name: 'Dr. Shivam Ghodke',
      title: 'Clinical Psychologist',
      specialties: ['OCD', 'Phobias', 'Panic Attacks'],
      rating: 4.9,
      experience: '9 years',
      rate: '₹300/session (Discounted for Students)',
      availability: ['Mon', 'Tue', 'Wed', 'Thu'],
      image: '',
      bio: 'Specializes in exposure therapy and cognitive-behavioral techniques.'
    },
    {
      id: '3',
      name: 'Dr. Siddhi Gite',
      title: 'Licensed Marriage & Family Therapist',
      specialties: ['Couples Therapy', 'Counseling', 'Communication'],
      rating: 4.8,
      experience: '8 years',
      rate: '₹400/session (Discounted for Students)',
      availability: ['Tue', 'Thu', 'Sat'],
      image: '',
      bio: 'Helping couples and families build stronger, healthier relationships.'
    },
    {
      id: '4',
      name: 'Dr. Aditi Sorate',
      title: 'Licensed Social Worker',
      specialties: ['Teen Counseling', 'ADHD', 'Behavioral Issues'],
      rating: 4.7,
      experience: '6 years',
      rate: '₹300/session (Discounted for Students)',
      availability: ['Mon', 'Tue', 'Thu'],
      image: '',
      bio: 'Passionate about helping adolescents navigate life challenges.'
    },
    {
      id: '5',
      name: 'Dr. Vrushali Gaikwad',
      title: 'Psychiatrist',
      specialties: ['Depression', 'Bipolar Disorder', 'Anxiety'],
      rating: 4.8,
      experience: '10 years',
      rate: '₹400/session (Discounted for Students)',
      availability: ['Mon', 'Wed', 'Fri'],
      image: '',
      bio: 'Focuses on medication management and therapy for mood disorders.'
    },
    {
      id: '6',
      name: 'Dr. Pranav Wagh',
      title: 'Counseling Psychologist',
      specialties: ['Relationships', 'Stress Management', 'Self-esteem'],
      rating: 4.7,
      experience: '7 years',
      rate: '₹300/session (Discounted for Students)',
      availability: ['Tue', 'Thu', 'Sat'],
      image: '',
      bio: 'Empowering individuals to overcome personal challenges and improve their well-being.'
    },
    
  ];

  const appointmentTypes = [
    { id: 'individual', name: 'Individual Therapy', icon: User, duration: '50 min', description: 'One-on-one therapy session' },
    { id: 'couples', name: 'Couples Therapy', icon: Users, duration: '60 min', description: 'Relationship counseling' },
    { id: 'family', name: 'Family Therapy', icon: Heart, duration: '60 min', description: 'Family counseling session' },
    { id: 'consultation', name: 'Initial Consultation', icon: MessageCircle, duration: '30 min', description: 'First meeting to discuss needs' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        setContactInfo({
          name: user.displayName || '',
          email: user.email || '',
          phone: ''
        });

        const q = query(collection(db, "appointments"), where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        const userAppointments = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Appointment));
        setAppointments(userAppointments);
      } else {
        // User is signed out
        setAppointments([]);
        setContactInfo({ name: '', email: '', phone: '' });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !selectedTherapist || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!auth.currentUser) {
      toast({
        title: "Not Logged In",
        description: "Please log in to book an appointment.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement actual payment logic here with a payment provider
    // For now, we'll simulate a successful payment
    
    toast({
      title: "Payment Successful!",
      description: "Your payment has been processed.",
      duration: 2000,
    });

    const newAppointment = {
      therapist: therapists.find(t => t.id === selectedTherapist)?.name,
      date: selectedDate,
      time: selectedTime,
      type: appointmentTypes.find(t => t.id === appointmentType)?.name,
      status: 'upcoming' as 'upcoming',
      userEmail: auth.currentUser.email,
      notes,
    };

    try {
      const docRef = await addDoc(collection(db, "appointments"), newAppointment);
      setAppointments([...appointments, { ...newAppointment, id: docRef.id, date: selectedDate }]);
      
      const templateParams = {
        to_name: contactInfo.name || auth.currentUser.displayName,
        to_email: contactInfo.email || auth.currentUser.email,
        therapist_name: newAppointment.therapist,
        appointment_date: newAppointment.date.toLocaleDateString(),
        appointment_time: newAppointment.time,
        appointment_type: newAppointment.type,
      };

      await emailjs.send('service_d4lnf48', 'template_7f7cenm', templateParams, '4yra2Uc5ccaDBZDgj');

      toast({
        title: "Appointment Booked!",
        description: "You'll receive a confirmation email shortly.",
        duration: 3000,
      });

      // Reset only appointment-specific fields
      setSelectedTime('');
      setNotes('');
      setAppointmentType('');
      setSelectedTherapist('');
      setPaymentStep('');

    } catch (error) {
      console.error("Error booking appointment: ", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary/20 text-primary';
      case 'completed': return 'bg-success/20 text-success';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gradient-wellness text-wellness-foreground">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Book Your Therapy Session</h2>
                <p className="text-wellness-foreground/80">
                  Connect with licensed professionals who care about your wellbeing
                </p>
              </div>
              <div className="p-4 bg-wellness-foreground/20 rounded-lg">
                <CalendarIcon className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="book">Book Session</TabsTrigger>
          <TabsTrigger value="therapists">Our Therapists</TabsTrigger>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
        </TabsList>

        <TabsContent value="book" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Form */}
            <div className="space-y-6">
              {/* Appointment Type */}
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Session Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {appointmentTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          appointmentType === type.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:bg-muted/50'
                        }`}
                        onClick={() => setAppointmentType(type.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <type.icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{type.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{type.description}</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{type.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Therapist Selection */}
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Select Therapist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose your therapist" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapists.map((therapist) => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          <div className="flex items-center gap-2">
                            <span>{therapist.name}</span>
                            {therapist.isPinned && <Badge variant="destructive">College Counsellor</Badge>}
                            <Badge variant="secondary">{therapist.rate}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={contactInfo.name}
                      onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      placeholder="Enter your email"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Additional Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share any specific concerns, goals, or questions you'd like to discuss..."
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Calendar and Time Selection */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    className="rounded-md border mx-auto"
                  />
                </CardContent>
              </Card>

              {/* Time Selection */}
              <Card className="bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Available Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => setSelectedTime(time)}
                        className={`transition-all ${
                          selectedTime === time 
                            ? 'gradient-primary text-primary-foreground border-0' 
                            : ''
                        }`}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Summary */}
              {selectedDate && selectedTime && selectedTherapist && appointmentType && !paymentStep && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Booking Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium">
                          {selectedDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">
                          {appointmentTypes.find(t => t.id === appointmentType)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Therapist:</span>
                        <span className="font-medium">
                          {therapists.find(t => t.id === selectedTherapist)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate:</span>
                        <span className="font-medium">
                          {therapists.find(t => t.id === selectedTherapist)?.rate}
                        </span>
                      </div>
                      <Button 
                        onClick={() => setPaymentStep('payment')}
                        className="w-full gradient-primary text-primary-foreground border-0 mt-4"
                      >
                        Proceed to Payment
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Payment Section */}
              {paymentStep === 'payment' && (
                 <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3 }}
               >
                 <Card className="bg-background/50 backdrop-blur-sm">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <DollarSign className="h-5 w-5" />
                       Payment
                     </CardTitle>
                   </CardHeader>
                   <CardContent>
                     <Tabs defaultValue="card">
                       <TabsList className="grid w-full grid-cols-2">
                         <TabsTrigger value="card"><CreditCard className="h-4 w-4 mr-2" />Card</TabsTrigger>
                         <TabsTrigger value="qr"><QrCode className="h-4 w-4 mr-2" />QR Code</TabsTrigger>
                       </TabsList>
                       <TabsContent value="card" className="pt-4 space-y-4">
                         <div>
                           <Label htmlFor="cardNumber">Card Number</Label>
                           <Input id="cardNumber" placeholder="xxxx xxxx xxxx xxxx" />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <Label htmlFor="expiryDate">Expiry Date</Label>
                             <Input id="expiryDate" placeholder="MM/YY" />
                           </div>
                           <div>
                             <Label htmlFor="cvc">CVC</Label>
                             <Input id="cvc" placeholder="xxx" />
                           </div>
                         </div>
                         <Button 
                           onClick={handleBooking}
                           className="w-full gradient-primary text-primary-foreground border-0 mt-4"
                         >
                           Pay {therapists.find(t => t.id === selectedTherapist)?.rate.split('/')[0]}
                         </Button>
                       </TabsContent>
                       <TabsContent value="qr" className="pt-4 flex flex-col items-center space-y-3">
                          {/* TODO: Generate a real QR code using your payment provider */}
                         <div className="w-48 h-48 bg-gray-200 rounded-md flex items-center justify-center">
                           <p className="text-sm text-gray-500">[QR Code Placeholder]</p>
                         </div>
                         <p className="text-sm text-muted-foreground text-center">
                           Scan this QR code with any UPI app to complete the payment.
                         </p>
                         <Button 
                           onClick={handleBooking} // This would ideally check payment status
                           className="w-full gradient-primary text-primary-foreground border-0 mt-4"
                         >
                           Confirm Payment
                         </Button>
                       </TabsContent>
                     </Tabs>
                   </CardContent>
                 </Card>
               </motion.div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="therapists">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {therapists.map((therapist, index) => (
              <motion.div
                key={therapist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <img
                        src={therapist.image}
                        alt={therapist.name}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                      />
                      <h3 className="font-semibold">{therapist.name}</h3>
                      <p className="text-sm text-muted-foreground">{therapist.title}</p>
                      {therapist.isPinned && <Badge variant="destructive" className="mt-2">College Counsellor</Badge>}
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{therapist.rating}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-1">
                          {therapist.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Experience:</span>
                        <span>{therapist.experience}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Rate:</span>
                        <span className="font-medium">{therapist.rate}</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{therapist.bio}</p>
                      
                      <Button 
                        className="w-full gradient-primary text-primary-foreground border-0"
                        onClick={() => {
                          setSelectedTherapist(therapist.id);
                          // Switch to booking tab
                          const bookTab = document.querySelector('[value="book"]') as HTMLElement;
                          bookTab?.click();
                        }}
                      >
                        Book Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="appointments">
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-background/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-lg">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {appointment.therapist}
                          </p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm">
                              {new Date(appointment.date).toLocaleDateString()}
                            </span>
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.status === 'upcoming' && (
                          <div className="mt-2 space-y-1">
                            <Button size="sm" variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Join Session
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Booking;
