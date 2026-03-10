import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ShieldCheck } from "lucide-react";
import Button from "@/src/components/common/button";
import GradientIconContainer from "@/src/components/common/gradientIconContainer";
import { Input } from "@/src/components/common/input";
import LoginLayout from "@/src/components/layout/loginLayout";
import axiosInstance from "@/src/helpers/axios";
import { toast } from "react-toastify";

export default function OtpVerification() {
  const router = useRouter();
  const { email } = router.query;

  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = React.useState(60);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const verifyMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await axiosInstance.post("/auth/verify-otp", {
        email,
        otp: code,
      });
      return res.data;
    },
    onSuccess: () => {
      router.push({
        pathname: "/auth/change-password",
        query: { email },
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/auth/resend-otp", { email });
      return res.data;
    },
    onSuccess: () => {
      setTimer(60);
    },
  });

  const handleChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const nextOtp = [...otp];
        nextOtp[index] = "";
        setOtp(nextOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, otp.length);

    if (!pasted) return;

    const nextOtp = [...otp];
    pasted.split("").forEach((char, idx) => {
      nextOtp[idx] = char;
    });

    setOtp(nextOtp);

    const nextIndex = Math.min(pasted.length, otp.length - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      alert("Please enter the complete OTP");
      return;
    }

    verifyMutation.mutate(code);
  };

  const handleResend = () => {
    if (timer > 0) return;
    resendMutation.mutate();
  };

  return (
    <LoginLayout>
      <GradientIconContainer>
        <ShieldCheck size={25} />
      </GradientIconContainer>

      <span className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-center">OTP Verification</h1>
        <p className="text-gray-400 text-center">
          Enter the verification code we sent to your email
        </p>
      </span>

      <form
        onSubmit={handleVerify}
        className="flex flex-col items-center gap-6 w-full mt-5"
      >
        <div className="flex items-center justify-center gap-3 w-full">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="h-14 w-14 text-center text-xl font-semibold rounded-xl"
            />
          ))}
        </div>

        <Button
          type="submit"
          loading={verifyMutation.isPending}
          className="w-full max-w-[400px] rounded-3xl mt-2"
        >
          Verify
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Didn’t receive a code?{" "}
          <button
            type="button"
            disabled={timer > 0}
            onClick={handleResend}
            className="text-primary font-medium disabled:text-gray-400"
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend"}
          </button>
        </p>
      </form>
    </LoginLayout>
  );
}