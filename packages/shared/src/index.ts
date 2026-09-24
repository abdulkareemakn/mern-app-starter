// Browser-safe API contracts. Import with `import type`; database models stay on the server.
export type HealthResponse = { status: "ok" | "unavailable" };
export type MeResponse = { user: { id: string; name: string; email: string } };
export type ApiError = { error: string };

export type FileResponse = {
  id: string;
  key: string;
  ownerId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  status: "pending" | "confirmed";
  createdAt: string;
  confirmedAt: string | null;
};
export type CreateUploadResponse = {
  fileId: string;
  uploadUrl: string;
  key: string;
};
export type DownloadUploadResponse = { downloadUrl: string };
