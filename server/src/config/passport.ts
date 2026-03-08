// config/passport.config.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { authServices } from "../modules/auth/services";
import uploadImage from "../utils/upload-image";

export const configurePassport = () => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // This callback runs AFTER Google authenticates the user
                    // profile contains: id, displayName, emails, photos

                    const email = profile.emails?.[0]?.value;
                    const username = profile.displayName;
                    const img = profile.photos?.[0]?.value;
                    let imgURL: string | null = null;
                    if (img) {
                        imgURL = await uploadImage(img);
                    };

                    if (!email) {
                        return done(new Error("No email from Google"), undefined);
                    }

                    // Check if user exists
                    let user = await authServices.verifyUser(email);

                    if (!user) {

                        // Create new user for Google auth
                        user = await authServices.createGoogleUser(email, username, imgURL as string);
                    } else if (user.authType === 'CREDENTIALS') {
                        //link user Credential account with user Google account
                        user = await authServices.linkUserWithCredentialsAndGoogle(email, username, imgURL as string);
                    };

                    // Transform database user to Passport user format
                    const passportUser = {
                        id: user.id,
                        name: user.username,  // Map 'username' to 'name'
                        email: user.email
                    };
                    // Pass user to the next middleware
                    return done(null, passportUser);

                } catch (error) {
                    return done(error as Error, undefined);
                }
            }
        )
    );
};