# Asset Huggers

Source of truth: Lovable project snapshot `42a14a095d0f1fccad3c3ebc72fda332110e3347` (2026-11-06 sync).

- Lovable editor: https://lovable.dev/projects/8ca3a290-bb83-4066-875f-420d72da0e14
- Lovable preview: https://id-preview--8ca3a290-bb83-4066-875f-420d72da0e14.lovable.app
- Hatchable edition: https://asset-huggers.hatchable.site

## Project boundaries

This application lives in `asset-huggers/` so the existing Edmond Clinton Inc. Hatchable app at the repository root remains untouched. Do not import or deploy the repository root as Asset Huggers.

## Sync workflow

GitHub is the shared version-control checkpoint for this project. Lovable and Hatchable are separate runtimes; edits do not automatically propagate between them unless their own GitHub integrations or deployment workflows are explicitly connected and verified.

When changing the app:
1. Make and verify the change in Lovable.
2. Export/sync the changed Lovable source files into this folder and commit them to GitHub.
3. Port the same behavior and content to the separate Hatchable implementation, then deploy Hatchable.
4. Record the source Lovable commit and Hatchable deployment version here.
5. Before the next change, compare all three versions to avoid overwriting newer work.

For an actual automatic workflow, connect the Lovable project to this GitHub repository/branch in Lovable's GitHub settings, and configure a separate Hatchable deploy workflow to consume the same repository folder. Confirm both integrations in their own dashboards; this repo folder alone does not create a live three-way sync.

## Local development

From this directory, install dependencies with Bun (`bun install`) and run the app with `bun run dev`.

## Archive

The canonical Lovable catalog contains 94 pieces and the canvas collection. Keep the titles, notes, category assignments, and original image URLs in `src/data/catalog.ts` exact.
