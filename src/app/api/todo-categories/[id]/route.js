import { NextResponse } from "next/server";

import { auth } from "#/auth";

import { todoCategoryService } from "../../todos/services";

// GET /api/todo-categories/[id] - Get a specific todo category
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const category = await todoCategoryService.getCategoryById(id, session.user.id);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching todo category:", error);
    return NextResponse.json(
      { error: "Failed to fetch todo category" },
      { status: 500 }
    );
  }
}

// PUT /api/todo-categories/[id] - Update a specific todo category
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if category exists and belongs to user
    const existingCategory = await todoCategoryService.getCategoryById(id, session.user.id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, color, icon } = body;

    // Validation
    if (name !== undefined && (!name || name.trim().length === 0)) {
      return NextResponse.json(
        { error: "Category name cannot be empty" },
        { status: 400 }
      );
    }

    if (name && name.length > 100) {
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

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;

    const category = await todoCategoryService.updateCategory(id, session.user.id, updateData);

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating todo category:", error);
    return NextResponse.json(
      { error: "Failed to update todo category" },
      { status: 500 }
    );
  }
}

// DELETE /api/todo-categories/[id] - Delete a specific todo category
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if category exists and belongs to user
    const existingCategory = await todoCategoryService.getCategoryById(id, session.user.id);
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    await todoCategoryService.deleteCategory(id, session.user.id);

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting todo category:", error);
    return NextResponse.json(
      { error: "Failed to delete todo category" },
      { status: 500 }
    );
  }
}