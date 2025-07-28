import { NextResponse } from "next/server";

import { auth } from "#/auth";

import { todoService } from "./services";

function parseQueryParams(request) {
  const url = new URL(request.url);
  const params = {};

  for (const [key, value] of url.searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

// GET /api/todos - List user's todos with filters
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const params = parseQueryParams(request);
    const filters = {
      status: params.status,
      priority: params.priority,
      categoryId: params.categoryId,
      completed: params.completed === "true" ? true : params.completed === "false" ? false : undefined,
      search: params.search,
      page: parseInt(params.page, 10) || 1,
      limit: Math.min(parseInt(params.limit, 10) || 50, 100), // Max 100 items per page
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
    };

    const result = await todoService.getUserTodos(session.user.id, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
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
    const { title, description, priority, dueDate, categoryId, tags } = body;

    // Validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (title.length > 255) {
      return NextResponse.json(
        { error: "Title must be less than 255 characters" },
        { status: 400 }
      );
    }

    if (description && description.length > 2000) {
      return NextResponse.json(
        { error: "Description must be less than 2000 characters" },
        { status: 400 }
      );
    }

    if (priority && !["low", "medium", "high", "urgent"].includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority value" },
        { status: 400 }
      );
    }

    if (dueDate && isNaN(new Date(dueDate).getTime())) {
      return NextResponse.json(
        { error: "Invalid due date format" },
        { status: 400 }
      );
    }

    const todo = await todoService.createTodo(session.user.id, {
      title: title.trim(),
      description: description?.trim() || null,
      priority,
      dueDate,
      categoryId,
      tags,
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Error creating todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}