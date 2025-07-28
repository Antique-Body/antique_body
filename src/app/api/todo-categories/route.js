import { NextResponse } from "next/server";

import { auth } from "#/auth";

import { todoCategoryService } from "../todos/services";

// GET /api/todo-categories - List user's todo categories
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const categories = await todoCategoryService.getUserCategories(session.user.id);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching todo categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo categories" },
      { status: 500 }
    );
  }
}

// POST /api/todo-categories - Create a new todo category
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, color, icon } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: "Category name must be less than 100 characters" },
        { status: 400 }
      );
    }

    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      return NextResponse.json(
        { error: "Invalid color format. Use hex format like #3B82F6" },
        { status: 400 }
      );
    }

    const category = await todoCategoryService.createCategory(session.user.id, {
      name: name.trim(),
      color,
      icon,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating todo category:", error);
    return NextResponse.json(
      { error: "Failed to create todo category" },
      { status: 500 }
    );
  }
}