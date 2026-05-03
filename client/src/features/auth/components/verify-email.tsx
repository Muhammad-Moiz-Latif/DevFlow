import { useRef, useState } from "react";
import { ArrowRight, MailCheck, ArrowLeftSquareIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useVerifyEmail } from "../query/useVerifyEmail";
import { errorToast, successToast } from "../../../components/ui/CustomToasts";
import axios from "axios";

const OTP_LENGTH = 6;

export default function VerifyEmail() {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const location = useLocation();
    const { mutate, isPending } = useVerifyEmail();
    const userId = location.state.userId ?? sessionStorage.getItem('pendingVerificationUserId');
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const navigate = useNavigate();

    const updateDigit = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) {
            return;
        }

        const nextOtp = [...otp];
        nextOtp[index] = value;
        setOtp(nextOtp);

        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (event.key !== "Backspace") {
            return;
        }

        if (!otp[index] && index > 0) {
            const nextOtp = [...otp];
            nextOtp[index - 1] = "";
            setOtp(nextOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) {
            return;
        }

        const nextOtp = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((digit, idx) => {
            nextOtp[idx] = digit;
        });

        setOtp(nextOtp);
        inputRefs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
    };

    const isComplete = otp.every((digit) => digit.length === 1);

    function handleVerification() {
        mutate({ otp: otp.join(""), userId }, {
            onSuccess: (response) => {
                if (response.success) {
                    sessionStorage.removeItem('pendingVerificationUserId');
                    successToast("Email verified! Welcome to DevFlow"),
                        setTimeout(() => {
                            navigate('/login');
                        }, 1000);
                };
            },
            onError: (error: Error) => {
                if (axios.isAxiosError(error)) {
                    console.error(error);
                    errorToast(error.response?.data.message || "Something went wrong")
                }
            }
        })
    };

    return (
        <div className="w-1/3 rounded-2xl border border-border bg-card/70 backdrop-blur-sm shadow-2xl shadow-black/10 p-6">
            <div
                className="flex text-xs text-muted-foreground gap-1 items-center hover:text-foreground hover:cursor-pointer"
                onClick={() => navigate('/signup')}
            >
                <ArrowLeftSquareIcon />
                <h1>Go back</h1>
            </div>

            <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                <MailCheck className="size-5" strokeWidth={2.2} />
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-center">Verify your email</h2>
            <p className="mt-2 text-center text-sm leading-relaxed text-muted-foreground">
                Enter the 6-digit code sent to your inbox.
            </p>

            <div className="mt-5 flex items-center justify-center gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        value={digit}
                        onChange={(event) => updateDigit(event.target.value, index)}
                        onKeyDown={(event) => handleBackspace(event, index)}
                        onPaste={handlePaste}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        className="h-12 w-10 rounded-lg border border-border bg-surface text-center text-lg font-semibold tracking-widest text-foreground outline-none transition-all focus:border-primary/60 focus:ring-2 focus:ring-primary/35"
                    />
                ))}
            </div>

            <button
                onClick={handleVerification}
                type="button"
                className="mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!isComplete || isPending}
            >
                {isPending ? "Verifying" : "Verify code"}
                <ArrowRight className="size-4" />
            </button>

            <div className="mt-4 text-center text-xs text-muted-foreground">
                Didn&apos;t get anything?{" "}
                <button
                    type="button"
                    disabled={isPending}
                    className="font-medium text-foreground transition-opacity hover:opacity-60 hover:cursor-pointer"
                >
                    Resend code
                </button>
            </div>
        </div>
    );
}