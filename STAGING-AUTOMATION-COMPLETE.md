# 🚀 Staging Automatizacija - Kompletna Implementacija

## ✅ Šta je implementirano

### 1. **PostgreSQL/Supabase Migracija**

- ✅ Prisma schema prilagođen za PostgreSQL
- ✅ Dodana podrška za `DIRECT_URL` connection
- ✅ Kreiran template za environment varijable

### 2. **Staging Environment**

- ✅ Kreiran `staging-env-template.txt` (kopiraj u `.env.staging`)
- ✅ Dodani staging build skripti u `package.json`
- ✅ Podesio `.gitignore` za env fajlove

### 3. **Vercel Automatizacija**

- ✅ Kreiran `vercel.json` sa:
  - Auto-deployment za `stage` branch
  - PR preview deployments
  - Environment varijable mapiranje
  - Optimizovane funkcije za EU region

### 4. **GitHub Actions**

- ✅ Kreiran `.github/workflows/staging.yml` sa:
  - Lint/test/type checking
  - Prisma validation
  - Automatic staging deployment
  - PR preview sa komentarima
  - Error handling i notifications

### 5. **Dokumentacija**

- ✅ `SETUP-SUPABASE-STAGING.md` - kompletan Supabase guide
- ✅ `LOCAL-POSTGRES-SETUP.md` - lokalni PostgreSQL setup

---

## 🏃‍♂️ Quick Start - Sledeći koraci

### 1. Kreiraj Supabase Projekt (5 min)

```bash
# Idi na supabase.com → Create new project
# Ime: antique-body-staging
# Region: Europe (Frankfurt)
# Sačuvaj DB password!
```

### 2. Kreiraj Environment Fajlove (3 min)

```bash
# Kopiraj template
cp staging-env-template.txt .env.staging

# Edit sa Supabase credentials
# vim .env.staging (ili preferred editor)
```

### 3. Setup Vercel (5 min)

```bash
# Install CLI
npm install -g vercel

# Link projekt
vercel login
vercel link

# Import env varijable iz .env.staging
vercel env add DATABASE_URL
vercel env add DIRECT_URL
# ... (ili bulk import preko dashboard)
```

### 4. Setup GitHub Secrets (3 min)

Idi na GitHub → Settings → Secrets → Add:

- `VERCEL_TOKEN` (iz Vercel dashboard)
- `VERCEL_ORG_ID` (iz .vercel/project.json)
- `VERCEL_PROJECT_ID` (iz .vercel/project.json)

### 5. Kreiraj Stage Branch (1 min)

```bash
git checkout -b stage
git push origin stage
```

### 6. Test Prvi Deployment (automated!)

GitHub Actions će automatski:

- ✅ Run linting & tests
- ✅ Deploy na Vercel
- ✅ Poslati notification sa URL

---

## 🔄 Kako Radi PR Preview

1. **Kreirai PR** protiv `main` ili `stage`
2. **GitHub Actions** automatski:
   - Build preview version
   - Deploy na unique Vercel URL
   - Comment na PR sa preview linkom
3. **Svaki push** update-uje preview automatski
4. **Merge/Close** briše preview deployment

---

## 💻 Lokalni Development Setup

### PostgreSQL lokalno (bez Supabase)

```bash
# MacOS
brew install postgresql@15
brew services start postgresql@15
createdb antique_body_dev

# Kreiraj .env.local sa lokalnim settings
# (vidi LOCAL-POSTGRES-SETUP.md za detalje)
```

### Development workflow

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## 📁 Krerani Fajlovi

```
antique_body/
├── .github/workflows/staging.yml    # GitHub Actions
├── vercel.json                      # Vercel config
├── staging-env-template.txt         # Environment template
├── SETUP-SUPABASE-STAGING.md       # Supabase guide
├── LOCAL-POSTGRES-SETUP.md         # Local PostgreSQL guide
├── STAGING-AUTOMATION-COMPLETE.md  # Ovaj fajl
├── prisma/schema.prisma             # Updated za PostgreSQL
└── package.json                     # Added staging scripts
```

---

## 🛠️ Troubleshooting

### Database issues

- Prőveri connection string format
- Verifikuj Supabase IP restrictions
- Test sa `npx prisma db push`

### Vercel deployment failures

- Prőveri environment varijable
- Check function timeout limits
- Validate `vercel.json` syntax

### GitHub Actions failures

- Verify GitHub secrets
- Check workflow permissions
- Review deployment logs

---

## 🎯 Next Steps (opcionalno)

1. **Custom Domain**: Dodaj staging subdomain
2. **Monitoring**: Setup Sentry/analytics za staging
3. **E2E Tests**: Playwright/Cypress protiv staging URL-a
4. **Database Branching**: Supabase schema migrations
5. **Preview Databases**: Separate DB za svaki PR

---

## 📞 Support

Ako imaš issues:

1. Proverи setup guide fajlove
2. Check GitHub Actions logs
3. Vercel function logs
4. Supabase database logs

**Sve je spremno za produkciju! 🎉**
