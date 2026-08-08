const wholesaleInfrastructureVariables = [
  "DATABASE_URL",
  "WORKOS_API_KEY",
  "WORKOS_CLIENT_ID",
  "WORKOS_COOKIE_PASSWORD",
] as const;

export const wholesaleRedirectUri =
  process.env.WORKOS_REDIRECT_URI ??
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ??
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000/callback"
    : undefined);

export const isWholesaleInfrastructureConfigured =
  wholesaleInfrastructureVariables.every((name) => Boolean(process.env[name]));

export const isWholesaleAuthConfigured = Boolean(
  isWholesaleInfrastructureConfigured && wholesaleRedirectUri,
);
