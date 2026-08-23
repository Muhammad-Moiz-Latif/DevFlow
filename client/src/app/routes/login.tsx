import { Link } from "react-router";
import { AuthShell, Divider } from "../../components/ui/AuthShell";
import { LoginForm } from "../../features/auth/components/login-form";
import { LoadingAuthSkeleton } from "../../components/ui/LoadingAuthSkeleton";
import GoogleLoginButton from "../../utils/googleLoginButton";
import { useEffect, useState } from "react";


export function LoginPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <LoadingAuthSkeleton variant="login" />;
    };

    return (
        <AuthShell
            title="Welcome back"
            subtitle="Sign in to continue to your workspace."
            footer={
                <>
                    By signing in you agree to our{" "}
                    <a href="#" className="text-foreground hover:underline">Terms</a> and{" "}
                    <a href="#" className="text-foreground hover:underline">Privacy Policy</a>.
                </>
            }
        >
            <GoogleLoginButton label="Continue with Google" />
            <Divider text="or" />

            <LoginForm />

            <p className="text-[11px] text-muted-foreground/60 text-center mt-6 tracking-wide">
                Don't have an account?{" "}
                <Link to="/signup" className="text-foreground/80 font-medium hover:text-foreground hover:underline transition-colors"
                >
                    Create one
                </Link>
            </p>
        </AuthShell>
    );
}
