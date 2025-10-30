import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CyberpunkLayout from "../components/Layout/CyberpunkLayout";
import Logo from "../components/ui/Logo";
import CyberpunkInput from "../components/ui/CyberpunkInput";
import NeonButton from "../components/ui/NeonButton";
import AuthMessageBox from "../components/ui/AuthMessageBox";
import AuthFormLayout from "../components/ui/AuthFormLayout";
import { UserAPI } from "../api/UserApi";
import { useSocket } from "../socket/SocketProvider"; 

const Login: React.FC = () => {
  const [user, setUser] = useState<{ fullName?: string }>({});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const navigate = useNavigate();
  const { connectSocket } = useSocket();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping checkAuth.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await UserAPI.checkAuth();
        setUser({ fullName: res.data.fullName });
        navigate("/welcome");
      } catch (err) {
        console.warn("User not logged in or token invalid.");
        setUser({});
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

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
      const res = await UserAPI.login(formData);
      localStorage.setItem("user", JSON.stringify(res.data));
      const token = await UserAPI.refreshToken();
      if (token) connectSocket(token);
      setTimeout(() => navigate("/welcome"));
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || error.message || "Invalid email or password.");
    } finally {
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
      <Logo subtitle={`/ ACCESS YOUR ACCOUNT / ${user?.fullName || ""}`} size="md" />

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

            <NeonButton type="submit" color="pink" fullWidth disabled={isLoading}>
              {isLoading ? "AUTHENTICATING..." : "LOGIN"}
            </NeonButton>

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
