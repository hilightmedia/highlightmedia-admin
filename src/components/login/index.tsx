import { EyeIcon, EyeOff, User } from "lucide-react";
import React from "react";
import LoginLayout from "../layout/loginLayout";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/src/services/auth";
import { useRouter } from "next/router";
import Button from "../common/button";
import Checkbox from "../common/checkBox";
import GradientIconContainer from "../common/gradientIconContainer";
import { Input } from "../common/input";

export default function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const initialFormData = { email: "", password: "" };
  const [formData, setFormData] = React.useState(initialFormData);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      login(data.email, data.password),

    onSuccess: (data) => {
      if (rememberMe) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      } else {
        sessionStorage.setItem("accessToken", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);
      }

      router.push("/dashboard");
    },

    onError: (err) => {
      console.error("Login failed:", err);
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      if (!formData.email || !formData.password) {
        alert("Please fill in all fields");
        return;
      }
      await mutate(formData);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <LoginLayout>
      <GradientIconContainer>
        <User size={25} />
      </GradientIconContainer>
      <span className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-gray-400 text-center">
          Login to your account to continue
        </p>
      </span>
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center gap-4 w-full mt-5"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full max-w-[400px]"
          value={formData?.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <div className="relative w-full max-w-[400px]">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your Password"
            className="w-full max-w-[400px]"
            value={formData?.password || ""}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {!showPassword ? (
              <EyeIcon color="#EA6535" />
            ) : (
              <EyeOff color="#EA6535" />
            )}
          </span>
        </div>
        <div className="w-full max-w-[400px] flex items-center justify-between text-sm">
          <span className="flex items-center gap-3">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />{" "}
            Remember me
          </span>
          <p className="text-sm">Forgot Password?</p>
        </div>
        <Button
          type="submit"
          loading={isPending}
          className="w-full max-w-[400px] rounded-3xl mt-2"
        >
          Login
        </Button>
      </form>
    </LoginLayout>
  );
}
