import { OAuth2Client } from "google-auth-library";
import 'dotenv/config';

export const oAuth2Client = new OAuth2Client({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: 'http://localhost:5173'
});