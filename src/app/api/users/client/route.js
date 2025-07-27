import { auth } from "#/auth";
import { formatPhoneNumber } from "@/lib/utils";

import { clientService } from "../services";

export async function POST(req) {
  try {
    const session = await auth();
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

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode"); // 'basic', 'edit', 'settings'

    // Handle different data fetching modes
    let profile;

    switch (mode) {
      case "basic":
        profile = await clientService.getClientProfileBasic(session.user.id);
        break;
      case "edit":
        profile = await clientService.getClientProfileForEdit(session.user.id);
        break;
      case "settings":
        profile = await clientService.getClientSettings(session.user.id);
        break;
      default:
        // Default to basic mode for dashboard
        profile = await clientService.getClientProfileBasic(session.user.id);
        break;
    }

    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Client profile not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, data: profile }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in client GET:", error);
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

    // Convert height and weight from string to integer if they exist
    const processedBody = {
      ...body,
      height: body.height ? parseInt(body.height, 10) : null,
      weight: body.weight ? parseInt(body.weight, 10) : null,
    };

    // Format phone number before saving
    const phone = body.phone ? formatPhoneNumber(body.phone) : undefined;

    const updatedProfile = await clientService.updateClientProfile(
      session.user.id,
      { ...processedBody, phone }
    );

    // Also update User model (if necessary)
    const prisma = (await import("@/lib/prisma")).default;
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        phone,
        email: body.email,
        phoneVerified: body.phoneVerified ? new Date() : undefined,
        // Other fields as needed
      },
    });

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
