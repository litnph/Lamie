# Lamie storefront

The customer storefront is a React/Vite application. Product data is a generated, same-origin static export; the browser does not call `API_Lamie` for the catalog.

## Local development

Requirements: Node.js 22 or a current supported Node.js release.

```bash
npm install
npm run dev
```

Vite serves the exporter-owned files from `public/fe-data` at `/fe-data`. Run the Admin FE Data export before building or serving a catalogue; when no export exists, the storefront renders its explicit unavailable state.

## FE Data contract

The generated directory is:

```text
public/fe-data/
  manifest.json
  products.json
  images/
    products/
```

The storefront-owned broken-image artwork lives at `public/images/product-fallback.svg`, outside the exporter-owned directory, so an atomic FE Data publish cannot remove it.

`manifest.json` identifies the catalog file and its SHA-256 version. Product and image paths must be relative, use `/`, and remain inside `fe-data`. The frontend validates the catalog checksum, schema version `1.0`, timestamps, counts, required product fields, and safe paths before rendering anything.

The API exporter owns this directory. It should stage and validate a complete export before atomically replacing the generated files. A normal static deployment must run the export before the FE build or otherwise provide the generated directory as a build artifact.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

After `npm run build`, Vite copies the export to `dist/fe-data`. A production smoke test should serve `dist`, load the home, shop, and product-detail views, and verify every catalog request stays on the storefront origin while `API_Lamie` is stopped.

No AI or backend API key belongs in this project. AI provider configuration is server-only in `API_Lamie`.

The end-to-end migration/export/deployment procedure is in the sibling runbook `API_Lamie/docs/INGREDIENTS_FE_DATA_CONTENT_RUNBOOK.md`.
