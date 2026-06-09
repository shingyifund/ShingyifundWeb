export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAuthorizedAdminEmail(email?: string | null) {
  if (!email) return false;

  const allowedEmails = getAllowedAdminEmails();
  if (allowedEmails.length === 0) return false;

  return allowedEmails.includes(email.toLowerCase());
}

export function sanitizeAdminRedirectPath(value?: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/admin";
  }

  return value;
}
