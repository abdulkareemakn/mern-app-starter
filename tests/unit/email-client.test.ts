import { beforeEach, expect, test, vi } from "vitest";
import type { Config } from "../../apps/server/src/config.ts";

const { createTransport, sendMail } = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransport.mockReturnValue({ sendMail }),
  },
}));

const { sendEmail } = await import("../../apps/server/src/lib/email-client.ts");
const config = { nodeEnv: "development" } as Config;

beforeEach(() => vi.clearAllMocks());

test("sends non-production email to the local SMTP inbox", async () => {
  const email = {
    from: "starter@example.com",
    to: "student@example.com",
    subject: "Welcome",
    html: "<p>Welcome</p>",
  };

  await sendEmail(email, config);

  expect(createTransport).toHaveBeenCalledWith({
    host: "127.0.0.1",
    port: 3025,
    secure: false,
  });
  expect(sendMail).toHaveBeenCalledWith(email);
});
