import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CyberpunkLayout from '../../Constant/CyberpunkLayout';
import Logo from '../../Constant/ui/Logo';
import CyberpunkInput from '../../Constant/ui/CyberpunkInput';
import NeonButton from '../../Constant/ui/Neonbutton';


interface SignUpProps {
  onSignUp?: () => void;
}

const SignUp: React.FC<SignUpProps> = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await axios.post('/api/auth/signup', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      setMessage('Signup successful! Redirecting to login...');
      setFormData({fullName: '', email: '', password: '', confirmPassword: ''});

      setTimeout(() => {
        navigate('/login');
        setIsLoading(false);
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <CyberpunkLayout isLoading={isLoading} loadingText="CONFIGURING ACCESS">
      {/* Logo Component */}
      <Logo subtitle="/ CREATE YOUR ACCOUNT /" size="md"/>

      {/* Signup Form Card */}
      <div className="relative z-10 pt-32 flex flex-col items-center justify-center min-h-screen px-4">
        <div
          className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
          {/* Digital lines effect */}
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
          <div
            className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>

          <div className="p-8">
            <h2
              className="text-2xl font-bold mb-6 text-center font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              SIGN UP
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 border border-red-500 bg-red-500/10 rounded text-red-400 text-sm font-mono">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">!</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div
                className="mb-6 p-3 border border-green-500 bg-green-500/10 rounded text-green-400 text-sm font-mono">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">✓</span>
                  <span>{message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name Field */}
              <CyberpunkInput
                id="fullName"
                name="fullName"
                label="FULL NAME"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your full name"
                required
                isFocused={focusedField === 'fullName'}
              />

              {/* Email Field */}
              <CyberpunkInput
                id="email"
                name="email"
                label="EMAIL"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email address"
                required
                isFocused={focusedField === 'email'}
              />

              {/* Password Field */}
              <CyberpunkInput
                id="password"
                name="password"
                label="PASSWORD"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="Create a password"
                required
                minLength={6}
                isFocused={focusedField === 'password'}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Confirm Password Field */}
              <CyberpunkInput
                id="confirmPassword"
                name="confirmPassword"
                label="CONFIRM PASSWORD"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder="Confirm your password"
                required
                isFocused={focusedField === 'confirmPassword'}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Submit Button */}
              <NeonButton
                type="submit"
                color="pink"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
              </NeonButton>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm font-mono">
                  ALREADY HAVE AN ACCOUNT?{' '}
                  <Link
                    to="/login"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none transition-colors"
                  >
                    LOGIN HERE
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Bottom border effect */}
          <div className="h-1 w-full bg-gradient-to-r from-cyan-500 to-pink-500"></div>
        </div>

        {/* Back to Home link */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-mono text-sm"
          >
            <span className="mr-2">←</span>
            BACK TO HOME
          </Link>
        </div>
      </div>

      {/* Cyberpunk glitch effect CSS */}
      <style>{`
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          14% {
            text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75), -0.05em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          49% {
            text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75), 0.025em 0.025em 0 rgba(0, 255, 0, 0.75), -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          50% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          99% {
            text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75), 0.05em 0 0 rgba(0, 255, 0, 0.75), 0 -0.05em 0 rgba(0, 0, 255, 0.75);
          }
          100% {
            text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75), -0.025em -0.025em 0 rgba(0, 255, 0, 0.75), -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
          }
        }
        
        .glitch-text {
          animation: glitch 1s infinite;
        }
      `}</style>
    </CyberpunkLayout>
  );
};

export default SignUp;