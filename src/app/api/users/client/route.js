import { userService } from "../services";

import { auth } from "#/auth";

export async function POST(req) {
  try {
    const session = await auth();
    console.log("session", session);
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();

    const client = await userService.createClientWithDetails(
      body,
      session.user.id
    );
    return new Response(JSON.stringify(client), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const client = await userService.getClientProfileByUserId(session.user.id);
    if (!client) {
      return new Response(
        JSON.stringify({ error: "Client profile not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(client), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
