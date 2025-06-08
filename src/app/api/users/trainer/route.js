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

    // Find the trainer profile
    const profile = await trainerService.getTrainerProfileByUserId(
      session.user.id
    );
    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Trainer profile not found" }),
        { status: 404 }
      );
    }

    // Handle trainer profile update
    if (body.trainerProfile) {
      // Prepare certification data if provided
      const certifications = body.trainerProfile.certifications || [];

      // First, delete existing certifications
      await prisma.certification.deleteMany({
        where: { trainerProfileId: profile.id },
      });

      // Then create new certifications
      if (certifications.length > 0) {
        // Create new certifications
        for (const cert of certifications) {
          // If cert is just a string, create a simple certification
          if (typeof cert === "string") {
            await prisma.certification.create({
              data: {
                trainerProfileId: profile.id,
                name: cert,
              },
            });
          }
          // If cert is an object with more details
          else if (typeof cert === "object") {
            const certData = {
              name: cert.name,
              issuer: cert.issuer || null,
              expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            };

            // Create the certification
            const newCert = await prisma.certification.create({
              data: {
                trainerProfileId: profile.id,
                ...certData,
              },
            });

            // Handle file uploads if any
            if (
              cert.files &&
              Array.isArray(cert.files) &&
              cert.files.length > 0
            ) {
              // For each file, create a document entry
              for (const file of cert.files) {
                if (file && (file.url || file.data)) {
                  await prisma.certificationDocument.create({
                    data: {
                      certificationId: newCert.id,
                      url: file.url || file.data || "",
                      originalName: file.name || "document",
                      mimetype: file.type || "application/octet-stream",
                    },
                  });
                }
              }
            }
          }
        }
      }

      // Update the trainer profile excluding certifications (handled separately)
      const { certifications: _, ...profileData } = body.trainerProfile;

      // Update profile
      await prisma.trainerProfile.update({
        where: { id: profile.id },
        data: {
          ...profileData,
          dateOfBirth: profileData.dateOfBirth
            ? new Date(profileData.dateOfBirth)
            : profile.dateOfBirth,
        },
      });
    }

    // Handle trainer info update
    let trainerInfo = await trainerService.getTrainerInfoByProfileId(
      profile.id
    );

    // Prepare trainer info data
    const infoData = {
      rating: body.rating,
      totalSessions: body.totalSessions,
      totalEarnings: body.totalEarnings,
      upcomingSessions: body.upcomingSessions,
    };

    if (trainerInfo) {
      // Update
      trainerInfo = await prisma.trainerInfo.update({
        where: { trainerProfileId: profile.id },
        data: infoData,
      });
    } else {
      // Create
      trainerInfo = await trainerService.createTrainerInfo(
        profile.id,
        infoData
      );
    }

    // Get updated profile with all relations
    const updatedProfile = await trainerService.getTrainerProfileByUserId(
      session.user.id
    );

    return new Response(
      JSON.stringify({
        ...trainerInfo,
        trainerProfile: updatedProfile,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
