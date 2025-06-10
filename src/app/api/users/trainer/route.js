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
      await trainerService.createOrUpdateTrainerInfo(profile.id, {});
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
    const data = body.trainerProfile;

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

    // Briši stare relacije
    await prisma.trainerSpecialty.deleteMany({
      where: { trainerProfileId: profile.id },
    });
    await prisma.trainerLanguage.deleteMany({
      where: { trainerProfileId: profile.id },
    });
    await prisma.trainerEnvironment.deleteMany({
      where: { trainerProfileId: profile.id },
    });
    await prisma.trainerType.deleteMany({
      where: { trainerProfileId: profile.id },
    });
    await prisma.certification.deleteMany({
      where: { trainerProfileId: profile.id },
    });

    // Kreiraj nove relacije i certifikate
    const {
      certifications,
      specialties,
      languages,
      trainingEnvironments,
      trainingTypes,
      availability,
      education,
      ...profileData
    } = data;

    // Kreiraj certifikate
    if (certifications && certifications.length > 0) {
      for (const cert of certifications) {
        const certData = {
          name: cert.name,
          issuer: cert.issuer || null,
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
          hidden: cert.hidden !== undefined ? cert.hidden : false,
        };
        const newCert = await prisma.certification.create({
          data: {
            trainerProfileId: profile.id,
            ...certData,
          },
        });
        if (
          cert.documents &&
          Array.isArray(cert.documents) &&
          cert.documents.length > 0
        ) {
          for (const file of cert.documents) {
            if (file && file.url) {
              await prisma.certificationDocument.create({
                data: {
                  certificationId: newCert.id,
                  url: file.url,
                  originalName: file.originalName || "document",
                  mimetype: file.mimetype || "application/octet-stream",
                },
              });
            }
          }
        }
      }
    }

    // Izbaci polja koja nisu u modelu
    const {
      city,
      state,
      country,
      id,
      userId,
      createdAt,
      updatedAt,
      location,
      description, // description je duplikat professionalBio
      ...allowedProfileData
    } = profileData;

    await prisma.trainerProfile.update({
      where: { id: profile.id },
      data: {
        ...allowedProfileData,
        dateOfBirth: allowedProfileData.dateOfBirth
          ? new Date(allowedProfileData.dateOfBirth)
          : profile.dateOfBirth,
        specialties: { create: (specialties || []).map((name) => ({ name })) },
        languages: { create: (languages || []).map((name) => ({ name })) },
        trainingEnvironments: {
          create: (trainingEnvironments || []).map((name) => ({ name })),
        },
        trainingTypes: {
          create: (trainingTypes || []).map((name) => ({ name })),
        },
        availability: availability || undefined,
        education: education || undefined,
      },
    });

    // Get updated profile with all relations
    const updatedProfile = await trainerService.getTrainerProfileByUserId(
      session.user.id
    );
    return new Response(JSON.stringify(updatedProfile), { status: 200 });
  } catch (error) {
    console.error("Error updating trainer profile:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
