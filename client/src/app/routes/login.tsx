import { Link } from "react-router";
import { AuthShell, GoogleButton, Divider, Field } from "../../components/ui/AuthShell";


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

            <form onSubmit={(e) => e.preventDefault()}>
                <Field
                    label="Email"
                    type="email"
                    placeholder="you@company.com"
                    autoComplete="email"
                />
                <Field
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    rightAction={
                        <a href="#" className="text-[11px] text-primary hover:underline">
                            Forgot password?
                        </a>
                    }
                />

                <button
                    type="submit"
                    className="w-full h-9 mt-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    Sign in
                </button>
            </form>

            <p className="text-xs text-muted-foreground text-center mt-5">
                Don't have an account?{" "}
                <Link to="/signup" className="text-foreground font-medium hover:underline">
                    Create one
                </Link>
            </p>
        </AuthShell>
    );
}
