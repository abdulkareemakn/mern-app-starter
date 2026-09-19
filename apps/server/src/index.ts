import mongoose from "mongoose";
import { createApp } from "./app.ts";
import { createAuth } from "./auth.ts";
import { readConfig } from "./config.ts";

const config = readConfig(process.env);
try {
  await mongoose.connect(config.mongodbUri, { serverSelectionTimeoutMS: 5000 });
  const app = createApp(createAuth(config), config);
  const server = app.listen(config.port, "0.0.0.0", () => {
    console.info(`Server listening on port ${config.port}`);
  });
  server.on("error", () => {
    console.error(
      "HTTP server failed to start. Check whether PORT is already in use.",
    );
    void mongoose.disconnect().finally(() => process.exit(1));
  });

  let shuttingDown = false;
  function shutdown() {
    if (shuttingDown) return;
    shuttingDown = true;
    const timeout = setTimeout(() => process.exit(1), 10_000);
    timeout.unref();
    server.close(() => {
      void mongoose.disconnect().then(
        () => process.exit(0),
        () => process.exit(1),
      );
    });
  }
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} catch {
  console.error(
    "Startup failed. Check MongoDB connectivity and authentication configuration.",
  );
  await mongoose.disconnect();
  process.exitCode = 1;
}
