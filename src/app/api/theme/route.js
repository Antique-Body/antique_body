import { themes } from "@/app/utils/themeConfig";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !session?.user?.phone) {
      const defaultTheme = {
        name: themes.ancientGreek.name,
        colors: { ...themes.ancientGreek.colors },
        design: { ...themes.ancientGreek.design },
        isCustom: false,
      };
      return NextResponse.json(defaultTheme);
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: session.user.email }, { phone: session.user.phone }],
      },
      include: { theme: true },
    });

    if (!user?.theme) {
      // Create default theme for user
      const defaultTheme = await prisma.theme.create({
        data: {
          name: themes.ancientGreek.name,
          colors: themes.ancientGreek.colors,
          design: themes.ancientGreek.design,
          isCustom: false,
          user: {
            connect: { id: user.id },
          },
        },
      });

      return NextResponse.json(defaultTheme);
    }

    return NextResponse.json(user.theme);
  } catch (error) {
    console.error("Error fetching theme:", error);
    const defaultTheme = {
      name: themes.ancientGreek.name,
      colors: { ...themes.ancientGreek.colors },
      design: { ...themes.ancientGreek.design },
      isCustom: false,
    };
    return NextResponse.json(defaultTheme);
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email && !session?.user?.phone) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First verify that the user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: session.user.email }, { phone: session.user.phone }],
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const themeData = await request.json();

    // Validate theme data
    if (!themeData.name || !themeData.colors || !themeData.design) {
      return NextResponse.json(
        { error: "Invalid theme data" },
        { status: 400 }
      );
    }

    // Get the user's current theme
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: session.user.email }, { phone: session.user.phone }],
      },
      include: { theme: true },
    });

    let updatedTheme;

    if (user?.theme) {
      // Update existing theme
      updatedTheme = await prisma.theme.update({
        where: { id: user.theme.id },
        data: {
          name: themeData.name,
          colors: themeData.colors,
          design: themeData.design,
          isCustom: themeData.isCustom ?? false,
        },
      });
    } else {
      // Create new theme
      try {
        updatedTheme = await prisma.theme.create({
          data: {
            name: themeData.name,
            colors: themeData.colors,
            design: themeData.design,
            isCustom: themeData.isCustom ?? false,
            user: {
              connect: { id: user.id },
            },
          },
        });
      } catch (createError) {
        console.error("Error creating theme:", createError);
        return NextResponse.json(
          { error: "Failed to create theme" },
          { status: 500 }
        );
      }
    }

    // Update user's themeId
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { themeId: updatedTheme.id },
      });
    } catch (updateError) {
      console.error("Error updating user theme:", updateError);
      // Don't return error here as the theme was created/updated successfully
    }

    return NextResponse.json(updatedTheme);
  } catch (error) {
    console.error("Error updating theme:", error);
    return NextResponse.json(
      { error: "Failed to update theme" },
      { status: 500 }
    );
  }
}
