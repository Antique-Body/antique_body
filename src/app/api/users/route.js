import { NextResponse } from "next/server";

import { isAuthenticated, hasRole } from "@/middleware/auth";
import { userService } from "@/services/users";
import { parseQueryParams } from "@/utils/api";

export async function GET(request) {
  try {
    // Check if user is authenticated and has admin role (or appropriate role)
    const roleCheck = await hasRole(request, ["ADMIN"]);

    if (!roleCheck.authorized) {
      return NextResponse.json({ error: roleCheck.message }, { status: 401 });
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
      { status: 500 },
    );
  }
}
