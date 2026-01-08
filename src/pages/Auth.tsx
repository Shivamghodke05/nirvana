import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, GraduationCap, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

type AuthMode = 'signin' | 'signup' | 'userType';
type UserType = 'student' | 'institute' | null;

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('userType');
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    institution: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.userType === 'institute') {
        navigate('/institute-dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
    setMode('signup');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        localStorage.setItem('user', JSON.stringify(userData));
        if (userData.userType === 'institute') {
          navigate('/institute-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          userType: 'student', // Default to student
          institution: ''
        };
        await setDoc(userDocRef, userData);
        localStorage.setItem('user', JSON.stringify(userData));
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const userData = {
          uid: user.uid,
          email: formData.email,
          name: formData.name,
          userType: userType,
          institution: formData.institution,
        };

        await setDoc(doc(db, "users", user.uid), userData);
        localStorage.setItem('user', JSON.stringify(userData));

        if (userType === 'institute') {
          navigate('/institute-dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          setError('This email is already in use. Please sign in.');
        } else {
          setError('Failed to create an account. Please try again.');
          console.error("Error during sign-up:", error);
        }
      } finally {
        setLoading(false);
      }
    } else { // signin mode
      try {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          localStorage.setItem('user', JSON.stringify(userData));

          if (userData.userType === 'institute') {
            navigate('/institute-dashboard', { replace: true });
          } else {
            navigate('/dashboard', { replace: true });
          }
        } else {
          setError("User data not found. Please sign up.");
          auth.signOut();
        }
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          setError('Invalid email or password. Please try again.');
        } else {
          setError('Failed to sign in. Please try again.');
          console.error("Error during sign-in:", error);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (mode === 'userType') {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <img src="/logo.png" alt="NIRVANA" className="h-12 w-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              Welcome to NIRVANA
            </h1>
            <p className="text-muted-foreground mt-2">
              Choose how you'd like to continue
            </p>
          </div>

          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm"
                onClick={() => handleUserTypeSelection('student')}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">I'm a Student</h3>
                    <p className="text-muted-foreground text-sm">
                      Access mental health tools, mood tracking, and peer support
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm"
                onClick={() => handleUserTypeSelection('institute')}
              >
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">I'm from an Institution</h3>
                    <p className="text-muted-foreground text-sm">
                      View analytics, manage resources, and support students
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode('signin')}
              className="text-primary hover:text-primary-dark text-sm transition-colors"
            >
              Already have an account? Sign in
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src="/logo.png" alt="NIRVANA" className="h-12 w-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            {mode === 'signin' ? 'Welcome Back' : 'Join NIRVANA'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'signin' 
              ? 'Sign in to continue your wellness journey'
              : `Create your ${userType} account`
            }
          </p>
        </div>

        <Card className="bg-background/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-destructive text-sm text-center">{error}</p>}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (userType === 'student' || userType === 'institute') && (
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <div className="relative">
                    {userType === 'student' ? 
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" /> :
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    }
                    <Input
                      id="institution"
                      name="institution"
                      type="text"
                      placeholder={userType === 'student' ? "Enter your school/university" : "Enter your institution's name"}
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full gradient-primary text-primary-foreground border-0"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="mb-4" />
              <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn} disabled={loading}>
                {loading ? 'Please wait...' : 'Continue with Google'}
              </Button>
            </div>

            <div className="mt-4 text-center">
              {mode === 'signin' ? (
                <>
                  <button
                    onClick={() => { setMode('signup'); setError(''); }}
                    className="text-primary hover:text-primary-dark text-sm transition-colors"
                  >
                    Don't have an account? Sign up
                  </button>
                  <br />
                  <button
                    onClick={() => { setMode('userType'); setError(''); }}
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors mt-2"
                  >
                    Change user type
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setMode('signin'); setError(''); }}
                    className="text-primary hover:text-primary-dark text-sm transition-colors"
                  >
                    Already have an account? Sign in
                  </button>
                  <br />
                  <button
                    onClick={() => { setMode('userType'); setError(''); }}
                    className="text-muted-foreground hover:text-foreground text-xs transition-colors mt-2"
                  >
                    Change user type
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
