import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
    try {

        // Delete the Google Fit account
        const deletedAccount = await prisma.googleFitAccount.delete({
            where: {
                id: 'default'
            }
        });


        return new Response(JSON.stringify({ 
            success: true,
            message: 'Successfully disconnected Google Fit account'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error disconnecting Google Fit:', error);
        return new Response(JSON.stringify({ 
            success: false,
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