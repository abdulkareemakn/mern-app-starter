import path from "node:path";

const serverNodeModules = path.resolve(
  import.meta.dirname,
  "apps/server/node_modules",
);

export default {
  resolve: {
    alias: Object.fromEntries(
      [
        "better-auth/adapters/mongodb",
        "better-auth/node",
        "better-auth",
        "express",
        "mongoose",
        "nodemailer",
        "resend",
        "supertest",
        "zod",
      ].map((name) => [
        name,
        name === "better-auth/adapters/mongodb"
          ? path.join(
              serverNodeModules,
              "better-auth/dist/adapters/mongodb-adapter/index.mjs",
            )
          : name === "better-auth/node"
            ? path.join(
                serverNodeModules,
                "better-auth/dist/integrations/node.mjs",
              )
            : path.join(serverNodeModules, name),
      ]),
    ),
  },
  server: { deps: { inline: true } },
  test: {
    deps: {
      moduleDirectories: ["node_modules", serverNodeModules],
    },
  },
};
