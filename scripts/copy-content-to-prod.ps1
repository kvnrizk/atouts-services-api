<#
Copies the site content from the LOCAL database (Docker container atouts-postgres) to the production database:
blog articles, city pages, client reviews and replaced site photos. Nothing else (no quotes, no analytics, no users).

Usage (from atousservice_backend/, after the backend has started once on Render so the tables exist):
  .\scripts\copy-content-to-prod.ps1 -ProdUrl "postgresql://user:password@host.frankfurt-postgres.render.com/db"
Use the EXTERNAL database URL shown in Render. Rows that already exist in production are left untouched,
so the script can be run again safely.
#>
param(
  [Parameter(Mandatory = $true)][string]$ProdUrl,
  [string]$Container = "atouts-postgres",
  [string]$LocalDb = "atoutsservice"
)
$ErrorActionPreference = "Stop"
$tables = "blog_posts", "city_pages", "testimonials", "site_image_overrides"

# Uploaded photos (/uploads/...) only exist on this computer: they must be re-uploaded from the admin first
$local = docker exec $Container psql -U postgres -d $LocalDb -tAc "select count(*) from site_image_overrides where url like '/uploads/%'"
if ([int]$local -gt 0) { Write-Warning "$local replaced photo(s) point to this computer (/uploads/...). Replace them again from the production admin." }

# Dump and import both run inside the container (keeps French accents intact, nothing to install on Windows)
$tableArgs = ($tables | ForEach-Object { "-t $_" }) -join " "
docker exec -e PROD_URL="$ProdUrl" $Container sh -c "set -o pipefail; pg_dump -U postgres -d $LocalDb --data-only --inserts --on-conflict-do-nothing $tableArgs | psql `"`$PROD_URL`" -v ON_ERROR_STOP=1 --quiet --single-transaction -o /dev/null"
if ($LASTEXITCODE -ne 0) { throw "Copy failed - production was not changed" }
foreach ($t in $tables) {
  $n = docker exec $Container psql "$ProdUrl" -tAc "select count(*) from $t"
  Write-Host ("{0,-22} {1} row(s) in production" -f $t, $n.Trim())
}
