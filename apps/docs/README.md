# Documentation site

This folder is a [Blume](https://useblume.dev) documentation site. Content is plain
Markdown/MDX; navigation, search, and SEO are derived from the file tree.

## Run it

```sh
pnpm --filter @mern/docs dev        # http://localhost:4321
pnpm --filter @mern/docs build      # static output in apps/docs/dist
pnpm --filter @mern/docs preview    # serve the last build
pnpm --filter @mern/docs doctor     # diagnose config and content problems
pnpm --filter @mern/docs validate   # check internal, anchor, asset, and external links
```

## Where things live

```text
apps/docs/
  blume.config.ts        # site title, description, sidebar display mode
  docs/                  # content root — everything below becomes a route
    index.mdx            # "/" — the landing page
    _snippets/           # partials, never routed; splice with <include>
    getting-started/
      meta.ts            # group title, icon, order, and page order
      index.mdx          # "/getting-started"
      prerequisites.mdx  # "/getting-started/prerequisites"
    ...
```

The root `index.mdx` stands alone at the top of the sidebar; it is written as the
"Introduction" page and is kept in place automatically. Every other top-level entry is a
folder, and its position is set by that folder's `meta.ts`.

`meta.ts` is TypeScript, so `defineMeta` autocompletes and validates every field. Only
`blume.config.ts`, `docs/**`, and `public/**` are inputs — `.blume/` and `dist/` are
generated and git-ignored.

## Rules that keep the sidebar predictable

1. **A folder is a sidebar group; a file is a page.** An `index.mdx` inside a folder
   becomes that group's first page and owns the group's URL, e.g. `/getting-started`.
2. **A group's title lives in two places.** The folder's `meta.ts` `title` and the
   folder's `index.mdx` frontmatter `title` must match, or Blume warns with
   `BLUME_NAV_INDEX_TITLE_MISMATCH`. Change both together.
3. **Ordering is explicit here, and it has exactly two homes.** `order` in a folder's
   `meta.ts` places that group among the top-level entries; `pages` in the same file
   orders the pages inside the group, using the file name without the `.mdx` extension.
   A page left out of `pages` still appears, after the listed ones.
4. **Numeric prefixes are unnecessary** while `meta.ts` owns the order. Without `pages`,
   ordering falls back to each page's frontmatter `sidebar.order`, then `index` first,
   numeric prefixes, then alphabetical. Prefixes are stripped from URLs.
5. **Icons come from Lucide.** Use the kebab-case name, for example `rocket`,
   `book-open`, `database`. A name that does not exist renders no icon.
6. **Folders and files starting with `_` are never routed.** That is what `_snippets/`
   is for.
7. **Frontmatter keys are validated.** An unknown key fails the build, so typos are
   caught early. Valid keys are `title`, `description`, `sidebar`, `seo`, `search`,
   `draft`, `lastModified`, `type`, `date`, `authors`, and `slug`.
8. **YAML is picky about colons.** Quote a `title` or `description` that contains `: `,
   or the build stops with a YAML parse error.

## Adding a page

1. Pick the section folder, or create one for a new section.
2. Add `your-page.mdx` with `title` and `description` frontmatter.
3. List it in that folder's `meta.ts` `pages` array where you want it to appear.
4. For a new section, create the folder with an `index.mdx` and a `meta.ts` that set a
   matching `title`, then give it an `order` that puts it where you want it.

Writing a page:

```mdx
---
title: Your page
description: One sentence that explains what the reader gets from this page.
---

Prose first. Then use built-in components — they need no imports:

<Steps>
  <Step title="Do the first thing">Explain it.</Step>
  <Step title="Do the second thing">Explain it.</Step>
</Steps>

<CardGroup cols={2}>
  <Card title="Related page" href="/guides/add-an-api-route" icon="server">
    Why the reader should go there next.
  </Card>
</CardGroup>
```

Callouts use directives: `:::note`, `:::tip`, `:::warning` (or `:::danger`), closed by
`:::`.

## Reusing content

Put shared text in `docs/_snippets/` and splice it in with a block-level statement:

```mdx
<include>/_snippets/environment-setup.mdx</include>
```

The path resolves from the content root, frontmatter in the partial is ignored, and
editing the partial reloads every page that includes it. See
`docs/getting-started/installation.mdx` for a working example.

## Conventions used in this scaffold

- Every unfinished page section starts with a `TODO:` line describing what belongs
  there. Search for `TODO:` to find the remaining writing work.
- Pages open with a one-line plain-language summary, then a `TODO:` for the real
  introduction.
- Cross-links are absolute content paths (`/reference/commands`), so they survive
  renames and are validated by `blume validate`.
- Commands are shown as they are run from the repository root.

## Deploying

`pnpm --filter @mern/docs build` emits static HTML to `apps/docs/dist`, ready for any
static host. Set `deployment.site` in `blume.config.ts` once a public URL exists so
feeds, sitemap, and canonical links are absolute.