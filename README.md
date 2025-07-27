# Antique Body

A Next.js application with authentication, MySQL database, and Prisma ORM.

## Setup Guide

### 1. MySQL Server Setup

1. Download and install MySQL Server from [MySQL Downloads](https://dev.mysql.com/downloads/mysql/)
2. Follow the installation instructions for your operating system
3. Make sure the MySQL service is running

### 2. Create Database

1. Open terminal/command prompt
2. Connect to MySQL with:
   ```bash
   mysql -u root -p
   ```
3. Enter your password when prompted
4. Create a new database:
   ```sql
   CREATE DATABASE antique_body;
   ```
5. Exit MySQL:
   ```sql
   EXIT;
   ```

### 3. Project Setup

1. Install project dependencies:
   ```bash
   npm install
   ```

### 4. Prisma Setup

1. Initialize Prisma:

   ```bash
   npx prisma init
   ```

2. Configure the database connection in the `.env` file:

   ```
   DATABASE_URL="mysql://root:password@localhost:3306/antique_body"
   ```

   Replace `password` with your MySQL password

3. Run Prisma migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Open Prisma Studio to manage your database:
   ```bash
   npx prisma studio
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Documentation

For detailed information about the project architecture, features, and development guidelines, refer to the [official project documentation](https://docs.google.com/document/d/1uhMHEOEpmGGR_CIzmqTFkvjIex92ZNdqMljhpRSzTG8/edit?tab=t.0).

## Pull Request Guidelines

### Naming Convention

All pull requests should follow this naming pattern:

```
WPR/[issue-number]-name_of_feature
```

Example:

```
WPR/1-user_authentication
```

CodeRabbitTracker
![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/Antique-Body/antique_body?utm_source=oss&utm_medium=github&utm_campaign=Antique-Body%2Fantique_body&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)

## Technologies

- [Next.js](https://nextjs.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [MySQL](https://www.mysql.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

#test-deploy
