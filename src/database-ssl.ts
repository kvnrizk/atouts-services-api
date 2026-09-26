/**
 * SSL options for a DATABASE_URL connection, driven by DATABASE_SSL:
 * - "disable"   no SSL (e.g. a database on the same private network that does not offer SSL)
 * - "no-verify" encrypted, certificate not checked (managed hosts with their own CA, e.g. Render)
 * - "verify"    encrypted, certificate checked (default)
 */
export function databaseSsl(mode = process.env.DATABASE_SSL) {
  if (mode === 'disable') return false;
  return { rejectUnauthorized: mode !== 'no-verify' };
}
