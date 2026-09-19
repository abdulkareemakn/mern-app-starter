export function readConfig(env: NodeJS.ProcessEnv) {
  const nodeEnv = env.NODE_ENV || "development";
  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }
  const port = Number(env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  const mongodbUri = env.MONGODB_URI;
  if (!mongodbUri || !/^mongodb(?:\+srv)?:\/\//.test(mongodbUri)) {
    throw new Error("MONGODB_URI must be a MongoDB connection URL");
  }
  const secret = env.BETTER_AUTH_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error(
      "Set BETTER_AUTH_SECRET to a randomly generated secret of at least 32 characters",
    );
  }
  function origin(key: string) {
    let url: URL;
    try {
      url = new URL(env[key] || "");
    } catch {
      throw new Error(`${key} must be an HTTP(S) origin`);
    }
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      throw new Error(
        `${key} must be an HTTP(S) origin without a path or credentials`,
      );
    }
    return url.origin;
  }
  const appUrl = origin("APP_URL");
  const authUrl = origin("BETTER_AUTH_URL");
  if (appUrl !== authUrl)
    throw new Error(
      "APP_URL and BETTER_AUTH_URL must match for this same-origin template",
    );
  const trustProxy =
    env.TRUST_PROXY?.split(",")
      .map((value) => value.trim())
      .filter(Boolean) || [];
  return { nodeEnv, port, mongodbUri, secret, appUrl, authUrl, trustProxy };
}

export type Config = ReturnType<typeof readConfig>;
