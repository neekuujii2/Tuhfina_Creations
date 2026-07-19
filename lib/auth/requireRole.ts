import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

interface RequireRoleResult {
  authorized: false;
  response: NextResponse;
}

interface RequireRoleSuccess {
  authorized: true;
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
}

export type RequireRoleReturn = RequireRoleResult | RequireRoleSuccess;

const ROLE_HIERARCHY: Record<string, number> = {
  owner: 4,
  manager: 3,
  packer: 2,
  viewer: 1,
  ADMIN: 4,
};

export async function requireRole(allowedRoles: string[]): Promise<RequireRoleReturn> {
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

  if (!allowedRoles.includes(user.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Forbidden — insufficient permissions" },
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

export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
  return requiredRoles.some(role => (ROLE_HIERARCHY[role] ?? 0) <= userLevel);
}

export function canManageUsers(userRole: string): boolean {
  return userRole === 'owner' || userRole === 'ADMIN';
}

export function canManageSettings(userRole: string): boolean {
  return userRole === 'owner' || userRole === 'manager' || userRole === 'ADMIN';
}
