# Supabase & Staging Setup Guide

## 🚀 Korak 1: Kreiranje Supabase projekta

### 1.1 Registracija na Supabase

1. Idi na [supabase.com](https://supabase.com)
2. Klikni "Start your project"
3. Registruj se sa GitHub/Google accountom
4. Verifikuj email adresu

### 1.2 Kreiranje novog projekta

1. Klikni "New project"
2. Izaberi organizaciju (ili kreiraj novu)
3. Uneси:
   - **Project name**: `antique-body-staging`
   - **Database Password**: Generiraj strong password (sačuvaj ga!)
   - **Region**: Europe (Frankfurt) - `eu-central-1`
4. Klikni "Create new project"
5. Čekaj ~2 minuta da se projekt kreira

### 1.3 Dobijanje Supabase credentials

Nakon kreiranja projekta:

1. **API URL & Keys**:
   - Idi na `Settings` → `API`
   - Kopiraj:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role secret key` → `SUPABASE_SERVICE_ROLE_KEY`

2. **Database Connection**:
   - Idi na `Settings` → `Database`
   - Kopiraj connection strings:
     - `Connection pooling` → `DATABASE_URL`
     - `Direct connection` → `DIRECT_URL`

## 🔧 Korak 2: Kreiranje staging environment fajla

1. Kopiraj sadržaj iz `staging-env-template.txt`
2. Kreiraj novi fajl `.env.staging`
3. Zamijeni sve placeholder vrednosti:

```bash
# Kopiraj iz Supabase Dashboard
DATABASE_URL="postgresql://postgres.YOUR_PROJECT_REF:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.YOUR_PROJECT_REF:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Generiraj random secret
NEXTAUTH_SECRET="your-super-secret-32-character-string"
AUTH_SECRET="your-super-secret-32-character-string"

# Update sa staging domenom kada ga dobiješ
NEXTAUTH_URL="https://antique-body-staging.vercel.app"
```

## 🌐 Korak 3: Vercel setup

### 3.1 Instalacija Vercel CLI

```bash
npm install -g vercel
```

### 3.2 Linking projekta sa Vercel

```bash
# U root direktoriju projekta
vercel login
vercel link
```

### 3.3 Dodavanje environment varijabli u Vercel

```bash
# Iz .env.staging fajla dodaj svaku varijablu:
vercel env add DATABASE_URL
vercel env add DIRECT_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXTAUTH_SECRET
vercel env add AUTH_SECRET
# ... i sve ostale varijable
```

Ili koristi Vercel Dashboard:

1. Idi na [vercel.com/dashboard](https://vercel.com/dashboard)
2. Klikni na svoj projekt
3. Idi na `Settings` → `Environment Variables`
4. Dodaj sve varijable iz `.env.staging`

### 3.4 Kreiranje GitHub Secrets

U GitHub repository:

1. Idi na `Settings` → `Secrets and variables` → `Actions`
2. Dodaj:
   - `VERCEL_TOKEN`: Generiraj u Vercel Dashboard → Account Settings → Tokens
   - `VERCEL_ORG_ID`: Pronađi u .vercel/project.json nakon vercel link
   - `VERCEL_PROJECT_ID`: Pronađi u .vercel/project.json nakon vercel link

## 🗄️ Korak 4: Database migracija

### 4.1 Prva migracija na Supabase

```bash
# U lokalnom projektu
npx prisma migrate deploy
```

### 4.2 Seed početnih podataka (opcionalno)

```bash
npx prisma db seed
```

## 🚀 Korak 5: Deployment

### 5.1 Push na staging branch

```bash
git checkout -b stage
git push origin stage
```

### 5.2 GitHub Actions će automatski:

- Pokrenuti linting i testove
- Deployovati na Vercel
- Poslati notification sa URL-om

### 5.3 Za PR previews:

1. Kreiraj PR protiv `stage` ili `main` brancha
2. GitHub Actions će automatski kreirati preview
3. URL će biti komentiran u PR-u

## 🛠️ Korak 6: Verifikacija

### 6.1 Testiranje staging deployments

1. Otvori staging URL
2. Testiraj registraciju/login
3. Provjeri database konekciju
4. Testiraj upload fajlova

### 6.2 Monitoring

- Supabase Dashboard → Database → Tables
- Vercel Dashboard → Functions → Logs
- GitHub Actions → History

## 🔧 Troubleshooting

### Database connection issues:

1. Prőveri da li je IP whitelisted u Supabase (ili disabilitaj IP restriction)
2. Prőveri connection string format
3. Prőveri da li je password escapovan u URL-u

### Build failures:

1. Prőveri environment varijable u Vercel
2. Prőveri da li je `prisma generate` uspešan
3. Prőveri dependency versions

### OAuth issues:

1. Dodaj staging URL u Google/Facebook OAuth app settings
2. Prőveri NEXTAUTH_URL environment varijablu

---

📚 **Korisni linkovi:**

- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
