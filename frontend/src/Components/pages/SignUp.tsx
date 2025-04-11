import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface SignUpProps {
  onSignUp?: () => void;
}

const SignUp: React.FC<SignUpProps> = ({}) => {
  // Form state
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

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Field focus animation
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value});
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Replace with your actual API call
      // await axios.post('/api/auth/signup', formData);

      setMessage('Signup successful! Redirecting to login...');
      setFormData({fullName: '', email: '', password: '', confirmPassword: ''});

      // Redirect after successful signup
      setTimeout(() => {
        setIsLoading(false);
        // Redirect logic here
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-900">
      {/* Background effects - similar to home page */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-blue-900/20"></div>

      <div className="absolute inset-0 opacity-10 bg-repeat"
           style={{
             backgroundImage: `url('/textures/grid-pattern.png')`,
             backgroundSize: '100px 100px'
           }}>
      </div>

      <div className="absolute top-0 w-full h-2 bg-cyan-500 shadow-[0_0_20px_5px_rgba(6,182,212,0.7)]"></div>
      <div className="absolute bottom-0 w-full h-2 bg-pink-500 shadow-[0_0_20px_5px_rgba(236,72,153,0.7)]"></div>

      {/* CyberpunkLayout with futuristic logo */}
      <div className="absolute top-8 w-full flex justify-center">
        <div className="text-center">
          <div
            className="font-mono text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            VIETNAMESE CARD GAME
          </div>
          <div className="font-mono text-lg mt-2 text-cyan-300 drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
            / CREATE YOUR ACCOUNT /
          </div>
        </div>
      </div>

      {/* Signup Form CardDisplay */}
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

            {error && (
              <div className="mb-6 p-3 border border-red-500 bg-red-500/10 rounded text-red-400 text-sm font-mono">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">!</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

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
              <div className="mb-5">
                <label
                  htmlFor="fullName"
                  className="block mb-2 text-sm font-medium text-cyan-300 font-mono"
                >
                  FULL NAME
                </label>
                <div
                  className={`relative border ${focusedField === 'fullName' ? 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-gray-700'} rounded-md bg-gray-800/50 transition-all duration-300`}
                >
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('fullName')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-4 py-3 bg-transparent text-gray-200 outline-none font-mono"
                  />
                  {focusedField === 'fullName' && (
                    <div
                      className="absolute -inset-px rounded-md animate-pulse opacity-30 border border-pink-500"></div>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-cyan-300 font-mono"
                >
                  EMAIL
                </label>
                <div
                  className={`relative border ${focusedField === 'email' ? 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-gray-700'} rounded-md bg-gray-800/50 transition-all duration-300`}
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your email address"
                    required
                    className="w-full px-4 py-3 bg-transparent text-gray-200 outline-none font-mono"
                  />
                  {focusedField === 'email' && (
                    <div
                      className="absolute -inset-px rounded-md animate-pulse opacity-30 border border-pink-500"></div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-cyan-300 font-mono"
                >
                  PASSWORD
                </label>
                <div
                  className={`relative border ${focusedField === 'password' ? 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-gray-700'} rounded-md bg-gray-800/50 transition-all duration-300`}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-transparent text-gray-200 outline-none font-mono pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 text-sm font-mono focus:outline-none"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                  {focusedField === 'password' && (
                    <div
                      className="absolute -inset-px rounded-md animate-pulse opacity-30 border border-pink-500"></div>
                  )}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-cyan-300 font-mono"
                >
                  CONFIRM PASSWORD
                </label>
                <div
                  className={`relative border ${focusedField === 'confirmPassword' ? 'border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'border-gray-700'} rounded-md bg-gray-800/50 transition-all duration-300`}
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Confirm your password"
                    required
                    className="w-full px-4 py-3 bg-transparent text-gray-200 outline-none font-mono pr-12"
                  />
                  {focusedField === 'confirmPassword' && (
                    <div
                      className="absolute -inset-px rounded-md animate-pulse opacity-30 border border-pink-500"></div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-md uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(236,72,153,0.7)] transform hover:-translate-y-1 transition-all font-mono overflow-hidden"
              >
                <span className="relative z-10">
                  {isLoading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                </span>
                <span className="absolute inset-0 bg-pink-500/20 opacity-0 hover:opacity-100 transition-opacity"></span>
              </button>

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

      {/* Cyberpunk loading effect */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="relative">
            <div className="flex gap-2">
              {['A♥', 'K♠', 'Q♦', 'J♣'].map((card, index) => (
                <div key={index}
                     className="relative bg-gray-800 w-16 h-24 rounded-md flex items-center justify-center text-3xl font-bold border border-gray-700 overflow-hidden"
                     style={{animationDelay: `${index * 0.1}s`}}>
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse"
                    style={{animationDuration: '1.5s', animationDelay: `${index * 0.2}s`}}></div>
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-br ${index % 2 === 0 ? 'from-pink-400 to-purple-500' : 'from-cyan-400 to-blue-500'}`}>
                    {card}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-cyan-400 mt-6 text-center font-medium font-mono flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
              CONFIGURING ACCESS
              <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-ping"
                    style={{animationDelay: '0.3s'}}></span>
            </p>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default SignUp;