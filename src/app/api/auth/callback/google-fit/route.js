import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_FIT_CLIENT_ID,
    process.env.GOOGLE_FIT_CLIENT_SECRET,
    process.env.GOOGLE_FIT_REDIRECT_URI
);

export async function GET(request) {
    try {
        console.log('Received Google Fit callback...');
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const scope = searchParams.get('scope');

        console.log('Callback parameters:', { code: !!code, error, scope });

        // Check for OAuth errors
        if (error) {
            console.error('OAuth error:', error);
            return Response.redirect(new URL('/client/dashboard/health?error=' + error, request.url));
        }

        if (!code) {
            console.error('No code provided in callback');
            return Response.redirect(new URL('/client/dashboard/health?error=no_code', request.url));
        }

        console.log('Received authorization code, attempting to exchange for tokens...');

        try {
            // Exchange the code for tokens
            const { tokens } = await oauth2Client.getToken(code);
            console.log('Successfully obtained tokens:', {
                hasAccessToken: !!tokens.access_token,
                hasRefreshToken: !!tokens.refresh_token,
                expiresAt: tokens.expiry_date,
                scope: tokens.scope
            });

            // Get user profile information
            oauth2Client.setCredentials(tokens);
            const people = google.people({ version: 'v1', auth: oauth2Client });
            const profile = await people.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses'
            });

            const userEmail = profile.data.emailAddresses?.[0]?.value;
            const userName = profile.data.names?.[0]?.displayName;

            console.log('User profile:', { userEmail, userName });

            if (!userEmail) {
                throw new Error('No email found in user profile');
            }

            // First, try to delete any existing account
            try {
                await prisma.googleFitAccount.deleteMany();
                console.log('Deleted existing Google Fit accounts');
            } catch (deleteError) {
                console.log('No existing accounts to delete');
            }

            // Create new account
            const account = await prisma.googleFitAccount.create({
                data: {
                    id: 'default',
                    providerAccountId: userEmail,
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token,
                    expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
                    token_type: tokens.token_type,
                    scope: tokens.scope
                }
            });

            console.log('Successfully created new Google Fit account:', {
                id: account.id,
                providerAccountId: account.providerAccountId,
                hasAccessToken: !!account.access_token,
                hasRefreshToken: !!account.refresh_token,
                expiresAt: account.expires_at
            });

            // Verify the account was created
            const verifyAccount = await prisma.googleFitAccount.findUnique({
                where: { id: 'default' }
            });

            if (!verifyAccount) {
                throw new Error('Failed to verify account creation');
            }

            console.log('Verified account exists:', {
                id: verifyAccount.id,
                providerAccountId: verifyAccount.providerAccountId
            });

            // Redirect to the health dashboard with success message
            return Response.redirect(new URL('/client/dashboard/health?success=true', request.url));
        } catch (tokenError) {
            console.error('Error exchanging code for tokens:', tokenError);
            console.error('Token error details:', {
                message: tokenError.message,
                code: tokenError.code,
                stack: tokenError.stack
            });
            
            // If the code is invalid or expired, redirect to reconnect
            if (tokenError.message.includes('invalid_grant')) {
                return Response.redirect(new URL('/client/dashboard/health?error=invalid_grant', request.url));
            }
            
            // Redirect with detailed error
            return Response.redirect(new URL(`/client/dashboard/health?error=token_error&details=${encodeURIComponent(tokenError.message)}`, request.url));
        }
    } catch (error) {
        console.error('Error in Google Fit callback:', error);
        console.error('Callback error details:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        return Response.redirect(new URL(`/client/dashboard/health?error=callback_error&details=${encodeURIComponent(error.message)}`, request.url));
    } finally {
        await prisma.$disconnect();
    }
} 