import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

export async function GET() {
    try {
        console.log('Checking Google Fit status...');

        // First check if any account exists
        const account = await prisma.googleFitAccount.findFirst({
            select: {
                id: true,
                providerAccountId: true,
                access_token: true,
                refresh_token: true,
                expires_at: true,
                createdAt: true,
                updatedAt: true
            }
        });

        console.log('Account found:', {
            hasAccount: !!account,
            id: account?.id,
            providerAccountId: account?.providerAccountId,
            hasAccessToken: !!account?.access_token,
            hasRefreshToken: !!account?.refresh_token,
            expiresAt: account?.expires_at
        });

        if (!account) {
            console.log('No Google Fit account found');
            return new Response(JSON.stringify({
                connected: false,
                message: 'No Google Fit account found'
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Check if token is expired
        const isExpired = account.expires_at && new Date(account.expires_at * 1000) < new Date();
        console.log('Token status:', { isExpired });

        // If token is expired and we have a refresh token, try to refresh it
        if (isExpired && account.refresh_token) {
            try {
                console.log('Attempting to refresh token...');
                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_FIT_CLIENT_ID,
                    process.env.GOOGLE_FIT_CLIENT_SECRET,
                    process.env.GOOGLE_FIT_REDIRECT_URI
                );

                oauth2Client.setCredentials({
                    refresh_token: account.refresh_token
                });

                const { credentials } = await oauth2Client.refreshAccessToken();
                console.log('Token refresh successful');
                
                // Update the account with new tokens
                await prisma.googleFitAccount.update({
                    where: { id: account.id },
                    data: {
                        access_token: credentials.access_token,
                        expires_at: credentials.expiry_date ? Math.floor(credentials.expiry_date / 1000) : null,
                        token_type: credentials.token_type,
                        updatedAt: new Date()
                    }
                });

                console.log('Account updated with new tokens');

                // Return updated connection status
                return new Response(JSON.stringify({
                    connected: true,
                    account: {
                        id: account.id,
                        providerAccountId: account.providerAccountId,
                        hasAccessToken: true,
                        hasRefreshToken: !!account.refresh_token,
                        isExpired: false,
                        connectedAt: account.createdAt,
                        lastUpdated: new Date()
                    }
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                // If refresh fails, return expired status
                return new Response(JSON.stringify({
                    connected: false,
                    account: {
                        id: account.id,
                        providerAccountId: account.providerAccountId,
                        hasAccessToken: !!account.access_token,
                        hasRefreshToken: !!account.refresh_token,
                        isExpired: true,
                        connectedAt: account.createdAt,
                        lastUpdated: account.updatedAt
                    },
                    error: 'Token refresh failed',
                    details: refreshError.message
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        return new Response(JSON.stringify({
            connected: !isExpired && !!account.access_token,
            account: {
                id: account.id,
                providerAccountId: account.providerAccountId,
                hasAccessToken: !!account.access_token,
                hasRefreshToken: !!account.refresh_token,
                isExpired: isExpired,
                connectedAt: account.createdAt,
                lastUpdated: account.updatedAt
            }
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error checking Google Fit status:', error);
        return new Response(JSON.stringify({
            connected: false,
            error: 'Failed to check connection status',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
} 