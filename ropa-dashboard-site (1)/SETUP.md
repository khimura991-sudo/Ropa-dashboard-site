# ROPA Dashboard — setup guide

A plain HTML/CSS/JavaScript website. Visitors sign in with their company Microsoft account, and the page reads **ROPA MONITORING.xlsx** live from OneDrive through Microsoft Graph. There is no server and no database: the Excel file is the database.

## Files

| File | What it is |
|---|---|
| `index.html` | The page |
| `styles.css` | Look and layout (light and dark mode) |
| `app.js` | Sign-in, reading the workbook, calculations, charts |
| `config.js` | **The only file you edit**: app IDs, file location, targets |
| `demo-data.json` | Sample data for preview mode (borrower names replaced) |

## Preview first (no setup needed)

Host the folder anywhere (step 2), then open the address with `?demo` on the end, for example `https://your-site/index.html?demo`. You'll see the full dashboard with sample data and no sign-in.

---

## Step 1 — Register the app (IT / Microsoft 365 admin, about 10 minutes)

1. Go to **https://entra.microsoft.com** → **Identity → Applications → App registrations → New registration**.
2. **Name:** `ROPA Dashboard`. **Supported account types:** *Accounts in this organizational directory only*.
3. **Redirect URI:** choose platform **Single-page application (SPA)**, and enter the exact address where `index.html` will be hosted (from step 2), e.g. `https://gdfi.github.io/ropa-dashboard/index.html`. Add the address without `index.html` as well, e.g. `https://gdfi.github.io/ropa-dashboard/`.
4. Click **Register**. From the **Overview** page copy:
   - **Application (client) ID** → `clientId` in `config.js`
   - **Directory (tenant) ID** → `tenantId` in `config.js`
5. **API permissions → Add a permission → Microsoft Graph → Delegated permissions:** add `User.Read` and `Files.Read.All`. Then click **Grant admin consent for [your organization]**.
   - *Delegated* means the page only ever sees what the signed-in person can already open. It cannot read anyone else's files.
6. No client secret is needed. Leave **Certificates & secrets** empty.

## Step 2 — Host the files (pick one)

Any static hosting works. The site needs HTTPS.

- **GitHub Pages** (free): create a repository, upload the 5 files, then **Settings → Pages → Deploy from branch**. The address looks like `https://<account>.github.io/<repo>/`.
- **Azure Static Web Apps** (free tier): good if your company already uses Azure; you can also restrict it to your company domain.
- **Netlify or Cloudflare Pages** (free): drag and drop the folder.

**Delete `demo-data.json` before publishing anywhere public.** It holds real September–October figures (borrower names removed) so you can preview the layout; without it, `?demo` just shows an error and live mode is unaffected.

The code is public on GitHub Pages, but **the live data is not**. Nothing loads until someone signs in with an account that can open the Excel file.

Put the final address in the app registration's Redirect URI (step 1.3). It must match exactly.

## Step 3 — Give your team access

- Share **ROPA MONITORING.xlsx** from OneDrive with each person (view access is enough), or with a team group.
- Send them the website address. They click **Sign in with Microsoft** once; after that it remembers them.
- Anyone without access to the Excel file sees "You may not have access to ROPA MONITORING.xlsx".

## How it stays up to date

- Every time the page opens, and when someone clicks **Refresh**, it reads the workbook.
- While the page stays open, it re-reads every **5 minutes** automatically (`autoRefreshMinutes` in `config.js`; 0 turns it off). It also refreshes when you come back to the tab.
- Edits in desktop Excel appear once **AutoSave** has saved them to OneDrive, usually within a minute. Edits in Excel Online appear almost immediately.

## What the page reads from the workbook

Set in `config.js` → `sheets`:

| Data | Where |
|---|---|
| Every sold unit (drives the month filter, cards, tables, donuts) | Whole **WEB DATA** sheet; first row = column names |
| Monthly 2025 vs 2026 charts, and last month / last year for months not in WEB DATA | **ROPA OVERVIEW** `T4:AD15` |
| Inventory breakdown and inventory card | **DAILY TOTAL INVTY** `B3:F14` (month names in row 3) |
| Month the page opens on | **DASHBOARD** `J2` |

Keep those sheet names and ranges as they are. If you move a table, update the range in `config.js`. Unlike the Claude connector, Microsoft Graph has **no row limit**, so WEB DATA can keep growing.

## If something goes wrong

| Message | Fix |
|---|---|
| `AADSTS50011` redirect URI mismatch | The address in the browser doesn't exactly match the Redirect URI in step 1.3. Add it there. |
| `AADSTS65001` / "needs admin approval" | Admin consent wasn't granted in step 1.5. |
| `403` / `404` … may not have access | Share the Excel file with that person, or the file was moved or re-uploaded. If it was re-uploaded, update `driveId` and `itemId` in `config.js`. |
| Sign-in library did not load | The network blocks `cdn.jsdelivr.net`. Download `d3.min.js` and `msal-browser.min.js`, put them next to `index.html`, and change the two `<script src>` lines. |
