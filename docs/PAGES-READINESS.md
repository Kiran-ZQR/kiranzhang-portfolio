# GitHub Pages preparation — 2026-10-15

This portfolio is static HTML/CSS/JavaScript with local assets and no required backend. Internal links are relative, supporting a GitHub project subpath. Use the supplied `.github/workflows/pages.yml` and select GitHub Actions as the Pages source after repository creation.

Run `node scripts/audit-pages.cjs` before publication. The current audit finds approximately 703 MB of runtime files including CV and local PDF.js, below the documented 1 GB Pages limit. The unfiltered asset collection is approximately 1.10 GB: do not deploy the workspace wholesale. `node scripts/build-pages.cjs` stages the audited runtime into a new `dist` directory; it stops on missing assets rather than publishing broken pages.

Confirmed requirements:
- Original CV is `assets/cv.pdf`, copied unchanged and SHA-256 verified, rendered by local PDF.js on desktop and mobile.
- Public repository: `Kiran-ZQR/kiranzhang-portfolio`, explicitly approved by the user.
- Standard GitHub CLI device authorization is pending for repository creation and Pages configuration. The system proxy must be used for CLI networking in this environment. Never put credentials in the repository.

No repository has been created and no deployment has been performed in this task yet. Final public URL validation must follow a successful deployment.

The opening uses the supplied billboard reference's right panel through an SVG viewport and color filter. No generated alternative motif is used. The logo and original copy are outside the displayed viewport, replaced by HTML copy and a direct-entry button. No automatic timeout or fade is applied. Source references remain subject to their original rights and are not covered by the template's code license.

References: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits and https://github.com/actions/starter-workflows/blob/main/pages/static.yml
