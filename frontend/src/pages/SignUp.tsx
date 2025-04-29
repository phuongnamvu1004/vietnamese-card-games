import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CyberpunkLayout from "../Components/Layout/CyberpunkLayout";
import Logo from "../Components/ui/Logo";
import CyberpunkInput from "../Components/ui/CyberpunkInput";
import Neonbutton from "../Components/ui/Neonbutton";
import AuthMessageBox from "../Components/ui/AuthMessageBox";
import AuthFormLayout from "../Components/ui/AuthFormLayout";
import { axiosInstance } from "../lib/axios";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      await axiosInstance.post(
        "api/auth/signup",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      );

      setMessage("Signup successful! Redirecting to login...");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login");
        setIsLoading(false);
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
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
      id: "fullName",
      label: "FULL NAME",
      type: "text",
      placeholder: "Enter your full name",
    },
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
      placeholder: "Create a password",
      toggle: true,
    },
    {
      id: "confirmPassword",
      label: "CONFIRM PASSWORD",
      type: "password",
      placeholder: "Confirm your password",
      toggle: true,
    },
  ];

  return (
    <CyberpunkLayout isLoading={isLoading} loadingText="CONFIGURING ACCESS">
      <Logo subtitle="/ CREATE YOUR ACCOUNT /" size="md" />

      <div className="relative z-10 pt-32 flex flex-col items-center justify-center min-h-screen px-4">
        <AuthFormLayout title="SIGN UP">
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

            <Neonbutton
              type="submit"
              color="pink"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "PROCESSING..." : "CREATE ACCOUNT"}
            </Neonbutton>

            <div className="mt-6 text-center">
              <p className="text-gray-300 text-sm font-mono">
                ALREADY HAVE AN ACCOUNT?{" "}
                <Link
                  to="/login"
                  className="text-cyan-400 hover:text-cyan-300 hover:underline focus:outline-none transition-colors"
                >
                  LOGIN HERE
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

export default SignUp;
