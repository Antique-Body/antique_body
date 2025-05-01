import { NextResponse } from "next/server";
import { validateRegistration } from "@/middleware/validation";
import { userService } from "@/services/users";

export async function POST(request) {
    try {
        const data = await request.json();

        // Validate the input
        const validation = validateRegistration(data);

        if (!validation.valid) {
            return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
        }

        const { name, lastName, email, password } = data;

        try {
            // Create user using the service
            const user = await userService.createUser({
                name,
                lastName,
                email,
                password,
            });

            return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
        } catch (error) {
            // Handle known errors
            if (error.message === "Email already in use") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            // Re-throw unknown errors
            throw error;
        }
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 });
    }
}
