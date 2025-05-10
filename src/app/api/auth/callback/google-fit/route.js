import { PrismaClient } from "@prisma/client";
import { google } from "googleapis";

const prisma = new PrismaClient();
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_FIT_CLIENT_ID,
    process.env.GOOGLE_FIT_CLIENT_SECRET,
    process.env.GOOGLE_FIT_REDIRECT_URI
);

export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        // Check for OAuth errors
        if (error) {
            console.error("OAuth error:", error);
            return Response.redirect(new URL("/client/dashboard/health?error=" + error, request.url));
        }

        if (!code) {
            console.error("No code provided in callback");
            return Response.redirect(new URL("/client/dashboard/health?error=no_code", request.url));
        }

        try {
            // Exchange the code for tokens
            const { tokens } = await oauth2Client.getToken(code);

            // Get user profile information
            oauth2Client.setCredentials(tokens);
            const people = google.people({ version: "v1", auth: oauth2Client });
            const profile = await people.people.get({
                resourceName: "people/me",
                personFields: "names,emailAddresses",
            });

            const userEmail = profile.data.emailAddresses?.[0]?.value;

            if (!userEmail) {
                throw new Error("No email found in user profile");
            }

            // First, try to delete any existing account
            try {
                await prisma.googleFitAccount.deleteMany();
            } catch (deleteError) {
                console.error(deleteError);
            }

            // Verify the account was created
            const verifyAccount = await prisma.googleFitAccount.findUnique({
                where: { id: "default" },
            });

            if (!verifyAccount) {
                throw new Error("Failed to verify account creation");
            }

            // Redirect to the health dashboard with success message
            return Response.redirect(new URL("/client/dashboard/health?success=true", request.url));
        } catch (tokenError) {
            console.error("Error exchanging code for tokens:", tokenError);
            console.error("Token error details:", {
                message: tokenError.message,
                code: tokenError.code,
                stack: tokenError.stack,
            });

            // If the code is invalid or expired, redirect to reconnect
            if (tokenError.message.includes("invalid_grant")) {
                return Response.redirect(new URL("/client/dashboard/health?error=invalid_grant", request.url));
            }

            // Redirect with detailed error
            return Response.redirect(
                new URL(
                    `/client/dashboard/health?error=token_error&details=${encodeURIComponent(tokenError.message)}`,
                    request.url
                )
            );
        }
    } catch (error) {
        console.error("Error in Google Fit callback:", error);
        console.error("Callback error details:", {
            message: error.message,
            code: error.code,
            stack: error.stack,
        });
        return Response.redirect(
            new URL(`/client/dashboard/health?error=callback_error&details=${encodeURIComponent(error.message)}`, request.url)
        );
    } finally {
        await prisma.$disconnect();
    }
}
