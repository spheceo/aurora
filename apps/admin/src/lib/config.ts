const requiredEnvironmentVariables = [
  "DATABASE_URL",
  "WORKOS_API_KEY",
  "WORKOS_CLIENT_ID",
  "WORKOS_COOKIE_PASSWORD",
  "WORKOS_STAFF_ORG_ID",
] as const;

export const adminRedirectUri =
  process.env.WORKOS_REDIRECT_URI ??
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001/callback"
    : undefined);

export const missingAdminEnvironmentVariables = [
  ...requiredEnvironmentVariables.filter((name) => !process.env[name]),
  ...(adminRedirectUri ? [] : ["WORKOS_REDIRECT_URI"]),
];

export const isAdminConfigured = missingAdminEnvironmentVariables.length === 0;

export const isAdminDevelopmentPreview =
  process.env.NODE_ENV === "development" && !isAdminConfigured;
