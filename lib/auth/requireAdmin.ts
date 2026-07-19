import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

interface RequireAdminResult {
  authorized: false;
  response: NextResponse;
}

interface RequireAdminSuccess {
  authorized: true;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export type RequireAdminReturn = RequireAdminResult | RequireAdminSuccess;

export async function requireAdmin(): Promise<RequireAdminReturn> {
  const sessionData = await getSession();

  if (!sessionData?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized — please log in" },
        { status: 401 }
      ),
    };
  }

  const user = sessionData.user as any;

  if (user.role !== "ADMIN") {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden — admin access required" },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}

/**
 * Helper for routes that require any logged-in user (not necessarily admin).
 * Use for sensitive GET routes (orders, settings, notifications).
 */
export async function requireAuth(): Promise<RequireAdminReturn> {
  const sessionData = await getSession();

  if (!sessionData?.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized — please log in" },
        { status: 401 }
      ),
    };
  }

  const user = sessionData.user as any;

  return {
    authorized: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  };
}
