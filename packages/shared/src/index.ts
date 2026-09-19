// Browser-safe API contracts. Import with `import type`; database models stay on the server.
export type HealthResponse = { status: "ok" | "unavailable" };
export type MeResponse = { user: { id: string; name: string; email: string } };
export type ApiError = { error: string };
