import { google } from 'googleapis';


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_FIT_CLIENT_ID,
    process.env.GOOGLE_FIT_CLIENT_SECRET,
    process.env.GOOGLE_FIT_REDIRECT_URI
);

export async function POST(req) {
    try {
        console.log('Starting Google Fit connect...');
        console.log('Environment variables:', {
            clientId: process.env.GOOGLE_FIT_CLIENT_ID ? 'Set' : 'Not set',
            clientSecret: process.env.GOOGLE_FIT_CLIENT_SECRET ? 'Set' : 'Not set',
            redirectUri: process.env.GOOGLE_FIT_REDIRECT_URI
        });

        const scopes = [
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.body.read',
            'https://www.googleapis.com/auth/fitness.heart_rate.read',
            'https://www.googleapis.com/auth/fitness.sleep.read',
            'https://www.googleapis.com/auth/fitness.nutrition.read',
            'https://www.googleapis.com/auth/fitness.location.read',
            'https://www.googleapis.com/auth/fitness.blood_pressure.read',
            'https://www.googleapis.com/auth/fitness.blood_glucose.read',
            'https://www.googleapis.com/auth/fitness.oxygen_saturation.read',
            'https://www.googleapis.com/auth/fitness.body_temperature.read',
            'https://www.googleapis.com/auth/fitness.reproductive_health.read'
        ];

        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
            include_granted_scopes: true,
            response_type: 'code',
            redirect_uri: process.env.GOOGLE_FIT_REDIRECT_URI
        });

        console.log('Generated auth URL:', authUrl);

        return new Response(JSON.stringify({ authUrl }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in Google Fit connect:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal server error',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 