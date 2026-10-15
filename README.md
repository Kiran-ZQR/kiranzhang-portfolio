# Kiran Zhang — Portfolio

Static personal portfolio with business and academic case studies, multimedia projects, AIGC galleries, an interactive Conway-life weaving installation, and an embedded original CV PDF.

## Local preview
Serve this directory with a static HTTP server and open index.html. No backend, API key, or npm install is needed. PDF rendering uses the bundled PDF.js library.

## Verify and build

```sh
node scripts/validate.mjs
node scripts/test-weave-state.cjs
node scripts/audit-pages.cjs
node scripts/build-pages.cjs
```

GitHub Pages publishes the `main` branch at `/` using `.nojekyll`. The repository already contains the audited static runtime and needs no server-side build. An optional workflow is retained in `docs/pages-workflow.example.yml`; it is not active. Links support project-site subpaths.

## Assets and attribution
Original portfolio content belongs to its respective creators. Supplied visual references retain their original rights; this independent portfolio is not associated with the brands in those references. The MIT file applies to the original template code, not third-party reference art or the personal CV. Vendor licenses are retained in assets/vendor. See docs/PAGES-READINESS.md for the publication audit.
