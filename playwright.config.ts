import { randomUUID } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

try {
  process.loadEnvFile(".env");
} catch {}
if (!process.env.TEST_MONGODB_URI) {
  throw new Error(
    "Set TEST_MONGODB_URI to a dedicated MongoDB server before running E2E tests",
  );
}
process.env.E2E_DB_NAME = `mern_e2e_${randomUUID().replaceAll("-", "")}`;

export default defineConfig({
  testDir: "./tests/e2e",
  globalTeardown: "./tests/e2e/teardown.ts",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://localhost:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node tests/e2e/server.ts",
      url: "http://127.0.0.1:3001/api/health",
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command:
        "pnpm --filter @mern/client exec vite --host 127.0.0.1 --port 4173 --strictPort",
      url: "http://localhost:4173",
      reuseExistingServer: false,
      timeout: 30_000,
      env: { API_PORT: "3001" },
    },
  ],
});
