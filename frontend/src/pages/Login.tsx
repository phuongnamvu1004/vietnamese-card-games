import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import CyberpunkLayout from "../Components/Layout/CyberpunkLayout";
import Logo from "../Components/ui/Logo";
import CyberpunkInput from "../Components/ui/CyberpunkInput";
import Neonbutton from "../Components/ui/Neonbutton";
import AuthMessageBox from "../Components/ui/AuthMessageBox";
import AuthFormLayout from "../Components/ui/AuthFormLayout";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
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
      console.log("Logging in with data:", formData);
      await axiosInstance.post(
        "api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      setMessage("Login successful! Redirecting...");
      setFormData({ email: "", password: "" });

      setTimeout(() => {
        setIsLoading(false);
        navigate("/profile");
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  type InputField = {
    id: keyof typeof formData;
    label: string;
    type: string;
    placeholder: string;
    toggle?: boolean;
  };

  const inputConfigs: InputField[] = [
    {
      id: "email",
      label: "EMAIL",
      type: "email",
      placeholder: "Enter your email address",
    },
    {
      id: "password",
      label: "PASSWORD",
      type: "password",
      placeholder: "Enter your password",
      toggle: true,
    },
  ];

  return (
    <CyberpunkLayout isLoading={isLoading} loadingText="VERIFYING ACCESS">
      <Logo subtitle="/ ACCESS YOUR ACCOUNT /" size="md" />

      <div className="relative z-10 pt-32 flex flex-col items-center justify-center min-h-screen px-4">
        <AuthFormLayout title="LOGIN">
          {error && <AuthMessageBox type="error" message={error} />}
          {message && <AuthMessageBox type="success" message={message} />}

          <form onSubmit={handleSubmit}>
            {inputConfigs.map(({ id, label, type, placeholder, toggle }) => (
              <CyberpunkInput
                key={id}
                id={id}
                name={id}
                label={label}
                type={type}
                value={formData[id]}
                onChange={handleChange}
                onFocus={() => setFocusedField(id)}
                onBlur={() => setFocusedField(null)}
                placeholder={placeholder}
                required
                isFocused={focusedField === id}
                showPasswordToggle={!!toggle}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
            ))}

            <div className="flex justify-end mb-6">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-400 hover:text-cyan-300 font-mono hover:underline"
              >
                FORGOT PASSWORD?
              </Link>
            </div>

            <Neonbutton
              type="submit"
              color="pink"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "AUTHENTICATING..." : "LOGIN"}
            </Neonbutton>

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
        </AuthFormLayout>

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
    </CyberpunkLayout>
  );
};

export default Login;
