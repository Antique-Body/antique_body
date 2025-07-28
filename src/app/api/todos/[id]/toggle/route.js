import { NextResponse } from "next/server";

import { auth } from "#/auth";

import { todoService } from "../../services";

// POST /api/todos/[id]/toggle - Toggle todo completion status
export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    const todo = await todoService.toggleTodo(id, session.user.id);

    if (!todo) {
      return NextResponse.json(
        { error: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error("Error toggling todo:", error);
    return NextResponse.json(
      { error: "Failed to toggle todo" },
      { status: 500 }
    );
  }
}