import { convertToEUR } from "../../../utils/currency";
import { userService } from "../services";

import { auth } from "#/auth";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();

    // Konvertuj pricePerSession u EUR ako postoji i valuta nije EUR
    if (body.pricePerSession && body.currency && body.currency !== "EUR") {
      try {
        const priceInEUR = await convertToEUR(
          body.pricePerSession,
          body.currency
        );
        body.pricePerSession = priceInEUR;
        body.currency = "EUR";
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: "Currency conversion failed: " + err.message,
          }),
          {
            status: 400,
          }
        );
      }
    }

    const trainer = await userService.createTrainerWithDetails(
      body,
      session.user.id
    );
    return new Response(JSON.stringify(trainer), { status: 201 });
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
    const trainer = await userService.getTrainerProfileByUserId(
      session.user.id
    );
    if (!trainer) {
      return new Response(
        JSON.stringify({ error: "Trainer profile not found" }),
        { status: 404 }
      );
    }
    return new Response(JSON.stringify(trainer), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
