import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Home });

const layers = [
  ["01", "Client", "React, Vite, TanStack Router, Tailwind"],
  ["02", "Server", "Express, TypeScript, Zod validation"],
  ["03", "Data", "MongoDB, Mongoose, shared contracts"],
  ["04", "Delivery", "Email, Docker, tests, production build"],
] as const;

function Home() {
  return (
    <div className="min-h-screen bg-muted/40">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <a className="font-semibold tracking-tight" href="/">
          MERN
        </a>
        <p className="text-sm text-muted-foreground">Course starter</p>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-16 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_26rem] lg:gap-24">
          <div className="max-w-2xl">
            <p className="mb-5 text-sm font-medium">
              A full stack you can follow.
            </p>
            <h1 className="max-w-xl text-5xl leading-[1.05] font-semibold tracking-[-0.04em] text-balance sm:text-7xl">
              Learn by building the whole thing.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground text-pretty">
              A production-minded MERN foundation for students. It exists so
              class time goes into building real features—not repeating setup.
            </p>
          </div>

          <div className="rounded-xl border bg-background p-5 sm:p-6">
            <div className="flex items-center justify-between border-b pb-4">
              <p className="text-sm font-medium">One request, end to end</p>
              <span className="font-mono text-xs text-muted-foreground">
                GET /api/health
              </span>
            </div>
            <ol className="mt-2">
              {layers.slice(0, 3).map(([number, name], index) => (
                <li
                  className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-b py-4 text-sm last:border-0"
                  key={name}
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {number}
                  </span>
                  <span>{name}</span>
                  <span className="text-muted-foreground">
                    {index === 0
                      ? "React"
                      : index === 1
                        ? "Express"
                        : "MongoDB"}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-center justify-between rounded-lg bg-primary px-4 py-3 text-sm text-primary-foreground">
              <span className="font-mono">200 OK</span>
              <span>Connected</span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="border-t pt-8">
            <h2 className="text-sm font-medium">What it contains</h2>
            <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {layers.map(([number, name, contents]) => (
                <article key={name}>
                  <p className="font-mono text-xs text-muted-foreground">
                    {number}
                  </p>
                  <h3 className="mt-3 font-medium">{name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {contents}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
