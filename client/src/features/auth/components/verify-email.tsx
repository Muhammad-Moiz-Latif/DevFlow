import { useRef, useState } from "react";
import { ArrowRight, MailCheck, ArrowLeft, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useVerifyEmail } from "../query/useVerifyEmail";
import { errorToast, successToast } from "../../../components/ui/CustomToasts";
import axios from "axios";
import logo from "../../../assets/logo.png";
import { Link } from "react-router";

const OTP_LENGTH = 6;

export default function VerifyEmail() {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const location = useLocation();
    const { mutate, isPending } = useVerifyEmail();
    const invitationToken = sessionStorage.getItem('invitationToken');
    const userId = location.state?.userId ?? sessionStorage.getItem('pendingVerificationUserId');
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
                    successToast("Email verified successfully! Please log in.");
                    setTimeout(() => {
                        navigate('/login', { state: { fromInvite: invitationToken ? true : false } });
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
        <div className="min-h-screen flex bg-background text-foreground">
            {/* ───────── Left: Form ───────── */}
            <div className="flex-1 flex flex-col px-6 py-7 relative">
                {/* Brand */}
                <Link to="/" className="relative flex items-center gap-2.5 group">
                    <img
                        src={logo}
                        alt="DevFlow"
                        className="size-7 object-contain"
                    />
                    <span className="text-[14px] font-semibold tracking-tight">
                        Dev<span className="font-mono text-[12.5px] font-medium text-primary">FLOW</span>
                    </span>
                </Link>

                {/* Verification block */}
                <div className="relative flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[420px]">
                        <div className="inline-flex items-center gap-3 mb-5 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. 12 — Verification
                            <span className="w-4 h-px bg-border" />
                        </div>

                        {/* Verification Card */}
                        <div className="border border-border bg-card overflow-hidden">
                            <div className="h-9 border-b border-border bg-sidebar/40 flex items-center px-3.5 gap-2.5">
                                <MailCheck className="size-3.5 text-primary" strokeWidth={1.8} />
                                <span className="text-[10px] font-mono tracking-wide text-muted-foreground/60 uppercase">
                                    Email Verification
                                </span>
                                <span className="ml-auto flex items-center gap-1.5 text-[9px] font-mono text-primary/70">
                                    <span className="size-1 rounded-full bg-primary animate-pulse" />
                                    Pending
                                </span>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <h1 className="text-[1.15rem] font-semibold tracking-[-0.02em] leading-snug text-foreground">
                                        Verify your email
                                    </h1>
                                    <p className="text-[12px] text-muted-foreground/60 mt-1">
                                        Enter the 6-digit code sent to your inbox.
                                    </p>
                                </div>

                                {/* OTP Input */}
                                <div className="flex items-center justify-center gap-2 py-2">
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
                                            className="h-12 w-11 rounded-md border border-border/60 bg-surface text-center text-[18px] font-semibold tracking-widest text-foreground outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/25 hover:border-border"
                                        />
                                    ))}
                                </div>

                                {/* Actions */}
                                <button
                                    onClick={handleVerification}
                                    type="button"
                                    className="group w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 h-9 text-[12px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!isComplete || isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="size-3.5 animate-spin" />
                                            Verifying…
                                        </>
                                    ) : (
                                        <>
                                            <MailCheck className="size-3.5" strokeWidth={2} />
                                            Verify code
                                            <ArrowRight className="size-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Resend */}
                                <div className="text-center text-[11px] text-muted-foreground/60">
                                    Didn't get anything?{" "}
                                    <button
                                        type="button"
                                        disabled={isPending}
                                        className="font-medium text-foreground/80 hover:text-foreground hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Resend code
                                    </button>
                                </div>

                                {/* Back link */}
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/50 hover:text-foreground transition-colors"
                                >
                                    <ArrowLeft className="size-3" strokeWidth={1.8} />
                                    Go back
                                </button>
                            </div>
                        </div>

                        <p className="text-[10px] font-mono text-muted-foreground/40 text-center mt-6 tracking-wide">
                            Check your inbox for the verification code
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative text-[11px] text-muted-foreground/70 text-center leading-relaxed">
                    <span>DevFLOW © 2026</span>
                    <span className="mx-2 text-border">·</span>
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <span className="mx-2 text-border">·</span>
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                </div>
            </div>

            {/* ───────── Right: Drafting panel ───────── */}
            <div className="hidden lg:flex flex-1 border-l border-border bg-sidebar/40 relative overflow-hidden">
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `
                            linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px),
                            linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Registration marks */}
                {[
                    "top-5 left-5 border-t border-l",
                    "top-5 right-5 border-t border-r",
                    "bottom-5 left-5 border-b border-l",
                    "bottom-5 right-5 border-b border-r",
                ].map((pos) => (
                    <div
                        key={pos}
                        className={`absolute ${pos} size-2.5 border-primary/40`}
                    />
                ))}

                {/* Centered content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-14">
                    <div className="w-full max-w-xl">
                        <div className="inline-flex items-center gap-3 mb-6 text-[10px] font-mono tracking-[0.16em] text-muted-foreground/55 uppercase">
                            <span className="w-4 h-px bg-border" />
                            Fig. E — Security
                            <span className="w-4 h-px bg-border" />
                        </div>

                        <h2 className="text-[1.7rem] font-semibold tracking-[-0.03em] leading-[1.15] text-center">
                            One more step to get started.
                        </h2>

                        <p className="text-[13.5px] text-muted-foreground mt-4 leading-relaxed text-center">
                            We've sent a 6-digit verification code to your email. Enter it to confirm your address and unlock your workspace.
                        </p>

                        {/* Preview card - email sent indicator */}
                        <div className="mt-9 border border-border bg-card overflow-hidden max-w-md mx-auto">
                            <div className="h-7 border-b border-border bg-sidebar/80 flex items-center px-3 gap-2.5 font-mono text-[9px] tracking-wide text-muted-foreground">
                                <span className="text-foreground/60">STATUS</span>
                                <span className="text-foreground/80">VERIFICATION</span>
                                <span className="w-px h-2 bg-border" />
                                <span>EMAIL SENT</span>
                                <span className="ml-auto flex items-center gap-1.5 text-emerald-500">
                                    <span className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                                    DELIVERED
                                </span>
                            </div>

                            <div className="p-3.5 space-y-2.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                        <MailCheck className="size-4 text-emerald-500" strokeWidth={1.8} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-medium text-foreground/80">
                                            Verification email sent
                                        </p>
                                        <p className="text-[9px] font-mono text-muted-foreground/40">
                                            Check your inbox and spam folder
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 bg-surface/30 p-2 rounded border border-border/40">
                                    <span className="font-mono">●</span>
                                    <span>Code expires in 15 minutes</span>
                                    <span className="ml-auto font-mono text-[9px]">OTP-6</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom annotation */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[9px] font-mono tracking-[0.12em] text-muted-foreground/40 uppercase">
                            <span>Sheet 03 / 01</span>
                            <span className="w-px h-3 bg-border/60" />
                            <span>v2.0.1</span>
                            <span className="w-px h-3 bg-border/60" />
                            <span>devflow.app</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}