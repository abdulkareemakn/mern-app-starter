---
title: Documentation
description: The editorial standard and maintenance workflow for this site.
---

# Documentation

This site documents the shipped starter for learners, contributors, and operators. The application repository is the source of truth for behavior; current official documentation supplies library syntax. The rules below are the approved editorial standard for every rewrite and update.

## Editorial standard

### 1. Voice and purpose

1. Write authoritative starter-kit documentation, not a blog post, tutorial diary, or marketing page.
2. Begin most concept and implementation pages with “This starter kit...” and immediately state what the starter ships.
3. Explain the subject in plain language before naming files, APIs, types, or commands.
4. Assume the reader has not heard of the tool. Define what it does, why the application needs it, and why this starter chose it.
5. Use the Better Auth page as the structural reference: purpose and rationale first, implementation second, references last.
6. Prefer short, direct sentences and concrete nouns. Avoid vague claims, hype, filler, and unsupported superlatives.
7. Never use an em dash. Use a period, comma, colon, semicolon, or parentheses instead.
8. Address the reader only when giving an action. Describe system behavior directly.
9. Keep the prose human and approachable, but make paths, commands, contracts, defaults, and boundaries precise enough for agents.
10. Describe the shipped starter in the present tense. Clearly label optional additions and hypothetical examples.

### 2. Progressive disclosure

11. Order each substantive page as: simple explanation, reason for the choice, important constraints, practical steps, implementation details, verification or troubleshooting, references.
12. Put the information most readers need first. Keep uncommon customization and internals lower on the page.
13. Explain every boundary that prevents a common mistake, especially browser versus server code, authentication versus application data, request validation versus database constraints, and development email versus production delivery.
14. Show the smallest complete example that teaches the real repository pattern. Do not introduce speculative layers or abstractions.
15. State prerequisites before a command that depends on them.
16. Give each task a visible success condition so a reader knows when it worked.

### 3. Information architecture and flow

17. Make the navigation a dependency-aware reading path, not a folder listing.
18. Order “Start here” as prerequisites, installation, development workflow, then project structure. Installation must not send a beginner forward for a required step without explaining that sequence.
19. Keep environment-variable documentation inside Development workflow. Installation may point to the exact setup section, but must make the handoff explicit.
20. Put Design and UI before feature implementation.
21. Within Design and UI, decide product direction, typography and fonts, icon strategy, colors, density, and shape before applying a design system or generating shadcn components.
22. Keep typography and fonts together. Do not restore a separate Fonts page.
23. Put Database and Authentication at the top of Build your app, followed by Validation, API routes, Client pages, Emails, Middleware, and the 404 page.
24. Keep middleware and small edge concerns lower in the navigation.
25. Merge topics that do not justify their own page. Create a page only when it has a distinct reader goal.
26. Use section landing pages as concise maps. Do not repeat the child pages.
27. End sequential guides with a clear next page. Use cross-links only when they preserve the reading flow.
28. Give one page ownership of each concept and link to it elsewhere instead of maintaining competing explanations.

### 4. Page hierarchy and formatting

29. Use exactly one `#` heading per page.
30. Use `##` for major reader goals and `###` for subordinate concepts, platform-specific details, troubleshooting cases, and implementation subsections.
31. Do not make every topic a peer heading. Heading depth must express the actual hierarchy.
32. Keep paragraphs focused and reasonably short. Break dense reference material into lists or tables when that makes scanning easier.
33. Use ordered lists for procedures, bullets for choices or facts, and tables for exact comparisons or mappings.
34. Give code fences a language. Give file excerpts a Zensical title with the real repository path.
35. State the working directory before commands when it is not obvious.
36. Make commands copyable. Do not hide required substitutions or prerequisites inside surrounding prose.

### 5. Zensical components

37. Use cards for section indexes and a small number of meaningful choices.
38. Use content tabs for operating systems or genuinely parallel alternatives. Put Windows first.
39. Use callouts for warnings, prerequisites, security boundaries, and easily missed consequences. Do not turn ordinary prose into decorative callouts.
40. Use collapsible details for optional troubleshooting or advanced information that would interrupt the main path.
41. Use code annotations only when a specific line needs explanation.
42. Use Mermaid only when a multi-step relationship is materially clearer as a diagram.
43. Do not use ASCII diagrams as decoration. A small text tree remains acceptable for project structure.
44. Use buttons only for a primary action on landing or setup pages where they improve navigation.
45. Preview components in light and dark modes and at narrow widths. Components must remain readable and accessible.
46. Stay within documented Zensical syntax. The current configuration already supports cards, tabs, admonitions, details, annotations, footnotes, tooltips, and Mermaid.

### 6. Platform guidance

47. Treat Windows as the primary beginner path. Put its tab first and provide exact PowerShell commands, installer choices, service names, prompts, and verification steps.
48. Do not assume Windows has `openssl`, Bash, Homebrew, or GNU utilities.
49. Prefer an already-required cross-platform tool, such as Node.js, when one command can safely serve every platform.
50. Keep macOS and Linux instructions complete. Separate them when their package managers or service behavior differ.
51. Do not publish distro commands that may install an unsupported Node.js version. Prefer current official installation guidance when repositories vary.
52. Show expected output or a verification command after installation steps that commonly fail.

### 7. Repository and technical accuracy

53. Treat `~/code/mern` as the source of truth for shipped behavior.
54. Verify every path, script, environment variable, port, endpoint, package, generated file, test command, and deployment claim against the current repository.
55. Inspect the relevant implementation and its callers before documenting a pattern.
56. Distinguish existing code from code the reader is being asked to create.
57. Keep examples consistent across pages so one example feature can flow from schema to model, API, and client without contradictory names or shapes.
58. Do not imply that an optional dependency is installed. Include the install step at the point it first becomes necessary.
59. Prefer package manifests and configuration files as version sources. Mention exact versions only when they materially affect instructions.
60. Keep the Tech stack page concise and durable. It should describe the stack and point to canonical manifests instead of duplicating every transitive or resolved version.
61. Preserve validation, security, accessibility, and data-loss protections even when simplifying examples.
62. Use current official documentation for framework-specific syntax and behavior. Consult Context7 first where available.
63. Prefer primary sources over third-party summaries.
64. Run Zensical strict build and check the final diff for broken links, invalid component syntax, accidental em dashes, stale paths, and formatting problems.

### 8. Required explanations for key pages

65. Better Auth must explain authentication, sessions, what data Better Auth owns, why it was selected, and why application data stays in separate Mongoose models.
66. Database must explain MongoDB’s role, why Mongoose is used, and why database constraints do not replace HTTP validation.
67. Validation must explain why all client input is untrusted, what runtime validation adds beyond TypeScript, and why Zod was chosen.
68. Emails must explain at the top why React Email, MailDev, Nodemailer, and Resend have separate jobs, then show how the single application-facing send function connects them.
69. Design and UI must recommend choosing serif, sans serif, and monospace roles where appropriate, while noting that many interfaces need only sans serif and monospace.
70. Font guidance must prefer self-hosting for predictable speed, privacy, and reliability. It may note that common families such as Inter can already be cached, but must not promise cross-site cache reuse.
71. Icon guidance must name sensible interface libraries, explain why one consistent family is preferred, identify Simple Icons for brands and social marks, and explain that named `react-icons` imports include only the SVG icons used.
72. shadcn/ui must explain that the CLI copies editable source into the repository and that Base UI supplies the underlying accessible primitives.
73. API routes must explain the request and response contract before middleware and handler details.
74. Client pages must explain file-based routing and generated route types before route APIs.
75. Testing must explain the purpose and cost of unit, integration, and end-to-end tests before listing commands.
76. Deployment must start with the supported choices and their tradeoffs, then lead into provider-specific instructions.

### 9. References and maintenance

77. End every substantive page with a `## References` section.
78. Put the most specific official source first. Link to the exact guide or API page that supports the content, not merely the product homepage.
79. Keep related internal documentation separate from external sources when both lists would otherwise be ambiguous.
80. Add inline links on first mention when they help orientation, but keep the full source list at the bottom.
81. Do not add references merely to satisfy the rule. Every reference must support, extend, or verify the page.
82. Review references whenever library behavior, commands, or deployment instructions change.
83. Keep the root `rules.md` file as the canonical home for these editorial rules.
84. After the rewrite, report illustration opportunities separately. Do not create illustrations unless they materially improve understanding and are approved.

## Maintain the site

Edit the relevant Markdown page, confirm examples against the application source, then build from the documentation repository root:

```sh
zensical build --clean --strict
```

Review the generated page at desktop and narrow widths in light and dark modes. Check internal links, navigation, headings, references, and the final Git diff before publishing. A changed command or environment variable should be updated at its canonical page and linked from other guides.

## References

- [Zensical authoring](https://zensical.org/docs/authoring/)
- [Zensical validation](https://zensical.org/docs/setup/validation/)
- [Application repository](https://github.com/abdulkareemakn/mern-app-starter)
