import { NextResponse } from "next/server";

import { auth } from "#/auth";
import { userService } from "@/services/users";
import { parseQueryParams } from "@/utils/api";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You don't have permission to access this resource" },
        { status: 401 }
      );
    }

    // Parse query parameters for pagination
    const params = parseQueryParams(request);
    const page = parseInt(params.page, 10) || 1;
    const limit = parseInt(params.limit, 10) || 10;
    const role = params.role || null;

    // Get users using the service
    const result = await userService.getAllUsers(page, limit, role);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}
