# Lokalni PostgreSQL Setup Guide

## 🐘 Korak 1: Instalacija PostgreSQL-a

### MacOS (preporučeno sa Homebrew)

```bash
# Instalacija PostgreSQL-a
brew install postgresql@15

# Start PostgreSQL servis
brew services start postgresql@15

# Kreiraj superuser (ako ne postoji)
createuser -s $(whoami)
```

### MacOS (alternativno sa Postgres.app)

1. Download [Postgres.app](https://postgresapp.com/)
2. Drag u Applications folder
3. Pokreni aplikaciju
4. Klikni "Initialize" da kreiraš prvi cluster

### Ubuntu/Debian

```bash
# Update package list
sudo apt update

# Instalacija PostgreSQL-a
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL servis
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Kreiraj user
sudo -u postgres createuser --superuser $(whoami)
```

### Windows

1. Download sa [postgresql.org](https://www.postgresql.org/download/windows/)
2. Pokreni installer
3. Prati setup wizard
4. Zapamti password za postgres user

## 🗄️ Korak 2: Kreiranje baze podataka

```bash
# Kreiraj development bazu
createdb antique_body_dev

# Kreiraj test bazu (opcionalno)
createdb antique_body_test

# Verifikuj da je baza kreirana
psql -l | grep antique_body
```

## 🔧 Korak 3: Kreiranje .env.local fajla

Kreiraj `.env.local` fajl u root direktoriju:

```bash
# Lokalna PostgreSQL baza
DATABASE_URL="postgresql://$(whoami)@localhost:5432/antique_body_dev"
DIRECT_URL="postgresql://$(whoami)@localhost:5432/antique_body_dev"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-local-secret-key-32-characters"
AUTH_SECRET="your-local-secret-key-32-characters"

# OAuth Providers (isti kao u staging ili kreiraj test app)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_FACEBOOK_ID="your-facebook-app-id"
AUTH_FACEBOOK_SECRET="your-facebook-app-secret"

# Email Service (test configuration)
EMAIL_HOST="smtp.ethereal.email"
EMAIL_PORT="587"
EMAIL_USER="your-ethereal-email@ethereal.email"
EMAIL_PASS="your-ethereal-password"
EMAIL_FROM="test@localhost"

# SMS Service (test Twilio account)
TWILIO_ACCOUNT_SID="your-test-twilio-sid"
TWILIO_AUTH_TOKEN="your-test-twilio-token"
TWILIO_PHONE_NUMBER="your-test-twilio-number"

# Google Cloud Storage (dev bucket)
GOOGLE_CLOUD_PROJECT_ID="your-dev-gcp-project"
GOOGLE_CLOUD_BUCKET_NAME="your-dev-bucket"
GOOGLE_CLOUD_KEY_FILE="./google-storage-dev.json"

# Google Places API
GOOGLE_PLACES_API_KEY="your-google-places-api-key"

# App Configuration
NODE_ENV="development"
NEXT_PUBLIC_APP_ENV="development"
```

## 🏃‍♂️ Korak 4: Pokretanje migracija

```bash
# Generiraj Prisma client
npx prisma generate

# Pokreni sve migracije
npx prisma migrate dev

# Seed početnih podataka
npx prisma db seed

# Otvori Prisma Studio (opcionalno)
npx prisma studio
```

## 🛠️ Korak 5: Korisne komande za development

### Database management

```bash
# Reset baze podataka
npx prisma migrate reset

# Kreiranje nove migracije
npx prisma migrate dev --name "your_migration_name"

# Check migration status
npx prisma migrate status

# Prisma Studio na custom portu
npx prisma studio --port 5557
```

### Development workflow

```bash
# Start dev server
npm run dev

# Run sa specific env fajlom
NODE_ENV=development npm run dev

# Build test
npm run build

# Lint check
npm run lint
```

## 🔍 Korak 6: Verifikacija setup-a

### 1. Testiraj database konekciju

```bash
psql antique_body_dev -c "SELECT version();"
```

### 2. Testiraj Prisma konekciju

```bash
npx prisma db push --accept-data-loss
```

### 3. Testiraj Next.js aplikaciju

```bash
npm run dev
```

Otvori http://localhost:3000 i testiraj:

- Registraciju novog korisnika
- Login funkcionalnost
- Database queries

## 🐛 Troubleshooting

### PostgreSQL neće da se pokrene

```bash
# MacOS - restart service
brew services restart postgresql@15

# Ubuntu - restart service
sudo systemctl restart postgresql

# Prőveri status
brew services list | grep postgres
# ili
sudo systemctl status postgresql
```

### Permission denied errors

```bash
# Kreiraj user sa pravim privilegijama
sudo -u postgres createuser --superuser $(whoami)

# Ili promijeni ownership
sudo chown -R $(whoami) /usr/local/var/postgres
```

### Port already in use (5432)

```bash
# Pronađi proces koji koristi port
lsof -i :5432

# Kill proces (replace PID)
kill -9 <PID>

# Ili mijenjaj port u postgresql.conf
```

### Prisma migration errors

```bash
# Reset sve migracije
npx prisma migrate reset --force

# Ili obriši i kreiraj novu bazu
dropdb antique_body_dev
createdb antique_body_dev
npx prisma migrate dev
```

## 🔄 Alternativni setup sa Docker

Ako preferiraš Docker:

```yaml
# docker-compose.yml
version: "3.8"
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: antique_body_dev
      POSTGRES_USER: developer
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

```bash
# Start Docker PostgreSQL
docker-compose up -d postgres

# Update .env.local
DATABASE_URL="postgresql://developer:password@localhost:5432/antique_body_dev"
```

---

📚 **Korisni linkovi:**

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [pgAdmin](https://www.pgadmin.org/) - GUI tool za PostgreSQL
