import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
            return new Response(JSON.stringify({ 
                error: 'No authorization code provided',
                details: 'Please try connecting again'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Create OAuth2 client
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_FIT_CLIENT_ID,
            process.env.GOOGLE_FIT_CLIENT_SECRET,
            process.env.GOOGLE_FIT_REDIRECT_URI
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        
        if (!tokens.access_token) {
            throw new Error('No access token received');
        }

        // Get user profile information
        oauth2Client.setCredentials(tokens);
        const people = google.people({ version: 'v1', auth: oauth2Client });
        const profile = await people.people.get({
            resourceName: 'people/me',
            personFields: 'names,emailAddresses'
        });

        const userEmail = profile.data.emailAddresses?.[0]?.value;
        
        // Find or create user
        const user = await prisma.user.upsert({
            where: { email: userEmail },
            update: {},
            create: {
                email: userEmail,
                name: profile.data.names?.[0]?.displayName
            }
        });

        // Store tokens in database
        const account = await prisma.googleFitAccount.upsert({
            where: {
                providerAccountId: profile.data.resourceName
            },
            update: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
                token_type: tokens.token_type,
                scope: tokens.scope,
                updatedAt: new Date()
            },
            create: {
                providerAccountId: profile.data.resourceName,
                provider: 'google-fit',
                type: 'oauth',
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: tokens.expiry_date ? Math.floor(tokens.expiry_date / 1000) : null,
                token_type: tokens.token_type,
                scope: tokens.scope,
                userId: user.id
            }
        });

        // Redirect back to health page
        return Response.redirect(new URL('/client/dashboard/health', req.url));
    } catch (error) {
        console.error('Error in Google Fit callback:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to store Google Fit tokens',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
} 