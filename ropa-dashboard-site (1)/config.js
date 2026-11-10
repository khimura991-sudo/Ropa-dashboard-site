// ROPA Dashboard settings. Your IT team fills in clientId and tenantId after registering the app (see SETUP.md).
window.ROPA_CONFIG = {
  // From Microsoft Entra admin center → App registrations → your app → Overview
  clientId: "PASTE-APPLICATION-CLIENT-ID-HERE",
  tenantId: "PASTE-DIRECTORY-TENANT-ID-HERE",

  // The workbook in OneDrive (ROPA MONITORING.xlsx in jafebre@gdfi.ph's OneDrive → Documents).
  // These IDs stay the same when the file is edited. They change only if the file is deleted and re-uploaded.
  driveId: "b!WEZ1vcUim0GsjSN7AeElxw9tlZJ-OB9Ho54GVDSu5h8RFXEu9dNNT5g5PcD5SvNL",
  itemId: "01EBRSSGJV3GL5334ALZEJCT2UGCJL4ONY",

  // Where each piece of data lives in the workbook
  sheets: {
    soldRows: "WEB DATA",                 // whole sheet; first row = column names
    overview: { sheet: "ROPA OVERVIEW", range: "T4:AD15" },       // 2025 + 2026 monthly tables
    inventory: { sheet: "DAILY TOTAL INVTY", range: "B3:F14" },  // month names in row 3, statuses in rows 5–14
    defaultMonth: { sheet: "DASHBOARD", cell: "J2" },            // month picked in the Excel dashboard
  },

  // Targets shown on the cards
  recoveryTarget: 0.83,
  inventoryTarget: 360,

  // How often the page re-reads the workbook while it is open (minutes). 0 turns it off.
  autoRefreshMinutes: 5,

  // true = show built-in sample data without signing in (for previewing the layout).
  // Opening the page with ?demo at the end of the address does the same.
  demo: false,
};
