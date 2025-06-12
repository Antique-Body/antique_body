import { clientService } from "../services";

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

    const client = await clientService.createClientWithDetails(
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
    const client = await clientService.getClientProfileByUserId(
      session.user.id
    );
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

export async function PUT(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    // Ovdje možete dodati validaciju ako želite
    const updatedProfile = await clientService.updateClientProfile(
      session.user.id,
      body
    );
    return new Response(
      JSON.stringify({ success: true, data: updatedProfile }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating client profile:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
      }
    );
  }
}
