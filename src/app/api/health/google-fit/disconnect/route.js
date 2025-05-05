import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        console.log('Disconnecting Google Fit account');

        // Delete all Google Fit accounts
        const deletedAccounts = await prisma.googleFitAccount.deleteMany();

        console.log('Deleted accounts:', deletedAccounts);

        return new Response(JSON.stringify({ 
            success: true,
            deletedCount: deletedAccounts.count
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error disconnecting Google Fit:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to disconnect Google Fit',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    } finally {
        await prisma.$disconnect();
    }
} 