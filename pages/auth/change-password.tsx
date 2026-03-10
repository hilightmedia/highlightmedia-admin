import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EyeIcon, EyeOff, ShieldCheck } from "lucide-react";
import Button from "@/src/components/common/button";
import GradientIconContainer from "@/src/components/common/gradientIconContainer";
import { Input } from "@/src/components/common/input";
import LoginLayout from "@/src/components/layout/loginLayout";

export default function ResetPassword() {
    const router = useRouter();
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        password: "",
        confirmPassword: "",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: { password: string; confirmPassword: string }) => {
            return Promise.resolve({ success: true, ...data });
        },
        onSuccess: () => {
            router.push("/login");
        },
        onError: (err) => {
            console.error("Reset password failed:", err);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            alert("Please fill in all fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        mutate(formData);
    };

    return (
        <LoginLayout>
            <GradientIconContainer>
                <ShieldCheck size={25} />
            </GradientIconContainer>

            <span className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-center">Reset Password</h1>
                <p className="text-gray-400 text-center">
                    Enter your new password and confirm it to continue
                </p>
            </span>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center gap-4 w-full mt-5"
            >
                <div className="relative w-full max-w-[400px]">
                    <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        className="w-full max-w-[400px]"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />
                    <span
                        className="absolute right-3 top-2 cursor-pointer"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                        {!showNewPassword ? (
                            <EyeIcon color="#EA6535" />
                        ) : (
                            <EyeOff color="#EA6535" />
                        )}
                    </span>
                </div>

                <div className="relative w-full max-w-[400px]">
                    <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        className="w-full max-w-[400px]"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                    />
                    <span
                        className="absolute right-3 top-2 cursor-pointer"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {!showConfirmPassword ? (
                            <EyeIcon color="#EA6535" />
                        ) : (
                            <EyeOff color="#EA6535" />
                        )}
                    </span>
                </div>

                <Button
                    type="submit"
                    loading={isPending}
                    className="w-full max-w-[400px] rounded-3xl mt-2"
                >
                    Submit
                </Button>
            </form>
        </LoginLayout>
    );
}