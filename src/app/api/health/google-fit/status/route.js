import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const account = await prisma.googleFitAccount.findFirst({
            orderBy: {
                updatedAt: 'desc'
            },
            select: {
                id: true,
                providerAccountId: true,
                access_token: true,
                refresh_token: true,
                expires_at: true,
                scope: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!account) {
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

        // If token is expired and we have a refresh token, try to refresh it
        if (isExpired && account.refresh_token) {
            try {
                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_FIT_CLIENT_ID,
                    process.env.GOOGLE_FIT_CLIENT_SECRET,
                    process.env.GOOGLE_FIT_REDIRECT_URI
                );

                oauth2Client.setCredentials({
                    refresh_token: account.refresh_token
                });

                const { credentials } = await oauth2Client.refreshAccessToken();
                
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

                // Return updated connection status
                return new Response(JSON.stringify({
                    connected: true,
                    account: {
                        id: account.id,
                        providerAccountId: account.providerAccountId,
                        hasAccessToken: true,
                        hasRefreshToken: !!account.refresh_token,
                        isExpired: false,
                        scope: account.scope,
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
                        scope: account.scope,
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
                scope: account.scope,
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