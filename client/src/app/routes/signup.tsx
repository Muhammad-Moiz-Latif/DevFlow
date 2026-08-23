import { Link } from "react-router";
import { AuthShell, Divider } from "../../components/ui/AuthShell";
import { SignUpForm } from "../../features/auth/components/signup-form";
import GoogleLoginButton from "../../utils/googleLoginButton";
import { LoadingAuthSkeleton } from "../../components/ui/LoadingAuthSkeleton";
import { useShouldShowLoader } from "../../utils/useShouldShowLoader";

export function SignupPage() {
    const isLoading = useShouldShowLoader();

    if (isLoading) {
        return <LoadingAuthSkeleton variant="signup" />;
    };

    return (
        <AuthShell
            title="Create your account"
            subtitle="Start collaborating with your team in minutes."
            footer={
                <>
                    By signing up you agree to our{" "}
                    <a href="#" className="text-foreground/70 hover:text-foreground hover:underline transition-colors">
                        Terms
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-foreground/70 hover:text-foreground hover:underline transition-colors">
                        Privacy Policy
                    </a>.
                </>
            }
        >
            <GoogleLoginButton label="Continue with Google" />
            <Divider text="or" />

            <SignUpForm />

            <p className="text-[11px] text-muted-foreground/60 text-center mt-6 tracking-wide">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-foreground/80 font-medium hover:text-foreground hover:underline transition-colors"
                >
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
}