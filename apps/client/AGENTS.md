<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `pnpm dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

## Testing policy

- Run the cheapest relevant tests while iterating and affected tests before finishing.
- Prefer unit or API integration tests when a browser adds no confidence.
- Use Playwright for complete user workflows, not repeated screenshots or element-by-element checks.
- Add or update tests when behavior changes; run broader suites for significant changes.

## Design system

- Read the repository-root `DESIGN.md`, when present, before interface work. Its tokens and intent are canonical; shadcn configuration and `src/styles.css` implement them.
- For establishing or changing the system, load `../../.agents/skills/design-md/SKILL.md` from this directory. With no DESIGN.md, do not treat starter defaults as a chosen product identity.
- Use the official shadcn skill and root `pnpm ui` wrapper for components/presets/migrations. Preserve Base UI. Reconcile generated changes with DESIGN.md; update intent and implementation together for intentional changes.
- Interface icons use the configured shadcn library. Brand/social icons may use named `react-icons/si` exports or official brand assets. Do not mix general icon packs.
- After design-system changes, run root `pnpm design:lint`, review contrast warnings, and check CSS/config against the document. Lint does not automatically detect implementation drift or prove rendered accessibility.
