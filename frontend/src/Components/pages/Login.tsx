import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CyberpunkLayout from "../../Constant/CyberpunkLayout";
import Logo from "../../Constant/ui/Logo";
import CyberpunkInput from "../../Constant/ui/CyberpunkInput";
import NeonButton from "../../Constant/ui/Neonbutton";

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      await axios.post(
        "/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setMessage("Login successful! Redirecting...");
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        setIsLoading(false);
        navigate("/game"); // Redirect to game page
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.log("Login error:", err.response?.data);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again.",
      );
      setIsLoading(false);
    }
  };

  return (
    <CyberpunkLayout isLoading={isLoading} loadingText="VERIFYING ACCESS">
      {/* Logo Component */}
      <Logo subtitle="/ ACCESS YOUR ACCOUNT /" size="md" />

      {/* Login Form Card */}
      <div className="relative z-10 pt-32 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="relative w-full max-w-md bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
          {/* Digital lines effect */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-px bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500/50 to-cyan-500/0"></div>

          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
              LOGIN
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
              <div className="mb-6 p-3 border border-green-500 bg-green-500/10 rounded text-green-400 text-sm font-mono">
                <div className="flex items-center">
                  <span className="mr-2 text-lg">✓</span>
                  <span>{message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <CyberpunkInput
                id="email"
                name="email"
                label="EMAIL"
                type="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your email address"
                required
                isFocused={focusedField === "email"}
              />

              {/* Password Field */}
              <CyberpunkInput
                id="password"
                name="password"
                label="PASSWORD"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="Enter your password"
                required
                isFocused={focusedField === "password"}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Forgot Password Link */}
              <div className="flex justify-end mb-6">
                <Link
                  to="/forgot-password"
                  className="text-sm text-cyan-400 hover:text-cyan-300 font-mono hover:underline"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>

              {/* Submit Button */}
              <NeonButton
                type="submit"
                color="pink"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? "AUTHENTICATING..." : "LOGIN"}
              </NeonButton>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-300 text-sm font-mono">
                  DON&apos;T HAVE AN ACCOUNT?{" "}
                  <Link
                    to="/signup"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none transition-colors"
                  >
                    SIGN UP HERE
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

export default Login;
