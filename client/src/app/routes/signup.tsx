import { AuthShell, GoogleButton, Divider } from "../../components/ui/AuthShell";
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

            <SignUpForm />

            <p className="text-xs text-muted-foreground text-center mt-5">
                Already have an account?{" "}
                <Link to="/login" className="text-foreground font-medium hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthShell>
    );
};
