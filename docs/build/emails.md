---
title: Emails
description: Build React Email templates, inspect local messages with MailDev, and send production mail through Resend.
---

# Emails

This starter kit separates email authoring, local delivery, inspection, and production delivery:

| Tool | Responsibility |
| --- | --- |
| React Email | Compose and preview HTML templates with React components |
| Nodemailer | Send application messages to the local SMTP server during development |
| MailDev | Capture those SMTP messages and show them in a browser inbox |
| Resend | Deliver messages to real recipients in production |

Application code calls `sendEmail()`; the helper selects Nodemailer or Resend from validated server configuration. A previewed template is not an email sent by the application. Inspect MailDev to verify the whole development flow.

## Project structure

```text
packages/
  emails/
    email.tsx              # React Email template
  mail/
    package.json           # MailDev development inbox

apps/server/src/lib/
  email-client.ts          # Development SMTP and production Resend adapter
```

## Development URLs

The email tools use fixed localhost ports:

| Tool | Command | URL |
| --- | --- | --- |
| React Email preview | `pnpm dev:mail` | `http://localhost:3002` |
| MailDev inbox | `pnpm dev` | `http://localhost:3003` |

React Email previews templates while you edit them. MailDev shows messages actually sent by the application during development.

The local SMTP server listens on `localhost:3025`.

## Author and send

### Create a template

Export a component from `packages/emails/` with explicit props:

```tsx title="packages/emails/welcome.tsx"
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Text,
} from "react-email";

type WelcomeEmailProps = {
  name: string;
  loginUrl: string;
};

export function WelcomeEmail({ name, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the app</Preview>
      <Body>
        <Container>
          <Text>Welcome, {name}!</Text>
          <Button href={loginUrl}>Sign in</Button>
        </Container>
      </Body>
    </Html>
  );
}
```

Use absolute URLs for links and images. Keep the props limited to values the template renders.

### Preview templates

Run `pnpm dev:mail`, then open `http://localhost:3002`. The React Email development server reloads when a template changes.

The equivalent package-level command is:

```sh
pnpm --filter @mern/emails dev
```

### Send an email

Import the provider-neutral helper from server code:

```ts title="apps/server/src/lib/email-client.ts"
export type Email = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export function sendEmail(email: Email, config: Config) {
  if (config.nodeEnv === "production")
    return new Resend(config.resendApiKey).emails.send(email);
  return nodemailer.createTransport({ host: "127.0.0.1", port: 3025 }).sendMail(email);
}
```

`sendEmail()` accepts ordinary HTML and optional plain text, so a new feature does not need to know whether development uses Nodemailer or production uses Resend:

```ts title="apps/server/src/routes/onboarding.ts"
import { sendEmail } from "../lib/email-client.ts";

await sendEmail({
  from: "Your App <onboarding@example.com>",
  to: user.email,
  subject: "Welcome to Your App",
  html: "<p>Welcome to Your App!</p>",
  text: "Welcome to Your App!",
}, config);
```

Validate recipients and template input before sending. Do not include secrets or raw request data in email logs.

The React Email workspace is the visual template authoring and preview environment. Keep templates there while designing them. The server helper deliberately accepts rendered HTML, which keeps delivery code small and also supports HTML produced by React Email, a Markdown renderer, or a simple string template.

## Verify delivery

### Inspect development messages

Outside production, `sendEmail()` uses SMTP at `127.0.0.1:3025`. MailDev captures the message and displays it at `http://localhost:3003`. Nothing is delivered to the real recipient.

This lets integration work use realistic email content without requiring provider credentials or sending accidental messages.

### Local development flow

1. Run `pnpm dev` once from the repository root.
2. Write server code that calls `sendEmail()`.
3. Trigger that code from the application or an integration test.
4. Open `http://localhost:3003`.
5. Inspect the subject, recipients, HTML, text, and links.

No API key, external account, or manually started SMTP process is required for this flow.

### Production delivery

When `NODE_ENV=production`, `sendEmail()` uses Resend. Set this secret in the deployment environment:

```bash
RESEND_API_KEY=re_...
```

Configure and verify the sender domain in Resend before using it in the `from` field. Do not prefix the key with `VITE_` or expose it to the browser.

## Verify

```sh
pnpm dev
pnpm dev:mail
```

Then:

1. Open `http://localhost:3002` and verify the template renders.
2. Trigger the application action that sends the message.
3. Open `http://localhost:3003` and inspect the received HTML and text.
4. Check links, subject, sender, recipient, and narrow-screen rendering.

## References

- [React Email](https://react.email/)
- [MailDev](https://github.com/maildev/maildev)
- [Resend Node SDK](https://resend.com/docs/send-with-nodejs)
- [Development workflow](/installation/development-workflow/#environment-variables)
- [Middleware](/build/middleware)
