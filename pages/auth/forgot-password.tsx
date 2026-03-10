import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Mail } from "lucide-react";
import Button from "@/src/components/common/button";
import GradientIconContainer from "@/src/components/common/gradientIconContainer";
import { Input } from "@/src/components/common/input";
import LoginLayout from "@/src/components/layout/loginLayout";
import axiosInstance from "@/src/helpers/axios";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await axiosInstance.post("/auth/send-otp", { email });
      return res.data;
    },
    onSuccess: () => {
      router.push({
        pathname: "/auth/verify-otp",
        query: { email },
      });
    },
    onError: (err: any) => {
      console.error("Send OTP failed:", err);
      alert(err?.response?.data?.message || "Failed to send OTP");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    mutate(email);
  };

  return (
    <LoginLayout>
      <GradientIconContainer>
        <Mail size={25} />
      </GradientIconContainer>

      <span className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
        <p className="text-gray-400 text-center">
          Enter your email to receive a verification code
        </p>
      </span>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full mt-5"
      >
        <Input
          type="email"
          placeholder="Enter your email"
          className="w-full max-w-[400px]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          type="submit"
          loading={isPending}
          className="w-full max-w-[400px] rounded-3xl mt-2"
        >
          Send OTP
        </Button>
      </form>
    </LoginLayout>
  );
}