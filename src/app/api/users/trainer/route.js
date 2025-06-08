import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { convertToEUR, convertFromEUR } from "../../../utils/currency";
import { trainerService } from "../services";

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
      } catch (err) {
        // Ako je greška usage_limit_reached, nastavi dalje s originalnim vrijednostima
        if (err.message && err.message.includes("usage_limit_reached")) {
          // samo nastavi, koristi originalne vrijednosti
        } else {
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
    }

    // Očekujemo contactEmail i contactPhone u payloadu
    const trainer = await trainerService.createTrainerWithDetails(
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

    // Pokušaj fetchati TrainerInfo (sa svim relacijama)
    let trainerInfo = await trainerService.getTrainerInfoByUserId(
      session.user.id
    );

    // Ako ne postoji, pokušaj automatski kreirati
    if (!trainerInfo) {
      // Pronađi profil
      const profile = await trainerService.getTrainerProfileByUserId(
        session.user.id
      );
      if (!profile) {
        return new Response(
          JSON.stringify({ error: "Trainer profile not found" }),
          { status: 404 }
        );
      }
      // Kreiraj prazan TrainerInfo
      await trainerService.createTrainerInfo(profile.id, {});
      // Fetchaj opet
      trainerInfo = await trainerService.getTrainerInfoByUserId(
        session.user.id
      );
    }

    // Konverzija pricePerSession ako treba (nađi ugniježdeno)
    let convertedPrice = trainerInfo.trainerProfile?.pricePerSession;
    if (
      trainerInfo.trainerProfile?.pricePerSession &&
      trainerInfo.trainerProfile?.currency &&
      trainerInfo.trainerProfile?.currency !== "EUR"
    ) {
      try {
        convertedPrice = await convertFromEUR(
          trainerInfo.trainerProfile.pricePerSession,
          trainerInfo.trainerProfile.currency
        );
      } catch (err) {
        console.error("Greška pri konverziji iz EUR:", err);
        convertedPrice = trainerInfo.trainerProfile.pricePerSession;
      }
    }

    // Response: sve podatke, ali pricePerSession u originalnoj valuti
    return new Response(
      JSON.stringify({
        ...trainerInfo,
        trainerProfile: {
          ...trainerInfo.trainerProfile,
          pricePerSession: convertedPrice,
        },
      }),
      { status: 200 }
    );
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
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    const body = await req.json();
    // Pronađi trainerProfileId
    const profile = await trainerService.getTrainerProfileByUserId(
      session.user.id
    );
    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Trainer profile not found" }),
        { status: 404 }
      );
    }
    // Kreiraj ili update TrainerInfo
    let trainerInfo = await trainerService.getTrainerInfoByProfileId(
      profile.id
    );
    if (trainerInfo) {
      // Update
      trainerInfo = await prisma.trainerInfo.update({
        where: { trainerProfileId: profile.id },
        data: body,
      });
    } else {
      // Create
      trainerInfo = await trainerService.createTrainerInfo(profile.id, body);
    }
    return new Response(JSON.stringify(trainerInfo), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
