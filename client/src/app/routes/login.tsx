import { Link } from "react-router";
import { AuthShell, GoogleButton, Divider } from "../../components/ui/AuthShell";
import { LoginForm } from "../../features/auth/components/login-form";


export function LoginPage() {
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
            <GoogleButton label="Continue with Google" />
            <Divider text="or" />

            <LoginForm />

            <p className="text-xs text-muted-foreground text-center mt-5">
                Don't have an account?{" "}
                <Link to="/signup" className="text-foreground font-medium hover:underline">
                    Create one
                </Link>
            </p>
        </AuthShell>
    );
}
