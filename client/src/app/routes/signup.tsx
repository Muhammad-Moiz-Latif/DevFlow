import { Check } from "lucide-react";
import { AuthShell, GoogleButton, Divider, Field } from "../../components/ui/AuthShell";
import { Link } from "react-router";



export function SignupPage() {
    return (
        <AuthShell
            title="Create your account"
            subtitle="Start tracking issues with your team in minutes."
            footer={
                <>
                    Already trusted by product teams at fast-moving startups.
                </>
            }
        >
            <GoogleButton label="Sign up with Google" />
            <Divider text="or sign up with email" />

            <form onSubmit={(e) => e.preventDefault()}>
                <Field
                    label="Full name"
                    placeholder="Jordan Doe"
                    autoComplete="name"
                />
                <Field
                    label="Work email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                />
                <Field
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    hint="Use 8+ characters with a mix of letters, numbers & symbols."
                />

                <div className="space-y-1.5 mt-4 mb-4">
                    <Requirement met label="Account is free to create" />
                    <Requirement met label="No credit card required" />
                    <Requirement label="Pending admin approval after signup" />
                </div>

                <button
                    type="submit"
                    className="w-full h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Create account
                </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-5">
                Already have an account?{" "}
                <Link to="/login" className="text-foreground font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
}

function Requirement({ label, met }: { label: string; met?: boolean }) {
    return (
        <div className="flex items-center gap-2 text-[11px]">
            <span
                className={`size-3.5 rounded-full flex items-center justify-center ${met ? "bg-status-done/20 text-status-done" : "bg-muted text-muted-foreground"
                    }`}
            >
                {met && <Check className="size-2.5" strokeWidth={3} />}
            </span>
            <span className={met ? "text-foreground/80" : "text-muted-foreground"}>{label}</span>
        </div>
    );
}
