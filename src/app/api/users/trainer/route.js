import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
import { convertToEUR, convertFromEUR } from "../../../utils/currency";
import { trainerService } from "../services";

import { auth } from "#/auth";
import { validateTrainerProfile } from "@/middleware/validation";

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
      // Kreiraj prazan TrainerInfo, ali ignoriraj grešku ako već postoji
      try {
        await trainerService.createOrUpdateTrainerInfo(profile.id, {});
      } catch (err) {
        if (
          err.code !== "P2002" &&
          !(
            err.message &&
            err.message.includes(
              "Unique constraint failed on the fields: (`trainerProfileId`)"
            )
          )
        ) {
          throw err;
        }
        // Ako je unique constraint, samo nastavi
      }
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

    // Response: sve podatke, ali pricePerSession u originalnoj valuti i location objekt direktno u trainerProfile
    const location = trainerInfo.trainerProfile?.location || {};
    // Fetch all gyms for this trainer and include in location.gyms
    const trainerGyms = await prisma.trainerGym.findMany({
      where: { trainerId: trainerInfo.trainerProfile.id },
      include: { gym: true },
    });
    const gymsArray = trainerGyms.map((tg) => ({
      value: tg.gym.placeId,
      label: tg.gym.name,
      address: tg.gym.address,
      lat: tg.gym.lat,
      lon: tg.gym.lon,
    }));
    return new Response(
      JSON.stringify({
        ...trainerInfo,
        trainerProfile: {
          ...trainerInfo.trainerProfile,
          pricePerSession: convertedPrice,
          location: {
            ...location,
            gyms: gymsArray,
          },
          availability: trainerInfo.trainerProfile.availability || {},
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
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    const { valid, errors } = validateTrainerProfile(body.trainerProfile);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, error: errors }), {
        status: 400,
      });
    }
    // Pozovi servis (koji očekuje validiran input)
    const updatedProfile = await trainerService.updateTrainerProfile(
      session.user.id,
      body.trainerProfile
    );
    return new Response(
      JSON.stringify({ success: true, data: updatedProfile }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 400,
      }
    );
  }
}
