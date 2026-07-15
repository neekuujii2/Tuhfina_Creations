import { NextResponse } from 'next/server';
import { ZodError, type ZodType } from 'zod';

export function createSuccessResponse(data: unknown, status = 200) {
    return NextResponse.json(data, { status });
}

export function createErrorResponse(message: string, status = 500) {
    return NextResponse.json({ error: message }, { status });
}

export function normalizeEmail(value: string) {
    return value.trim().toLowerCase();
}

export async function parseJsonBody<T>(request: Request, schema?: ZodType<T>) {
    try {
        const body = await request.json();

        if (!schema) {
            return { data: body as T };
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            const issues = parsed.error.issues.map((issue) => issue.message);
            return {
                error: createErrorResponse(issues[0] ?? 'Invalid request payload', 400),
            };
        }

        return { data: parsed.data };
    } catch {
        return {
            error: createErrorResponse('Invalid JSON body', 400),
        };
    }
}

export function handleApiError(error: unknown, fallbackMessage = 'Internal Server Error') {
    if (error instanceof ZodError) {
        const message = error.issues[0]?.message ?? fallbackMessage;
        return createErrorResponse(message, 400);
    }

    if (error instanceof Error && error.message) {
        return createErrorResponse(error.message, 500);
    }

    return createErrorResponse(fallbackMessage, 500);
}
