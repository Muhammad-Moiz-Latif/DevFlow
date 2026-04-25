import { Check } from "lucide-react";
import { AuthShell, GoogleButton, Divider, Field } from "../../components/ui/AuthShell";
import { Link } from "react-router";
import { SignUpForm } from "../../features/auth/components/signup-form";



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

           <SignUpForm/>

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
